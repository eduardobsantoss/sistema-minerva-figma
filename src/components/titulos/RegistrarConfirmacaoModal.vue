<script setup lang="ts">
import { computed, ref } from 'vue';
import { Upload } from 'lucide-vue-next';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminTimeField from '@/components/ui/AdminTimeField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="md" eyebrow="Títulos" title="Registrar confirmação" subtitle="Status, evidência, data e observação" @close="emit('close')">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
      <div class="lote-field">
        <span class="lote-label">Status da confirmação</span>
        <AdminSelect v-model="status" :options="statusConfirmacao" />
      </div>

      <div class="lote-field">
        <span class="lote-label">Evidência</span>
        <input ref="fileRef" type="file" style="display: none" @change="onFile" />
        <button type="button" class="lote-file" @click="fileRef?.click()">
          <Upload :size="16" />
          {{ evidenciaNome || 'Selecionar arquivo' }}
        </button>
      </div>

      <div class="lote-field">
        <span class="lote-label">Dia da confirmação</span>
        <AdminDateField v-model="dia" />
      </div>

      <div class="lote-field">
        <span class="lote-label">Hora da confirmação</span>
        <AdminTimeField v-model="hora" />
      </div>

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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('close')" type="button">{{ rotuloConfirmar }}</AdminButton>
    </template>
  </AdminModal>
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
  letter-spacing: 0.12em;
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
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
