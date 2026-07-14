<script setup lang="ts">
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@/composables/useTablePagination';

const props = withDefaults(
  defineProps<{
    total: number;
    page: number;
    pageSize: number;
    pageSizeOptions?: number[];
    /** Fundo sunken no rodapé (casando com tabelas de detalhe) */
    sunken?: boolean;
    /** Padding horizontal mais apertado */
    compact?: boolean;
  }>(),
  {
    pageSizeOptions: () => [...DEFAULT_PAGE_SIZE_OPTIONS],
    sunken: false,
    compact: false,
  },
);

const emit = defineEmits<{
  'update:page': [page: number];
  'update:pageSize': [pageSize: number];
}>();

const totalPages = () => Math.max(1, Math.ceil(props.total / props.pageSize));
const clampedPage = () => Math.min(props.page, totalPages());

const rangeLabel = () => {
  if (props.total === 0) return '0–0';
  const start = (clampedPage() - 1) * props.pageSize + 1;
  const end = Math.min(clampedPage() * props.pageSize, props.total);
  return `${start}–${end}`;
};

function pageButtonStyle(disabled: boolean) {
  return {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    background: 'var(--surface-card)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)',
  };
}

function onPageSizeChange(e: Event) {
  emit('update:pageSize', Number((e.target as HTMLSelectElement).value));
}
</script>

<template>
  <div
    class="flex items-center justify-between table-pagination"
    :class="{ 'table-pagination--sunken': sunken }"
    :style="{
      padding: compact ? '10px 16px' : '12px 16px',
      borderTop: '1px solid var(--border-default)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      background: sunken ? 'var(--surface-sunken)' : undefined,
      flexWrap: 'wrap',
      gap: '10px',
    }"
  >
    <div class="flex items-center" style="gap: 8px">
      <span>Itens por página</span>
      <select
        :value="pageSize"
        style="height: 30px; padding: 0 8px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); color: var(--text-default); font-size: var(--text-xs)"
        @change="onPageSizeChange"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
    <div class="flex items-center" style="gap: 14px">
      <span style="font-variant-numeric: tabular-nums">
        {{ rangeLabel() }} de {{ total }}
      </span>
      <div class="flex items-center" style="gap: 4px">
        <button
          type="button"
          class="flex items-center justify-center"
          :style="pageButtonStyle(clampedPage() === 1)"
          :disabled="clampedPage() === 1"
          aria-label="Primeira página"
          @click="emit('update:page', 1)"
        >
          <ChevronsLeft :size="14" />
        </button>
        <button
          type="button"
          class="flex items-center justify-center"
          :style="pageButtonStyle(clampedPage() === 1)"
          :disabled="clampedPage() === 1"
          aria-label="Página anterior"
          @click="emit('update:page', Math.max(1, clampedPage() - 1))"
        >
          <ChevronLeft :size="14" />
        </button>
        <button
          type="button"
          class="flex items-center justify-center"
          :style="pageButtonStyle(clampedPage() === totalPages())"
          :disabled="clampedPage() === totalPages()"
          aria-label="Próxima página"
          @click="emit('update:page', Math.min(totalPages(), clampedPage() + 1))"
        >
          <ChevronRight :size="14" />
        </button>
        <button
          type="button"
          class="flex items-center justify-center"
          :style="pageButtonStyle(clampedPage() === totalPages())"
          :disabled="clampedPage() === totalPages()"
          aria-label="Última página"
          @click="emit('update:page', totalPages())"
        >
          <ChevronsRight :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
