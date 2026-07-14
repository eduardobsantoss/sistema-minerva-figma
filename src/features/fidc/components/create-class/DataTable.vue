<script setup lang="ts" generic="T extends Record<string, string>">
import { computed } from 'vue';
import RowTrash from './RowTrash.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface ColDef {
  key: string;
  label: string;
  width: string;
  format?: (v: string) => string;
}

const props = defineProps<{
  cols: ColDef[];
  rows: T[];
  empty: string;
}>();

const emit = defineEmits<{ remove: [idx: number] }>();

const template = computed(() => `${props.cols.map((c) => c.width).join(' ')} 36px`);
const { page, pageSize, total, pageItems, clampedPage, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 5 },
);

function globalIndex(localIdx: number) {
  return (clampedPage.value - 1) * pageSize.value + localIdx;
}
</script>

<template>
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
        gridTemplateColumns: template,
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="c.key">{{ c.label }}</div>
      <div />
    </div>
    <div
      v-if="rows.length === 0"
      style="padding: 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      {{ empty }}
    </div>
    <template v-else>
      <div
        v-for="(r, i) in pageItems"
        :key="globalIndex(i)"
        class="ccm-row grid items-center"
        :style="{
          gridTemplateColumns: template,
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div
          v-for="(c, ci) in cols"
          :key="c.key"
          :style="{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: ci === 0 ? 'var(--weight-bold)' : 'var(--weight-regular)',
            color: ci === 0 ? 'var(--text-strong)' : 'var(--text-default)',
          }"
        >
          {{ c.format ? c.format(r[c.key]) : r[c.key] }}
        </div>
        <div style="text-align: center">
          <RowTrash @click="emit('remove', globalIndex(i))" />
        </div>
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
</template>
