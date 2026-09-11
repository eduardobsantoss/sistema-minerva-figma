<script setup lang="ts">
import { ref } from 'vue';
import { VEICULOS, cloneVeiculo, getVeiculo, type Veiculo } from '../data/passivoNovoData';
import VeiculosListScreen from './VeiculosListScreen.vue';
import VeiculoWorkspaceScreen from './VeiculoWorkspaceScreen.vue';

const selectedId = ref<string | null>(null);
const sessionVeiculo = ref<Veiculo | null>(null);

function openVeiculo(id: string) {
  const src = getVeiculo(id);
  selectedId.value = id;
  sessionVeiculo.value = src ? cloneVeiculo(src) : null;
}

function backToList() {
  selectedId.value = null;
  sessionVeiculo.value = null;
}
</script>

<template>
  <VeiculoWorkspaceScreen
    v-if="sessionVeiculo"
    :veiculo="sessionVeiculo"
    @back="backToList"
  />
  <VeiculosListScreen
    v-else
    :veiculos="VEICULOS"
    @open="openVeiculo"
  />
</template>
