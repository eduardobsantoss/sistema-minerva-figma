<script setup lang="ts">
defineProps<{ label: string; value: number; strong?: boolean }>();
</script>

<template>
  <div :style="{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', background: strong ? 'var(--surface-sunken)' : 'var(--surface-card)' }">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
      {{ value }}
    </div>
  </div>
</template>
