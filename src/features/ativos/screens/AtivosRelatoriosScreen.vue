<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue';
import { ArrowLeft, FileSpreadsheet, ChevronRight, Download, Wallet, FileText } from 'lucide-vue-next';
import { SITUACAO_OPTS, brl, situacaoLabel, type ContratoAtivoGlobal, type TituloAtivoGlobal } from '../data/ativosData';
import {
  ATIVOS_REPORTS,
  ATIVOS_FUNDOS,
  SITUACAO_FUNDO_OPTS,
  TIPO_VEICULO_OPTS,
  filterTitulosByFunds,
  filterContratosByFunds,
  filterTitulosPreview,
  filterContratosPreview,
  toTitulosCsv,
  toContratosCsv,
  isContratosReport,
  type AtivosReportKey,
} from '../data/relatoriosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useBackgroundReport } from '@/composables/useBackgroundReport';

const REPORT_ICONS: Record<AtivosReportKey, Component> = {
  wallet: Wallet,
  'asset-contract-listing': FileText,
};

const selected = ref<AtivosReportKey | null>(null);
const hoveredKey = ref<AtivosReportKey | null>(null);
const draft = reactive({ tipo: '', situacao: '' });
const selectedIds = ref<string[]>([]);
const applied = ref(false);
const previewTitulos = ref<TituloAtivoGlobal[]>([]);
const previewContratos = ref<ContratoAtivoGlobal[]>([]);
const previewFilters = reactive({
  sacado: '',
  situacao: '',
  vencimentoDe: '',
  vencimentoAte: '',
});
const { enqueueReport } = useBackgroundReport();

const report = computed(() => ATIVOS_REPORTS.find((r) => r.key === selected.value) ?? null);
const contratosMode = computed(() => isContratosReport(selected.value));
const verLabel = computed(() => (contratosMode.value ? 'VER CONTRATOS' : 'VER TÍTULOS'));

const filteredFunds = computed(() =>
  ATIVOS_FUNDOS.filter((f) => {
    if (draft.tipo && f.tipo !== draft.tipo) return false;
    if (draft.situacao && f.situacao !== draft.situacao) return false;
    return true;
  }),
);

const allFilteredSelected = computed(
  () =>
    filteredFunds.value.length > 0 &&
    filteredFunds.value.every((f) => selectedIds.value.includes(f.id)),
);

const filteredTitulos = computed(() => filterTitulosPreview(previewTitulos.value, previewFilters));
const filteredContratos = computed(() => filterContratosPreview(previewContratos.value, previewFilters));

const {
  page: titulosPage,
  pageSize: titulosPageSize,
  total: titulosTotal,
  pageItems: titulosPageItems,
  setPage: setTitulosPage,
  setPageSize: setTitulosPageSize,
} = useTablePagination(() => filteredTitulos.value, { defaultPageSize: 10 });

const {
  page: contratosPage,
  pageSize: contratosPageSize,
  total: contratosTotal,
  pageItems: contratosPageItems,
  setPage: setContratosPage,
  setPageSize: setContratosPageSize,
} = useTablePagination(() => filteredContratos.value, { defaultPageSize: 10 });

const previewTotal = computed(() => (contratosMode.value ? contratosTotal.value : titulosTotal.value));

function resetPreviewFilters() {
  previewFilters.sacado = '';
  previewFilters.situacao = '';
  previewFilters.vencimentoDe = '';
  previewFilters.vencimentoAte = '';
}

function selectReport(key: AtivosReportKey) {
  selected.value = key;
  draft.tipo = '';
  draft.situacao = '';
  selectedIds.value = ATIVOS_FUNDOS.map((f) => f.id);
  applied.value = false;
  previewTitulos.value = [];
  previewContratos.value = [];
  resetPreviewFilters();
}

function goBack() {
  if (applied.value) {
    applied.value = false;
    previewTitulos.value = [];
    previewContratos.value = [];
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
  const ids = filteredFunds.value.filter((f) => selectedIds.value.includes(f.id)).map((f) => f.id);
  resetPreviewFilters();
  if (contratosMode.value) {
    previewContratos.value = filterContratosByFunds(ids);
    previewTitulos.value = [];
  } else {
    previewTitulos.value = filterTitulosByFunds(ids);
    previewContratos.value = [];
  }
  applied.value = true;
  setTitulosPage(1);
  setContratosPage(1);
}

function handleExportCsv() {
  if (!report.value) return;
  const csv = contratosMode.value ? toContratosCsv(filteredContratos.value) : toTitulosCsv(filteredTitulos.value);
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
        Ativos
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
        v-for="r in ATIVOS_REPORTS"
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
          Relatórios · Ativos
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div v-if="!applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 18px">
        <div>
          <div :style="labelStyle">Veículo</div>
          <select v-model="draft.tipo" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="o in TIPO_VEICULO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Situação do fundo</div>
          <select v-model="draft.situacao" :style="inputStyle">
            <option value="">Todas</option>
            <option v-for="o in SITUACAO_FUNDO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>

      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
        Selecionar fundos
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 18px">
        <div
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 0.8fr 1.2fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allFilteredSelected" @change="toggleAllFiltered" />
          </div>
          <div>Nome</div>
          <div>Tipo</div>
          <div>CNPJ</div>
          <div>Status</div>
        </div>
        <div
          v-for="f in filteredFunds"
          :key="f.id"
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 0.8fr 1.2fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="toggleFund(f.id)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.includes(f.id)" @change="toggleFund(f.id)" />
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.nome }}</div>
          <div style="color: var(--text-default)">{{ f.tipo }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ f.cnpj }}</div>
          <div style="color: var(--text-muted)">{{ f.situacao }}</div>
        </div>
        <div v-if="filteredFunds.length === 0" style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
          Nenhum fundo para os filtros.
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

      <div class="grid" :style="{ gridTemplateColumns: contratosMode ? '1fr' : 'repeat(3, 1fr)', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }">
        <div>
          <div :style="labelStyle">Sacado</div>
          <input v-model="previewFilters.sacado" type="text" placeholder="Buscar sacado" :style="inputStyle" />
        </div>
        <template v-if="!contratosMode">
          <div>
            <div :style="labelStyle">Situação</div>
            <select v-model="previewFilters.situacao" :style="inputStyle">
              <option value="">Todas</option>
              <option v-for="o in SITUACAO_OPTS" :key="o" :value="o">{{ situacaoLabel(o) }}</option>
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
        </template>
      </div>

      <div v-if="previewTotal === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhum resultado para os filtros.
      </div>
      <template v-else-if="contratosMode">
        <div
          class="grid"
          style="grid-template-columns: 1fr 1.4fr 0.7fr 1.4fr 1.4fr 1fr 1fr 0.7fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Nº Contrato</div><div>Fundo</div><div>Tipo</div><div>Cedente</div><div>Sacado</div><div>Valor nominal</div><div>Último vencimento</div><div>Parcelas</div>
        </div>
        <div
          v-for="row in contratosPageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.4fr 0.7fr 1.4fr 1.4fr 1fr 1fr 0.7fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.numero }}</div>
          <div style="color: var(--text-default)">{{ row.veiculoNome }}</div>
          <div style="color: var(--text-muted)">{{ row.tipoAtivo }}</div>
          <div style="color: var(--text-default)">{{ row.cedenteNome }}</div>
          <div style="color: var(--text-default)">{{ row.sacadoNome }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(row.valorNominal) }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.ultimoVencimento }}</div>
          <div style="color: var(--text-muted)">{{ row.qtdParcelas }}</div>
        </div>
        <TablePagination :total="contratosTotal" :page="contratosPage" :page-size="contratosPageSize" @update:page="setContratosPage" @update:page-size="setContratosPageSize" />
      </template>
      <template v-else>
        <div
          class="grid"
          style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Fundo</div><div>Sacado</div><div>Nº Título</div><div>Contrato</div><div>Vencimento</div><div>Valor aberto</div><div>Situação</div>
        </div>
        <div
          v-for="row in titulosPageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.veiculoNome }}</div>
          <div style="color: var(--text-default)">{{ row.sacadoNome }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.numero }}</div>
          <div style="color: var(--text-muted)">{{ row.contratoNumero }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.vencimento }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(row.valorAberto) }}</div>
          <div style="color: var(--text-default)">{{ situacaoLabel(row.situacao) }}</div>
        </div>
        <TablePagination :total="titulosTotal" :page="titulosPage" :page-size="titulosPageSize" @update:page="setTitulosPage" @update:page-size="setTitulosPageSize" />
      </template>
    </div>
  </div>
</template>
