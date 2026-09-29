<script setup lang="ts">
import { ref } from 'vue';
import { Upload, X } from 'lucide-vue-next';

const emit = defineEmits<{ close: [] }>();

const statusConfirmacao = [
  'PENDENTE',
  'PRÉ-CONFIRMADO',
  'NÃO CONFIRMADO',
  'CONFIRMADO',
  'DISPENSADO',
  'AGUARDANDO CONFIRMAÇÃO',
];

const status = ref('');
const evidenciaNome = ref('');
const dia = ref('');
const hora = ref('');
const observacao = ref('');
const fileRef = ref<HTMLInputElement | null>(null);

function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  evidenciaNome.value = input.files?.[0]?.name ?? '';
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="width: 100%; max-width: 640px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 22px 16px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
          Registrar confirmação
        </h3>
        <button type="button" aria-label="Fechar" class="lote-icon-btn" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 20px 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
        <label class="lote-field">
          <span class="lote-label">Status da confirmação</span>
          <select v-model="status" class="lote-input" :data-empty="status === ''">
            <option value="" disabled>Selecione</option>
            <option v-for="item in statusConfirmacao" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <div class="lote-field">
          <span class="lote-label">Evidência</span>
          <input ref="fileRef" type="file" style="display: none" @change="onFile" />
          <button type="button" class="lote-file" @click="fileRef?.click()">
            <Upload :size="16" />
            {{ evidenciaNome || 'Selecionar arquivo' }}
          </button>
        </div>

        <label class="lote-field">
          <span class="lote-label">Dia da confirmação</span>
          <input v-model="dia" type="date" class="lote-input" />
        </label>

        <label class="lote-field">
          <span class="lote-label">Hora da confirmação</span>
          <input v-model="hora" type="time" class="lote-input" />
        </label>

        <label class="lote-field" style="grid-column: 1 / -1">
          <span class="lote-label">Observação</span>
          <textarea
            v-model="observacao"
            rows="3"
            class="lote-input"
            style="height: auto; padding: 12px 14px; resize: vertical; font-family: inherit"
          />
        </label>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; padding: 0 22px 20px">
        <button type="button" class="lote-secondary" @click="emit('close')">Fechar</button>
        <button type="button" class="lote-primary" @click="emit('close')">Registrar confirmação</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.lote-input,
.lote-file {
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
.lote-file {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-sunken);
  border-style: dashed;
  color: var(--text-muted);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
}
.lote-secondary,
.lote-primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lote-secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.lote-primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
.lote-primary:hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
