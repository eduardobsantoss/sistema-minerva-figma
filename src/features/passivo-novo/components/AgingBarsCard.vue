<script setup lang="ts">
import type { Component } from 'vue';
import { brl, pct } from '../data/passivoNovoData';
import type { AgingFaixaRow } from '../data/carteiraData';

defineProps<{
  title: string;
  icon: Component;
  items: AgingFaixaRow[];
}>();
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      overflow: hidden;
    "
  >
    <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <component :is="icon" :size="16" style="color: var(--gci-base)" />
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ title }}
      </h3>
    </div>
    <div class="flex flex-col" style="gap: 14px; padding: 20px">
      <div v-for="item in items" :key="item.id" class="flex flex-col" style="gap: 6px">
        <div class="flex items-center justify-between" style="gap: 12px">
          <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ item.faixa }}
          </span>
          <span style="font-size: var(--text-sm); font-variant-numeric: tabular-nums; color: var(--text-muted)">
            {{ brl(item.valor, true) }} · {{ pct(item.pct) }}
          </span>
        </div>
        <div style="height: 8px; background: var(--surface-sunken); border-radius: 9999px; overflow: hidden">
          <div
            :style="{
              width: `${Math.max(2, item.pct * 100)}%`,
              height: '100%',
              background: 'var(--gci-base)',
              borderRadius: '9999px',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
