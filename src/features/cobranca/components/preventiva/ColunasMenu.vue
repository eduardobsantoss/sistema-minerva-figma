<script setup lang="ts">
import { ref } from 'vue';
import { SlidersHorizontal } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';

defineProps<{ cols: { key: string; label: string }[]; visible: Set<string> }>();
const emit = defineEmits<{ toggle: [key: string] }>();

const open = ref(false);
</script>

<template>
  <div style="position: relative">
    <button type="button" class="cm-btn" @click="open = !open">
      <SlidersHorizontal :size="14" /> Colunas
    </button>
    <template v-if="open">
      <div style="position: fixed; inset: 0; z-index: 30" @click="open = false" />
      <div
        style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 240px; max-height: 360px; overflow-y: auto; padding: 8px"
      >
        <div v-for="c in cols" :key="c.key" class="cm-item" @click="emit('toggle', c.key)">
          <div @click.stop>
            <Checkbox :checked="visible.has(c.key)" @change="emit('toggle', c.key)" />
          </div>
          {{ c.label }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cm-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.cm-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.cm-item:hover {
  background: var(--surface-sunken);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
