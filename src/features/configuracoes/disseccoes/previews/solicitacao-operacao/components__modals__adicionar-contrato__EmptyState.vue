<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component; title: string; hint?: string }>(), {
  icon: FileText,
  title: 'Label',
  hint: ''
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <component :is="icon" :size="28" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
      {{ title }}
    </div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">{{ hint }}</div>
  </div>
</template>
