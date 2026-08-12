<script setup lang="ts">
import { ChevronDown, Info } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{ change: [v: string] }>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div v-if="label" class="flex items-center" style="gap: 6px; margin-bottom: 6px">
      <FieldLabel style="margin-bottom: 0">{{ label }}</FieldLabel>
      <span
        v-if="hint"
        :title="hint"
        class="flex items-center justify-center"
        style="color: var(--text-muted); cursor: help; flex-shrink: 0"
      >
        <Info :size="12" :stroke-width="2.25" />
      </span>
    </div>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          height: '40px',
          paddingLeft: '14px',
          paddingRight: '40px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 'var(--text-sm)',
          color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
          width: '100%',
          appearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }"
        @change="emit('change', ($event.target as HTMLSelectElement).value)"
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
