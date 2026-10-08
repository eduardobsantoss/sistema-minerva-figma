<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { ArrowDown, ArrowUp, BadgeCheck, Banknote, Percent, Users, Wallet } from 'lucide-vue-next';
import '@/lib/chart';
import TablePagination from '@/components/ui/TablePagination.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  CANAL_CONTATO_OPTS,
  CONTATOS_OPERADOR_SEED,
  EVOLUCAO_SEED,
  brl,
  canalLabel,
  chaveAgrupamento,
  fmtPct,
  inPeriodo,
  labelAgrupamento,
  type AgrupamentoContato,
  type CanalContato,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';
import StatusTitulosChart from './StatusTitulosChart.vue';

const props = defineProps<{ titulos: TituloPreventivo[] }>();
const emit = defineEmits<{
  open: [payload: { operadorId: string; operador: string; inicio: string; fim: string }];
}>();

const inicio = ref('2026-09-01');
const fim = ref('2026-10-08');
const taxaOrdem = ref<'desc' | 'asc'>('desc');
const agrupamento = ref<AgrupamentoContato>('dia');
const canais = ref<CanalContato[]>([...CANAL_CONTATO_OPTS]);

const contatosPeriodo = computed(() =>
  CONTATOS_OPERADOR_SEED.filter((c) => inPeriodo(c.ultimoContato, inicio.value, fim.value)),
);

const kpis = computed(() => {
  const rows = contatosPeriodo.value;
  const sacados = new Set(rows.map((c) => c.documento)).size;
  const confirmados = rows.filter((c) => c.confirmado).length;
  const valorTotal = rows.reduce((acc, c) => acc + c.valorAPagar, 0);
  const valorConfirmado = rows.reduce((acc, c) => acc + c.valorConfirmado, 0);
  const taxa = rows.length === 0 ? 0 : (confirmados / rows.length) * 100;
  const tentativas = rows.reduce((acc, c) => acc + c.tentativas, 0);
  return [
    {
      icon: Users,
      title: 'Sacados contactados',
      tone: 'var(--gci-base)',
      primaryLabel: 'No período',
      primaryValue: String(sacados),
      secondaryLabel: 'Tentativas',
      secondaryValue: String(tentativas),
    },
    {
      icon: BadgeCheck,
      title: 'Confirmados',
      tone: 'var(--success-base)',
      primaryLabel: 'Contatos confirmados',
      primaryValue: String(confirmados),
      secondaryLabel: 'Taxa',
      secondaryValue: fmtPct(taxa),
    },
    {
      icon: Wallet,
      title: 'Valor contactado',
      tone: 'var(--agro-base)',
      primaryLabel: 'Valor total',
      primaryValue: brl(valorTotal),
      secondaryLabel: 'Sacados',
      secondaryValue: String(sacados),
    },
    {
      icon: Banknote,
      title: 'Valor confirmado',
      tone: 'var(--success-base)',
      primaryLabel: 'Valor confirmado',
      primaryValue: brl(valorConfirmado),
      secondaryLabel: 'Confirmados',
      secondaryValue: String(confirmados),
    },
    {
      icon: Percent,
      title: 'Taxa de confirmação',
      tone: 'var(--warning-base)',
      primaryLabel: 'Confirmados / contactados',
      primaryValue: fmtPct(taxa),
      secondaryLabel: 'Confirmados',
      secondaryValue: String(confirmados),
    },
  ];
});

interface RankingRow {
  operadorId: string;
  operador: string;
  sacados: number;
  tentativas: number;
  confirmados: number;
  taxa: number;
  valorTotal: number;
  valorConfirmado: number;
}

const ranking = computed<RankingRow[]>(() => {
  const map = new Map<string, RankingRow>();
  for (const contato of contatosPeriodo.value) {
    const row = map.get(contato.operadorId) ?? {
      operadorId: contato.operadorId,
      operador: contato.operador,
      sacados: 0,
      tentativas: 0,
      confirmados: 0,
      taxa: 0,
      valorTotal: 0,
      valorConfirmado: 0,
    };
    row.sacados += 1;
    row.tentativas += contato.tentativas;
    if (contato.confirmado) row.confirmados += 1;
    row.valorTotal += contato.valorAPagar;
    row.valorConfirmado += contato.valorConfirmado;
    row.taxa = row.sacados === 0 ? 0 : (row.confirmados / row.sacados) * 100;
    map.set(contato.operadorId, row);
  }
  return [...map.values()].sort((a, b) =>
    taxaOrdem.value === 'desc' ? b.taxa - a.taxa : a.taxa - b.taxa,
  );
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => ranking.value, {
  defaultPageSize: 5,
});

const eventosPeriodo = computed(() =>
  EVOLUCAO_SEED.filter((e) => inPeriodo(e.data, inicio.value, fim.value)),
);

const evolucaoData = computed(() => {
  const map = new Map<string, number>();
  for (const evento of eventosPeriodo.value) {
    map.set(evento.data, (map.get(evento.data) ?? 0) + evento.quantidade);
  }
  const labels = [...map.keys()].sort();
  return {
    labels: labels.map((iso) => labelAgrupamento(iso, 'dia')),
    datasets: [
      {
        label: 'Contatos',
        data: labels.map((iso) => map.get(iso) ?? 0),
        borderColor: '#083C4A',
        backgroundColor: 'rgba(8, 60, 74, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };
});

const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748B', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
    y: { beginAtZero: true, ticks: { color: '#64748B', precision: 0 }, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
  },
};

const canalCores: Record<CanalContato, string> = {
  Email: '#083C4A',
  Telefone: '#059669',
  SMS: '#D97706',
  WhatsApp: '#7C3AED',
};

const meiosData = computed(() => {
  const ativos = CANAL_CONTATO_OPTS.filter((c) => canais.value.includes(c));
  const grupos = new Map<string, Record<CanalContato, number>>();
  for (const evento of eventosPeriodo.value) {
    if (!ativos.includes(evento.canal)) continue;
    const key = chaveAgrupamento(evento.data, agrupamento.value);
    const row = grupos.get(key) ?? { Email: 0, Telefone: 0, SMS: 0, WhatsApp: 0 };
    row[evento.canal] += evento.quantidade;
    grupos.set(key, row);
  }
  const keys = [...grupos.keys()].sort();
  return {
    labels: keys.map((key) => labelAgrupamento(key, agrupamento.value)),
    datasets: ativos.map((canal) => ({
      label: canalLabel(canal),
      data: keys.map((key) => grupos.get(key)?.[canal] ?? 0),
      backgroundColor: canalCores[canal],
      borderRadius: 4,
    })),
  };
});

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#64748B', usePointStyle: true, pointStyle: 'circle', boxHeight: 6, font: { size: 11 } },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748B', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
    y: { beginAtZero: true, ticks: { color: '#64748B', precision: 0 }, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
  },
};

function toggleCanal(canal: CanalContato) {
  if (canais.value.includes(canal)) {
    if (canais.value.length === 1) return;
    canais.value = canais.value.filter((c) => c !== canal);
  } else {
    canais.value = [...canais.value, canal];
  }
}

function toggleTaxa() {
  taxaOrdem.value = taxaOrdem.value === 'desc' ? 'asc' : 'desc';
  setPage(1);
}

function abrirOperador(row: RankingRow) {
  emit('open', {
    operadorId: row.operadorId,
    operador: row.operador,
    inicio: inicio.value,
    fim: fim.value,
  });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.title" class="kpi-card">
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
        <div class="field-label" style="margin-bottom: 6px">{{ kpi.primaryLabel }}</div>
        <div class="kpi-hero" :style="{ color: kpi.tone }">{{ kpi.primaryValue }}</div>
        <div class="flex items-center justify-between kpi-foot">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ kpi.secondaryValue }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
      <label class="field">
        <span class="field-label">De</span>
        <input v-model="inicio" type="date" class="field-input" @change="setPage(1)" />
      </label>
      <label class="field">
        <span class="field-label">Até</span>
        <input v-model="fim" type="date" class="field-input" @change="setPage(1)" />
      </label>
    </div>

    <StatusTitulosChart :titulos="props.titulos" />

    <div
      style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div style="padding: 16px 20px 0">
        <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Ranking por operador
        </h2>
      </div>
      <div v-if="ranking.length === 0" class="empty">Nenhum contato no período.</div>
      <template v-else>
        <div class="grid rank-row rank-header" style="grid-template-columns: 1.4fr 0.8fr 0.7fr 0.8fr 0.7fr 1fr 1fr">
          <div>Operador</div>
          <div style="text-align: right">Sacados</div>
          <div style="text-align: right">Tentativas</div>
          <div style="text-align: right">Confirmados</div>
          <button type="button" class="sort" @click="toggleTaxa">
            Taxa
            <ArrowDown v-if="taxaOrdem === 'desc'" :size="12" />
            <ArrowUp v-else :size="12" />
          </button>
          <div style="text-align: right">Valor total</div>
          <div style="text-align: right">Valor confirmado</div>
        </div>
        <button
          v-for="row in pageItems"
          :key="row.operadorId"
          type="button"
          class="grid rank-row rank-line"
          style="grid-template-columns: 1.4fr 0.8fr 0.7fr 0.8fr 0.7fr 1fr 1fr"
          @click="abrirOperador(row)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); text-align: left">{{ row.operador }}</div>
          <div style="text-align: right">{{ row.sacados }}</div>
          <div style="text-align: right">{{ row.tentativas }}</div>
          <div style="text-align: right">{{ row.confirmados }}</div>
          <div style="text-align: right">{{ fmtPct(row.taxa) }}</div>
          <div style="text-align: right">{{ brl(row.valorTotal) }}</div>
          <div style="text-align: right">{{ brl(row.valorConfirmado) }}</div>
        </button>
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </template>
    </div>

    <div class="panel">
      <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
        Evolução no período
      </h2>
      <div v-if="eventosPeriodo.length === 0" class="empty">Nenhum dado de evolução no período.</div>
      <div v-else style="height: 240px">
        <Line :data="evolucaoData" :options="lineOptions" />
      </div>
    </div>

    <div class="panel">
      <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap; margin-bottom: 14px">
        <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Por meio de contato
        </h2>
        <SegmentedToggle
          :model-value="agrupamento"
          :options="[
            { key: 'dia', label: 'Dia' },
            { key: 'semana', label: 'Semana' },
            { key: 'mes', label: 'Mês' },
            { key: 'ano', label: 'Ano' },
          ]"
          @update:model-value="agrupamento = $event as AgrupamentoContato"
        />
      </div>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap; margin-bottom: 16px">
        <button
          v-for="canal in CANAL_CONTATO_OPTS"
          :key="canal"
          type="button"
          class="canal"
          :style="{
            borderColor: canais.includes(canal) ? canalCores[canal] : 'var(--border-default)',
            color: canais.includes(canal) ? canalCores[canal] : 'var(--text-muted)',
            background: canais.includes(canal) ? `color-mix(in srgb, ${canalCores[canal]} 10%, transparent)` : 'var(--surface-card)',
          }"
          @click="toggleCanal(canal)"
        >
          {{ canalLabel(canal) }}
        </button>
      </div>
      <div v-if="meiosData.labels.length === 0" class="empty">Nenhum contato neste recorte.</div>
      <div v-else style="height: 260px">
        <Bar :data="meiosData" :options="barOptions" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.field-input {
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.kpi-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.kpi-card {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
  padding: 20px;
}
.kpi-hero {
  font-size: 28px;
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 14px;
}
.kpi-foot {
  padding-top: 12px;
  border-top: 1px solid var(--border-default);
}
.panel {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 16px 20px 20px;
}
.rank-row {
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
  font-variant-numeric: tabular-nums;
}
.rank-header {
  margin-top: 12px;
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.rank-line {
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid var(--border-default);
  cursor: pointer;
}
.rank-line:hover {
  background: var(--surface-sunken);
}
.sort {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}
.empty {
  padding: 28px 16px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.canal {
  height: 32px;
  padding: 0 12px;
  border-radius: 9999px;
  border: 1px solid var(--border-default);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  cursor: pointer;
}
button:focus-visible,
input:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
