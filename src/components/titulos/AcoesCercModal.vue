<script setup lang="ts">
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: [] }>();

const opcoes = [
  'Registrar títulos',
  'Atualizar registros',
  'Baixar registro dos títulos',
  'Desregistrar títulos',
];
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 22px 16px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
          Ações CERC
        </h3>
        <button type="button" aria-label="Fechar" class="lote-icon-btn" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="flex flex-col" style="gap: 8px; padding: 20px 22px">
        <button
          v-for="opcao in opcoes"
          :key="opcao"
          type="button"
          class="lote-choice"
          @click="emit('close')"
        >
          {{ opcao }}
        </button>
      </div>

      <div class="flex items-center justify-end" style="padding: 0 22px 20px">
        <button type="button" class="lote-secondary" @click="emit('close')">Fechar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
.lote-choice,
.lote-secondary {
  height: 40px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lote-choice {
  width: 100%;
  padding: 0 14px;
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border: 1px solid var(--action-secondary-border);
  text-align: left;
}
.lote-choice:hover {
  background: var(--action-secondary-bg-hover);
}
.lote-secondary {
  padding: 0 18px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
