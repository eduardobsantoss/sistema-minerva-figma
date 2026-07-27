<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { SelectField, ToggleRow, StepGrid } from './adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import { brl, solicitacoes, type ContratoAtivo } from '../../data/operacaoData';

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
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 760px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Mesclar ativos entre pedidos
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Transfira ativos deste pedido para outro pedido de destino
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px" class="flex flex-col" :style="{ gap: '20px' }">
        <StepGrid>
          <SelectField
            label="Pedido de destino"
            :options="PEDIDO_OPTS"
            placeholder="Selecione"
            :span="12"
            v-model="pedidoDestino"
          />
        </StepGrid>

        <ToggleRow
          label="Mover todos os ativos do pedido origem"
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

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn-animated"
          :class="{ 'btn-primary': canSubmit }"
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? 'var(--action-primary-text)' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="confirmar"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
