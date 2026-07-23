# Solicitação de Operação

## Lista

### SolicitacaoScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Component } from 'vue';
import {
  Plus,
  Search,
  LayoutGrid,
  Columns3,
  Table2,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-vue-next';
import {
  solicitacoes as initialSolicitacoes,
  ESTEIRAS,
  type Esteira,
  type Solicitacao,
} from '../data/operacaoData';
import SolicitacaoCard from '../components/SolicitacaoCard.vue';
import SolicitacaoKanban from '../components/SolicitacaoKanban.vue';
import SolicitacaoTable from '../components/SolicitacaoTable.vue';
import NovoPedidoModal from '../components/NovoPedidoModal.vue';
import type { NewPedidoData } from '../components/novo-pedido';
import SolicitacaoDetailScreen from './SolicitacaoDetailScreen.vue';
import { SolicitacaoFiltersPanel, type SolicitacaoFilters } from './solicitacao-screen';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const EMPTY_FILTERS: SolicitacaoFilters = {
  idPedido: '',
  veiculo: '',
  tipoPedido: '',
  dataAbertura: '',
  grupoEmpresarial: '',
  gerenteComercial: '',
  requerente: '',
  usuarioAtendimento: '',
};

type ViewMode = 'kanban' | 'cards' | 'tabela';
type EsteiraFilter = Esteira | 'TODAS';

const VIEW_MODES: { key: ViewMode; label: string; icon: Component }[] = [
  { key: 'kanban', label: 'Kanban', icon: Columns3 },
  { key: 'cards', label: 'Cards', icon: LayoutGrid },
  { key: 'tabela', label: 'Tabela', icon: Table2 },
];

const ESTEIRA_FILTERS: { key: EsteiraFilter; label: string }[] = [{ key: 'TODAS', label: 'Todas' }, ...ESTEIRAS];

function buildFromForm(data: NewPedidoData): Solicitacao {
  const valorNum = parseFloat((data.valorOperacao || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  return {
    id: `#${Math.floor(1397 + Math.random() * 600)}`,
    cedente: data.grupoEmpresarial || 'NOVO CEDENTE',
    tipoContrato: data.tipoContrato || '—',
    validacao: 'VALIDO',
    valor: valorNum,
    vinculo: data.grupoEmpresarial || '—',
    veiculo: data.fundo || '—',
    etapa: 'RASCUNHO',
    esteira: (data.esteira as Esteira) || 'CONVENCIONAL',
    tipoOperacao: data.tipoOperacao || '—',
    grupoEmpresarial: data.grupoEmpresarial || '—',
    abertura: new Date().toISOString().slice(0, 10),
    tempoTotalHoras: 0,
    tempoEtapaHoras: 0,
    slaEtapaHoras: 24,
    taxa: parseFloat((data.taxaOperacao || '').replace(',', '.')) || 0,
    gerente: data.gerenteComercial || '—',
    atendente: '',
  };
}

const lista = reactive<Solicitacao[]>([...initialSolicitacoes]);
const esteira = ref<EsteiraFilter>('TODAS');
const viewMode = ref<ViewMode>('kanban');
const q = ref('');
const creating = ref(false);
const selectedId = ref<string | null>(null);
const showFilters = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const filters = ref<SolicitacaoFilters>({ ...EMPTY_FILTERS });

const veiculos = computed(() => Array.from(new Set(initialSolicitacoes.map((s) => s.veiculo))).sort());
const tiposPedido = computed(() => Array.from(new Set(initialSolicitacoes.map((s) => s.tipoContrato))).sort());
const grupos = computed(() => Array.from(new Set(initialSolicitacoes.map((s) => s.grupoEmpresarial))).sort());
const gerentes = computed(() => Array.from(new Set(initialSolicitacoes.map((s) => s.gerente))).sort());
const requerentes = computed(() => Array.from(new Set(initialSolicitacoes.map((s) => s.cedente))).sort());
const atendentes = computed(() =>
  Array.from(new Set(initialSolicitacoes.map((s) => s.atendente).filter(Boolean))).sort(),
);

const activeFilterCount = computed(
  () => Object.values(filters.value).filter((value) => value.trim() !== '').length,
);

const filtered = computed(() =>
  lista.filter((s) => {
    if (esteira.value !== 'TODAS' && s.esteira !== esteira.value) return false;

    const f = filters.value;
    if (f.idPedido && !s.id.toLowerCase().includes(f.idPedido.trim().toLowerCase())) return false;
    if (f.veiculo && s.veiculo !== f.veiculo) return false;
    if (f.tipoPedido && s.tipoContrato !== f.tipoPedido) return false;
    if (f.dataAbertura && s.abertura !== f.dataAbertura) return false;
    if (f.grupoEmpresarial && s.grupoEmpresarial !== f.grupoEmpresarial) return false;
    if (f.gerenteComercial && s.gerente !== f.gerenteComercial) return false;
    if (f.requerente && s.cedente !== f.requerente) return false;
    if (f.usuarioAtendimento && s.atendente !== f.usuarioAtendimento) return false;

    if (q.value) {
      const needle = q.value.toLowerCase();
      const hay = `${s.id} ${s.cedente} ${s.veiculo} ${s.vinculo}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }

    return true;
  }),
);

const filterPanelStyle = computed(() => ({
  position: 'absolute' as const,
  [filterPlacement.value === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
  left: '0px',
  zIndex: 31,
  width: '440px',
  maxWidth: 'calc(100vw - 48px)',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-lg)',
  padding: '16px 20px',
}));

function openFilters() {
  if (!showFilters.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 520;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  showFilters.value = !showFilters.value;
}

function applyFilters(next: SolicitacaoFilters) {
  filters.value = { ...next };
  showFilters.value = false;
}

function clearFilters() {
  filters.value = { ...EMPTY_FILTERS };
}

function handleCreate(data: NewPedidoData) {
  lista.unshift(buildFromForm(data));
  creating.value = false;
}

const selected = computed(() => (selectedId.value ? lista.find((s) => s.id === selectedId.value) ?? null : null));
</script>

<template>
  <SolicitacaoDetailScreen v-if="selected" :solicitacao="selected" @back="selectedId = null" />
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Camada 1: Identificação + ação primária -->
    <div class="flex items-center justify-between" style="gap: 16px">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Workflow Operacional
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Solicitação de Operação
        </h1>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 48px;
          padding: 0 22px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
        "
        @click="creating = true"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255, 255, 255, 0.2)">
          <Plus :size="14" />
        </span>
        NOVA SOLICITAÇÃO
      </button>
    </div>

    <!-- Tabs de esteira -->
    <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
      <button
        v-for="e in ESTEIRA_FILTERS"
        :key="e.key"
        :style="{
          padding: '8px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.04em',
          border: '1px solid',
          borderColor: esteira === e.key ? 'var(--gci-base)' : 'var(--border-default)',
          background: esteira === e.key ? 'var(--gci-base)' : 'var(--surface-card)',
          color: esteira === e.key ? '#fff' : 'var(--text-muted)',
          transition: 'all var(--duration-fast)',
        }"
        @click="esteira = e.key"
      >
        {{ e.label }}
      </button>
    </div>

    <!-- Barra de filtros + toggle de visualização -->
    <div class="flex flex-col" style="gap: 10px">
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <!-- Search -->
        <div class="relative" style="flex: 1; min-width: 240px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
          <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por ID, cedente ou veículo..."
            style="width: 100%; height: 42px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong); border-radius: var(--radius-lg)"
          />
        </div>

        <!-- Filtros (popover) -->
        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            :style="{
              gap: '8px',
              height: '42px',
              padding: '0 16px',
              cursor: 'pointer',
              background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
              border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
              transition: 'all var(--duration-fast)',
            }"
            @click="openFilters"
          >
            <SlidersHorizontal :size="15" :stroke-width="2" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9999px; background: var(--gci-base); color: #fff; font-size: 10px; font-weight: var(--weight-bold); display: flex; align-items: center; justify-content: center"
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" :style="{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
          </button>

          <template v-if="showFilters">
            <div style="position: fixed; inset: 0; z-index: 30" @click="showFilters = false" />
            <div :style="filterPanelStyle">
              <SolicitacaoFiltersPanel
                v-model="filters"
                :veiculos="veiculos"
                :tipos-pedido="tiposPedido"
                :grupos="grupos"
                :gerentes="gerentes"
                :requerentes="requerentes"
                :atendentes="atendentes"
                @apply="applyFilters"
                @clear="clearFilters"
              />
            </div>
          </template>
        </div>

        <SegmentedToggle
          :model-value="viewMode"
          :options="VIEW_MODES"
          variant="surface"
          @update:model-value="viewMode = $event as ViewMode"
        />
      </div>
    </div>

    <!-- Conteúdo -->
    <SolicitacaoKanban
      v-if="viewMode === 'kanban'"
      :solicitacoes="filtered"
      :esteira-filter="esteira"
      @open="selectedId = $event"
    />

    <template v-if="viewMode === 'cards'">
      <div
        v-if="filtered.length === 0"
        style="padding: 60px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
      >
        Nenhuma solicitação encontrada para os filtros selecionados.
      </div>
      <div v-else class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <SolicitacaoCard v-for="s in filtered" :key="s.id" :solicitacao="s" @open="selectedId = $event" />
      </div>
    </template>

    <SolicitacaoTable v-if="viewMode === 'tabela'" :solicitacoes="filtered" @open="selectedId = $event" />

    <NovoPedidoModal v-if="creating" @close="creating = false" @create="handleCreate" />
  </div>
</template>
```

### SolicitacaoFiltersPanel

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Filter, X } from 'lucide-vue-next';

export interface SolicitacaoFilters {
  idPedido: string;
  veiculo: string;
  tipoPedido: string;
  dataAbertura: string;
  grupoEmpresarial: string;
  gerenteComercial: string;
  requerente: string;
  usuarioAtendimento: string;
}

const props = defineProps<{
  modelValue: SolicitacaoFilters;
  veiculos: string[];
  tiposPedido: string[];
  grupos: string[];
  gerentes: string[];
  requerentes: string[];
  atendentes: string[];
}>();

const emit = defineEmits<{
  apply: [filters: SolicitacaoFilters];
  clear: [];
}>();

const draft = reactive<SolicitacaoFilters>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, value);
  },
  { deep: true },
);

const hasDraft = computed(() => Object.values(draft).some((value) => value.trim() !== ''));

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

function handleApply() {
  emit('apply', { ...draft });
}

function handleClear() {
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
    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">ID do Pedido</div>
      <input v-model="draft.idPedido" placeholder="Buscar por ID" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Veículo</div>
      <select v-model="draft.veiculo" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in veiculos" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Tipo de pedido</div>
      <select v-model="draft.tipoPedido" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in tiposPedido" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Data de abertura</div>
      <input v-model="draft.dataAbertura" type="date" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Grupo Empresarial</div>
      <select v-model="draft.grupoEmpresarial" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in grupos" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Gerente Comercial</div>
      <select v-model="draft.gerenteComercial" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in gerentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Requerente do pedido</div>
      <select v-model="draft.requerente" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in requerentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Usuário de atendimento</div>
      <select v-model="draft.usuarioAtendimento" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in atendentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
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
```

### FilterSelect

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

defineProps<{ placeholder: string; options: string[] }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div style="position: relative; min-width: 180px">
    <select
      v-model="model"
      :style="{
        width: '100%',
        height: '42px',
        padding: '0 36px 0 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        color: model ? 'var(--text-strong)' : 'var(--text-muted)',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
      }"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
    <ChevronDown
      :size="16"
      style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400); pointer-events: none"
    />
  </div>
</template>
```

### SolicitacaoCard

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, fmtDuracao, slaRatio, type Solicitacao } from '../data/operacaoData';

interface Props {
  solicitacao: Solicitacao;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), { compact: false });
const emit = defineEmits<{ open: [id: string] }>();

/** Cor leve por tipo de contrato (badge). */
function contratoTone(tipo: string): { bg: string; fg: string } {
  const t = tipo.toUpperCase();
  if (t.includes('CDCA')) return { bg: 'var(--success-light)', fg: 'var(--success-dark)' };
  if (t.includes('CPR') || t.includes('NC')) return { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' };
  return { bg: 'var(--surface-sunken)', fg: 'var(--text-default)' };
}

const hover = ref(false);
const expanded = ref(false);

const s = computed(() => props.solicitacao);
const valido = computed(() => s.value.validacao === 'VALIDO');
const atrasado = computed(() => slaRatio(s.value) > 1);
const barColor = computed(() => (atrasado.value ? 'var(--danger-base)' : 'var(--success-base)'));
const ct = computed(() => contratoTone(s.value.tipoContrato));
const isCliente = computed(() => s.value.esteira === 'CLIENTE');

const timeCols = computed(() => [
  { icon: Clock as Component, label: 'Total', value: fmtDuracao(s.value.tempoTotalHoras), emphasize: false },
  { icon: RefreshCw as Component, label: 'Etapa', value: fmtDuracao(s.value.tempoEtapaHoras), emphasize: atrasado.value },
]);

const detailRows = computed(() => [
  { label: 'Veículo', value: s.value.veiculo },
  { label: 'Taxa', value: `${s.value.taxa.toFixed(2).replace('.', ',')}%` },
  { label: 'Gerente', value: s.value.gerente },
  { label: 'Atendente', value: s.value.atendente },
]);

function handleClick() {
  emit('open', s.value.id);
}

function toggleExpanded(e: MouseEvent) {
  e.stopPropagation();
  expanded.value = !expanded.value;
}
</script>

<template>
  <div
    class="flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: compact ? '12px' : '16px',
      gap: compact ? '10px' : '12px',
      cursor: 'pointer',
      boxShadow: hover ? '0 12px 28px -14px rgba(8,60,74,0.18)' : 'var(--shadow-xs)',
      transform: hover && !compact ? 'translateY(-3px)' : 'translateY(0)',
      transition:
        'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <!-- Badges: tipo de contrato + validação -->
    <div class="flex items-center justify-between" style="gap: 8px">
      <span
        :style="{
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          background: ct.bg,
          color: ct.fg,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '60%',
        }"
      >
        {{ s.tipoContrato }}
      </span>
      <span
        class="flex items-center"
        :style="{
          gap: '4px',
          flexShrink: 0,
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.06em',
          padding: '3px 8px',
          borderRadius: '9999px',
          background: valido ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
          color: valido ? 'var(--status-success-text)' : 'var(--status-danger-text)',
        }"
      >
        <CheckCircle2 v-if="valido" :size="10" :stroke-width="2.5" />
        <XCircle v-else :size="10" :stroke-width="2.5" />
        {{ valido ? 'VÁLIDO' : 'INVÁLIDO' }}
      </span>
    </div>

    <div
      v-if="isCliente"
      class="flex items-center justify-center"
      :style="{
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'color-mix(in srgb, var(--agro-base) 14%, #fff)',
        fontSize: '11px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.06em',
        color: 'var(--agro-base)',
        textTransform: 'uppercase',
      }"
    >
      Esteira Automática
    </div>

    <!-- Cedente + ID -->
    <div>
      <div
        :style="{
          fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }"
      >
        {{ s.cedente }}
      </div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
        {{ s.id }}
      </div>
    </div>

    <!-- Valor -->
    <div
      :style="{
        fontSize: compact ? 'var(--text-md)' : 'var(--text-lg)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }"
    >
      {{ brl(s.valor) }}
    </div>

    <!-- Vínculo (pill) -->
    <div
      class="flex items-center"
      :style="{
        gap: '8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunken)',
        fontSize: '11px',
        color: s.vinculo ? 'var(--text-default)' : 'var(--text-muted)',
      }"
    >
      <Building2 :size="13" :stroke-width="2" style="flex-shrink: 0; color: var(--text-muted)" />
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ s.vinculo || 'Sem vínculo' }}
      </span>
    </div>

    <!-- Divisor -->
    <div style="height: 1px; background: var(--border-default)" />

    <!-- TOTAL | ETAPA -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
      <div v-for="tc in timeCols" :key="tc.label" class="flex flex-col" style="gap: 5px">
        <div
          class="flex items-center"
          style="
            gap: 5px;
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <component :is="tc.icon" :size="11" :stroke-width="2" /> {{ tc.label }}
        </div>
        <div
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            color: tc.emphasize ? 'var(--danger-base)' : 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
          }"
        >
          {{ tc.value }}
        </div>
        <div :style="{ height: '3px', borderRadius: '9999px', background: barColor }" />
      </div>
    </div>

    <!-- Detalhes expandidos -->
    <div v-if="expanded" class="flex flex-col" style="gap: 10px; padding-top: 4px">
      <div v-for="row in detailRows" :key="row.label" class="flex items-center justify-between" style="gap: 12px">
        <span
          style="
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            flex-shrink: 0;
          "
        >
          {{ row.label }}
        </span>
        <span
          style="
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
            color: var(--text-strong);
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ row.value || '—' }}
        </span>
      </div>
    </div>

    <!-- Toggle Mais/Menos detalhes -->
    <button
      class="flex items-center justify-center"
      style="
        gap: 6px;
        margin-top: 2px;
        padding: 6px 0;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: var(--weight-semibold);
      "
      @click="toggleExpanded"
    >
      <template v-if="expanded"><ChevronUp :size="14" /> Menos detalhes</template>
      <template v-else><ChevronDown :size="14" /> Mais detalhes</template>
    </button>
  </div>
</template>
```

### SolicitacaoTable

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, fmtDuracao, slaRatio, etapaLabel, etapaCor, type Solicitacao } from '../data/operacaoData';

const props = defineProps<{
  solicitacoes: Solicitacao[];
}>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.solicitacoes,
  { defaultPageSize: 10 },
);
const emit = defineEmits<{ open: [id: string] }>();

const COLS = '90px 1.6fr 0.9fr 1.2fr 1fr 1.1fr 1fr';

const hoveredId = ref<string | null>(null);
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--surface-card);
    "
  >
    <!-- Header -->
    <div
      class="grid"
      :style="{
        gridTemplateColumns: COLS,
        padding: '12px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>ID</div>
      <div>Cedente</div>
      <div>Tipo</div>
      <div>Veículo</div>
      <div style="text-align: right">Valor</div>
      <div>Etapa</div>
      <div>SLA da Etapa</div>
    </div>

    <!-- Rows -->
    <div
      v-if="solicitacoes.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Nenhuma solicitação encontrada.
    </div>
    <template v-else>
      <div
        v-for="s in pageItems"
        :key="s.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: hoveredId === s.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @click="emit('open', s.id)"
        @mouseenter="hoveredId = s.id"
        @mouseleave="hoveredId = null"
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ s.id }}
        </div>
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span
            class="flex items-center justify-center"
            :style="{ flexShrink: 0, color: s.validacao === 'VALIDO' ? 'var(--success-base)' : 'var(--danger-base)' }"
            :title="s.validacao === 'VALIDO' ? 'Válido' : 'Inválido'"
          >
            <CheckCircle2 v-if="s.validacao === 'VALIDO'" :size="15" :stroke-width="2.25" />
            <XCircle v-else :size="15" :stroke-width="2.25" />
          </span>
          <span
            style="
              font-weight: var(--weight-semibold);
              color: var(--text-strong);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ s.cedente }}
          </span>
        </div>
        <div style="color: var(--text-default)">{{ s.tipoContrato }}</div>
        <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
          {{ s.veiculo }}
        </div>
        <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(s.valor) }}
        </div>
        <div>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              width: 'fit-content',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${etapaCor(s.etapa)} 14%, transparent)`,
              color: etapaCor(s.etapa),
              whiteSpace: 'nowrap',
            }"
          >
            <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: etapaCor(s.etapa) }" />
            {{ etapaLabel(s.etapa) }}
          </span>
        </div>
        <div class="flex items-center" style="gap: 8px">
          <div
            :style="{
              flex: 1,
              height: '5px',
              background: slaRatio(s) > 1 ? 'var(--danger-light)' : 'var(--success-light)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }"
          >
            <div
              :style="{
                height: '100%',
                width: `${Math.min(Math.max(slaRatio(s), 0), 1) * 100}%`,
                background: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--success-base)',
                borderRadius: '9999px',
              }"
            />
          </div>
          <span
            :style="{
              fontSize: '10px',
              color: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              fontWeight: slaRatio(s) > 1 ? 'var(--weight-bold)' : 'var(--weight-regular)',
            }"
          >
            {{ fmtDuracao(s.tempoEtapaHoras) }} / {{ fmtDuracao(s.slaEtapaHoras) }}
          </span>
        </div>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </template>
  </div>
</template>
```

### SolicitacaoKanban

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import SolicitacaoCard from './SolicitacaoCard.vue';
import MoverEtapaModal from './MoverEtapaModal.vue';
import {
  ETAPAS,
  ETAPAS_CLIENTE,
  etapaLabel,
  groupByEtapa,
  type Etapa,
  type Esteira,
  type Solicitacao,
} from '../data/operacaoData';

const props = withDefaults(
  defineProps<{
    solicitacoes: Solicitacao[];
    /** Filtro de esteira da listagem — controla colunas exclusivas da esteira Cliente. */
    esteiraFilter?: Esteira | 'TODAS';
  }>(),
  { esteiraFilter: 'TODAS' },
);
const emit = defineEmits<{ open: [id: string]; move: [id: string, etapa: Etapa] }>();

const grupos = computed(() => groupByEtapa(props.solicitacoes));

const colunas = computed(() => {
  const showCliente = props.esteiraFilter === 'TODAS' || props.esteiraFilter === 'CLIENTE';
  if (showCliente) return ETAPAS;
  return ETAPAS.filter((e) => !ETAPAS_CLIENTE.includes(e.key));
});

const draggingId = ref<string | null>(null);
const dragOverEtapa = ref<Etapa | null>(null);
const suppressOpen = ref(false);

const pendingMove = ref<{
  solicitacao: Solicitacao;
  from: Etapa;
  to: Etapa;
} | null>(null);

function onDragStart(s: Solicitacao, e: DragEvent) {
  draggingId.value = s.id;
  suppressOpen.value = true;
  e.dataTransfer?.setData('text/plain', s.id);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd() {
  draggingId.value = null;
  dragOverEtapa.value = null;
  setTimeout(() => {
    suppressOpen.value = false;
  }, 80);
}

function onDragOver(etapa: Etapa, e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  dragOverEtapa.value = etapa;
}

function onDragLeave(etapa: Etapa) {
  if (dragOverEtapa.value === etapa) dragOverEtapa.value = null;
}

function onDrop(etapa: Etapa, e: DragEvent) {
  e.preventDefault();
  dragOverEtapa.value = null;
  const id = e.dataTransfer?.getData('text/plain') || draggingId.value;
  if (!id) return;

  const solicitacao = props.solicitacoes.find((s) => s.id === id);
  if (!solicitacao || solicitacao.etapa === etapa) {
    draggingId.value = null;
    return;
  }

  pendingMove.value = {
    solicitacao,
    from: solicitacao.etapa,
    to: etapa,
  };
  draggingId.value = null;
}

function confirmMove() {
  if (!pendingMove.value) return;
  const { solicitacao, to } = pendingMove.value;
  solicitacao.etapa = to;
  solicitacao.tempoEtapaHoras = 0;
  emit('move', solicitacao.id, to);
  pendingMove.value = null;
}

function cancelMove() {
  pendingMove.value = null;
}

function handleOpen(id: string) {
  if (suppressOpen.value) return;
  emit('open', id);
}
</script>

<template>
  <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px">
    <div
      v-for="etapa in colunas"
      :key="etapa.key"
      class="flex flex-col"
      :style="{
        flex: '0 0 280px',
        width: '280px',
        background: dragOverEtapa === etapa.key
          ? `color-mix(in srgb, ${etapa.cor} 10%, var(--surface-sunken))`
          : 'var(--surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        borderTop: `3px solid ${etapa.cor}`,
        outline: dragOverEtapa === etapa.key ? `2px dashed ${etapa.cor}` : '2px solid transparent',
        outlineOffset: '-2px',
        padding: '12px',
        gap: '12px',
        minHeight: '200px',
        transition: 'background var(--duration-fast), outline-color var(--duration-fast)',
      }"
      @dragover="onDragOver(etapa.key, $event)"
      @dragleave="onDragLeave(etapa.key)"
      @drop="onDrop(etapa.key, $event)"
    >
      <!-- Header da coluna -->
      <div class="flex items-center justify-between" style="gap: 8px">
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span :style="{ width: '8px', height: '8px', borderRadius: '9999px', background: etapa.cor, flexShrink: 0 }" />
          <span
            style="
              font-size: 11px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              color: var(--text-strong);
              text-transform: uppercase;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ etapa.label }}
          </span>
        </div>
        <span
          class="flex items-center justify-center"
          :style="{
            minWidth: '22px',
            height: '22px',
            padding: '0 7px',
            borderRadius: '9999px',
            background: `color-mix(in srgb, ${etapa.cor} 16%, transparent)`,
            fontSize: '11px',
            fontWeight: 'var(--weight-bold)',
            color: etapa.cor,
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }"
        >
          {{ grupos[etapa.key].length }}
        </span>
      </div>

      <!-- Cards -->
      <div class="flex flex-col" style="gap: 10px; flex: 1">
        <div
          v-if="grupos[etapa.key].length === 0"
          class="flex flex-col items-center justify-center"
          style="padding: 28px 8px; gap: 8px; text-align: center; color: var(--text-muted)"
        >
          <FolderOpen :size="22" :stroke-width="1.5" style="opacity: 0.5" />
          <span style="font-size: 11px">Nenhuma solicitação</span>
        </div>
        <div
          v-for="s in grupos[etapa.key]"
          :key="s.id"
          draggable="true"
          :style="{
            opacity: draggingId === s.id ? 0.45 : 1,
            cursor: 'grab',
            transition: 'opacity var(--duration-fast)',
          }"
          @dragstart="onDragStart(s, $event)"
          @dragend="onDragEnd"
        >
          <SolicitacaoCard :solicitacao="s" compact @open="handleOpen" />
        </div>
      </div>
    </div>
  </div>

  <MoverEtapaModal
    v-if="pendingMove"
    :solicitacao-id="pendingMove.solicitacao.id"
    :cedente="pendingMove.solicitacao.cedente"
    :etapa-origem="etapaLabel(pendingMove.from)"
    :etapa-destino="etapaLabel(pendingMove.to)"
    @close="cancelMove"
    @confirm="confirmMove"
  />
</template>
```

## Detalhe

### SolicitacaoDetailScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Component } from 'vue';
import {
  ArrowLeft, FileText, Boxes, ShieldCheck, CheckCircle2, Paperclip,
  MessageSquare, Activity, ChevronRight,
} from 'lucide-vue-next';
import {
  etapaCor, etapaLabel, esteiraLabel, detalheSolicitacao,
  type Solicitacao, type ParteRelacionada, type ContratoAtivo, type Esteira, type ItemValidacao,
} from '../data/operacaoData';
import { enriquecerContratoAtivo } from '../data/ativoData';
import { CopyButton } from './detail-tabs/shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DadosGeraisTab from './detail-tabs/DadosGeraisTab.vue';
import AtivosTab from './detail-tabs/AtivosTab.vue';
import GarantiasTab from './detail-tabs/GarantiasTab.vue';
import { ValidacoesTab, ValidacoesFullView } from './detail-tabs/ValidacoesTab';
import AnexosTab from './detail-tabs/AnexosTab.vue';
import AtaTab from './detail-tabs/AtaTab.vue';
import HistoricoTab from './detail-tabs/HistoricoTab.vue';
import ParteRelacionadaModal from '../components/modals/ParteRelacionadaModal.vue';
import AdicionarContratoModal from '../components/modals/AdicionarContratoModal.vue';
import VincularAtivosModal from '../components/modals/VincularAtivosModal.vue';
import ConfirmarTituloModal from '../components/modals/ConfirmarTituloModal.vue';
import ProrrogarVencimentoModal from '../components/modals/ProrrogarVencimentoModal.vue';
import AtualizarCessaoModal from '../components/modals/AtualizarCessaoModal.vue';
import GerarTermoCessaoModal from '../components/modals/GerarTermoCessaoModal.vue';
import GerarCnabModal from '../components/modals/GerarCnabModal.vue';
import InserirEvidenciaModal from '../components/modals/InserirEvidenciaModal.vue';
import DetalheEvidenciaModal from '../components/modals/DetalheEvidenciaModal.vue';
import DetalheValidacaoModal from '../components/modals/DetalheValidacaoModal.vue';
import { ActionMenu, RejectModal } from './solicitacao-detail';
import { ParteRelacionadaDetailView } from './detail-tabs/parte-relacionada';
import { AtivoDetailView } from './detail-tabs/ativo';

const props = defineProps<{ solicitacao: Solicitacao }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'gerais' | 'ativos' | 'garantias' | 'validacoes' | 'anexos' | 'ata' | 'historico';
type SubView = null | 'validacoes-detalhe' | 'parte-detalhe' | 'ativo-detalhe';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'gerais', label: 'Dados Gerais', icon: FileText },
  { key: 'ativos', label: 'Ativos', icon: Boxes },
  { key: 'garantias', label: 'Garantias', icon: ShieldCheck },
  { key: 'validacoes', label: 'Validações', icon: CheckCircle2 },
  { key: 'anexos', label: 'Anexos', icon: Paperclip },
  { key: 'ata', label: 'Ata de Deliberação', icon: MessageSquare },
  { key: 'historico', label: 'Histórico', icon: Activity },
];

const tab = ref<Tab>('gerais');
const subView = ref<SubView>(null);
const confirmReject = ref(false);
const det = reactive(detalheSolicitacao(props.solicitacao));
const showParteModal = ref(false);
const showContratoModal = ref(false);
const showVincularModal = ref(false);
const showConfirmarModal = ref(false);
const showProrrogarModal = ref(false);
const showAtualizarCessao = ref(false);
const showGerarTermo = ref(false);
const showGerarCnab = ref(false);
const showInserirEvidencia = ref(false);
const showDetalheEvidencia = ref(false);
const showDetalheValidacao = ref(false);
const validacaoEvidenciaCtx = ref<ItemValidacao | null>(null);
const validacaoDetalheCtx = ref<ItemValidacao | null>(null);
const selectedParte = ref<ParteRelacionada | null>(null);
const selectedAtivo = ref<ContratoAtivo | null>(null);
const ativosAcao = ref<ContratoAtivo[]>([]);
const cor = computed(() => etapaCor(props.solicitacao.etapa));

function findValidacao(titulo: string) {
  return det.validacoes.find((v) => v.titulo === titulo);
}

function openInserirEvidencia(v: ItemValidacao) {
  validacaoEvidenciaCtx.value = v;
  showInserirEvidencia.value = true;
}

function openVerEvidencia(v: ItemValidacao) {
  validacaoEvidenciaCtx.value = v;
  showDetalheEvidencia.value = true;
}

function openVerDetalhes(v: ItemValidacao) {
  validacaoDetalheCtx.value = v;
  showDetalheValidacao.value = true;
}

function handleAutorizar(v: ItemValidacao) {
  const item = findValidacao(v.titulo);
  if (!item) return;
  if (item.evidencia) {
    item.status = 'OK';
    return;
  }
  openInserirEvidencia(item);
}

function onInserirEvidencia(data: { arquivo: string; descricao: string }) {
  const item = validacaoEvidenciaCtx.value ? findValidacao(validacaoEvidenciaCtx.value.titulo) : null;
  if (item) {
    const now = new Date();
    const dataStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    item.evidencia = {
      arquivo: data.arquivo,
      descricao: data.descricao,
      autor: 'Usuário atual',
      data: dataStr,
    };
  }
  showInserirEvidencia.value = false;
  validacaoEvidenciaCtx.value = null;
}

function handleAddParte(parte: ParteRelacionada) {
  det.partes.push(parte);
  showParteModal.value = false;
}

function openParte(parte: ParteRelacionada) {
  selectedParte.value = parte;
  subView.value = 'parte-detalhe';
}

function closeParteDetail() {
  subView.value = null;
  selectedParte.value = null;
}

function openAtivo(ativo: ContratoAtivo) {
  selectedAtivo.value = ativo;
  subView.value = 'ativo-detalhe';
}

function closeAtivoDetail() {
  subView.value = null;
  selectedAtivo.value = null;
}

function handleAddContrato(ativo: Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>) {
  det.ativos.push(enriquecerContratoAtivo(ativo));
  showContratoModal.value = false;
}

function handleUpdateValor(valor: number) {
  const fee = props.solicitacao.fee ?? 2;
  props.solicitacao.valor = valor;
  props.solicitacao.valorFee = valor * (fee / 100);
}

function handleUpdateEsteira(esteira: Esteira) {
  props.solicitacao.esteira = esteira;
}

function handleUpdateQuitacao(value: boolean) {
  props.solicitacao.quitacaoVencidos = value;
}

function handleVincular(ativos: ContratoAtivo[]) {
  det.ativos.push(...ativos);
  showVincularModal.value = false;
}

function handleRemover(ids: string[]) {
  det.ativos = det.ativos.filter((a) => !ids.includes(a.id));
}

function handleProrrogar(ids: string[]) {
  ativosAcao.value = det.ativos.filter((a) => ids.includes(a.id));
  showProrrogarModal.value = true;
}

function handleConfirmar(ids: string[]) {
  ativosAcao.value = det.ativos.filter((a) => ids.includes(a.id));
  showConfirmarModal.value = true;
}

function onConfirmarTitulo(data: { status: string; data: string; observacao: string }) {
  for (const a of ativosAcao.value) {
    const idx = det.ativos.findIndex((x) => x.id === a.id);
    if (idx >= 0) {
      det.ativos[idx] = {
        ...det.ativos[idx],
        confirmacao: data.status as ContratoAtivo['confirmacao'],
        confirmacoes: [
          ...det.ativos[idx].confirmacoes,
          { observacao: data.observacao, confirmadoPor: 'Usuário atual', data: data.data || '—', status: data.status as ContratoAtivo['confirmacao'] },
        ],
      };
    }
  }
  showConfirmarModal.value = false;
  ativosAcao.value = [];
}

function onProrrogarVencimento(data: { novoVencimento: string; motivo: string }) {
  for (const a of ativosAcao.value) {
    const idx = det.ativos.findIndex((x) => x.id === a.id);
    if (idx >= 0) {
      det.ativos[idx] = { ...det.ativos[idx], vencimento: data.novoVencimento };
    }
  }
  showProrrogarModal.value = false;
  ativosAcao.value = [];
}
</script>

<template>
  <ValidacoesFullView
    v-if="subView === 'validacoes-detalhe'"
    :det="det"
    :solicitacao-id="solicitacao.id"
    @back="subView = null"
    @inserir-evidencia="openInserirEvidencia"
    @ver-evidencia="openVerEvidencia"
    @autorizar="handleAutorizar"
    @ver-detalhes="openVerDetalhes"
  />
  <ParteRelacionadaDetailView
    v-else-if="subView === 'parte-detalhe' && selectedParte"
    :parte="selectedParte"
    :solicitacao-id="solicitacao.id"
    @back="closeParteDetail"
  />
  <AtivoDetailView
    v-else-if="subView === 'ativo-detalhe' && selectedAtivo"
    :ativo="selectedAtivo"
    :solicitacao-id="solicitacao.id"
    @back="closeAtivoDetail"
  />
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Header + barra de ações -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Solicitação de Operação
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          {{ solicitacao.id }}
          <CopyButton :value="solicitacao.id" />
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${cor} 14%, transparent)`,
              color: cor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ etapaLabel(solicitacao.etapa).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ solicitacao.cedente }} · {{ solicitacao.tipoContrato }} · {{ esteiraLabel(solicitacao.esteira) }}
        </p>
      </div>

      <!-- Ação primária + menu overflow -->
      <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
        <button
          class="flex items-center btn-animated btn-primary"
          style="gap: 8px; height: 44px; padding: 0 20px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; box-shadow: 0 10px 24px -10px rgba(8, 60, 74, 0.45)"
        >
          ANÁLISE OPERAÇÕES
          <ChevronRight :size="16" />
        </button>
        <ActionMenu
          @reject="confirmReject = true"
          @atualizar-cessao="showAtualizarCessao = true"
          @gerar-termo-cessao="showGerarTermo = true"
          @gerar-cnab="showGerarCnab = true"
        />
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <!-- Conteúdo -->
    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DadosGeraisTab
        v-if="tab === 'gerais'"
        :s="solicitacao"
        :det="det"
        @add-parte="showParteModal = true"
        @open-parte="openParte"
        @update-valor="handleUpdateValor"
        @update-esteira="handleUpdateEsteira"
        @update-quitacao="handleUpdateQuitacao"
      />
      <AtivosTab
        v-else-if="tab === 'ativos'"
        :det="det"
        @add-contrato="showContratoModal = true"
        @open-ativo="openAtivo"
        @vincular="showVincularModal = true"
        @exportar="() => {}"
        @remover="handleRemover"
        @prorrogar="handleProrrogar"
        @confirmar="handleConfirmar"
      />
      <GarantiasTab v-else-if="tab === 'garantias'" :det="det" />
      <ValidacoesTab
        v-else-if="tab === 'validacoes'"
        :det="det"
        @open-full-view="subView = 'validacoes-detalhe'"
        @inserir-evidencia="openInserirEvidencia"
        @ver-evidencia="openVerEvidencia"
        @autorizar="handleAutorizar"
        @ver-detalhes="openVerDetalhes"
      />
      <AnexosTab v-else-if="tab === 'anexos'" :det="det" />
      <AtaTab v-else-if="tab === 'ata'" />
      <HistoricoTab v-else-if="tab === 'historico'" :det="det" />
    </div>

    <RejectModal v-if="confirmReject" :id="solicitacao.id" @close="confirmReject = false" />

    <ParteRelacionadaModal
      v-if="showParteModal"
      @close="showParteModal = false"
      @create="handleAddParte"
    />

    <AdicionarContratoModal
      v-if="showContratoModal"
      @close="showContratoModal = false"
      :valor-operacao="solicitacao.valor"
      :tipo-calculo="solicitacao.tipoTaxa ?? 'Pré-fixado'"
      :partes="det.partes"
      :unidade-negocio="solicitacao.unidadeNegocio ?? 'Ceres Investimentos'"
      @create="handleAddContrato"
    />

    <VincularAtivosModal
      v-if="showVincularModal"
      @close="showVincularModal = false"
      @vincular="handleVincular"
    />

    <ConfirmarTituloModal
      v-if="showConfirmarModal"
      :ativos="ativosAcao"
      @close="showConfirmarModal = false"
      @confirm="onConfirmarTitulo"
    />

    <ProrrogarVencimentoModal
      v-if="showProrrogarModal"
      :ativos="ativosAcao"
      @close="showProrrogarModal = false"
      @confirm="onProrrogarVencimento"
    />

    <AtualizarCessaoModal
      v-if="showAtualizarCessao"
      @close="showAtualizarCessao = false"
    />

    <GerarTermoCessaoModal
      v-if="showGerarTermo"
      @close="showGerarTermo = false"
    />

    <GerarCnabModal
      v-if="showGerarCnab"
      @close="showGerarCnab = false"
    />

    <InserirEvidenciaModal
      v-if="showInserirEvidencia && validacaoEvidenciaCtx"
      :titulo-validacao="validacaoEvidenciaCtx.titulo"
      @close="showInserirEvidencia = false; validacaoEvidenciaCtx = null"
      @confirm="onInserirEvidencia"
    />

    <DetalheEvidenciaModal
      v-if="showDetalheEvidencia && validacaoEvidenciaCtx?.evidencia"
      :titulo-validacao="validacaoEvidenciaCtx.titulo"
      :evidencia="validacaoEvidenciaCtx.evidencia"
      @close="showDetalheEvidencia = false; validacaoEvidenciaCtx = null"
    />

    <DetalheValidacaoModal
      v-if="showDetalheValidacao && validacaoDetalheCtx"
      :v="validacaoDetalheCtx"
      @close="showDetalheValidacao = false; validacaoDetalheCtx = null"
    />
  </div>
</template>
```

### ActionMenu

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  MoreVertical,
  ArrowRightLeft,
  RefreshCw,
  Layers,
  Wallet,
  XCircle,
  FileText,
  FileCode,
} from 'lucide-vue-next';
import type { Component } from 'vue';

const emit = defineEmits<{
  reject: [];
  atualizarCessao: [];
  gerarTermoCessao: [];
  gerarCnab: [];
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

type ActionItem = {
  label: string;
  icon: Component;
  action?: 'atualizarCessao' | 'gerarTermoCessao' | 'gerarCnab';
};

const secondary: ActionItem[] = [
  { label: 'Transferir solicitação', icon: ArrowRightLeft },
  { label: 'Atualizar cessão', icon: RefreshCw, action: 'atualizarCessao' },
  { label: 'Gerar Termo de Cessão', icon: FileText, action: 'gerarTermoCessao' },
  { label: 'Gerar CNAB', icon: FileCode, action: 'gerarCnab' },
  { label: 'Mesclar ativos entre pedidos', icon: Layers },
  { label: 'Transferir conta bancária', icon: Wallet },
];

function handleDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));

function handleItem(a: ActionItem) {
  open.value = false;
  if (a.action === 'atualizarCessao') emit('atualizarCessao');
  else if (a.action === 'gerarTermoCessao') emit('gerarTermoCessao');
  else if (a.action === 'gerarCnab') emit('gerarCnab');
}

function handleReject() {
  open.value = false;
  emit('reject');
}
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      aria-label="Mais ações"
      class="flex items-center justify-center"
      style="
        width: 44px;
        height: 44px;
        border-radius: var(--radius-lg);
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        cursor: pointer;
        color: var(--text-strong);
      "
      @click="open = !open"
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      class="flex flex-col"
      style="
        position: absolute;
        top: 52px;
        right: 0;
        z-index: 50;
        min-width: 260px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
        padding: 6px;
      "
    >
      <button
        v-for="a in secondary"
        :key="a.label"
        class="flex items-center action-item"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-default);
          width: 100%;
          transition: background var(--duration-fast);
        "
        @click="handleItem(a)"
      >
        <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
        {{ a.label }}
      </button>
      <div style="height: 1px; background: var(--border-default); margin: 6px 4px" />
      <button
        class="flex items-center action-item-danger"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--action-danger-text-only);
          width: 100%;
          transition: background var(--duration-fast);
        "
        @click="handleReject"
      >
        <XCircle :size="16" />
        Rejeitar solicitação
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-item:hover {
  background: var(--surface-sunken);
}
.action-item-danger:hover {
  background: var(--status-danger-bg);
}
</style>
```

### RejectModal

```vue
<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

defineProps<{ id: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 100; background: rgba(15, 23, 42, 0.45); padding: 24px">
    <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4); padding: 28px">
      <div
        class="flex items-center justify-center"
        style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px"
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Rejeitar a solicitação {{ id }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação encerra o fluxo da operação e move a solicitação para a etapa <strong>Rejeitada</strong>. Você poderá consultá-la no histórico, mas não poderá retomá-la por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; background: var(--action-danger-bg); color: var(--action-danger-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Confirmar rejeição
        </button>
      </div>
    </div>
  </div>
</template>
```

## Detalhe / Dados Gerais

### DadosGeraisTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Banknote, ArrowRightLeft, Layers, Pencil } from 'lucide-vue-next';
import {
  brl,
  esteiraLabel,
  ESTEIRAS,
  detalheSolicitacao,
  type Solicitacao,
  type ParteTipo,
  type ParteRelacionada,
  type Esteira,
} from '../../data/operacaoData';
import { CopyButton, Section, Field, Card, EmptyState, GhostButton } from './shared';
import { SelectField, ToggleRow } from '../../components/modals/adicionar-contrato';
import EditarValorOperacaoModal from '../../components/modals/EditarValorOperacaoModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{
  s: Solicitacao;
  det: ReturnType<typeof detalheSolicitacao>;
}>();
const emit = defineEmits<{
  addParte: [];
  openParte: [parte: ParteRelacionada];
  updateValor: [valor: number];
  updateEsteira: [esteira: Esteira];
  updateQuitacao: [value: boolean];
}>();

const showValorModal = ref(false);

const PARTES_COLS = '1.6fr 1.1fr 1.4fr 1fr 0.9fr';
const {
  page: partesPage,
  pageSize: partesPageSize,
  total: partesTotal,
  pageItems: partesPageItems,
  setPage: setPartesPage,
  setPageSize: setPartesPageSize,
} = useTablePagination(() => props.det.partes, { defaultPageSize: 5 });

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};
const PARTE_LEGENDA: Record<ParteTipo, string> = {
  AVA: 'Avalista',
  ITA: 'Interveniente',
  SOC: 'Sócio',
  REP: 'Representante',
  CON: 'Cônjuge',
  PROC: 'Procurador',
};

const d = computed(() => {
  const s = props.s;
  const fee = s.fee ?? 2;
  return {
    unidadeNegocio: s.unidadeNegocio ?? 'Ceres Investimentos',
    documento: s.documento ?? '07.366.063/0001-05',
    banco: s.banco ?? '341 - Itaú Unibanco S.A.',
    agencia: s.agencia ?? '1475-0',
    conta: s.conta ?? '43810-5',
    tipoTaxa: s.tipoTaxa ?? 'Pré-fixado',
    frequencia: s.frequencia ?? 'Mensal',
    fee,
    valorFee: s.valorFee ?? s.valor * (fee / 100),
    percSeguro: s.percSeguro ?? 0,
    valorSeguro: s.valorSeguro ?? 0,
    quitacaoVencidos: s.quitacaoVencidos ?? false,
  };
});

const esteiraOpts = ESTEIRAS.map((e) => e.label);
const esteiraModel = computed({
  get: () => esteiraLabel(props.s.esteira),
  set: (label: string) => {
    const found = ESTEIRAS.find((e) => e.label === label);
    if (found) emit('updateEsteira', found.key);
  },
});

const partesTipos = Object.keys(PARTE_LEGENDA) as ParteTipo[];

function onConfirmValor(valor: number) {
  emit('updateValor', valor);
  showValorModal.value = false;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <!-- Valor em destaque -->
    <div
      class="flex items-center justify-between"
      style="
        gap: 16px;
        flex-wrap: wrap;
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 22px 26px;
        color: #fff;
      "
    >
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 8px;
          "
        >
          Valor da Operação (Nominal)
        </div>
        <div class="flex items-center" style="gap: 12px">
          <div
            style="
              font-size: 32px;
              font-weight: var(--weight-bold);
              letter-spacing: -0.02em;
              font-variant-numeric: tabular-nums;
              line-height: 1.1;
            "
          >
            {{ brl(s.valor) }}
          </div>
          <button
            type="button"
            aria-label="Editar valor da operação"
            class="flex items-center"
            style="
              gap: 6px;
              height: 32px;
              padding: 0 12px;
              background: rgba(255, 255, 255, 0.12);
              border: 1px solid rgba(255, 255, 255, 0.28);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
            "
            @click="showValorModal = true"
          >
            <Pencil :size="13" /> Editar
          </button>
        </div>
      </div>
      <div class="flex items-center" style="gap: 28px; flex-wrap: wrap">
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Taxa
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${s.taxa.toFixed(2).replace('.', ',')}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${d.fee}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Valor FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ brl(d.valorFee) }}
          </div>
        </div>
      </div>
    </div>

    <Section title="Identificação">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 24px">
        <Field label="Tipo de Operação">{{ s.tipoContrato }}</Field>
        <Field label="Unidade de Negócio">{{ d.unidadeNegocio }}</Field>
        <Field label="Veículo">{{ s.veiculo || '—' }}</Field>
        <Field label="Grupo Empresarial">{{ s.grupoEmpresarial }}</Field>
        <Field label="Documento">
          <span class="flex items-center" style="gap: 6px">{{ d.documento }}<CopyButton :value="d.documento" /></span>
        </Field>
        <Field label="Gerente">{{ s.gerente }}</Field>
      </div>
    </Section>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <Card title="Dados Bancários" :icon="Banknote">
        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 18px">
          <Field label="Banco">{{ d.banco }}</Field>
          <Field label="Agência">{{ d.agencia }}</Field>
          <Field label="Conta">{{ d.conta }}</Field>
        </div>
      </Card>
      <Card title="Configuração" :icon="ArrowRightLeft">
        <div class="grid items-end" style="grid-template-columns: 1fr 1fr; gap: 14px">
          <SelectField label="Esteira" :options="esteiraOpts" v-model="esteiraModel" />
          <ToggleRow
            label="Quitação de Vencidos"
            :on="d.quitacaoVencidos"
            compact
            @toggle="emit('updateQuitacao', !d.quitacaoVencidos)"
          />
        </div>
      </Card>
    </div>

    <Section title="Condições Financeiras">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Tipo de Taxa">{{ d.tipoTaxa }}</Field>
        <Field label="Frequência">{{ d.frequencia }}</Field>
        <Field label="Taxa de Operação">{{ `${s.taxa.toFixed(2).replace('.', ',')}%` }}</Field>
        <Field label="FEE">{{ `${d.fee}%` }}</Field>
        <Field label="Valor FEE">{{ brl(d.valorFee) }}</Field>
        <Field label="% Seguro Prestamista">{{ `${d.percSeguro}%` }}</Field>
        <Field label="Valor Seguro Prestamista">{{ brl(d.valorSeguro) }}</Field>
      </div>
    </Section>

    <Section title="Agrupamento de Limites">
      <EmptyState
        v-if="det.limites.length === 0"
        :icon="Layers"
        title="Nenhum limite agrupado"
        hint="Os agrupamentos de limite aparecerão aqui quando vinculados a esta solicitação."
      />
    </Section>

    <Section title="Partes Relacionadas">
      <template #action>
        <GhostButton :icon="Plus" @click="emit('addParte')">Nova parte</GhostButton>
      </template>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          :style="{
            gridTemplateColumns: PARTES_COLS,
            padding: '12px 16px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Nome</div>
          <div>Documento</div>
          <div>E-mail</div>
          <div>Telefone</div>
          <div>Tipo</div>
        </div>
        <div
          v-for="(p, i) in partesPageItems"
          :key="`${p.documento}-${i}`"
          class="grid items-center parte-row"
          role="button"
          tabindex="0"
          :style="{
            gridTemplateColumns: PARTES_COLS,
            padding: '12px 16px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'background var(--duration-fast)',
          }"
          @click="emit('openParte', p)"
          @keydown.enter="emit('openParte', p)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.documento }}</div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ p.email }}
          </div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ p.telefone }}</div>
          <div class="flex items-center" style="gap: 4px; flex-wrap: wrap">
            <span
              v-for="t in p.tipos"
              :key="t"
              :title="PARTE_LEGENDA[t]"
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '3px 7px',
                borderRadius: 'var(--radius-sm)',
                background: parteTone[t].bg,
                color: parteTone[t].fg,
              }"
            >
              {{ t }}
            </span>
          </div>
        </div>

        <TablePagination
          sunken
          compact
          :total="partesTotal"
          :page="partesPage"
          :page-size="partesPageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPartesPage"
          @update:page-size="setPartesPageSize"
        />
      </div>
      <div class="flex items-center" style="gap: 16px; margin-top: 12px; flex-wrap: wrap">
        <span
          v-for="t in partesTipos"
          :key="t"
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted)"
        >
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: parteTone[t].bg,
              color: parteTone[t].fg,
            }"
          >
            {{ t }}
          </span>
          {{ PARTE_LEGENDA[t] }}
        </span>
      </div>
    </Section>

    <EditarValorOperacaoModal
      v-if="showValorModal"
      :valor-atual="s.valor"
      :fee-percent="d.fee"
      @close="showValorModal = false"
      @confirm="onConfirmValor"
    />
  </div>
</template>

<style scoped>
.parte-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div class="flex items-center justify-between" style="margin-bottom: 16px; gap: 12px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </div>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>
```

### Field

```vue
<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.14em;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 6px;
      "
    >
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      <slot />
    </div>
  </div>
</template>
```

### Card

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon: Component }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 16px">
      <component :is="icon" :size="15" style="color: var(--gci-base)" />
      <span
        style="
          font-size: 11px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--text-strong);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </span>
    </div>
    <slot />
  </div>
</template>
```

### EmptyState

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; title: string; hint?: string }>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 48px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <component :is="icon" :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
      {{ title }}
    </div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">
      {{ hint }}
    </div>
  </div>
</template>
```

### GhostButton

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center"
    style="
      gap: 8px;
      height: 38px;
      padding: 0 16px;
      background: var(--surface-card);
      color: var(--text-strong);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.06em;
    "
    @click="emit('click')"
  >
    <component :is="icon" :size="15" /><slot />
  </button>
</template>
```

### CopyButton

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleClick(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    :style="{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      flexShrink: 0,
    }"
    @click="handleClick"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

## Detalhe / Ativos

### AtivosTab

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Plus, Boxes, Search, Link2, Download, MoreVertical, Trash2, CalendarClock, CheckCircle2 } from 'lucide-vue-next';
import { brl, detalheSolicitacao, type ContratoAtivo } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';
import AtivosTable from './ativos/AtivosTable.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
}>();

const emit = defineEmits<{
  addContrato: [];
  openAtivo: [ativo: ContratoAtivo];
  vincular: [];
  exportar: [];
  remover: [ids: string[]];
  prorrogar: [ids: string[]];
  confirmar: [ids: string[]];
}>();

const filtroLastro = ref('');
const filtroNumero = ref('');
const filtroSacado = ref('');
const selectedIds = ref<Set<string>>(new Set());
const menuOpen = ref(false);
const menuRef = ref<HTMLDivElement | null>(null);

const ativosFiltrados = computed(() => {
  const l = filtroLastro.value.trim().toLowerCase();
  const n = filtroNumero.value.trim().toLowerCase();
  const s = filtroSacado.value.trim().toLowerCase();
  return props.det.ativos.filter((a) => {
    if (l && !a.lastro.toLowerCase().includes(l)) return false;
    if (n && !a.numero.toLowerCase().includes(n)) return false;
    if (s && !a.sacadoNome.toLowerCase().includes(s)) return false;
    return true;
  });
});

const total = computed(() => props.det.ativos.reduce((acc, a) => acc + a.valorTotal, 0));
const totalSelecionado = computed(() =>
  props.det.ativos.filter((a) => selectedIds.value.has(a.id)).reduce((acc, a) => acc + a.valorTotal, 0),
);
const hasSelection = computed(() => selectedIds.value.size > 0);

const menuActions = [
  { key: 'remover', label: 'Remover', icon: Trash2, danger: true },
  { key: 'prorrogar', label: 'Prorrogar Vencimento', icon: CalendarClock },
  { key: 'confirmar', label: 'Confirmar', icon: CheckCircle2 },
] as const;

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleAll() {
  const all = ativosFiltrados.value.every((a) => selectedIds.value.has(a.id));
  const next = new Set(selectedIds.value);
  for (const a of ativosFiltrados.value) {
    if (all) next.delete(a.id);
    else next.add(a.id);
  }
  selectedIds.value = next;
}

function handleMenuAction(key: (typeof menuActions)[number]['key']) {
  menuOpen.value = false;
  const ids = [...selectedIds.value];
  if (key === 'remover') emit('remover', ids);
  else if (key === 'prorrogar') emit('prorrogar', ids);
  else if (key === 'confirmar') emit('confirmar', ids);
}

function handleDocClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) menuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleDocClick));
onUnmounted(() => document.removeEventListener('mousedown', handleDocClick));
</script>

<template>
  <Section title="Ativos Vinculados">
    <template #action>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <GhostButton :icon="Link2" @click="emit('vincular')">Vincular Ativos</GhostButton>
        <GhostButton :icon="Plus" @click="emit('addContrato')">Adicionar Contrato</GhostButton>
        <GhostButton :icon="Download" @click="emit('exportar')">Exportar</GhostButton>
        <div ref="menuRef" style="position: relative">
          <button
            aria-label="Mais ações"
            class="flex items-center justify-center"
            style="
              width: 40px;
              height: 40px;
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-strong);
            "
            @click="menuOpen = !menuOpen"
          >
            <MoreVertical :size="18" />
          </button>
          <div
            v-if="menuOpen"
            class="flex flex-col"
            style="
              position: absolute;
              top: 46px;
              right: 0;
              z-index: 50;
              min-width: 220px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
              padding: 6px;
            "
          >
            <button
              v-for="a in menuActions"
              :key="a.key"
              :disabled="!hasSelection"
              class="flex items-center menu-item"
              :class="{ danger: a.danger }"
              style="
                gap: 10px;
                padding: 10px 12px;
                background: none;
                border: none;
                cursor: pointer;
                border-radius: var(--radius-md);
                text-align: left;
                font-size: var(--text-sm);
                font-weight: var(--weight-semibold);
                color: var(--text-default);
                width: 100%;
              "
              @click="handleMenuAction(a.key)"
            >
              <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
              {{ a.label }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center" style="gap: 12px; margin-bottom: 16px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroLastro" placeholder="Lastro" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroNumero" placeholder="Número" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroSacado" placeholder="Sacado" class="filter-input" />
      </div>
    </div>

    <EmptyState
      v-if="det.ativos.length === 0"
      :icon="Boxes"
      title="Nenhum ativo vinculado"
      hint="Use “Vincular Ativos” ou “Adicionar Contrato” para vincular lastros a esta solicitação."
    />
    <AtivosTable
      v-else
      :ativos="ativosFiltrados"
      :selected-ids="selectedIds"
      @toggle="toggle"
      @toggle-all="toggleAll"
      @open-ativo="emit('openAtivo', $event)"
    />

    <div
      class="flex items-center justify-between"
      style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px"
    >
      <div class="flex items-center" style="gap: 24px; flex-wrap: wrap">
        <div>
          <span style="font-size: var(--text-xs); color: var(--text-muted); display: block">Valor total</span>
          <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(total) }}
          </span>
        </div>
        <div v-if="hasSelection">
          <span style="font-size: var(--text-xs); color: var(--text-muted); display: block">Valor total dos selecionados</span>
          <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--accent); font-variant-numeric: tabular-nums">
            {{ brl(totalSelecionado) }}
          </span>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.filter-input {
  width: 100%;
  height: 40px;
  padding-left: 36px;
  padding-right: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.menu-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.menu-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.menu-item.danger:not(:disabled) {
  color: var(--action-danger-text-only);
}
</style>
```

### AtivosTable

```vue
<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, type ContratoAtivo } from '../../../data/operacaoData';
import {
  TONE_ENTREGA,
  TONE_SIT_PAGAMENTO,
  TONE_SITUACAO,
  TONE_STATUS_ANEXOS,
} from '../../../data/ativoData';

const props = defineProps<{
  ativos: ContratoAtivo[];
  selectedIds: Set<string>;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  toggleAll: [];
  openAtivo: [ativo: ContratoAtivo];
}>();

const allSelected = computed(
  () => props.ativos.length > 0 && props.ativos.every((a) => props.selectedIds.has(a.id)),
);
const someSelected = computed(
  () => props.ativos.some((a) => props.selectedIds.has(a.id)) && !allSelected.value,
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.ativos,
  { defaultPageSize: 10 },
);
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div style="overflow-x: auto">
      <div style="min-width: 1400px">
        <div
          class="grid items-center"
          style="
            grid-template-columns: 40px 90px 120px 80px 90px 70px 100px 120px 1.2fr 1.2fr 100px 100px 110px 90px 100px;
            padding: 12px 16px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="emit('toggleAll')" />
          </div>
          <div>Registro</div>
          <div>Status anexos</div>
          <div>Anexos</div>
          <div>Lastro</div>
          <div>Entrega</div>
          <div>Número</div>
          <div>Valor nominal</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Confirmação</div>
          <div>Situação</div>
          <div>Sit. pagamento</div>
          <div>Entrada</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="a in pageItems"
          :key="a.id"
          class="grid items-center row-clickable"
          style="
            grid-template-columns: 40px 90px 120px 80px 90px 70px 100px 120px 1.2fr 1.2fr 100px 100px 110px 90px 100px;
            padding: 12px 16px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
          "
          @click="emit('openAtivo', a)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.has(a.id)" @change="emit('toggle', a.id)" />
          </div>
          <div style="color: var(--text-muted)">{{ a.registro }}</div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_STATUS_ANEXOS[a.statusAnexos].bg,
                color: TONE_STATUS_ANEXOS[a.statusAnexos].fg,
              }"
            >
              {{ a.statusAnexos }}
            </span>
          </div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">
            {{ a.anexosEnviados }}/{{ a.anexosTotal }}
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ a.lastro }}
          </div>
          <div>
            <span
              class="badge"
              :style="{ background: TONE_ENTREGA[a.entrega].bg, color: TONE_ENTREGA[a.entrega].fg }"
            >
              {{ a.entrega }}
            </span>
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ a.numero }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(a.valorTotal) }}
          </div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ a.cedenteNome }}
          </div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ a.sacadoNome }}
          </div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_SITUACAO[a.confirmacao === 'CONFIRMADO' ? 'VALIDADO' : a.confirmacao === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE'].bg,
                color: TONE_SITUACAO[a.confirmacao === 'CONFIRMADO' ? 'VALIDADO' : a.confirmacao === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE'].fg,
              }"
            >
              {{ a.confirmacao }}
            </span>
          </div>
          <div>
            <span
              class="badge"
              :style="{ background: TONE_SITUACAO[a.situacao].bg, color: TONE_SITUACAO[a.situacao].fg }"
            >
              {{ a.situacao }}
            </span>
          </div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_SIT_PAGAMENTO[a.situacaoPagamento].bg,
                color: TONE_SIT_PAGAMENTO[a.situacaoPagamento].fg,
              }"
            >
              {{ a.situacaoPagamento.replace('_', ' ') }}
            </span>
          </div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.entrada }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.vencimento }}</div>
        </div>
      </div>
    </div>
    <TablePagination
      v-if="ativos.length > 0"
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>

<style scoped>
.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  white-space: nowrap;
}
.row-clickable:hover {
  background: var(--surface-sunken);
}
</style>
```

## Detalhe / Ativo

### AtivoDetailView

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, FileText, User, Building2 } from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, type ContratoAtivo } from '../../../data/operacaoData';
import { TONE_SITUACAO } from '../../../data/ativoData';
import { CopyButton } from '../shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TituloTab from './TituloTab.vue';
import PessoaDetailTabs from './PessoaDetailTabs.vue';

const props = defineProps<{
  ativo: ContratoAtivo;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'titulo' | 'cedente' | 'sacado';
const tab = ref<Tab>('titulo');

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'titulo', label: 'Título', icon: FileText },
  { key: 'cedente', label: 'Cedente', icon: Building2 },
  { key: 'sacado', label: 'Sacado', icon: User },
];

const tone = computed(() => TONE_SITUACAO[props.ativo.situacao]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          {{ solicitacaoId }} · Detalhes do Ativo
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; gap: 8px; flex-wrap: wrap">
          Título {{ ativo.numero }}
          <CopyButton :value="ativo.numero" />
          <span
            class="flex items-center"
            :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: tone.bg, color: tone.fg }"
          >
            {{ ativo.situacao }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Lastro {{ ativo.lastro }} · {{ ativo.cedenteNome }} → {{ ativo.sacadoNome }}
        </p>
      </div>
      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: -0.02em">
          {{ brl(ativo.valorTotal) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <TituloTab v-if="tab === 'titulo'" :ativo="ativo" />
    <PessoaDetailTabs v-else-if="tab === 'cedente'" :pessoa="ativo.cedente" titulo="Cedente" />
    <PessoaDetailTabs v-else :pessoa="ativo.sacado" titulo="Sacado" :historico="ativo.historicoTitulo" />
  </div>
</template>
```

### PessoaDetailTabs

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { AtivoPessoa } from '../../../data/ativoData';
import type { EventoHistorico } from '../../../data/operacaoData';
import DadosSubTab from './pessoa/DadosSubTab.vue';
import ContatosSubTab from './pessoa/ContatosSubTab.vue';
import EnderecosSubTab from './pessoa/EnderecosSubTab.vue';
import HistoricoSubTab from './pessoa/HistoricoSubTab.vue';

const props = defineProps<{
  pessoa: AtivoPessoa;
  titulo: string;
  historico?: EventoHistorico[];
}>();

const tabs = computed(() => {
  const base = ['Dados', 'Contatos', 'Endereços'] as const;
  return props.historico ? ([...base, 'Histórico'] as const) : base;
});
type SubTab = 'Dados' | 'Contatos' | 'Endereços' | 'Histórico';
const tab = ref<SubTab>('Dados');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in tabs"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
        @click="tab = t as SubTab"
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DadosSubTab v-if="tab === 'Dados'" :pessoa="pessoa" :titulo="titulo" />
      <ContatosSubTab v-else-if="tab === 'Contatos'" :pessoa="pessoa" />
      <EnderecosSubTab v-else-if="tab === 'Endereços'" :pessoa="pessoa" />
      <HistoricoSubTab v-else-if="historico" :historico="historico" />
    </div>
  </div>
</template>
```

### DadosSubTab

```vue
<script setup lang="ts">
import type { AtivoPessoa } from '../../../../data/ativoData';
import { Section, Field } from '../../shared';

defineProps<{ pessoa: AtivoPessoa; titulo: string }>();
</script>

<template>
  <Section :title="`Dados do ${titulo}`">
    <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 16px">
      <Field label="Nome">{{ pessoa.nome }}</Field>
      <Field label="Documento">{{ pessoa.documento }}</Field>
    </div>
  </Section>
</template>
```

### EnderecosSubTab

```vue
<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
import type { AtivoPessoa } from '../../../../data/ativoData';
import { EmptyState } from '../../shared';

defineProps<{ pessoa: AtivoPessoa }>();
</script>

<template>
  <EmptyState
    v-if="pessoa.enderecos.length === 0"
    :icon="MapPin"
    title="Nenhum endereço cadastrado"
    hint="Não há endereços registrados para esta pessoa."
  />
  <div v-else class="flex flex-col" style="gap: 12px">
    <div
      v-for="e in pessoa.enderecos"
      :key="e.id"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
        {{ e.localidade }}, {{ e.numero }} — {{ e.bairro }}
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ e.cidade }}/{{ e.uf }} · CEP {{ e.cep }} · {{ e.pais }}
      </div>
      <div v-if="e.infoAdicionais" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
        {{ e.infoAdicionais }}
      </div>
    </div>
  </div>
</template>
```

### ContatosSubTab

```vue
<script setup lang="ts">
import { Phone, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { AtivoPessoa } from '../../../../data/ativoData';
import { EmptyState } from '../../shared';

const props = defineProps<{ pessoa: AtivoPessoa }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.pessoa.contatos,
  { defaultPageSize: 10 },
);
</script>

<template>
  <EmptyState
    v-if="pessoa.contatos.length === 0"
    :icon="Phone"
    title="Nenhum contato cadastrado"
    hint="Não há contatos registrados para esta pessoa."
  />
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase"
    >
      <div>Nome</div>
      <div>E-mail</div>
      <div>Telefone</div>
      <div />
    </div>
    <div
      v-for="c in pageItems"
      :key="c.id"
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
      <div style="color: var(--text-muted)">{{ c.email }}</div>
      <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.ddi }} {{ c.telefone }}</div>
      <div class="flex justify-end">
        <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)">
          <Trash2 :size="13" />
        </button>
      </div>
    </div>
    <TablePagination
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>
```

### HistoricoSubTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import type { EventoHistorico } from '../../../../data/operacaoData';
import { Section } from '../../shared';

defineProps<{ historico: EventoHistorico[] }>();
</script>

<template>
  <Section title="Histórico">
    <div class="flex flex-col" style="position: relative">
      <div
        v-for="(ev, i) in historico"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span
            v-if="i < historico.length - 1"
            style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            <strong>{{ ev.autor }}</strong> {{ ev.acao }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ ev.data }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### TituloTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { ContratoAtivo } from '../../../data/operacaoData';
import DetalhesTituloTab from './titulo/DetalhesTituloTab.vue';
import AnexosTituloTab from './titulo/AnexosTituloTab.vue';
import PagamentosTituloTab from './titulo/PagamentosTituloTab.vue';
import ConfirmacoesTituloTab from './titulo/ConfirmacoesTituloTab.vue';
import ObservacoesCobrancaTab from './titulo/ObservacoesCobrancaTab.vue';
import MovimentacoesTituloTab from './titulo/MovimentacoesTituloTab.vue';

defineProps<{ ativo: ContratoAtivo }>();

const SUB_TABS = [
  'Detalhes do Título',
  'Anexos',
  'Pagamentos',
  'Confirmações',
  'Observações de Cobrança',
  'Movimentações',
] as const;
type SubTab = (typeof SUB_TABS)[number];
const tab = ref<SubTab>('Detalhes do Título');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in SUB_TABS"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetalhesTituloTab v-if="tab === 'Detalhes do Título'" :ativo="ativo" />
      <AnexosTituloTab v-else-if="tab === 'Anexos'" :ativo="ativo" />
      <PagamentosTituloTab v-else-if="tab === 'Pagamentos'" :ativo="ativo" />
      <ConfirmacoesTituloTab v-else-if="tab === 'Confirmações'" :ativo="ativo" />
      <ObservacoesCobrancaTab v-else-if="tab === 'Observações de Cobrança'" :ativo="ativo" />
      <MovimentacoesTituloTab v-else :ativo="ativo" />
    </div>
  </div>
</template>
```

### DetalhesTituloTab

```vue
<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import { brl, type ContratoAtivo } from '../../../../data/operacaoData';
import { Section, Field } from '../../shared';
import Participant from './Participant.vue';

defineProps<{ ativo: ContratoAtivo }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Número">{{ ativo.numero }}</Field>
        <Field label="Tipo">{{ ativo.tipo }}</Field>
        <Field label="Lastro">{{ ativo.lastro }}</Field>
        <Field label="Registro">{{ ativo.registro }}</Field>
        <Field label="Entrega">{{ ativo.entrega }}</Field>
        <Field label="Confirmação">{{ ativo.confirmacao }}</Field>
      </div>
    </Section>
    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Valor nominal">{{ brl(ativo.valorTotal) }}</Field>
        <Field label="Situação">{{ ativo.situacao }}</Field>
        <Field label="Situação de pagamento">{{ ativo.situacaoPagamento.replace('_', ' ') }}</Field>
      </div>
    </Section>
    <Section title="Datas">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <Field label="Emissão">{{ ativo.emissao }}</Field>
        <Field label="Entrada">{{ ativo.entrada }}</Field>
        <Field label="Vencimento">{{ ativo.vencimento }}</Field>
      </div>
    </Section>
    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="ativo.cedenteNome" :cnpj="ativo.cedenteDocumento" :icon="Building2" />
        <Participant role="Sacado" :name="ativo.sacadoNome" :cnpj="ativo.sacadoDocumento" :icon="User" />
      </div>
    </Section>
  </div>
</template>
```

### PagamentosTituloTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { brl, type ContratoAtivo } from '../../../../data/operacaoData';
import type { AtivoDetalhePagamentos, AtivoPagamento } from '../../../../data/ativoData';
import {
  CONFIGURACAO_TITULO_FIELDS,
  REGISTRAR_PAGAMENTO_FIELDS,
  type PagamentoFormState,
} from '../../../../data/pagamentoFields';
import { Section, EmptyState, GhostButton } from '../../shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import DynamicPagamentoFormGrid from './DynamicPagamentoFormGrid.vue';
import DynamicConfigGrid from './DynamicConfigGrid.vue';

const props = defineProps<{ ativo: ContratoAtivo }>();
const det = ref<AtivoDetalhePagamentos>({ ...props.ativo.pagamentosDetalhe });

const emptyForm: PagamentoFormState = {
  valorAmortizacao: '',
  dataPagamento: '',
  tipoPagamento: '',
  jurosMoratorio: '',
  multa: '',
  jurosRemuneratorio: '',
  transferenciaParcial: false,
  observacao: '',
};
const form = ref<PagamentoFormState>({ ...emptyForm });
const configOpen = ref(false);

const {
  page: pagamentosPage,
  pageSize: pagamentosPageSize,
  total: pagamentosTotal,
  pageItems: pagamentosPageItems,
  setPage: setPagamentosPage,
  setPageSize: setPagamentosPageSize,
} = useTablePagination(() => det.value.pagamentos, { defaultPageSize: 10 });

const {
  page: cronogramaPage,
  pageSize: cronogramaPageSize,
  total: cronogramaTotal,
  pageItems: cronogramaPageItems,
  setPage: setCronogramaPage,
  setPageSize: setCronogramaPageSize,
} = useTablePagination(() => det.value.cronograma, { defaultPageSize: 10 });

const totalPago = computed(() =>
  det.value.pagamentos.filter((p) => !p.estornado).reduce((acc, p) => acc + p.valorAmortizacao, 0),
);
const canSalvar = computed(
  () => form.value.valorAmortizacao.trim() !== '' && form.value.dataPagamento.trim() !== '' && form.value.tipoPagamento.trim() !== '',
);

const configuracaoDisplay = computed(() => ({
  tipoCalculo: det.value.configuracao.tipoCalculo,
  valorEmissao: brl(det.value.configuracao.valorEmissao),
  vencimentoFinal: det.value.configuracao.vencimentoFinal || '—',
  taxa: det.value.configuracao.taxa,
  frequenciaTaxa: det.value.configuracao.frequenciaTaxa,
  tipoCapitalizacao: det.value.configuracao.tipoCapitalizacao,
  baseDias: det.value.configuracao.baseDias,
  fluxoAmortizacao: det.value.configuracao.fluxoAmortizacao,
  fluxoJuros: det.value.configuracao.fluxoJuros,
}));

function handleSalvar() {
  if (!canSalvar.value) return;
  const novo: AtivoPagamento = {
    data: form.value.dataPagamento,
    valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
    tipoPagamento: form.value.tipoPagamento,
    jurosRemuneratorio: Number(form.value.jurosRemuneratorio) || 0,
    jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
    multa: Number(form.value.multa) || 0,
    desconto: 0,
  };
  det.value = { ...det.value, pagamentos: [novo, ...det.value.pagamentos] };
  form.value = { ...emptyForm };
}
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Valor em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(Math.max(ativo.valorTotal - totalPago, 0)) }}
        </div>
      </div>
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Juros remuneratórios em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(det.jurosRemuneratorioAberto) }}
        </div>
      </div>
    </div>

    <Section title="Registrar Pagamento">
      <DynamicPagamentoFormGrid v-model="form" :fields="REGISTRAR_PAGAMENTO_FIELDS" :cols="3" />
      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <GhostButton v-if="canSalvar" :icon="Wallet" @click="handleSalvar">Registrar pagamento</GhostButton>
      </div>
    </Section>

    <Section title="Histórico de Pagamentos">
      <EmptyState v-if="det.pagamentos.length === 0" :icon="Wallet" title="Nenhum pagamento registrado" hint="Use o formulário acima para registrar um pagamento." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Valor</div><div>Tipo</div><div>Status</div>
        </div>
        <div v-for="(p, i) in pagamentosPageItems" :key="i" class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>{{ p.data }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.valorAmortizacao) }}</div>
          <div>{{ p.tipoPagamento }}</div>
          <div>{{ p.estornado ? 'Estornado' : 'Ativo' }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="pagamentosTotal"
          :page="pagamentosPage"
          :page-size="pagamentosPageSize"
          @update:page="setPagamentosPage"
          @update:page-size="setPagamentosPageSize"
        />
      </div>
    </Section>

    <Section title="Configuração do Título">
      <button
        class="flex items-center"
        style="gap: 8px; background: none; border: none; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px"
        @click="configOpen = !configOpen"
      >
        <component :is="configOpen ? ChevronUp : ChevronDown" :size="16" />
        {{ configOpen ? 'Ocultar' : 'Expandir' }} configuração
      </button>
      <DynamicConfigGrid v-if="configOpen" :fields="CONFIGURACAO_TITULO_FIELDS" :data="configuracaoDisplay" :cols="3" />
    </Section>

    <Section title="Cronograma de Pagamentos">
      <EmptyState v-if="det.cronograma.length === 0" :icon="Wallet" title="Nenhuma parcela no cronograma" hint="O cronograma será gerado automaticamente ou manualmente." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Parcela</div><div>Vencimento</div><div>Amortização</div><div>Valor</div>
        </div>
        <div v-for="p in cronogramaPageItems" :key="p.parcela" class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>{{ p.parcela }}</div>
          <div>{{ p.vencimento }}</div>
          <div>{{ p.amortizacao != null ? brl(p.amortizacao) : '—' }}</div>
          <div>{{ p.valor != null ? brl(p.valor) : '—' }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="cronogramaTotal"
          :page="cronogramaPage"
          :page-size="cronogramaPageSize"
          @update:page="setCronogramaPage"
          @update:page-size="setCronogramaPageSize"
        />
      </div>
    </Section>
  </div>
</template>
```

### ConfirmacoesTituloTab

```vue
<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import { EmptyState } from '../../shared';

const props = defineProps<{ ativo: ContratoAtivo }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.ativo.confirmacoes,
  { defaultPageSize: 10 },
);
</script>

<template>
  <EmptyState
    v-if="ativo.confirmacoes.length === 0"
    :icon="CheckCircle2"
    title="Nenhuma confirmação registrada"
    hint="As confirmações do título aparecerão aqui após serem registradas."
  />
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      style="
        grid-template-columns: 1.5fr 1fr 1fr 100px 80px;
        padding: 12px 16px;
        background: var(--surface-sunken);
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.08em;
        color: var(--text-muted);
        text-transform: uppercase;
      "
    >
      <div>Observação</div>
      <div>Confirmado por</div>
      <div>Data</div>
      <div>Status</div>
      <div>Ações</div>
    </div>
    <div
      v-for="(c, i) in pageItems"
      :key="i"
      class="grid items-center"
      style="grid-template-columns: 1.5fr 1fr 1fr 100px 80px; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="color: var(--text-default)">{{ c.observacao || '—' }}</div>
      <div>{{ c.confirmadoPor }}</div>
      <div style="font-variant-numeric: tabular-nums">{{ c.data }}</div>
      <div>{{ c.status }}</div>
      <div style="color: var(--accent); font-weight: var(--weight-semibold); cursor: pointer">Ver</div>
    </div>
    <TablePagination
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>
```

### MovimentacoesTituloTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import { Section } from '../../shared';

defineProps<{ ativo: ContratoAtivo }>();
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="position: relative">
      <div
        v-for="(ev, i) in ativo.historicoTitulo"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span
            v-if="i < ativo.historicoTitulo.length - 1"
            style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            <strong>{{ ev.autor }}</strong> {{ ev.acao }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ ev.data }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### AnexosTituloTab

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import DocGroup from '../../../../components/novo-pedido/DocGroup.vue';

const props = defineProps<{ ativo: ContratoAtivo }>();

const docFiles = reactive<Record<string, boolean>>(
  Object.fromEntries(props.ativo.anexosDocs.map((d) => [d.id, d.enviado])),
);

const docs = props.ativo.anexosDocs.map((d) => ({ id: d.id, nome: d.nome, obrigatorio: d.obrigatorio }));

function toggleDoc(id: string) {
  docFiles[id] = !docFiles[id];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 10px">
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--success-light); color: var(--success-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <CheckCircle2 :size="16" /> Confirmar Anexos
      </button>
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--danger-light); color: var(--danger-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <XCircle :size="16" /> Rejeitar Anexos
      </button>
    </div>
    <DocGroup title="Documentos do Título" :docs="docs" :doc-files="docFiles" @toggle-doc="toggleDoc" />
  </div>
</template>
```

### ObservacoesCobrancaTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../../../data/operacaoData';
import { EmptyState } from '../../shared';

defineProps<{ ativo: ContratoAtivo }>();

const mensagem = ref('');
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex" style="gap: 14px">
      <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: 9999px; background: var(--gci-light); color: var(--gci-base); flex-shrink: 0">
        <User :size="20" />
      </div>
      <div style="flex: 1">
        <textarea
          v-model="mensagem"
          placeholder="Escreva uma observação de cobrança..."
          rows="3"
          style="width: 100%; padding: 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; resize: vertical; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit"
        />
        <div class="flex items-center justify-between" style="margin-top: 12px">
          <button class="flex items-center" style="gap: 8px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.06em">
            <Paperclip :size="15" /> ANEXAR
          </button>
          <button class="flex items-center" style="gap: 8px; height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em">
            <Send :size="14" /> Postar
          </button>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="ativo.observacoesCobranca.length === 0"
      :icon="MessageSquare"
      title="Nenhuma observação de cobrança"
      hint="Registre observações sobre a cobrança deste título."
    />
    <div v-else class="flex flex-col" style="gap: 12px">
      <div
        v-for="(obs, i) in ativo.observacoesCobranca"
        :key="i"
        style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
      >
        <div style="font-size: var(--text-sm); color: var(--text-strong)">{{ obs.mensagem }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px">{{ obs.autor }} · {{ obs.data }}</div>
      </div>
    </div>
  </div>
</template>
```

### DynamicPagamentoFormGrid

```vue
<script setup lang="ts">
import { FormField, SelectField, ToggleRow } from '../../../../components/modals/adicionar-contrato';
import type { PagamentoFormFieldDef, PagamentoFormState } from '../../../../data/pagamentoFields';

withDefaults(defineProps<{ fields: PagamentoFormFieldDef[]; cols?: number }>(), { cols: 3 });

const form = defineModel<PagamentoFormState>({ required: true });
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <FormField
        v-if="field.type === 'text'"
        :label="field.label"
        :placeholder="field.placeholder"
        v-model="form[field.key] as string"
      />
      <SelectField
        v-else-if="field.type === 'select'"
        :label="field.label"
        :options="[...(field.options ?? [])]"
        :placeholder="field.placeholder"
        v-model="form[field.key] as string"
      />
      <ToggleRow
        v-else-if="field.type === 'toggle'"
        :label="field.label"
        :on="form[field.key] as boolean"
        spacious
        @toggle="form[field.key] = !(form[field.key] as boolean)"
      />
    </div>
  </div>
</template>
```

### DynamicConfigGrid

```vue
<script setup lang="ts">
import type { ConfiguracaoTituloDisplay, ConfiguracaoTituloFieldDef } from '../../../../data/pagamentoFields';
import { Field } from '../../shared';

withDefaults(defineProps<{ fields: ConfiguracaoTituloFieldDef[]; data: ConfiguracaoTituloDisplay; cols?: number }>(), {
  cols: 3,
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '20px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <Field :label="field.label">{{ data[field.key] || '—' }}</Field>
    </div>
  </div>
</template>
```

### Participant

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import { CopyButton } from '../../shared';

defineProps<{ role: string; name: string; cnpj: string; icon: Component }>();
</script>

<template>
  <div
    class="flex items-center"
    style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
  >
    <div
      class="flex items-center justify-center"
      style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0"
    >
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
        {{ role }}
      </div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ name }}
      </div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">
        {{ cnpj }}<CopyButton :value="cnpj" />
      </div>
    </div>
  </div>
</template>
```

## Detalhe / Parte relacionada

### ParteRelacionadaDetailView

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, User, MapPin, Phone } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ParteRelacionada, ParteTipo } from '../../../data/operacaoData';
import {
  parteAnexoTabs,
  PARTE_TIPO_LABEL,
  TIPOS_PARTE_OPTS,
} from '../../../data/parteRelacionadaFields';
import { CopyButton, Section, EmptyState } from '../shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import DynamicFieldGrid from './DynamicFieldGrid.vue';

const props = defineProps<{
  parte: ParteRelacionada;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

type AnexoTab = 'anexo-1' | 'anexo-2' | 'anexo-3';

const tab = ref<AnexoTab>('anexo-1');

const TAB_ICONS: Record<AnexoTab, Component> = {
  'anexo-1': User,
  'anexo-2': MapPin,
  'anexo-3': Phone,
};

const tabs = computed(() => parteAnexoTabs(props.parte));
const activeTab = computed(() => tabs.value.find((t) => t.key === tab.value) ?? tabs.value[0]);
const tabOptions = computed(() =>
  tabs.value.map((t) => ({ key: t.key, label: t.label, icon: TAB_ICONS[t.key] })),
);

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};

const {
  page: contatosPage,
  pageSize: contatosPageSize,
  total: contatosTotal,
  pageItems: contatosPageItems,
  setPage: setContatosPage,
  setPageSize: setContatosPageSize,
} = useTablePagination(() => props.parte.contatosRelacionados ?? [], { defaultPageSize: 10 });
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Parte Relacionada
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ parte.nome }}
          <CopyButton :value="parte.documento" />
        </h2>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ parte.documento }} · {{ parte.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabOptions"
      variant="brand"
      @update:model-value="tab = $event as AnexoTab"
    />

    <!-- Conteúdo do anexo ativo -->
    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <DynamicFieldGrid
        v-if="activeTab"
        :parte="parte"
        :fields="activeTab.fields"
        :cols="activeTab.cols"
      />

      <!-- Tabela de contatos relacionados (Anexo 1) -->
      <div v-if="tab === 'anexo-1'" style="margin-top: 32px">
        <Section title="Contatos Relacionados">
          <EmptyState
            v-if="!parte.contatosRelacionados?.length"
            :icon="User"
            title="Nenhum contato relacionado"
            hint="Contatos vinculados a esta parte aparecerão aqui quando cadastrados."
          />
          <div
            v-else
            style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
          >
            <div
              class="grid"
              style="
                grid-template-columns: 1.1fr 1.6fr 1.4fr 1fr;
                padding: 12px 16px;
                background: var(--surface-sunken);
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
              "
            >
              <div>Documento</div>
              <div>Nome</div>
              <div>E-mail</div>
              <div>Telefone</div>
            </div>
            <div
              v-for="(c, i) in contatosPageItems"
              :key="`${c.documento}-${i}`"
              class="grid items-center"
              style="
                grid-template-columns: 1.1fr 1.6fr 1.4fr 1fr;
                padding: 12px 16px;
                border-top: 1px solid var(--border-default);
                font-size: var(--text-sm);
              "
            >
              <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.documento }}</div>
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
              <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ c.email }}
              </div>
              <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ c.telefone }}</div>
            </div>
            <TablePagination
              sunken
              compact
              :total="contatosTotal"
              :page="contatosPage"
              :page-size="contatosPageSize"
              @update:page="setContatosPage"
              @update:page-size="setContatosPageSize"
            />
          </div>
        </Section>
      </div>

      <!-- Tipos (Anexo 3) -->
      <div v-if="tab === 'anexo-3'" style="margin-top: 32px">
        <Section title="Tipos">
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
            <div
              v-for="t in TIPOS_PARTE_OPTS"
              :key="t.codigo"
              class="flex items-center"
              :style="{
                gap: '10px',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                color: parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--text-strong)' : 'var(--text-muted)',
              }"
            >
              <span
                :style="{
                  width: '18px',
                  height: '18px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--gci-base)' : 'var(--border-strong)'}`,
                  background: parte.tipos.includes(t.codigo as ParteTipo) ? 'var(--gci-base)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <span
                  v-if="parte.tipos.includes(t.codigo as ParteTipo)"
                  style="width: 8px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg) translateY(-1px)"
                />
              </span>
              {{ t.label }}
            </div>
          </div>
          <div class="flex items-center" style="gap: 8px; margin-top: 16px; flex-wrap: wrap">
            <span
              v-for="t in parte.tipos"
              :key="t"
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '3px 7px',
                borderRadius: 'var(--radius-sm)',
                background: parteTone[t].bg,
                color: parteTone[t].fg,
              }"
            >
              {{ PARTE_TIPO_LABEL[t] }}
            </span>
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>
```

### DynamicFieldGrid

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { ParteRelacionada } from '../../../data/operacaoData';
import type { ParteFieldDef } from '../../../data/parteRelacionadaFields';
import { visibleParteFields, parteFieldValue } from '../../../data/parteRelacionadaFields';
import { Field } from '../shared';

const props = defineProps<{
  parte: ParteRelacionada;
  fields: ParteFieldDef[];
  cols?: number;
}>();

const visible = computed(() => visibleParteFields(props.parte, props.fields));
const gridCols = computed(() => props.cols ?? 3);
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '24px' }">
    <div
      v-for="field in visible"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, gridCols)}` } : undefined"
    >
      <Field :label="field.label">{{ parteFieldValue(parte, field) }}</Field>
    </div>
  </div>
</template>
```

## Detalhe / Garantias

### GarantiasTab

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Plus,
  ShieldCheck,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-vue-next";
import {
  detalheSolicitacao,
  formatValorGarantia,
  type GarantiaOperacao,
} from "../../data/operacaoData";
import { Section, EmptyState, GhostButton } from "./shared";
import SegmentedToggle from "@/components/ui/SegmentedToggle.vue";
import CadastrarGarantiaModal from "../../components/modals/CadastrarGarantiaModal.vue";
import ExcluirGarantiaModal from "../../components/modals/ExcluirGarantiaModal.vue";

const props = defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();

const view = ref<"table" | "cards">("table");
const showModal = ref(false);
const editing = ref<GarantiaOperacao | null>(null);
const toDelete = ref<GarantiaOperacao | null>(null);
const hoveredId = ref<string | null>(null);

const VIEW_OPTS = [
  { key: "table", icon: List, label: "Tabela" },
  { key: "cards", icon: LayoutGrid, label: "Cards" },
];

function openNova() {
  editing.value = null;
  showModal.value = true;
}

function openEdit(g: GarantiaOperacao) {
  editing.value = g;
  showModal.value = true;
}

function askRemove(g: GarantiaOperacao) {
  toDelete.value = g;
}

function confirmRemove() {
  if (!toDelete.value) return;
  props.det.garantias = props.det.garantias.filter(
    (g) => g.id !== toDelete.value!.id,
  );
  toDelete.value = null;
}

function onSave(g: GarantiaOperacao) {
  const idx = props.det.garantias.findIndex((x) => x.id === g.id);
  if (idx >= 0) {
    props.det.garantias[idx] = g;
  } else {
    props.det.garantias.push(g);
  }
  showModal.value = false;
  editing.value = null;
}
</script>

<template>
  <Section title="Garantias">
    <template #action>
      <div class="flex items-center" style="gap: 10px">
        <SegmentedToggle
          v-if="det.garantias.length > 0"
          :model-value="view"
          :options="VIEW_OPTS"
          icon-only
          @update:model-value="view = $event as 'table' | 'cards'"
        />
        <GhostButton :icon="Plus" @click="openNova"
          >Adicionar garantia</GhostButton
        >
      </div>
    </template>

    <EmptyState
      v-if="det.garantias.length === 0"
      :icon="ShieldCheck"
      title="Nenhuma garantia cadastrada"
      hint="Adicione garantias reais ou fidejussórias para fortalecer a operação."
    />

    <!-- Tabela (preferencial) -->
    <div
      v-else-if="view === 'table'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
      "
    >
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1.6fr 1fr 100px;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Nome</div>
        <div>Valor</div>
        <div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="g in det.garantias"
        :key="g.id"
        class="grid items-center"
        style="
          grid-template-columns: 1.2fr 1.6fr 1fr 100px;
          padding: 12px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ g.tipo }}
        </div>
        <div style="color: var(--text-default)">{{ g.nome }}</div>
        <div
          style="color: var(--text-default); font-variant-numeric: tabular-nums"
        >
          {{ formatValorGarantia(g.valor) }}
        </div>
        <div class="flex items-center justify-end" style="gap: 6px">
          <button
            aria-label="Editar"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--gci-base);
            "
            @click="openEdit(g)"
          >
            <Pencil :size="14" />
          </button>
          <button
            aria-label="Excluir"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--action-danger-text-only);
            "
            @click="askRemove(g)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div
      v-else
      class="grid"
      style="
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      "
    >
      <div
        v-for="g in det.garantias"
        :key="g.id"
        class="flex flex-col"
        :style="{
          gap: '14px',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredId === g.id ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          boxShadow:
            hoveredId === g.id
              ? '0 20px 40px -16px rgba(8,60,74,0.10)'
              : 'none',
          transform: hoveredId === g.id ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @mouseenter="hoveredId = g.id"
        @mouseleave="hoveredId = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <ShieldCheck :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            {{ g.tipo }}
          </div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 4px;
            "
          >
            {{ g.nome }}
          </div>
          <div
            style="
              font-size: var(--text-xs);
              color: var(--text-muted);
              line-height: 1.5;
            "
          >
            {{ g.anexos.filter((a) => a.enviado).length }}/{{
              g.anexos.length
            }}
            anexos ·
            {{ g.anexos.filter((a) => a.obrigatorio && a.enviado).length }}/{{
              g.anexos.filter((a) => a.obrigatorio).length
            }}
            obrigatórios
          </div>
        </div>
        <div
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
            letter-spacing: -0.02em;
          "
        >
          {{ formatValorGarantia(g.valor) }}
        </div>
        <div style="flex: 1" />
        <div class="flex items-center justify-between" style="gap: 8px">
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 34px;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--action-danger-text-only);
            "
            @click="askRemove(g)"
          >
            <Trash2 :size="13" /> Excluir
          </button>
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 34px;
              padding: 0 12px;
              border-radius: var(--radius-md);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
            "
            @click="openEdit(g)"
          >
            <Pencil :size="13" /> Editar
          </button>
        </div>
      </div>
    </div>
  </Section>

  <CadastrarGarantiaModal
    v-if="showModal"
    :garantia="editing"
    @close="
      showModal = false;
      editing = null;
    "
    @save="onSave"
  />

  <ExcluirGarantiaModal
    v-if="toDelete"
    :garantia="toDelete"
    @close="toDelete = null"
    @confirm="confirmRemove"
  />
</template>
```

## Detalhe / Validações

### ValidacoesTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-vue-next';
import { detalheSolicitacao, type ItemValidacao } from '../../../data/operacaoData';
import { Section, GhostButton } from '../shared';
import ValidacaoRow from './ValidacaoRow.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
}>();
const emit = defineEmits<{
  openFullView: [];
  inserirEvidencia: [v: ItemValidacao];
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const naoAprovadas = computed(() => props.det.validacoes.filter((v) => v.status === 'NAO_OK'));
const pendentes = computed(() =>
  props.det.validacoes.filter((v) => v.status === 'PENDENTE' || v.status === 'PROCESSANDO'),
);
const aprovadas = computed(() =>
  props.det.validacoes.filter((v) => v.status === 'OK' || v.status === 'EXCECAO'),
);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px; font-size: var(--text-xs); color: var(--text-muted)">
        <AlertCircle :size="15" style="color: var(--text-muted)" />
        As validações só rodam quando a operação tiver título e veículo vinculado.
      </div>
      <div class="flex items-center" style="gap: 8px">
        <button
          class="flex items-center"
          style="
            gap: 6px;
            height: 38px;
            padding: 0 14px;
            background: none;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.04em;
            color: var(--text-strong);
          "
          @click="emit('openFullView')"
        >
          <CheckCircle2 :size="14" /> Ver tela de validações
        </button>
        <GhostButton :icon="RefreshCw">Revalidar</GhostButton>
      </div>
    </div>

    <Section v-if="naoAprovadas.length > 0" :title="`Não Aprovadas (${naoAprovadas.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <ValidacaoRow
          v-for="v in naoAprovadas"
          :key="v.titulo"
          :v="v"
          @inserir-evidencia="emit('inserirEvidencia', $event)"
          @ver-evidencia="emit('verEvidencia', $event)"
          @autorizar="emit('autorizar', $event)"
          @ver-detalhes="emit('verDetalhes', $event)"
        />
      </div>
    </Section>
    <Section v-if="pendentes.length > 0" :title="`Pendentes (${pendentes.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <ValidacaoRow
          v-for="v in pendentes"
          :key="v.titulo"
          :v="v"
          @inserir-evidencia="emit('inserirEvidencia', $event)"
          @ver-evidencia="emit('verEvidencia', $event)"
          @autorizar="emit('autorizar', $event)"
          @ver-detalhes="emit('verDetalhes', $event)"
        />
      </div>
    </Section>
    <Section v-if="aprovadas.length > 0" :title="`Aprovadas (${aprovadas.length})`">
      <div class="flex flex-col" style="gap: 10px">
        <ValidacaoRow
          v-for="v in aprovadas"
          :key="v.titulo"
          :v="v"
          @inserir-evidencia="emit('inserirEvidencia', $event)"
          @ver-evidencia="emit('verEvidencia', $event)"
          @autorizar="emit('autorizar', $event)"
          @ver-detalhes="emit('verDetalhes', $event)"
        />
      </div>
    </Section>
  </div>
</template>
```

### ValidacoesFullView

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
import { detalheSolicitacao, type ItemValidacao } from '../../../data/operacaoData';
import { Section, GhostButton } from '../shared';
import ValidacaoRow from './ValidacaoRow.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
  solicitacaoId: string;
}>();
const emit = defineEmits<{
  back: [];
  inserirEvidencia: [v: ItemValidacao];
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const naoAprovadas = computed(() => props.det.validacoes.filter((v) => v.status === 'NAO_OK'));
const pendentes = computed(() => props.det.validacoes.filter((v) => v.status === 'PENDENTE'));
const processando = computed(() => props.det.validacoes.filter((v) => v.status === 'PROCESSANDO'));
const aprovadas = computed(() =>
  props.det.validacoes.filter((v) => v.status === 'OK' || v.status === 'EXCECAO'),
);
const excecoes = computed(() => props.det.validacoes.filter((v) => v.status === 'EXCECAO'));
const ok = computed(() => props.det.validacoes.filter((v) => v.status === 'OK'));

const kpis = computed(() => [
  { label: 'Não Aprovadas', count: naoAprovadas.value.length, bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle as Component },
  { label: 'Pendentes', count: pendentes.value.length, bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock as Component },
  { label: 'Processando', count: processando.value.length, bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 as Component },
  { label: 'Exceção', count: excecoes.value.length, bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle as Component },
  { label: 'Ok', count: ok.value.length, bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 as Component },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Solicitação de Operação
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          Validações
        </h2>
      </div>
      <GhostButton :icon="RefreshCw">Revalidar todas</GhostButton>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        :style="{ gap: '12px', padding: '16px 18px', background: k.bg, borderRadius: 'var(--radius-xl)' }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.60)',
            color: k.fg,
            flexShrink: 0,
          }"
        >
          <component :is="k.icon" :size="18" />
        </div>
        <div>
          <div
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: k.fg,
              textTransform: 'uppercase',
              marginBottom: '4px',
              opacity: 0.8,
            }"
          >
            {{ k.label }}
          </div>
          <div :style="{ fontSize: '24px', fontWeight: 'var(--weight-bold)', color: k.fg, lineHeight: 1 }">
            {{ k.count }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: var(--text-xs);
        color: var(--text-muted);
        padding: 10px 14px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <AlertCircle :size="14" />
      As validações só rodam quando a operação tiver título e veículo vinculado. Use "Revalidar todas" para
      atualizar.
    </div>

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="flex flex-col" style="gap: 32px">
        <Section v-if="naoAprovadas.length > 0" :title="`Não Aprovadas (${naoAprovadas.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in naoAprovadas"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="pendentes.length > 0" :title="`Pendentes (${pendentes.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in pendentes"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="processando.length > 0" :title="`Processando (${processando.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in processando"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="aprovadas.length > 0" :title="`Aprovadas (${aprovadas.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in aprovadas"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>
```

### ValidacaoRow

```vue
<script setup lang="ts">
import { AlertCircle, CheckCircle2, XCircle, Clock, Loader2, Send, Eye, ListTree } from 'lucide-vue-next';
import type { Component } from 'vue';
import {
  VALIDACAO_STATUS_LABEL,
  type ValidacaoStatus,
  type ItemValidacao,
} from '../../../data/operacaoData';
import { GhostButton } from '../shared';

defineProps<{ v: ItemValidacao }>();
const emit = defineEmits<{
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: Component }> = {
  PENDENTE: { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock },
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 },
  OK: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  NAO_OK: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle },
  EXCECAO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
};
</script>

<template>
  <div
    :style="{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${v.status === 'NAO_OK' || v.status === 'EXCECAO' ? 'var(--danger-light)' : 'var(--border-default)'}`,
      background: v.status === 'NAO_OK' ? 'var(--status-danger-bg)' : 'var(--surface-card)',
      padding: '16px',
    }"
  >
    <div class="flex items-center justify-between" style="gap: 12px">
      <div class="flex items-center" style="gap: 12px; min-width: 0">
        <span
          class="flex items-center justify-center"
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: valTone[v.status].bg,
            color: valTone[v.status].fg,
            flexShrink: 0,
          }"
        >
          <component :is="valTone[v.status].icon" :size="17" />
        </span>
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              v.titulo
            }}</span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 2px 7px;
                border-radius: var(--radius-sm);
                background: var(--status-active-bg);
                color: var(--gci-base);
                text-transform: uppercase;
              "
            >
              {{ v.area }}
            </span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: valTone[v.status].bg,
                color: valTone[v.status].fg,
                textTransform: 'uppercase',
              }"
            >
              {{ VALIDACAO_STATUS_LABEL[v.status] }}
            </span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 3px">{{ v.descricao }}</div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 8px; flex-shrink: 0">
        <GhostButton
          v-if="v.erros?.length"
          :icon="ListTree"
          @click="emit('verDetalhes', v)"
        >
          Ver detalhes
        </GhostButton>
        <template v-if="v.exigeAutorizacao">
          <GhostButton :icon="Send">Solicitar autorização</GhostButton>
          <GhostButton v-if="v.evidencia" :icon="Eye" @click="emit('verEvidencia', v)">Ver evidência</GhostButton>
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 38px;
              padding: 0 16px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.06em;
            "
            @click="emit('autorizar', v)"
          >
            <CheckCircle2 :size="15" /> Autorizar
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
```

## Detalhe / Anexos · Ata · Histórico

### AnexosTab

```vue
<script setup lang="ts">
import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-vue-next';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section, GhostButton } from './shared';

defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();
</script>

<template>
  <Section title="Documentos Anexados">
    <template #action>
      <GhostButton :icon="Download">Baixar todos</GhostButton>
    </template>

    <!-- Linha de upload -->
    <div class="flex items-center" style="gap: 12px; margin-bottom: 18px; flex-wrap: wrap">
      <div
        class="flex items-center"
        style="
          gap: 8px;
          flex: 1;
          min-width: 220px;
          height: 42px;
          padding: 0 14px;
          background: var(--surface-sunken);
          border: 1px dashed var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          font-size: var(--text-sm);
        "
      >
        <Paperclip :size="15" /> Selecionar arquivo...
      </div>
      <div
        style="
          min-width: 180px;
          height: 42px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          font-size: var(--text-sm);
        "
      >
        Tipo
      </div>
      <button
        class="flex items-center"
        style="
          gap: 8px;
          height: 42px;
          padding: 0 18px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.06em;
        "
      >
        <Plus :size="15" /> Inserir
      </button>
    </div>

    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="a in det.anexos"
        :key="a.arquivo"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            background: var(--gci-light);
            color: var(--gci-base);
            flex-shrink: 0;
          "
        >
          <FileText :size="18" />
        </div>
        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              a.nome
            }}</span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: a.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                color: a.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                textTransform: 'uppercase',
              }"
            >
              {{ a.obrigatorio ? 'Obrigatório' : 'Opcional' }}
            </span>
          </div>
          <div
            style="
              font-size: var(--text-xs);
              color: var(--text-muted);
              margin-top: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ a.arquivo }}
          </div>
        </div>
        <button
          aria-label="Baixar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--gci-base);
          "
        >
          <Download :size="15" />
        </button>
        <button
          aria-label="Excluir"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-muted);
          "
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>
  </Section>
</template>
```

### AtaTab

```vue
<script setup lang="ts">
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
import { Section, EmptyState } from './shared';
</script>

<template>
  <Section title="Ata de Deliberação">
    <div class="flex" style="gap: 14px">
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: var(--gci-light);
          color: var(--gci-base);
          flex-shrink: 0;
          font-weight: var(--weight-bold);
        "
      >
        <User :size="20" />
      </div>
      <div style="flex: 1">
        <textarea
          placeholder="Escreva uma mensagem para a ata de deliberação..."
          rows="3"
          style="
            width: 100%;
            padding: 14px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            resize: vertical;
            font-size: var(--text-sm);
            color: var(--text-strong);
            font-family: inherit;
          "
        />
        <div class="flex items-center justify-between" style="margin-top: 12px">
          <button
            class="flex items-center"
            style="
              gap: 8px;
              background: none;
              border: none;
              cursor: pointer;
              color: var(--text-muted);
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
            "
          >
            <Paperclip :size="15" /> ANEXAR
          </button>
          <button
            class="flex items-center"
            style="
              gap: 8px;
              height: 40px;
              padding: 0 18px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.06em;
            "
          >
            <Send :size="14" /> Postar
          </button>
        </div>
      </div>
    </div>
    <div style="margin-top: 28px">
      <EmptyState
        :icon="MessageSquare"
        title="Nenhuma mensagem ainda"
        hint="As deliberações e comentários do time aparecerão aqui em ordem cronológica."
      />
    </div>
  </Section>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section } from './shared';

defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="position: relative">
      <div
        v-for="(ev, i) in det.historico"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span
            style="
              display: block;
              width: 12px;
              height: 12px;
              border-radius: 9999px;
              background: var(--gci-base);
              margin-top: 4px;
            "
          />
          <span
            v-if="i < det.historico.length - 1"
            style="
              position: absolute;
              left: 5px;
              top: 16px;
              bottom: -12px;
              width: 2px;
              background: var(--border-default);
            "
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            <strong>{{ ev.autor }}</strong> {{ ev.acao }}
          </div>
          <div
            class="flex items-center"
            style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px"
          >
            <Clock :size="12" /> {{ ev.data }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

## Novo Pedido

### NovoPedidoModal

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  ShieldCheck,
  Paperclip,
  Boxes,
  AlertTriangle,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import {
  DadosGeraisStep,
  GarantiaStep,
  AtivosDuplicataStep,
  AnexosStep,
  type NewPedidoData,
  type GarantiaItem,
} from './novo-pedido';
import VincularAtivosModal from './modals/VincularAtivosModal.vue';
import type { ContratoAtivo } from '../data/operacaoData';
import {
  DOCS_DESCONTO_DUPLICATA,
  mockAddXmlFile,
  mockTitulosExtraidos,
  type TituloExtraidoDuplicata,
  type XmlUploadItem,
} from '../data/novoPedidoDuplicataData';

const emit = defineEmits<{ close: []; create: [data: NewPedidoData] }>();

interface Step {
  key: 'dados' | 'garantia' | 'ativos' | 'anexos';
  label: string;
  icon: Component;
  hint: string;
}

const DOCS_GERAIS: { id: string; nome: string; obrigatorio: boolean }[] = [
  { id: 'contrato-social', nome: 'Contrato Social', obrigatorio: true },
  { id: 'cartao-cnpj', nome: 'Cartão CNPJ', obrigatorio: true },
  { id: 'balanco', nome: 'Balanço Patrimonial', obrigatorio: true },
  { id: 'end', nome: 'Comprovante de Endereço', obrigatorio: false },
  { id: 'procuracao', nome: 'Procuração', obrigatorio: false },
];

const stepIdx = ref(0);
const form = reactive<NewPedidoData>({
  tipoOperacao: '',
  esteira: '',
  tipoContrato: '',
  unidadeNegocio: '',
  gerenteComercial: '',
  fundo: '',
  grupoEmpresarial: '',
  contaBancaria: '',
  tipoTaxa: 'Pré-fixado',
  taxaOperacao: '',
  indicePos: '',
  operadorPos: '',
  valorTaxaPos: '',
  fee: '',
  valorOperacao: '',
  quitacaoVencidos: false,
  requerGarantia: false,
});

const isDescontoDuplicata = computed(() => form.tipoOperacao === 'Desconto Duplicata');

const steps = computed<Step[]>(() => {
  if (isDescontoDuplicata.value) {
    return [
      { key: 'dados', label: 'Dados Gerais', icon: FileText, hint: 'Parâmetros comerciais e financeiros da operação' },
      { key: 'ativos', label: 'Ativos', icon: Boxes, hint: 'Upload de XML ou vínculo de títulos pendentes' },
      { key: 'anexos', label: 'Anexos', icon: Paperclip, hint: 'Documentação comprobatória da operação' },
    ];
  }
  return [
    { key: 'dados', label: 'Dados Gerais', icon: FileText, hint: 'Parâmetros comerciais e financeiros da operação' },
    { key: 'garantia', label: 'Garantia', icon: ShieldCheck, hint: 'Garantias vinculadas à operação' },
    { key: 'anexos', label: 'Anexos', icon: Paperclip, hint: 'Documentação comprobatória' },
  ];
});

const garantiaItens = reactive<GarantiaItem[]>([]);
const garantiaForm = reactive<GarantiaItem>({ tipo: '', nome: '', valor: '' });

const docFiles = reactive<Record<string, boolean>>({});

const duplicataPhase = ref<'upload' | 'extracted'>('upload');
const xmlFiles = ref<XmlUploadItem[]>([]);
const titulosExtraidos = ref<TituloExtraidoDuplicata[]>([]);
const ativosVinculados = ref<ContratoAtivo[]>([]);
const showVincular = ref(false);

function resetDuplicataState() {
  duplicataPhase.value = 'upload';
  xmlFiles.value = [];
  titulosExtraidos.value = [];
  ativosVinculados.value = [];
}

function resetGarantiaState() {
  garantiaItens.splice(0, garantiaItens.length);
  garantiaForm.tipo = '';
  garantiaForm.nome = '';
  garantiaForm.valor = '';
  form.requerGarantia = false;
}

function clearDocFiles() {
  for (const k of Object.keys(docFiles)) delete docFiles[k];
}

watch(
  () => form.tipoOperacao,
  (next, prev) => {
    if (prev === undefined || next === prev) return;
    stepIdx.value = 0;
    clearDocFiles();
    if (next === 'Desconto Duplicata') {
      resetGarantiaState();
      resetDuplicataState();
    } else {
      resetDuplicataState();
    }
  },
);

function addGarantia() {
  if (!garantiaForm.tipo || !garantiaForm.nome) return;
  garantiaItens.push({ ...garantiaForm });
  garantiaForm.tipo = '';
  garantiaForm.nome = '';
  garantiaForm.valor = '';
}

function removeGarantia(i: number) {
  garantiaItens.splice(i, 1);
}

const docsGarantia = computed(() =>
  garantiaItens.map((g, i) => ({
    id: `garantia-${i}`,
    nome: `Laudo de Avaliação — ${g.nome}`,
    obrigatorio: true,
  })),
);

const docsAnexos = computed(() =>
  isDescontoDuplicata.value ? DOCS_DESCONTO_DUPLICATA : DOCS_GERAIS,
);

const requiredDocs = computed(() => {
  if (isDescontoDuplicata.value) {
    return DOCS_DESCONTO_DUPLICATA.filter((d) => d.obrigatorio);
  }
  return [...DOCS_GERAIS, ...docsGarantia.value].filter((d) => d.obrigatorio);
});

const pendingRequired = computed(() => requiredDocs.value.filter((d) => !docFiles[d.id]).length);
const canConfirm = computed(() => pendingRequired.value === 0);

function toggleDoc(id: string) {
  docFiles[id] = !docFiles[id];
}

const step = computed(() => steps.value[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.value.length - 1);
const isAtivosStep = computed(() => step.value?.key === 'ativos');

const canExtract = computed(
  () => isAtivosStep.value && duplicataPhase.value === 'upload' && xmlFiles.value.length > 0,
);

const canContinueAtivos = computed(
  () => duplicataPhase.value === 'extracted' || ativosVinculados.value.length > 0,
);

function addXml() {
  xmlFiles.value = [...xmlFiles.value, mockAddXmlFile()];
}

function removeXml(id: string) {
  xmlFiles.value = xmlFiles.value.filter((f) => f.id !== id);
  if (xmlFiles.value.length === 0 && duplicataPhase.value === 'extracted') {
    duplicataPhase.value = 'upload';
    titulosExtraidos.value = [];
  }
}

function extrairDados() {
  if (!canExtract.value) return;
  titulosExtraidos.value = mockTitulosExtraidos(xmlFiles.value);
  duplicataPhase.value = 'extracted';
}

function onVincular(ativos: ContratoAtivo[]) {
  const existing = new Set(ativosVinculados.value.map((a) => a.id));
  for (const a of ativos) {
    if (!existing.has(a.id)) ativosVinculados.value.push(a);
  }
  showVincular.value = false;
}

function goNext() {
  if (isAtivosStep.value && !canContinueAtivos.value) return;
  if (isLast.value) {
    if (canConfirm.value) emit('create', { ...form });
  } else {
    stepIdx.value++;
  }
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 980px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div
        class="flex items-start justify-between"
        style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)"
      >
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Novo Pedido de Operação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <div
          v-for="(s, i) in steps"
          :key="s.key"
          class="flex items-center justify-center"
          :style="{
            flex: 1,
            gap: '8px',
            padding: '16px 8px 13px',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--stepper-done)' : 'var(--text-muted)',
            opacity: i !== stepIdx && i >= stepIdx ? 0.6 : 1,
          }"
        >
          <Check v-if="i < stepIdx" :size="16" :stroke-width="2.5" />
          <component :is="s.icon" v-else :size="16" :stroke-width="i === stepIdx ? 2.25 : 1.75" />
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">
            {{ s.label }}
          </span>
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <DadosGeraisStep v-if="step.key === 'dados'" :form="form" />

        <GarantiaStep
          v-else-if="step.key === 'garantia'"
          :requer="form.requerGarantia"
          :itens="garantiaItens"
          :g-form="garantiaForm"
          @toggle-requer="form.requerGarantia = !form.requerGarantia"
          @add="addGarantia"
          @remove="removeGarantia"
        />

        <AtivosDuplicataStep
          v-else-if="step.key === 'ativos'"
          :phase="duplicataPhase"
          :xml-files="xmlFiles"
          :titulos-extraidos="titulosExtraidos"
          :ativos-vinculados="ativosVinculados"
          @add-xml="addXml"
          @remove-xml="removeXml"
          @open-vincular="showVincular = true"
        />

        <AnexosStep
          v-else-if="step.key === 'anexos'"
          :docs-gerais="docsAnexos"
          :docs-garantia="docsGarantia"
          :doc-files="docFiles"
          :hide-garantia-docs="isDescontoDuplicata"
          :gerais-title="isDescontoDuplicata ? 'Documentos da operação' : 'Documentos gerais'"
          @toggle-doc="toggleDoc"
        />
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          class="flex items-center"
          style="
            gap: 6px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
          @click="isFirst ? emit('close') : stepIdx--"
        >
          <template v-if="isFirst">Cancelar</template>
          <template v-else><ChevronLeft :size="15" /> Voltar</template>
        </button>

        <div class="flex items-center" style="gap: 12px">
          <span
            v-if="isLast && !canConfirm"
            class="flex items-center"
            style="gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--warning-base)"
          >
            <AlertTriangle :size="14" />
            {{ pendingRequired }} {{ pendingRequired === 1 ? 'documento obrigatório pendente' : 'documentos obrigatórios pendentes' }}
          </span>

          <template v-if="isAtivosStep && duplicataPhase === 'upload'">
            <button
              type="button"
              :disabled="!canExtract"
              class="flex items-center"
              :style="{
                gap: '8px',
                height: '44px',
                padding: '0 20px',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: canExtract ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                background: canExtract ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: canExtract ? '#fff' : 'var(--text-disabled)',
              }"
              @click="extrairDados"
            >
              Extrair dados
            </button>
            <button
              type="button"
              :disabled="!canContinueAtivos"
              class="flex items-center"
              :style="{
                gap: '8px',
                height: '44px',
                padding: '0 22px',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: canContinueAtivos ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                background: canContinueAtivos ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: canContinueAtivos ? '#fff' : 'var(--text-disabled)',
              }"
              @click="goNext"
            >
              Continuar <ChevronRight :size="15" />
            </button>
          </template>

          <button
            v-else
            :disabled="(isLast && !canConfirm) || (isAtivosStep && !canContinueAtivos)"
            class="flex items-center"
            :style="{
              gap: '8px',
              height: '44px',
              padding: '0 22px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: (isLast && !canConfirm) || (isAtivosStep && !canContinueAtivos) ? 'not-allowed' : 'pointer',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: isLast
                ? canConfirm
                  ? 'var(--success-base)'
                  : 'var(--neutral-200)'
                : isAtivosStep && !canContinueAtivos
                  ? 'var(--neutral-200)'
                  : 'var(--action-primary-bg)',
              color:
                (isLast && !canConfirm) || (isAtivosStep && !canContinueAtivos) ? 'var(--text-disabled)' : '#fff',
              transition: 'background var(--duration-base)',
            }"
            @click="goNext"
          >
            <template v-if="isLast">Confirmar solicitação <Check :size="15" /></template>
            <template v-else-if="isAtivosStep">Continuar <ChevronRight :size="15" /></template>
            <template v-else>Próxima etapa <ChevronRight :size="15" /></template>
          </button>
        </div>
      </div>
    </div>

    <VincularAtivosModal
      v-if="showVincular"
      @close="showVincular = false"
      @vincular="onVincular"
    />
  </div>
</template>
```

### DadosGeraisStep

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { ESTEIRAS } from '../../data/operacaoData';
import type { NewPedidoData } from './types';
import BentoBox from './BentoBox.vue';
import BentoGrid from './BentoGrid.vue';
import FieldLabel from './FieldLabel.vue';
import FormField from './FormField.vue';
import SelectField from './SelectField.vue';
import ToggleRow from './ToggleRow.vue';
import NovaContaBancariaModal from '../modals/NovaContaBancariaModal.vue';

const props = defineProps<{ form: NewPedidoData }>();

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata',
  'Contrato NC',
  'Contrato NP',
  'Contrato CCB',
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato CDCA',
];
const TIPO_CONTRATO_OPTS = ['CCB', 'CPR-F', 'CDCA', 'CDA-WA', 'NCE'];
const UNIDADE_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
const GERENTE_OPTS = ['Ana Martins', 'Carlos Eduardo', 'Fernanda Lima', 'Roberto Alves'];
const FUNDO_OPTS = ['CRA Semeagro', 'CRA Ceres Agro', 'CRA BTG Agro', 'FIDC Boa Safra'];
const GRUPO_OPTS = ['Grupo Ceres', 'Semeagro', 'BTG Agro', 'Raízen', 'Cargill Brasil', 'Coamo', 'Castrolanda'];
const contaOpts = ref(['001 - BB · Ag 1234 · CC 56789-0', '341 - Itaú · Ag 4567 · CC 12345-6']);
const showNovaConta = ref(false);
const TIPO_TAXA_OPTS = ['Pré-fixado', 'Pós-fixado', 'Híbrido'];

const AGRUPAMENTO_ROWS = [
  { agrupamento: 'Confina', limite: 'R$ 1.000.000', risco: 'R$ 500.000', riscoSolic: 'R$ 540.000' },
  { agrupamento: 'Multicedentes', limite: 'R$ 4.000.000', risco: 'R$ 0', riscoSolic: 'R$ 40.000' },
];

function onNovaConta(label: string) {
  contaOpts.value.push(label);
  props.form.contaBancaria = label;
  showNovaConta.value = false;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <BentoBox title="Identificação">
      <BentoGrid :cols="3">
        <SelectField label="Tipo de operação" :options="TIPO_OPERACAO_OPTS" placeholder="Selecione" v-model="form.tipoOperacao" />
        <SelectField label="Esteira" :options="ESTEIRAS.map((e) => e.label)" placeholder="Selecione" v-model="form.esteira" />
        <SelectField label="Tipo de contrato" :options="TIPO_CONTRATO_OPTS" placeholder="Selecione" v-model="form.tipoContrato" />
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Responsáveis">
      <BentoGrid :cols="2">
        <SelectField label="Unidade de negócio" :options="UNIDADE_OPTS" placeholder="Selecione" v-model="form.unidadeNegocio" />
        <SelectField label="Gerente comercial" :options="GERENTE_OPTS" placeholder="Selecione" v-model="form.gerenteComercial" />
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Veículo">
      <BentoGrid :cols="3">
        <SelectField label="Fundo" :options="FUNDO_OPTS" placeholder="Selecione" v-model="form.fundo" />
        <SelectField label="Grupo empresarial" :options="GRUPO_OPTS" placeholder="Selecione" v-model="form.grupoEmpresarial" />
        <div>
          <FieldLabel>Conta bancária</FieldLabel>
          <div class="flex items-center" style="gap: 8px">
            <div style="flex: 1">
              <SelectField :options="contaOpts" placeholder="Selecione" v-model="form.contaBancaria" />
            </div>
            <button
              aria-label="Adicionar conta"
              class="flex items-center justify-center"
              style="
                width: 40px;
                height: 40px;
                flex-shrink: 0;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-default);
                background: var(--surface-card);
                color: var(--gci-base);
                cursor: pointer;
              "
              @click="showNovaConta = true"
            >
              <Plus :size="16" />
            </button>
          </div>
        </div>
      </BentoGrid>
    </BentoBox>

    <BentoBox title="Taxas">
      <BentoGrid :cols="form.tipoTaxa === 'Pós-fixado' ? 4 : 3">
        <SelectField label="Tipo de taxa" :options="TIPO_TAXA_OPTS" v-model="form.tipoTaxa" />
        <template v-if="form.tipoTaxa === 'Pós-fixado'">
          <SelectField label="Índice" :options="['CDI', 'IPCA', 'Selic']" placeholder="Selecione" v-model="form.indicePos" />
          <SelectField label="Operador" :options="['Percentual', 'Spread']" placeholder="Selecione" v-model="form.operadorPos" />
          <FormField label="Valor da taxa" placeholder="100%" v-model="form.valorTaxaPos" />
        </template>
        <FormField v-else label="Taxa operação (%)" placeholder="0,00" v-model="form.taxaOperacao" />
        <FormField label="FEE da Operação (%)" placeholder="0,00" v-model="form.fee" />
      </BentoGrid>
    </BentoBox>

    <!-- Toggle quitação de vencidos — linha própria -->
    <ToggleRow
      label="Operação para quitação de vencidos"
      :on="form.quitacaoVencidos"
      @toggle="form.quitacaoVencidos = !form.quitacaoVencidos"
    />

    <!-- Tabela de Agrupamento — empty state discreto -->
    <BentoBox title="Agrupamento">
      <div
        style="
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Agrupamento</div>
          <div>Limite</div>
          <div>Risco</div>
          <div>Risco c/ Solicitação</div>
        </div>
        <div
          v-for="row in AGRUPAMENTO_ROWS"
          :key="row.agrupamento"
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            font-variant-numeric: tabular-nums;
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.agrupamento }}</div>
          <div style="color: var(--text-default)">{{ row.limite }}</div>
          <div style="color: var(--text-default)">{{ row.risco }}</div>
          <div style="color: var(--text-default)">{{ row.riscoSolic }}</div>
        </div>
      </div>
    </BentoBox>

    <NovaContaBancariaModal
      v-if="showNovaConta"
      @close="showNovaConta = false"
      @create="onNovaConta"
    />
  </div>
</template>
```

### AtivosDuplicataStep

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { CloudUpload, Download, Link2, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { ContratoAtivo } from '../../data/operacaoData';
import { brl } from '../../data/operacaoData';
import {
  AGRUPAMENTO_DUPLICATA_KPI,
  formatTituloValor,
  type TituloExtraidoDuplicata,
  type XmlUploadItem,
} from '../../data/novoPedidoDuplicataData';
import IconAction from './IconAction.vue';

const props = defineProps<{
  phase: 'upload' | 'extracted';
  xmlFiles: XmlUploadItem[];
  titulosExtraidos: TituloExtraidoDuplicata[];
  ativosVinculados: ContratoAtivo[];
}>();

const emit = defineEmits<{
  addXml: [];
  removeXml: [id: string];
  openVincular: [];
}>();

const kpi = AGRUPAMENTO_DUPLICATA_KPI;

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.titulosExtraidos,
  { defaultPageSize: 10 },
);

const hasVinculados = computed(() => props.ativosVinculados.length > 0);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="flex items-center"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.06em;
        "
        @click="emit('openVincular')"
      >
        <Link2 :size="15" /> Vincular ativos
      </button>
    </div>

    <!-- Fase upload: dropzone + arquivos -->
    <template v-if="phase === 'upload'">
      <button
        type="button"
        class="flex flex-col items-center justify-center"
        style="
          width: 100%;
          gap: 8px;
          padding: 48px 24px;
          background: var(--surface-sunken);
          border: 1px dashed var(--border-default);
          border-radius: var(--radius-xl);
          cursor: pointer;
          color: var(--text-muted);
          transition: border-color var(--duration-base), background var(--duration-base);
        "
        @click="emit('addXml')"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 56px;
            height: 56px;
            border-radius: 9999px;
            background: var(--gci-light);
            color: var(--gci-base);
            margin-bottom: 4px;
          "
        >
          <CloudUpload :size="26" />
        </div>
        <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
          Solte seu arquivo
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-muted)">ou</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--gci-base)">
          clique aqui para procurar
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
          XML de NF-e · mock de upload
        </div>
      </button>

      <div v-if="xmlFiles.length > 0" class="flex flex-col" style="gap: 10px">
        <div
          v-for="f in xmlFiles"
          :key="f.id"
          class="flex items-center"
          style="
            gap: 14px;
            padding: 12px 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div class="flex items-center" style="gap: 6px">
            <IconAction :icon="Trash2" label="Excluir" danger @click="emit('removeXml', f.id)" />
            <IconAction :icon="Download" label="Baixar" />
          </div>
          <div style="flex: 1; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ f.nome }}
          </div>
        </div>
      </div>
    </template>

    <!-- Fase extracted: KPIs + tabela -->
    <template v-else>
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Agrupamento</div>
          <div>Limite</div>
          <div>Risco</div>
          <div>Risco com Solicitação</div>
        </div>
        <div
          class="grid"
          style="
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            padding: 12px 14px;
            font-size: var(--text-sm);
            font-variant-numeric: tabular-nums;
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ kpi.agrupamento }}</div>
          <div style="color: var(--text-default)">{{ kpi.limite }}</div>
          <div style="color: var(--text-default)">{{ kpi.risco }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--success-base)">{{ kpi.riscoComSolicitacao }}</div>
        </div>
      </div>

      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
        "
      >
        <div
          class="grid"
          style="
            grid-template-columns: 120px 100px 1.2fr 1.2fr 120px 110px;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Entrega</div>
          <div>Título</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Valor</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="t in pageItems"
          :key="t.id"
          class="grid items-center"
          style="
            grid-template-columns: 120px 100px 1.2fr 1.2fr 120px 110px;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <div>
            <span
              style="
                display: inline-block;
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 3px 8px;
                border-radius: var(--radius-sm);
                background: var(--status-success-bg);
                color: var(--status-success-text);
                border: 1px solid color-mix(in srgb, var(--success-base) 35%, transparent);
              "
            >
              {{ t.entrega }}
            </span>
          </div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ t.titulo }}</div>
          <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">
            {{ t.cedente }}
          </div>
          <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">
            {{ t.sacado }}
          </div>
          <div style="font-variant-numeric: tabular-nums">{{ formatTituloValor(t.valor) }}</div>
          <div>{{ t.vencimento }}</div>
        </div>
        <TablePagination
          v-if="titulosExtraidos.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>

    <!-- Ativos vinculados via modal -->
    <div v-if="hasVinculados" class="flex flex-col" style="gap: 10px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
        "
      >
        Ativos vinculados ({{ ativosVinculados.length }})
      </div>
      <div
        v-for="a in ativosVinculados"
        :key="a.id"
        class="flex items-center justify-between"
        style="
          padding: 12px 16px;
          background: var(--surface-sunken);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
        "
      >
        <div>
          <span style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ a.numero }}</span>
          <span style="color: var(--text-muted)"> · {{ a.sacadoNome }}</span>
        </div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">
          {{ brl(a.valorTotal) }}
        </div>
      </div>
    </div>
  </div>
</template>
```

### GarantiaStep

```vue
<script setup lang="ts">
import { Shield, ShieldCheck } from 'lucide-vue-next';
import type { GarantiaItem } from './types';
import { formatCurrencyInput } from '../../utils/currencyMask';
import FieldLabel from './FieldLabel.vue';
import SelectField from './SelectField.vue';
import AddButton from './AddButton.vue';
import DataTable from './DataTable.vue';
import Switch from './Switch.vue';
import SectionGroup from './SectionGroup.vue';

defineProps<{
  requer: boolean;
  itens: GarantiaItem[];
  gForm: GarantiaItem;
}>();
const emit = defineEmits<{ toggleRequer: []; add: []; remove: [i: number] }>();

const TIPO_GARANTIA_OPTS = ['Penhor Agrícola', 'Alienação Fiduciária', 'Aval', 'Hipoteca', 'CPR Física'];

const cols: { key: keyof GarantiaItem; label: string; width: string }[] = [
  { key: 'tipo', label: 'Tipo', width: '1fr' },
  { key: 'nome', label: 'Nome', width: '1.6fr' },
  { key: 'valor', label: 'Valor', width: '1fr' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <!-- Toggle em destaque -->
    <div
      class="flex items-center justify-between"
      :style="{
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: requer ? 'var(--gci-base)' : 'var(--border-default)',
        background: requer ? 'var(--gci-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }"
      @click="emit('toggleRequer')"
    >
      <div class="flex items-center" style="gap: 12px">
        <Shield :size="20" :color="requer ? 'var(--gci-base)' : 'var(--text-muted)'" />
        <div>
          <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
            Requer garantia
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Ative para vincular garantias reais ou fidejussórias à operação.
          </div>
        </div>
      </div>
      <Switch :on="requer" />
    </div>

    <!-- Empty state orientativo -->
    <div
      v-if="!requer"
      class="flex flex-col items-center justify-center"
      style="gap: 12px; padding: 48px 24px; text-align: center"
    >
      <div
        class="flex items-center justify-center"
        style="width: 64px; height: 64px; border-radius: 9999px; background: var(--surface-sunken); color: var(--neutral-400)"
      >
        <Shield :size="28" :stroke-width="1.5" />
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); max-width: 360px; line-height: 1.5">
        Esta operação não requer garantia. Clique em
        <strong style="color: var(--text-default)">"Próxima etapa"</strong> para continuar.
      </div>
    </div>

    <template v-else>
      <SectionGroup title="Adicionar garantia" :icon="ShieldCheck">
        <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr 1fr auto; gap: 12px">
          <div>
            <FieldLabel>Tipo de garantia</FieldLabel>
            <SelectField :options="TIPO_GARANTIA_OPTS" placeholder="Selecione" v-model="gForm.tipo" />
          </div>
          <div>
            <FieldLabel>Nome da garantia</FieldLabel>
            <input
              v-model="gForm.nome"
              placeholder="Ex: Penhor Safra 2026"
              style="
                width: 100%;
                height: 40px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
              "
            />
          </div>
          <div>
            <FieldLabel>Valor da garantia</FieldLabel>
            <input
              :value="gForm.valor"
              placeholder="R$ 0,00"
              inputmode="numeric"
              style="
                width: 100%;
                height: 40px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
                font-variant-numeric: tabular-nums;
              "
              @input="gForm.valor = formatCurrencyInput(($event.target as HTMLInputElement).value)"
            />
          </div>
          <AddButton @click="emit('add')" />
        </div>
      </SectionGroup>

      <DataTable :cols="cols" :rows="itens" empty="Nenhuma garantia adicionada." @remove="emit('remove', $event)" />
    </template>
  </div>
</template>
```

### AnexosStep

```vue
<script setup lang="ts">
import DocGroup from './DocGroup.vue';

withDefaults(
  defineProps<{
    docsGerais: { id: string; nome: string; obrigatorio: boolean }[];
    docsGarantia: { id: string; nome: string; obrigatorio: boolean }[];
    docFiles: Record<string, boolean>;
    /** Quando true, esconde o bloco de documentos das garantias */
    hideGarantiaDocs?: boolean;
    geraisTitle?: string;
  }>(),
  { hideGarantiaDocs: false, geraisTitle: 'Documentos gerais' },
);
const emit = defineEmits<{ toggleDoc: [id: string] }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <DocGroup
      :title="geraisTitle"
      :docs="docsGerais"
      :doc-files="docFiles"
      @toggle-doc="emit('toggleDoc', $event)"
    />
    <DocGroup
      v-if="!hideGarantiaDocs && docsGarantia.length > 0"
      title="Documentos das garantias"
      :docs="docsGarantia"
      :doc-files="docFiles"
      @toggle-doc="emit('toggleDoc', $event)"
    />
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean }>(), {
  disabled: false,
});
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
      }"
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

withDefaults(
  defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean }>(),
  { disabled: false },
);
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
      <ChevronDown
        :size="16"
        style="
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
          pointer-events: none;
        "
      />
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<template>
  <div
    style="
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.14em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    "
  >
    <slot />
  </div>
</template>
```

### DataTable

```vue
<script setup lang="ts" generic="T extends Record<string, string>">
import { computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = withDefaults(
  defineProps<{
    cols: { key: keyof T; label: string; width: string }[];
    rows: T[];
    empty: string;
    paginated?: boolean;
    defaultPageSize?: number;
    sunken?: boolean;
    compact?: boolean;
  }>(),
  {
    paginated: true,
    defaultPageSize: 10,
    sunken: false,
    compact: false,
  },
);
const emit = defineEmits<{ remove: [i: number] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: props.defaultPageSize },
);

const displayRows = computed(() => (props.paginated ? pageItems.value : props.rows));

const template = () => `${props.cols.map((c) => c.width).join(' ')} 36px`;

function removeAt(pageIdx: number) {
  if (props.paginated) {
    emit('remove', (page.value - 1) * pageSize.value + pageIdx);
  } else {
    emit('remove', pageIdx);
  }
}
</script>

<template>
  <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: template(),
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="String(c.key)">{{ c.label }}</div>
      <div />
    </div>
    <div
      v-if="rows.length === 0"
      style="padding: 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      {{ empty }}
    </div>
    <template v-else>
      <div
        v-for="(r, i) in displayRows"
        :key="i"
        class="npm-row grid items-center"
        :style="{
          gridTemplateColumns: template(),
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div
          v-for="c in cols"
          :key="String(c.key)"
          :style="{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: c.key === cols[0].key ? 'var(--weight-bold)' : 'var(--weight-regular)',
          }"
        >
          {{ (r[c.key] as string) || '—' }}
        </div>
        <div style="text-align: center">
          <button
            class="npm-trash"
            aria-label="Remover"
            style="background: none; border: none; cursor: pointer; color: var(--danger-base); display: inline-flex"
            @click="removeAt(i)"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
      <TablePagination
        v-if="paginated"
        :sunken="sunken"
        :compact="compact"
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </template>
  </div>
</template>

<style scoped>
.npm-row .npm-trash {
  opacity: 0;
  transition: opacity 0.15s;
}
.npm-row:hover .npm-trash {
  opacity: 1;
}
</style>
```

### AddButton

```vue
<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center justify-center"
    style="
      height: 40px;
      min-width: 40px;
      padding: 0 16px;
      gap: 6px;
      background: var(--success-base);
      color: #fff;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      letter-spacing: 0.08em;
    "
    @click="emit('click')"
  >
    <Plus :size="14" /> ADICIONAR
  </button>
</template>
```

### ToggleRow

```vue
<script setup lang="ts">
defineProps<{ label: string; on: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      padding: '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('toggle')"
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{
      label
    }}</span>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>
```

### Switch

```vue
<script setup lang="ts">
defineProps<{ on: boolean }>();
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: '44px',
      height: '24px',
      borderRadius: '9999px',
      background: on ? 'var(--gci-base)' : 'var(--border-strong)',
      transition: 'background var(--duration-base)',
      flexShrink: 0,
    }"
  >
    <span
      :style="{
        position: 'absolute',
        top: '3px',
        left: on ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '9999px',
        background: '#fff',
        transition: 'left var(--duration-base)',
        boxShadow: 'var(--shadow-xs)',
      }"
    />
  </div>
</template>
```

### IconAction

```vue
<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(defineProps<{ icon: Component; label: string; danger?: boolean }>(), { danger: false });
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :aria-label="label"
    :title="label"
    class="flex items-center justify-center"
    :style="{
      width: '34px',
      height: '34px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      color: danger ? 'var(--danger-base)' : 'var(--text-muted)',
    }"
    @click="emit('click')"
  >
    <component :is="icon" :size="15" />
  </button>
</template>
```

### SectionGroup

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div
    style="
      padding: 20px;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
    "
  >
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 16px;
      "
    >
      <component :is="icon" v-if="icon" :size="14" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
defineProps<{ cols: number }>();
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### DocGroup

```vue
<script setup lang="ts">
import { CheckCircle2, Download, FileText, Trash2, Upload } from 'lucide-vue-next';
import IconAction from './IconAction.vue';

defineProps<{
  title: string;
  docs: { id: string; nome: string; obrigatorio: boolean }[];
  docFiles: Record<string, boolean>;
}>();
const emit = defineEmits<{ toggleDoc: [id: string] }>();
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 12px;
      "
    >
      {{ title }}
    </div>
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="doc in docs"
        :key="doc.id"
        class="flex items-center"
        :style="{
          gap: '14px',
          padding: '12px 16px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderLeft:
            doc.obrigatorio && !docFiles[doc.id] ? '3px solid var(--warning-base)' : '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '38px',
            height: '38px',
            flexShrink: 0,
            borderRadius: 'var(--radius-md)',
            background: docFiles[doc.id] ? 'var(--success-light)' : 'var(--surface-sunken)',
            color: docFiles[doc.id] ? 'var(--success-base)' : 'var(--text-muted)',
          }"
        >
          <CheckCircle2 v-if="docFiles[doc.id]" :size="18" />
          <FileText v-else :size="18" />
        </div>

        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              doc.nome
            }}</span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: doc.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                color: doc.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                textTransform: 'uppercase',
              }"
            >
              {{ doc.obrigatorio ? 'Obrigatório' : 'Opcional' }}
            </span>
          </div>
          <div
            :style="{
              fontSize: '11px',
              color: docFiles[doc.id] ? 'var(--success-dark)' : 'var(--text-muted)',
              marginTop: '2px',
            }"
          >
            {{ docFiles[doc.id] ? 'Arquivo anexado · documento.pdf' : 'Nenhum arquivo anexado' }}
          </div>
        </div>

        <div class="flex items-center" style="gap: 6px">
          <template v-if="docFiles[doc.id]">
            <IconAction :icon="Download" label="Baixar" />
            <IconAction :icon="Trash2" label="Excluir" danger @click="emit('toggleDoc', doc.id)" />
          </template>
          <button
            v-else
            class="flex items-center"
            style="
              gap: 6px;
              padding: 8px 14px;
              border-radius: var(--radius-md);
              cursor: pointer;
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              color: var(--text-strong);
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
            "
            @click="emit('toggleDoc', doc.id)"
          >
            <Upload :size="14" /> Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Modais

### MoverEtapaModal

```vue
<script setup lang="ts">
import { ArrowRight, X } from 'lucide-vue-next';

defineProps<{
  solicitacaoId: string;
  cedente: string;
  etapaOrigem: string;
  etapaDestino: string;
}>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 520px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.18em;
              color: var(--gci-base);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Solicitação · Kanban
          </div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.25">
            Mover solicitação {{ solicitacaoId }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ cedente }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            flex-shrink: 0;
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 24px 28px; background: var(--surface-sunken)">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 16px">
          Confirme a mudança de etapa no kanban. A solicitação será movida imediatamente após a confirmação.
        </p>

        <div
          class="flex items-center"
          style="
            gap: 12px;
            padding: 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div style="flex: 1; min-width: 0">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              De
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaOrigem }}
            </div>
          </div>

          <div
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: color-mix(in srgb, var(--gci-base) 12%, transparent);
              color: var(--gci-base);
              flex-shrink: 0;
            "
          >
            <ArrowRight :size="16" />
          </div>

          <div style="flex: 1; min-width: 0; text-align: right">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              Para
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaDestino }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          type="button"
          style="
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
```

### AdicionarContratoModal

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { X, Tag, Paperclip, Trash2, FileText, AlertTriangle, Layers, MoreVertical, Copy, BadgeCheck } from 'lucide-vue-next';
import {
  brl, UF_OPTIONS, PAISES_DDI, buscarSacadoCadastrado,
  type ContratoAtivo, type ParcelaAtivo, type ParteRelacionada,
} from '../../data/operacaoData';
import { isTipoMinutaDisponivel, categoriaMinuta } from '../../data/minutaData';
import { BentoBox, BentoGrid, FormField, SelectField, EmptyState, ToggleRow, AddButton } from './adicionar-contrato';
import { MinutaWizard } from './minuta';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
  partes?: ParteRelacionada[];
  unidadeNegocio?: string;
}>();
const emit = defineEmits<{ close: []; create: [data: Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>] }>();

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata',
  'Contrato NC',
  'Contrato NP',
  'Contrato CCB',
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato CDCA',
];
const CFOP_OPTS = [
  '5117 - Transferência de título de crédito',
  '5949 - Outra saída de mercadoria/prestação não especificada',
  '6117 - Transferência de título de crédito (fora do Estado)',
  '6949 - Outra saída não especificada (fora do Estado)',
];
const METODO_DESCONTO_OPTS = ['Desconto Comercial (Por Fora)', 'Desconto Racional (Por Dentro)'];
const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

interface FormState {
  gerarMinuta: boolean;
  documento: string;
  valorInformado: 'DESAGIO' | 'AGIO';
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  chaveNota: string;
  cfop: string;
  cedente: string;
  metodoDesconto: string;
  gerarOperacaoGarantias: boolean;
  possuiParcelas: boolean;
  gerarParcelas: boolean;
  fluxoParcelas: string;
  sacadoDocumento: string;
  sacadoNome: string;
  sacadoEmail: string;
  ddi: string;
  telefone: string;
  cep: string;
  endereco: string;
  numeroEndereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

const form = reactive<FormState>({
  gerarMinuta: false,
  documento: '',
  valorInformado: 'DESAGIO',
  numero: '',
  tipo: '',
  emissao: '',
  vencimento: '',
  chaveNota: '',
  cfop: '',
  cedente: '',
  metodoDesconto: '',
  gerarOperacaoGarantias: false,
  possuiParcelas: false,
  gerarParcelas: false,
  fluxoParcelas: '',
  sacadoDocumento: '',
  sacadoNome: '',
  sacadoEmail: '',
  ddi: '+55',
  telefone: '',
  cep: '',
  endereco: '',
  numeroEndereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
});

const parcelas = reactive<ParcelaAtivo[]>([]);
const parcelaForm = reactive({ valor: '', vencimento: '' });
const openMenuIndex = ref<number | null>(null);

const sacadoEncontrado = computed(() => !!buscarSacadoCadastrado(form.sacadoDocumento));

watch(() => form.sacadoDocumento, (doc) => {
  const found = buscarSacadoCadastrado(doc);
  if (found) form.sacadoNome = found.nome;
});

const minutaHabilitada = computed(() => isTipoMinutaDisponivel(form.tipo));
const showWizard = computed(() => form.gerarMinuta && minutaHabilitada.value);
const wizardSubtitle = computed(() => {
  const cat = categoriaMinuta(form.tipo);
  if (cat === 'NC') return 'Geração de minuta Nota Comercial';
  if (cat === 'CCB') return 'Geração de minuta CCB';
  return 'Geração de minuta CPR / CPR-F';
});

watch(
  () => form.tipo,
  (t) => {
    if (!isTipoMinutaDisponivel(t) && form.gerarMinuta) {
      form.gerarMinuta = false;
    }
  },
);

const somatoriaParcelas = computed(() => parcelas.reduce((acc, p) => acc + (Number(p.valor) || 0), 0));

function renumerarParcelas() {
  parcelas.forEach((p, idx) => {
    p.parcela = `${idx + 1}ª Parcela`;
  });
}

function addParcela() {
  if (!parcelaForm.valor || !parcelaForm.vencimento) return;
  parcelas.push({
    parcela: `${parcelas.length + 1}ª Parcela`,
    valor: Number(parcelaForm.valor),
    vencimento: parcelaForm.vencimento,
  });
  parcelaForm.valor = '';
  parcelaForm.vencimento = '';
}

function gerarParcelasAutomaticas() {
  if (!form.fluxoParcelas) return;
  const base = props.valorOperacao > 0 ? props.valorOperacao / 2 : 50_000;
  parcelas.splice(
    0,
    parcelas.length,
    { parcela: '1ª Parcela', valor: Math.round(base), vencimento: '30/07/2026' },
    { parcela: '2ª Parcela', valor: Math.round(base), vencimento: '30/08/2026' },
  );
  openMenuIndex.value = null;
}

function duplicarParcela(i: number) {
  const original = parcelas[i];
  parcelas.splice(i + 1, 0, { parcela: '', valor: original.valor, vencimento: '' });
  renumerarParcelas();
  openMenuIndex.value = null;
}

function removeParcela(i: number) {
  parcelas.splice(i, 1);
  renumerarParcelas();
  openMenuIndex.value = null;
}

function toggleMenu(i: number) {
  openMenuIndex.value = openMenuIndex.value === i ? null : i;
}

function handleClickOutsideParcela(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-parcela-action-menu]')) {
    openMenuIndex.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutsideParcela));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutsideParcela));

const canSubmit = computed(() => form.numero.trim() !== '' && form.tipo.trim() !== '');

function handleSubmit() {
  if (!canSubmit.value) return;
  emit('create', {
    numero: form.numero,
    tipo: form.tipo,
    emissao: form.emissao,
    vencimento: form.vencimento,
    valorTotal: props.valorOperacao,
    sacadoNome: form.sacadoNome,
    sacadoDocumento: form.sacadoDocumento,
    parcelas: [...parcelas],
    cedenteNome: form.cedente || undefined,
  } as Omit<ContratoAtivo, 'id'>);
}

function handleMinutaCreate(data: {
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  valorTotal: number;
  sacadoNome: string;
  sacadoDocumento: string;
  parcelas: ParcelaAtivo[];
  minuta: ContratoAtivo['minuta'];
}) {
  const cedenteDoc = data.minuta?.emitentes?.[0]?.documento ?? '—';
  const cedenteNome = data.minuta?.emitentes?.[0]?.nome ?? '—';
  emit('create', {
    numero: data.numero,
    tipo: data.tipo,
    emissao: data.emissao,
    vencimento: data.vencimento,
    valorTotal: data.valorTotal,
    sacadoNome: data.sacadoNome,
    sacadoDocumento: data.sacadoDocumento,
    parcelas: data.parcelas,
    cedenteNome,
    cedenteDocumento: cedenteDoc,
    minuta: data.minuta,
  } as Omit<ContratoAtivo, 'id'>);
}

function toggleGerarMinuta() {
  if (!minutaHabilitada.value) return;
  form.gerarMinuta = !form.gerarMinuta;
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1040px;
        height: 88vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Adicionar Contrato
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ showWizard ? wizardSubtitle : 'Dados do título, parcelas e dados do sacado' }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Wizard de minuta -->
      <MinutaWizard
        v-if="showWizard"
        :valor-operacao="valorOperacao"
        :tipo-calculo="tipoCalculo"
        :tipo="form.tipo"
        :partes="partes ?? []"
        :unidade-negocio="unidadeNegocio ?? ''"
        :gerar-minuta="form.gerarMinuta"
        @update:gerar-minuta="form.gerarMinuta = $event"
        @create="handleMinutaCreate"
      />

      <!-- Body padrão (sem minuta) -->
      <template v-else>
        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 24px">
            <ToggleRow
              label="Gerar minuta"
              :on="form.gerarMinuta"
              :disabled="!minutaHabilitada"
              @toggle="toggleGerarMinuta"
            />
            <div
              v-if="!minutaHabilitada && form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Disponível apenas para Contrato CPR, CPRF, NC e CCB nesta versão.
            </div>
            <div
              v-else-if="!form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Selecione o tipo do título (CPR, CPRF, NC ou CCB) em Dados do Título para habilitar a geração de minuta.
            </div>

            <BentoBox title="Dados do Título" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div
                  class="flex items-center"
                  style="
                    gap: 8px;
                    height: 42px;
                    padding: 0 14px;
                    background: var(--surface-card);
                    border: 1px dashed var(--border-default);
                    border-radius: var(--radius-lg);
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                  "
                >
                  <Paperclip :size="15" /> Insira o documento...
                </div>

                <BentoGrid :cols="4">
                  <FormField label="Valor total" :model-value="brl(valorOperacao)" disabled />
                  <SelectField label="Tipo de cálculo" :options="[tipoCalculo]" :model-value="tipoCalculo" disabled />
                  <FormField label="Número" placeholder="—" v-model="form.numero" />
                  <SelectField label="Tipo" :options="TIPO_OPERACAO_OPTS" placeholder="Selecione" v-model="form.tipo" />
                </BentoGrid>

                <ToggleRow
                  :label="`Valor Informado: ${form.valorInformado === 'AGIO' ? 'ÁGIO' : 'DESÁGIO'}`"
                  hint="Deságio: valor líquido. Ágio: valor de face."
                  :on="form.valorInformado === 'AGIO'"
                  compact
                  @toggle="form.valorInformado = form.valorInformado === 'AGIO' ? 'DESAGIO' : 'AGIO'"
                />

                <BentoGrid :cols="4">
                  <FormField label="Emissão" placeholder="dd/mm/aaaa" v-model="form.emissao" required />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="form.vencimento" required />
                  <FormField label="Chave da nota" placeholder="—" v-model="form.chaveNota" />
                  <SelectField label="CFOP" :options="CFOP_OPTS" placeholder="Selecione" v-model="form.cfop" />
                </BentoGrid>

                <BentoGrid :cols="4">
                  <div style="grid-column: span 2">
                    <FormField label="Cedente" placeholder="—" v-model="form.cedente" />
                  </div>
                  <div style="grid-column: span 2">
                    <SelectField label="Método de Desconto" :options="METODO_DESCONTO_OPTS" placeholder="Selecione" v-model="form.metodoDesconto" />
                  </div>
                </BentoGrid>

                <ToggleRow
                  label="Gerar operação no módulo de garantias"
                  :on="form.gerarOperacaoGarantias"
                  compact
                  @toggle="form.gerarOperacaoGarantias = !form.gerarOperacaoGarantias"
                />
              </div>
            </BentoBox>

            <ToggleRow label="Possui múltiplas parcelas" :on="form.possuiParcelas" @toggle="form.possuiParcelas = !form.possuiParcelas" />
            <BentoBox v-if="form.possuiParcelas" title="Parcelas" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <ToggleRow
                  label="Gerar parcelas"
                  :on="form.gerarParcelas"
                  compact
                  @toggle="form.gerarParcelas = !form.gerarParcelas"
                />

                <div v-if="form.gerarParcelas" class="grid items-end" style="grid-template-columns: 1fr auto; gap: 12px">
                  <SelectField label="Fluxo de parcelas" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoParcelas" />
                  <AddButton @click="gerarParcelasAutomaticas">Gerar pagamentos</AddButton>
                </div>
                <div v-else class="grid items-end" style="grid-template-columns: 1fr 1fr 1fr auto; gap: 12px">
                  <FormField label="Parcela" :model-value="`${parcelas.length + 1}ª Parcela`" disabled />
                  <FormField label="Valor" placeholder="R$ 0,00" currency v-model="parcelaForm.valor" />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="parcelaForm.vencimento" required />
                  <AddButton @click="addParcela">Adicionar parcela</AddButton>
                </div>

                <EmptyState
                  v-if="parcelas.length === 0"
                  :icon="Layers"
                  title="Nenhuma parcela adicionada"
                  hint="Use o formulário acima para adicionar as parcelas deste contrato."
                />
                <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                  <div
                    class="grid"
                    style="
                      grid-template-columns: 1.4fr 1fr 1fr auto;
                      padding: 10px 14px;
                      background: var(--surface-card);
                      font-size: 10px;
                      font-weight: var(--weight-bold);
                      letter-spacing: 0.12em;
                      color: var(--text-muted);
                      text-transform: uppercase;
                    "
                  >
                    <div>Parcela</div>
                    <div>Valor</div>
                    <div>Vencimento</div>
                    <div>Ações</div>
                  </div>
                  <div
                    v-for="(p, i) in parcelas"
                    :key="i"
                    class="grid items-center"
                    style="
                      grid-template-columns: 1.4fr 1fr 1fr auto;
                      padding: 10px 14px;
                      border-top: 1px solid var(--border-default);
                      font-size: var(--text-sm);
                    "
                  >
                    <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.parcela }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ brl(p.valor ?? 0) }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ p.vencimento || '—' }}</div>
                    <div class="flex justify-end" style="position: relative" data-parcela-action-menu>
                      <button
                        aria-label="Ações"
                        class="flex items-center justify-center"
                        style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-sm); cursor: pointer; color: var(--text-muted)"
                        @click="toggleMenu(i)"
                      >
                        <MoreVertical :size="14" />
                      </button>
                      <div
                        v-if="openMenuIndex === i"
                        class="flex flex-col"
                        style="position: absolute; top: 30px; right: 0; z-index: 50; min-width: 150px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
                      >
                        <button
                          class="flex items-center parcela-action-item"
                          style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                          @click="duplicarParcela(i)"
                        >
                          <Copy :size="14" style="color: var(--text-muted)" />
                          Copiar
                        </button>
                        <button
                          class="flex items-center parcela-action-item"
                          style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                          @click="removeParcela(i)"
                        >
                          <Trash2 :size="14" />
                          Deletar parcela
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-center"
                    style="padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
                  >
                    Somatória das parcelas: {{ brl(somatoriaParcelas) }}
                  </div>
                </div>
                <div
                  v-if="somatoriaParcelas !== valorOperacao"
                  class="flex items-center justify-center"
                  style="gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--warning-base)"
                >
                  <AlertTriangle :size="13" /> Total das parcelas diferente do valor total solicitado
                </div>
              </div>
            </BentoBox>

            <BentoBox title="Dados do Sacado" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
                  <div style="grid-column: span 4">
                    <FormField label="CPF/CNPJ" placeholder="—" v-model="form.sacadoDocumento" />
                  </div>
                  <div style="grid-column: span 5">
                    <FormField label="Nome" placeholder="—" v-model="form.sacadoNome" :disabled="sacadoEncontrado" />
                  </div>
                  <div
                    v-if="sacadoEncontrado"
                    class="flex items-end"
                    style="grid-column: span 3; padding-bottom: 11px; gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--success-base)"
                  >
                    <BadgeCheck :size="14" /> Sacado encontrado na base
                  </div>

                  <template v-if="!sacadoEncontrado">
                    <div style="grid-column: span 3">
                      <FormField label="E-mail" placeholder="—" v-model="form.sacadoEmail" />
                    </div>

                    <div style="grid-column: span 2">
                      <SelectField label="DDI" :options="DDI_OPTS" v-model="form.ddi" />
                    </div>
                    <div style="grid-column: span 4">
                      <FormField label="Telefone" placeholder="—" v-model="form.telefone" />
                    </div>
                    <div style="grid-column: span 3">
                      <FormField label="CEP" placeholder="—" v-model="form.cep" />
                    </div>
                    <div style="grid-column: span 3">
                      <FormField label="Número" placeholder="—" v-model="form.numeroEndereco" />
                    </div>

                    <div style="grid-column: span 6">
                      <FormField label="Endereço" placeholder="—" v-model="form.endereco" />
                    </div>
                    <div style="grid-column: span 6">
                      <FormField label="Complemento" placeholder="—" v-model="form.complemento" />
                    </div>

                    <div style="grid-column: span 4">
                      <FormField label="Bairro" placeholder="—" v-model="form.bairro" />
                    </div>
                    <div style="grid-column: span 4">
                      <FormField label="Cidade" placeholder="—" v-model="form.cidade" />
                    </div>
                    <div style="grid-column: span 2">
                      <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" v-model="form.estado" />
                    </div>
                    <div style="grid-column: span 2">
                      <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" v-model="form.pais" />
                    </div>
                  </template>
                </div>
              </div>
            </BentoBox>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            :disabled="!canSubmit"
            class="flex items-center btn-animated"
            :class="{ 'btn-primary': canSubmit }"
            :style="{
              gap: '8px',
              height: '44px',
              padding: '0 24px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canSubmit ? '#fff' : 'var(--text-disabled)',
            }"
            @click="handleSubmit"
          >
            <FileText :size="15" /> GERAR TÍTULO
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.parcela-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### VincularAtivosModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, type ContratoAtivo } from '../../data/operacaoData';
import { TITULOS_DISPONIVEIS, tituloDisponivelParaContrato } from '../../data/ativoData';
import { FormField } from './adicionar-contrato';

const emit = defineEmits<{ close: []; vincular: [ativos: ContratoAtivo[]] }>();

const filtroLastro = ref('');
const filtroNumeros = ref('');
const filtroDataIni = ref('');
const filtroDataFim = ref('');
const filtroSacado = ref('');
const selectedIds = ref<Set<string>>(new Set());

/** Fixed column track — total wider than modal so overflow-x scrolls. */
const COLS =
  '48px 100px 110px 72px 100px 110px 110px 110px 130px minmax(180px, 1.2fr) minmax(180px, 1.2fr) 110px 72px';
const TABLE_MIN_WIDTH = '1480px';

const titulos = computed(() => {
  const l = filtroLastro.value.trim().toLowerCase();
  const n = filtroNumeros.value.trim().toLowerCase();
  const s = filtroSacado.value.trim().toLowerCase();
  return TITULOS_DISPONIVEIS.filter((t) => {
    if (t.situacao !== 'PENDENTE') return false;
    if (l && !t.lastro.toLowerCase().includes(l)) return false;
    if (n && !t.numero.toLowerCase().includes(n)) return false;
    if (s && !t.sacado.toLowerCase().includes(s)) return false;
    return true;
  });
});

const totalSelecionado = computed(() =>
  titulos.value.filter((t) => selectedIds.value.has(t.id)).reduce((acc, t) => acc + t.valorNominal, 0),
);
const totalConfirmado = computed(() => totalSelecionado.value);
const percentual = computed(() => (totalSelecionado.value > 0 ? 100 : 0));

const allSelected = computed(
  () => titulos.value.length > 0 && titulos.value.every((t) => selectedIds.value.has(t.id)),
);
const someSelected = computed(
  () => titulos.value.some((t) => selectedIds.value.has(t.id)) && !allSelected.value,
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => titulos.value,
  { defaultPageSize: 10 },
);

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleAll() {
  const all = allSelected.value;
  const next = new Set(selectedIds.value);
  for (const t of titulos.value) {
    if (all) next.delete(t.id);
    else next.add(t.id);
  }
  selectedIds.value = next;
}

function confirmar() {
  const ativos = titulos.value
    .filter((t) => selectedIds.value.has(t.id))
    .map(tituloDisponivelParaContrato);
  emit('vincular', ativos);
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 500;
      background: rgba(8, 60, 74, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 1100px;
        max-height: 90vh;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        overflow: hidden;
      "
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Vincular Ativos</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div style="padding: 20px 24px; overflow-y: auto; flex: 1; min-height: 0">
        <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px">
          <FormField label="Lastro" placeholder="Buscar lastro" v-model="filtroLastro" />
          <FormField label="Números" placeholder="Buscar número" v-model="filtroNumeros" />
          <FormField label="Data criação inicial" placeholder="dd/mm/aaaa" v-model="filtroDataIni" />
          <FormField label="Data criação final" placeholder="dd/mm/aaaa" v-model="filtroDataFim" />
          <FormField label="Nome do sacado" placeholder="Buscar sacado" v-model="filtroSacado" />
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="vincular-ativos-scroll" style="overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch">
            <div :style="{ minWidth: TABLE_MIN_WIDTH }">
              <div
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '12px 16px',
                  background: 'var(--surface-sunken)',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="toggleAll" />
                </div>
                <div>Lastro</div>
                <div>Número</div>
                <div>Tipo</div>
                <div>Situação</div>
                <div>Confirmação</div>
                <div>Criação</div>
                <div>Emissão</div>
                <div>Valor nominal</div>
                <div>Cedente</div>
                <div>Sacado</div>
                <div>Vencimento</div>
                <div>Entrega</div>
              </div>
              <div
                v-if="titulos.length === 0"
                style="padding: 28px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
              >
                Não foi encontrado nenhum título pendente.
              </div>
              <div
                v-for="t in pageItems"
                :key="t.id"
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '14px 16px',
                  borderTop: '1px solid var(--border-default)',
                  fontSize: 'var(--text-sm)',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="selectedIds.has(t.id)" @change="toggle(t.id)" />
                </div>
                <div style="white-space: nowrap">{{ t.lastro }}</div>
                <div style="font-weight: var(--weight-semibold); white-space: nowrap">{{ t.numero }}</div>
                <div style="white-space: nowrap">{{ t.tipoOperacao }}</div>
                <div style="white-space: nowrap">{{ t.situacao }}</div>
                <div style="white-space: nowrap">{{ t.confirmacao }}</div>
                <div style="white-space: nowrap">{{ t.dataCriacao }}</div>
                <div style="white-space: nowrap">{{ t.dataEmissao }}</div>
                <div style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ brl(t.valorNominal) }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">{{ t.cedente }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">{{ t.sacado }}</div>
                <div style="white-space: nowrap">{{ t.vencimento }}</div>
                <div>
                  <span
                    :style="{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: 'var(--weight-bold)',
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: t.entrega === 'FUT' ? 'var(--gci-light)' : 'var(--agro-light)',
                      color: t.entrega === 'FUT' ? 'var(--gci-base)' : 'var(--agro-base)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ t.entrega }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TablePagination
            v-if="titulos.length > 0"
            :total="total"
            :page="page"
            :page-size="pageSize"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 24px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px; flex-shrink: 0"
      >
        <div class="flex items-center" style="gap: 20px; flex-wrap: wrap">
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total selecionado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalSelecionado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total confirmado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalConfirmado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Percentual</span>
            <div style="font-weight: var(--weight-bold)">{{ percentual }}%</div>
          </div>
        </div>
        <button
          :disabled="selectedIds.size === 0"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
            opacity: selectedIds.size === 0 ? 0.5 : 1;
          "
          @click="confirmar"
        >
          VINCULAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### CadastrarGarantiaModal

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import {
  TIPO_GARANTIA_OPERACAO_OPTS,
  emptyGarantiaAnexos,
  sortGarantiaAnexos,
  formatValorGarantia,
  type GarantiaOperacao,
  type GarantiaAnexo,
} from '../../data/operacaoData';
import { parseCurrencyInput } from '../../utils/currencyMask';
import { FormField, SelectField, StepGrid } from './adicionar-contrato';
import DocGroup from '../novo-pedido/DocGroup.vue';

const props = defineProps<{
  garantia?: GarantiaOperacao | null;
}>();
const emit = defineEmits<{
  close: [];
  save: [g: GarantiaOperacao];
}>();

const isEdit = computed(() => !!props.garantia?.id);
const showAnexos = ref(!!props.garantia);

const form = reactive({
  tipo: '',
  nome: '',
  valor: 'R$ 0,00',
});

const anexos = ref<GarantiaAnexo[]>(emptyGarantiaAnexos());

function hydrate(g: GarantiaOperacao | null | undefined) {
  if (!g) {
    form.tipo = '';
    form.nome = '';
    form.valor = 'R$ 0,00';
    anexos.value = emptyGarantiaAnexos();
    showAnexos.value = false;
    return;
  }
  form.tipo = g.tipo;
  form.nome = g.nome;
  form.valor = formatValorGarantia(g.valor);
  anexos.value = g.anexos.length
    ? sortGarantiaAnexos(g.anexos.map((a) => ({ ...a })))
    : emptyGarantiaAnexos();
  showAnexos.value = true;
}

watch(() => props.garantia, (g) => hydrate(g), { immediate: true });

const docsForGroup = computed(() =>
  anexos.value.map((a) => ({ id: a.id, nome: a.nome, obrigatorio: a.obrigatorio })),
);

const docFiles = computed(() =>
  Object.fromEntries(anexos.value.map((a) => [a.id, a.enviado])),
);

const dadosOk = computed(
  () => form.tipo.trim() !== '' && form.nome.trim() !== '' && parseCurrencyInput(form.valor) > 0,
);

const anexosObrigatoriosOk = computed(() =>
  anexos.value.filter((a) => a.obrigatorio).every((a) => a.enviado),
);

const canSave = computed(() => dadosOk.value && showAnexos.value && anexosObrigatoriosOk.value);

function toggleDoc(id: string) {
  const item = anexos.value.find((a) => a.id === id);
  if (item) item.enviado = !item.enviado;
}

function continuar() {
  if (!dadosOk.value) return;
  showAnexos.value = true;
}

function salvar() {
  if (!canSave.value) return;
  emit('save', {
    id: props.garantia?.id ?? `gar-${Date.now()}`,
    tipo: form.tipo.trim(),
    nome: form.nome.trim(),
    valor: formatValorGarantia(form.valor),
    anexos: sortGarantiaAnexos(anexos.value.map((a) => ({ ...a }))),
  });
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
        max-width: 720px;
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
            {{ isEdit ? 'Editar garantia' : 'Cadastrar garantia' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados da garantia e documentos comprobatórios
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

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 20px">
          <StepGrid>
            <SelectField
              label="Tipo de garantia"
              :options="TIPO_GARANTIA_OPERACAO_OPTS"
              placeholder="Selecione"
              required
              :span="4"
              v-model="form.tipo"
            />
            <FormField
              label="Nome da garantia"
              placeholder="Ex: AF Estoque Safra 2026"
              required
              :span="5"
              v-model="form.nome"
            />
            <FormField
              label="Valor da garantia"
              placeholder="R$ 0,00"
              required
              currency
              :span="3"
              v-model="form.valor"
            />
          </StepGrid>

          <div v-if="!showAnexos" class="flex justify-end">
            <button
              type="button"
              :disabled="!dadosOk"
              :style="{
                height: '42px',
                padding: '0 20px',
                background: dadosOk ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: dadosOk ? '#fff' : 'var(--text-disabled)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: dadosOk ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
              }"
              @click="continuar"
            >
              CONTINUAR
            </button>
          </div>

          <DocGroup
            v-if="showAnexos"
            title="Documentos da garantia"
            :docs="docsForGroup"
            :doc-files="docFiles"
            @toggle-doc="toggleDoc"
          />
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
          :disabled="!canSave"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          {{ isEdit ? 'SALVAR' : 'ADICIONAR' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

### ExcluirGarantiaModal

```vue
<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import type { GarantiaOperacao } from '../../data/operacaoData';

defineProps<{ garantia: GarantiaOperacao }>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 440px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4);
        padding: 28px;
      "
      @click.stop
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: var(--status-danger-bg);
          color: var(--danger-base);
          margin-bottom: 18px;
        "
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Excluir a garantia "{{ garantia.nome }}"?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação remove a garantia e os anexos vinculados desta solicitação. Não será possível desfazer por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--surface-card);
            color: var(--text-strong);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--action-danger-bg);
            color: var(--action-danger-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="emit('confirm')"
        >
          Confirmar exclusão
        </button>
      </div>
    </div>
  </div>
</template>
```

### ParteRelacionadaModal

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, User, Building2, Phone, MapPin } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI, enriquecerParteRelacionada, type ParteTipo, type ParteRelacionada } from '../../data/operacaoData';
import { BentoBox } from './parte-relacionada';
import { ToggleRow, StepGrid, FormField, SelectField } from './adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  estadoCivilExigeConjuge,
  emptyConjugeMinuta,
  emptyPessoaMinuta,
  NACIONALIDADE_OPTS as NAC_OPTS,
  type ConjugeMinuta,
  type RepresentanteLegal,
} from '../../data/minutaData';
import SpouseFields from './minuta/SpouseFields.vue';

const emit = defineEmits<{ close: []; create: [data: ParteRelacionada] }>();

export interface NewParteRelacionadaData {
  tipoPessoa: 'FISICA' | 'JURIDICA';
  cpf: string;
  nomeFisica: string;
  rg: string;
  inscricaoProdutorRural: string;
  nacionalidade: string;
  dataNascimento: string;
  profissao: string;
  estadoCivil: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  tipoEmpresa: string;
  porte: string;
  atividadePrincipal: string;
  naturezaJuridica: string;
  inscricaoMunicipal: string;
  inscricaoEstadual: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  nomeContato: string;
  email: string;
  ddi: string;
  telefone: string;
  tipos: string[];
  possuiConjuge: boolean;
  orgaoEmissorRg: string;
}

const NACIONALIDADE_OPTS = NAC_OPTS;
const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

const TIPOS_OPTS: { label: string; codigo: ParteTipo }[] = [
  { label: 'Cônjuge', codigo: 'CON' },
  { label: 'Avalista', codigo: 'AVA' },
  { label: 'Sócio', codigo: 'SOC' },
  { label: 'Interveniente Anuente', codigo: 'ITA' },
  { label: 'Representante Legal', codigo: 'REP' },
  { label: 'Procurador', codigo: 'PROC' },
];

const form = reactive<NewParteRelacionadaData>({
  tipoPessoa: 'FISICA',
  cpf: '',
  nomeFisica: '',
  rg: '',
  inscricaoProdutorRural: '',
  nacionalidade: '',
  dataNascimento: '',
  profissao: '',
  estadoCivil: '',
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  dataAbertura: '',
  tipoEmpresa: '',
  porte: '',
  atividadePrincipal: '',
  naturezaJuridica: '',
  inscricaoMunicipal: '',
  inscricaoEstadual: '',
  cep: '',
  localidade: '',
  numero: '',
  bairro: '',
  infoAdicionais: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
  nomeContato: '',
  email: '',
  ddi: '+55',
  telefone: '',
  tipos: [],
  possuiConjuge: false,
  orgaoEmissorRg: '',
});

const conjuge = reactive<ConjugeMinuta>(emptyConjugeMinuta());
const representante = reactive<RepresentanteLegal>({ ...emptyPessoaMinuta('JURIDICA').representante! });

watch(
  () => form.estadoCivil,
  (ec) => {
    if (estadoCivilExigeConjuge(ec)) form.possuiConjuge = true;
  },
);

const tipoPessoaLabel = computed({
  get: () => (form.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

function toggleTipo(label: string) {
  const idx = form.tipos.indexOf(label);
  if (idx >= 0) form.tipos.splice(idx, 1);
  else form.tipos.push(label);
}

function onPaisChange(v: string) {
  form.pais = v;
  const match = PAISES_DDI.find((p) => p.pais === v);
  if (match) form.ddi = match.ddi;
}

const nome = computed(() => (form.tipoPessoa === 'FISICA' ? form.nomeFisica : form.razaoSocial || form.nomeFantasia));
const documento = computed(() => (form.tipoPessoa === 'FISICA' ? form.cpf : form.cnpj));
const canSubmit = computed(() => nome.value.trim() !== '' && documento.value.trim() !== '');

function handleSubmit() {
  if (!canSubmit.value) return;
  const codigos = TIPOS_OPTS.filter((t) => form.tipos.includes(t.label)).map((t) => t.codigo);
  emit('create', enriquecerParteRelacionada({
    nome: nome.value,
    documento: documento.value,
    email: form.email,
    telefone: form.telefone,
    tipos: codigos,
    tipoPessoa: form.tipoPessoa,
    cpf: form.cpf,
    rg: form.rg,
    inscricaoProdutorRural: form.inscricaoProdutorRural,
    nacionalidade: form.nacionalidade,
    dataNascimento: form.dataNascimento,
    profissao: form.profissao,
    estadoCivil: form.estadoCivil,
    cnpj: form.cnpj,
    razaoSocial: form.razaoSocial,
    nomeFantasia: form.nomeFantasia,
    dataAbertura: form.dataAbertura,
    tipoEmpresa: form.tipoEmpresa,
    porte: form.porte,
    atividadePrincipal: form.atividadePrincipal,
    naturezaJuridica: form.naturezaJuridica,
    inscricaoMunicipal: form.inscricaoMunicipal,
    inscricaoEstadual: form.inscricaoEstadual,
    cep: form.cep,
    localidade: form.localidade,
    numero: form.numero,
    bairro: form.bairro,
    infoAdicionais: form.infoAdicionais,
    cidade: form.cidade,
    estado: form.estado,
    pais: form.pais,
    nomeContato: form.nomeContato,
    ddi: form.ddi,
    possuiConjuge: form.tipoPessoa === 'FISICA' ? form.possuiConjuge : false,
    conjuge: form.tipoPessoa === 'FISICA' && form.possuiConjuge ? { ...conjuge } : undefined,
    representante: form.tipoPessoa === 'JURIDICA' ? { ...representante } : undefined,
    contatosRelacionados: [],
  }));
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 960px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Nova Parte Relacionada
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Identificação, endereço, contato e vínculo com a solicitação
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 24px">
          <BentoBox title="Identificação">
            <div class="flex flex-col" style="gap: 14px">
              <StepGrid>
                <SelectField
                  label="Natureza"
                  :options="['Pessoa Física', 'Pessoa Jurídica']"
                  :span="4"
                  v-model="tipoPessoaLabel"
                />
              </StepGrid>

              <template v-if="form.tipoPessoa === 'FISICA'">
                <StepGrid>
                  <FormField label="CPF" placeholder="000.000.000-00" :span="3" v-model="form.cpf" />
                  <FormField label="Nome completo" placeholder="Nome completo" :span="6" v-model="form.nomeFisica" />
                  <FormField label="RG" placeholder="0000000" :span="3" v-model="form.rg" />
                  <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="4" v-model="form.orgaoEmissorRg" />
                  <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural" />
                  <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.nacionalidade" />
                  <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataNascimento" />
                  <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao" />
                  <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" :span="4" v-model="form.estadoCivil" />
                </StepGrid>
                <ToggleRow
                  label="Possui cônjuge"
                  :on="form.possuiConjuge"
                  compact
                  @toggle="form.possuiConjuge = !form.possuiConjuge"
                />
                <SpouseFields
                  v-if="form.possuiConjuge"
                  v-model="conjuge"
                />
              </template>
              <template v-else>
                <StepGrid>
                  <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" v-model="form.cnpj" />
                  <FormField label="Razão Social" placeholder="—" :span="5" v-model="form.razaoSocial" />
                  <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia" />
                  <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="3" v-model="form.dataAbertura" />
                  <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa" />
                  <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte" />
                  <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal" />
                  <FormField label="Natureza Jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica" />
                  <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal" />
                  <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual" />
                </StepGrid>

                <BentoBox title="Representante Legal" :icon="User">
                  <StepGrid>
                    <FormField label="CPF" placeholder="000.000.000-00" :span="3" v-model="representante.cpf" />
                    <FormField label="Nome" placeholder="—" :span="5" v-model="representante.nome" />
                    <FormField label="RG" placeholder="—" :span="4" v-model="representante.rg" />
                    <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="representante.inscricaoProdutorRural" />
                    <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="representante.nacionalidade" />
                    <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="representante.dataNascimento" />
                    <FormField label="Profissão" placeholder="—" :span="4" v-model="representante.profissao" />
                  </StepGrid>
                </BentoBox>
              </template>
            </div>
          </BentoBox>

          <BentoBox title="Endereço" :icon="MapPin">
            <StepGrid>
              <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.cep" />
              <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade" />
              <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
              <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
              <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
              <FormField label="Cidade" placeholder="—" :span="5" v-model="form.cidade" />
              <SelectField
                label="País"
                :options="PAIS_OPTS"
                placeholder="Selecione"
                :span="4"
                :model-value="form.pais"
                @update:model-value="onPaisChange"
              />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Contato" :icon="Phone">
            <StepGrid>
              <FormField label="Nome" placeholder="—" :span="4" v-model="form.nomeContato" />
              <FormField label="E-mail" placeholder="contato@email.com" :span="4" v-model="form.email" />
              <SelectField label="DDI" :options="DDI_OPTS" :span="2" v-model="form.ddi" />
              <FormField label="Telefone" placeholder="(00) 00000-0000" :span="2" v-model="form.telefone" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Tipos" :icon="User">
            <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
              <label
                v-for="t in TIPOS_OPTS"
                :key="t.label"
                class="flex items-center"
                style="gap: 10px; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"
              >
                <Checkbox :checked="form.tipos.includes(t.label)" @change="toggleTipo(t.label)" />
                {{ t.label }}
              </label>
            </div>
          </BentoBox>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canSubmit"
          class="flex items-center btn-animated"
          :class="{ 'btn-primary': canSubmit }"
          :style="{
            gap: '8px',
            height: '44px',
            padding: '0 24px',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
          }"
          @click="handleSubmit"
        >
          <Building2 :size="15" /> CADASTRAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### NovaContaBancariaModal

```vue
<script setup lang="ts">
import { reactive, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { FormField, SelectField, StepGrid } from './adicionar-contrato';

const emit = defineEmits<{
  close: [];
  create: [label: string];
}>();

const BANCO_OPTS = [
  '001 — Banco do Brasil',
  '033 — Santander',
  '104 — Caixa',
  '237 — Bradesco',
  '341 — Itaú',
];

const form = reactive({
  banco: '',
  agencia: '',
  conta: '',
  titular: '',
});

const canSubmit = computed(
  () => form.banco.trim() !== '' && form.agencia.trim() !== '' && form.conta.trim() !== '' && form.titular.trim() !== '',
);

function salvar() {
  if (!canSubmit.value) return;
  const bancoCode = form.banco.split('—')[0]?.trim() ?? form.banco;
  const label = `${bancoCode} · Ag ${form.agencia} · CC ${form.conta} — ${form.titular}`;
  emit('create', label);
  emit('close');
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 500;
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
        max-width: 520px;
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
            Nova Conta Bancária
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Cadastro rápido para uso no veículo da operação
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

      <div style="padding: 24px 28px">
        <StepGrid>
          <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" :span="4" v-model="form.banco" />
          <FormField label="Agência" placeholder="—" :span="4" v-model="form.agencia" />
          <FormField label="Conta" placeholder="—" :span="4" v-model="form.conta" />
          <FormField label="Titular da conta" placeholder="—" :span="12" v-model="form.titular" />
        </StepGrid>
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
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          CADASTRAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### InserirEvidenciaModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Paperclip } from 'lucide-vue-next';

const props = defineProps<{ tituloValidacao: string }>();
const emit = defineEmits<{
  close: [];
  confirm: [data: { arquivo: string; descricao: string }];
}>();

const arquivo = ref('Exemplo.pdf');
const descricao = ref('');
const canSubmit = computed(() => descricao.value.trim().length > 0 || arquivo.value.trim().length > 0);

function salvar() {
  if (!canSubmit.value) return;
  emit('confirm', {
    arquivo: arquivo.value || 'Evidencia.pdf',
    descricao: descricao.value.trim() || '—',
  });
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
        max-width: 520px;
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
            Inserir evidência de autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
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

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Arquivo
          </div>
          <div
            class="flex items-center"
            style="
              gap: 8px;
              height: 42px;
              padding: 0 14px;
              background: var(--surface-sunken);
              border: 1px dashed var(--border-default);
              border-radius: var(--radius-lg);
              color: var(--text-default);
              font-size: var(--text-sm);
            "
          >
            <Paperclip :size="15" style="color: var(--text-muted)" />
            {{ arquivo }}
          </div>
        </div>

        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Descrição
          </div>
          <textarea
            v-model="descricao"
            rows="4"
            maxlength="500"
            placeholder="Descreva a evidência..."
            style="
              width: 100%;
              padding: 12px 14px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              font-family: inherit;
              resize: vertical;
            "
          />
          <div style="text-align: right; font-size: 11px; color: var(--text-muted); margin-top: 4px">
            {{ descricao.length }} / 500
          </div>
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
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          INSERIR
        </button>
      </div>
    </div>
  </div>
</template>
```

### DetalheEvidenciaModal

```vue
<script setup lang="ts">
import { X, Paperclip } from 'lucide-vue-next';
import type { ValidacaoEvidencia } from '../../data/operacaoData';

defineProps<{
  tituloValidacao: string;
  evidencia: ValidacaoEvidencia;
}>();
const emit = defineEmits<{ close: [] }>();
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
        max-width: 560px;
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
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            De: {{ evidencia.autor }}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ evidencia.data }}
          </div>
        </div>

        <div
          v-if="evidencia.arquivo"
          class="flex items-center"
          style="gap: 8px; font-size: var(--text-sm); color: var(--text-default)"
        >
          <Paperclip :size="15" style="color: var(--text-muted)" />
          {{ evidencia.arquivo }}
        </div>

        <div
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            line-height: 1.5;
            min-height: 96px;
          "
        >
          {{ evidencia.descricao }}
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="emit('close')"
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### DetalheValidacaoModal

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-vue-next';
import {
  VALIDACAO_STATUS_LABEL,
  type ItemValidacao,
  type ValidacaoStatus,
} from '../../data/operacaoData';

defineProps<{ v: ItemValidacao }>();
const emit = defineEmits<{ close: [] }>();

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: Component }> = {
  PENDENTE: { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock },
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 },
  OK: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  NAO_OK: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle },
  EXCECAO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
};
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
        max-width: 640px;
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
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da validação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ v.titulo }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="flex: 1; overflow-y: auto; padding: 24px 28px; gap: 16px">
        <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
          <span
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 2px 7px;
              border-radius: var(--radius-sm);
              background: var(--status-active-bg);
              color: var(--gci-base);
              text-transform: uppercase;
            "
          >
            {{ v.area }}
          </span>
          <span
            class="flex items-center"
            :style="{
              gap: '4px',
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              background: valTone[v.status].bg,
              color: valTone[v.status].fg,
              textTransform: 'uppercase',
            }"
          >
            <component :is="valTone[v.status].icon" :size="11" />
            {{ VALIDACAO_STATUS_LABEL[v.status] }}
          </span>
        </div>

        <p style="font-size: var(--text-sm); color: var(--text-default); line-height: 1.5; margin: 0">
          {{ v.descricao }}
        </p>

        <div v-if="v.erros?.length">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Erros
          </div>
          <div class="flex flex-col" style="gap: 8px">
            <div
              v-for="(erro, i) in v.erros"
              :key="i"
              style="
                padding: 12px 14px;
                background: var(--status-danger-bg);
                border: 1px solid var(--danger-light);
                border-radius: var(--radius-lg);
                font-size: var(--text-sm);
                color: var(--text-strong);
                line-height: 1.5;
              "
            >
              {{ erro }}
            </div>
          </div>
        </div>

        <div
          v-else
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-muted);
          "
        >
          Nenhum erro detalhado para esta validação.
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="emit('close')"
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### GerarTermoCessaoModal

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { X, MapPin, Building2, PenLine } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../data/operacaoData';
import { FormField, SelectField, ToggleRow, StepGrid, BentoBox } from './adicionar-contrato';

const emit = defineEmits<{ close: []; confirm: [] }>();

const TERMOS_OPTS = [
  'Termo padrão Ceres',
  'Termo sem coobrigação',
  'Termo com anuente',
];
const GESTORAS_OPTS = ['Ceres Investimentos', 'Ceres Trading', 'Ceres Securitizadora'];
const SIGNATARIOS_OPTS = ['Representantes legais do fundo', 'Cedente + Fundo', 'Avalistas'];

const form = reactive({
  termo: '',
  semCoobrigacao: false,
  dataFirma: '',
  possuiDevedorSolidario: false,
  conjugeAssinaAnuente: false,
  cidade: '',
  estado: '',
  gestoras: '',
  signatarios: '',
});

function salvar() {
  emit('confirm');
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
        max-width: 640px;
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
            Gerar Termo de Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados do termo, endereço, gestoras e signatários
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

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 20px">
          <StepGrid>
            <SelectField label="Termos" :options="TERMOS_OPTS" placeholder="Selecione" :span="6" v-model="form.termo" />
            <FormField label="Data de firma do contrato" placeholder="dd/mm/aaaa" :span="6" v-model="form.dataFirma" />
            <div style="grid-column: span 12">
              <ToggleRow
                label="Sem coobrigação"
                :on="form.semCoobrigacao"
                compact
                @toggle="form.semCoobrigacao = !form.semCoobrigacao"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Possui devedor solidário"
                :on="form.possuiDevedorSolidario"
                compact
                @toggle="form.possuiDevedorSolidario = !form.possuiDevedorSolidario"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Cônjuge assina como anuente"
                :on="form.conjugeAssinaAnuente"
                compact
                @toggle="form.conjugeAssinaAnuente = !form.conjugeAssinaAnuente"
              />
            </div>
          </StepGrid>

          <BentoBox title="Endereço" :icon="MapPin">
            <StepGrid>
              <FormField label="Cidade" placeholder="—" :span="8" v-model="form.cidade" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="4" v-model="form.estado" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Gestoras" :icon="Building2">
            <StepGrid>
              <SelectField label="Gestoras" :options="GESTORAS_OPTS" placeholder="Selecione" :span="12" v-model="form.gestoras" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Signatários" :icon="PenLine">
            <StepGrid>
              <SelectField label="Signatários" :options="SIGNATARIOS_OPTS" placeholder="Selecione" :span="12" v-model="form.signatarios" />
            </StepGrid>
          </BentoBox>
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
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### GerarCnabModal

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { X } from 'lucide-vue-next';
import { SelectField, ToggleRow, StepGrid } from './adicionar-contrato';

const emit = defineEmits<{ close: []; confirm: [] }>();

const CESSAO_OPTS = [
  'AGROCOLMEIA_OP.2047_16072026',
  'CERES_OP.1388_09072026',
  'SEMEAGRO_OP.1401_01062026',
];
const CNAB_OPTS = ['CNAB 240', 'CNAB 400', 'CNAB 444'];
const ADMIN_OPTS = ['Singulare', 'Oliveira Trust', 'Vórtx'];
const OCORRENCIA_OPTS = [
  'Remessa de títulos',
  'Baixa de títulos',
  'Alteração de vencimento',
  'Protesto',
];

const form = reactive({
  cessao: '',
  cnab: '',
  administradora: '',
  semCoobrigacao: false,
  identificacaoOcorrencia: '',
});

function salvar() {
  emit('confirm');
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
        max-width: 560px;
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
            Gerar CNAB
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Configuração do arquivo de remessa
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

      <div style="padding: 24px 28px">
        <StepGrid>
          <SelectField label="Cessão" :options="CESSAO_OPTS" placeholder="Selecione" :span="12" v-model="form.cessao" />
          <SelectField label="CNAB" :options="CNAB_OPTS" placeholder="Selecione" :span="6" v-model="form.cnab" />
          <SelectField label="Administradora" :options="ADMIN_OPTS" placeholder="Selecione" :span="6" v-model="form.administradora" />
          <div style="grid-column: span 12">
            <ToggleRow
              label="Sem coobrigação"
              :on="form.semCoobrigacao"
              compact
              @toggle="form.semCoobrigacao = !form.semCoobrigacao"
            />
          </div>
          <SelectField
            label="Identificação de ocorrência"
            :options="OCORRENCIA_OPTS"
            placeholder="Selecione"
            :span="12"
            v-model="form.identificacaoOcorrencia"
          />
        </StepGrid>
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
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### AtualizarCessaoModal

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { X } from 'lucide-vue-next';
import {
  emptyCessaoForm,
  CESSAO_PARAM_OPTS,
  CESSAO_TIPO_CALCULO_OPTS,
  CESSAO_FREQUENCIA_OPTS,
  CESSAO_OPERADOR_OPTS,
  CESSAO_INDICADOR_OPTS,
  CESSAO_CAPITALIZACAO_OPTS,
  CESSAO_BASE_DIAS_OPTS,
  CESSAO_INICIO_JUROS_OPTS,
  CESSAO_DATA_ACCRUAL_OPTS,
} from '../../data/minutaData';
import { FormField, SelectField, ToggleRow, StepGrid } from './adicionar-contrato';

const emit = defineEmits<{ close: []; confirm: [] }>();

const form = reactive(emptyCessaoForm());
if (!form.dataDesembolso) {
  const d = new Date();
  form.dataDesembolso = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function salvar() {
  emit('confirm');
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
        max-width: 900px;
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
            Atualizar Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Parâmetros financeiros e de cálculo da cessão
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

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 16px">
          <StepGrid>
            <FormField label="Taxa (%)" placeholder="0" :span="4" v-model="form.taxaCessao" />
            <FormField label="Data de cessão" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataDesembolso" />
            <FormField label="Desconto adicional (%)" placeholder="0" :span="4" v-model="form.descontoAdicional" />
            <FormField label="% garantia de recebíveis" placeholder="0" :span="6" v-model="form.pctGarantiaRecebiveis" />
            <FormField label="% de outras garantias" placeholder="0" :span="6" v-model="form.pctGarantiaOutras" />
            <div style="grid-column: span 12">
              <ToggleRow
                label="Usar certificador de e-mail"
                :on="form.usarCertificadorEmail"
                compact
                @toggle="form.usarCertificadorEmail = !form.usarCertificadorEmail"
              />
            </div>
          </StepGrid>

          <StepGrid>
            <SelectField
              label="Parametrização de cálculo"
              :options="CESSAO_PARAM_OPTS"
              placeholder="Selecione"
              :span="12"
              v-model="form.parametrizacaoCalculo"
            />
            <SelectField
              label="Tipo de cálculo"
              :options="CESSAO_TIPO_CALCULO_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.tipoCalculoCessao"
            />
            <SelectField
              label="Indicador da taxa"
              :options="CESSAO_INDICADOR_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.indicadorTaxa"
            />
            <SelectField
              label="Operador"
              :options="CESSAO_OPERADOR_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.operador"
            />
            <SelectField
              label="Frequência da taxa"
              :options="CESSAO_FREQUENCIA_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.frequenciaTaxa"
            />
            <SelectField
              label="Base de dias para cálculo"
              :options="CESSAO_BASE_DIAS_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.baseDias"
            />
            <SelectField
              label="Início da contagem de juros"
              :options="CESSAO_INICIO_JUROS_OPTS"
              placeholder="Selecione"
              :span="4"
              v-model="form.inicioContagemJuros"
            />
            <SelectField
              label="Data usada para cálculo do Accrual"
              :options="CESSAO_DATA_ACCRUAL_OPTS"
              placeholder="Selecione"
              :span="6"
              v-model="form.dataAccrual"
            />
            <SelectField
              label="Tipo de capitalização"
              :options="CESSAO_CAPITALIZACAO_OPTS"
              placeholder="Selecione"
              :span="6"
              v-model="form.tipoCapitalizacao"
            />
            <div style="grid-column: span 12">
              <ToggleRow
                label="Usar cálculo de mercado"
                :on="form.usarCalculoMercado"
                compact
                @toggle="form.usarCalculoMercado = !form.usarCalculoMercado"
              />
            </div>
            <div style="grid-column: span 12">
              <ToggleRow
                label="Utilizar última taxa disponível (final de semana utiliza taxa de sexta-feira)"
                :on="form.usarUltimaTaxaDisponivel"
                compact
                @toggle="form.usarUltimaTaxaDisponivel = !form.usarUltimaTaxaDisponivel"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Com coobrigação"
                :on="form.comCoobrigacao"
                compact
                @toggle="form.comCoobrigacao = !form.comCoobrigacao"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Possui obrigação de recompra"
                :on="form.obrigacaoRecompra"
                compact
                @toggle="form.obrigacaoRecompra = !form.obrigacaoRecompra"
              />
            </div>
          </StepGrid>
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
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          ATUALIZAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### ProrrogarVencimentoModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField } from './adicionar-contrato';

defineProps<{ ativos: ContratoAtivo[] }>();
const emit = defineEmits<{ close: []; confirm: [data: { novoVencimento: string; motivo: string }] }>();

const novoVencimento = ref('');
const motivo = ref('');

function salvar() {
  if (!novoVencimento.value.trim()) return;
  emit('confirm', { novoVencimento: novoVencimento.value, motivo: motivo.value });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; z-index: 100; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
    @click.self="emit('close')"
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Prorrogar Vencimento</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>
      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <FormField label="Novo vencimento" placeholder="dd/mm/aaaa" v-model="novoVencimento" required />
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">CARTA DE CORREÇÃO</label>
          <button
            class="flex items-center"
            style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
          >
            <Upload :size="16" /> Selecionar arquivo
          </button>
        </div>
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">MOTIVO DA PRORROGAÇÃO</label>
          <textarea
            v-model="motivo"
            rows="3"
            placeholder="Descreva o motivo da prorrogação..."
            style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
          />
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          :disabled="!novoVencimento.trim()"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### ConfirmarTituloModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, Upload } from 'lucide-vue-next';
import type { ContratoAtivo } from '../../data/operacaoData';
import { FormField, SelectField } from './adicionar-contrato';

const props = defineProps<{ ativos: ContratoAtivo[] }>();
const emit = defineEmits<{ close: []; confirm: [data: { status: string; data: string; observacao: string }] }>();

const STATUS_OPTS = ['CONFIRMADO', 'REJEITADO', 'PENDENTE'];
const status = ref('CONFIRMADO');
const dataConfirmacao = ref('');
const observacao = ref('');

function salvar() {
  emit('confirm', { status: status.value, data: dataConfirmacao.value, observacao: observacao.value });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; z-index: 100; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
    @click.self="emit('close')"
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Confirmar Título</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>
      <div style="padding: 24px">
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
          {{ ativos.length }} título(s) selecionado(s)
        </p>
        <div class="flex flex-col" style="gap: 16px">
          <SelectField label="Status da confirmação" :options="STATUS_OPTS" placeholder="Selecione" v-model="status" />
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">EVIDÊNCIA</label>
            <button
              class="flex items-center"
              style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
            >
              <Upload :size="16" /> Selecionar arquivo
            </button>
          </div>
          <FormField label="Dia/Hora da confirmação" placeholder="dd/mm/aaaa hh:mm" v-model="dataConfirmacao" />
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">OBSERVAÇÃO</label>
            <textarea
              v-model="observacao"
              rows="3"
              placeholder="Observações sobre a confirmação..."
              style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
            />
          </div>
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          REGISTRAR CONFIRMAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
```

### EditarValorOperacaoModal

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, AlertTriangle } from 'lucide-vue-next';
import { brl } from '../../data/operacaoData';
import { FormField } from './adicionar-contrato';

const props = defineProps<{
  valorAtual: number;
  feePercent: number;
}>();
const emit = defineEmits<{ close: []; confirm: [valor: number] }>();

const input = ref('');

watch(
  () => props.valorAtual,
  (v) => {
    input.value = formatInput(v);
  },
  { immediate: true },
);

function formatInput(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBrl(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const novoValor = computed(() => parseBrl(input.value));
const novoFee = computed(() => (novoValor.value != null ? (novoValor.value * props.feePercent) / 100 : null));
const canConfirm = computed(() => novoValor.value != null && novoValor.value !== props.valorAtual);

function salvar() {
  if (novoValor.value == null || !canConfirm.value) return;
  emit('confirm', novoValor.value);
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
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Editar valor da operação
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Atual: {{ brl(valorAtual) }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <FormField label="Novo valor (R$)" placeholder="0,00" v-model="input" required />

        <div
          style="
            padding: 14px 16px;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
          "
        >
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
            Prévia do impacto
          </div>
          <div class="flex items-center justify-between" style="margin-bottom: 8px">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">FEE ({{ feePercent }}%)</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoFee != null ? brl(novoFee) : '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">Valor da operação</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoValor != null ? brl(novoValor) : '—' }}
            </span>
          </div>
        </div>

        <div
          class="flex items-start"
          style="gap: 8px; font-size: var(--text-xs); color: var(--warning-dark); font-weight: var(--weight-semibold)"
        >
          <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
          Alterar o valor recalcula o Valor FEE e pode afetar validações e ativos vinculados.
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
        <button
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import FieldLabel from './FieldLabel.vue';
import { formatCurrencyInput } from '../../../utils/currencyMask';

const props = withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    span?: number;
    /** Máscara R$ centavos (digitar 2 → R$ 0,02) */
    currency?: boolean;
  }>(),
  { disabled: false, required: false, currency: false },
);
const model = defineModel<string>({ default: '' });

const touched = ref(false);
const showError = computed(() => {
  if (!props.required || !touched.value) return false;
  if (props.currency) return !model.value || model.value === 'R$ 0,00';
  return !model.value;
});

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  if (props.currency) {
    model.value = formatCurrencyInput(el.value);
    return;
  }
  model.value = el.value;
}
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel :show-error="showError">{{ label }}</FieldLabel>
    <input
      :value="model"
      :placeholder="currency ? 'R$ 0,00' : placeholder"
      :disabled="disabled"
      :inputmode="currency ? 'numeric' : undefined"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
        fontVariantNumeric: currency ? 'tabular-nums' : undefined,
      }"
      @input="onInput"
      @blur="touched = true"
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

withDefaults(
  defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean; required?: boolean; span?: number }>(),
  { disabled: false, required: false },
);
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<script setup lang="ts">
withDefaults(defineProps<{ showError?: boolean }>(), { showError: false });
</script>

<template>
  <div
    :style="{
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.14em',
      color: showError ? 'var(--danger-base)' : 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: '6px',
    }"
  >
    <template v-if="showError">* </template><slot />
  </div>
</template>
```

### ToggleRow

```vue
<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean; spacious?: boolean; disabled?: boolean }>(),
  { compact: false, spacious: false, disabled: false },
);
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'toggle-row--match-field': compact && !hint }"
    :style="{
      width: spacious ? '100%' : undefined,
      padding: spacious ? '20px 24px' : compact ? '12px 16px' : '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: '12px',
    }"
    @click="!disabled && emit('toggle')"
  >
    <div style="min-width: 0">
      <div
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-strong);
          line-height: 1.35;
        "
      >{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; line-height: 1.4">{{ hint }}</div>
    </div>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Altura alinhada ao bloco SelectField (label + input 40px) — só quando não há hint */
.toggle-row--match-field {
  min-height: 64px;
  height: 100%;
  align-self: stretch;
}
</style>
```

### AddButton

```vue
<script setup lang="ts">
withDefaults(
  defineProps<{ disabled?: boolean; fullWidth?: boolean }>(),
  { disabled: false, fullWidth: false },
);
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="flex items-center justify-center"
    :disabled="disabled"
    :style="{
      width: fullWidth ? '100%' : undefined,
      height: '40px',
      padding: '0 18px',
      background: disabled ? 'var(--neutral-200)' : 'var(--gci-base)',
      color: disabled ? 'var(--text-disabled)' : '#fff',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      gap: '6px',
      opacity: disabled ? 0.7 : 1,
    }"
    @click="!disabled && emit('click')"
  >
    <slot />
  </button>
</template>
```

### EmptyState

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; title: string; hint?: string }>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <component :is="icon" :size="28" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
      {{ title }}
    </div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">{{ hint }}</div>
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
defineProps<{ cols: number }>();
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      <component :is="icon" v-if="icon" :size="13" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### StepGrid

```vue
<template>
  <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
    <slot />
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label: string; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      style="
        width: 100%;
        height: 40px;
        padding: 0 14px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        outline: none;
        font-size: var(--text-sm);
        color: var(--text-strong);
      "
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label?: string; options: string[]; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<template>
  <div
    style="
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.14em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    "
  >
    <slot />
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
defineProps<{ cols: number }>();
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      <component :is="icon" v-if="icon" :size="13" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### MinutaWizard

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Building2,
  Users,
  MapPin,
  Package,
  Shield,
  Tag,
  Landmark,
  ScrollText,
  BookOpen,
  Forward,
  Percent,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ParteRelacionada, ParcelaAtivo } from '../../../data/operacaoData';
import { SelectField, ToggleRow } from '../adicionar-contrato';
import MinutaStepper from './MinutaStepper.vue';
import EmitenteStep from './EmitenteStep.vue';
import CredoraStep from './CredoraStep.vue';
import AvalistaStep from './AvalistaStep.vue';
import EmissaoStep from './EmissaoStep.vue';
import ProdutoStep from './ProdutoStep.vue';
import GarantiaMinutaStep from './GarantiaMinutaStep.vue';
import TituloMinutaStep from './TituloMinutaStep.vue';
import EscrituradorStep from './EscrituradorStep.vue';
import InformacaoPagamentoStep from './InformacaoPagamentoStep.vue';
import BoletimSubscricaoStep from './BoletimSubscricaoStep.vue';
import EndossatarioStep from './EndossatarioStep.vue';
import CetStep from './CetStep.vue';
import ParteRelacionadaModal from '../ParteRelacionadaModal.vue';
import {
  categoriaMinuta,
  templatesDisponiveis,
  templateMinuta,
  credoraPadraoOptions,
  emptyPessoaMinuta,
  emptyProdutoMinuta,
  emptyMinutaResumo,
  emptyBoletimSubscricao,
  emptyCetForm,
  emptyCessaoForm,
  type PessoaMinuta,
  type ProdutoMinuta,
  type AvalistaMinutaRow,
  type TituloMinutaForm,
  type MinutaResumo,
  type GarantiaMinuta,
  type ContaBancaria,
  type BoletimSubscricao,
  type CetForm,
  type EmissaoMinuta,
} from '../../../data/minutaData';

const props = withDefaults(
  defineProps<{
    valorOperacao: number;
    tipoCalculo: string;
    tipo: string;
    partes: ParteRelacionada[];
    gerarMinuta: boolean;
    unidadeNegocio?: string;
  }>(),
  { unidadeNegocio: '' },
);

const emit = defineEmits<{
  'update:gerarMinuta': [value: boolean];
  create: [
    data: {
      numero: string;
      tipo: string;
      emissao: string;
      vencimento: string;
      valorTotal: number;
      sacadoNome: string;
      sacadoDocumento: string;
      parcelas: ParcelaAtivo[];
      minuta: MinutaResumo;
    },
  ];
}>();

const categoria = computed(() => categoriaMinuta(props.tipo));
const showBoletim = computed(
  () => categoria.value === 'NC' && props.unidadeNegocio === 'Ceres Trading',
);

type StepDef = { key: string; label: string; icon: Component };

const steps = computed<StepDef[]>(() => {
  if (categoria.value === 'NC') {
    const list: StepDef[] = [
      { key: 'emitente', label: 'Emissora', icon: User },
      { key: 'credora', label: 'Credora', icon: Building2 },
      { key: 'escriturador', label: 'Escriturador', icon: Landmark },
      { key: 'avalista', label: 'Avalista', icon: Users },
      { key: 'emissao', label: 'Emissão', icon: MapPin },
      { key: 'pagamento', label: 'Pagamento', icon: ScrollText },
      { key: 'garantia', label: 'Garantia', icon: Shield },
    ];
    if (showBoletim.value) {
      list.push({ key: 'boletim', label: 'Boletim', icon: BookOpen });
    }
    list.push({ key: 'titulo', label: 'Título', icon: Tag });
    return list;
  }
  if (categoria.value === 'CCB') {
    return [
      { key: 'emitente', label: 'Emissora', icon: User },
      { key: 'credora', label: 'Credora', icon: Building2 },
      { key: 'avalista', label: 'Avalista', icon: Users },
      { key: 'endossatario', label: 'Endossatário', icon: Forward },
      { key: 'garantia', label: 'Garantia', icon: Shield },
      { key: 'titulo', label: 'Título', icon: Tag },
      { key: 'cet', label: 'CET', icon: Percent },
    ];
  }
  return [
    { key: 'emitente', label: 'Emitente', icon: User },
    { key: 'credora', label: 'Credora', icon: Building2 },
    { key: 'avalista', label: 'Avalista', icon: Users },
    { key: 'emissao', label: 'Emissão', icon: MapPin },
    { key: 'produto', label: 'Produto', icon: Package },
    { key: 'garantia', label: 'Garantia', icon: Shield },
    { key: 'titulo', label: 'Título', icon: Tag },
  ];
});

const stepIdx = ref(0);
const currentKey = computed(() => steps.value[stepIdx.value]?.key ?? 'emitente');

watch(steps, () => {
  if (stepIdx.value >= steps.value.length) stepIdx.value = Math.max(0, steps.value.length - 1);
});

const templatesOpts = computed(() => templatesDisponiveis(props.tipo));
const templateSel = ref(templateMinuta(props.tipo));
const templateDisabled = computed(() => categoria.value !== 'NC');

watch(
  () => props.tipo,
  () => {
    templateSel.value = templateMinuta(props.tipo);
    stepIdx.value = 0;
  },
);

const gerarViaNaoNegociavel = ref(categoria.value !== 'NC');
watch(categoria, (c) => {
  if (c === 'NC') gerarViaNaoNegociavel.value = false;
  else if (!gerarViaNaoNegociavel.value) gerarViaNaoNegociavel.value = true;
});

const topBarCols = computed(() =>
  categoria.value === 'NC' ? '1fr 1.5fr' : '1fr 1.5fr 1fr',
);

const emitenteForm = ref<PessoaMinuta>(
  emptyPessoaMinuta(categoria.value === 'NC' ? 'JURIDICA' : 'FISICA'),
);
const emitenteDocBusca = ref('');
const emitentes = ref<PessoaMinuta[]>([]);

const credoraForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const credoraPadrao = ref('');
const credoraDocBusca = ref('');
const credoraContato = ref('');
const credoraEndereco = ref('');
const credoraRepresentante = ref('');
const credoraOpts = computed(() => credoraPadraoOptions(categoria.value));

const escrituradorForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const escrituradorPadrao = ref('');
const escrituradorDocBusca = ref('');

const contaBancariaId = ref('');
const contasExtras = ref<ContaBancaria[]>([]);

const boletim = ref<BoletimSubscricao>(emptyBoletimSubscricao());

const endossatarioForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const endossatarioPadrao = ref('');
const endossatarioDocBusca = ref('');
const endossatarioContato = ref('');
const endossatarioEndereco = ref('');
const endossatarioRepresentante = ref('');

const cetForm = ref<CetForm>(emptyCetForm());

const possuiAvalistas = ref(true);
const avalistaRows = ref<AvalistaMinutaRow[]>(
  props.partes
    .filter((p) => p.tipos.includes('AVA'))
    .map((p) => ({
      documento: p.documento,
      nome: p.nome,
      possuiConjuge: !!p.possuiConjuge,
      selecionadoAssinatura: false,
      conjugeInterveniente: false,
    })),
);
const showParteModal = ref(false);

const emissao = reactive<EmissaoMinuta>({
  uf: '',
  cidade: '',
  numero: '',
  serie: '',
  valorNominalUnitario: '',
  quantidade: '',
  valorTotal: '',
});

const produtoForm = ref(emptyProdutoMinuta());
const produtos = ref<ProdutoMinuta[]>([]);
const garantias = ref<GarantiaMinuta[]>([]);

const tipoTituloLabel = computed(() => {
  const cat = categoria.value;
  if (cat === 'NC') return 'NC';
  if (cat === 'CCB') return 'CCB';
  const t = props.tipo.toUpperCase();
  if (t.includes('CPRF') || t.includes('CPR-F')) return 'CPRF';
  if (t.includes('CPR')) return 'CPR';
  return props.tipo;
});

const tituloForm = ref<TituloMinutaForm>({
  tipoValorLiquido: true,
  numero: '',
  tipo: tipoTituloLabel.value,
  emissao: '',
  vencimento: '',
  chaveNota: '',
  docCedente: '',
  gerarOperacaoGarantias: false,
  possuiCronograma: true,
  cronogramaAutomatico: false,
  fluxoAmortizacao: '',
  fluxoJuros: '',
  cessao: emptyCessaoForm(),
  sacadoDocumento: '',
  sacadoNome: '',
  sacadoEmail: '',
  ddi: '+55',
  telefone: '',
  cep: '',
  endereco: '',
  numeroEndereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
});
const cronograma = ref<ParcelaAtivo[]>([]);

watch(
  () => props.tipo,
  () => {
    tituloForm.value.tipo = tipoTituloLabel.value;
  },
);

const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.value.length - 1);

function goNext() {
  if (isLast.value) {
    handleSubmit();
    return;
  }
  stepIdx.value++;
}

function goBack() {
  if (isFirst.value) return;
  stepIdx.value--;
}

function selectStep(i: number) {
  stepIdx.value = i;
}

function toggleAssinatura(i: number) {
  avalistaRows.value[i].selecionadoAssinatura = !avalistaRows.value[i].selecionadoAssinatura;
}
function toggleConjuge(i: number) {
  avalistaRows.value[i].conjugeInterveniente = !avalistaRows.value[i].conjugeInterveniente;
}

function onAddParte(parte: ParteRelacionada) {
  if (!parte.tipos.includes('AVA')) {
    parte.tipos = [...parte.tipos, 'AVA'];
  }
  avalistaRows.value = [
    ...avalistaRows.value,
    {
      documento: parte.documento,
      nome: parte.nome,
      possuiConjuge: !!parte.possuiConjuge,
      selecionadoAssinatura: true,
      conjugeInterveniente: false,
    },
  ];
  showParteModal.value = false;
}

function buildMinuta(): MinutaResumo {
  const base = emptyMinutaResumo(props.tipo);
  const cat = categoria.value;

  const emissaoPayload: EmissaoMinuta =
    cat === 'CCB'
      ? { uf: 'SP', cidade: 'São Paulo' }
      : { ...emissao };

  const result: MinutaResumo = {
    ...base,
    template: templateSel.value,
    gerarViaNaoNegociavel: cat === 'NC' ? false : gerarViaNaoNegociavel.value,
    emitentes: [...emitentes.value],
    credora: credoraPadrao.value || credoraDocBusca.value ? { ...credoraForm.value } : null,
    credoraPadrao: credoraPadrao.value,
    avalistas: [...avalistaRows.value],
    possuiAvalistas: possuiAvalistas.value,
    emissao: emissaoPayload,
    produtos: cat === 'CPR' ? [...produtos.value] : [],
    garantias: [...garantias.value],
    cessao: { ...tituloForm.value.cessao },
  };

  if (cat === 'NC') {
    result.escriturador =
      escrituradorPadrao.value || escrituradorDocBusca.value ? { ...escrituradorForm.value } : null;
    result.escrituradorPadrao = escrituradorPadrao.value;
    result.contaBancariaId = contaBancariaId.value;
    result.boletimSubscricao = showBoletim.value ? { ...boletim.value, subscritor: { ...boletim.value.subscritor } } : null;
  }

  if (cat === 'CCB') {
    result.endossatario =
      endossatarioPadrao.value || endossatarioDocBusca.value ? { ...endossatarioForm.value } : null;
    result.endossatarioPadrao = endossatarioPadrao.value;
    result.cet = { ...cetForm.value };
  }

  return result;
}

function handleSubmit() {
  emit('create', {
    numero: tituloForm.value.numero,
    tipo: tituloForm.value.tipo,
    emissao: tituloForm.value.emissao,
    vencimento: tituloForm.value.vencimento,
    valorTotal: props.valorOperacao,
    sacadoNome: tituloForm.value.sacadoNome,
    sacadoDocumento: tituloForm.value.sacadoDocumento,
    parcelas: tituloForm.value.possuiCronograma ? [...cronograma.value] : [],
    minuta: buildMinuta(),
  });
}

const subtitleByCat = computed(() => {
  if (categoria.value === 'NC') return 'Geração de minuta Nota Comercial';
  if (categoria.value === 'CCB') return 'Geração de minuta CCB';
  return 'Geração de minuta CPR / CPR-F';
});
</script>

<template>
  <div class="flex flex-col" style="flex: 1; min-height: 0">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: topBarCols,
        gap: '16px',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-default)',
        alignItems: 'stretch',
      }"
    >
      <ToggleRow
        label="Gerar minuta"
        :on="gerarMinuta"
        compact
        @toggle="emit('update:gerarMinuta', !gerarMinuta)"
      />
      <SelectField
        label="Selecione o template"
        :options="templatesOpts"
        v-model="templateSel"
        required
        :disabled="templateDisabled"
      />
      <ToggleRow
        v-if="categoria !== 'NC'"
        label="Gerar via não negociável"
        :on="gerarViaNaoNegociavel"
        compact
        @toggle="gerarViaNaoNegociavel = !gerarViaNaoNegociavel"
      />
    </div>

    <MinutaStepper :steps="steps" :current="stepIdx" @select="selectStep" />

    <div style="flex: 1; overflow-y: auto; padding: 32px">
      <EmitenteStep
        v-if="currentKey === 'emitente'"
        v-model:emitentes="emitentes"
        v-model:form="emitenteForm"
        v-model:doc-busca="emitenteDocBusca"
        :apenas-pessoa-juridica="categoria === 'NC'"
        :max-emitentes="categoria === 'NC' ? 1 : undefined"
      />
      <CredoraStep
        v-else-if="currentKey === 'credora'"
        v-model:form="credoraForm"
        v-model:credora-padrao="credoraPadrao"
        v-model:doc-busca="credoraDocBusca"
        v-model:contato="credoraContato"
        v-model:endereco="credoraEndereco"
        v-model:representante="credoraRepresentante"
        :padrao-options="credoraOpts"
        :legal-rep-fields-optional="categoria === 'CCB'"
      />
      <EscrituradorStep
        v-else-if="currentKey === 'escriturador'"
        v-model:form="escrituradorForm"
        v-model:escriturador-padrao="escrituradorPadrao"
        v-model:doc-busca="escrituradorDocBusca"
      />
      <AvalistaStep
        v-else-if="currentKey === 'avalista'"
        :possui-avalistas="possuiAvalistas"
        :rows="avalistaRows"
        @toggle-possui="possuiAvalistas = !possuiAvalistas"
        @toggle-assinatura="toggleAssinatura"
        @toggle-conjuge="toggleConjuge"
        @add-avalista="showParteModal = true"
      />
      <EmissaoStep
        v-else-if="currentKey === 'emissao'"
        v-model="emissao"
        :modo-nc="categoria === 'NC'"
      />
      <InformacaoPagamentoStep
        v-else-if="currentKey === 'pagamento'"
        v-model:conta-bancaria-id="contaBancariaId"
        v-model:contas-extras="contasExtras"
      />
      <ProdutoStep
        v-else-if="currentKey === 'produto'"
        v-model:produtos="produtos"
        v-model:form="produtoForm"
      />
      <GarantiaMinutaStep v-else-if="currentKey === 'garantia'" v-model:garantias="garantias" />
      <BoletimSubscricaoStep
        v-else-if="currentKey === 'boletim'"
        v-model="boletim"
        v-model:contas-extras="contasExtras"
      />
      <EndossatarioStep
        v-else-if="currentKey === 'endossatario'"
        v-model:form="endossatarioForm"
        v-model:endossatario-padrao="endossatarioPadrao"
        v-model:doc-busca="endossatarioDocBusca"
        v-model:contato="endossatarioContato"
        v-model:endereco="endossatarioEndereco"
        v-model:representante="endossatarioRepresentante"
      />
      <TituloMinutaStep
        v-else-if="currentKey === 'titulo'"
        :valor-operacao="valorOperacao"
        :tipo-calculo="tipoCalculo"
        v-model="tituloForm"
        v-model:cronograma="cronograma"
      />
      <CetStep
        v-else-if="currentKey === 'cet'"
        v-model="cetForm"
        :valor-titulo="valorOperacao"
        :data-emissao="tituloForm.emissao"
        :data-vencimento="tituloForm.vencimento"
      />
    </div>

    <div
      class="flex items-center justify-between"
      style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
    >
      <button
        class="flex items-center"
        :style="{
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: isFirst ? 'not-allowed' : 'pointer',
          color: 'var(--text-muted)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-sm)',
          padding: '10px 4px',
          opacity: isFirst ? 0.4 : 1,
        }"
        :disabled="isFirst"
        @click="goBack"
      >
        <ChevronLeft :size="15" /> Voltar
      </button>

      <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)">
        {{ stepIdx + 1 }} / {{ steps.length }}
        <span style="margin-left: 8px; font-weight: var(--weight-normal)">· {{ subtitleByCat }}</span>
      </span>

      <button
        class="flex items-center"
        :style="{
          gap: '8px',
          height: '44px',
          padding: '0 22px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          background: 'var(--action-primary-bg)',
          color: '#fff',
        }"
        @click="goNext"
      >
        <template v-if="isLast">
          <FileText :size="15" /> GERAR TÍTULO
        </template>
        <template v-else>
          Próximo <ChevronRight :size="15" />
        </template>
      </button>
    </div>

    <ParteRelacionadaModal v-if="showParteModal" @close="showParteModal = false" @create="onAddParte" />
  </div>
</template>
```

### MinutaStepper

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  steps: { key: string; label: string; icon: Component }[];
  current: number;
}>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); overflow-x: auto">
    <button
      v-for="(s, i) in steps"
      :key="s.key"
      type="button"
      class="flex flex-col items-center justify-center"
      :style="{
        flex: 1,
        gap: '6px',
        minWidth: '88px',
        padding: '14px 8px 11px',
        background: 'transparent',
        border: 'none',
        borderBottom: i === current ? '3px solid var(--agro-base)' : '3px solid transparent',
        cursor: 'pointer',
        color: i === current ? 'var(--agro-base)' : i < current ? 'var(--gci-base)' : 'var(--text-muted)',
        opacity: i !== current && i >= current ? 0.6 : 1,
        transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
      }"
      @click="emit('select', i)"
    >
      <component :is="s.icon" :size="18" :stroke-width="i === current ? 2.25 : 1.5" />
      <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>
```

### EmissaoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { FileText } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../../data/operacaoData';
import { BentoBox, StepGrid, SelectField, FormField } from '../adicionar-contrato';
import { cidadesDaUf, SERIE_EMISSAO_OPTS, type EmissaoMinuta } from '../../../data/minutaData';

const props = withDefaults(defineProps<{ modoNc?: boolean }>(), { modoNc: false });
const form = defineModel<EmissaoMinuta>({ required: true });

const cidadeOpts = computed(() => cidadesDaUf(form.value.uf));
const ufEmissaoOpts = computed(() =>
  ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)),
);

watch(
  () => form.value.uf,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="Emissão" :icon="FileText">
      <StepGrid>
        <SelectField label="UF da emissão" :options="ufEmissaoOpts" placeholder="Selecione" required :span="4" v-model="form.uf" />
        <SelectField
          label="Cidade da emissão"
          :options="cidadeOpts"
          placeholder="Selecione"
          required
          :span="8"
          :disabled="!form.uf"
          v-model="form.cidade"
        />
      </StepGrid>
    </BentoBox>

    <BentoBox v-if="modoNc" title="Dados da emissão — Nota Comercial" :icon="FileText">
      <StepGrid>
        <FormField label="Número de emissão" placeholder="—" required :span="3" v-model="form.numero!" />
        <SelectField label="Série" :options="SERIE_EMISSAO_OPTS" placeholder="Selecione" required :span="3" v-model="form.serie!" />
        <FormField label="Valor nominal unitário" placeholder="R$ 0,00" required currency :span="3" v-model="form.valorNominalUnitario!" />
        <FormField label="Quantidade" placeholder="—" required :span="3" v-model="form.quantidade!" />
        <FormField label="Valor total" placeholder="R$ 0,00" required currency :span="4" v-model="form.valorTotal!" />
      </StepGrid>
    </BentoBox>
  </div>
</template>
```

### CredoraStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  CREDORA_PADRAO_OPTS,
  CREDORAS_PADRAO,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const props = withDefaults(
  defineProps<{
    padraoOptions?: string[];
    legalRepFieldsOptional?: boolean;
  }>(),
  {
    padraoOptions: () => CREDORA_PADRAO_OPTS,
    legalRepFieldsOptional: false,
  },
);

const credoraPadrao = defineModel<string>('credoraPadrao', { default: '' });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });
const contatoSel = defineModel<string>('contato', { default: '' });
const enderecoSel = defineModel<string>('endereco', { default: '' });
const representanteSel = defineModel<string>('representante', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const modoCredoraPadrao = computed(() => !!credoraPadrao.value);
const modoCliente = computed(() => !!docBusca.value && !credoraPadrao.value);
const camposHabilitados = computed(() => modoCredoraPadrao.value || modoCliente.value);
const repLabel = computed(() =>
  props.legalRepFieldsOptional ? 'Representante Legal (opcional)' : 'Representante Legal',
);

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const DOC_OPTS = [
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  '56.025.302/0001-79 - CERES TRADING E INVESTIMENTOS S.A.',
];

const contatoOpts = computed(() => form.value.contatos ?? []);
const enderecoOpts = computed(() => form.value.enderecos ?? []);
const representanteOpts = computed(() => form.value.representantes ?? []);

watch(credoraPadrao, (v) => {
  if (!v) return;
  const data = CREDORAS_PADRAO[v];
  if (!data) return;
  Object.assign(form.value, JSON.parse(JSON.stringify(data)));
  docBusca.value = '';
  contatoSel.value = '';
  enderecoSel.value = '';
  representanteSel.value = '';
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function onDocSelect(v: string) {
  if (credoraPadrao.value) return;
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (found) {
    Object.assign(form.value, JSON.parse(JSON.stringify(found)));
    contatoSel.value = found.contatos?.[0] ?? '';
    enderecoSel.value = found.enderecos?.[0] ?? '';
  } else {
    form.value = emptyPessoaMinuta('JURIDICA');
  }
}

function limparCredoraPadrao() {
  credoraPadrao.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Selecione a credora padrão"
        :options="padraoOptions"
        placeholder="Selecione"
        :span="4"
        v-model="credoraPadrao"
      />
      <SelectField
        label="Insira o doc. do cliente"
        :options="DOC_OPTS"
        placeholder="Selecione"
        :span="5"
        :model-value="docBusca"
        :disabled="modoCredoraPadrao"
        @update:model-value="onDocSelect"
      />
      <SelectField
        v-if="modoCliente"
        label="Contato do cliente"
        :options="contatoOpts"
        placeholder="Selecione"
        :span="3"
        v-model="contatoSel"
      />
      <SelectField
        v-else-if="modoCredoraPadrao"
        label="Natureza"
        :options="NATUREZA_OPTS"
        :span="3"
        v-model="natureza"
      />
    </StepGrid>

    <template v-if="modoCliente">
      <StepGrid>
        <SelectField label="Endereço do cliente" :options="enderecoOpts" placeholder="Selecione" :span="6" v-model="enderecoSel" />
        <SelectField label="Representante legal do cliente" :options="representanteOpts" placeholder="Selecione" :span="6" v-model="representanteSel" />
      </StepGrid>
    </template>

    <template v-else-if="camposHabilitados">
      <template v-if="form.tipoPessoa === 'FISICA'">
        <StepGrid>
          <FormField label="CPF" placeholder="—" required :span="3" v-model="form.cpf!" />
          <FormField label="Nome completo" placeholder="—" required :span="5" v-model="form.nome" />
          <FormField label="RG" placeholder="—" :span="2" v-model="form.rg!" />
          <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" v-model="form.orgaoEmissorRg!" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" v-model="form.nacionalidade!" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
          <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" v-model="form.estadoCivil!" />
        </StepGrid>
        <SpouseFields
          v-if="estadoCivilExigeConjuge(form.estadoCivil)"
          :model-value="form.conjuge ?? emptyConjugeMinuta()"
          @update:model-value="form.conjuge = $event"
        />
      </template>
      <template v-else>
        <StepGrid>
          <FormField label="CNPJ" placeholder="—" :span="4" v-model="form.cnpj!" />
          <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
          <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
          <FormField label="Data de abertura" placeholder="—" :span="3" v-model="form.dataAbertura!" />
          <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa!" />
          <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte!" />
          <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal!" />
          <FormField label="Natureza jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica!" />
          <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal!" />
          <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual!" />
        </StepGrid>

        <BentoBox :title="repLabel" :icon="User">
          <StepGrid>
            <FormField label="CPF" placeholder="—" :span="3" v-model="form.representante!.cpf" />
            <FormField label="Nome" placeholder="—" :span="5" v-model="form.representante!.nome" />
            <FormField label="RG" placeholder="—" :span="4" v-model="form.representante!.rg" />
            <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.representante!.inscricaoProdutorRural" />
            <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.representante!.nacionalidade" />
            <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.representante!.dataNascimento" />
            <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
          </StepGrid>
        </BentoBox>
      </template>

      <StepGrid>
        <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="!form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais!" />
      </StepGrid>
    </template>

    <button
      v-if="modoCredoraPadrao"
      type="button"
      style="
        align-self: flex-start;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: var(--text-xs);
        font-weight: var(--weight-semibold);
        text-decoration: underline;
      "
      @click="limparCredoraPadrao"
    >
      Limpar credora padrão
    </button>
  </div>
</template>
```

### EmitenteStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin, User, Trash2, Users } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const props = withDefaults(
  defineProps<{ apenasPessoaJuridica?: boolean; maxEmitentes?: number }>(),
  { apenasPessoaJuridica: false, maxEmitentes: undefined },
);

const emitentes = defineModel<PessoaMinuta[]>('emitentes', { default: () => [] });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const atingiuLimite = computed(
  () => props.maxEmitentes != null && emitentes.value.length >= props.maxEmitentes,
);

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    if (props.apenasPessoaJuridica) return;
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

watch(
  () => props.apenasPessoaJuridica,
  (v) => {
    if (v && form.value.tipoPessoa !== 'JURIDICA') {
      form.value = emptyPessoaMinuta('JURIDICA');
    }
  },
  { immediate: true },
);

watch(docBusca, (v) => {
  const found = buscarClientePorDoc(v);
  if (!found) return;
  if (props.apenasPessoaJuridica && found.tipoPessoa !== 'JURIDICA') return;
  Object.assign(form.value, JSON.parse(JSON.stringify(found)));
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function addEmitente() {
  const nome = form.value.tipoPessoa === 'FISICA' ? form.value.nome || form.value.cpf : form.value.razaoSocial || form.value.nomeFantasia;
  const doc = form.value.tipoPessoa === 'FISICA' ? form.value.cpf || form.value.documento : form.value.cnpj || form.value.documento;
  if (!nome || !doc) return;
  form.value.documento = doc;
  form.value.nome = nome;
  emitentes.value = [...emitentes.value, JSON.parse(JSON.stringify(form.value))];
  form.value = emptyPessoaMinuta(form.value.tipoPessoa);
  docBusca.value = '';
}

function removeEmitente(i: number) {
  emitentes.value = emitentes.value.filter((_, idx) => idx !== i);
}

const DOC_OPTS = [
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  '144.112.938-38 - MARCELO TARTARO',
  '56.025.302/0001-79 - CERES TRADING E INVESTIMENTOS S.A.',
];

function onDocSelect(v: string) {
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (!found) return;
  if (props.apenasPessoaJuridica && found.tipoPessoa !== 'JURIDICA') return;
  Object.assign(form.value, JSON.parse(JSON.stringify(found)));
}

const docOptsFiltrados = computed(() =>
  props.apenasPessoaJuridica
    ? DOC_OPTS.filter((o) => !o.includes('144.112.938-38'))
    : DOC_OPTS,
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <template v-if="!atingiuLimite">
      <StepGrid>
        <SelectField
          label="Insira o doc. do cliente"
          :options="docOptsFiltrados"
          placeholder="Selecione"
          :span="apenasPessoaJuridica ? 12 : 7"
          :model-value="docBusca"
          @update:model-value="onDocSelect"
        />
        <SelectField
          v-if="!apenasPessoaJuridica"
          label="Natureza"
          :options="NATUREZA_OPTS"
          :span="5"
          v-model="natureza"
        />
      </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="000.000.000-00" required :span="3" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="5" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="2" v-model="form.rg!" />
        <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" v-model="form.orgaoEmissorRg!" />
        <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
        <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" v-model="form.nacionalidade!" />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
        <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" v-model="form.estadoCivil!" />
        <FormField label="E-mail do representante" placeholder="—" :span="4" v-model="form.emailRepresentante!" />
      </StepGrid>
      <SpouseFields
        v-if="estadoCivilExigeConjuge(form.estadoCivil)"
        :model-value="form.conjuge ?? emptyConjugeMinuta()"
        @update:model-value="form.conjuge = $event"
      />
    </template>
    <template v-else>
      <StepGrid>
        <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" v-model="form.cnpj!" />
        <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
        <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
        <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="3" v-model="form.dataAbertura!" />
        <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa!" />
        <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte!" />
        <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal!" />
        <FormField label="Natureza jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica!" />
        <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal!" />
        <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual!" />
      </StepGrid>

      <BentoBox title="Representante Legal" :icon="User">
        <StepGrid>
          <FormField label="CPF" placeholder="—" :span="3" v-model="form.representante!.cpf" />
          <FormField label="Nome" placeholder="—" :span="5" v-model="form.representante!.nome" />
          <FormField label="RG" placeholder="—" :span="4" v-model="form.representante!.rg" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.representante!.inscricaoProdutorRural" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.representante!.nacionalidade" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.representante!.dataNascimento" />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
        </StepGrid>
      </BentoBox>
    </template>

    <BentoBox title="Contato" :icon="Mail">
      <StepGrid>
        <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Endereço" :icon="MapPin">
      <StepGrid>
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="!form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais!" />
      </StepGrid>
    </BentoBox>

    <div class="flex justify-end">
      <AddButton @click="addEmitente">Adicionar emitente</AddButton>
    </div>
    </template>

    <div
      v-if="atingiuLimite"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        font-size: var(--text-sm);
        color: var(--text-muted);
      "
    >
      Limite de 1 emissora atingido para Nota Comercial. Remova a emissora atual para adicionar outra.
    </div>

    <EmptyState
      v-if="emitentes.length === 0"
      :icon="Users"
      title="Nenhum emitente adicionado"
      hint="Preencha os dados acima e clique em Adicionar emitente."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.6fr 1.2fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Nome / Razão Social</div>
        <div>CPF / CNPJ</div>
        <div />
      </div>
      <div
        v-for="(e, i) in emitentes"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1.6fr 1.2fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.documento }}</div>
        <button
          aria-label="Remover"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; color: var(--danger-base)"
          @click="removeEmitente(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### EndossatarioStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  ENDOSSATARIO_PADRAO_OPTS,
  CREDORAS_PADRAO,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const endossatarioPadrao = defineModel<string>('endossatarioPadrao', { default: '' });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });
const contatoSel = defineModel<string>('contato', { default: '' });
const enderecoSel = defineModel<string>('endereco', { default: '' });
const representanteSel = defineModel<string>('representante', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const modoPadrao = computed(() => !!endossatarioPadrao.value);
const modoCliente = computed(() => !!docBusca.value && !endossatarioPadrao.value);
const camposHabilitados = computed(() => modoPadrao.value || modoCliente.value);

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const DOC_OPTS = [
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  '56.025.302/0001-79 - CERES TRADING E INVESTIMENTOS S.A.',
  '32.987.654/0001-10 - CERES SECURITIZADORA S.A.',
];

const contatoOpts = computed(() => form.value.contatos ?? []);
const enderecoOpts = computed(() => form.value.enderecos ?? []);
const representanteOpts = computed(() => form.value.representantes ?? []);

watch(endossatarioPadrao, (v) => {
  if (!v) return;
  const data = CREDORAS_PADRAO[v];
  if (!data) return;
  Object.assign(form.value, JSON.parse(JSON.stringify(data)));
  docBusca.value = '';
  contatoSel.value = '';
  enderecoSel.value = '';
  representanteSel.value = '';
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function onDocSelect(v: string) {
  if (endossatarioPadrao.value) return;
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (found) {
    Object.assign(form.value, JSON.parse(JSON.stringify(found)));
    contatoSel.value = found.contatos?.[0] ?? '';
    enderecoSel.value = found.enderecos?.[0] ?? '';
  } else {
    form.value = emptyPessoaMinuta('JURIDICA');
  }
}

function limparPadrao() {
  endossatarioPadrao.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Selecione o endossatário padrão"
        :options="ENDOSSATARIO_PADRAO_OPTS"
        placeholder="Selecione"
        :span="4"
        v-model="endossatarioPadrao"
      />
      <SelectField
        label="Insira o doc. do cliente"
        :options="DOC_OPTS"
        placeholder="Selecione"
        :span="5"
        :model-value="docBusca"
        :disabled="modoPadrao"
        @update:model-value="onDocSelect"
      />
      <SelectField
        v-if="modoCliente"
        label="Contato do cliente"
        :options="contatoOpts"
        placeholder="Selecione"
        :span="3"
        v-model="contatoSel"
      />
      <SelectField
        v-else-if="modoPadrao"
        label="Natureza"
        :options="NATUREZA_OPTS"
        :span="3"
        v-model="natureza"
      />
    </StepGrid>

    <template v-if="modoCliente">
      <StepGrid>
        <SelectField label="Endereço do cliente" :options="enderecoOpts" placeholder="Selecione" :span="6" v-model="enderecoSel" />
        <SelectField label="Representante legal do cliente" :options="representanteOpts" placeholder="Selecione" :span="6" v-model="representanteSel" />
      </StepGrid>
    </template>

    <template v-else-if="camposHabilitados">
      <template v-if="form.tipoPessoa === 'FISICA'">
        <StepGrid>
          <FormField label="CPF" placeholder="—" required :span="3" v-model="form.cpf!" />
          <FormField label="Nome completo" placeholder="—" required :span="5" v-model="form.nome" />
          <FormField label="RG" placeholder="—" :span="2" v-model="form.rg!" />
          <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" v-model="form.orgaoEmissorRg!" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" v-model="form.nacionalidade!" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
          <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" v-model="form.estadoCivil!" />
        </StepGrid>
        <SpouseFields
          v-if="estadoCivilExigeConjuge(form.estadoCivil)"
          :model-value="form.conjuge ?? emptyConjugeMinuta()"
          @update:model-value="form.conjuge = $event"
        />
      </template>
      <template v-else>
        <StepGrid>
          <FormField label="CNPJ" placeholder="—" :span="4" v-model="form.cnpj!" />
          <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
          <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
          <FormField label="Data de abertura" placeholder="—" :span="3" v-model="form.dataAbertura!" />
          <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa!" />
          <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte!" />
          <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal!" />
          <FormField label="Natureza jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica!" />
          <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal!" />
          <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual!" />
        </StepGrid>

        <BentoBox title="Representante Legal" :icon="User">
          <StepGrid>
            <FormField label="CPF" placeholder="—" :span="3" v-model="form.representante!.cpf" />
            <FormField label="Nome" placeholder="—" :span="5" v-model="form.representante!.nome" />
            <FormField label="RG" placeholder="—" :span="4" v-model="form.representante!.rg" />
            <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.representante!.inscricaoProdutorRural" />
            <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.representante!.nacionalidade" />
            <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.representante!.dataNascimento" />
            <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
          </StepGrid>
        </BentoBox>
      </template>

      <StepGrid>
        <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="!form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais!" />
      </StepGrid>
    </template>

    <button
      v-if="modoPadrao"
      type="button"
      style="
        align-self: flex-start;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: var(--text-xs);
        font-weight: var(--weight-semibold);
        text-decoration: underline;
      "
      @click="limparPadrao"
    >
      Limpar endossatário padrão
    </button>
  </div>
</template>
```

### AvalistaStep

```vue
<script setup lang="ts">
import { Check, Plus, X } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { ToggleRow, AddButton } from '../adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import type { AvalistaMinutaRow } from '../../../data/minutaData';

const props = defineProps<{
  possuiAvalistas: boolean;
  rows: AvalistaMinutaRow[];
}>();
const emit = defineEmits<{
  togglePossui: [];
  toggleAssinatura: [i: number];
  toggleConjuge: [i: number];
  addAvalista: [];
}>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <ToggleRow label="Possui avalistas" :on="possuiAvalistas" @toggle="emit('togglePossui')" />
      </div>
      <AddButton v-if="possuiAvalistas" @click="emit('addAvalista')">
        <Plus :size="14" /> Adicionar novo avalista
      </AddButton>
    </div>

    <template v-if="possuiAvalistas">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div />
          <div>Nome</div>
          <div>Documento</div>
          <div>Possui cônjuge</div>
          <div>Cônjuge é interveniente anuente</div>
        </div>
        <div
          v-for="(r, pageIdx) in pageItems"
          :key="r.documento"
          class="grid items-center"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <Checkbox :checked="r.selecionadoAssinatura" @change="emit('toggleAssinatura', globalIndex(pageIdx))" />
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ r.documento }}</div>
          <div class="flex items-center" style="color: r.possuiConjuge ? 'var(--success-base)' : 'var(--danger-base)'">
            <Check v-if="r.possuiConjuge" :size="16" style="color: var(--success-base)" />
            <X v-else :size="16" style="color: var(--danger-base)" />
          </div>
          <div>
            <Checkbox
              :checked="r.conjugeInterveniente"
              :disabled="!r.possuiConjuge"
              @change="r.possuiConjuge && emit('toggleConjuge', globalIndex(pageIdx))"
            />
          </div>
        </div>
        <div
          v-if="rows.length === 0"
          style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
        >
          Nenhum avalista cadastrado nesta solicitação.
        </div>
        <TablePagination
          v-if="rows.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>
  </div>
</template>
```

### EscrituradorStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  ESCRITURADOR_PADRAO_OPTS,
  ESCRITURADORES_PADRAO,
  emptyPessoaMinuta,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';

const escrituradorPadrao = defineModel<string>('escrituradorPadrao', { default: '' });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);

const modoPadrao = computed(() => !!escrituradorPadrao.value);
const camposHabilitados = computed(() => modoPadrao.value || !!docBusca.value);
const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const DOC_OPTS = [
  '22.610.500/0001-88 - VÓRTX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
  '15.444.333/0001-22 - BMP MONEY PLUS SOCIEDADE DE CRÉDITO DIRETO S.A.',
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
];

watch(escrituradorPadrao, (v) => {
  if (!v) return;
  const data = ESCRITURADORES_PADRAO[v];
  if (!data) return;
  Object.assign(form.value, JSON.parse(JSON.stringify(data)));
  docBusca.value = '';
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function onDocSelect(v: string) {
  if (escrituradorPadrao.value) return;
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (found) {
    Object.assign(form.value, JSON.parse(JSON.stringify(found)));
  } else {
    form.value = emptyPessoaMinuta('JURIDICA');
  }
}

function limparPadrao() {
  escrituradorPadrao.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Selecione o escriturador padrão"
        :options="ESCRITURADOR_PADRAO_OPTS"
        placeholder="Selecione"
        :span="5"
        v-model="escrituradorPadrao"
      />
      <SelectField
        label="Insira o doc. do cliente"
        :options="DOC_OPTS"
        placeholder="Selecione"
        :span="7"
        :model-value="docBusca"
        :disabled="modoPadrao"
        @update:model-value="onDocSelect"
      />
    </StepGrid>

    <template v-if="camposHabilitados">
      <StepGrid>
        <FormField label="CNPJ" placeholder="—" :span="4" v-model="form.cnpj!" />
        <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
        <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
        <FormField label="Data de abertura" placeholder="—" :span="3" v-model="form.dataAbertura!" />
        <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa!" />
        <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte!" />
        <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal!" />
        <FormField label="Natureza jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica!" />
        <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal!" />
        <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual!" />
      </StepGrid>

      <BentoBox title="Contato" :icon="Mail">
        <StepGrid>
          <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
          <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
          <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
        </StepGrid>
      </BentoBox>

      <BentoBox title="Endereço" :icon="MapPin">
        <StepGrid>
          <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep!" />
          <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade!" />
          <FormField label="Número" placeholder="—" :span="3" v-model="form.numero!" />
          <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro!" />
          <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais!" />
          <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado!" />
          <SelectField
            label="Cidade"
            :options="cidadeOpts"
            placeholder="Selecione"
            :span="5"
            :disabled="!form.estado"
            v-model="form.cidade!"
          />
          <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais!" />
        </StepGrid>
      </BentoBox>
    </template>

    <button
      v-if="modoPadrao"
      type="button"
      style="
        align-self: flex-start;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: var(--text-xs);
        font-weight: var(--weight-semibold);
        text-decoration: underline;
      "
      @click="limparPadrao"
    >
      Limpar escriturador padrão
    </button>
  </div>
</template>
```

### ProdutoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Trash2, Package } from 'lucide-vue-next';
import { UF_OPTIONS, brl } from '../../../data/operacaoData';
import { StepGrid, FormField, SelectField, AddButton, EmptyState } from '../adicionar-contrato';
import {
  PRODUTO_TIPO_OPTS,
  UNIDADE_MEDIDA_OPTS,
  cidadesDaUf,
  emptyProdutoMinuta,
  type ProdutoMinuta,
} from '../../../data/minutaData';

const produtos = defineModel<ProdutoMinuta[]>('produtos', { default: () => [] });
const form = defineModel<ProdutoMinuta>('form', { required: true });

const cidadeProducaoOpts = computed(() => cidadesDaUf(form.value.estadoProducao));
const cidadeRegistroOpts = computed(() => cidadesDaUf(form.value.ufRegistro));
const ufOpts = computed(() => ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)));

watch(
  () => form.value.estadoProducao,
  () => {
    if (form.value.cidadeProducao && !cidadeProducaoOpts.value.includes(form.value.cidadeProducao)) {
      form.value.cidadeProducao = '';
    }
  },
);
watch(
  () => form.value.ufRegistro,
  () => {
    if (form.value.cidadeRegistro && !cidadeRegistroOpts.value.includes(form.value.cidadeRegistro)) {
      form.value.cidadeRegistro = '';
    }
  },
);

function addProduto() {
  if (!form.value.tipo) return;
  produtos.value = [...produtos.value, { ...form.value }];
  form.value = emptyProdutoMinuta();
}

function removeProduto(i: number) {
  produtos.value = produtos.value.filter((_, idx) => idx !== i);
}

function fmtValor(v: string) {
  const n = Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? brl(n) : v || '—';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField label="Tipo" :options="PRODUTO_TIPO_OPTS" placeholder="Selecione" :span="3" v-model="form.tipo" />
      <SelectField label="Unidade de medida" :options="UNIDADE_MEDIDA_OPTS" placeholder="Selecione" :span="3" v-model="form.unidadeMedida" />
      <FormField label="Valor unitário" placeholder="R$ 0,00" currency :span="3" v-model="form.valorUnitario" />
      <FormField label="Quantidade" placeholder="—" :span="3" v-model="form.quantidade" />
      <FormField label="Safra" placeholder="2025/2026" :span="3" v-model="form.safra" />
      <FormField label="Local de produção" placeholder="—" :span="3" v-model="form.localProducao" />
      <SelectField label="Estado de produção" :options="ufOpts" placeholder="UF" :span="3" v-model="form.estadoProducao" />
      <SelectField
        label="Cidade de produção"
        :options="cidadeProducaoOpts"
        placeholder="Selecione"
        :span="3"
        :disabled="!form.estadoProducao"
        v-model="form.cidadeProducao"
      />
      <FormField label="Nº da matrícula" placeholder="—" :span="4" v-model="form.matricula" />
      <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
      <SelectField
        label="Cidade de registro"
        :options="cidadeRegistroOpts"
        placeholder="Selecione"
        :span="4"
        :disabled="!form.ufRegistro"
        v-model="form.cidadeRegistro"
      />
    </StepGrid>

    <div class="flex justify-end">
      <AddButton @click="addProduto">Adicionar produto</AddButton>
    </div>

    <EmptyState
      v-if="produtos.length === 0"
      :icon="Package"
      title="Nenhum produto adicionado"
      hint="Preencha os campos acima e clique em Adicionar produto."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Valor unitário</div>
        <div>Quantidade</div>
        <div>Safra</div>
        <div />
      </div>
      <div
        v-for="(p, i) in produtos"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipo }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ fmtValor(p.valorUnitario) }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ p.quantidade || '—' }}</div>
        <div>{{ p.safra || '—' }}</div>
        <button
          aria-label="Remover"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
          @click="removeProduto(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### TituloMinutaStep

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Tag, CalendarClock, Trash2, Handshake } from 'lucide-vue-next';
import { brl, UF_OPTIONS, PAISES_DDI, type ParcelaAtivo } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  MOCK_CLIENTES_MINUTA,
  cidadesDaUf,
  CESSAO_TIPO_OPTS,
  CESSAO_PARAM_OPTS,
  CESSAO_TIPO_CALCULO_OPTS,
  CESSAO_FREQUENCIA_OPTS,
  CESSAO_OPERADOR_OPTS,
  CESSAO_INDICADOR_OPTS,
  CESSAO_CAPITALIZACAO_OPTS,
  CESSAO_BASE_DIAS_OPTS,
  CESSAO_INICIO_JUROS_OPTS,
  CESSAO_DATA_ACCRUAL_OPTS,
  type TituloMinutaForm,
} from '../../../data/minutaData';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
}>();

const form = defineModel<TituloMinutaForm>({ required: true });
const cronograma = defineModel<ParcelaAtivo[]>('cronograma', { default: () => [] });

const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const DOC_CEDENTE_OPTS = MOCK_CLIENTES_MINUTA.map((c) => `${c.documento} - ${c.nome}`);

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado));
const pagamentoForm = reactive({ amortizacao: '', vencimento: '', pagarJuros: false, valorJuros: '' });
const somatoriaAmortizacao = computed(() => cronograma.value.reduce((acc, c) => acc + (Number(c.amortizacao) || 0), 0));

const isPosFixado = computed(() => {
  const t = (props.tipoCalculo || '').toLowerCase();
  return t.includes('pós') || t.includes('pos');
});

const isPersonalizado = computed(() => form.value.cessao.parametrizacaoCalculo === 'Personalizado');

const conversaoLabel = computed(() =>
  form.value.cessao.conversaoIndice
    ? 'Conversão de índice: forçar base 360'
    : 'Conversão de índice: usar última taxa disponível',
);

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

/** Watchers do legado: pré/pós-fixado afetam cronograma */
watch(
  isPosFixado,
  (pos) => {
    if (pos) {
      form.value.possuiCronograma = true;
      form.value.cessao.indicadorTaxa = '';
      form.value.cessao.operador = '';
    } else {
      form.value.possuiCronograma = false;
      form.value.cessao.indicadorTaxa = 'Indefinido';
    }
  },
  { immediate: true },
);

/** Preset de parametrização sobrescreve campos; Personalizado libera edição */
watch(
  () => form.value.cessao.parametrizacaoCalculo,
  (param) => {
    if (!param || param === 'Personalizado') return;
    const pos = param.toLowerCase().includes('pós') || param.toLowerCase().includes('pos');
    form.value.cessao.frequenciaTaxa = pos ? 'Diário' : 'Mensal';
    form.value.cessao.tipoCapitalizacao = pos ? 'Composto' : 'Simples';
    form.value.cessao.baseDias = pos ? '252' : '360';
    form.value.cessao.inicioContagemJuros = 'D0';
    form.value.cessao.dataAccrual = 'Data da cessão/desembolso';
    form.value.cessao.usarCalculoUra = param.startsWith('URA');
    form.value.cessao.indicadorTaxa = pos ? 'CDI' : 'Indefinido';
    form.value.cessao.operador = pos ? 'Multiplicativo' : '';
  },
);

function addPagamento() {
  if (!pagamentoForm.vencimento) return;
  cronograma.value = [
    ...cronograma.value,
    {
      parcela: `${cronograma.value.length + 1}ª Parcela`,
      vencimento: pagamentoForm.vencimento,
      amortizacao: Number(pagamentoForm.amortizacao) || 0,
      juros: pagamentoForm.pagarJuros ? Number(pagamentoForm.valorJuros) || 0 : 0,
      pagarJuros: pagamentoForm.pagarJuros,
    },
  ];
  pagamentoForm.amortizacao = '';
  pagamentoForm.vencimento = '';
  pagamentoForm.pagarJuros = false;
  pagamentoForm.valorJuros = '';
}

function removePagamento(i: number) {
  cronograma.value = cronograma.value.filter((_, idx) => idx !== i);
}

function gerarPagamentosAutomaticos() {
  if (!form.value.fluxoAmortizacao || !form.value.fluxoJuros) return;
  const base = props.valorOperacao > 0 ? props.valorOperacao / 2 : 50_000;
  cronograma.value = [
    { parcela: '1ª Parcela', vencimento: '30/07/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
    { parcela: '2ª Parcela', vencimento: '30/08/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
  ];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <BentoBox title="Dados do Título" :icon="Tag">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Valor total" :model-value="brl(valorOperacao)" disabled :span="3" />
          <SelectField label="Tipo de cálculo" :options="[tipoCalculo]" :model-value="tipoCalculo" disabled :span="3" />
          <div style="grid-column: span 3; align-self: end">
            <ToggleRow
              :label="form.tipoValorLiquido ? 'Tipo de valor: LÍQUIDO' : 'Tipo de valor: NOMINAL'"
              :on="form.tipoValorLiquido"
              compact
              @toggle="form.tipoValorLiquido = !form.tipoValorLiquido"
            />
          </div>
          <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
          <SelectField label="Tipo" :options="[form.tipo]" :model-value="form.tipo" disabled :span="3" />
          <FormField label="Emissão" placeholder="dd/mm/aaaa" required :span="3" v-model="form.emissao" />
          <FormField label="Vencimento" placeholder="dd/mm/aaaa" required :span="3" v-model="form.vencimento" />
          <FormField label="Chave da nota" placeholder="—" :span="3" v-model="form.chaveNota" />
          <SelectField
            label="Insira o doc. da cedente"
            :options="DOC_CEDENTE_OPTS"
            placeholder="Selecione"
            required
            :span="6"
            v-model="form.docCedente"
          />
          <div style="grid-column: span 6; align-self: end">
            <ToggleRow
              label="Gerar operação no módulo de garantias"
              :on="form.gerarOperacaoGarantias"
              compact
              @toggle="form.gerarOperacaoGarantias = !form.gerarOperacaoGarantias"
            />
          </div>
        </StepGrid>
      </div>
    </BentoBox>

    <BentoBox title="Dados da cessão" :icon="Handshake">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Nome" placeholder="—" required :span="5" v-model="form.cessao.nome" />
          <FormField label="Data do desembolso" placeholder="dd/mm/aaaa" required :span="4" v-model="form.cessao.dataDesembolso" />
          <FormField label="Taxa da cessão (%)" placeholder="0,00" required :span="3" v-model="form.cessao.taxaCessao" />
          <SelectField label="Tipo" :options="CESSAO_TIPO_OPTS" placeholder="Selecione" required :span="4" v-model="form.cessao.tipo" />
          <SelectField
            label="Parametrização de cálculo"
            :options="CESSAO_PARAM_OPTS"
            placeholder="Selecione"
            required
            :span="5"
            v-model="form.cessao.parametrizacaoCalculo"
          />
          <SelectField
            label="Tipo de cálculo"
            :options="CESSAO_TIPO_CALCULO_OPTS"
            placeholder="Selecione"
            required
            :span="3"
            v-model="form.cessao.tipoCalculoCessao"
          />
          <FormField label="% em garantia de recebíveis" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaRecebiveis" />
          <FormField label="% em garantia de outras garantias" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaOutras" />
          <FormField label="Desconto adicional (%)" placeholder="0" :span="4" v-model="form.cessao.descontoAdicional" />
          <FormField label="Taxa de multa (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMulta" />
          <FormField label="Taxa de mora (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMora" />
        </StepGrid>

        <ToggleRow
          label="Usar cálculo URA / de mercado"
          :on="form.cessao.usarCalculoUra"
          :disabled="!isPersonalizado && !!form.cessao.parametrizacaoCalculo"
          @toggle="form.cessao.usarCalculoUra = !form.cessao.usarCalculoUra"
        />

        <StepGrid v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <SelectField
            label="Frequência da taxa"
            :options="CESSAO_FREQUENCIA_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.frequenciaTaxa"
          />
          <SelectField
            label="Operador"
            :options="CESSAO_OPERADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado || !isPosFixado"
            v-model="form.cessao.operador"
          />
          <SelectField
            label="Indicador da taxa"
            :options="CESSAO_INDICADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.indicadorTaxa"
          />
          <SelectField
            label="Tipo de capitalização"
            :options="CESSAO_CAPITALIZACAO_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.tipoCapitalizacao"
          />
          <SelectField
            label="Base de dias"
            :options="CESSAO_BASE_DIAS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.baseDias"
          />
          <SelectField
            label="Início da contagem de juros"
            :options="CESSAO_INICIO_JUROS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.inicioContagemJuros"
          />
          <SelectField
            label="Data usada para Accrual"
            :options="CESSAO_DATA_ACCRUAL_OPTS"
            placeholder="Selecione"
            :span="6"
            :disabled="!isPersonalizado"
            v-model="form.cessao.dataAccrual"
          />
        </StepGrid>

        <template v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <ToggleRow
            label="Usar certificador de e-mail"
            :on="form.cessao.usarCertificadorEmail"
            @toggle="form.cessao.usarCertificadorEmail = !form.cessao.usarCertificadorEmail"
          />
          <ToggleRow
            :label="conversaoLabel"
            :on="form.cessao.conversaoIndice"
            @toggle="form.cessao.conversaoIndice = !form.cessao.conversaoIndice"
          />
        </template>
      </div>
    </BentoBox>

    <ToggleRow
      label="Possui cronograma de pagamentos"
      :on="form.possuiCronograma"
      :disabled="isPosFixado"
      @toggle="!isPosFixado && (form.possuiCronograma = !form.possuiCronograma)"
    />

    <BentoBox v-if="form.possuiCronograma" title="Cronograma de Pagamentos" :icon="Tag">
      <div class="flex flex-col" style="gap: 14px">
        <ToggleRow
          label="Gerar pagamentos automaticamente"
          :on="form.cronogramaAutomatico"
          compact
          @toggle="form.cronogramaAutomatico = !form.cronogramaAutomatico"
        />

        <div v-if="form.cronogramaAutomatico" class="grid items-end" style="grid-template-columns: 1fr 1fr auto; gap: 12px">
          <SelectField label="Fluxo de Amortização" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoAmortizacao" />
          <SelectField label="Fluxo de pagamento de juros" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoJuros" />
          <AddButton @click="gerarPagamentosAutomaticos">Gerar pagamentos</AddButton>
        </div>
        <div v-else class="grid items-end" style="grid-template-columns: 1fr 1fr auto auto auto; gap: 12px">
          <FormField label="Amortização" placeholder="R$ 0,00" currency v-model="pagamentoForm.amortizacao" />
          <FormField label="Vencimento" placeholder="dd/mm/aaaa" required v-model="pagamentoForm.vencimento" />
          <ToggleRow label="Pagar juros" :on="pagamentoForm.pagarJuros" compact @toggle="pagamentoForm.pagarJuros = !pagamentoForm.pagarJuros" />
          <FormField
            label="Valor do juros"
            placeholder="R$ 0,00"
            currency
            v-model="pagamentoForm.valorJuros"
            :disabled="!pagamentoForm.pagarJuros || isPosFixado"
          />
          <AddButton @click="addPagamento">Adicionar pagamento</AddButton>
        </div>

        <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--danger-base)">
          Obs: Em títulos pré-fixados, caso o cronograma mostre pagamento de juros com valor de R$ 0,00, será considerado o valor de juros projetado na simulação.
        </div>

        <EmptyState
          v-if="cronograma.length === 0"
          :icon="CalendarClock"
          title="Nenhum pagamento adicionado ao cronograma"
          hint="Use o formulário acima para adicionar pagamentos manualmente ou gere automaticamente pelo fluxo selecionado."
        />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div
            class="grid"
            style="
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
              padding: 10px 14px;
              background: var(--surface-card);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Parcela</div>
            <div>Vencimento</div>
            <div>Amortização</div>
            <div>Juros</div>
            <div>Pagar juros</div>
            <div />
          </div>
          <div
            v-for="(c, i) in cronograma"
            :key="i"
            class="grid items-center"
            style="
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
              padding: 10px 14px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.parcela }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ c.vencimento }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(c.amortizacao ?? 0) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(c.juros ?? 0) }}</div>
            <div>{{ c.pagarJuros ? 'Sim' : 'Não' }}</div>
            <button
              aria-label="Remover"
              class="flex items-center justify-center"
              style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--text-muted)"
              @click="removePagamento(i)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <div
            class="flex items-center justify-center"
            style="padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
          >
            Amortização: {{ brl(somatoriaAmortizacao) }}
          </div>
        </div>
      </div>
    </BentoBox>

    <BentoBox title="Dados do Sacado" :icon="Tag">
      <StepGrid>
        <FormField label="CPF/CNPJ" placeholder="—" :span="4" v-model="form.sacadoDocumento" />
        <FormField label="Nome" placeholder="—" :span="5" v-model="form.sacadoNome" />
        <FormField label="E-mail" placeholder="—" :span="3" v-model="form.sacadoEmail" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="2" v-model="form.ddi" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone" />
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numeroEndereco" />
        <FormField label="Endereço" placeholder="—" :span="6" v-model="form.endereco" />
        <FormField label="Complemento" placeholder="—" :span="6" v-model="form.complemento" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="2" v-model="form.estado" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="4"
          :disabled="!form.estado"
          v-model="form.cidade"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="2" v-model="form.pais" />
      </StepGrid>
    </BentoBox>
  </div>
</template>
```

### GarantiaMinutaStep

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X, Trash2, Shield, Home, Scale } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  TIPO_GARANTIA_MINUTA_OPTS,
  FORMA_PRODUTO_GARANTIA_OPTS,
  ZONA_OPTS,
  TIPO_IMOVEL_OPTS,
  TIPO_LOCACAO_OPTS,
  UNIDADE_MEDIDA_OPTS,
  PERIODICIDADE_RELATORIO_OPTS,
  cidadesDaUf,
  emptyGarantiaMinuta,
  isGarantiaEstoque,
  isGarantiaComFormaProduto,
  type GarantiaMinuta,
  type EstoqueItem,
} from '../../../data/minutaData';

const garantias = defineModel<GarantiaMinuta[]>('garantias', { default: () => [] });

const possuiGarantias = ref(true);
const showNova = ref(false);
const editingIndex = ref<number | null>(null);
const form = reactive<GarantiaMinuta>(emptyGarantiaMinuta());
const estoqueDraft = reactive({ propriedade: '', proprietario: '' });

const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];
const ufOpts = computed(() => ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)));
const cidadeRegistroOpts = computed(() => cidadesDaUf(form.ufRegistro));
const cidadeEnderecoOpts = computed(() => cidadesDaUf(form.estado));
const showEstoque = computed(() => isGarantiaEstoque(form.tipo));
const showFormaProduto = computed(() => isGarantiaComFormaProduto(form.tipo));

const naturezaLocado = computed({
  get: () => (form.tipoPessoaLocado === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoaLocado = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});
const naturezaProprietario = computed({
  get: () => (form.tipoPessoaProprietario === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoaProprietario = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

watch(
  () => form.ufRegistro,
  () => {
    if (form.cidadeRegistro && !cidadeRegistroOpts.value.includes(form.cidadeRegistro)) {
      form.cidadeRegistro = '';
    }
  },
);
watch(
  () => form.estado,
  () => {
    if (form.cidade && !cidadeEnderecoOpts.value.includes(form.cidade)) {
      form.cidade = '';
    }
  },
);

function openNova() {
  editingIndex.value = null;
  Object.assign(form, emptyGarantiaMinuta());
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
  showNova.value = true;
}

function openEdit(i: number) {
  editingIndex.value = i;
  Object.assign(form, JSON.parse(JSON.stringify(garantias.value[i])));
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
  showNova.value = true;
}

function addEstoque() {
  if (!estoqueDraft.propriedade && !form.nomeImovel) return;
  const item: EstoqueItem = {
    propriedade: estoqueDraft.propriedade || form.nomeImovel,
    proprietario: estoqueDraft.proprietario || form.nomeContratante || '—',
  };
  form.estoques.push(item);
  estoqueDraft.propriedade = '';
  estoqueDraft.proprietario = '';
}

function removeEstoque(i: number) {
  form.estoques.splice(i, 1);
}

function cadastrar() {
  if (!form.tipo || !form.valor) return;
  const payload = JSON.parse(JSON.stringify(form)) as GarantiaMinuta;
  if (editingIndex.value != null) {
    const next = [...garantias.value];
    next[editingIndex.value] = payload;
    garantias.value = next;
  } else {
    garantias.value = [...garantias.value, payload];
  }
  showNova.value = false;
  editingIndex.value = null;
}

function removeGarantia(i: number) {
  garantias.value = garantias.value.filter((_, idx) => idx !== i);
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => garantias.value,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <ToggleRow label="Possui garantias" :on="possuiGarantias" @toggle="possuiGarantias = !possuiGarantias" />
      </div>
      <AddButton v-if="possuiGarantias" @click="openNova">Adicionar garantia</AddButton>
    </div>

    <template v-if="possuiGarantias">
      <EmptyState
        v-if="garantias.length === 0"
        :icon="Shield"
        title="Nenhuma garantia adicionada"
        hint="Clique em Adicionar garantia para cadastrar AF, Hipoteca, Penhor, Fiança e demais tipos."
      />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 1.3fr 0.9fr 0.9fr 0.9fr 0.7fr auto;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Tipo</div>
          <div>Valor</div>
          <div>Instr. particular</div>
          <div>Constituir</div>
          <div>Testemunhas</div>
          <div />
        </div>
        <div
          v-for="(g, pageIdx) in pageItems"
          :key="pageIdx"
          class="grid items-center"
          style="
            grid-template-columns: 1.3fr 0.9fr 0.9fr 0.9fr 0.7fr auto;
            padding: 10px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
          "
          @click="openEdit(globalIndex(pageIdx))"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
          <div>{{ g.valor || '—' }}</div>
          <div>{{ g.instrumentoParticular ? 'Sim' : 'Não' }}</div>
          <div>{{ g.constituirGarantia ? 'Sim' : 'Não' }}</div>
          <div>{{ g.numeroTestemunhas || '—' }}</div>
          <button
            aria-label="Remover"
            style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
            @click.stop="removeGarantia(globalIndex(pageIdx))"
          >
            <Trash2 :size="14" />
          </button>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </template>

    <!-- Sub-modal Nova / Editar Garantia -->
    <div
      v-if="showNova"
      style="
        position: fixed;
        inset: 0;
        background: rgba(8, 60, 74, 0.55);
        backdrop-filter: blur(8px);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
      "
    >
      <div
        style="
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 860px;
          height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        "
        @click.stop
      >
        <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
          <div>
            <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ editingIndex != null ? 'Editar Garantia' : 'Nova Garantia' }}
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
              Catálogo completo · constituição e vínculo com o título
            </p>
          </div>
          <button
            aria-label="Fechar"
            class="flex items-center justify-center"
            style="
              width: 36px;
              height: 36px;
              border-radius: var(--radius-lg);
              border: 1px solid var(--border-default);
              background: var(--surface-card);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click="showNova = false"
          >
            <X :size="18" />
          </button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 20px">
            <BentoBox title="Dados da garantia" :icon="Scale">
              <div class="flex flex-col" style="gap: 14px">
                <StepGrid>
                  <SelectField label="Tipo de garantia" :options="TIPO_GARANTIA_MINUTA_OPTS" placeholder="Selecione" required :span="5" v-model="form.tipo" />
                  <FormField label="Valor da garantia" placeholder="R$ 0,00" required currency :span="3" v-model="form.valor" />
                  <FormField label="Nº de testemunhas" placeholder="—" :span="4" v-model="form.numeroTestemunhas" />
                  <FormField label="Descrição" placeholder="—" :span="12" v-model="form.descricao" />
                  <FormField label="Obrigação garantida / vínculo com o título" placeholder="—" required :span="8" v-model="form.obrigacaoGarantida" />
                  <SelectField
                    v-if="showFormaProduto"
                    label="Forma do produto"
                    :options="FORMA_PRODUTO_GARANTIA_OPTS"
                    placeholder="Selecione"
                    :span="4"
                    v-model="form.formaProduto"
                  />
                </StepGrid>
                <ToggleRow
                  label="É instrumento particular"
                  :on="form.instrumentoParticular"
                  @toggle="form.instrumentoParticular = !form.instrumentoParticular"
                />
                <ToggleRow
                  label="Vai constituir garantia"
                  :on="form.constituirGarantia"
                  @toggle="form.constituirGarantia = !form.constituirGarantia"
                />
              </div>
            </BentoBox>

            <BentoBox v-if="form.constituirGarantia" title="Constituição da garantia" :icon="Scale">
              <StepGrid>
                <FormField label="Órgão / cartório de registro" placeholder="—" required :span="6" v-model="form.cartorioConstituicao" />
                <FormField label="Data prevista de constituição" placeholder="dd/mm/aaaa" required :span="6" v-model="form.dataPrevistaConstituicao" />
                <FormField label="Observações" placeholder="—" :span="12" v-model="form.observacoesConstituicao" />
              </StepGrid>
            </BentoBox>

            <template v-if="showEstoque">
              <BentoBox title="Estoque de formação" :icon="Home">
                <div class="flex flex-col" style="gap: 14px">
                  <StepGrid>
                    <FormField label="Nome do imóvel" placeholder="—" :span="6" v-model="form.nomeImovel" />
                    <FormField label="Matrícula" placeholder="—" :span="6" v-model="form.matricula" />
                    <SelectField label="Zona" :options="ZONA_OPTS" placeholder="Selecione" :span="3" v-model="form.zona" />
                    <SelectField label="Tipo" :options="TIPO_IMOVEL_OPTS" placeholder="Selecione" :span="3" v-model="form.tipoImovel" />
                    <FormField label="Área total afetada" placeholder="—" :span="3" v-model="form.areaTotal" />
                    <SelectField label="Unidade de medida" :options="UNIDADE_MEDIDA_OPTS" placeholder="Selecione" :span="3" v-model="form.unidadeMedidaArea" />
                    <FormField label="Cartório de registro" placeholder="—" :span="4" v-model="form.cartorioRegistro" />
                    <SelectField label="UF de registro" :options="ufOpts" placeholder="UF" :span="4" v-model="form.ufRegistro" />
                    <SelectField
                      label="Cidade de registro"
                      :options="cidadeRegistroOpts"
                      placeholder="Selecione"
                      :span="4"
                      :disabled="!form.ufRegistro"
                      v-model="form.cidadeRegistro"
                    />
                  </StepGrid>

                  <ToggleRow label="Imóvel locado" :on="form.imovelLocado" compact @toggle="form.imovelLocado = !form.imovelLocado" />

                  <template v-if="form.imovelLocado">
                    <BentoBox title="Informações da locação">
                      <StepGrid>
                        <SelectField label="Tipo de Locação" :options="TIPO_LOCACAO_OPTS" placeholder="Selecione" required :span="4" v-model="form.tipoLocacao" />
                        <FormField label="Data de início" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataInicio" />
                        <div style="grid-column: span 4; align-self: end">
                          <ToggleRow
                            label="Prazo indeterminado"
                            :on="form.prazoIndeterminado"
                            compact
                            @toggle="form.prazoIndeterminado = !form.prazoIndeterminado"
                          />
                        </div>
                        <FormField
                          v-if="!form.prazoIndeterminado"
                          label="Data de término"
                          placeholder="dd/mm/aaaa"
                          required
                          :span="4"
                          v-model="form.dataTermino"
                        />
                      </StepGrid>
                    </BentoBox>

                    <BentoBox title="Proprietário do imóvel locado">
                      <StepGrid>
                        <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" v-model="naturezaLocado" />
                      </StepGrid>
                    </BentoBox>

                    <BentoBox title="Partes">
                      <StepGrid>
                        <FormField label="Nome do contratante" placeholder="—" :span="6" v-model="form.nomeContratante" />
                        <FormField label="Nome do contratado" placeholder="—" :span="6" v-model="form.nomeContratado" />
                      </StepGrid>
                    </BentoBox>
                  </template>
                </div>
              </BentoBox>

              <StepGrid>
                <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
                <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
                <FormField label="Informações adicionais" placeholder="—" :span="5" v-model="form.infoAdicionais" />
                <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
                <SelectField
                  label="Cidade"
                  :options="cidadeEnderecoOpts"
                  placeholder="Selecione"
                  :span="5"
                  :disabled="!form.estado"
                  v-model="form.cidade"
                />
                <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais" />
              </StepGrid>

              <BentoBox title="Informações do proprietário da garantia">
                <StepGrid>
                  <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" v-model="naturezaProprietario" />
                </StepGrid>
              </BentoBox>

              <div class="flex justify-end">
                <AddButton @click="addEstoque">Adicionar dados do estoque</AddButton>
              </div>

              <BentoBox title="Estoques">
                <div v-if="form.estoques.length === 0" style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
                  Nenhum estoque adicionado.
                </div>
                <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                  <div
                    class="grid"
                    style="
                      grid-template-columns: 1fr 1fr auto;
                      padding: 10px 14px;
                      background: var(--surface-sunken);
                      font-size: 10px;
                      font-weight: var(--weight-bold);
                      letter-spacing: 0.12em;
                      color: var(--text-muted);
                      text-transform: uppercase;
                    "
                  >
                    <div>Propriedade</div>
                    <div>Proprietário</div>
                    <div />
                  </div>
                  <div
                    v-for="(e, i) in form.estoques"
                    :key="i"
                    class="grid items-center"
                    style="
                      grid-template-columns: 1fr 1fr auto;
                      padding: 10px 14px;
                      border-top: 1px solid var(--border-default);
                      font-size: var(--text-sm);
                    "
                  >
                    <div>{{ e.propriedade }}</div>
                    <div>{{ e.proprietario }}</div>
                    <button
                      aria-label="Remover"
                      style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
                      @click="removeEstoque(i)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
              </BentoBox>

              <BentoBox title="Informações do relatório">
                <StepGrid>
                  <FormField label="Data do relatório" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataRelatorio" />
                  <SelectField
                    label="Periodicidade do relatório"
                    :options="PERIODICIDADE_RELATORIO_OPTS"
                    placeholder="Selecione"
                    :span="4"
                    v-model="form.periodicidadeRelatorio"
                  />
                  <FormField label="Data da primeira atualização" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataPrimeiraAtualizacao" />
                </StepGrid>
              </BentoBox>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default)">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="showNova = false"
          >
            Cancelar
          </button>
          <button
            class="flex items-center"
            :style="{
              height: '44px',
              padding: '0 24px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: form.tipo && form.valor ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: form.tipo && form.valor ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: form.tipo && form.valor ? '#fff' : 'var(--text-disabled)',
            }"
            :disabled="!form.tipo || !form.valor"
            @click="cadastrar"
          >
            {{ editingIndex != null ? 'SALVAR' : 'CADASTRAR' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

### InformacaoPagamentoStep

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Landmark, Plus } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField, AddButton } from '../adicionar-contrato';
import {
  CONTAS_BANCARIAS_MOCK,
  BANCO_OPTS,
  TIPO_CONTA_OPTS,
  labelContaBancaria,
  emptyContaBancariaDraft,
  type ContaBancaria,
} from '../../../data/minutaData';

const contaBancariaId = defineModel<string>('contaBancariaId', { default: '' });
const contasExtras = defineModel<ContaBancaria[]>('contasExtras', { default: () => [] });

const showNova = ref(false);
const draft = reactive(emptyContaBancariaDraft());

const todasContas = computed(() => [...CONTAS_BANCARIAS_MOCK, ...contasExtras.value]);
const contaOpts = computed(() => todasContas.value.map(labelContaBancaria));

const contaSelecionada = computed({
  get: () => {
    const c = todasContas.value.find((x) => x.id === contaBancariaId.value);
    return c ? labelContaBancaria(c) : '';
  },
  set: (label: string) => {
    const c = todasContas.value.find((x) => labelContaBancaria(x) === label);
    contaBancariaId.value = c?.id ?? '';
    if (c) {
      showNova.value = false;
      resetDraft();
    }
  },
});

const temContaSelecionada = computed(() => !!contaBancariaId.value);

function toggleNovaConta() {
  if (temContaSelecionada.value) return;
  showNova.value = !showNova.value;
  if (!showNova.value) resetDraft();
}

function resetDraft() {
  Object.assign(draft, emptyContaBancariaDraft());
}

function adicionarConta() {
  if (!draft.banco || !draft.agencia || !draft.conta || !draft.digitoConta || !draft.tipoConta) return;
  const nova: ContaBancaria = {
    id: `cb-extra-${Date.now()}`,
    ...JSON.parse(JSON.stringify(draft)),
    titular: draft.titular || '—',
  };
  contasExtras.value = [...contasExtras.value, nova];
  contaBancariaId.value = nova.id;
  resetDraft();
  showNova.value = false;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="Informação de Pagamento" :icon="Landmark">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <SelectField
            label="Conta bancária"
            :options="contaOpts"
            placeholder="Selecione"
            required
            :span="10"
            v-model="contaSelecionada"
          />
          <div style="grid-column: span 2; align-self: end; width: 100%">
            <AddButton full-width :disabled="temContaSelecionada" @click="toggleNovaConta">
              <Plus :size="14" /> Conta
            </AddButton>
          </div>
        </StepGrid>

        <template v-if="showNova && !temContaSelecionada">
          <StepGrid>
            <SelectField label="Banco" :options="BANCO_OPTS" placeholder="Selecione" required :span="4" v-model="draft.banco" />
            <FormField label="Agência" placeholder="—" required :span="2" v-model="draft.agencia" />
            <FormField label="Dígito agência" placeholder="—" :span="2" v-model="draft.digitoAgencia" />
            <FormField label="Conta" placeholder="—" required :span="2" v-model="draft.conta" />
            <FormField label="Dígito conta" placeholder="—" required :span="2" v-model="draft.digitoConta" />
            <SelectField label="Tipo de conta" :options="TIPO_CONTA_OPTS" required :span="3" v-model="draft.tipoConta" />
            <FormField label="Chave PIX" placeholder="—" :span="4" v-model="draft.chavePix" />
            <FormField label="Titular" placeholder="—" :span="5" v-model="draft.titular" />
          </StepGrid>
          <div class="flex justify-end" style="gap: 8px">
            <button
              type="button"
              style="
                height: 40px;
                padding: 0 16px;
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-muted);
                font-weight: var(--weight-semibold);
                font-size: var(--text-sm);
              "
              @click="showNova = false; resetDraft()"
            >
              Cancelar
            </button>
            <AddButton @click="adicionarConta">Adicionar conta bancária</AddButton>
          </div>
        </template>
      </div>
    </BentoBox>
  </div>
</template>
```

### CetStep

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Percent } from 'lucide-vue-next';
import { brl } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField } from '../adicionar-contrato';
import type { CetForm } from '../../../data/minutaData';

const props = defineProps<{
  valorTitulo: number;
  dataEmissao: string;
  dataVencimento: string;
}>();

const form = defineModel<CetForm>({ required: true });

/** Evita loops de conversão cruzada */
const syncing = ref(false);

function parseNum(v: string): number {
  if (!v) return 0;
  return Number(String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
}

function fmtPct(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '';
  return n.toFixed(digits).replace('.', ',');
}

function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Conversões aproximadas de taxa (protótipo): dia ↔ mês ↔ ano */
function diaToMes(d: number) {
  return (Math.pow(1 + d / 100, 30) - 1) * 100;
}
function diaToAno(d: number) {
  return (Math.pow(1 + d / 100, 365) - 1) * 100;
}
function mesToDia(m: number) {
  return (Math.pow(1 + m / 100, 1 / 30) - 1) * 100;
}
function anoToDia(a: number) {
  return (Math.pow(1 + a / 100, 1 / 365) - 1) * 100;
}

watch(
  () => form.value.cetDia,
  (v) => {
    if (syncing.value) return;
    const d = parseNum(v);
    if (!v) return;
    syncing.value = true;
    form.value.cetMes = fmtPct(diaToMes(d));
    form.value.cetAno = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.cetMes,
  (v) => {
    if (syncing.value) return;
    const m = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = mesToDia(m);
    form.value.cetDia = fmtPct(d);
    form.value.cetAno = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.cetAno,
  (v) => {
    if (syncing.value) return;
    const a = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = anoToDia(a);
    form.value.cetDia = fmtPct(d);
    form.value.cetMes = fmtPct(diaToMes(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAD,
  (v) => {
    if (syncing.value) return;
    const d = parseNum(v);
    if (!v) return;
    syncing.value = true;
    form.value.taxaAM = fmtPct(diaToMes(d));
    form.value.taxaAA = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAM,
  (v) => {
    if (syncing.value) return;
    const m = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = mesToDia(m);
    form.value.taxaAD = fmtPct(d);
    form.value.taxaAA = fmtPct(diaToAno(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.taxaAA,
  (v) => {
    if (syncing.value) return;
    const a = parseNum(v);
    if (!v) return;
    syncing.value = true;
    const d = anoToDia(a);
    form.value.taxaAD = fmtPct(d);
    form.value.taxaAM = fmtPct(diaToMes(d));
    syncing.value = false;
  },
);

watch(
  () => form.value.iofValor,
  (v) => {
    if (syncing.value) return;
    const valor = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.iofPercentual = fmtPct((valor / props.valorTitulo) * 100, 2);
    syncing.value = false;
  },
);

watch(
  () => form.value.iofPercentual,
  (v) => {
    if (syncing.value) return;
    const pct = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.iofValor = fmtMoney((pct / 100) * props.valorTitulo);
    syncing.value = false;
  },
);

watch(
  () => form.value.custoEmissaoValor,
  (v) => {
    if (syncing.value) return;
    const valor = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.custoEmissaoPercentual = fmtPct((valor / props.valorTitulo) * 100, 2);
    syncing.value = false;
  },
);

watch(
  () => form.value.custoEmissaoPercentual,
  (v) => {
    if (syncing.value) return;
    const pct = parseNum(v);
    if (!v || props.valorTitulo <= 0) return;
    syncing.value = true;
    form.value.custoEmissaoValor = fmtMoney((pct / 100) * props.valorTitulo);
    syncing.value = false;
  },
);

function parseDateBr(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

const prazoDias = computed(() => {
  const a = parseDateBr(props.dataEmissao);
  const b = parseDateBr(props.dataVencimento);
  if (!a || !b) return '—';
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return String(Math.max(0, diff));
});

const valorLiquido = computed(() => {
  const iof = parseNum(form.value.iofValor);
  const custo = parseNum(form.value.custoEmissaoValor);
  return Math.max(0, props.valorTitulo - iof - custo);
});

const valorLiquidoPct = computed(() => {
  if (props.valorTitulo <= 0) return '—';
  return fmtPct((valorLiquido.value / props.valorTitulo) * 100, 2) + '%';
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="CET — Custo Efetivo Total" :icon="Percent">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="CET dia (%)" placeholder="0,0000" required :span="4" v-model="form.cetDia" />
          <FormField label="CET mês (%)" placeholder="0,0000" required :span="4" v-model="form.cetMes" />
          <FormField label="CET ano (%)" placeholder="0,0000" required :span="4" v-model="form.cetAno" />
        </StepGrid>

        <StepGrid>
          <FormField label="IOF (Valor)" placeholder="R$ 0,00" required currency :span="3" v-model="form.iofValor" />
          <FormField label="IOF (%)" placeholder="0,00" required :span="3" v-model="form.iofPercentual" />
          <FormField label="Custo emissão (Valor)" placeholder="R$ 0,00" required currency :span="3" v-model="form.custoEmissaoValor" />
          <FormField label="Custo emissão (%)" placeholder="0,00" required :span="3" v-model="form.custoEmissaoPercentual" />
        </StepGrid>

        <StepGrid>
          <FormField
            label="Valor líquido (Valor)"
            :model-value="brl(valorLiquido)"
            disabled
            :span="3"
          />
          <FormField label="Valor líquido (%)" :model-value="valorLiquidoPct" disabled :span="3" />
          <FormField label="Valor CCB (Valor)" :model-value="brl(valorTitulo)" disabled :span="3" />
          <FormField label="Valor CCB (%)" model-value="100,00%" disabled :span="3" />
        </StepGrid>

        <StepGrid>
          <FormField label="Emissão" :model-value="dataEmissao || '—'" disabled :span="4" />
          <FormField label="Vencimento" :model-value="dataVencimento || '—'" disabled :span="4" />
          <FormField label="Prazo (dias)" :model-value="prazoDias" disabled :span="4" />
        </StepGrid>

        <StepGrid>
          <FormField label="Taxa A.D. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAD" />
          <FormField label="Taxa A.M. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAM" />
          <FormField label="Taxa A.A. (%)" placeholder="0,0000" required :span="4" v-model="form.taxaAA" />
        </StepGrid>
      </div>
    </BentoBox>
  </div>
</template>
```

### BoletimSubscricaoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User, Mail, MapPin, Landmark } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField, ToggleRow } from '../adicionar-contrato';
import {
  CREDORAS_PADRAO,
  CONTAS_BANCARIAS_MOCK,
  labelContaBancaria,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type BoletimSubscricao,
  type ContaBancaria,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const boletim = defineModel<BoletimSubscricao>({ required: true });
const contasExtras = defineModel<ContaBancaria[]>('contasExtras', { default: () => [] });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const form = computed(() => boletim.value.subscritor);
const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const todasContas = computed(() => [...CONTAS_BANCARIAS_MOCK, ...contasExtras.value]);
const contaOpts = computed(() => todasContas.value.map(labelContaBancaria));
const contaSelecionada = computed({
  get: () => {
    const c = todasContas.value.find((x) => x.id === boletim.value.contaBancariaId);
    return c ? labelContaBancaria(c) : '';
  },
  set: (label: string) => {
    const c = todasContas.value.find((x) => labelContaBancaria(x) === label);
    boletim.value.contaBancariaId = c?.id ?? '';
  },
});

watch(
  () => boletim.value.subscritorPadrao,
  (on) => {
    if (on) {
      const data = CREDORAS_PADRAO['Ceres Securitizadora'];
      if (data) Object.assign(boletim.value.subscritor, JSON.parse(JSON.stringify(data)));
    } else {
      boletim.value.subscritor = emptyPessoaMinuta('JURIDICA');
    }
  },
);

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <ToggleRow
      label="Subscritor Ceres Securitizadora"
      :on="boletim.subscritorPadrao"
      @toggle="boletim.subscritorPadrao = !boletim.subscritorPadrao"
    />

    <StepGrid>
      <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" :disabled="boletim.subscritorPadrao" v-model="natureza" />
    </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="—" required :span="3" :disabled="boletim.subscritorPadrao" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="5" :disabled="boletim.subscritorPadrao" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="2" :disabled="boletim.subscritorPadrao" v-model="form.rg!" />
        <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" :disabled="boletim.subscritorPadrao" v-model="form.orgaoEmissorRg!" />
        <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoProdutorRural!" />
        <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.nacionalidade!" />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.profissao!" />
        <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.estadoCivil!" />
      </StepGrid>
      <SpouseFields
        v-if="estadoCivilExigeConjuge(form.estadoCivil)"
        :disabled="boletim.subscritorPadrao"
        :model-value="form.conjuge ?? emptyConjugeMinuta()"
        @update:model-value="form.conjuge = $event"
      />
    </template>
    <template v-else>
      <StepGrid>
        <FormField label="CNPJ" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.cnpj!" />
        <FormField label="Razão social" placeholder="—" :span="5" :disabled="boletim.subscritorPadrao" v-model="form.razaoSocial!" />
        <FormField label="Nome Fantasia" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.nomeFantasia!" />
        <FormField label="Data de abertura" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.dataAbertura!" />
        <FormField label="Tipo" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.tipoEmpresa!" />
        <FormField label="Porte" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.porte!" />
        <FormField label="Atividade principal" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.atividadePrincipal!" />
        <FormField label="Natureza jurídica" placeholder="—" :span="6" :disabled="boletim.subscritorPadrao" v-model="form.naturezaJuridica!" />
        <FormField label="Inscrição municipal" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoMunicipal!" />
        <FormField label="Inscrição estadual" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoEstadual!" />
      </StepGrid>

      <BentoBox title="Representante Legal" :icon="User">
        <StepGrid>
          <FormField label="CPF" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.representante!.cpf" />
          <FormField label="Nome" placeholder="—" :span="5" :disabled="boletim.subscritorPadrao" v-model="form.representante!.nome" />
          <FormField label="RG" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.rg" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.inscricaoProdutorRural" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.nacionalidade" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.dataNascimento" />
          <FormField label="Profissão" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.profissao" />
        </StepGrid>
      </BentoBox>
    </template>

    <BentoBox title="Contato" :icon="Mail">
      <StepGrid>
        <FormField label="E-mail" placeholder="—" required :span="5" :disabled="boletim.subscritorPadrao" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.telefone!" />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Endereço" :icon="MapPin">
      <StepGrid>
        <FormField label="CEP" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" :disabled="boletim.subscritorPadrao" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" :disabled="boletim.subscritorPadrao" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="boletim.subscritorPadrao || !form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.pais!" />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Dados bancários do subscritor" :icon="Landmark">
      <StepGrid>
        <SelectField
          label="Conta bancária"
          :options="contaOpts"
          placeholder="Selecione"
          :span="12"
          v-model="contaSelecionada"
        />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Notas subscritas">
      <StepGrid>
        <FormField label="Quantidade" placeholder="—" required :span="3" v-model="boletim.quantidade" />
        <FormField label="Preço total unitário" placeholder="R$ 0,00" required currency :span="3" v-model="boletim.precoTotalUnitario" />
        <FormField label="Preço de subscrição" placeholder="R$ 0,00" required currency :span="3" v-model="boletim.precoSubscricao" />
        <FormField label="Dias de integração" placeholder="—" :span="3" v-model="boletim.diasIntegracao" />
      </StepGrid>
    </BentoBox>
  </div>
</template>
```

### SpouseFields

```vue
<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import { NACIONALIDADE_OPTS, type ConjugeMinuta } from '../../../data/minutaData';

withDefaults(
  defineProps<{ disabled?: boolean }>(),
  { disabled: false },
);

const conjuge = defineModel<ConjugeMinuta>({ required: true });
</script>

<template>
  <BentoBox title="Dados do cônjuge" :icon="Users">
    <StepGrid>
      <FormField label="Nome completo do cônjuge" placeholder="—" required :span="5" :disabled="disabled" v-model="conjuge.nome" />
      <FormField label="CPF do cônjuge" placeholder="000.000.000-00" required :span="3" :disabled="disabled" v-model="conjuge.cpf" />
      <FormField label="RG do cônjuge" placeholder="—" :span="4" :disabled="disabled" v-model="conjuge.rg" />
      <FormField label="Data de nascimento do cônjuge" placeholder="dd/mm/aaaa" required :span="4" :disabled="disabled" v-model="conjuge.dataNascimento" />
      <SelectField
        label="Nacionalidade do cônjuge"
        :options="NACIONALIDADE_OPTS"
        placeholder="Selecione"
        required
        :span="4"
        :disabled="disabled"
        v-model="conjuge.nacionalidade"
      />
      <FormField label="Profissão do cônjuge" placeholder="—" :span="4" :disabled="disabled" v-model="conjuge.profissao" />
    </StepGrid>
  </BentoBox>
</template>
```

## Relatórios

### RelatorioPedidosScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  Download,
  ClipboardList,
  FileText,
  Percent,
  ListChecks,
  ScrollText,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import ToggleRow from '../components/modals/adicionar-contrato/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  REQUEST_REPORTS,
  GERENTES_COMERCIAIS,
  SUPERINTENDENTES,
  GRUPOS_EMPRESARIAIS,
  VEICULOS_OPERACAO,
  emptyRelatorioFilters,
  isAbaixoDaTaxa,
  isChecklistPdf,
  isTitulosReport,
  reportFileName,
  type RelatorioPedidosFilters,
  type RelatorioResultRow,
  type RequestReportValue,
} from '../data/relatoriosPedidosData';
import { TIPO_PEDIDO_OPTS } from '../data/tipoPedidoOptions';

const REPORT_ICONS: Record<RequestReportValue, Component> = {
  20: ClipboardList,
  22: ListChecks,
  34: ScrollText,
  29: Percent,
  33: FileText,
};

const selected = ref<RequestReportValue | null>(null);
const hoveredKey = ref<RequestReportValue | null>(null);
const draft = reactive<RelatorioPedidosFilters>(emptyRelatorioFilters());
const applied = ref<RelatorioPedidosFilters | null>(null);

const errors = reactive({
  numeroSolicitacao: '',
  aprovacaoDatas: '',
});

const report = computed(() => REQUEST_REPORTS.find((r) => r.value === selected.value) ?? null);
const showAbaixoDaTaxa = computed(() => isAbaixoDaTaxa(selected.value));
const showQuitacao = computed(() => isTitulosReport(selected.value));
const isPdfReport = computed(() => isChecklistPdf(selected.value));

const results = computed<RelatorioResultRow[]>(() => {
  if (!applied.value || selected.value === null) return [];
  return buildMockResults(selected.value, applied.value);
});

const resultColumns = computed(() => {
  if (selected.value === null) return [] as string[];
  if (isAbaixoDaTaxa(selected.value)) {
    return ['Aprovação de', 'Aprovação até', 'Veículo', 'Grupo', 'Gerente'];
  }
  if (isTitulosReport(selected.value)) {
    return ['Nº solicitação', 'Gerente', 'Grupo', 'Tipo', 'Quitação vencidos'];
  }
  if (isChecklistPdf(selected.value)) {
    return ['Nº solicitação', 'Status', 'Valor operação', 'Taxa', 'Avaliador'];
  }
  return ['Nº solicitação', 'Gerente comercial', 'Grupo empresarial', 'Tipo solicitação'];
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

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

const errorTextStyle = {
  fontSize: 'var(--text-xs)',
  color: 'var(--danger-base, #c53030)',
  marginTop: '6px',
  lineHeight: '1.4',
} as const;

function selectReport(value: RequestReportValue) {
  selected.value = value;
  Object.assign(draft, emptyRelatorioFilters());
  applied.value = null;
  clearValidation();
}

function goBack() {
  selected.value = null;
  applied.value = null;
  clearValidation();
}

function clearValidation() {
  errors.numeroSolicitacao = '';
  errors.aprovacaoDatas = '';
}

function validateNumeroSolicitacao(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^[1-9]\d*$/.test(trimmed)) return 'Insira somente números positivos inteiros';
  return null;
}

function onNumeroBlur() {
  errors.numeroSolicitacao = validateNumeroSolicitacao(draft.numeroSolicitacao) ?? '';
}

function toggleVeiculo(veiculo: string) {
  const idx = draft.veiculos.indexOf(veiculo);
  if (idx >= 0) draft.veiculos.splice(idx, 1);
  else draft.veiculos.push(veiculo);
}

function validateBeforeGerar(): boolean {
  clearValidation();
  if (selected.value === null) return false;

  if (!isAbaixoDaTaxa(selected.value)) {
    const msg = validateNumeroSolicitacao(draft.numeroSolicitacao);
    if (msg) {
      errors.numeroSolicitacao = msg;
      return false;
    }
  }

  if (isAbaixoDaTaxa(selected.value)) {
    const de = draft.aprovacaoDe;
    const ate = draft.aprovacaoAte;
    if ((de && !ate) || (!de && ate)) {
      errors.aprovacaoDatas =
        'As datas inicial e final de aprovação da exceção devem ser informadas juntas.';
      return false;
    }
    if (de && ate && de > ate) {
      errors.aprovacaoDatas =
        'A data inicial de aprovação da exceção não pode ser maior que a data final.';
      return false;
    }
  }

  return true;
}

function handleGerar() {
  if (!validateBeforeGerar()) return;
  applied.value = {
    ...draft,
    veiculos: [...draft.veiculos],
  };
  setPage(1);
}

function buildMockResults(
  tipo: RequestReportValue,
  f: RelatorioPedidosFilters,
): RelatorioResultRow[] {
  if (isAbaixoDaTaxa(tipo)) {
    const veiculoLabel =
      f.veiculos.length > 0 ? f.veiculos.join('; ') : VEICULOS_OPERACAO[0];
    return [
      {
        id: 'r1',
        col1: f.aprovacaoDe || '2026-01-10',
        col2: f.aprovacaoAte || '2026-03-15',
        col3: veiculoLabel,
        col4: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[0],
        col5: f.gerenteComercial || GERENTES_COMERCIAIS[0],
      },
      {
        id: 'r2',
        col1: '2026-02-01',
        col2: '2026-02-28',
        col3: VEICULOS_OPERACAO[1],
        col4: GRUPOS_EMPRESARIAIS[1],
        col5: GERENTES_COMERCIAIS[1],
      },
      {
        id: 'r3',
        col1: '2026-03-01',
        col2: '2026-03-31',
        col3: VEICULOS_OPERACAO[2],
        col4: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[2],
        col5: f.gerenteComercial || GERENTES_COMERCIAIS[2],
      },
    ];
  }

  if (isChecklistPdf(tipo)) {
    return [
      {
        id: 'c1',
        col1: f.numeroSolicitacao || '10482',
        col2: 'VALIDADO',
        col3: 'R$ 1.250.000,00',
        col4: '1,85%',
        col5: 'Maria Silva',
      },
      {
        id: 'c2',
        col1: '10501',
        col2: 'PENDENTE',
        col3: 'R$ 890.000,00',
        col4: '2,10%',
        col5: 'João Pereira',
      },
    ];
  }

  const base: RelatorioResultRow[] = [
    {
      id: 's1',
      col1: f.numeroSolicitacao || '10482',
      col2: f.gerenteComercial || GERENTES_COMERCIAIS[0],
      col3: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[0],
      col4: f.tipoSolicitacao || TIPO_PEDIDO_OPTS[0].text,
    },
    {
      id: 's2',
      col1: '10501',
      col2: GERENTES_COMERCIAIS[1],
      col3: GRUPOS_EMPRESARIAIS[1],
      col4: TIPO_PEDIDO_OPTS[3].text,
    },
    {
      id: 's3',
      col1: '10519',
      col2: f.gerenteComercial || GERENTES_COMERCIAIS[2],
      col3: f.grupoEmpresarial || GRUPOS_EMPRESARIAIS[2],
      col4: f.tipoSolicitacao || TIPO_PEDIDO_OPTS[6].text,
    },
  ];

  if (isTitulosReport(tipo)) {
    return base.map((row, i) => ({
      ...row,
      col5: i === 0 ? (f.quitacaoVencidos ? 'Sim' : 'Não') : i === 1 ? 'Não' : 'Sim',
    }));
  }

  return base;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function handleExportCsv() {
  if (selected.value === null || results.value.length === 0) return;
  const header = resultColumns.value;
  const lines = results.value.map((r) => {
    const cells = [r.col1, r.col2, r.col3, r.col4];
    if (header.length > 4) cells.push(r.col5 ?? '');
    return cells.map(escapeCsvCell).join(';');
  });
  const csv = [header.join(';'), ...lines].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, reportFileName(selected.value, 'csv'));
}

function handleExportPdf() {
  if (selected.value === null || results.value.length === 0) return;
  const body = [
    'RELATÓRIO DE CHECKLIST DA SOLICITAÇÃO',
    '',
    ...results.value.map(
      (r) =>
        `Solicitação ${r.col1} | Status: ${r.col2} | Valor: ${r.col3} | Taxa: ${r.col4} | Avaliador: ${r.col5}`,
    ),
  ].join('\n');
  const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, reportFileName(22, 'txt'));
}

const resultGridCols = computed(() =>
  resultColumns.value.length === 5 ? '1.2fr 1fr 1.4fr 1.4fr 1fr' : '1.2fr 1.2fr 1.4fr 1.6fr',
);
</script>

<template>
  <!-- Lista de cards (padrão Risco) -->
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in REQUEST_REPORTS"
        :key="r.value"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.value ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.value ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.value ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectReport(r.value)"
        @mouseenter="hoveredKey = r.value"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <component :is="REPORT_ICONS[r.value]" :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 6px;
            "
          >
            {{ r.text }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ r.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === r.value ? 1 : 0,
            transform: hoveredKey === r.value ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <!-- Detalhe do relatório -->
  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="goBack"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Relatórios · Solicitações
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ report?.text }}
        </h2>
      </div>
    </div>

    <!-- Filtros -->
    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <!-- Dados da Solicitação (tipos ≠ 29) -->
      <div v-if="!showAbaixoDaTaxa" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Número da solicitação</div>
          <input
            v-model="draft.numeroSolicitacao"
            type="text"
            inputmode="numeric"
            placeholder="Ex.: 10482"
            :style="{
              ...inputStyle,
              borderColor: errors.numeroSolicitacao
                ? 'var(--danger-base, #c53030)'
                : 'var(--border-default)',
            }"
            @blur="onNumeroBlur"
            @input="errors.numeroSolicitacao = ''"
          />
          <div v-if="errors.numeroSolicitacao" :style="errorTextStyle">
            {{ errors.numeroSolicitacao }}
          </div>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo da solicitação</div>
          <select v-model="draft.tipoSolicitacao" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div v-if="showQuitacao" style="grid-column: 1 / -1">
          <ToggleRow
            label="Operação para quitação de vencidos"
            :on="draft.quitacaoVencidos"
            spacious
            @toggle="draft.quitacaoVencidos = !draft.quitacaoVencidos"
          />
        </div>
      </div>

      <!-- Filtros Abaixo da Taxa (tipo 29) -->
      <div v-else class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Aprovação de</div>
          <input
            v-model="draft.aprovacaoDe"
            type="date"
            :style="inputStyle"
            @input="errors.aprovacaoDatas = ''"
          />
        </div>
        <div>
          <div :style="labelStyle">Aprovação até</div>
          <input
            v-model="draft.aprovacaoAte"
            type="date"
            :style="inputStyle"
            @input="errors.aprovacaoDatas = ''"
          />
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo do pedido</div>
          <select v-model="draft.tipoPedido" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Superintendente</div>
          <select v-model="draft.superintendente" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="s in SUPERINTENDENTES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div v-if="errors.aprovacaoDatas" style="grid-column: 1 / -1">
          <div :style="errorTextStyle">{{ errors.aprovacaoDatas }}</div>
        </div>
        <div style="grid-column: 1 / -1">
          <div :style="labelStyle">Veículo de operação</div>
          <div
            class="grid"
            style="
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              gap: 10px;
              padding: 14px;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-sunken);
            "
          >
            <label
              v-for="v in VEICULOS_OPERACAO"
              :key="v"
              class="flex items-center"
              style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
            >
              <input
                type="checkbox"
                :checked="draft.veiculos.includes(v)"
                style="accent-color: var(--agro-base); width: 16px; height: 16px"
                @change="toggleVeiculo(v)"
              />
              <span>{{ v }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="
            gap: 8px;
            height: 42px;
            padding: 0 20px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div
      v-if="applied"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div
        class="flex items-center justify-between"
        style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          v-if="isPdfReport"
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: results.length === 0 ? 'not-allowed' : 'pointer',
            color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
          @click="handleExportPdf"
        >
          <Download :size="13" /> EXPORTAR PDF
        </button>
        <button
          v-else
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: results.length === 0 ? 'not-allowed' : 'pointer',
            color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div
        v-if="results.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
      <template v-else>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '10px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div v-for="col in resultColumns" :key="col">{{ col }}</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.col1 }}</div>
          <div style="color: var(--text-default)">{{ row.col2 }}</div>
          <div style="color: var(--text-muted)">{{ row.col3 }}</div>
          <div style="color: var(--text-default)">{{ row.col4 }}</div>
          <div v-if="resultColumns.length > 4" style="color: var(--text-default)">{{ row.col5 }}</div>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </template>
    </div>
  </div>
</template>
```

## Fundo Padrão

### FundoPadraoScreen

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RANK_ATIVO_SEED, type RankItemAtivo } from '../data/fundoPadraoData';
import OperationFundRankList from '../components/fundo-padrao/OperationFundRankList.vue';
import OperationFundRankEditor from '../components/fundo-padrao/OperationFundRankEditor.vue';

const activeRank = ref<RankItemAtivo[]>([...RANK_ATIVO_SEED]);

function handleSaveRank(items: RankItemAtivo[]) {
  activeRank.value = items.map((item, i) => ({
    ...item,
    priority: i + 1,
    isCurrent: i === 0,
  }));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Fundo Padrão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 640px; line-height: 1.5">
        Configure a ordem de prioridade dos fundos utilizados nas operações e acompanhe limites e utilização do rank
        ativo.
      </p>
    </div>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Rank ativo
      </div>
      <OperationFundRankList :items="activeRank" />
    </section>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Edição do rank
      </div>
      <OperationFundRankEditor :active-rank="activeRank" @save="handleSaveRank" />
    </section>
  </div>
</template>
```

### OperationFundRankList

```vue
<script setup lang="ts">
import {
  type RankItemAtivo,
  formatMoney,
  progressPct,
  progressColor,
} from '../../data/fundoPadraoData';

defineProps<{ items: RankItemAtivo[] }>();

function typeChipStyle(type: RankItemAtivo['fundType']) {
  if (type === 'CRA') {
    return { background: 'var(--agro-light, rgba(242,125,38,0.12))', color: 'var(--agro-base)' };
  }
  return { background: 'var(--gci-light)', color: 'var(--gci-base)' };
}
</script>

<template>
  <div
    v-if="items.length === 0"
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <div style="font-size: var(--text-sm); color: var(--text-muted)">
      Nenhum rank de fundos ativo configurado.
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 12px">
    <article
      v-for="item in items"
      :key="`${item.priority}-${item.fundId}`"
      class="flex flex-col"
      :style="{
        padding: '18px 20px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        borderLeft: item.isCurrent ? '4px solid #16a34a' : '1px solid var(--border-default)',
        opacity: item.isExhausted ? 0.72 : 1,
        gap: '12px',
        transition: 'opacity var(--duration-fast)',
      }"
    >
      <div class="flex flex-wrap items-center justify-between" style="gap: 10px">
        <div class="flex flex-wrap items-center" style="gap: 8px">
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 4px 10px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            #{{ item.priority }}
          </span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ item.fundName }}
          </span>
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
            "
            :style="typeChipStyle(item.fundType)"
          >
            {{ item.fundType }}
          </span>
          <span
            v-if="item.isCurrent"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: rgba(22, 163, 74, 0.12);
              color: #16a34a;
            "
          >
            Atual
          </span>
          <span
            v-if="item.isExhausted"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            Esgotado
          </span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); text-align: right">
          Configurado por {{ item.configuradoPor }} · {{ item.dataConfiguracao }}
        </div>
      </div>

      <div class="flex flex-wrap items-end justify-between" style="gap: 16px">
        <div class="flex flex-wrap" style="gap: 24px">
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Operado
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.operado) }}
            </div>
          </div>
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Limite
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.limite) }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 6px; gap: 8px">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Utilização</span>
          <span
            style="font-size: var(--text-xs); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums"
            :style="{ color: progressColor(progressPct(item.operado, item.limite)) }"
          >
            {{ progressPct(item.operado, item.limite) }}%
          </span>
        </div>
        <div
          style="
            height: 8px;
            border-radius: 9999px;
            background: var(--surface-sunken);
            overflow: hidden;
          "
        >
          <div
            :style="{
              width: `${progressPct(item.operado, item.limite)}%`,
              height: '100%',
              borderRadius: '9999px',
              background: progressColor(progressPct(item.operado, item.limite)),
              transition: 'width var(--duration-normal)',
            }"
          />
        </div>
      </div>
    </article>
  </div>
</template>
```

### OperationFundRankEditor

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowUp, ArrowDown, Trash2, Plus, Info } from 'lucide-vue-next';
import {
  FUNDOS_DISPONIVEIS,
  fundoLabel,
  parseMoneyInput,
  type RankItemAtivo,
  type RankEditorItem,
} from '../../data/fundoPadraoData';

const props = defineProps<{ activeRank: RankItemAtivo[] }>();
const emit = defineEmits<{ save: [items: RankItemAtivo[]] }>();

const editorItems = ref<RankEditorItem[]>([]);

function emptyItem(): RankEditorItem {
  return { fundId: '', limite: '' };
}

function loadCurrentRank() {
  editorItems.value = props.activeRank.map((r) => ({
    fundId: r.fundId,
    limite: r.limite > 0 ? String(r.limite) : '',
  }));
}

function addItem() {
  editorItems.value = [...editorItems.value, emptyItem()];
}

function removeItem(index: number) {
  editorItems.value = editorItems.value.filter((_, i) => i !== index);
}

function moveUp(index: number) {
  if (index <= 0) return;
  const next = [...editorItems.value];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  editorItems.value = next;
}

function moveDown(index: number) {
  if (index >= editorItems.value.length - 1) return;
  const next = [...editorItems.value];
  [next[index], next[index + 1]] = [next[index + 1], next[index]];
  editorItems.value = next;
}

function fundOptionsForRow(rowIndex: number) {
  const taken = new Set(
    editorItems.value
      .map((row, i) => (i === rowIndex ? '' : row.fundId))
      .filter(Boolean),
  );
  return FUNDOS_DISPONIVEIS.filter((f) => !taken.has(f.id));
}

const hasDuplicateFunds = computed(() => {
  const ids = editorItems.value.map((r) => r.fundId).filter(Boolean);
  return new Set(ids).size !== ids.length;
});

const hasIncompleteItems = computed(() =>
  editorItems.value.some((r) => !r.fundId || parseMoneyInput(r.limite) <= 0),
);

const saveDisabledReason = computed((): string | null => {
  if (editorItems.value.length === 0) return 'Adicione ao menos um item para salvar';
  if (hasIncompleteItems.value) return 'Preencha o fundo e o limite de todos os itens';
  if (hasDuplicateFunds.value) return 'Há fundos duplicados no rank';
  return null;
});

const canSave = computed(() => saveDisabledReason.value === null);

function handleSave() {
  if (!canSave.value) return;
  const today = new Date().toLocaleDateString('pt-BR');
  const payload: RankItemAtivo[] = editorItems.value.map((row, i) => {
    const fund = FUNDOS_DISPONIVEIS.find((f) => f.id === row.fundId)!;
    return {
      priority: i + 1,
      fundId: fund.id,
      fundName: fund.name,
      fundType: fund.type,
      limite: parseMoneyInput(row.limite),
      operado: 0,
      configuradoPor: 'Eduardo Santos',
      dataConfiguracao: today,
      isCurrent: i === 0,
      isExhausted: false,
    };
  });
  emit('save', payload);
}
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      padding: 20px 22px;
    "
  >
    <div class="flex flex-wrap items-center justify-between" style="gap: 12px; margin-bottom: 16px">
      <h2 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
        Edição do rank
      </h2>
      <button
        v-if="activeRank.length > 0"
        type="button"
        class="btn-animated"
        style="
          height: 36px;
          padding: 0 14px;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
        @click="loadCurrentRank"
      >
        Carregar rank atual
      </button>
    </div>

    <div
      class="flex items-start"
      style="
        gap: 10px;
        padding: 12px 14px;
        margin-bottom: 16px;
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        border: 1px solid var(--border-default);
      "
    >
      <Info :size="16" style="color: var(--gci-base); flex-shrink: 0; margin-top: 2px" />
      <p style="margin: 0; font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
        A ordem dos itens define a prioridade do rank (o item no topo é prioridade 1). Ao salvar, o rank ativo
        inteiro será substituído pela configuração abaixo.
      </p>
    </div>

    <div
      v-if="editorItems.length === 0"
      style="
        padding: 32px 16px;
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        border: 1px dashed var(--border-default);
        border-radius: var(--radius-lg);
        margin-bottom: 16px;
      "
    >
      Nenhum item adicionado. Clique em 'Adicionar item' para começar.
    </div>

    <div v-else class="flex flex-col" style="gap: 10px; margin-bottom: 16px">
      <div
        v-for="(row, index) in editorItems"
        :key="index"
        class="flex flex-wrap items-center"
        style="
          gap: 10px;
          padding: 12px 14px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
        "
      >
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            background: var(--surface-card);
            color: var(--text-muted);
            flex-shrink: 0;
          "
        >
          #{{ index + 1 }}
        </span>

        <div class="flex" style="gap: 4px; flex-shrink: 0">
          <button
            type="button"
            aria-label="Mover para cima"
            class="flex items-center justify-center"
            :disabled="index === 0"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              opacity: index === 0 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
            @click="moveUp(index)"
          >
            <ArrowUp :size="14" />
          </button>
          <button
            type="button"
            aria-label="Mover para baixo"
            class="flex items-center justify-center"
            :disabled="index === editorItems.length - 1"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === editorItems.length - 1 ? 'not-allowed' : 'pointer',
              opacity: index === editorItems.length - 1 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
            @click="moveDown(index)"
          >
            <ArrowDown :size="14" />
          </button>
        </div>

        <select
          v-model="row.fundId"
          style="
            flex: 1 1 200px;
            min-width: 180px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            cursor: pointer;
          "
        >
          <option value="" disabled>Selecione o fundo</option>
          <option v-for="f in fundOptionsForRow(index)" :key="f.id" :value="f.id">
            {{ fundoLabel(f) }}
          </option>
          <option v-if="row.fundId && !fundOptionsForRow(index).some((f) => f.id === row.fundId)" :value="row.fundId">
            {{ fundoLabel(FUNDOS_DISPONIVEIS.find((f) => f.id === row.fundId)!) }}
          </option>
        </select>

        <input
          v-model="row.limite"
          type="text"
          inputmode="decimal"
          placeholder="Limite (R$)"
          style="
            flex: 0 1 160px;
            min-width: 140px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />

        <button
          type="button"
          aria-label="Remover item"
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--action-danger-text-only);
            flex-shrink: 0;
          "
          @click="removeItem(index)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center" style="gap: 10px">
      <button
        type="button"
        class="flex items-center btn-animated"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.06em;
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
        @click="addItem"
      >
        <Plus :size="14" />
        Adicionar item
      </button>
      <button
        type="button"
        class="btn-animated"
        :disabled="!canSave"
        :title="saveDisabledReason ?? undefined"
        style="
          height: 40px;
          padding: 0 20px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.08em;
          color: #fff;
          background: var(--action-primary-bg);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          opacity: 1;
        "
        :style="!canSave ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
        @click="handleSave"
      >
        Salvar rank
      </button>
    </div>
  </div>
</template>
```

## Taxas dos Veículos

### TaxasVeiculosScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { Landmark, Briefcase, Shield, Search } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import {
  seedByTab,
  type VehicleSetting,
  type VehicleTypeTab,
} from '../data/taxasVeiculosData';
import VehicleRateDetailView from '../components/taxas-veiculos/VehicleRateDetailView.vue';

const TABS: { key: VehicleTypeTab; label: string; icon: Component }[] = [
  { key: 'FIDC', label: 'FIDC', icon: Landmark },
  { key: 'CRA', label: 'CRA', icon: Briefcase },
  { key: 'GARANTIAS', label: 'Garantias', icon: Shield },
];

const TAB_LABELS: Record<VehicleTypeTab, string> = {
  FIDC: 'FIDC',
  CRA: 'CRA',
  GARANTIAS: 'Garantias',
};

const COLS = 'auto 0.5fr 2fr';

const activeTab = ref<VehicleTypeTab>('FIDC');
const lists = ref<Record<VehicleTypeTab, VehicleSetting[]>>({
  FIDC: seedByTab('FIDC'),
  CRA: seedByTab('CRA'),
  GARANTIAS: seedByTab('GARANTIAS'),
});

const filterId = ref('');
const filterNome = ref('');
const detailVehicle = ref<VehicleSetting | null>(null);
const saveConfirmOpen = ref(false);
const saveBannerVisible = ref(false);
let saveBannerTimer: ReturnType<typeof setTimeout> | null = null;

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

const currentList = computed(() => lists.value[activeTab.value]);

const filteredVehicles = computed(() => {
  const idQ = filterId.value.trim().toLowerCase();
  const nomeQ = filterNome.value.trim().toLowerCase();
  return currentList.value.filter((v) => {
    const matchId = !idQ || v.vehicleId.toLowerCase().includes(idQ);
    const matchNome = !nomeQ || v.vehicleName.toLowerCase().includes(nomeQ);
    return matchId && matchNome;
  });
});

const visibleActiveCount = computed(() => filteredVehicles.value.filter((v) => v.isActive).length);

const allActiveVisible = computed(
  () => filteredVehicles.value.length > 0 && visibleActiveCount.value === filteredVehicles.value.length,
);

const someActiveVisible = computed(() => visibleActiveCount.value > 0);

const selectAllIndeterminate = computed(() => someActiveVisible.value && !allActiveVisible.value);

function updateVehicleInTab(updated: VehicleSetting) {
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    v.vehicleId === updated.vehicleId ? updated : v,
  );
  if (detailVehicle.value?.vehicleId === updated.vehicleId) {
    detailVehicle.value = updated;
  }
}

function toggleVehicleActive(vehicleId: string) {
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    v.vehicleId === vehicleId ? { ...v, isActive: !v.isActive } : v,
  );
}

function toggleAllVisibleActive() {
  const target = !allActiveVisible.value;
  const visibleIds = new Set(filteredVehicles.value.map((v) => v.vehicleId));
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    visibleIds.has(v.vehicleId) ? { ...v, isActive: target } : v,
  );
}

function openDetail(vehicle: VehicleSetting) {
  detailVehicle.value = { ...vehicle, history: vehicle.history.map((h) => ({ ...h })) };
}

function closeDetail() {
  detailVehicle.value = null;
}

function handleDetailSave(updated: VehicleSetting) {
  updateVehicleInTab(updated);
}

function requestSaveTab() {
  saveConfirmOpen.value = true;
}

function confirmSaveTab() {
  saveConfirmOpen.value = false;
  if (saveBannerTimer) clearTimeout(saveBannerTimer);
  saveBannerVisible.value = true;
  saveBannerTimer = setTimeout(() => {
    saveBannerVisible.value = false;
    saveBannerTimer = null;
  }, 3200);
}

function cancelSaveTab() {
  saveConfirmOpen.value = false;
}
</script>

<template>
  <VehicleRateDetailView
    v-if="detailVehicle"
    :vehicle="detailVehicle"
    :tab-label="TAB_LABELS[activeTab]"
    @back="closeDetail"
    @save="handleDetailSave"
  />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div v-if="saveBannerVisible" role="status">
      <div
        style="
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          background: var(--status-success-bg, #ecfdf5);
          border: 1px solid var(--status-success-border, #a7f3d0);
          color: var(--status-success-text, #047857);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
        "
      >
        Configurações salvas
      </div>
    </div>

    <div class="flex items-start justify-between" style="gap: 16px">
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 6px;
          "
        >
          Workflow Operacional · Solicitações
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
          "
        >
          Taxas dos Veículos
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 720px; line-height: 1.5">
          Parametrize taxas por tipo de veículo. Clique em um veículo para abrir o detalhe.
        </p>
      </div>
      <button
        type="button"
        class="btn-animated btn-agro"
        style="
          height: 48px;
          padding: 0 28px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.1em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          flex-shrink: 0;
        "
        @click="requestSaveTab"
      >
        SALVAR
      </button>
    </div>

    <SegmentedToggle
      :model-value="activeTab"
      :options="TABS"
      variant="brand"
      @update:model-value="activeTab = $event as VehicleTypeTab"
    />

    <div class="grid" style="grid-template-columns: 160px 1fr; gap: 12px 16px; max-width: 640px">
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          ID
        </div>
        <input v-model="filterId" placeholder="Filtrar ID..." :style="inputStyle" />
      </div>
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Nome
        </div>
        <div class="relative">
          <Search
            :size="15"
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
          />
          <input
            v-model="filterNome"
            placeholder="Filtrar por nome..."
            :style="{ ...inputStyle, paddingLeft: '36px' }"
          />
        </div>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--surface-card);
      "
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <label class="flex flex-col" style="gap: 4px; cursor: pointer">
          <span class="flex items-center" style="gap: 10px">
            <Checkbox
              :checked="allActiveVisible"
              :indeterminate="selectAllIndeterminate"
              @change="toggleAllVisibleActive"
            />
            <span>Selecionar todos</span>
          </span>
          <span style="padding-left: 26px; font-size: 9px; letter-spacing: 0.08em; opacity: 0.85">Ativo</span>
        </label>
        <div>ID</div>
        <div>Nome</div>
      </div>

      <div
        v-if="filteredVehicles.length === 0"
        style="padding: 32px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum veículo encontrado com os filtros aplicados.
      </div>

      <div
        v-for="v in filteredVehicles"
        :key="v.vehicleId"
        class="grid items-center taxas-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="openDetail(v)"
      >
        <div @click.stop>
          <Checkbox :checked="v.isActive" @change="toggleVehicleActive(v.vehicleId)" />
        </div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ v.vehicleId }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ v.vehicleName }}</div>
      </div>
    </div>

    <div
      v-if="saveConfirmOpen"
      class="flex items-center justify-center"
      style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); padding: 24px"
    >
      <div
        style="
          width: 100%;
          max-width: 440px;
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 28px;
        "
        @click.stop
      >
        <h3
          style="
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin-bottom: 10px;
          "
        >
          Deseja salvar as configurações de veículos?
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 22px">
          As alterações de ativação e taxas permanecem apenas neste protótipo local (aba
          {{ TAB_LABELS[activeTab] }}).
        </p>
        <div class="flex items-center justify-end" style="gap: 10px">
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--surface-card);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="cancelSaveTab"
          >
            Cancelar
          </button>
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--agro-base);
              color: #fff;
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="confirmSaveTab"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taxas-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### VehicleRateDetailView

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { ArrowLeft, Percent, History } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import {
  POST_FIXED_INDEX_OPTS,
  rateStatusColor,
  rateStatusLabel,
  type VehicleSetting,
  type VehicleRateHistory,
} from '../../data/taxasVeiculosData';

const props = defineProps<{ vehicle: VehicleSetting; tabLabel: string }>();
const emit = defineEmits<{ back: []; save: [vehicle: VehicleSetting] }>();

type DetailTab = 'parametrizacao' | 'historico';

const DETAIL_TABS: { key: DetailTab; label: string; icon: Component }[] = [
  { key: 'parametrizacao', label: 'Parametrização', icon: Percent },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<DetailTab>('parametrizacao');
const preFixedInput = ref('');
const postFixedInput = ref('');
const postFixedIndex = ref<string>('DI');
const dueAtInput = ref('');
const formError = ref('');
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.14em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '0 14px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

const HIST_COLS = '1.1fr 1fr 0.9fr 0.8fr 1fr';

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const minDueDate = computed(() => tomorrowISO());

function syncFromVehicle(v: VehicleSetting) {
  preFixedInput.value = v.preFixedRate != null ? String(v.preFixedRate) : '';
  postFixedInput.value = v.postFixedRate != null ? String(v.postFixedRate) : '';
  postFixedIndex.value = v.postFixedIndex || 'DI';
  dueAtInput.value = v.dueAt || '';
  formError.value = '';
}

watch(() => props.vehicle, syncFromVehicle, { immediate: true, deep: true });

function parseOptionalRate(raw: string): number | null {
  const trimmed = raw.trim().replace(',', '.');
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatCreatedAt(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToDisplayBR(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatPre(h: VehicleRateHistory): string {
  return h.preFixedRate != null ? `${h.preFixedRate}%` : '—';
}

function formatPost(h: VehicleRateHistory): string {
  if (h.postFixedRate == null) return '—';
  return `${h.postFixedIndex} ${h.postFixedRate}%`;
}

const isNewRateSetup = computed(
  () =>
    props.vehicle.history.length === 0 ||
    (props.vehicle.preFixedRate == null &&
      props.vehicle.postFixedRate == null &&
      !props.vehicle.dueAt),
);

const primaryActionLabel = computed(() =>
  isNewRateSetup.value ? 'Cadastrar taxa' : 'Salvar parametrização',
);

function handleSaveRate() {
  formError.value = '';
  const pre = parseOptionalRate(preFixedInput.value);
  const post = parseOptionalRate(postFixedInput.value);

  if (pre == null && post == null) {
    formError.value = 'Informe ao menos a taxa pré-fixada ou a taxa pós-fixada.';
    return;
  }
  if (!dueAtInput.value) {
    formError.value = 'Informe a data de vencimento da taxa.';
    return;
  }
  if (dueAtInput.value < minDueDate.value) {
    formError.value = 'A data de vencimento deve ser a partir de amanhã.';
    return;
  }

  const now = new Date();
  const newEntry: VehicleRateHistory = {
    id: `h-${props.vehicle.vehicleId}-${Date.now()}`,
    createdAt: formatCreatedAt(now),
    dueAt: isoToDisplayBR(dueAtInput.value),
    status: 1,
    preFixedRate: pre,
    postFixedRate: post,
    postFixedIndex: postFixedIndex.value,
  };

  const history = props.vehicle.history.map((h) =>
    h.status === 1 ? { ...h, status: 2 as const } : h,
  );

  emit('save', {
    ...props.vehicle,
    preFixedRate: pre,
    postFixedRate: post,
    postFixedIndex: postFixedIndex.value,
    dueAt: dueAtInput.value,
    history: [newEntry, ...history],
  });

  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Taxas dos Veículos · {{ tabLabel }}
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ vehicle.vehicleName }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          ID {{ vehicle.vehicleId }} ·
          {{ vehicle.isActive ? 'Ativo' : 'Inativo' }}
        </p>
      </div>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Taxa salva com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="DETAIL_TABS"
      variant="brand"
      @update:model-value="tab = $event as DetailTab"
    />

    <!-- Parametrização -->
    <div
      v-if="tab === 'parametrizacao'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px 20px">
        <div>
          <div :style="labelStyle">Taxa Pré Fixada (%)</div>
          <input
            v-model="preFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,85"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Taxa Pós Fixada (%)</div>
          <input
            v-model="postFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,5"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Indexador Pós Fixado</div>
          <select v-model="postFixedIndex" :style="inputStyle">
            <option v-for="opt in POST_FIXED_INDEX_OPTS" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Data de vencimento da taxa</div>
          <input v-model="dueAtInput" type="date" :min="minDueDate" :style="inputStyle" />
        </div>
      </div>

      <p
        v-if="formError"
        style="font-size: var(--text-sm); color: var(--danger-base, #c53030); margin-top: 14px; line-height: 1.4"
      >
        {{ formError }}
      </p>

      <div class="flex items-center justify-end" style="margin-top: 20px">
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 22px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
          @click="handleSaveRate"
        >
          {{ primaryActionLabel }}
        </button>
      </div>
    </div>

    <!-- Histórico -->
    <div v-else>
      <div
        v-if="vehicle.history.length === 0"
        style="
          padding: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          background: var(--surface-sunken);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
        "
      >
        Nenhuma taxa cadastrada para este veículo.
      </div>
      <div
        v-else
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '12px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Data</div>
          <div>Vencimento</div>
          <div>Status</div>
          <div>Taxa Pré</div>
          <div>Taxa Pós</div>
        </div>
        <div
          v-for="h in vehicle.history"
          :key="h.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '14px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.createdAt }}</div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.dueAt }}</div>
          <div>
            <span
              :style="{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: `${rateStatusColor(h.status)}18`,
                color: rateStatusColor(h.status),
              }"
            >
              {{ rateStatusLabel(h.status) }}
            </span>
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPre(h) }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPost(h) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Validações Config

### ValidacoesConfigScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ChevronDown, Filter, Pencil, ShieldCheck, SlidersHorizontal, X } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  VALIDACOES_SEED,
  SETOR_RESPONSAVEL_OPTS,
  escopoLabel,
  isEscopoConfigurado,
  setorColor,
  setorLabel,
  type SetorResponsavel,
  type ValidationItem,
} from '../data/validacoesConfigData';
import ValidationDetailView from '../components/validacoes-config/ValidationDetailView.vue';

const COLS = '0.55fr 1.1fr 2fr 1fr 1.15fr auto';

function cloneValidationItem(item: ValidationItem): ValidationItem {
  return {
    ...item,
    configs: item.configs.map((c) => ({ ...c, vehicleIds: [...c.vehicleIds] })),
  };
}

const items = ref<ValidationItem[]>(VALIDACOES_SEED.map(cloneValidationItem));

interface FilterDraft {
  nome: string;
  id: string;
  setor: '' | SetorResponsavel;
}

const EMPTY_FILTERS: FilterDraft = { nome: '', id: '', setor: '' };

const draft = ref<FilterDraft>({ ...EMPTY_FILTERS });
const applied = ref<FilterDraft>({ ...EMPTY_FILTERS });
const filterErrors = reactive({ nome: '', id: '' });
const showFilters = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);

const editing = ref<ValidationItem | null>(null);

const activeFilterCount = computed(
  () =>
    [applied.value.nome, applied.value.id, applied.value.setor].filter((v) => String(v).trim() !== '')
      .length,
);

const filtered = computed(() =>
  items.value.filter((row) => {
    const nome = applied.value.nome.trim();
    if (nome && !row.name.toLowerCase().includes(nome.toLowerCase())) return false;

    const idRaw = applied.value.id.trim();
    if (idRaw && row.id !== Number(idRaw)) return false;

    if (applied.value.setor !== '' && row.responsibleSector !== applied.value.setor) return false;

    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const filterPanelStyle = computed(() => ({
  position: 'absolute' as const,
  [filterPlacement.value === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
  right: '0px',
  zIndex: 31,
  width: '440px',
  maxWidth: 'calc(100vw - 48px)',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-lg)',
  padding: '16px 20px',
}));

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

function openDetails(row: ValidationItem) {
  editing.value = row;
}

function openFilters() {
  if (!showFilters.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  showFilters.value = !showFilters.value;
}

function handleFilter() {
  filterErrors.nome = '';
  filterErrors.id = '';

  const nome = draft.value.nome.trim();
  if (nome && nome.length < 3) {
    filterErrors.nome = 'Informe ao menos 3 caracteres';
    return;
  }

  const idRaw = draft.value.id.trim();
  if (idRaw && !/^\d+$/.test(idRaw)) {
    filterErrors.id = 'Informe somente números';
    return;
  }

  applied.value = {
    nome: draft.value.nome,
    id: draft.value.id,
    setor: draft.value.setor,
  };
  showFilters.value = false;
  setPage(1);
}

function handleClearFilters() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  filterErrors.nome = '';
  filterErrors.id = '';
  setPage(1);
}

function handleUpdate(updated: ValidationItem) {
  items.value = items.value.map((i) => (i.id === updated.id ? cloneValidationItem(updated) : i));
  editing.value = items.value.find((i) => i.id === updated.id) ?? null;
}

function closeDetails() {
  editing.value = null;
}
</script>

<template>
  <ValidationDetailView
    v-if="editing"
    :item="editing"
    @back="closeDetails"
    @update="handleUpdate"
  />
  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Validações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ items.length }}
        {{ items.length === 1 ? 'validação cadastrada' : 'validações cadastradas' }}
      </p>
    </div>

    <div class="flex items-center justify-end" style="gap: 12px; flex-wrap: wrap">
      <div style="position: relative">
        <button
          ref="filterBtnRef"
          type="button"
          class="flex items-center"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 16px',
            cursor: 'pointer',
            background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
            border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
          @click="openFilters"
        >
          <SlidersHorizontal :size="15" :stroke-width="2" />
          Filtros
          <span
            v-if="activeFilterCount > 0"
            style="
              min-width: 18px;
              height: 18px;
              padding: 0 5px;
              border-radius: 9999px;
              background: var(--gci-base);
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ activeFilterCount }}
          </span>
          <ChevronDown
            :size="14"
            :style="{
              transform: showFilters ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <template v-if="showFilters">
          <div style="position: fixed; inset: 0; z-index: 30" @click="showFilters = false" />
          <div :style="filterPanelStyle">
            <div class="flex items-center justify-between" style="margin-bottom: 16px">
              <span
                style="
                  font-size: 11px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.12em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Filtros adicionais
              </span>
              <button
                v-if="activeFilterCount > 0 || draft.nome || draft.id || draft.setor"
                type="button"
                class="flex items-center"
                style="
                  gap: 4px;
                  background: none;
                  border: none;
                  cursor: pointer;
                  font-size: var(--text-xs);
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                "
                @click="handleClearFilters"
              >
                <X :size="12" /> Limpar filtros
              </button>
            </div>

            <div class="flex flex-col" style="gap: 14px">
              <div>
                <div :style="labelStyle">Nome</div>
                <input v-model="draft.nome" placeholder="Buscar por nome" :style="inputStyle" />
                <div
                  v-if="filterErrors.nome"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.nome }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">ID</div>
                <input
                  v-model="draft.id"
                  placeholder="Somente números"
                  inputmode="numeric"
                  :style="inputStyle"
                />
                <div
                  v-if="filterErrors.id"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.id }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">Setor Responsável</div>
                <select v-model="draft.setor" :style="inputStyle">
                  <option value="">Todos</option>
                  <option v-for="s in SETOR_RESPONSAVEL_OPTS" :key="s.value" :value="s.value">
                    {{ s.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
              <button
                type="button"
                style="
                  height: 38px;
                  padding: 0 16px;
                  background: none;
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                  font-size: var(--text-sm);
                "
                @click="handleClearFilters"
              >
                Limpar
              </button>
              <button
                type="button"
                class="flex items-center"
                style="
                  gap: 6px;
                  height: 38px;
                  padding: 0 18px;
                  background: var(--action-primary-bg);
                  color: #fff;
                  border: none;
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  font-weight: var(--weight-bold);
                  font-size: var(--text-xs);
                  letter-spacing: 0.06em;
                "
                @click="handleFilter"
              >
                <Filter :size="13" /> FILTRAR
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="filtered.length === 0"
      class="flex flex-col items-center justify-center"
      style="
        gap: 10px;
        padding: 48px 24px;
        text-align: center;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
        border: 1px dashed var(--border-default);
      "
    >
      <ShieldCheck :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
        Nenhuma validação encontrada
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">
        Ajuste os filtros ou cadastre novas validações na parametrização.
      </div>
    </div>

    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>ID</div>
        <div>Nome</div>
        <div>Descrição</div>
        <div>Setor Responsável</div>
        <div>Escopo</div>
        <div style="text-align: right">Ações</div>
      </div>

      <div
        v-for="row in pageItems"
        :key="row.id"
        class="grid items-center validacoes-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="openDetails(row)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ row.id }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ row.name }}</div>
        <div class="validacoes-desc" style="color: var(--text-default)">{{ row.description }}</div>
        <div>
          <span
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-bold)',
              color: '#fff',
              background: setorColor(row.responsibleSector),
            }"
          >
            {{ setorLabel(row.responsibleSector) }}
          </span>
        </div>
        <div>
          <span
            v-if="!isEscopoConfigurado(row)"
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-muted)',
              background: 'var(--surface-sunken)',
            }"
          >
            Não configurado
          </span>
          <span
            v-else
            :style="{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-default)',
              border: '1px solid var(--border-default)',
              background: 'transparent',
            }"
          >
            {{ escopoLabel(row) }}
          </span>
        </div>
        <div class="flex items-center justify-end">
          <button
            type="button"
            aria-label="Editar validação"
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: var(--radius-md);
              background: none;
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-muted);
            "
            @click.stop="openDetails(row)"
          >
            <Pencil :size="14" />
          </button>
        </div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.validacoes-row:hover {
  background: var(--surface-sunken);
}
.validacoes-desc {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
```

### ValidationDetailView

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { Component } from 'vue';
import {
  ArrowLeft,
  FileText,
  Settings2,
  Truck,
  Search,
  Trash2,
} from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import ToggleRow from '../modals/adicionar-contrato/ToggleRow.vue';
import {
  SETOR_RESPONSAVEL_OPTS,
  TIPO_PEDIDO_OPTS,
  VEICULOS_VALIDACAO,
  escopoLabel,
  isEscopoConfigurado,
  setorColor,
  setorLabel,
  tipoPedidoLabel,
  type FundTypeTab,
  type ValidationConfig,
  type ValidationItem,
} from '../../data/validacoesConfigData';

const props = defineProps<{ item: ValidationItem }>();
const emit = defineEmits<{
  back: [];
  update: [ValidationItem];
}>();

type TabKey = 'detalhes' | 'configuracoes' | 'veiculos';

const TABS: { key: TabKey; label: string; icon: Component }[] = [
  { key: 'detalhes', label: 'Detalhes', icon: FileText },
  { key: 'configuracoes', label: 'Configurações', icon: Settings2 },
  { key: 'veiculos', label: 'Veículos', icon: Truck },
];

function cloneItem(item: ValidationItem): ValidationItem {
  return {
    ...item,
    configs: item.configs.map((c) => ({ ...c, vehicleIds: [...c.vehicleIds] })),
  };
}

const tab = ref<TabKey>('detalhes');
const local = ref<ValidationItem>(cloneItem(props.item));
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.item,
  (v) => {
    local.value = cloneItem(v);
  },
);

const errors = reactive({ name: '', description: '', responsibleSector: '' });

const newRequestTypeId = ref<number | ''>('');
const selectedConfigId = ref<string | null>(null);

watch(
  () => local.value.configs,
  (configs) => {
    if (configs.length === 0) {
      selectedConfigId.value = null;
      return;
    }
    if (!selectedConfigId.value || !configs.some((c) => c.id === selectedConfigId.value)) {
      selectedConfigId.value = configs[0].id;
    }
  },
  { immediate: true, deep: true },
);

const selectedConfig = computed(
  () => local.value.configs.find((c) => c.id === selectedConfigId.value) ?? null,
);

const fundTab = ref<FundTypeTab>('CRA');
const vehicleSearch = ref('');
const vehicleSearchDebounced = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

watch(vehicleSearch, (v) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    vehicleSearchDebounced.value = v;
  }, 400);
});

const vehiclesInTab = computed(() => {
  const needle = vehicleSearchDebounced.value.trim().toLowerCase();
  return VEICULOS_VALIDACAO.filter((v) => {
    if (v.fundType !== fundTab.value) return false;
    if (needle && !v.name.toLowerCase().includes(needle)) return false;
    return true;
  });
});

const linkedInTabCount = computed(() => {
  const cfg = selectedConfig.value;
  if (!cfg) return 0;
  const linked = new Set(cfg.vehicleIds);
  return vehiclesInTab.value.filter((v) => linked.has(v.id)).length;
});

const FUND_TABS: { key: FundTypeTab; label: string }[] = [
  { key: 'CRA', label: 'CRAs' },
  { key: 'CDCA', label: 'CDCAs' },
  { key: 'FIDC', label: 'FIDCs' },
];

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
  height: '40px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function validateDetalhes(): boolean {
  errors.name = '';
  errors.description = '';
  errors.responsibleSector = '';

  if (!local.value.name.trim()) errors.name = 'Campo obrigatório';
  if (!local.value.description.trim()) errors.description = 'Campo obrigatório';
  if (!local.value.responsibleSector) errors.responsibleSector = 'Campo obrigatório';

  return !errors.name && !errors.description && !errors.responsibleSector;
}

function patchConfigs(configs: ValidationConfig[]) {
  local.value = { ...local.value, configs };
}

function updateConfigVehicleIds(configId: string, vehicleIds: string[]) {
  patchConfigs(
    local.value.configs.map((c) => (c.id === configId ? { ...c, vehicleIds } : c)),
  );
}

function insertConfig() {
  if (newRequestTypeId.value === '') return;
  const requestTypeId = Number(newRequestTypeId.value);
  if (local.value.configs.some((c) => c.requestTypeId === requestTypeId)) return;

  patchConfigs([
    ...local.value.configs,
    { id: `cfg-${Date.now()}`, requestTypeId, vehicleIds: [] },
  ]);
  newRequestTypeId.value = '';
}

function removeConfig(config: ValidationConfig) {
  if (!window.confirm('Deseja remover esta configuração?')) return;
  patchConfigs(local.value.configs.filter((c) => c.id !== config.id));
}

function isVehicleLinked(vehicleId: string): boolean {
  return selectedConfig.value?.vehicleIds.includes(vehicleId) ?? false;
}

function toggleVehicle(vehicleId: string) {
  const cfg = selectedConfig.value;
  if (!cfg) return;
  const ids = [...cfg.vehicleIds];
  const idx = ids.indexOf(vehicleId);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(vehicleId);
  updateConfigVehicleIds(cfg.id, ids);
}

function linkAllInTab() {
  const cfg = selectedConfig.value;
  if (!cfg) return;
  const set = new Set(cfg.vehicleIds);
  vehiclesInTab.value.forEach((v) => set.add(v.id));
  updateConfigVehicleIds(cfg.id, [...set]);
}

function handleAtualizar() {
  if (!validateDetalhes()) {
    tab.value = 'detalhes';
    return;
  }
  emit('update', cloneItem(local.value));
  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header (padrão detalhe Ativo/Solicitação) -->
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Validações · Detalhes
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ local.name }}
          <span
            :style="{
              display: 'inline-block',
              padding: '5px 11px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              color: '#fff',
              background: setorColor(local.responsibleSector),
            }"
          >
            {{ setorLabel(local.responsibleSector) }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          ID {{ local.id }} ·
          {{ isEscopoConfigurado(local) ? escopoLabel(local) : 'Não configurado' }}
        </p>
      </div>

      <button
        type="button"
        class="flex items-center"
        style="
          height: 44px;
          padding: 0 22px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
        "
        @click="handleAtualizar"
      >
        Atualizar
      </button>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Validação atualizada com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as TabKey"
    />

    <!-- Aba Detalhes -->
    <div
      v-if="tab === 'detalhes'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <div style="grid-column: span 2">
          <div :style="labelStyle">Nome</div>
          <input v-model="local.name" :style="inputStyle" />
          <div
            v-if="errors.name"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.name }}
          </div>
        </div>
        <div style="grid-column: span 2">
          <div :style="labelStyle">Descrição</div>
          <textarea
            v-model="local.description"
            rows="4"
            style="
              width: 100%;
              padding: 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              resize: vertical;
              min-height: 100px;
            "
          />
          <div
            v-if="errors.description"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.description }}
          </div>
        </div>
        <div>
          <div :style="labelStyle">Setor Responsável</div>
          <select v-model="local.responsibleSector" :style="inputStyle">
            <option v-for="s in SETOR_RESPONSAVEL_OPTS" :key="s.value" :value="s.value">
              {{ s.text }}
            </option>
          </select>
          <div
            v-if="errors.responsibleSector"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.responsibleSector }}
          </div>
        </div>
      </div>
      <div style="margin-top: 16px">
        <ToggleRow
          label="Anexo obrigatório na autorização"
          :on="local.requiresAttachmentOnAuthorization"
          @toggle="local.requiresAttachmentOnAuthorization = !local.requiresAttachmentOnAuthorization"
        />
      </div>
    </div>

    <!-- Aba Configurações -->
    <div
      v-else-if="tab === 'configuracoes'"
      class="flex flex-col"
      style="gap: 16px"
    >
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 22px;
        "
      >
        <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
          <div style="flex: 1; min-width: 240px">
            <div :style="labelStyle">Tipo de Pedido</div>
            <select v-model="newRequestTypeId" :style="inputStyle">
              <option value="">Selecione</option>
              <option v-for="t in TIPO_PEDIDO_OPTS" :key="t.value" :value="t.value">
                {{ t.text }}
              </option>
            </select>
          </div>
          <button
            type="button"
            style="
              height: 40px;
              padding: 0 20px;
              background: var(--surface-sunken);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="insertConfig"
          >
            Inserir
          </button>
        </div>
      </div>

      <div
        v-if="local.configs.length === 0"
        style="
          padding: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          background: var(--surface-sunken);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
        "
      >
        Nenhuma configuração cadastrada.
      </div>
      <div
        v-else
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid items-center"
          style="
            grid-template-columns: 1fr 0.5fr auto;
            padding: 12px 20px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Tipo de Pedido</div>
          <div>Qtd. veículos</div>
          <div style="text-align: right">Remover</div>
        </div>
        <div
          v-for="cfg in local.configs"
          :key="cfg.id"
          class="grid items-center"
          style="
            grid-template-columns: 1fr 0.5fr auto;
            padding: 14px 20px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ tipoPedidoLabel(cfg.requestTypeId) }}
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">
            {{ cfg.vehicleIds.length }}
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              aria-label="Remover configuração"
              class="flex items-center justify-center"
              style="
                width: 32px;
                height: 32px;
                border-radius: var(--radius-md);
                background: none;
                border: 1px solid var(--border-default);
                cursor: pointer;
                color: var(--action-danger-text-only);
              "
              @click="removeConfig(cfg)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Aba Veículos -->
    <div v-else class="flex flex-col" style="gap: 16px">
      <div
        v-if="local.configs.length === 0"
        style="
          padding: 20px 16px;
          border-radius: var(--radius-xl);
          background: color-mix(in srgb, var(--warning-base, #d97706) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--warning-base, #d97706) 35%, transparent);
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: 1.5;
        "
      >
        Nenhuma configuração cadastrada. Adicione uma configuração na aba Configurações para vincular
        veículos.
      </div>

      <div
        v-else
        class="grid"
        style="
          grid-template-columns: 280px 1fr;
          gap: 20px;
          min-height: 360px;
        "
      >
        <div
          style="
            border: 1px solid var(--border-default);
            border-radius: var(--radius-xl);
            overflow: hidden;
            background: var(--surface-card);
            align-self: start;
          "
        >
          <div
            style="
              padding: 12px 16px;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              border-bottom: 1px solid var(--border-default);
              background: var(--surface-sunken);
            "
          >
            Configurações
          </div>
          <button
            v-for="cfg in local.configs"
            :key="cfg.id"
            type="button"
            class="flex flex-col"
            style="
              width: 100%;
              padding: 14px 16px;
              text-align: left;
              border: none;
              border-bottom: 1px solid var(--border-default);
              cursor: pointer;
              background: selectedConfigId === cfg.id ? 'var(--surface-selected)' : 'transparent';
            "
            @click="selectedConfigId = cfg.id"
          >
            <span
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-semibold);
                color: var(--text-strong);
              "
            >
              {{ tipoPedidoLabel(cfg.requestTypeId) }}
            </span>
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
              {{ cfg.vehicleIds.length }} veículo(s)
            </span>
          </button>
        </div>

        <div
          class="flex flex-col"
          style="
            gap: 14px;
            min-width: 0;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-xl);
            background: var(--surface-card);
            padding: 20px;
          "
        >
          <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
            <button
              v-for="ft in FUND_TABS"
              :key="ft.key"
              type="button"
              :style="{
                padding: '6px 12px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                border: `1px solid ${fundTab === ft.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
                background: fundTab === ft.key ? 'var(--surface-selected)' : 'var(--surface-card)',
                color: fundTab === ft.key ? 'var(--gci-base)' : 'var(--text-muted)',
              }"
              @click="fundTab = ft.key"
            >
              {{ ft.label }}
            </button>
          </div>

          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
            <Search
              :size="16"
              style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
              "
            />
            <input
              v-model="vehicleSearch"
              placeholder="Buscar por nome..."
              style="
                width: 100%;
                height: 44px;
                padding-left: 44px;
                padding-right: 16px;
                background: transparent;
                border: none;
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
              "
            />
          </div>

          <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">
              {{ linkedInTabCount }} de {{ vehiclesInTab.length }} selecionados
            </span>
            <button
              type="button"
              style="
                height: 36px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                cursor: pointer;
                font-size: var(--text-xs);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
              "
              @click="linkAllInTab"
            >
              Vincular todos da aba
            </button>
          </div>

          <div
            v-if="vehiclesInTab.length === 0"
            style="padding: 32px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
          >
            Nenhum veículo encontrado.
          </div>
          <div
            v-else
            style="
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              overflow: hidden;
              max-height: 420px;
              overflow-y: auto;
            "
          >
            <div
              v-for="v in vehiclesInTab"
              :key="v.id"
              class="flex items-center"
              style="
                gap: 12px;
                padding: 12px 14px;
                border-top: 1px solid var(--border-default);
                cursor: pointer;
                background: var(--surface-card);
              "
              @click="toggleVehicle(v.id)"
            >
              <Checkbox :checked="isVehicleLinked(v.id)" @change="toggleVehicle(v.id)" @click.stop />
              <div style="min-width: 0">
                <div
                  style="
                    font-size: var(--text-sm);
                    font-weight: var(--weight-medium);
                    color: var(--text-strong);
                  "
                >
                  {{ v.name }}
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">
                  {{ v.fundType }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```
