<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Gauge, AlertTriangle, FileWarning, Banknote, Scale, Users, Trees } from 'lucide-vue-next';
import type { CreditQueryLatest } from '../data/serasaTypes';
import { CHEQUE_CATEGORIES, PROTEST_CATEGORY } from '../data/serasaConstants';
import { brl } from '@/features/passivo/data/passivoData';
import { formatPercent } from '../utils/serasaFormatters';

const props = defineProps<{ latest: CreditQueryLatest }>();

interface KpiCard {
  icon: Component;
  title: string;
  primary: string;
  secondary: string;
  tone: string;
  hidden?: boolean;
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

  return [
    {
      icon: Gauge,
      title: 'Score Agro',
      primary: latest.agroScore ? String(latest.agroScore.score) : '—',
      secondary: latest.agroScore
        ? `Prob. evento: ${formatPercent(latest.agroScore.eventProbability)}`
        : 'Indisponível',
      tone: 'var(--gci-base)',
      hidden: false,
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
  <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px">
    <div
      v-for="card in cards"
      :key="card.title"
      style="padding: 18px 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
    >
      <div class="flex items-center" style="gap: 8px; margin-bottom: 12px">
        <component :is="card.icon" :size="16" :style="{ color: card.tone }" />
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
          {{ card.title }}
        </span>
      </div>
      <div style="font-size: 28px; font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1; font-variant-numeric: tabular-nums">
        {{ card.primary }}
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 6px">
        {{ card.secondary }}
      </div>
    </div>
  </div>
</template>
