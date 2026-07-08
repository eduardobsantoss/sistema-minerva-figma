<script setup lang="ts">
import type { Component } from 'vue';
import SectionGroup from './SectionGroup.vue';
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';
import SelectField from './SelectField.vue';
import AddButton from './AddButton.vue';
import DataTable from './DataTable.vue';

type RowData = {
  tipo: string;
  descricao: string;
  limite: string;
};

interface FormData {
  tipo: string;
  limite: string;
}

const props = defineProps<{
  title: string;
  icon?: Component;
  qtdLabel: string;
  qtdPlaceholder: string;
  qtdOptions?: string[];
  qtdNumeric?: boolean;
  limitePlaceholder: string;
  rows: RowData[];
  form: FormData;
}>();

const emit = defineEmits<{
  'update:form': [v: FormData];
  add: [];
  remove: [idx: number];
}>();

function setTipo(v: string) {
  emit('update:form', { ...props.form, tipo: v });
}

function setLimite(v: string) {
  emit('update:form', { ...props.form, limite: v });
}
</script>

<template>
  <SectionGroup :title="title" :icon="icon">
    <div class="grid items-end" style="grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 16px">
      <div>
        <FieldLabel>{{ qtdLabel }}</FieldLabel>
        <SelectField v-if="qtdOptions" :options="qtdOptions" @change="setTipo" />
        <Input
          v-else
          :placeholder="qtdPlaceholder"
          :model-value="form.tipo"
          :type="qtdNumeric ? 'number' : 'text'"
          @update:model-value="setTipo"
        />
      </div>
      <div>
        <FieldLabel>Limite de Concentração (%)</FieldLabel>
        <Input :placeholder="limitePlaceholder" :model-value="form.limite" @update:model-value="setLimite" />
      </div>
      <AddButton @click="emit('add')" />
    </div>

    <DataTable
      :cols="[
        { key: 'tipo', label: 'Tipo', width: '0.7fr' },
        { key: 'descricao', label: 'Descrição', width: '1.6fr' },
        { key: 'limite', label: 'Limite (%)', width: '1fr', format: (v: string) => `${v}%` },
      ]"
      :rows="rows"
      empty="Nenhum registro adicionado."
      @remove="emit('remove', $event)"
    />
  </SectionGroup>
</template>
