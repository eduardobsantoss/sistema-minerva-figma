<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });
defineProps<{ disabled?: boolean }>();
const model = defineModel<string>();
const attrs = useAttrs();
</script>

<template>
  <input
    v-model="model"
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
    v-bind="attrs"
  />
</template>
