<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue';
import {
  BadgeCheck,
  BellRing,
  CalendarClock,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  MessageSquarePlus,
  Receipt,
  RefreshCw,
  Trash2,
  Wallet,
} from 'lucide-vue-next';
import ConfirmTypedActionModal from '@/components/ui/ConfirmTypedActionModal.vue';
import ObservacaoCobrancaModal from './ObservacaoCobrancaModal.vue';
import { useBackgroundReport } from '@/composables/useBackgroundReport';
import AcoesCercModal, { type AcaoCerc } from './AcoesCercModal.vue';
import AlterarSituacaoModal from './AlterarSituacaoModal.vue';
import BaixarArquivosModal from './BaixarArquivosModal.vue';
import PagamentoLoteModal from './PagamentoLoteModal.vue';
import ProrrogarTitulosModal from './ProrrogarTitulosModal.vue';
import RegistrarConfirmacaoModal from './RegistrarConfirmacaoModal.vue';
import TitulosMotivoModal from './TitulosMotivoModal.vue';
import type { TituloSelecionado } from './types';

const props = withDefaults(
  defineProps<{
    titulos: TituloSelecionado[];
    /** padrao: menu completo · cobranca: aba Títulos da Cobrança · boleto: fila de títulos aptos para boletar. */
    modo?: 'padrao' | 'cobranca' | 'boleto';
  }>(),
  { modo: 'padrao' },
);

const emit = defineEmits<{
  boletoGerado: [ids: string[]];
  notificacoesDisparadas: [ids: string[]];
  observacaoInserida: [ids: string[], texto: string];
}>();

type Acao =
  | AcaoCerc
  | 'cerc'
  | 'situacao'
  | 'pagamento'
  | 'prorrogar'
  | 'arquivos'
  | 'confirmacao'
  | 'boleto'
  | 'excluir'
  | 'relatorio-selecionados'
  | 'relatorios-especificos'
  | 'disparar-notificacoes'
  | 'observacao-cobranca';

const menuOpen = ref(false);
const acao = ref<Acao | null>(null);
const titulosAcao = ref<TituloSelecionado[]>([]);
const avisoCerc = ref('');
const rootRef = ref<HTMLElement | null>(null);
const { enqueueReport } = useBackgroundReport();

interface ItemMenu {
  key: Acao;
  label: string;
  icon: Component;
  disabled?: boolean;
  hint?: string;
}

const ITENS_PADRAO: ItemMenu[] = [
  { key: 'cerc', label: 'Ações CERC', icon: Landmark },
  { key: 'situacao', label: 'Alterar situação', icon: RefreshCw },
  { key: 'pagamento', label: 'Pagamento em lote', icon: Wallet },
  { key: 'prorrogar', label: 'Prorrogar títulos', icon: CalendarClock },
  { key: 'arquivos', label: 'Baixar arquivos', icon: Download },
  { key: 'confirmacao', label: 'Registrar confirmação', icon: BadgeCheck },
  { key: 'boleto', label: 'Gerar boleto', icon: Receipt },
];

const ITENS_COBRANCA: ItemMenu[] = [
  { key: 'relatorio-selecionados', label: 'Relatório / selecionados', icon: FileSpreadsheet },
  {
    key: 'relatorios-especificos',
    label: 'Gerar relatórios específicos',
    icon: FileText,
    disabled: true,
    hint: 'Indisponível',
  },
  { key: 'disparar-notificacoes', label: 'Disparar notificações', icon: BellRing },
  { key: 'observacao-cobranca', label: 'Inserir observação de cobrança', icon: MessageSquarePlus },
];

const ITENS_BOLETO: ItemMenu[] = [{ key: 'boleto', label: 'Gerar boleto', icon: Receipt }];

const itens = computed<ItemMenu[]>(() =>
  props.modo === 'cobranca' ? ITENS_COBRANCA : props.modo === 'boleto' ? ITENS_BOLETO : ITENS_PADRAO,
);

const mostraExcluir = computed(() => props.modo === 'padrao');

const valorTotalSelecionado = computed(() =>
  props.titulos.reduce((soma, t) => soma + (t.valorAberto ?? t.valor), 0),
);

const instrucaoNotificacoes = computed(() => {
  const n = props.titulos.length;
  return `Deseja disparar notificações para ${n} ${n === 1 ? 'título' : 'títulos'}? Digite o código abaixo para confirmar.`;
});

function brl(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function csvCampo(valor: string | number) {
  return `"${String(valor).replace(/"/g, '""')}"`;
}

function gerarRelatorioSelecionados() {
  const lista = props.titulos;
  enqueueReport({
    reportName: 'Relatório de títulos selecionados',
    buildFile: () => {
      const cabecalho = ['Lastro', 'Número', 'Valor', 'Valor em aberto', 'Vencimento'];
      const linhas = lista.map((t) =>
        [t.lastro, t.numero, brl(t.valor), t.valorAberto == null ? '' : brl(t.valorAberto), t.vencimento]
          .map(csvCampo)
          .join(';'),
      );
      return {
        blob: new Blob(['\uFEFF' + [cabecalho.join(';'), ...linhas].join('\n')], { type: 'text/csv;charset=utf-8;' }),
        filename: 'titulos-selecionados.csv',
      };
    },
  });
}

const contagem = computed(() => {
  const n = props.titulos.length;
  return n === 1 ? '1 título selecionado' : `${n} títulos selecionados`;
});

const instrucaoExcluir = computed(() => {
  const n = props.titulos.length;
  return n === 1
    ? 'Digite o código abaixo para confirmar a exclusão do título'
    : `Digite o código abaixo para confirmar a exclusão dos ${n} títulos`;
});

const instrucaoBoleto = computed(() => {
  const n = props.titulos.length;
  return `Deseja gerar boletos para ${n} título(s), totalizando ${brl(valorTotalSelecionado.value)}? Digite o código abaixo para confirmar.`;
});

const confirmacaoCerc = computed(() => {
  const n = titulosAcao.value.length;
  if (acao.value === 'registrar') {
    return n === 1
      ? 'Digite o código abaixo para confirmar o registro do título'
      : `Digite o código abaixo para confirmar o registro dos ${n} títulos elegíveis`;
  }
  return n === 1
    ? 'Digite o código abaixo para confirmar a atualização do registro'
    : `Digite o código abaixo para confirmar a atualização dos ${n} títulos elegíveis`;
});

const rotuloContinuar = computed(() => {
  const n = titulosAcao.value.length;
  return `Continuar com ${n} ${n === 1 ? 'título' : 'títulos'}`;
});

function rotuloPorQuantidade(singular: string, plural: string, lista = props.titulos) {
  return lista.length === 1 ? singular : plural;
}

const rotuloRegistrarCerc = computed(() =>
  rotuloPorQuantidade('Registrar título', 'Registrar títulos', titulosAcao.value),
);
const rotuloAtualizarCerc = computed(() =>
  rotuloPorQuantidade('Atualizar registro', 'Atualizar registros', titulosAcao.value),
);
const rotuloBaixarRegistro = computed(() =>
  rotuloPorQuantidade('Baixar título', 'Baixar títulos', titulosAcao.value),
);
const rotuloDesregistrar = computed(() =>
  rotuloPorQuantidade('Desregistrar título', 'Desregistrar títulos', titulosAcao.value),
);
const rotuloBoleto = 'Gerar boleto';
const rotuloExcluir = computed(() => rotuloPorQuantidade('Excluir título', 'Excluir títulos'));

function abrir(key: Acao) {
  menuOpen.value = false;
  if (key === 'relatorio-selecionados') {
    gerarRelatorioSelecionados();
    return;
  }
  titulosAcao.value = props.titulos;
  avisoCerc.value = '';
  acao.value = key;
}

function abrirCerc(proxima: AcaoCerc, elegiveis: TituloSelecionado[], fora: TituloSelecionado[]) {
  titulosAcao.value = elegiveis;
  avisoCerc.value = fora.length
    ? `${fora.length === 1 ? '1 título não entra' : `${fora.length} títulos não entram`} nesta ação. Lastros fora da regra: ${fora.map((titulo) => titulo.lastro || titulo.numero).join(', ')}.`
    : '';
  acao.value = proxima;
}

function confirmarBoleto() {
  const ids = props.titulos.map((t) => t.id);
  fechar();
  emit('boletoGerado', ids);
}

function confirmarNotificacoes() {
  const ids = props.titulos.map((t) => t.id);
  fechar();
  emit('notificacoesDisparadas', ids);
}

function confirmarObservacao(texto: string) {
  const ids = props.titulos.map((t) => t.id);
  fechar();
  emit('observacaoInserida', ids, texto);
}

function fechar() {
  acao.value = null;
  avisoCerc.value = '';
  titulosAcao.value = [];
}

function onDocClick(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) menuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', onDocClick));
onUnmounted(() => document.removeEventListener('mousedown', onDocClick));
</script>

<template>
  <div
    ref="rootRef"
    class="flex items-center justify-between"
    style="
      position: sticky;
      bottom: 0;
      z-index: 40;
      gap: 16px;
      margin-top: 8px;
      padding: 12px 16px;
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
    "
  >
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      {{ contagem }}
    </div>

    <div style="position: relative">
      <div
        v-if="menuOpen"
        style="
          position: absolute;
          right: 0;
          bottom: calc(100% + 8px);
          z-index: 41;
          min-width: 260px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 6px;
        "
      >
        <button
          v-for="item in itens"
          :key="item.key"
          type="button"
          class="lote-menu-item"
          :disabled="item.disabled"
          @click="!item.disabled && abrir(item.key)"
        >
          <component :is="item.icon" :size="16" class="lote-menu-icon" />
          <span style="flex: 1; white-space: nowrap">{{ item.label }}</span>
          <span v-if="item.hint" class="lote-menu-hint">{{ item.hint }}</span>
        </button>
        <template v-if="mostraExcluir">
          <div style="height: 1px; background: var(--border-default); margin: 6px 8px" />
          <button type="button" class="lote-menu-item lote-menu-danger" @click="abrir('excluir')">
            <Trash2 :size="16" />
            Excluir títulos
          </button>
        </template>
      </div>

      <button type="button" class="lote-acoes" @click="menuOpen = !menuOpen">
        Ações
        <ChevronUp :size="16" :style="{ transform: menuOpen ? 'none' : 'rotate(180deg)', transition: 'transform var(--duration-fast)' }" />
      </button>
    </div>
  </div>

  <AcoesCercModal
    v-if="acao === 'cerc'"
    :titulos="titulos"
    @close="fechar"
    @prosseguir="abrirCerc"
  />
  <ConfirmTypedActionModal
    v-if="acao === 'registrar' || acao === 'atualizar'"
    persistent
    spread-footer
    :title="acao === 'registrar' ? 'Registrar títulos' : 'Atualizar registros'"
    :subtitle="acao === 'registrar' ? 'Confirmação do registro na CERC' : 'Confirmação da atualização na CERC'"
    :aviso="avisoCerc"
    :instruction="confirmacaoCerc"
    :confirm-phrase="acao === 'registrar' ? 'REGISTRAR/TÍTULOS' : 'ATUALIZAR/REGISTROS'"
    :confirm-label="avisoCerc ? rotuloContinuar : acao === 'registrar' ? rotuloRegistrarCerc : rotuloAtualizarCerc"
    @close="fechar"
    @confirm="fechar"
  />
  <TitulosMotivoModal
    v-if="acao === 'baixa-registro'"
    title="Baixar títulos"
    subtitle="Motivo da baixa e títulos selecionados"
    :aviso="avisoCerc"
    motivo-label="Motivo da baixa"
    :motivos="['Pago', 'Recompra', 'Liberação de garantia']"
    :confirm-label="avisoCerc ? rotuloContinuar : rotuloBaixarRegistro"
    :titulos="titulosAcao"
    @close="fechar"
  />
  <TitulosMotivoModal
    v-if="acao === 'desregistro'"
    title="Desregistrar títulos"
    subtitle="Motivo do desregistro e títulos selecionados"
    :aviso="avisoCerc"
    motivo-label="Motivo do desregistro"
    :motivos="['Cancelamento', 'Operação não realizada']"
    :confirm-label="avisoCerc ? rotuloContinuar : rotuloDesregistrar"
    :titulos="titulosAcao"
    @close="fechar"
  />
  <AlterarSituacaoModal v-if="acao === 'situacao'" :quantidade="titulos.length" @close="fechar" />
  <PagamentoLoteModal v-if="acao === 'pagamento'" :titulos="titulos" @close="fechar" />
  <ProrrogarTitulosModal v-if="acao === 'prorrogar'" :titulos="titulos" @close="fechar" />
  <BaixarArquivosModal v-if="acao === 'arquivos'" @close="fechar" />
  <RegistrarConfirmacaoModal v-if="acao === 'confirmacao'" :quantidade="titulos.length" @close="fechar" />
  <ConfirmTypedActionModal
    v-if="acao === 'boleto'"
    persistent
    spread-footer
    title="Gerar boleto"
    subtitle="Confirmação da geração de boleto"
    :instruction="instrucaoBoleto"
    confirm-phrase="GERAR-BOLETO"
    :confirm-label="rotuloBoleto"
    @close="fechar"
    @confirm="confirmarBoleto"
  />
  <ConfirmTypedActionModal
    v-if="acao === 'disparar-notificacoes'"
    persistent
    spread-footer
    title="Disparar notificações"
    subtitle="Confirmação do disparo para os títulos selecionados"
    :instruction="instrucaoNotificacoes"
    confirm-phrase="DISPARAR-NOTIFICACOES"
    confirm-label="Disparar notificações"
    @close="fechar"
    @confirm="confirmarNotificacoes"
  />
  <ObservacaoCobrancaModal
    v-if="acao === 'observacao-cobranca'"
    :quantidade="titulos.length"
    @close="fechar"
    @confirm="confirmarObservacao"
  />
  <ConfirmTypedActionModal
    v-if="acao === 'excluir'"
    persistent
    title="Excluir títulos"
    subtitle="Confirmação da exclusão dos títulos selecionados"
    :instruction="instrucaoExcluir"
    confirm-phrase="EXCLUIR/TÍTULOS"
    :confirm-label="rotuloExcluir"
    variant="danger"
    spread-footer
    @close="fechar"
    @confirm="fechar"
  />
</template>

<style scoped>
.lote-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
}
.lote-acoes:hover {
  background: var(--action-primary-bg-hover);
}
.lote-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-default);
}
.lote-menu-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}
.lote-menu-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.lote-menu-item:disabled {
  cursor: not-allowed;
  color: var(--text-disabled);
}
.lote-menu-item:disabled .lote-menu-icon {
  color: var(--text-disabled);
}
.lote-menu-hint {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.lote-menu-danger {
  color: var(--action-danger-text-only);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
