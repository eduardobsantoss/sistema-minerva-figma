<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

withDefaults(
  defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean }>(),
  { disabled: false },
);
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
