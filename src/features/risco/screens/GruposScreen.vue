<script setup lang="ts">
import { ref, computed } from 'vue';
import GruposListScreen from './GruposListScreen.vue';
import GrupoDetailScreen from './GrupoDetailScreen.vue';
import { GRUPOS_SEED } from '../data/riscoData';

type Route = { level: 'list' } | { level: 'detail'; grupoId: string };

const route = ref<Route>({ level: 'list' });

const grupoAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? GRUPOS_SEED.find((g) => g.id === r.grupoId) : undefined;
});

function openDetail(grupoId: string) {
  route.value = { level: 'detail', grupoId };
}
</script>

<template>
  <GruposListScreen v-if="route.level === 'list'" @open="openDetail" />
  <template v-else>
    <GrupoDetailScreen v-if="grupoAtual" :grupo="grupoAtual" @back="route = { level: 'list' }" />
    <GruposListScreen v-else @open="openDetail" />
  </template>
</template>
