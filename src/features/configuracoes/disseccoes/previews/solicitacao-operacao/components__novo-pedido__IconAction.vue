<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component; label: string; danger?: boolean }>(), {
  icon: FileText,
  label: 'Label',
  danger: true
});
</script>

<template>
  <button
    :aria-label="label"
    :title="label"
    class="flex items-center justify-center"
    :style="{
      width: '34px',
      height: '34px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      color: danger ? 'var(--danger-base)' : 'var(--text-muted)',
    }"
   
  >
    <component :is="icon" :size="15" />
  </button>
</template>
