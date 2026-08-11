<script setup lang="ts">
import { ref } from 'vue';
import { brl, pct, num, type SemiCota } from '../../data/semiestruturadasData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ rows: SemiCota[] }>();
const emit = defineEmits<{ open: [cotaId: string] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = 'minmax(180px, 1.8fr) minmax(110px, 0.9fr) minmax(110px, 0.9fr) minmax(140px, 1.1fr) minmax(140px, 1.1fr)';
const rowHover = ref<string | null>(null);
</script>

<template>
  <div>
    <div
      v-if="!rows.length"
      style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Nenhuma cota cadastrada.
    </div>

    <template v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          columnGap: '20px',
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Veículo Adquirente</div>
        <div style="text-align: right">% Adquirido</div>
        <div style="text-align: right">Qtd. Cotas</div>
        <div style="text-align: right">Valor Unitário</div>
        <div style="text-align: right">Valor Total</div>
      </div>

      <div
        v-for="c in pageItems"
        :key="c.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: cols,
          columnGap: '20px',
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: rowHover === c.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @click="emit('open', c.id)"
        @mouseenter="rowHover = c.id"
        @mouseleave="rowHover = null"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ c.veiculoAdquirente }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-strong); white-space: nowrap">
          {{ pct(c.percentualAdquirido) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default); white-space: nowrap">
          {{ num(c.quantidadeCotas) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">
          {{ brl(c.valorUnitario) }}
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">
          {{ brl(c.valorTotal) }}
        </div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </template>
  </div>
</template>
