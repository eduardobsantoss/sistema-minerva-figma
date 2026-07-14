<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Filter, ChevronDown,
  MoreVertical, SlidersHorizontal, CheckCircle2, Clock, XCircle, Minus, Building2,
  Settings2, UserCog, BellRing, ShieldCheck, Search, Link2,
} from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  GRUPOS_SEED, GERENTES_SEED, TIPO_CLIENTE_OPTS, STATUS_OPERACAO_OPTS,
  OPERACOES_VINCULAVEIS_SEED,
  statusOperacaoColor, parecerLabel, parecerColor, brl,
  type GrupoEmpresarial, type ParecerStatus, type OperacaoVinculavel,
} from '../data/riscoData';
import TransferirGerenteModal from '../components/modals/TransferirGerenteModal.vue';
import ConfigurarNotificacoesModal from '../components/modals/ConfigurarNotificacoesModal.vue';
import HabilitarOperarModal from '../components/modals/HabilitarOperarModal.vue';
import VincularAgrupamentoModal from '../components/modals/VincularAgrupamentoModal.vue';
import Checkbox from '@/components/ui/Checkbox.vue';

const emit = defineEmits<{ open: [id: string] }>();

type ColKey = 'statusOperacao' | 'limite' | 'limiteAutoatendimento' | 'riscoTotal' | 'gerente' | 'vencimentoParecer';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' | 'center' }[] = [
  { key: 'statusOperacao', label: 'Status de Operação' },
  { key: 'limite', label: 'Limite', align: 'right' },
  { key: 'limiteAutoatendimento', label: 'Limite Autoatend.', align: 'right' },
  { key: 'riscoTotal', label: 'Risco Total', align: 'right' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimentoParecer', label: 'Vencimento do Parecer' },
];

const PARECER_ICON: Record<ParecerStatus, Component> = {
  CONFORME: CheckCircle2,
  EXPIRANDO: Clock,
  EXPIRADO: XCircle,
  AUSENTE: Minus,
};

type QuickParecerFilter = ParecerStatus | null;

interface Filters {
  nome: string;
  gerente: string;
  tipoCliente: string;
  statusOperacao: string;
  possuiParecer: string;
  vencMin: string;
  vencMax: string;
}

const EMPTY_FILTERS: Filters = { nome: '', gerente: '', tipoCliente: '', statusOperacao: '', possuiParecer: '', vencMin: '', vencMax: '' };

function parseDateBR(d: string | null): number {
  if (!d) return NaN;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

const grupos = ref<GrupoEmpresarial[]>(GRUPOS_SEED);
const searchQuery = ref('');
const quickParecerFilter = ref<QuickParecerFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);
const transferindo = ref<GrupoEmpresarial | null>(null);
const configurandoNotif = ref<GrupoEmpresarial | null>(null);
const habilitando = ref<GrupoEmpresarial | null>(null);
const vinculando = ref<GrupoEmpresarial | null>(null);
const operacoes = ref<OperacaoVinculavel[]>(OPERACOES_VINCULAVEIS_SEED.map((o) => ({ ...o, agrupamentoIds: [...o.agrupamentoIds], grupoIds: [...o.grupoIds] })));

const QUICK_FILTERS: { key: QuickParecerFilter; label: string; status: ParecerStatus }[] = [
  { key: 'EXPIRADO', label: 'Vencido', status: 'EXPIRADO' },
  { key: 'EXPIRANDO', label: 'Próximo a Vencer', status: 'EXPIRANDO' },
  { key: 'CONFORME', label: 'Em Dia', status: 'CONFORME' },
];

const filtered = computed(() =>
  grupos.value.filter((g) => {
    if (searchQuery.value.trim() && !g.nome.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
    if (quickParecerFilter.value && g.parecerCredito !== quickParecerFilter.value) return false;
    if (applied.value.nome && !g.nome.toLowerCase().includes(applied.value.nome.toLowerCase())) return false;
    if (applied.value.gerente && g.gerente !== applied.value.gerente) return false;
    if (applied.value.tipoCliente && g.tipoCliente !== applied.value.tipoCliente) return false;
    if (applied.value.statusOperacao && g.statusOperacao !== applied.value.statusOperacao) return false;
    if (applied.value.possuiParecer === 'Sim' && g.parecerCredito === 'AUSENTE') return false;
    if (applied.value.possuiParecer === 'Não' && g.parecerCredito !== 'AUSENTE') return false;
    if (applied.value.vencMin) {
      const t = parseDateBR(g.vencimentoLimite);
      if (Number.isNaN(t) || t < new Date(applied.value.vencMin).getTime()) return false;
    }
    if (applied.value.vencMax) {
      const t = parseDateBR(g.vencimentoLimite);
      if (Number.isNaN(t) || t > new Date(applied.value.vencMax).getTime()) return false;
    }
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  statusOperacao: 'minmax(130px, 1.3fr)',
  limite: 'minmax(88px, 1fr)',
  limiteAutoatendimento: 'minmax(100px, 1fr)',
  riscoTotal: 'minmax(96px, 1.1fr)',
  gerente: 'minmax(140px, 1.4fr)',
  vencimentoParecer: 'minmax(150px, 1.4fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => `minmax(220px, 2.2fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`);

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

function toggleQuickFilter(status: ParecerStatus) {
  quickParecerFilter.value = quickParecerFilter.value === status ? null : status;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function menuActions(g: GrupoEmpresarial) {
  return [
    { icon: Settings2, label: 'Parametrizações', onClick: () => { menuOpenId.value = null; emit('open', g.id); } },
    { icon: Link2, label: 'Vincular a um veículo', onClick: () => { menuOpenId.value = null; vinculando.value = g; } },
    { icon: UserCog, label: 'Transferir gerente', onClick: () => { menuOpenId.value = null; transferindo.value = g; } },
    { icon: BellRing, label: 'Configurar notificações', onClick: () => { menuOpenId.value = null; configurandoNotif.value = g; } },
    { icon: ShieldCheck, label: 'Habilitar para operar', onClick: () => { menuOpenId.value = null; habilitando.value = g; } },
  ];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Risco
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Grupos Empresariais
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados' }}
      </p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="searchQuery"
          placeholder="Buscar por nome"
          style="width: 100%; height: 38px; padding: 0 12px 0 36px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.status"
            :style="{
              height: '38px', padding: '0 14px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
              border: quickParecerFilter === qf.status ? `1px solid ${parecerColor(qf.status)}` : '1px solid var(--border-default)',
              background: quickParecerFilter === qf.status ? `color-mix(in srgb, ${parecerColor(qf.status)} 12%, transparent)` : 'var(--surface-card)',
              color: quickParecerFilter === qf.status ? parecerColor(qf.status) : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.status)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="gap: 8px; height: 38px; padding: 0 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-strong); font-size: var(--text-sm); font-weight: var(--weight-bold)"
            @click="openFilters"
          >
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span v-if="activeFilterCount > 0" style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent)">
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" :style="{ color: 'var(--text-muted)', transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
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
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
                  <input v-model="draft.nome" placeholder="Buscar por nome" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Gerente</div>
                  <select v-model="draft.gerente" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="g in GERENTES_SEED" :key="g.id" :value="g.nome">{{ g.nome }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo de Cliente</div>
                  <select v-model="draft.tipoCliente" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="t in TIPO_CLIENTE_OPTS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status de Operação</div>
                  <select v-model="draft.statusOperacao" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_OPERACAO_OPTS" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Possui Parecer de Crédito</div>
                  <select v-model="draft.possuiParecer" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento do Limite (mín.)</div>
                  <input v-model="draft.vencMin" type="date" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento do Limite (máx.)</div>
                  <input v-model="draft.vencMax" type="date" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="handleClear">
                  Limpar
                </button>
                <button class="flex items-center" style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em" @click="handleFilter">
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button class="flex items-center" style="gap: 6px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold)" @click="colsMenuOpen = !colsMenuOpen">
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 220px; padding: 8px">
              <div v-for="c in ALL_COLS" :key="c.key" class="flex items-center grupos-cols-item" style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)" @click="toggleCol(c.key)">
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

    <!-- Tabela -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid grupos-table-row grupos-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Grupo Empresarial</div>
            <div v-for="c in cols" :key="c.key" :class="{ 'grupos-col-gerente': c.key === 'gerente' }" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div v-if="pageItems.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center">
            <Building2 :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum grupo encontrado</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste os filtros para ver outros resultados.</div>
          </div>
          <div
            v-for="g in pageItems"
            :key="g.id"
            class="grid items-center grupos-row grupos-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', g.id)"
          >
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ g.nome }}</div>
              <span style="display: inline-block; margin-top: 4px; font-size: 10px; font-weight: var(--weight-semibold); padding: 2px 8px; border-radius: 9999px; background: var(--surface-sunken); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</span>
            </div>
            <div v-if="visibleCols.has('statusOperacao')">
              <span class="flex items-center" :style="{ gap: '6px', width: 'fit-content', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em', padding: '4px 9px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), whiteSpace: 'nowrap' }">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusOperacaoColor(g.statusOperacao) }" />
                {{ g.statusOperacao }}
              </span>
            </div>
            <div v-if="visibleCols.has('limite')" style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ brl(g.limite, { compact: true }) }}</div>
            <div v-if="visibleCols.has('limiteAutoatendimento')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.limiteAutoatendimento, { compact: true }) }}</div>
            <div v-if="visibleCols.has('riscoTotal')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.riscoTotal, { compact: true }) }}</div>
            <div v-if="visibleCols.has('gerente')" class="grupos-col-gerente" style="color: var(--text-default)">{{ g.gerente }}</div>
            <div v-if="visibleCols.has('vencimentoParecer')" class="flex items-center" style="gap: 8px">
              <span :style="{ fontVariantNumeric: 'tabular-nums', color: g.vencimentoParecer ? 'var(--text-default)' : 'var(--text-muted)' }">
                {{ g.vencimentoParecer ?? 'Não Informado' }}
              </span>
              <component :is="PARECER_ICON[g.parecerCredito]" :size="15" :stroke-width="2.25" :style="{ color: parecerColor(g.parecerCredito), flexShrink: 0 }" :title="parecerLabel(g.parecerCredito)" />
            </div>
            <div class="flex justify-end" style="position: relative">
              <button class="flex items-center justify-center" :style="{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: 'none', background: menuOpenId === g.id ? 'var(--surface-sunken)' : 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }" @click.stop="menuOpenId = menuOpenId === g.id ? null : g.id">
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === g.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div style="position: absolute; top: 36px; right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 200px; overflow: hidden">
                  <button v-for="action in menuActions(g)" :key="action.label" class="flex items-center grupos-menu-item" style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left" @click.stop="action.onClick">
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

    <TransferirGerenteModal v-if="transferindo" :grupo-nome="transferindo.nome" :gerente-atual="transferindo.gerente" @close="transferindo = null" @confirm="transferindo = null" />
    <ConfigurarNotificacoesModal v-if="configurandoNotif" :grupo-nome="configurandoNotif.nome" @close="configurandoNotif = null" @confirm="configurandoNotif = null" />
    <HabilitarOperarModal v-if="habilitando" :grupo-nome="habilitando.nome" @close="habilitando = null" @confirm="habilitando = null" />
    <VincularAgrupamentoModal
      v-if="vinculando"
      :target="vinculando"
      target-label="Grupo"
      link-key="grupoIds"
      :entidades="grupos"
      :operacoes="operacoes"
      @update:operacoes="operacoes = $event"
      @close="vinculando = null"
    />
  </div>
</template>

<style scoped>
.grupos-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}

.grupos-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.10em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.grupos-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.grupos-row:hover { background: var(--surface-sunken); }
.grupos-cols-item:hover { background: var(--surface-sunken); }
.grupos-menu-item:hover { background: var(--surface-sunken); }

.grupos-col-gerente {
  padding-left: 20px;
}
</style>
