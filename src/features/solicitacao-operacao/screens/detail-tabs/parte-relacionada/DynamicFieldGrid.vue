<script setup lang="ts">
import { computed } from 'vue';
import type { ParteRelacionada } from '../../../data/operacaoData';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import type { ParteFieldDef } from '../../../data/parteRelacionadaFields';
import { visibleParteFields, parteFieldValue } from '../../../data/parteRelacionadaFields';
import {
  NACIONALIDADE_OPTS,
  ESTADO_CIVIL_OPTS,
  REGIME_CASAMENTO_OPTS,
} from '../../../data/minutaData';
import { Field } from '../shared';
import { FormField, SelectField } from '../../../components/modals/adicionar-contrato';

const props = defineProps<{
  draft: ParteRelacionada;
  fields: ParteFieldDef[];
  cols?: number;
}>();

const visible = computed(() => visibleParteFields(props.draft, props.fields));
const gridCols = computed(() => props.cols ?? 3);

const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

const SELECT_OPTS: Partial<Record<keyof ParteRelacionada, string[]>> = {
  nacionalidade: NACIONALIDADE_OPTS,
  estadoCivil: ESTADO_CIVIL_OPTS,
  regime: REGIME_CASAMENTO_OPTS,
  estado: UF_OPTIONS,
  pais: PAIS_OPTS,
  ddi: DDI_OPTS,
};

function isSelect(key: keyof ParteRelacionada): boolean {
  return key in SELECT_OPTS;
}

function strVal(key: keyof ParteRelacionada): string {
  const raw = props.draft[key];
  if (raw === undefined || raw === null) return '';
  if (typeof raw === 'boolean' || Array.isArray(raw)) return '';
  return String(raw);
}

function setStr(key: keyof ParteRelacionada, value: string) {
  (props.draft as unknown as Record<string, unknown>)[key as string] = value;
}

function onPaisChange(v: string) {
  props.draft.pais = v;
  const match = PAISES_DDI.find((p) => p.pais === v);
  if (match) props.draft.ddi = match.ddi;
}
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '20px' }">
    <template v-for="field in visible" :key="field.key">
      <div
        v-if="field.readonly"
        :style="field.span ? { gridColumn: `span ${Math.min(field.span, gridCols)}` } : undefined"
      >
        <Field :label="field.label">{{ parteFieldValue(draft, field) }}</Field>
      </div>
      <SelectField
        v-else-if="isSelect(field.key)"
        :label="field.label"
        :options="SELECT_OPTS[field.key]!"
        placeholder="Selecione"
        :span="field.span"
        :model-value="strVal(field.key)"
        @update:model-value="field.key === 'pais' ? onPaisChange($event) : setStr(field.key, $event)"
      />
      <FormField
        v-else
        :label="field.label"
        :placeholder="field.key.toString().toLowerCase().includes('data') ? 'dd/mm/aaaa' : '—'"
        :span="field.span"
        :model-value="strVal(field.key)"
        @update:model-value="setStr(field.key, $event)"
      />
    </template>
  </div>
</template>
