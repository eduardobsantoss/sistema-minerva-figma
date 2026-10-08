<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, Download, Filter, History, SlidersHorizontal } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  HISTORICO_NOTIFICACOES_SEED,
  METODO_OPTS,
  STATUS_ENVIO_OPTS,
  STATUS_PAGAMENTO_HIST_OPTS,
  TIPO_NOTIFICACAO_HIST_OPTS,
  TIPO_OPERACAO_OPTS,
  brl,
  parseDataBr,
  statusEnvioLabel,
  statusPagamentoHistLabel,
  tipoInformacaoColor,
  tipoInformacaoLabel,
  tipoNotificacaoHistLabel,
  type HistoricoNotificacao,
  type StatusEnvioHist,
  type StatusPagamentoHist,
  type TipoInformacaoHist,
  type TipoNotificacaoHist,
} from '../data/historicoNotificacoesData';

type ColKey =
  | 'lastro'
  | 'titulo'
  | 'valor'
  | 'sacado'
  | 'contato'
  | 'assunto'
  | 'metodo'
  | 'dataEnvio'
  | 'operacao'
  | 'cedente'
  | 'informacao'
  | 'tipoInformacao';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'lastro', label: 'Lastro' },
  { key: 'titulo', label: 'Título' },
  { key: 'valor', label: 'Valor', align: 'right' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'contato', label: 'Contato' },
  { key: 'assunto', label: 'Assunto' },
  { key: 'metodo', label: 'Método' },
  { key: 'dataEnvio', label: 'Data de envio' },
  { key: 'operacao', label: 'Operação' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'informacao', label: 'Informação' },
  { key: 'tipoInformacao', label: 'Tipo informação' },
];

const COL_WIDTHS: Record<ColKey, string> = {
  lastro: 'minmax(90px, 0.7fr)',
  titulo: 'minmax(120px, 0.9fr)',
  valor: 'minmax(120px, 0.9fr)',
  sacado: 'minmax(220px, 1.8fr)',
  contato: 'minmax(200px, 1.5fr)',
  assunto: 'minmax(180px, 1.3fr)',
  metodo: 'minmax(110px, 0.8fr)',
  dataEnvio: 'minmax(120px, 0.8fr)',
  operacao: 'minmax(160px, 1.2fr)',
  cedente: 'minmax(180px, 1.3fr)',
  informacao: 'minmax(200px, 1.5fr)',
  tipoInformacao: 'minmax(130px, 0.9fr)',
};

interface Filters {
  tipoOperacao: string;
  operacao: string;
  metodo: string;
  statusNotificacao: string;
  statusPagamento: string;
  tipoNotificacao: string;
  lastro: string;
  titulo: string;
  dataInicial: string;
  dataFinal: string;
  documentoCedente: string;
  nomeCedente: string;
  documentoSacado: string;
  nomeSacado: string;
  excluirCessoesLiquidadas: boolean;
}

const EMPTY_FILTERS: Filters = {
  tipoOperacao: '',
  operacao: '',
  metodo: '',
  statusNotificacao: '',
  statusPagamento: '',
  tipoNotificacao: '',
  lastro: '',
  titulo: '',
  dataInicial: '',
  dataFinal: '',
  documentoCedente: '',
  nomeCedente: '',
  documentoSacado: '',
  nomeSacado: '',
  excluirCessoesLiquidadas: false,
};

const itens = HISTORICO_NOTIFICACOES_SEED;
const { success } = useToast();
const lastroQuery = ref('');
const tituloQuery = ref('');
const sacadoQuery = ref('');
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const colsMenuOpen = ref(false);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set(['lastro', 'titulo', 'valor', 'sacado', 'contato', 'metodo', 'dataEnvio', 'tipoInformacao']),
);

const filtered = computed(() =>
  itens.filter((n) => {
    const lastro = lastroQuery.value.trim().toLowerCase();
    const titulo = tituloQuery.value.trim().toLowerCase();
    const sacado = sacadoQuery.value.trim().toLowerCase();
    if (lastro && !n.lastro.toLowerCase().includes(lastro)) return false;
    if (titulo && !n.titulo.toLowerCase().includes(titulo)) return false;
    if (sacado && !n.sacado.toLowerCase().includes(sacado)) return false;
    const f = applied.value;
    if (f.excluirCessoesLiquidadas && n.cessaoLiquidada) return false;
    if (f.tipoOperacao && n.tipoOperacao !== f.tipoOperacao) return false;
    if (f.operacao && !n.operacao.toLowerCase().includes(f.operacao.toLowerCase())) return false;
    if (f.metodo && n.metodo !== f.metodo) return false;
    if (f.statusNotificacao && n.statusNotificacao !== f.statusNotificacao) return false;
    if (f.statusPagamento && n.statusPagamento !== f.statusPagamento) return false;
    if (f.tipoNotificacao && n.tipoNotificacao !== f.tipoNotificacao) return false;
    if (f.lastro && !n.lastro.toLowerCase().includes(f.lastro.toLowerCase())) return false;
    if (f.titulo && !n.titulo.toLowerCase().includes(f.titulo.toLowerCase())) return false;
    if (f.nomeCedente && !n.cedente.toLowerCase().includes(f.nomeCedente.toLowerCase())) return false;
    if (f.documentoCedente && !n.documentoCedente.includes(f.documentoCedente)) return false;
    if (f.nomeSacado && !n.sacado.toLowerCase().includes(f.nomeSacado.toLowerCase())) return false;
    if (f.documentoSacado && !n.documentoSacado.includes(f.documentoSacado)) return false;
    const envio = parseDataBr(n.dataEnvio);
    if (f.dataInicial && envio < new Date(`${f.dataInicial}T00:00:00`).getTime()) return false;
    if (f.dataFinal && envio > new Date(`${f.dataFinal}T23:59:59`).getTime()) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => filtered.value, {
  defaultPageSize: 10,
});

const activeFilterCount = computed(() => {
  const f = applied.value;
  const text = [
    f.tipoOperacao,
    f.operacao,
    f.metodo,
    f.statusNotificacao,
    f.statusPagamento,
    f.tipoNotificacao,
    f.lastro,
    f.titulo,
    f.dataInicial,
    f.dataFinal,
    f.documentoCedente,
    f.nomeCedente,
    f.documentoSacado,
    f.nomeSacado,
  ].filter((v) => v !== '').length;
  return text + (f.excluirCessoesLiquidadas ? 1 : 0);
});

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => cols.value.map((c) => COL_WIDTHS[c.key]).join(' '));

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < 420 && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

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
  if (next.has(key)) {
    if (next.size === 1) return;
    next.delete(key);
  } else {
    next.add(key);
  }
  visibleCols.value = next;
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

function exportarCsv() {
  const header = [
    'Lastro',
    'Título',
    'Valor',
    'Sacado',
    'Contato',
    'Assunto',
    'Método',
    'Data de envio',
    'Operação',
    'Cedente',
    'Informação',
    'Tipo informação',
    'Status notificação',
    'Status pagamento',
    'Tipo notificação',
  ];
  const lines = filtered.value.map((n) =>
    [
      n.lastro,
      n.titulo,
      n.valor.toFixed(2),
      n.sacado,
      n.contato,
      n.assunto,
      n.metodo,
      n.dataEnvio,
      n.operacao,
      n.cedente,
      n.informacao,
      tipoInformacaoLabel(n.tipoInformacao),
      statusEnvioLabel(n.statusNotificacao),
      statusPagamentoHistLabel(n.statusPagamento),
      tipoNotificacaoHistLabel(n.tipoNotificacao),
    ]
      .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
      .join(';'),
  );
  const blob = new Blob(['\uFEFF' + [header.join(';'), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historico-notificacoes.csv';
  a.click();
  URL.revokeObjectURL(url);
  success('CSV exportado');
}

function cellText(n: HistoricoNotificacao, key: ColKey): string {
  if (key === 'valor') return brl(n.valor);
  if (key === 'tipoInformacao') return tipoInformacaoLabel(n.tipoInformacao);
  return String(n[key]);
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
        Histórico de notificações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'envio encontrado' : 'envios encontrados' }}
      </p>
    </div>

    <div class="flex items-end justify-between" style="gap: 10px; flex-wrap: wrap">
      <div class="grid search-grid" style="flex: 1; min-width: 280px">
        <label class="search-field">
          <span class="filter-label">Lastro</span>
          <input v-model="lastroQuery" class="filter-input" placeholder="Lastro" @input="setPage(1)" />
        </label>
        <label class="search-field">
          <span class="filter-label">Título</span>
          <input v-model="tituloQuery" class="filter-input" placeholder="Número do título" @input="setPage(1)" />
        </label>
        <label class="search-field">
          <span class="filter-label">Sacado</span>
          <input v-model="sacadoQuery" class="filter-input" placeholder="Nome do sacado" @input="setPage(1)" />
        </label>
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div style="position: relative">
          <button
            ref="filterBtnRef"
            type="button"
            class="flex items-center"
            style="
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
            "
            @click="openFilters"
          >
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
                width: '520px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '70vh',
                overflowY: 'auto',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
                <div>
                  <div class="filter-label">Tipo de operação</div>
                  <select v-model="draft.tipoOperacao" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="t in TIPO_OPERACAO_OPTS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Operação</div>
                  <input v-model="draft.operacao" placeholder="Nome da operação" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Método de notificação</div>
                  <select v-model="draft.metodo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="m in METODO_OPTS" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Status da notificação</div>
                  <select v-model="draft.statusNotificacao" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_ENVIO_OPTS" :key="s" :value="s">{{ statusEnvioLabel(s as StatusEnvioHist) }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Status de pagamento</div>
                  <select v-model="draft.statusPagamento" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_PAGAMENTO_HIST_OPTS" :key="s" :value="s">
                      {{ statusPagamentoHistLabel(s as StatusPagamentoHist) }}
                    </option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Tipo de notificação</div>
                  <select v-model="draft.tipoNotificacao" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="t in TIPO_NOTIFICACAO_HIST_OPTS" :key="t" :value="t">
                      {{ tipoNotificacaoHistLabel(t as TipoNotificacaoHist) }}
                    </option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Lastro</div>
                  <input v-model="draft.lastro" placeholder="Lastro" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Número do título</div>
                  <input v-model="draft.titulo" placeholder="Número" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Data inicial</div>
                  <input v-model="draft.dataInicial" type="date" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Data final</div>
                  <input v-model="draft.dataFinal" type="date" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Documento cedente</div>
                  <input v-model="draft.documentoCedente" placeholder="CPF ou CNPJ" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Nome cedente</div>
                  <input v-model="draft.nomeCedente" placeholder="Cedente" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Documento sacado</div>
                  <input v-model="draft.documentoSacado" placeholder="CPF ou CNPJ" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Nome sacado</div>
                  <input v-model="draft.nomeSacado" placeholder="Sacado" class="filter-input" />
                </div>
                <div class="flex items-center" style="grid-column: span 2; gap: 10px">
                  <Checkbox
                    aria-label="Não incluir cessões liquidadas"
                    :checked="draft.excluirCessoesLiquidadas"
                    @change="draft.excluirCessoesLiquidadas = !draft.excluirCessoesLiquidadas"
                  />
                  <span style="font-size: var(--text-sm); color: var(--text-strong)">Não incluir cessões liquidadas</span>
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button type="button" class="filter-secondary" @click="handleClear">Limpar</button>
                <button type="button" class="flex items-center filter-primary" @click="handleFilter">
                  <Filter :size="13" /> Filtrar
                </button>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button type="button" class="tool-btn" @click="colsMenuOpen = !colsMenuOpen">
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div class="cols-menu">
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center cols-item"
                style="gap: 10px; width: 100%; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer"
                @click="toggleCol(c.key)"
              >
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                <span style="font-size: var(--text-sm); color: var(--text-strong)">{{ c.label }}</span>
              </div>
            </div>
          </template>
        </div>

        <button type="button" class="tool-btn" @click="exportarCsv">
          <Download :size="14" /> Exportar CSV
        </button>
      </div>
    </div>

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
      "
    >
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid items-center hist-row hist-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <History :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum envio encontrado
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste os filtros para ver outros resultados.</div>
          </div>

          <div
            v-for="n in pageItems"
            :key="n.id"
            class="grid items-center hist-row hist-line"
            :style="{ gridTemplateColumns: gridTemplate }"
          >
            <template v-for="c in cols" :key="c.key">
              <div v-if="c.key === 'contato'" :style="{ color: n.contatoInvalido ? 'var(--danger-base)' : 'var(--text-default)', fontWeight: n.contatoInvalido ? 'var(--weight-semibold)' : 'var(--weight-regular)' }">
                {{ n.contato }}
              </div>
              <div v-else-if="c.key === 'informacao'" :style="{ color: n.contatoInvalido ? 'var(--danger-base)' : 'var(--text-default)' }">
                {{ n.informacao }}
              </div>
              <div v-else-if="c.key === 'metodo'">
                <span class="inline-flex items-center" :style="pillStyle('var(--gci-base)')">{{ n.metodo }}</span>
              </div>
              <div v-else-if="c.key === 'tipoInformacao'">
                <span class="inline-flex items-center" :style="pillStyle(tipoInformacaoColor(n.tipoInformacao as TipoInformacaoHist))">
                  {{ tipoInformacaoLabel(n.tipoInformacao) }}
                </span>
              </div>
              <div
                v-else
                :style="{
                  textAlign: c.align,
                  color: 'var(--text-default)',
                  fontVariantNumeric: c.key === 'valor' || c.key === 'lastro' ? 'tabular-nums' : 'normal',
                  fontWeight: c.key === 'sacado' || c.key === 'titulo' ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                }"
              >
                {{ cellText(n, c.key) }}
              </div>
            </template>
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
  </div>
</template>

<style scoped>
.search-grid {
  grid-template-columns: repeat(3, minmax(140px, 1fr));
  gap: 10px;
}
.search-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
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
.filter-secondary,
.filter-primary,
.tool-btn {
  height: 38px;
  padding: 0 16px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.filter-secondary {
  background: none;
  border: 1px solid var(--border-default);
  color: var(--text-muted);
}
.filter-primary {
  gap: 6px;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
  font-weight: var(--weight-bold);
}
.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  color: var(--text-muted);
}
.cols-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 31;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  min-width: 220px;
  max-height: 360px;
  overflow-y: auto;
  padding: 8px;
}
.cols-item:hover {
  background: var(--surface-sunken);
}
.hist-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.hist-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.hist-line {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
