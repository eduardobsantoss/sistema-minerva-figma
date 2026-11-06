<script setup lang="ts">
import { ref, computed } from 'vue';
import { Pencil } from 'lucide-vue-next';
import { brl, type ParcelaCronograma } from '../../data/fidcsData';
import EditableCell from './editar-parcelas/EditableCell.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ cronograma: ParcelaCronograma[] }>();
const emit = defineEmits<{ close: []; update: [cronograma: ParcelaCronograma[]] }>();

const rows = ref<ParcelaCronograma[]>(props.cronograma.map((c) => ({ ...c })));

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => rows.value, { defaultPageSize: 5 });

const pageStartIndex = computed(() => (page.value - 1) * pageSize.value);

function setValor(i: number, field: 'amortizacao' | 'juros', value: string) {
  const num = Number(value.replace(',', '.')) || 0;
  rows.value = rows.value.map((r, idx) => (idx === i ? { ...r, [field]: num } : r));
}

const totalAmortizacao = computed(() => rows.value.reduce((acc, r) => acc + r.amortizacao, 0));
const totalJuros = computed(() => rows.value.reduce((acc, r) => acc + r.juros, 0));
const totalGeral = computed(() => totalAmortizacao.value + totalJuros.value);
</script>

<template>
  <AdminModal size="lg" eyebrow="FIDC" title="Editar Parcelas" subtitle="Ajuste os valores de amortização e juros de cada parcela do cronograma" @close="emit('close')">
    <div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
          <div>Vencimento</div><div>Amortização</div><div>Juros</div>
        </div>
        <div
          v-for="(r, i) in pageItems"
          :key="pageStartIndex + i"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default)"
        >
          <div style="font-size: var(--text-sm); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ r.vencimento }}</div>
          <EditableCell :value="r.amortizacao" @change="(v) => setValor(pageStartIndex + i, 'amortizacao', v)" />
          <EditableCell :value="r.juros" @change="(v) => setValor(pageStartIndex + i, 'juros', v)" />
        </div>
        <div class="grid items-center" style="grid-template-columns: 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); background: var(--surface-sunken); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          <div>Total</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(totalAmortizacao) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(totalJuros) }}</div>
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
    </div>

    <template #footer>
      <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
        Valor Total: <span style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(totalGeral) }}</span>
      </div>
      <div class="flex items-center" style="gap: 12px">
        <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton variant="primary" size="large" :icon="Pencil" @click="emit('update', rows)">Atualizar</AdminButton>
      </div>
    </template>
  </AdminModal>
</template>
