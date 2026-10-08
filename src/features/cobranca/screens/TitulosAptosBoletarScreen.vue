<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Titulo } from '../data/titulosData';
import { useTitulosActions } from '../composables/useTitulosActions';
import TitulosAptosBoletarListScreen from './TitulosAptosBoletarListScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

const props = defineProps<{ titulos: Titulo[] }>();
const emit = defineEmits<{ 'update:titulos': [value: Titulo[]] }>();

const list = computed<Titulo[]>({
  get: () => props.titulos,
  set: (value) => emit('update:titulos', value),
});
const tituloAbertoId = ref<string | null>(null);
const { gerarBoleto, gerarBoletos, notificar, confirmar, negociar } = useTitulosActions(list);

const tituloAtual = computed(() => list.value.find((t) => t.id === tituloAbertoId.value));
</script>

<template>
  <TituloDetailScreen
    v-if="tituloAtual"
    :titulo="tituloAtual"
    @back="tituloAbertoId = null"
    @gerar-boleto="gerarBoleto"
    @notificar="notificar"
    @confirmar="confirmar"
    @negociar="negociar"
  />
  <TitulosAptosBoletarListScreen
    v-else
    :titulos="list"
    @open="tituloAbertoId = $event"
    @gerar-boletos="gerarBoletos"
  >
    <template #tabs><slot name="tabs" /></template>
  </TitulosAptosBoletarListScreen>
</template>
