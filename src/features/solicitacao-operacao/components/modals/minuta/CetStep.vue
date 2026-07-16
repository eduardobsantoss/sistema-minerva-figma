<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Percent } from 'lucide-vue-next';
import { brl } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField } from '../adicionar-contrato';
import type { CetForm } from '../../../data/minutaData';

const props = defineProps<{
  valorTitulo: number;
  dataEmissao: string;
  dataVencimento: string;
}>();

const form = defineModel<CetForm>({ required: true });

/** Evita loops de conversão cruzada */
const syncing = ref(false);

function parseNum(v: string): number {
  if (!v) return 0;
  return Number(String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
}

function fmtPct(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '';
  return n.toFixed(digits).replace('.', ',');
}

function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Conversões aproximadas de taxa (protótipo): dia ↔ mês ↔ ano */
function diaToMes(d: number) {
  return (Math.pow(1 + d / 100, 30) - 1) * 100;
}
function diaToAno(d: number) {
  return (Math.pow(1 + d / 100, 365) - 1) * 100;
}
function mesToDia(m: number) {
  return (Math.pow(1 + m / 100, 1 / 30) - 1) * 100;
}
function anoToDia(a: number) {
  return (Math.pow(1 + a / 100, 1 / 365) - 1) * 100;
}

watch(
  () => form.value.cetDia,
  (v) => {
    if (syncing.value) return;
    const d = parseNum(v);
    if (!v) return;
    syncing.value = true;
    form.value.cetMes = fmtPct(diaToMes(d));
    form.value.cetAno = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.cetMes,
  (v) => {
    if (syncing.value) return;
    const m = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = mesToDia(m);
    form.value.cetDia = fmtPct(d);
    form.value.cetAno = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.cetAno,
  (v) => {
    if (syncing.value) return;
    const a = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = anoToDia(a);
    form.value.cetDia = fmtPct(d);
    form.value.cetMes = fmtPct(diaToMes(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAD,
  (v) => {
    if (syncing.value) return;
    const d = parseNum(v);
    if (!v) return;
    syncing.value = true;
    form.value.taxaAM = fmtPct(diaToMes(d));
    form.value.taxaAA = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAM,
  (v) => {
    if (syncing.value) return;
    const m = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = mesToDia(m);
    form.value.taxaAD = fmtPct(d);
    form.value.taxaAA = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAA,
  (v) => {
    if (syncing.value) return;
    const a = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = anoToDia(a);
    form.value.taxaAD = fmtPct(d);
    form.value.taxaAM = fmtPct(diaToMes(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.iofValor,
  (v) => {
    if (syncing.value) return;
    const valor = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.iofPercentual = fmtPct((valor / props.valorTitulo) * 100, 2);
    syncing.value = false;
  },
);

watch(
  () => form.value.iofPercentual,
  (v) => {
    if (syncing.value) return;
    const pct = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.iofValor = fmtMoney((pct / 100) * props.valorTitulo);
    syncing.value = false;
  },
);

watch(
  () => form.value.custoEmissaoValor,
  (v) => {
    if (syncing.value) return;
    const valor = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.custoEmissaoPercentual = fmtPct((valor / props.valorTitulo) * 100, 2);
    syncing.value = false;
  },
);

watch(
  () => form.value.custoEmissaoPercentual,
  (v) => {
    if (syncing.value) return;
    const pct = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.custoEmissaoValor = fmtMoney((pct / 100) * props.valorTitulo);
    syncing.value = false;
  },
);

function parseDateBr(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

const prazoDias = computed(() => {
  const a = parseDateBr(props.dataEmissao);
  const b = parseDateBr(props.dataVencimento);
  if (!a || !b) return '—';
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return String(Math.max(0, diff));
});

const valorLiquido = computed(() => {
  const iof = parseNum(form.value.iofValor);
  const custo = parseNum(form.value.custoEmissaoValor);
  return Math.max(0, props.valorTitulo - iof - custo);
});

const valorLiquidoPct = computed(() => {
  if (props.valorTitulo <= 0) return '—';
  return fmtPct((valorLiquido.value / props.valorTitulo) * 100, 2) + '%';
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="CET — Custo Efetivo Total" :icon="Percent">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="CET dia (%)" placeholder="0,0000" required :span="4" v-model="form.cetDia" />
          <FormField label="CET mês (%)" placeholder="0,0000" required :span="4" v-model="form.cetMes" />
          <FormField label="CET ano (%)" placeholder="0,0000" required :span="4" v-model="form.cetAno" />
        </StepGrid>

        <StepGrid>
          <FormField label="IOF (Valor)" placeholder="R$ 0,00" required :span="3" v-model="form.iofValor" />
          <FormField label="IOF (%)" placeholder="0,00" required :span="3" v-model="form.iofPercentual" />
          <FormField label="Custo emissão (Valor)" placeholder="R$ 0,00" required :span="3" v-model="form.custoEmissaoValor" />
          <FormField label="Custo emissão (%)" placeholder="0,00" required :span="3" v-model="form.custoEmissaoPercentual" />
        </StepGrid>

        <StepGrid>
          <FormField
            label="Valor líquido (Valor)"
            :model-value="brl(valorLiquido)"
            disabled
            :span="3"
          />
          <FormField label="Valor líquido (%)" :model-value="valorLiquidoPct" disabled :span="3" />
          <FormField label="Valor CCB (Valor)" :model-value="brl(valorTitulo)" disabled :span="3" />
          <FormField label="Valor CCB (%)" model-value="100,00%" disabled :span="3" />
        </StepGrid>

        <StepGrid>
          <FormField label="Emissão" :model-value="dataEmissao || '—'" disabled :span="4" />
          <FormField label="Vencimento" :model-value="dataVencimento || '—'" disabled :span="4" />
          <FormField label="Prazo (dias)" :model-value="prazoDias" disabled :span="4" />
        </StepGrid>

        <StepGrid>
          <FormField label="Taxa A.D. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAD" />
          <FormField label="Taxa A.M. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAM" />
          <FormField label="Taxa A.A. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAA" />
        </StepGrid>
      </div>
    </BentoBox>
  </div>
</template>
