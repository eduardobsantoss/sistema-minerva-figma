<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  danger?: boolean;
}>();
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-xl);
      padding: 18px;
    "
  >
    <div class="flex items-center" style="gap: 12px; margin-bottom: 12px">
      <div
        class="flex items-center justify-center"
        :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: tone.bg, color: tone.fg }"
      >
        <component :is="icon" :size="18" :stroke-width="1.75" />
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        {{ label }}
      </div>
    </div>
    <div
      :style="{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--weight-bold)',
        color: danger ? 'var(--danger-base)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }"
    >
      {{ value }}
    </div>
  </div>
</template>
