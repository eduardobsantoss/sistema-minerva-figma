<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean; required?: boolean; span?: number }>(), {
  label: 'Label',
  options: [],
  placeholder: 'Label',
  disabled: true,
  required: true,
  span: 2
});
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
