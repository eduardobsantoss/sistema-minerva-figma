<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDownToLine, ArrowUpFromLine, Building2 } from 'lucide-vue-next';
import KpiStripCard from '../../../../components/KpiStripCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, num, pct } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

const props = defineProps<{ carteira: CarteiraBundle }>();

const kpis = computed(() => [
  {
    label: 'Aquisições do dia',
    value: brl(props.carteira.aquisicoesDia),
    hint: `${num(props.carteira.aquisicoesCedentes, 0)} cedentes`,
    icon: ArrowDownToLine,
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    label: 'Liquidações do dia',
    value: brl(props.carteira.liquidacoesDia),
    hint: `${num(props.carteira.liquidacoesCedentes, 0)} cedentes`,
    icon: ArrowUpFromLine,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Maior aquisição',
    value: brl(props.carteira.maiorAquisicaoValor, true),
    hint: props.carteira.maiorAquisicaoNome,
    icon: Building2,
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
  {
    label: 'Maior liquidação',
    value: brl(props.carteira.maiorLiquidacaoValor, true),
    hint: props.carteira.maiorLiquidacaoNome,
    icon: Building2,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <CarteiraTableCard
        title="Abertura das aquisições"
        :icon="ArrowDownToLine"
        :columns="['Cedente', 'Valor nominal', 'Valor aquisição', '% PL']"
        col-template="1.6fr 1fr 1fr 0.7fr"
        :rows="carteira.aberturaAquisicoes.map((r) => [r.cedente, brl(r.valorNominal, true), brl(r.valor, true), pct(r.pctPl)])"
      />
      <CarteiraTableCard
        title="Abertura das liquidações"
        :icon="ArrowUpFromLine"
        :columns="['Cedente', 'Valor nominal', 'Valor liquidação', '% PL']"
        col-template="1.6fr 1fr 1fr 0.7fr"
        :rows="carteira.aberturaLiquidacoes.map((r) => [r.cedente, brl(r.valorNominal, true), brl(r.valor, true), pct(r.pctPl)])"
      />
    </div>
  </div>
</template>
