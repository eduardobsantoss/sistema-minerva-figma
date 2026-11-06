<script setup lang="ts">
import { computed, ref } from 'vue';

import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = withDefaults(defineProps<{ quantidade?: number }>(), { quantidade: 1 });
const emit = defineEmits<{ close: []; confirm: [texto: string] }>();

const texto = ref('');
const pode = computed(() => texto.value.trim().length > 0);
const subtitulo = computed(() =>
  props.quantidade === 1
    ? 'A observação fica registrada no título selecionado'
    : `A observação fica registrada nos ${props.quantidade} títulos selecionados`,
);

function confirmar() {
  if (!pode.value) return;
  emit('confirm', texto.value.trim());
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Títulos" title="Inserir observação de cobrança" :subtitle="subtitulo" @close="emit('close')">
    <div>
      <label class="obs-field">
        <span class="obs-label">Observação</span>
        <textarea
          v-model="texto"
          rows="5"
          class="obs-input"
          placeholder="Descreva o contato ou a combinação feita com o sacado"
        />
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!pode" @click="confirmar" type="button">Inserir observação</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.obs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.obs-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.obs-input {
  width: 100%;
  padding: 12px 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
  resize: vertical;
  font-family: inherit;
}
textarea:focus-visible,
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
