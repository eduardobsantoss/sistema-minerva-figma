<script setup lang="ts">
defineProps<{ on: boolean }>();
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: '44px',
      height: '24px',
      borderRadius: '9999px',
      background: on ? 'var(--gci-base)' : 'var(--border-strong)',
      transition: 'background var(--duration-base)',
      flexShrink: 0,
    }"
  >
    <span
      :style="{
        position: 'absolute',
        top: '3px',
        left: on ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '9999px',
        background: '#fff',
        transition: 'left var(--duration-base)',
        boxShadow: 'var(--shadow-xs)',
      }"
    />
  </div>
</template>
