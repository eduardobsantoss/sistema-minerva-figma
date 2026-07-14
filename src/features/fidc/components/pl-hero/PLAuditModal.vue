<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { brl, type Fidc } from '../../data/fidcsData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

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
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.50);
      backdrop-filter: blur(6px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
    @click="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 680px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: 800; color: var(--text-strong); letter-spacing: -0.02em; margin-bottom: 4px">
            Histórico — Patrimônio Líquido
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ fidc.name }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Log entries -->
      <div style="flex: 1; overflow-y: auto">
        <!-- Table header -->
        <div
          class="grid"
          style="
            grid-template-columns: 1.2fr 1.4fr 1fr;
            padding: 12px 28px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
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
    </div>
  </div>
</template>
