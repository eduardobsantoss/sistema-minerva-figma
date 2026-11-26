<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp, ChevronRight, Clock, History } from 'lucide-vue-next';
import type { HistoryItem, HistorySnapshot } from '../../data/serasaTypes';
import { queryStatusLabel, queryStatusTone } from '../../data/serasaConstants';
import { formatDateTimeUtc } from '../../utils/serasaFormatters';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { EmptyState, Section } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{
  items: HistoryItem[];
}>();

const selectedId = ref<number | null>(null);

const ordered = computed(() =>
  [...props.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
);

const selected = computed(() => ordered.value.find((item) => item.queryId === selectedId.value) ?? null);
const selectedPrevious = computed(() => {
  if (!selected.value) return null;
  const index = ordered.value.findIndex((item) => item.queryId === selected.value?.queryId);
  return index >= 0 ? ordered.value[index + 1] ?? null : null;
});

const METRICS: { key: keyof HistorySnapshot; label: string }[] = [
  { key: 'agroScore', label: 'Score Agro' },
  { key: 'restricoes', label: 'Restrições' },
  { key: 'protestos', label: 'Protestos' },
  { key: 'processos', label: 'Processos' },
  { key: 'trabalhoEscravo', label: 'Trabalho escravo' },
  { key: 'ibama', label: 'IBAMA' },
];

function delta(current: number | null | undefined, previous: number | null | undefined) {
  if (current == null || previous == null || current === previous) return null;
  return { direction: current > previous ? 'up' as const : 'down' as const, value: Math.abs(current - previous) };
}

function scoreDelta(item: HistoryItem) {
  const index = ordered.value.findIndex((row) => row.queryId === item.queryId);
  const previous = index >= 0 ? ordered.value[index + 1] : null;
  return delta(item.snapshot?.agroScore, previous?.snapshot?.agroScore);
}

function metricDelta(key: keyof HistorySnapshot) {
  return delta(selected.value?.snapshot?.[key], selectedPrevious.value?.snapshot?.[key]);
}
</script>

<template>
  <EmptyState
    v-if="items.length === 0"
    :icon="History"
    title="Sem histórico de consultas"
    hint="As consultas realizadas para este documento aparecem aqui."
  />

  <Section v-else title="Linha do tempo">
    <p style="font-size: var(--text-sm); color: var(--text-muted); margin: -8px 0 12px">
      Abra uma consulta para ver a evolução dos dados.
    </p>
    <div class="flex flex-col">
      <button
        v-for="(item, index) in ordered"
        :key="item.queryId"
        type="button"
        class="hist-item flex items-center"
        style="gap: 16px; padding: 12px; background: none; border: none; border-radius: var(--radius-lg); cursor: pointer; text-align: left; width: 100%"
        @click="selectedId = item.queryId"
      >
        <div style="position: relative; width: 12px; flex-shrink: 0; align-self: flex-start">
          <span style="display: block; width: 12px; height: 12px; border-radius: var(--radius-full); background: var(--gci-base); margin-top: 4px" />
          <span v-if="index < ordered.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -28px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1; min-width: 0">
          <div class="flex flex-wrap items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
              Score Agro {{ item.snapshot?.agroScore ?? '—' }}
            </span>
            <span
              v-if="scoreDelta(item)"
              class="flex items-center"
              :style="{
                gap: '2px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                fontVariantNumeric: 'tabular-nums',
                color: scoreDelta(item)?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
              }"
            >
              <ArrowUp v-if="scoreDelta(item)?.direction === 'up'" :size="14" />
              <ArrowDown v-else :size="14" />
              {{ scoreDelta(item)?.value }}
            </span>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: queryStatusTone(item.status).bg,
                color: queryStatusTone(item.status).fg,
              }"
            >
              {{ queryStatusLabel(item.status) }}
            </span>
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ formatDateTimeUtc(item.createdAt) }}
          </div>
        </div>
        <span class="flex items-center" style="gap: 4px; flex-shrink: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-link)">
          Ver detalhe
          <ChevronRight :size="16" />
        </span>
      </button>
    </div>
  </Section>

  <AdminModal
    v-if="selected"
    eyebrow="Carteira · Histórico"
    title="Evolução dos dados"
    :subtitle="selectedPrevious ? `Comparado com a consulta de ${formatDateTimeUtc(selectedPrevious.createdAt)}.` : 'Primeira consulta registrada para este documento.'"
    size="sm"
    footer-align="end"
    @close="selectedId = null"
  >
    <div class="flex flex-col">
      <div
        v-for="metric in METRICS"
        :key="metric.key"
        class="flex items-center justify-between"
        style="gap: 12px; padding: 12px 0; border-top: 1px solid var(--border-default)"
      >
        <span style="font-size: var(--text-sm); color: var(--text-muted)">{{ metric.label }}</span>
        <span class="flex items-center" style="gap: 8px">
          <strong style="font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ selected.snapshot?.[metric.key] ?? '—' }}
          </strong>
          <span
            v-if="metricDelta(metric.key)"
            class="flex items-center"
            :style="{
              gap: '2px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              fontVariantNumeric: 'tabular-nums',
              color: metricDelta(metric.key)?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
            }"
          >
            <ArrowUp v-if="metricDelta(metric.key)?.direction === 'up'" :size="14" />
            <ArrowDown v-else :size="14" />
            {{ metricDelta(metric.key)?.value }}
          </span>
        </span>
      </div>
    </div>
    <template #footer>
      <AdminButton @click="selectedId = null">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.hist-item:hover {
  background: var(--surface-sunken);
}

.hist-item:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
</style>
