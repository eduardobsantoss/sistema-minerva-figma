<script setup lang="ts">
import { ref, computed } from 'vue';
import FidcListScreen from './FidcListScreen.vue';
import FidcDetailScreen from './FidcDetailScreen.vue';
import ClassDetailScreen from './ClassDetailScreen.vue';
import TitleDetailScreen from './TitleDetailScreen.vue';
import CreateClassModal from '../components/CreateClassModal.vue';
import CreateFidcModal from '../components/CreateFidcModal.vue';
import type { NewFidcData } from '../components/CreateFidcModal.vue';
import { fidcs as initialFidcs, type Fidc } from '../data/fidcsData';

type Route =
  | { level: 'list' }
  | { level: 'fidc'; fidcId: string }
  | { level: 'class'; fidcId: string; classId: string }
  | { level: 'title'; fidcId: string; classId: string; titleId: string };

function buildFidcFromForm(data: NewFidcData): Fidc {
  return {
    id: `fidc-${Date.now()}`,
    name: data.razaoSocial || data.nomeFantasia || 'NOVO FIDC',
    cnpj: data.cnpj || '—',
    category: 'MULTICLASSE',
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
    />
    <CreateClassModal v-if="creating" @close="creating = false" />
  </template>

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
