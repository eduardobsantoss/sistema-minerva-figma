<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import type { Cedente } from '@/features/risco/data/riscoData';
import ParteRelacionadaModal from '@/features/solicitacao-operacao/components/modals/ParteRelacionadaModal.vue';
import CedenteDetailModal from '@/features/risco/components/modals/CedenteDetailModal.vue';
import {
  GRUPOS_CADASTRO_SEED,
  cloneGrupo,
  cloneParte,
  emptyGrupo,
  type GrupoCadastro,
  type GarantiaGrupo,
} from '../data/gruposCadastroData';
import GruposCadastroListScreen from './GruposCadastroListScreen.vue';
import GrupoCadastroView from './GrupoCadastroView.vue';
import GarantiaGrupoDetailView from './GarantiaGrupoDetailView.vue';

type Route =
  | { level: 'list' }
  | { level: 'create' }
  | { level: 'detail'; grupoId: string };

const items = ref<GrupoCadastro[]>(GRUPOS_CADASTRO_SEED.map(cloneGrupo));
const route = ref<Route>({ level: 'list' });
const showParteModal = ref(false);
const editingParte = ref<ParteRelacionada | null>(null);
const cedenteAtual = ref<Cedente | null>(null);
const garantiaAtual = ref<GarantiaGrupo | null>(null);
const creating = ref<GrupoCadastro>(emptyGrupo());

const grupoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'detail') return null;
  return items.value.find((g) => g.id === r.grupoId) ?? null;
});

function parteKey(p: ParteRelacionada) {
  return `${p.documento}::${p.nome}`;
}

function openCreate() {
  creating.value = emptyGrupo();
  route.value = { level: 'create' };
}

function openDetail(id: string) {
  cedenteAtual.value = null;
  garantiaAtual.value = null;
  route.value = { level: 'detail', grupoId: id };
}

function handleSave(grupo: GrupoCadastro) {
  if (route.value.level === 'create') {
    const now = new Date();
    const datetime = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
    const created: GrupoCadastro = {
      ...cloneGrupo(grupo),
      id: `grp-${Date.now()}`,
      historico: grupo.historico.length
        ? grupo.historico
        : [{ id: `hist-${Date.now()}`, datetime, descricao: 'Grupo empresarial cadastrado.' }],
    };
    items.value = [created, ...items.value];
    route.value = { level: 'detail', grupoId: created.id };
    return;
  }
  items.value = items.value.map((g) => (g.id === grupo.id ? cloneGrupo(grupo) : g));
}

function closeParteModal() {
  showParteModal.value = false;
  editingParte.value = null;
}

function handleAddParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.partes = [...next.partes, cloneParte(parte)];
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  closeParteModal();
}

function handleSaveParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  const original = editingParte.value;
  if (!grupo || !original) return;
  const key = parteKey(original);
  const next = cloneGrupo(grupo);
  next.partes = next.partes.map((p) => (parteKey(p) === key ? cloneParte(parte) : p));
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  closeParteModal();
}

function handleRemoveParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const key = parteKey(parte);
  const next = cloneGrupo(grupo);
  next.partes = next.partes.filter((p) => parteKey(p) !== key);
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
}

function openAddParte() {
  editingParte.value = null;
  showParteModal.value = true;
}

function openParte(parte: ParteRelacionada) {
  editingParte.value = parte;
  showParteModal.value = true;
}

function handleUpdateCedente(cedente: Cedente) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.cedentes = next.cedentes.map((c) => (c.id === cedente.id ? cedente : c));
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  if (cedenteAtual.value?.id === cedente.id) cedenteAtual.value = cedente;
}

function backFromDetail() {
  cedenteAtual.value = null;
  garantiaAtual.value = null;
  route.value = { level: 'list' };
}

function openGarantia(garantia: GarantiaGrupo) {
  const grupo = grupoAtual.value;
  garantiaAtual.value = grupo?.garantias.find((g) => g.id === garantia.id) ?? garantia;
}

function handleUpdateGarantia(garantia: GarantiaGrupo) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.garantias = next.garantias.map((g) => (g.id === garantia.id ? garantia : g));
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  if (garantiaAtual.value?.id === garantia.id) garantiaAtual.value = garantia;
}

function handleDeleteGarantia(garantia: GarantiaGrupo) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.garantias = next.garantias.filter((g) => g.id !== garantia.id);
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  garantiaAtual.value = null;
}
</script>

<template>
  <GarantiaGrupoDetailView
    v-if="garantiaAtual && grupoAtual && !cedenteAtual"
    :grupo="grupoAtual"
    :garantia="garantiaAtual"
    @close="garantiaAtual = null"
    @update="handleUpdateGarantia"
    @delete="handleDeleteGarantia"
  />

  <CedenteDetailModal
    v-if="cedenteAtual && grupoAtual && !garantiaAtual"
    as-page
    :cedente="cedenteAtual"
    :page-label="grupoAtual.nome"
    @close="cedenteAtual = null"
    @update="handleUpdateCedente"
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
    v-if="grupoAtual && route.level === 'detail'"
    v-show="!cedenteAtual && !garantiaAtual"
    :grupo="grupoAtual"
    mode="detail"
    @back="backFromDetail"
    @save="handleSave"
    @add-parte="openAddParte"
    @open-parte="openParte"
    @remove-parte="handleRemoveParte"
    @open-cedente="cedenteAtual = $event"
    @open-garantia="openGarantia"
  />

  <ParteRelacionadaModal
    v-if="showParteModal"
    :parte="editingParte"
    @close="closeParteModal"
    @create="handleAddParte"
    @save="handleSaveParte"
  />
</template>
