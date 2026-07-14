<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue';

export interface SegmentedOption {
  key: string;
  label?: string;
  icon?: Component;
}

const props = withDefaults(
  defineProps<{
    options: SegmentedOption[];
    modelValue: string;
    variant?: 'surface' | 'brand';
    /** Square icon-only buttons (e.g. cards/list toggle). */
    iconOnly?: boolean;
  }>(),
  { variant: 'surface', iconOnly: false },
);

const emit = defineEmits<{ 'update:modelValue': [key: string] }>();

const rootEl = ref<HTMLElement | null>(null);
const btnEls = ref<(HTMLElement | null)[]>([]);
const pill = ref({ x: 0, y: 0, w: 0, h: 0, ready: false });
let resizeObserver: ResizeObserver | null = null;

function setBtnEl(el: unknown, index: number) {
  btnEls.value[index] = (el as HTMLElement | null) ?? null;
}

function updatePill() {
  const root = rootEl.value;
  if (!root) return;
  const idx = props.options.findIndex((o) => o.key === props.modelValue);
  const btn = idx >= 0 ? btnEls.value[idx] : null;
  if (!btn) return;

  pill.value = {
    x: btn.offsetLeft,
    y: btn.offsetTop,
    w: btn.offsetWidth,
    h: btn.offsetHeight,
    ready: true,
  };
}

onMounted(async () => {
  await nextTick();
  updatePill();
  if (rootEl.value) {
    resizeObserver = new ResizeObserver(() => updatePill());
    resizeObserver.observe(rootEl.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(
  () => [props.modelValue, props.options] as const,
  async () => {
    await nextTick();
    updatePill();
  },
);

const shellStyle = computed(() => {
  if (props.iconOnly) {
    return {
      gap: '2px',
      padding: '4px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      flexWrap: 'nowrap' as const,
      height: '56px',
      alignItems: 'center' as const,
    };
  }
  if (props.variant === 'brand') {
    return {
      gap: '4px',
      padding: '4px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      flexWrap: 'wrap' as const,
    };
  }
  return {
    gap: '4px',
    padding: '4px',
    background: 'var(--surface-sunken)',
    borderRadius: 'var(--radius-lg)',
    flexWrap: 'nowrap' as const,
  };
});

const pillStyle = computed(() => {
  const useBrandPill = props.variant === 'brand' || props.iconOnly;
  const base = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: `${pill.value.w}px`,
    height: `${pill.value.h}px`,
    transform: `translate(${pill.value.x}px, ${pill.value.y}px)`,
    borderRadius: useBrandPill ? 'var(--radius-lg)' : 'var(--radius-md)',
    pointerEvents: 'none' as const,
    zIndex: 0,
    opacity: pill.value.ready ? 1 : 0,
    transition: pill.value.ready
      ? 'transform var(--duration-base) var(--ease-standard), width var(--duration-base) var(--ease-standard), height var(--duration-base) var(--ease-standard)'
      : 'none',
  };

  if (useBrandPill) {
    return { ...base, background: 'var(--gci-base)' };
  }
  return {
    ...base,
    background: 'var(--surface-card)',
    boxShadow: 'var(--shadow-xs)',
  };
});

function optionStyle(key: string) {
  const active = props.modelValue === key;

  if (props.iconOnly) {
    return {
      width: '40px',
      height: '40px',
      padding: '0',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-lg)',
      background: 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      zIndex: 1,
      transition: 'color var(--duration-fast) var(--ease-standard)',
    };
  }

  if (props.variant === 'brand') {
    return {
      gap: '8px',
      padding: '10px 14px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-lg)',
      background: 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      position: 'relative' as const,
      zIndex: 1,
      transition: 'color var(--duration-base) var(--ease-standard)',
    };
  }

  return {
    gap: '6px',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: '0.04em',
    background: 'transparent',
    color: active ? 'var(--text-strong)' : 'var(--text-muted)',
    position: 'relative' as const,
    zIndex: 1,
    transition: 'color var(--duration-fast) var(--ease-standard)',
  };
}
</script>

<template>
  <div ref="rootEl" class="relative flex items-center" :style="shellStyle">
    <div :style="pillStyle" aria-hidden="true" />
    <button
      v-for="(opt, i) in options"
      :key="opt.key"
      :ref="(el) => setBtnEl(el, i)"
      type="button"
      class="flex items-center"
      :title="opt.label || undefined"
      :aria-label="opt.label || opt.key"
      :style="optionStyle(opt.key)"
      @click="emit('update:modelValue', opt.key)"
    >
      <component
        :is="opt.icon"
        v-if="opt.icon"
        :size="variant === 'brand' && !iconOnly ? 14 : 15"
        :stroke-width="2"
      />
      <template v-if="!iconOnly && opt.label">{{ opt.label }}</template>
    </button>
  </div>
</template>
