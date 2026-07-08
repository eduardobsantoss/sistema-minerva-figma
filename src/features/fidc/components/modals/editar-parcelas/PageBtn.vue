<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; disabled?: boolean }>();
</script>

<template>
  <button
    :disabled="disabled"
    class="flex items-center justify-center"
    style="width: 30px; height: 30px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); color: var(--text-disabled); cursor: not-allowed"
  >
    <component :is="icon" :size="14" />
  </button>
</template>
