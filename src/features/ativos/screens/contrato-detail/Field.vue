<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div class="flex items-center" style="gap: 6px; margin-bottom: 6px">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">{{ label }}</div>
      <slot name="hint" />
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"><slot /></div>
  </div>
</template>
