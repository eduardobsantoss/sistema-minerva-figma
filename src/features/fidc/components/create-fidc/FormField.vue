<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
}>();

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :style="{
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        width: '100%',
      }"
    />
  </div>
</template>
