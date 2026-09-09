<script setup lang="ts">
import { computed } from 'vue';
import { ShieldAlert, TrendingUp, Layers, RefreshCw, AlertTriangle, Calendar } from 'lucide-vue-next';
import KpiStripCard from '../../../../components/KpiStripCard.vue';
import CarteiraTableCard from '../../../../components/CarteiraTableCard.vue';
import PddWaterfallChart from '../../../../components/charts/PddWaterfallChart.vue';
import { brl, num } from '../../../../data/passivoNovoData';
import type { CarteiraBundle } from '../../../../data/carteiraData';

const props = defineProps<{ carteira: CarteiraBundle }>();

const aumento = computed(() => {
  const base = props.carteira.waterfall.find((s) => s.kind === 'base')?.delta ?? 0;
  const projected = props.carteira.waterfall.find((s) => s.kind === 'proj')?.delta ?? 0;
  return projected - base;
});

const proj = computed(() => props.carteira.waterfall.find((s) => s.kind === 'proj')?.delta ?? 0);

const kpis = computed(() => [
  { label: 'PDD atual', value: brl(props.carteira.pddTotal, true), icon: ShieldAlert, tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
  { label: 'Aumento projetado', value: brl(aumento.value, true), icon: TrendingUp, tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' } },
  { label: 'PDD projetado', value: brl(proj.value, true), icon: Layers, tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { label: 'Mudanças de faixa', value: num(props.carteira.mudancasFaixa.length, 0), icon: RefreshCw, tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' } },
]);

function janelaRows(rows: CarteiraBundle['vencidosJanelas'][number]['rows']) {
  return rows.map((r) => [r.rolagem, r.sacado, brl(r.vpRisco, true), r.atraso === 0 ? '0' : num(r.atraso, 0)]);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>
    <PddWaterfallChart :steps="carteira.waterfall" :periodo="carteira.waterfallPeriodo" />
    <div>
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
        Vencidos
      </h3>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <CarteiraTableCard
          v-for="janela in carteira.vencidosJanelas"
          :key="janela.id"
          :title="janela.periodo"
          :icon="AlertTriangle"
          :columns="['Rolagem', 'Sacado', 'VP risco', 'Atraso']"
          col-template="1fr 1.6fr 1fr 0.7fr"
          :rows="janelaRows(janela.rows)"
        />
      </div>
    </div>
    <div>
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
        A vencer
      </h3>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <CarteiraTableCard
          v-for="janela in carteira.aVencerJanelas"
          :key="janela.id"
          :title="janela.periodo"
          :icon="Calendar"
          :columns="['Rolagem', 'Sacado', 'VP risco', 'Atraso']"
          col-template="1fr 1.6fr 1fr 0.7fr"
          :rows="janelaRows(janela.rows)"
        />
      </div>
    </div>
  </div>
</template>
