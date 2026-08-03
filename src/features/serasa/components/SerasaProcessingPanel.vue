<script setup lang="ts">
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { DatasetProgress } from '../data/serasaTypes';
import { DATASET_LABELS } from '../data/serasaConstants';

defineProps<{
  datasets: DatasetProgress[];
  attempts: number;
}>();

function statusIcon(status: DatasetProgress['status']): Component {
  if (status === 'Completed') return CheckCircle2;
  if (status === 'Failed') return XCircle;
  return Loader2;
}

function statusColor(status: DatasetProgress['status']): string {
  if (status === 'Completed') return 'var(--status-success-text)';
  if (status === 'Failed') return 'var(--status-danger-text)';
  return 'var(--gci-base)';
}
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 24px">
    <div class="flex items-center" style="gap: 10px; margin-bottom: 20px">
      <Clock :size="18" style="color: var(--gci-base)" />
      <div>
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Consulta em andamento
        </h3>
        <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
          Aguardando retorno do Serasa. Tentativa {{ attempts }}.
        </p>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="ds in datasets"
        :key="ds.name"
        class="flex items-center"
        style="gap: 12px; padding: 12px 14px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: 1px solid var(--border-default)"
      >
        <component
          :is="statusIcon(ds.status)"
          :size="18"
          :style="{
            color: statusColor(ds.status),
            flexShrink: 0,
            animation: ds.status === 'Pending' ? 'spin 1s linear infinite' : undefined,
          }"
        />
        <div style="flex: 1; min-width: 0">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ DATASET_LABELS[ds.name] ?? ds.name }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted)">
            {{ ds.status === 'Completed' ? 'Concluído' : ds.status === 'Failed' ? 'Falhou' : 'Aguardando...' }}
          </div>
        </div>
        <div
          :style="{
            fontSize: '9px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: ds.status === 'Completed' ? 'var(--status-success-bg)' : ds.status === 'Failed' ? 'var(--status-danger-bg)' : 'var(--status-active-bg)',
            color: ds.status === 'Completed' ? 'var(--status-success-text)' : ds.status === 'Failed' ? 'var(--status-danger-text)' : 'var(--status-active-text)',
          }"
        >
          {{ ds.status.toUpperCase() }}
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 8px; margin-top: 20px">
      <div
        v-for="n in 3"
        :key="n"
        style="height: 12px; border-radius: 9999px; background: linear-gradient(90deg, var(--surface-sunken) 25%, var(--border-default) 50%, var(--surface-sunken) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
