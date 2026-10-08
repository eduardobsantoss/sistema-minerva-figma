<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  AlertTriangle,
  BellRing,
  Contact,
  Check,
  ChevronDown,
  Filter,
  History,
  LayoutGrid,
  List,
  ListChecks,
  Minus,
  MoreVertical,
  RefreshCw,
  Send,
  SlidersHorizontal,
  X,
  XCircle,
} from 'lucide-vue-next';
import {
  GRUPO_CESSAO_OPTS,
  SITUACAO_GRUPO_OPTS,
  STATUS_CESSAO_OPTS,
  VEICULO_CESSAO_OPTS,
  brl,
  situacaoGrupoColor,
  situacaoGrupoLabel,
  statusCessaoColor,
  statusCessaoLabel,
  tagsCessao,
  tipoNotificacaoLabel,
  type NotificacaoCessao,
  type StatusNotificacaoCessao,
  type TomTag,
} from '../data/notificacoesCessaoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import ParteNotificacaoModal from '../components/ParteNotificacaoModal.vue';
import { usePartesNotificacao, type ParteNotificacao } from '../composables/usePartesNotificacao';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ itens: NotificacaoCessao[] }>();
const emit = defineEmits<{
  open: [id: string];
  reenviar: [id: string];
  cancelar: [id: string];
  verTitulos: [id: string];
}>();

type ColKey = 'titulo' | 'veiculo' | 'cessao' | 'grupo' | 'cedente' | 'sacado' | 'canal' | 'dataEnvio' | 'valor' | 'status';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'titulo', label: 'Título' },
  { key: 'veiculo', label: 'Veículo' },
  { key: 'cessao', label: 'Cessão' },
  { key: 'grupo', label: 'Grupo empresarial' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'canal', label: 'Canal' },
  { key: 'dataEnvio', label: 'Data envio' },
  { key: 'valor', label: 'VR. Cessão', align: 'right' },
  { key: 'status', label: 'Status' },
];

interface Filters {
  veiculoId: string;
  cessao: string;
  status: string;
  grupo: string;
  situacaoGrupo: string;
  lastro: string;
  numeroTitulo: string;
  sacadoNome: string;
  sacadoDocumento: string;
  dataCessao: string;
  dataEnvio: string;
}

const EMPTY_FILTERS: Filters = {
  veiculoId: '',
  cessao: '',
  status: '',
  grupo: '',
  situacaoGrupo: '',
  lastro: '',
  numeroTitulo: '',
  sacadoNome: '',
  sacadoDocumento: '',
  dataCessao: '',
  dataEnvio: '',
};

const partes = usePartesNotificacao();
const parteModal = ref<{ parte: ParteNotificacao; n: NotificacaoCessao; tab: 'notificacoes' | 'contatos' } | null>(null);

function abrirParte(parte: ParteNotificacao, n: NotificacaoCessao, tab: 'notificacoes' | 'contatos' = 'notificacoes') {
  parteModal.value = { parte, n, tab };
}

function resumoTexto(label: string, r: { texto: string }) {
  return `${label}: ${r.texto}`;
}

function contatosTexto(n: NotificacaoCessao) {
  const lista = partes.contatosDe(n.sacadoCnpj);
  if (!lista.length) return { texto: 'Sem contatos cadastrados', tom: 'falta' as TomTag };
  const temEmail = lista.some((c) => c.email.trim());
  const total = `${lista.length} ${lista.length === 1 ? 'contato' : 'contatos'}`;
  return temEmail
    ? { texto: total, tom: 'ok' as TomTag }
    : { texto: `${total} · sem e-mail`, tom: 'alerta' as TomTag };
}

const viewMode = ref<'cards' | 'table'>('cards');
const viewOptions = [
  { key: 'cards', label: 'Visualização em cards', icon: LayoutGrid },
  { key: 'table', label: 'Visualização em tabela', icon: List },
];

const quickFilter = ref<StatusNotificacaoCessao | null>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set(['titulo', 'veiculo', 'grupo', 'cedente', 'sacado', 'canal', 'dataEnvio', 'status']),
);
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: StatusNotificacaoCessao; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'ENVIADA', label: 'Enviadas' },
  { key: 'FALHOU', label: 'Falhas' },
];

function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

function brParaISO(data: string) {
  const [dd, mm, yyyy] = data.slice(0, 10).split('/');
  return dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : '';
}

function contem(texto: string, termo: string) {
  return texto.toLowerCase().includes(termo.trim().toLowerCase());
}

const filtered = computed(() =>
  props.itens.filter((n) => {
    const f = applied.value;
    if (quickFilter.value && n.status !== quickFilter.value) return false;
    if (f.veiculoId && n.veiculoId !== f.veiculoId) return false;
    if (f.cessao && !contem(n.protocolo, f.cessao)) return false;
    if (f.status && n.status !== f.status) return false;
    if (f.grupo && n.grupoEmpresarial !== f.grupo) return false;
    if (f.situacaoGrupo && n.situacaoGrupo !== f.situacaoGrupo) return false;
    if (f.lastro && !contem(n.lastro, f.lastro)) return false;
    if (f.numeroTitulo && !contem(n.tituloNumero, f.numeroTitulo)) return false;
    if (f.sacadoNome && !contem(n.sacado, f.sacadoNome)) return false;
    if (f.sacadoDocumento && !apenasDigitos(n.sacadoCnpj).includes(apenasDigitos(f.sacadoDocumento))) return false;
    if (f.dataCessao && brParaISO(n.dataCessao) !== f.dataCessao) return false;
    if (f.dataEnvio && (!n.dataEnvio || brParaISO(n.dataEnvio) !== f.dataEnvio)) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => filtered.value, {
  defaultPageSize: 10,
});
const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  titulo: 'minmax(120px, 1.1fr)',
  veiculo: 'minmax(150px, 1.3fr)',
  cessao: 'minmax(140px, 1.1fr)',
  grupo: 'minmax(160px, 1.2fr)',
  cedente: 'minmax(150px, 1.4fr)',
  sacado: 'minmax(150px, 1.4fr)',
  canal: 'minmax(90px, 0.8fr)',
  dataEnvio: 'minmax(130px, 1fr)',
  valor: 'minmax(110px, 1fr)',
  status: 'minmax(110px, 1fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(
  () => `minmax(130px, 1.2fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`,
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

function toggleQuickFilter(status: StatusNotificacaoCessao) {
  quickFilter.value = quickFilter.value === status ? null : status;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < 440 && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function podeEnviar(n: NotificacaoCessao) {
  return n.status === 'PENDENTE' || n.status === 'FALHOU';
}

function podeCancelar(n: NotificacaoCessao) {
  return n.status === 'PENDENTE' || n.status === 'ENVIADA';
}

function menuActions(n: NotificacaoCessao) {
  const items = [
    {
      icon: History,
      label: 'Histórico',
      onClick: () => {
        menuOpenId.value = null;
        emit('open', n.id);
      },
    },
    {
      icon: ListChecks,
      label: 'Ver títulos',
      onClick: () => {
        menuOpenId.value = null;
        emit('verTitulos', n.id);
      },
    },
  ];
  if (podeEnviar(n)) {
    items.push({
      icon: RefreshCw,
      label: n.status === 'FALHOU' ? 'Reenviar' : 'Enviar',
      onClick: () => {
        menuOpenId.value = null;
        emit('reenviar', n.id);
      },
    });
  }
  if (podeCancelar(n)) {
    items.push({
      icon: XCircle,
      label: 'Cancelar',
      onClick: () => {
        menuOpenId.value = null;
        emit('cancelar', n.id);
      },
    });
  }
  return items;
}

const TOM_COR: Record<TomTag, string> = {
  ok: 'var(--success-base)',
  alerta: 'var(--warning-base)',
  falta: 'var(--danger-base)',
  neutro: 'var(--text-muted)',
};

const TOM_ICONE: Record<TomTag, typeof Check> = {
  ok: Check,
  alerta: AlertTriangle,
  falta: X,
  neutro: Minus,
};

function tagStyle(tom: TomTag) {
  const cor = TOM_COR[tom];
  return {
    background: `color-mix(in srgb, ${cor} 12%, transparent)`,
    color: tom === 'neutro' ? 'var(--text-default)' : cor,
    border: `1px solid color-mix(in srgb, ${cor} 28%, transparent)`,
  };
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
        Notificações de Cessão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }}
        {{ filtered.length === 1 ? 'notificação encontrada' : 'notificações encontradas' }}
      </p>
    </div>

    <slot name="tabs" />

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 6px">
        <button
          v-for="qf in QUICK_FILTERS"
          :key="qf.key"
          type="button"
          :style="{
            height: '38px',
            padding: '0 14px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            border:
              quickFilter === qf.key ? `1px solid ${statusCessaoColor(qf.key)}` : '1px solid var(--border-default)',
            background:
              quickFilter === qf.key
                ? `color-mix(in srgb, ${statusCessaoColor(qf.key)} 12%, transparent)`
                : 'var(--surface-card)',
            color: quickFilter === qf.key ? statusCessaoColor(qf.key) : 'var(--text-muted)',
          }"
          @click="toggleQuickFilter(qf.key)"
        >
          {{ qf.label }}
        </button>
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <SegmentedToggle
          :model-value="viewMode"
          :options="viewOptions"
          variant="brand"
          icon-only
          size="sm"
          @update:model-value="viewMode = $event as 'cards' | 'table'"
        />

        <div style="position: relative">
          <button ref="filterBtnRef" type="button" class="nc-toolbar-btn" @click="openFilters">
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
                  <div class="filter-label">Veículo</div>
                  <select v-model="draft.veiculoId" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_CESSAO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Cessão</div>
                  <input v-model="draft.cessao" placeholder="Protocolo da cessão" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Status</div>
                  <select v-model="draft.status" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_CESSAO_OPTS" :key="s" :value="s">{{ statusCessaoLabel(s) }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Grupo empresarial</div>
                  <select v-model="draft.grupo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="g in GRUPO_CESSAO_OPTS" :key="g" :value="g">{{ g }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Situação do grupo</div>
                  <select v-model="draft.situacaoGrupo" class="filter-input">
                    <option value="">Todas</option>
                    <option v-for="s in SITUACAO_GRUPO_OPTS" :key="s" :value="s">{{ situacaoGrupoLabel(s) }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Lastro</div>
                  <input v-model="draft.lastro" placeholder="Código do lastro" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Número do título</div>
                  <input v-model="draft.numeroTitulo" placeholder="Número do título" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Nome do sacado</div>
                  <input v-model="draft.sacadoNome" placeholder="Nome do sacado" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Documento do sacado</div>
                  <input v-model="draft.sacadoDocumento" placeholder="CPF ou CNPJ" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Data da cessão</div>
                  <input v-model="draft.dataCessao" type="date" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Data de envio</div>
                  <input v-model="draft.dataEnvio" type="date" class="filter-input" />
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

        <div v-if="viewMode === 'table'" style="position: relative">
          <button type="button" class="nc-toolbar-btn" style="padding: 0 14px; gap: 6px" @click="colsMenuOpen = !colsMenuOpen">
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
                padding: 8px;
              "
            >
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center nc-cols-item"
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
      v-if="pageItems.length === 0"
      class="flex flex-col items-center justify-center"
      style="
        gap: 10px;
        padding: 48px 24px;
        text-align: center;
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
      "
    >
      <BellRing :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
        Nenhuma notificação encontrada
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste os filtros para ver outros resultados.</div>
    </div>

    <div
      v-else-if="viewMode === 'cards'"
      class="grid"
      style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 12px"
    >
      <article v-for="n in pageItems" :key="n.id" class="nc-card" :aria-label="`Cessão ${n.protocolo}`">
        <div class="flex items-start justify-between" style="gap: 10px">
          <div style="min-width: 0">
            <div class="nc-eyebrow">Lastro {{ n.lastro }} · #{{ n.tituloNumero }}</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px">
              {{ n.sacado }}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
              {{ n.sacadoCnpj }}
            </div>
          </div>
          <span class="flex items-center" :style="pillStyle(statusCessaoColor(n.status))">
            <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusCessaoColor(n.status) }" />
            {{ statusCessaoLabel(n.status) }}
          </span>
        </div>

        <div class="grid nc-meta">
          <div>
            <div class="nc-eyebrow">Veículo</div>
            <div class="nc-meta-value">{{ n.veiculoNome }}</div>
          </div>
          <div>
            <div class="nc-eyebrow">Cessão</div>
            <div class="nc-meta-value" style="font-variant-numeric: tabular-nums">
              {{ n.protocolo }} · {{ n.dataCessao }}
            </div>
          </div>
          <div>
            <div class="nc-eyebrow">Cedente</div>
            <div class="nc-meta-value">{{ n.cedente }}</div>
          </div>
          <div>
            <div class="nc-eyebrow">VR. Cessão</div>
            <div class="nc-meta-value" style="font-variant-numeric: tabular-nums">{{ brl(n.valorCessao) }}</div>
          </div>
        </div>

        <div class="flex items-center" style="gap: 8px; margin-top: 12px; flex-wrap: wrap">
          <span class="nc-eyebrow">Grupo empresarial</span>
          <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ n.grupoEmpresarial }}
          </span>
          <span class="flex items-center" :style="pillStyle(situacaoGrupoColor(n.situacaoGrupo))">
            Grupo {{ situacaoGrupoLabel(n.situacaoGrupo).toLowerCase() }}
          </span>
        </div>

        <div class="nc-partes">
          <div class="nc-parte">
            <div class="nc-parte-info">
              <div class="nc-parte-title">Cedente</div>
              <ul class="nc-resumo">
                <li :style="{ color: TOM_COR[partes.resumoCessao('cedente', n.cedenteCnpj).tom] }">
                  <component :is="TOM_ICONE[partes.resumoCessao('cedente', n.cedenteCnpj).tom]" :size="13" :stroke-width="2.5" aria-hidden="true" />
                  <span>{{ resumoTexto('Cessão', partes.resumoCessao('cedente', n.cedenteCnpj)) }}</span>
                </li>
                <li :style="{ color: TOM_COR[partes.resumoCobranca(n.cedenteCnpj).tom] }">
                  <component :is="TOM_ICONE[partes.resumoCobranca(n.cedenteCnpj).tom]" :size="13" :stroke-width="2.5" aria-hidden="true" />
                  <span>{{ resumoTexto('Cobrança', partes.resumoCobranca(n.cedenteCnpj)) }}</span>
                </li>
              </ul>
            </div>
            <div class="nc-parte-actions">
              <button
                type="button"
                class="nc-action"
                :aria-label="`Gerenciar notificações do cedente ${n.cedente}`"
                @click="abrirParte('cedente', n)"
              >
                <BellRing :size="14" aria-hidden="true" /> Notificações
              </button>
            </div>
          </div>

          <div class="nc-parte">
            <div class="nc-parte-info">
              <div class="nc-parte-title">Sacado</div>
              <ul class="nc-resumo">
                <li :style="{ color: TOM_COR[partes.resumoCessao('sacado', n.sacadoCnpj).tom] }">
                  <component :is="TOM_ICONE[partes.resumoCessao('sacado', n.sacadoCnpj).tom]" :size="13" :stroke-width="2.5" aria-hidden="true" />
                  <span>{{ resumoTexto('Cessão', partes.resumoCessao('sacado', n.sacadoCnpj)) }}</span>
                </li>
                <li :style="{ color: TOM_COR[contatosTexto(n).tom] }">
                  <component :is="TOM_ICONE[contatosTexto(n).tom]" :size="13" :stroke-width="2.5" aria-hidden="true" />
                  <span>{{ contatosTexto(n).texto }}</span>
                </li>
              </ul>
            </div>
            <div class="nc-parte-actions">
              <button
                type="button"
                class="nc-action"
                :aria-label="`Gerenciar notificações do sacado ${n.sacado}`"
                @click="abrirParte('sacado', n)"
              >
                <BellRing :size="14" aria-hidden="true" /> Notificações
              </button>
              <button
                type="button"
                class="nc-action"
                :aria-label="`Gerenciar contatos do sacado ${n.sacado}`"
                @click="abrirParte('sacado', n, 'contatos')"
              >
                <Contact :size="14" aria-hidden="true" /> Contatos
              </button>
            </div>
          </div>
        </div>

        <div style="margin: 14px 0 16px">
          <div class="nc-eyebrow" style="margin-bottom: 8px">Condições da cessão</div>
          <ul class="flex" style="gap: 6px; flex-wrap: wrap; list-style: none; margin: 0; padding: 0">
            <li v-for="tag in tagsCessao(partes.efetivo(n))" :key="tag.key" class="nc-tag" :style="tagStyle(tag.tom)">
              <component :is="TOM_ICONE[tag.tom]" :size="12" :stroke-width="2.5" aria-hidden="true" />
              {{ tag.label }}
            </li>
          </ul>
        </div>

        <div class="nc-card-actions">
          <button type="button" class="nc-action" @click="emit('open', n.id)">
            <History :size="14" /> Histórico
          </button>
          <button type="button" class="nc-action" :disabled="!podeEnviar(n)" @click="emit('reenviar', n.id)">
            <Send :size="14" /> {{ n.status === 'FALHOU' ? 'Reenviar' : 'Enviar' }}
          </button>
          <button type="button" class="nc-action nc-action-primary" @click="emit('verTitulos', n.id)">
            <ListChecks :size="14" /> Ver títulos
          </button>
        </div>
      </article>

      <div class="nc-pager">
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </div>

    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden"
    >
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid nc-table-row nc-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Lastro</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-for="n in pageItems"
            :key="n.id"
            class="grid items-center nc-row nc-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', n.id)"
          >
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: 0.04em">
                {{ n.lastro }}
              </div>
              <span
                style="
                  display: inline-block;
                  margin-top: 4px;
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 2px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--gci-light);
                  color: var(--gci-base);
                "
              >
                {{ n.veiculoTipo }}
              </span>
              <span
                style="
                  display: inline-block;
                  margin-top: 4px;
                  margin-left: 4px;
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 2px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ tipoNotificacaoLabel(n.tipo) }}
              </span>
            </div>

            <div
              v-if="visibleCols.has('titulo')"
              style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)"
            >
              #{{ n.tituloNumero }}
            </div>
            <div v-if="visibleCols.has('veiculo')" style="color: var(--text-default)">{{ n.veiculoNome }}</div>
            <div v-if="visibleCols.has('cessao')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ n.protocolo }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ n.dataCessao }}
              </div>
            </div>
            <div v-if="visibleCols.has('grupo')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.grupoEmpresarial }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                {{ situacaoGrupoLabel(n.situacaoGrupo) }}
              </div>
            </div>
            <div v-if="visibleCols.has('cedente')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.cedente }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ n.cedenteCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('sacado')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.sacado }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ n.sacadoCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('canal')">
              <span
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 4px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ n.canal }}
              </span>
            </div>
            <div
              v-if="visibleCols.has('dataEnvio')"
              style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
            >
              {{ n.dataEnvio ?? '—' }}
            </div>
            <div
              v-if="visibleCols.has('valor')"
              style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)"
            >
              {{ brl(n.valorCessao) }}
            </div>
            <div v-if="visibleCols.has('status')">
              <span class="flex items-center" :style="pillStyle(statusCessaoColor(n.status))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusCessaoColor(n.status) }" />
                {{ statusCessaoLabel(n.status) }}
              </span>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
                type="button"
                aria-label="Ações da notificação"
                class="flex items-center justify-center"
                :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: menuOpenId === n.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === n.id ? null : n.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === n.id">
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
                    min-width: 180px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(n)"
                    :key="action.label"
                    type="button"
                    class="flex items-center nc-menu-item"
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
                    <component :is="action.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
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

    <ParteNotificacaoModal
      v-if="parteModal"
      :key="`${parteModal.parte}-${parteModal.n.id}`"
      :parte="parteModal.parte"
      :nome="parteModal.parte === 'cedente' ? parteModal.n.cedente : parteModal.n.sacado"
      :documento="parteModal.parte === 'cedente' ? parteModal.n.cedenteCnpj : parteModal.n.sacadoCnpj"
      :operacao-id="parteModal.n.veiculoId"
      :initial-tab="parteModal.tab"
      @close="parteModal = null"
    />
  </div>
</template>

<style scoped>
.nc-toolbar-btn {
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
.nc-eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.nc-card {
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
}
.nc-meta {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.nc-meta-value {
  margin-top: 2px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  overflow-wrap: anywhere;
}
.nc-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: var(--weight-bold);
  line-height: 1.2;
}
.nc-partes {
  margin-top: 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.nc-parte {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 12px;
  padding: 12px 14px;
}
.nc-parte + .nc-parte {
  border-top: 1px solid var(--border-default);
}
.nc-parte-info {
  flex: 1 1 180px;
  min-width: 0;
}
.nc-parte-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.nc-resumo {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}
.nc-resumo li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nc-parte-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.nc-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-default);
}
.nc-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-strong);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
.nc-action:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.nc-action:disabled {
  cursor: not-allowed;
  color: var(--text-disabled);
  background: var(--surface-sunken);
}
.nc-action-primary {
  margin-left: auto;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border-color: transparent;
}
.nc-action-primary:hover:not(:disabled) {
  background: var(--action-primary-bg-hover);
}
.nc-pager {
  grid-column: 1 / -1;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.nc-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.nc-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.nc-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.nc-row:hover {
  background: var(--surface-sunken);
}
.nc-cols-item:hover {
  background: var(--surface-sunken);
}
.nc-menu-item:hover {
  background: var(--surface-sunken);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
