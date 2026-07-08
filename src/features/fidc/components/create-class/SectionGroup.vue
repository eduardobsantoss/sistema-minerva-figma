<script setup lang="ts">
import type { Component } from 'vue';
import SectionTitle from './SectionTitle.vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
      padding: 20px;
      background: var(--surface-card);
    "
  >
    <SectionTitle :icon="icon">{{ title }}</SectionTitle>
    <slot />
  </div>
</template>
