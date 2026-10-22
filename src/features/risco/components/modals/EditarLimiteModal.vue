<script setup lang="ts">
import { ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { brl, type AgrupamentoLimite, type ProdutoLimite } from '../../data/riscoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';

interface Props {
  agrupamento: AgrupamentoLimite;
  produto: ProdutoLimite;
  valor: number;
  vencimento: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: []; confirm: [valor: number, vencimento: string] }>();

function parseDateISO(d: string): string {
  if (!d) return '';
  const [dd, mm, yyyy] = d.split('/');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateBR(iso: string): string {
  if (!iso) return '';
  const [yyyy, mm, dd] = iso.split('-');
  return `${dd}/${mm}/${yyyy}`;
}

function parseValor(v: string): number {
  return Number(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

const valorInput = ref(props.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
const vencimentoInput = ref(parseDateISO(props.vencimento));

function canConfirm() {
  return valorInput.value.trim() !== '' && vencimentoInput.value !== '';
}

function handleConfirm() {
  if (!canConfirm()) return;
  emit('confirm', parseValor(valorInput.value), formatDateBR(vencimentoInput.value));
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Risco · Grupos" title="Editar Limite" subtitle="Altere o valor e a data de vencimento do limite." @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Agrupamento</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ agrupamento }}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Produto</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ produto }}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Valor do limite</div>
        <input v-model="valorInput" placeholder="R$ 0,00" style="background: var(--surface-card); width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Atual: {{ brl(valor, { compact: true }) }}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento</div>
        <AdminDateField v-model="vencimentoInput" />
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm()" @click="handleConfirm">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
