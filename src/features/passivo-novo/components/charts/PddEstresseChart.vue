<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { Activity } from 'lucide-vue-next';
import '@/lib/chart';
import { brl } from '../../data/passivoNovoData';
import type { PddBarPoint } from '../../data/carteiraData';

const props = defineProps<{
  points: PddBarPoint[];
  periodo: string;
  pddAtual: number;
}>();

const maior = computed(() => Math.max(...props.points.map((p) => p.valor), 0));
const variacao = computed(() => {
  const last = props.points[props.points.length - 1]?.valor ?? 0;
  const prev = props.points[props.points.length - 2]?.valor ?? last;
  return last - prev;
});

const chartData = computed(() => ({
  labels: props.points.map((p) => p.data),
  datasets: [
    {
      label: 'PDD',
      data: props.points.map((p) => p.valor),
      backgroundColor: '#F27D26',
      hoverBackgroundColor: '#D96E1A',
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 28,
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
        label: (ctx) => ` ${brl(ctx.parsed.y, true)}`,
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
        <Activity :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Estresse de PDD diário
        </h3>
      </div>
      <span style="font-size: var(--text-xs); color: var(--text-muted)">Últimos {{ points.length }} dias</span>
    </div>
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 0; border-bottom: 1px solid var(--border-default)">
      <div style="padding: 14px 16px; border-right: 1px solid var(--border-default)">
        <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">Período</p>
        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">{{ periodo }}</p>
      </div>
      <div style="padding: 14px 16px; border-right: 1px solid var(--border-default)">
        <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">PDD atual</p>
        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">{{ brl(pddAtual, true) }}</p>
      </div>
      <div style="padding: 14px 16px; border-right: 1px solid var(--border-default)">
        <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">Variação D-1</p>
        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">{{ brl(variacao) }}</p>
      </div>
      <div style="padding: 14px 16px">
        <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">Maior ponto</p>
        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">{{ brl(maior, true) }}</p>
      </div>
    </div>
    <div style="height: 240px; padding: 16px 20px 20px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
