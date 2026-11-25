<script setup lang="ts">
import MonitoramentoPanorama from '../components/MonitoramentoPanorama.vue';

const emit = defineEmits<{ navigate: [view: string] }>();
</script>

<template>
  <MonitoramentoPanorama
    modulo="contraparte"
    titulo="Sacado"
    escopo-inicial="sacado"
    @back="emit('navigate', 'sentinela')"
  />
</template>
