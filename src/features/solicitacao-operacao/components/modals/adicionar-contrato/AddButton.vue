<script setup lang="ts">
withDefaults(
  defineProps<{ disabled?: boolean; fullWidth?: boolean }>(),
  { disabled: false, fullWidth: false },
);
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center justify-center"
    :disabled="disabled"
    :style="{
      width: fullWidth ? '100%' : undefined,
      height: '40px',
      padding: '0 18px',
      background: disabled ? 'var(--neutral-200)' : 'var(--gci-base)',
      color: disabled ? 'var(--text-disabled)' : '#fff',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      gap: '6px',
      opacity: disabled ? 0.7 : 1,
    }"
    @click="!disabled && emit('click')"
  >
    <slot />
  </button>
</template>
