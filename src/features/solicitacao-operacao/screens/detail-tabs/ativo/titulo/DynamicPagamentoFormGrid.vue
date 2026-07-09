<script setup lang="ts">
import { FormField, SelectField, ToggleRow } from '../../../../components/modals/adicionar-contrato';
import type { PagamentoFormFieldDef, PagamentoFormState } from '../../../../data/pagamentoFields';

withDefaults(defineProps<{ fields: PagamentoFormFieldDef[]; cols?: number }>(), { cols: 3 });

const form = defineModel<PagamentoFormState>({ required: true });
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <FormField
        v-if="field.type === 'text'"
        :label="field.label"
        :placeholder="field.placeholder"
        v-model="form[field.key] as string"
      />
      <SelectField
        v-else-if="field.type === 'select'"
        :label="field.label"
        :options="[...(field.options ?? [])]"
        :placeholder="field.placeholder"
        v-model="form[field.key] as string"
      />
      <ToggleRow
        v-else-if="field.type === 'toggle'"
        :label="field.label"
        :on="form[field.key] as boolean"
        spacious
        @toggle="form[field.key] = !(form[field.key] as boolean)"
      />
    </div>
  </div>
</template>
