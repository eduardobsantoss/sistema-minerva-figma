<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';
import { ArrowDown, ArrowUp, BadgeCheck, Banknote, Info, Percent, Users, Wallet } from 'lucide-vue-next';
import '@/lib/chart';
import TablePagination from '@/components/ui/TablePagination.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import {
  CANAL_CONTATO_OPTS,
  STATUS_PREVENTIVO,
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
  type StatusPreventivo,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';
import StatusTitulosChart from './StatusTitulosChart.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';

const props = defineProps<{ titulos: TituloPreventivo[] }>();
const { success, error: toastError } = useToast();
const emit = defineEmits<{
  open: [payload: { operadorId: string; operador: string; inicio: string; fim: string }];
}>();

const inicio = ref('2026-09-01');
const fim = ref('2026-10-08');
const taxaOrdem = ref<'desc' | 'asc'>('desc');
const agrupamento = ref<AgrupamentoContato>('dia');
const canais = ref<CanalContato[]>([...CANAL_CONTATO_OPTS]);
const statusOcultos = ref<StatusPreventivo[]>([]);

const canalCores: Record<CanalContato, string> = {
  Email: '#083C4A',
  Telefone: '#059669',
  SMS: '#D97706',
  WhatsApp: '#7C3AED',
};

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
  const taxaValor = valorTotal === 0 ? 0 : (valorConfirmado / valorTotal) * 100;
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
      hint: '',
    },
    {
      icon: BadgeCheck,
      title: 'Confirmados',
      tone: 'var(--success-base)',
      primaryLabel: 'Contatos confirmados',
      primaryValue: String(confirmados),
      secondaryLabel: 'Taxa',
      secondaryValue: fmtPct(taxa),
      hint: '',
    },
    {
      icon: Wallet,
      title: 'Valor contactado',
      tone: 'var(--agro-base)',
      primaryLabel: 'Valor total',
      primaryValue: brl(valorTotal),
      secondaryLabel: 'Sacados',
      secondaryValue: String(sacados),
      hint: '',
    },
    {
      icon: Banknote,
      title: 'Valor confirmado',
      tone: 'var(--success-base)',
      primaryLabel: 'Valor confirmado',
      primaryValue: brl(valorConfirmado),
      secondaryLabel: 'Confirmados',
      secondaryValue: String(confirmados),
      hint: '',
    },
    {
      icon: Percent,
      title: 'Taxa de confirmação',
      tone: 'var(--warning-base)',
      primaryLabel: 'No período',
      primaryValue: fmtPct(taxaValor),
      secondaryLabel: 'Valor confirmado',
      secondaryValue: brl(valorConfirmado),
      hint: 'A conta é do valor: valor confirmado dividido pelo valor contactado.',
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

interface PontoEvolucao {
  tentativas: number;
  porStatus: Record<StatusPreventivo, number>;
}

function pontoVazio(): PontoEvolucao {
  return {
    tentativas: 0,
    porStatus: Object.fromEntries(STATUS_PREVENTIVO.map((s) => [s.key, 0])) as Record<StatusPreventivo, number>,
  };
}

const ORDEM_RETORNO: StatusPreventivo[] = [
  'PENDENTE',
  'CONFIRMADO',
  'NAO_CONFIRMADO',
  'PRORROGADO',
  'TENTATIVA_SEM_SUCESSO',
  'PAGO_A_CEDENTE',
  'AGUARDANDO_RETORNO',
  'AGUARDANDO_RETORNO_CEDENTE',
  'AGUARDANDO_RETORNO_SACADO',
  'NAO_PRIORITARIO',
  'ISENTO_AGROBANK',
  'ISENTO_TRADING',
  'AGUARDANDO_RETORNO_COMERCIAL',
  'AGUARDANDO_RETORNO_TELEGRAMA',
];

const COR_LINHA: Partial<Record<'tentativas' | StatusPreventivo, string>> = {
  tentativas: '#083C4A',
  CONFIRMADO: '#0F766E',
  NAO_CONFIRMADO: '#C2410C',
  PAGO_A_CEDENTE: '#2563EB',
};

const LINHAS_EVOLUCAO: { key: 'tentativas' | StatusPreventivo; label: string; color: string }[] = [
  { key: 'tentativas', label: 'Tentativas', color: COR_LINHA.tentativas! },
  ...ORDEM_RETORNO.map((key) => {
    const status = STATUS_PREVENTIVO.find((item) => item.key === key)!;
    return { key, label: status.label, color: COR_LINHA[key] ?? status.color };
  }),
];

const STATUS_POR_CHAVE = Object.fromEntries(STATUS_PREVENTIVO.map((s) => [s.key, s.label])) as Record<StatusPreventivo, string>;

const tip = ref({
  visible: false,
  title: '',
  left: '0px',
  top: '0px',
  above: true,
  rows: [] as { label: string; value: number }[],
});
const tipEl = ref<HTMLElement | null>(null);

function detalheDoPonto(title: string, ponto: PontoEvolucao) {
  const rows = [
    { label: 'Tentativas', value: ponto.tentativas },
    ...ORDEM_RETORNO.map((key) => ({ label: STATUS_POR_CHAVE[key], value: ponto.porStatus[key] })),
  ];
  const text = [title, ...rows.map((row) => `${row.label}: ${row.value}`)].join('\n');
  return { rows, text };
}

async function copiarTexto(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback */
  }
  try {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(field);
    return ok;
  } catch {
    return false;
  }
}

function posicaoDoTip(rect: DOMRect) {
  const gap = 8;
  const height = tipEl.value?.offsetHeight || 176;
  const width = tipEl.value?.offsetWidth || 420;
  const above = rect.top >= height + gap + 8;
  const half = width / 2;
  const left = Math.max(half + 8, Math.min(rect.left + rect.width / 2, window.innerWidth - half - 8));
  return {
    above,
    left: `${left}px`,
    top: `${above ? rect.top - gap : rect.bottom + gap}px`,
  };
}

const evolucaoPontos = computed(() => {
  const map = new Map<string, PontoEvolucao>();
  for (const evento of eventosPeriodo.value) {
    const row = map.get(evento.data) ?? pontoVazio();
    row.tentativas += evento.quantidade;
    row.porStatus[evento.status] += evento.quantidade;
    map.set(evento.data, row);
  }
  const dates = [...map.keys()].sort();
  return { dates, map };
});

const evolucaoData = computed(() => {
  const { dates, map } = evolucaoPontos.value;
  return {
    labels: dates.map((iso) => labelAgrupamento(iso, 'dia')),
    datasets: LINHAS_EVOLUCAO.map((linha) => ({
      label: linha.label,
      data: dates.map((iso) => {
        const row = map.get(iso);
        if (!row) return 0;
        return linha.key === 'tentativas' ? row.tentativas : row.porStatus[linha.key];
      }),
      borderColor: linha.color,
      backgroundColor: linha.color,
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: linha.color,
      fill: false,
    })),
  };
});

const lineOptions = computed<ChartOptions<'line'>>(() => {
  const { dates, map } = evolucaoPontos.value;
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    onHover(event, elements, chart) {
      const target = event.native?.target;
      if (!(target instanceof HTMLCanvasElement)) return;
      const y = event.native && 'offsetY' in event.native ? Number(event.native.offsetY) : 0;
      const noGrafico = y >= chart.chartArea.top && y <= chart.chartArea.bottom && elements.length > 0;
      const naLegenda = y > chart.chartArea.bottom;
      target.style.cursor = noGrafico || naLegenda ? 'pointer' : 'default';
    },
    onClick(event, elements, chart) {
      if (!elements.length) return;
      const y = event.native && 'offsetY' in event.native ? Number(event.native.offsetY) : -1;
      if (y < chart.chartArea.top || y > chart.chartArea.bottom) return;
      const index = elements[0].index;
      const ponto = map.get(dates[index] ?? '');
      if (!ponto) return;
      const title = String(chart.data.labels?.[index] ?? '');
      const { text } = detalheDoPonto(title, ponto);
      void copiarTexto(text).then((ok) => {
        if (ok) success(`Detalhe de ${title} copiado.`);
        else toastError('Não foi possível copiar o detalhe.');
      });
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
          boxWidth: 28,
          boxHeight: 4,
          color: '#334155',
          font: { size: 11, weight: 600 },
          padding: 10,
        },
      },
      tooltip: {
        enabled: false,
        external(context) {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
            tip.value = { ...tip.value, visible: false };
            return;
          }
          const ponto = map.get(dates[tooltip.dataPoints[0].dataIndex] ?? '');
          if (!ponto) {
            tip.value = { ...tip.value, visible: false };
            return;
          }
          const rect = chart.canvas.getBoundingClientRect();
          const { rows } = detalheDoPonto(tooltip.title?.[0] ?? '', ponto);
          tip.value = {
            visible: true,
            title: tooltip.title?.[0] ?? '',
            ...posicaoDoTip(rect),
            rows,
          };
          if (!tipEl.value?.offsetHeight) {
            nextTick(() => {
              if (!tip.value.visible) return;
              tip.value = { ...tip.value, ...posicaoDoTip(rect) };
            });
          }
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
      y: { beginAtZero: true, ticks: { color: '#64748B', precision: 0 }, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
    },
  };
});

interface CanalRow {
  canal: CanalContato;
  tentativas: number;
  confirmados: number;
  taxa: number;
  semSucesso: number;
  naoConfirmado: number;
}

const canaisAtivos = computed(() => CANAL_CONTATO_OPTS.filter((c) => canais.value.includes(c)));
const statusVisiveis = computed(() => STATUS_PREVENTIVO.filter((s) => !statusOcultos.value.includes(s.key)));

const canalRows = computed<CanalRow[]>(() =>
  canaisAtivos.value
    .map((canal) => {
      const eventos = eventosPeriodo.value.filter((e) => e.canal === canal);
      const soma = (status?: StatusPreventivo) =>
        eventos.filter((e) => !status || e.status === status).reduce((acc, e) => acc + e.quantidade, 0);
      const tentativas = soma();
      const confirmados = soma('CONFIRMADO');
      return {
        canal,
        tentativas,
        confirmados,
        taxa: tentativas === 0 ? 0 : (confirmados / tentativas) * 100,
        semSucesso: soma('TENTATIVA_SEM_SUCESSO'),
        naoConfirmado: soma('NAO_CONFIRMADO'),
      };
    })
    .filter((row) => row.tentativas > 0),
);

const meiosData = computed(() => {
  const ativos = canaisAtivos.value;
  const grupos = new Map<string, number>();
  const valor = (key: string, canal: CanalContato, status: StatusPreventivo) => `${key}|${canal}|${status}`;
  for (const evento of eventosPeriodo.value) {
    if (!ativos.includes(evento.canal) || statusOcultos.value.includes(evento.status)) continue;
    const key = chaveAgrupamento(evento.data, agrupamento.value);
    const id = valor(key, evento.canal, evento.status);
    grupos.set(id, (grupos.get(id) ?? 0) + evento.quantidade);
  }
  const keys = [...new Set(eventosPeriodo.value.map((e) => chaveAgrupamento(e.data, agrupamento.value)))].sort();
  return {
    labels: keys.map((key) => labelAgrupamento(key, agrupamento.value)),
    datasets: ativos.flatMap((canal) =>
      statusVisiveis.value.map((status) => ({
        label: `${canalLabel(canal)} · ${status.label}`,
        stack: canal,
        data: keys.map((key) => grupos.get(valor(key, canal, status.key)) ?? 0),
        backgroundColor: status.color,
        borderWidth: 0,
        maxBarThickness: 22,
      })),
    ),
  };
});

const meiosVazio = computed(() => meiosData.value.labels.length === 0 || meiosData.value.datasets.length === 0);

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'nearest', intersect: true },
  plugins: { legend: { display: false } },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { color: '#64748B', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
    },
    y: { stacked: true, beginAtZero: true, ticks: { color: '#64748B', precision: 0 }, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
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

function toggleStatusSerie(key: StatusPreventivo) {
  statusOcultos.value = statusOcultos.value.includes(key)
    ? statusOcultos.value.filter((s) => s !== key)
    : [...statusOcultos.value, key];
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
          <button v-if="kpi.hint" type="button" class="kpi-hint" :aria-label="kpi.hint">
            <Info :size="15" />
            <span class="kpi-hint-pop" role="tooltip">{{ kpi.hint }}</span>
          </button>
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
        <AdminDateField v-model="inicio" @update:model-value="setPage(1)" />
      </label>
      <label class="field">
        <span class="field-label">Até</span>
        <AdminDateField v-model="fim" @update:model-value="setPage(1)" />
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
      <div v-else class="evo-chart">
        <Line :data="evolucaoData" :options="lineOptions" />
        <div
          v-show="tip.visible"
          ref="tipEl"
          class="evo-tip"
          :class="{ above: tip.above }"
          :style="{ left: tip.left, top: tip.top }"
        >
          <div class="evo-tip-title">{{ tip.title }}</div>
          <div class="evo-tip-grid">
            <div v-for="row in tip.rows" :key="row.label" class="evo-tip-row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
      <p v-if="eventosPeriodo.length > 0" class="evo-hint">Clique em um ponto para copiar as quantidades daquele dia.</p>
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
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
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
      <div class="legend">
        <button
          v-for="status in STATUS_PREVENTIVO"
          :key="status.key"
          type="button"
          class="legend-chip"
          :class="{ off: statusOcultos.includes(status.key) }"
          :aria-pressed="!statusOcultos.includes(status.key)"
          @click="toggleStatusSerie(status.key)"
        >
          <span class="dot" :style="{ background: status.color }" />
          {{ status.label }}
        </button>
      </div>
      <div v-if="meiosVazio" class="empty">Nenhum contato neste recorte.</div>
      <template v-else>
        <div style="height: 280px">
          <Bar :data="meiosData" :options="barOptions" />
        </div>
        <div class="canal-table">
          <div class="grid rank-row rank-header" style="margin-top: 0">
            <div>Canal</div>
            <div style="text-align: right">Tentativas</div>
            <div style="text-align: right">Confirmados</div>
            <div style="text-align: right">Taxa (%)</div>
            <div style="text-align: right">Tentativa sem sucesso</div>
            <div style="text-align: right">Não confirmado</div>
          </div>
          <div
            v-for="row in canalRows"
            :key="row.canal"
            class="grid rank-row"
            style="border-top: 1px solid var(--border-default)"
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); text-transform: uppercase">
              {{ canalLabel(row.canal) }}
            </div>
            <div style="text-align: right">{{ row.tentativas }}</div>
            <div style="text-align: right">{{ row.confirmados }}</div>
            <div style="text-align: right">{{ fmtPct(row.taxa) }}</div>
            <div style="text-align: right">{{ row.semSucesso }}</div>
            <div style="text-align: right">{{ row.naoConfirmado }}</div>
          </div>
        </div>
      </template>
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
.kpi-hint {
  position: relative;
  margin-left: auto;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: help;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}
.kpi-hint-pop {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 5;
  width: max-content;
  max-width: 220px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #0f172a;
  color: #f8fafb;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
  white-space: normal;
}
.kpi-hint:hover .kpi-hint-pop,
.kpi-hint:focus .kpi-hint-pop,
.kpi-hint:focus-visible .kpi-hint-pop {
  display: block;
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
.evo-chart {
  position: relative;
  height: 460px;
}
.evo-hint {
  margin: 2px 0 0;
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-muted);
}
.evo-tip {
  position: fixed;
  z-index: 40;
  width: max-content;
  max-width: min(440px, calc(100vw - 24px));
  transform: translate(-50%, 0);
  pointer-events: none;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.28);
}
.evo-tip.above {
  transform: translate(-50%, -100%);
}
.evo-tip-title {
  font-size: 12px;
  font-weight: var(--weight-bold);
  color: #f8fafb;
  margin-bottom: 8px;
}
.evo-tip-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(8, auto);
  gap: 3px 18px;
}
.evo-tip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  line-height: 1.35;
  white-space: nowrap;
}
.evo-tip-row strong {
  font-variant-numeric: tabular-nums;
  color: #f8fafb;
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
  white-space: nowrap;
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
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border-radius: 9999px;
  border: 1px solid var(--border-default);
  background: var(--surface-card);
  color: var(--text-default);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
  cursor: pointer;
}
.legend-chip.off {
  color: var(--text-muted);
  opacity: 0.55;
}
.legend-chip.off .dot {
  filter: grayscale(1);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.canal {
  height: 32px;
  padding: 0 12px;
  border-radius: 9999px;
  border: 1px solid var(--border-default);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  cursor: pointer;
  white-space: nowrap;
}
.canal-table {
  margin-top: 18px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}
.canal-table .rank-row {
  grid-template-columns: minmax(max-content, 1.4fr) repeat(5, minmax(max-content, 1fr));
  min-width: 100%;
}
button:focus-visible,
input:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
