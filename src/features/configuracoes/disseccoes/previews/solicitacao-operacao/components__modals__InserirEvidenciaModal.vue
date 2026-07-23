<script setup lang="ts">
import { X, Paperclip } from 'lucide-vue-next';
withDefaults(defineProps<{ tituloValidacao: string }>(), {
  tituloValidacao: ''
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
        max-width: 520px;
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
            Inserir evidência de autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
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

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Arquivo
          </div>
          <div
            class="flex items-center"
            style="
              gap: 8px;
              height: 42px;
              padding: 0 14px;
              background: var(--surface-sunken);
              border: 1px dashed var(--border-default);
              border-radius: var(--radius-lg);
              color: var(--text-default);
              font-size: var(--text-sm);
            "
          >
            <Paperclip :size="15" style="color: var(--text-muted)" />
            {{ arquivo }}
          </div>
        </div>

        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Descrição
          </div>
          <textarea
            v-model="descricao"
            rows="4"
            maxlength="500"
            placeholder="Descreva a evidência..."
            style="
              width: 100%;
              padding: 12px 14px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              font-family: inherit;
              resize: vertical;
            "
          />
          <div style="text-align: right; font-size: 11px; color: var(--text-muted); margin-top: 4px">
            {{ descricao.length }} / 500
          </div>
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
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          INSERIR
        </button>
      </div>
    </div>
  </div>
</template>
