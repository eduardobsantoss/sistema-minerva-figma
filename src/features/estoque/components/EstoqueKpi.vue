<script setup lang="ts">
import type { Component } from 'vue';
import type { Tone } from '../data/estoqueData';

defineProps<{ icon: Component; label: string; value: string; hint?: string; tone: Tone }>();
</script>

<template>
  <div
    class="flex items-center"
    style="gap: 14px; padding: 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); min-width: 0"
  >
    <div
      class="flex items-center justify-center"
      :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: tone.bg, color: tone.fg, flexShrink: 0 }"
    >
      <component :is="icon" :size="18" :stroke-width="1.75" />
    </div>
    <div style="min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
        {{ label }}
      </div>
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ value }}
      </div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ hint }}</div>
    </div>
  </div>
</template>
