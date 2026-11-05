<script setup lang="ts">
import { computed, ref } from 'vue';

import { SelectField, ToggleRow, StepGrid } from './adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import { brl, solicitacoes, type ContratoAtivo } from '../../data/operacaoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{
  pedidoOrigemId: string;
  ativos: ContratoAtivo[];
}>();

const emit = defineEmits<{
  close: [];
  confirm: [
    payload: {
      pedidoDestinoId: string;
      moverTodos: boolean;
      ativoIds: string[];
    },
  ];
}>();

const PEDIDO_OPTS = solicitacoes
  .filter((s) => s.id !== props.pedidoOrigemId)
  .map((s) => `${s.id} · ${s.cedente}`);

const pedidoDestino = ref('');
const moverTodos = ref(false);
const selected = ref<Set<string>>(new Set());

const selectedCount = computed(() => selected.value.size);
const allSelected = computed(
  () => props.ativos.length > 0 && selected.value.size === props.ativos.length,
);

const canSubmit = computed(() => {
  if (!pedidoDestino.value.trim()) return false;
  if (moverTodos.value) return true;
  return selected.value.size > 0;
});

function pedidoIdFromLabel(label: string): string {
  return label.split(' · ')[0]?.trim() ?? label;
}

function toggleOne(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}

function toggleAll() {
  if (allSelected.value) {
    selected.value = new Set();
    return;
  }
  selected.value = new Set(props.ativos.map((a) => a.id));
}

function confirmar() {
  if (!canSubmit.value) return;
  emit('confirm', {
    pedidoDestinoId: pedidoIdFromLabel(pedidoDestino.value),
    moverTodos: moverTodos.value,
    ativoIds: moverTodos.value ? props.ativos.map((a) => a.id) : [...selected.value],
  });
  emit('close');
}
</script>

<template>
  <AdminModal size="md" eyebrow="Solicitação" title="Mesclar ativos entre solicitações" subtitle="Transfira ativos desta solicitação para outra solicitação de destino" @close="emit('close')">
    <div class="flex flex-col" :style="{ gap: '20px' }">
      <StepGrid>
        <SelectField
          label="Solicitação de destino"
          :options="PEDIDO_OPTS"
          placeholder="Selecione"
          :span="12"
          v-model="pedidoDestino"
        />
      </StepGrid>

      <ToggleRow
        label="Mover todos os ativos da solicitação origem"
        :on="moverTodos"
        compact
        @toggle="moverTodos = !moverTodos"
      />

      <div
        v-if="!moverTodos"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
      >
        <div
          class="flex items-center justify-between"
          style="padding: 12px 16px; background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)"
        >
          <label
            class="flex items-center"
            style="gap: 10px; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"
          >
            <Checkbox :checked="allSelected" @change="toggleAll" />
            Selecionar todos
          </label>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)">
            {{ selectedCount }} selecionado(s)
          </span>
        </div>

        <div
          v-if="ativos.length === 0"
          style="
            margin: 16px;
            padding: 28px 20px;
            text-align: center;
            border-radius: var(--radius-lg);
            background: color-mix(in srgb, var(--gci-base) 6%, transparent);
            font-size: var(--text-sm);
            color: var(--text-muted);
          "
        >
          Nenhum ativo disponível para seleção
        </div>

        <template v-else>
          <div
            class="grid"
            style="
              grid-template-columns: 48px 0.9fr 1.2fr 1.2fr 0.75fr 1fr;
              padding: 10px 16px;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              border-bottom: 1px solid var(--border-default);
            "
          >
            <div>Sel.</div>
            <div>Lastro</div>
            <div>Cedente</div>
            <div>Sacado</div>
            <div>Número</div>
            <div style="text-align: right">Valor nominal</div>
          </div>
          <div
            v-for="a in ativos"
            :key="a.id"
            class="grid items-center"
            style="
              grid-template-columns: 48px 0.9fr 1.2fr 1.2fr 0.75fr 1fr;
              padding: 12px 16px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
              cursor: pointer;
            "
            @click="toggleOne(a.id)"
          >
            <div @click.stop>
              <Checkbox :checked="selected.has(a.id)" @change="toggleOne(a.id)" />
            </div>
            <div style="color: var(--text-default)">{{ a.lastro || a.tipo }}</div>
            <div style="color: var(--text-strong); font-weight: var(--weight-semibold); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ a.cedenteNome }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ a.sacadoNome }}
            </div>
            <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.numero }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-strong); font-weight: var(--weight-semibold)">
              {{ brl(a.valorTotal) }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="confirmar" type="button">Confirmar</AdminButton>
    </template>
  </AdminModal>
</template>
