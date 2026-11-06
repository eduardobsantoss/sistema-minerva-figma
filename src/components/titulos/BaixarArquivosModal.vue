<script setup lang="ts">
import { ref } from 'vue';

import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: [] }>();

const tiposArquivo = ['Boletos', 'Garantias', 'Duplicata', 'Canhoto de Nota', 'Notificação de Cessão'];

const tipoArquivo = ref('');
const enviarSacado = ref(false);
const mensagem = ref('');
</script>

<template>
  <AdminModal size="sm" eyebrow="Títulos" title="Baixar arquivos" subtitle="Tipo de arquivo e envio para o sacado" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px;">
      <label class="lote-field">
        <span class="lote-label">Tipo de arquivo</span>
        <AdminSelect v-model="tipoArquivo" placeholder="Selecione" :options="[...tiposArquivo.map((tipo) => ({ value: tipo, label: tipo }))]" />
      </label>

      <button type="button" class="lote-switch" @click="enviarSacado = !enviarSacado">
        <span>Enviar para o sacado</span>
        <span class="lote-switch-track" :data-on="enviarSacado">
          <span class="lote-switch-knob" />
        </span>
      </button>

      <label class="lote-field">
        <span class="lote-label">Mensagem personalizada</span>
        <textarea
          v-model="mensagem"
          rows="4"
          placeholder="Opcional. Essa mensagem vai no corpo do e-mail."
          class="lote-input"
          style="height: auto; padding: 12px 14px; resize: vertical; font-family: inherit"
        />
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('close')" type="button">Baixar arquivos</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.lote-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.lote-input[data-empty='true'] {
  color: var(--text-muted);
}
.lote-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
  text-align: left;
}
.lote-switch-track {
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: var(--border-default);
  position: relative;
  flex-shrink: 0;
}
.lote-switch-track[data-on='true'] {
  background: var(--success-base);
}
.lote-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: var(--surface-card);
  box-shadow: var(--shadow-sm);
  transition: left var(--duration-base);
}
.lote-switch-track[data-on='true'] .lote-switch-knob {
  left: 23px;
}
button:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
