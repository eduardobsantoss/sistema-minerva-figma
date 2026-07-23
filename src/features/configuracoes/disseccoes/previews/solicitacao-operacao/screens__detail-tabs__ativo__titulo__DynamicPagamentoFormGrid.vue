<script setup lang="ts">
const form = defineModel({ default: '' });
withDefaults(defineProps<{ fields: PagamentoFormFieldDef[]; cols?: number }>(), {
  fields: [],
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
    </div>
  </div>
</template>
