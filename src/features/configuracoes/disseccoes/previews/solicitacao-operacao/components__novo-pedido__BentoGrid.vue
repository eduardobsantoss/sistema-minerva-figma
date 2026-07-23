<script setup lang="ts">
withDefaults(defineProps<{ cols: number }>(), {
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
