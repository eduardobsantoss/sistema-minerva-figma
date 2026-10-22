<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

withDefaults(
  defineProps<{
    title: string;
    description?: string;
  }>(),
  {
    description: 'Esta ação não poderá ser desfeita por aqui.',
  },
);
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <!-- Figma → Overlays → Confirm Dialog (440px) -->
  <AdminModal :width="440" :title="title" body-tone="card" headless flush @close="emit('close')">
    <div class="confirm-dialog">
      <div class="confirm-dialog__icon">
        <AlertTriangle :size="24" />
      </div>
      <h3 class="confirm-dialog__title">{{ title }}</h3>
      <p class="confirm-dialog__description">{{ description }}</p>
      <div class="confirm-dialog__actions">
        <AdminButton variant="secondary" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton variant="danger" @click="emit('confirm')">Confirmar exclusão</AdminButton>
      </div>
    </div>
  </AdminModal>
</template>

<style scoped>
.confirm-dialog {
  padding: 28px;
}
.confirm-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  border-radius: var(--radius-full);
  background: var(--status-danger-bg);
  color: var(--danger-base);
}
.confirm-dialog__title {
  margin-bottom: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.confirm-dialog__description {
  margin-bottom: var(--space-6);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--text-muted);
}
.confirm-dialog__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
</style>
