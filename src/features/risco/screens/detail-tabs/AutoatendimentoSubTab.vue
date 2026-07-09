<script setup lang="ts">
import { reactive } from 'vue';
import { Zap } from 'lucide-vue-next';
import { VEICULO_OPERACAO_OPTS, type ParametrizacaoAutoatendimento } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';

interface Props {
  data: ParametrizacaoAutoatendimento;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoAutoatendimento] }>();
const form = reactive<ParametrizacaoAutoatendimento>({ ...props.data });

function handleMoneyInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.limiteOperacoesAutomaticas = Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handlePctInput(field: 'taxaFee' | 'taxaRisco' | 'taxaCessaoPadrao', e: Event) {
  const target = e.target as HTMLInputElement;
  form[field] = Number(target.value.replace('%', '').replace(',', '.')) || 0;
}
</script>

<template>
  <TabCard title="Autoatendimento" :icon="Zap" has-save @save="emit('save', form)">
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <div>
        <FieldLabel>Limite p/ operações automáticas</FieldLabel>
        <input
          type="text"
          :value="form.limiteOperacoesAutomaticas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handleMoneyInput"
        />
      </div>
      <div>
        <FieldLabel>Taxa fee padrão</FieldLabel>
        <input
          type="text"
          :value="`${form.taxaFee.toFixed(2).replace('.', ',')}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePctInput('taxaFee', $event)"
        />
      </div>
      <div>
        <FieldLabel>Taxa de risco</FieldLabel>
        <input
          type="text"
          :value="`${form.taxaRisco.toFixed(2).replace('.', ',')}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePctInput('taxaRisco', $event)"
        />
      </div>
      <div>
        <FieldLabel>Taxa de cessão padrão</FieldLabel>
        <input
          type="text"
          :value="`${form.taxaCessaoPadrao.toFixed(2).replace('.', ',')}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePctInput('taxaCessaoPadrao', $event)"
        />
      </div>
      <div style="grid-column: span 2">
        <SelectField
          label="Veículo de Operação Preferencial"
          :options="[...VEICULO_OPERACAO_OPTS]"
          :value="form.veiculoOperacaoPreferencial"
          @change="form.veiculoOperacaoPreferencial = ($event.target as HTMLSelectElement).value"
        />
      </div>
    </div>
  </TabCard>
</template>
