<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { brl, num } from '../data/passivoNovoData';
import type { PddRankingRow } from '../data/carteiraData';

const props = defineProps<{
  title: string;
  icon: Component;
  items: PddRankingRow[];
}>();

const maxPdd = computed(() => Math.max(...props.items.map((i) => i.pdd), 1));
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
    <div class="flex flex-col" style="gap: 16px; padding: 20px">
      <div v-for="item in items" :key="item.id" class="flex flex-col" style="gap: 6px">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ item.nome }}
        </span>
        <div style="height: 8px; background: var(--surface-sunken); border-radius: 9999px; overflow: hidden">
          <div
            :style="{
              width: `${Math.max(4, (item.pdd / maxPdd) * 100)}%`,
              height: '100%',
              background: 'var(--gci-base)',
              borderRadius: '9999px',
            }"
          />
        </div>
        <span style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
          PDD {{ brl(item.pdd, true) }} · VN {{ brl(item.vn, true) }} · {{ num(item.dias, 0) }} dias
        </span>
      </div>
    </div>
  </div>
</template>
