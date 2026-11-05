<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import type { GarantiaOperacao } from '../../data/operacaoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{ garantia: GarantiaOperacao }>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <AdminModal :width="440" headless @close="emit('close')">
    <div
      class="flex items-center justify-center"
      style="
        width: 52px;
        height: 52px;
        border-radius: 9999px;
        background: var(--status-danger-bg);
        color: var(--danger-base);
        margin-bottom: 18px;
      ">
      <AlertTriangle :size="26" />
    </div>
    <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
      Excluir a garantia "{{ garantia.nome }}"?
    </h3>
    <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
      Esta ação remove a garantia e os anexos vinculados desta solicitação. Não será possível desfazer por aqui.
    </p>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="danger" size="large" @click="emit('confirm')" type="button">Confirmar exclusão</AdminButton>
    </template>
  </AdminModal>
</template>
