<script setup lang="ts">
import { ref, computed } from 'vue';
import FidcListScreen from './FidcListScreen.vue';
import FidcDetailScreen from './FidcDetailScreen.vue';
import ClassDetailScreen from './ClassDetailScreen.vue';
import TitleDetailScreen from './TitleDetailScreen.vue';
import SacadoDetailScreen from './SacadoDetailScreen.vue';
import GrupoEmpresarialDetailScreen from './GrupoEmpresarialDetailScreen.vue';
import CreateClassModal from '../components/CreateClassModal.vue';
import CreateFidcModal from '../components/CreateFidcModal.vue';
import type { NewFidcData } from '../components/CreateFidcModal.vue';
import {
  fidcs as initialFidcs,
  defaultFidcSetup,
  type Fidc,
  type Cessao,
  type Sacado,
  type GrupoEmpresarialVinculo,
  type FidcSetup,
} from '../data/fidcsData';

type Route =
  | { level: 'list' }
  | { level: 'fidc'; fidcId: string }
  | { level: 'class'; fidcId: string; classId: string }
  | { level: 'title'; fidcId: string; classId: string; titleId: string }
  | { level: 'sacado'; fidcId: string; sacadoId: string }
  | { level: 'grupo'; fidcId: string; grupoId: string };

function buildFidcFromForm(data: NewFidcData): Fidc {
  const name = data.razaoSocial || data.nomeFantasia || 'NOVO FIDC';
  const category = data.tipoFundo === 'MONOCLASSE' ? 'MONOCLASSE' : 'MULTICLASSE';
  return {
    id: `fidc-${Date.now()}`,
    name,
    cnpj: data.cnpj || '—',
    category,
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    vencendoHoje: 0,
    vencendoMes: 0,
    confirmacaoPct: 0,
    pl: 0,
    plRef: 'R$ 0',
    plRefAgo: 'R$ 0',
    carteiraSummaryTitles: 0,
    classes: [],
    cessoes: [],
    sacados: [],
    grupos: [],
    setup: defaultFidcSetup(name, data.cnpj || '—'),
  };
}

const route = ref<Route>({ level: 'list' });
const creating = ref(false);
const creatingFidc = ref(false);
const fidcList = ref<Fidc[]>(initialFidcs);

function handleCreateFidc(data: NewFidcData) {
  fidcList.value = [...fidcList.value, buildFidcFromForm(data)];
  creatingFidc.value = false;
}

function updateCessoes(fidcId: string, cessoes: Cessao[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, cessoes } : f));
}

function updateSacados(fidcId: string, sacados: Sacado[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, sacados } : f));
}

function updateGrupos(fidcId: string, grupos: GrupoEmpresarialVinculo[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, grupos } : f));
}

function updateSetup(fidcId: string, setup: FidcSetup) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, setup } : f));
}

function handleSacadoUpdate(s: Sacado) {
  const r = route.value;
  if (r.level !== 'sacado') return;
  const current = fidcList.value.find((f) => f.id === r.fidcId);
  if (!current) return;
  updateSacados(
    r.fidcId,
    current.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

const currentFidc = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return fidcList.value.find((f) => f.id === r.fidcId);
});

const currentClass = computed(() => {
  const r = route.value;
  if (r.level !== 'class' && r.level !== 'title') return undefined;
  return currentFidc.value?.classes.find((c) => c.id === r.classId);
});

const currentTitle = computed(() => {
  const r = route.value;
  if (r.level !== 'title') return undefined;
  return currentClass.value?.titulos.find((t) => t.id === r.titleId);
});

const currentSacado = computed(() => {
  const r = route.value;
  if (r.level !== 'sacado') return undefined;
  return currentFidc.value?.sacados.find((s) => s.id === r.sacadoId);
});

const currentGrupo = computed(() => {
  const r = route.value;
  if (r.level !== 'grupo') return undefined;
  return currentFidc.value?.grupos.find((g) => g.id === r.grupoId);
});
</script>

<template>
  <template v-if="route.level === 'list'">
    <FidcListScreen :fidcs="fidcList" @open="(fidcId) => (route = { level: 'fidc', fidcId })" @new="creatingFidc = true" />
    <CreateFidcModal v-if="creatingFidc" @close="creatingFidc = false" @create="handleCreateFidc" />
  </template>

  <template v-else-if="route.level === 'fidc' && currentFidc">
    <FidcDetailScreen
      :fidc="currentFidc"
      @back="route = { level: 'list' }"
      @open-class="(classId) => (route = { level: 'class', fidcId: currentFidc!.id, classId })"
      @open-title="(classId, titleId) => (route = { level: 'title', fidcId: currentFidc!.id, classId, titleId })"
      @create-class="creating = true"
      @open-sacado="(sacadoId) => (route = { level: 'sacado', fidcId: currentFidc!.id, sacadoId })"
      @open-grupo="(grupoId) => (route = { level: 'grupo', fidcId: currentFidc!.id, grupoId })"
      @update-cessoes="(cessoes) => updateCessoes(currentFidc!.id, cessoes)"
      @update-sacados="(sacados) => updateSacados(currentFidc!.id, sacados)"
      @update-grupos="(grupos) => updateGrupos(currentFidc!.id, grupos)"
      @update-setup="(setup) => updateSetup(currentFidc!.id, setup)"
    />
    <CreateClassModal v-if="creating" @close="creating = false" />
  </template>

  <SacadoDetailScreen
    v-else-if="route.level === 'sacado' && currentFidc && currentSacado"
    :fidc="currentFidc"
    :sacado="currentSacado"
    @back="route = { level: 'fidc', fidcId: currentFidc.id }"
    @update="handleSacadoUpdate"
  />

  <GrupoEmpresarialDetailScreen
    v-else-if="route.level === 'grupo' && currentFidc && currentGrupo"
    :fidc="currentFidc"
    :grupo="currentGrupo"
    @back="route = { level: 'fidc', fidcId: currentFidc.id }"
  />

  <template v-else-if="route.level === 'class' && currentFidc && currentClass">
    <ClassDetailScreen
      :fidc="currentFidc"
      :klass="currentClass"
      @back="route = { level: 'fidc', fidcId: currentFidc.id }"
      @open-title="(titleId) => (route = { level: 'title', fidcId: currentFidc!.id, classId: currentClass!.id, titleId })"
    />
  </template>

  <template v-else-if="route.level === 'title' && currentFidc && currentClass && currentTitle">
    <TitleDetailScreen
      :fidc="currentFidc"
      :klass="currentClass"
      :title="currentTitle"
      @back="route = { level: 'class', fidcId: currentFidc.id, classId: currentClass.id }"
    />
  </template>
</template>
