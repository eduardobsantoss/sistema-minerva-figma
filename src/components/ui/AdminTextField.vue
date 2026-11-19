<script setup lang="ts">
import './admin-fields.css';

/**
 * Campo de texto do DS (40px, fundo --surface-card, borda --border-default, raio --radius-lg).
 * Use dentro de AdminFormField para ter rótulo e erro. `multiline` vira textarea.
 */
withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    multiline?: boolean;
    rows?: number;
    inputmode?: 'text' | 'decimal' | 'numeric';
    invalid?: boolean;
  }>(),
  { placeholder: '', disabled: false, multiline: false, rows: 3, inputmode: 'text', invalid: false },
);

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div class="admin-field">
    <textarea
      v-if="multiline"
      v-model="model"
      class="admin-field__input admin-field__input--text admin-text-field__area"
      :class="{ 'admin-text-field--invalid': invalid }"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <input
      v-else
      v-model="model"
      class="admin-field__input admin-field__input--text admin-text-field__input"
      :class="{ 'admin-text-field--invalid': invalid }"
      type="text"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>

<style scoped>
.admin-text-field__input {
  padding-right: 12px;
}
.admin-text-field__area {
  height: auto;
  min-height: 80px;
  padding: 10px 12px;
  resize: vertical;
  line-height: var(--leading-normal);
}
.admin-text-field--invalid {
  border-color: var(--danger-base);
}
</style>
