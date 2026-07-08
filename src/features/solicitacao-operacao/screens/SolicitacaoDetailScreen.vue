<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Component } from 'vue';
import {
  ArrowLeft, FileText, Boxes, ShieldCheck, CheckCircle2, Paperclip,
  MessageSquare, Activity, ChevronRight,
} from 'lucide-vue-next';
import {
  etapaCor, etapaLabel, esteiraLabel, detalheSolicitacao,
  type Solicitacao, type ParteRelacionada, type ContratoAtivo,
} from '../data/operacaoData';
import { CopyButton, TabPill } from './detail-tabs/shared';
import DadosGeraisTab from './detail-tabs/DadosGeraisTab.vue';
import AtivosTab from './detail-tabs/AtivosTab.vue';
import GarantiasTab from './detail-tabs/GarantiasTab.vue';
import { ValidacoesTab, ValidacoesFullView } from './detail-tabs/ValidacoesTab';
import AnexosTab from './detail-tabs/AnexosTab.vue';
import AtaTab from './detail-tabs/AtaTab.vue';
import HistoricoTab from './detail-tabs/HistoricoTab.vue';
import ParteRelacionadaModal from '../components/modals/ParteRelacionadaModal.vue';
import AdicionarContratoModal from '../components/modals/AdicionarContratoModal.vue';
import { ActionMenu, RejectModal } from './solicitacao-detail';

const props = defineProps<{ solicitacao: Solicitacao }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'gerais' | 'ativos' | 'garantias' | 'validacoes' | 'anexos' | 'ata' | 'historico';
type SubView = null | 'validacoes-detalhe';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'gerais', label: 'Dados Gerais', icon: FileText },
  { key: 'ativos', label: 'Ativos', icon: Boxes },
  { key: 'garantias', label: 'Garantias', icon: ShieldCheck },
  { key: 'validacoes', label: 'Validações', icon: CheckCircle2 },
  { key: 'anexos', label: 'Anexos', icon: Paperclip },
  { key: 'ata', label: 'Ata de Deliberação', icon: MessageSquare },
  { key: 'historico', label: 'Histórico', icon: Activity },
];

const tab = ref<Tab>('gerais');
const subView = ref<SubView>(null);
const confirmReject = ref(false);
const det = reactive(detalheSolicitacao(props.solicitacao));
const showParteModal = ref(false);
const showContratoModal = ref(false);
const cor = computed(() => etapaCor(props.solicitacao.etapa));

function handleAddParte(parte: ParteRelacionada) {
  det.partes.push(parte);
  showParteModal.value = false;
}

function handleAddContrato(ativo: ContratoAtivo) {
  det.ativos.push(ativo);
  showContratoModal.value = false;
}
</script>

<template>
  <ValidacoesFullView
    v-if="subView === 'validacoes-detalhe'"
    :det="det"
    :solicitacao-id="solicitacao.id"
    @back="subView = null"
  />
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Header + barra de ações -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Solicitação de Operação
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          {{ solicitacao.id }}
          <CopyButton :value="solicitacao.id" />
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${cor} 14%, transparent)`,
              color: cor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ etapaLabel(solicitacao.etapa).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ solicitacao.cedente }} · {{ solicitacao.tipoContrato }} · {{ esteiraLabel(solicitacao.esteira) }}
        </p>
      </div>

      <!-- Ação primária + menu overflow -->
      <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
        <button class="flex items-center primary-action" style="gap: 8px; height: 44px; padding: 0 20px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; box-shadow: 0 10px 24px -10px rgba(8, 60, 74, 0.45); transition: background var(--duration-base)">
          ANÁLISE OPERAÇÕES
          <ChevronRight :size="16" />
        </button>
        <ActionMenu @reject="confirmReject = true" />
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center" style="gap: 4px; padding: 4px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); flex-wrap: wrap">
      <TabPill v-for="t in TABS" :key="t.key" :active="tab === t.key" :icon="t.icon" @click="tab = t.key">
        {{ t.label }}
      </TabPill>
    </div>

    <!-- Conteúdo -->
    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DadosGeraisTab v-if="tab === 'gerais'" :s="solicitacao" :det="det" @add-parte="showParteModal = true" />
      <AtivosTab v-else-if="tab === 'ativos'" :det="det" @add-contrato="showContratoModal = true" />
      <GarantiasTab v-else-if="tab === 'garantias'" :det="det" />
      <ValidacoesTab v-else-if="tab === 'validacoes'" :det="det" @open-full-view="subView = 'validacoes-detalhe'" />
      <AnexosTab v-else-if="tab === 'anexos'" :det="det" />
      <AtaTab v-else-if="tab === 'ata'" />
      <HistoricoTab v-else-if="tab === 'historico'" :det="det" />
    </div>

    <RejectModal v-if="confirmReject" :id="solicitacao.id" @close="confirmReject = false" />

    <ParteRelacionadaModal
      v-if="showParteModal"
      @close="showParteModal = false"
      @create="handleAddParte"
    />

    <AdicionarContratoModal
      v-if="showContratoModal"
      @close="showContratoModal = false"
      :valor-operacao="solicitacao.valor"
      :tipo-calculo="solicitacao.tipoTaxa ?? 'Pré-fixado'"
      @create="handleAddContrato"
    />
  </div>
</template>

<style scoped>
.primary-action:hover {
  background: var(--action-primary-bg-hover);
}
</style>
