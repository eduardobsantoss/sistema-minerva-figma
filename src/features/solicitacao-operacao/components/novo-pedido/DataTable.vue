<script setup lang="ts" generic="T extends Record<string, string>">
import { computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = withDefaults(
  defineProps<{
    cols: { key: keyof T; label: string; width: string }[];
    rows: T[];
    empty: string;
    paginated?: boolean;
    defaultPageSize?: number;
    sunken?: boolean;
    compact?: boolean;
  }>(),
  {
    paginated: true,
    defaultPageSize: 10,
    sunken: false,
    compact: false,
  },
);
const emit = defineEmits<{ remove: [i: number] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: props.defaultPageSize },
);

const displayRows = computed(() => (props.paginated ? pageItems.value : props.rows));

const template = () => `${props.cols.map((c) => c.width).join(' ')} 36px`;

function removeAt(pageIdx: number) {
  if (props.paginated) {
    emit('remove', (page.value - 1) * pageSize.value + pageIdx);
  } else {
    emit('remove', pageIdx);
  }
}
</script>

<template>
  <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: template(),
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="String(c.key)">{{ c.label }}</div>
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
        v-for="(r, i) in displayRows"
        :key="i"
        class="npm-row grid items-center"
        :style="{
          gridTemplateColumns: template(),
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div
          v-for="c in cols"
          :key="String(c.key)"
          :style="{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: c.key === cols[0].key ? 'var(--weight-bold)' : 'var(--weight-regular)',
          }"
        >
          {{ (r[c.key] as string) || '—' }}
        </div>
        <div style="text-align: center">
          <button
            class="npm-trash"
            aria-label="Remover"
            style="background: none; border: none; cursor: pointer; color: var(--danger-base); display: inline-flex"
            @click="removeAt(i)"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
      <TablePagination
        v-if="paginated"
        :sunken="sunken"
        :compact="compact"
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </template>
  </div>
</template>

<style scoped>
.npm-row .npm-trash {
  opacity: 0;
  transition: opacity 0.15s;
}
.npm-row:hover .npm-trash {
  opacity: 1;
}
</style>
