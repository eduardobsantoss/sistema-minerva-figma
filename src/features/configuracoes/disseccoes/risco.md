# Risco

## Screens

### AgrupamentosScreen

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Layers, Pencil, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  AGRUPAMENTOS_SEED, OPERACOES_VINCULAVEIS_SEED, contarVinculos,
  type Agrupamento, type OperacaoVinculavel,
} from '../data/riscoData';
import CreateAgrupamentoModal from '../components/modals/CreateAgrupamentoModal.vue';
import DeleteAgrupamentoModal from '../components/modals/DeleteAgrupamentoModal.vue';
import VincularAgrupamentoModal from '../components/modals/VincularAgrupamentoModal.vue';

const COLS = '2fr 0.8fr 0.8fr 0.8fr 1fr auto';

const agrupamentos = ref<Agrupamento[]>(AGRUPAMENTOS_SEED);
const operacoes = ref<OperacaoVinculavel[]>(OPERACOES_VINCULAVEIS_SEED);
const creating = ref(false);
const editing = ref<Agrupamento | null>(null);
const deleting = ref<Agrupamento | null>(null);
const vinculando = ref<Agrupamento | null>(null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => agrupamentos.value,
  { defaultPageSize: 10 },
);

function handleCreate(nome: string) {
  agrupamentos.value = [
    ...agrupamentos.value,
    { id: `agp-${Date.now()}`, nome, criadoEm: new Date().toLocaleDateString('pt-BR') },
  ];
  creating.value = false;
}

function handleRename(nome: string) {
  if (!editing.value) return;
  agrupamentos.value = agrupamentos.value.map((a) => (a.id === editing.value!.id ? { ...a, nome } : a));
  editing.value = null;
}

function handleDelete() {
  if (!deleting.value) return;
  agrupamentos.value = agrupamentos.value.filter((a) => a.id !== deleting.value!.id);
  deleting.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Identificação + ação primária -->
    <div class="flex items-center justify-between" style="gap: 16px">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Cadastro Global · Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Agrupamentos de Limite
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ agrupamentos.length }} {{ agrupamentos.length === 1 ? 'agrupamento cadastrado' : 'agrupamentos cadastrados' }}
        </p>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="gap: 8px; height: 48px; padding: 0 22px; background: var(--agro-base); color: #fff; border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -8px rgba(242,125,38,0.40)"
        @click="creating = true"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVO AGRUPAMENTO
      </button>
    </div>

    <!-- Tabela -->
    <div v-if="agrupamentos.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)">
      <Layers :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum agrupamento cadastrado</div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Use "Novo agrupamento" para cadastrar o primeiro agrupamento de limite.</div>
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Agrupamento</div><div>CRAs</div><div>FIDCs</div><div>Total</div><div>Criado em</div><div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="a in pageItems"
        :key="a.id"
        class="grid items-center agrupamentos-row"
        :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
        @click="vinculando = a"
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ a.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ contarVinculos(a.id, operacoes).cras }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ contarVinculos(a.id, operacoes).fidcs }}</div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ contarVinculos(a.id, operacoes).total }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.criadoEm }}</div>
        <div class="flex items-center justify-end" style="gap: 8px">
          <button
            aria-label="Renomear agrupamento"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click.stop="editing = a"
          >
            <Pencil :size="14" />
          </button>
          <button
            aria-label="Excluir agrupamento"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)"
            @click.stop="deleting = a"
          >
            <Trash2 :size="14" />
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

    <CreateAgrupamentoModal v-if="creating" @close="creating = false" @save="handleCreate" />
    <CreateAgrupamentoModal v-if="editing" :initial="editing" @close="editing = null" @save="handleRename" />
    <DeleteAgrupamentoModal v-if="deleting" :agrupamento="deleting" @close="deleting = null" @confirm="handleDelete" />
    <VincularAgrupamentoModal
      v-if="vinculando"
      :target="vinculando"
      target-label="Agrupamento"
      link-key="agrupamentoIds"
      :operacoes="operacoes"
      editable
      @update:operacoes="operacoes = $event"
      @close="vinculando = null"
      @edit="() => { editing = vinculando; vinculando = null; }"
    />
  </div>
</template>

<style scoped>
.agrupamentos-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### GrupoDetailScreen

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, type Component } from 'vue';
import { ArrowLeft, MoreVertical, Settings2, Users, History, UserCog, BellRing, ShieldCheck, Info, Link2 } from 'lucide-vue-next';
import {
  statusOperacaoColor, detalheGrupo,
  type GrupoEmpresarial,
} from '../data/riscoData';
import {
  applyGrupoVinculos,
  operacoesVinculaveis,
  veiculosFromVinculos,
} from '../data/vinculosStore';
import { CopyButton } from './detail-tabs/shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetalhesTab from './detail-tabs/DetalhesTab.vue';
import ParametrizacoesTab from './detail-tabs/ParametrizacoesTab.vue';
import CedentesTab from './detail-tabs/CedentesTab.vue';
import HistoricoTab from './detail-tabs/HistoricoTab.vue';
import TransferirGerenteModal from '../components/modals/TransferirGerenteModal.vue';
import ConfigurarNotificacoesModal from '../components/modals/ConfigurarNotificacoesModal.vue';
import HabilitarOperarModal from '../components/modals/HabilitarOperarModal.vue';
import VincularAgrupamentoModal from '../components/modals/VincularAgrupamentoModal.vue';

interface Props {
  grupo: GrupoEmpresarial;
}

type Tab = 'detalhes' | 'parametrizacoes' | 'cedentes' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'detalhes', label: 'Detalhes', icon: Info },
  { key: 'parametrizacoes', label: 'Parametrizações', icon: Settings2 },
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'historico', label: 'Histórico', icon: History },
];

const props = defineProps<Props>();
const emit = defineEmits<{ back: [] }>();

const tab = ref<Tab>('detalhes');
const det = reactive(detalheGrupo(props.grupo));
// Sync vehicles from shared vinculação state (may have changed since seed build)
det.parametrizacoes.autoatendimento.veiculosOperacao = veiculosFromVinculos(props.grupo.id);
const cor = statusOperacaoColor(props.grupo.statusOperacao);

const transferindo = ref(false);
const configurandoNotif = ref(false);
const habilitando = ref(false);
const vinculandoVeiculo = ref(false);

const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);

const actions = [
  { label: 'Vincular a um veículo', icon: Link2, onClick: () => { vinculandoVeiculo.value = true; } },
  { label: 'Transferir gerente', icon: UserCog, onClick: () => { transferindo.value = true; } },
  { label: 'Configurar notificações', icon: BellRing, onClick: () => { configurandoNotif.value = true; } },
  { label: 'Habilitar para operar', icon: ShieldCheck, onClick: () => { habilitando.value = true; } },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

function handleVinculosUpdate(ops: typeof operacoesVinculaveis.value) {
  det.parametrizacoes.autoatendimento.veiculosOperacao = applyGrupoVinculos(props.grupo.id, ops);
}

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) actionMenuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button aria-label="Voltar" class="flex items-center justify-center" style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Risco · Grupo Empresarial
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px">
          {{ grupo.nome }}
          <span class="flex items-center" :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }">
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ grupo.statusOperacao.toUpperCase() }}
          </span>
        </h2>
        <p class="flex items-center" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; gap: 6px">
          <span style="font-variant-numeric: tabular-nums">{{ grupo.documento }}</span>
          <CopyButton :value="grupo.documento" />
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong)"
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="position: absolute; top: 52px; right: 0; z-index: 50; min-width: 240px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center grupo-detail-action-item"
            style="gap: 10px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; transition: background var(--duration-fast)"
            @click="handleActionClick(a)"
          >
            <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <!-- Conteúdo -->
    <DetalhesTab
      v-if="tab === 'detalhes'"
      :grupo="grupo"
      :partes-relacionadas="det.partesRelacionadas"
      :limite="det.parametrizacoes.limite"
      @update:limite="(limite) => { det.parametrizacoes = { ...det.parametrizacoes, limite }; }"
      @update:rating="(rating) => { det.parametrizacoes.limite.indicativoRating = rating; }"
    />
    <ParametrizacoesTab
      v-if="tab === 'parametrizacoes'"
      :data="det.parametrizacoes"
      :grupo-id="grupo.id"
      :partes-relacionadas="det.partesRelacionadas"
      @change="(parametrizacoes) => { det.parametrizacoes = parametrizacoes; }"
      @update:partes-relacionadas="(pr) => { det.partesRelacionadas = pr; }"
    />
    <CedentesTab
      v-if="tab === 'cedentes'"
      :cedentes="det.cedentes"
      @update-cedente="(cedente) => { det.cedentes = det.cedentes.map((c) => (c.id === cedente.id ? cedente : c)); }"
    />
    <HistoricoTab v-if="tab === 'historico'" :eventos="det.historico" />

    <TransferirGerenteModal v-if="transferindo" :grupo-nome="grupo.nome" :gerente-atual="grupo.gerente" @close="transferindo = false" @confirm="transferindo = false" />
    <ConfigurarNotificacoesModal v-if="configurandoNotif" :grupo-nome="grupo.nome" @close="configurandoNotif = false" @confirm="configurandoNotif = false" />
    <HabilitarOperarModal v-if="habilitando" :grupo-nome="grupo.nome" @close="habilitando = false" @confirm="habilitando = false" />
    <VincularAgrupamentoModal
      v-if="vinculandoVeiculo"
      :target="grupo"
      target-label="Grupo"
      link-key="grupoIds"
      :operacoes="operacoesVinculaveis"
      @update:operacoes="handleVinculosUpdate"
      @close="vinculandoVeiculo = false"
    />
  </div>
</template>

<style scoped>
.grupo-detail-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### GruposListScreen

```vue
<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Filter, ChevronDown,
  MoreVertical, SlidersHorizontal, CheckCircle2, Clock, XCircle, Minus, Building2,
  Settings2, UserCog, BellRing, ShieldCheck, Search, Link2,
} from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  GRUPOS_SEED, GERENTES_SEED, TIPO_CLIENTE_OPTS, STATUS_OPERACAO_OPTS,
  statusOperacaoColor, parecerLabel, parecerColor, brl,
  type GrupoEmpresarial, type ParecerStatus,
} from '../data/riscoData';
import { applyGrupoVinculos, operacoesVinculaveis } from '../data/vinculosStore';
import TransferirGerenteModal from '../components/modals/TransferirGerenteModal.vue';
import ConfigurarNotificacoesModal from '../components/modals/ConfigurarNotificacoesModal.vue';
import HabilitarOperarModal from '../components/modals/HabilitarOperarModal.vue';
import VincularAgrupamentoModal from '../components/modals/VincularAgrupamentoModal.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Tooltip from '@/components/ui/Tooltip.vue';

const emit = defineEmits<{ open: [id: string] }>();

type ColKey = 'statusOperacao' | 'limite' | 'limiteAutoatendimento' | 'riscoTotal' | 'gerente' | 'vencimentoParecer';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' | 'center' }[] = [
  { key: 'statusOperacao', label: 'Status de Operação' },
  { key: 'limite', label: 'Limite', align: 'right' },
  { key: 'limiteAutoatendimento', label: 'Limite Autoatend.', align: 'right' },
  { key: 'riscoTotal', label: 'Risco Total', align: 'right' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimentoParecer', label: 'Vencimento do Parecer' },
];

const PARECER_ICON: Record<ParecerStatus, Component> = {
  CONFORME: CheckCircle2,
  EXPIRANDO: Clock,
  EXPIRADO: XCircle,
  AUSENTE: Minus,
};

type QuickParecerFilter = ParecerStatus | null;

interface Filters {
  nome: string;
  gerente: string;
  tipoCliente: string;
  statusOperacao: string;
  possuiParecer: string;
  vencMin: string;
  vencMax: string;
}

const EMPTY_FILTERS: Filters = { nome: '', gerente: '', tipoCliente: '', statusOperacao: '', possuiParecer: '', vencMin: '', vencMax: '' };

function parseDateBR(d: string | null): number {
  if (!d) return NaN;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

const grupos = ref<GrupoEmpresarial[]>(GRUPOS_SEED);
const searchQuery = ref('');
const quickParecerFilter = ref<QuickParecerFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);
const transferindo = ref<GrupoEmpresarial | null>(null);
const configurandoNotif = ref<GrupoEmpresarial | null>(null);
const habilitando = ref<GrupoEmpresarial | null>(null);
const vinculando = ref<GrupoEmpresarial | null>(null);

const QUICK_FILTERS: { key: QuickParecerFilter; label: string; status: ParecerStatus }[] = [
  { key: 'EXPIRADO', label: 'Vencido', status: 'EXPIRADO' },
  { key: 'EXPIRANDO', label: 'Próximo a Vencer', status: 'EXPIRANDO' },
  { key: 'CONFORME', label: 'Em Dia', status: 'CONFORME' },
];

const filtered = computed(() =>
  grupos.value.filter((g) => {
    if (searchQuery.value.trim() && !g.nome.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
    if (quickParecerFilter.value && g.parecerCredito !== quickParecerFilter.value) return false;
    if (applied.value.nome && !g.nome.toLowerCase().includes(applied.value.nome.toLowerCase())) return false;
    if (applied.value.gerente && g.gerente !== applied.value.gerente) return false;
    if (applied.value.tipoCliente && g.tipoCliente !== applied.value.tipoCliente) return false;
    if (applied.value.statusOperacao && g.statusOperacao !== applied.value.statusOperacao) return false;
    if (applied.value.possuiParecer === 'Sim' && g.parecerCredito === 'AUSENTE') return false;
    if (applied.value.possuiParecer === 'Não' && g.parecerCredito !== 'AUSENTE') return false;
    if (applied.value.vencMin) {
      const t = parseDateBR(g.vencimentoLimite);
      if (Number.isNaN(t) || t < new Date(applied.value.vencMin).getTime()) return false;
    }
    if (applied.value.vencMax) {
      const t = parseDateBR(g.vencimentoLimite);
      if (Number.isNaN(t) || t > new Date(applied.value.vencMax).getTime()) return false;
    }
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  statusOperacao: 'minmax(130px, 1.3fr)',
  limite: 'minmax(88px, 1fr)',
  limiteAutoatendimento: 'minmax(100px, 1fr)',
  riscoTotal: 'minmax(96px, 1.1fr)',
  gerente: 'minmax(140px, 1.4fr)',
  vencimentoParecer: 'minmax(150px, 1.4fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => `minmax(220px, 2.2fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`);

function handleFilter() {
  applied.value = { ...draft.value };
  setPage(1);
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  setPage(1);
  filterOpen.value = false;
}

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  visibleCols.value = next;
}

function toggleQuickFilter(status: ParecerStatus) {
  quickParecerFilter.value = quickParecerFilter.value === status ? null : status;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function menuActions(g: GrupoEmpresarial) {
  return [
    { icon: Settings2, label: 'Parametrizações', onClick: () => { menuOpenId.value = null; emit('open', g.id); } },
    { icon: Link2, label: 'Vincular a um veículo', onClick: () => { menuOpenId.value = null; vinculando.value = g; } },
    { icon: UserCog, label: 'Transferir gerente', onClick: () => { menuOpenId.value = null; transferindo.value = g; } },
    { icon: BellRing, label: 'Configurar notificações', onClick: () => { menuOpenId.value = null; configurandoNotif.value = g; } },
    { icon: ShieldCheck, label: 'Habilitar para operar', onClick: () => { menuOpenId.value = null; habilitando.value = g; } },
  ];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Risco
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Grupos Empresariais
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados' }}
      </p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="searchQuery"
          placeholder="Buscar por nome"
          style="width: 100%; height: 38px; padding: 0 12px 0 36px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.status"
            :style="{
              height: '38px', padding: '0 14px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
              border: quickParecerFilter === qf.status ? `1px solid ${parecerColor(qf.status)}` : '1px solid var(--border-default)',
              background: quickParecerFilter === qf.status ? `color-mix(in srgb, ${parecerColor(qf.status)} 12%, transparent)` : 'var(--surface-card)',
              color: quickParecerFilter === qf.status ? parecerColor(qf.status) : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.status)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="gap: 8px; height: 38px; padding: 0 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-strong); font-size: var(--text-sm); font-weight: var(--weight-bold)"
            @click="openFilters"
          >
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span v-if="activeFilterCount > 0" style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: 9999px; background: var(--accent-bg); color: var(--accent)">
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" :style="{ color: 'var(--text-muted)', transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              :style="{
                position: 'absolute',
                [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                right: 0,
                zIndex: 31,
                width: '440px',
                maxWidth: 'calc(100vw - 48px)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
                  <input v-model="draft.nome" placeholder="Buscar por nome" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Gerente</div>
                  <select v-model="draft.gerente" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="g in GERENTES_SEED" :key="g.id" :value="g.nome">{{ g.nome }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo de Cliente</div>
                  <select v-model="draft.tipoCliente" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="t in TIPO_CLIENTE_OPTS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status de Operação</div>
                  <select v-model="draft.statusOperacao" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_OPERACAO_OPTS" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Possui Parecer de Crédito</div>
                  <select v-model="draft.possuiParecer" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)">
                    <option value="">Todos</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento do Limite (mín.)</div>
                  <input v-model="draft.vencMin" type="date" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Vencimento do Limite (máx.)</div>
                  <input v-model="draft.vencMax" type="date" style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="handleClear">
                  Limpar
                </button>
                <button class="flex items-center" style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em" @click="handleFilter">
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button class="flex items-center" style="gap: 6px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold)" @click="colsMenuOpen = !colsMenuOpen">
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 220px; padding: 8px">
              <div v-for="c in ALL_COLS" :key="c.key" class="flex items-center grupos-cols-item" style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)" @click="toggleCol(c.key)">
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                {{ c.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid grupos-table-row grupos-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Grupo Empresarial</div>
            <div v-for="c in cols" :key="c.key" :class="{ 'grupos-col-gerente': c.key === 'gerente' }" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div v-if="pageItems.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center">
            <Building2 :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum grupo encontrado</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Ajuste os filtros para ver outros resultados.</div>
          </div>
          <div
            v-for="g in pageItems"
            :key="g.id"
            class="grid items-center grupos-row grupos-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', g.id)"
          >
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ g.nome }}</div>
              <span style="display: inline-block; margin-top: 4px; font-size: 10px; font-weight: var(--weight-semibold); padding: 2px 8px; border-radius: 9999px; background: var(--surface-sunken); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</span>
            </div>
            <div v-if="visibleCols.has('statusOperacao')">
              <span class="flex items-center" :style="{ gap: '6px', width: 'fit-content', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em', padding: '4px 9px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), whiteSpace: 'nowrap' }">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusOperacaoColor(g.statusOperacao) }" />
                {{ g.statusOperacao }}
              </span>
            </div>
            <div v-if="visibleCols.has('limite')" style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">{{ brl(g.limite, { compact: true }) }}</div>
            <div v-if="visibleCols.has('limiteAutoatendimento')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.limiteAutoatendimento, { compact: true }) }}</div>
            <div v-if="visibleCols.has('riscoTotal')" style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(g.riscoTotal, { compact: true }) }}</div>
            <div v-if="visibleCols.has('gerente')" class="grupos-col-gerente" style="color: var(--text-default)">{{ g.gerente }}</div>
            <div v-if="visibleCols.has('vencimentoParecer')" class="flex items-center" style="gap: 8px">
              <span :style="{ fontVariantNumeric: 'tabular-nums', color: g.vencimentoParecer ? 'var(--text-default)' : 'var(--text-muted)' }">
                {{ g.vencimentoParecer ?? 'Não Informado' }}
              </span>
              <Tooltip :content="parecerLabel(g.parecerCredito)">
                <component
                  :is="PARECER_ICON[g.parecerCredito]"
                  :size="15"
                  :stroke-width="2.25"
                  :style="{ color: parecerColor(g.parecerCredito), flexShrink: 0 }"
                />
              </Tooltip>
            </div>
            <div class="flex justify-end" style="position: relative">
              <button class="flex items-center justify-center" :style="{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: 'none', background: menuOpenId === g.id ? 'var(--surface-sunken)' : 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }" @click.stop="menuOpenId = menuOpenId === g.id ? null : g.id">
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === g.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div style="position: absolute; top: 36px; right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 200px; overflow: hidden">
                  <button v-for="action in menuActions(g)" :key="action.label" class="flex items-center grupos-menu-item" style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left" @click.stop="action.onClick">
                    <component :is="action.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
                    {{ action.label }}
                  </button>
                </div>
              </template>
            </div>
          </div>
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

    <TransferirGerenteModal v-if="transferindo" :grupo-nome="transferindo.nome" :gerente-atual="transferindo.gerente" @close="transferindo = null" @confirm="transferindo = null" />
    <ConfigurarNotificacoesModal v-if="configurandoNotif" :grupo-nome="configurandoNotif.nome" @close="configurandoNotif = null" @confirm="configurandoNotif = null" />
    <HabilitarOperarModal v-if="habilitando" :grupo-nome="habilitando.nome" @close="habilitando = null" @confirm="habilitando = null" />
    <VincularAgrupamentoModal
      v-if="vinculando"
      :target="vinculando"
      target-label="Grupo"
      link-key="grupoIds"
      :operacoes="operacoesVinculaveis"
      @update:operacoes="(ops) => { applyGrupoVinculos(vinculando!.id, ops); vinculando = null; }"
      @close="vinculando = null"
    />
  </div>
</template>

<style scoped>
.grupos-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}

.grupos-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.10em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.grupos-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.grupos-row:hover { background: var(--surface-sunken); }
.grupos-cols-item:hover { background: var(--surface-sunken); }
.grupos-menu-item:hover { background: var(--surface-sunken); }

.grupos-col-gerente {
  padding-left: 20px;
}
</style>
```

### GruposScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import GruposListScreen from './GruposListScreen.vue';
import GrupoDetailScreen from './GrupoDetailScreen.vue';
import { GRUPOS_SEED } from '../data/riscoData';

type Route = { level: 'list' } | { level: 'detail'; grupoId: string };

const route = ref<Route>({ level: 'list' });

const grupoAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? GRUPOS_SEED.find((g) => g.id === r.grupoId) : undefined;
});

function openDetail(grupoId: string) {
  route.value = { level: 'detail', grupoId };
}
</script>

<template>
  <GruposListScreen v-if="route.level === 'list'" @open="openDetail" />
  <template v-else>
    <GrupoDetailScreen v-if="grupoAtual" :grupo="grupoAtual" @back="route = { level: 'list' }" />
    <GruposListScreen v-else @open="openDetail" />
  </template>
</template>
```

### RatingsScreen

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Gauge, Pencil } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { RATINGS_SEED, fmtPct, type Rating } from '../data/riscoData';
import CreateRatingModal from '../components/modals/CreateRatingModal.vue';

const COLS = '1fr 1fr 1fr auto';

const ratings = ref<Rating[]>(RATINGS_SEED);
const creating = ref(false);
const editing = ref<Rating | null>(null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => ratings.value,
  { defaultPageSize: 10 },
);

function handleCreate(data: { nome: string; taxa: number }) {
  ratings.value = [
    ...ratings.value,
    { id: `rating-${Date.now()}`, nome: data.nome, taxa: data.taxa, criadoEm: new Date().toLocaleDateString('pt-BR') },
  ];
  creating.value = false;
}

function handleEdit(data: { nome: string; taxa: number }) {
  if (!editing.value) return;
  ratings.value = ratings.value.map((r) => (r.id === editing.value!.id ? { ...r, nome: data.nome, taxa: data.taxa } : r));
  editing.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Identificação + ação primária -->
    <div class="flex items-center justify-between" style="gap: 16px">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Cadastro Global · Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Ratings
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ ratings.length }} {{ ratings.length === 1 ? 'rating cadastrado' : 'ratings cadastrados' }}
        </p>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="gap: 8px; height: 48px; padding: 0 22px; background: var(--agro-base); color: #fff; border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -8px rgba(242,125,38,0.40)"
        @click="creating = true"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVO RATING
      </button>
    </div>

    <!-- Tabela -->
    <div v-if="ratings.length === 0" class="flex flex-col items-center justify-center" style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)">
      <Gauge :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhum rating cadastrado</div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Use "Novo rating" para cadastrar o primeiro indicativo de rating do cliente.</div>
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Nome</div><div>Taxa</div><div>Criado em</div><div style="text-align: right">Ações</div>
      </div>
      <div v-for="r in pageItems" :key="r.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
        <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ r.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ fmtPct(r.taxa) }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ r.criadoEm }}</div>
        <div class="flex justify-end">
          <button
            aria-label="Editar rating"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="editing = r"
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

    <CreateRatingModal v-if="creating" @close="creating = false" @save="handleCreate" />
    <CreateRatingModal v-if="editing" :initial="editing" @close="editing = null" @save="handleEdit" />
  </div>
</template>
```

### RelatoriosScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ArrowLeft, FileSpreadsheet, ChevronRight, Download, ClipboardCheck } from 'lucide-vue-next';
import {
  GRUPOS_SEED, GERENTES_SEED, STATUS_GRUPO_RELATORIO_OPTS, STATUS_PARECER_RELATORIO_OPTS,
  parecerLabel, parecerColor, statusOperacaoColor,
} from '../data/riscoData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

type ReportKey = 'parecer-credito';

interface ReportDef {
  key: ReportKey;
  title: string;
  description: string;
}

const REPORTS: ReportDef[] = [
  {
    key: 'parecer-credito',
    title: 'Relatório de Parecer de Crédito',
    description: 'Situação do parecer de crédito por grupo empresarial, filtrável por status do grupo, gerente e vencimento do parecer.',
  },
];

interface Filters {
  nomeGrupo: string;
  statusGrupo: string;
  gerente: string;
  statusParecer: string;
}

const EMPTY_FILTERS: Filters = { nomeGrupo: '', statusGrupo: '', gerente: '', statusParecer: '' };

function toCsv(rows: { nome: string; documento: string; statusGrupo: string; gerente: string; parecer: string }[]): string {
  const header = ['Nome do Grupo', 'Documento', 'Status do Grupo', 'Gerente', 'Status do Parecer'];
  const lines = rows.map((r) => [r.nome, r.documento, r.statusGrupo, r.gerente, r.parecer].map((v) => `"${v.replace(/"/g, '""')}"`).join(';'));
  return [header.join(';'), ...lines].join('\n');
}

const selected = ref<ReportKey | null>(null);
const hoveredKey = ref<ReportKey | null>(null);
const draft = reactive<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters | null>(null);

const results = computed(() => {
  if (!applied.value) return [];
  const f = applied.value;
  return GRUPOS_SEED.filter((g) => {
    if (f.nomeGrupo && !g.nome.toLowerCase().includes(f.nomeGrupo.toLowerCase())) return false;
    if (f.statusGrupo && g.statusOperacao !== f.statusGrupo) return false;
    if (f.gerente && g.gerente !== f.gerente) return false;
    if (f.statusParecer === 'Vencido' && g.parecerCredito !== 'EXPIRADO') return false;
    if (f.statusParecer === 'A vencer' && !(g.parecerCredito === 'CONFORME' || g.parecerCredito === 'EXPIRANDO')) return false;
    return true;
  });
});

const report = computed(() => REPORTS.find((r) => r.key === selected.value) ?? null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

function selectReport(key: ReportKey) {
  selected.value = key;
  Object.assign(draft, EMPTY_FILTERS);
  applied.value = null;
}

function handleGerar() {
  applied.value = { ...draft };
  setPage(1);
}

function handleExportCsv() {
  const csv = toCsv(results.value.map((g) => ({
    nome: g.nome, documento: g.documento, statusGrupo: g.statusOperacao, gerente: g.gerente, parecer: parecerLabel(g.parecerCredito),
  })));
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-parecer-de-credito.csv';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Risco
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in REPORTS"
        :key="r.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectReport(r.key)"
        @mouseenter="hoveredKey = r.key"
        @mouseleave="hoveredKey = null"
      >
        <div class="flex items-center justify-center" style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)">
          <ClipboardCheck :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">{{ r.title }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">{{ r.description }}</div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === r.key ? 1 : 0,
            transform: hoveredKey === r.key ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button aria-label="Voltar" class="flex items-center justify-center" style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0" @click="selected = null">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · Risco
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">{{ report?.title }}</h2>
      </div>
    </div>

    <!-- Filtros -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome do grupo</div>
          <input
            v-model="draft.nomeGrupo"
            placeholder="Buscar por nome"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status do grupo</div>
          <select
            v-model="draft.statusGrupo"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in STATUS_GRUPO_RELATORIO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Gerente</div>
          <select
            v-model="draft.gerente"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in GERENTES_SEED" :key="o.id" :value="o.nome">{{ o.nome }}</option>
          </select>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status do parecer</div>
          <select
            v-model="draft.statusParecer"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="o in STATUS_PARECER_RELATORIO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="gap: 8px; height: 42px; padding: 0 20px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{ gap: '6px', height: '34px', padding: '0 14px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: results.length === 0 ? 'not-allowed' : 'pointer', color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div v-if="results.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhum grupo encontrado para os filtros selecionados.
      </div>
      <div v-else class="grid" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome do Grupo</div><div>Documento</div><div>Status do Grupo</div><div>Gerente</div><div>Parecer de Crédito</div>
      </div>
      <div v-for="g in pageItems" :key="g.id" class="grid items-center" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ g.documento }}</div>
        <div :style="{ color: statusOperacaoColor(g.statusOperacao), fontWeight: 'var(--weight-semibold)' }">{{ g.statusOperacao }}</div>
        <div style="color: var(--text-default)">{{ g.gerente }}</div>
        <div :style="{ color: parecerColor(g.parecerCredito), fontWeight: 'var(--weight-semibold)' }">{{ parecerLabel(g.parecerCredito) }}</div>
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
```

### RiscoDashboardScreen

```vue
<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Search, AlertTriangle, TrendingDown, Users, Wallet, ChevronRight,
  Clock, XCircle, Building2, BarChart3,
} from 'lucide-vue-next';
import { Bar, Pie } from 'vue-chartjs';
import '@/lib/chart';
import {
  GRUPOS_SEED, brl, fmtPct, statusGrupoPizza,
  isLimiteVencido, isProximoAVencer, temRiscoAtivo, diasEntre,
  type GrupoEmpresarial, type StatusGrupoPizza,
} from '../data/riscoData';
import GrupoDetailScreen from './GrupoDetailScreen.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

type Route = { level: 'dashboard' } | { level: 'detail'; grupoId: string };

const route = ref<Route>({ level: 'dashboard' });
const query = ref('');

const grupoAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? GRUPOS_SEED.find((g) => g.id === r.grupoId) : undefined;
});

function openGrupo(id: string) {
  route.value = { level: 'detail', grupoId: id };
}

const valorVencidoTotal = GRUPOS_SEED.reduce((s, g) => s + g.valorVencido, 0);
const riscoTotalEmpresa = GRUPOS_SEED.reduce((s, g) => s + g.riscoTotal, 0);
const pctVencido = riscoTotalEmpresa > 0 ? (valorVencidoTotal / riscoTotalEmpresa) * 100 : 0;
const clientesRiscoAcimaLimite = GRUPOS_SEED.filter((g) => g.riscoTotal > g.limite).length;
const clientesLimiteVencido = GRUPOS_SEED.filter((g) => g.riscoTotal > 0 && isLimiteVencido(g.vencimentoLimite)).length;
const clientesLimiteAVencer = GRUPOS_SEED.filter((g) => g.riscoTotal > 0 && isProximoAVencer(g.vencimentoLimite) && !isLimiteVencido(g.vencimentoLimite)).length;
const clientesLimiteZerado = GRUPOS_SEED.filter((g) => g.limite === 0).length;
const clientesLimiteSemRisco = GRUPOS_SEED.filter((g) => g.limite > 0 && g.riscoTotal === 0).length;

interface KpiHero {
  icon: Component;
  title: string;
  tone: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

const kpis = computed<KpiHero[]>(() => [
  {
    icon: AlertTriangle,
    title: 'Inadimplência Geral',
    tone: 'var(--danger-base)',
    primaryLabel: 'Valor Vencido',
    primaryValue: brl(valorVencidoTotal),
    secondaryLabel: 'Percentual na carteira',
    secondaryValue: fmtPct(pctVencido),
  },
  {
    icon: TrendingDown,
    title: 'Distribuição de Risco',
    tone: 'var(--agro-base)',
    primaryLabel: 'Risco total aberto',
    primaryValue: brl(riscoTotalEmpresa),
    secondaryLabel: 'Risco acima do limite',
    secondaryValue: String(clientesRiscoAcimaLimite),
  },
  {
    icon: Clock,
    title: 'Risco Vencido',
    tone: 'var(--warning-base)',
    primaryLabel: 'Risco vencido',
    primaryValue: String(clientesLimiteVencido),
    secondaryLabel: 'Risco a vencer',
    secondaryValue: String(clientesLimiteAVencer),
  },
  {
    icon: Users,
    title: 'Limite x Risco',
    tone: 'var(--gci-base)',
    primaryLabel: 'Limite zerado',
    primaryValue: String(clientesLimiteZerado),
    secondaryLabel: 'Limite s/ risco',
    secondaryValue: String(clientesLimiteSemRisco),
  },
]);

interface RiscoRow {
  grupo: GrupoEmpresarial;
  dias: number;
}

const riscoLimiteVencido = computed<RiscoRow[]>(() =>
  GRUPOS_SEED
    .filter((g) => temRiscoAtivo(g) && isLimiteVencido(g.vencimentoLimite))
    .map((g) => ({ grupo: g, dias: diasEntre(g.vencimentoLimite) }))
    .sort((a, b) => b.dias - a.dias),
);

const riscoLimiteProximo = computed<RiscoRow[]>(() =>
  GRUPOS_SEED
    .filter((g) => temRiscoAtivo(g) && isProximoAVencer(g.vencimentoLimite) && !isLimiteVencido(g.vencimentoLimite))
    .map((g) => ({ grupo: g, dias: -diasEntre(g.vencimentoLimite) }))
    .sort((a, b) => a.dias - b.dias),
);

const {
  page: vencidoPage,
  pageSize: vencidoPageSize,
  total: vencidoTotal,
  pageItems: vencidoPageItems,
  setPage: setVencidoPage,
  setPageSize: setVencidoPageSize,
} = useTablePagination(() => riscoLimiteVencido.value, { defaultPageSize: 10 });

const {
  page: proximoPage,
  pageSize: proximoPageSize,
  total: proximoTotal,
  pageItems: proximoPageItems,
  setPage: setProximoPage,
  setPageSize: setProximoPageSize,
} = useTablePagination(() => riscoLimiteProximo.value, { defaultPageSize: 10 });

const ratingsUnicos = [...new Set(GRUPOS_SEED.map((g) => g.rating).filter((r) => r !== 'NÃO SE APLICA'))];

const CHART_LIMITE_COLORS = ['#083C4A', '#0E5668', '#147088', '#1A8AA8', '#2196AC', '#28A8C0'];
const CHART_LIMITE_HOVER = ['#062D38', '#0B4656', '#105E72', '#15768E', '#1A8EAA', '#1FA6C6'];
const CHART_RISCO_COLORS = ['#F27D26', '#F58A3A', '#F8974E', '#FBA462', '#FEB176', '#FFBE8A'];
const CHART_RISCO_HOVER = ['#D96E1A', '#E07A28', '#E78636', '#EE9244', '#F59E52', '#FCAA60'];

const RISCO_TABLE_GRID = 'minmax(140px, 2fr) minmax(76px, 0.9fr) minmax(76px, 0.9fr) minmax(100px, 1.05fr) minmax(72px, 0.8fr)';

const limitePorRating = computed(() => {
  const map = new Map<string, number>();
  for (const g of GRUPOS_SEED) {
    if (g.rating === 'NÃO SE APLICA') continue;
    map.set(g.rating, (map.get(g.rating) ?? 0) + g.limite);
  }
  const labels = ratingsUnicos.filter((r) => map.has(r));
  return {
    labels,
    datasets: [{
      label: 'Limite',
      data: labels.map((l) => map.get(l) ?? 0),
      backgroundColor: labels.map((_, i) => CHART_LIMITE_COLORS[i % CHART_LIMITE_COLORS.length]),
      hoverBackgroundColor: labels.map((_, i) => CHART_LIMITE_HOVER[i % CHART_LIMITE_HOVER.length]),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    }],
  };
});

const riscoPorRating = computed(() => {
  const map = new Map<string, number>();
  for (const g of GRUPOS_SEED) {
    if (g.rating === 'NÃO SE APLICA') continue;
    map.set(g.rating, (map.get(g.rating) ?? 0) + g.riscoTotal);
  }
  const labels = ratingsUnicos.filter((r) => map.has(r));
  return {
    labels,
    datasets: [{
      label: 'Risco',
      data: labels.map((l) => map.get(l) ?? 0),
      backgroundColor: labels.map((_, i) => CHART_RISCO_COLORS[i % CHART_RISCO_COLORS.length]),
      hoverBackgroundColor: labels.map((_, i) => CHART_RISCO_HOVER[i % CHART_RISCO_HOVER.length]),
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 44,
    }],
  };
});

const STATUS_PIZZA_LABELS: StatusGrupoPizza[] = ['Normal', 'Recovery', 'Especial', 'Terceiro'];
const STATUS_PIZZA_COLORS = ['#059669', '#D97706', '#64748B', '#083C4A'];
const STATUS_PIZZA_HOVER = ['#047857', '#B45309', '#475569', '#062D38'];

const riscoPorStatus = computed(() => {
  const map = new Map<StatusGrupoPizza, number>();
  for (const g of GRUPOS_SEED) {
    const bucket = statusGrupoPizza(g.statusOperacao);
    map.set(bucket, (map.get(bucket) ?? 0) + g.riscoTotal);
  }
  return {
    labels: STATUS_PIZZA_LABELS,
    datasets: [{
      data: STATUS_PIZZA_LABELS.map((l) => map.get(l) ?? 0),
      backgroundColor: STATUS_PIZZA_COLORS,
      hoverBackgroundColor: STATUS_PIZZA_HOVER,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      hoverOffset: 10,
    }],
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (ctx: { parsed: { y: number } }) => ` ${brl(ctx.parsed.y, { compact: true })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748B', font: { size: 11, weight: '600' as const } },
    },
    y: {
      grid: { color: '#E3E9ED', drawTicks: false },
      border: { display: false },
      ticks: {
        color: '#94A3AC',
        font: { size: 10 },
        padding: 8,
        callback: (v: number | string) => brl(Number(v), { compact: true }),
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '52%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#64748B',
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 11, weight: '600' as const },
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFB',
      bodyColor: '#F8FAFB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: { label: string; parsed: number }) => ` ${ctx.label}: ${brl(ctx.parsed, { compact: true })}`,
      },
    },
  },
};

const searchResults = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return GRUPOS_SEED.filter((g) => g.nome.toLowerCase().includes(q) || g.documento.includes(q)).slice(0, 6);
});

function handleSearchSelect(id: string) {
  openGrupo(id);
  query.value = '';
}
</script>

<template>
  <GrupoDetailScreen v-if="grupoAtual" :grupo="grupoAtual" @back="route = { level: 'dashboard' }" />
  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Dashboard
        </h1>
      </div>

      <div style="position: relative; width: 320px">
        <Search :size="15" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="query"
          placeholder="Buscar grupo por nome ou documento"
          style="width: 100%; height: 42px; padding: 0 14px 0 38px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
        <div
          v-if="searchResults.length > 0"
          style="position: absolute; top: 46px; left: 0; right: 0; z-index: 40; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden"
        >
          <button
            v-for="g in searchResults"
            :key="g.id"
            class="flex items-center justify-between risco-search-item"
            style="width: 100%; padding: 10px 14px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
            @click="handleSearchSelect(g.id)"
          >
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</div>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted)" />
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards (mesmo visual do Dashboard de Cobrança) -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 20px;
        "
      >
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="18" />
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ kpi.title }}
          </div>
        </div>
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          {{ kpi.primaryLabel }}
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            color: kpi.tone,
            marginBottom: '14px',
          }"
        >
          {{ kpi.primaryValue }}
        </div>
        <div class="flex items-center justify-between" style="padding-top: 12px; border-top: 1px solid var(--border-default)">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ kpi.secondaryValue }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabelas -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <XCircle :size="16" style="color: var(--danger-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco ativo c/ limite vencido</h3>
        </div>
        <div v-if="riscoLimiteVencido.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhum cliente nesta condição.
        </div>
        <template v-else>
          <div class="grid risco-data-table" :style="{ gridTemplateColumns: RISCO_TABLE_GRID }">
            <div>Grupo</div><div class="risco-col-num">Limite</div><div class="risco-col-num">Risco</div><div class="risco-col-date">Vencimento</div><div class="risco-col-num">Dias Venc.</div>
          </div>
          <button
            v-for="row in vencidoPageItems"
            :key="row.grupo.id"
            class="grid items-center risco-queue-row risco-data-table"
            :style="{ gridTemplateColumns: RISCO_TABLE_GRID }"
            @click="openGrupo(row.grupo.id)"
          >
            <div class="risco-col-name">{{ row.grupo.nome }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.limite, { compact: true }) }}</div>
            <div class="risco-col-num risco-col-danger">{{ brl(row.grupo.riscoTotal, { compact: true }) }}</div>
            <div class="risco-col-date">{{ row.grupo.vencimentoLimite }}</div>
            <div class="risco-col-num risco-col-danger">{{ row.dias }}</div>
          </button>
          <TablePagination
            :total="vencidoTotal"
            :page="vencidoPage"
            :page-size="vencidoPageSize"
            @update:page="setVencidoPage"
            @update:page-size="setVencidoPageSize"
          />
        </template>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <Clock :size="16" style="color: var(--warning-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco ativo c/ limite próximo a vencer</h3>
        </div>
        <div v-if="riscoLimiteProximo.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
          Nenhum cliente nesta condição.
        </div>
        <template v-else>
          <div class="grid risco-data-table" :style="{ gridTemplateColumns: RISCO_TABLE_GRID }">
            <div>Grupo</div><div class="risco-col-num">Limite</div><div class="risco-col-num">Risco</div><div class="risco-col-date">Vencimento</div><div class="risco-col-num">Dias p/ Venc.</div>
          </div>
          <button
            v-for="row in proximoPageItems"
            :key="row.grupo.id"
            class="grid items-center risco-queue-row risco-data-table"
            :style="{ gridTemplateColumns: RISCO_TABLE_GRID }"
            @click="openGrupo(row.grupo.id)"
          >
            <div class="risco-col-name">{{ row.grupo.nome }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.limite, { compact: true }) }}</div>
            <div class="risco-col-num">{{ brl(row.grupo.riscoTotal, { compact: true }) }}</div>
            <div class="risco-col-date">{{ row.grupo.vencimentoLimite }}</div>
            <div class="risco-col-num risco-col-warning">{{ row.dias }}</div>
          </button>
          <TablePagination
            :total="proximoTotal"
            :page="proximoPage"
            :page-size="proximoPageSize"
            @update:page="setProximoPage"
            @update:page-size="setProximoPageSize"
          />
        </template>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: start">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Limite por Rating</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="limitePorRating" :options="barOptions" />
        </div>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco por Rating</h3>
        </div>
        <div style="height: 220px">
          <Bar :data="riscoPorRating" :options="barOptions" />
        </div>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <Wallet :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Risco por Status de Grupo</h3>
        </div>
        <div style="height: 220px">
          <Pie :data="riscoPorStatus" :options="pieOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.risco-search-item:hover,
.risco-queue-row:hover {
  background: var(--surface-sunken);
}

.risco-data-table {
  column-gap: 16px;
  width: 100%;
  padding: 10px 16px;
  font-size: var(--text-sm);
  text-align: left;
}

.risco-data-table:first-of-type {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.risco-queue-row.risco-data-table {
  padding: 12px 16px;
  background: none;
  border: none;
  border-top: 1px solid var(--border-default);
  cursor: pointer;
}

.risco-col-name {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.risco-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.risco-col-date {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

.risco-col-danger {
  color: var(--danger-base);
  font-weight: var(--weight-bold);
}

.risco-col-warning {
  color: var(--warning-base);
  font-weight: var(--weight-bold);
}
</style>
```

## Screens / detail-tabs

### AutoatendimentoSubTab

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { Zap, MoreVertical, Percent, X } from 'lucide-vue-next';
import {
  type ParametrizacaoAutoatendimento,
  type VeiculoOperacao,
} from '../../data/riscoData';
import { rememberVeiculosMeta } from '../../data/vinculosStore';
import { TabCard, FieldLabel, EmptyState } from './shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoAutoatendimento;
  grupoId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoAutoatendimento] }>();

const form = reactive<ParametrizacaoAutoatendimento>({
  ...props.data,
  veiculosOperacao: props.data.veiculosOperacao.map((v) => ({ ...v })),
});

watch(
  () => props.data,
  (data) => {
    form.limiteOperacoesAutomaticas = data.limiteOperacoesAutomaticas;
    form.taxaFee = data.taxaFee;
    form.taxaRisco = data.taxaRisco;
    form.veiculosOperacao = data.veiculosOperacao.map((v) => ({ ...v }));
  },
  { deep: true },
);

const TABLE_GRID = '1fr 1.4fr 110px 44px';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => form.veiculosOperacao,
  { defaultPageSize: 5 },
);

const menuOpenId = ref<string | null>(null);
const editandoTaxa = ref<VeiculoOperacao | null>(null);
const taxaDraft = ref('');

function formatPct(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

function parsePct(value: string): number {
  return Number(value.replace('%', '').replace(',', '.')) || 0;
}

function handleMoneyInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.limiteOperacoesAutomaticas = Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handlePctInput(field: 'taxaFee' | 'taxaRisco', e: Event) {
  const target = e.target as HTMLInputElement;
  form[field] = Number(target.value.replace('%', '').replace(',', '.')) || 0;
}

function setPreferencial(id: string) {
  form.veiculosOperacao = form.veiculosOperacao.map((v) => ({
    ...v,
    preferencial: v.id === id ? !v.preferencial : false,
  }));
}

function openAlterarTaxa(v: VeiculoOperacao) {
  menuOpenId.value = null;
  editandoTaxa.value = v;
  taxaDraft.value = formatPct(v.taxaCessaoPadrao);
}

function confirmarTaxa() {
  if (!editandoTaxa.value) return;
  const id = editandoTaxa.value.id;
  const taxa = parsePct(taxaDraft.value);
  form.veiculosOperacao = form.veiculosOperacao.map((v) =>
    v.id === id ? { ...v, taxaCessaoPadrao: taxa } : v,
  );
  editandoTaxa.value = null;
}

function handleSave() {
  rememberVeiculosMeta(props.grupoId, form.veiculosOperacao);
  emit('save', {
    limiteOperacoesAutomaticas: form.limiteOperacoesAutomaticas,
    taxaFee: form.taxaFee,
    taxaRisco: form.taxaRisco,
    veiculosOperacao: form.veiculosOperacao.map((v) => ({ ...v })),
  });
}

function handleClickOutside(e: MouseEvent) {
  const el = e.target as HTMLElement | null;
  if (el?.closest?.('[data-veiculo-menu]')) return;
  menuOpenId.value = null;
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

const emptyHint = computed(() =>
  'Vincule veículos ao grupo pela ação “Vincular a um veículo” para listá-los aqui.',
);
</script>

<template>
  <TabCard title="Autoatendimento" :icon="Zap" has-save @save="handleSave">
    <div class="flex flex-col" style="gap: 20px">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <div>
          <FieldLabel>Limite p/ operações automáticas</FieldLabel>
          <input
            type="text"
            :value="form.limiteOperacoesAutomaticas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handleMoneyInput"
          />
        </div>
        <div>
          <FieldLabel>Taxa fee padrão</FieldLabel>
          <input
            type="text"
            :value="`${form.taxaFee.toFixed(2).replace('.', ',')}%`"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handlePctInput('taxaFee', $event)"
          />
        </div>
        <div>
          <FieldLabel>Taxa de risco padrão</FieldLabel>
          <input
            type="text"
            :value="`${form.taxaRisco.toFixed(2).replace('.', ',')}%`"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
            @input="handlePctInput('taxaRisco', $event)"
          />
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-default); padding-top: 16px">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
          Veículos de Operação Preferencial
        </div>
        <EmptyState
          v-if="form.veiculosOperacao.length === 0"
          :icon="Zap"
          title="Nenhum veículo vinculado"
          :hint="emptyHint"
        />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: visible">
          <div
            class="grid items-center autoatendimento-table-row autoatendimento-table-header"
            :style="{ gridTemplateColumns: TABLE_GRID }"
          >
            <div class="col-num">Taxa cessão</div>
            <div class="col-veiculo">Veículo</div>
            <div class="col-preferencial">Preferencial</div>
            <div />
          </div>
          <div
            v-for="v in pageItems"
            :key="v.id"
            class="grid items-center autoatendimento-table-row"
            :style="{ gridTemplateColumns: TABLE_GRID }"
          >
            <div class="col-num">{{ formatPct(v.taxaCessaoPadrao) }}</div>
            <div class="col-veiculo">{{ v.veiculo }}</div>
            <div class="col-preferencial">
              <button
                type="button"
                role="switch"
                :aria-checked="v.preferencial"
                :aria-label="`Marcar ${v.veiculo} como preferencial`"
                class="preferencial-toggle"
                :class="{ 'preferencial-toggle--on': v.preferencial }"
                @click="setPreferencial(v.id)"
              >
                <span class="preferencial-toggle__knob" />
              </button>
            </div>
            <div class="flex justify-end" style="position: relative" data-veiculo-menu>
              <button
                aria-label="Ações do veículo"
                class="flex items-center justify-center"
                style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                @click.stop="menuOpenId = menuOpenId === v.id ? null : v.id"
              >
                <MoreVertical :size="15" />
              </button>
              <div
                v-if="menuOpenId === v.id"
                class="flex flex-col"
                style="position: absolute; top: 32px; right: 0; z-index: 40; min-width: 200px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
              >
                <button
                  class="flex items-center veiculo-action-item"
                  style="gap: 10px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                  @click="openAlterarTaxa(v)"
                >
                  <Percent :size="15" style="color: var(--text-muted)" />
                  Alterar Taxa de Cessão
                </button>
              </div>
            </div>
          </div>
          <TablePagination
            sunken
            compact
            :total="total"
            :page="page"
            :page-size="pageSize"
            :page-size-options="[5, 10, 25]"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>
      </div>
    </div>
  </TabCard>

  <div
    v-if="editandoTaxa"
    style="
      position: fixed; inset: 0; z-index: 450;
      background: rgba(8,60,74,0.45); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 24px;
    "
    @click.self="editandoTaxa = null"
  >
    <div
      style="
        width: 100%; max-width: 420px;
        background: var(--surface-card); border-radius: var(--radius-xl);
        border: 1px solid var(--border-default); box-shadow: var(--shadow-lg); overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 18px 20px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h3 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">Alterar Taxa de Cessão</h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">{{ editandoTaxa.veiculo }}</p>
        </div>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="editandoTaxa = null">
          <X :size="18" />
        </button>
      </div>
      <div style="padding: 20px">
        <FieldLabel>Taxa de cessão padrão</FieldLabel>
        <input
          v-model="taxaDraft"
          placeholder="0,00%"
          style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
      </div>
      <div class="flex justify-end" style="gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border-default)">
        <button
          style="height: 40px; padding: 0 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="editandoTaxa = null"
        >
          Cancelar
        </button>
        <button
          style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="confirmarTaxa"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autoatendimento-table-row {
  width: 100%;
  column-gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.autoatendimento-table-header {
  border-top: none;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.col-num {
  text-align: left;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.col-veiculo {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.autoatendimento-table-header .col-veiculo {
  font-weight: var(--weight-bold);
  color: var(--text-muted);
}

.col-preferencial {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
}

.preferencial-toggle {
  position: relative;
  width: 34px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 9999px;
  background: var(--border-strong);
  cursor: pointer;
  transition: background var(--duration-base);
  flex-shrink: 0;
}

.preferencial-toggle--on {
  background: var(--success-base);
}

.preferencial-toggle__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: #fff;
  transition: left var(--duration-base);
  box-shadow: var(--shadow-xs);
}

.preferencial-toggle--on .preferencial-toggle__knob {
  left: 16px;
}

.veiculo-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### CedentesTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Users } from 'lucide-vue-next';
import type { Cedente } from '../../data/riscoData';
import { EmptyState } from './shared';
import CedenteDetailModal from '../../components/modals/CedenteDetailModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  cedentes: Cedente[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update-cedente': [cedente: Cedente] }>();

const COLS = '1.2fr 1.8fr 1.6fr 1fr 1fr';

const selecionadoId = ref<string | null>(null);
const selecionado = computed(() => props.cedentes.find((c) => c.id === selecionadoId.value) ?? null);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.cedentes,
  { defaultPageSize: 10 },
);
</script>

<template>
  <EmptyState v-if="cedentes.length === 0" :icon="Users" title="Nenhum cedente vinculado" hint="Este grupo ainda não possui cedentes cadastrados." />
  <template v-else>
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
        <div>Documento</div><div>Nome</div><div>E-mail</div><div>Cidade-UF</div><div>Tipo</div>
      </div>
      <div
        v-for="c in pageItems"
        :key="c.id"
        class="grid items-center cedentes-row"
        :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
        @click="selecionadoId = c.id"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ c.documento }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
        <div :style="{ color: c.email ? 'var(--text-default)' : 'var(--text-muted)' }">{{ c.email ?? 'Não cadastrado' }}</div>
        <div style="color: var(--text-default)">{{ c.cidade }}-{{ c.uf }}</div>
        <div style="color: var(--text-default)">{{ c.tipo }}</div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <CedenteDetailModal
      v-if="selecionado"
      :cedente="selecionado"
      @close="selecionadoId = null"
      @update="emit('update-cedente', $event)"
    />
  </template>
</template>

<style scoped>
.cedentes-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### DetalhesTab

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { Users, FileText, Star, UserCog, Eye, RefreshCw } from 'lucide-vue-next';
import {
  RATINGS_SEED, gerentePorNome, type GrupoEmpresarial,
  type ParteRelacionada, type ParametrizacaoLimite,
} from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  grupo: GrupoEmpresarial;
  partesRelacionadas: ParteRelacionada[];
  limite: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:limite': [data: ParametrizacaoLimite]; 'update:rating': [rating: string] }>();

const form = reactive({ ...props.limite });
const gerente = gerentePorNome(props.grupo.gerente);
const RATING_OPTS = [...RATINGS_SEED.map((r) => r.nome), 'NÃO SE APLICA'];

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.partesRelacionadas,
  { defaultPageSize: 5 },
);

function saveRating() {
  emit('update:limite', { ...form });
  emit('update:rating', form.indicativoRating);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Partes Relacionadas" :icon="Users">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Nome</div><div>Documento</div><div>E-mail</div><div>Telefone</div><div>Estado Civil</div>
        </div>
        <div v-for="p in pageItems" :key="p.id" class="grid items-center" style="grid-template-columns: 1.4fr 1fr 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ p.papel }}</div>
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ p.documento }}</div>
          <div style="color: var(--text-default)">{{ p.email }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ p.telefone }}</div>
          <div style="color: var(--text-default)">{{ p.estadoCivil }}</div>
        </div>
        <TablePagination
          v-if="partesRelacionadas.length > 0"
          sunken
          compact
          :total="total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </TabCard>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <TabCard title="Parecer de Crédito" :icon="FileText">
        <div v-if="form.parecerCreditoArquivo" class="flex flex-col" style="gap: 12px">
          <div class="flex items-center justify-between" style="padding: 14px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-sunken)">
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ form.parecerCreditoArquivo }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Atualizado em {{ form.parecerAtualizadoEm ?? '—' }}</div>
            </div>
            <div class="flex items-center" style="gap: 4px">
              <button aria-label="Visualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <Eye :size="14" />
              </button>
              <button aria-label="Atualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <RefreshCw :size="14" />
              </button>
            </div>
          </div>
          <div>
            <FieldLabel>Próximo vencimento</FieldLabel>
            <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ form.parecerProximoVencimento ?? 'Não Informado' }}</div>
          </div>
        </div>
        <div v-else style="padding: 20px; border: 1px dashed var(--danger-base); border-radius: var(--radius-lg); background: var(--status-danger-bg); text-align: center">
          <span style="font-size: var(--text-sm); color: var(--danger-base); font-weight: var(--weight-semibold)">Nenhum parecer anexado</span>
        </div>
      </TabCard>

      <TabCard title="Rating do Cliente" :icon="Star" has-save @save="saveRating">
        <SelectField
          label="Indicativo de rating"
          :options="RATING_OPTS"
          :value="form.indicativoRating"
          @change="form.indicativoRating = ($event.target as HTMLSelectElement).value"
        />
      </TabCard>
    </div>

    <TabCard v-if="gerente" title="Gerente do Grupo" :icon="UserCog">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <div>
          <FieldLabel>Nome</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">{{ gerente.nome }}</div>
        </div>
        <div>
          <FieldLabel>Documento</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ gerente.documento }}</div>
        </div>
        <div>
          <FieldLabel>Telefone</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ gerente.telefone }}</div>
        </div>
        <div>
          <FieldLabel>Cidade</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default)">{{ gerente.cidade }}</div>
        </div>
        <div>
          <FieldLabel>Estado</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default)">{{ gerente.uf }}</div>
        </div>
      </div>
    </TabCard>
  </div>
</template>
```

### GarantiaSubTab

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { ShieldCheck, Trash2, MoreVertical, Pencil } from 'lucide-vue-next';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type ParametrizacaoGarantia, type GarantiaRow, type FrequenciaLaudo, type TipoGarantia,
} from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, SelectField, AddButton, EmptyState } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';
import EditarGarantiaModal from '../../components/modals/EditarGarantiaModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoGarantia;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoGarantia] }>();
const form = reactive<ParametrizacaoGarantia>({ ...props.data, garantias: [...props.data.garantias] });

const garTipo = ref<TipoGarantia | ''>('');
const garPct = ref('');
const garPrazo = ref('');
const garFreq = ref<FrequenciaLaudo>('Semestral');
const garEscritura = ref(false);
const garProtocolo = ref(false);
const editingGarantia = ref<GarantiaRow | null>(null);
const openMenuId = ref<string | null>(null);

const GARANTIA_TABLE_GRID = 'minmax(120px, 1.2fr) minmax(72px, 0.7fr) minmax(72px, 0.7fr) minmax(100px, 1fr) minmax(80px, 0.7fr) minmax(80px, 0.7fr) 40px';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => form.garantias,
  { defaultPageSize: 5 },
);

function handlePercentualInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.percentualGarantia = Number(target.value.replace('%', '')) || 0;
}

function addGarantia() {
  if (!garTipo.value) return;
  const nova: GarantiaRow = {
    id: `gar-${Date.now()}`,
    tipo: garTipo.value,
    percentualExigido: Number(garPct.value.replace(',', '.')) || 0,
    prazoLaudoDias: Number(garPrazo.value) || 0,
    frequenciaLaudo: garFreq.value,
    exigeEscrituraPublica: garEscritura.value,
    exigeProtocolo: garProtocolo.value,
  };
  form.garantias = [...form.garantias, nova];
  garTipo.value = '';
  garPct.value = '';
  garPrazo.value = '';
  garEscritura.value = false;
  garProtocolo.value = false;
  emit('save', { ...form, garantias: [...form.garantias] });
}

function removeGarantia(id: string) {
  form.garantias = form.garantias.filter((g) => g.id !== id);
  openMenuId.value = null;
  emit('save', { ...form, garantias: [...form.garantias] });
}

function openEditModal(row: GarantiaRow) {
  editingGarantia.value = row;
  openMenuId.value = null;
}

function handleEditConfirm(updated: GarantiaRow) {
  form.garantias = form.garantias.map((g) => (g.id === updated.id ? updated : g));
  editingGarantia.value = null;
  emit('save', { ...form, garantias: [...form.garantias] });
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-garantia-action-menu]')) {
    openMenuId.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <TabCard title="Garantias" :icon="ShieldCheck" has-save @save="emit('save', { ...form, garantias: [...form.garantias] })">
    <div class="flex flex-col" style="gap: 16px">
      <ToggleRow
        label="Títulos cedidos em garantia necessitam de confirmação"
        hint="Exige confirmação formal dos títulos oferecidos como garantia antes da liberação da operação."
        :on="form.requerConfirmacaoTitulos"
        @toggle="form.requerConfirmacaoTitulos = !form.requerConfirmacaoTitulos"
      />
      <div v-if="form.requerConfirmacaoTitulos" style="max-width: 240px">
        <FieldLabel>Percentual mínimo de garantia</FieldLabel>
        <input
          type="text"
          :value="`${form.percentualGarantia.toFixed(0)}%`"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums"
          @input="handlePercentualInput"
        />
      </div>
      <ToggleRow
        label="Indicativo se cliente tem garantias obrigatórias para operação"
        :on="form.garantiasObrigatorias"
        @toggle="form.garantiasObrigatorias = !form.garantiasObrigatorias"
      />

      <div style="border-top: 1px solid var(--border-default); padding-top: 16px">
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">Lista de garantias obrigatórias para operação</div>
        <div class="grid items-end" style="grid-template-columns: 1.2fr 0.7fr 0.7fr 1fr 0.7fr 0.7fr auto; gap: 10px; margin-bottom: 12px">
          <div>
            <FieldLabel>Tipo da garantia</FieldLabel>
            <select
              v-model="garTipo"
              style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
            >
              <option value="">Selecione</option>
              <option v-for="t in TIPO_GARANTIA_OPTS" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div>
            <FieldLabel>Percentual exigido</FieldLabel>
            <input v-model="garPct" placeholder="0%" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Prazo laudos (dias)</FieldLabel>
            <input v-model="garPrazo" type="number" placeholder="15" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <SelectField label="Frequência laudos" :options="FREQUENCIA_LAUDO_OPTS" :value="garFreq" @change="garFreq = ($event.target as HTMLSelectElement).value as FrequenciaLaudo" />
          </div>
          <div class="flex flex-col items-center" style="gap: 4px">
            <FieldLabel>Exige Escritura</FieldLabel>
            <Checkbox :checked="garEscritura" @change="garEscritura = !garEscritura" />
          </div>
          <div class="flex flex-col items-center" style="gap: 4px">
            <FieldLabel>Exige Protocolo</FieldLabel>
            <Checkbox :checked="garProtocolo" @change="garProtocolo = !garProtocolo" />
          </div>
          <AddButton @click="addGarantia" />
        </div>

        <EmptyState v-if="form.garantias.length === 0" :icon="ShieldCheck" title="Nenhuma garantia cadastrada" hint="Use o formulário acima para adicionar garantias." />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid items-center garantia-table-row garantia-table-header" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
            <div>Tipo</div><div class="garantia-col-num">Percentual</div><div class="garantia-col-num">Prazo</div><div class="garantia-col-freq">Frequência</div><div>Exige Escritura</div><div>Exige Protocolo</div><div />
          </div>
          <div v-for="g in pageItems" :key="g.id" class="grid items-center garantia-table-row" :style="{ gridTemplateColumns: GARANTIA_TABLE_GRID }">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
            <div class="garantia-col-num">{{ g.percentualExigido }}%</div>
            <div class="garantia-col-num">{{ g.prazoLaudoDias }}d</div>
            <div class="garantia-col-freq">{{ g.frequenciaLaudo }}</div>
            <div>{{ g.exigeEscrituraPublica ? 'Sim' : 'Não' }}</div>
            <div>{{ g.exigeProtocolo ? 'Sim' : 'Não' }}</div>
            <div class="flex justify-end" style="position: relative" data-garantia-action-menu>
              <button
                aria-label="Ações"
                class="flex items-center justify-center"
                style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                @click="toggleMenu(g.id)"
              >
                <MoreVertical :size="14" />
              </button>
              <div
                v-if="openMenuId === g.id"
                class="flex flex-col"
                style="position: absolute; top: 28px; right: 0; z-index: 50; min-width: 140px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
              >
                <button
                  class="flex items-center garantia-action-item"
                  style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                  @click="openEditModal(g)"
                >
                  <Pencil :size="14" style="color: var(--text-muted)" />
                  Editar
                </button>
                <button
                  class="flex items-center garantia-action-item"
                  style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                  @click="removeGarantia(g.id)"
                >
                  <Trash2 :size="14" />
                  Deletar
                </button>
              </div>
            </div>
          </div>
          <TablePagination
            sunken
            compact
            :total="total"
            :page="page"
            :page-size="pageSize"
            :page-size-options="[5, 10, 25]"
            @update:page="setPage"
            @update:page-size="setPageSize"
          />
        </div>
      </div>
    </div>
  </TabCard>

  <EditarGarantiaModal
    v-if="editingGarantia"
    :garantia="editingGarantia"
    @close="editingGarantia = null"
    @confirm="handleEditConfirm"
  />
</template>

<style scoped>
.garantia-table-row {
  column-gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.garantia-table-header {
  border-top: none;
  padding: 10px 16px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.garantia-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.garantia-col-freq {
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

.garantia-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### GeralSubTab

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ClipboardCheck, Users, Truck, ShieldCheck, UserCheck, Trash2 } from 'lucide-vue-next';
import { type ParametrizacaoGeral, type ExcecaoConcentracao, type ParteRelacionada } from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, PctInput, DiasInput, EmptyState, AddButton } from './shared';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoGeral;
  partesRelacionadas: ParteRelacionada[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [data: ParametrizacaoGeral];
  'update:partes-relacionadas': [data: ParteRelacionada[]];
}>();

const form = reactive<ParametrizacaoGeral>({ ...props.data });
const partes = reactive<ParteRelacionada[]>(props.partesRelacionadas.map((p) => ({ ...p })));
const excSacadoDoc = ref('');
const excSacadoNome = ref('');
const excPct = ref('');

const {
  page: excecoesPage,
  pageSize: excecoesPageSize,
  total: excecoesTotal,
  pageItems: excecoesPageItems,
  setPage: setExcecoesPage,
  setPageSize: setExcecoesPageSize,
} = useTablePagination(() => form.excecoesConcentracao, { defaultPageSize: 5 });

const {
  page: partesPage,
  pageSize: partesPageSize,
  total: partesTotal,
  pageItems: partesPageItems,
  setPage: setPartesPage,
  setPageSize: setPartesPageSize,
} = useTablePagination(() => partes, { defaultPageSize: 5 });

function addExcecao() {
  if (!excSacadoNome.value.trim() || !excPct.value) return;
  const nova: ExcecaoConcentracao = {
    id: `exc-${Date.now()}`,
    sacadoDocumento: excSacadoDoc.value,
    sacadoNome: excSacadoNome.value,
    percentual: Number(excPct.value.replace(',', '.')) || 0,
  };
  form.excecoesConcentracao = [...form.excecoesConcentracao, nova];
  excSacadoDoc.value = '';
  excSacadoNome.value = '';
  excPct.value = '';
}

function removeExcecao(id: string) {
  form.excecoesConcentracao = form.excecoesConcentracao.filter((e) => e.id !== id);
}

function toggleConjugeAnuente(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], conjugeAnuente: !partes[idx].conjugeAnuente };
}

function toggleAssinaturaObrigatoria(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], assinaturaObrigatoria: !partes[idx].assinaturaObrigatoria };
}

function toggleAceitaRestritivo(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const next = !partes[idx].aceitaRestritivo;
    partes[idx] = { ...partes[idx], aceitaRestritivo: next, valorRestritivoAceito: next ? partes[idx].valorRestritivoAceito : 0 };
  }
}

function handleRestritivoInput(id: string, e: Event) {
  const target = e.target as HTMLInputElement;
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    partes[idx] = {
      ...partes[idx],
      valorRestritivoAceito: Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0,
    };
  }
}

function handleSaveGeral() {
  emit('save', form);
}

function handleSavePartes() {
  emit('update:partes-relacionadas', partes.map((p) => ({ ...p })));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Confirmações" :icon="ClipboardCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pré-Desembolso" :value="form.confirmacaoPreDesembolsoPct" @change="form.confirmacaoPreDesembolsoPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pós-Desembolso (Clientes Novos)" :value="form.confirmacaoClientesNovosPct" @change="form.confirmacaoClientesNovosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pós-Desembolso (Clientes Antigos)" :value="form.confirmacaoClientesAntigosPct" @change="form.confirmacaoClientesAntigosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="* Dias Confirmação dos Ativos (Dias)" :value="form.prazoConfirmacaoTitulosDias" @change="form.prazoConfirmacaoTitulosDias = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Notificações" :icon="Users">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 4">
          <PctInput label="* Notificação de sacados" :value="form.notificacaoSacadosPct" @change="form.notificacaoSacadosPct = $event" />
        </div>
        <div style="grid-column: span 4">
          <DiasInput label="Prazo para confirmação dos sacados" :value="form.prazoConfirmacaoSacadosDias" @change="form.prazoConfirmacaoSacadosDias = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Concentração de Sacados" :icon="UserCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px; margin-bottom: 16px">
        <div style="grid-column: span 5">
          <PctInput label="* Concentração de sacados" :value="form.concentracaoMaximaSacadoPct" @change="form.concentracaoMaximaSacadoPct = $event" />
        </div>
      </div>
      <div class="flex flex-col" style="gap: 16px">
        <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr 0.7fr auto; gap: 10px">
          <div>
            <FieldLabel>* CPF/CNPJ do sacado</FieldLabel>
            <input v-model="excSacadoDoc" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Nome do sacado</FieldLabel>
            <input v-model="excSacadoNome" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>* Percentual de concentração</FieldLabel>
            <input v-model="excPct" placeholder="0,00%" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <AddButton @click="addExcecao" />
        </div>
        <EmptyState v-if="form.excecoesConcentracao.length === 0" :icon="UserCheck" title="Nenhuma exceção cadastrada" hint="Cadastre sacados com exceção de concentração." />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr 0.7fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
            <div>Nome</div><div>Documento</div><div style="text-align: right">Percentual</div><div />
          </div>
          <div v-for="e in excecoesPageItems" :key="e.id" class="grid items-center" style="grid-template-columns: 1.4fr 1fr 0.7fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.sacadoNome }}</div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.sacadoDocumento || '—' }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">{{ e.percentual.toFixed(2).replace('.', ',') }}%</div>
            <div class="flex justify-end">
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeExcecao(e.id)">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
          <TablePagination
            sunken
            compact
            :total="excecoesTotal"
            :page="excecoesPage"
            :page-size="excecoesPageSize"
            :page-size-options="[5, 10, 25]"
            @update:page="setExcecoesPage"
            @update:page-size="setExcecoesPageSize"
          />
        </div>
      </div>
    </TabCard>

    <TabCard title="Partes Relacionadas" :icon="Users" has-save @save="handleSavePartes">
      <EmptyState v-if="partes.length === 0" :icon="Users" title="Nenhuma parte relacionada cadastrada" hint="Partes relacionadas são herdadas do cadastro do grupo." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; overflow-x: auto">
        <div class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 0.9fr 80px 80px 80px 120px; min-width: 900px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Nome + Documento</div><div>E-mail + Telefone</div><div>Estado Civil</div><div>Cônjuge anuente</div><div>Assin. obrig.</div><div>Aceita restritivo</div><div>Valor restritivo</div>
        </div>
        <div v-for="p in partesPageItems" :key="p.id" class="grid items-center" style="grid-template-columns: 1.2fr 1.2fr 0.9fr 80px 80px 80px 120px; min-width: 900px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.documento }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ p.papel }}</div>
          </div>
          <div>
            <div style="color: var(--text-default)">{{ p.email }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.telefone }}</div>
          </div>
          <div style="color: var(--text-default)">{{ p.estadoCivil }}</div>
          <div>
            <Checkbox :checked="p.conjugeAnuente" @change="toggleConjugeAnuente(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.assinaturaObrigatoria" @change="toggleAssinaturaObrigatoria(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.aceitaRestritivo" @change="toggleAceitaRestritivo(p.id)" />
          </div>
          <div>
            <input
              v-if="p.aceitaRestritivo"
              type="text"
              :value="p.valorRestritivoAceito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
              style="width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs)"
              @input="handleRestritivoInput(p.id, $event)"
            />
            <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
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
    </TabCard>

    <TabCard title="Ativos Não Performados" :icon="Truck">
      <div class="flex flex-col" style="gap: 16px">
        <ToggleRow label="Pode operar NFe de Entrega Futura" :on="form.nfEntregaFuturaPodeOperar" @toggle="form.nfEntregaFuturaPodeOperar = !form.nfEntregaFuturaPodeOperar" />
        <div style="max-width: 320px">
          <PctInput label="Percentual máximo para NFe Entrega Futura" :value="form.nfEntregaFuturaOperacaoMaximaPct" :disabled="!form.nfEntregaFuturaPodeOperar" @change="form.nfEntregaFuturaOperacaoMaximaPct = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Crédito e Serasa" :icon="ShieldCheck" has-save @save="handleSaveGeral">
      <div class="flex flex-col" style="gap: 16px">
        <ToggleRow label="Exige Aprovação do Sacado Pelo Setor de Crédito" :on="form.creditoPreAprovacaoSacado" @toggle="form.creditoPreAprovacaoSacado = !form.creditoPreAprovacaoSacado" />
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do sacado (Dias)" :value="form.validadeSerasaSacadoDias" @change="form.validadeSerasaSacadoDias = $event" />
          </div>
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do Avalista (Dias)" :value="form.validadeSerasaAvalistaDias" @change="form.validadeSerasaAvalistaDias = $event" />
          </div>
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do Cedente (Dias)" :value="form.validadeSerasaCedenteDias" @change="form.validadeSerasaCedenteDias = $event" />
          </div>
        </div>
      </div>
    </TabCard>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { Clock, History } from 'lucide-vue-next';
import type { HistoricoEvento } from '../../data/riscoData';
import { Section, EmptyState } from './shared';

defineProps<{ eventos: HistoricoEvento[] }>();
</script>

<template>
  <EmptyState v-if="eventos.length === 0" :icon="History" title="Nenhum evento registrado" hint="O histórico deste grupo aparecerá aqui conforme novos eventos ocorrerem." />
  <Section v-else title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.descricao }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ e.datetime }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### LimiteSubTab

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { AlertTriangle, Layers, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { brl, type ParametrizacaoLimite, type LimiteProdutoRow } from '../../data/riscoData';
import { TabCard } from './shared';
import IncluirLimiteModal from '../../components/modals/IncluirLimiteModal.vue';
import EditarLimiteModal from '../../components/modals/EditarLimiteModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  data: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoLimite] }>();
const form = reactive<ParametrizacaoLimite>({ ...props.data, limites: [...props.data.limites] });
const modalOpen = ref(false);
const editingLimite = ref<LimiteProdutoRow | null>(null);
const openMenuId = ref<string | null>(null);

const LIMITE_TABLE_GRID = 'minmax(140px, 2fr) minmax(88px, 1fr) minmax(100px, 1.1fr) 40px';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => form.limites,
  { defaultPageSize: 5 },
);

const limitesAgrupadosPage = computed(() => {
  const map = new Map<string, LimiteProdutoRow[]>();
  for (const l of pageItems.value) {
    const arr = map.get(l.agrupamento) ?? [];
    arr.push(l);
    map.set(l.agrupamento, arr);
  }
  return [...map.entries()];
});

function handleIncluirLimites(novos: LimiteProdutoRow[]) {
  form.limites = [...form.limites, ...novos];
  modalOpen.value = false;
  emit('save', { ...form, limites: [...form.limites] });
}

function removeLimite(id: string) {
  form.limites = form.limites.filter((l) => l.id !== id);
  openMenuId.value = null;
  emit('save', { ...form, limites: [...form.limites] });
}

function openEditModal(row: LimiteProdutoRow) {
  editingLimite.value = row;
  openMenuId.value = null;
}

function handleEditConfirm(valor: number, vencimento: string) {
  if (!editingLimite.value) return;
  form.limites = form.limites.map((l) =>
    l.id === editingLimite.value!.id ? { ...l, valor, vencimento } : l,
  );
  editingLimite.value = null;
  emit('save', { ...form, limites: [...form.limites] });
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-limite-action-menu]')) {
    openMenuId.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div v-if="form.reparametrizacaoData" class="flex items-center" style="gap: 12px; padding: 14px 18px; border-radius: var(--radius-lg); background: var(--status-warning-bg); border: 1px solid var(--warning-base)">
      <AlertTriangle :size="18" style="color: var(--warning-dark); flex-shrink: 0" />
      <span style="font-size: var(--text-sm); color: var(--warning-dark); font-weight: var(--weight-semibold)">
        Este grupo possui reparametrização de limite agendada para {{ form.reparametrizacaoData }}.
      </span>
    </div>

    <TabCard title="Limites por Agrupamento" :icon="Layers">
      <div class="flex justify-end" style="margin-bottom: 14px">
        <button
          class="flex items-center"
          style="gap: 6px; height: 36px; padding: 0 16px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
          @click="modalOpen = true"
        >
          <Plus :size="14" /> INCLUIR LIMITE
        </button>
      </div>

      <div v-if="form.limites.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
        Nenhum limite cadastrado. Clique em "Incluir Limite" para adicionar.
      </div>

      <div
        v-for="[agrupamento, rows] in limitesAgrupadosPage"
        :key="agrupamento"
        class="limite-agrupamento"
        :class="{ 'limite-agrupamento--menu-open': rows.some((r) => r.id === openMenuId) }"
      >
        <div class="limite-agrupamento-header">
          {{ agrupamento }}
        </div>
        <div class="grid items-center limite-table-row limite-table-header" :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }">
          <div>Produto</div><div class="limite-col-num">Limite</div><div class="limite-col-date">Vencimento</div><div />
        </div>
        <div
          v-for="row in rows"
          :key="row.id"
          class="grid items-center limite-table-row"
          :class="{ 'limite-table-row--menu-open': openMenuId === row.id }"
          :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.produto }}</div>
          <div class="limite-col-num">{{ brl(row.valor, { compact: true }) }}</div>
          <div class="limite-col-date">{{ row.vencimento }}</div>
          <div class="flex justify-end" style="position: relative" data-limite-action-menu>
            <button
              aria-label="Ações"
              class="flex items-center justify-center"
              style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
              @click="toggleMenu(row.id)"
            >
              <MoreVertical :size="14" />
            </button>
            <div
              v-if="openMenuId === row.id"
              class="flex flex-col limite-action-menu"
            >
              <button
                class="flex items-center limite-action-item"
                style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                @click="openEditModal(row)"
              >
                <Pencil :size="14" style="color: var(--text-muted)" />
                Editar
              </button>
              <button
                class="flex items-center limite-action-item"
                style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                @click="removeLimite(row.id)"
              >
                <Trash2 :size="14" />
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="form.limites.length > 0"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-top: 4px"
      >
        <TablePagination
          sunken
          compact
          :total="total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </TabCard>

    <IncluirLimiteModal v-if="modalOpen" @close="modalOpen = false" @confirm="handleIncluirLimites" />
    <EditarLimiteModal
      v-if="editingLimite"
      :agrupamento="editingLimite.agrupamento"
      :produto="editingLimite.produto"
      :valor="editingLimite.valor"
      :vencimento="editingLimite.vencimento"
      @close="editingLimite = null"
      @confirm="handleEditConfirm"
    />
  </div>
</template>

<style scoped>
.limite-agrupamento {
  position: relative;
  z-index: 1;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
  /* overflow visible: menu de ações precisa sair da linha sem ser cortado */
  overflow: visible;
  background: var(--surface-card);
}

.limite-agrupamento--menu-open {
  z-index: 40;
}

.limite-agrupamento-header {
  padding: 12px 16px;
  background: var(--surface-sunken);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.limite-table-row {
  column-gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  position: relative;
}

.limite-table-row--menu-open {
  z-index: 41;
}

.limite-table-header {
  padding: 10px 16px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.limite-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.limite-col-date {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}

.limite-action-menu {
  position: absolute;
  top: 28px;
  right: 0;
  z-index: 50;
  min-width: 140px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 6px;
}

.limite-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### ParametrizacoesTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { Parametrizacoes, ParteRelacionada } from '../../data/riscoData';
import LimiteSubTab from './LimiteSubTab.vue';
import AutoatendimentoSubTab from './AutoatendimentoSubTab.vue';
import GeralSubTab from './GeralSubTab.vue';
import GarantiaSubTab from './GarantiaSubTab.vue';

interface Props {
  data: Parametrizacoes;
  partesRelacionadas: ParteRelacionada[];
  grupoId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  change: [data: Parametrizacoes];
  'update:partes-relacionadas': [data: ParteRelacionada[]];
}>();

const SUB_TABS = ['Limite', 'Autoatendimento', 'Geral', 'Garantia'] as const;
type SubTab = (typeof SUB_TABS)[number];

const tab = ref<SubTab>('Limite');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default)">
      <button
        v-for="t in SUB_TABS"
        :key="t"
        :style="{
          padding: '10px 4px', marginRight: '22px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
        }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <LimiteSubTab v-if="tab === 'Limite'" :data="data.limite" @save="(limite) => emit('change', { ...data, limite })" />
    <AutoatendimentoSubTab
      v-if="tab === 'Autoatendimento'"
      :data="data.autoatendimento"
      :grupo-id="props.grupoId"
      @save="(autoatendimento) => emit('change', { ...data, autoatendimento })"
    />
    <GeralSubTab
      v-if="tab === 'Geral'"
      :data="data.geral"
      :partes-relacionadas="partesRelacionadas"
      @save="(geral) => emit('change', { ...data, geral })"
      @update:partes-relacionadas="(pr) => emit('update:partes-relacionadas', pr)"
    />
    <GarantiaSubTab v-if="tab === 'Garantia'" :data="data.garantia" @save="(garantia) => emit('change', { ...data, garantia })" />
  </div>
</template>
```

## Screens / detail-tabs / shared

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
      height: 40px; min-width: 40px; padding: 0 16px; gap: 6px;
      background: var(--success-base); color: #fff; border: none;
      border-radius: var(--radius-lg); cursor: pointer;
      font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em;
      white-space: nowrap;
    "
    @click="emit('click')"
  >
    <Plus :size="14" /> ADICIONAR
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

### DiasInput

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label: string; value: number; disabled?: boolean }>();
const emit = defineEmits<{ change: [value: number] }>();

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('change', Number(target.value) || 0);
}
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      type="number"
      :disabled="disabled"
      :value="value"
      :style="{
        width: '100%', height: '40px', padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
      }"
      @input="handleInput"
    />
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
  <div class="flex flex-col items-center justify-center" style="gap: 10px; padding: 32px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)">
    <component :is="icon" :size="26" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">{{ title }}</div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">{{ hint }}</div>
  </div>
</template>
```

### FieldLabel

```vue
<script setup lang="ts"></script>

<template>
  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
    <slot />
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
import { useAttrs } from 'vue';
import FieldLabel from './FieldLabel.vue';

defineOptions({ inheritAttrs: false });
defineProps<{ label: string }>();
const attrs = useAttrs();
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
      v-bind="attrs"
    />
  </div>
</template>
```

### PctInput

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

const props = defineProps<{ label: string; value: number; disabled?: boolean }>();
const emit = defineEmits<{ change: [value: number] }>();

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('change', Number(target.value.replace('%', '').replace(',', '.')) || 0);
}
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      type="text"
      :disabled="disabled"
      :value="`${props.value.toFixed(2).replace('.', ',')}%`"
      :style="{
        width: '100%', height: '40px', padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums', cursor: disabled ? 'not-allowed' : 'text',
      }"
      @input="handleInput"
    />
  </div>
</template>
```

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div class="flex items-center justify-between" style="margin-bottom: 16px; gap: 12px">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase">
        {{ title }}
      </div>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';

defineProps<{ label: string; options: string[]; value: string; placeholder?: string }>();
const emit = defineEmits<{ change: [e: Event] }>();
</script>

<template>
  <div>
    <FieldLabel>{{ label }}</FieldLabel>
    <select
      :value="value"
      style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
      @change="emit('change', $event)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
  </div>
</template>
```

### TabCard

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; icon?: Component; hasSave?: boolean }>();
const emit = defineEmits<{ save: [] }>();
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
    <div class="flex items-center" style="gap: 10px; padding: 16px 22px; border-bottom: 1px solid var(--border-default); border-radius: var(--radius-xl) var(--radius-xl) 0 0">
      <component :is="icon" v-if="icon" :size="16" style="color: var(--text-muted)" />
      <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ title }}</h3>
    </div>
    <div style="padding: 22px; overflow: visible">
      <slot />
    </div>
    <div v-if="hasSave" class="flex items-center justify-end" style="padding: 14px 22px; border-top: 1px solid var(--border-default); border-radius: 0 0 var(--radius-xl) var(--radius-xl)">
      <button
        style="height: 40px; padding: 0 20px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
        @click="emit('save')"
      >
        SALVAR
      </button>
    </div>
  </div>
</template>
```

### ToggleRow

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean }>();
const emit = defineEmits<{ toggle: [] }>();

const trackStyle = computed(() => ({
  position: 'relative' as const,
  width: props.compact ? '34px' : '44px',
  height: props.compact ? '20px' : '24px',
  borderRadius: '9999px',
  background: props.on ? 'var(--success-base)' : 'var(--border-strong)',
  transition: 'background var(--duration-base)',
  flexShrink: 0,
}));

const knobStyle = computed(() => ({
  position: 'absolute' as const,
  top: props.compact ? '2px' : '3px',
  left: props.on ? (props.compact ? '16px' : '23px') : (props.compact ? '2px' : '3px'),
  width: props.compact ? '16px' : '18px',
  height: props.compact ? '16px' : '18px',
  borderRadius: '9999px',
  background: '#fff',
  transition: 'left var(--duration-base)',
  boxShadow: 'var(--shadow-xs)',
}));
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'toggle-row--compact': compact }"
    :style="{
      padding: compact ? '0 12px' : '14px 18px',
      height: compact ? '40px' : undefined,
      minHeight: compact ? '40px' : undefined,
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: compact ? '10px' : '12px',
    }"
    @click="emit('toggle')"
  >
    <div style="min-width: 0">
      <div :style="{ fontSize: compact ? 'var(--text-xs)' : 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', lineHeight: compact ? '1.35' : '1.4' }">{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ hint }}</div>
    </div>
    <div :style="trackStyle">
      <span :style="knobStyle" />
    </div>
  </div>
</template>

<style scoped>
.toggle-row--compact {
  align-self: end;
}
</style>
```

## Components / modals

### CedenteDetailModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, Pencil, FileUp, TrendingUp, MapPin, CalendarDays, Phone, Home, FileText } from 'lucide-vue-next';
import { brl, statusCedenteColor, type Cedente } from '../../data/riscoData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { KpiCard, ContatosPanel, EnderecosPanel, DocumentosPanel } from './cedente-detail';
import EditarCadastroCedenteModal from './EditarCadastroCedenteModal.vue';

type Tab = 'contatos' | 'enderecos' | 'documentos';

const TABS: { key: Tab; label: string; icon: typeof Phone }[] = [
  { key: 'contatos', label: 'Contatos', icon: Phone },
  { key: 'enderecos', label: 'Endereços', icon: Home },
  { key: 'documentos', label: 'Documentos', icon: FileText },
];

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ close: []; update: [cedente: Cedente] }>();

const tab = ref<Tab>('contatos');
const editando = ref(false);
const cor = statusCedenteColor(props.cedente.status);

function handleUpdate(updated: Cedente) {
  emit('update', updated);
  editando.value = false;
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
        width: 100%; max-width: 1000px; max-height: 92vh;
        overflow: hidden; box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 20px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0; gap: 16px">
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ cedente.nome }}
            </h2>
            <span class="flex items-center" :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 10px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor, flexShrink: 0 }">
              <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: cor }" />
              {{ cedente.status.toUpperCase() }}
            </span>
          </div>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
            {{ cedente.documento }}
          </p>
        </div>
        <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
          <button
            class="flex items-center"
            style="gap: 8px; height: 38px; padding: 0 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer; color: var(--text-strong); font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em; white-space: nowrap"
            @click="editando = true"
          >
            <Pencil :size="13" /> EDITAR CADASTRO
          </button>
          <button
            aria-label="Fechar"
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex flex-col" style="padding: 24px; gap: 20px; overflow: auto">
        <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
          <KpiCard :icon="FileUp" label="Qtd. de títulos em aberto" :value="String(cedente.qtdTitulosAberto)" />
          <KpiCard :icon="TrendingUp" label="Risco tomado" :value="brl(cedente.riscoTomado)" />
          <KpiCard :icon="MapPin" label="Cidade - UF" :value="`${cedente.cidade} - ${cedente.uf}`" />
          <KpiCard :icon="CalendarDays" label="Data de abertura" :value="cedente.dataAbertura" />
        </div>

        <SegmentedToggle
          :model-value="tab"
          :options="TABS"
          variant="brand"
          style="width: fit-content"
          @update:model-value="tab = $event as Tab"
        />

        <ContatosPanel v-if="tab === 'contatos'" :cedente="cedente" @update="emit('update', $event)" />
        <EnderecosPanel v-if="tab === 'enderecos'" :cedente="cedente" @update="emit('update', $event)" />
        <DocumentosPanel v-if="tab === 'documentos'" :cedente="cedente" @update="emit('update', $event)" />
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

  <EditarCadastroCedenteModal
    v-if="editando"
    :cedente="cedente"
    @close="editando = false"
    @update="handleUpdate"
  />
</template>
```

### ConfigurarNotificacoesModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, BellRing } from 'lucide-vue-next';

defineProps<{ grupoNome: string }>();
const emit = defineEmits<{
  close: [];
  confirm: [config: { vencimentoLimite: boolean; parecerCredito: boolean; novoEventoHistorico: boolean }];
}>();

const vencimentoLimite = ref(true);
const parecerCredito = ref(true);
const novoEventoHistorico = ref(false);

function handleConfirm() {
  emit('confirm', { vencimentoLimite: vencimentoLimite.value, parecerCredito: parecerCredito.value, novoEventoHistorico: novoEventoHistorico.value });
}
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 480px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <BellRing :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Configurar notificações</h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ grupoNome }}</p>
          </div>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 28px; gap: 10px">
        <div
          class="flex items-center justify-between"
          :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: vencimentoLimite ? 'var(--success-base)' : 'var(--border-default)', background: vencimentoLimite ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
          @click="vencimentoLimite = !vencimentoLimite"
        >
          <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Vencimento do limite</span>
          <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: vencimentoLimite ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
            <span :style="{ position: 'absolute', top: '3px', left: vencimentoLimite ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
          </div>
        </div>
        <div
          class="flex items-center justify-between"
          :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: parecerCredito ? 'var(--success-base)' : 'var(--border-default)', background: parecerCredito ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
          @click="parecerCredito = !parecerCredito"
        >
          <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Alteração no parecer de crédito</span>
          <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: parecerCredito ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
            <span :style="{ position: 'absolute', top: '3px', left: parecerCredito ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
          </div>
        </div>
        <div
          class="flex items-center justify-between"
          :style="{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', borderWidth: '1px', borderStyle: 'solid', borderColor: novoEventoHistorico ? 'var(--success-base)' : 'var(--border-default)', background: novoEventoHistorico ? 'var(--success-light)' : 'var(--surface-card)', transition: 'all var(--duration-base)' }"
          @click="novoEventoHistorico = !novoEventoHistorico"
        >
          <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">Novo evento no histórico</span>
          <div :style="{ position: 'relative', width: '44px', height: '24px', borderRadius: '9999px', background: novoEventoHistorico ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
            <span :style="{ position: 'absolute', top: '3px', left: novoEventoHistorico ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 22px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
          @click="handleConfirm"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### CreateAgrupamentoModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Layers } from 'lucide-vue-next';
import type { Agrupamento } from '../../data/riscoData';

const props = defineProps<{ initial?: Agrupamento }>();
const emit = defineEmits<{ close: []; save: [nome: string] }>();

const nome = ref(props.initial?.nome ?? '');
const canSave = computed(() => nome.value.trim() !== '');

function handleSave() {
  if (!canSave.value) return;
  emit('save', nome.value.trim());
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
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 480px;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <Layers :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
              {{ initial ? 'Renomear Agrupamento' : 'Novo Agrupamento' }}
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              Usado no bloco "Agrupamentos" da parametrização de limite dos grupos
            </p>
          </div>
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
      <div style="padding: 28px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
          <input
            v-model="nome"
            placeholder="Ex.: Confina"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canSave"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            transition: 'background var(--duration-base)',
          }"
          @click="handleSave"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### CreateRatingModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Gauge } from 'lucide-vue-next';
import type { Rating } from '../../data/riscoData';

const props = defineProps<{ initial?: Rating }>();
const emit = defineEmits<{ close: []; save: [data: { nome: string; taxa: number }] }>();

const nome = ref(props.initial?.nome ?? '');
const taxa = ref(props.initial ? String(props.initial.taxa).replace('.', ',') : '');

const canSave = computed(() => nome.value.trim() !== '' && taxa.value.trim() !== '');

function handleSave() {
  if (!canSave.value) return;
  emit('save', {
    nome: nome.value.trim(),
    taxa: Number(taxa.value.replace(',', '.')) || 0,
  });
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
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 480px;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <Gauge :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
              {{ initial ? 'Editar Rating' : 'Novo Rating' }}
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              Usado no "Indicativo de rating do cliente" na parametrização de grupos
            </p>
          </div>
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
      <div style="padding: 28px">
        <div class="flex flex-col" style="gap: 16px">
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
            <input
              v-model="nome"
              placeholder="Ex.: A++"
              style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
            />
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Taxa</div>
            <input
              v-model="taxa"
              placeholder="0,00%"
              style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canSave"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            transition: 'background var(--duration-base)',
          }"
          @click="handleSave"
        >
          SALVAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### DeleteAgrupamentoModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import type { Agrupamento } from '../../data/riscoData';

const props = defineProps<{ agrupamento: Agrupamento }>();
const emit = defineEmits<{ close: []; confirm: [justificativa: string] }>();

const justificativa = ref('');
const canConfirm = computed(() => justificativa.value.trim().length > 0);

function handleConfirm() {
  if (canConfirm.value) emit('confirm', justificativa.value.trim());
}
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px">
    <div style="width: 100%; max-width: 460px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 28px">
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px">
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Excluir o agrupamento "{{ agrupamento.nome }}"?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 18px">
        Esta ação é crítica e não pode ser desfeita. Grupos que consomem limite através deste agrupamento perderão essa referência.
      </p>

      <div style="margin-bottom: 22px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--danger-base); text-transform: uppercase; margin-bottom: 6px">
          * Justificativa da exclusão
        </div>
        <textarea
          v-model="justificativa"
          placeholder="Descreva o motivo da exclusão..."
          rows="3"
          style="
            width: 100%; padding: 10px 14px; resize: vertical;
            background: var(--surface-card); border: 1px solid var(--border-default);
            border-radius: var(--radius-lg); outline: none;
            font-size: var(--text-sm); color: var(--text-strong); font-family: inherit;
          "
        />
      </div>

      <div class="flex items-center justify-end" style="gap: 10px">
        <button style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '42px', padding: '0 18px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)',
            background: canConfirm ? 'var(--action-danger-bg)' : 'var(--neutral-200)',
            color: canConfirm ? 'var(--action-danger-text)' : 'var(--text-disabled)',
          }"
          @click="handleConfirm"
        >
          Confirmar exclusão
        </button>
      </div>
    </div>
  </div>
</template>
```

### EditarCadastroCedenteModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { NACIONALIDADE_OPTS, ESTADO_CIVIL_OPTS, type Cedente } from '../../data/riscoData';
import { FieldLabel, FormField, SelectField } from '../../screens/detail-tabs/shared';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ close: []; update: [cedente: Cedente] }>();

const isPF = props.cedente.tipo === 'Pessoa Física';

const rg = ref(props.cedente.rg ?? '');
const inscricaoProdutorRural = ref(props.cedente.inscricaoProdutorRural ?? '');
const nacionalidade = ref(props.cedente.nacionalidade ?? '');
const profissao = ref(props.cedente.profissao ?? '');
const estadoCivil = ref(props.cedente.estadoCivil ?? '');

const nomeFantasia = ref(props.cedente.nomeFantasia ?? '');
const tipoEmpresa = ref(props.cedente.tipoEmpresa ?? '');
const porte = ref(props.cedente.porte ?? '');
const atividadePrincipal = ref(props.cedente.atividadePrincipal ?? '');
const naturezaJuridica = ref(props.cedente.naturezaJuridica ?? '');
const inscricaoMunicipal = ref(props.cedente.inscricaoMunicipal ?? '');
const inscricaoEstadual = ref(props.cedente.inscricaoEstadual ?? '');

function handleAtualizar() {
  if (isPF) {
    emit('update', { ...props.cedente, rg: rg.value, inscricaoProdutorRural: inscricaoProdutorRural.value, nacionalidade: nacionalidade.value, profissao: profissao.value, estadoCivil: estadoCivil.value });
  } else {
    emit('update', {
      ...props.cedente, nomeFantasia: nomeFantasia.value, tipoEmpresa: tipoEmpresa.value, porte: porte.value,
      atividadePrincipal: atividadePrincipal.value, naturezaJuridica: naturezaJuridica.value,
      inscricaoMunicipal: inscricaoMunicipal.value, inscricaoEstadual: inscricaoEstadual.value,
    });
  }
}
</script>

<template>
  <div
    style="
      position: fixed; inset: 0;
      background: rgba(8,60,74,0.55); backdrop-filter: blur(8px);
      z-index: 450; display: flex; align-items: center; justify-content: center;
      padding: 32px; animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 760px; max-height: 90vh;
        overflow: hidden; box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between" style="padding: 20px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Editar Cadastro
        </h2>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 24px; overflow: auto">
        <div v-if="isPF" class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <FieldLabel>CPF</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.documento || '—' }}
            </div>
          </div>
          <div style="grid-column: span 5">
            <FieldLabel>Nome</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.nome || '—' }}
            </div>
          </div>
          <div style="grid-column: span 3">
            <FormField label="RG" placeholder="—" v-model="rg" />
          </div>

          <div style="grid-column: span 4">
            <FormField label="Inscrição do produtor rural" placeholder="—" v-model="inscricaoProdutorRural" />
          </div>
          <div style="grid-column: span 4">
            <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :value="nacionalidade" @change="nacionalidade = ($event.target as HTMLSelectElement).value" />
          </div>
          <div style="grid-column: span 4">
            <FieldLabel>Data de nascimento</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.dataNascimento || '—' }}
            </div>
          </div>

          <div style="grid-column: span 6">
            <FormField label="Profissão" placeholder="—" v-model="profissao" />
          </div>
          <div style="grid-column: span 6">
            <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" :value="estadoCivil" @change="estadoCivil = ($event.target as HTMLSelectElement).value" />
          </div>
        </div>
        <div v-else class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <FieldLabel>CNPJ</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.documento || '—' }}
            </div>
          </div>
          <div style="grid-column: span 5">
            <FieldLabel>Razão Social</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.razaoSocial ?? cedente.nome ?? '—' }}
            </div>
          </div>
          <div style="grid-column: span 3">
            <FormField label="Nome Fantasia" placeholder="—" v-model="nomeFantasia" />
          </div>

          <div style="grid-column: span 4">
            <FieldLabel>Data de abertura</FieldLabel>
            <div style="height: 40px; display: flex; align-items: center; padding: 0 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); color: var(--text-disabled); font-size: var(--text-sm); cursor: not-allowed; font-variant-numeric: tabular-nums">
              {{ cedente.dataAbertura || '—' }}
            </div>
          </div>
          <div style="grid-column: span 4">
            <FormField label="Tipo" placeholder="—" v-model="tipoEmpresa" />
          </div>
          <div style="grid-column: span 4">
            <FormField label="Porte" placeholder="—" v-model="porte" />
          </div>

          <div style="grid-column: span 6">
            <FormField label="Atividade principal" placeholder="—" v-model="atividadePrincipal" />
          </div>
          <div style="grid-column: span 6">
            <FormField label="Natureza Jurídica" placeholder="—" v-model="naturezaJuridica" />
          </div>

          <div style="grid-column: span 6">
            <FormField label="Inscrição municipal" placeholder="—" v-model="inscricaoMunicipal" />
          </div>
          <div style="grid-column: span 6">
            <FormField label="Inscrição estadual" placeholder="—" v-model="inscricaoEstadual" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default); flex-shrink: 0">
        <button
          style="height: 40px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 40px; padding: 0 24px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
          @click="handleAtualizar"
        >
          ATUALIZAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### EditarGarantiaModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import {
  FREQUENCIA_LAUDO_OPTS, TIPO_GARANTIA_OPTS,
  type FrequenciaLaudo, type TipoGarantia, type GarantiaRow,
} from '../../data/riscoData';
import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  garantia: GarantiaRow;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: []; confirm: [garantia: GarantiaRow] }>();

const tipo = ref<TipoGarantia>(props.garantia.tipo);
const percentual = ref(String(props.garantia.percentualExigido));
const prazo = ref(String(props.garantia.prazoLaudoDias));
const frequencia = ref<FrequenciaLaudo>(props.garantia.frequenciaLaudo);
const exigeEscritura = ref(props.garantia.exigeEscrituraPublica);
const exigeProtocolo = ref(props.garantia.exigeProtocolo);

function canConfirm() {
  return percentual.value.trim() !== '';
}

function handleConfirm() {
  if (!canConfirm()) return;
  emit('confirm', {
    ...props.garantia,
    tipo: tipo.value,
    percentualExigido: Number(percentual.value.replace(',', '.')) || 0,
    prazoLaudoDias: Number(prazo.value) || 0,
    frequenciaLaudo: frequencia.value,
    exigeEscrituraPublica: exigeEscritura.value,
    exigeProtocolo: exigeProtocolo.value,
  });
}
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Editar Garantia</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Altere os dados da garantia obrigatória.</p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <div class="flex flex-col" style="gap: 16px">
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo da garantia</div>
            <select v-model="tipo" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option v-for="t in TIPO_GARANTIA_OPTS" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Percentual exigido</div>
              <input v-model="percentual" placeholder="0%" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Prazo laudos (dias)</div>
              <input v-model="prazo" type="number" placeholder="15" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
            </div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Frequência laudos</div>
            <select v-model="frequencia" style="width: 100%; height: 40px; padding: 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option v-for="f in FREQUENCIA_LAUDO_OPTS" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
          <div class="flex items-center" style="gap: 24px">
            <label class="flex items-center" style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)">
              <Checkbox :checked="exigeEscritura" @change="exigeEscritura = !exigeEscritura" />
              Exige Escritura
            </label>
            <label class="flex items-center" style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)">
              <Checkbox :checked="exigeProtocolo" @change="exigeProtocolo = !exigeProtocolo" />
              Exige Protocolo
            </label>
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
```

### EditarLimiteModal

```vue
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
```

### HabilitarOperarModal

```vue
<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next';

defineProps<{ grupoNome: string }>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px">
    <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 28px">
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-success-bg); color: var(--success-base); margin-bottom: 18px">
        <ShieldCheck :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Habilitar "{{ grupoNome }}" para operar?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 22px">
        O grupo passará a poder realizar novas operações dentro do limite parametrizado.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm); background: var(--success-base); color: #fff"
          @click="emit('confirm')"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
```

### IncluirLimiteModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, Plus, Trash2 } from 'lucide-vue-next';
import {
  AGRUPAMENTO_LIMITE_OPTS, PRODUTO_LIMITE_OPTS,
  type LimiteProdutoRow, type AgrupamentoLimite, type ProdutoLimite,
} from '../../data/riscoData';

const emit = defineEmits<{ close: []; confirm: [rows: LimiteProdutoRow[]] }>();

interface DraftRow {
  id: string;
  produto: ProdutoLimite | '';
  valor: string;
  vencimento: string;
}

const agrupamento = ref<AgrupamentoLimite | ''>('');
const rows = ref<DraftRow[]>([]);

function addRow() {
  rows.value.push({ id: `draft-${Date.now()}`, produto: '', valor: '', vencimento: '' });
}

function removeRow(id: string) {
  rows.value = rows.value.filter((r) => r.id !== id);
}

function parseValor(v: string): number {
  return Number(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function formatDateBR(iso: string): string {
  if (!iso) return '';
  const [yyyy, mm, dd] = iso.split('-');
  return `${dd}/${mm}/${yyyy}`;
}

function canConfirm() {
  return agrupamento.value !== '' && rows.value.length > 0 && rows.value.every((r) => r.produto && r.valor && r.vencimento);
}

function handleConfirm() {
  if (!canConfirm() || !agrupamento.value) return;
  const result: LimiteProdutoRow[] = rows.value.map((r, i) => ({
    id: `lim-new-${Date.now()}-${i}`,
    agrupamento: agrupamento.value as AgrupamentoLimite,
    produto: r.produto as ProdutoLimite,
    valor: parseValor(r.valor),
    vencimento: formatDateBR(r.vencimento),
  }));
  emit('confirm', result);
}
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 560px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg); max-height: 90vh" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Incluir Limite</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Selecione o agrupamento e adicione produtos com seus limites.</p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px; overflow-y: auto; flex: 1">
        <div style="margin-bottom: 20px">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Agrupamento de operações</div>
          <select
            v-model="agrupamento"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Selecione</option>
            <option v-for="a in AGRUPAMENTO_LIMITE_OPTS" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>

        <template v-if="agrupamento">
          <div class="flex items-center justify-between" style="margin-bottom: 12px">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Produtos</div>
            <button class="flex items-center" style="gap: 4px; height: 30px; padding: 0 10px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)" @click="addRow">
              <Plus :size="12" /> Adicionar produto
            </button>
          </div>

          <div v-if="rows.length === 0" style="padding: 20px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
            Clique em "Adicionar produto" para incluir limites.
          </div>

          <div v-for="row in rows" :key="row.id" class="flex flex-col" style="gap: 10px; padding: 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); margin-bottom: 10px">
            <div class="flex items-center justify-between">
              <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted)">Produto</span>
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 24px; height: 24px; border: none; background: none; cursor: pointer; color: var(--action-danger-text-only)" @click="removeRow(row.id)">
                <Trash2 :size="12" />
              </button>
            </div>
            <select v-model="row.produto" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)">
              <option value="">Selecione o produto</option>
              <option v-for="p in PRODUTO_LIMITE_OPTS" :key="p" :value="p">{{ p }}</option>
            </select>
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px">
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Valor do limite</div>
                <input v-model="row.valor" placeholder="R$ 0,00" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); margin-bottom: 4px">Vencimento</div>
                <input v-model="row.vencimento" type="date" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
              </div>
            </div>
          </div>
        </template>
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
```

### TransferirGerenteModal

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, UserCog } from 'lucide-vue-next';
import { GERENTES_SEED } from '../../data/riscoData';

const props = defineProps<{ grupoNome: string; gerenteAtual: string }>();
const emit = defineEmits<{ close: []; confirm: [novoGerente: string] }>();

const gerente = ref('');
const canConfirm = computed(() => gerente.value !== '' && gerente.value !== props.gerenteAtual);
</script>

<template>
  <div style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px">
    <div style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 460px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)" @click.stop>
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0">
            <UserCog :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Transferir gerente</h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ grupoNome }}</p>
          </div>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
          Gerente atual
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-default); margin-bottom: 18px">{{ gerenteAtual }}</div>

        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
          Novo gerente
        </div>
        <select
          v-model="gerente"
          style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        >
          <option value="">Selecione</option>
          <option v-for="g in GERENTES_SEED.filter((x) => x.nome !== gerenteAtual)" :key="g.id" :value="g.nome">{{ g.nome }}</option>
        </select>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '42px', padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm ? '#fff' : 'var(--text-disabled)',
          }"
          @click="canConfirm && emit('confirm', gerente)"
        >
          TRANSFERIR
        </button>
      </div>
    </div>
  </div>
</template>
```

### VincularAgrupamentoModal

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, Pencil, Search, Check, Link2 } from 'lucide-vue-next';
import type { EntidadeVinculo, OperacaoVinculavel, TipoOperacaoVinculo, VinculoLinkKey } from '../../data/riscoData';

type FiltroTipo = 'TODOS' | TipoOperacaoVinculo;

interface Props {
  target: EntidadeVinculo;
  targetLabel: string;
  linkKey: VinculoLinkKey;
  operacoes: OperacaoVinculavel[];
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
});
const emit = defineEmits<{
  close: [];
  edit: [];
  'update:operacoes': [operacoes: OperacaoVinculavel[]];
}>();

const search = ref('');
const filtro = ref<FiltroTipo>('TODOS');
const selectedIds = ref<Set<string>>(new Set());

function syncSelectionFromProps() {
  selectedIds.value = new Set(
    props.operacoes.filter((o) => o[props.linkKey].includes(props.target.id)).map((o) => o.id),
  );
}

watch(
  () => [props.target.id, props.linkKey, props.operacoes] as const,
  () => syncSelectionFromProps(),
  { immediate: true },
);

const filtered = computed(() => {
  const needle = search.value.trim().toLowerCase();
  return props.operacoes.filter((o) => {
    if (filtro.value !== 'TODOS' && o.tipo !== filtro.value) return false;
    if (needle && !o.nome.toLowerCase().includes(needle)) return false;
    return true;
  });
});

const selectedCount = computed(() => selectedIds.value.size);
const crasCount = computed(() =>
  props.operacoes.filter((o) => selectedIds.value.has(o.id) && o.tipo === 'CRA').length,
);
const fidcsCount = computed(() =>
  props.operacoes.filter((o) => selectedIds.value.has(o.id) && o.tipo === 'FIDC').length,
);

function isSelected(id: string) {
  return selectedIds.value.has(id);
}

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function confirmar() {
  const targetId = props.target.id;
  emit(
    'update:operacoes',
    props.operacoes.map((o) => {
      const linked = o[props.linkKey].includes(targetId);
      const shouldLink = selectedIds.value.has(o.id);
      if (shouldLink && !linked) return { ...o, [props.linkKey]: [...o[props.linkKey], targetId] };
      if (!shouldLink && linked) return { ...o, [props.linkKey]: o[props.linkKey].filter((id) => id !== targetId) };
      return o;
    }),
  );
  emit('close');
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
    @click.self="emit('close')"
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1100px;
        max-height: calc(100vh - 64px);
        height: calc(100vh - 64px);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div class="flex items-center" style="gap: 10px; min-width: 0; flex: 1">
          <Link2 :size="18" style="color: var(--text-muted); flex-shrink: 0" />
          <div style="min-width: 0">
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.2">
              Vincular veículos
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ targetLabel }}: {{ target.nome }}
            </p>
          </div>
          <button
            v-if="editable"
            :aria-label="`Editar ${targetLabel.toLowerCase()}`"
            :title="`Editar ${targetLabel.toLowerCase()}`"
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
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 28px 32px; gap: 16px; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
          Selecione os veículos (CRA/FIDC) vinculados a este {{ targetLabel.toLowerCase() }}.
          <strong style="color: var(--text-default)">{{ selectedCount }} selecionados</strong>
          <span style="color: var(--text-muted)"> · {{ crasCount }} CRA · {{ fidcsCount }} FIDC</span>.
        </p>

        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg); flex-shrink: 0">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="search"
            placeholder="Filtrar veículos..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>

        <div class="flex items-center" style="gap: 6px; flex-shrink: 0">
          <button
            v-for="f in ([
              { key: 'TODOS', label: 'Todos' },
              { key: 'CRA', label: 'CRA' },
              { key: 'FIDC', label: 'FIDC' },
            ] as const)"
            :key="f.key"
            :style="{
              padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer',
              fontSize: '10px', fontWeight: 'var(--weight-bold)',
              border: `1px solid ${filtro === f.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
              background: filtro === f.key ? 'var(--surface-selected)' : 'var(--surface-card)',
              color: filtro === f.key ? 'var(--gci-base)' : 'var(--text-muted)',
              transition: 'all var(--duration-fast)',
            }"
            @click="filtro = f.key"
          >
            {{ f.label }}
          </button>
        </div>

        <div
          v-if="filtered.length === 0"
          style="padding: 40px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
        >
          Nenhum veículo encontrado.
        </div>
        <div v-else class="grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">
          <button
            v-for="o in filtered"
            :key="o.id"
            class="flex items-center"
            :style="{
              gap: '10px',
              padding: '12px 14px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: isSelected(o.id) ? 'var(--gci-base)' : 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              background: isSelected(o.id) ? 'var(--gci-light)' : 'var(--surface-card)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--duration-base)',
              minWidth: 0,
              overflow: 'hidden',
            }"
            @click="toggle(o.id)"
          >
            <span
              class="flex items-center justify-center"
              :style="{
                width: '20px',
                height: '20px',
                borderRadius: '9999px',
                flexShrink: 0,
                background: isSelected(o.id) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                color: isSelected(o.id) ? '#fff' : 'var(--text-muted)',
                transition: 'all var(--duration-base)',
              }"
            >
              <Check v-if="isSelected(o.id)" :size="11" />
            </span>
            <div style="flex: 1; min-width: 0; overflow: hidden">
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isSelected(o.id) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  color: isSelected(o.id) ? 'var(--gci-base)' : 'var(--text-default)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }"
              >
                {{ o.nome }}
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">{{ o.tipo }}</div>
            </div>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card); flex-shrink: 0">
        <button
          style="height: 44px; padding: 0 20px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="confirmar"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
```

## Components / modals / cedente-detail

### ContatosPanel

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Phone, Trash2 } from 'lucide-vue-next';
import type { Cedente, ContatoCedente } from '../../../data/riscoData';
import { DDI_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const nome = ref('');
const email = ref('');
const ddi = ref('+55');
const telefone = ref('');

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.cedente.contatos,
  { defaultPageSize: 5 },
);

function add() {
  if (!nome.value.trim() || !email.value.trim()) return;
  const novo: ContatoCedente = { id: `cont-${Date.now()}`, nome: nome.value, email: email.value, ddi: ddi.value, telefone: telefone.value };
  emit('update', { ...props.cedente, contatos: [...props.cedente.contatos, novo] });
  nome.value = '';
  email.value = '';
  telefone.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, contatos: props.cedente.contatos.filter((c) => c.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="Nome" placeholder="—" v-model="nome" />
      <FormField label="E-mail" placeholder="contato@email.com" v-model="email" />
    </div>
    <div class="grid items-end" style="grid-template-columns: 140px 1fr auto; gap: 14px">
      <SelectField label="DDI" :options="DDI_OPTS" :value="ddi" @change="ddi = ($event.target as HTMLSelectElement).value" />
      <FormField label="Telefone" placeholder="(00) 00000-0000" v-model="telefone" />
      <AddButton @click="add" />
    </div>

    <EmptyState v-if="cedente.contatos.length === 0" :icon="Phone" title="Nenhum contato cadastrado" hint="Use o formulário acima para cadastrar um contato deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid items-center" style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome</div><div>E-mail</div><div>Telefone</div><div />
      </div>
      <div v-for="c in pageItems" :key="c.id" class="grid items-center" style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
        <div style="color: var(--text-muted)">{{ c.email }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.ddi }} {{ c.telefone }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(c.id)">
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
        :page-size-options="[5, 10, 25]"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>
```

### DocumentosPanel

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { FileText, Paperclip, Download, Trash2 } from 'lucide-vue-next';
import type { Cedente, DocumentoCedente } from '../../../data/riscoData';
import { TIPO_ARQUIVO_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const tipo = ref('');
const arquivo = ref('');
const filtroNome = ref('');
const filtroTipo = ref('');

function add() {
  if (!tipo.value || !arquivo.value.trim()) return;
  const novo: DocumentoCedente = { id: `doc-${Date.now()}`, nome: arquivo.value, tipo: tipo.value };
  emit('update', { ...props.cedente, documentos: [...props.cedente.documentos, novo] });
  arquivo.value = '';
  tipo.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, documentos: props.cedente.documentos.filter((d) => d.id !== id) });
}

const documentosFiltrados = computed(() =>
  props.cedente.documentos.filter((d) => {
    if (filtroNome.value.trim() && !d.nome.toLowerCase().includes(filtroNome.value.trim().toLowerCase())) return false;
    if (filtroTipo.value && d.tipo !== filtroTipo.value) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => documentosFiltrados.value,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid items-end" style="grid-template-columns: 1fr 1.4fr auto; gap: 14px">
      <SelectField label="Tipo do arquivo" :options="TIPO_ARQUIVO_OPTS" placeholder="Selecione" :value="tipo" @change="tipo = ($event.target as HTMLSelectElement).value" />
      <FormField label="Insira o arquivo" placeholder="Nome do arquivo" v-model="arquivo" />
      <AddButton @click="add" />
    </div>

    <div class="flex items-end" style="gap: 14px; flex-wrap: wrap">
      <div style="min-width: 200px">
        <FormField label="Nome" placeholder="Buscar por nome" v-model="filtroNome" />
      </div>
      <div style="min-width: 180px">
        <SelectField label="Tipo" :options="TIPO_ARQUIVO_OPTS" placeholder="Todos" :value="filtroTipo" @change="filtroTipo = ($event.target as HTMLSelectElement).value" />
      </div>
      <button
        :disabled="cedente.documentos.length === 0"
        class="flex items-center"
        :style="{
          gap: '8px', height: '40px', padding: '0 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-card)', cursor: cedente.documentos.length === 0 ? 'not-allowed' : 'pointer',
          color: cedente.documentos.length === 0 ? 'var(--text-disabled)' : 'var(--text-strong)',
          fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
        }"
      >
        <Download :size="14" /> BAIXAR TODOS
      </button>
    </div>

    <EmptyState v-if="documentosFiltrados.length === 0" :icon="FileText" title="Nenhum documento encontrado" hint="Use o formulário acima para anexar um documento deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid items-center" style="grid-template-columns: 1.6fr 1fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome</div><div>Tipo</div><div />
      </div>
      <div v-for="d in pageItems" :key="d.id" class="grid items-center" style="grid-template-columns: 1.6fr 1fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div class="flex items-center" style="gap: 8px; font-weight: var(--weight-semibold); color: var(--text-strong)">
          <Paperclip :size="13" style="color: var(--text-muted)" /> {{ d.nome }}
        </div>
        <div style="color: var(--text-muted)">{{ d.tipo }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(d.id)">
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
        :page-size-options="[5, 10, 25]"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>
```

### EnderecosPanel

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Home, Trash2 } from 'lucide-vue-next';
import type { Cedente, EnderecoCedente } from '../../../data/riscoData';
import { UF_OPTIONS, PAIS_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const cep = ref('');
const localidade = ref('');
const numero = ref('');
const bairro = ref('');
const infoAdicionais = ref('');
const cidade = ref('');
const uf = ref('');
const pais = ref('Brasil');

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.cedente.enderecos,
  { defaultPageSize: 5 },
);

function add() {
  if (!cep.value.trim() || !cidade.value.trim()) return;
  const novo: EnderecoCedente = {
    id: `end-${Date.now()}`, cep: cep.value, localidade: localidade.value, numero: numero.value,
    bairro: bairro.value, infoAdicionais: infoAdicionais.value, cidade: cidade.value, uf: uf.value, pais: pais.value,
  };
  emit('update', { ...props.cedente, enderecos: [...props.cedente.enderecos, novo] });
  cep.value = ''; localidade.value = ''; numero.value = ''; bairro.value = ''; infoAdicionais.value = ''; cidade.value = ''; uf.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, enderecos: props.cedente.enderecos.filter((e) => e.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="CEP" placeholder="00000-000" v-model="cep" />
      <FormField label="Localidade" placeholder="—" v-model="localidade" />
    </div>
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="Número" placeholder="—" v-model="numero" />
      <FormField label="Bairro" placeholder="—" v-model="bairro" />
    </div>
    <FormField label="Informações adicionais" placeholder="—" v-model="infoAdicionais" />
    <div class="grid items-end" style="grid-template-columns: 1fr 140px 160px auto; gap: 14px">
      <FormField label="Cidade" placeholder="—" v-model="cidade" />
      <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :value="uf" @change="uf = ($event.target as HTMLSelectElement).value" />
      <SelectField label="País" :options="PAIS_OPTS" :value="pais" @change="pais = ($event.target as HTMLSelectElement).value" />
      <AddButton @click="add" />
    </div>

    <EmptyState v-if="cedente.enderecos.length === 0" :icon="Home" title="Nenhum endereço cadastrado" hint="Use o formulário acima para cadastrar um endereço deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: auto">
      <div class="grid items-center" style="grid-template-columns: 1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; white-space: nowrap">
        <div>CEP</div><div>Localidade</div><div>Número</div><div>Bairro</div><div>Cidade</div><div>UF</div><div>País</div><div />
      </div>
      <div v-for="e in pageItems" :key="e.id" class="grid items-center" style="grid-template-columns: 1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); white-space: nowrap">
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.cep }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.localidade || '—' }}</div>
        <div style="color: var(--text-muted)">{{ e.numero || '—' }}</div>
        <div style="color: var(--text-muted)">{{ e.bairro || '—' }}</div>
        <div style="color: var(--text-default)">{{ e.cidade }}</div>
        <div style="color: var(--text-default)">{{ e.uf }}</div>
        <div style="color: var(--text-default)">{{ e.pais }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(e.id)">
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
        :page-size-options="[5, 10, 25]"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>
```

### KpiCard

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; label: string; value: string }>();
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 14px 16px; background: var(--surface-sunken)">
    <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 8px">{{ label }}</div>
    <div class="flex items-center" style="gap: 7px">
      <component :is="icon" :size="15" style="color: var(--text-muted)" />
      <span style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ value }}</span>
    </div>
  </div>
</template>
```

## Components / modals / vincular-agrupamento

### OperationRow

```vue
<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  nomesEntidadesVinculo,
  type EntidadeVinculo,
  type OperacaoVinculavel,
  type VinculoLinkKey,
} from '../../../data/riscoData';

const props = defineProps<{
  op: OperacaoVinculavel;
  entidades: EntidadeVinculo[];
  entityLabel: string;
  linkKey: VinculoLinkKey;
  checked: boolean;
}>();
const emit = defineEmits<{ toggle: [] }>();

const nomes = computed(() => nomesEntidadesVinculo(props.op, props.entidades, props.linkKey));
const subtitle = computed(() =>
  nomes.value.length > 0
    ? `${props.entityLabel}: ${nomes.value.join(', ')}`
    : `Sem ${props.entityLabel.toLowerCase()}`,
);
const badgeBg = computed(() => (props.op.tipo === 'CRA' ? 'var(--agro-light)' : 'var(--gci-light)'));
const badgeColor = computed(() => (props.op.tipo === 'CRA' ? 'var(--agro-base)' : 'var(--gci-base)'));
</script>

<template>
  <div
    class="flex items-center"
    :style="{ gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', background: checked ? 'var(--surface-selected)' : 'transparent' }"
    @click="emit('toggle')"
  >
    <div @click.stop>
      <Checkbox :checked="checked" @change="emit('toggle')" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ op.nome }}
      </div>
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ subtitle }}
      </div>
    </div>
    <span
      :style="{
        fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
        padding: '3px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
        background: badgeBg, color: badgeColor,
      }"
    >
      {{ op.tipo }}
    </span>
  </div>
</template>
```

### SummaryCard

```vue
<script setup lang="ts">
defineProps<{ label: string; value: number; strong?: boolean }>();
</script>

<template>
  <div :style="{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', background: strong ? 'var(--surface-sunken)' : 'var(--surface-card)' }">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
      {{ value }}
    </div>
  </div>
</template>
```

### TransferButton

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; label: string; active: boolean; reverse?: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :disabled="!active"
    class="flex items-center justify-center"
    :style="{
      gap: '8px', width: '100%', height: '40px', padding: '0 14px',
      borderRadius: 'var(--radius-lg)', border: 'none', cursor: active ? 'pointer' : 'not-allowed',
      fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em',
      background: active ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
      color: active ? '#fff' : 'var(--text-disabled)',
      transition: 'background var(--duration-base)',
      flexDirection: reverse ? 'row-reverse' : 'row',
    }"
    @click="emit('click')"
  >
    <component :is="icon" :size="14" />
    {{ label }}
  </button>
</template>
```

### TransferPanel

```vue
<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import type { EntidadeVinculo, OperacaoVinculavel, TipoOperacaoVinculo, VinculoLinkKey } from '../../../data/riscoData';
import OperationRow from './OperationRow.vue';
import { FILTRO_OPTS } from './constants';

export type FiltroTipo = 'TODOS' | TipoOperacaoVinculo;

defineProps<{
  title: string;
  search: string;
  filter: FiltroTipo;
  items: OperacaoVinculavel[];
  entidades: EntidadeVinculo[];
  entityLabel: string;
  linkKey: VinculoLinkKey;
  selected: Set<string>;
}>();

const emit = defineEmits<{
  'update:search': [v: string];
  'update:filter': [v: FiltroTipo];
  'toggle-item': [id: string];
}>();
</script>

<template>
  <div class="flex flex-col" style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; min-height: 0">
    <div style="padding: 12px 14px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 10px">
        {{ title }}
      </div>
      <div class="relative" style="margin-bottom: 10px">
        <Search :size="14" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          :value="search"
          placeholder="Buscar CRA ou FIDC pelo nome"
          style="width: 100%; height: 34px; padding-left: 32px; padding-right: 10px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs); color: var(--text-strong)"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex items-center" style="gap: 6px">
        <button
          v-for="f in FILTRO_OPTS"
          :key="f.key"
          :style="{
            padding: '4px 10px', borderRadius: '9999px', cursor: 'pointer',
            fontSize: '10px', fontWeight: 'var(--weight-bold)',
            border: `1px solid ${filter === f.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
            background: filter === f.key ? 'var(--surface-selected)' : 'var(--surface-card)',
            color: filter === f.key ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
          @click="emit('update:filter', f.key)"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div style="overflow-y: auto; max-height: 340px; min-height: 340px">
      <div v-if="items.length === 0" style="padding: 32px 16px; text-align: center; font-size: var(--text-xs); color: var(--text-muted)">
        Nenhuma operação encontrada.
      </div>
      <OperationRow
        v-for="op in items"
        :key="op.id"
        :op="op"
        :entidades="entidades"
        :entity-label="entityLabel"
        :link-key="linkKey"
        :checked="selected.has(op.id)"
        @toggle="emit('toggle-item', op.id)"
      />
    </div>
  </div>
</template>
```
