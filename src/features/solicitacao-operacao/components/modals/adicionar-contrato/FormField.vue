<script setup lang="ts">
import { ref, computed } from 'vue';
import FieldLabel from './FieldLabel.vue';

const props = withDefaults(
  defineProps<{ label: string; placeholder?: string; disabled?: boolean; required?: boolean }>(),
  { disabled: false, required: false },
);
const model = defineModel<string>({ default: '' });

const touched = ref(false);
const showError = computed(() => props.required && touched.value && !model.value);
</script>

<template>
  <div>
    <FieldLabel :show-error="showError">{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
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
      }"
      @blur="touched = true"
    />
  </div>
</template>
