<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = withDefaults(defineProps<{ quantidade?: number }>(), { quantidade: 1 });
const emit = defineEmits<{ close: []; confirm: [texto: string] }>();

const texto = ref('');
const pode = computed(() => texto.value.trim().length > 0);
const subtitulo = computed(() =>
  props.quantidade === 1
    ? 'A observação fica registrada no título selecionado'
    : `A observação fica registrada nos ${props.quantidade} títulos selecionados`,
);

function confirmar() {
  if (!pode.value) return;
  emit('confirm', texto.value.trim());
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 520px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Inserir observação de cobrança
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">{{ subtitulo }}</p>
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

      <div style="padding: 20px 22px">
        <label class="obs-field">
          <span class="obs-label">Observação</span>
          <textarea
            v-model="texto"
            rows="5"
            class="obs-input"
            placeholder="Descreva o contato ou a combinação feita com o sacado"
          />
        </label>
      </div>

      <div class="obs-footer">
        <button type="button" class="obs-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="obs-primary" :disabled="!pode" @click="confirmar">Inserir observação</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.obs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.obs-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.obs-input {
  width: 100%;
  padding: 12px 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
  resize: vertical;
  font-family: inherit;
}
.obs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 22px 20px;
}
.obs-secondary,
.obs-primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.obs-secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.obs-primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
.obs-primary:hover:not(:disabled) {
  background: var(--action-primary-bg-hover);
}
.obs-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
textarea:focus-visible,
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
