<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
withDefaults(defineProps<{ garantia: GarantiaOperacao }>(), {
  garantia: ''
});
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(15, 23, 42, 0.45); padding: 24px"
   
  >
    <div
      style="
        width: 100%;
        max-width: 440px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4);
        padding: 28px;
      "
     
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: var(--status-danger-bg);
          color: var(--danger-base);
          margin-bottom: 18px;
        "
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Excluir a garantia "{{ garantia.nome }}"?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação remove a garantia e os anexos vinculados desta solicitação. Não será possível desfazer por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--surface-card);
            color: var(--text-strong);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--action-danger-bg);
            color: var(--action-danger-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Confirmar exclusão
        </button>
      </div>
    </div>
  </div>
</template>
