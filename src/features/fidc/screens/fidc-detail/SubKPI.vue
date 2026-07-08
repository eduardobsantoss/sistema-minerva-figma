<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  badge?: string;
}>();
</script>

<template>
  <div
    class="flex items-center"
    :style="{
      gap: '14px',
      padding: '14px',
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
    }"
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-lg)',
        background: tone.bg,
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="icon" :size="18" :stroke-width="1.75" />
    </div>
    <div style="flex: 1; min-width: 0">
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
      <div class="flex items-center" style="gap: 8px">
        <span
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ value }}
        </span>
        <span
          v-if="badge"
          style="
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            padding: 3px 7px;
            border-radius: 9999px;
            background: var(--danger-base);
            color: #fff;
          "
        >
          {{ badge }}
        </span>
      </div>
    </div>
  </div>
</template>
