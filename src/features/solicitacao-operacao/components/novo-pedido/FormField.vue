<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean }>(), {
  disabled: false,
});
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
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
    />
  </div>
</template>
