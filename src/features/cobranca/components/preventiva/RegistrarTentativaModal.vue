<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Upload } from 'lucide-vue-next';
import {
  CANAL_CONTATO_OPTS,
  STATUS_PREVENTIVO,
  canalLabel,
  type CanalContato,
  type StatusPreventivo,
  type TentativaRegistro,
} from '../../data/cobrancaPreventivaData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ quantidadeTitulos: number }>();
const emit = defineEmits<{
  close: [];
  save: [payload: { observacoes: string; tentativas: TentativaRegistro[] }];
}>();

interface Linha {
  status: StatusPreventivo | '';
  dataContato: string;
  canal: CanalContato | '';
  quantidade: number;
  anexoNome: string;
}

function linhaVazia(): Linha {
  return {
    status: '',
    dataContato: '2026-10-08',
    canal: '',
    quantidade: 1,
    anexoNome: '',
  };
}

const linhas = ref<Linha[]>([linhaVazia()]);
const observacoes = ref('');
const erro = ref('');

function adicionar() {
  linhas.value = [...linhas.value, linhaVazia()];
}

function onFile(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  linhas.value[index].anexoNome = input.files?.[0]?.name ?? '';
}

function salvar() {
  const incompleta = linhas.value.some((l) => !l.status || !l.canal || !l.dataContato || l.quantidade < 1);
  if (incompleta) {
    erro.value = 'Preencha status, data, canal e quantidade em cada tentativa.';
    return;
  }
  erro.value = '';
  emit('save', {
    observacoes: observacoes.value.trim(),
    tentativas: linhas.value.map((l) => ({
      status: l.status as StatusPreventivo,
      dataContato: l.dataContato,
      canal: l.canal as CanalContato,
      quantidade: l.quantidade,
      anexoNome: l.anexoNome,
    })),
  });
}
</script>

<template>
  <AdminModal size="md" eyebrow="Cobrança" title="Registrar tentativa" :subtitle="props.quantidadeTitulos === 1 ? '1 título selecionado' : `${props.quantidadeTitulos} títulos selecionados`" @close="emit('close')">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div
        v-for="(linha, index) in linhas"
        :key="index"
        class="grid"
        style="grid-template-columns: 1fr 1fr; gap: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border-default)"
      >
        <label class="field">
          <span class="label">Status</span>
          <AdminSelect v-model="linha.status" placeholder="Selecione" :options="[...STATUS_PREVENTIVO.map((s) => ({ value: s.key, label: s.label }))]" />
        </label>
        <label class="field">
          <span class="label">Data do contato</span>
          <AdminDateField v-model="linha.dataContato" />
        </label>
        <label class="field">
          <span class="label">Canal de contato</span>
          <AdminSelect v-model="linha.canal" placeholder="Selecione" :options="[...CANAL_CONTATO_OPTS.map((c) => ({ value: c, label: canalLabel(c) }))]" />
        </label>
        <label class="field">
          <span class="label">Quantidade de tentativas</span>
          <input v-model.number="linha.quantidade" type="number" min="1" class="input" />
        </label>
        <label class="field" style="grid-column: 1 / -1">
          <span class="label">Anexo (opcional)</span>
          <span class="file">
            <Upload :size="16" />
            <input type="file" @change="onFile(index, $event)" />
            {{ linha.anexoNome || 'Selecionar arquivo' }}
          </span>
        </label>
      </div>

      <button type="button" class="add" @click="adicionar">
        <Plus :size="14" /> Adicionar tentativa
      </button>

      <label class="field">
        <span class="label">Observações</span>
        <textarea v-model="observacoes" rows="3" class="input" style="height: auto; padding: 12px 14px; resize: vertical; font-family: inherit" />
      </label>
      <p v-if="erro" style="font-size: var(--text-xs); color: var(--danger-base)">{{ erro }}</p>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="salvar" type="button">Salvar</AdminButton>

    </template>
  </AdminModal>
</template>

<style scoped>
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.input[data-empty='true'] {
  color: var(--text-muted);
}
.file {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-sunken);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-size: var(--text-sm);
  overflow: hidden;
}
.file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gci-base);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
