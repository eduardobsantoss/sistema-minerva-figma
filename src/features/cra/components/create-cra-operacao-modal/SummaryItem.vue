<script setup lang="ts">
defineProps<{ label: string; value?: string | null }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      {{ value || '—' }}
    </div>
  </div>
</template>
