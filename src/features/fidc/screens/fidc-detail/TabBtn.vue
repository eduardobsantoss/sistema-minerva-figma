<script setup lang="ts">
defineProps<{ active: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :style="{
      padding: '8px 16px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
