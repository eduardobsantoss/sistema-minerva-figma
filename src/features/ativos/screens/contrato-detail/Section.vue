<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">{{ title }}</div>
    <slot />
  </div>
</template>
