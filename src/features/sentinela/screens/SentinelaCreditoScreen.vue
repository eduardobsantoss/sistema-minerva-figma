<script setup lang="ts">
import MonitoramentoPanorama from '../components/MonitoramentoPanorama.vue';

const emit = defineEmits<{ navigate: [view: string] }>();
</script>

<template>
  <MonitoramentoPanorama modulo="credito" @back="emit('navigate', 'sentinela')" />
</template>
