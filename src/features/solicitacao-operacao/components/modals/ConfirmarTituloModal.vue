<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField, SelectField } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ ativos: ContratoAtivo[] }>();
const emit = defineEmits<{ close: []; confirm: [data: { status: string; data: string; observacao: string }] }>();

const STATUS_OPTS = ['CONFIRMADO', 'REJEITADO', 'PENDENTE'];
const status = ref('CONFIRMADO');
const dataConfirmacao = ref('');
const observacao = ref('');

function salvar() {
  emit('confirm', { status: status.value, data: dataConfirmacao.value, observacao: observacao.value });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Confirmar Título" @close="emit('close')">
    <div>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
        {{ ativos.length }} título(s) selecionado(s)
      </p>
      <div class="flex flex-col" style="gap: 16px">
        <SelectField label="Status da confirmação" :options="STATUS_OPTS" placeholder="Selecione" v-model="status" />
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">EVIDÊNCIA</label>
          <button
            class="flex items-center"
            style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
          >
            <Upload :size="16" /> Selecionar arquivo
          </button>
        </div>
        <FormField label="Dia/Hora da confirmação" placeholder="dd/mm/aaaa hh:mm" v-model="dataConfirmacao" />
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">OBSERVAÇÃO</label>
          <textarea
            v-model="observacao"
            rows="3"
            placeholder="Observações sobre a confirmação..."
            style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="salvar">Registrar confirmação</AdminButton>
    </template>
  </AdminModal>
</template>
