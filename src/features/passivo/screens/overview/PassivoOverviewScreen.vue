<script setup lang="ts">
import { KPIS, COTAS, type EventoPagamento } from '../../data/passivoData';
import CotaCard from './CotaCard.vue';
import KpiMiniCard from './KpiMiniCard.vue';
import EventosTable from './EventosTable.vue';

const emit = defineEmits<{
  openCota: [cotaId: string];
  openEvent: [evento: EventoPagamento];
}>();

const kpiTones = [
  { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- KPIs — padrão CRA/FIDC list -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <KpiMiniCard
        v-for="(kpi, i) in KPIS"
        :key="kpi.label"
        :icon="kpi.icon"
        :label="kpi.label"
        :value="kpi.value"
        :tone="kpiTones[i]!"
      />
    </div>

    <!-- Cards de cotas -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CotaCard
        v-for="cota in COTAS"
        :key="cota.id"
        :cota="cota"
        @open="emit('openCota', cota.id)"
      />
    </div>

    <EventosTable @open-event="emit('openEvent', $event)" />
  </div>
</template>
