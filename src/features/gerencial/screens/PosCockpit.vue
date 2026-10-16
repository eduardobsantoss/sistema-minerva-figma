<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlertTriangle, BarChart3, CheckCircle2, ChevronDown, Filter, ShieldAlert, Wallet } from 'lucide-vue-next';
import { Pie } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import '@/lib/chart';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  NIVEL_RISCO_LABEL,
  PAGE_SIZE_OPTIONS,
  RECORTE_POS_INICIAL,
  TIPO_CESSAO_OPCOES,
  TIPO_CLIENTE_OPCOES,
  brl,
  corAlertaComposicao,
  corAlertaRegistro,
  corFaixa,
  corInadimplencia,
  datasValidas,
  filtrarPos,
  fmtPct,
  hojeIso,
  toneOf,
  veiculos,
  type RecortePos,
} from '../data/gerencialData';

const emit = defineEmits<{ open: [payload: { grupoId: string; recorte: RecortePos }] }>();
const { warn } = useToast();

const applied = ref<RecortePos>({ ...RECORTE_POS_INICIAL });
const draft = ref<RecortePos>({ ...RECORTE_POS_INICIAL });
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);

const base = computed(() => filtrarPos(applied.value));
const lista = computed(() => base.value);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => lista.value,
  { defaultPageSize: 5 },
);

watch(applied, () => setPage(1));

const hoje = hojeIso();
const activeFilterCount = computed(() => {
  const atual = applied.value;
  return (Object.keys(RECORTE_POS_INICIAL) as (keyof RecortePos)[])
    .filter((key) => atual[key] !== RECORTE_POS_INICIAL[key]).length;
});

const kpis = computed(() => [
  {
    key: 'acima' as const,
    icon: AlertTriangle,
    title: 'Limite',
    tone: 'var(--danger-base)',
    primaryLabel: 'Acima do limite',
    primaryValue: String(base.value.filter((c) => c.acimaDoLimite).length),
    secondaryLabel: 'Clientes no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'confirmacao' as const,
    icon: CheckCircle2,
    title: 'Confirmação',
    tone: 'var(--danger-base)',
    primaryLabel: 'Confirmação < 70%',
    primaryValue: String(base.value.filter((c) => c.totais.pctConfirmados < 70).length),
    secondaryLabel: 'Clientes no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'registro' as const,
    icon: Wallet,
    title: 'Registro',
    tone: 'var(--warning-base)',
    primaryLabel: 'Registro < 70%',
    primaryValue: String(base.value.filter((c) => c.totais.pctRegistrado < 70).length),
    secondaryLabel: 'Clientes no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'inadimplencia' as const,
    icon: AlertTriangle,
    title: 'Inadimplência',
    tone: 'var(--danger-base)',
    primaryLabel: 'Inadimplentes',
    primaryValue: String(base.value.filter((c) => c.grupo.inadimplencia > 0).length),
    secondaryLabel: 'Clientes no recorte',
    secondaryValue: String(base.value.length),
  },
  {
    key: 'alerta' as const,
    icon: ShieldAlert,
    title: 'Garantia',
    tone: 'var(--danger-base)',
    primaryLabel: 'Alerta de garantia',
    primaryValue: String(base.value.filter((c) => c.alertaVermelho).length),
    secondaryLabel: 'Clientes no recorte',
    secondaryValue: String(base.value.length),
  },
]);

const FAIXAS = ['≥ 85%', '70% a 84%', '< 70%'];
const FAIXA_CORES = ['#047857', '#B45309', '#B91C1C'];

function contarFaixa(campo: 'pctConfirmados' | 'pctRegistrado') {
  const contagem = [0, 0, 0];
  for (const cliente of base.value) {
    const pct = cliente.totais[campo];
    if (pct >= 85) contagem[0] += 1;
    else if (pct >= 70) contagem[1] += 1;
    else contagem[2] += 1;
  }
  return {
    labels: FAIXAS,
    datasets: [{
      data: contagem,
      backgroundColor: FAIXA_CORES,
      hoverBackgroundColor: FAIXA_CORES,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      hoverOffset: 10,
    }],
  };
}

const confirmacaoFaixa = computed(() => contarFaixa('pctConfirmados'));
const registroFaixa = computed(() => contarFaixa('pctRegistrado'));

const pieOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '52%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#64748B', padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 11, weight: 'bold' } },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: { label: string; parsed: number }) => ` ${ctx.label}: ${ctx.parsed}`,
      },
    },
  },
};

const grid = 'minmax(180px, 1.5fr) 120px 140px 120px 130px 130px minmax(180px, 1.3fr)';

function openFilters() {
  draft.value = { ...applied.value };
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < 420 && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function filtrar() {
  const erro = datasValidas(draft.value.dataInicial, draft.value.dataFinal, true);
  if (erro) {
    warn(erro);
    return;
  }
  applied.value = { ...draft.value };
  filterOpen.value = false;
}

function limpar() {
  applied.value = { ...RECORTE_POS_INICIAL };
  draft.value = { ...RECORTE_POS_INICIAL };
  filterOpen.value = false;
}

function abrir(grupoId: string) {
  emit('open', { grupoId, recorte: { ...applied.value } });
}

</script>

<template>
  <div class="ger-page">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div class="ger-kicker">Pós desembolso</div>
        <h1 class="ger-title">Quem precisa de acompanhamento</h1>
        <p class="ger-sub">{{ lista.length }} {{ lista.length === 1 ? 'cliente no recorte' : 'clientes no recorte' }}</p>
      </div>
      <div style="position: relative; margin-left: auto">
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
              width: '640px',
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
                <div class="filter-label">Cliente</div>
                <input v-model="draft.cliente" class="filter-input" placeholder="Nome do grupo" />
              </label>
              <label>
                <div class="filter-label">Tipo de cliente</div>
                <select v-model="draft.tipoCliente" class="filter-input">
                  <option value="">Todos</option>
                  <option v-for="t in TIPO_CLIENTE_OPCOES" :key="t" :value="t">{{ t }}</option>
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
                <div class="filter-label">Veículo de operação</div>
                <select v-model="draft.veiculoId" class="filter-input">
                  <option value="">Todos</option>
                  <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.nome }}</option>
                </select>
              </label>
              <label>
                <div class="filter-label">Data inicial da cessão</div>
                <input v-model="draft.dataInicial" type="date" class="filter-input" :max="hoje" />
              </label>
              <label>
                <div class="filter-label">Data final da cessão</div>
                <input v-model="draft.dataFinal" type="date" class="filter-input" :max="hoje" />
              </label>
              <label style="grid-column: 1 / -1">
                <div class="filter-label">Tipo de cessão</div>
                <select v-model="draft.tipoCessao" class="filter-input">
                  <option value="">Todos</option>
                  <option v-for="t in TIPO_CESSAO_OPCOES" :key="t" :value="t">{{ t }}</option>
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
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Confirmação dos clientes</h3>
        </div>
        <div style="height: 220px">
          <Pie :data="confirmacaoFaixa" :options="pieOptions" />
        </div>
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Registro dos títulos</h3>
        </div>
        <div style="height: 220px">
          <Pie :data="registroFaixa" :options="pieOptions" />
        </div>
      </div>
    </div>

    <div class="ger-card">
      <div class="ger-scroll">
        <div style="min-width: 1080px">
          <div class="grid ger-table-head" :style="{ gridTemplateColumns: grid }">
            <div>Cliente</div>
            <div>Tipo</div>
            <div>Limite / risco</div>
            <div>Inadimplência</div>
            <div>Confirmação</div>
            <div>Registro</div>
            <div>Alertas</div>
          </div>
          <div v-if="pageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted)">
            Nenhum cliente neste recorte.
          </div>
          <div
            v-for="item in pageItems"
            :key="item.grupo.id"
            class="grid ger-row ger-row--click"
            :style="{ gridTemplateColumns: grid }"
            @click="abrir(item.grupo.id)"
          >
            <div class="ger-strong" :title="item.grupo.nome" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ item.grupo.nome }}
            </div>
            <div>{{ item.grupo.tipoCliente }}</div>
            <div>
              <div class="ger-num ger-strong">{{ brl(item.grupo.limite) }}</div>
              <div class="ger-num ger-hint" :style="{ color: item.acimaDoLimite ? 'var(--status-warning-text)' : undefined }">
                {{ item.grupo.risco <= 0 ? 'Sem risco' : brl(item.grupo.risco) }}
              </div>
            </div>
            <div class="ger-num" :style="{ color: toneOf(corInadimplencia(item.grupo.inadimplencia)).text, fontWeight: 'var(--weight-bold)' }">
              {{ brl(item.grupo.inadimplencia) }}
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corFaixa(item.totais.pctConfirmados))">{{ fmtPct(item.totais.pctConfirmados) }}</span>
              <div class="ger-hint ger-num">{{ brl(item.totais.valorConfirmados) }}</div>
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corFaixa(item.totais.pctRegistrado))">{{ fmtPct(item.totais.pctRegistrado) }}</span>
              <div class="ger-hint ger-num">{{ brl(item.totais.valorRegistrado) }}</div>
            </div>
            <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
              <span v-if="!item.grupo.temGarantia" class="ger-pill" :style="toneOf('muted')">Sem garantia</span>
              <template v-else>
                <span class="ger-pill" :style="toneOf(corAlertaComposicao(item.grupo.composicaoAlerta))">{{ item.grupo.composicaoTexto }}</span>
                <span class="ger-pill" :style="toneOf(corAlertaRegistro(item.grupo.registroAlerta))">{{ item.grupo.registroTexto }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <TablePagination
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
</style>
