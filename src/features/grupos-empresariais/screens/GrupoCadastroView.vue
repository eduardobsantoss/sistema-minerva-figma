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
import type { GarantiaGrupo } from '../data/gruposCadastroData';
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
  openGarantia: [garantia: GarantiaGrupo];
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

function setGarantias(items: GarantiaGrupo[]) {
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
        @open="emit('openGarantia', $event)"
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
