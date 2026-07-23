<script setup lang="ts">
import { X, Paperclip } from 'lucide-vue-next';
withDefaults(defineProps<{ tituloValidacao: string; evidencia: ValidacaoEvidencia }>(), {
  tituloValidacao: '',
  evidencia: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 560px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            De: {{ evidencia.autor }}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ evidencia.data }}
          </div>
        </div>

        <div
          v-if="evidencia.arquivo"
          class="flex items-center"
          style="gap: 8px; font-size: var(--text-sm); color: var(--text-default)"
        >
          <Paperclip :size="15" style="color: var(--text-muted)" />
          {{ evidencia.arquivo }}
        </div>

        <div
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            line-height: 1.5;
            min-height: 96px;
          "
        >
          {{ evidencia.descricao }}
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
