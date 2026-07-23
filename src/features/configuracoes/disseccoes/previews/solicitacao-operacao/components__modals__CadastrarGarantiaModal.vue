<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
withDefaults(defineProps<{ garantia?: GarantiaOperacao | null }>(), {
  garantia: ''
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
        max-width: 720px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ isEdit ? 'Editar garantia' : 'Cadastrar garantia' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados da garantia e documentos comprobatórios
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 20px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

          <div v-if="!showAnexos" class="flex justify-end">
            <button
              type="button"
              :disabled="!dadosOk"
              :style="{
                height: '42px',
                padding: '0 20px',
                background: dadosOk ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: dadosOk ? '#fff' : 'var(--text-disabled)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: dadosOk ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
              }"
             
            >
              CONTINUAR
            </button>
          </div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canSave"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          {{ isEdit ? 'SALVAR' : 'ADICIONAR' }}
        </button>
      </div>
    </div>
  </div>
</template>
