<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Pencil, ArrowRight, ArrowLeft, Link2 } from 'lucide-vue-next';
import type { Agrupamento, OperacaoVinculavel } from '../../data/riscoData';
import { SummaryCard, TransferButton, TransferPanel, type FiltroTipo } from './vincular-agrupamento';

interface Props {
  agrupamento: Agrupamento;
  agrupamentos: Agrupamento[];
  operacoes: OperacaoVinculavel[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  edit: [];
  'update:operacoes': [operacoes: OperacaoVinculavel[]];
}>();

const searchLeft = ref('');
const searchRight = ref('');
const filterLeft = ref<FiltroTipo>('TODOS');
const filterRight = ref<FiltroTipo>('TODOS');
const selectedLeft = ref<Set<string>>(new Set());
const selectedRight = ref<Set<string>>(new Set());

const disponiveis = computed(() => props.operacoes.filter((o) => !o.agrupamentoIds.includes(props.agrupamento.id)));
const vinculadas = computed(() => props.operacoes.filter((o) => o.agrupamentoIds.includes(props.agrupamento.id)));

function filtrarOperacoes(list: OperacaoVinculavel[], filtro: FiltroTipo, search: string): OperacaoVinculavel[] {
  const needle = search.trim().toLowerCase();
  return list.filter((o) => {
    if (filtro !== 'TODOS' && o.tipo !== filtro) return false;
    if (needle && !o.nome.toLowerCase().includes(needle)) return false;
    return true;
  });
}

const disponiveisFiltradas = computed(() => filtrarOperacoes(disponiveis.value, filterLeft.value, searchLeft.value));
const vinculadasFiltradas = computed(() => filtrarOperacoes(vinculadas.value, filterRight.value, searchRight.value));

const crasVinculados = computed(() => vinculadas.value.filter((o) => o.tipo === 'CRA').length);
const fidcsVinculados = computed(() => vinculadas.value.filter((o) => o.tipo === 'FIDC').length);

function toggle(set: Set<string>, assign: (s: Set<string>) => void, id: string) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  assign(next);
}

function handleVincular() {
  if (selectedLeft.value.size === 0) return;
  emit(
    'update:operacoes',
    props.operacoes.map((o) =>
      selectedLeft.value.has(o.id) ? { ...o, agrupamentoIds: [...o.agrupamentoIds, props.agrupamento.id] } : o,
    ),
  );
  selectedLeft.value = new Set();
}

function handleDesvincular() {
  if (selectedRight.value.size === 0) return;
  emit(
    'update:operacoes',
    props.operacoes.map((o) =>
      selectedRight.value.has(o.id) ? { ...o, agrupamentoIds: o.agrupamentoIds.filter((id) => id !== props.agrupamento.id) } : o,
    ),
  );
  selectedRight.value = new Set();
}
</script>

<template>
  <div
    style="
      position: fixed; inset: 0;
      background: rgba(8,60,74,0.55); backdrop-filter: blur(8px);
      z-index: 400; display: flex; align-items: center; justify-content: center;
      padding: 32px; animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 1040px; max-height: 92vh;
        overflow: hidden; box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header — claro, conforme tokens (sem faixa teal) -->
      <div class="flex items-center justify-between" style="padding: 20px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div class="flex items-center" style="gap: 10px">
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: 0.02em; text-transform: uppercase">
            Agrupamento: {{ agrupamento.nome }}
          </h2>
          <button
            aria-label="Editar agrupamento"
            title="Editar agrupamento"
            class="flex items-center justify-center"
            style="width: 30px; height: 30px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
            @click="emit('edit')"
          >
            <Pencil :size="13" />
          </button>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex flex-col" style="padding: 24px; gap: 20px; overflow: auto">
        <!-- Cards de resumo — somente leitura, calculados -->
        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
          <SummaryCard label="CRAs vinculados" :value="crasVinculados" />
          <SummaryCard label="FIDCs vinculados" :value="fidcsVinculados" />
          <SummaryCard label="Total" :value="vinculadas.length" strong />
        </div>

        <!-- Transferência dupla -->
        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 20px">
          <div class="flex items-center" style="gap: 8px; margin-bottom: 14px">
            <Link2 :size="14" style="color: var(--text-muted)" />
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
              Operações Vinculadas
            </span>
          </div>

          <div class="grid" style="grid-template-columns: 1fr 140px 1fr; gap: 16px; align-items: stretch">
            <TransferPanel
              :title="`Disponíveis (${disponiveisFiltradas.length})`"
              :search="searchLeft"
              :filter="filterLeft"
              :items="disponiveisFiltradas"
              :agrupamentos="agrupamentos"
              :selected="selectedLeft"
              @update:search="searchLeft = $event"
              @update:filter="filterLeft = $event"
              @toggle-item="toggle(selectedLeft, (s) => (selectedLeft = s), $event)"
            />

            <!-- Ações centrais -->
            <div class="flex flex-col items-center justify-center" style="gap: 10px">
              <TransferButton
                :icon="ArrowRight"
                label="Vincular"
                :active="selectedLeft.size > 0"
                @click="handleVincular"
              />
              <TransferButton
                :icon="ArrowLeft"
                label="Desvincular"
                :active="selectedRight.size > 0"
                reverse
                @click="handleDesvincular"
              />
            </div>

            <TransferPanel
              :title="`Vinculadas (${vinculadasFiltradas.length})`"
              :search="searchRight"
              :filter="filterRight"
              :items="vinculadasFiltradas"
              :agrupamentos="agrupamentos"
              :selected="selectedRight"
              @update:search="searchRight = $event"
              @update:filter="filterRight = $event"
              @toggle-item="toggle(selectedRight, (s) => (selectedRight = s), $event)"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 14px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card); flex-shrink: 0">
        <button
          style="height: 40px; padding: 0 20px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>
