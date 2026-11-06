<script setup lang="ts">

import { brl, type Fidc } from '../../data/fidcsData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{ close: [] }>();

const PL_AUDIT_LOG = [
  { dt: '22/06/2026 14:32', value: 16359182.1, user: 'Eduardo Santos' },
  { dt: '21/06/2026 09:15', value: 16120450.0, user: 'Mariana Costa' },
  { dt: '20/06/2026 16:48', value: 15987631.44, user: 'Eduardo Santos' },
  { dt: '18/06/2026 11:22', value: 15740200.0, user: 'Rafael Oliveira' },
  { dt: '15/06/2026 10:05', value: 15500000.0, user: 'Mariana Costa' },
  { dt: '10/06/2026 08:30', value: 15200000.0, user: 'Eduardo Santos' },
];

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => PL_AUDIT_LOG, { defaultPageSize: 5 });
</script>

<template>
  <AdminModal size="md" flush eyebrow="FIDC" title="Histórico — Patrimônio Líquido" :subtitle="fidc.name" @close="emit('close')">
    <div>
      <!-- Table header -->
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1.4fr 1fr;
          padding: 12px 28px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Data e Hora</div>
        <div style="text-align: center">Valor Atualizado</div>
        <div style="text-align: right">Responsável</div>
      </div>
      <div
        v-for="(entry, i) in pageItems"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1.2fr 1.4fr 1fr; padding: 16px 28px; border-top: 1px solid var(--border-default)"
      >
        <div style="font-size: var(--text-sm); color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ entry.dt }}
        </div>
        <div style="text-align: center; font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(entry.value) }}
        </div>
        <div style="text-align: right; font-size: var(--text-sm); color: var(--text-default); font-weight: var(--weight-semibold)">
          {{ entry.user }}
        </div>
      </div>
      <TablePagination
        sunken
        compact
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </AdminModal>
</template>
