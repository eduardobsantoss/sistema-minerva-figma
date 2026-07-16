<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean; spacious?: boolean; disabled?: boolean }>(),
  { compact: false, spacious: false, disabled: false },
);
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'toggle-row--match-field': compact && !hint }"
    :style="{
      width: spacious ? '100%' : undefined,
      padding: spacious ? '20px 24px' : compact ? '12px 16px' : '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: '12px',
    }"
    @click="!disabled && emit('toggle')"
  >
    <div style="min-width: 0">
      <div
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-strong);
          line-height: 1.35;
        "
      >{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; line-height: 1.4">{{ hint }}</div>
    </div>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
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
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Altura alinhada ao bloco SelectField (label + input 40px) — só quando não há hint */
.toggle-row--match-field {
  min-height: 64px;
  height: 100%;
  align-self: stretch;
}
</style>
