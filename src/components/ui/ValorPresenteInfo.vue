<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import Tooltip from './Tooltip.vue';

withDefaults(defineProps<{ tone?: 'default' | 'onDark'; size?: number }>(), {
  tone: 'default',
  size: 14,
});

const TEXT =
  'Valor presente é o valor em aberto do título, calculado com a valorização, menos os pagamentos, mais multas e juros moratórios.';
</script>

<template>
  <Tooltip :content="TEXT" side="top" :max-width="280" @click.stop>
    <span
      tabindex="0"
      aria-label="Sobre valor presente"
      class="inline-flex"
      style="cursor: help; line-height: 0; flex-shrink: 0"
    >
      <Info
        :size="size"
        :stroke-width="2"
        :style="{ color: tone === 'onDark' ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }"
      />
    </span>
  </Tooltip>
</template>
