<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import SelectField from './SelectField.vue';
import Input from './Input.vue';

defineProps<{ label: string; base: string; pct: string }>();
const emit = defineEmits<{ 'update:base': [v: string]; 'update:pct': [v: string] }>();
</script>

<template>
  <div
    class="grid items-end"
    style="grid-template-columns: 2fr 1.2fr 1fr; gap: 12px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
  >
    <div style="align-self: center; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      {{ label }}
    </div>
    <div>
      <FieldLabel>Base de Cálculo</FieldLabel>
      <SelectField
        :options="['Garantia', 'Emissão']"
        :model-value="base"
        @update:model-value="emit('update:base', $event ?? '')"
      />
    </div>
    <div>
      <FieldLabel>% Atribuído</FieldLabel>
      <Input placeholder="0,00" :model-value="pct" @update:model-value="emit('update:pct', $event ?? '')" />
    </div>
  </div>
</template>
