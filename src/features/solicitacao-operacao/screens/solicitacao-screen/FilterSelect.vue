<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

defineProps<{ placeholder: string; options: string[] }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div style="position: relative; min-width: 180px">
    <select
      v-model="model"
      :style="{
        width: '100%',
        height: '42px',
        padding: '0 36px 0 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        color: model ? 'var(--text-strong)' : 'var(--text-muted)',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
      }"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
    <ChevronDown
      :size="16"
      style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400); pointer-events: none"
    />
  </div>
</template>
