<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type Title, type TitleStatus } from '../data/fidcsData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const statusTone: Record<TitleStatus, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

interface Props {
  rows: Title[];
  /** classId → class display label (e.g. { leite: 'LEITE', animais: 'ANIMAIS' }) */
  classMap?: Record<string, string>;
  selectable?: boolean;
}

const props = withDefaults(defineProps<Props>(), { selectable: false });
const emit = defineEmits<{ open: [t: Title] }>();
const selectedIds = defineModel<string[]>('selectedIds', { default: () => [] });

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const hasClass = computed(() => !!props.classMap);

const cols = computed(() => {
  const base = hasClass.value
    ? '0.5fr 1fr 0.65fr 1.5fr 1.5fr 0.95fr 1fr 0.9fr'
    : '1fr 0.7fr 1.6fr 1.6fr 1fr 1.1fr 1fr';
  return props.selectable ? `36px ${base}` : base;
});

const pageIds = computed(() => pageItems.value.map((t) => t.id));
const pageAllSelected = computed(
  () => pageIds.value.length > 0 && pageIds.value.every((id) => selectedIds.value.includes(id)),
);
const pageSomeSelected = computed(
  () => pageIds.value.some((id) => selectedIds.value.includes(id)) && !pageAllSelected.value,
);

function togglePage() {
  const next = new Set(selectedIds.value);
  if (pageAllSelected.value) {
    for (const id of pageIds.value) next.delete(id);
  } else {
    for (const id of pageIds.value) next.add(id);
  }
  selectedIds.value = [...next];
}

function toggleRow(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = [...next];
}

const rowHover = ref<string | null>(null);
</script>

<template>
  <div>
    <!-- Sem resultados -->
    <div
      v-if="!rows.length"
      style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Nenhum título encontrado.
    </div>

    <template v-else>
      <!-- Cabeçalho -->
      <div
        class="grid items-center"
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
        <div v-if="selectable" @click.stop>
          <Checkbox :checked="pageAllSelected" :indeterminate="pageSomeSelected" @change="togglePage" />
        </div>
        <div v-if="hasClass">Classe</div>
        <div>Nº Título</div>
        <div>Lastro</div>
        <div>Cedente</div>
        <div>Sacado</div>
        <div>Vencimento</div>
        <div style="text-align: right">VR. Nominal</div>
        <div style="text-align: center">Status</div>
      </div>

      <!-- Linhas -->
      <div
        v-for="t in pageItems"
        :key="t.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: selectable && selectedIds.includes(t.id)
            ? 'var(--surface-selected)'
            : rowHover === t.id
              ? 'var(--surface-sunken)'
              : 'transparent',
        }"
        @click="emit('open', t)"
        @mouseenter="rowHover = t.id"
        @mouseleave="rowHover = null"
      >
        <div v-if="selectable" @click.stop>
          <Checkbox :checked="selectedIds.includes(t.id)" @change="toggleRow(t.id)" />
        </div>
        <div v-if="hasClass && classMap?.[t.classId]">
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 4px 8px;
              border-radius: var(--radius-sm);
              background: var(--status-neutral-bg);
              color: var(--status-neutral-text);
              white-space: nowrap;
            "
          >
            {{ classMap[t.classId] }}
          </span>
        </div>
        <div v-else-if="hasClass" />

        <div
          style="
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          #{{ t.numero }}
        </div>

        <div>
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.10em;
              padding: 4px 8px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
            "
          >
            {{ t.lastro.replace('_', '-') }}
          </span>
        </div>

        <div>
          <div style="color: var(--text-strong); font-weight: var(--weight-semibold)">
            {{ t.cedente }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ t.cedenteCnpj }}
          </div>
        </div>

        <div>
          <div style="color: var(--text-strong); font-weight: var(--weight-semibold)">
            {{ t.sacado }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ t.sacadoCnpj }}
          </div>
        </div>

        <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ t.vencimento }}
        </div>

        <div
          :style="{
            fontWeight: 'var(--weight-bold)',
            color: t.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
          }"
        >
          {{ brl(t.vrNominal) }}
        </div>

        <div style="text-align: center">
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: statusTone[t.status].bg,
              color: statusTone[t.status].fg,
            }"
          >
            {{ t.status }}
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
    </template>
  </div>
</template>
