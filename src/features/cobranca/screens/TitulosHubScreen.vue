<script setup lang="ts">
import { ref } from 'vue';
import { TITULOS_SEED, type Titulo } from '../data/titulosData';
import TitulosTabs, { type TitulosTab } from '../components/TitulosTabs.vue';
import TitulosScreen from './TitulosScreen.vue';
import TitulosAptosBoletarScreen from './TitulosAptosBoletarScreen.vue';

const props = withDefaults(defineProps<{ initialTab?: TitulosTab }>(), { initialTab: 'titulos' });
const tab = ref<TitulosTab>(props.initialTab);
const titulos = ref<Titulo[]>(TITULOS_SEED.map((t) => ({ ...t })));
</script>

<template>
  <TitulosScreen v-if="tab === 'titulos'" v-model:titulos="titulos">
    <template #tabs><TitulosTabs v-model="tab" /></template>
  </TitulosScreen>
  <TitulosAptosBoletarScreen v-else v-model:titulos="titulos">
    <template #tabs><TitulosTabs v-model="tab" /></template>
  </TitulosAptosBoletarScreen>
</template>
