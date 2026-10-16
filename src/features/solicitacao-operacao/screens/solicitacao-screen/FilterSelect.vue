<script setup lang="ts">
import { computed } from 'vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

const props = defineProps<{ placeholder: string; options: string[] }>();
const model = defineModel<string>({ default: '' });

const items = computed(() => [
  { value: '', label: props.placeholder },
  ...props.options.map((option) => ({ value: option, label: option })),
]);
</script>

<template>
  <div style="min-width: 180px">
    <AdminSelect v-model="model" :options="items" />
  </div>
</template>
