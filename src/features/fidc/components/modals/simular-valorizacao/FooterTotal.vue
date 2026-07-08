<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div>
    <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ label }}</div>
    <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ value }}</div>
  </div>
</template>
