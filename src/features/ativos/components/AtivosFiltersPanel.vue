<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Filter, X } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  EMPTY_FILTERS,
  SITUACAO_OPTS,
  STATUS_TITULO_OPTS,
  VEICULOS_OPTS,
  GRUPOS_OPTS,
  GERENTES_OPTS,
  situacaoLabel,
  statusTituloLabel,
  type AtivosFilters,
} from '../data/ativosData';

const props = defineProps<{ modelValue: AtivosFilters }>();
const emit = defineEmits<{
  apply: [filters: AtivosFilters];
  clear: [];
}>();

const draft = reactive<AtivosFilters>({
  ...EMPTY_FILTERS,
  veiculoIds: [],
  grupoIds: [],
});

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, {
      ...value,
      veiculoIds: [...value.veiculoIds],
      grupoIds: [...value.grupoIds],
    });
  },
  { deep: true, immediate: true },
);

const hasDraft = computed(() => {
  return (
    !!draft.lastro ||
    !!draft.numeroContrato ||
    draft.veiculoIds.length > 0 ||
    draft.grupoIds.length > 0 ||
    !!draft.situacao ||
    !!draft.statusTitulo ||
    !!draft.gerente ||
    !!draft.cessao ||
    !!draft.dataEntradaIni ||
    !!draft.dataEntradaFim ||
    !!draft.dataVencimentoIni ||
    !!draft.dataVencimentoFim
  );
});

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function toggleVeiculo(id: string) {
  const i = draft.veiculoIds.indexOf(id);
  if (i >= 0) draft.veiculoIds.splice(i, 1);
  else draft.veiculoIds.push(id);
}

function toggleGrupo(id: string) {
  const i = draft.grupoIds.indexOf(id);
  if (i >= 0) draft.grupoIds.splice(i, 1);
  else draft.grupoIds.push(id);
}

function handleApply() {
  emit('apply', {
    ...draft,
    veiculoIds: [...draft.veiculoIds],
    grupoIds: [...draft.grupoIds],
  });
}

function handleClear() {
  Object.assign(draft, { ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [] });
  emit('clear');
}
</script>

<template>
  <div class="flex items-center justify-between" style="margin-bottom: 16px">
    <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
      Filtros adicionais
    </span>
    <button
      v-if="hasDraft"
      class="flex items-center"
      style="gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
      @click="handleClear"
    >
      <X :size="12" /> Limpar filtros
    </button>
  </div>

  <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
    <div>
      <div :style="labelStyle">Lastro do título</div>
      <input v-model="draft.lastro" placeholder="Ex: NF-8821" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Número do contrato</div>
      <input v-model="draft.numeroContrato" placeholder="Ex: CT-50342" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Veículo de operação</div>
      <div class="multi-box">
        <label v-for="v in VEICULOS_OPTS" :key="v.id" class="multi-item" @click.prevent="toggleVeiculo(v.id)">
          <Checkbox :checked="draft.veiculoIds.includes(v.id)" @change="toggleVeiculo(v.id)" />
          <span>{{ v.nome }}</span>
        </label>
      </div>
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Grupo empresarial</div>
      <div class="multi-box">
        <label v-for="g in GRUPOS_OPTS" :key="g.id" class="multi-item" @click.prevent="toggleGrupo(g.id)">
          <Checkbox :checked="draft.grupoIds.includes(g.id)" @change="toggleGrupo(g.id)" />
          <span>{{ g.nome }}</span>
        </label>
      </div>
    </div>

    <div>
      <div :style="labelStyle">Situação do título</div>
      <select v-model="draft.situacao" :style="inputStyle">
        <option value="">Todas</option>
        <option v-for="s in SITUACAO_OPTS" :key="s" :value="s">{{ situacaoLabel(s) }}</option>
      </select>
    </div>
    <div>
      <div :style="labelStyle">Status do título</div>
      <select v-model="draft.statusTitulo" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="s in STATUS_TITULO_OPTS" :key="s" :value="s">{{ statusTituloLabel(s) }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Gerente</div>
      <select v-model="draft.gerente" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="g in GERENTES_OPTS" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>
    <div>
      <div :style="labelStyle">Cessão</div>
      <input v-model="draft.cessao" placeholder="Ex: CES-2025-0142" :style="inputStyle" />
    </div>

    <div>
      <div :style="labelStyle">Data entrada inicial</div>
      <input v-model="draft.dataEntradaIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data entrada final</div>
      <input v-model="draft.dataEntradaFim" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data vencimento inicial</div>
      <input v-model="draft.dataVencimentoIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data vencimento final</div>
      <input v-model="draft.dataVencimentoFim" type="date" :style="inputStyle" />
    </div>
  </div>

  <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
    <button
      style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
      @click="handleClear"
    >
      Limpar
    </button>
    <button
      class="flex items-center"
      style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      @click="handleApply"
    >
      <Filter :size="13" /> FILTRAR
    </button>
  </div>
</template>

<style scoped>
.multi-box {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  max-height: 120px;
  overflow-y: auto;
  padding: 6px;
}
.multi-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.multi-item:hover {
  background: var(--surface-sunken);
}
</style>
