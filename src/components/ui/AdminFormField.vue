<script setup lang="ts">
/**
 * Rótulo + controle + mensagem de erro/ajuda (campo padrão do DS, 40px).
 * Rótulo: 10px, bold, maiúsculas, letter-spacing 0.12em, --text-muted.
 * O controle entra no slot (AdminSelect, AdminDateField, AdminTextField...).
 */
defineProps<{
  label?: string;
  error?: string;
  hint?: string;
}>();
</script>

<template>
  <div class="admin-form-field">
    <span v-if="label" class="admin-form-field__label">{{ label }}</span>
    <slot />
    <span v-if="error" class="admin-form-field__error">{{ error }}</span>
    <span v-else-if="hint" class="admin-form-field__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.admin-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.admin-form-field__label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.admin-form-field__error {
  font-size: var(--text-xs);
  color: var(--danger-base);
}
.admin-form-field__hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
}
</style>
