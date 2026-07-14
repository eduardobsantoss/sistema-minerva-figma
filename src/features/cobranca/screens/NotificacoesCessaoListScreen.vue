<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
  Search,
  BellRing,
  RefreshCw,
  XCircle,
  FileCheck2,
} from 'lucide-vue-next';
import {
  VEICULO_CESSAO_OPTS,
  CANAL_CESSAO_OPTS,
  STATUS_CESSAO_OPTS,
  brl,
  statusCessaoColor,
  statusCessaoLabel,
  type NotificacaoCessao,
  type StatusNotificacaoCessao,
} from '../data/notificacoesCessaoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ itens: NotificacaoCessao[] }>();
const emit = defineEmits<{
  open: [id: string];
  reenviar: [id: string];
  cancelar: [id: string];
}>();

type ColKey = 'titulo' | 'veiculo' | 'cedente' | 'sacado' | 'canal' | 'dataEnvio' | 'valor' | 'status';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'titulo', label: 'Título' },
  { key: 'veiculo', label: 'Veículo' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'canal', label: 'Canal' },
  { key: 'dataEnvio', label: 'Data envio' },
  { key: 'valor', label: 'VR. Cessão', align: 'right' },
  { key: 'status', label: 'Status' },
];

type QuickFilter = StatusNotificacaoCessao | null;

interface Filters {
  veiculoId: string;
  canal: string;
  status: string;
  cedente: string;
}

const EMPTY_FILTERS: Filters = { veiculoId: '', canal: '', status: '', cedente: '' };

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set(['titulo', 'veiculo', 'cedente', 'sacado', 'canal', 'dataEnvio', 'status']),
);
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: StatusNotificacaoCessao; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'ENVIADA', label: 'Enviadas' },
  { key: 'FALHOU', label: 'Falhas' },
];

const filtered = computed(() =>
  props.itens.filter((n) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !n.protocolo.toLowerCase().includes(q) &&
      !n.tituloNumero.toLowerCase().includes(q) &&
      !n.cedente.toLowerCase().includes(q) &&
      !n.sacado.toLowerCase().includes(q) &&
      !n.veiculoNome.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value && n.status !== quickFilter.value) return false;
    if (applied.value.veiculoId && n.veiculoId !== applied.value.veiculoId) return false;
    if (applied.value.canal && n.canal !== applied.value.canal) return false;
    if (applied.value.status && n.status !== applied.value.status) return false;
    if (applied.value.cedente && !n.cedente.toLowerCase().includes(applied.value.cedente.toLowerCase())) {
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
  titulo: 'minmax(120px, 1.1fr)',
  veiculo: 'minmax(140px, 1.3fr)',
  cedente: 'minmax(150px, 1.4fr)',
  sacado: 'minmax(150px, 1.4fr)',
  canal: 'minmax(90px, 0.8fr)',
  dataEnvio: 'minmax(120px, 1fr)',
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
    const estimatedPanelHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function menuActions(n: NotificacaoCessao) {
  const items = [
    {
      icon: FileCheck2,
      label: 'Ver comprovante',
      onClick: () => {
        menuOpenId.value = null;
        emit('open', n.id);
      },
    },
  ];
  if (n.status === 'PENDENTE' || n.status === 'FALHOU') {
    items.push({
      icon: RefreshCw,
      label: 'Reenviar',
      onClick: () => {
        menuOpenId.value = null;
        emit('reenviar', n.id);
      },
    });
  }
  if (n.status === 'PENDENTE' || n.status === 'ENVIADA') {
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

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search
          :size="15"
          style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="searchQuery"
          placeholder="Buscar por protocolo, título, cedente ou sacado"
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
                  ? `1px solid ${statusCessaoColor(qf.key)}`
                  : '1px solid var(--border-default)',
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
                width: '400px',
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
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Veículo
                  </div>
                  <select
                    v-model="draft.veiculoId"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_CESSAO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Canal
                  </div>
                  <select
                    v-model="draft.canal"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="c in CANAL_CESSAO_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Status
                  </div>
                  <select
                    v-model="draft.status"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_CESSAO_OPTS" :key="s" :value="s">{{ statusCessaoLabel(s) }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Cedente
                  </div>
                  <input
                    v-model="draft.cedente"
                    placeholder="Buscar cedente"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  />
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
            style="gap: 6px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold)"
            @click="colsMenuOpen = !colsMenuOpen"
          >
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 200px; padding: 8px">
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center nc-cols-item"
                style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
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

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid nc-table-row nc-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Protocolo</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <BellRing :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhuma notificação encontrada
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">
              Ajuste os filtros para ver outros resultados.
            </div>
          </div>

          <div
            v-for="n in pageItems"
            :key="n.id"
            class="grid items-center nc-row nc-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', n.id)"
          >
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ n.protocolo }}
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
            </div>

            <div v-if="visibleCols.has('titulo')" style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)">
              #{{ n.tituloNumero }}
            </div>
            <div v-if="visibleCols.has('veiculo')" style="color: var(--text-default)">{{ n.veiculoNome }}</div>
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
              <span
                class="flex items-center"
                :style="{
                  gap: '6px',
                  width: 'fit-content',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.04em',
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  background: `color-mix(in srgb, ${statusCessaoColor(n.status)} 14%, transparent)`,
                  color: statusCessaoColor(n.status),
                  whiteSpace: 'nowrap',
                }"
              >
                <span
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: statusCessaoColor(n.status),
                  }"
                />
                {{ statusCessaoLabel(n.status) }}
              </span>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
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
  </div>
</template>

<style scoped>
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
</style>
