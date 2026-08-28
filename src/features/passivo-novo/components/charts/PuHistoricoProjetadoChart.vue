<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { TrendingUp } from 'lucide-vue-next';
import '@/lib/chart';
import { pu, type HistoricoPuRow } from '../../data/passivoNovoData';

const props = defineProps<{
  historico: HistoricoPuRow[];
}>();

const sorted = computed(() =>
  [...props.historico].sort((a, b) => a.dataIso.localeCompare(b.dataIso)),
);

const chartData = computed(() => ({
  labels: sorted.value.map((r) => r.data),
  datasets: [
    {
      label: 'PU divulgado',
      data: sorted.value.map((r) =>
        r.statusTaxa === 'Projetada' ? null : r.puAtualizado,
      ),
      borderColor: '#083C4A',
      backgroundColor: '#083C4A18',
      pointBackgroundColor: '#083C4A',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.2,
      spanGaps: false,
    },
    {
      label: 'PU projetado',
      data: sorted.value.map((r) => r.puProjetado ?? r.puAtualizado),
      borderColor: '#F27D26',
      backgroundColor: '#F27D2618',
      pointBackgroundColor: '#F27D26',
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      borderDash: [6, 4],
      tension: 0.2,
    },
  ],
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
          return ` ${ctx.dataset.label}: ${pu(y, 6)}`;
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
        callback: (v) => pu(Number(v), 4),
      },
    },
  },
};
</script>

<template>
  <div style="margin-bottom: 20px">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 12px">
      <TrendingUp :size="16" style="color: var(--gci-base)" />
      <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        PU histórico x projetado
      </h4>
    </div>
    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        height: 220px;
        padding: 12px 16px;
      "
    >
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
