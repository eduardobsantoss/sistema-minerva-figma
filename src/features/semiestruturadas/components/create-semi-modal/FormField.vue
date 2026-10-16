<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <AdminDateField v-if="type === 'date'" :model-value="model ?? ''" :disabled="disabled" @update:model-value="model = $event" />
    <Input v-else v-model="model" :placeholder="placeholder" :type="type" :disabled="disabled" />
  </div>
</template>
