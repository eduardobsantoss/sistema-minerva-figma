<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; on: boolean; hint?: string; disabled?: boolean }>(),
  { disabled: false },
);
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
      borderColor: on && !disabled ? 'var(--success-base)' : 'var(--border-default)',
      background: on && !disabled ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      gap: '12px',
      opacity: disabled ? 0.55 : 1,
    }"
    @click="!disabled && emit('toggle')"
  >
    <div style="min-width: 0">
      <div
        :style="{
          fontSize: 'var(--text-sm)',
          color: on && !disabled ? 'var(--success-dark)' : 'var(--text-default)',
          fontWeight: on && !disabled ? 'var(--weight-semibold)' : 'var(--weight-regular)',
          userSelect: 'none',
          lineHeight: '1.4',
        }"
      >
        {{ label }}
      </div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ hint }}</div>
    </div>
    <div
      style="width: 44px; height: 24px; border-radius: 9999px; position: relative; flex-shrink: 0"
      :style="{
        background: on && !disabled ? 'var(--success-base)' : 'var(--border-default)',
        transition: 'background var(--duration-base)',
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on && !disabled ? '23px' : '3px',
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
