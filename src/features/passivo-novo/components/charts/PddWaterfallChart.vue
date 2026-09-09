<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { Layers } from 'lucide-vue-next';
import '@/lib/chart';
import { brl } from '../../data/passivoNovoData';
import type { WaterfallStep } from '../../data/carteiraData';

const props = defineProps<{
  steps: WaterfallStep[];
  periodo: string;
}>();

const chartData = computed(() => ({
  labels: props.steps.map((s) => s.label),
  datasets: [
    {
      label: 'PDD',
      data: props.steps.map((s) => s.delta),
      backgroundColor: props.steps.map((s) => (s.kind === 'delta' ? '#F27D26' : '#083C4A')),
      hoverBackgroundColor: props.steps.map((s) => (s.kind === 'delta' ? '#D96E1A' : '#062D38')),
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 36,
    },
  ],
}));

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => {
          const step = props.steps[ctx.dataIndex];
          const prefix = step?.kind === 'delta' ? '+' : '';
          return ` ${prefix}${brl(ctx.parsed.y, true)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 10, weight: 600 }, maxRotation: 45 },
    },
    y: {
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: {
        color: '#94A3AC',
        font: { size: 10 },
        padding: 8,
        callback: (v) => brl(Number(v), true),
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
    <div class="flex items-center justify-between" style="gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <div class="flex items-center" style="gap: 10px">
        <Layers :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Projeção waterfall de PDD
        </h3>
      </div>
      <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ periodo }}</span>
    </div>
    <div style="height: 240px; padding: 16px 20px 20px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
