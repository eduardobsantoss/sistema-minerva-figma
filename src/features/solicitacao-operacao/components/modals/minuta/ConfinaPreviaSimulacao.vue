<script setup lang="ts">
import { computed } from 'vue';
import { Calculator } from 'lucide-vue-next';
import { brl } from '../../../data/operacaoData';
import { BentoBox } from '../adicionar-contrato';
import { simulatePromissoryNote } from '@/features/cra/data/simuladorData';
import type { ConfinaOperacaoForm } from '../../../data/minutaData';

const props = defineProps<{ operacao: ConfinaOperacaoForm }>();

function parseNum(v: string) {
  return Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

const preview = computed(() => {
  const qty = parseNum(props.operacao.quantidadeAnimais);
  const unit = parseNum(props.operacao.valorUnitarioArroba);
  const weight = parseNum(props.operacao.pesoLoteArroba);
  const rate = parseNum(props.operacao.taxaJuros);
  if (!qty || !unit || !weight) return null;
  const sim = simulatePromissoryNote({
    animalsQuantity: qty,
    unitValue: unit,
    batchWeightInArroba: weight,
    rate,
    issueDate: props.operacao.emissao,
    dueDate: props.operacao.vencimento,
  });
  const totalArrobaMedio = weight / qty;
  const refComercializacao = unit > 0 ? unit * 0.03 : 0;
  return {
    ...sim,
    totalArrobaMedio,
    refComercializacao,
    taxa: rate,
    emissao: props.operacao.emissao || '—',
    vencimento: props.operacao.vencimento || '—',
  };
});
</script>

<template>
  <BentoBox v-if="preview" title="Prévia da simulação" :icon="Calculator">
    <div
      class="grid"
      style="
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px 16px;
      "
    >
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Valor de compra
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(preview.valorCompra) }}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Valor nominal
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(preview.valorNominal) }}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Total arroba médio
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ preview.totalArrobaMedio.toFixed(2) }}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Referência comercialização
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(preview.refComercializacao) }}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Prazo em dias
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ preview.dias }} dias
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Taxa juros
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ preview.taxa }}%
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Emissão
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ preview.emissao }}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          Vencimento
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ preview.vencimento }}
        </div>
      </div>
    </div>
  </BentoBox>
</template>
