<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    content: string;
    /** dark = estilo dos gráficos; light = menu lateral colapsado */
    variant?: 'dark' | 'light';
    side?: 'top' | 'bottom' | 'left' | 'right';
    /** ocupa 100% da largura (ex.: botão do menu lateral) */
    block?: boolean;
  }>(),
  { variant: 'dark', side: 'top', block: false },
);

const open = ref(false);
const ready = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const tipEl = ref<HTMLElement | null>(null);
const coords = ref({ top: 0, left: 0 });

const tone = computed(() =>
  props.variant === 'light'
    ? {
        bg: 'var(--surface-card)',
        fg: 'var(--text-strong)',
        border: '1px solid var(--border-default)',
        shadow: 'var(--shadow-md)',
      }
    : {
        bg: '#0F172A',
        fg: '#F8FAFB',
        border: 'none',
        shadow: '0 10px 24px -12px rgba(15, 23, 42, 0.55)',
      },
);

async function place() {
  await nextTick();
  const root = rootEl.value;
  const tip = tipEl.value;
  if (!root || !tip) return;
  const r = root.getBoundingClientRect();
  const t = tip.getBoundingClientRect();
  const gap = 8;
  let top = 0;
  let left = 0;
  if (props.side === 'top') {
    top = r.top - t.height - gap;
    left = r.left + r.width / 2 - t.width / 2;
  } else if (props.side === 'bottom') {
    top = r.bottom + gap;
    left = r.left + r.width / 2 - t.width / 2;
  } else if (props.side === 'right') {
    top = r.top + r.height / 2 - t.height / 2;
    left = r.right + gap;
  } else {
    top = r.top + r.height / 2 - t.height / 2;
    left = r.left - t.width - gap;
  }
  const pad = 8;
  left = Math.min(Math.max(pad, left), window.innerWidth - t.width - pad);
  top = Math.min(Math.max(pad, top), window.innerHeight - t.height - pad);
  coords.value = { top, left };
}

async function show() {
  open.value = true;
  ready.value = false;
  await place();
  ready.value = true;
}

function hide() {
  open.value = false;
  ready.value = false;
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') hide();
}

function onScroll() {
  if (open.value) place();
}

onMounted(() => {
  document.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey);
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', onScroll);
});

const arrowStyle = computed(() => {
  const bg = tone.value.bg;
  if (props.side === 'top') {
    return {
      position: 'absolute' as const,
      left: '50%',
      bottom: '-5px',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: `5px solid ${bg}`,
    };
  }
  if (props.side === 'bottom') {
    return {
      position: 'absolute' as const,
      left: '50%',
      top: '-5px',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: `5px solid ${bg}`,
    };
  }
  if (props.side === 'right') {
    return {
      position: 'absolute' as const,
      left: '-5px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderRight: `5px solid ${bg}`,
    };
  }
  return {
    position: 'absolute' as const,
    right: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: `5px solid ${bg}`,
  };
});
</script>

<template>
  <span
    ref="rootEl"
    :style="{
      position: 'relative',
      display: block ? 'block' : 'inline-flex',
      width: block ? '100%' : undefined,
      alignItems: 'center',
      cursor: 'default',
    }"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Teleport to="body">
      <span
        v-if="open && content"
        ref="tipEl"
        role="tooltip"
        :style="{
          position: 'fixed',
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          zIndex: 600,
          pointerEvents: 'none',
          background: tone.bg,
          color: tone.fg,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-semibold)',
          padding: '7px 12px',
          borderRadius: 'var(--radius-md)',
          whiteSpace: 'nowrap',
          boxShadow: tone.shadow,
          border: tone.border,
          opacity: ready ? 1 : 0,
          transition: 'opacity 80ms ease',
        }"
      >
        {{ content }}
        <span :style="arrowStyle" />
      </span>
    </Teleport>
  </span>
</template>
