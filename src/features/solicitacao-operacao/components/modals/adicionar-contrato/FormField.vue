<script setup lang="ts">
import { ref, computed } from 'vue';
import FieldLabel from './FieldLabel.vue';
import { formatCurrencyInput } from '../../../utils/currencyMask';

const props = withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    span?: number;
    /** Máscara R$ centavos (digitar 2 → R$ 0,02) */
    currency?: boolean;
  }>(),
  { disabled: false, required: false, currency: false },
);
const model = defineModel<string>({ default: '' });

const touched = ref(false);
const showError = computed(() => {
  if (!props.required || !touched.value) return false;
  if (props.currency) return !model.value || model.value === 'R$ 0,00';
  return !model.value;
});

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  if (props.currency) {
    model.value = formatCurrencyInput(el.value);
    return;
  }
  model.value = el.value;
}
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel :show-error="showError">{{ label }}</FieldLabel>
    <input
      :value="model"
      :placeholder="currency ? 'R$ 0,00' : placeholder"
      :disabled="disabled"
      :inputmode="currency ? 'numeric' : undefined"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
        fontVariantNumeric: currency ? 'tabular-nums' : undefined,
      }"
      @input="onInput"
      @blur="touched = true"
    />
  </div>
</template>
