<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{ change: [v: string] }>();
const model = defineModel<string>({ default: '' });

function onUpdate(value: string) {
  model.value = value;
  emit('change', value);
}
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div v-if="label" class="flex items-center" style="gap: 6px; margin-bottom: 6px">
      <FieldLabel style="margin-bottom: 0">{{ label }}</FieldLabel>
      <span
        v-if="hint"
        :title="hint"
        class="flex items-center justify-center"
        style="color: var(--text-muted); cursor: help; flex-shrink: 0"
      >
        <Info :size="12" :stroke-width="2.25" />
      </span>
    </div>
    <AdminSelect
      :model-value="model"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="onUpdate"
    />
  </div>
</template>
