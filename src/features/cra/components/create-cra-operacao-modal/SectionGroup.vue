<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div
    style="
      padding: 20px;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
    "
  >
    <div
      v-if="title || icon"
      class="flex items-center"
      style="gap: 8px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px"
    >
      <span
        v-if="icon"
        class="flex items-center justify-center"
        style="width: 24px; height: 24px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base)"
      >
        <component :is="icon" :size="13" :stroke-width="2" />
      </span>
      {{ title }}
    </div>
    <slot />
  </div>
</template>
