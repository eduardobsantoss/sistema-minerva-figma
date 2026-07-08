<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center justify-center"
    style="
      height: 40px;
      padding: 0 18px;
      background: var(--success-base);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.10em;
      gap: 8px;
      white-space: nowrap;
    "
    @click="emit('click')"
  >
    <Plus :size="14" /> ADICIONAR
  </button>
</template>
