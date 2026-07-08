<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

defineProps<{ id: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 100; background: rgba(15, 23, 42, 0.45); padding: 24px">
    <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4); padding: 28px">
      <div
        class="flex items-center justify-center"
        style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px"
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Rejeitar a solicitação {{ id }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação encerra o fluxo da operação e move a solicitação para a etapa <strong>Rejeitada</strong>. Você poderá consultá-la no histórico, mas não poderá retomá-la por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; background: var(--action-danger-bg); color: var(--action-danger-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Confirmar rejeição
        </button>
      </div>
    </div>
  </div>
</template>
