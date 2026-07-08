<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ pct: number; color: string; trackColor?: string }>(),
  { trackColor: 'var(--border-default)' },
);

const r = 20;
const circ = 2 * Math.PI * r;
const dashoffset = computed(() => circ * (1 - Math.min(Math.max(props.pct, 0), 100) / 100));
const label = computed(() => props.pct.toFixed(1).replace('.', ',') + '%');
</script>

<template>
  <svg width="52" height="52" viewBox="0 0 52 52" style="flex-shrink: 0">
    <circle cx="26" cy="26" :r="r" fill="none" :stroke="trackColor" stroke-width="5" />
    <circle
      cx="26"
      cy="26"
      :r="r"
      fill="none"
      :stroke="color"
      stroke-width="5"
      :stroke-dasharray="`${circ}`"
      :stroke-dashoffset="dashoffset"
      stroke-linecap="round"
      style="transform: rotate(-90deg); transform-origin: 26px 26px; transition: stroke-dashoffset 0.6s ease"
    />
    <text
      x="50%"
      y="52%"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ fontSize: '9px', fontWeight: 700, fill: color, fontFamily: 'var(--font-sans)' }"
    >
      {{ label }}
    </text>
  </svg>
</template>
