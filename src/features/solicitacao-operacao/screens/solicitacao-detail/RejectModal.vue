<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{ id: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <AdminModal :width="440" headless @close="emit('close')">
    <div
      class="flex items-center justify-center"
      style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px">
      <AlertTriangle :size="26" />
    </div>
    <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
      Rejeitar a solicitação {{ id }}?
    </h3>
    <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
      Esta ação encerra o fluxo da operação e move a solicitação para a etapa <strong>Rejeitada</strong>. Você poderá consultá-la no histórico, mas não poderá retomá-la por aqui.
    </p>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="danger" size="large" @click="emit('close')">Confirmar rejeição</AdminButton>
    </template>
  </AdminModal>
</template>
