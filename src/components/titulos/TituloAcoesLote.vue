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
import AcoesCercModal from './AcoesCercModal.vue';
import AlterarSituacaoModal from './AlterarSituacaoModal.vue';
import BaixarArquivosModal from './BaixarArquivosModal.vue';
import PagamentoLoteModal from './PagamentoLoteModal.vue';
import RegistrarConfirmacaoModal from './RegistrarConfirmacaoModal.vue';
import type { TituloSelecionado } from './types';

const props = defineProps<{ titulos: TituloSelecionado[] }>();

type Acao = 'cerc' | 'situacao' | 'pagamento' | 'arquivos' | 'confirmacao' | 'boleto' | 'excluir';

const menuOpen = ref(false);
const acao = ref<Acao | null>(null);
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

function abrir(key: Acao) {
  menuOpen.value = false;
  acao.value = key;
}

function fechar() {
  acao.value = null;
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

  <AcoesCercModal v-if="acao === 'cerc'" @close="fechar" />
  <AlterarSituacaoModal v-if="acao === 'situacao'" @close="fechar" />
  <PagamentoLoteModal v-if="acao === 'pagamento'" :titulos="titulos" @close="fechar" />
  <BaixarArquivosModal v-if="acao === 'arquivos'" @close="fechar" />
  <RegistrarConfirmacaoModal v-if="acao === 'confirmacao'" @close="fechar" />
  <ConfirmTypedActionModal
    v-if="acao === 'boleto'"
    title="Gerar boleto"
    :instruction="instrucaoBoleto"
    confirm-phrase="GERAR/BOLETO"
    confirm-label="Confirmar"
    @close="fechar"
    @confirm="fechar"
  />
  <ConfirmTypedActionModal
    v-if="acao === 'excluir'"
    title="Excluir títulos"
    :instruction="instrucaoExcluir"
    confirm-phrase="EXCLUIR/TÍTULOS"
    confirm-label="Confirmar"
    variant="danger"
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
