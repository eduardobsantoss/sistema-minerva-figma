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
import { cras } from '../data/craData';
import {
  PORTFOLIO_REPORTS,
  SITUACAO_FUNDO_OPTS,
  mockCraPortfolioRows,
  toPortfolioCsv,
  type PortfolioReportKey,
} from '../data/relatoriosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const REPORT_ICONS: Record<PortfolioReportKey, Component> = {
  ger001: Wallet,
  ger002: Receipt,
  ger003: BellRing,
  ger004: FileText,
  ger005: Users,
};

const selected = ref<PortfolioReportKey | null>(null);
const hoveredKey = ref<PortfolioReportKey | null>(null);
const draft = reactive({ situacao: '', cessionaria: '' });
const selectedIds = ref<string[]>([]);
const applied = ref(false);

const report = computed(() => PORTFOLIO_REPORTS.find((r) => r.key === selected.value) ?? null);

const cessionarias = computed(() =>
  Array.from(new Set(cras.map((c) => c.cessionaria))).sort(),
);

const filteredFunds = computed(() =>
  cras.filter((c) => {
    if (draft.situacao && c.status !== draft.situacao) return false;
    if (draft.cessionaria && c.cessionaria !== draft.cessionaria) return false;
    return true;
  }),
);

const allFilteredSelected = computed(
  () =>
    filteredFunds.value.length > 0 &&
    filteredFunds.value.every((f) => selectedIds.value.includes(f.id)),
);

const results = computed(() => {
  if (!applied.value || !selected.value) return [];
  const funds = filteredFunds.value.filter((f) => selectedIds.value.includes(f.id));
  return mockCraPortfolioRows(selected.value, funds);
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

function selectReport(key: PortfolioReportKey) {
  selected.value = key;
  draft.situacao = '';
  draft.cessionaria = '';
  selectedIds.value = cras.map((c) => c.id);
  applied.value = false;
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

function handleGerar() {
  applied.value = true;
  setPage(1);
}

function handleExportCsv() {
  if (!report.value) return;
  const csv = toPortfolioCsv(results.value);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = report.value.fileName;
  a.click();
  URL.revokeObjectURL(url);
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
        CRA's
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
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · CRA's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 18px">
        <div>
          <div :style="labelStyle">Situação do fundo</div>
          <select v-model="draft.situacao" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="o in SITUACAO_FUNDO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Cessionária</div>
          <select v-model="draft.cessionaria" :style="inputStyle">
            <option value="">Todas</option>
            <option v-for="o in cessionarias" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>

      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
        Selecionar CRA's
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 18px">
        <div
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1.4fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allFilteredSelected" @change="toggleAllFiltered" />
          </div>
          <div>Nome</div>
          <div>CNPJ</div>
          <div>Cessionária</div>
          <div>Status</div>
        </div>
        <div
          v-for="f in filteredFunds"
          :key="f.id"
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1.4fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="toggleFund(f.id)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.includes(f.id)" @change="toggleFund(f.id)" />
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.nome }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ f.cnpj }}</div>
          <div style="color: var(--text-default)">{{ f.cessionaria }}</div>
          <div style="color: var(--text-muted)">{{ f.status }}</div>
        </div>
        <div v-if="filteredFunds.length === 0" style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
          Nenhum CRA para os filtros.
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
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <div v-if="applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          type="button"
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: results.length === 0 ? 'not-allowed' : 'pointer',
            color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div v-if="results.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Selecione ao menos um CRA e gere o relatório.
      </div>
      <template v-else>
        <div
          class="grid"
          style="grid-template-columns: 2fr 1.2fr 1.4fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Fundo</div><div>CNPJ</div><div>Cessionária</div><div>Status</div><div>Métrica</div><div>Valor</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 2fr 1.2fr 1.4fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.fundo }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.cnpj }}</div>
          <div style="color: var(--text-default)">{{ row.cessionaria }}</div>
          <div style="color: var(--text-muted)">{{ row.status }}</div>
          <div style="color: var(--text-default)">{{ row.metrica }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ row.valor }}</div>
        </div>
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </template>
    </div>
  </div>
</template>
