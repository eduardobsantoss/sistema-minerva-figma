<script setup lang="ts">
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    type="button"
    :style="{
      padding: '8px 14px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--duration-base)',
    }"
  >
    <slot />
  </button>
</template>
