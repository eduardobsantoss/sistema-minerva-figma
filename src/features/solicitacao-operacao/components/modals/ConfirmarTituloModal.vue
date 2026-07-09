<script setup lang="ts">
import { ref } from 'vue';
import { X, Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField, SelectField } from './adicionar-contrato';

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
  <div
    style="position: fixed; inset: 0; z-index: 100; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
    @click.self="emit('close')"
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Confirmar Título</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>
      <div style="padding: 24px">
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
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          REGISTRAR CONFIRMAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
