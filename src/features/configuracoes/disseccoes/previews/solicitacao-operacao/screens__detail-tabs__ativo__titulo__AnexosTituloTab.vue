<script setup lang="ts">
import { CheckCircle2, XCircle } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 10px">
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--success-light); color: var(--success-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <CheckCircle2 :size="16" /> Confirmar Anexos
      </button>
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--danger-light); color: var(--danger-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <XCircle :size="16" /> Rejeitar Anexos
      </button>
    </div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
  </div>
</template>
