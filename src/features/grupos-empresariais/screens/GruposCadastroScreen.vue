<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import ParteRelacionadaModal from '@/features/solicitacao-operacao/components/modals/ParteRelacionadaModal.vue';
import { ParteRelacionadaDetailView } from '@/features/solicitacao-operacao/screens/detail-tabs/parte-relacionada';
import {
  GRUPOS_CADASTRO_SEED,
  cloneGrupo,
  cloneParte,
  emptyGrupo,
  type GrupoCadastro,
} from '../data/gruposCadastroData';
import GruposCadastroListScreen from './GruposCadastroListScreen.vue';
import GrupoCadastroView from './GrupoCadastroView.vue';

type Route =
  | { level: 'list' }
  | { level: 'create' }
  | { level: 'detail'; grupoId: string }
  | { level: 'parte'; grupoId: string; parteKey: string };

const items = ref<GrupoCadastro[]>(GRUPOS_CADASTRO_SEED.map(cloneGrupo));
const route = ref<Route>({ level: 'list' });
const showParteModal = ref(false);
const creating = ref<GrupoCadastro>(emptyGrupo());

const grupoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'detail' && r.level !== 'parte') return null;
  return items.value.find((g) => g.id === r.grupoId) ?? null;
});

const parteAtual = computed(() => {
  const r = route.value;
  const grupo = grupoAtual.value;
  if (r.level !== 'parte' || !grupo) return null;
  return grupo.partes.find((p) => parteKey(p) === r.parteKey) ?? null;
});

function parteKey(p: ParteRelacionada) {
  return `${p.documento}::${p.nome}`;
}

function openCreate() {
  creating.value = emptyGrupo();
  route.value = { level: 'create' };
}

function openDetail(id: string) {
  route.value = { level: 'detail', grupoId: id };
}

function handleSave(grupo: GrupoCadastro) {
  if (route.value.level === 'create') {
    const created: GrupoCadastro = {
      ...cloneGrupo(grupo),
      id: `grp-${Date.now()}`,
    };
    items.value = [created, ...items.value];
    route.value = { level: 'detail', grupoId: created.id };
    return;
  }
  items.value = items.value.map((g) => (g.id === grupo.id ? cloneGrupo(grupo) : g));
}

function handleAddParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.partes = [...next.partes, cloneParte(parte)];
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  showParteModal.value = false;
}

function handleRemoveParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const key = parteKey(parte);
  const next = cloneGrupo(grupo);
  next.partes = next.partes.filter((p) => parteKey(p) !== key);
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
}

function openParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  route.value = { level: 'parte', grupoId: grupo.id, parteKey: parteKey(parte) };
}

function closeParte() {
  const r = route.value;
  if (r.level === 'parte') route.value = { level: 'detail', grupoId: r.grupoId };
}
</script>

<template>
  <ParteRelacionadaDetailView
    v-if="route.level === 'parte' && parteAtual && grupoAtual"
    :parte="parteAtual"
    :solicitacao-id="grupoAtual.nome"
    @back="closeParte"
  />

  <GruposCadastroListScreen
    v-if="route.level === 'list'"
    :grupos="items"
    @open="openDetail"
    @create="openCreate"
  />

  <GrupoCadastroView
    v-if="route.level === 'create'"
    :grupo="creating"
    mode="create"
    @back="route = { level: 'list' }"
    @save="handleSave"
  />

  <GrupoCadastroView
    v-if="grupoAtual && (route.level === 'detail' || route.level === 'parte')"
    v-show="route.level === 'detail'"
    :grupo="grupoAtual"
    mode="detail"
    @back="route = { level: 'list' }"
    @save="handleSave"
    @add-parte="showParteModal = true"
    @open-parte="openParte"
    @remove-parte="handleRemoveParte"
  />

  <ParteRelacionadaModal
    v-if="showParteModal"
    @close="showParteModal = false"
    @create="handleAddParte"
  />
</template>
