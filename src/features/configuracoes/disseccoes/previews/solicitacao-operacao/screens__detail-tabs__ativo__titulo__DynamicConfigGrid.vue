<script setup lang="ts">
withDefaults(defineProps<{ fields: ConfiguracaoTituloFieldDef[]; data: ConfiguracaoTituloDisplay; cols?: number }>(), {
  fields: [],
  data: '',
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '20px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Field</div>
    </div>
  </div>
</template>
