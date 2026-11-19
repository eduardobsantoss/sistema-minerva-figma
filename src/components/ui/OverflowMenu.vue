<script setup lang="ts">
// Menu de ações (⋮) do topo dos Details. Mesmo visual do menu da Solicitação de Operação.
// Ações críticas (`danger`) ficam no fim, separadas por uma linha.
import { onMounted, onUnmounted, ref, type Component } from 'vue';
import { MoreVertical } from 'lucide-vue-next';

export interface OverflowMenuItem {
  key: string;
  label: string;
  icon?: Component;
  danger?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<{ items: OverflowMenuItem[]; ariaLabel?: string }>(), { ariaLabel: 'Mais ações' });
const emit = defineEmits<{ select: [key: string] }>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

function onDocMouseDown(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

onMounted(() => {
  document.addEventListener('mousedown', onDocMouseDown);
  document.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocMouseDown);
  document.removeEventListener('keydown', onKeydown);
});

function pick(item: OverflowMenuItem) {
  if (item.disabled) return;
  open.value = false;
  emit('select', item.key);
}
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      type="button"
      :aria-label="ariaLabel"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="flex items-center justify-center"
      style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong)"
      @click="open = !open"
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      role="menu"
      class="flex flex-col"
      style="position: absolute; top: 52px; right: 0; z-index: var(--z-popover); min-width: 260px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: 6px"
    >
      <template v-for="(item, idx) in items" :key="item.key">
        <div
          v-if="item.danger && idx > 0 && !items[idx - 1].danger"
          style="height: 1px; background: var(--border-default); margin: 6px 4px"
        />
        <button
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          class="flex items-center overflow-menu-item"
          :class="{ 'overflow-menu-item--danger': item.danger }"
          :style="{
            gap: '10px',
            padding: '10px 12px',
            background: 'none',
            border: 'none',
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            opacity: item.disabled ? 'var(--opacity-disabled)' : 1,
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
            fontSize: 'var(--text-sm)',
            fontWeight: item.danger ? 'var(--weight-bold)' : 'var(--weight-semibold)',
            color: item.danger ? 'var(--action-danger-text-only)' : 'var(--text-default)',
            width: '100%',
            transition: 'background var(--duration-fast)',
          }"
          @click="pick(item)"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            :size="16"
            :style="{ color: item.danger ? 'inherit' : 'var(--text-muted)', flexShrink: 0 }"
          />
          {{ item.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overflow-menu-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.overflow-menu-item--danger:hover:not(:disabled) {
  background: var(--status-danger-bg);
}
</style>
