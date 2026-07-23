<script setup lang="ts">
import { X, Upload } from 'lucide-vue-next';
withDefaults(defineProps<{ ativos: ContratoAtivo[] }>(), {
  ativos: []
});
</script>

<template>
  <div
    style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
   
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Confirmar Título</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
          <X :size="20" />
        </button>
      </div>
      <div style="padding: 24px">
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
          {{ ativos.length }} título(s) selecionado(s)
        </p>
        <div class="flex flex-col" style="gap: 16px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">EVIDÊNCIA</label>
            <button
              class="flex items-center"
              style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
            >
              <Upload :size="16" /> Selecionar arquivo
            </button>
          </div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">OBSERVAÇÃO</label>
            <textarea
              v-model="observacao"
              rows="3"
              placeholder="Observações sobre a confirmação..."
              style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
            />
          </div>
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          REGISTRAR CONFIRMAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
