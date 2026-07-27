<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  MoreVertical,
  ArrowRightLeft,
  RefreshCw,
  Layers,
  Wallet,
  XCircle,
  FileText,
  FileCode,
  Link2,
} from 'lucide-vue-next';
import type { Component } from 'vue';

const emit = defineEmits<{
  reject: [];
  vincularVeiculo: [];
  transferirSolicitacao: [];
  atualizarCessao: [];
  gerarTermoCessao: [];
  gerarCnab: [];
  mesclarAtivos: [];
  transferirConta: [];
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

type ActionKey =
  | 'vincularVeiculo'
  | 'transferirSolicitacao'
  | 'atualizarCessao'
  | 'gerarTermoCessao'
  | 'gerarCnab'
  | 'mesclarAtivos'
  | 'transferirConta';

type ActionItem = {
  label: string;
  icon: Component;
  action: ActionKey;
};

const secondary: ActionItem[] = [
  { label: 'Vincular a um veículo de operação', icon: Link2, action: 'vincularVeiculo' },
  { label: 'Transferir solicitação', icon: ArrowRightLeft, action: 'transferirSolicitacao' },
  { label: 'Atualizar cessão', icon: RefreshCw, action: 'atualizarCessao' },
  { label: 'Gerar Termo de Cessão', icon: FileText, action: 'gerarTermoCessao' },
  { label: 'Gerar CNAB', icon: FileCode, action: 'gerarCnab' },
  { label: 'Mesclar ativos entre pedidos', icon: Layers, action: 'mesclarAtivos' },
  { label: 'Transferir conta bancária', icon: Wallet, action: 'transferirConta' },
];

function handleDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));

function handleItem(a: ActionItem) {
  open.value = false;
  switch (a.action) {
    case 'vincularVeiculo':
      emit('vincularVeiculo');
      break;
    case 'transferirSolicitacao':
      emit('transferirSolicitacao');
      break;
    case 'atualizarCessao':
      emit('atualizarCessao');
      break;
    case 'gerarTermoCessao':
      emit('gerarTermoCessao');
      break;
    case 'gerarCnab':
      emit('gerarCnab');
      break;
    case 'mesclarAtivos':
      emit('mesclarAtivos');
      break;
    case 'transferirConta':
      emit('transferirConta');
      break;
  }
}

function handleReject() {
  open.value = false;
  emit('reject');
}
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      aria-label="Mais ações"
      class="flex items-center justify-center"
      style="
        width: 44px;
        height: 44px;
        border-radius: var(--radius-lg);
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        cursor: pointer;
        color: var(--text-strong);
      "
      @click="open = !open"
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      class="flex flex-col"
      style="
        position: absolute;
        top: 52px;
        right: 0;
        z-index: 50;
        min-width: 300px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
        padding: 6px;
      "
    >
      <button
        v-for="a in secondary"
        :key="a.label"
        class="flex items-center action-item"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-default);
          width: 100%;
          transition: background var(--duration-fast);
        "
        @click="handleItem(a)"
      >
        <component :is="a.icon" :size="16" style="color: var(--text-muted); flex-shrink: 0" />
        {{ a.label }}
      </button>
      <div style="height: 1px; background: var(--border-default); margin: 6px 4px" />
      <button
        class="flex items-center action-item-danger"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--action-danger-text-only);
          width: 100%;
          transition: background var(--duration-fast);
        "
        @click="handleReject"
      >
        <XCircle :size="16" />
        Rejeitar solicitação
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-item:hover {
  background: var(--surface-sunken);
}
.action-item-danger:hover {
  background: var(--status-danger-bg);
}
</style>
