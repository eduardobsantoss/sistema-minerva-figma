<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; label: string; value: string }>();
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 14px 16px; background: var(--surface-sunken)">
    <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 8px">{{ label }}</div>
    <div class="flex items-center" style="gap: 7px">
      <component :is="icon" :size="15" style="color: var(--text-muted)" />
      <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ value }}</span>
    </div>
  </div>
</template>
