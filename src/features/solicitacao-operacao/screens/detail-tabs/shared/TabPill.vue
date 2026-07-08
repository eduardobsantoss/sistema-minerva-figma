<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ active: boolean; icon: Component }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center"
    :style="{
      gap: '8px',
      padding: '10px 14px',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-bold)',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-lg)',
      background: active ? 'var(--gci-base)' : 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('click')"
  >
    <component :is="icon" :size="14" /><slot />
  </button>
</template>
