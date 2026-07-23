<script setup lang="ts">
import { Users } from 'lucide-vue-next';
const conjuge = defineModel({ default: '' });
withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: true
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
</template>
