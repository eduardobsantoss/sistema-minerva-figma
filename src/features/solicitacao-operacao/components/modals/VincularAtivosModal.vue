<script setup lang="ts">
import { computed, ref } from 'vue';

import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, type ContratoAtivo } from '../../data/operacaoData';
import { TITULOS_DISPONIVEIS, tituloDisponivelParaContrato } from '../../data/ativoData';
import { FormField } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; vincular: [ativos: ContratoAtivo[]] }>();

const filtroLastro = ref('');
const filtroNumeros = ref('');
const filtroDataIni = ref('');
const filtroDataFim = ref('');
const filtroSacado = ref('');
const selectedIds = ref<Set<string>>(new Set());

/** Fixed column track — total wider than modal so overflow-x scrolls. */
const COLS =
  '48px 100px 110px 72px 100px 110px 110px 110px 130px minmax(180px, 1.2fr) minmax(180px, 1.2fr) 110px 72px';
const TABLE_MIN_WIDTH = '1480px';

const titulos = computed(() => {
  const l = filtroLastro.value.trim().toLowerCase();
  const n = filtroNumeros.value.trim().toLowerCase();
  const s = filtroSacado.value.trim().toLowerCase();
  return TITULOS_DISPONIVEIS.filter((t) => {
    if (t.situacao !== 'PENDENTE') return false;
    if (l && !t.lastro.toLowerCase().includes(l)) return false;
    if (n && !t.numero.toLowerCase().includes(n)) return false;
    if (s && !t.sacado.toLowerCase().includes(s)) return false;
    return true;
  });
});

const totalSelecionado = computed(() =>
  titulos.value.filter((t) => selectedIds.value.has(t.id)).reduce((acc, t) => acc + t.valorNominal, 0),
);
const totalConfirmado = computed(() => totalSelecionado.value);
const percentual = computed(() => (totalSelecionado.value > 0 ? 100 : 0));

const allSelected = computed(
  () => titulos.value.length > 0 && titulos.value.every((t) => selectedIds.value.has(t.id)),
);
const someSelected = computed(
  () => titulos.value.some((t) => selectedIds.value.has(t.id)) && !allSelected.value,
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => titulos.value,
  { defaultPageSize: 10 },
);

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleAll() {
  const all = allSelected.value;
  const next = new Set(selectedIds.value);
  for (const t of titulos.value) {
    if (all) next.delete(t.id);
    else next.add(t.id);
  }
  selectedIds.value = next;
}

function confirmar() {
  const ativos = titulos.value
    .filter((t) => selectedIds.value.has(t.id))
    .map(tituloDisponivelParaContrato);
  emit('vincular', ativos);
}
</script>

<template>
  <AdminModal size="lg" eyebrow="Solicitação" title="Vincular Ativos" @close="emit('close')">
    <div>
      <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px">
        <FormField label="Lastro" placeholder="Buscar lastro" v-model="filtroLastro" />
        <FormField label="Números" placeholder="Buscar número" v-model="filtroNumeros" />
        <FormField label="Data criação inicial" placeholder="dd/mm/aaaa" v-model="filtroDataIni" />
        <FormField label="Data criação final" placeholder="dd/mm/aaaa" v-model="filtroDataFim" />
        <FormField label="Nome do sacado" placeholder="Buscar sacado" v-model="filtroSacado" />
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="vincular-ativos-scroll" style="overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch">
          <div :style="{ minWidth: TABLE_MIN_WIDTH }">
            <div
              class="grid items-center"
              :style="{
                gridTemplateColumns: COLS,
                columnGap: '12px',
                padding: '12px 16px',
                background: 'var(--surface-sunken)',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }"
            >
              <div class="flex items-center justify-center">
                <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="toggleAll" />
              </div>
              <div>Lastro</div>
              <div>Número</div>
              <div>Tipo</div>
              <div>Situação</div>
              <div>Confirmação</div>
              <div>Criação</div>
              <div>Emissão</div>
              <div>Valor nominal</div>
              <div>Cedente</div>
              <div>Sacado</div>
              <div>Vencimento</div>
              <div>Entrega</div>
            </div>
            <div
              v-if="titulos.length === 0"
              style="padding: 28px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
            >
              Não foi encontrado nenhum título pendente.
            </div>
            <div
              v-for="t in pageItems"
              :key="t.id"
              class="grid items-center"
              :style="{
                gridTemplateColumns: COLS,
                columnGap: '12px',
                padding: '14px 16px',
                borderTop: '1px solid var(--border-default)',
                fontSize: 'var(--text-sm)',
              }"
            >
              <div class="flex items-center justify-center">
                <Checkbox :checked="selectedIds.has(t.id)" @change="toggle(t.id)" />
              </div>
              <div style="white-space: nowrap">{{ t.lastro }}</div>
              <div style="font-weight: var(--weight-semibold); white-space: nowrap">{{ t.numero }}</div>
              <div style="white-space: nowrap">{{ t.tipoOperacao }}</div>
              <div style="white-space: nowrap">{{ t.situacao }}</div>
              <div style="white-space: nowrap">{{ t.confirmacao }}</div>
              <div style="white-space: nowrap">{{ t.dataCriacao }}</div>
              <div style="white-space: nowrap">{{ t.dataEmissao }}</div>
              <div style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ brl(t.valorNominal) }}</div>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">{{ t.cedente }}</div>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">{{ t.sacado }}</div>
              <div style="white-space: nowrap">{{ t.vencimento }}</div>
              <div>
                <span
                  :style="{
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.06em',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: t.entrega === 'FUT' ? 'var(--gci-light)' : 'var(--agro-light)',
                    color: t.entrega === 'FUT' ? 'var(--gci-base)' : 'var(--agro-base)',
                    whiteSpace: 'nowrap',
                  }"
                >
                  {{ t.entrega }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <TablePagination
          v-if="titulos.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center" style="gap: 20px; flex-wrap: wrap">
        <div>
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Total selecionado</span>
          <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalSelecionado) }}</div>
        </div>
        <div>
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Total confirmado</span>
          <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalConfirmado) }}</div>
        </div>
        <div>
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Percentual</span>
          <div style="font-weight: var(--weight-bold)">{{ percentual }}%</div>
        </div>
      </div>
      <AdminButton variant="primary" size="large" :disabled="selectedIds.size === 0" @click="confirmar">Vincular</AdminButton>
    </template>
  </AdminModal>
</template>
