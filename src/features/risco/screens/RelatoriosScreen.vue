<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ArrowLeft, FileSpreadsheet, ChevronRight, Download, ClipboardCheck } from 'lucide-vue-next';
import {
  GRUPOS_SEED, GERENTES_SEED, STATUS_GRUPO_RELATORIO_OPTS, STATUS_PARECER_RELATORIO_OPTS,
  parecerLabel, parecerColor, statusOperacaoColor,
} from '../data/riscoData';

type ReportKey = 'parecer-credito';

interface ReportDef {
  key: ReportKey;
  title: string;
  description: string;
}

const REPORTS: ReportDef[] = [
  {
    key: 'parecer-credito',
    title: 'Relatório de Parecer de Crédito',
    description: 'Situação do parecer de crédito por grupo empresarial, filtrável por status do grupo, gerente e vencimento do parecer.',
  },
];

interface Filters {
  nomeGrupo: string;
  statusGrupo: string;
  gerente: string;
  statusParecer: string;
}

const EMPTY_FILTERS: Filters = { nomeGrupo: '', statusGrupo: '', gerente: '', statusParecer: '' };

function toCsv(rows: { nome: string; documento: string; statusGrupo: string; gerente: string; parecer: string }[]): string {
  const header = ['Nome do Grupo', 'Documento', 'Status do Grupo', 'Gerente', 'Status do Parecer'];
  const lines = rows.map((r) => [r.nome, r.documento, r.statusGrupo, r.gerente, r.parecer].map((v) => `"${v.replace(/"/g, '""')}"`).join(';'));
  return [header.join(';'), ...lines].join('\n');
}

const selected = ref<ReportKey | null>(null);
const draft = reactive<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters | null>(null);

const results = computed(() => {
  if (!applied.value) return [];
  const f = applied.value;
  return GRUPOS_SEED.filter((g) => {
    if (f.nomeGrupo && !g.nome.toLowerCase().includes(f.nomeGrupo.toLowerCase())) return false;
    if (f.statusGrupo && g.statusOperacao !== f.statusGrupo) return false;
    if (f.gerente && g.gerente !== f.gerente) return false;
    if (f.statusParecer === 'Vencido' && g.parecerCredito !== 'EXPIRADO') return false;
    if (f.statusParecer === 'A vencer' && !(g.parecerCredito === 'CONFORME' || g.parecerCredito === 'EXPIRANDO')) return false;
    return true;
  });
});

const report = computed(() => REPORTS.find((r) => r.key === selected.value) ?? null);

function selectReport(key: ReportKey) {
  selected.value = key;
  Object.assign(draft, EMPTY_FILTERS);
  applied.value = null;
}

function handleGerar() {
  applied.value = { ...draft };
}

function handleExportCsv() {
  const csv = toCsv(results.value.map((g) => ({
    nome: g.nome, documento: g.documento, statusGrupo: g.statusOperacao, gerente: g.gerente, parecer: parecerLabel(g.parecerCredito),
  })));
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-parecer-de-credito.csv';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Risco
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
        v-for="r in REPORTS"
        :key="r.key"
        class="flex flex-col relatorios-card"
        style="gap: 14px; text-align: left; padding: 22px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); cursor: pointer; transition: border-color var(--duration-base)"
        @click="selectReport(r.key)"
      >
        <div class="flex items-center justify-center" style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)">
          <ClipboardCheck :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">{{ r.title }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">{{ r.description }}</div>
        </div>
        <div class="flex items-center" style="gap: 4px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--accent); margin-top: auto">
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button aria-label="Voltar" class="flex items-center justify-center" style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0" @click="selected = null">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · Risco
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">{{ report?.title }}</h2>
      </div>
    </div>

    <!-- Filtros -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome do grupo</div>
          <input
            v-model="draft.nomeGrupo"
            placeholder="Buscar por nome"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status do grupo</div>
          <select
            v-model="draft.statusGrupo"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in STATUS_GRUPO_RELATORIO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Gerente</div>
          <select
            v-model="draft.gerente"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in GERENTES_SEED" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status do parecer</div>
          <select
            v-model="draft.statusParecer"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in STATUS_PARECER_RELATORIO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="gap: 8px; height: 42px; padding: 0 20px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{ gap: '6px', height: '34px', padding: '0 14px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: results.length === 0 ? 'not-allowed' : 'pointer', color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div v-if="results.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhum grupo encontrado para os filtros selecionados.
      </div>
      <div v-else class="grid" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome do Grupo</div><div>Documento</div><div>Status do Grupo</div><div>Gerente</div><div>Parecer de Crédito</div>
      </div>
      <div v-for="g in results" :key="g.id" class="grid items-center" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ g.documento }}</div>
        <div :style="{ color: statusOperacaoColor(g.statusOperacao), fontWeight: 'var(--weight-semibold)' }">{{ g.statusOperacao }}</div>
        <div style="color: var(--text-default)">{{ g.gerente }}</div>
        <div :style="{ color: parecerColor(g.parecerCredito), fontWeight: 'var(--weight-semibold)' }">{{ parecerLabel(g.parecerCredito) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.relatorios-card:hover {
  border-color: var(--accent);
}
</style>
