<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import '@/lib/chart';
import { chartBaseOptions, readToken } from './chartTokens';

const props = defineProps<{
  labels: string[];
  valores: number[];
}>();

const data = computed(() => {
  const color = readToken('--status-danger-text');
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Alertas',
        data: props.valores,
        borderColor: color,
        backgroundColor: readToken('--status-danger-bg'),
        pointBackgroundColor: color,
        pointRadius: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };
});

const options = computed<ChartOptions<'line'>>(() => {
  const base = chartBaseOptions();
  return {
    ...base,
    plugins: {
      ...base.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: readToken('--text-muted'), font: { family: 'Inter', size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: readToken('--text-muted'), font: { family: 'Inter', size: 11 } },
        grid: { color: readToken('--border-default') },
      },
    },
  };
});
</script>

<template>
  <div style="height: 220px">
    <Line :data="data" :options="options" />
  </div>
</template>
