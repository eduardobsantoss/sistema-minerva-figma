<script setup lang="ts">
import type { Component } from 'vue';
import { Check } from 'lucide-vue-next';

defineProps<{
  steps: { key: string; label: string; icon: Component }[];
  current: number;
}>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); overflow-x: auto">
    <button
      v-for="(s, i) in steps"
      :key="s.key"
      type="button"
      class="flex items-center justify-center"
      :style="{
        flex: 1,
        gap: '8px',
        minWidth: '100px',
        padding: '16px 8px 13px',
        background: 'transparent',
        border: 'none',
        borderBottom: i === current ? '3px solid var(--agro-base)' : '3px solid transparent',
        cursor: 'pointer',
        color: i === current ? 'var(--agro-base)' : i < current ? 'var(--stepper-done)' : 'var(--text-muted)',
        opacity: i !== current && i >= current ? 0.6 : 1,
        transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
      }"
      @click="emit('select', i)"
    >
      <Check v-if="i < current" :size="16" :stroke-width="2.5" />
      <component :is="s.icon" v-else :size="16" :stroke-width="i === current ? 2.25 : 1.75" />
      <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>
