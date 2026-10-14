<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, Filter } from 'lucide-vue-next';

defineProps<{ activeCount: number; columns?: number }>();
const emit = defineEmits<{ apply: []; clear: [] }>();

const open = ref(false);
const placement = ref<'below' | 'above'>('below');
const btnRef = ref<HTMLButtonElement | null>(null);

function toggle() {
  if (!open.value && btnRef.value) {
    const rect = btnRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    placement.value = spaceBelow < 520 && rect.top > spaceBelow ? 'above' : 'below';
  }
  open.value = !open.value;
}

function apply() {
  emit('apply');
  open.value = false;
}

function clear() {
  emit('clear');
  open.value = false;
}
</script>

<template>
  <div style="position: relative">
    <button ref="btnRef" type="button" class="fp-btn" @click="toggle">
      <Filter :size="15" style="color: var(--text-muted)" />
      Filtros
      <span
        v-if="activeCount > 0"
        style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent)"
      >
        {{ activeCount }}
      </span>
      <ChevronDown
        :size="14"
        :style="{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }"
      />
    </button>

    <template v-if="open">
      <div style="position: fixed; inset: 0; z-index: 30" @click="open = false" />
      <div
        :style="{
          position: 'absolute',
          [placement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
          right: 0,
          zIndex: 31,
          width: '680px',
          maxWidth: 'calc(100vw - 48px)',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: '20px',
        }"
      >
        <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns ?? 3}, minmax(0, 1fr))`, gap: '14px' }">
          <slot />
        </div>
        <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
          <button type="button" class="fp-clear" @click="clear">Limpar</button>
          <button type="button" class="flex items-center fp-apply" @click="apply">
            <Filter :size="13" /> FILTRAR
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fp-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.fp-clear {
  height: 38px;
  padding: 0 16px;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
}
.fp-apply {
  gap: 6px;
  height: 38px;
  padding: 0 18px;
  background: var(--action-primary-bg);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: var(--weight-bold);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
}
.fp-apply:hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
