<script setup lang="ts">
defineProps<{ label: string; on: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      padding: '14px 16px',
      borderRadius: 'var(--radius-lg)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      cursor: 'pointer',
    }"
    @click="emit('toggle')"
  >
    <span
      :style="{
        fontSize: 'var(--text-sm)',
        color: on ? 'var(--success-dark)' : 'var(--text-default)',
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
        userSelect: 'none',
      }"
    >
      {{ label }}
    </span>
    <div
      style="width: 44px; height: 24px; border-radius: 9999px; position: relative; flex-shrink: 0"
      :style="{ background: on ? 'var(--success-base)' : 'var(--border-default)', transition: 'background var(--duration-base)' }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }"
      />
    </div>
  </div>
</template>
