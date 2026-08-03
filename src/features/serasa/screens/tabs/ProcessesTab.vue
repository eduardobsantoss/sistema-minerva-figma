<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
import type { SerasaProcess, SerasaProcessStatus } from '../../data/serasaTypes';
import { processStatusTone } from '../../data/serasaConstants';
import { brl } from '@/features/passivo/data/passivoData';
import { formatDateOnly } from '../../utils/serasaFormatters';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';
import RawDetailsModal from '../../components/RawDetailsModal.vue';

const props = defineProps<{ processes: SerasaProcess[] }>();

const rawPanel = ref<{ title: string; data: Record<string, unknown> } | null>(null);

interface StatusGroup {
  status: SerasaProcessStatus;
  occurrences: ProcessOccurrenceRow[];
}

interface ProcessOccurrenceRow {
  id: number;
  processNumber: string;
  status: SerasaProcessStatus;
  rawStatus?: string | null;
  court?: string | null;
  courtInstance?: string | null;
  partyRole?: string | null;
  partyName?: string | null;
  value?: number | null;
  publicationDate?: string | null;
  rawDetails: Record<string, unknown>;
}

const grouped = computed<StatusGroup[]>(() => {
  const map = new Map<SerasaProcessStatus, ProcessOccurrenceRow[]>();

  for (const proc of props.processes) {
    for (const occ of proc.occurrenceDetails) {
      const list = map.get(occ.status) ?? [];
      list.push(occ);
      map.set(occ.status, list);
    }
  }

  return Array.from(map.entries()).map(([status, occurrences]) => ({
    status,
    occurrences,
  }));
});
</script>

<template>
  <EmptyState
    v-if="processes.length === 0"
    :icon="CheckCircle2"
    title="Nenhum processo encontrado"
    hint="Não há processos judiciais registrados para este documento."
  />

  <div v-else class="flex flex-col" style="gap: 20px">
    <div
      v-for="group in grouped"
      :key="group.status"
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden"
    >
      <div class="flex items-center" style="gap: 10px; padding: 14px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: processStatusTone(group.status).bg,
            color: processStatusTone(group.status).fg,
          }"
        >
          {{ group.status.toUpperCase() }}
        </span>
        <span style="font-size: var(--text-xs); color: var(--text-muted)">
          {{ group.occurrences.length }} processo(s)
        </span>
      </div>

      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm)">
          <thead>
            <tr style="text-align: left">
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">Nº PROCESSO</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">TRIBUNAL</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">INSTÂNCIA</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">POLO</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">PARTE</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">VALOR</th>
              <th style="padding: 10px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">PUBLICAÇÃO</th>
              <th style="padding: 10px 16px"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="occ in group.occurrences"
              :key="occ.id"
              style="border-top: 1px solid var(--border-default)"
            >
              <td style="padding: 10px 16px; font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ occ.processNumber }}
              </td>
              <td style="padding: 10px 16px; color: var(--text-muted)">{{ occ.court ?? '—' }}</td>
              <td style="padding: 10px 16px; color: var(--text-muted)">{{ occ.courtInstance ?? '—' }}</td>
              <td style="padding: 10px 16px; color: var(--text-muted)">{{ occ.partyRole ?? '—' }}</td>
              <td style="padding: 10px 16px">{{ occ.partyName ?? '—' }}</td>
              <td style="padding: 10px 16px; font-variant-numeric: tabular-nums">{{ occ.value != null ? brl(occ.value) : '—' }}</td>
              <td style="padding: 10px 16px">{{ formatDateOnly(occ.publicationDate) }}</td>
              <td style="padding: 10px 16px">
                <button
                  style="font-size: var(--text-xs); color: var(--accent); background: none; border: none; cursor: pointer; font-weight: var(--weight-semibold); white-space: nowrap"
                  @click="rawPanel = { title: occ.processNumber, data: occ.rawDetails }"
                >
                  Ver dados brutos
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <RawDetailsModal
    v-if="rawPanel"
    :title="rawPanel.title"
    :data="rawPanel.data"
    @close="rawPanel = null"
  />
</template>
