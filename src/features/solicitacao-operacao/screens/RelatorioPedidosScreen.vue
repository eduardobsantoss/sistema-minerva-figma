<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  Download,
  ClipboardList,
  FileText,
  Percent,
  ListChecks,
  ScrollText,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import ToggleRow from '../components/modals/adicionar-contrato/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  REQUEST_REPORTS,
  GERENTES_COMERCIAIS,
  SUPERINTENDENTES,
  GRUPOS_EMPRESARIAIS,
  VEICULOS_OPERACAO,
  emptyRelatorioFilters,
  isAbaixoDaTaxa,
  isChecklistPdf,
  isTitulosReport,
  reportFileName,
  type RelatorioPedidosFilters,
  type RelatorioResultRow,
  type RequestReportValue,
} from '../data/relatoriosPedidosData';
import { TIPO_PEDIDO_OPTS } from '../data/tipoPedidoOptions';

const REPORT_ICONS: Record<RequestReportValue, Component> = {
  20: ClipboardList,
  22: ListChecks,
  34: ScrollText,
  29: Percent,
  33: FileText,
};

const selected = ref<RequestReportValue | null>(null);
const hoveredKey = ref<RequestReportValue | null>(null);
const draft = reactive<RelatorioPedidosFilters>(emptyRelatorioFilters());
const applied = ref<RelatorioPedidosFilters | null>(null);

const errors = reactive({
  numeroSolicitacao: '',
  aprovacaoDatas: '',
});

const report = computed(() => REQUEST_REPORTS.find((r) => r.value === selected.value) ?? null);
const showAbaixoDaTaxa = computed(() => isAbaixoDaTaxa(selected.value));
const showQuitacao = computed(() => isTitulosReport(selected.value));
const isPdfReport = computed(() => isChecklistPdf(selected.value));

const results = computed<RelatorioResultRow[]>(() => {
  if (!applied.value || selected.value === null) return [];
  return buildMockResults(selected.value, applied.value);
});

const resultColumns = computed(() => {
  if (selected.value === null) return [] as string[];
  if (isAbaixoDaTaxa(selected.value)) {
    return ['Aprovação de', 'Aprovação até', 'Veículo', 'Grupo', 'Gerente'];
  }
  if (isTitulosReport(selected.value)) {
    return ['Nº solicitação', 'Gerente', 'Grupo', 'Tipo', 'Quitação vencidos'];
  }
  if (isChecklistPdf(selected.value)) {
    return ['Nº solicitação', 'Status', 'Valor operação', 'Taxa', 'Avaliador'];
  }
  return ['Nº solicitação', 'Gerente comercial', 'Grupo empresarial', 'Tipo solicitação'];
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

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

const errorTextStyle = {
  fontSize: 'var(--text-xs)',
  color: 'var(--danger-base, #c53030)',
  marginTop: '6px',
  lineHeight: '1.4',
} as const;

function selectReport(value: RequestReportValue) {
  selected.value = value;
  Object.assign(draft, emptyRelatorioFilters());
  applied.value = null;
  clearValidation();
}

function goBack() {
  selected.value = null;
  applied.value = null;
  clearValidation();
}

function clearValidation() {
  errors.numeroSolicitacao = '';
  errors.aprovacaoDatas = '';
}

function validateNumeroSolicitacao(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^[1-9]\d*$/.test(trimmed)) return 'Insira somente números positivos inteiros';
  return null;
}

function onNumeroBlur() {
  errors.numeroSolicitacao = validateNumeroSolicitacao(draft.numeroSolicitacao) ?? '';
}

function toggleVeiculo(veiculo: string) {
  const idx = draft.veiculos.indexOf(veiculo);
  if (idx >= 0) draft.veiculos.splice(idx, 1);
  else draft.veiculos.push(veiculo);
}

function validateBeforeGerar(): boolean {
  clearValidation();
  if (selected.value === null) return false;

  if (!isAbaixoDaTaxa(selected.value)) {
    const msg = validateNumeroSolicitacao(draft.numeroSolicitacao);
    if (msg) {
      errors.numeroSolicitacao = msg;
      return false;
    }
  }

  if (isAbaixoDaTaxa(selected.value)) {
    const de = draft.aprovacaoDe;
    const ate = draft.aprovacaoAte;
    if ((de && !ate) || (!de && ate)) {
      errors.aprovacaoDatas =
        'As datas inicial e final de aprovação da exceção devem ser informadas juntas.';
      return false;
    }
    if (de && ate && de > ate) {
      errors.aprovacaoDatas =
        'A data inicial de aprovação da exceção não pode ser maior que a data final.';
      return false;
    }
  }

  return true;
}

function handleGerar() {
  if (!validateBeforeGerar()) return;
  applied.value = {
    ...draft,
    veiculos: [...draft.veiculos],
  };
  setPage(1);
}

function buildMockResults(
  tipo: RequestReportValue,
  f: RelatorioPedidosFilters,
): RelatorioResultRow[] {
  if (isAbaixoDaTaxa(tipo)) {
    const veiculoLabel =
      f.veiculos.length > 0 ? f.veiculos.join('; ') : VEICULOS_OPERACAO[0];
    return [
      {
        id: 'r1',
        col1: f.aprovacaoDe || '2026-01-10',
        col2: f.aprovacaoAte || '2026-03-15',
        col3: veiculoLabel,
        col4: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[0],
        col5: f.gerenteComercial || GERENTES_COMERCIAIS[0],
      },
      {
        id: 'r2',
        col1: '2026-02-01',
        col2: '2026-02-28',
        col3: VEICULOS_OPERACAO[1],
        col4: GRUPOS_EMPRESARIAIS[1],
        col5: GERENTES_COMERCIAIS[1],
      },
      {
        id: 'r3',
        col1: '2026-03-01',
        col2: '2026-03-31',
        col3: VEICULOS_OPERACAO[2],
        col4: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[2],
        col5: f.gerenteComercial || GERENTES_COMERCIAIS[2],
      },
    ];
  }

  if (isChecklistPdf(tipo)) {
    return [
      {
        id: 'c1',
        col1: f.numeroSolicitacao || '10482',
        col2: 'VALIDADO',
        col3: 'R$ 1.250.000,00',
        col4: '1,85%',
        col5: 'Maria Silva',
      },
      {
        id: 'c2',
        col1: '10501',
        col2: 'PENDENTE',
        col3: 'R$ 890.000,00',
        col4: '2,10%',
        col5: 'João Pereira',
      },
    ];
  }

  const base: RelatorioResultRow[] = [
    {
      id: 's1',
      col1: f.numeroSolicitacao || '10482',
      col2: f.gerenteComercial || GERENTES_COMERCIAIS[0],
      col3: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[0],
      col4: f.tipoSolicitacao || TIPO_PEDIDO_OPTS[0].text,
    },
    {
      id: 's2',
      col1: '10501',
      col2: GERENTES_COMERCIAIS[1],
      col3: GRUPOS_EMPRESARIAIS[1],
      col4: TIPO_PEDIDO_OPTS[3].text,
    },
    {
      id: 's3',
      col1: '10519',
      col2: f.gerenteComercial || GERENTES_COMERCIAIS[2],
      col3: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[2],
      col4: f.tipoSolicitacao || TIPO_PEDIDO_OPTS[6].text,
    },
  ];

  if (isTitulosReport(tipo)) {
    return base.map((row, i) => ({
      ...row,
      col5: i === 0 ? (f.quitacaoVencidos ? 'Sim' : 'Não') : i === 1 ? 'Não' : 'Sim',
    }));
  }

  return base;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function handleExportCsv() {
  if (selected.value === null || results.value.length === 0) return;
  const header = resultColumns.value;
  const lines = results.value.map((r) => {
    const cells = [r.col1, r.col2, r.col3, r.col4];
    if (header.length > 4) cells.push(r.col5 ?? '');
    return cells.map(escapeCsvCell).join(';');
  });
  const csv = [header.join(';'), ...lines].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, reportFileName(selected.value, 'csv'));
}

function handleExportPdf() {
  if (selected.value === null || results.value.length === 0) return;
  const body = [
    'RELATÓRIO DE CHECKLIST DA SOLICITAÇÃO',
    '',
    ...results.value.map(
      (r) =>
        `Solicitação ${r.col1} | Status: ${r.col2} | Valor: ${r.col3} | Taxa: ${r.col4} | Avaliador: ${r.col5}`,
    ),
  ].join('\n');
  const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, reportFileName(22, 'txt'));
}

const resultGridCols = computed(() =>
  resultColumns.value.length === 5 ? '1.2fr 1fr 1.4fr 1.4fr 1fr' : '1.2fr 1.2fr 1.4fr 1.6fr',
);
</script>

<template>
  <!-- Lista de cards (padrão Risco) -->
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
        Workflow Operacional · Solicitações
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
        v-for="r in REQUEST_REPORTS"
        :key="r.value"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.value ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.value ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.value ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectReport(r.value)"
        @mouseenter="hoveredKey = r.value"
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
          <component :is="REPORT_ICONS[r.value]" :size="20" />
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
            {{ r.text }}
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
            opacity: hoveredKey === r.value ? 1 : 0,
            transform: hoveredKey === r.value ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <!-- Detalhe do relatório -->
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
        @click="goBack"
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
          Relatórios · Solicitações
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ report?.text }}
        </h2>
      </div>
    </div>

    <!-- Filtros -->
    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <!-- Dados da Solicitação (tipos ≠ 29) -->
      <div v-if="!showAbaixoDaTaxa" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Número da solicitação</div>
          <input
            v-model="draft.numeroSolicitacao"
            type="text"
            inputmode="numeric"
            placeholder="Ex.: 10482"
            :style="{
              ...inputStyle,
              borderColor: errors.numeroSolicitacao
                ? 'var(--danger-base, #c53030)'
                : 'var(--border-default)',
            }"
            @blur="onNumeroBlur"
            @input="errors.numeroSolicitacao = ''"
          />
          <div v-if="errors.numeroSolicitacao" :style="errorTextStyle">
            {{ errors.numeroSolicitacao }}
          </div>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo da solicitação</div>
          <select v-model="draft.tipoSolicitacao" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div v-if="showQuitacao" style="grid-column: 1 / -1">
          <ToggleRow
            label="Operação para quitação de vencidos"
            :on="draft.quitacaoVencidos"
            spacious
            @toggle="draft.quitacaoVencidos = !draft.quitacaoVencidos"
          />
        </div>
      </div>

      <!-- Filtros Abaixo da Taxa (tipo 29) -->
      <div v-else class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Aprovação de</div>
          <input
            v-model="draft.aprovacaoDe"
            type="date"
            :style="inputStyle"
            @input="errors.aprovacaoDatas = ''"
          />
        </div>
        <div>
          <div :style="labelStyle">Aprovação até</div>
          <input
            v-model="draft.aprovacaoAte"
            type="date"
            :style="inputStyle"
            @input="errors.aprovacaoDatas = ''"
          />
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo do pedido</div>
          <select v-model="draft.tipoPedido" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Superintendente</div>
          <select v-model="draft.superintendente" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="s in SUPERINTENDENTES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div v-if="errors.aprovacaoDatas" style="grid-column: 1 / -1">
          <div :style="errorTextStyle">{{ errors.aprovacaoDatas }}</div>
        </div>
        <div style="grid-column: 1 / -1">
          <div :style="labelStyle">Veículo de operação</div>
          <div
            class="grid"
            style="
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              gap: 10px;
              padding: 14px;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-sunken);
            "
          >
            <label
              v-for="v in VEICULOS_OPERACAO"
              :key="v"
              class="flex items-center"
              style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
            >
              <input
                type="checkbox"
                :checked="draft.veiculos.includes(v)"
                style="accent-color: var(--agro-base); width: 16px; height: 16px"
                @change="toggleVeiculo(v)"
              />
              <span>{{ v }}</span>
            </label>
          </div>
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

    <!-- Resultado -->
    <div
      v-if="applied"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div
        class="flex items-center justify-between"
        style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          v-if="isPdfReport"
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
          @click="handleExportPdf"
        >
          <Download :size="13" /> EXPORTAR PDF
        </button>
        <button
          v-else
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

      <div
        v-if="results.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
      <template v-else>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '10px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div v-for="col in resultColumns" :key="col">{{ col }}</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.col1 }}</div>
          <div style="color: var(--text-default)">{{ row.col2 }}</div>
          <div style="color: var(--text-muted)">{{ row.col3 }}</div>
          <div style="color: var(--text-default)">{{ row.col4 }}</div>
          <div v-if="resultColumns.length > 4" style="color: var(--text-default)">{{ row.col5 }}</div>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </template>
    </div>
  </div>
</template>
