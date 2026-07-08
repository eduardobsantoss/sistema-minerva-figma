<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label: string; options: string[]; value: string; placeholder?: string }>();
const emit = defineEmits<{ change: [e: Event] }>();
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <select
      :value="value"
      style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
      @change="emit('change', $event)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
  </div>
</template>
