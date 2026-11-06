<script setup lang="ts">
/**
 * Add Button do DS (Figma › Actions › Add Button, decisão Parte 1: v2).
 * Botão "Adicionar" de seções de formulário: verde --success-base, raio md,
 * 40px, padding 0 16px, gap 8, ícone Plus 14, rótulo --text-xs bold.
 * O texto padrão é "Adicionar"; passe um slot para outro rótulo
 * (ex.: "Adicionar parcela"). O ícone já vem incluso.
 */
import { Plus } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    disabled?: boolean;
    /** Ocupa a largura toda do container. */
    fullWidth?: boolean;
    type?: 'button' | 'submit';
  }>(),
  { disabled: false, fullWidth: false, type: 'button' },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    :type="type"
    class="add-button"
    :class="{ 'add-button--block': fullWidth }"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <Plus :size="14" :stroke-width="2.5" aria-hidden="true" />
    <slot>Adicionar</slot>
  </button>
</template>

<style scoped>
.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  min-width: 40px;
  padding: 0 16px;
  background: var(--success-base);
  color: var(--text-on-brand);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  transition: background var(--duration-fast), box-shadow var(--duration-fast);
}
.add-button:hover:not(:disabled) {
  background: var(--success-dark);
}
.add-button:focus-visible {
  box-shadow: var(--focus-ring);
}
.add-button:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.add-button--block {
  width: 100%;
}
</style>
