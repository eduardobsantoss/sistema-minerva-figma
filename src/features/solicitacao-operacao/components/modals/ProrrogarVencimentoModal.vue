<script setup lang="ts">
import { ref } from 'vue';
import { X, Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField } from './adicionar-contrato';

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
  <div
    style="position: fixed; inset: 0; z-index: 100; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
    @click.self="emit('close')"
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Prorrogar Vencimento</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>
      <div class="flex flex-col" style="padding: 24px; gap: 16px">
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
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          :disabled="!novoVencimento.trim()"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
