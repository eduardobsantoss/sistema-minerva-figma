<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon?: Component }>();
</script>

<template>
  <div
    class="flex items-center"
    style="
      gap: 8px;
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.18em;
      color: var(--accent);
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 10px;
    "
  >
    <span
      v-if="icon"
      class="flex items-center justify-center"
      style="width: 24px; height: 24px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base)"
    >
      <component :is="icon" :size="13" :stroke-width="2" />
    </span>
    <slot />
  </div>
</template>
