<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  qty: number;
  value: string;
  bg: string;
  fg: string;
}>();
</script>

<template>
  <div :style="{ padding: '14px', borderRadius: 'var(--radius-lg)', background: bg, borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 8px">
      <component :is="icon" :size="14" :style="{ color: fg, flexShrink: 0 }" :stroke-width="2" />
      <div :style="{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: fg, textTransform: 'uppercase' }">
        {{ label }}
      </div>
    </div>
    <div :style="{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: fg, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }">
      {{ qty }}
    </div>
    <div :style="{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: fg, opacity: 0.75, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }">
      {{ value }}
    </div>
  </div>
</template>
