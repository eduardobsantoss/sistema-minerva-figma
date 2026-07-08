<script setup lang="ts">
defineProps<{ placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <input
    v-model="model"
    :placeholder="placeholder"
    style="
      height: 40px;
      padding: 0 14px;
      width: 100%;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-md);
      outline: none;
      font-size: var(--text-sm);
      color: var(--text-strong);
    "
  />
</template>
