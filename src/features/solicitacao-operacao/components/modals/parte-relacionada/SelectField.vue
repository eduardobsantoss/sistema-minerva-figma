<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label?: string; options: string[]; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: 'pointer',
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
