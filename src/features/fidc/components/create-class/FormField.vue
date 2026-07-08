<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
  defaultValue?: string;
}>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <Input :placeholder="placeholder" :type="type" :disabled="disabled" :default-value="defaultValue" />
  </div>
</template>
