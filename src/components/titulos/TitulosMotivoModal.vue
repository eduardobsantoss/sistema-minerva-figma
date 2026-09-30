<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';
import type { TituloSelecionado } from './types';

defineProps<{
  title: string;
  subtitle: string;
  aviso?: string;
  motivoLabel: string;
  motivos: string[];
  confirmLabel: string;
  titulos: TituloSelecionado[];
}>();

const emit = defineEmits<{ close: [] }>();

const motivo = ref('');

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      class="flex flex-col"
      style="width: 100%; max-width: 760px; max-height: min(85vh, 720px); background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ title }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ subtitle }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px">
        <Alert v-if="aviso" type="warning" title="Parte da seleção fica de fora" :message="aviso" :dismissible="false" />
        <label class="lote-field">
          <span class="lote-label">{{ motivoLabel }}</span>
          <select v-model="motivo" class="lote-input" :data-empty="motivo === ''">
            <option value="" disabled>Selecione</option>
            <option v-for="item in motivos" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="lote-table-row lote-table-head">
            <div>Lastro</div>
            <div>Número</div>
            <div>Valor</div>
            <div>Vencimento</div>
          </div>
          <div v-for="t in titulos" :key="t.id" class="lote-table-row">
            <div>{{ t.lastro || '—' }}</div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.numero }}</div>
            <div class="lote-valor">{{ brl(t.valor) }}</div>
            <div class="lote-vencimento">{{ t.vencimento }}</div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; padding: 16px 22px; border-top: 1px solid var(--border-default); flex-shrink: 0">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="lote-primary" :disabled="!motivo" @click="motivo && emit('close')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.lote-input {
  width: 100%;
  max-width: 360px;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.lote-input[data-empty='true'] {
  color: var(--text-muted);
}
.lote-table-row {
  display: grid;
  grid-template-columns: minmax(72px, 1fr) minmax(96px, 1.15fr) minmax(156px, 1.45fr) minmax(120px, 1fr);
  align-items: center;
  column-gap: 28px;
  padding: 12px 16px;
  font-size: var(--text-sm);
  color: var(--text-default);
  border-top: 1px solid var(--border-default);
}
.lote-valor,
.lote-vencimento {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.lote-valor {
  padding-right: 16px;
}
.lote-table-head {
  background: var(--surface-sunken);
  border-top: none;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.lote-secondary,
.lote-primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
}
.lote-secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
  cursor: pointer;
}
.lote-primary {
  border: none;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  cursor: pointer;
}
.lote-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
.lote-primary:not(:disabled):hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
