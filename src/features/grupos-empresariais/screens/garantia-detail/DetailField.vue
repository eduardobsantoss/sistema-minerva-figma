<script setup lang="ts">
defineProps<{ label: string; span?: number }>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); line-height: 1.45">
      <slot />
    </div>
  </div>
</template>
