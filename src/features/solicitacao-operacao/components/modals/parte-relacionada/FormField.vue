<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label: string; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      style="
        width: 100%;
        height: 40px;
        padding: 0 14px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        outline: none;
        font-size: var(--text-sm);
        color: var(--text-strong);
      "
    />
  </div>
</template>
