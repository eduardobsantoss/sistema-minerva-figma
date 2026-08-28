<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { TrendingUp } from 'lucide-vue-next';
import '@/lib/chart';
import { pu } from '../../data/passivoNovoData';
import type { PuEvolucaoPoint } from '../../data/laminaData';

const props = defineProps<{
  points: PuEvolucaoPoint[];
  seriesLabels: string[];
}>();

const CHART_COLORS = ['#083C4A', '#0E5668', '#F27D26', '#059669'];
const CHART_HOVER = ['#062D38', '#0B4656', '#D96E1A', '#047857'];

const chartData = computed(() => ({
  labels: props.points.map((p) => p.data),
  datasets: props.seriesLabels.map((label, i) => ({
    label,
    data: props.points.map((p) => p.series[label] ?? null),
    borderColor: CHART_COLORS[i % CHART_COLORS.length],
    backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}18`,
    pointBackgroundColor: CHART_COLORS[i % CHART_COLORS.length],
    pointHoverBackgroundColor: CHART_HOVER[i % CHART_HOVER.length],
    pointRadius: 3,
    pointHoverRadius: 5,
    borderWidth: 2,
    tension: 0.25,
    fill: false,
  })),
}));

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#64748B',
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 11, weight: 600 },
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => {
          const y = ctx.parsed.y;
          if (y == null) return '';
          return ` ${ctx.dataset.label}: ${pu(y, y >= 100 ? 4 : 6)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 11, weight: 600 }, maxRotation: 0 },
    },
    y: {
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: {
        color: '#94A3AC',
        font: { size: 10 },
        padding: 8,
        callback: (v) => pu(Number(v), Number(v) >= 100 ? 2 : 4),
      },
    },
  },
};
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      overflow: hidden;
    "
  >
    <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <TrendingUp :size="16" style="color: var(--gci-base)" />
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Evolução do PU das cotas
      </h3>
    </div>
    <div style="height: 260px; padding: 16px 20px 20px">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
