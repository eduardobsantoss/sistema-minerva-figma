<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { ChevronDown, Filter, X } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  EMPTY_FILTERS,
  SITUACAO_OPTS,
  STATUS_TITULO_OPTS,
  TIPO_ATIVO_OPTS,
  VEICULOS_OPTS,
  GRUPOS_OPTS,
  GERENTES_OPTS,
  situacaoLabel,
  statusTituloLabel,
  type AtivosFilters,
} from '../data/ativosData';

const props = defineProps<{
  modelValue: AtivosFilters;
  view: 'contratos' | 'titulos';
}>();
const emit = defineEmits<{
  apply: [filters: AtivosFilters];
  clear: [];
}>();

const draft = reactive<AtivosFilters>({ ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [] });
const openMenu = ref<'veiculo' | 'grupo' | null>(null);
const veiculoBtn = ref<HTMLButtonElement | null>(null);
const grupoBtn = ref<HTMLButtonElement | null>(null);
const menuBox = ref({ top: 0, left: 0, width: 280, maxHeight: 240 });

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
  if (props.view === 'contratos') {
    return (
      draft.veiculoIds.length > 0 ||
      draft.grupoIds.length > 0 ||
      !!draft.tipoAtivo ||
      !!draft.dataEntradaIni ||
      !!draft.dataEntradaFim ||
      !!draft.dataVencimentoIni ||
      !!draft.dataVencimentoFim
    );
  }
  return (
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

function toggleId(list: string[], id: string) {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.push(id);
}

function summary(ids: string[], options: { id: string; nome: string }[]) {
  if (!ids.length) return 'Todos';
  if (ids.length === 1) return options.find((o) => o.id === ids[0])?.nome ?? '1 selecionado';
  return `${ids.length} selecionados`;
}

function placeMenu(which: 'veiculo' | 'grupo') {
  const btn = which === 'veiculo' ? veiculoBtn.value : grupoBtn.value;
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const width = Math.max(rect.width, 240);
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
  const spaceBelow = window.innerHeight - rect.bottom - 16;
  const maxHeight = Math.min(240, Math.max(120, spaceBelow));
  menuBox.value = { top: rect.bottom + 6, left, width, maxHeight };
}

function toggleMenu(which: 'veiculo' | 'grupo') {
  if (openMenu.value === which) {
    openMenu.value = null;
    return;
  }
  openMenu.value = which;
  placeMenu(which);
}

function handleApply() {
  openMenu.value = null;
  emit('apply', {
    ...draft,
    veiculoIds: [...draft.veiculoIds],
    grupoIds: [...draft.grupoIds],
  });
}

function handleClear() {
  openMenu.value = null;
  const keep = {
    numeroContrato: props.view === 'contratos' ? draft.numeroContrato : '',
    numeroTitulo: draft.numeroTitulo,
    lastro: draft.lastro,
    veiculoBusca: draft.veiculoBusca,
    cedente: draft.cedente,
    sacado: draft.sacado,
  };
  Object.assign(draft, { ...EMPTY_FILTERS, veiculoIds: [], grupoIds: [], ...keep });
  emit('clear');
}
</script>

<template>
  <div class="flex items-center justify-between" style="margin-bottom: 16px">
    <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
      {{ view === 'contratos' ? 'Filtros de contratos' : 'Filtros de títulos' }}
    </span>
    <button
      v-if="hasDraft"
      type="button"
      class="flex items-center"
      style="gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
      @click="handleClear"
    >
      <X :size="12" /> Limpar filtros
    </button>
  </div>

  <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
    <div v-if="view === 'titulos'" style="grid-column: 1 / -1">
      <div :style="labelStyle">Número do contrato</div>
      <input v-model="draft.numeroContrato" placeholder="Ex: CT-50342" :style="inputStyle" />
    </div>

    <div>
      <div :style="labelStyle">Veículos de operação</div>
      <button ref="veiculoBtn" type="button" class="drop-trigger" @click="toggleMenu('veiculo')">
        <span class="drop-label">{{ summary(draft.veiculoIds, VEICULOS_OPTS) }}</span>
        <ChevronDown :size="14" :style="{ transform: openMenu === 'veiculo' ? 'rotate(180deg)' : 'none' }" />
      </button>
    </div>

    <div>
      <div :style="labelStyle">Grupo empresarial</div>
      <button ref="grupoBtn" type="button" class="drop-trigger" @click="toggleMenu('grupo')">
        <span class="drop-label">{{ summary(draft.grupoIds, GRUPOS_OPTS) }}</span>
        <ChevronDown :size="14" :style="{ transform: openMenu === 'grupo' ? 'rotate(180deg)' : 'none' }" />
      </button>
    </div>

    <template v-if="view === 'contratos'">
      <div style="grid-column: 1 / -1">
        <div :style="labelStyle">Tipo do ativo</div>
        <select v-model="draft.tipoAtivo" :style="inputStyle">
          <option value="">Todos</option>
          <option v-for="t in TIPO_ATIVO_OPTS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </template>

    <template v-else>
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
    </template>

    <div>
      <div :style="labelStyle">Data entrada inicial</div>
      <input v-model="draft.dataEntradaIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">Data entrada final</div>
      <input v-model="draft.dataEntradaFim" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">{{ view === 'contratos' ? 'Último vencimento inicial' : 'Data vencimento inicial' }}</div>
      <input v-model="draft.dataVencimentoIni" type="date" :style="inputStyle" />
    </div>
    <div>
      <div :style="labelStyle">{{ view === 'contratos' ? 'Último vencimento final' : 'Data vencimento final' }}</div>
      <input v-model="draft.dataVencimentoFim" type="date" :style="inputStyle" />
    </div>
  </div>

  <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
    <button
      type="button"
      style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
      @click="handleClear"
    >
      Limpar
    </button>
    <button
      type="button"
      class="flex items-center"
      style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      @click="handleApply"
    >
      <Filter :size="13" /> FILTRAR
    </button>
  </div>

  <Teleport to="body">
    <template v-if="openMenu">
      <div class="menu-backdrop" @click="openMenu = null" />
      <div
        class="menu-panel"
        :style="{ top: menuBox.top + 'px', left: menuBox.left + 'px', width: menuBox.width + 'px', maxHeight: menuBox.maxHeight + 'px' }"
      >
        <template v-if="openMenu === 'veiculo'">
          <div v-for="v in VEICULOS_OPTS" :key="v.id" class="menu-item" @click="toggleId(draft.veiculoIds, v.id)">
            <div @click.stop>
              <Checkbox :checked="draft.veiculoIds.includes(v.id)" @change="toggleId(draft.veiculoIds, v.id)" />
            </div>
            <span>{{ v.nome }}</span>
          </div>
        </template>
        <template v-else>
          <div v-for="g in GRUPOS_OPTS" :key="g.id" class="menu-item" @click="toggleId(draft.grupoIds, g.id)">
            <div @click.stop>
              <Checkbox :checked="draft.grupoIds.includes(g.id)" @change="toggleId(draft.grupoIds, g.id)" />
            </div>
            <span>{{ g.nome }}</span>
          </div>
        </template>
      </div>
    </template>
  </Teleport>
</template>

<style scoped>
.drop-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.drop-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
}
.menu-panel {
  position: fixed;
  z-index: 81;
  overflow-y: auto;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 6px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.menu-item:hover {
  background: var(--surface-sunken);
}
</style>
