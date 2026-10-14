<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import '@/lib/chart';
import { brl } from '@/features/risco/data/riscoData';
import { chartBaseOptions, readToken } from './chartTokens';

const props = defineProps<{
  itens: { nome: string; exposicao: number }[];
}>();

const data = computed(() => ({
  labels: props.itens.map((item) => item.nome),
  datasets: [
    {
      label: 'Exposição concentrada',
      data: props.itens.map((item) => item.exposicao),
      backgroundColor: readToken('--status-warning-text'),
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 18,
    },
  ],
}));

const options = computed<ChartOptions<'bar'>>(() => {
  const base = chartBaseOptions();
  return {
    ...base,
    indexAxis: 'y',
    plugins: {
      ...base.plugins,
      legend: { display: false },
      tooltip: {
        ...base.plugins.tooltip,
        callbacks: {
          label: (ctx) => ` ${brl(ctx.parsed.x)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: readToken('--text-muted'),
          font: { family: 'Inter', size: 11 },
          callback: (value) => brl(Number(value), { compact: true }),
        },
        grid: { color: readToken('--border-default') },
      },
      y: {
        ticks: { color: readToken('--text-default'), font: { family: 'Inter', size: 11 } },
        grid: { display: false },
      },
    },
  };
});
</script>

<template>
  <div v-if="itens.length === 0" class="flex items-center justify-center" style="height: 220px; color: var(--text-muted); font-size: var(--text-sm)">
    Nenhuma concentração neste recorte
  </div>
  <div v-else style="height: 280px">
    <Bar :data="data" :options="options" />
  </div>
</template>
