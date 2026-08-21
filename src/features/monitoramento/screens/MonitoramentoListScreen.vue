<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  Search, Filter, Download, Layers, CheckCircle2, Clock, AlertTriangle, Radar, ChevronDown,
} from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  PEDIDOS_SEED,
  TIPO_CLIENTE_OPTS,
  VEICULO_OPTS,
  GERENTES_OPTS,
  PRAZO_STATUS_LABEL,
  brl,
  formatDateBR,
  prazoStatus,
  tipoClienteLabel,
  tipoClienteTone,
  chipTone,
  toneStyle,
  truncateChip,
  visibleChips,
  type MonitoringPedido,
  type PrazoStatus,
  type TipoClienteMon,
} from '../data/monitoramentoData';

const emit = defineEmits<{ open: [id: string] }>();

const { success } = useToast();
const searchQuery = ref('');
const selectedClasses = ref<TipoClienteMon[]>([]);
const classesOpen = ref(false);

interface Filters {
  gerente: string;
  veiculo: string;
  prazo: '' | PrazoStatus;
  prazoMin: string;
  prazoMax: string;
}

const EMPTY_FILTERS: Filters = { gerente: '', veiculo: '', prazo: '', prazoMin: '', prazoMax: '' };
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);

const PRAZO_LEGEND: { status: PrazoStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { status: 'ok', label: 'OK', icon: CheckCircle2 },
  { status: 'atencao', label: 'Precisa de Atenção', icon: Clock },
  { status: 'vencido', label: 'Vencido', icon: AlertTriangle },
];

const PRAZO_ICON: Record<PrazoStatus, typeof CheckCircle2> = {
  ok: CheckCircle2,
  atencao: Clock,
  vencido: AlertTriangle,
};

function prazoTone(status: PrazoStatus) {
  if (status === 'ok') return toneStyle('active');
  if (status === 'atencao') return toneStyle('warning');
  return toneStyle('danger');
}

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const classes = selectedClasses.value;
  const f = applied.value;
  return PEDIDOS_SEED.filter((p) => {
    if (q && !p.cliente.toLowerCase().includes(q)) return false;
    if (classes.length > 0 && !classes.includes(p.tipoCliente)) return false;
    if (f.gerente && p.gerente !== f.gerente) return false;
    if (f.veiculo && !p.cessoes.some((c) => c.veiculo === f.veiculo)) return false;
    if (f.prazo && prazoStatus(p.prazo) !== f.prazo) return false;
    if (f.prazoMin && p.prazo < f.prazoMin) return false;
    if (f.prazoMax && p.prazo > f.prazoMax) return false;
    return true;
  });
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

watch([searchQuery, selectedClasses, applied], () => setPage(1));

const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const gridTemplate = 'minmax(220px, 2fr) minmax(140px, 1.1fr) minmax(130px, 1fr) minmax(140px, 1.1fr) minmax(240px, 2.2fr)';

function chipsOf(p: MonitoringPedido) {
  return visibleChips(p.detalhes);
}

function exportRelatorio() {
  success('Relatório exportado (mock)');
}

function toggleClass(tipo: TipoClienteMon) {
  const next = new Set(selectedClasses.value);
  if (next.has(tipo)) next.delete(tipo);
  else next.add(tipo);
  selectedClasses.value = [...next];
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

function classesBtnStyle() {
  const on = classesOpen.value || selectedClasses.value.length > 0;
  return {
    gap: '8px',
    height: '38px',
    padding: '0 16px',
    cursor: 'pointer',
    background: on ? 'var(--gci-light)' : 'var(--surface-card)',
    border: `1px solid ${on ? 'var(--gci-base)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-lg)',
    color: on ? 'var(--gci-base)' : 'var(--text-strong)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-bold)',
  };
}

function filtersBtnStyle() {
  const on = filterOpen.value || activeFilterCount.value > 0;
  return {
    gap: '8px',
    height: '38px',
    padding: '0 16px',
    cursor: 'pointer',
    background: on ? 'var(--gci-light)' : 'var(--surface-card)',
    border: `1px solid ${on ? 'var(--gci-base)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-lg)',
    color: on ? 'var(--gci-base)' : 'var(--text-strong)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-bold)',
  };
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Monitoramento
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Monitoramento Pós Desembolso
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'pedido em monitoramento' : 'pedidos em monitoramento' }}
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1; min-width: 240px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="searchQuery"
          placeholder="Buscar por nome do cliente"
          style="width: 100%; height: 38px; padding: 0 12px 0 36px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div style="position: relative">
          <button type="button" class="flex items-center" :style="classesBtnStyle()" @click="classesOpen = !classesOpen">
            <Layers :size="15" />
            Tipo Cliente
            <span
              v-if="selectedClasses.length > 0"
              style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent)"
            >
              {{ selectedClasses.length }}
            </span>
            <ChevronDown :size="14" :style="{ transform: classesOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
          </button>
          <template v-if="classesOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="classesOpen = false" />
            <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 220px; padding: 8px">
              <div
                v-for="t in TIPO_CLIENTE_OPTS"
                :key="t"
                class="flex items-center classes-item"
                style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
                @click="toggleClass(t)"
              >
                <div @click.stop>
                  <Checkbox :checked="selectedClasses.includes(t)" @change="toggleClass(t)" />
                </div>
                <span class="flex items-center" style="gap: 6px">
                  <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: toneStyle(tipoClienteTone(t)).color, flexShrink: 0 }" />
                  {{ tipoClienteLabel(t) }}
                </span>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            type="button"
            class="flex items-center"
            :style="filtersBtnStyle()"
            @click="openFilters"
          >
            <Filter :size="15" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent)"
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" :style="{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              :style="{
                position: 'absolute',
                [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                right: 0,
                zIndex: 31,
                width: '440px',
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
                  <div class="filter-label">Gerente</div>
                  <select v-model="draft.gerente" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="g in GERENTES_OPTS" :key="g" :value="g">{{ g }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Veículo</div>
                  <select v-model="draft.veiculo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_OPTS" :key="v" :value="v">{{ v }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Status do prazo</div>
                  <select v-model="draft.prazo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in PRAZO_LEGEND" :key="s.status" :value="s.status">{{ PRAZO_STATUS_LABEL[s.status] }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Prazo (mín.)</div>
                  <input v-model="draft.prazoMin" type="date" class="filter-input" />
                </div>
                <div>
                  <div class="filter-label">Prazo (máx.)</div>
                  <input v-model="draft.prazoMax" type="date" class="filter-input" />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button
                  type="button"
                  style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
                  @click="handleClear"
                >
                  Limpar
                </button>
                <button
                  type="button"
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

        <button
          type="button"
          class="btn-animated btn-primary flex items-center"
          style="gap: 8px; height: 38px; padding: 0 16px; background: var(--action-primary-bg); color: var(--action-primary-text); border: 1px solid transparent; border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold)"
          @click="exportRelatorio"
        >
          <Download :size="15" />
          Exportar Relatório
        </button>
      </div>
    </div>

    <div class="flex items-center" style="gap: 16px; flex-wrap: wrap">
      <span
        v-for="item in PRAZO_LEGEND"
        :key="item.status"
        class="flex items-center"
        style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
      >
        <component
          :is="item.icon"
          :size="14"
          :stroke-width="2.25"
          :style="{ color: prazoTone(item.status).color, flexShrink: 0 }"
        />
        {{ item.label }}
      </span>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid mon-table-row mon-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Cliente</div>
            <div>Tipo Cliente</div>
            <div>Risco / Limite</div>
            <div>Prazo</div>
            <div>Detalhes</div>
          </div>

          <div v-if="pageItems.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center">
            <Radar :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum pedido encontrado</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste a busca ou os filtros para ver outros resultados.</div>
          </div>

          <div
            v-for="p in pageItems"
            :key="p.id"
            class="grid items-center mon-row mon-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', p.id)"
          >
            <div style="font-weight: var(--weight-medium); color: var(--text-strong); white-space: normal">
              {{ p.cliente }}
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
                  background: toneStyle(tipoClienteTone(p.tipoCliente)).bg,
                  color: toneStyle(tipoClienteTone(p.tipoCliente)).text,
                  whiteSpace: 'nowrap',
                }"
              >
                <span
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: toneStyle(tipoClienteTone(p.tipoCliente)).color,
                  }"
                />
                {{ tipoClienteLabel(p.tipoCliente) }}
              </span>
            </div>
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ brl(p.risco, { compact: true }) }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                Limite: {{ brl(p.limite, { compact: true }) }}
              </div>
            </div>
            <div class="flex items-center" style="gap: 8px">
              <component
                :is="PRAZO_ICON[prazoStatus(p.prazo)]"
                :size="15"
                :stroke-width="2.25"
                :style="{ color: prazoTone(prazoStatus(p.prazo)).color, flexShrink: 0 }"
              />
              <span style="font-variant-numeric: tabular-nums; color: var(--text-default)">
                {{ formatDateBR(p.prazo) }}
              </span>
            </div>
            <div class="flex items-center" style="gap: 6px; flex-wrap: wrap; white-space: normal">
              <span
                v-for="chip in chipsOf(p).shown"
                :key="chip"
                :style="{
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.02em',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: toneStyle(chipTone(chip)).bg,
                  color: toneStyle(chipTone(chip)).text,
                  maxWidth: '220px',
                }"
                :title="chip"
              >
                {{ truncateChip(chip) }}
              </span>
              <span
                v-if="chipsOf(p).extra > 0"
                style="font-size: 10px; font-weight: var(--weight-bold); padding: 3px 8px; border-radius: 9999px; background: var(--status-neutral-bg); color: var(--status-neutral-text)"
              >
                +{{ chipsOf(p).extra }} mais
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
  </div>
</template>

<style scoped>
.mon-table-row {
  column-gap: 16px;
  padding: 14px 20px;
}

.mon-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.10em;
  color: var(--text-muted);
  text-transform: uppercase;
  white-space: nowrap;
}

.mon-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.mon-row:hover {
  background: var(--surface-sunken);
}

.classes-item:hover {
  background: var(--surface-sunken);
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
</style>
