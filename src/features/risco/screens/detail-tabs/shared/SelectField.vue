<script setup lang="ts">
import { computed } from 'vue';
import FieldLabel from './FieldLabel.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

const props = defineProps<{ label: string; options: string[]; value: string; placeholder?: string }>();
const emit = defineEmits<{ change: [e: Event] }>();

const items = computed(() => {
  const list = props.options.map((option) => ({ value: option, label: option }));
  return props.placeholder ? [{ value: '', label: props.placeholder }, ...list] : list;
});

function onUpdate(value: string) {
  emit('change', { target: { value } } as unknown as Event);
}
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <AdminSelect :model-value="value" :options="items" @update:model-value="onUpdate" />
  </div>
</template>
