<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  AlertTriangle,
  BellRing,
  Receipt,
} from 'lucide-vue-next';
import {
  TITULOS_SEED,
  VEICULO_OPTS,
  STATUS_PAGAMENTO_OPTS,
  brl,
  statusPagamentoLabel,
  type StatusPagamento,
} from '../data/titulosData';
import {
  DISPAROS_SEED,
  statusDisparoLabel,
  taxaEntrega,
  fmtPct,
} from '../data/resultadoNotificacoesData';
import { useBackgroundReport } from '@/composables/useBackgroundReport';

type ReportKey = 'inadimplencia' | 'efetividade' | 'boletagem';

interface ReportDef {
  key: ReportKey;
  title: string;
  description: string;
  icon: Component;
}

const REPORTS: ReportDef[] = [
  {
    key: 'inadimplencia',
    title: 'Relatório de Inadimplência',
    description: 'Títulos vencidos e em atraso, com valor em aberto, dias de atraso e veículo.',
    icon: AlertTriangle,
  },
  {
    key: 'efetividade',
    title: 'Efetividade de Notificação',
    description: 'Desempenho dos disparos de notificação: taxa de entrega, abertura e falhas por campanha.',
    icon: BellRing,
  },
  {
    key: 'boletagem',
    title: 'Relatório de Boletagem',
    description: 'Situação de boletos gerados versus pendentes sobre títulos com valor em aberto.',
    icon: Receipt,
  },
];

interface Filters {
  veiculoId: string;
  status: string;
  campanha: string;
}

const EMPTY_FILTERS: Filters = { veiculoId: '', status: '', campanha: '' };

const selected = ref<ReportKey | null>(null);
const hoveredKey = ref<ReportKey | null>(null);
const draft = reactive<Filters>({ ...EMPTY_FILTERS });
const { enqueueReport } = useBackgroundReport();

const report = computed(() => REPORTS.find((r) => r.key === selected.value) ?? null);

function filterTitulos(key: ReportKey, f: Filters) {
  return TITULOS_SEED.filter((t) => {
    if (key === 'inadimplencia' && !(t.statusPagamento === 'VENCIDO' || t.diasAtraso > 0)) return false;
    if (key === 'boletagem' && t.vrAberto <= 0) return false;
    if (f.veiculoId && t.veiculoId !== f.veiculoId) return false;
    if (f.status && t.statusPagamento !== f.status) return false;
    return true;
  });
}

function filterDisparos(f: Filters) {
  return DISPAROS_SEED.filter((d) => {
    if (f.campanha && d.campanha !== f.campanha) return false;
    if (f.status && d.status !== f.status) return false;
    return true;
  });
}

function csvBlob(csv: string) {
  return new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
}

function selectReport(key: ReportKey) {
  selected.value = key;
  Object.assign(draft, EMPTY_FILTERS);
}

function handleGerar() {
  if (!report.value || !selected.value) return;
  const key = selected.value;
  const f = { ...draft };
  const reportName = report.value.title;

  enqueueReport({
    reportName,
    buildFile: () => {
      if (key === 'efetividade') {
        const header = ['Lote', 'Campanha', 'Canal', 'Entrega %', 'Falhas', 'Status'];
        const lines = filterDisparos(f).map((d) =>
          [d.lote, d.campanha, d.canal, fmtPct(taxaEntrega(d)), String(d.falhas), statusDisparoLabel(d.status)]
            .map((v) => `"${v.replace(/"/g, '""')}"`)
            .join(';'),
        );
        return {
          blob: csvBlob([header.join(';'), ...lines].join('\n')),
          filename: 'efetividade-notificacao.csv',
        };
      }

      const header = ['Nº Título', 'Veículo', 'Sacado', 'VR. Aberto', 'Status', 'Dias atraso', 'Boleto'];
      const lines = filterTitulos(key, f).map((t) =>
        [
          t.numero,
          t.veiculoNome,
          t.sacado,
          brl(t.vrAberto),
          statusPagamentoLabel(t.statusPagamento),
          String(t.diasAtraso),
          t.boletoGeradoEm ?? 'Pendente',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(';'),
      );
      return {
        blob: csvBlob([header.join(';'), ...lines].join('\n')),
        filename: key === 'boletagem' ? 'relatorio-boletagem.csv' : 'relatorio-inadimplencia.csv',
      };
    },
  });
}

const CAMPANHAS = Array.from(new Set(DISPAROS_SEED.map((d) => d.campanha)));
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
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
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in REPORTS"
        :key="r.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectReport(r.key)"
        @mouseenter="hoveredKey = r.key"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <component :is="r.icon" :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 6px;
            "
          >
            {{ r.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ r.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === r.key ? 1 : 0,
            transform: hoveredKey === r.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Relatórios · Cobrança
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: selected === 'efetividade' ? '1fr 1fr' : '1fr 1fr',
          gap: '14px',
        }"
      >
        <div v-if="selected !== 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Veículo
          </div>
          <select
            v-model="draft.veiculoId"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option v-for="v in VEICULO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
          </select>
        </div>
        <div v-if="selected !== 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Status do título
          </div>
          <select
            v-model="draft.status"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option v-for="s in STATUS_PAGAMENTO_OPTS" :key="s" :value="s">
              {{ statusPagamentoLabel(s as StatusPagamento) }}
            </option>
          </select>
        </div>
        <div v-if="selected === 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Campanha
          </div>
          <select
            v-model="draft.campanha"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todas</option>
            <option v-for="c in CAMPANHAS" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div v-if="selected === 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Status do disparo
          </div>
          <select
            v-model="draft.status"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option value="SUCESSO">Sucesso</option>
            <option value="FALHA">Falha</option>
            <option value="PROCESSANDO">Em processamento</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="
            gap: 8px;
            height: 42px;
            padding: 0 20px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>
  </div>
</template>
