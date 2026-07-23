<script setup lang="ts">
withDefaults(defineProps<{ parte: ParteRelacionada; fields: ParteFieldDef[]; cols?: number }>(), {
  parte: '',
  fields: [],
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '24px' }">
    <div
      v-for="field in visible"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, gridCols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Field</div>
    </div>
  </div>
</template>
