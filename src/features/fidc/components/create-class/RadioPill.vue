<script setup lang="ts">
defineProps<{ active: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :style="{
      padding: '10px 18px',
      borderRadius: 'var(--radius-full)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: active ? 'var(--gci-base)' : 'var(--border-default)',
      background: active ? 'var(--gci-light)' : 'var(--surface-card)',
      color: active ? 'var(--gci-base)' : 'var(--text-muted)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.10em',
      cursor: 'pointer',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
