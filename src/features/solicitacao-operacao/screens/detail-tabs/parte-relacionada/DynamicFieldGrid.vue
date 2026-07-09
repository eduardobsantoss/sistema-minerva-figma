<script setup lang="ts">
import { computed } from 'vue';
import type { ParteRelacionada } from '../../../data/operacaoData';
import type { ParteFieldDef } from '../../../data/parteRelacionadaFields';
import { visibleParteFields, parteFieldValue } from '../../../data/parteRelacionadaFields';
import { Field } from '../shared';

const props = defineProps<{
  parte: ParteRelacionada;
  fields: ParteFieldDef[];
  cols?: number;
}>();

const visible = computed(() => visibleParteFields(props.parte, props.fields));
const gridCols = computed(() => props.cols ?? 3);
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '24px' }">
    <div
      v-for="field in visible"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, gridCols)}` } : undefined"
    >
      <Field :label="field.label">{{ parteFieldValue(parte, field) }}</Field>
    </div>
  </div>
</template>
