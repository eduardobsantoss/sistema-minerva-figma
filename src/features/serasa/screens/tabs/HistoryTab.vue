<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp, History } from 'lucide-vue-next';
import type { HistoryItem, HistorySnapshot } from '../../data/serasaTypes';
import { queryStatusTone } from '../../data/serasaConstants';
import { formatDateTimeUtc } from '../../utils/serasaFormatters';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{
  items: HistoryItem[];
}>();

const selectedId = ref<number | null>(null);

const ordered = computed(() =>
  [...props.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
);
const chronological = computed(() => [...ordered.value].reverse());

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => ordered.value,
  { defaultPageSize: 10 },
);

const hasItems = computed(() => props.items.length > 0);
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

function stepDelta(index: number) {
  const next = chronological.value[index + 1];
  const current = chronological.value[index];
  if (!next || !current) return null;
  return delta(next.snapshot?.agroScore, current.snapshot?.agroScore);
}

function abrir(item: HistoryItem) {
  selectedId.value = selectedId.value === item.queryId ? null : item.queryId;
}
</script>

<template>
  <EmptyState
    v-if="!hasItems"
    :icon="History"
    title="Sem histórico de consultas"
    hint="As consultas realizadas no Minerva para este documento aparecerão aqui."
  />

  <div v-else class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 18px 20px">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px">
        Evolução do Score Agro
      </div>
      <div class="flex items-end" style="gap: 18px; overflow-x: auto">
        <div
          v-for="(item, index) in chronological"
          :key="item.queryId"
          class="flex items-center"
          style="gap: 18px"
        >
          <button type="button" class="flex flex-col" style="gap: 4px; background: none; border: none; padding: 0; cursor: pointer; text-align: left" @click="abrir(item)">
            <span style="font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap">{{ formatDateTimeUtc(item.createdAt) }}</span>
            <span style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ item.snapshot?.agroScore ?? '—' }}
            </span>
          </button>
          <span
            v-if="stepDelta(index)"
            class="flex items-center"
            :style="{
              gap: '2px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              fontVariantNumeric: 'tabular-nums',
              color: stepDelta(index)?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
            }"
          >
            <ArrowUp v-if="stepDelta(index)?.direction === 'up'" :size="14" />
            <ArrowDown v-else :size="14" />
            {{ stepDelta(index)?.value }}
          </span>
        </div>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm); white-space: nowrap">
          <thead>
            <tr style="background: var(--surface-sunken); text-align: left">
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">CONSULTADO EM</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">STATUS</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">SCORE AGRO</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">EVOLUÇÃO</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">RESTRIÇÕES</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">PROTESTOS</th>
              <th style="padding: 12px 16px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted)">PROCESSOS</th>
              <th style="padding: 12px 16px"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in pageItems"
              :key="item.queryId"
              style="border-top: 1px solid var(--border-default)"
            >
              <td style="padding: 12px 16px; color: var(--text-default)">{{ formatDateTimeUtc(item.createdAt) }}</td>
              <td style="padding: 12px 16px">
                <span
                  :style="{
                    fontSize: '10px',
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.08em',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: queryStatusTone(item.status).bg,
                    color: queryStatusTone(item.status).fg,
                  }"
                >
                  {{ item.status.toUpperCase() }}
                </span>
              </td>
              <td style="padding: 12px 16px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ item.snapshot?.agroScore ?? '—' }}
              </td>
              <td style="padding: 12px 16px">
                <span
                  v-if="scoreDelta(item)"
                  class="flex items-center"
                  :style="{
                    gap: '2px',
                    width: 'fit-content',
                    fontWeight: 'var(--weight-bold)',
                    fontVariantNumeric: 'tabular-nums',
                    color: scoreDelta(item)?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
                  }"
                >
                  <ArrowUp v-if="scoreDelta(item)?.direction === 'up'" :size="14" />
                  <ArrowDown v-else :size="14" />
                  {{ scoreDelta(item)?.value }}
                </span>
                <span v-else style="color: var(--text-muted)">—</span>
              </td>
              <td style="padding: 12px 16px; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ item.snapshot?.restricoes ?? '—' }}</td>
              <td style="padding: 12px 16px; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ item.snapshot?.protestos ?? '—' }}</td>
              <td style="padding: 12px 16px; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ item.snapshot?.processos ?? '—' }}</td>
              <td style="padding: 12px 16px">
                <button
                  v-if="item.status === 'Completed'"
                  type="button"
                  style="font-size: var(--text-sm); color: var(--text-link); background: none; border: none; cursor: pointer; font-weight: var(--weight-semibold)"
                  @click="abrir(item)"
                >
                  {{ selectedId === item.queryId ? 'Fechar' : 'Abrir' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="padding: 12px 16px; border-top: 1px solid var(--border-default)">
        <TablePagination
          :page="page"
          :page-size="pageSize"
          :total="total"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </div>

    <div
      v-if="selected?.snapshot"
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 18px 20px"
    >
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px">
        Consulta {{ formatDateTimeUtc(selected.createdAt) }}
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 4px">
        Evolução dos dados
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
        {{ selectedPrevious ? `Comparado com a consulta de ${formatDateTimeUtc(selectedPrevious.createdAt)}.` : 'Primeira consulta registrada para este documento.' }}
      </p>
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px">
        <div
          v-for="metric in METRICS"
          :key="metric.key"
          style="padding: 14px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
        >
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
            {{ metric.label }}
          </div>
          <div class="flex items-center" style="gap: 8px; margin-top: 8px">
            <span style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ selected.snapshot[metric.key] ?? '—' }}
            </span>
            <span
              v-if="delta(selected.snapshot[metric.key], selectedPrevious?.snapshot?.[metric.key])"
              class="flex items-center"
              :style="{
                gap: '2px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                fontVariantNumeric: 'tabular-nums',
                color: delta(selected.snapshot[metric.key], selectedPrevious?.snapshot?.[metric.key])?.direction === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
              }"
            >
              <ArrowUp v-if="delta(selected.snapshot[metric.key], selectedPrevious?.snapshot?.[metric.key])?.direction === 'up'" :size="14" />
              <ArrowDown v-else :size="14" />
              {{ delta(selected.snapshot[metric.key], selectedPrevious?.snapshot?.[metric.key])?.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
