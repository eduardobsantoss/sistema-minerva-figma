<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean }>(), {
  label: 'Label',
  placeholder: 'Label',
  disabled: true
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
      }"
    />
  </div>
</template>
