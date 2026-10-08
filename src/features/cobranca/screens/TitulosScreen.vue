<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Titulo } from '../data/titulosData';
import { useTitulosActions } from '../composables/useTitulosActions';
import TitulosListScreen from './TitulosListScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; tituloId: string };

const props = defineProps<{ titulos: Titulo[] }>();
const emit = defineEmits<{ 'update:titulos': [value: Titulo[]] }>();

const list = computed<Titulo[]>({
  get: () => props.titulos,
  set: (value) => emit('update:titulos', value),
});
const route = ref<Route>({ level: 'list' });
const { gerarBoleto, notificar, notificarLote, confirmar, negociar, inserirObservacao } = useTitulosActions(list);

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((t) => t.id === r.tituloId) : undefined;
});

function openDetail(tituloId: string) {
  route.value = { level: 'detail', tituloId };
}
</script>

<template>
  <TituloDetailScreen
    v-if="route.level === 'detail' && tituloAtual"
    :titulo="tituloAtual"
    @back="route = { level: 'list' }"
    @gerar-boleto="gerarBoleto"
    @notificar="notificar"
    @confirmar="confirmar"
    @negociar="negociar"
  />
  <TitulosListScreen
    v-else
    :titulos="list"
    @open="openDetail"
    @gerar-boleto="gerarBoleto"
    @notificar="notificar"
    @confirmar="confirmar"
    @negociar="negociar"
    @notificar-lote="notificarLote"
    @observacao="inserirObservacao"
  >
    <template #tabs><slot name="tabs" /></template>
  </TitulosListScreen>
</template>
