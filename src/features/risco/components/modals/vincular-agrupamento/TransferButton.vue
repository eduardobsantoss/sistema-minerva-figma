<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; label: string; active: boolean; reverse?: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :disabled="!active"
    class="flex items-center justify-center"
    :style="{
      gap: '8px', width: '100%', height: '40px', padding: '0 14px',
      borderRadius: 'var(--radius-lg)', border: 'none', cursor: active ? 'pointer' : 'not-allowed',
      fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em',
      background: active ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
      color: active ? '#fff' : 'var(--text-disabled)',
      transition: 'background var(--duration-base)',
      flexDirection: reverse ? 'row-reverse' : 'row',
    }"
    @click="emit('click')"
  >
    <component :is="icon" :size="14" />
    {{ label }}
  </button>
</template>
