<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';

const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <div
    style="position: fixed; inset: 0; z-index: 110; display: flex; align-items: center; justify-content: center; background: rgba(15,23,42,0.45); padding: 24px"
    @click.self="emit('cancel')"
  >
    <div
      style="width: min(440px, 100%); background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default); box-shadow: var(--shadow-lg); padding: 28px"
    >
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-warning-bg); color: var(--warning-base); margin-bottom: 18px">
        <AlertTriangle :size="24" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Atualizar consulta?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Uma nova consulta será realizada no Serasa, gerando custo no provedor. Os dados atuais serão substituídos quando a consulta concluir.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <AdminButton variant="secondary" @click="emit('cancel')">Cancelar</AdminButton>
        <AdminButton @click="emit('confirm')">Confirmar atualização</AdminButton>
      </div>
    </div>
  </div>
</template>
