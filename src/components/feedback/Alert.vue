<script setup lang="ts">
import { computed, type Component } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

const props = withDefaults(
  defineProps<{
    type?: AlertType;
    title?: string;
    message?: string;
    dismissible?: boolean;
    actionLabel?: string;
  }>(),
  {
    type: 'info',
    dismissible: true,
  },
);

const emit = defineEmits<{
  dismiss: [];
  action: [];
}>();

const tone = computed(() => {
  const map: Record<
    AlertType,
    { icon: Component; fg: string; bg: string; border: string; btnBg: string; btnFg: string }
  > = {
    error: {
      icon: CircleAlert,
      fg: 'var(--danger-base)',
      bg: 'var(--danger-light)',
      border: 'var(--danger-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--danger-dark)',
    },
    warning: {
      icon: TriangleAlert,
      fg: 'var(--warning-base)',
      bg: 'var(--warning-light)',
      border: 'var(--warning-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--warning-dark)',
    },
    success: {
      icon: CircleCheck,
      fg: 'var(--success-base)',
      bg: 'var(--success-light)',
      border: 'var(--success-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--success-dark)',
    },
    info: {
      icon: Info,
      fg: 'var(--gci-base)',
      bg: 'var(--gci-light)',
      border: 'var(--gci-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--gci-base)',
    },
  };
  return map[props.type];
});
</script>

<template>
  <div
    role="alert"
    class="flex"
    :style="{
      gap: '12px',
      alignItems: 'flex-start',
      width: '100%',
      background: tone.bg,
      border: `1px solid color-mix(in srgb, ${tone.border} 28%, transparent)`,
      borderLeft: `4px solid ${tone.border}`,
      borderRadius: 'var(--radius-xl)',
      padding: '14px 16px',
    }"
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--surface-card)',
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="tone.icon" :size="16" :stroke-width="2.25" />
    </div>

    <div style="flex: 1; min-width: 0; padding-top: 4px">
      <div
        v-if="title"
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          line-height: var(--leading-snug);
          margin-bottom: 4px;
        "
      >
        {{ title }}
      </div>
      <p
        v-if="message"
        style="
          margin: 0;
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: var(--leading-normal);
        "
      >
        {{ message }}
      </p>
      <slot />
      <button
        v-if="actionLabel"
        type="button"
        class="btn-animated"
        :style="{
          marginTop: '10px',
          height: '32px',
          padding: '0 12px',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          background: tone.btnBg,
          color: tone.btnFg,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          cursor: 'pointer',
        }"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <button
      v-if="dismissible"
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
</template>
