<script setup lang="ts">
import { ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import {
  AGRUPAMENTO_LIMITE_OPTS, PRODUTO_LIMITE_OPTS,
  type LimiteProdutoRow, type AgrupamentoLimite, type ProdutoLimite,
} from '../../data/riscoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

const emit = defineEmits<{ close: []; confirm: [rows: LimiteProdutoRow[]] }>();

interface DraftRow {
  id: string;
  produto: ProdutoLimite | '';
  valor: string;
  vencimento: string;
}

const agrupamento = ref<AgrupamentoLimite | ''>('');
const rows = ref<DraftRow[]>([]);

function addRow() {
  rows.value.push({ id: `draft-${Date.now()}`, produto: '', valor: '', vencimento: '' });
}

function removeRow(id: string) {
  rows.value = rows.value.filter((r) => r.id !== id);
}

function parseValor(v: string): number {
  return Number(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function formatDateBR(iso: string): string {
  if (!iso) return '';
  const [yyyy, mm, dd] = iso.split('-');
  return `${dd}/${mm}/${yyyy}`;
}

function canConfirm() {
  return agrupamento.value !== '' && rows.value.length > 0 && rows.value.every((r) => r.produto && r.valor && r.vencimento);
}

function handleConfirm() {
  if (!canConfirm() || !agrupamento.value) return;
  const result: LimiteProdutoRow[] = rows.value.map((r, i) => ({
    id: `lim-new-${Date.now()}-${i}`,
    agrupamento: agrupamento.value as AgrupamentoLimite,
    produto: r.produto as ProdutoLimite,
    valor: parseValor(r.valor),
    vencimento: formatDateBR(r.vencimento),
  }));
  emit('confirm', result);
}
</script>

<template>
  <AdminModal size="md" eyebrow="Risco · Grupos" title="Incluir Limite" subtitle="Selecione o agrupamento e adicione produtos com seus limites." @close="emit('close')">
    <div style="margin-bottom: 20px">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Agrupamento de operações</div>
      <AdminSelect v-model="agrupamento" :options="[{ value: '', label: 'Selecione' }, ...AGRUPAMENTO_LIMITE_OPTS.map((a) => ({ value: a, label: a }))]" />
    </div>

    <template v-if="agrupamento">
      <div class="flex items-center justify-between" style="margin-bottom: 12px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Produtos</div>
        <button class="flex items-center" style="gap: 4px; height: 30px; padding: 0 10px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)" @click="addRow">
          <Plus :size="12" /> Adicionar produto
        </button>
      </div>

      <div v-if="rows.length === 0" style="padding: 20px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
        Clique em "Adicionar produto" para incluir limites.
      </div>

      <div v-for="row in rows" :key="row.id" class="flex flex-col" style="gap: 10px; padding: 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); margin-bottom: 10px">
        <div class="flex items-center justify-between">
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted)">Produto</span>
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 24px; height: 24px; border: none; background: none; cursor: pointer; color: var(--action-danger-text-only)" @click="removeRow(row.id)">
            <Trash2 :size="12" />
          </button>
        </div>
        <AdminSelect v-model="row.produto" :options="[{ value: '', label: 'Selecione o produto' }, ...PRODUTO_LIMITE_OPTS.map((p) => ({ value: p, label: p }))]" />
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px">
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Valor do limite</div>
            <input v-model="row.valor" placeholder="R$ 0,00" style="background: var(--surface-card); width: 100%; height: 40px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Vencimento</div>
            <AdminDateField v-model="row.vencimento" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm()" @click="handleConfirm">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
