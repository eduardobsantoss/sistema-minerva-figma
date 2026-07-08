<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

const props = defineProps<{ label: string; value: number; disabled?: boolean }>();
const emit = defineEmits<{ change: [value: number] }>();

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('change', Number(target.value.replace('%', '').replace(',', '.')) || 0);
}
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      type="text"
      :disabled="disabled"
      :value="`${props.value.toFixed(2).replace('.', ',')}%`"
      :style="{
        width: '100%', height: '40px', padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums', cursor: disabled ? 'not-allowed' : 'text',
      }"
      @input="handleInput"
    />
  </div>
</template>
