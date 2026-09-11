<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  MoreVertical,
  PlusCircle,
  Percent,
  Scissors,
  Sparkles,
  Gift,
  MinusCircle,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { PU_EVENT_TYPES, type PuEventType } from '../../data/passivoNovoData';

const emit = defineEmits<{ select: [type: PuEventType] }>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

const ICONS: Record<PuEventType, Component> = {
  subscription: PlusCircle,
  interest: Percent,
  amortization: Scissors,
  extraordinaryAmortization: Sparkles,
  premium: Gift,
  nonCashWithdrawal: MinusCircle,
};

function handleDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));

function pick(type: PuEventType) {
  open.value = false;
  emit('select', type);
}
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      type="button"
      aria-label="Mais ações"
      class="flex items-center justify-center"
      style="
        width: 44px;
        height: 44px;
        border-radius: var(--radius-lg);
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        cursor: pointer;
        color: var(--text-strong);
      "
      @click="open = !open"
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      class="flex flex-col"
      style="
        position: absolute;
        top: 52px;
        right: 0;
        z-index: 50;
        min-width: 300px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
        padding: 6px;
      "
    >
      <button
        v-for="item in PU_EVENT_TYPES"
        :key="item.id"
        type="button"
        class="flex items-center pu-action-item"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-default);
          width: 100%;
        "
        @click="pick(item.id)"
      >
        <component :is="ICONS[item.id]" :size="16" style="color: var(--text-muted); flex-shrink: 0" />
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pu-action-item:hover {
  background: var(--surface-sunken);
}
</style>
