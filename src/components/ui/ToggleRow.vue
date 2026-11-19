<script setup lang="ts">
// Toggle Row do DS: linha clicável com label (e hint opcional) + switch.
// `compact` = altura de campo (40px), para alinhar com AdminSelect/AdminTextField em linha de filtros.
withDefaults(
  defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean; disabled?: boolean }>(),
  { compact: false, disabled: false },
);
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    role="switch"
    :aria-checked="on"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    class="flex items-center justify-between"
    :style="{
      padding: compact ? '0 12px' : '14px 18px',
      height: compact ? '40px' : undefined,
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: '12px',
    }"
    @click="!disabled && emit('toggle')"
    @keydown.space.prevent="!disabled && emit('toggle')"
    @keydown.enter.prevent="!disabled && emit('toggle')"
  >
    <div style="min-width: 0">
      <div
        :style="{
          fontSize: compact ? 'var(--text-xs)' : 'var(--text-sm)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--text-strong)',
          lineHeight: 1.35,
        }"
      >{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; line-height: 1.4">{{ hint }}</div>
    </div>
    <div
      :style="{
        position: 'relative',
        width: compact ? '36px' : '44px',
        height: compact ? '20px' : '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '2px',
          left: on ? (compact ? '18px' : '22px') : '2px',
          width: compact ? '16px' : '20px',
          height: compact ? '16px' : '20px',
          borderRadius: '9999px',
          background: 'var(--surface-card)',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>
