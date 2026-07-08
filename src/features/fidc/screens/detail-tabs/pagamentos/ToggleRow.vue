<script setup lang="ts">
defineProps<{ label: string; on: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      width: '100%',
      padding: '10px 16px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('toggle')"
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ label }}: {{ on ? 'Sim' : 'Não' }}</span>
    <div :style="{ position: 'relative', width: '40px', height: '22px', borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
      <span :style="{ position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
    </div>
  </div>
</template>
