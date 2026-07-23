<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean; required?: boolean; span?: number; /** Máscara R$ centavos (digitar 2 → R$ 0,02) */
    currency?: boolean }>(), {
  label: 'Label',
  placeholder: 'Label',
  disabled: true,
  required: true,
  span: 2
});
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      :value="model"
      :placeholder="currency ? 'R$ 0,00' : placeholder"
      :disabled="disabled"
      :inputmode="currency ? 'numeric' : undefined"
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
        fontVariantNumeric: currency ? 'tabular-nums' : undefined,
      }"
     
     
    />
  </div>
</template>
