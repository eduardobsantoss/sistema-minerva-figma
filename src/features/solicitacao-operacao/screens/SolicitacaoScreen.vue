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
