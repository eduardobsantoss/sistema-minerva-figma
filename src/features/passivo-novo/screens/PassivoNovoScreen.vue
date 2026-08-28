<script setup lang="ts">
import { ref } from 'vue';
import { VEICULOS, getVeiculo } from '../data/passivoNovoData';
import VeiculosListScreen from './VeiculosListScreen.vue';
import VeiculoWorkspaceScreen from './VeiculoWorkspaceScreen.vue';

const selectedId = ref<string | null>(null);

function openVeiculo(id: string) {
  selectedId.value = id;
}

function backToList() {
  selectedId.value = null;
}
</script>

<template>
  <VeiculoWorkspaceScreen
    v-if="selectedId && getVeiculo(selectedId)"
    :veiculo="getVeiculo(selectedId)!"
    @back="backToList"
  />
  <VeiculosListScreen
    v-else
    :veiculos="VEICULOS"
    @open="openVeiculo"
  />
</template>
