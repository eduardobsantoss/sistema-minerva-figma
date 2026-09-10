<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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

const hidden = ref<Set<string>>(new Set());

watch(
  () => props.seriesLabels.join('|'),
  () => {
    hidden.value = new Set();
  },
);

function toggleSeries(label: string) {
  const next = new Set(hidden.value);
  if (next.has(label)) {
    next.delete(label);
  } else {
    const visible = props.seriesLabels.filter((l) => !next.has(l));
    if (visible.length <= 1) return;
    next.add(label);
  }
  hidden.value = next;
}

const chartData = computed(() => ({
  labels: props.points.map((p) => p.data),
  datasets: props.seriesLabels
    .map((label, i) => ({ label, i }))
    .filter(({ label }) => !hidden.value.has(label))
    .map(({ label, i }) => ({
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
    legend: { display: false },
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
    <div class="flex items-center justify-between" style="gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <div class="flex items-center" style="gap: 10px">
        <TrendingUp :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Evolução do PU das cotas
        </h3>
      </div>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <button
          v-for="(label, i) in seriesLabels"
          :key="label"
          type="button"
          :aria-pressed="!hidden.has(label)"
          :style="{
            height: '28px',
            padding: '0 10px',
            borderRadius: '9999px',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'var(--weight-bold)',
            background: hidden.has(label) ? 'var(--surface-sunken)' : 'var(--surface-card)',
            color: hidden.has(label) ? 'var(--text-muted)' : 'var(--text-strong)',
            opacity: hidden.has(label) ? 0.55 : 1,
          }"
          @click="toggleSeries(label)"
        >
          <span
            :style="{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '9999px',
              background: CHART_COLORS[i % CHART_COLORS.length],
              marginRight: '6px',
            }"
          />
          {{ label }}
        </button>
      </div>
    </div>
    <div style="height: 260px; padding: 16px 20px 20px">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
