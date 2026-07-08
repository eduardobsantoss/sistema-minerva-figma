<script setup lang="ts">
import { reactive } from 'vue';
import { ShieldCheck } from 'lucide-vue-next';
import type { ParametrizacaoGarantia } from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow } from './shared';

interface Props {
  data: ParametrizacaoGarantia;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoGarantia] }>();
const form = reactive<ParametrizacaoGarantia>({ ...props.data });

function handlePercentualInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.percentualGarantia = Number(target.value.replace('%', '')) || 0;
}
</script>

<template>
  <TabCard title="Garantia" :icon="ShieldCheck" has-save @save="emit('save', form)">
    <div class="flex flex-col" style="gap: 16px">
      <ToggleRow
        label="Requer confirmação de títulos de garantia"
        hint="Exige confirmação formal dos títulos oferecidos como garantia antes da liberação da operação."
        :on="form.requerConfirmacaoTitulos"
        @toggle="form.requerConfirmacaoTitulos = !form.requerConfirmacaoTitulos"
      />
      <div v-if="form.requerConfirmacaoTitulos" style="max-width: 240px">
        <FieldLabel>Percentual mínimo de garantia</FieldLabel>
        <input
          type="text"
          :value="`${form.percentualGarantia.toFixed(0)}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePercentualInput"
        />
      </div>
    </div>
  </TabCard>
</template>
