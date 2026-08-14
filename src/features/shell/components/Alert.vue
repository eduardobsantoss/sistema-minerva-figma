<script setup lang="ts">
/**
 * Wrapper de preview para Configurações → Telas.
 * Source canônico: @/components/feedback/Alert.vue
 */
import { ref } from 'vue';
import Alert, { type AlertType } from '@/components/feedback/Alert.vue';

const hidden = ref<Record<string, boolean>>({});

const samples: {
  key: string;
  type: AlertType;
  title: string;
  message: string;
  actionLabel?: string;
}[] = [
  {
    key: 'error',
    type: 'error',
    title: 'Não foi possível salvar',
    message: 'Corrija os campos destacados antes de continuar.',
    actionLabel: 'Revisar campos',
  },
  {
    key: 'warning',
    type: 'warning',
    title: 'Sessão prestes a expirar',
    message: 'Sua sessão encerra em 10 minutos. Renove para não perder o trabalho.',
    actionLabel: 'Renovar sessão',
  },
  {
    key: 'success',
    type: 'success',
    title: 'Validação concluída',
    message: 'Todos os documentos foram aprovados.',
  },
  {
    key: 'info',
    type: 'info',
    title: 'Atualização disponível',
    message: 'Há novas regras de validação neste módulo.',
  },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 12px">
    <Alert
      v-for="item in samples"
      v-show="!hidden[item.key]"
      :key="item.key"
      :type="item.type"
      :title="item.title"
      :message="item.message"
      :action-label="item.actionLabel"
      @dismiss="hidden[item.key] = true"
    />
  </div>
</template>
