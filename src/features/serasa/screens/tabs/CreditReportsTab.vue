<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
import type { CreditReport } from '../../data/serasaTypes';
import { categoryLabel } from '../../data/serasaConstants';
import { brl } from '@/features/passivo/data/passivoData';
import { formatDateOnly } from '../../utils/serasaFormatters';
import { TabCard, EmptyState } from '@/features/risco/screens/detail-tabs/shared';
import RawDetailsModal from '../../components/RawDetailsModal.vue';

defineProps<{ creditReports: CreditReport[] }>();

const rawPanel = ref<{ title: string; data: Record<string, unknown> } | null>(null);

function periodLabel(report: CreditReport): string {
  if (!report.oldestOccurrence && !report.newestOccurrence) return '—';
  if (report.oldestOccurrence === report.newestOccurrence) {
    return formatDateOnly(report.oldestOccurrence);
  }
  return `${formatDateOnly(report.oldestOccurrence)} – ${formatDateOnly(report.newestOccurrence)}`;
}
</script>

<template>
  <EmptyState
    v-if="creditReports.length === 0"
    :icon="CheckCircle2"
    title="Nenhuma restrição encontrada"
    hint="Não há pendências financeiras, protestos ou cheques sem fundo registrados para este documento."
  />

  <div v-else class="flex flex-col" style="gap: 16px">
    <TabCard
      v-for="report in creditReports"
      :key="report.id"
      :title="categoryLabel(report.category, report.message)"
    >
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
        {{ report.message }}
      </p>

      <div class="flex flex-wrap items-center" style="gap: 8px; margin-bottom: 16px">
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: report.occurrences > 0 ? 'var(--status-danger-bg)' : 'var(--status-success-bg)',
            color: report.occurrences > 0 ? 'var(--status-danger-text)' : 'var(--status-success-text)',
          }"
        >
          {{ report.occurrences }} ocorrência(s)
        </span>
        <span v-if="report.valueOfOccurrences != null" style="font-size: var(--text-xs); color: var(--text-muted)">
          Total: <strong style="color: var(--text-strong)">{{ brl(report.valueOfOccurrences) }}</strong>
        </span>
        <span style="font-size: var(--text-xs); color: var(--text-muted)">
          Período: {{ periodLabel(report) }}
        </span>
      </div>

      <div style="overflow-x: auto; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm)">
          <thead>
            <tr style="background: var(--surface-sunken); text-align: left">
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">CREDOR</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">VALOR</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">DATA</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">NATUREZA</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">CONTRATO</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">UF/CIDADE</th>
              <th style="padding: 10px 12px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="occ in report.occurrenceDetails"
              :key="occ.id"
              style="border-top: 1px solid var(--border-default)"
            >
              <td style="padding: 10px 12px; color: var(--text-strong); font-weight: var(--weight-semibold)">
                <div class="flex items-center" style="gap: 6px">
                  {{ occ.creditorName ?? '—' }}
                  <span
                    v-if="occ.subJudice"
                    :style="{
                      fontSize: '8px',
                      fontWeight: 'var(--weight-bold)',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      background: 'var(--status-warning-bg)',
                      color: 'var(--status-warning-text)',
                    }"
                  >
                    SUB JUDICE
                  </span>
                </div>
              </td>
              <td style="padding: 10px 12px; font-variant-numeric: tabular-nums">{{ occ.value != null ? brl(occ.value) : '—' }}</td>
              <td style="padding: 10px 12px">{{ formatDateOnly(occ.occurrenceDate) }}</td>
              <td style="padding: 10px 12px; color: var(--text-muted)">{{ occ.nature ?? '—' }}</td>
              <td style="padding: 10px 12px; color: var(--text-muted)">{{ occ.contract ?? '—' }}</td>
              <td style="padding: 10px 12px; color: var(--text-muted)">
                {{ [occ.state, occ.city].filter(Boolean).join(' / ') || '—' }}
              </td>
              <td style="padding: 10px 12px">
                <button
                  style="font-size: var(--text-xs); color: var(--accent); background: none; border: none; cursor: pointer; font-weight: var(--weight-semibold); white-space: nowrap"
                  @click="rawPanel = { title: occ.creditorName ?? 'Ocorrência', data: occ.rawDetails }"
                >
                  Ver dados brutos
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TabCard>
  </div>

  <RawDetailsModal
    v-if="rawPanel"
    :title="rawPanel.title"
    :data="rawPanel.data"
    @close="rawPanel = null"
  />
</template>
