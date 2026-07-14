<script setup lang="ts">
import { brl, type CraTitulo } from '../../data/craData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{
  rows: CraTitulo[];
  classMap: Record<string, string>;
}>();
const emit = defineEmits<{ open: [row: CraTitulo] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

function statusStyle(s: CraTitulo['status']) {
  return {
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  }[s];
}
</script>

<template>
  <div v-if="!rows.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    Nenhum título encontrado para esta operação.
  </div>
  <div v-else>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: cols,
        padding: '14px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>Classe</div>
      <div>Nº Título</div>
      <div>Tipo</div>
      <div>Cedente</div>
      <div>Sacado</div>
      <div>Vencimento</div>
      <div>VR. Nominal</div>
      <div style="text-align: right">Status</div>
    </div>
    <div
      v-for="r in pageItems"
      :key="r.id"
      class="cra-tit-row grid items-center"
      :style="{
        gridTemplateColumns: cols,
        padding: '16px 20px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
      }"
      @click="emit('open', r)"
    >
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 8px; border-radius: var(--radius-sm); background: var(--status-neutral-bg); color: var(--status-neutral-text); white-space: nowrap">
          {{ classMap[r.operacaoId] ?? '—' }}
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        #{{ r.numero }}
      </div>
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 7px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
          {{ r.tipo }}
        </span>
      </div>
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.cedenteCnpj }}</div>
      </div>
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.sacado }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.sacadoCnpj }}</div>
      </div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.vencimento }}</div>
      <div :style="{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }">
        {{ brl(r.vrNominal) }}
      </div>
      <div style="text-align: right">
        <span
          :style="{
            fontSize: '9px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '4px 8px',
            borderRadius: '9999px',
            background: statusStyle(r.status)!.bg,
            color: statusStyle(r.status)!.fg,
          }"
        >
          {{ r.status }}
        </span>
      </div>
    </div>

    <TablePagination
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>

<style scoped>
.cra-tit-row:hover {
  background: var(--surface-sunken);
}
</style>
