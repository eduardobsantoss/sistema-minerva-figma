<script setup lang="ts">
import { computed } from 'vue';
import { brl, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const taxa = computed(() => props.titulo.taxaEfetiva ?? 1.85);

const rows = computed(() => {
  const daily = (props.titulo.valorNominal * (taxa.value / 100)) / 252;
  return [
    { data: props.titulo.dataEmissao, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily * 3) },
    { data: props.titulo.dataEntrada, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily * 2) },
    { data: props.titulo.vencimento, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily) },
  ];
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, { defaultPageSize: 5 });
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style="text-align: right">Acumulado</div>
      </div>
      <div
        v-for="(r, i) in pageItems"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-variant-numeric: tabular-nums"
      >
        <div style="color: var(--text-muted)">{{ r.data }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.taxa }}</div>
        <div style="color: var(--text-muted)">{{ r.base }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.accrual }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right">{{ r.acumulado }}</div>
      </div>
      <TablePagination sunken compact :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
    </div>
  </Section>
</template>
