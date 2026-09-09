<script setup lang="ts">
import { computed } from 'vue';
import { ShieldAlert, AlertTriangle, RefreshCw, Users } from 'lucide-vue-next';
import KpiStripCard from '../../../../components/KpiStripCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import PddEstresseChart from '../../../../components/charts/PddEstresseChart.vue';
import { brl, num } from '../../../../data/passivoNovoData';
import { carteiraPctOfVp, type CarteiraBundle } from '../../../../data/carteiraData';

const props = defineProps<{ carteira: CarteiraBundle }>();

const kpis = computed(() => [
  {
    label: 'PDD total',
    value: brl(props.carteira.pddTotal, true),
    hint: carteiraPctOfVp(props.carteira.pddTotal, props.carteira.valorPresente),
    icon: ShieldAlert,
    tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  },
  {
    label: 'VP vencido',
    value: brl(props.carteira.vpVencido, true),
    hint: carteiraPctOfVp(props.carteira.vpVencido, props.carteira.valorPresente),
    icon: AlertTriangle,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
  {
    label: 'Rolagens 30 dias',
    value: num(props.carteira.rolagens30d, 0),
    hint: `${num(props.carteira.rolagens7d, 0)} nos próximos 7 dias`,
    icon: RefreshCw,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Cedentes com PDD',
    value: num(props.carteira.cedentesComPdd, 0),
    hint: `${num(props.carteira.aberturaPdd.length, 0)} linhas de PDD`,
    icon: Users,
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>
    <CarteiraTableCard
      title="Próximas mudanças de faixa PDD — 7 dias"
      :icon="RefreshCw"
      :columns="['#', 'Cedente', 'Lastros', 'Vencimento', 'Faixa atual', 'Próx. faixa', 'Muda em', 'VP', 'Farol']"
      col-template="0.4fr 1.8fr 0.7fr 1fr 1fr 1fr 0.8fr 0.9fr 0.8fr"
      :rows="carteira.mudancasFaixa.map((r, i) => [String(i + 1), r.cedente, num(r.lastros, 0), r.vencimento, r.faixaAtual, r.proxFaixa, `${r.mudaEm} dias`, brl(r.vp, true), r.farol])"
    />
    <PddEstresseChart
      :points="carteira.estressePdd"
      :periodo="carteira.estressePeriodo"
      :pdd-atual="carteira.pddTotal"
    />
  </div>
</template>
