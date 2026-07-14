<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  Search,
  RefreshCw,
  Download,
  Send,
} from 'lucide-vue-next';
import {
  CAMPANHA_OPTS,
  CANAL_DISPARO_OPTS,
  STATUS_DISPARO_OPTS,
  statusDisparoColor,
  statusDisparoLabel,
  taxaEntrega,
  taxaAbertura,
  fmtPct,
  type DisparoNotificacao,
  type StatusDisparo,
} from '../data/resultadoNotificacoesData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ disparos: DisparoNotificacao[] }>();
const emit = defineEmits<{
  open: [id: string];
  reenviar: [id: string];
  exportar: [id: string];
}>();

type QuickFilter = StatusDisparo | null;

interface Filters {
  campanha: string;
  canal: string;
  status: string;
}

const EMPTY_FILTERS: Filters = { campanha: '', canal: '', status: '' };

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: StatusDisparo; label: string }[] = [
  { key: 'SUCESSO', label: 'Sucesso' },
  { key: 'FALHA', label: 'Falha' },
  { key: 'PROCESSANDO', label: 'Em processamento' },
];

const filtered = computed(() =>
  props.disparos.filter((d) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !d.lote.toLowerCase().includes(q) &&
      !d.campanha.toLowerCase().includes(q) &&
      !d.veiculoNome.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value && d.status !== quickFilter.value) return false;
    if (applied.value.campanha && d.campanha !== applied.value.campanha) return false;
    if (applied.value.canal && d.canal !== applied.value.canal) return false;
    if (applied.value.status && d.status !== applied.value.status) return false;
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

const gridTemplate =
  'minmax(130px, 1.2fr) minmax(160px, 1.6fr) minmax(80px, 0.8fr) minmax(120px, 1.2fr) minmax(110px, 1fr) minmax(80px, 0.8fr) minmax(80px, 0.8fr) minmax(110px, 1fr) 56px';

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

function toggleQuickFilter(status: StatusDisparo) {
  quickFilter.value = quickFilter.value === status ? null : status;
  setPage(1);
}

function menuActions(d: DisparoNotificacao) {
  const items = [
    {
      icon: Download,
      label: 'Exportar',
      onClick: () => {
        menuOpenId.value = null;
        emit('exportar', d.id);
      },
    },
  ];
  if (d.status === 'FALHA' || d.status === 'SUCESSO') {
    items.unshift({
      icon: RefreshCw,
      label: 'Reenviar lote',
      onClick: () => {
        menuOpenId.value = null;
        emit('reenviar', d.id);
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
        Resultado de Notificações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'disparo encontrado' : 'disparos encontrados' }}
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
          placeholder="Buscar por lote, campanha ou veículo"
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
                  ? `1px solid ${statusDisparoColor(qf.key)}`
                  : '1px solid var(--border-default)',
              background:
                quickFilter === qf.key
                  ? `color-mix(in srgb, ${statusDisparoColor(qf.key)} 12%, transparent)`
                  : 'var(--surface-card)',
              color: quickFilter === qf.key ? statusDisparoColor(qf.key) : 'var(--text-muted)',
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
            @click="filterOpen = !filterOpen"
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
            <ChevronDown :size="14" style="color: var(--text-muted)" />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              style="
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                z-index: 31;
                width: 360px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-lg);
                padding: 20px;
              "
            >
              <div class="flex flex-col" style="gap: 14px">
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Campanha
                  </div>
                  <select
                    v-model="draft.campanha"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todas</option>
                    <option v-for="c in CAMPANHA_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Canal
                  </div>
                  <select
                    v-model="draft.canal"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todos</option>
                    <option v-for="c in CANAL_DISPARO_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Status
                  </div>
                  <select
                    v-model="draft.status"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_DISPARO_OPTS" :key="s" :value="s">{{ statusDisparoLabel(s) }}</option>
                  </select>
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
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid disp-table-row disp-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Lote</div>
            <div>Campanha</div>
            <div>Canal</div>
            <div>Data/Hora</div>
            <div>Veículo</div>
            <div style="text-align: right">Entrega</div>
            <div style="text-align: right">Abertura</div>
            <div>Status</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <Send :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum disparo encontrado
            </div>
          </div>

          <div
            v-for="d in pageItems"
            :key="d.id"
            class="grid items-center disp-row disp-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', d.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ d.lote }}
            </div>
            <div style="color: var(--text-default)">{{ d.campanha }}</div>
            <div>
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
                {{ d.canal }}
              </span>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ d.dataHora }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ d.veiculoNome }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ fmtPct(taxaEntrega(d)) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ fmtPct(taxaAbertura(d)) }}
            </div>
            <div>
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
                  background: `color-mix(in srgb, ${statusDisparoColor(d.status)} 14%, transparent)`,
                  color: statusDisparoColor(d.status),
                  whiteSpace: 'nowrap',
                }"
              >
                <span
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: statusDisparoColor(d.status),
                  }"
                />
                {{ statusDisparoLabel(d.status) }}
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
                  background: menuOpenId === d.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === d.id ? null : d.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === d.id">
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
                    min-width: 170px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(d)"
                    :key="action.label"
                    class="flex items-center disp-menu-item"
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
.disp-table-row {
  column-gap: 14px;
  padding: 14px 20px;
  white-space: nowrap;
}
.disp-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.disp-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.disp-row:hover {
  background: var(--surface-sunken);
}
.disp-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
