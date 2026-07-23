<script setup lang="ts">
import { computed, ref } from 'vue';
import ShowcaseSection from './ShowcaseSection.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Row {
  id: string;
  grupo: string;
  status: string;
  valor: string;
  taxa: string;
}

const rows = ref<Row[]>([
  { id: '10482', grupo: 'Agro Norte', status: 'Em análise', valor: 'R$ 1.250.000', taxa: '1,85%' },
  { id: '10491', grupo: 'Sul Invest', status: 'Aprovado', valor: 'R$ 890.400', taxa: '2,10%' },
  { id: '10503', grupo: 'Cerrado Holdings', status: 'Pendente', valor: 'R$ 2.100.000', taxa: '1,72%' },
  { id: '10518', grupo: 'Vale Verde', status: 'Em análise', valor: 'R$ 450.000', taxa: '2,45%' },
  { id: '10522', grupo: 'Costa & Cia', status: 'Reprovado', valor: 'R$ 320.000', taxa: '3,00%' },
  { id: '10530', grupo: 'Planalto Agro', status: 'Aprovado', valor: 'R$ 1.780.000', taxa: '1,90%' },
  { id: '10541', grupo: 'Rio Doce', status: 'Em análise', valor: 'R$ 610.000', taxa: '2,20%' },
  { id: '10555', grupo: 'Campo Alto', status: 'Aprovado', valor: 'R$ 990.000', taxa: '1,65%' },
]);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => rows.value,
  { defaultPageSize: 5 },
);

const gridCols = '1fr 1.4fr 1.1fr 1.2fr 0.8fr';

const headerStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: gridCols,
  gap: '12px',
  padding: '12px 16px',
  background: 'var(--surface-sunken)',
  borderBottom: '1px solid var(--border-default)',
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)' as const,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-muted)',
}));

const cellStyle = {
  display: 'grid',
  gridTemplateColumns: gridCols,
  gap: '12px',
  padding: '14px 16px',
  borderBottom: '1px solid var(--border-default)',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-default)',
  alignItems: 'center',
};
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Tabela + paginação"
      description="Header uppercase muted; células --text-sm; valores com tabular-nums. Rodapé: TablePagination."
      token="TablePagination · useTablePagination"
    >
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div :style="headerStyle">
          <span>Nº</span>
          <span>Grupo</span>
          <span>Status</span>
          <span>Valor</span>
          <span>Taxa</span>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          :style="cellStyle"
        >
          <span style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ row.id }}
          </span>
          <span>{{ row.grupo }}</span>
          <span>{{ row.status }}</span>
          <span style="font-variant-numeric: tabular-nums">{{ row.valor }}</span>
          <span style="font-variant-numeric: tabular-nums">{{ row.taxa }}</span>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          sunken
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Regras tipográficas"
      description="Não misturar pesos/tamanhos inventados nas colunas — siga Tipografia → Onde usar."
    >
      <ul
        style="
          margin: 0;
          padding-left: 18px;
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.6;
        "
      >
        <li>Header: 10px, bold, uppercase, letter-spacing ~0.08em, --text-muted</li>
        <li>Célula: --text-sm, --text-default; IDs em --weight-semibold + --text-strong</li>
        <li>Números/moeda/taxa: font-variant-numeric: tabular-nums</li>
        <li>Container: border + --radius-xl; zebra opcional via --surface-sunken no header/footer</li>
      </ul>
    </ShowcaseSection>
  </div>
</template>
