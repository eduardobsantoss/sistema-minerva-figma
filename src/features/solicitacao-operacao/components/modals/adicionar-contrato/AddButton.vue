<script setup lang="ts">
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center justify-center"
    style="
      height: 40px;
      padding: 0 18px;
      background: var(--gci-base);
      color: #fff;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.04em;
      white-space: nowrap;
    "
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
