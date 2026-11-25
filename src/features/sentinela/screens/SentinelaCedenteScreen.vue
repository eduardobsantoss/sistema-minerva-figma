<script setup lang="ts">
import MonitoramentoPanorama from '../components/MonitoramentoPanorama.vue';

const emit = defineEmits<{ navigate: [view: string] }>();
</script>

<template>
  <MonitoramentoPanorama
    modulo="contraparte"
    titulo="Cedente"
    escopo-inicial="cedente"
    @back="emit('navigate', 'sentinela')"
  />
</template>
