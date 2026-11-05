<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{ ativos: ContratoAtivo[] }>();
const emit = defineEmits<{ close: []; confirm: [data: { novoVencimento: string; motivo: string }] }>();

const novoVencimento = ref('');
const motivo = ref('');

function salvar() {
  if (!novoVencimento.value.trim()) return;
  emit('confirm', { novoVencimento: novoVencimento.value, motivo: motivo.value });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Prorrogar Vencimento" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <FormField label="Novo vencimento" placeholder="dd/mm/aaaa" v-model="novoVencimento" required />
      <div>
        <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">CARTA DE CORREÇÃO</label>
        <button
          class="flex items-center"
          style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
        >
          <Upload :size="16" /> Selecionar arquivo
        </button>
      </div>
      <div>
        <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">MOTIVO DA PRORROGAÇÃO</label>
        <textarea
          v-model="motivo"
          rows="3"
          placeholder="Descreva o motivo da prorrogação..."
          style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
        />
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!novoVencimento.trim()" @click="salvar">Confirmar</AdminButton>
    </template>
  </AdminModal>
</template>
