<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <div class="ccm-trash" style="display: flex; align-items: center; justify-content: center">
    <button
      class="flex items-center justify-center"
      style="width: 32px; height: 32px; border-radius: var(--radius-md); border: none; cursor: pointer"
      @click="emit('click')"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>
