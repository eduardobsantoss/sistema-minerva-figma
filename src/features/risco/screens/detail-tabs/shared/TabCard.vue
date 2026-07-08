<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component; hasSave?: boolean }>();
const emit = defineEmits<{ save: [] }>();
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
    <div class="flex items-center" style="gap: 10px; padding: 16px 22px; border-bottom: 1px solid var(--border-default)">
      <component :is="icon" v-if="icon" :size="16" style="color: var(--text-muted)" />
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ title }}</h3>
    </div>
    <div style="padding: 22px">
      <slot />
    </div>
    <div v-if="hasSave" class="flex items-center justify-end" style="padding: 14px 22px; border-top: 1px solid var(--border-default)">
      <button
        style="height: 40px; padding: 0 20px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
        @click="emit('save')"
      >
        SALVAR
      </button>
    </div>
  </div>
</template>
