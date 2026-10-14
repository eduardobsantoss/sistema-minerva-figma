<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import '@/lib/chart';
import { chartBaseOptions, readToken } from './chartTokens';

const props = defineProps<{
  critico: number;
  atencao: number;
  ok: number;
}>();

const total = computed(() => props.critico + props.atencao + props.ok);

const data = computed(() => ({
  labels: ['Crítico', 'Atenção', 'Ok'],
  datasets: [
    {
      data: [props.critico, props.atencao, props.ok],
      backgroundColor: [
        readToken('--status-danger-text'),
        readToken('--status-warning-text'),
        readToken('--status-success-text'),
      ],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}));

const options = computed<ChartOptions<'doughnut'>>(() => ({
  ...chartBaseOptions(),
  cutout: '62%',
  plugins: {
    ...chartBaseOptions().plugins,
    legend: { display: false },
  },
}));
</script>

<template>
  <div v-if="total === 0" class="flex items-center justify-center" style="height: 220px; color: var(--text-muted); font-size: var(--text-sm)">
    Sem entidades no recorte
  </div>
  <div v-else style="height: 220px">
    <Doughnut :data="data" :options="options" />
  </div>
</template>
