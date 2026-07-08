<script setup lang="ts">
defineProps<{ cols: number }>();
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
