# Ativos

## Screens

### AtivosListScreen

```vue
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
```

### AtivosScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { CONTRATOS_SEED, TITULOS_SEED, type ContratoAtivoGlobal, type TituloAtivoGlobal } from '../data/ativosData';
import AtivosListScreen from './AtivosListScreen.vue';
import ContratoDetailScreen from './ContratoDetailScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route =
  | { level: 'list' }
  | { level: 'contrato'; contratoId: string }
  | { level: 'titulo'; tituloId: string; from?: 'list' | 'contrato'; contratoId?: string };

const contratos = ref<ContratoAtivoGlobal[]>(CONTRATOS_SEED.map((c) => ({ ...c, tituloIds: [...c.tituloIds] })));
const titulos = ref<TituloAtivoGlobal[]>(TITULOS_SEED.map((t) => ({ ...t })));
const route = ref<Route>({ level: 'list' });

const contratoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'contrato') return undefined;
  return contratos.value.find((c) => c.id === r.contratoId);
});

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'titulo' ? titulos.value.find((t) => t.id === r.tituloId) : undefined;
});

function openContrato(id: string) {
  route.value = { level: 'contrato', contratoId: id };
}

function openTituloFromList(id: string) {
  route.value = { level: 'titulo', tituloId: id, from: 'list' };
}

function openTituloFromContrato(id: string) {
  const r = route.value;
  const contratoId = r.level === 'contrato' ? r.contratoId : undefined;
  route.value = { level: 'titulo', tituloId: id, from: 'contrato', contratoId };
}

function handleBack() {
  const r = route.value;
  if (r.level === 'titulo' && r.from === 'contrato' && r.contratoId) {
    route.value = { level: 'contrato', contratoId: r.contratoId };
    return;
  }
  route.value = { level: 'list' };
}
</script>

<template>
  <AtivosListScreen
    v-if="route.level === 'list'"
    :contratos="contratos"
    :titulos="titulos"
    @open-contrato="openContrato"
    @open-titulo="openTituloFromList"
  />
  <ContratoDetailScreen
    v-else-if="route.level === 'contrato' && contratoAtual"
    :contrato="contratoAtual"
    :titulos="titulos"
    @back="handleBack"
    @open-titulo="openTituloFromContrato"
  />
  <TituloDetailScreen
    v-else-if="route.level === 'titulo' && tituloAtual"
    :titulo="tituloAtual"
    @back="handleBack"
  />
</template>
```

### ContratoDetailScreen

```vue
<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import { ArrowLeft, Info, FileText, History } from 'lucide-vue-next';
import { brl, type ContratoAtivoGlobal, type TituloAtivoGlobal } from '../data/ativosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetalhesTab from './contrato-detail/DetalhesTab.vue';
import TitulosTab from './contrato-detail/TitulosTab.vue';
import HistoricoTab from './contrato-detail/HistoricoTab.vue';

const props = defineProps<{ contrato: ContratoAtivoGlobal; titulos: TituloAtivoGlobal[] }>();
const emit = defineEmits<{ back: []; openTitulo: [id: string] }>();

type Tab = 'detalhes' | 'titulos' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'detalhes', label: 'Detalhes', icon: Info },
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('detalhes');

const titulosContrato = computed(() =>
  props.titulos.filter((t) => t.contratoId === props.contrato.id),
);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Ativos · Contrato
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ contrato.numero }}
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 9px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ contrato.tipoAtivo }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ contrato.veiculoNome }} · {{ contrato.qtdParcelas }} parcela(s) · {{ contrato.grupoEmpresarial }}
        </p>
      </div>

      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor Nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(contrato.valorNominal) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetalhesTab v-if="tab === 'detalhes'" :contrato="contrato" />
      <TitulosTab v-else-if="tab === 'titulos'" :titulos="titulosContrato" @open-titulo="emit('openTitulo', $event)" />
      <HistoricoTab v-else-if="tab === 'historico'" :contrato="contrato" :titulos="titulosContrato" />
    </div>
  </div>
</template>
```

### TituloDetailScreen

```vue
<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  CreditCard,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  BadgeCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next';
import {
  brl,
  statusTituloColor,
  statusTituloLabel,
  type TituloAtivoGlobal,
} from '../data/ativosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './titulo-detail/DetailsTab.vue';
import AnexosTab from './titulo-detail/AnexosTab.vue';
import AccrualTab from './titulo-detail/AccrualTab.vue';
import PagamentosTab from './titulo-detail/PagamentosTab.vue';
import ConfirmacoesTab from './titulo-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './titulo-detail/MovimentacoesTab.vue';
import HistoricoTab from './titulo-detail/HistoricoTab.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'anexos' as const, label: 'Anexos', icon: Paperclip },
  { key: 'accrual' as const, label: 'Accrual', icon: TrendingUp },
  { key: 'pagamentos' as const, label: 'Pagamentos', icon: CreditCard },
  { key: 'confirmacoes' as const, label: 'Confirmações', icon: BadgeCheck },
  { key: 'movimentacoes' as const, label: 'Movimentações', icon: ArrowLeftRight },
  { key: 'historico' as const, label: 'Histórico', icon: Activity },
];

const tab = ref<Tab>('detalhes');
const statusColor = computed(() => statusTituloColor(props.titulo.statusTitulo));

const StatusIcon = computed<Component>(() => {
  if (props.titulo.statusTitulo === 'LIQUIDADO') return CheckCircle2;
  if (props.titulo.statusTitulo === 'VENCIDO') return AlertTriangle;
  return Clock;
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Ativos · Título
        </div>
        <h2
          class="flex items-center"
          style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap"
        >
          #{{ titulo.numero }}
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 9px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base); border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent)">
            Lastro {{ titulo.lastro }}
          </span>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusTituloLabel(titulo.statusTitulo).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ titulo.veiculoNome }} · {{ titulo.contratoNumero }} · {{ titulo.gerente }}
        </p>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 28px 32px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4); gap: 24px; flex-wrap: wrap"
    >
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255, 255, 255, 0.04)" />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(titulo.valorNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Tipo: {{ titulo.tipoAtivo }} · Emissão: {{ titulo.dataEmissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
      <div
        class="flex flex-col"
        style="position: relative; z-index: 1; gap: 8px; padding: 16px 20px; border-radius: var(--radius-lg); background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); min-width: 160px"
      >
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55)">
          Valor em Aberto
        </div>
        <div style="font-size: var(--text-xl); font-weight: 700; font-variant-numeric: tabular-nums">
          {{ brl(titulo.valorAberto) }}
        </div>
        <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: rgba(255, 255, 255, 0.7)">
          <component :is="StatusIcon" :size="13" />
          {{ statusTituloLabel(titulo.statusTitulo) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetailsTab v-if="tab === 'detalhes'" :titulo="titulo" />
      <AnexosTab v-else-if="tab === 'anexos'" :titulo="titulo" />
      <AccrualTab v-else-if="tab === 'accrual'" :titulo="titulo" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" :titulo="titulo" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :titulo="titulo" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :titulo="titulo" />
      <HistoricoTab v-else-if="tab === 'historico'" :titulo="titulo" />
    </div>
  </div>
</template>
```

## Screens / contrato-detail

### CopyButton

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleCopy(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    :style="{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      flexShrink: 0,
      transition: 'color var(--duration-fast)',
    }"
    @click="handleCopy"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

### DetalhesTab

```vue
<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import { brl, type ContratoAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ contrato: ContratoAtivoGlobal }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Dados do Contrato">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">{{ contrato.numero }}<CopyButton :value="contrato.numero" /></span>
        </Field>
        <Field label="Tipo do Ativo">{{ contrato.tipoAtivo }}</Field>
        <Field label="Quantidade de Parcelas">{{ contrato.qtdParcelas }}</Field>
        <Field label="Veículo">{{ contrato.veiculoNome }}</Field>
        <Field label="Grupo Empresarial">{{ contrato.grupoEmpresarial }}</Field>
        <Field label="Data de Primeira Entrada">{{ contrato.dataPrimeiraEntrada }}</Field>
        <Field label="Último Vencimento">{{ contrato.ultimoVencimento }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(contrato.valorNominal) }}</Field>
        <Field label="Valor Emissão">{{ brl(contrato.valorEmissao) }}</Field>
        <Field label="Valor Aquisição">{{ brl(contrato.valorAquisicao) }}</Field>
        <Field label="Valor Presente">{{ brl(contrato.valorPresente) }}</Field>
        <Field label="Valor Aberto">{{ brl(contrato.valorAberto) }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="contrato.cedenteNome" :cnpj="contrato.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="contrato.sacadoNome" :cnpj="contrato.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
```

### Field

```vue
<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">{{ label }}</div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"><slot /></div>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { ContratoAtivoGlobal, TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ contrato: ContratoAtivoGlobal; titulos: TituloAtivoGlobal[] }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.contrato.dataPrimeiraEntrada, label: `Contrato ${props.contrato.numero} registrado`, tone: 'info' },
    { date: props.contrato.dataPrimeiraEntrada, label: `${props.titulos.length} título(s) vinculados`, tone: 'info' },
  ];
  for (const t of props.titulos) {
    if (t.dataCessao) {
      list.push({ date: t.dataCessao, label: `Cessão ${t.cessao} no título ${t.numero}`, tone: 'success' });
    }
    if (t.situacao === 'REJEITADO') {
      list.push({ date: t.dataEntrada, label: `Título ${t.numero} rejeitado`, tone: 'danger' });
    }
  }
  list.push({ date: props.contrato.ultimoVencimento, label: 'Último vencimento do contrato', tone: 'neutral' });
  return list.sort((a, b) => {
    const [da, ma, ya] = a.date.split('/').map(Number);
    const [db, mb, yb] = b.date.split('/').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });
});

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Histórico do Contrato">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in events" :key="i" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; margin-top: 6px" :style="{ background: toneMap[e.tone] }" />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.label }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ e.date }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### Participant

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import CopyButton from './CopyButton.vue';

defineProps<{ role: string; name: string; cnpj: string; icon: Component }>();
</script>

<template>
  <div class="flex items-center" style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
    <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0">
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ role }}</div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ name }}</div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">{{ cnpj }}<CopyButton :value="cnpj" /></div>
    </div>
  </div>
</template>
```

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">{{ title }}</div>
    <slot />
  </div>
</template>
```

### TitulosTab

```vue
<script setup lang="ts">
import {
  brl,
  situacaoLabel,
  situacaoColor,
  statusTituloLabel,
  statusTituloColor,
  type TituloAtivoGlobal,
} from '../../data/ativosData';
import Section from './Section.vue';

defineProps<{ titulos: TituloAtivoGlobal[] }>();
const emit = defineEmits<{ openTitulo: [id: string] }>();
</script>

<template>
  <Section title="Títulos do Contrato">
    <div v-if="titulos.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum título vinculado a este contrato.
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; overflow-x: auto">
      <div style="min-width: 900px">
        <div
          class="grid"
          style="grid-template-columns: 100px 90px 1.2fr 1fr 110px 120px 120px 120px; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Número</div>
          <div>Lastro</div>
          <div>Sacado</div>
          <div>Situação</div>
          <div>Status</div>
          <div style="text-align: right">Nominal</div>
          <div style="text-align: right">Aberto</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="t in titulos"
          :key="t.id"
          class="grid items-center titulo-row"
          style="grid-template-columns: 100px 90px 1.2fr 1fr 110px 120px 120px 120px; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="emit('openTitulo', t.id)"
        >
          <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ t.numero }}</div>
          <div style="color: var(--text-muted)">{{ t.lastro }}</div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.sacadoNome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ t.sacadoDocumento }}</div>
          </div>
          <div>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '4px 8px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${situacaoColor(t.situacao)} 14%, transparent)`,
                color: situacaoColor(t.situacao),
              }"
            >
              {{ situacaoLabel(t.situacao) }}
            </span>
          </div>
          <div>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '4px 8px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${statusTituloColor(t.statusTitulo)} 14%, transparent)`,
                color: statusTituloColor(t.statusTitulo),
              }"
            >
              {{ statusTituloLabel(t.statusTitulo) }}
            </span>
          </div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">{{ brl(t.valorNominal) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(t.valorAberto) }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ t.vencimento }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.titulo-row:hover {
  background: var(--surface-sunken);
}
</style>
```

## Screens / titulo-detail

### AccrualTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { brl, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const taxa = computed(() => props.titulo.taxaEfetiva ?? 1.85);

const rows = computed(() => {
  const daily = (props.titulo.valorNominal * (taxa.value / 100)) / 252;
  return [
    { data: props.titulo.dataEmissao, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily * 3) },
    { data: props.titulo.dataEntrada, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily * 2) },
    { data: props.titulo.vencimento, taxa: `${taxa.value.toFixed(4).replace('.', ',')}%`, base: '252', accrual: brl(daily), acumulado: brl(daily) },
  ];
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, { defaultPageSize: 5 });
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style="text-align: right">Acumulado</div>
      </div>
      <div
        v-for="(r, i) in pageItems"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-variant-numeric: tabular-nums"
      >
        <div style="color: var(--text-muted)">{{ r.data }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.taxa }}</div>
        <div style="color: var(--text-muted)">{{ r.base }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.accrual }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right">{{ r.acumulado }}</div>
      </div>
      <TablePagination sunken compact :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
    </div>
  </Section>
</template>
```

### AnexosTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { Download } from 'lucide-vue-next';
import type { TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const files = computed(() => [
  { name: `${props.titulo.tipoAtivo}-${props.titulo.numero}.xml`, size: '14 KB', type: 'XML' },
  { name: `Laudo-${props.titulo.numero}.pdf`, size: '210 KB', type: 'PDF' },
  { name: `Contrato-${props.titulo.contratoNumero}.pdf`, size: '88 KB', type: 'PDF' },
]);
</script>

<template>
  <Section title="Anexos do Título">
    <div class="flex flex-col" style="gap: 12px">
      <div
        v-for="f in files"
        :key="f.name"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em">{{ f.type }}</div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ f.size }}</div>
        </div>
        <button class="flex items-center" style="gap: 8px; padding: 8px 14px; background: var(--surface-card); color: var(--text-strong); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)">
          <Download :size="14" /> Baixar
        </button>
      </div>
    </div>
  </Section>
</template>
```

### ConfirmacoesTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const items = computed(() => [
  {
    data: props.titulo.dataEmissao,
    tipo: 'Confirmação do Sacado',
    resultado: props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao,
    obs: 'Via portal eletrônico',
  },
  {
    data: props.titulo.dataEmissao,
    tipo: 'Validação de Lastro',
    resultado: props.titulo.situacao === 'REJEITADO' ? 'REJEITADO' : 'CONFIRMADO',
    obs: `Documento ${props.titulo.lastro} verificado`,
  },
  {
    data: props.titulo.dataEntrada,
    tipo: 'Registro Registradora',
    resultado: props.titulo.statusRegistro === 'REGISTRADO' ? 'CONFIRMADO' : props.titulo.statusRegistro === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE',
    obs: 'B3 — protocolo #' + props.titulo.numero.replace(/\D/g, '').slice(-5),
  },
]);

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap.PENDENTE;
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in items"
        :key="i"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ c.tipo }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ c.data }} · {{ c.obs }}</div>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: tone(c.resultado).bg,
            color: tone(c.resultado).fg,
          }"
        >
          {{ c.resultado }}
        </span>
      </div>
    </div>
  </Section>
</template>
```

### CopyButton

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleCopy(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    :style="{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      flexShrink: 0,
      transition: 'color var(--duration-fast)',
    }"
    @click="handleCopy"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

### DetailsTab

```vue
<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import {
  brl,
  situacaoLabel,
  statusTituloLabel,
  statusRegistroLabel,
  statusEntregaLabel,
  statusConfirmacaoLabel,
  statusNotificacaoLabel,
  type TituloAtivoGlobal,
} from '../../data/ativosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: TituloAtivoGlobal }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Contrato">{{ titulo.contratoNumero }}</Field>
        <Field label="Lastro">
          <span style="display: inline-block; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 3px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ titulo.lastro }}
          </span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipoAtivo }}</Field>
        <Field label="Veículo">{{ titulo.veiculoNome }}</Field>
        <Field label="Gerente">{{ titulo.gerente }}</Field>
        <Field label="Situação">{{ situacaoLabel(titulo.situacao) }}</Field>
        <Field label="Status do Título">{{ statusTituloLabel(titulo.statusTitulo) }}</Field>
        <Field label="Status de Registro">{{ statusRegistroLabel(titulo.statusRegistro) }}</Field>
        <Field label="Status de Entrega">{{ statusEntregaLabel(titulo.statusEntrega) }}</Field>
        <Field label="Status Confirmação">{{ statusConfirmacaoLabel(titulo.statusConfirmacao) }}</Field>
        <Field label="Prazo Confirmação">{{ titulo.prazoConfirmacao }}</Field>
        <Field label="Status Notificação">{{ statusNotificacaoLabel(titulo.statusNotificacao) }}</Field>
        <Field label="Cessão">{{ titulo.cessao }}</Field>
        <Field label="Data Cessão">{{ titulo.dataCessao ?? '—' }}</Field>
        <Field label="Chave NF">
          <span class="flex items-center" style="gap: 6px; word-break: break-all">
            {{ titulo.chaveNotaFiscal }}
            <CopyButton v-if="titulo.chaveNotaFiscal !== '—'" :value="titulo.chaveNotaFiscal" />
          </span>
        </Field>
      </div>
    </Section>

    <Section title="Taxas">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Taxa Cessão">{{ titulo.taxaCessao != null ? `${titulo.taxaCessao.toFixed(2)}%` : '—' }}</Field>
        <Field label="Taxa Efetiva">{{ titulo.taxaEfetiva != null ? `${titulo.taxaEfetiva.toFixed(2)}%` : '—' }}</Field>
        <Field label="Indicador">{{ titulo.indicadorTaxa ?? '—' }}</Field>
        <Field label="% Indicador">{{ titulo.percentualIndicador != null ? `${titulo.percentualIndicador}%` : '—' }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.valorNominal) }}</Field>
        <Field label="Valor Emissão">{{ brl(titulo.valorEmissao) }}</Field>
        <Field label="Valor Aquisição">{{ brl(titulo.valorAquisicao) }}</Field>
        <Field label="Valor Presente">{{ brl(titulo.valorPresente) }}</Field>
        <Field label="Valor Aberto">{{ brl(titulo.valorAberto) }}</Field>
        <Field label="Valor Vencido">{{ brl(titulo.valorVencido) }}</Field>
      </div>
    </Section>

    <Section title="Datas">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Criação">{{ titulo.dataCriacao }}</Field>
        <Field label="Emissão">{{ titulo.dataEmissao }}</Field>
        <Field label="Entrada">{{ titulo.dataEntrada }}</Field>
        <Field label="Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Último Pagamento">{{ titulo.ultimoPagamento ?? '—' }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedenteNome" :cnpj="titulo.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacadoNome" :cnpj="titulo.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
```

### Field

```vue
<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">{{ label }}</div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"><slot /></div>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { situacaoLabel, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.titulo.dataCriacao, label: 'Título criado no sistema', tone: 'info' },
    { date: props.titulo.dataEmissao, label: `Lastro ${props.titulo.lastro} vinculado ao veículo ${props.titulo.veiculoNome}`, tone: 'info' },
    { date: props.titulo.dataEntrada, label: `Situação: ${situacaoLabel(props.titulo.situacao)}`, tone: props.titulo.situacao === 'REJEITADO' ? 'danger' : 'success' },
  ];
  if (props.titulo.dataCessao) {
    list.push({ date: props.titulo.dataCessao, label: `Cessão ${props.titulo.cessao} registrada`, tone: 'info' });
  }
  if (props.titulo.ultimoPagamento) {
    list.push({ date: props.titulo.ultimoPagamento, label: 'Pagamento registrado', tone: 'success' });
  }
  list.push({
    date: props.titulo.vencimento,
    label:
      props.titulo.statusTitulo === 'VENCIDO'
        ? 'Inadimplência identificada'
        : props.titulo.statusTitulo === 'LIQUIDADO'
          ? 'Título liquidado'
          : 'Vencimento programado',
    tone:
      props.titulo.statusTitulo === 'VENCIDO'
        ? 'danger'
        : props.titulo.statusTitulo === 'LIQUIDADO'
          ? 'success'
          : 'neutral',
  });
  return list;
});

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in events" :key="i" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; margin-top: 6px" :style="{ background: toneMap[e.tone] }" />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.label }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ e.date }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### MovimentacoesTab

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

type MovSub = 'registro' | 'cessao';
const sub = ref<MovSub>('registro');

const registroRows = computed(() => [
  {
    data: props.titulo.dataEmissao,
    operacao: 'Inclusão',
    registradora: 'B3',
    protocolo: '#' + props.titulo.lastro,
    valor: brl(props.titulo.valorNominal),
  },
  ...(props.titulo.statusRegistro === 'REGISTRADO'
    ? [{ data: props.titulo.dataEntrada, operacao: 'Registro confirmado', registradora: 'B3', protocolo: '#' + props.titulo.numero, valor: brl(props.titulo.valorAberto) }]
    : []),
]);

const cessaoRows = computed(() =>
  props.titulo.dataCessao
    ? [{ data: props.titulo.dataCessao, cedente: props.titulo.cedenteNome, cessionario: props.titulo.veiculoNome, valor: brl(props.titulo.valorAquisicao) }]
    : [],
);

const {
  page: registroPage,
  pageSize: registroPageSize,
  total: registroTotal,
  pageItems: registroPageItems,
  setPage: setRegistroPage,
  setPageSize: setRegistroPageSize,
} = useTablePagination(() => registroRows.value, { defaultPageSize: 5 });

const {
  page: cessaoPage,
  pageSize: cessaoPageSize,
  total: cessaoTotal,
  pageItems: cessaoPageItems,
  setPage: setCessaoPage,
  setPageSize: setCessaoPageSize,
} = useTablePagination(() => cessaoRows.value, { defaultPageSize: 5 });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start">
      <button
        v-for="s in (['registro', 'cessao'] as MovSub[])"
        :key="s"
        :style="{
          padding: '8px 16px',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          background: sub === s ? 'var(--surface-card)' : 'transparent',
          color: sub === s ? 'var(--text-strong)' : 'var(--text-muted)',
          boxShadow: sub === s ? 'var(--shadow-xs)' : 'none',
        }"
        @click="sub = s"
      >
        {{ s === 'registro' ? 'MOVIMENTAÇÕES DE REGISTRO' : 'MOVIMENTO DE CESSÃO' }}
      </button>
    </div>

    <Section v-if="sub === 'registro'" title="Movimentações de Registro">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Operação</div><div>Registradora</div><div>Protocolo</div><div style="text-align: right">Valor</div>
        </div>
        <div
          v-for="(r, i) in registroPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.operacao }}</div>
          <div style="color: var(--text-default)">{{ r.registradora }}</div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.protocolo }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ r.valor }}</div>
        </div>
        <TablePagination sunken compact :total="registroTotal" :page="registroPage" :page-size="registroPageSize" @update:page="setRegistroPage" @update:page-size="setRegistroPageSize" />
      </div>
    </Section>

    <Section v-if="sub === 'cessao'" title="Movimento de Cessão">
      <div v-if="cessaoRows.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhuma cessão registrada para este título.
      </div>
      <div v-else style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Cedente</div><div>Cessionário</div><div>Valor</div><div style="text-align: right">Status</div>
        </div>
        <div
          v-for="(r, i) in cessaoPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cessionario }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ r.valor }}</div>
          <div style="text-align: right">
            <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 8px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">LIQUIDADO</span>
          </div>
        </div>
        <TablePagination sunken compact :total="cessaoTotal" :page="cessaoPage" :page-size="cessaoPageSize" @update:page="setCessaoPage" @update:page-size="setCessaoPageSize" />
      </div>
    </Section>
  </div>
</template>
```

### PagamentosTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { brl, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

interface PagamentoLocal {
  data: string;
  valorAmortizacao: number;
  tipoPagamento: string;
  jurosMoratorio: number;
  multa: number;
}

const pagamentos = ref<PagamentoLocal[]>(
  props.titulo.ultimoPagamento
    ? [
        {
          data: props.titulo.ultimoPagamento,
          valorAmortizacao: props.titulo.valorNominal - props.titulo.valorAberto,
          tipoPagamento: 'TED',
          jurosMoratorio: 0,
          multa: 0,
        },
      ]
    : [],
);

const form = ref({
  dataPagamento: '',
  valorAmortizacao: '',
  tipoPagamento: 'TED',
  jurosMoratorio: '',
  multa: '',
});

const canSalvar = computed(
  () => form.value.dataPagamento.trim() !== '' && form.value.valorAmortizacao.trim() !== '',
);

function handleSalvar() {
  if (!canSalvar.value) return;
  pagamentos.value = [
    {
      data: form.value.dataPagamento,
      valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
      tipoPagamento: form.value.tipoPagamento,
      jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
      multa: Number(form.value.multa) || 0,
    },
    ...pagamentos.value,
  ];
  form.value = { dataPagamento: '', valorAmortizacao: '', tipoPagamento: 'TED', jurosMoratorio: '', multa: '' };
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => pagamentos.value,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <Section title="Registrar Pagamento">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
        <div>
          <div class="field-label">Data do pagamento</div>
          <input v-model="form.dataPagamento" type="text" placeholder="dd/mm/aaaa" class="field-input" />
        </div>
        <div>
          <div class="field-label">Valor amortização</div>
          <input v-model="form.valorAmortizacao" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Tipo</div>
          <select v-model="form.tipoPagamento" class="field-input">
            <option value="TED">TED</option>
            <option value="PIX">PIX</option>
            <option value="BOLETO">Boleto</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <div class="field-label">Juros moratório</div>
          <input v-model="form.jurosMoratorio" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Multa</div>
          <input v-model="form.multa" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div class="flex items-end">
          <button
            :disabled="!canSalvar"
            :style="{
              height: '38px',
              padding: '0 18px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: canSalvar ? 'pointer' : 'not-allowed',
              background: canSalvar ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
              color: canSalvar ? '#fff' : 'var(--text-muted)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              opacity: canSalvar ? 1 : 0.7,
            }"
            @click="handleSalvar"
          >
            SALVAR PAGAMENTO
          </button>
        </div>
      </div>
    </Section>

    <Section title="Pagamentos Realizados">
      <div v-if="pagamentos.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhum pagamento registrado para este título.
      </div>
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div>
          <div>Tipo</div>
          <div style="text-align: right">Amortização</div>
          <div style="text-align: right">Juros</div>
          <div style="text-align: right">Multa</div>
        </div>
        <div
          v-for="(p, i) in pageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipoPagamento }}</div>
          <div style="text-align: right; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(p.valorAmortizacao) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.jurosMoratorio) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.multa) }}</div>
        </div>
        <TablePagination sunken compact :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </div>
    </Section>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.field-input {
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
</style>
```

### Participant

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import CopyButton from './CopyButton.vue';

defineProps<{ role: string; name: string; cnpj: string; icon: Component }>();
</script>

<template>
  <div class="flex items-center" style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
    <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0">
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ role }}</div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ name }}</div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">{{ cnpj }}<CopyButton :value="cnpj" /></div>
    </div>
  </div>
</template>
```

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">{{ title }}</div>
    <slot />
  </div>
</template>
```

## Components

### AtivosFiltersPanel

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Filter, X } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  EMPTY_FILTERS,
  SITUACAO_OPTS,
  STATUS_TITULO_OPTS,
  VEICULOS_OPTS,
  GRUPOS_OPTS,
  GERENTES_OPTS,
  situacaoLabel,
  statusTituloLabel,
  type AtivosFilters,
} from '../data/ativosData';

const props = defineProps<{ modelValue: AtivosFilters }>();
const emit = defineEmits<{
  apply: [filters: AtivosFilters];
  clear: [];
}>();

const draft = reactive<AtivosFilters>({
  ...EMPTY_FILTERS,
  veiculoIds: [],
  grupoIds: [],
});

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, {
      ...value,
      veiculoIds: [...value.veiculoIds],
      grupoIds: [...value.grupoIds],
    });
  },
  { deep: true, immediate: true },
);

const hasDraft = computed(() => {
  return (
    !!draft.lastro ||
    !!draft.numeroContrato ||
    draft.veiculoIds.length > 0 ||
    draft.grupoIds.length > 0 ||
    !!draft.situacao ||
    !!draft.statusTitulo ||
    !!draft.gerente ||
    !!draft.cessao ||
    !!draft.dataEntradaIni ||
    !!draft.dataEntradaFim ||
    !!draft.dataVencimentoIni ||
    !!draft.dataVencimentoFim
  );
});

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function toggleVeiculo(id: string) {
  const i = draft.veiculoIds.indexOf(id);
  if (i >= 0) draft.veiculoIds.splice(i, 1);
  else draft.veiculoIds.push(id);
}

function toggleGrupo(id: string) {
  const i = draft.grupoIds.indexOf(id);
  if (i >= 0) draft.grupoIds.splice(i, 1);
  else draft.grupoIds.push(id);
}

function handleApply() {
  emit('apply', {
    ...draft,
    veiculoIds: [...draft.veiculoIds],
    grupoIds: [...draft.grupoIds],
  });
}

function handleClear() {
  Object.assign(draft, { ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [] });
  emit('clear');
}
</script>

<template>
  <div class="flex items-center justify-between" style="margin-bottom: 16px">
    <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
      Filtros adicionais
    </span>
    <button
      v-if="hasDraft"
      class="flex items-center"
      style="gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
      @click="handleClear"
    >
      <X :size="12" /> Limpar filtros
    </button>
  </div>

  <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
    <div>
      <div :style="labelStyle">Lastro do título</div>
      <input v-model="draft.lastro" placeholder="Ex: NF-8821" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Número do contrato</div>
      <input v-model="draft.numeroContrato" placeholder="Ex: CT-50342" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Veículo de operação</div>
      <div class="multi-box">
        <label v-for="v in VEICULOS_OPTS" :key="v.id" class="multi-item" @click.prevent="toggleVeiculo(v.id)">
          <Checkbox :checked="draft.veiculoIds.includes(v.id)" @change="toggleVeiculo(v.id)" />
          <span>{{ v.nome }}</span>
        </label>
      </div>
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Grupo empresarial</div>
      <div class="multi-box">
        <label v-for="g in GRUPOS_OPTS" :key="g.id" class="multi-item" @click.prevent="toggleGrupo(g.id)">
          <Checkbox :checked="draft.grupoIds.includes(g.id)" @change="toggleGrupo(g.id)" />
          <span>{{ g.nome }}</span>
        </label>
      </div>
    </div>

    <div>
      <div :style="labelStyle">Situação do título</div>
      <select v-model="draft.situacao" :style="inputStyle">
        <option value="">Todas</option>
        <option v-for="s in SITUACAO_OPTS" :key="s" :value="s">{{ situacaoLabel(s) }}</option>
      </select>
    </div>
    <div>
      <div :style="labelStyle">Status do título</div>
      <select v-model="draft.statusTitulo" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="s in STATUS_TITULO_OPTS" :key="s" :value="s">{{ statusTituloLabel(s) }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Gerente</div>
      <select v-model="draft.gerente" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="g in GERENTES_OPTS" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>
    <div>
      <div :style="labelStyle">Cessão</div>
      <input v-model="draft.cessao" placeholder="Ex: CES-2025-0142" :style="inputStyle" />
    </div>

    <div>
      <div :style="labelStyle">Data entrada inicial</div>
      <input v-model="draft.dataEntradaIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data entrada final</div>
      <input v-model="draft.dataEntradaFim" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data vencimento inicial</div>
      <input v-model="draft.dataVencimentoIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data vencimento final</div>
      <input v-model="draft.dataVencimentoFim" type="date" :style="inputStyle" />
    </div>
  </div>

  <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
    <button
      style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
      @click="handleClear"
    >
      Limpar
    </button>
    <button
      class="flex items-center"
      style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      @click="handleApply"
    >
      <Filter :size="13" /> FILTRAR
    </button>
  </div>
</template>

<style scoped>
.multi-box {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  max-height: 120px;
  overflow-y: auto;
  padding: 6px;
}
.multi-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.multi-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### TabBtn

```vue
<script setup lang="ts">
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    type="button"
    :style="{
      padding: '8px 14px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--duration-base)',
    }"
  >
    <slot />
  </button>
</template>
```
