<script lang="ts">
/** Modais abertos, do mais antigo ao mais recente: Esc fecha só o de cima. */
const openStack: symbol[] = [];
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useSlots } from 'vue';
import { X } from 'lucide-vue-next';

/**
 * Modal do Design System (Figma → Overlays → Modal / Modal Header / Modal Footer).
 *
 * - Tamanhos: sm 480 · md 640 · lg 960 · xl 1280 (ou `width` em px para os casos do Patterns: 420, 520, 1100).
 * - Header: eyebrow laranja (módulo · contexto), título e subtítulo; ou o slot `header`.
 * - Corpo branco (--surface-card), entre as bordas do header e do rodapé.
 * - Rodapé: slot `footer`. Cancelar SEMPRE à esquerda e a ação (Salvar/Aprovar/Avançar) à direita,
 *   para o usuário não clicar numa achando que é a outra.
 * - Clicar fora NÃO fecha. Fecha pelo X, pelo Cancelar ou pelo Esc (Esc desligado com `persistent`).
 * - Altura máxima 85vh; só o corpo rola.
 */
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Largura em px; tem prioridade sobre `size`. */
    width?: number;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    /** Esc não fecha (clicar fora nunca fecha). */
    persistent?: boolean;
    /** Esconde o botão de fechar do header. */
    hideClose?: boolean;
    /** Sem header (ex.: Confirm Dialog). `title` continua como rótulo acessível. */
    headless?: boolean;
    /** Remove o padding do corpo (tabelas e layouts próprios). */
    flush?: boolean;
    /** Rodapé com uma ação só (ex.: "Fechar") alinhada à direita. */
    footerAlign?: 'between' | 'end';
  }>(),
  {
    size: 'md',
    width: undefined,
    eyebrow: '',
    title: '',
    subtitle: '',
    persistent: false,
    hideClose: false,
    headless: false,
    flush: false,
    footerAlign: 'between',
  },
);

const emit = defineEmits<{ close: [] }>();
const slots = useSlots();

const WIDTHS = { sm: 480, md: 640, lg: 960, xl: 1280 } as const;
const maxWidth = computed(() => `${props.width ?? WIDTHS[props.size]}px`);
const hasHeader = computed(() => !props.headless && !!(slots.header || props.title || props.eyebrow));

function requestClose() {
  if (!props.persistent) emit('close');
}

const id = Symbol('admin-modal');

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (openStack[openStack.length - 1] === id) requestClose();
}

onMounted(() => {
  openStack.push(id);
  window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  const i = openStack.indexOf(id);
  if (i !== -1) openStack.splice(i, 1);
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div class="admin-modal__overlay">
      <div
        class="admin-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title || undefined"
        :style="{ maxWidth }"
        @click.stop
      >
        <header v-if="hasHeader" class="admin-modal__header">
          <slot name="header">
            <div class="admin-modal__heading">
              <div v-if="eyebrow" class="admin-modal__eyebrow">{{ eyebrow }}</div>
              <h2 class="admin-modal__title">{{ title }}</h2>
              <p v-if="subtitle || slots.subtitle" class="admin-modal__subtitle">
                <slot name="subtitle">{{ subtitle }}</slot>
              </p>
            </div>
          </slot>
          <button
            v-if="!hideClose"
            type="button"
            class="admin-modal__close"
            aria-label="Fechar"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </header>

        <div
          class="admin-modal__body"
          :class="{ 'admin-modal__body--flush': flush }"
        >
          <slot />
        </div>

        <footer
          v-if="slots.footer"
          class="admin-modal__footer"
          :class="{ 'admin-modal__footer--end': footerAlign === 'end' }"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.admin-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: var(--overlay-backdrop);
  backdrop-filter: blur(var(--overlay-blur));
  animation: admin-modal-fade var(--duration-base) var(--ease-out);
}
.admin-modal {
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}
.admin-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
  padding: var(--space-6) 28px;
  background: var(--surface-card);
  border-bottom: 1px solid var(--border-default);
}
.admin-modal__heading {
  min-width: 0;
}
.admin-modal__eyebrow {
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}
.admin-modal__title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  letter-spacing: -0.01em;
  line-height: var(--leading-tight);
  color: var(--text-strong);
}
.admin-modal__subtitle {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.admin-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
  outline: none;
  transition: background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard);
}
.admin-modal__close:hover {
  background: var(--action-secondary-bg-hover);
  color: var(--text-strong);
}
.admin-modal__close:focus-visible {
  box-shadow: var(--focus-ring);
}
.admin-modal__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-6) 28px;
  background: var(--surface-card);
}
.admin-modal__body--flush {
  padding: 0;
}
.admin-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-shrink: 0;
  padding: var(--space-4) 28px;
  background: var(--surface-card);
  border-top: 1px solid var(--border-default);
}
.admin-modal__footer--end {
  justify-content: flex-end;
}
@keyframes admin-modal-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
