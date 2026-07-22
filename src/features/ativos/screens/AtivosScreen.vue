<script setup lang="ts">
import { computed, ref } from 'vue';
import { CONTRATOS_SEED, TITULOS_SEED, type ContratoAtivoGlobal, type TituloAtivoGlobal } from '../data/ativosData';
import AtivosListScreen from './AtivosListScreen.vue';
import ContratoDetailScreen from './ContratoDetailScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route =
  | { level: 'list' }
  | { level: 'contrato'; contratoId: string }
  | { level: 'titulo'; tituloId: string; from?: 'list' | 'contrato'; contratoId?: string };

const contratos = ref<ContratoAtivoGlobal[]>(CONTRATOS_SEED.map((c) => ({ ...c, tituloIds: [...c.tituloIds] })));
const titulos = ref<TituloAtivoGlobal[]>(TITULOS_SEED.map((t) => ({ ...t })));
const route = ref<Route>({ level: 'list' });

const contratoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'contrato') return undefined;
  return contratos.value.find((c) => c.id === r.contratoId);
});

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'titulo' ? titulos.value.find((t) => t.id === r.tituloId) : undefined;
});

function openContrato(id: string) {
  route.value = { level: 'contrato', contratoId: id };
}

function openTituloFromList(id: string) {
  route.value = { level: 'titulo', tituloId: id, from: 'list' };
}

function openTituloFromContrato(id: string) {
  const r = route.value;
  const contratoId = r.level === 'contrato' ? r.contratoId : undefined;
  route.value = { level: 'titulo', tituloId: id, from: 'contrato', contratoId };
}

function handleBack() {
  const r = route.value;
  if (r.level === 'titulo' && r.from === 'contrato' && r.contratoId) {
    route.value = { level: 'contrato', contratoId: r.contratoId };
    return;
  }
  route.value = { level: 'list' };
}
</script>

<template>
  <AtivosListScreen
    v-if="route.level === 'list'"
    :contratos="contratos"
    :titulos="titulos"
    @open-contrato="openContrato"
    @open-titulo="openTituloFromList"
  />
  <ContratoDetailScreen
    v-else-if="route.level === 'contrato' && contratoAtual"
    :contrato="contratoAtual"
    :titulos="titulos"
    @back="handleBack"
    @open-titulo="openTituloFromContrato"
  />
  <TituloDetailScreen
    v-else-if="route.level === 'titulo' && tituloAtual"
    :titulo="tituloAtual"
    @back="handleBack"
  />
</template>
