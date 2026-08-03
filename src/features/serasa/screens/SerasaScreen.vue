<script setup lang="ts">
import { onUnmounted, ref, type Component } from 'vue';
import {
  User, AlertTriangle, Scale, History, Search, XCircle, RefreshCw,
} from 'lucide-vue-next';
import type {
  CreditQueryLatest,
  DatasetProgress,
  HistoryItem,
  MockScenario,
  ScreenPhase,
} from '../data/serasaTypes';
import { DEMO_SCENARIOS } from '../data/serasaMocks';
import {
  getOrCreate,
  getByDocument,
  startProcessingPoll,
  seedProcessingForDemo,
  NotFoundError,
} from '../services/serasaService';
import { onlyDigits } from '../utils/serasaFormatters';
import SerasaHeader from '../components/SerasaHeader.vue';
import SerasaSummaryCards from '../components/SerasaSummaryCards.vue';
import SerasaProcessingPanel from '../components/SerasaProcessingPanel.vue';
import ConfirmRefreshModal from '../components/ConfirmRefreshModal.vue';
import BasicInfoTab from './tabs/BasicInfoTab.vue';
import CreditReportsTab from './tabs/CreditReportsTab.vue';
import ProcessesTab from './tabs/ProcessesTab.vue';
import HistoryTab from './tabs/HistoryTab.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';

type Tab = 'cadastro' | 'restricoes' | 'processos' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'cadastro', label: 'Dados cadastrais', icon: User },
  { key: 'restricoes', label: 'Restrições financeiras', icon: AlertTriangle },
  { key: 'processos', label: 'Processos judiciais', icon: Scale },
  { key: 'historico', label: 'Histórico', icon: History },
];

const documentInput = ref('');
const phase = ref<ScreenPhase>('idle');
const loading = ref(false);
const latest = ref<CreditQueryLatest | null>(null);
const history = ref<HistoryItem[]>([]);
const tab = ref<Tab>('cadastro');
const showRefreshModal = ref(false);
const pollDatasets = ref<DatasetProgress[]>([]);
const pollAttempts = ref(0);
const activeQueryId = ref<number | null>(null);

let stopPoll: (() => void) | null = null;

onUnmounted(() => {
  stopPoll?.();
});

async function runConsult(forceRefresh = false) {
  const digits = onlyDigits(documentInput.value);
  if (digits.length !== 11 && digits.length !== 14) return;

  stopPoll?.();
  loading.value = true;
  phase.value = 'loading';

  try {
    const response = await getOrCreate(digits, { forceRefresh });

    if (response.status === 'Failed') {
      phase.value = 'failed';
      latest.value = null;
      return;
    }

    if (response.outcome === 'ReusedCompleted' && response.typed) {
      latest.value = response.typed;
      const byDoc = await getByDocument(digits);
      history.value = byDoc.history.items;
      phase.value = 'completed';
      return;
    }

    activeQueryId.value = response.queryId;
    phase.value = 'processing';
    pollDatasets.value = [];
    pollAttempts.value = 0;

    stopPoll = startProcessingPoll(
      response.queryId,
      digits,
      (poll) => {
        pollDatasets.value = poll.datasets;
        pollAttempts.value = poll.attempts;
      },
      (result) => {
        latest.value = result.latest;
        history.value = result.history.items;
        phase.value = result.latest ? 'completed' : 'not-found';
        loading.value = false;
      },
      () => {
        phase.value = 'failed';
        loading.value = false;
      },
    );
  } catch (e) {
    if (e instanceof NotFoundError) {
      phase.value = 'not-found';
      latest.value = null;
      history.value = [];
    } else {
      phase.value = 'failed';
    }
  } finally {
    if (phase.value !== 'processing') {
      loading.value = false;
    }
  }
}

function handleConsult() {
  runConsult(false);
}

function handleRefreshRequest() {
  showRefreshModal.value = true;
}

function handleRefreshConfirm() {
  showRefreshModal.value = false;
  runConsult(true);
}

function handleRetry() {
  runConsult(false);
}

async function loadDemoScenario(scenario: MockScenario) {
  stopPoll?.();
  const demo = DEMO_SCENARIOS.find((s) => s.key === scenario);
  if (!demo) return;

  if (demo.document) {
    documentInput.value = demo.document;
  }

  if (scenario === 'nunca-consultado') {
    documentInput.value = '00000000000';
    phase.value = 'not-found';
    latest.value = null;
    history.value = [];
    return;
  }

  if (scenario === 'processing') {
    const digits = onlyDigits(documentInput.value) || '12345678901';
    documentInput.value = digits;
    const queryId = seedProcessingForDemo(digits);
    activeQueryId.value = queryId;
    phase.value = 'processing';
    pollDatasets.value = [];
    pollAttempts.value = 0;
    loading.value = true;

    stopPoll = startProcessingPoll(
      queryId,
      digits,
      (poll) => {
        pollDatasets.value = poll.datasets;
        pollAttempts.value = poll.attempts;
      },
      (result) => {
        latest.value = result.latest;
        history.value = result.history.items;
        phase.value = 'completed';
        loading.value = false;
      },
      () => {
        phase.value = 'failed';
        loading.value = false;
      },
    );
    return;
  }

  if (scenario === 'failed') {
    documentInput.value = demo.document ?? '11111111111';
    phase.value = 'failed';
    latest.value = null;
    return;
  }

  await runConsult(false);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px; padding-bottom: 48px">
    <SerasaHeader
      v-model:document-input="documentInput"
      :loading="loading"
      :latest="phase === 'completed' ? latest : null"
      @consult="handleConsult"
      @refresh="handleRefreshRequest"
    />

    <EmptyState
      v-if="phase === 'not-found'"
      :icon="Search"
      title="Documento nunca consultado"
      hint="Não há consultas anteriores para este CPF/CNPJ no Minerva. Clique em Consultar para iniciar a primeira consulta."
    />

    <div
      v-else-if="phase === 'failed'"
      class="flex flex-col items-center"
      style="gap: 16px; padding: 40px 24px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); text-align: center"
    >
      <div class="flex items-center justify-center" style="width: 56px; height: 56px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base)">
        <XCircle :size="28" />
      </div>
      <div>
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Não foi possível concluir a consulta
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 6px; max-width: 400px">
          Ocorreu um erro ao processar a consulta no Serasa. Tente novamente em alguns instantes.
        </p>
      </div>
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 20px; border: none; border-radius: var(--radius-lg); background: var(--action-primary-bg); color: #fff; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
        @click="handleRetry"
      >
        <RefreshCw :size="16" />
        TENTAR NOVAMENTE
      </button>
    </div>

    <SerasaProcessingPanel
      v-else-if="phase === 'processing'"
      :datasets="pollDatasets"
      :attempts="pollAttempts"
    />

    <template v-else-if="phase === 'completed' && latest">
      <div
        v-if="!latest.agroScore"
        class="flex items-center"
        style="gap: 10px; padding: 12px 16px; border-radius: var(--radius-lg); background: var(--status-warning-bg); border: 1px solid color-mix(in srgb, var(--warning-base) 25%, transparent)"
      >
        <AlertTriangle :size="16" style="color: var(--warning-base); flex-shrink: 0" />
        <span style="font-size: var(--text-sm); color: var(--status-warning-text)">
          O bloco de Score Agro não está disponível para este documento.
        </span>
      </div>

      <SerasaSummaryCards :latest="latest" />

      <SegmentedToggle
        :model-value="tab"
        :options="TABS"
        variant="brand"
        @update:model-value="tab = $event as Tab"
      />

      <BasicInfoTab v-if="tab === 'cadastro' && latest.basicInfo" :basic-info="latest.basicInfo" />
      <div
        v-else-if="tab === 'cadastro'"
        style="padding: 20px; border: 1px dashed var(--border-default); border-radius: var(--radius-lg); text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
      >
        Dados cadastrais indisponíveis para esta consulta.
      </div>

      <CreditReportsTab v-if="tab === 'restricoes'" :credit-reports="latest.creditReports" />
      <ProcessesTab v-if="tab === 'processos'" :processes="latest.processes" />
      <HistoryTab v-if="tab === 'historico'" :items="history" />
    </template>

    <ConfirmRefreshModal
      v-if="showRefreshModal"
      @confirm="handleRefreshConfirm"
      @cancel="showRefreshModal = false"
    />

    <div
      style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--border-default)"
    >
      <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
        Demo — cenários de protótipo
      </div>
      <div class="flex flex-wrap" style="gap: 6px">
        <button
          v-for="demo in DEMO_SCENARIOS"
          :key="demo.key"
          style="height: 28px; padding: 0 10px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--surface-sunken); cursor: pointer; font-size: 11px; color: var(--text-muted)"
          @click="loadDemoScenario(demo.key)"
        >
          {{ demo.label }}
        </button>
      </div>
    </div>
  </div>
</template>
