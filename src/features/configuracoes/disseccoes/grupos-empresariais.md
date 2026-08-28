# Grupos Empresariais

## Screens

### GrupoCadastroView

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch, type Component } from 'vue';
import {
  ArrowLeft,
  Bell,
  Building2,
  CalendarDays,
  CircleDollarSign,
  FileText,
  History,
  Landmark,
  MoreVertical,
  Pencil,
  Receipt,
  Shield,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useToast } from '@/composables/useToast';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import { parseCurrencyInput } from '@/features/solicitacao-operacao/utils/currencyMask';
import { brl, type Cedente } from '@/features/risco/data/riscoData';
import CedentesTab from '@/features/risco/screens/detail-tabs/CedentesTab.vue';
import HistoricoTab from '@/features/risco/screens/detail-tabs/HistoricoTab.vue';
import { CopyButton } from '@/features/risco/screens/detail-tabs/shared';
import type { ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import type { GarantiaMinuta } from '@/features/solicitacao-operacao/data/minutaData';
import {
  GERENTES_SEED,
  TIPO_CLIENTE_OPTS,
  cloneGrupo,
  ultimoFaturamento,
  type ContaBancariaGrupo,
  type DocumentoGrupo,
  type FaturamentoGrupo,
  type GrupoCadastro,
  type TipoCliente,
} from '../data/gruposCadastroData';
import PartesRelacionadasTab from './PartesRelacionadasTab.vue';
import ContasBancariasTab from './tabs/ContasBancariasTab.vue';
import DocumentosTab from './tabs/DocumentosTab.vue';
import FaturamentoTab from './tabs/FaturamentoTab.vue';
import GarantiasTab from './tabs/GarantiasTab.vue';
import NotificacoesTab from './tabs/NotificacoesTab.vue';

const props = defineProps<{
  grupo: GrupoCadastro;
  mode: 'create' | 'detail';
}>();
const emit = defineEmits<{
  back: [];
  save: [grupo: GrupoCadastro];
  addParte: [];
  openParte: [parte: ParteRelacionada];
  removeParte: [parte: ParteRelacionada];
  openCedente: [cedente: Cedente];
}>();

type TabKey =
  | 'cedentes'
  | 'partes'
  | 'documentos'
  | 'contas'
  | 'faturamento'
  | 'notificacoes'
  | 'garantias'
  | 'historico';

const TABS: { key: TabKey; label: string; icon: Component }[] = [
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'partes', label: 'Partes relacionadas', icon: UserRound },
  { key: 'documentos', label: 'Documentos', icon: FileText },
  { key: 'contas', label: 'Contas Bancárias', icon: Landmark },
  { key: 'faturamento', label: 'Faturamento', icon: CircleDollarSign },
  { key: 'notificacoes', label: 'Notificações', icon: Bell },
  { key: 'garantias', label: 'Garantias', icon: Shield },
  { key: 'historico', label: 'Histórico', icon: History },
];

const toast = useToast();
const tab = ref<TabKey>('cedentes');
const editingCadastro = ref(false);
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const draft = reactive({
  nome: '',
  documento: '',
  tipoCliente: 'Multicedente' as TipoCliente,
  gerente: '',
  limiteMasked: 'R$ 0,00',
  posicaoAnexo: '',
  validadeCadastro: '',
});

const errors = reactive({ nome: '', documento: '' });

function hydrate(g: GrupoCadastro) {
  draft.nome = g.nome;
  draft.documento = g.documento;
  draft.tipoCliente = g.tipoCliente;
  draft.gerente = g.gerente;
  draft.limiteMasked = brl(g.limite);
  draft.posicaoAnexo = g.posicaoAnexo;
  draft.validadeCadastro = g.validadeCadastro;
  errors.nome = '';
  errors.documento = '';
}

hydrate(props.grupo);

watch(
  () => props.grupo.id,
  () => {
    hydrate(props.grupo);
    tab.value = 'cedentes';
    editingCadastro.value = false;
  },
);

const gerenteOpts = GERENTES_SEED.map((g) => g.nome);
const isCreate = computed(() => props.mode === 'create');
const showForm = computed(() => isCreate.value || editingCadastro.value);

const statusCor = computed(() =>
  props.grupo.statusCadastro === 'Apto' ? 'var(--success-base)' : 'var(--danger-base)',
);

const fat = computed(() => ultimoFaturamento(props.grupo));

const kpis = computed(() => [
  { icon: Wallet, label: 'Limite', value: brl(props.grupo.limite), hint: 'Limite Ceres' },
  { icon: TrendingUp, label: 'Risco tomado', value: brl(props.grupo.riscoTomado), hint: undefined },
  {
    icon: Receipt,
    label: 'Faturamento',
    value: fat.value ? brl(fat.value.valor) : '—',
    hint: fat.value ? `Última receita · ${fat.value.anoFiscal}` : 'Sem receita cadastrada',
  },
  { icon: CalendarDays, label: 'Data do cadastro', value: props.grupo.criadoEm, hint: undefined },
]);

function validate(): boolean {
  errors.nome = draft.nome.trim() ? '' : 'Campo obrigatório';
  errors.documento = draft.documento.trim() ? '' : 'Campo obrigatório';
  return !errors.nome && !errors.documento;
}

function buildGrupo(): GrupoCadastro {
  return {
    ...cloneGrupo(props.grupo),
    nome: draft.nome.trim().toUpperCase(),
    documento: draft.documento.trim(),
    tipoCliente: draft.tipoCliente,
    gerente: draft.gerente,
    limite: parseCurrencyInput(draft.limiteMasked),
    posicaoAnexo: draft.posicaoAnexo.trim(),
    validadeCadastro: draft.validadeCadastro.trim(),
  };
}

function flashSaved() {
  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}

function handleSalvar() {
  if (!validate()) return;
  emit('save', buildGrupo());
  flashSaved();
  if (!isCreate.value) editingCadastro.value = false;
}

function cancelEdit() {
  hydrate(props.grupo);
  editingCadastro.value = false;
}

function persist(mutator: (g: GrupoCadastro) => void) {
  const next = cloneGrupo(props.grupo);
  mutator(next);
  emit('save', next);
}

function onAddParte() {
  tab.value = 'partes';
  emit('addParte');
}

function onOpenParte(parte: ParteRelacionada) {
  tab.value = 'partes';
  emit('openParte', parte);
}

function onUpdateCedente(cedente: Cedente) {
  persist((g) => {
    g.cedentes = g.cedentes.map((c) => (c.id === cedente.id ? cedente : c));
  });
}

function addDocumento(doc: DocumentoGrupo) {
  persist((g) => {
    g.documentos = [...g.documentos, doc];
  });
}

function removeDocumento(id: string) {
  persist((g) => {
    g.documentos = g.documentos.filter((d) => d.id !== id);
  });
}

function addConta(conta: ContaBancariaGrupo) {
  persist((g) => {
    g.contas = [...g.contas, conta];
  });
}

function removeConta(id: string) {
  persist((g) => {
    g.contas = g.contas.filter((c) => c.id !== id);
    if (!g.contas.some((c) => c.principal) && g.contas[0]) g.contas[0].principal = true;
  });
}

function setContaPrincipal(id: string) {
  persist((g) => {
    g.contas = g.contas.map((c) => ({ ...c, principal: c.id === id }));
  });
}

function addFaturamento(item: FaturamentoGrupo) {
  persist((g) => {
    g.faturamentos = [...g.faturamentos, item];
  });
}

function removeFaturamento(id: string) {
  persist((g) => {
    g.faturamentos = g.faturamentos.filter((f) => f.id !== id);
  });
}

function setGarantias(items: GarantiaMinuta[]) {
  persist((g) => {
    g.garantias = items;
  });
}

function verGrupoEconomico() {
  toast.info('Módulo de Grupos Econômicos ainda não está disponível.');
}

const actions = [
  { label: 'Editar Cadastro', icon: Pencil, onClick: () => { editingCadastro.value = true; } },
  { label: 'Ver Grupo Econômico', icon: Building2, onClick: verGrupoEconomico },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) actionMenuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
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
          {{ isCreate ? 'Grupos Empresariais · Novo' : 'Grupos Empresariais · Detalhes' }}
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          {{ isCreate ? 'Novo grupo empresarial' : grupo.nome || 'Grupo empresarial' }}
          <span
            v-if="!isCreate"
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusCor} 14%, transparent)`,
              color: statusCor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusCor }" />
            {{ grupo.statusCadastro.toUpperCase() }}
          </span>
        </h2>
        <p
          v-if="!isCreate"
          class="flex items-center"
          style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; gap: 8px; flex-wrap: wrap"
        >
          <span>Gerente: {{ grupo.gerente || '—' }}</span>
          <span>·</span>
          <span style="font-variant-numeric: tabular-nums">{{ grupo.documento }}</span>
          <CopyButton :value="grupo.documento" />
        </p>
      </div>

      <div v-if="!isCreate && !editingCadastro" ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          type="button"
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
            type="button"
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

    <div
      v-if="!isCreate && !editingCadastro"
      class="grid"
      style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px"
    >
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="
          gap: 14px;
          padding: 16px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
        "
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            color: var(--gci-base);
            flex-shrink: 0;
          "
        >
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div style="min-width: 0">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 4px;
            "
          >
            {{ k.label }}
          </div>
          <div
            style="
              font-size: var(--text-lg);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
            "
          >
            {{ k.value }}
          </div>
          <div v-if="k.hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ k.hint }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isCreate && !editingCadastro" style="overflow-x: auto">
      <SegmentedToggle
        :model-value="tab"
        :options="TABS"
        variant="brand"
        @update:model-value="tab = $event as TabKey"
      />
    </div>

    <div
      v-if="showForm"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <StepGrid>
        <FormField v-model="draft.nome" label="Nome do grupo" required :span="12" />
        <FormField v-model="draft.limiteMasked" label="Limite Ceres" currency :span="4" />
        <FormField v-model="draft.posicaoAnexo" label="Posição Anexo" placeholder="1" :span="4" />
        <FormField v-model="draft.validadeCadastro" label="Validade do cadastro" placeholder="AAAA-MM-DD" :span="4" />
        <FormField v-model="draft.documento" label="Documento" required :span="4" />
        <SelectField
          v-model="draft.tipoCliente"
          label="Tipo de cliente"
          :options="[...TIPO_CLIENTE_OPTS]"
          :span="4"
        />
        <SelectField v-model="draft.gerente" label="Gerente" :options="gerenteOpts" :span="4" />
      </StepGrid>
      <div v-if="errors.nome || errors.documento" style="margin-top: 12px">
        <div v-if="errors.nome" style="font-size: var(--text-xs); color: var(--danger-base, #c53030)">
          Nome: {{ errors.nome }}
        </div>
        <div
          v-if="errors.documento"
          style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 4px"
        >
          Documento: {{ errors.documento }}
        </div>
      </div>
      <div class="flex items-center justify-end" style="gap: 12px; margin-top: 18px">
        <span
          v-if="savedBanner"
          style="font-size: var(--text-sm); color: var(--success-base); font-weight: var(--weight-semibold)"
        >
          {{ isCreate ? 'Grupo cadastrado com sucesso.' : 'Grupo atualizado com sucesso.' }}
        </span>
        <button
          v-if="!isCreate"
          type="button"
          style="
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="cancelEdit"
        >
          Cancelar
        </button>
        <button
          type="button"
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
          @click="handleSalvar"
        >
          {{ isCreate ? 'Salvar' : 'Atualizar' }}
        </button>
      </div>
    </div>

    <template v-else>
      <CedentesTab
        v-if="tab === 'cedentes'"
        as-page
        :cedentes="grupo.cedentes"
        @update-cedente="onUpdateCedente"
        @open="emit('openCedente', $event)"
      />
      <PartesRelacionadasTab
        v-else-if="tab === 'partes'"
        :partes="grupo.partes"
        @add="onAddParte"
        @open="onOpenParte"
        @remove="emit('removeParte', $event)"
      />
      <DocumentosTab
        v-else-if="tab === 'documentos'"
        :documentos="grupo.documentos"
        @add="addDocumento"
        @remove="removeDocumento"
      />
      <ContasBancariasTab
        v-else-if="tab === 'contas'"
        :contas="grupo.contas"
        @add="addConta"
        @remove="removeConta"
        @set-principal="setContaPrincipal"
      />
      <FaturamentoTab
        v-else-if="tab === 'faturamento'"
        :faturamentos="grupo.faturamentos"
        @add="addFaturamento"
        @remove="removeFaturamento"
      />
      <NotificacoesTab v-else-if="tab === 'notificacoes'" :fundos="grupo.fundosNotificacao" />
      <GarantiasTab
        v-else-if="tab === 'garantias'"
        :garantias="grupo.garantias"
        @update:garantias="setGarantias"
      />
      <HistoricoTab v-else-if="tab === 'historico'" :eventos="grupo.historico" />
    </template>
  </div>
</template>

<style scoped>
.grupo-detail-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### GruposCadastroListScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Search } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import type { GrupoCadastro } from '../data/gruposCadastroData';

const props = defineProps<{ grupos: GrupoCadastro[] }>();
const emit = defineEmits<{
  open: [id: string];
  create: [];
}>();

const COLS = '1.2fr 2fr 1fr 1.2fr';
const searchQuery = ref('');

const filtered = computed(() => {
  const needle = searchQuery.value.trim().toLowerCase();
  if (!needle) return props.grupos;
  return props.grupos.filter(
    (g) =>
      g.nome.toLowerCase().includes(needle) ||
      g.documento.toLowerCase().includes(needle) ||
      g.gerente.toLowerCase().includes(needle),
  );
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-end justify-between" style="gap: 16px; flex-wrap: wrap">
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
          Grupos
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
          Grupos Empresariais
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ filtered.length }}
          {{ filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados' }}
        </p>
      </div>

      <button
        type="button"
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 48px;
          padding: 0 20px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-xl);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
        "
        @click="emit('create')"
      >
        <span
          class="flex items-center justify-center"
          style="
            width: 22px;
            height: 22px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.2);
          "
        >
          <Plus :size="14" />
        </span>
        NOVO GRUPO
      </button>
    </div>

    <div style="position: relative; max-width: 420px">
      <Search
        :size="15"
        style="
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        "
      />
      <input
        v-model="searchQuery"
        placeholder="Buscar por nome, documento ou gerente"
        style="
          width: 100%;
          height: 38px;
          padding: 0 12px 0 36px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
        "
      />
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
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
          letterSpacing: '0.10em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div>Gerente</div>
      </div>

      <div
        v-if="pageItems.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum grupo cadastrado.
      </div>

      <button
        v-for="g in pageItems"
        :key="g.id"
        type="button"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          width: '100%',
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          background: 'transparent',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
        }"
        @click="emit('open', g.id)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">
          {{ g.documento }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ g.nome }}
        </div>
        <div style="color: var(--text-default)">{{ g.tipoCliente }}</div>
        <div style="color: var(--text-default)">{{ g.gerente }}</div>
      </button>

      <TablePagination
        sunken
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-size-options="[10, 25, 50]"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>
```

### GruposCadastroScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import type { Cedente } from '@/features/risco/data/riscoData';
import ParteRelacionadaModal from '@/features/solicitacao-operacao/components/modals/ParteRelacionadaModal.vue';
import CedenteDetailModal from '@/features/risco/components/modals/CedenteDetailModal.vue';
import {
  GRUPOS_CADASTRO_SEED,
  cloneGrupo,
  cloneParte,
  emptyGrupo,
  type GrupoCadastro,
} from '../data/gruposCadastroData';
import GruposCadastroListScreen from './GruposCadastroListScreen.vue';
import GrupoCadastroView from './GrupoCadastroView.vue';

type Route =
  | { level: 'list' }
  | { level: 'create' }
  | { level: 'detail'; grupoId: string };

const items = ref<GrupoCadastro[]>(GRUPOS_CADASTRO_SEED.map(cloneGrupo));
const route = ref<Route>({ level: 'list' });
const showParteModal = ref(false);
const editingParte = ref<ParteRelacionada | null>(null);
const cedenteAtual = ref<Cedente | null>(null);
const creating = ref<GrupoCadastro>(emptyGrupo());

const grupoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'detail') return null;
  return items.value.find((g) => g.id === r.grupoId) ?? null;
});

function parteKey(p: ParteRelacionada) {
  return `${p.documento}::${p.nome}`;
}

function openCreate() {
  creating.value = emptyGrupo();
  route.value = { level: 'create' };
}

function openDetail(id: string) {
  cedenteAtual.value = null;
  route.value = { level: 'detail', grupoId: id };
}

function handleSave(grupo: GrupoCadastro) {
  if (route.value.level === 'create') {
    const now = new Date();
    const datetime = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
    const created: GrupoCadastro = {
      ...cloneGrupo(grupo),
      id: `grp-${Date.now()}`,
      historico: grupo.historico.length
        ? grupo.historico
        : [{ id: `hist-${Date.now()}`, datetime, descricao: 'Grupo empresarial cadastrado.' }],
    };
    items.value = [created, ...items.value];
    route.value = { level: 'detail', grupoId: created.id };
    return;
  }
  items.value = items.value.map((g) => (g.id === grupo.id ? cloneGrupo(grupo) : g));
}

function closeParteModal() {
  showParteModal.value = false;
  editingParte.value = null;
}

function handleAddParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.partes = [...next.partes, cloneParte(parte)];
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  closeParteModal();
}

function handleSaveParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  const original = editingParte.value;
  if (!grupo || !original) return;
  const key = parteKey(original);
  const next = cloneGrupo(grupo);
  next.partes = next.partes.map((p) => (parteKey(p) === key ? cloneParte(parte) : p));
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  closeParteModal();
}

function handleRemoveParte(parte: ParteRelacionada) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const key = parteKey(parte);
  const next = cloneGrupo(grupo);
  next.partes = next.partes.filter((p) => parteKey(p) !== key);
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
}

function openAddParte() {
  editingParte.value = null;
  showParteModal.value = true;
}

function openParte(parte: ParteRelacionada) {
  editingParte.value = parte;
  showParteModal.value = true;
}

function handleUpdateCedente(cedente: Cedente) {
  const grupo = grupoAtual.value;
  if (!grupo) return;
  const next = cloneGrupo(grupo);
  next.cedentes = next.cedentes.map((c) => (c.id === cedente.id ? cedente : c));
  items.value = items.value.map((g) => (g.id === next.id ? next : g));
  if (cedenteAtual.value?.id === cedente.id) cedenteAtual.value = cedente;
}

function backFromDetail() {
  cedenteAtual.value = null;
  route.value = { level: 'list' };
}
</script>

<template>
  <CedenteDetailModal
    v-if="cedenteAtual && grupoAtual"
    as-page
    :cedente="cedenteAtual"
    :page-label="grupoAtual.nome"
    @close="cedenteAtual = null"
    @update="handleUpdateCedente"
  />

  <GruposCadastroListScreen
    v-if="route.level === 'list'"
    :grupos="items"
    @open="openDetail"
    @create="openCreate"
  />

  <GrupoCadastroView
    v-if="route.level === 'create'"
    :grupo="creating"
    mode="create"
    @back="route = { level: 'list' }"
    @save="handleSave"
  />

  <GrupoCadastroView
    v-if="grupoAtual && route.level === 'detail'"
    v-show="!cedenteAtual"
    :grupo="grupoAtual"
    mode="detail"
    @back="backFromDetail"
    @save="handleSave"
    @add-parte="openAddParte"
    @open-parte="openParte"
    @remove-parte="handleRemoveParte"
    @open-cedente="cedenteAtual = $event"
  />

  <ParteRelacionadaModal
    v-if="showParteModal"
    :parte="editingParte"
    @close="closeParteModal"
    @create="handleAddParte"
    @save="handleSaveParte"
  />
</template>
```

### PartesRelacionadasTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Trash2, Pencil } from 'lucide-vue-next';
import type { ParteTipo, ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import { PARTE_TIPO_LABEL, TIPOS_PARTE_OPTS } from '@/features/solicitacao-operacao/data/parteRelacionadaFields';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';

const props = defineProps<{ partes: ParteRelacionada[] }>();
const emit = defineEmits<{
  add: [];
  open: [parte: ParteRelacionada];
  remove: [parte: ParteRelacionada];
}>();

const COLS = '1.1fr 1.8fr 1.2fr auto';
const filtroDocumento = ref('');
const filtroTipo = ref('');
const toDelete = ref<ParteRelacionada | null>(null);

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CON: { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
};

const filtradas = computed(() => {
  const doc = filtroDocumento.value.replace(/\D/g, '');
  const tipo = filtroTipo.value;
  return props.partes.filter((p) => {
    const matchDoc = !doc || p.documento.replace(/\D/g, '').includes(doc);
    const matchTipo = !tipo || p.tipos.includes(tipo as ParteTipo);
    return matchDoc && matchTipo;
  });
});

const tiposUsados = computed(() => {
  const set = new Set<ParteTipo>();
  filtradas.value.forEach((p) => p.tipos.forEach((t) => set.add(t)));
  return [...set];
});

function onRemove(parte: ParteRelacionada, e: Event) {
  e.stopPropagation();
  toDelete.value = parte;
}

function confirmRemove() {
  if (!toDelete.value) return;
  emit('remove', toDelete.value);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-end justify-between" style="gap: 12px; flex-wrap: wrap">
      <div class="flex items-end" style="gap: 10px; flex-wrap: wrap; flex: 1">
        <div style="min-width: 200px; flex: 1; max-width: 280px">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Documento
          </div>
          <input
            v-model="filtroDocumento"
            placeholder="CPF ou CNPJ"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
        <div style="min-width: 180px">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Tipo
          </div>
          <select
            v-model="filtroTipo"
            style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          >
            <option value="">Todos</option>
            <option v-for="t in TIPOS_PARTE_OPTS" :key="t.codigo" :value="t.codigo">{{ t.codigo }} — {{ t.label }}</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        class="flex items-center"
        style="gap: 8px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); flex-shrink: 0"
        @click="emit('add')"
      >
        <Plus :size="14" />
        Cadastrar
      </button>
    </div>

    <div style="font-size: var(--text-sm); color: var(--text-muted)">
      {{ filtradas.length }}
      {{ filtradas.length === 1 ? 'parte cadastrada' : 'partes cadastradas' }}
    </div>

    <div
      v-if="filtradas.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhuma parte relacionada cadastrada.
    </div>

    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div style="text-align: right">Ação</div>
      </div>

      <div
        v-for="(p, idx) in filtradas"
        :key="`${p.documento}-${idx}`"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">
          {{ p.documento }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ p.nome }}
        </div>
        <div class="flex items-center" style="gap: 4px; flex-wrap: wrap">
          <span
            v-for="t in p.tipos"
            :key="t"
            :title="PARTE_TIPO_LABEL[t]"
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
        <div class="flex justify-end" style="gap: 6px">
          <button
            type="button"
            aria-label="Editar parte relacionada"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="emit('open', p)"
          >
            <Pencil :size="14" />
          </button>
          <button
            type="button"
            aria-label="Remover parte relacionada"
            class="flex items-center justify-center"
            style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)"
            @click="onRemove(p, $event)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="tiposUsados.length" class="flex items-center" style="gap: 16px; flex-wrap: wrap">
      <span
        v-for="t in tiposUsados"
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
        {{ PARTE_TIPO_LABEL[t] }}
      </span>
    </div>

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Remover a parte relacionada “${toDelete.nome}”?`"
      description="Esta ação desvincula a parte deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmRemove"
    />
  </div>
</template>
```

## Screens / tabs

### ContasBancariasTab

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Star, Trash2 } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import { BANCO_GRUPO_OPTS, type ContaBancariaGrupo } from '../../data/gruposCadastroData';

const props = defineProps<{ contas: ContaBancariaGrupo[] }>();
const emit = defineEmits<{
  add: [conta: ContaBancariaGrupo];
  remove: [id: string];
  setPrincipal: [id: string];
}>();

const draft = reactive({
  banco: BANCO_GRUPO_OPTS[0] ?? '',
  agencia: '',
  conta: '',
  titular: '',
});
const toDelete = ref<ContaBancariaGrupo | null>(null);

function cadastrar() {
  if (!draft.banco || !draft.agencia.trim() || !draft.conta.trim() || !draft.titular.trim()) return;
  emit('add', {
    id: `cc-${Date.now()}`,
    banco: draft.banco,
    agencia: draft.agencia.trim(),
    conta: draft.conta.trim(),
    titular: draft.titular.trim(),
    principal: props.contas.length === 0,
  });
  draft.agencia = '';
  draft.conta = '';
  draft.titular = '';
}

function excluir(conta: ContaBancariaGrupo) {
  toDelete.value = conta;
}

function confirmExcluir() {
  if (!toDelete.value) return;
  emit('remove', toDelete.value.id);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
      <StepGrid>
        <SelectField v-model="draft.banco" label="Banco" :options="[...BANCO_GRUPO_OPTS]" :span="4" />
        <FormField v-model="draft.agencia" label="Agência" :span="2" />
        <FormField v-model="draft.conta" label="Conta" :span="3" />
        <FormField v-model="draft.titular" label="Titularidade da conta bancária" :span="3" />
      </StepGrid>
      <div class="flex justify-end" style="margin-top: 14px">
        <button
          type="button"
          style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="cadastrar"
        >
          CADASTRAR
        </button>
      </div>
    </div>

    <div
      v-if="contas.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhuma conta bancária cadastrada.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: auto 1.4fr 0.8fr 0.9fr 1.4fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Principal</div>
        <div>Nome</div>
        <div>Agência</div>
        <div>Número</div>
        <div>Titularidade</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="c in contas"
        :key="c.id"
        class="grid items-center"
        style="grid-template-columns: auto 1.4fr 0.8fr 0.9fr 1.4fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div>
          <button
            type="button"
            :aria-label="c.principal ? 'Conta principal' : 'Definir como principal'"
            class="flex items-center justify-center"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.principal ? 'var(--agro-base)' : 'var(--text-muted)',
            }"
            @click="emit('setPrincipal', c.id)"
          >
            <Star :size="16" :fill="c.principal ? 'currentColor' : 'none'" />
          </button>
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.banco }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ c.agencia }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ c.conta }}</div>
        <div style="color: var(--text-default)">{{ c.titular }}</div>
        <div class="flex justify-end">
          <button type="button" aria-label="Excluir conta" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(c)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir a conta “${toDelete.banco}” — ${toDelete.conta}?`"
      description="Esta ação remove a conta bancária deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmExcluir"
    />
  </div>
</template>
```

### DocumentosTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-vue-next';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import { DOCUMENTO_TIPO_OPTS, type DocumentoGrupo } from '../../data/gruposCadastroData';

const props = defineProps<{ documentos: DocumentoGrupo[] }>();
const emit = defineEmits<{
  add: [doc: DocumentoGrupo];
  remove: [id: string];
}>();

const tipo = ref(DOCUMENTO_TIPO_OPTS[0] ?? '');
const arquivoNome = ref('');
const fileRef = ref<HTMLInputElement | null>(null);
const toDelete = ref<DocumentoGrupo | null>(null);

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  arquivoNome.value = input.files?.[0]?.name ?? '';
}

function inserir() {
  if (!arquivoNome.value.trim() || !tipo.value) return;
  emit('add', {
    id: `doc-${Date.now()}`,
    nome: arquivoNome.value.trim(),
    tipo: tipo.value,
    validoAte: '',
  });
  arquivoNome.value = '';
  if (fileRef.value) fileRef.value.value = '';
}

function confirmExcluir() {
  if (!toDelete.value) return;
  emit('remove', toDelete.value.id);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 18px">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="flex items-center"
        :disabled="documentos.length === 0"
        :style="{
          gap: '8px',
          height: '38px',
          padding: '0 14px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          cursor: documentos.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: documentos.length === 0 ? 'var(--text-disabled)' : 'var(--text-strong)',
        }"
      >
        <Download :size="14" /> Baixar todos
      </button>
    </div>

    <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
      <button
        type="button"
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
          cursor: pointer;
          text-align: left;
        "
        @click="fileRef?.click()"
      >
        <Paperclip :size="15" />
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
          {{ arquivoNome || 'Selecionar arquivo...' }}
        </span>
      </button>
      <input ref="fileRef" type="file" hidden @change="onFile" />
      <select
        v-model="tipo"
        style="
          min-width: 180px;
          height: 42px;
          padding: 0 14px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-default);
          font-size: var(--text-sm);
        "
      >
        <option v-for="opt in DOCUMENTO_TIPO_OPTS" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <button
        type="button"
        class="flex items-center"
        :disabled="!arquivoNome"
        :style="{
          gap: '8px',
          height: '42px',
          padding: '0 18px',
          background: arquivoNome ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
          color: arquivoNome ? 'var(--action-primary-text)' : 'var(--text-disabled)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: arquivoNome ? 'pointer' : 'not-allowed',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.06em',
        }"
        @click="inserir"
      >
        <Plus :size="15" /> Inserir
      </button>
    </div>

    <div
      v-if="documentos.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhum documento anexado.
    </div>
    <div v-else class="flex flex-col" style="gap: 10px">
      <div
        v-for="d in documentos"
        :key="d.id"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); flex-shrink: 0"
        >
          <FileText :size="18" />
        </div>
        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ d.nome }}</span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 2px 7px;
                border-radius: var(--radius-sm);
                background: var(--status-neutral-bg);
                color: var(--status-neutral-text);
                text-transform: uppercase;
              "
            >
              {{ d.tipo }}
            </span>
          </div>
          <div
            v-if="d.validoAte"
            style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px"
          >
            Válido até {{ d.validoAte }}
          </div>
        </div>
        <button
          type="button"
          aria-label="Baixar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--gci-base)"
        >
          <Download :size="15" />
        </button>
        <button
          type="button"
          aria-label="Excluir"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
          @click="toDelete = d"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir o documento “${toDelete.nome}”?`"
      description="Esta ação remove o arquivo anexado deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmExcluir"
    />
  </div>
</template>
```

### FaturamentoTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import { parseCurrencyInput } from '@/features/solicitacao-operacao/utils/currencyMask';
import { brl } from '@/features/risco/data/riscoData';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import type { FaturamentoGrupo } from '../../data/gruposCadastroData';

defineProps<{ faturamentos: FaturamentoGrupo[] }>();
const emit = defineEmits<{
  add: [item: FaturamentoGrupo];
  remove: [id: string];
}>();

const valorMasked = ref('R$ 0,00');
const anoFiscal = ref('');
const toDelete = ref<FaturamentoGrupo | null>(null);

function cadastrar() {
  const valor = parseCurrencyInput(valorMasked.value);
  const ano = anoFiscal.value.trim();
  if (!valor || !/^\d{4}$/.test(ano)) return;
  emit('add', { id: `fat-${Date.now()}`, valor, anoFiscal: ano });
  valorMasked.value = 'R$ 0,00';
  anoFiscal.value = '';
}

function excluir(item: FaturamentoGrupo) {
  toDelete.value = item;
}

function confirmExcluir() {
  if (!toDelete.value) return;
  emit('remove', toDelete.value.id);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
      <StepGrid>
        <FormField v-model="valorMasked" label="Faturamento" currency :span="5" />
        <FormField v-model="anoFiscal" label="Ano fiscal" placeholder="2026" :span="3" />
        <div style="grid-column: span 4; display: flex; align-items: flex-end">
          <button
            type="button"
            style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
            @click="cadastrar"
          >
            CADASTRAR
          </button>
        </div>
      </StepGrid>
    </div>

    <div
      v-if="faturamentos.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhum faturamento cadastrado.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Valor</div>
        <div>Ano fiscal</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="f in faturamentos"
        :key="f.id"
        class="grid items-center"
        style="grid-template-columns: 1.4fr 1fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(f.valor) }}</div>
        <div style="color: var(--text-default)">{{ f.anoFiscal }}</div>
        <div class="flex justify-end">
          <button type="button" aria-label="Excluir faturamento" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(f)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir o faturamento de ${toDelete.anoFiscal}?`"
      description="Esta ação remove o registro de faturamento deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmExcluir"
    />
  </div>
</template>
```

### GarantiasTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import GarantiaMinutaStep from '@/features/solicitacao-operacao/components/modals/minuta/GarantiaMinutaStep.vue';
import type { GarantiaMinuta } from '@/features/solicitacao-operacao/data/minutaData';

const props = defineProps<{ garantias: GarantiaMinuta[] }>();
const emit = defineEmits<{ 'update:garantias': [items: GarantiaMinuta[]] }>();

const model = computed({
  get: () => props.garantias,
  set: (next) => emit('update:garantias', next),
});
</script>

<template>
  <GarantiaMinutaStep v-model:garantias="model" :edit-on-row-click="false" />
</template>
```

### NotificacoesTab

```vue
<script setup lang="ts">
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import type { FundoNotificacaoGrupo } from '../../data/gruposCadastroData';

defineProps<{ fundos: FundoNotificacaoGrupo[] }>();
</script>

<template>
  <div
    v-if="fundos.length === 0"
    style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
  >
    Nenhum fundo vinculado a este grupo.
  </div>
  <div
    v-else
    style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
  >
    <div class="grid items-center" style="grid-template-columns: 1.8fr 1fr; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
      <div>Nome</div>
      <div>Status de notificação</div>
    </div>
    <div
      v-for="f in fundos"
      :key="f.id"
      class="grid items-center"
      style="grid-template-columns: 1.8fr 1fr; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.nome }}</div>
      <div class="flex items-center" style="gap: 8px">
        <CheckCircle2 v-if="f.notifiable" :size="18" style="color: var(--success-base)" />
        <XCircle v-else :size="18" style="color: var(--danger-base)" />
        <span :style="{ color: f.notifiable ? 'var(--success-base)' : 'var(--danger-base)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }">
          {{ f.notifiable ? 'Notificável' : 'Não notificável' }}
        </span>
      </div>
    </div>
  </div>
</template>
```
