<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon: Component }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 16px">
      <component :is="icon" :size="15" style="color: var(--gci-base)" />
      <span
        style="
          font-size: 11px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--text-strong);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </span>
    </div>
    <slot />
  </div>
</template>
