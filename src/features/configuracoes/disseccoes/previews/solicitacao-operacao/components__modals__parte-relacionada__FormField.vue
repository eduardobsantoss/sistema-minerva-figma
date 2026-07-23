<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string }>(), {
  label: 'Label',
  placeholder: 'Label'
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      v-model="model"
      :placeholder="placeholder"
      style="
        width: 100%;
        height: 40px;
        padding: 0 14px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        outline: none;
        font-size: var(--text-sm);
        color: var(--text-strong);
      "
    />
  </div>
</template>
