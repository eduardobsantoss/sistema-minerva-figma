<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { brl, type AgrupamentoLimite, type ProdutoLimite } from '../../data/riscoData';

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
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 480px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Editar Limite</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Altere o valor e a data de vencimento do limite.</p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <div class="flex flex-col" style="gap: 16px">
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Agrupamento</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ agrupamento }}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Produto</div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ produto }}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Valor do limite</div>
            <input v-model="valorInput" placeholder="R$ 0,00" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Atual: {{ brl(valor, { compact: true }) }}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento</div>
            <input v-model="vencimentoInput" type="date" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
        </div>
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
