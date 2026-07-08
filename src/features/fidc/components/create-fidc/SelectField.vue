<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
}>();

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          height: '40px',
          paddingLeft: '14px',
          paddingRight: '40px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
      <ChevronDown
        :size="16"
        style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none"
      />
    </div>
  </div>
</template>
