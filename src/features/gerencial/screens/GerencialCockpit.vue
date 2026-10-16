<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import { AlertTriangle, BarChart3, Building2, CheckCircle2, ChevronDown, Filter, Settings2, Wallet } from 'lucide-vue-next';
import { Bar } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import '@/lib/chart';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  CONFIRMACAO_OPCOES,
  NIVEL_DISPENSA_LABEL,
  NIVEL_NOTIFICACAO_LABEL,
  NIVEL_RISCO_LABEL,
  PAGE_SIZE_OPTIONS,
  RECORTE_GERENCIAL_INICIAL,
  brl,
  corConfirmacao,
  corInadimplencia,
  corNaoConfirmado,
  datasValidas,
  filtrarGerencial,
  fmtPct,
  gerentes,
  nivelRiscoDe,
  toneOf,
  veiculosAtivos,
  type ConfirmacaoTitulo,
  type NivelRisco,
  type RecorteGerencial,
} from '../data/gerencialData';

const emit = defineEmits<{ open: [payload: { grupoId: string; recorte: RecorteGerencial }] }>();

const { warn } = useToast();
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const colsMenuOpen = ref(false);
const draft = ref<RecorteGerencial>({ ...RECORTE_GERENCIAL_INICIAL });
const applied = ref<RecorteGerencial>({ ...RECORTE_GERENCIAL_INICIAL });

type ColKey =
  | 'grupo'
  | 'gerente'
  | 'limite'
  | 'risco'
  | 'valorCessao'
  | 'inadimplencia'
  | 'pctNotifEsperada'
  | 'pctNotifRealizada'
  | 'pctConfirmEsperada'
  | 'titConfirmados'
  | 'valPre'
  | 'valNao'
  | 'valDisp';

// O percentual de cada grupo de valores aparece embaixo do valor, na mesma coluna.
const ALL_COLS: { key: ColKey; label: string; width: string; align?: 'right' }[] = [
  { key: 'grupo', label: 'Grupo empresarial', width: 'minmax(200px, 1.6fr)' },
  { key: 'gerente', label: 'Gerente', width: '160px' },
  { key: 'limite', label: 'Limite', width: '140px', align: 'right' },
  { key: 'risco', label: 'Risco', width: '140px', align: 'right' },
  { key: 'valorCessao', label: 'Valor cessão', width: '140px', align: 'right' },
  { key: 'inadimplencia', label: 'Inadimplência', width: '140px', align: 'right' },
  { key: 'pctNotifEsperada', label: '% Notif. Esperada', width: '130px', align: 'right' },
  { key: 'pctNotifRealizada', label: '% Notif. Realizada', width: '130px', align: 'right' },
  { key: 'pctConfirmEsperada', label: '% Confirm. Esperada', width: '140px', align: 'right' },
  { key: 'titConfirmados', label: 'Tít. Confirmados + Liquidados + Dispensados', width: '200px', align: 'right' },
  { key: 'valPre', label: 'Val. Pré Confirmado', width: '150px', align: 'right' },
  { key: 'valNao', label: 'Val. Não Confirmado', width: '150px', align: 'right' },
  { key: 'valDisp', label: 'Val. Confirm. Dispensado', width: '150px', align: 'right' },
];

const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => cols.value.map((c) => c.width).join(' '));

const base = computed(() => filtrarGerencial(applied.value));
const lista = computed(() => base.value);
const ativos = computed(() => veiculosAtivos());

interface KpiHero {
  key: string;
  icon: Component;
  title: string;
  tone: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

const kpis = computed<KpiHero[]>(() => [
  {
    key: 'acima',
    icon: AlertTriangle,
    title: 'Limite',
    tone: 'var(--danger-base)',
    primaryLabel: 'Acima do limite',
    primaryValue: String(base.value.filter((g) => g.acimaDoLimite).length),
    secondaryLabel: 'Grupos no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'meta',
    icon: CheckCircle2,
    title: 'Confirmação',
    tone: 'var(--warning-base)',
    primaryLabel: 'Abaixo da meta',
    primaryValue: String(base.value.filter((g) => g.abaixoDaMeta).length),
    secondaryLabel: 'Grupos no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'nao-confirmado',
    icon: Wallet,
    title: 'Não confirmado',
    tone: 'var(--danger-base)',
    primaryLabel: 'Valor não confirmado',
    primaryValue: brl(base.value.reduce((s, g) => s + g.totais.valorNao, 0)),
    secondaryLabel: 'Grupos com valor',
    secondaryValue: String(base.value.filter((g) => g.totais.valorNao > 0).length),
  },
  {
    key: 'inadimplencia',
    icon: AlertTriangle,
    title: 'Inadimplência',
    tone: 'var(--danger-base)',
    primaryLabel: 'Valor inadimplente',
    primaryValue: brl(base.value.reduce((s, g) => s + g.grupo.inadimplencia, 0)),
    secondaryLabel: 'Grupos com dívida',
    secondaryValue: String(base.value.filter((g) => g.grupo.inadimplencia > 0).length),
  },
]);

const STATUS_CORES = ['#94A3AC', '#B45309', '#B91C1C', '#047857', '#475569', '#083C4A'];

const valorPorStatus = computed(() => {
  const map = new Map<ConfirmacaoTitulo, number>();
  for (const grupo of base.value) {
    for (const cessao of grupo.cessoes) {
      for (const titulo of cessao.titulos) {
        map.set(titulo.confirmacao, (map.get(titulo.confirmacao) ?? 0) + titulo.valorOriginal);
      }
    }
  }
  // O valor vai no próprio rótulo para que categorias pequenas continuem legíveis.
  return {
    labels: CONFIRMACAO_OPCOES.map((status) => `${status} · ${brl(map.get(status) ?? 0, { compact: true })}`),
    datasets: [{
      label: 'Valor',
      data: CONFIRMACAO_OPCOES.map((status) => map.get(status) ?? 0),
      backgroundColor: STATUS_CORES,
      borderRadius: 6,
      maxBarThickness: 22,
    }],
  };
});

const barHorizontalOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => ` ${brl(ctx.parsed.x ?? 0)}`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: { color: '#94A3AC', font: { size: 10 }, padding: 8, callback: (value) => brl(Number(value), { compact: true }) },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 11, weight: 'bold' } },
    },
  },
};

const NIVEIS_RISCO: NivelRisco[] = ['acima', 'abaixo', 'sem'];
const NIVEL_RISCO_CORES = ['#B91C1C', '#047857', '#94A3AC'];

const gruposPorRisco = computed(() => {
  const contagem = NIVEIS_RISCO.map((nivel) => base.value.filter((g) => nivelRiscoDe(g.grupo) === nivel).length);
  return {
    labels: NIVEIS_RISCO.map((nivel) => NIVEL_RISCO_LABEL[nivel]),
    datasets: [{
      label: 'Grupos',
      data: contagem,
      backgroundColor: NIVEL_RISCO_CORES,
      borderRadius: 6,
      maxBarThickness: 56,
    }],
  };
});

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y} ${ctx.parsed.y === 1 ? 'grupo' : 'grupos'}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 11, weight: 'bold' } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: { color: '#94A3AC', font: { size: 10 }, padding: 8, precision: 0 },
    },
  },
};

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => lista.value,
  { defaultPageSize: 5 },
);

watch(applied, () => setPage(1));

const activeFilterCount = computed(() => {
  const atual = applied.value;
  return (Object.keys(RECORTE_GERENCIAL_INICIAL) as (keyof RecorteGerencial)[])
    .filter((key) => atual[key] !== RECORTE_GERENCIAL_INICIAL[key]).length;
});

function openFilters() {
  draft.value = { ...applied.value };
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < 480 && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function filtrar() {
  const erro = datasValidas(draft.value.dataInicial, draft.value.dataFinal);
  if (erro) {
    warn(erro);
    return;
  }
  applied.value = { ...draft.value };
  filterOpen.value = false;
}

function limpar() {
  draft.value = { ...RECORTE_GERENCIAL_INICIAL };
  applied.value = { ...RECORTE_GERENCIAL_INICIAL };
  filterOpen.value = false;
}

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) {
    if (next.size === 1) return;
    next.delete(key);
  } else next.add(key);
  visibleCols.value = next;
}

watch(ativos, (listaAtivos) => {
  const ids = new Set(listaAtivos.map((v) => v.id));
  if (draft.value.veiculoId && !ids.has(draft.value.veiculoId)) draft.value.veiculoId = '';
  if (applied.value.veiculoId && !ids.has(applied.value.veiculoId)) {
    applied.value = { ...applied.value, veiculoId: '' };
  }
});

function abrir(grupoId: string) {
  emit('open', { grupoId, recorte: { ...applied.value } });
}
</script>

<template>
  <div class="ger-page">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div class="ger-kicker">Gerencial</div>
        <h1 class="ger-title">Quem está fora da meta</h1>
        <p class="ger-sub">
          {{ lista.length }} {{ lista.length === 1 ? 'grupo no recorte' : 'grupos no recorte' }}
          · cessões {{ applied.busca }} · {{ applied.situacao === 'aprovada' ? 'aprovadas' : applied.situacao === 'nao-aprovada' ? 'não aprovadas' : 'todas as situações' }}
        </p>
      </div>
      <div class="flex items-center" style="gap: 10px; margin-left: auto">
        <div style="position: relative">
          <button ref="filterBtnRef" type="button" class="flex items-center toolbar-btn" @click="openFilters">
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span v-if="activeFilterCount > 0" class="filter-count">{{ activeFilterCount }}</span>
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
                width: '680px',
                maxWidth: 'calc(100vw - 48px)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px">
                <label>
                  <div class="filter-label">Grupo empresarial</div>
                  <input v-model="draft.grupoNome" class="filter-input" placeholder="Nome do grupo" />
                </label>
                <label>
                  <div class="filter-label">Gerente comercial</div>
                  <select v-model="draft.gerente" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="g in gerentes()" :key="g" :value="g">{{ g }}</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Veículo de operação</div>
                  <select v-model="draft.veiculoId" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="v in ativos" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Tipo de operação</div>
                  <select v-model="draft.tipoOperacao" class="filter-input">
                    <option value="">Todos</option>
                    <option value="CRA">CRA</option>
                    <option value="FIDC">FIDC</option>
                    <option value="GARANTIA">GARANTIA</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Data do termo inicial</div>
                  <input v-model="draft.dataInicial" type="date" class="filter-input" />
                </label>
                <label>
                  <div class="filter-label">Data do termo final</div>
                  <input v-model="draft.dataFinal" type="date" class="filter-input" />
                </label>
                <label>
                  <div class="filter-label">Buscar cessões</div>
                  <select v-model="draft.busca" class="filter-input">
                    <option value="abertas">Abertas</option>
                    <option value="liquidadas">Liquidadas</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Nível de risco</div>
                  <select v-model="draft.nivelRisco" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="(label, key) in NIVEL_RISCO_LABEL" :key="key" :value="key">{{ label }}</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Nível de confirmação</div>
                  <select v-model="draft.nivelConfirmacao" class="filter-input">
                    <option value="">Todos</option>
                    <option value="nao-exige">Não exige confirmação</option>
                    <option value="sem">Sem confirmação</option>
                    <option value="parcial">Parcialmente confirmados</option>
                    <option value="confirmado">Confirmados</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Nível de notificação</div>
                  <select v-model="draft.nivelNotificacao" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="(label, key) in NIVEL_NOTIFICACAO_LABEL" :key="key" :value="key">{{ label }}</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Dispensa de confirmação</div>
                  <select v-model="draft.nivelDispensa" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="(label, key) in NIVEL_DISPENSA_LABEL" :key="key" :value="key">{{ label }}</option>
                  </select>
                </label>
                <label>
                  <div class="filter-label">Situação da cessão</div>
                  <select v-model="draft.situacao" class="filter-input">
                    <option value="todas">Todas</option>
                    <option value="aprovada">Cessões aprovadas</option>
                    <option value="nao-aprovada">Cessões não aprovadas</option>
                  </select>
                </label>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button type="button" class="fp-clear" @click="limpar">Limpar</button>
                <button type="button" class="flex items-center fp-apply" @click="filtrar">
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.key"
        :style="{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--surface-card)',
          padding: '20px',
        }"
      >
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="18" />
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ kpi.title }}
          </div>
        </div>
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          {{ kpi.primaryLabel }}
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            color: kpi.tone,
            marginBottom: '14px',
          }"
        >
          {{ kpi.primaryValue }}
        </div>
        <div class="flex items-center justify-between" style="padding-top: 12px; border-top: 1px solid var(--border-default)">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ kpi.secondaryValue }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Grupos por nível de risco</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="gruposPorRisco" :options="barOptions" />
        </div>
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Valor por status de confirmação</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="valorPorStatus" :options="barHorizontalOptions" />
        </div>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <Building2 :size="20" />
        </div>
        <div style="flex: 1; min-width: 160px">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">Grupos empresariais</div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ lista.length }} {{ lista.length === 1 ? 'grupo' : 'grupos' }}
          </div>
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
            <div class="cols-menu">
              <div class="cols-title">Colunas visíveis</div>
              <div v-for="c in ALL_COLS" :key="c.key" class="flex items-center cols-item" @click="toggleCol(c.key)">
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                {{ c.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="ger-tbl-head" :style="{ gridTemplateColumns: gridTemplate }">
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
          </div>
          <div v-if="pageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
            Nenhum grupo neste recorte.
          </div>
          <div
            v-for="item in pageItems"
            :key="item.grupo.id"
            class="ger-tbl-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="abrir(item.grupo.id)"
          >
            <template v-for="c in cols" :key="c.key">
              <div v-if="c.key === 'grupo'" class="cell-strong" :title="item.grupo.nome">{{ item.grupo.nome }}</div>
              <div v-else-if="c.key === 'gerente'" class="cell-clip" :title="item.grupo.gerente ?? ''">{{ item.grupo.gerente ?? '—' }}</div>
              <div v-else-if="c.key === 'limite'" class="cell-num">{{ brl(item.grupo.limite) }}</div>
              <div v-else-if="c.key === 'risco'" class="cell-num" :style="{ color: item.acimaDoLimite ? 'var(--status-danger-text)' : undefined, fontWeight: 'var(--weight-bold)' }">
                {{ item.grupo.risco <= 0 ? 'Sem risco' : brl(item.grupo.risco) }}
              </div>
              <div v-else-if="c.key === 'valorCessao'" class="cell-num">{{ brl(item.valorCessao) }}</div>
              <div v-else-if="c.key === 'inadimplencia'" class="cell-num" :style="{ color: toneOf(corInadimplencia(item.grupo.inadimplencia)).text, fontWeight: 'var(--weight-bold)' }">
                {{ brl(item.grupo.inadimplencia) }}
              </div>
              <div v-else-if="c.key === 'pctNotifEsperada'" class="cell-num">{{ fmtPct(item.grupo.pctNotifEsperada) }}</div>
              <div v-else-if="c.key === 'pctNotifRealizada'" class="cell-num">{{ fmtPct(item.totais.pctNotificado) }}</div>
              <div v-else-if="c.key === 'pctConfirmEsperada'" class="cell-num">{{ fmtPct(item.grupo.pctConfirmacaoEsperada) }}</div>
              <div v-else-if="c.key === 'titConfirmados'" class="ger-tbl-stack">
                <div
                  class="cell-num"
                  :style="{ color: toneOf(corConfirmacao(item.totais.pctConfirmados, item.grupo.pctConfirmacaoEsperada)).text, fontWeight: 'var(--weight-bold)' }"
                >
                  {{ brl(item.totais.valorConfirmados) }}
                </div>
                <div class="ger-tbl-sub">{{ fmtPct(item.totais.pctConfirmados) }}</div>
              </div>
              <div v-else-if="c.key === 'valPre'" class="ger-tbl-stack">
                <div class="cell-num">{{ brl(item.totais.valorPre) }}</div>
                <div class="ger-tbl-sub">{{ fmtPct(item.totais.pctPre) }}</div>
              </div>
              <div v-else-if="c.key === 'valNao'" class="ger-tbl-stack">
                <div class="cell-num" :style="{ color: toneOf(corNaoConfirmado(item.totais.pctNao)).text, fontWeight: 'var(--weight-bold)' }">
                  {{ brl(item.totais.valorNao) }}
                </div>
                <div class="ger-tbl-sub">{{ fmtPct(item.totais.pctNao) }}</div>
              </div>
              <div v-else class="ger-tbl-stack">
                <div class="cell-num">{{ brl(item.totais.valorDispensado) }}</div>
                <div class="ger-tbl-sub">{{ fmtPct(item.totais.pctDispensado) }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <TablePagination
        sunken
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-size-options="PAGE_SIZE_OPTIONS"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
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
.filter-count {
  font-size: 10px;
  font-weight: var(--weight-bold);
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--accent-bg);
  color: var(--accent);
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
.fp-clear {
  height: 38px;
  padding: 0 16px;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
}
.fp-apply {
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
  min-width: 280px;
  max-height: 360px;
  overflow-y: auto;
  padding: 8px;
}
.cols-title {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  padding: 6px 10px 10px;
}
.cols-item {
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
.cell-strong,
.cell-clip {
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell-strong {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
}
.cell-num {
  font-variant-numeric: tabular-nums;
  text-align: right;
}
</style>
