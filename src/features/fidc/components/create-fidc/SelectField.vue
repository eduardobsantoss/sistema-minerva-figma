<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
}>();

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <AdminSelect v-model="model" :options="options" :placeholder="placeholder" />
  </div>
</template>
