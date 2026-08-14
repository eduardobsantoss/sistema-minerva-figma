<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/components/feedback/ToastStack.vue
 */
import { reactive } from 'vue';
import ToastStack from '@/components/feedback/ToastStack.vue';
import type { ToastItem, ToastType } from '@/composables/useToast';

const toasts = reactive<ToastItem[]>([
  {
    id: 'preview-init-e',
    type: 'error',
    message: 'Incorrect password. Please try again.',
    action: { label: 'Try again' },
    count: 1,
    createdAt: 3,
  },
  {
    id: 'preview-init-w',
    type: 'warning',
    message: 'Session is about to expire in 10 minutes.',
    action: { label: 'Renew session' },
    count: 1,
    createdAt: 2,
  },
]);
let seq = 0;

function add(type: ToastType, message: string, action?: { label: string }) {
  const existing = toasts.find((t) => t.type === type && t.message === message);
  if (existing) {
    existing.count += 1;
    existing.createdAt = Date.now();
    return;
  }
  toasts.push({
    id: `preview-${++seq}`,
    type,
    message,
    action,
    count: 1,
    createdAt: Date.now(),
  });
}

function fireUnauthorizedBurst() {
  for (let i = 0; i < 7; i++) add('error', 'Unauthorized');
}

function dismiss(id: string) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
}

function dismissAll() {
  toasts.splice(0, toasts.length);
}

const btnStyle = {
  height: '34px',
  padding: '0 12px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-default)',
  background: 'var(--surface-card)',
  color: 'var(--text-strong)',
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  cursor: 'pointer',
};
</script>

<template>
  <div
    class="relative"
    style="
      min-height: 440px;
      background: var(--surface-sunken);
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-xl);
      padding: 16px;
      overflow: hidden;
    "
  >
    <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 12px; max-width: 420px">
      Dispare avisos para ver a pilha (máx. 3 visíveis) e o counter. Mensagens iguais agrupam com ×N.
    </div>
    <div class="flex flex-wrap" style="gap: 8px">
      <button type="button" class="btn-animated" :style="btnStyle" @click="add('error', 'Incorrect password. Please try again.', { label: 'Try again' })">
        Erro
      </button>
      <button type="button" class="btn-animated" :style="btnStyle" @click="add('warning', 'Session is about to expire in 10 minutes.', { label: 'Renew session' })">
        Aviso
      </button>
      <button type="button" class="btn-animated" :style="btnStyle" @click="add('success', 'Validação concluída. Documento aprovado.')">
        Sucesso
      </button>
      <button type="button" class="btn-animated" :style="btnStyle" @click="add('info', 'Há atualizações disponíveis no módulo.')">
        Info
      </button>
      <button
        type="button"
        class="btn-animated"
        :style="{ ...btnStyle, background: 'var(--danger-light)', color: 'var(--danger-dark)', borderColor: 'transparent' }"
        @click="fireUnauthorizedBurst"
      >
        7× Unauthorized
      </button>
    </div>

    <ToastStack
      :toasts="toasts"
      contained
      @dismiss="dismiss"
      @dismiss-all="dismissAll"
    />
  </div>
</template>
