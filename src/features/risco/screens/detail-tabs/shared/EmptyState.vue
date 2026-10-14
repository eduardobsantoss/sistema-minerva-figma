<script setup lang="ts">
import { computed, type Component } from 'vue';

const props = withDefaults(
  defineProps<{ icon: Component; title: string; hint?: string; tone?: 'default' | 'success' }>(),
  { tone: 'default' },
);

const shell = computed(() =>
  props.tone === 'success'
    ? {
        background: 'var(--status-success-bg)',
        border: '1px dashed var(--status-success-text)',
        color: 'var(--status-success-text)',
        title: 'var(--status-success-text)',
        hint: 'var(--status-success-text)',
        opacity: '1',
      }
    : {
        background: 'var(--surface-sunken)',
        border: '1px dashed var(--border-default)',
        color: 'var(--text-muted)',
        title: 'var(--text-default)',
        hint: 'var(--text-muted)',
        opacity: '0.5',
      },
);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    :style="{
      gap: '10px',
      padding: '32px 24px',
      textAlign: 'center',
      background: shell.background,
      borderRadius: 'var(--radius-lg)',
      border: shell.border,
    }"
  >
    <component :is="icon" :size="26" :stroke-width="1.5" :style="{ color: shell.color, opacity: shell.opacity }" />
    <div :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: shell.title }">{{ title }}</div>
    <div v-if="hint" :style="{ fontSize: 'var(--text-xs)', color: shell.hint, maxWidth: '360px' }">{{ hint }}</div>
  </div>
</template>
