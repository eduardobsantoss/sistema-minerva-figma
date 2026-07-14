<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import { EmptyState } from '../../shared';

const props = defineProps<{ ativo: ContratoAtivo }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.ativo.confirmacoes,
  { defaultPageSize: 10 },
);
</script>

<template>
  <EmptyState
    v-if="ativo.confirmacoes.length === 0"
    :icon="CheckCircle2"
    title="Nenhuma confirmação registrada"
    hint="As confirmações do título aparecerão aqui após serem registradas."
  />
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      style="
        grid-template-columns: 1.5fr 1fr 1fr 100px 80px;
        padding: 12px 16px;
        background: var(--surface-sunken);
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.08em;
        color: var(--text-muted);
        text-transform: uppercase;
      "
    >
      <div>Observação</div>
      <div>Confirmado por</div>
      <div>Data</div>
      <div>Status</div>
      <div>Ações</div>
    </div>
    <div
      v-for="(c, i) in pageItems"
      :key="i"
      class="grid items-center"
      style="grid-template-columns: 1.5fr 1fr 1fr 100px 80px; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="color: var(--text-default)">{{ c.observacao || '—' }}</div>
      <div>{{ c.confirmadoPor }}</div>
      <div style="font-variant-numeric: tabular-nums">{{ c.data }}</div>
      <div>{{ c.status }}</div>
      <div style="color: var(--accent); font-weight: var(--weight-semibold); cursor: pointer">Ver</div>
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
</template>
