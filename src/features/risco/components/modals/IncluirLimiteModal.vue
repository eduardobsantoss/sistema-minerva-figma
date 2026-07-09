<script setup lang="ts">
import { ref } from 'vue';
import { X, Plus, Trash2 } from 'lucide-vue-next';
import {
  AGRUPAMENTO_LIMITE_OPTS, PRODUTO_LIMITE_OPTS,
  type LimiteProdutoRow, type AgrupamentoLimite, type ProdutoLimite,
} from '../../data/riscoData';

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
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 560px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg); max-height: 90vh" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Incluir Limite</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Selecione o agrupamento e adicione produtos com seus limites.</p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px; overflow-y: auto; flex: 1">
        <div style="margin-bottom: 20px">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Agrupamento de operações</div>
          <select
            v-model="agrupamento"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Selecione</option>
            <option v-for="a in AGRUPAMENTO_LIMITE_OPTS" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>

        <template v-if="agrupamento">
          <div class="flex items-center justify-between" style="margin-bottom: 12px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Produtos</div>
            <button class="flex items-center" style="gap: 4px; height: 30px; padding: 0 10px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)" @click="addRow">
              <Plus :size="12" /> Adicionar produto
            </button>
          </div>

          <div v-if="rows.length === 0" style="padding: 20px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
            Clique em "Adicionar produto" para incluir limites.
          </div>

          <div v-for="row in rows" :key="row.id" class="flex flex-col" style="gap: 10px; padding: 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); margin-bottom: 10px">
            <div class="flex items-center justify-between">
              <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted)">Produto</span>
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 24px; height: 24px; border: none; background: none; cursor: pointer; color: var(--action-danger-text-only)" @click="removeRow(row.id)">
                <Trash2 :size="12" />
              </button>
            </div>
            <select v-model="row.produto" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option value="">Selecione o produto</option>
              <option v-for="p in PRODUTO_LIMITE_OPTS" :key="p" :value="p">{{ p }}</option>
            </select>
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px">
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Valor do limite</div>
                <input v-model="row.valor" placeholder="R$ 0,00" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Vencimento</div>
                <input v-model="row.vencimento" type="date" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          :disabled="!canConfirm()"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canConfirm() ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canConfirm() ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm() ? '#fff' : 'var(--text-disabled)',
          }"
          @click="handleConfirm"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
