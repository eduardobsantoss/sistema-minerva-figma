<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ title: string; icon?: Component }>(), {
  title: 'Label',
  icon: FileText
});
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      <component :is="icon" v-if="icon" :size="13" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
