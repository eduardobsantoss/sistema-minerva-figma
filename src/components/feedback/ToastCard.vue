<script setup lang="ts">
import { computed, type Component } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next';
import type { ToastItem, ToastType } from '@/composables/useToast';

const props = defineProps<{ toast: ToastItem }>();
const emit = defineEmits<{
  dismiss: [];
  action: [];
}>();

const tone = computed(() => {
  const map: Record<
    ToastType,
    { icon: Component; fg: string; bg: string; btnBg: string; btnFg: string }
  > = {
    error: {
      icon: CircleAlert,
      fg: 'var(--danger-base)',
      bg: 'var(--danger-light)',
      btnBg: 'var(--danger-light)',
      btnFg: 'var(--danger-dark)',
    },
    warning: {
      icon: TriangleAlert,
      fg: 'var(--warning-base)',
      bg: 'var(--warning-light)',
      btnBg: 'var(--warning-light)',
      btnFg: 'var(--warning-dark)',
    },
    success: {
      icon: CircleCheck,
      fg: 'var(--success-base)',
      bg: 'var(--success-light)',
      btnBg: 'var(--success-light)',
      btnFg: 'var(--success-dark)',
    },
    info: {
      icon: Info,
      fg: 'var(--gci-base)',
      bg: 'var(--gci-light)',
      btnBg: 'var(--gci-light)',
      btnFg: 'var(--gci-base)',
    },
  };
  return map[props.toast.type];
});

function handleAction() {
  props.toast.action?.onClick?.();
  emit('action');
}
</script>

<template>
  <div
    role="status"
    :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
    class="flex flex-col"
    :style="{
      width: '360px',
      maxWidth: '100%',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderLeft: `4px solid ${tone.fg}`,
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
    }"
  >
    <div class="flex" style="gap: 12px; padding: 14px 14px 0 14px; align-items: flex-start">
      <div
        class="flex items-center justify-center"
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          background: tone.bg,
          color: tone.fg,
          flexShrink: 0,
        }"
      >
        <component :is="tone.icon" :size="16" :stroke-width="2.25" />
      </div>

      <div style="flex: 1; min-width: 0; padding-top: 4px">
        <div class="flex items-start" style="gap: 8px">
          <p
            style="
              margin: 0;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-strong);
              line-height: var(--leading-snug);
              flex: 1;
              min-width: 0;
            "
          >
            {{ toast.message }}
          </p>
          <span
            v-if="toast.count > 1"
            :style="{
              flexShrink: 0,
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              color: tone.fg,
              background: tone.bg,
              borderRadius: 'var(--radius-full)',
              padding: '2px 7px',
              lineHeight: 1.4,
            }"
          >
            ×{{ toast.count }}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Fechar"
        class="btn-animated flex items-center justify-center"
        style="
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-md);
          flex-shrink: 0;
          padding: 0;
        "
        @click="emit('dismiss')"
      >
        <X :size="14" :stroke-width="2.25" />
      </button>
    </div>

    <div
      class="flex items-center justify-between"
      style="padding: 12px 14px 14px; gap: 12px"
    >
      <button
        v-if="toast.action"
        type="button"
        class="btn-animated"
        :style="{
          height: '32px',
          padding: '0 12px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          background: tone.btnBg,
          color: tone.btnFg,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          cursor: 'pointer',
        }"
        @click="handleAction"
      >
        {{ toast.action.label }}
      </button>
      <span v-else />
      <button
        type="button"
        class="btn-animated"
        style="
          height: 32px;
          padding: 0 4px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          cursor: pointer;
        "
        @click="emit('dismiss')"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>
