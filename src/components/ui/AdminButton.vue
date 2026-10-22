<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Loader2 } from 'lucide-vue-next';

/**
 * Botão do Design System (Figma → Actions → Button/*).
 *
 * Tamanhos: compact 32 · default 40 · large 44 · xl 48 (xl só no agro).
 * Variantes: primary, secondary, danger, danger-text, agro, ghost
 * (ghost = "Cancelar" de rodapé de modal: texto discreto, sem fundo).
 * Desabilitado usa --opacity-disabled; nunca troque a cor à mão.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'danger-text' | 'agro' | 'ghost';
    size?: 'compact' | 'default' | 'large' | 'xl';
    type?: 'button' | 'submit' | 'reset';
    /** Ícone à esquerda (componente do lucide-vue-next). */
    icon?: Component;
    /** Ícone à direita. */
    trailingIcon?: Component;
    disabled?: boolean;
    /** Mostra o spinner no lugar do ícone e bloqueia o clique. */
    loading?: boolean;
    /** Ocupa 100% da largura. */
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'default',
    type: 'button',
    icon: undefined,
    trailingIcon: undefined,
    disabled: false,
    loading: false,
    block: false,
  },
);

defineEmits<{ click: [event: MouseEvent] }>();

const iconSize = computed(() => (props.size === 'compact' ? 14 : 16));
const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :type="type"
    class="admin-btn"
    :class="[`admin-btn--${variant}`, `admin-btn--${size}`, { 'admin-btn--block': block }]"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    @click="$emit('click', $event)"
  >
    <Loader2 v-if="loading" :size="iconSize" class="admin-btn__spin" aria-hidden="true" />
    <component :is="icon" v-else-if="icon" :size="iconSize" aria-hidden="true" />
    <slot />
    <component :is="trailingIcon" v-if="trailingIcon" :size="iconSize" aria-hidden="true" />
  </button>
</template>

<style scoped>
.admin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-shrink: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-weight: var(--weight-bold);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  transition:
    background var(--duration-base) var(--ease-standard),
    box-shadow var(--duration-base) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    color var(--duration-base) var(--ease-standard),
    border-color var(--duration-base) var(--ease-standard);
}
.admin-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.admin-btn:focus-visible {
  box-shadow: var(--focus-ring);
}
.admin-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.admin-btn--block {
  display: flex;
  width: 100%;
}

/* ===== Tamanhos ===== */
.admin-btn--compact { height: 32px; padding: 0 var(--space-3); font-size: var(--text-xs); }
.admin-btn--default { height: 40px; padding: 0 var(--space-4); font-size: var(--text-sm); }
.admin-btn--large   { height: 44px; padding: 0 var(--space-5); font-size: var(--text-sm); }
.admin-btn--xl      { height: 48px; padding: 0 var(--space-5); font-size: var(--text-sm); }

/* ===== Variantes ===== */
.admin-btn--primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
}
.admin-btn--primary:hover:not(:disabled) { background: var(--action-primary-bg-hover); }
.admin-btn--primary:active:not(:disabled) { background: var(--action-primary-bg-active); }

.admin-btn--secondary {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border-color: var(--action-secondary-border);
}
.admin-btn--secondary:hover:not(:disabled),
.admin-btn--secondary:active:not(:disabled) { background: var(--action-secondary-bg-hover); }

.admin-btn--danger {
  background: var(--action-danger-bg);
  color: var(--action-danger-text);
}
.admin-btn--danger:hover:not(:disabled),
.admin-btn--danger:active:not(:disabled) { background: var(--action-danger-bg-hover); }

.admin-btn--danger-text {
  background: transparent;
  color: var(--action-danger-text-only);
}
.admin-btn--danger-text:hover:not(:disabled) { background: var(--status-danger-bg); }

.admin-btn--agro {
  background: var(--action-agro-bg);
  color: var(--action-agro-text);
}
.admin-btn--agro:hover:not(:disabled) { background: var(--action-agro-bg-hover); }
.admin-btn--agro:active:not(:disabled) { background: var(--action-agro-bg-active); }

.admin-btn--ghost {
  background: transparent;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  padding-left: var(--space-1);
  padding-right: var(--space-1);
}
.admin-btn--ghost:hover:not(:disabled) { color: var(--text-strong); }

.admin-btn__spin {
  animation: admin-btn-spin 0.9s linear infinite;
}
@keyframes admin-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
