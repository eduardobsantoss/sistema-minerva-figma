<script setup lang="ts">
import { computed, watch } from 'vue';
import { FileText } from 'lucide-vue-next';
const form = defineModel({ default: '' });
withDefaults(defineProps<{ modoNc?: boolean }>(), {
  modoNc: true
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
  </div>
</template>
