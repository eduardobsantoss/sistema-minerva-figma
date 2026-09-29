<script setup lang="ts">
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: []; baixar: []; desregistrar: [] }>();

function escolher(opcao: string) {
  if (opcao === 'Baixar registro dos títulos') emit('baixar');
  else if (opcao === 'Desregistrar títulos') emit('desregistrar');
  else emit('close');
}

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
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Ações CERC
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Selecione a ação de registro na CERC
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="gap: 8px; padding: 20px 22px">
        <button
          v-for="opcao in opcoes"
          :key="opcao"
          type="button"
          class="lote-choice"
          @click="escolher(opcao)"
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
