<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}>();
</script>

<template>
  <div
    class="flex items-center"
    style="
      gap: 16px;
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      padding: 20px;
    "
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-lg)',
        background: tone.bg,
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="icon" :size="22" :stroke-width="1.75" />
    </div>
    <div>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.14em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        "
      >
        {{ label }}
      </div>
      <div
        style="
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          font-variant-numeric: tabular-nums;
        "
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
