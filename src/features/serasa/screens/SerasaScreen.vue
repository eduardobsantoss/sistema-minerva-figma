<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { Search, XCircle, RefreshCw } from 'lucide-vue-next';
import type {
  CreditQueryLatest,
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
import { maskDocumentInput, onlyDigits } from '../utils/serasaFormatters';
import SerasaHeader from '../components/SerasaHeader.vue';
import SerasaSummaryCards from '../components/SerasaSummaryCards.vue';
import BasicInfoTab from './tabs/BasicInfoTab.vue';
import CreditReportsTab from './tabs/CreditReportsTab.vue';
import ProcessesTab from './tabs/ProcessesTab.vue';
import SlaveLaborTab from './tabs/SlaveLaborTab.vue';
import IbamaTab from './tabs/IbamaTab.vue';
import HistoryTab from './tabs/HistoryTab.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import UnderlineSubTabs from '@/features/passivo-novo/components/UnderlineSubTabs.vue';
import Alert from '@/components/feedback/Alert.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { EmptyState } from '@/features/risco/screens/detail-tabs/shared';
import ConsultaLotePanel from '../components/ConsultaLotePanel.vue';
import AdminButton from '@/components/ui/AdminButton.vue';

withDefaults(defineProps<{ title?: string }>(), { title: 'Consultas' });

const TABS = [
  'Dados cadastrais',
  'Restrições financeiras',
  'Processos judiciais',
  'Trabalho escravo',
  'IBAMA',
  'Histórico',
];

const modo = ref<'unitaria' | 'lote'>('unitaria');
const modoOpcoes = [
  { key: 'unitaria', label: 'Uma consulta' },
  { key: 'lote', label: 'Subir lista' },
];

const documentInput = ref('');
const phase = ref<ScreenPhase>('idle');
const loading = ref(false);
const latest = ref<CreditQueryLatest | null>(null);
const history = ref<HistoryItem[]>([]);
const previousScore = computed(() => {
  const currentId = latest.value?.queryId;
  const older = history.value
    .filter((item) => item.queryId !== currentId && item.snapshot?.agroScore != null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return older[0]?.snapshot?.agroScore ?? null;
});
const tab = ref(TABS[0]);
const showRefreshModal = ref(false);

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

    phase.value = 'processing';

    stopPoll = startProcessingPoll(
      response.queryId,
      digits,
      () => {},
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
  const demo = DEMO_SCENARIOS.find((item) => item.key === scenario);
  if (!demo) return;

  if (demo.document) {
    documentInput.value = maskDocumentInput(demo.document);
  }

  if (scenario === 'nunca-consultado') {
    documentInput.value = maskDocumentInput('00000000000');
    phase.value = 'not-found';
    latest.value = null;
    history.value = [];
    return;
  }

  if (scenario === 'processing') {
    const digits = onlyDigits(documentInput.value) || '12345678901';
    documentInput.value = maskDocumentInput(digits);
    const queryId = seedProcessingForDemo(digits);
    phase.value = 'processing';
    loading.value = true;
    stopPoll = startProcessingPoll(
      queryId,
      digits,
      () => {},
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
    return;
  }

  if (scenario === 'failed') {
    documentInput.value = maskDocumentInput(demo.document ?? '11111111111');
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
      :title="title"
      :loading="loading"
      :lote="modo === 'lote'"
      :latest="modo === 'unitaria' && phase === 'completed' ? latest : null"
      @consult="handleConsult"
      @refresh="handleRefreshRequest"
    >
      <SegmentedToggle
        :model-value="modo"
        :options="modoOpcoes"
        variant="brand"
        @update:model-value="modo = $event as 'unitaria' | 'lote'"
      />
      <template #atalhos>
        <div class="flex flex-col" style="gap: 8px">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
            Consulta rápida
          </div>
          <div class="flex flex-wrap" style="gap: 8px">
            <AdminButton
              v-for="demo in DEMO_SCENARIOS"
              :key="demo.key"
              variant="secondary"
              size="compact"
              type="button"
              @click="loadDemoScenario(demo.key)"
            >
              {{ demo.label }}
            </AdminButton>
          </div>
        </div>
      </template>
    </SerasaHeader>

    <ConsultaLotePanel v-if="modo === 'lote'" />

    <template v-if="modo === 'unitaria'">

    <EmptyState
      v-if="phase === 'not-found'"
      :icon="Search"
      title="Documento nunca consultado"
      hint="Não há consultas anteriores para este CPF/CNPJ no Minerva. Clique em Consultar para iniciar a primeira consulta."
    />

    <div v-else-if="phase === 'failed'" class="flex flex-col items-center" style="gap: 16px">
      <EmptyState
        :icon="XCircle"
        title="Não foi possível concluir a consulta"
        hint="Ocorreu um erro ao processar a consulta. Tente novamente em alguns instantes."
      />
      <AdminButton :icon="RefreshCw" @click="handleRetry">Tentar novamente</AdminButton>
    </div>

    <EmptyState
      v-else-if="phase === 'processing'"
      :icon="Search"
      title="Consulta em andamento"
      hint="Os dados aparecem aqui assim que a consulta termina."
    />

    <template v-else-if="phase === 'completed' && latest">
      <Alert
        v-if="!latest.agroScore"
        type="warning"
        :dismissible="false"
        title="Score Agro indisponível"
        message="O bloco de Score Agro não está disponível para este documento."
      />

      <SerasaSummaryCards :latest="latest" :previous-score="previousScore" />

      <UnderlineSubTabs v-model="tab" :tabs="TABS" />

      <BasicInfoTab v-if="tab === 'Dados cadastrais' && latest.basicInfo" :basic-info="latest.basicInfo" />
      <EmptyState
        v-else-if="tab === 'Dados cadastrais'"
        :icon="Search"
        title="Dados cadastrais indisponíveis"
        hint="Esta consulta não trouxe o cadastro do documento."
      />

      <CreditReportsTab v-if="tab === 'Restrições financeiras'" :credit-reports="latest.creditReports" />
      <ProcessesTab v-if="tab === 'Processos judiciais'" :processes="latest.processes" />
      <SlaveLaborTab v-if="tab === 'Trabalho escravo'" :items="latest.slaveLaborRestrictions ?? []" />
      <IbamaTab v-if="tab === 'IBAMA'" :items="latest.ibamaRestrictions ?? []" />
      <HistoryTab v-if="tab === 'Histórico'" :items="history" />
    </template>

    <AdminModal
      v-if="showRefreshModal"
      eyebrow="Carteira"
      title="Atualizar consulta"
      subtitle="A consulta atual será substituída por uma nova busca deste documento."
      size="sm"
      @close="showRefreshModal = false"
    >
      <p style="font-size: var(--text-sm); color: var(--text-default); margin: 0">
        Os dados exibidos passam a ser os da nova consulta.
      </p>
      <template #footer>
        <AdminButton variant="secondary" @click="showRefreshModal = false">Cancelar</AdminButton>
        <AdminButton @click="handleRefreshConfirm">Atualizar</AdminButton>
      </template>
    </AdminModal>
    </template>
  </div>
</template>
