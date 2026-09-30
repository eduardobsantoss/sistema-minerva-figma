<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue';
import {
  BadgeCheck,
  ChevronUp,
  Download,
  Landmark,
  Receipt,
  RefreshCw,
  Trash2,
  Wallet,
} from 'lucide-vue-next';
import ConfirmTypedActionModal from '@/components/ui/ConfirmTypedActionModal.vue';
import AcoesCercModal, { type AcaoCerc } from './AcoesCercModal.vue';
import AlterarSituacaoModal from './AlterarSituacaoModal.vue';
import BaixarArquivosModal from './BaixarArquivosModal.vue';
import PagamentoLoteModal from './PagamentoLoteModal.vue';
import RegistrarConfirmacaoModal from './RegistrarConfirmacaoModal.vue';
import TitulosMotivoModal from './TitulosMotivoModal.vue';
import type { TituloSelecionado } from './types';

const props = defineProps<{ titulos: TituloSelecionado[] }>();

type Acao = AcaoCerc | 'cerc' | 'situacao' | 'pagamento' | 'arquivos' | 'confirmacao' | 'boleto' | 'excluir';

const menuOpen = ref(false);
const acao = ref<Acao | null>(null);
const titulosAcao = ref<TituloSelecionado[]>([]);
const avisoCerc = ref('');
const rootRef = ref<HTMLElement | null>(null);

const itens: { key: Acao; label: string; icon: Component; danger?: boolean }[] = [
  { key: 'cerc', label: 'Ações CERC', icon: Landmark },
  { key: 'situacao', label: 'Alterar situação', icon: RefreshCw },
  { key: 'pagamento', label: 'Pagamento em lote', icon: Wallet },
  { key: 'arquivos', label: 'Baixar arquivos', icon: Download },
  { key: 'confirmacao', label: 'Registrar confirmação', icon: BadgeCheck },
  { key: 'boleto', label: 'Gerar boleto', icon: Receipt },
];

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
  return n === 1
    ? 'Digite o código abaixo para confirmar a geração do boleto'
    : `Digite o código abaixo para confirmar a geração dos ${n} boletos`;
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

function abrir(key: Acao) {
  menuOpen.value = false;
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
          @click="abrir(item.key)"
        >
          <component :is="item.icon" :size="16" class="lote-menu-icon" />
          {{ item.label }}
        </button>
        <div style="height: 1px; background: var(--border-default); margin: 6px 8px" />
        <button type="button" class="lote-menu-item lote-menu-danger" @click="abrir('excluir')">
          <Trash2 :size="16" />
          Excluir títulos
        </button>
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
    :title="acao === 'registrar' ? 'Registrar títulos' : 'Atualizar registros'"
    :subtitle="acao === 'registrar' ? 'Confirmação do registro na CERC' : 'Confirmação da atualização na CERC'"
    :aviso="avisoCerc"
    :instruction="confirmacaoCerc"
    :confirm-phrase="acao === 'registrar' ? 'REGISTRAR/TÍTULOS' : 'ATUALIZAR/REGISTROS'"
    :confirm-label="avisoCerc ? rotuloContinuar : 'Confirmar'"
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
    :confirm-label="avisoCerc ? rotuloContinuar : 'Baixar'"
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
    :confirm-label="avisoCerc ? rotuloContinuar : 'Desregistrar'"
    :titulos="titulosAcao"
    @close="fechar"
  />
  <AlterarSituacaoModal v-if="acao === 'situacao'" @close="fechar" />
  <PagamentoLoteModal v-if="acao === 'pagamento'" :titulos="titulos" @close="fechar" />
  <BaixarArquivosModal v-if="acao === 'arquivos'" @close="fechar" />
  <RegistrarConfirmacaoModal v-if="acao === 'confirmacao'" @close="fechar" />
  <ConfirmTypedActionModal
    v-if="acao === 'boleto'"
    persistent
    title="Gerar boleto"
    subtitle="Confirmação da geração de boleto"
    :instruction="instrucaoBoleto"
    confirm-phrase="GERAR/BOLETO"
    confirm-label="Confirmar"
    @close="fechar"
    @confirm="fechar"
  />
  <ConfirmTypedActionModal
    v-if="acao === 'excluir'"
    persistent
    title="Excluir títulos"
    subtitle="Confirmação da exclusão dos títulos selecionados"
    :instruction="instrucaoExcluir"
    confirm-phrase="EXCLUIR/TÍTULOS"
    confirm-label="Excluir títulos"
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
.lote-menu-item:hover {
  background: var(--surface-sunken);
}
.lote-menu-danger {
  color: var(--action-danger-text-only);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
