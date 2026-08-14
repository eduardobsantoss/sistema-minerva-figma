<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/components/feedback/ToastCard.vue
 */
import ToastCard from '@/components/feedback/ToastCard.vue';
import type { ToastItem } from '@/composables/useToast';

const samples: ToastItem[] = [
  {
    id: 'e',
    type: 'error',
    message: 'Incorrect password. Please try again.',
    action: { label: 'Try again' },
    count: 1,
    createdAt: 1,
  },
  {
    id: 'w',
    type: 'warning',
    message: 'Session is about to expire in 10 minutes.',
    action: { label: 'Renew session' },
    count: 1,
    createdAt: 2,
  },
  {
    id: 's',
    type: 'success',
    message: 'Validação concluída. Documento aprovado.',
    count: 1,
    createdAt: 3,
  },
  {
    id: 'i',
    type: 'info',
    message: 'Há atualizações disponíveis no módulo.',
    count: 1,
    createdAt: 4,
  },
  {
    id: 'u',
    type: 'error',
    message: 'Unauthorized',
    action: { label: 'Fazer login' },
    count: 7,
    createdAt: 5,
  },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 12px; max-width: 360px">
    <ToastCard v-for="item in samples" :key="item.id" :toast="item" />
  </div>
</template>
