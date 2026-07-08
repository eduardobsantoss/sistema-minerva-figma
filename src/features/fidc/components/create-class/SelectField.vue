<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
}>();

const emit = defineEmits<{ change: [v: string] }>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        style="
          height: 40px;
          padding-left: 14px;
          padding-right: 40px;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-md);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
          width: 100%;
          appearance: none;
        "
        @change="emit('change', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
      <ChevronDown
        :size="16"
        style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none"
      />
    </div>
  </div>
</template>
