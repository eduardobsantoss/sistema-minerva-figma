<script setup lang="ts">
import { computed, type Component } from 'vue';
import { ArrowDown, ArrowUp, Gauge, AlertTriangle, FileWarning, Banknote, Scale, Users, Trees } from 'lucide-vue-next';
import type { CreditQueryLatest } from '../data/serasaTypes';
import { CHEQUE_CATEGORIES, PROTEST_CATEGORY } from '../data/serasaConstants';
import { brl } from '@/features/passivo/data/passivoData';
import { formatPercent } from '../utils/serasaFormatters';

const props = defineProps<{
  latest: CreditQueryLatest;
  previousScore?: number | null;
}>();

interface ScoreDelta {
  direction: 'up' | 'down';
  value: number;
}

interface KpiCard {
  icon: Component;
  title: string;
  primary: string;
  secondary: string;
  tone: string;
  delta?: ScoreDelta | null;
}

const cards = computed<KpiCard[]>(() => {
  const { latest } = props;
  const reports = latest.creditReports ?? [];
  const processes = latest.processes ?? [];
  const slaveLabor = latest.slaveLaborRestrictions ?? [];
  const ibama = latest.ibamaRestrictions ?? [];

  const totalOccurrences = reports.reduce((s, r) => s + r.occurrences, 0);
  const totalValue = reports.reduce((s, r) => s + (r.valueOfOccurrences ?? 0), 0);

  const protestReports = reports.filter((r) => r.category === PROTEST_CATEGORY);
  const protestOcc = protestReports.reduce((s, r) => s + r.occurrences, 0);
  const protestVal = protestReports.reduce((s, r) => s + (r.valueOfOccurrences ?? 0), 0);

  const chequeReports = reports.filter((r) => CHEQUE_CATEGORIES.has(r.category));
  const chequeOcc = chequeReports.reduce((s, r) => s + r.occurrences, 0);
  const chequeVal = chequeReports.reduce((s, r) => s + (r.valueOfOccurrences ?? 0), 0);

  const procOcc = processes.reduce((s, p) => s + p.occurrences, 0);
  const procVal = processes.reduce((s, p) => s + (p.valueOfOccurrences ?? 0), 0);

  const slaveActive = slaveLabor.filter((i) => !i.registryInclusionEndDate).length;
  const currentScore = latest.agroScore?.score ?? null;
  const previous = props.previousScore ?? null;
  const delta: ScoreDelta | null = currentScore != null && previous != null && currentScore !== previous
    ? { direction: currentScore > previous ? 'up' : 'down', value: Math.abs(currentScore - previous) }
    : null;

  return [
    {
      icon: Gauge,
      title: 'Score Agro',
      primary: latest.agroScore ? String(latest.agroScore.score) : '—',
      secondary: latest.agroScore
        ? `Prob. evento: ${formatPercent(latest.agroScore.eventProbability)}`
        : 'Indisponível',
      tone: 'var(--gci-base)',
      delta,
    },
    {
      icon: AlertTriangle,
      title: 'Total de restrições',
      primary: String(totalOccurrences),
      secondary: brl(totalValue),
      tone: totalOccurrences > 0 ? 'var(--danger-base)' : 'var(--status-success-text)',
    },
    {
      icon: FileWarning,
      title: 'Protestos',
      primary: String(protestOcc),
      secondary: brl(protestVal),
      tone: protestOcc > 0 ? 'var(--warning-base)' : 'var(--status-success-text)',
    },
    {
      icon: Banknote,
      title: 'Cheques sem fundo',
      primary: String(chequeOcc),
      secondary: brl(chequeVal),
      tone: chequeOcc > 0 ? 'var(--warning-base)' : 'var(--status-success-text)',
    },
    {
      icon: Scale,
      title: 'Processos judiciais',
      primary: String(procOcc),
      secondary: brl(procVal),
      tone: procOcc > 0 ? 'var(--danger-base)' : 'var(--status-success-text)',
    },
    {
      icon: Users,
      title: 'Trabalho Escravo',
      primary: String(slaveLabor.length),
      secondary: slaveActive > 0 ? `${slaveActive} na lista` : 'Nenhum ativo',
      tone: slaveActive > 0 ? 'var(--danger-base)' : 'var(--status-success-text)',
    },
    {
      icon: Trees,
      title: 'IBAMA',
      primary: String(ibama.length),
      secondary: ibama.length > 0 ? 'Ocorrências ambientais' : 'Sem restrições',
      tone: ibama.length > 0 ? 'var(--warning-base)' : 'var(--status-success-text)',
    },
  ];
});
</script>

<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px">
    <div
      v-for="card in cards"
      :key="card.title"
      style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 14px 16px; background: var(--surface-sunken)"
    >
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 8px">{{ card.title }}</div>
      <div class="flex items-center" style="gap: 7px">
        <component :is="card.icon" :size="15" style="color: var(--text-muted)" />
        <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ card.primary }}
        </span>
        <span
          v-if="card.delta"
          class="flex items-center"
          :style="{
            gap: '2px',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            fontVariantNumeric: 'tabular-nums',
            color: card.delta.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
          }"
        >
          <ArrowUp v-if="card.delta.direction === 'up'" :size="16" />
          <ArrowDown v-else :size="16" />
          {{ card.delta.value }}
        </span>
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 6px">
        {{ card.secondary }}
      </div>
    </div>
  </div>
</template>
