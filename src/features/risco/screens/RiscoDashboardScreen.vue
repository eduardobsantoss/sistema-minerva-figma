<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Search, AlertTriangle, TrendingDown, Users, Wallet, ChevronRight,
  Clock, XCircle, Building2, BarChart3,
} from 'lucide-vue-next';
import { Bar, Pie } from 'vue-chartjs';
import '@/lib/chart';
import {
  GRUPOS_SEED, brl, fmtPct, statusGrupoPizza,
  isLimiteVencido, isProximoAVencer, temRiscoAtivo, diasEntre,
  type GrupoEmpresarial, type StatusGrupoPizza,
} from '../data/riscoData';
import GrupoDetailScreen from './GrupoDetailScreen.vue';

type Route = { level: 'dashboard' } | { level: 'detail'; grupoId: string };

const route = ref<Route>({ level: 'dashboard' });
const query = ref('');

const grupoAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? GRUPOS_SEED.find((g) => g.id === r.grupoId) : undefined;
});

function openGrupo(id: string) {
  route.value = { level: 'detail', grupoId: id };
}

const valorVencidoTotal = GRUPOS_SEED.reduce((s, g) => s + g.valorVencido, 0);
const riscoTotalEmpresa = GRUPOS_SEED.reduce((s, g) => s + g.riscoTotal, 0);
const pctVencido = riscoTotalEmpresa > 0 ? (valorVencidoTotal / riscoTotalEmpresa) * 100 : 0;
const clientesTitulosVencidos = GRUPOS_SEED.filter((g) => g.valorVencido > 0).length;
const clientesComRisco = GRUPOS_SEED.filter((g) => g.riscoTotal > 0).length;
const clientesLimiteVencido = GRUPOS_SEED.filter((g) => g.riscoTotal > 0 && isLimiteVencido(g.vencimentoLimite)).length;
const clientesLimiteAVencer = GRUPOS_SEED.filter((g) => g.riscoTotal > 0 && isProximoAVencer(g.vencimentoLimite)).length;
const clientesLimiteZerado = GRUPOS_SEED.filter((g) => g.limite === 0).length;
const clientesLimiteSemRisco = GRUPOS_SEED.filter((g) => g.limite > 0 && g.riscoTotal === 0).length;

interface KpiMetric { label: string; value: string }
interface KpiCard { icon: Component; title: string; tone: string; metrics: KpiMetric[] }

const kpis = computed<KpiCard[]>(() => [
  {
    icon: AlertTriangle,
    title: 'Total de valores vencidos',
    tone: 'var(--danger-base)',
    metrics: [
      { label: 'Valor Vencido', value: brl(valorVencidoTotal, { compact: true }) },
      { label: 'Percentual Vencido', value: fmtPct(pctVencido) },
      { label: 'Clientes c/ títulos vencidos', value: String(clientesTitulosVencidos) },
    ],
  },
  {
    icon: TrendingDown,
    title: 'Total de risco da empresa',
    tone: 'var(--agro-base)',
    metrics: [
      { label: 'Exposição total', value: brl(riscoTotalEmpresa, { compact: true }) },
      { label: 'Clientes com risco', value: String(clientesComRisco) },
    ],
  },
  {
    icon: Clock,
    title: 'Clientes c/ risco vencido e a vencer',
    tone: 'var(--warning-base)',
    metrics: [
      { label: 'Risco vencido', value: String(clientesLimiteVencido) },
      { label: 'Risco a vencer', value: String(clientesLimiteAVencer) },
    ],
  },
  {
    icon: Users,
    title: 'Clientes sem limite e sem risco',
    tone: 'var(--gci-base)',
    metrics: [
      { label: 'Limite zerado', value: String(clientesLimiteZerado) },
      { label: 'Limite s/ risco', value: String(clientesLimiteSemRisco) },
    ],
  },
]);

interface RiscoRow {
  grupo: GrupoEmpresarial;
  dias: number;
}

const riscoLimiteVencido = computed<RiscoRow[]>(() =>
  GRUPOS_SEED
    .filter((g) => temRiscoAtivo(g) && isLimiteVencido(g.vencimentoLimite))
    .map((g) => ({ grupo: g, dias: diasEntre(g.vencimentoLimite) }))
    .sort((a, b) => b.dias - a.dias),
);

const riscoLimiteProximo = computed<RiscoRow[]>(() =>
  GRUPOS_SEED
    .filter((g) => temRiscoAtivo(g) && isProximoAVencer(g.vencimentoLimite) && !isLimiteVencido(g.vencimentoLimite))
    .map((g) => ({ grupo: g, dias: -diasEntre(g.vencimentoLimite) }))
    .sort((a, b) => a.dias - b.dias),
);

const ratingsUnicos = [...new Set(GRUPOS_SEED.map((g) => g.rating).filter((r) => r !== 'NÃO SE APLICA'))];

const CHART_LIMITE_COLORS = ['#083C4A', '#0E5668', '#147088', '#1A8AA8', '#2196AC', '#28A8C0'];
const CHART_LIMITE_HOVER = ['#062D38', '#0B4656', '#105E72', '#15768E', '#1A8EAA', '#1FA6C6'];
const CHART_RISCO_COLORS = ['#F27D26', '#F58A3A', '#F8974E', '#FBA462', '#FEB176', '#FFBE8A'];
const CHART_RISCO_HOVER = ['#D96E1A', '#E07A28', '#E78636', '#EE9244', '#F59E52', '#FCAA60'];

const RISCO_TABLE_GRID = 'minmax(140px, 2fr) minmax(76px, 0.9fr) minmax(76px, 0.9fr) minmax(100px, 1.05fr) minmax(72px, 0.8fr)';

const limitePorRating = computed(() => {
  const map = new Map<string, number>();
  for (const g of GRUPOS_SEED) {
    if (g.rating === 'NÃO SE APLICA') continue;
    map.set(g.rating, (map.get(g.rating) ?? 0) + g.limite);
  }
  const labels = ratingsUnicos.filter((r) => map.has(r));
  return {
    labels,
    datasets: [{
      label: 'Limite',
      data: labels.map((l) => map.get(l) ?? 0),
      backgroundColor: labels.map((_, i) => CHART_LIMITE_COLORS[i % CHART_LIMITE_COLORS.length]),
      hoverBackgroundColor: labels.map((_, i) => CHART_LIMITE_HOVER[i % CHART_LIMITE_HOVER.length]),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    }],
  };
});

const riscoPorRating = computed(() => {
  const map = new Map<string, number>();
  for (const g of GRUPOS_SEED) {
    if (g.rating === 'NÃO SE APLICA') continue;
    map.set(g.rating, (map.get(g.rating) ?? 0) + g.riscoTotal);
  }
  const labels = ratingsUnicos.filter((r) => map.has(r));
  return {
    labels,
    datasets: [{
      label: 'Risco',
      data: labels.map((l) => map.get(l) ?? 0),
      backgroundColor: labels.map((_, i) => CHART_RISCO_COLORS[i % CHART_RISCO_COLORS.length]),
      hoverBackgroundColor: labels.map((_, i) => CHART_RISCO_HOVER[i % CHART_RISCO_HOVER.length]),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    }],
  };
});

const STATUS_PIZZA_LABELS: StatusGrupoPizza[] = ['Normal', 'Recovery', 'Especial', 'Terceiro'];
const STATUS_PIZZA_COLORS = ['#059669', '#D97706', '#64748B', '#083C4A'];
const STATUS_PIZZA_HOVER = ['#047857', '#B45309', '#475569', '#062D38'];

const riscoPorStatus = computed(() => {
  const map = new Map<StatusGrupoPizza, number>();
  for (const g of GRUPOS_SEED) {
    const bucket = statusGrupoPizza(g.statusOperacao);
    map.set(bucket, (map.get(bucket) ?? 0) + g.riscoTotal);
  }
  return {
    labels: STATUS_PIZZA_LABELS,
    datasets: [{
      data: STATUS_PIZZA_LABELS.map((l) => map.get(l) ?? 0),
      backgroundColor: STATUS_PIZZA_COLORS,
      hoverBackgroundColor: STATUS_PIZZA_HOVER,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      hoverOffset: 10,
    }],
  };
});

const barOptions = {
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
      displayColors: true,
      callbacks: {
        label: (ctx: { parsed: { y: number } }) => ` ${brl(ctx.parsed.y, { compact: true })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 11, weight: '600' as const } },
    },
    y: {
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: {
        color: '#94A3AC',
        font: { size: 10 },
        padding: 8,
        callback: (v: number | string) => brl(Number(v), { compact: true }),
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '52%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#64748B',
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 11, weight: '600' as const },
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: { label: string; parsed: number }) => ` ${ctx.label}: ${brl(ctx.parsed, { compact: true })}`,
      },
    },
  },
};

const searchResults = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return GRUPOS_SEED.filter((g) => g.nome.toLowerCase().includes(q) || g.documento.includes(q)).slice(0, 6);
});

function handleSearchSelect(id: string) {
  openGrupo(id);
  query.value = '';
}
</script>

<template>
  <GrupoDetailScreen v-if="grupoAtual" :grupo="grupoAtual" @back="route = { level: 'dashboard' }" />
  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Dashboard
        </h1>
      </div>

      <div style="position: relative; width: 320px">
        <Search :size="15" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="query"
          placeholder="Buscar grupo por nome ou documento"
          style="width: 100%; height: 42px; padding: 0 14px 0 38px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
        <div
          v-if="searchResults.length > 0"
          style="position: absolute; top: 46px; left: 0; right: 0; z-index: 40; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden"
        >
          <button
            v-for="g in searchResults"
            :key="g.id"
            class="flex items-center justify-between risco-search-item"
            style="width: 100%; padding: 10px 14px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
            @click="handleSearchSelect(g.id)"
          >
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</div>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted)" />
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div v-for="kpi in kpis" :key="kpi.title" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 18px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 14px">
          <div class="flex items-center justify-center" :style="{ width: '36px', height: '36px', borderRadius: 'var(--radius-lg)', background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`, color: kpi.tone, flexShrink: 0 }">
            <component :is="kpi.icon" :size="17" />
          </div>
          <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted)">{{ kpi.title }}</div>
        </div>
        <div class="flex flex-col" style="gap: 8px">
          <div v-for="m in kpi.metrics" :key="m.label" class="flex items-center justify-between">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ m.label }}</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ m.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabelas -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <XCircle :size="16" style="color: var(--danger-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco ativo c/ limite vencido</h3>
        </div>
        <div v-if="riscoLimiteVencido.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhum cliente nesta condição.
        </div>
        <template v-else>
          <div class="grid risco-data-table" :style="{ gridTemplateColumns: RISCO_TABLE_GRID }">
            <div>Grupo</div><div class="risco-col-num">Limite</div><div class="risco-col-num">Risco</div><div class="risco-col-date">Vencimento</div><div class="risco-col-num">Dias Venc.</div>
          </div>
          <button
            v-for="row in riscoLimiteVencido"
            :key="row.grupo.id"
            class="grid items-center risco-queue-row risco-data-table"
            :style="{ gridTemplateColumns: RISCO_TABLE_GRID }"
            @click="openGrupo(row.grupo.id)"
          >
            <div class="risco-col-name">{{ row.grupo.nome }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.limite, { compact: true }) }}</div>
            <div class="risco-col-num risco-col-danger">{{ brl(row.grupo.riscoTotal, { compact: true }) }}</div>
            <div class="risco-col-date">{{ row.grupo.vencimentoLimite }}</div>
            <div class="risco-col-num risco-col-danger">{{ row.dias }}</div>
          </button>
        </template>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <Clock :size="16" style="color: var(--warning-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco ativo c/ limite próximo a vencer</h3>
        </div>
        <div v-if="riscoLimiteProximo.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhum cliente nesta condição.
        </div>
        <template v-else>
          <div class="grid risco-data-table" :style="{ gridTemplateColumns: RISCO_TABLE_GRID }">
            <div>Grupo</div><div class="risco-col-num">Limite</div><div class="risco-col-num">Risco</div><div class="risco-col-date">Vencimento</div><div class="risco-col-num">Dias p/ Venc.</div>
          </div>
          <button
            v-for="row in riscoLimiteProximo"
            :key="row.grupo.id"
            class="grid items-center risco-queue-row risco-data-table"
            :style="{ gridTemplateColumns: RISCO_TABLE_GRID }"
            @click="openGrupo(row.grupo.id)"
          >
            <div class="risco-col-name">{{ row.grupo.nome }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.limite, { compact: true }) }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.riscoTotal, { compact: true }) }}</div>
            <div class="risco-col-date">{{ row.grupo.vencimentoLimite }}</div>
            <div class="risco-col-num risco-col-warning">{{ row.dias }}</div>
          </button>
        </template>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Limite por Rating</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="limitePorRating" :options="barOptions" />
        </div>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco por Rating</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="riscoPorRating" :options="barOptions" />
        </div>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <Wallet :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco por Status de Grupo</h3>
        </div>
        <div style="height: 220px">
          <Pie :data="riscoPorStatus" :options="pieOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.risco-search-item:hover,
.risco-queue-row:hover {
  background: var(--surface-sunken);
}

.risco-data-table {
  column-gap: 16px;
  width: 100%;
  padding: 10px 16px;
  font-size: var(--text-sm);
  text-align: left;
}

.risco-data-table:first-of-type {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.risco-queue-row.risco-data-table {
  padding: 12px 16px;
  background: none;
  border: none;
  border-top: 1px solid var(--border-default);
  cursor: pointer;
}

.risco-col-name {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.risco-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.risco-col-date {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

.risco-col-danger {
  color: var(--danger-base);
  font-weight: var(--weight-bold);
}

.risco-col-warning {
  color: var(--warning-base);
  font-weight: var(--weight-bold);
}
</style>
