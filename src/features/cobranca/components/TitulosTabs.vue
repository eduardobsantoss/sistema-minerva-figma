<script setup lang="ts">
import { FileText, Receipt, ScrollText } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

export type TitulosTab = 'titulos' | 'cessao' | 'aptos';

defineProps<{ modelValue: TitulosTab }>();
const emit = defineEmits<{ 'update:modelValue': [tab: TitulosTab] }>();

const OPTIONS = [
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'cessao', label: 'Notificações de cessão', icon: ScrollText },
  { key: 'aptos', label: 'Títulos aptos para boletar', icon: Receipt },
];
</script>

<template>
  <SegmentedToggle
    :model-value="modelValue"
    :options="OPTIONS"
    variant="brand"
    style="align-self: flex-start"
    @update:model-value="emit('update:modelValue', $event as TitulosTab)"
  />
</template>
