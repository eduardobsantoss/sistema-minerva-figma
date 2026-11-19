<script setup lang="ts">
import type { Tone } from '../data/estoqueData';

defineProps<{ label: string; tone: Tone }>();
</script>

<template>
  <span
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      background: tone.bg,
      color: tone.fg,
    }"
  >
    {{ label }}
  </span>
</template>
