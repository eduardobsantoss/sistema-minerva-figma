<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
