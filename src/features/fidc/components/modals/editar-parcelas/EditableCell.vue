<script setup lang="ts">
defineProps<{ value: number }>();
const emit = defineEmits<{ change: [v: string] }>();
</script>

<template>
  <input
    type="text"
    inputmode="decimal"
    :value="value.toFixed(2)"
    style="
      width: 100%;
      height: 36px;
      padding: 0 12px;
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      outline: none;
      font-size: var(--text-sm);
      color: var(--text-strong);
      font-variant-numeric: tabular-nums;
    "
    @blur="emit('change', ($event.target as HTMLInputElement).value)"
  />
</template>
