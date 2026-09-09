<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{
  title: string;
  icon: Component;
  columns: string[];
  colTemplate: string;
  rows: string[][];
}>();

const source = computed(() => props.rows);
const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(source, {
  defaultPageSize: 10,
});
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      overflow: hidden;
    "
  >
    <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <component :is="icon" :size="16" style="color: var(--gci-base)" />
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ title }}
      </h3>
    </div>
    <div style="overflow-x: auto">
      <div style="min-width: 640px">
        <div
          class="grid"
          :style="{
            gridTemplateColumns: colTemplate,
            padding: '12px 16px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div v-for="col in columns" :key="col">{{ col }}</div>
        </div>
        <div
          v-for="(row, i) in pageItems"
          :key="`${title}-${i}`"
          class="grid items-center"
          :style="{
            gridTemplateColumns: colTemplate,
            padding: '12px 16px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div
            v-for="(cell, ci) in row"
            :key="`${i}-${ci}`"
            :style="{
              fontWeight: ci === 1 || ci === 0 ? 'var(--weight-semibold)' : undefined,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-default)',
            }"
          >
            {{ cell }}
          </div>
        </div>
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
</template>
