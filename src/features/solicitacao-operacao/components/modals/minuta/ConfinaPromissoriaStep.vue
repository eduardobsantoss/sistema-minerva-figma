<script setup lang="ts">
import { computed } from 'vue';
import { brl } from '../../../data/operacaoData';
import { StepGrid, FormField, SelectField, ToggleRow } from '../adicionar-contrato';
import { CONFINA_FILIAL_OPTS, type ConfinaOperacaoForm, type ConfinaPromissoriaForm } from '../../../data/minutaData';
import { simulatePromissoryNote } from '@/features/cra/data/simuladorData';
import ConfinaPreviaSimulacao from './ConfinaPreviaSimulacao.vue';

const form = defineModel<ConfinaPromissoriaForm>({ required: true });
const props = defineProps<{ operacao: ConfinaOperacaoForm }>();

function parseNum(v: string) {
  return Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

const feeEstimado = computed(() => {
  const qty = parseNum(props.operacao.quantidadeAnimais);
  const unit = parseNum(props.operacao.valorUnitarioArroba);
  const weight = parseNum(props.operacao.pesoLoteArroba);
  const rate = parseNum(props.operacao.taxaJuros);
  const feePct = parseNum(form.value.feeMonitoramento);
  if (!qty || !unit || !weight) return '—';
  const sim = simulatePromissoryNote({
    animalsQuantity: qty,
    unitValue: unit,
    batchWeightInArroba: weight,
    rate,
    issueDate: props.operacao.emissao,
    dueDate: props.operacao.vencimento,
  });
  return brl(sim.valorNominal * (feePct / 100));
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <FormField label="Número do título" placeholder="—" :span="4" v-model="form.numeroTitulo" />
      <SelectField
        label="Filial / Outorgante"
        :options="[...CONFINA_FILIAL_OPTS]"
        placeholder="Selecione"
        :span="8"
        v-model="form.filialOutorgante"
      />
      <FormField label="FEE monitoramento (%)" placeholder="0" :span="4" v-model="form.feeMonitoramento" />
      <FormField label="Prazo de assinatura (dias)" placeholder="0" :span="4" v-model="form.prazoAssinaturaDias" />
      <FormField label="Vigência do Contrato (meses)" placeholder="0" :span="4" v-model="form.vigenciaMeses" />
      <div :style="{ gridColumn: 'span 12' }">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Valor FEE monitoramento (estimado)
        </div>
        <div
          style="
            height: 40px;
            padding: 0 14px;
            display: flex;
            align-items: center;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ feeEstimado }}
        </div>
      </div>
    </StepGrid>

    <ToggleRow
      label="Enviar cópia da notificação para o e-mail do certificador"
      :on="form.enviarCopiaCertificador"
      spacious
      @toggle="form.enviarCopiaCertificador = !form.enviarCopiaCertificador"
    />

    <ConfinaPreviaSimulacao :operacao="operacao" />
  </div>
</template>
