<script setup lang="ts">
import { computed } from 'vue';
import { History } from 'lucide-vue-next';
import type { HistoryItem } from '../../data/serasaTypes';
import { queryStatusTone } from '../../data/serasaConstants';
import { formatDateTimeUtc } from '../../utils/serasaFormatters';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';

const props = defineProps<{
  items: HistoryItem[];
}>();

const emit = defineEmits<{ open: [queryId: number] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.items,
  { defaultPageSize: 10 },
);

const hasItems = computed(() => props.items.length > 0);
</script>

<template>
  <EmptyState
    v-if="!hasItems"
    :icon="History"
    title="Sem histórico de consultas"
    hint="As consultas realizadas no Minerva para este documento aparecerão aqui."
  />

  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
    <div style="overflow-x: auto">
      <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm)">
        <thead>
          <tr style="background: var(--surface-sunken); text-align: left">
            <th style="padding: 12px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">ID CONSULTA</th>
            <th style="padding: 12px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">STATUS</th>
            <th style="padding: 12px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">CONSULTADO EM</th>
            <th style="padding: 12px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">ATUALIZADO EM</th>
            <th style="padding: 12px 16px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted)">ERRO</th>
            <th style="padding: 12px 16px"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in pageItems"
            :key="item.queryId"
            style="border-top: 1px solid var(--border-default)"
          >
            <td style="padding: 12px 16px; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">
              {{ item.queryId }}
            </td>
            <td style="padding: 12px 16px">
              <span
                :style="{
                  fontSize: '9px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.08em',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  background: queryStatusTone(item.status).bg,
                  color: queryStatusTone(item.status).fg,
                }"
              >
                {{ item.status.toUpperCase() }}
              </span>
            </td>
            <td style="padding: 12px 16px; color: var(--text-muted)">{{ formatDateTimeUtc(item.createdAt) }}</td>
            <td style="padding: 12px 16px; color: var(--text-muted)">{{ formatDateTimeUtc(item.updatedAt) }}</td>
            <td style="padding: 12px 16px; color: var(--text-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ item.errorMessage ?? '—' }}
            </td>
            <td style="padding: 12px 16px">
              <button
                v-if="item.status === 'Completed'"
                style="font-size: var(--text-xs); color: var(--accent); background: none; border: none; cursor: pointer; font-weight: var(--weight-semibold)"
                @click="emit('open', item.queryId)"
              >
                Abrir
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
</template>
