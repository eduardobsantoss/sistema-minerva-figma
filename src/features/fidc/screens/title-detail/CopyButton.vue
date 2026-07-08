<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleCopy(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    style="
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      display: inline-flex;
      align-items: center;
      border-radius: 4px;
      flex-shrink: 0;
      transition: color var(--duration-fast);
    "
    :style="{ color: copied ? 'var(--success-base)' : 'var(--text-muted)' }"
    @click="handleCopy"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
