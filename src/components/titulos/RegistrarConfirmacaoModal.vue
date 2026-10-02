<script setup lang="ts">
import { computed, ref } from 'vue';
import { Upload, X } from 'lucide-vue-next';

const props = withDefaults(defineProps<{ quantidade?: number }>(), { quantidade: 1 });
const emit = defineEmits<{ close: [] }>();

const rotuloConfirmar = computed(() =>
  props.quantidade === 1 ? 'Registrar confirmação do título' : 'Registrar confirmações dos títulos',
);

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
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 640px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Registrar confirmação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Status, evidência, data e observação
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
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

      <div class="lote-footer">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="lote-primary" @click="emit('close')">{{ rotuloConfirmar }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.lote-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 0 22px 20px;
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
