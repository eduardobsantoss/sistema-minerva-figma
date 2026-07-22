<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Settings2,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  FileText,
  ScrollText,
} from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import AtivosFiltersPanel from '../components/AtivosFiltersPanel.vue';
import TabBtn from '../components/TabBtn.vue';
import {
  EMPTY_FILTERS,
  brl,
  computeKpis,
  countActiveFilters,
  filterContratos,
  filterTitulos,
  situacaoLabel,
  situacaoColor,
  statusTituloLabel,
  statusTituloColor,
  statusRegistroLabel,
  statusEntregaLabel,
  statusConfirmacaoLabel,
  statusNotificacaoLabel,
  type AtivosFilters,
  type ContratoAtivoGlobal,
  type TituloAtivoGlobal,
} from '../data/ativosData';

const props = defineProps<{
  contratos: ContratoAtivoGlobal[];
  titulos: TituloAtivoGlobal[];
}>();

const emit = defineEmits<{
  openContrato: [id: string];
  openTitulo: [id: string];
}>();

type ViewMode = 'contratos' | 'titulos';

type ContratoColKey =
  | 'numero'
  | 'qtdParcelas'
  | 'tipoAtivo'
  | 'veiculo'
  | 'valorNominal'
  | 'valorEmissao'
  | 'valorAquisicao'
  | 'valorPresente'
  | 'valorAberto'
  | 'cedente'
  | 'sacado'
  | 'dataPrimeiraEntrada'
  | 'ultimoVencimento';

type TituloColKey =
  | 'statusRegistro'
  | 'statusEntrega'
  | 'statusConfirmacao'
  | 'prazoConfirmacao'
  | 'statusNotificacao'
  | 'lastro'
  | 'numero'
  | 'veiculo'
  | 'cedente'
  | 'sacado'
  | 'gerente'
  | 'chaveNotaFiscal'
  | 'situacao'
  | 'statusTitulo'
  | 'cessao'
  | 'dataCessao'
  | 'taxaCessao'
  | 'taxaEfetiva'
  | 'indicadorTaxa'
  | 'percentualIndicador'
  | 'tipoAtivo'
  | 'dataCriacao'
  | 'dataEmissao'
  | 'valorNominal'
  | 'valorEmissao'
  | 'valorAquisicao'
  | 'valorPresente'
  | 'valorAberto'
  | 'valorVencido'
  | 'vencimento'
  | 'ultimoPagamento';

const CONTRATO_COLS: { key: ContratoColKey; label: string; align?: 'right' }[] = [
  { key: 'numero', label: 'Número do Contrato' },
  { key: 'qtdParcelas', label: 'Qtd. Parcelas', align: 'right' },
  { key: 'tipoAtivo', label: 'Tipo do Ativo' },
  { key: 'veiculo', label: 'Veículo' },
  { key: 'valorNominal', label: 'Valor Nominal', align: 'right' },
  { key: 'valorEmissao', label: 'Valor Emissão', align: 'right' },
  { key: 'valorAquisicao', label: 'Valor Aquisição', align: 'right' },
  { key: 'valorPresente', label: 'Valor Presente', align: 'right' },
  { key: 'valorAberto', label: 'Valor Aberto', align: 'right' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'dataPrimeiraEntrada', label: '1ª Entrada' },
  { key: 'ultimoVencimento', label: 'Último Vencimento' },
];

const TITULO_COLS: { key: TituloColKey; label: string; align?: 'right' }[] = [
  { key: 'statusRegistro', label: 'Status Registro' },
  { key: 'statusEntrega', label: 'Status Entrega' },
  { key: 'statusConfirmacao', label: 'Status Confirmação' },
  { key: 'prazoConfirmacao', label: 'Prazo Confirmação' },
  { key: 'statusNotificacao', label: 'Status Notificação' },
  { key: 'lastro', label: 'Lastro' },
  { key: 'numero', label: 'Número' },
  { key: 'veiculo', label: 'Veículo' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'chaveNotaFiscal', label: 'Chave NF' },
  { key: 'situacao', label: 'Situação' },
  { key: 'statusTitulo', label: 'Status Título' },
  { key: 'cessao', label: 'Cessão' },
  { key: 'dataCessao', label: 'Data Cessão' },
  { key: 'taxaCessao', label: 'Taxa Cessão', align: 'right' },
  { key: 'taxaEfetiva', label: 'Taxa Efetiva', align: 'right' },
  { key: 'indicadorTaxa', label: 'Indicador' },
  { key: 'percentualIndicador', label: '% Indicador', align: 'right' },
  { key: 'tipoAtivo', label: 'Tipo Ativo' },
  { key: 'dataCriacao', label: 'Criação' },
  { key: 'dataEmissao', label: 'Emissão' },
  { key: 'valorNominal', label: 'Valor Nominal', align: 'right' },
  { key: 'valorEmissao', label: 'Valor Emissão', align: 'right' },
  { key: 'valorAquisicao', label: 'Valor Aquisição', align: 'right' },
  { key: 'valorPresente', label: 'Valor Presente', align: 'right' },
  { key: 'valorAberto', label: 'Valor Aberto', align: 'right' },
  { key: 'valorVencido', label: 'Valor Vencido', align: 'right' },
  { key: 'vencimento', label: 'Vencimento' },
  { key: 'ultimoPagamento', label: 'Último Pagamento' },
];

const CONTRATO_COL_WIDTHS: Record<ContratoColKey, string> = {
  numero: 'minmax(160px, 1.3fr)',
  qtdParcelas: 'minmax(120px, 0.8fr)',
  tipoAtivo: 'minmax(120px, 0.9fr)',
  veiculo: 'minmax(160px, 1.3fr)',
  valorNominal: 'minmax(130px, 1fr)',
  valorEmissao: 'minmax(130px, 1fr)',
  valorAquisicao: 'minmax(130px, 1fr)',
  valorPresente: 'minmax(130px, 1fr)',
  valorAberto: 'minmax(150px, 1.1fr)',
  cedente: 'minmax(200px, 1.6fr)',
  sacado: 'minmax(180px, 1.5fr)',
  dataPrimeiraEntrada: 'minmax(120px, 0.9fr)',
  ultimoVencimento: 'minmax(130px, 0.9fr)',
};

const TITULO_COL_WIDTHS: Record<TituloColKey, string> = {
  statusRegistro: 'minmax(120px, 1fr)',
  statusEntrega: 'minmax(110px, 0.9fr)',
  statusConfirmacao: 'minmax(130px, 1fr)',
  prazoConfirmacao: 'minmax(120px, 0.9fr)',
  statusNotificacao: 'minmax(130px, 1fr)',
  lastro: 'minmax(100px, 0.8fr)',
  numero: 'minmax(110px, 0.9fr)',
  veiculo: 'minmax(150px, 1.3fr)',
  cedente: 'minmax(170px, 1.5fr)',
  sacado: 'minmax(170px, 1.5fr)',
  gerente: 'minmax(140px, 1.1fr)',
  chaveNotaFiscal: 'minmax(160px, 1.2fr)',
  situacao: 'minmax(120px, 1fr)',
  statusTitulo: 'minmax(120px, 1fr)',
  cessao: 'minmax(130px, 1fr)',
  dataCessao: 'minmax(110px, 0.9fr)',
  taxaCessao: 'minmax(100px, 0.8fr)',
  taxaEfetiva: 'minmax(100px, 0.8fr)',
  indicadorTaxa: 'minmax(100px, 0.8fr)',
  percentualIndicador: 'minmax(100px, 0.8fr)',
  tipoAtivo: 'minmax(90px, 0.7fr)',
  dataCriacao: 'minmax(110px, 0.9fr)',
  dataEmissao: 'minmax(110px, 0.9fr)',
  valorNominal: 'minmax(120px, 1fr)',
  valorEmissao: 'minmax(120px, 1fr)',
  valorAquisicao: 'minmax(120px, 1fr)',
  valorPresente: 'minmax(120px, 1fr)',
  valorAberto: 'minmax(120px, 1fr)',
  valorVencido: 'minmax(120px, 1fr)',
  vencimento: 'minmax(110px, 0.9fr)',
  ultimoPagamento: 'minmax(120px, 0.9fr)',
};

const KPI_ICONS: Component[] = [Clock, CheckCircle2, XCircle, Wallet];

const q = ref('');
const viewMode = ref<ViewMode>('contratos');
const filters = ref<AtivosFilters>({ ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [] });
const showFilters = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const colsMenuOpen = ref(false);

const visibleColsContrato = ref<Set<ContratoColKey>>(
  new Set(CONTRATO_COLS.map((c) => c.key)),
);
const visibleColsTitulo = ref<Set<TituloColKey>>(
  new Set([
    'statusRegistro',
    'statusEntrega',
    'statusConfirmacao',
    'lastro',
    'numero',
    'veiculo',
    'cedente',
    'sacado',
    'gerente',
    'situacao',
    'statusTitulo',
    'cessao',
    'tipoAtivo',
    'valorNominal',
    'valorAberto',
    'vencimento',
  ]),
);

const kpis = computed(() => computeKpis(props.titulos));
const activeFilterCount = computed(() => countActiveFilters(filters.value));

const filteredContratos = computed(() => {
  let list = filterContratos(props.contratos, props.titulos, filters.value);
  const needle = q.value.trim().toLowerCase();
  if (needle) {
    list = list.filter((c) => {
      const hay = `${c.numero} ${c.veiculoNome} ${c.cedenteNome} ${c.sacadoNome} ${c.grupoEmpresarial} ${c.tipoAtivo}`.toLowerCase();
      return hay.includes(needle);
    });
  }
  return list;
});

const filteredTitulos = computed(() => {
  let list = filterTitulos(props.titulos, filters.value);
  const needle = q.value.trim().toLowerCase();
  if (needle) {
    list = list.filter((t) => {
      const hay = `${t.numero} ${t.lastro} ${t.contratoNumero} ${t.veiculoNome} ${t.cedenteNome} ${t.sacadoNome} ${t.gerente} ${t.cessao}`.toLowerCase();
      return hay.includes(needle);
    });
  }
  return list;
});

const contratosPage = useTablePagination(() => filteredContratos.value, { defaultPageSize: 10 });
const titulosPage = useTablePagination(() => filteredTitulos.value, { defaultPageSize: 10 });

const page = computed(() => (viewMode.value === 'contratos' ? contratosPage.page.value : titulosPage.page.value));
const pageSize = computed(() =>
  viewMode.value === 'contratos' ? contratosPage.pageSize.value : titulosPage.pageSize.value,
);
const total = computed(() =>
  viewMode.value === 'contratos' ? contratosPage.total.value : titulosPage.total.value,
);
const pageContratos = computed(() => contratosPage.pageItems.value);
const pageTitulos = computed(() => titulosPage.pageItems.value);

function setPage(next: number) {
  if (viewMode.value === 'contratos') contratosPage.setPage(next);
  else titulosPage.setPage(next);
}

function setPageSize(next: number) {
  if (viewMode.value === 'contratos') contratosPage.setPageSize(next);
  else titulosPage.setPageSize(next);
}

const visibleContratoCols = computed(() =>
  CONTRATO_COLS.filter((c) => visibleColsContrato.value.has(c.key)),
);
const visibleTituloCols = computed(() =>
  TITULO_COLS.filter((c) => visibleColsTitulo.value.has(c.key)),
);

const contratoGrid = computed(() =>
  visibleContratoCols.value.map((c) => CONTRATO_COL_WIDTHS[c.key]).join(' '),
);
const tituloGrid = computed(() =>
  visibleTituloCols.value.map((c) => TITULO_COL_WIDTHS[c.key]).join(' '),
);

const filterPanelStyle = computed(() => ({
  position: 'absolute' as const,
  [filterPlacement.value === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
  left: '0px',
  zIndex: 31,
  width: '480px',
  maxWidth: 'calc(100vw - 48px)',
  maxHeight: 'min(70vh, 640px)',
  overflowY: 'auto' as const,
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-lg)',
  padding: '16px 20px',
}));

function openFilters() {
  if (!showFilters.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 560;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  showFilters.value = !showFilters.value;
}

function applyFilters(next: AtivosFilters) {
  filters.value = next;
  showFilters.value = false;
  setPage(1);
}

function clearFilters() {
  filters.value = { ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [] };
}

function setViewMode(mode: ViewMode) {
  viewMode.value = mode;
  setPage(1);
}

function toggleContratoCol(key: ContratoColKey) {
  const next = new Set(visibleColsContrato.value);
  if (next.has(key)) {
    if (next.size <= 1) return;
    next.delete(key);
  } else next.add(key);
  visibleColsContrato.value = next;
}

function toggleTituloCol(key: TituloColKey) {
  const next = new Set(visibleColsTitulo.value);
  if (next.has(key)) {
    if (next.size <= 1) return;
    next.delete(key);
  } else next.add(key);
  visibleColsTitulo.value = next;
}

function contratoCell(c: ContratoAtivoGlobal, key: ContratoColKey): string {
  switch (key) {
    case 'numero': return c.numero;
    case 'qtdParcelas': return String(c.qtdParcelas);
    case 'tipoAtivo': return c.tipoAtivo;
    case 'veiculo': return c.veiculoNome;
    case 'valorNominal': return brl(c.valorNominal);
    case 'valorEmissao': return brl(c.valorEmissao);
    case 'valorAquisicao': return brl(c.valorAquisicao);
    case 'valorPresente': return brl(c.valorPresente);
    case 'valorAberto': return brl(c.valorAberto);
    case 'cedente': return `${c.cedenteNome}\n${c.cedenteDocumento}`;
    case 'sacado': return `${c.sacadoNome}\n${c.sacadoDocumento}`;
    case 'dataPrimeiraEntrada': return c.dataPrimeiraEntrada;
    case 'ultimoVencimento': return c.ultimoVencimento;
  }
}

function tituloCell(t: TituloAtivoGlobal, key: TituloColKey): string {
  switch (key) {
    case 'statusRegistro': return statusRegistroLabel(t.statusRegistro);
    case 'statusEntrega': return statusEntregaLabel(t.statusEntrega);
    case 'statusConfirmacao': return statusConfirmacaoLabel(t.statusConfirmacao);
    case 'prazoConfirmacao': return t.prazoConfirmacao;
    case 'statusNotificacao': return statusNotificacaoLabel(t.statusNotificacao);
    case 'lastro': return t.lastro;
    case 'numero': return t.numero;
    case 'veiculo': return t.veiculoNome;
    case 'cedente': return `${t.cedenteNome}\n${t.cedenteDocumento}`;
    case 'sacado': return `${t.sacadoNome}\n${t.sacadoDocumento}`;
    case 'gerente': return t.gerente;
    case 'chaveNotaFiscal': return t.chaveNotaFiscal.length > 18 ? `${t.chaveNotaFiscal.slice(0, 18)}…` : t.chaveNotaFiscal;
    case 'situacao': return situacaoLabel(t.situacao);
    case 'statusTitulo': return statusTituloLabel(t.statusTitulo);
    case 'cessao': return t.cessao;
    case 'dataCessao': return t.dataCessao ?? '—';
    case 'taxaCessao': return t.taxaCessao != null ? `${t.taxaCessao.toFixed(2)}%` : '—';
    case 'taxaEfetiva': return t.taxaEfetiva != null ? `${t.taxaEfetiva.toFixed(2)}%` : '—';
    case 'indicadorTaxa': return t.indicadorTaxa ?? '—';
    case 'percentualIndicador': return t.percentualIndicador != null ? `${t.percentualIndicador}%` : '—';
    case 'tipoAtivo': return t.tipoAtivo;
    case 'dataCriacao': return t.dataCriacao;
    case 'dataEmissao': return t.dataEmissao;
    case 'valorNominal': return brl(t.valorNominal);
    case 'valorEmissao': return brl(t.valorEmissao);
    case 'valorAquisicao': return brl(t.valorAquisicao);
    case 'valorPresente': return brl(t.valorPresente);
    case 'valorAberto': return brl(t.valorAberto);
    case 'valorVencido': return brl(t.valorVencido);
    case 'vencimento': return t.vencimento;
    case 'ultimoPagamento': return t.ultimoPagamento ?? '—';
  }
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="(k, i) in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 16px"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="KPI_ICONS[i]" :size="18" :stroke-width="1.75" />
        </div>
        <div style="min-width: 0">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; line-height: 1.2">
            {{ brl(k.valor) }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ k.qtd }} título{{ k.qtd === 1 ? '' : 's' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search + Filtros (padrão Solicitação) -->
    <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 240px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
        <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          :placeholder="viewMode === 'contratos' ? 'Buscar por contrato, veículo, cedente ou sacado...' : 'Buscar por número, lastro, cedente ou sacado...'"
          style="width: 100%; height: 42px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong); border-radius: var(--radius-lg)"
          @input="setPage(1)"
        />
      </div>

      <div style="position: relative">
        <button
          ref="filterBtnRef"
          class="flex items-center"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 16px',
            cursor: 'pointer',
            background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
            border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
          @click="openFilters"
        >
          <SlidersHorizontal :size="15" :stroke-width="2" />
          Filtros
          <span
            v-if="activeFilterCount > 0"
            style="min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9999px; background: var(--gci-base); color: #fff; font-size: 10px; font-weight: var(--weight-bold); display: flex; align-items: center; justify-content: center"
          >
            {{ activeFilterCount }}
          </span>
          <ChevronDown :size="14" :style="{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
        </button>

        <template v-if="showFilters">
          <div style="position: fixed; inset: 0; z-index: 30" @click="showFilters = false" />
          <div :style="filterPanelStyle">
            <AtivosFiltersPanel
              :model-value="filters"
              @apply="applyFilters"
              @clear="clearFilters"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Card tabela (padrão CRA/FIDC: header + TabBtn + colunas) -->
    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <component :is="viewMode === 'contratos' ? ScrollText : FileText" :size="20" />
        </div>
        <div style="flex: 1; min-width: 160px">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ viewMode === 'contratos' ? 'Contratos' : 'Títulos' }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ viewMode === 'contratos' ? `${filteredContratos.length} contratos` : `${filteredTitulos.length} títulos` }}
          </div>
        </div>

        <div class="flex" style="padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <TabBtn :active="viewMode === 'contratos'" @click="setViewMode('contratos')">VISUALIZAR CONTRATOS</TabBtn>
          <TabBtn :active="viewMode === 'titulos'" @click="setViewMode('titulos')">VISUALIZAR TÍTULOS</TabBtn>
        </div>

        <div style="position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="colsMenuOpen = !colsMenuOpen"
          >
            <Settings2 :size="16" />
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div
              style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 240px; max-height: 360px; overflow-y: auto; padding: 8px"
            >
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; padding: 6px 10px 10px">
                Colunas visíveis
              </div>
              <template v-if="viewMode === 'contratos'">
                <div
                  v-for="c in CONTRATO_COLS"
                  :key="c.key"
                  class="cols-item"
                  @click="toggleContratoCol(c.key)"
                >
                  <Checkbox :checked="visibleColsContrato.has(c.key)" @change="toggleContratoCol(c.key)" />
                  {{ c.label }}
                </div>
              </template>
              <template v-else>
                <div
                  v-for="c in TITULO_COLS"
                  :key="c.key"
                  class="cols-item"
                  @click="toggleTituloCol(c.key)"
                >
                  <Checkbox :checked="visibleColsTitulo.has(c.key)" @change="toggleTituloCol(c.key)" />
                  {{ c.label }}
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>

      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <!-- Contratos -->
          <template v-if="viewMode === 'contratos'">
            <div
              class="ativos-table-row ativos-table-header"
              :style="{ gridTemplateColumns: contratoGrid }"
            >
              <div
                v-for="col in visibleContratoCols"
                :key="col.key"
                :style="{ textAlign: col.align ?? 'left', paddingRight: col.key === 'valorAberto' ? '12px' : undefined, paddingLeft: col.key === 'cedente' ? '12px' : undefined }"
              >
                {{ col.label }}
              </div>
            </div>
            <div
              v-if="pageContratos.length === 0"
              style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
            >
              Nenhum contrato encontrado para os filtros selecionados.
            </div>
            <div
              v-for="c in pageContratos"
              :key="c.id"
              class="ativos-table-row ativos-table-body"
              :style="{ gridTemplateColumns: contratoGrid }"
              @click="emit('openContrato', c.id)"
            >
              <div
                v-for="col in visibleContratoCols"
                :key="col.key"
                :style="{
                  textAlign: col.align ?? 'left',
                  fontVariantNumeric: 'tabular-nums',
                  paddingRight: col.key === 'valorAberto' ? '12px' : undefined,
                  paddingLeft: col.key === 'cedente' ? '12px' : undefined,
                }"
              >
                <template v-if="col.key === 'cedente' || col.key === 'sacado'">
                  <div style="font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap">{{ contratoCell(c, col.key).split('\n')[0] }}</div>
                  <div style="font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap">{{ contratoCell(c, col.key).split('\n')[1] }}</div>
                </template>
                <template v-else-if="col.key === 'numero'">
                  <span style="font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">{{ c.numero }}</span>
                </template>
                <template v-else>
                  <span
                    :style="{
                      color: col.align === 'right' ? 'var(--text-strong)' : 'var(--text-default)',
                      fontWeight: col.align === 'right' ? 'var(--weight-semibold)' : undefined,
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ contratoCell(c, col.key) }}
                  </span>
                </template>
              </div>
            </div>
          </template>

          <!-- Títulos -->
          <template v-else>
            <div
              class="ativos-table-row ativos-table-header"
              :style="{ gridTemplateColumns: tituloGrid }"
            >
              <div
                v-for="col in visibleTituloCols"
                :key="col.key"
                :style="{ textAlign: col.align ?? 'left' }"
              >
                {{ col.label }}
              </div>
            </div>
            <div
              v-if="pageTitulos.length === 0"
              style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
            >
              Nenhum título encontrado para os filtros selecionados.
            </div>
            <div
              v-for="t in pageTitulos"
              :key="t.id"
              class="ativos-table-row ativos-table-body"
              :style="{ gridTemplateColumns: tituloGrid }"
              @click="emit('openTitulo', t.id)"
            >
              <div
                v-for="col in visibleTituloCols"
                :key="col.key"
                :style="{ textAlign: col.align ?? 'left', fontVariantNumeric: 'tabular-nums' }"
              >
                <template v-if="col.key === 'cedente' || col.key === 'sacado'">
                  <div style="font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap">{{ tituloCell(t, col.key).split('\n')[0] }}</div>
                  <div style="font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap">{{ tituloCell(t, col.key).split('\n')[1] }}</div>
                </template>
                <template v-else-if="col.key === 'situacao'">
                  <span
                    :style="{
                      fontSize: '10px',
                      fontWeight: 'var(--weight-bold)',
                      letterSpacing: '0.06em',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      background: `color-mix(in srgb, ${situacaoColor(t.situacao)} 14%, transparent)`,
                      color: situacaoColor(t.situacao),
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ situacaoLabel(t.situacao) }}
                  </span>
                </template>
                <template v-else-if="col.key === 'statusTitulo'">
                  <span
                    :style="{
                      fontSize: '10px',
                      fontWeight: 'var(--weight-bold)',
                      letterSpacing: '0.06em',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      background: `color-mix(in srgb, ${statusTituloColor(t.statusTitulo)} 14%, transparent)`,
                      color: statusTituloColor(t.statusTitulo),
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ statusTituloLabel(t.statusTitulo) }}
                  </span>
                </template>
                <template v-else-if="col.key === 'numero'">
                  <span style="font-weight: var(--weight-bold); color: var(--text-strong); white-space: nowrap">{{ t.numero }}</span>
                </template>
                <template v-else>
                  <span
                    :style="{
                      color: col.align === 'right' ? 'var(--text-strong)' : 'var(--text-default)',
                      fontWeight: col.align === 'right' ? 'var(--weight-semibold)' : undefined,
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ tituloCell(t, col.key) }}
                  </span>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <TablePagination
        sunken
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.ativos-table-row {
  display: grid;
  align-items: center;
  width: 100%;
  padding: 14px 20px;
  box-sizing: border-box;
  column-gap: 16px;
}
.ativos-table-header {
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border-default);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
  padding-top: 10px;
  padding-bottom: 10px;
}
.ativos-table-body {
  border-bottom: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.ativos-table-body:hover {
  background: var(--surface-sunken);
}
.cols-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.cols-item:hover {
  background: var(--surface-sunken);
}
</style>
