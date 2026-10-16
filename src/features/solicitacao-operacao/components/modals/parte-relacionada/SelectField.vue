<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

defineProps<{ label?: string; options: string[]; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <AdminSelect v-model="model" :options="options" :placeholder="placeholder" />
  </div>
</template>
