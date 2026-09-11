<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  Download,
  Wallet,
  BellRing,
  Receipt,
  FileText,
  Users,
} from 'lucide-vue-next';
import { fidcs } from '../data/fidcsData';
import {
  PORTFOLIO_REPORTS,
  SITUACAO_FUNDO_OPTS,
  STATUS_PAGAMENTO_PREVIEW,
  STATUS_NOTIFICACAO_PREVIEW,
  mockPortfolioTitulos,
  mockPortfolioSacados,
  toTitulosCsv,
  toSacadosCsv,
  isSacadosReport,
  isNotificacoesReport,
  type PortfolioReportKey,
  type PortfolioTituloRow,
  type PortfolioSacadoRow,
} from '../data/relatoriosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useBackgroundReport } from '@/composables/useBackgroundReport';

const REPORT_ICONS: Record<PortfolioReportKey, Component> = {
  ger001: Wallet,
  ger002: Receipt,
  ger003: BellRing,
  ger004: FileText,
  ger005: Users,
};

const selected = ref<PortfolioReportKey | null>(null);
const hoveredKey = ref<PortfolioReportKey | null>(null);
const draft = reactive({ situacao: '' });
const selectedIds = ref<string[]>([]);
const applied = ref(false);
const previewTitulos = ref<PortfolioTituloRow[]>([]);
const previewSacados = ref<PortfolioSacadoRow[]>([]);
const previewFilters = reactive({
  sacado: '',
  statusPagamento: '',
  vencimentoDe: '',
  vencimentoAte: '',
  statusNotificacao: '',
});
const { enqueueReport } = useBackgroundReport();

const report = computed(() => PORTFOLIO_REPORTS.find((r) => r.key === selected.value) ?? null);
const sacadosMode = computed(() => isSacadosReport(selected.value));
const notificacoesMode = computed(() => isNotificacoesReport(selected.value));
const verLabel = computed(() => (sacadosMode.value ? 'VER SACADOS' : 'VER TÍTULOS'));

const filteredFunds = computed(() =>
  fidcs.filter((f) => {
    if (draft.situacao && f.status !== draft.situacao) return false;
    return true;
  }),
);

const allFilteredSelected = computed(
  () =>
    filteredFunds.value.length > 0 &&
    filteredFunds.value.every((f) => selectedIds.value.includes(f.id)),
);

const filteredTitulos = computed(() => {
  const q = previewFilters.sacado.trim().toLowerCase();
  return previewTitulos.value.filter((r) => {
    if (q && !r.sacado.toLowerCase().includes(q)) return false;
    if (previewFilters.statusPagamento && r.statusPagamento !== previewFilters.statusPagamento) return false;
    if (previewFilters.statusNotificacao && r.statusNotificacao !== previewFilters.statusNotificacao) return false;
    if (previewFilters.vencimentoDe && r.vencimento < previewFilters.vencimentoDe) return false;
    if (previewFilters.vencimentoAte && r.vencimento > previewFilters.vencimentoAte) return false;
    return true;
  });
});

const filteredSacados = computed(() => {
  const q = previewFilters.sacado.trim().toLowerCase();
  return previewSacados.value.filter((r) => !q || r.sacado.toLowerCase().includes(q));
});

const {
  page: titulosPage,
  pageSize: titulosPageSize,
  total: titulosTotal,
  pageItems: titulosPageItems,
  setPage: setTitulosPage,
  setPageSize: setTitulosPageSize,
} = useTablePagination(() => filteredTitulos.value, { defaultPageSize: 10 });

const {
  page: sacadosPage,
  pageSize: sacadosPageSize,
  total: sacadosTotal,
  pageItems: sacadosPageItems,
  setPage: setSacadosPage,
  setPageSize: setSacadosPageSize,
} = useTablePagination(() => filteredSacados.value, { defaultPageSize: 10 });

const previewTotal = computed(() => (sacadosMode.value ? sacadosTotal.value : titulosTotal.value));

function resetPreviewFilters() {
  previewFilters.sacado = '';
  previewFilters.statusPagamento = '';
  previewFilters.vencimentoDe = '';
  previewFilters.vencimentoAte = '';
  previewFilters.statusNotificacao = '';
}

function selectReport(key: PortfolioReportKey) {
  selected.value = key;
  draft.situacao = '';
  selectedIds.value = fidcs.map((f) => f.id);
  applied.value = false;
  previewTitulos.value = [];
  previewSacados.value = [];
  resetPreviewFilters();
}

function goBack() {
  if (applied.value) {
    applied.value = false;
    previewTitulos.value = [];
    previewSacados.value = [];
    resetPreviewFilters();
    return;
  }
  selected.value = null;
}

function toggleFund(id: string) {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) selectedIds.value = selectedIds.value.filter((x) => x !== id);
  else selectedIds.value = [...selectedIds.value, id];
}

function toggleAllFiltered() {
  if (allFilteredSelected.value) {
    const remove = new Set(filteredFunds.value.map((f) => f.id));
    selectedIds.value = selectedIds.value.filter((id) => !remove.has(id));
  } else {
    const add = filteredFunds.value.map((f) => f.id);
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...add]));
  }
}

function handleVer() {
  if (!report.value || !selected.value) return;
  const funds = filteredFunds.value
    .filter((f) => selectedIds.value.includes(f.id))
    .map((f) => ({ id: f.id, nome: f.name }));
  resetPreviewFilters();
  if (sacadosMode.value) {
    previewSacados.value = mockPortfolioSacados(funds);
    previewTitulos.value = [];
  } else {
    previewTitulos.value = mockPortfolioTitulos(funds);
    previewSacados.value = [];
  }
  applied.value = true;
  setTitulosPage(1);
  setSacadosPage(1);
}

function handleExportCsv() {
  if (!report.value) return;
  const includeNotificacao = notificacoesMode.value;
  const csv = sacadosMode.value
    ? toSacadosCsv(filteredSacados.value)
    : toTitulosCsv(filteredTitulos.value, includeNotificacao);
  enqueueReport({
    reportName: report.value.title,
    buildFile: () => ({
      blob: new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }),
      filename: report.value!.fileName,
    }),
  });
}

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        FIDC's
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in PORTFOLIO_REPORTS"
        :key="r.key"
        class="flex flex-col"
        type="button"
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
          style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)"
        >
          <component :is="REPORT_ICONS[r.key]" :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
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
            transition: 'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
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
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="goBack"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · FIDC's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div v-if="!applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div style="margin-bottom: 18px; max-width: 320px">
        <div :style="labelStyle">Situação do fundo</div>
        <select v-model="draft.situacao" :style="inputStyle">
          <option value="">Todos</option>
          <option v-for="o in SITUACAO_FUNDO_OPTS" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>

      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
        Selecionar FIDC's
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 18px">
        <div
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allFilteredSelected" @change="toggleAllFiltered" />
          </div>
          <div>Nome</div>
          <div>CNPJ</div>
          <div>Categoria</div>
          <div>Status</div>
        </div>
        <div
          v-for="f in filteredFunds"
          :key="f.id"
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="toggleFund(f.id)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.includes(f.id)" @change="toggleFund(f.id)" />
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ f.cnpj }}</div>
          <div style="color: var(--text-default)">{{ f.category }}</div>
          <div style="color: var(--text-muted)">{{ f.status }}</div>
        </div>
        <div v-if="filteredFunds.length === 0" style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
          Nenhum FIDC para os filtros.
        </div>
      </div>

      <div class="flex items-center justify-end">
        <button
          type="button"
          class="flex items-center"
          :disabled="selectedIds.length === 0"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 20px',
            background: 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
            opacity: selectedIds.length === 0 ? 0.5 : 1,
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="handleVer"
        >
          <FileSpreadsheet :size="15" /> {{ verLabel }}
        </button>
      </div>
    </div>

    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ previewTotal }} {{ previewTotal === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          type="button"
          :disabled="previewTotal === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: previewTotal === 0 ? 'not-allowed' : 'pointer',
            color: previewTotal === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div class="grid" :style="{ gridTemplateColumns: notificacoesMode ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }">
        <div>
          <div :style="labelStyle">Sacado</div>
          <input v-model="previewFilters.sacado" type="text" placeholder="Buscar sacado" :style="inputStyle" />
        </div>
        <template v-if="!sacadosMode">
          <div>
            <div :style="labelStyle">Status pagamento</div>
            <select v-model="previewFilters.statusPagamento" :style="inputStyle">
              <option value="">Todos</option>
              <option v-for="o in STATUS_PAGAMENTO_PREVIEW" :key="o" :value="o">{{ o }}</option>
            </select>
          </div>
          <div>
            <div :style="labelStyle">Vencimento de</div>
            <input v-model="previewFilters.vencimentoDe" type="date" :style="inputStyle" />
          </div>
          <div>
            <div :style="labelStyle">Vencimento até</div>
            <input v-model="previewFilters.vencimentoAte" type="date" :style="inputStyle" />
          </div>
          <div v-if="notificacoesMode">
            <div :style="labelStyle">Status notificação</div>
            <select v-model="previewFilters.statusNotificacao" :style="inputStyle">
              <option value="">Todos</option>
              <option v-for="o in STATUS_NOTIFICACAO_PREVIEW" :key="o" :value="o">{{ o }}</option>
            </select>
          </div>
        </template>
      </div>

      <div v-if="previewTotal === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhum resultado para os filtros.
      </div>
      <template v-else-if="sacadosMode">
        <div
          class="grid"
          style="grid-template-columns: 2fr 2fr 1.4fr 1.2fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Fundo</div><div>Sacado</div><div>Documento</div><div>Limite / exposição</div>
        </div>
        <div
          v-for="row in sacadosPageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 2fr 2fr 1.4fr 1.2fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.fundo }}</div>
          <div style="color: var(--text-default)">{{ row.sacado }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.documento }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ row.limite }}</div>
        </div>
        <TablePagination :total="sacadosTotal" :page="sacadosPage" :page-size="sacadosPageSize" @update:page="setSacadosPage" @update:page-size="setSacadosPageSize" />
      </template>
      <template v-else>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: notificacoesMode ? '1.6fr 1.6fr 1fr 0.7fr 1fr 1fr 1.1fr 1.2fr' : '1.6fr 1.6fr 1fr 0.7fr 1fr 1fr 1.1fr',
            padding: '10px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Fundo</div><div>Sacado</div><div>Nº NF</div><div>Parcela</div><div>Vencimento</div><div>Valor</div><div>Status pagamento</div>
          <div v-if="notificacoesMode">Status notificação</div>
        </div>
        <div
          v-for="row in titulosPageItems"
          :key="row.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: notificacoesMode ? '1.6fr 1.6fr 1fr 0.7fr 1fr 1fr 1.1fr 1.2fr' : '1.6fr 1.6fr 1fr 0.7fr 1fr 1fr 1.1fr',
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.fundo }}</div>
          <div style="color: var(--text-default)">{{ row.sacado }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.nfe }}</div>
          <div style="color: var(--text-muted)">{{ row.parcela }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.vencimento }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ row.valor }}</div>
          <div style="color: var(--text-default)">{{ row.statusPagamento }}</div>
          <div v-if="notificacoesMode" style="color: var(--text-default)">{{ row.statusNotificacao }}</div>
        </div>
        <TablePagination :total="titulosTotal" :page="titulosPage" :page-size="titulosPageSize" @update:page="setTitulosPage" @update:page-size="setTitulosPageSize" />
      </template>
    </div>
  </div>
</template>
