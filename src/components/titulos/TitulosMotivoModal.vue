<script setup lang="ts">
import { ref } from 'vue';

import Alert from '@/components/feedback/Alert.vue';
import type { TituloSelecionado } from './types';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="md" eyebrow="Títulos" :title="title" :subtitle="subtitle" @close="emit('close')">
    <div style="display: flex; flex-direction: column; gap: 20px">
      <Alert v-if="aviso" type="warning" title="Parte da seleção fica de fora" :message="aviso" :dismissible="false" />
      <label class="lote-field">
        <span class="lote-label">{{ motivoLabel }}</span>
        <AdminSelect v-model="motivo" placeholder="Selecione" :options="[...motivos.map((item) => ({ value: item, label: item }))]" />
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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!motivo" @click="emit('close')" type="button">{{ confirmLabel }}</AdminButton>
    </template>
  </AdminModal>
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
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
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
button:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
