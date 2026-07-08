<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component }>();
const emit = defineEmits<{ click: [] }>();
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
    @click="emit('click')"
  >
    <component :is="icon" :size="15" /><slot />
  </button>
</template>
