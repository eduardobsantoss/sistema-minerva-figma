<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import { brl } from '../../data/operacaoData';
import { FormField } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{
  valorAtual: number;
  feePercent: number;
}>();
const emit = defineEmits<{ close: []; confirm: [valor: number] }>();

const input = ref('');

watch(
  () => props.valorAtual,
  (v) => {
    input.value = formatInput(v);
  },
  { immediate: true },
);

function formatInput(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBrl(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const novoValor = computed(() => parseBrl(input.value));
const novoFee = computed(() => (novoValor.value != null ? (novoValor.value * props.feePercent) / 100 : null));
const canConfirm = computed(() => novoValor.value != null && novoValor.value !== props.valorAtual);

function salvar() {
  if (novoValor.value == null || !canConfirm.value) return;
  emit('confirm', novoValor.value);
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Editar valor da operação" :subtitle="`Atual: ${brl(valorAtual)}`" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <FormField label="Novo valor (R$)" placeholder="0,00" v-model="input" required />

      <div
        style="
          padding: 14px 16px;
          background: var(--surface-sunken);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
        "
      >
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
          Prévia do impacto
        </div>
        <div class="flex items-center justify-between" style="margin-bottom: 8px">
          <span style="font-size: var(--text-sm); color: var(--text-muted)">FEE ({{ feePercent }}%)</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ novoFee != null ? brl(novoFee) : '—' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span style="font-size: var(--text-sm); color: var(--text-muted)">Valor da operação</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ novoValor != null ? brl(novoValor) : '—' }}
          </span>
        </div>
      </div>

      <div
        class="flex items-start"
        style="gap: 8px; font-size: var(--text-xs); color: var(--warning-dark); font-weight: var(--weight-semibold)"
      >
        <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
        Alterar o valor recalcula o Valor FEE e pode afetar validações e ativos vinculados.
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canConfirm" @click="salvar">Confirmar</AdminButton>
    </template>
  </AdminModal>
</template>
