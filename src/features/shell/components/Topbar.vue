<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/components/layout/Topbar.vue
 */
import Topbar from '@/components/layout/Topbar.vue';

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: 'Bem-vindo(a) ao Minerva Gestão',
  },
);
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--surface-page);
    "
  >
    <Topbar :title="title" />
  </div>
</template>
