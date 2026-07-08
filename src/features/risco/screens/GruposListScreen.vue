<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Filter, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  MoreVertical, SlidersHorizontal, CheckCircle2, Clock, XCircle, Minus, Building2,
  Settings2, UserCog, BellRing, ShieldCheck,
} from 'lucide-vue-next';
import {
  GRUPOS_SEED, GERENTES_SEED, TIPO_CLIENTE_OPTS,
  statusOperacaoColor, parecerLabel, parecerColor, brl,
  type GrupoEmpresarial, type ParecerStatus,
} from '../data/riscoData';
import TransferirGerenteModal from '../components/modals/TransferirGerenteModal.vue';
import ConfigurarNotificacoesModal from '../components/modals/ConfigurarNotificacoesModal.vue';
import HabilitarOperarModal from '../components/modals/HabilitarOperarModal.vue';

const emit = defineEmits<{ open: [id: string] }>();

type ColKey = 'documento' | 'statusOperacao' | 'limite' | 'limiteAutoatendimento' | 'riscoTotal' | 'riscoUraStt' | 'gerente' | 'vencimentoLimite' | 'parecerCredito';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' | 'center' }[] = [
  { key: 'documento', label: 'Documento' },
  { key: 'statusOperacao', label: 'Status de Operação' },
  { key: 'limite', label: 'Limite', align: 'right' },
  { key: 'limiteAutoatendimento', label: 'Limite Autoatend.', align: 'right' },
  { key: 'riscoTotal', label: 'Risco Total', align: 'right' },
  { key: 'riscoUraStt', label: 'Risco (Ura & Stt)', align: 'right' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimentoLimite', label: 'Vencimento do Limite' },
  { key: 'parecerCredito', label: 'Parecer de Crédito', align: 'center' },
];

const PARECER_ICON: Record<ParecerStatus, Component> = {
  CONFORME: CheckCircle2,
  EXPIRANDO: Clock,
  EXPIRADO: XCircle,
  AUSENTE: Minus,
};

interface Filters {
  nome: string;
  gerente: string;
  tipoCliente: string;
  possuiParecer: string;
  vencMin: string;
  vencMax: string;
}

const EMPTY_FILTERS: Filters = { nome: '', gerente: '', tipoCliente: '', possuiParecer: '', vencMin: '', vencMax: '' };

function parseDateBR(d: string | null): number {
  if (!d) return NaN;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

const grupos = ref<GrupoEmpresarial[]>(GRUPOS_SEED);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const colsMenuOpen = ref(false);
const page = ref(1);
const pageSize = ref(10);
const menuOpenId = ref<string | null>(null);
const parecerTooltip = ref<{ label: string; x: number; y: number } | null>(null);
const transferindo = ref<GrupoEmpresarial | null>(null);
const configurandoNotif = ref<GrupoEmpresarial | null>(null);
const habilitando = ref<GrupoEmpresarial | null>(null);

const filtered = computed(() =>
  grupos.value.filter((g) => {
    if (applied.value.nome && !g.nome.toLowerCase().includes(applied.value.nome.toLowerCase())) return false;
    if (applied.value.gerente && g.gerente !== applied.value.gerente) return false;
    if (applied.value.tipoCliente && g.tipoCliente !== applied.value.tipoCliente) return false;
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

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
const clampedPage = computed(() => Math.min(page.value, totalPages.value));
const pageItems = computed(() => filtered.value.slice((clampedPage.value - 1) * pageSize.value, clampedPage.value * pageSize.value));

const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => `1.8fr ${cols.value.map(() => '1fr').join(' ')} 56px`);

function handleFilter() {
  applied.value = { ...draft.value };
  page.value = 1;
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  page.value = 1;
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
    const estimatedPanelHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function pageButtonStyle(disabled: boolean) {
  return {
    width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
    background: 'var(--surface-card)', cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)',
  };
}

function menuActions(g: GrupoEmpresarial) {
  return [
    { icon: Settings2, label: 'Parametrizações', onClick: () => { menuOpenId.value = null; emit('open', g.id); } },
    { icon: UserCog, label: 'Transferir gerente', onClick: () => { menuOpenId.value = null; transferindo.value = g; } },
    { icon: BellRing, label: 'Configurar notificações', onClick: () => { menuOpenId.value = null; configurandoNotif.value = g; } },
    { icon: ShieldCheck, label: 'Habilitar para operar', onClick: () => { menuOpenId.value = null; habilitando.value = g; } },
  ];
}

function showParecerTooltip(e: MouseEvent, g: GrupoEmpresarial) {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  parecerTooltip.value = { label: parecerLabel(g.parecerCredito), x: rect.left + rect.width / 2, y: rect.top };
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <!-- Identificação -->
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

    <!-- Toolbar: Filtros + Colunas -->
    <div class="flex items-center justify-end" style="gap: 10px">
      <!-- Filtros (popover, estilo date-picker) -->
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
                  <option v-for="g in GERENTES_SEED" :key="g" :value="g">{{ g }}</option>
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

      <!-- Controle de colunas -->
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
          <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 220px; padding: 8px">
            <label
              v-for="c in ALL_COLS"
              :key="c.key"
              class="flex items-center grupos-cols-item"
              style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
            >
              <input type="checkbox" :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
              {{ c.label }}
            </label>
          </div>
        </template>
      </div>
    </div>

    <!-- Tabela de resultados -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid" :style="{ gridTemplateColumns: gridTemplate, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }">
            <div>Nome</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
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
            class="grid items-center grupos-row"
            :style="{ gridTemplateColumns: gridTemplate, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)', whiteSpace: 'nowrap' }"
            @click="emit('open', g.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ g.nome }}</div>
            <div v-if="visibleCols.has('documento')" style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</div>
            <div v-if="visibleCols.has('statusOperacao')">
              <span
                class="flex items-center"
                :style="{ gap: '6px', width: 'fit-content', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em', padding: '4px 9px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), whiteSpace: 'nowrap' }"
              >
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusOperacaoColor(g.statusOperacao) }" />
                {{ g.statusOperacao }}
              </span>
            </div>
            <div v-if="visibleCols.has('limite')" style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)">{{ brl(g.limite, { compact: true }) }}</div>
            <div v-if="visibleCols.has('limiteAutoatendimento')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.limiteAutoatendimento, { compact: true }) }}</div>
            <div v-if="visibleCols.has('riscoTotal')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.riscoTotal, { compact: true }) }}</div>
            <div v-if="visibleCols.has('riscoUraStt')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.riscoUraStt, { compact: true }) }}</div>
            <div v-if="visibleCols.has('gerente')" style="color: var(--text-default)">{{ g.gerente }}</div>
            <div v-if="visibleCols.has('vencimentoLimite')" :style="{ fontVariantNumeric: 'tabular-nums', color: g.vencimentoLimite ? 'var(--text-default)' : 'var(--text-muted)' }">
              {{ g.vencimentoLimite ?? 'Não Informado' }}
            </div>
            <div
              v-if="visibleCols.has('parecerCredito')"
              class="flex items-center justify-center"
              :style="{ gap: '6px', color: parecerColor(g.parecerCredito), width: '100%' }"
              @mouseenter.stop="showParecerTooltip($event, g)"
              @mouseleave="parecerTooltip = null"
            >
              <component :is="PARECER_ICON[g.parecerCredito]" :size="15" :stroke-width="2.25" />
            </div>
            <div class="flex justify-end" style="position: relative">
              <button
                class="flex items-center justify-center"
                :style="{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: 'none', background: menuOpenId === g.id ? 'var(--surface-sunken)' : 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }"
                @click.stop="menuOpenId = menuOpenId === g.id ? null : g.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === g.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div style="position: absolute; top: 36px; right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 200px; overflow: hidden">
                  <button
                    v-for="action in menuActions(g)"
                    :key="action.label"
                    class="flex items-center grupos-menu-item"
                    style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left"
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

      <!-- Paginação -->
      <div class="flex items-center justify-between" style="padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-xs); color: var(--text-muted)">
        <div class="flex items-center" style="gap: 8px">
          <span>Itens por página</span>
          <select
            :value="pageSize"
            style="height: 30px; padding: 0 8px; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-card); color: var(--text-default); font-size: var(--text-xs)"
            @change="pageSize = Number(($event.target as HTMLSelectElement).value); page = 1"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="flex items-center" style="gap: 14px">
          <span style="font-variant-numeric: tabular-nums">
            {{ filtered.length === 0 ? '0–0' : `${(clampedPage - 1) * pageSize + 1}–${Math.min(clampedPage * pageSize, filtered.length)}` }} de {{ filtered.length }}
          </span>
          <div class="flex items-center" style="gap: 4px">
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === 1)" :disabled="clampedPage === 1" @click="page = 1"><ChevronsLeft :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === 1)" :disabled="clampedPage === 1" @click="page = Math.max(1, page - 1)"><ChevronLeft :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === totalPages)" :disabled="clampedPage === totalPages" @click="page = Math.min(totalPages, page + 1)"><ChevronRight :size="14" /></button>
            <button class="flex items-center justify-center" :style="pageButtonStyle(clampedPage === totalPages)" :disabled="clampedPage === totalPages" @click="page = totalPages"><ChevronsRight :size="14" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip do Parecer de Crédito (fixed, não sofre clipping do scroll horizontal) -->
    <div
      v-if="parecerTooltip"
      class="flex flex-col items-center"
      :style="{ position: 'fixed', left: parecerTooltip.x + 'px', top: (parecerTooltip.y - 8) + 'px', transform: 'translate(-50%, -100%)', zIndex: 200, pointerEvents: 'none' }"
    >
      <div
        style="
          background: var(--gci-base); color: #fff; font-size: var(--text-xs); font-weight: var(--weight-semibold);
          padding: 6px 10px; border-radius: var(--radius-md); white-space: nowrap; box-shadow: var(--shadow-md);
        "
      >
        {{ parecerTooltip.label }}
      </div>
      <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid var(--gci-base)" />
    </div>

    <TransferirGerenteModal
      v-if="transferindo"
      :grupo-nome="transferindo.nome"
      :gerente-atual="transferindo.gerente"
      @close="transferindo = null"
      @confirm="transferindo = null"
    />
    <ConfigurarNotificacoesModal
      v-if="configurandoNotif"
      :grupo-nome="configurandoNotif.nome"
      @close="configurandoNotif = null"
      @confirm="configurandoNotif = null"
    />
    <HabilitarOperarModal
      v-if="habilitando"
      :grupo-nome="habilitando.nome"
      @close="habilitando = null"
      @confirm="habilitando = null"
    />
  </div>
</template>

<style scoped>
.grupos-row:hover {
  background: var(--surface-sunken);
}
.grupos-cols-item:hover {
  background: var(--surface-sunken);
}
.grupos-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
