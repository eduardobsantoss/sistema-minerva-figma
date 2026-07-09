<script setup lang="ts">
withDefaults(
  defineProps<{ checked: boolean; indeterminate?: boolean; disabled?: boolean }>(),
  { indeterminate: false, disabled: false },
);
const emit = defineEmits<{ change: [] }>();

function onKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    emit('change');
  }
}
</script>

<template>
  <div
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : checked"
    :aria-disabled="disabled"
    tabindex="0"
    :style="{
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      border: 'none',
      outline: 'none',
      flexShrink: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      background: checked || indeterminate ? 'var(--gci-base)' : '#fff',
      boxShadow:
        checked || indeterminate
          ? '0 0 0 2px rgba(8,60,74,0.18)'
          : '0 1px 3px rgba(15,23,42,0.14), 0 1px 2px rgba(15,23,42,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--duration-fast), box-shadow var(--duration-fast)',
    }"
    @click="!disabled && emit('change')"
    @keydown="!disabled && onKeydown($event)"
  >
    <svg v-if="indeterminate" width="8" height="2" viewBox="0 0 8 2" fill="none">
      <rect width="8" height="2" rx="1" fill="white" />
    </svg>
    <svg v-else-if="checked" width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>
