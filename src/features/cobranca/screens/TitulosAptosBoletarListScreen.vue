<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Filter, ChevronDown, SlidersHorizontal, FileText } from 'lucide-vue-next';
import {
  VEICULO_OPTS,
  VEICULO_TIPO_OPTS,
  brl,
  diasParaVencer,
  isNaoBoletado,
  situacaoTituloColor,
  situacaoTituloLabel,
  statusPagamentoColor,
  statusPagamentoLabel,
  type Titulo,
} from '../data/titulosData';
import { NOTIFICACOES_CESSAO_SEED } from '../data/notificacoesCessaoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import TituloAcoesLote from '@/components/titulos/TituloAcoesLote.vue';
import type { TituloSelecionado } from '@/components/titulos/types';

const props = defineProps<{ titulos: Titulo[] }>();
const emit = defineEmits<{
  open: [id: string];
  gerarBoletos: [ids: string[]];
}>();

type ColKey =
  | 'veiculo'
  | 'lastro'
  | 'numero'
  | 'cessao'
  | 'vencimento'
  | 'diasAteVencer'
  | 'valor'
  | 'sacado'
  | 'documentoSacado'
  | 'cedente'
  | 'situacao'
  | 'statusPagamento';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'veiculo', label: 'Veículo' },
  { key: 'lastro', label: 'Lastro' },
  { key: 'numero', label: 'Número' },
  { key: 'cessao', label: 'Cessão' },
  { key: 'vencimento', label: 'Vencimento' },
  { key: 'diasAteVencer', label: 'Dias até vencer', align: 'right' },
  { key: 'valor', label: 'Valor', align: 'right' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'documentoSacado', label: 'Documento do sacado' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'situacao', label: 'Situação' },
  { key: 'statusPagamento', label: 'Status de pagamento' },
];

const COL_WIDTHS: Record<ColKey, string> = {
  veiculo: 'minmax(170px, 1.4fr)',
  lastro: 'minmax(100px, 0.8fr)',
  numero: 'minmax(150px, 1.2fr)',
  cessao: 'minmax(150px, 1.1fr)',
  vencimento: 'minmax(110px, 0.9fr)',
  diasAteVencer: 'minmax(150px, 1fr)',
  valor: 'minmax(120px, 1fr)',
  sacado: 'minmax(170px, 1.4fr)',
  documentoSacado: 'minmax(170px, 1.1fr)',
  cedente: 'minmax(170px, 1.4fr)',
  situacao: 'minmax(120px, 1fr)',
  statusPagamento: 'minmax(150px, 1.1fr)',
};

interface Filters {
  veiculoTipo: string;
  veiculoId: string;
  diasParaVencer: string;
  lastro: string;
  sacadoNome: string;
  sacadoDocumento: string;
  cedenteNome: string;
  cedenteDocumento: string;
  vencimentoDe: string;
  vencimentoAte: string;
}

const EMPTY_FILTERS: Filters = {
  veiculoTipo: '',
  veiculoId: '',
  diasParaVencer: '',
  lastro: '',
  sacadoNome: '',
  sacadoDocumento: '',
  cedenteNome: '',
  cedenteDocumento: '',
  vencimentoDe: '',
  vencimentoAte: '',
};

const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const colsMenuOpen = ref(false);
const selectedIds = ref<string[]>([]);

const cessaoPorTitulo = new Map(NOTIFICACOES_CESSAO_SEED.map((n) => [n.tituloId, n]));

function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

function brParaISO(data: string) {
  const [dd, mm, yyyy] = data.split('/');
  return dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : '';
}

const fila = computed(() => props.titulos.filter(isNaoBoletado));

const filtered = computed(() => {
  const f = applied.value;
  return fila.value.filter((t) => {
    if (f.veiculoTipo && t.veiculoTipo !== f.veiculoTipo) return false;
    if (f.veiculoId && t.veiculoId !== f.veiculoId) return false;
    if (f.diasParaVencer !== '' && diasParaVencer(t) > Number(f.diasParaVencer)) return false;
    if (f.lastro && !t.lastro.toLowerCase().includes(f.lastro.trim().toLowerCase())) return false;
    if (f.sacadoNome && !t.sacado.toLowerCase().includes(f.sacadoNome.trim().toLowerCase())) return false;
    if (f.sacadoDocumento && !apenasDigitos(t.sacadoCnpj).includes(apenasDigitos(f.sacadoDocumento))) return false;
    if (f.cedenteNome && !t.cedente.toLowerCase().includes(f.cedenteNome.trim().toLowerCase())) return false;
    if (f.cedenteDocumento && !apenasDigitos(t.cedenteCnpj).includes(apenasDigitos(f.cedenteDocumento))) {
      return false;
    }
    const iso = brParaISO(t.vencimento);
    if (f.vencimentoDe && iso < f.vencimentoDe) return false;
    if (f.vencimentoAte && iso > f.vencimentoAte) return false;
    return true;
  });
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => filtered.value, {
  defaultPageSize: 10,
});

const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => `36px ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')}`);

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

const selecionados = computed<TituloSelecionado[]>(() =>
  filtered.value
    .filter((t) => selectedIds.value.includes(t.id))
    .map((t) => ({
      id: t.id,
      lastro: t.lastro,
      numero: t.numero,
      valor: t.vrNominal,
      valorAberto: t.vrAberto,
      vencimento: t.vencimento,
    })),
);

watch(filtered, (rows) => {
  const ids = new Set(rows.map((t) => t.id));
  selectedIds.value = selectedIds.value.filter((id) => ids.has(id));
});

function handleFilter() {
  applied.value = { ...draft.value };
  setPage(1);
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  setPage(1);
  filterOpen.value = false;
}

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  visibleCols.value = next;
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < 420 && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function pillStyle(color: string) {
  return {
    gap: '6px',
    width: 'fit-content',
    fontSize: '10px',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: '0.04em',
    padding: '4px 9px',
    borderRadius: '9999px',
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    color,
    whiteSpace: 'nowrap' as const,
  };
}

function diasLabel(n: number) {
  if (n === 0) return 'Vence hoje';
  if (n > 0) return `${n} ${n === 1 ? 'dia' : 'dias'}`;
  return `Vencido há ${-n} ${-n === 1 ? 'dia' : 'dias'}`;
}

function finalizarBoletos(ids: string[]) {
  emit('gerarBoletos', ids);
  selectedIds.value = [];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Cobrança
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Títulos aptos para boletar
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'título sem boleto' : 'títulos sem boleto' }}
      </p>
    </div>

    <slot name="tabs" />

    <div class="flex items-center justify-end" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative">
        <button ref="filterBtnRef" type="button" class="apt-toolbar-btn" @click="openFilters">
          <Filter :size="15" style="color: var(--text-muted)" />
          Filtros
          <span
            v-if="activeFilterCount > 0"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              padding: 2px 8px;
              border-radius: 9999px;
              background: var(--accent-bg);
              color: var(--accent);
            "
          >
            {{ activeFilterCount }}
          </span>
          <ChevronDown
            :size="14"
            :style="{
              color: 'var(--text-muted)',
              transform: filterOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <template v-if="filterOpen">
          <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
          <div
            :style="{
              position: 'absolute',
              [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
              right: 0,
              zIndex: 31,
              width: '680px',
              maxWidth: 'calc(100vw - 48px)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              padding: '20px',
            }"
          >
            <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
              <div>
                <div class="filter-label">Tipo de veículo</div>
                <select v-model="draft.veiculoTipo" class="filter-input">
                  <option value="">Todos</option>
                  <option v-for="t in VEICULO_TIPO_OPTS" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <div class="filter-label">Veículo</div>
                <select v-model="draft.veiculoId" class="filter-input">
                  <option value="">Todos</option>
                  <option v-for="v in VEICULO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                </select>
              </div>
              <div>
                <div class="filter-label">Dias para vencer (até)</div>
                <input v-model="draft.diasParaVencer" type="number" placeholder="Ex.: 30" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Lastro</div>
                <input v-model="draft.lastro" placeholder="Código do lastro" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Sacado (nome)</div>
                <input v-model="draft.sacadoNome" placeholder="Nome do sacado" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Sacado (CPF/CNPJ)</div>
                <input v-model="draft.sacadoDocumento" placeholder="Documento do sacado" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Cedente (nome)</div>
                <input v-model="draft.cedenteNome" placeholder="Nome do cedente" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Cedente (CPF/CNPJ)</div>
                <input v-model="draft.cedenteDocumento" placeholder="Documento do cedente" class="filter-input" />
              </div>
              <div />
              <div>
                <div class="filter-label">Vencimento de</div>
                <input v-model="draft.vencimentoDe" type="date" class="filter-input" />
              </div>
              <div>
                <div class="filter-label">Vencimento até</div>
                <input v-model="draft.vencimentoAte" type="date" class="filter-input" />
              </div>
            </div>
            <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
              <button
                type="button"
                style="
                  height: 38px;
                  padding: 0 16px;
                  background: none;
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                  font-size: var(--text-sm);
                "
                @click="handleClear"
              >
                Limpar
              </button>
              <button
                type="button"
                class="flex items-center"
                style="
                  gap: 6px;
                  height: 38px;
                  padding: 0 18px;
                  background: var(--action-primary-bg);
                  color: #fff;
                  border: none;
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  font-weight: var(--weight-bold);
                  font-size: var(--text-xs);
                  letter-spacing: 0.06em;
                "
                @click="handleFilter"
              >
                <Filter :size="13" /> FILTRAR
              </button>
            </div>
          </div>
        </template>
      </div>

      <div style="position: relative">
        <button type="button" class="apt-toolbar-btn" @click="colsMenuOpen = !colsMenuOpen">
          <SlidersHorizontal :size="14" /> Colunas
        </button>
        <template v-if="colsMenuOpen">
          <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
          <div
            style="
              position: absolute;
              top: calc(100% + 8px);
              right: 0;
              z-index: 31;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-md);
              min-width: 240px;
              max-height: 360px;
              overflow-y: auto;
              padding: 8px;
            "
          >
            <div
              v-for="c in ALL_COLS"
              :key="c.key"
              class="flex items-center apt-cols-item"
              style="
                gap: 10px;
                padding: 8px 10px;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-size: var(--text-sm);
                color: var(--text-default);
              "
              @click="toggleCol(c.key)"
            >
              <div @click.stop>
                <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
              </div>
              {{ c.label }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid items-center apt-row apt-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div @click.stop>
              <Checkbox :checked="pageAllSelected" :indeterminate="pageSomeSelected" @change="togglePage" />
            </div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <FileText :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum título apto para boletar
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">
              Ajuste os filtros para ver outros resultados.
            </div>
          </div>

          <div
            v-for="t in pageItems"
            :key="t.id"
            class="grid items-center apt-row apt-body"
            :style="{
              gridTemplateColumns: gridTemplate,
              background: selectedIds.includes(t.id) ? 'var(--surface-selected)' : undefined,
            }"
            @click="emit('open', t.id)"
          >
            <div @click.stop>
              <Checkbox :checked="selectedIds.includes(t.id)" @change="toggleRow(t.id)" />
            </div>
            <div v-if="visibleCols.has('veiculo')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.veiculoNome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ t.veiculoTipo }}</div>
            </div>
            <div v-if="visibleCols.has('lastro')">
              <span
                style="
                  display: inline-block;
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.06em;
                  padding: 2px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--gci-light);
                  color: var(--gci-base);
                  border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent);
                "
              >
                {{ t.lastro }}
              </span>
            </div>
            <div
              v-if="visibleCols.has('numero')"
              style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums"
            >
              #{{ t.numero }}
            </div>
            <div v-if="visibleCols.has('cessao')">
              <template v-if="cessaoPorTitulo.get(t.id)">
                <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                  {{ cessaoPorTitulo.get(t.id)!.protocolo }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ cessaoPorTitulo.get(t.id)!.dataCessao }}
                </div>
              </template>
              <span v-else style="color: var(--text-muted)">—</span>
            </div>
            <div
              v-if="visibleCols.has('vencimento')"
              style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
            >
              {{ t.vencimento }}
            </div>
            <div
              v-if="visibleCols.has('diasAteVencer')"
              :style="{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color: diasParaVencer(t) < 0 ? 'var(--danger-base)' : 'var(--text-strong)',
              }"
            >
              {{ diasLabel(diasParaVencer(t)) }}
            </div>
            <div
              v-if="visibleCols.has('valor')"
              style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)"
            >
              {{ brl(t.vrAberto) }}
            </div>
            <div v-if="visibleCols.has('sacado')" style="font-weight: var(--weight-semibold); color: var(--text-strong)">
              {{ t.sacado }}
            </div>
            <div
              v-if="visibleCols.has('documentoSacado')"
              style="color: var(--text-default); font-variant-numeric: tabular-nums"
            >
              {{ t.sacadoCnpj }}
            </div>
            <div v-if="visibleCols.has('cedente')" style="font-weight: var(--weight-semibold); color: var(--text-strong)">
              {{ t.cedente }}
            </div>
            <div v-if="visibleCols.has('situacao')">
              <span class="flex items-center" :style="pillStyle(situacaoTituloColor(t.situacaoTitulo))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: situacaoTituloColor(t.situacaoTitulo) }" />
                {{ situacaoTituloLabel(t.situacaoTitulo) }}
              </span>
            </div>
            <div v-if="visibleCols.has('statusPagamento')">
              <span class="flex items-center" :style="pillStyle(statusPagamentoColor(t.statusPagamento))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusPagamentoColor(t.statusPagamento) }" />
                {{ statusPagamentoLabel(t.statusPagamento) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <TituloAcoesLote
      v-if="selecionados.length"
      modo="boleto"
      :titulos="selecionados"
      @boleto-gerado="finalizarBoletos"
    />
  </div>
</template>

<style scoped>
.apt-toolbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.filter-input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.apt-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.apt-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.apt-body {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.apt-body:hover {
  background: var(--surface-sunken);
}
.apt-cols-item:hover {
  background: var(--surface-sunken);
}
</style>
