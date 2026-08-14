<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ToastItem } from '@/composables/useToast';
import ToastCard from './ToastCard.vue';

const VISIBLE = 3;

const props = withDefaults(
  defineProps<{
    toasts: readonly ToastItem[];
    contained?: boolean;
  }>(),
  { contained: false },
);

const emit = defineEmits<{
  dismiss: [id: string];
  'dismiss-all': [];
}>();

const expanded = ref(false);

const ordered = computed(() => [...props.toasts].sort((a, b) => b.createdAt - a.createdAt));

const visible = computed(() =>
  expanded.value ? ordered.value : ordered.value.slice(0, VISIBLE),
);

const hiddenCount = computed(() => Math.max(0, ordered.value.length - VISIBLE));

function cardStyle(index: number) {
  if (expanded.value) {
    return {
      position: 'relative' as const,
      transform: 'none',
      zIndex: String(visible.value.length - index),
      opacity: 1,
      pointerEvents: 'auto' as const,
      marginBottom: '0px',
    };
  }
  return {
    position: (index === 0 ? 'relative' : 'absolute') as 'relative' | 'absolute',
    right: '0',
    bottom: index === 0 ? '0' : `${index * 10}px`,
    transform: `scale(${1 - index * 0.04})`,
    transformOrigin: 'bottom right',
    zIndex: String(visible.value.length - index),
    opacity: 1,
    pointerEvents: (index === 0 ? 'auto' : 'none') as 'auto' | 'none',
  };
}
</script>

<template>
  <div
    v-if="toasts.length"
    class="flex flex-col items-end"
    :style="{
      position: contained ? 'absolute' : 'fixed',
      right: '28px',
      bottom: '28px',
      zIndex: 'var(--z-toast)',
      width: '360px',
      maxWidth: 'calc(100% - 56px)',
      gap: expanded ? '10px' : '0',
    }"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <div
      v-if="toasts.length > 1"
      class="flex items-center justify-between"
      style="width: 100%; gap: 12px; padding: 0 2px"
    >
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        "
      >
        {{ toasts.length }} {{ toasts.length === 1 ? 'aviso' : 'avisos' }}
        <template v-if="!expanded && hiddenCount > 0"> · +{{ hiddenCount }}</template>
      </span>
      <button
        type="button"
        class="btn-animated"
        style="
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          color: var(--gci-base);
          padding: 0;
        "
        @click="emit('dismiss-all')"
      >
        Dispensar todos
      </button>
    </div>

    <div
      class="relative"
      :style="{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: expanded ? '10px' : '0',
        maxHeight: expanded ? '70vh' : 'none',
        overflow: expanded ? 'auto' : 'visible',
        paddingBottom: expanded || visible.length <= 1 ? '0' : `${Math.min(visible.length - 1, 2) * 10}px`,
      }"
    >
      <div
        v-for="(item, index) in visible"
        :key="item.id"
        :style="cardStyle(index)"
      >
        <ToastCard :toast="item" @dismiss="emit('dismiss', item.id)" @action="emit('dismiss', item.id)" />
      </div>
    </div>
  </div>
</template>
