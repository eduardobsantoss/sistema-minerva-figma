<script setup lang="ts">
import { computed } from 'vue';
import {
  Briefcase, Users, Calendar, Percent, Landmark, Wallet,
} from 'lucide-vue-next';
import KpiStripCard from '../../../../components/KpiStripCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import { brl, num, pct } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

const props = defineProps<{ carteira: CarteiraBundle }>();

const kpis = computed(() => [
  { label: 'Valor nominal', value: brl(props.carteira.valorNominal), icon: Briefcase, tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { label: 'Valor presente', value: brl(props.carteira.valorPresente), icon: Landmark, tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { label: 'Cedentes', value: num(props.carteira.cedentes, 0), icon: Users, tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' } },
  { label: 'Sacados', value: num(props.carteira.sacados, 0), icon: Users, tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
  { label: 'Prazo médio', value: `${num(props.carteira.prazoMedioDias, 0)} dias`, icon: Calendar, tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' } },
  { label: 'Taxa média', value: pct(props.carteira.taxaMediaPct), icon: Percent, tone: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' } },
  { label: 'Carrego CRA', value: pct(props.carteira.carregoCraPct), hint: props.carteira.carregoCraAa, icon: Percent, tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { label: 'Pre fixado', value: brl(props.carteira.preFixado, true), icon: Wallet, tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { label: 'Pos fixado', value: brl(props.carteira.posFixado, true), icon: Wallet, tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' } },
]);

function concRows(rows: CarteiraBundle['topCedentes']) {
  return rows.map((r, i) => [String(i + 1), r.nome, num(r.lastros, 0), brl(r.vpLiquido, true), pct(r.pctBase)]);
}

const COLS = '0.4fr 1.8fr 0.8fr 1fr 0.8fr';
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <CarteiraTableCard
        title="Concentração Top 10 cedentes"
        :icon="Users"
        :columns="['#', 'Nome', 'Lastros', 'VP líquido', '% base']"
        :col-template="COLS"
        :rows="concRows(carteira.topCedentes)"
      />
      <CarteiraTableCard
        title="Concentração Top 10 sacados"
        :icon="Users"
        :columns="['#', 'Nome', 'Lastros', 'VP líquido', '% base']"
        :col-template="COLS"
        :rows="concRows(carteira.topSacados)"
      />
    </div>
  </div>
</template>
