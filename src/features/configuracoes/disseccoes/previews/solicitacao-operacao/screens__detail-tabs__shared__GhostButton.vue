<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component }>(), {
  icon: FileText
});
</script>

<template>
  <button
    class="flex items-center"
    style="
      gap: 8px;
      height: 38px;
      padding: 0 16px;
      background: var(--surface-card);
      color: var(--text-strong);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.06em;
    "
   
  >
    <component :is="icon" :size="15" /><slot />
  </button>
</template>
