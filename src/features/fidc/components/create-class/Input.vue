<script setup lang="ts">
import AdminDateField from '@/components/ui/AdminDateField.vue';

const props = defineProps<{
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  defaultValue?: string;
}>();

const model = defineModel<string>();
if (model.value === undefined) {
  model.value = props.defaultValue ?? '';
}
</script>

<template>
  <AdminDateField v-if="type === 'date'" :model-value="model ?? ''" :disabled="disabled" @update:model-value="model = $event" />
  <input
    v-else
    v-model="model"
    :placeholder="placeholder"
    :type="type"
    :disabled="disabled"
    :style="{
      height: '40px',
      padding: '0 14px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      fontSize: 'var(--text-sm)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
      width: '100%',
    }"
  />
</template>
