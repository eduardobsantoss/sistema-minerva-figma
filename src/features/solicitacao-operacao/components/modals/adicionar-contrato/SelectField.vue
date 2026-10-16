<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

withDefaults(
  defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean; required?: boolean; span?: number }>(),
  { disabled: false, required: false },
);
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <AdminSelect v-model="model" :options="options" :placeholder="placeholder" :disabled="disabled" />
  </div>
</template>
