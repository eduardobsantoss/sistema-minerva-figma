<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Component } from 'vue';
import {
  ArrowLeft, FileText, Boxes, ShieldCheck, CheckCircle2, Paperclip,
  MessageSquare, Activity, ChevronRight,
} from 'lucide-vue-next';
import {
  etapaCor, etapaLabel, esteiraLabel, detalheSolicitacao,
  type Solicitacao, type ParteRelacionada, type ContratoAtivo, type Esteira, type ItemValidacao,
} from '../data/operacaoData';
import { CONTAS_BANCARIAS_MOCK } from '../data/minutaData';
import { enriquecerContratoAtivo } from '../data/ativoData';
import { CopyButton } from './detail-tabs/shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DadosGeraisTab from './detail-tabs/DadosGeraisTab.vue';
import AtivosTab from './detail-tabs/AtivosTab.vue';
import GarantiasTab from './detail-tabs/GarantiasTab.vue';
import { ValidacoesTab, ValidacoesFullView } from './detail-tabs/ValidacoesTab';
import AnexosTab from './detail-tabs/AnexosTab.vue';
import AtaTab from './detail-tabs/AtaTab.vue';
import HistoricoTab from './detail-tabs/HistoricoTab.vue';
import ParteRelacionadaModal from '../components/modals/ParteRelacionadaModal.vue';
import AdicionarContratoModal from '../components/modals/AdicionarContratoModal.vue';
import VincularAtivosModal from '../components/modals/VincularAtivosModal.vue';
import ConfirmarTituloModal from '../components/modals/ConfirmarTituloModal.vue';
import ProrrogarVencimentoModal from '../components/modals/ProrrogarVencimentoModal.vue';
import AtualizarCessaoModal from '../components/modals/AtualizarCessaoModal.vue';
import GerarTermoCessaoModal from '../components/modals/GerarTermoCessaoModal.vue';
import GerarCnabModal from '../components/modals/GerarCnabModal.vue';
import VincularVeiculoOperacaoModal from '../components/modals/VincularVeiculoOperacaoModal.vue';
import TransferirSolicitacaoModal from '../components/modals/TransferirSolicitacaoModal.vue';
import TransferirContaBancariaModal from '../components/modals/TransferirContaBancariaModal.vue';
import MesclarAtivosPedidosModal from '../components/modals/MesclarAtivosPedidosModal.vue';
import GerarBoletimSubscricaoModal from '../components/modals/GerarBoletimSubscricaoModal.vue';
import GerarTermoEndossoModal from '../components/modals/GerarTermoEndossoModal.vue';
import ControleOperacoesModal from '../components/modals/ControleOperacoesModal.vue';
import MensagensValidacaoModal from '../components/modals/MensagensValidacaoModal.vue';
import InserirEvidenciaModal from '../components/modals/InserirEvidenciaModal.vue';
import DetalheEvidenciaModal from '../components/modals/DetalheEvidenciaModal.vue';
import DetalheValidacaoModal from '../components/modals/DetalheValidacaoModal.vue';
import { ActionMenu, RejectModal } from './solicitacao-detail';
import { ParteRelacionadaDetailView } from './detail-tabs/parte-relacionada';
import { AtivoDetailView } from './detail-tabs/ativo';

const props = defineProps<{ solicitacao: Solicitacao }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'gerais' | 'ativos' | 'garantias' | 'validacoes' | 'anexos' | 'ata' | 'historico';
type SubView = null | 'validacoes-detalhe' | 'parte-detalhe' | 'ativo-detalhe';

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
const showVincularModal = ref(false);
const showConfirmarModal = ref(false);
const showProrrogarModal = ref(false);
const showAtualizarCessao = ref(false);
const showGerarTermo = ref(false);
const showGerarCnab = ref(false);
const showVincularVeiculo = ref(false);
const showTransferirSolicitacao = ref(false);
const showTransferirConta = ref(false);
const showMesclarAtivos = ref(false);
const showBoletimSubscricao = ref(false);
const showTermoEndosso = ref(false);
const showControleOperacoes = ref(false);
const showMensagensValidacao = ref(false);
const showInserirEvidencia = ref(false);
const showDetalheEvidencia = ref(false);
const showDetalheValidacao = ref(false);
const validacaoEvidenciaCtx = ref<ItemValidacao | null>(null);
const validacaoDetalheCtx = ref<ItemValidacao | null>(null);
const validacaoOperacoesCtx = ref<ItemValidacao | null>(null);
const validacaoMensagensCtx = ref<ItemValidacao | null>(null);
const selectedParte = ref<ParteRelacionada | null>(null);
const selectedAtivo = ref<ContratoAtivo | null>(null);
const ativosAcao = ref<ContratoAtivo[]>([]);
const cor = computed(() => etapaCor(props.solicitacao.etapa));

function findValidacao(titulo: string) {
  return det.validacoes.find((v) => v.titulo === titulo);
}

function openInserirEvidencia(v: ItemValidacao) {
  validacaoEvidenciaCtx.value = v;
  showInserirEvidencia.value = true;
}

function openVerEvidencia(v: ItemValidacao) {
  validacaoEvidenciaCtx.value = v;
  showDetalheEvidencia.value = true;
}

function openVerDetalhes(v: ItemValidacao) {
  validacaoDetalheCtx.value = v;
  showDetalheValidacao.value = true;
}

function openControleOperacoes(v: ItemValidacao) {
  validacaoOperacoesCtx.value = v;
  showControleOperacoes.value = true;
}

function openMensagensValidacao(v: ItemValidacao) {
  validacaoMensagensCtx.value = v;
  showMensagensValidacao.value = true;
}

function handleAutorizar(v: ItemValidacao) {
  const item = findValidacao(v.titulo);
  if (!item) return;
  if (item.evidencia) {
    item.status = 'OK';
    return;
  }
  openInserirEvidencia(item);
}

function onInserirEvidencia(data: { arquivo: string; descricao: string }) {
  const item = validacaoEvidenciaCtx.value ? findValidacao(validacaoEvidenciaCtx.value.titulo) : null;
  if (item) {
    const now = new Date();
    const dataStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    item.evidencia = {
      arquivo: data.arquivo,
      descricao: data.descricao,
      autor: 'Usuário atual',
      data: dataStr,
    };
  }
  showInserirEvidencia.value = false;
  validacaoEvidenciaCtx.value = null;
}

function handleAddParte(parte: ParteRelacionada) {
  det.partes.push(parte);
  showParteModal.value = false;
}

function openParte(parte: ParteRelacionada) {
  selectedParte.value = parte;
  subView.value = 'parte-detalhe';
}

function closeParteDetail() {
  subView.value = null;
  selectedParte.value = null;
}

function openAtivo(ativo: ContratoAtivo) {
  selectedAtivo.value = ativo;
  subView.value = 'ativo-detalhe';
}

function closeAtivoDetail() {
  subView.value = null;
  selectedAtivo.value = null;
}

function handleAddContrato(ativo: Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>) {
  det.ativos.push(enriquecerContratoAtivo(ativo));
  showContratoModal.value = false;
}

function handleUpdateValor(valor: number) {
  const fee = props.solicitacao.fee ?? 2;
  props.solicitacao.valor = valor;
  props.solicitacao.valorFee = valor * (fee / 100);
}

function handleUpdateEsteira(esteira: Esteira) {
  props.solicitacao.esteira = esteira;
}

function handleUpdateQuitacao(value: boolean) {
  props.solicitacao.quitacaoVencidos = value;
}

function nowHistorico(): string {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function pushHistorico(acao: string) {
  det.historico.unshift({ data: nowHistorico(), autor: 'Usuário atual', acao });
}

function onVincularVeiculo(veiculo: string) {
  props.solicitacao.veiculo = veiculo;
  pushHistorico(`vinculou o pedido de operação ao ${veiculo}`);
}

function onTransferirSolicitacao(veiculo: string) {
  const anterior = props.solicitacao.veiculo || '—';
  props.solicitacao.veiculo = veiculo;
  pushHistorico(`transferiu a solicitação de ${anterior} para ${veiculo}`);
}

function onTransferirConta(payload: { id: string; label: string }) {
  const conta = CONTAS_BANCARIAS_MOCK.find((c) => c.id === payload.id);
  if (conta) {
    props.solicitacao.banco = conta.banco;
    props.solicitacao.agencia = conta.digitoAgencia
      ? `${conta.agencia}-${conta.digitoAgencia}`
      : conta.agencia;
    props.solicitacao.conta = conta.digitoConta ? `${conta.conta}-${conta.digitoConta}` : conta.conta;
  }
  pushHistorico(`transferiu a conta bancária do pedido para ${payload.label}`);
}

function onMesclarAtivos(payload: {
  pedidoDestinoId: string;
  moverTodos: boolean;
  ativoIds: string[];
}) {
  const ids = new Set(payload.ativoIds);
  const qtd = ids.size;
  det.ativos = det.ativos.filter((a) => !ids.has(a.id));
  const modo = payload.moverTodos ? 'todos os ativos' : `${qtd} ativo(s)`;
  pushHistorico(`mesclou ${modo} para o pedido ${payload.pedidoDestinoId}`);
}

function onGerarBoletim() {
  pushHistorico('gerou o Boletim de Subscrição');
}

function onGerarTermoEndosso() {
  pushHistorico('gerou o Termo de Endosso');
}

function handleVincular(ativos: ContratoAtivo[]) {
  det.ativos.push(...ativos);
  showVincularModal.value = false;
}

function handleRemover(ids: string[]) {
  det.ativos = det.ativos.filter((a) => !ids.includes(a.id));
}

function handleProrrogar(ids: string[]) {
  ativosAcao.value = det.ativos.filter((a) => ids.includes(a.id));
  showProrrogarModal.value = true;
}

function handleConfirmar(ids: string[]) {
  ativosAcao.value = det.ativos.filter((a) => ids.includes(a.id));
  showConfirmarModal.value = true;
}

function onConfirmarTitulo(data: { status: string; data: string; observacao: string }) {
  for (const a of ativosAcao.value) {
    const idx = det.ativos.findIndex((x) => x.id === a.id);
    if (idx >= 0) {
      det.ativos[idx] = {
        ...det.ativos[idx],
        confirmacao: data.status as ContratoAtivo['confirmacao'],
        confirmacoes: [
          ...det.ativos[idx].confirmacoes,
          { observacao: data.observacao, confirmadoPor: 'Usuário atual', data: data.data || '—', status: data.status as ContratoAtivo['confirmacao'] },
        ],
      };
    }
  }
  showConfirmarModal.value = false;
  ativosAcao.value = [];
}

function onProrrogarVencimento(data: { novoVencimento: string; motivo: string }) {
  for (const a of ativosAcao.value) {
    const idx = det.ativos.findIndex((x) => x.id === a.id);
    if (idx >= 0) {
      det.ativos[idx] = { ...det.ativos[idx], vencimento: data.novoVencimento };
    }
  }
  showProrrogarModal.value = false;
  ativosAcao.value = [];
}
</script>

<template>
  <ValidacoesFullView
    v-if="subView === 'validacoes-detalhe'"
    :det="det"
    :solicitacao-id="solicitacao.id"
    @back="subView = null"
    @inserir-evidencia="openInserirEvidencia"
    @ver-evidencia="openVerEvidencia"
    @autorizar="handleAutorizar"
    @ver-detalhes="openVerDetalhes"
    @habilitar-operacoes="openControleOperacoes"
    @mensagens="openMensagensValidacao"
  />
  <ParteRelacionadaDetailView
    v-else-if="subView === 'parte-detalhe' && selectedParte"
    :parte="selectedParte"
    :solicitacao-id="solicitacao.id"
    @back="closeParteDetail"
  />
  <AtivoDetailView
    v-else-if="subView === 'ativo-detalhe' && selectedAtivo"
    :ativo="selectedAtivo"
    :solicitacao-id="solicitacao.id"
    @back="closeAtivoDetail"
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
        <button
          class="flex items-center btn-animated btn-primary"
          style="gap: 8px; height: 44px; padding: 0 20px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; box-shadow: 0 10px 24px -10px rgba(8, 60, 74, 0.45)"
        >
          ANÁLISE OPERAÇÕES
          <ChevronRight :size="16" />
        </button>
        <ActionMenu
          :tipo-contrato="solicitacao.tipoContrato"
          @reject="confirmReject = true"
          @vincular-veiculo="showVincularVeiculo = true"
          @transferir-solicitacao="showTransferirSolicitacao = true"
          @atualizar-cessao="showAtualizarCessao = true"
          @gerar-termo-cessao="showGerarTermo = true"
          @gerar-cnab="showGerarCnab = true"
          @mesclar-ativos="showMesclarAtivos = true"
          @transferir-conta="showTransferirConta = true"
          @gerar-boletim-subscricao="showBoletimSubscricao = true"
          @gerar-termo-endosso="showTermoEndosso = true"
        />
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <!-- Conteúdo -->
    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DadosGeraisTab
        v-if="tab === 'gerais'"
        :s="solicitacao"
        :det="det"
        @add-parte="showParteModal = true"
        @open-parte="openParte"
        @update-valor="handleUpdateValor"
        @update-esteira="handleUpdateEsteira"
        @update-quitacao="handleUpdateQuitacao"
      />
      <AtivosTab
        v-else-if="tab === 'ativos'"
        :det="det"
        @add-contrato="showContratoModal = true"
        @open-ativo="openAtivo"
        @vincular="showVincularModal = true"
        @exportar="() => {}"
        @remover="handleRemover"
        @prorrogar="handleProrrogar"
        @confirmar="handleConfirmar"
      />
      <GarantiasTab v-else-if="tab === 'garantias'" :det="det" />
      <ValidacoesTab
        v-else-if="tab === 'validacoes'"
        :det="det"
        @open-full-view="subView = 'validacoes-detalhe'"
        @inserir-evidencia="openInserirEvidencia"
        @ver-evidencia="openVerEvidencia"
        @autorizar="handleAutorizar"
        @ver-detalhes="openVerDetalhes"
        @habilitar-operacoes="openControleOperacoes"
        @mensagens="openMensagensValidacao"
      />
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
      :partes="det.partes"
      :unidade-negocio="solicitacao.unidadeNegocio ?? 'Ceres Investimentos'"
      @create="handleAddContrato"
    />

    <VincularAtivosModal
      v-if="showVincularModal"
      @close="showVincularModal = false"
      @vincular="handleVincular"
    />

    <ConfirmarTituloModal
      v-if="showConfirmarModal"
      :ativos="ativosAcao"
      @close="showConfirmarModal = false"
      @confirm="onConfirmarTitulo"
    />

    <ProrrogarVencimentoModal
      v-if="showProrrogarModal"
      :ativos="ativosAcao"
      @close="showProrrogarModal = false"
      @confirm="onProrrogarVencimento"
    />

    <AtualizarCessaoModal
      v-if="showAtualizarCessao"
      @close="showAtualizarCessao = false"
    />

    <GerarTermoCessaoModal
      v-if="showGerarTermo"
      @close="showGerarTermo = false"
    />

    <GerarCnabModal
      v-if="showGerarCnab"
      @close="showGerarCnab = false"
    />

    <VincularVeiculoOperacaoModal
      v-if="showVincularVeiculo"
      @close="showVincularVeiculo = false"
      @confirm="onVincularVeiculo"
    />

    <TransferirSolicitacaoModal
      v-if="showTransferirSolicitacao"
      :veiculo-atual="solicitacao.veiculo"
      @close="showTransferirSolicitacao = false"
      @confirm="onTransferirSolicitacao"
    />

    <TransferirContaBancariaModal
      v-if="showTransferirConta"
      @close="showTransferirConta = false"
      @confirm="onTransferirConta"
    />

    <MesclarAtivosPedidosModal
      v-if="showMesclarAtivos"
      :pedido-origem-id="solicitacao.id"
      :ativos="det.ativos"
      @close="showMesclarAtivos = false"
      @confirm="onMesclarAtivos"
    />

    <GerarBoletimSubscricaoModal
      v-if="showBoletimSubscricao"
      :solicitacao="solicitacao"
      @close="showBoletimSubscricao = false"
      @confirm="onGerarBoletim"
    />

    <GerarTermoEndossoModal
      v-if="showTermoEndosso"
      :solicitacao="solicitacao"
      @close="showTermoEndosso = false"
      @confirm="onGerarTermoEndosso"
    />

    <InserirEvidenciaModal
      v-if="showInserirEvidencia && validacaoEvidenciaCtx"
      :titulo-validacao="validacaoEvidenciaCtx.titulo"
      @close="showInserirEvidencia = false; validacaoEvidenciaCtx = null"
      @confirm="onInserirEvidencia"
    />

    <DetalheEvidenciaModal
      v-if="showDetalheEvidencia && validacaoEvidenciaCtx?.evidencia"
      :titulo-validacao="validacaoEvidenciaCtx.titulo"
      :evidencia="validacaoEvidenciaCtx.evidencia"
      @close="showDetalheEvidencia = false; validacaoEvidenciaCtx = null"
    />

    <DetalheValidacaoModal
      v-if="showDetalheValidacao && validacaoDetalheCtx"
      :v="validacaoDetalheCtx"
      @close="showDetalheValidacao = false; validacaoDetalheCtx = null"
    />

    <ControleOperacoesModal
      v-if="showControleOperacoes && validacaoOperacoesCtx"
      :validacao="validacaoOperacoesCtx"
      @close="showControleOperacoes = false; validacaoOperacoesCtx = null"
    />

    <MensagensValidacaoModal
      v-if="showMensagensValidacao && validacaoMensagensCtx"
      :validacao="validacaoMensagensCtx"
      @close="showMensagensValidacao = false; validacaoMensagensCtx = null"
    />
  </div>
</template>
