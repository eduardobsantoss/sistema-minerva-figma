<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: string; cols: string[]; rows: string[][] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div>
    <FieldLabel>{{ title }}</FieldLabel>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
      "
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols.map(() => '1fr').join(' '),
          padding: '10px 14px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div v-for="c in cols" :key="c">{{ c }}</div>
      </div>
      <div
        v-if="rows.length === 0"
        style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum registro
      </div>
      <template v-else>
        <div
          v-for="(r, i) in pageItems"
          :key="i"
          class="grid"
          :style="{
            gridTemplateColumns: cols.map(() => '1fr').join(' '),
            padding: '12px 14px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-default)',
          }"
        >
          <div v-for="(cell, j) in r" :key="j">{{ cell }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </template>
    </div>
  </div>
</template>
