<script setup lang="ts">
import { useAttrs } from 'vue';
import FieldLabel from './FieldLabel.vue';

defineOptions({ inheritAttrs: false });
defineProps<{ label: string }>();
const attrs = useAttrs();
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
      v-bind="attrs"
    />
  </div>
</template>
