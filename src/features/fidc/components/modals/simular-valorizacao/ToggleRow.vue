<script setup lang="ts">
defineProps<{ label: string; on: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      gap: '12px',
      height: '40px',
      padding: '0 14px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('toggle')"
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ label }}</span>
    <div :style="{ position: 'relative', width: '36px', height: '20px', borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
      <span :style="{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '14px', height: '14px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
    </div>
  </div>
</template>
