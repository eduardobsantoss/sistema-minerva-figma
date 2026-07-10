<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean }>();
const emit = defineEmits<{ toggle: [] }>();

const trackStyle = computed(() => ({
  position: 'relative' as const,
  width: props.compact ? '34px' : '44px',
  height: props.compact ? '20px' : '24px',
  borderRadius: '9999px',
  background: props.on ? 'var(--success-base)' : 'var(--border-strong)',
  transition: 'background var(--duration-base)',
  flexShrink: 0,
}));

const knobStyle = computed(() => ({
  position: 'absolute' as const,
  top: props.compact ? '2px' : '3px',
  left: props.on ? (props.compact ? '16px' : '23px') : (props.compact ? '2px' : '3px'),
  width: props.compact ? '16px' : '18px',
  height: props.compact ? '16px' : '18px',
  borderRadius: '9999px',
  background: '#fff',
  transition: 'left var(--duration-base)',
  boxShadow: 'var(--shadow-xs)',
}));
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'toggle-row--compact': compact }"
    :style="{
      padding: compact ? '0 12px' : '14px 18px',
      height: compact ? '40px' : undefined,
      minHeight: compact ? '40px' : undefined,
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: compact ? '10px' : '12px',
    }"
    @click="emit('toggle')"
  >
    <div style="min-width: 0">
      <div :style="{ fontSize: compact ? 'var(--text-xs)' : 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', lineHeight: compact ? '1.35' : '1.4' }">{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ hint }}</div>
    </div>
    <div :style="trackStyle">
      <span :style="knobStyle" />
    </div>
  </div>
</template>

<style scoped>
.toggle-row--compact {
  align-self: end;
}
</style>
