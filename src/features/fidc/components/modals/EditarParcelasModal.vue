<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Pencil } from 'lucide-vue-next';
import { brl, type ParcelaCronograma } from '../../data/fidcsData';
import EditableCell from './editar-parcelas/EditableCell.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

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
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 900px;
        max-height: 86vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Editar Parcelas
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Ajuste os valores de amortização e juros de cada parcela do cronograma
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
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

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          Valor Total: <span style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(totalGeral) }}</span>
        </div>
        <div class="flex items-center" style="gap: 12px">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            class="flex items-center"
            style="gap: 8px; height: 44px; padding: 0 24px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
            @click="emit('update', rows)"
          >
            <Pencil :size="15" /> ATUALIZAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
