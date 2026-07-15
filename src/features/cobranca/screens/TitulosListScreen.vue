<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
  Search,
  FileText,
  Receipt,
  BellRing,
  Handshake,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-vue-next';
import {
  VEICULO_OPTS,
  VEICULO_TIPO_OPTS,
  STATUS_PAGAMENTO_OPTS,
  brl,
  statusPagamentoColor,
  statusPagamentoLabel,
  situacaoTituloColor,
  situacaoTituloLabel,
  statusNotificacaoColor,
  statusNotificacaoLabel,
  statusConfirmacaoColor,
  statusConfirmacaoLabel,
  type Titulo,
  type StatusPagamento,
} from '../data/titulosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulos: Titulo[] }>();
const emit = defineEmits<{
  open: [id: string];
  gerarBoleto: [id: string];
  notificar: [id: string];
  confirmar: [id: string];
  negociar: [id: string];
}>();

type ColKey =
  | 'veiculo'
  | 'tipo'
  | 'cedente'
  | 'sacado'
  | 'gerente'
  | 'vencimento'
  | 'vrNominal'
  | 'vrAquisicao'
  | 'vrPresente'
  | 'vrAberto'
  | 'vrJuros'
  | 'vrMulta'
  | 'statusNotificacao'
  | 'statusConfirmacao'
  | 'situacaoTitulo'
  | 'statusPagamento'
  | 'diasAtraso'
  | 'boleto';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'veiculo', label: 'Veículo' },
  { key: 'tipo', label: 'Tipo do Ativo' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimento', label: 'Vencimento' },
  { key: 'vrNominal', label: 'VR. Nominal', align: 'right' },
  { key: 'vrAquisicao', label: 'VR. Aquisição', align: 'right' },
  { key: 'vrPresente', label: 'VR. Presente', align: 'right' },
  { key: 'vrAberto', label: 'VR. Aberto', align: 'right' },
  { key: 'vrJuros', label: 'VR. Juros', align: 'right' },
  { key: 'vrMulta', label: 'VR. Multa', align: 'right' },
  { key: 'statusNotificacao', label: 'Notificação' },
  { key: 'statusConfirmacao', label: 'Confirmação' },
  { key: 'situacaoTitulo', label: 'Situação' },
  { key: 'statusPagamento', label: 'Pagamento' },
  { key: 'diasAtraso', label: 'Dias atraso', align: 'right' },
  { key: 'boleto', label: 'Boleto' },
];

type QuickFilter = StatusPagamento | 'EM_NEGOCIACAO' | null;

interface Filters {
  veiculoId: string;
  veiculoTipo: string;
  statusPagamento: string;
  cedente: string;
  sacado: string;
}

const EMPTY_FILTERS: Filters = {
  veiculoId: '',
  veiculoTipo: '',
  statusPagamento: '',
  cedente: '',
  sacado: '',
};

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set([
    'veiculo',
    'tipo',
    'cedente',
    'sacado',
    'gerente',
    'vencimento',
    'vrNominal',
    'vrAberto',
    'statusNotificacao',
    'statusConfirmacao',
    'situacaoTitulo',
    'statusPagamento',
    'diasAtraso',
    'boleto',
  ]),
);
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: NonNullable<QuickFilter>; label: string; color: string }[] = [
  { key: 'VENCIDO', label: 'Vencidos', color: statusPagamentoColor('VENCIDO') },
  { key: 'VINCENDO', label: 'Vincendo', color: statusPagamentoColor('VINCENDO') },
  { key: 'PAGO_PARCIAL', label: 'Pago Parcial', color: statusPagamentoColor('PAGO_PARCIAL') },
  { key: 'EM_NEGOCIACAO', label: 'Em Negociação', color: 'var(--agro-base)' },
];

const filtered = computed(() =>
  props.titulos.filter((t) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !t.numero.toLowerCase().includes(q) &&
      !t.cedente.toLowerCase().includes(q) &&
      !t.sacado.toLowerCase().includes(q) &&
      !t.veiculoNome.toLowerCase().includes(q) &&
      !t.lastro.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value === 'EM_NEGOCIACAO') {
      if (!t.emNegociacao) return false;
    } else if (quickFilter.value && t.statusPagamento !== quickFilter.value) {
      return false;
    }
    if (applied.value.veiculoId && t.veiculoId !== applied.value.veiculoId) return false;
    if (applied.value.veiculoTipo && t.veiculoTipo !== applied.value.veiculoTipo) return false;
    if (applied.value.statusPagamento && t.statusPagamento !== applied.value.statusPagamento) return false;
    if (applied.value.cedente && !t.cedente.toLowerCase().includes(applied.value.cedente.toLowerCase())) {
      return false;
    }
    if (applied.value.sacado && !t.sacado.toLowerCase().includes(applied.value.sacado.toLowerCase())) {
      return false;
    }
    return true;
  }),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });
const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  veiculo: 'minmax(140px, 1.4fr)',
  tipo: 'minmax(80px, 0.7fr)',
  cedente: 'minmax(150px, 1.5fr)',
  sacado: 'minmax(150px, 1.5fr)',
  gerente: 'minmax(120px, 1fr)',
  vencimento: 'minmax(100px, 0.9fr)',
  vrNominal: 'minmax(110px, 1fr)',
  vrAquisicao: 'minmax(110px, 1fr)',
  vrPresente: 'minmax(110px, 1fr)',
  vrAberto: 'minmax(110px, 1fr)',
  vrJuros: 'minmax(90px, 0.9fr)',
  vrMulta: 'minmax(90px, 0.9fr)',
  statusNotificacao: 'minmax(110px, 1fr)',
  statusConfirmacao: 'minmax(110px, 1fr)',
  situacaoTitulo: 'minmax(110px, 1fr)',
  statusPagamento: 'minmax(110px, 1fr)',
  diasAtraso: 'minmax(90px, 0.8fr)',
  boleto: 'minmax(80px, 0.7fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(
  () => `minmax(160px, 1.4fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`,
);

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

function toggleQuickFilter(key: NonNullable<QuickFilter>) {
  quickFilter.value = quickFilter.value === key ? null : key;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
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

function menuActions(t: Titulo) {
  return [
    {
      icon: Receipt,
      label: 'Gerar Boleto',
      onClick: () => {
        menuOpenId.value = null;
        emit('gerarBoleto', t.id);
      },
    },
    {
      icon: BadgeCheck,
      label: 'Confirmar Ativo',
      onClick: () => {
        menuOpenId.value = null;
        emit('confirmar', t.id);
      },
    },
    {
      icon: BellRing,
      label: 'Notificar Ativo',
      onClick: () => {
        menuOpenId.value = null;
        emit('notificar', t.id);
      },
    },
    {
      icon: Handshake,
      label: 'Sinalizar Negociação',
      onClick: () => {
        menuOpenId.value = null;
        emit('negociar', t.id);
      },
    },
  ];
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
        Títulos e Ativos
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'título encontrado' : 'títulos encontrados' }}
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search
          :size="15"
          style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="searchQuery"
          placeholder="Buscar por nº, lastro, cedente, sacado ou veículo"
          style="
            width: 100%;
            height: 38px;
            padding: 0 12px 0 36px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
          @input="setPage(1)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.key"
            :style="{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              border:
                quickFilter === qf.key
                  ? `1px solid ${qf.color}`
                  : '1px solid var(--border-default)',
              background:
                quickFilter === qf.key
                  ? `color-mix(in srgb, ${qf.color} 12%, transparent)`
                  : 'var(--surface-card)',
              color: quickFilter === qf.key ? qf.color : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.key)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="
              gap: 8px;
              height: 38px;
              padding: 0 16px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-strong);
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
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
                width: '420px',
                maxWidth: 'calc(100vw - 48px)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
                <div>
                  <div class="filter-label">Veículo</div>
                  <select v-model="draft.veiculoId" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Tipo de veículo</div>
                  <select v-model="draft.veiculoTipo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="t in VEICULO_TIPO_OPTS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Status de pagamento</div>
                  <select v-model="draft.statusPagamento" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_PAGAMENTO_OPTS" :key="s" :value="s">
                      {{ statusPagamentoLabel(s) }}
                    </option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Cedente</div>
                  <input v-model="draft.cedente" placeholder="Buscar cedente" class="filter-input" />
                </div>
                <div style="grid-column: span 2">
                  <div class="filter-label">Sacado</div>
                  <input v-model="draft.sacado" placeholder="Buscar sacado" class="filter-input" />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button
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
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 38px;
              padding: 0 14px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-muted);
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
            "
            @click="colsMenuOpen = !colsMenuOpen"
          >
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
                min-width: 220px;
                max-height: 360px;
                overflow-y: auto;
                padding: 8px;
              "
            >
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center titulos-cols-item"
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
          <div class="grid titulos-table-row titulos-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Nº Título</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <FileText :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum título encontrado
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">
              Ajuste os filtros para ver outros resultados.
            </div>
          </div>

          <div
            v-for="t in pageItems"
            :key="t.id"
            class="grid items-center titulos-row titulos-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', t.id)"
          >
            <div>
              <div
                style="
                  font-weight: var(--weight-bold);
                  color: var(--text-strong);
                  font-variant-numeric: tabular-nums;
                "
              >
                #{{ t.numero }}
              </div>
              <span
                style="
                  display: inline-block;
                  margin-top: 4px;
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
                Lastro {{ t.lastro }}
              </span>
            </div>

            <div v-if="visibleCols.has('veiculo')" style="color: var(--text-default)">
              {{ t.veiculoNome }}
            </div>
            <div v-if="visibleCols.has('tipo')">
              <span
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.1em;
                  padding: 4px 7px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ t.tipo }}
              </span>
            </div>
            <div v-if="visibleCols.has('cedente')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.cedente }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ t.cedenteCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('sacado')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.sacado }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ t.sacadoCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('gerente')" style="color: var(--text-default)">
              {{ t.gerente }}
            </div>
            <div
              v-if="visibleCols.has('vencimento')"
              style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
            >
              {{ t.vencimento }}
            </div>
            <div
              v-if="visibleCols.has('vrNominal')"
              style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)"
            >
              {{ brl(t.vrNominal) }}
            </div>
            <div
              v-if="visibleCols.has('vrAquisicao')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ t.vrAquisicao != null ? brl(t.vrAquisicao) : '—' }}
            </div>
            <div
              v-if="visibleCols.has('vrPresente')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ t.vrPresente != null ? brl(t.vrPresente) : '—' }}
            </div>
            <div
              v-if="visibleCols.has('vrAberto')"
              :style="{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color: t.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-strong)',
              }"
            >
              {{ brl(t.vrAberto) }}
            </div>
            <div
              v-if="visibleCols.has('vrJuros')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ brl(t.vrJuros) }}
            </div>
            <div
              v-if="visibleCols.has('vrMulta')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ brl(t.vrMulta) }}
            </div>
            <div v-if="visibleCols.has('statusNotificacao')">
              <span class="flex items-center" :style="pillStyle(statusNotificacaoColor(t.statusNotificacao))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusNotificacaoColor(t.statusNotificacao) }" />
                {{ statusNotificacaoLabel(t.statusNotificacao) }}
              </span>
            </div>
            <div v-if="visibleCols.has('statusConfirmacao')">
              <span class="flex items-center" :style="pillStyle(statusConfirmacaoColor(t.statusConfirmacao))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusConfirmacaoColor(t.statusConfirmacao) }" />
                {{ statusConfirmacaoLabel(t.statusConfirmacao) }}
              </span>
            </div>
            <div v-if="visibleCols.has('situacaoTitulo')">
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
            <div
              v-if="visibleCols.has('diasAtraso')"
              :style="{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color: t.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-muted)',
              }"
            >
              {{ t.diasAtraso }}
            </div>
            <div v-if="visibleCols.has('boleto')" class="flex items-center" style="gap: 8px">
              <span
                :style="{
                  fontVariantNumeric: 'tabular-nums',
                  color: t.boletoGeradoEm ? 'var(--text-default)' : 'var(--text-muted)',
                }"
              >
                {{ t.boletoGeradoEm ?? 'Não Informado' }}
              </span>
              <Tooltip :content="t.boletoGeradoEm ? 'Boleto gerado' : 'Sem boleto'">
                <CheckCircle2
                  v-if="t.boletoGeradoEm"
                  :size="15"
                  :stroke-width="2.25"
                  style="color: var(--success-base); flex-shrink: 0"
                />
                <XCircle
                  v-else
                  :size="15"
                  :stroke-width="2.25"
                  style="color: var(--danger-base); flex-shrink: 0"
                />
              </Tooltip>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
                class="flex items-center justify-center"
                :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: menuOpenId === t.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === t.id ? null : t.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === t.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div
                  style="
                    position: absolute;
                    top: 36px;
                    right: 0;
                    z-index: 31;
                    background: var(--surface-card);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    min-width: 220px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(t)"
                    :key="action.label"
                    class="flex items-center titulos-menu-item"
                    style="
                      gap: 10px;
                      width: 100%;
                      padding: 10px 14px;
                      background: transparent;
                      border: none;
                      cursor: pointer;
                      font-size: var(--text-sm);
                      color: var(--text-default);
                      text-align: left;
                    "
                    @click.stop="action.onClick"
                  >
                    <component
                      :is="action.icon"
                      :size="15"
                      style="color: var(--text-muted); flex-shrink: 0"
                    />
                    {{ action.label }}
                  </button>
                </div>
              </template>
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
  </div>
</template>

<style scoped>
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
.titulos-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.titulos-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.titulos-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.titulos-row:hover {
  background: var(--surface-sunken);
}
.titulos-cols-item:hover {
  background: var(--surface-sunken);
}
.titulos-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
