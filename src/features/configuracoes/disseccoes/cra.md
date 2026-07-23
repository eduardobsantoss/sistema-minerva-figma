# CRA's

## Screens

### CraDetailScreen

```vue
<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import {
  ArrowLeft, Wallet, FileText, Search, Filter,
  ChevronUp, ChevronDown, Plus, Settings2, Clock,
  CheckCircle2, XCircle, ScanLine, Briefcase, ArrowLeftRight, Users, Building2,
} from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { brl, num, type Cra, type CraTitulo, type Cessao, type Sacado, type CraSetup, type GrupoEmpresarialVinculo } from '../data/craData';
import CraHero from './cra-detail/CraHero.vue';
import TabBtn from './cra-detail/TabBtn.vue';
import OperacoesTable from './cra-detail/OperacoesTable.vue';
import TitulosTable from './cra-detail/TitulosTable.vue';
import StatusKPI from './cra-detail/StatusKPI.vue';
import ColPanel from './cra-detail/ColPanel.vue';
import CessoesTab from './cra-detail-tabs/CessoesTab.vue';
import SacadosTab from './cra-detail-tabs/SacadosTab.vue';
import GruposEmpresariaisTab from './cra-detail-tabs/GruposEmpresariaisTab.vue';
import SetupTab from './cra-detail-tabs/SetupTab.vue';
import CessaoFormModal from '../components/modals/CessaoFormModal.vue';
import SubirContratoMaeModal from '../components/modals/SubirContratoMaeModal.vue';

const props = defineProps<{ cra: Cra }>();
const emit = defineEmits<{
  back: [];
  createOperacao: [];
  openOperacao: [operacaoId: string];
  openTitulo: [operacaoId: string, tituloId: string];
  openSacado: [sacadoId: string];
  openGrupo: [grupoId: string];
  updateCessoes: [cessoes: Cessao[]];
  updateSacados: [sacados: Sacado[]];
  updateGrupos: [grupos: GrupoEmpresarialVinculo[]];
  updateSetup: [setup: CraSetup];
}>();

type Section = 'operacoes' | 'cessoes' | 'sacados' | 'grupos' | 'setup';
type ViewTab = 'operacoes' | 'titulos';

const SECTION_TABS: { key: Section; label: string; icon: Component }[] = [
  { key: 'operacoes', label: 'Operações', icon: Briefcase },
  { key: 'cessoes', label: 'Cessões', icon: ArrowLeftRight },
  { key: 'sacados', label: 'Sacados', icon: Users },
  { key: 'grupos', label: 'Grupos Empresariais', icon: Building2 },
  { key: 'setup', label: 'Setup', icon: Settings2 },
];

const openCarteira = ref(true);
const section = ref<Section>('operacoes');
const viewTab = ref<ViewTab>('operacoes');
const q = ref('');
const showColPanel = ref(false);

const cessaoModalOpen = ref(false);
const editingCessao = ref<Cessao | null>(null);

const contratoModalOpen = ref(false);
const uploadGrupo = ref<GrupoEmpresarialVinculo | null>(null);

const allTitulos = computed<CraTitulo[]>(() => props.cra.operacoes.flatMap((o) => o.titulos));
const filteredTitulos = computed(() =>
  allTitulos.value.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const totalCarteira = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const totalEmissao = computed(() => props.cra.operacoes.reduce((a, o) => a + o.valorEmissao, 0));

const operacaoClassMap = computed(() =>
  Object.fromEntries(props.cra.operacoes.map((o, i) => [o.id, String(i + 1)])),
);

function handleOpenTitulo(r: CraTitulo) {
  emit('openTitulo', r.operacaoId, r.id);
}

function openCreateCessao() {
  editingCessao.value = null;
  cessaoModalOpen.value = true;
}

function openEditCessao(c: Cessao) {
  editingCessao.value = c;
  cessaoModalOpen.value = true;
}

function closeCessaoModal() {
  cessaoModalOpen.value = false;
  editingCessao.value = null;
}

function saveCessao(c: Cessao) {
  const list = [...props.cra.cessoes];
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) list[idx] = c;
  else list.push(c);
  emit('updateCessoes', list);
  closeCessaoModal();
}

function deleteCessao(id: string) {
  emit(
    'updateCessoes',
    props.cra.cessoes.filter((c) => c.id !== id),
  );
}

function handleSacadoUpdate(s: Sacado) {
  emit(
    'updateSacados',
    props.cra.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

function handleToggleApto(id: string) {
  emit(
    'updateGrupos',
    props.cra.grupos.map((g) => {
      if (g.id !== id) return g;
      if (!g.apto && !g.masterContractUrl) return g;
      return { ...g, apto: !g.apto };
    }),
  );
}

function openUploadContrato(g: GrupoEmpresarialVinculo) {
  uploadGrupo.value = g;
  contratoModalOpen.value = true;
}

function closeContratoModal() {
  contratoModalOpen.value = false;
  uploadGrupo.value = null;
}

function saveContratoMae(payload: { date: string; fileName: string }) {
  if (!uploadGrupo.value) return;
  const updated = props.cra.grupos.map((g) =>
    g.id === uploadGrupo.value!.id
      ? {
          ...g,
          masterContractDate: payload.date,
          masterContractUrl: `#${payload.fileName}`,
        }
      : g,
  );
  emit('updateGrupos', updated);
  closeContratoModal();
}

function handleSetupUpdate(setup: CraSetup) {
  emit('updateSetup', setup);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ cra.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ cra.cessionaria }} · {{ cra.cnpj }} · Gestão de Operações e Títulos
        </p>
      </div>
    </div>

    <CraHero :total-emissao="totalEmissao" :cra="cra" />

    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <button
        class="relative w-full flex items-center"
        style="gap: 16px; padding: 20px 24px; background: var(--success-base); color: #fff; border: none; cursor: pointer; text-align: left"
        @click="openCarteira = !openCarteira"
      >
        <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 9999px; background: rgba(255,255,255,0.06)" />
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.18); position: relative; z-index: 1">
          <Wallet :size="22" />
        </div>
        <div style="flex: 1; position: relative; z-index: 1">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.85; margin-bottom: 4px">
            Carteira da Operação
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ num(totalCarteira.titulos) }} títulos ativos
          </div>
        </div>
        <span
          class="flex items-center"
          style="gap: 8px; font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 14px; background: rgba(255,255,255,0.15); border-radius: var(--radius-lg); position: relative; z-index: 1"
        >
          {{ openCarteira ? 'Recolher Indicadores' : 'Exibir Indicadores' }}
          <ChevronUp v-if="openCarteira" :size="14" />
          <ChevronDown v-else :size="14" />
        </span>
      </button>
      <div v-if="openCarteira" class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 20px">
        <StatusKPI
          :icon="Clock" label="Pendente"
          :qty="allTitulos.filter((t) => t.status === 'PENDENTE').length"
          :value="brl(allTitulos.filter((t) => t.status === 'PENDENTE').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-warning-bg)" fg="var(--status-warning-text)"
        />
        <StatusKPI
          :icon="ScanLine" label="Análise Documental"
          :qty="0"
          :value="brl(0, true)"
          bg="var(--status-neutral-bg)" fg="var(--status-neutral-text)"
        />
        <StatusKPI
          :icon="XCircle" label="Rejeitado"
          :qty="allTitulos.filter((t) => t.status === 'VENCIDO').length"
          :value="brl(allTitulos.filter((t) => t.status === 'VENCIDO').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-danger-bg)" fg="var(--status-danger-text)"
        />
        <StatusKPI
          :icon="CheckCircle2" label="Validado"
          :qty="allTitulos.filter((t) => t.status === 'CONFIRMADO').length"
          :value="brl(allTitulos.filter((t) => t.status === 'CONFIRMADO').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-success-bg)" fg="var(--status-success-text)"
        />
        <StatusKPI
          :icon="Wallet" label="Em Carteira"
          :qty="totalCarteira.titulos"
          :value="brl(totalCarteira.valor, true)"
          bg="var(--status-active-bg)" fg="var(--status-active-text)"
        />
      </div>
    </div>

    <SegmentedToggle
      :model-value="section"
      :options="SECTION_TABS"
      variant="brand"
      @update:model-value="section = $event as Section"
    />

    <div
      v-if="section === 'operacoes'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ viewTab === 'operacoes' ? 'Operações do CRA' : 'Títulos da Carteira' }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ viewTab === 'operacoes' ? `${cra.operacoes.length} operações cadastradas` : `${allTitulos.length} títulos na carteira` }}
          </div>
        </div>

        <button
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="emit('createOperacao')"
        >
          <Plus :size="14" /> NOVA OPERAÇÃO
        </button>

        <div class="flex" style="padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <TabBtn :active="viewTab === 'operacoes'" @click="viewTab = 'operacoes'">VISUALIZAR OPERAÇÕES</TabBtn>
          <TabBtn :active="viewTab === 'titulos'" @click="viewTab = 'titulos'">VISUALIZAR TÍTULOS</TabBtn>
        </div>

        <div class="flex items-center" style="gap: 6px; position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="showColPanel = !showColPanel"
          >
            <Settings2 :size="16" />
          </button>
          <button
            aria-label="Filtros"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
          >
            <Filter :size="16" />
          </button>
          <ColPanel v-if="showColPanel" :tab="viewTab" @close="showColPanel = false" />
        </div>
      </div>

      <div v-if="viewTab === 'titulos'" style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, cedente ou sacado..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <OperacoesTable v-if="viewTab === 'operacoes'" :rows="cra.operacoes" @open="emit('openOperacao', $event)" />
      <TitulosTable v-else :rows="filteredTitulos" :class-map="operacaoClassMap" @open="handleOpenTitulo" />

      <div class="flex items-center justify-end" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
            Operação Ativa:
          </span>
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 6px 12px; background: var(--gci-base); color: #fff; border-radius: var(--radius-sm)">
            TODAS
          </span>
        </div>
      </div>
    </div>

    <div
      v-else-if="section === 'cessoes'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <CessoesTab
        :cessoes="cra.cessoes"
        @create="openCreateCessao"
        @edit="openEditCessao"
        @delete="deleteCessao"
      />
    </div>

    <div
      v-else-if="section === 'sacados'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <SacadosTab
        :sacados="cra.sacados"
        @open="emit('openSacado', $event)"
        @update="handleSacadoUpdate"
      />
    </div>

    <div
      v-else-if="section === 'grupos'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <GruposEmpresariaisTab
        :grupos="cra.grupos"
        @open="emit('openGrupo', $event)"
        @upload="openUploadContrato"
        @toggle-apto="handleToggleApto"
      />
    </div>

    <div
      v-else-if="section === 'setup'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <SetupTab :setup="cra.setup" @update="handleSetupUpdate" />
    </div>

    <CessaoFormModal
      v-if="cessaoModalOpen"
      :cessao="editingCessao"
      @close="closeCessaoModal"
      @save="saveCessao"
    />

    <SubirContratoMaeModal
      v-if="contratoModalOpen && uploadGrupo"
      :initial-date="uploadGrupo.masterContractDate"
      @close="closeContratoModal"
      @save="saveContratoMae"
    />
  </div>
</template>
```

### CraListScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Briefcase, Wallet, AlertCircle, FileStack } from 'lucide-vue-next';
import { brl, num, type Cra } from '../data/craData';
import CraCard from '../components/CraCard.vue';

const props = defineProps<{ cras: Cra[] }>();
const emit = defineEmits<{ open: [id: string]; new: [] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() =>
  props.cras.filter(
    (c) =>
      !q.value ||
      c.nome.toLowerCase().includes(q.value.toLowerCase()) ||
      c.cnpj.includes(q.value) ||
      c.cessionaria.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const allOps = computed(() => props.cras.flatMap((c) => c.operacoes));
const totalCarteira = computed(() => allOps.value.reduce((s, o) => s + (o.carteira?.valor ?? 0), 0));
const totalVencido = computed(() => allOps.value.reduce((s, o) => s + (o.vencido?.valor ?? 0), 0));
const totalTitulos = computed(() => allOps.value.reduce((s, o) => s + (o.carteira?.titulos ?? 0), 0));

const kpis = computed(() => [
  {
    label: 'Total de Carteiras',
    value: String(props.cras.length),
    icon: Briefcase,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Valor em Carteira',
    value: brl(totalCarteira.value, true),
    icon: Wallet,
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    label: 'Valor Vencido',
    value: brl(totalVencido.value, true),
    icon: AlertCircle,
    tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  },
  {
    label: 'Total de Títulos',
    value: num(totalTitulos.value),
    icon: FileStack,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Barra de pesquisa + ação -->
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search
          :size="18"
          style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
        />
        <input
          v-model="q"
          @focus="focus = true"
          @blur="focus = false"
          placeholder="Pesquisar por nome da operação, cessionária ou CNPJ..."
          style="
            width: 100%;
            height: 56px;
            border: none;
            outline: none;
            background: transparent;
            padding-left: 52px;
            padding-right: 160px;
            font-size: var(--text-base);
            color: var(--text-strong);
            border-radius: var(--radius-xl);
          "
        />
        <button
          style="
            position: absolute;
            right: 8px;
            top: 8px;
            bottom: 8px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
          "
        >
          PESQUISAR
        </button>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 56px;
          padding: 0 24px;
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
        @click="emit('new')"
      >
        <span
          class="flex items-center justify-center"
          style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)"
        >
          <Plus :size="14" />
        </span>
        NOVO CRA
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 20px"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de cards -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CraCard v-for="c in filtered" :key="c.id" :cra="c" @open="emit('open', $event)" />
    </div>
  </div>
</template>
```

### CraOperacaoDetailScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, FileText, TrendingUp, AlertCircle, Search, Filter, Settings2,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, num, type Cra, type CraOperacao, type CraTitulo } from '../data/craData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ cra: Cra; operacao: CraOperacao }>();
const emit = defineEmits<{ back: []; openTitulo: [tituloId: string] }>();

const TITULO_COLS = ['Classe', 'Nº Título', 'Tipo', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'] as const;

const q = ref('');
const showColPanel = ref(false);
const visibleCols = ref<Record<string, boolean>>(Object.fromEntries(TITULO_COLS.map((c) => [c, true])));

function toggleCol(col: string) {
  visibleCols.value = { ...visibleCols.value, [col]: !visibleCols.value[col] };
}

const filtered = computed(() =>
  props.operacao.titulos.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });

// All titles in this operação belong to classe 1
const classMap = computed<Record<string, string>>(() =>
  Object.fromEntries(props.operacao.titulos.map((t) => [t.operacaoId, '1'])),
);

function statusStyle(s: CraTitulo['status']) {
  return {
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  }[s];
}

const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

interface Kpi {
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}

const kpis = computed<Kpi[]>(() => [
  { icon: TrendingUp, label: 'Valor de Emissão', value: brl(props.operacao.valorEmissao), tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { icon: FileText, label: 'Valor em Carteira', value: brl(props.operacao.carteira.valor), tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { icon: AlertCircle, label: 'Valor Vencido', value: brl(props.operacao.vencido.valor), tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
  { icon: FileText, label: 'Títulos Ativos', value: num(props.operacao.carteira.titulos), tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ cra.nome }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ operacao.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ operacao.tipo }} · {{ operacao.cessionaria }}
        </p>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl)"
      >
        <div class="flex items-center justify-center" :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }">
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ k.label }}</div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ k.value }}</div>
        </div>
      </div>
    </div>

    <!-- Titles panel -->
    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">Títulos da Operação</div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ operacao.titulos.length }} títulos cadastrados
          </div>
        </div>
        <div class="flex items-center" style="gap: 6px; position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="showColPanel = !showColPanel"
          >
            <Settings2 :size="16" />
          </button>
          <button
            aria-label="Filtros"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
          >
            <Filter :size="16" />
          </button>
          <template v-if="showColPanel">
            <div style="position: fixed; inset: 0; z-index: 10" @click="showColPanel = false" />
            <div style="position: absolute; top: 48px; right: 0; z-index: 20; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); padding: 16px; min-width: 200px; box-shadow: var(--shadow-md)">
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px">Colunas visíveis</div>
              <div
                v-for="c in TITULO_COLS"
                :key="c"
                class="flex items-center"
                style="gap: 10px; cursor: pointer; margin-bottom: 8px"
                @click="toggleCol(c)"
              >
                <div @click.stop>
                  <Checkbox :checked="visibleCols[c]" @change="toggleCol(c)" />
                </div>
                <span style="font-size: var(--text-sm); color: var(--text-default)">{{ c }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Search -->
      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, cedente ou sacado..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
            @input="setPage(1)"
          />
        </div>
      </div>

      <!-- Table -->
      <div v-if="filtered.length === 0" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">Nenhum título encontrado.</div>
      <div v-else>
        <div
          class="grid"
          :style="{ gridTemplateColumns: cols, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
        >
          <div>Classe</div>
          <div>Nº Título</div>
          <div>Tipo</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Vencimento</div>
          <div>VR. Nominal</div>
          <div style="text-align: right">Status</div>
        </div>
        <div
          v-for="r in pageItems"
          :key="r.id"
          class="cra-op-detail-row grid items-center"
          :style="{ gridTemplateColumns: cols, padding: '16px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
          @click="emit('openTitulo', r.id)"
        >
          <div>
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 8px; border-radius: var(--radius-sm); background: var(--status-neutral-bg); color: var(--status-neutral-text)">
              {{ classMap[r.operacaoId] ?? '1' }}
            </span>
          </div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">#{{ r.numero }}</div>
          <div>
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 7px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">{{ r.tipo }}</span>
          </div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.cedenteCnpj }}</div>
          </div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.sacado }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.sacadoCnpj }}</div>
          </div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.vencimento }}</div>
          <div :style="{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }">{{ brl(r.vrNominal) }}</div>
          <div style="text-align: right">
            <span :style="{ fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: '9999px', background: statusStyle(r.status)!.bg, color: statusStyle(r.status)!.fg }">{{ r.status }}</span>
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
  </div>
</template>

<style scoped>
.cra-op-detail-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### CraRelatoriosScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  Download,
  Wallet,
  BellRing,
  Receipt,
  FileText,
  Users,
} from 'lucide-vue-next';
import { cras } from '../data/craData';
import {
  PORTFOLIO_REPORTS,
  SITUACAO_FUNDO_OPTS,
  mockCraPortfolioRows,
  toPortfolioCsv,
  type PortfolioReportKey,
} from '../data/relatoriosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const REPORT_ICONS: Record<PortfolioReportKey, Component> = {
  ger001: Wallet,
  ger002: Receipt,
  ger003: BellRing,
  ger004: FileText,
  ger005: Users,
};

const selected = ref<PortfolioReportKey | null>(null);
const hoveredKey = ref<PortfolioReportKey | null>(null);
const draft = reactive({ situacao: '', cessionaria: '' });
const selectedIds = ref<string[]>([]);
const applied = ref(false);

const report = computed(() => PORTFOLIO_REPORTS.find((r) => r.key === selected.value) ?? null);

const cessionarias = computed(() =>
  Array.from(new Set(cras.map((c) => c.cessionaria))).sort(),
);

const filteredFunds = computed(() =>
  cras.filter((c) => {
    if (draft.situacao && c.status !== draft.situacao) return false;
    if (draft.cessionaria && c.cessionaria !== draft.cessionaria) return false;
    return true;
  }),
);

const allFilteredSelected = computed(
  () =>
    filteredFunds.value.length > 0 &&
    filteredFunds.value.every((f) => selectedIds.value.includes(f.id)),
);

const results = computed(() => {
  if (!applied.value || !selected.value) return [];
  const funds = filteredFunds.value.filter((f) => selectedIds.value.includes(f.id));
  return mockCraPortfolioRows(selected.value, funds);
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

function selectReport(key: PortfolioReportKey) {
  selected.value = key;
  draft.situacao = '';
  draft.cessionaria = '';
  selectedIds.value = cras.map((c) => c.id);
  applied.value = false;
}

function toggleFund(id: string) {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) selectedIds.value = selectedIds.value.filter((x) => x !== id);
  else selectedIds.value = [...selectedIds.value, id];
}

function toggleAllFiltered() {
  if (allFilteredSelected.value) {
    const remove = new Set(filteredFunds.value.map((f) => f.id));
    selectedIds.value = selectedIds.value.filter((id) => !remove.has(id));
  } else {
    const add = filteredFunds.value.map((f) => f.id);
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...add]));
  }
}

function handleGerar() {
  applied.value = true;
  setPage(1);
}

function handleExportCsv() {
  if (!report.value) return;
  const csv = toPortfolioCsv(results.value);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = report.value.fileName;
  a.click();
  URL.revokeObjectURL(url);
}

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
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        CRA's
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
        v-for="r in PORTFOLIO_REPORTS"
        :key="r.key"
        class="flex flex-col"
        type="button"
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
        <div
          class="flex items-center justify-center"
          style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)"
        >
          <component :is="REPORT_ICONS[r.key]" :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
            {{ r.title }}
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
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Relatórios · CRA's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 18px">
        <div>
          <div :style="labelStyle">Situação do fundo</div>
          <select v-model="draft.situacao" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="o in SITUACAO_FUNDO_OPTS" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Cessionária</div>
          <select v-model="draft.cessionaria" :style="inputStyle">
            <option value="">Todas</option>
            <option v-for="o in cessionarias" :key="o" :value="o">{{ o }}</option>
          </select>
        </div>
      </div>

      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
        Selecionar CRA's
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 18px">
        <div
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1.4fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allFilteredSelected" @change="toggleAllFiltered" />
          </div>
          <div>Nome</div>
          <div>CNPJ</div>
          <div>Cessionária</div>
          <div>Status</div>
        </div>
        <div
          v-for="f in filteredFunds"
          :key="f.id"
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1.4fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="toggleFund(f.id)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.includes(f.id)" @change="toggleFund(f.id)" />
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.nome }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ f.cnpj }}</div>
          <div style="color: var(--text-default)">{{ f.cessionaria }}</div>
          <div style="color: var(--text-muted)">{{ f.status }}</div>
        </div>
        <div v-if="filteredFunds.length === 0" style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
          Nenhum CRA para os filtros.
        </div>
      </div>

      <div class="flex items-center justify-end">
        <button
          type="button"
          class="flex items-center"
          :disabled="selectedIds.length === 0"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 20px',
            background: 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
            opacity: selectedIds.length === 0 ? 0.5 : 1,
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <div v-if="applied" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center justify-between" style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)">
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          type="button"
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

      <div v-if="results.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Selecione ao menos um CRA e gere o relatório.
      </div>
      <template v-else>
        <div
          class="grid"
          style="grid-template-columns: 2fr 1.2fr 1.4fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Fundo</div><div>CNPJ</div><div>Cessionária</div><div>Status</div><div>Métrica</div><div>Valor</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 2fr 1.2fr 1.4fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.fundo }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.cnpj }}</div>
          <div style="color: var(--text-default)">{{ row.cessionaria }}</div>
          <div style="color: var(--text-muted)">{{ row.status }}</div>
          <div style="color: var(--text-default)">{{ row.metrica }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ row.valor }}</div>
        </div>
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </template>
    </div>
  </div>
</template>
```

### CraScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import CraListScreen from './CraListScreen.vue';
import CraDetailScreen from './CraDetailScreen.vue';
import CraOperacaoDetailScreen from './CraOperacaoDetailScreen.vue';
import CraTitleDetailScreen from './CraTitleDetailScreen.vue';
import SacadoDetailScreen from './SacadoDetailScreen.vue';
import GrupoEmpresarialDetailScreen from './GrupoEmpresarialDetailScreen.vue';
import CreateCraModal, { type NewCraData } from '../components/CreateCraModal.vue';
import CreateCraOperacaoModal, { type NewCraOperacaoData } from '../components/CreateCraOperacaoModal.vue';
import { cras as initialCras, type Cra, type CraOperacao, type Cessao, type Sacado, type CraSetup, type GrupoEmpresarialVinculo } from '../data/craData';

type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string }
  | { level: 'sacado'; craId: string; sacadoId: string }
  | { level: 'grupo'; craId: string; grupoId: string };

function defaultSetup(nome: string): CraSetup {
  return {
    nome,
    custodiante: '',
    cessionaria: '—',
    prestadorServico: '',
    beneficiarioFinal: '—',
    grupoOperacao: '',
    tipoCalculoElegibilidade: 'Valor presente',
    accrual: false,
    exigirIe: false,
    topSacados: false,
    topCedentes: false,
    tiposTituloAtivos: false,
    entregaFutura: false,
    limiteConcentracaoPct: '',
    limiteVencimentoMin: '',
    limiteVencimentoMax: '',
    bondTypes: [],
    carteiraNome: '',
    carteiraBanco: '',
    carteiraSlug: '',
    carteiraCnab: '',
    carteiraConta: '',
    carteiraAgencia: '',
    vencimentoFimSemana: false,
    beneficiarioNome: '',
    beneficiarioCep: '',
    beneficiarioCidade: '',
    beneficiarioUf: '',
    jurosBoleto: '',
    multaBoleto: '',
    eligibilityTops: [],
  };
}

function buildCraFromForm(data: NewCraData): Cra {
  const nome = data.nomeFantasia || 'NOVO CRA';
  return {
    id: `cra-${Date.now()}`,
    nome,
    cnpj: '—',
    cessionaria: '—',
    status: 'EM ANDAMENTO',
    tipo: data.tipoOperacao === 'Mono CRA' ? 'MONO CRA' : 'MULTI CRA',
    operacoes: [],
    cessoes: [],
    sacados: [],
    grupos: [],
    setup: defaultSetup(nome),
  };
}

function buildOperacaoFromForm(data: NewCraOperacaoData): CraOperacao {
  const id = `op-${Date.now()}`;
  return {
    id,
    nome: data.nome || 'NOVA OPERAÇÃO',
    tipo: data.tipoCliente === 'Monocedente' ? 'MONO CRA' : 'MULTI CRA',
    numeroEmissao: data.numeroEmissao || '—',
    cessionaria: data.cessionaria || '—',
    prestadorServico: data.prestadorServico || '—',
    custodiante: data.custodiante || '—',
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    partesRelacionadas: { pct: 0, valor: 0 },
    novosSacados: { pct: 0, valor: 0 },
    valorEmissao: parseFloat((data.valorEmissao ?? '').replace(/[^\d,]/g, '').replace(',', '.')) || 0,
    dataEmissao: data.dataEmissao || '',
    dataInicio: data.dataInicio || '',
    dataVencimento: data.dataVencimento || '',
    titulos: [],
  };
}

const route = ref<Route>({ level: 'list' });
const creating = ref(false);
const creatingOperacao = ref(false);
const craList = ref<Cra[]>(initialCras);

function handleCreateCra(data: NewCraData) {
  craList.value = [...craList.value, buildCraFromForm(data)];
  creating.value = false;
}

function handleCreateOperacao(data: NewCraOperacaoData) {
  if (route.value.level !== 'cra') return;
  const operacao = buildOperacaoFromForm(data);
  const craId = route.value.craId;
  craList.value = craList.value.map((c) =>
    c.id === craId ? { ...c, operacoes: [...c.operacoes, operacao] } : c,
  );
  creatingOperacao.value = false;
}

function updateCessoes(craId: string, cessoes: Cessao[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, cessoes } : c));
}

function updateSacados(craId: string, sacados: Sacado[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, sacados } : c));
}

function updateGrupos(craId: string, grupos: GrupoEmpresarialVinculo[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, grupos } : c));
}

function updateSetup(craId: string, setup: CraSetup) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, setup } : c));
}

function handleSacadoUpdate(s: Sacado) {
  const r = route.value;
  if (r.level !== 'sacado') return;
  const current = craList.value.find((c) => c.id === r.craId);
  if (!current) return;
  updateSacados(
    r.craId,
    current.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

function handleGrupoUpdate(g: GrupoEmpresarialVinculo) {
  const r = route.value;
  if (r.level !== 'grupo') return;
  const current = craList.value.find((c) => c.id === r.craId);
  if (!current) return;
  updateGrupos(
    r.craId,
    current.grupos.map((x) => (x.id === g.id ? g : x)),
  );
}

const cra = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return craList.value.find((c) => c.id === r.craId);
});

const operacao = computed(() => {
  const r = route.value;
  if (r.level !== 'operacao' && r.level !== 'titulo') return undefined;
  return cra.value?.operacoes.find((o) => o.id === r.operacaoId);
});

const titulo = computed(() => {
  const r = route.value;
  if (r.level !== 'titulo') return undefined;
  return operacao.value?.titulos.find((t) => t.id === r.tituloId);
});

const sacado = computed(() => {
  const r = route.value;
  if (r.level !== 'sacado') return undefined;
  return cra.value?.sacados.find((s) => s.id === r.sacadoId);
});

const grupo = computed(() => {
  const r = route.value;
  if (r.level !== 'grupo') return undefined;
  return cra.value?.grupos.find((g) => g.id === r.grupoId);
});
</script>

<template>
  <template v-if="route.level === 'list'">
    <CraListScreen
      :cras="craList"
      @open="(craId) => (route = { level: 'cra', craId })"
      @new="creating = true"
    />
    <CreateCraModal v-if="creating" @close="creating = false" @create="handleCreateCra" />
  </template>

  <template v-else-if="route.level === 'cra' && cra">
    <CraDetailScreen
      :cra="cra"
      @back="route = { level: 'list' }"
      @create-operacao="creatingOperacao = true"
      @open-operacao="(operacaoId) => (route = { level: 'operacao', craId: cra!.id, operacaoId })"
      @open-titulo="(operacaoId, tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId, tituloId })"
      @open-sacado="(sacadoId) => (route = { level: 'sacado', craId: cra!.id, sacadoId })"
      @open-grupo="(grupoId) => (route = { level: 'grupo', craId: cra!.id, grupoId })"
      @update-cessoes="(cessoes) => updateCessoes(cra!.id, cessoes)"
      @update-sacados="(sacados) => updateSacados(cra!.id, sacados)"
      @update-grupos="(grupos) => updateGrupos(cra!.id, grupos)"
      @update-setup="(setup) => updateSetup(cra!.id, setup)"
    />
    <CreateCraOperacaoModal
      v-if="creatingOperacao"
      @close="creatingOperacao = false"
      @create="handleCreateOperacao"
    />
  </template>

  <SacadoDetailScreen
    v-else-if="route.level === 'sacado' && cra && sacado"
    :cra="cra"
    :sacado="sacado"
    @back="route = { level: 'cra', craId: cra.id }"
    @update="handleSacadoUpdate"
  />

  <GrupoEmpresarialDetailScreen
    v-else-if="route.level === 'grupo' && cra && grupo"
    :cra="cra"
    :grupo="grupo"
    @back="route = { level: 'cra', craId: cra.id }"
    @update="handleGrupoUpdate"
  />

  <CraOperacaoDetailScreen
    v-else-if="route.level === 'operacao' && cra && operacao"
    :cra="cra"
    :operacao="operacao"
    @back="route = { level: 'cra', craId: cra!.id }"
    @open-titulo="(tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId: operacao!.id, tituloId })"
  />

  <CraTitleDetailScreen
    v-else-if="route.level === 'titulo' && cra && operacao && titulo"
    :cra="cra"
    :operacao="operacao"
    :titulo="titulo"
    @back="route = { level: 'operacao', craId: cra!.id, operacaoId: operacao!.id }"
  />
</template>
```

### CraSimuladorScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Search, Plus } from 'lucide-vue-next';
import { brl, cras, type Cra } from '../data/craData';
import { MOCK_CONFINA_SIMULATIONS, type SavedSimulation } from '../data/simuladorData';
import CraCard from '../components/CraCard.vue';
import ConfinaPromissoryModal from '@/features/fidc/components/modals/ConfinaPromissoryModal.vue';

const selected = ref<Cra | null>(null);
const q = ref('');
const focus = ref(false);
const modalOpen = ref(false);
const simulations = ref<SavedSimulation[]>([...MOCK_CONFINA_SIMULATIONS]);

const filtered = computed(() =>
  cras.filter(
    (c) =>
      !q.value ||
      c.nome.toLowerCase().includes(q.value.toLowerCase()) ||
      c.cnpj.includes(q.value) ||
      c.cessionaria.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const vehicleName = computed(() => selected.value?.nome ?? '');

function openVehicle(id: string) {
  selected.value = cras.find((c) => c.id === id) ?? null;
}

function handleCreated() {
  simulations.value = [
    {
      id: `sim-confina-${Date.now()}`,
      type: 6,
      typeLabel: 'Termo Confina',
      grupo: 'Nova simulação',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: 980_000,
    },
    ...simulations.value,
  ];
}
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar CRA para simular..."
          style="width: 100%; height: 56px; border: none; outline: none; background: transparent; padding-left: 52px; padding-right: 160px; font-size: var(--text-base); color: var(--text-strong); border-radius: var(--radius-xl)"
          @focus="focus = true"
          @blur="focus = false"
        />
        <button
          type="button"
          style="position: absolute; right: 8px; top: 8px; bottom: 8px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em"
        >
          PESQUISAR
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CraCard v-for="c in filtered" :key="c.id" :cra="c" @open="openVehicle" />
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Simulador · CRA's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ selected.nome }}
        </h2>
      </div>
    </div>

    <div style="border-bottom: 1px solid var(--border-default)">
      <button
        type="button"
        style="padding: 10px 4px; margin-right: 22px; background: none; border: none; cursor: default; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); border-bottom: 2px solid var(--accent); margin-bottom: -1px"
      >
        Termo Confina
      </button>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="flex items-start justify-between" style="gap: 16px; margin-bottom: 18px">
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Nota promissória de gado</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; max-width: 560px; line-height: 1.5">
            Simule valor de compra vs. valor nominal a partir da cotação da arroba, peso do lote, juros e prazo.
          </div>
        </div>
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; height: 42px; padding: 0 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; flex-shrink: 0; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="modalOpen = true"
        >
          <Plus :size="15" /> GERAR TÍTULO
        </button>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="grid-template-columns: 1.2fr 1.4fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Tipo</div><div>Grupo</div><div>Criado em</div><div>Valor nominal</div>
        </div>
        <div
          v-for="s in simulations"
          :key="s.id"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1.4fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ s.typeLabel }}</div>
          <div style="color: var(--text-default)">{{ s.grupo }}</div>
          <div style="color: var(--text-muted)">{{ s.createdAt }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(s.valorNominal) }}</div>
        </div>
        <div v-if="simulations.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
          Nenhuma simulação nesta operação.
        </div>
      </div>
    </div>

    <ConfinaPromissoryModal
      v-if="modalOpen"
      :vehicle-name="vehicleName"
      @close="modalOpen = false"
      @created="handleCreated"
    />
  </div>
</template>
```

### CraTitleDetailScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, FileText, Paperclip, CreditCard, Activity,
  CheckCircle2, Clock, BadgeCheck, ArrowLeftRight, TrendingUp,
} from 'lucide-vue-next';
import { brl, type Cra, type CraOperacao, type CraTitulo, type TituloStatus } from '../data/craData';
import CopyButton from './cra-title-detail/CopyButton.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './cra-title-detail/DetailsTab.vue';
import AnexosTab from './cra-title-detail/AnexosTab.vue';
import AccrualTab from './cra-title-detail/AccrualTab.vue';
import PagamentosTab from './cra-title-detail/PagamentosTab.vue';
import ConfirmacoesTab from './cra-title-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './cra-title-detail/MovimentacoesTab.vue';
import MovimentoTab from './cra-title-detail/MovimentoTab.vue';

const props = defineProps<{ cra: Cra; operacao: CraOperacao; titulo: CraTitulo }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'anexos' as const, label: 'Anexos', icon: Paperclip },
  { key: 'accrual' as const, label: 'Accrual', icon: TrendingUp },
  { key: 'pagamentos' as const, label: 'Pagamentos', icon: CreditCard },
  { key: 'confirmacoes' as const, label: 'Confirmações', icon: BadgeCheck },
  { key: 'movimentacoes' as const, label: 'Movimentações', icon: ArrowLeftRight },
  { key: 'historico' as const, label: 'Histórico', icon: Activity },
];

const statusTone: Record<TituloStatus, { bg: string; fg: string; iconBg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', iconBg: 'var(--success-base)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', iconBg: 'var(--warning-base)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', iconBg: 'var(--danger-base)' },
};

const tab = ref<Tab>('detalhes');
const tone = computed(() => statusTone[props.titulo.status]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ cra.nome }} · {{ operacao.nome }}
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          Título #{{ titulo.numero }}
          <CopyButton :value="`Título #${titulo.numero}`" />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Auditoria e ciclo de vida do direito creditório
        </p>
      </div>
      <span
        class="flex items-center"
        :style="{ gap: '8px', fontSize: '11px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', padding: '8px 14px', background: tone.bg, color: tone.fg, borderRadius: '9999px' }"
      >
        <CheckCircle2 v-if="titulo.status === 'CONFIRMADO'" :size="14" />
        <Clock v-else :size="14" />
        {{ titulo.status }}
      </span>
    </div>

    <!-- Value hero -->
    <div class="relative overflow-hidden flex items-center" style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 28px 32px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8,60,74,0.40)">
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(titulo.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Tipo: {{ titulo.tipo }} · Emissão: {{ titulo.emissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetailsTab v-if="tab === 'detalhes'" :titulo="titulo" :operacao="operacao" />
      <AnexosTab v-else-if="tab === 'anexos'" :titulo="titulo" />
      <AccrualTab v-else-if="tab === 'accrual'" :titulo="titulo" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :titulo="titulo" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :titulo="titulo" />
      <MovimentoTab v-else-if="tab === 'historico'" :titulo="titulo" />
    </div>
  </div>
</template>
```

### GrupoEmpresarialDetailScreen

```vue
<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import {
  ArrowLeft, Users, UserCog, FileText, Landmark, TrendingUp, Shield, History,
} from 'lucide-vue-next';
import { brl, type Cra, type GrupoEmpresarialVinculo } from '../data/craData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import CedentesTab from './grupo-detail/CedentesTab.vue';
import PartesRelacionadasTab from './grupo-detail/PartesRelacionadasTab.vue';
import DocumentosTab from './grupo-detail/DocumentosTab.vue';
import ContaBancariaTab from './grupo-detail/ContaBancariaTab.vue';
import FaturamentoTab from './grupo-detail/FaturamentoTab.vue';
import GarantiasTab from './grupo-detail/GarantiasTab.vue';
import HistoricoTab from './grupo-detail/HistoricoTab.vue';

const props = defineProps<{ cra: Cra; grupo: GrupoEmpresarialVinculo }>();
const emit = defineEmits<{ back: []; update: [GrupoEmpresarialVinculo] }>();

type Tab = 'cedentes' | 'partes' | 'documentos' | 'conta' | 'faturamento' | 'garantias' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'partes', label: 'Partes Relacionadas', icon: UserCog },
  { key: 'documentos', label: 'Documentos', icon: FileText },
  { key: 'conta', label: 'Conta Bancária', icon: Landmark },
  { key: 'faturamento', label: 'Faturamento', icon: TrendingUp },
  { key: 'garantias', label: 'Garantias', icon: Shield },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('cedentes');
const localGrupo = ref<GrupoEmpresarialVinculo>({ ...props.grupo });

watch(
  () => props.grupo,
  (g) => {
    localGrupo.value = { ...g };
  },
  { deep: true },
);

const kpis = [
  { label: 'Limite', key: 'limite' as const, money: true },
  { label: 'Risco tomado', key: 'riscoTomado' as const, money: true },
  { label: 'Faturamento', key: 'faturamento' as const, money: true },
  { label: 'Data cadastro', key: 'dataCadastro' as const, money: false },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          CRA · Grupo Empresarial
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ localGrupo.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Gerente: {{ localGrupo.gerente ?? '—' }} · {{ cra.nome }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.key"
        style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
      >
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
          {{ k.label }}
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ k.money ? brl(localGrupo[k.key] as number) : localGrupo[k.key] }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <CedentesTab v-if="tab === 'cedentes'" :cedentes="localGrupo.cedentes" />
    <PartesRelacionadasTab v-else-if="tab === 'partes'" :partes="localGrupo.partesRelacionadas" />
    <DocumentosTab v-else-if="tab === 'documentos'" :documentos="localGrupo.documentos" />
    <ContaBancariaTab v-else-if="tab === 'conta'" :contas="localGrupo.contas" />
    <FaturamentoTab v-else-if="tab === 'faturamento'" :faturamentos="localGrupo.faturamentos" />
    <GarantiasTab v-else-if="tab === 'garantias'" :garantias="localGrupo.garantias" />
    <HistoricoTab v-else :eventos="localGrupo.historico" />
  </div>
</template>
```

### SacadoDetailScreen

```vue
<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import { ArrowLeft, FileText, User, History } from 'lucide-vue-next';
import type { Cra, Sacado } from '../data/craData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TitulosSubTab from './sacado-detail/TitulosSubTab.vue';
import DadosTab from './sacado-detail/DadosTab.vue';
import HistoricoTab from './sacado-detail/HistoricoTab.vue';

const props = defineProps<{ cra: Cra; sacado: Sacado }>();
const emit = defineEmits<{ back: []; update: [Sacado] }>();

type Tab = 'titulos' | 'dados' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'dados', label: 'Dados', icon: User },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('titulos');
const localSacado = ref<Sacado>({ ...props.sacado });

watch(
  () => props.sacado,
  (s) => {
    localSacado.value = { ...s };
  },
  { deep: true },
);

function onUpdate(s: Sacado) {
  localSacado.value = s;
  emit('update', s);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          CRA · Sacado
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ localSacado.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ localSacado.documento }} · {{ cra.nome }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <TitulosSubTab v-if="tab === 'titulos'" :cra="cra" :sacado="localSacado" />
    <DadosTab v-else-if="tab === 'dados'" :sacado="localSacado" @update="onUpdate" />
    <HistoricoTab v-else :eventos="localSacado.historico" />
  </div>
</template>
```

## Screens / cra-detail

### ColPanel

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';

const props = defineProps<{ tab: 'operacoes' | 'titulos' }>();
const emit = defineEmits<{ close: [] }>();

const CRA_OP_COLS = ['Nome da Operação', 'Status', 'Tipo', 'VR. Emissão', 'VR. Carteira', 'VR. Vencido', 'Títulos'];
const CRA_TIT_COLS = ['Classe', 'Nº Título', 'Tipo', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'];

const cols = props.tab === 'operacoes' ? CRA_OP_COLS : CRA_TIT_COLS;
const checked = ref<Record<string, boolean>>(Object.fromEntries(cols.map((c) => [c, true])));

function toggleCol(col: string) {
  checked.value = { ...checked.value, [col]: !checked.value[col] };
}
</script>

<template>
  <div style="position: fixed; inset: 0; z-index: 10" @click="emit('close')" />
  <div
    style="
      position: absolute;
      top: 48px;
      right: 0;
      z-index: 20;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
      padding: 16px;
      min-width: 220px;
      box-shadow: var(--shadow-md);
    "
  >
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px">
      Colunas visíveis
    </div>
    <div class="flex flex-col" style="gap: 8px">
      <div
        v-for="c in cols"
        :key="c"
        class="flex items-center"
        style="gap: 10px; cursor: pointer"
        @click="toggleCol(c)"
      >
        <div @click.stop>
          <Checkbox :checked="checked[c]" @change="toggleCol(c)" />
        </div>
        <span style="font-size: var(--text-sm); color: var(--text-default)">{{ c }}</span>
      </div>
    </div>
  </div>
</template>
```

### CraHero

```vue
<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';
import { brl, type Cra } from '../../data/craData';

defineProps<{ totalEmissao: number; cra: Cra }>();
</script>

<template>
  <div
    class="relative overflow-hidden flex items-center"
    style="
      background: var(--gci-base);
      border-radius: var(--radius-xl);
      padding: 28px 32px;
      color: #fff;
      box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.40);
    "
  >
    <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
    <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />
    <div style="flex: 1; position: relative; z-index: 1">
      <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
        Valor Total de Emissão
      </div>
      <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
        {{ brl(totalEmissao) }}
      </div>
      <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
        {{ cra.operacoes.length }} {{ cra.operacoes.length === 1 ? 'operação' : 'operações' }} · {{ cra.cessionaria }}
      </div>
    </div>
    <div class="flex items-center justify-center" style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1">
      <TrendingUp :size="26" />
    </div>
  </div>
</template>
```

### OperacoesTable

```vue
<script setup lang="ts">
import { brl, num, type CraOperacao } from '../../data/craData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ rows: CraOperacao[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = '2.4fr 0.8fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr';
</script>

<template>
  <div v-if="!rows.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    Nenhuma operação cadastrada para este CRA.
  </div>
  <div v-else>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: cols,
        padding: '14px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>Nome da Operação</div>
      <div>Status</div>
      <div>Tipo</div>
      <div>VR. Emissão</div>
      <div>VR. Carteira</div>
      <div>VR. Vencido</div>
      <div style="text-align: right">Títulos</div>
    </div>
    <div
      v-for="r in pageItems"
      :key="r.id"
      class="cra-op-row grid items-center"
      :style="{
        gridTemplateColumns: cols,
        padding: '18px 20px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
        borderLeft: '3px solid var(--gci-base)',
      }"
      @click="emit('open', r.id)"
    >
      <div class="flex items-center" style="gap: 12px">
        <div
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: var(--text-xs); font-weight: var(--weight-bold)"
        >
          {{ r.numeroEmissao }}
        </div>
        <div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-size: var(--text-sm)">
            {{ r.nome }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ r.cessionaria }}
          </div>
        </div>
      </div>
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 5px 10px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">
          {{ r.status }}
        </span>
      </div>
      <div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            background: r.tipo === 'MONO CRA' ? 'var(--agro-light)' : 'var(--gci-light)',
            color: r.tipo === 'MONO CRA' ? 'var(--agro-base)' : 'var(--gci-base)',
          }"
        >
          {{ r.tipo }}
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(r.valorEmissao) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(r.carteira.valor) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums">{{ brl(r.vencido.valor) }}</div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ num(r.carteira.titulos) }}</div>
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

<style scoped>
.cra-op-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### StatusKPI

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  qty: number;
  value: string;
  bg: string;
  fg: string;
}>();
</script>

<template>
  <div :style="{ padding: '14px', borderRadius: 'var(--radius-lg)', background: bg, borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 8px">
      <component :is="icon" :size="14" :style="{ color: fg, flexShrink: 0 }" :stroke-width="2" />
      <div :style="{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: fg, textTransform: 'uppercase' }">
        {{ label }}
      </div>
    </div>
    <div :style="{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: fg, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }">
      {{ qty }}
    </div>
    <div :style="{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: fg, opacity: 0.75, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }">
      {{ value }}
    </div>
  </div>
</template>
```

### TabBtn

```vue
<script setup lang="ts">
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    type="button"
    :style="{
      padding: '8px 14px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--duration-base)',
    }"
  >
    <slot />
  </button>
</template>
```

### TitulosTable

```vue
<script setup lang="ts">
import { brl, type CraTitulo } from '../../data/craData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{
  rows: CraTitulo[];
  classMap: Record<string, string>;
}>();
const emit = defineEmits<{ open: [row: CraTitulo] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

function statusStyle(s: CraTitulo['status']) {
  return {
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  }[s];
}
</script>

<template>
  <div v-if="!rows.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    Nenhum título encontrado para esta operação.
  </div>
  <div v-else>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: cols,
        padding: '14px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>Classe</div>
      <div>Nº Título</div>
      <div>Tipo</div>
      <div>Cedente</div>
      <div>Sacado</div>
      <div>Vencimento</div>
      <div>VR. Nominal</div>
      <div style="text-align: right">Status</div>
    </div>
    <div
      v-for="r in pageItems"
      :key="r.id"
      class="cra-tit-row grid items-center"
      :style="{
        gridTemplateColumns: cols,
        padding: '16px 20px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
      }"
      @click="emit('open', r)"
    >
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 8px; border-radius: var(--radius-sm); background: var(--status-neutral-bg); color: var(--status-neutral-text); white-space: nowrap">
          {{ classMap[r.operacaoId] ?? '—' }}
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        #{{ r.numero }}
      </div>
      <div>
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 7px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
          {{ r.tipo }}
        </span>
      </div>
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.cedenteCnpj }}</div>
      </div>
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.sacado }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.sacadoCnpj }}</div>
      </div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.vencimento }}</div>
      <div :style="{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }">
        {{ brl(r.vrNominal) }}
      </div>
      <div style="text-align: right">
        <span
          :style="{
            fontSize: '9px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '4px 8px',
            borderRadius: '9999px',
            background: statusStyle(r.status)!.bg,
            color: statusStyle(r.status)!.fg,
          }"
        >
          {{ r.status }}
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
  </div>
</template>

<style scoped>
.cra-tit-row:hover {
  background: var(--surface-sunken);
}
</style>
```

## Screens / cra-detail-tabs

### CessoesTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Download, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  CESSAO_TIPOS,
  ROUND_STATUSES,
  type Cessao,
  type RoundStatus,
} from '../../data/craData';

const props = defineProps<{ cessoes: Cessao[] }>();
const emit = defineEmits<{
  create: [];
  edit: [Cessao];
  delete: [id: string];
}>();

const filterNome = ref('');
const filterData = ref('');
const filterStatus = ref('');
const filterTipo = ref('');
const filterCedente = ref('');

const openMenuId = ref<string | null>(null);

const filtered = computed(() =>
  props.cessoes.filter((c) => {
    if (filterNome.value && !c.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterData.value && c.data !== filterData.value) return false;
    if (filterStatus.value && c.status !== filterStatus.value) return false;
    if (filterTipo.value && c.tipo !== filterTipo.value) return false;
    if (filterCedente.value && !(c.cedente ?? '').toLowerCase().includes(filterCedente.value.toLowerCase())) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS =
  '1.4fr 0.9fr 1.1fr 0.9fr 0.85fr 0.75fr 0.9fr 0.9fr 0.45fr 0.55fr';

const filterInputStyle = {
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

function statusStyle(s: RoundStatus) {
  const map: Record<RoundStatus, { bg: string; fg: string }> = {
    ABERTA: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    FECHADA: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
    CANCELADA: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
    'EM ANDAMENTO': { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  };
  return map[s];
}

function toggleMenu(id: string, e: Event) {
  e.stopPropagation();
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function onEdit(c: Cessao) {
  closeMenu();
  emit('edit', c);
}

function onDelete(id: string) {
  closeMenu();
  emit('delete', id);
}
</script>

<template>
  <div @click="closeMenu">
    <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="flex: 1; min-width: 200px">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
          Cessões
        </div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
          {{ cessoes.length }} cessões cadastradas
        </div>
      </div>
      <button
        type="button"
        class="flex items-center btn-animated btn-agro"
        style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
        @click="emit('create')"
      >
        <Plus :size="14" /> NOVA CESSÃO
      </button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Data</div>
        <input v-model="filterData" type="date" :style="filterInputStyle" @change="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status</div>
        <select v-model="filterStatus" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="s in ROUND_STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo de desembolso</div>
        <select v-model="filterTipo" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="t in CESSAO_TIPOS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Cedente</div>
        <input v-model="filterCedente" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhuma cessão encontrada.
    </div>
    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Nome</div>
        <div>Data do termo</div>
        <div>Tipo</div>
        <div>Valor Aberto</div>
        <div>Status</div>
        <div>Taxa (%)</div>
        <div>Valor Presente</div>
        <div>Valor Total</div>
        <div>Termo</div>
        <div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="r in pageItems"
        :key="r.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.data }}</div>
        <div>
          <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 6px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ r.tipo }}
          </span>
        </div>
        <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(r.valorAberto) }}</div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: statusStyle(r.status).bg,
              color: statusStyle(r.status).fg,
            }"
          >
            {{ r.status }}
          </span>
        </div>
        <div style="font-variant-numeric: tabular-nums">{{ r.taxaCessao != null ? `${r.taxaCessao}%` : '—' }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ r.valorPresente != null ? brl(r.valorPresente) : '—' }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ r.valorTotal != null ? brl(r.valorTotal) : '—' }}</div>
        <div>
          <Download v-if="r.temTermo" :size="18" style="color: var(--gci-base); cursor: pointer" aria-label="Baixar termo" />
          <span v-else style="color: var(--text-muted)">—</span>
        </div>
        <div style="text-align: right; position: relative">
          <button
            type="button"
            aria-label="Ações"
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; margin-left: auto; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="toggleMenu(r.id, $event)"
          >
            <MoreVertical :size="16" />
          </button>
          <div
            v-if="openMenuId === r.id"
            class="flex flex-col"
            style="position: absolute; top: 40px; right: 0; z-index: 40; min-width: 160px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
            @click.stop
          >
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onEdit(r)"
            >
              <Pencil :size="14" /> Editar
            </button>
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--danger-base); width: 100%; text-align: left"
              @click="onDelete(r.id)"
            >
              <Trash2 :size="14" /> Excluir
            </button>
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
  </div>
</template>
```

### GruposEmpresariaisTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { MoreVertical, Upload, Eye, FileText } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  GRUPO_STATUS_OPERACAO,
  type GrupoEmpresarialVinculo,
  type GrupoStatusOperacao,
} from '../../data/craData';

const props = defineProps<{ grupos: GrupoEmpresarialVinculo[] }>();
const emit = defineEmits<{
  open: [id: string];
  upload: [grupo: GrupoEmpresarialVinculo];
  toggleApto: [id: string];
  update: [GrupoEmpresarialVinculo];
}>();

const filterNome = ref('');
const filterStatus = ref('');
const openMenuId = ref<string | null>(null);

const filtered = computed(() =>
  props.grupos.filter((g) => {
    if (filterNome.value && !g.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterStatus.value && g.statusOperacao !== filterStatus.value) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS = '1.2fr 1fr 0.75fr 0.85fr 0.85fr 0.45fr';

const filterInputStyle = {
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

function statusStyle(s: GrupoStatusOperacao) {
  const map: Record<GrupoStatusOperacao, { bg: string; fg: string }> = {
    APROVADO: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    'EM ANÁLISE': { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
    REJEITADO: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
    PENDENTE: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  };
  return map[s];
}

function toggleMenu(id: string, e: Event) {
  e.stopPropagation();
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function onRowClick(g: GrupoEmpresarialVinculo) {
  emit('open', g.id);
}

function onToggleApto(g: GrupoEmpresarialVinculo, e: Event) {
  e.stopPropagation();
  if (!g.apto && !g.masterContractUrl) {
    alert('É necessário subir o Contrato Mãe antes de marcar o grupo como Apto.');
    return;
  }
  emit('toggleApto', g.id);
}

function onUpload(g: GrupoEmpresarialVinculo) {
  closeMenu();
  emit('upload', g);
}

function onVisualizar(g: GrupoEmpresarialVinculo) {
  closeMenu();
  if (g.masterContractUrl) window.open(g.masterContractUrl, '_blank');
}
</script>

<template>
  <div @click="closeMenu">
    <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
        Grupos Empresariais
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ grupos.length }} grupos vinculados
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Status de Operação</div>
        <select v-model="filterStatus" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option v-for="s in GRUPO_STATUS_OPERACAO" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum grupo encontrado.
    </div>
    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Nome</div>
        <div>Status de Operação</div>
        <div>Apto/Inapto</div>
        <div>Data firma</div>
        <div>Contrato Mãe</div>
        <div style="text-align: right">Ações</div>
      </div>
      <div
        v-for="r in pageItems"
        :key="r.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
        }"
        @click="onRowClick(r)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: statusStyle(r.statusOperacao).bg,
              color: statusStyle(r.statusOperacao).fg,
            }"
          >
            {{ r.statusOperacao }}
          </span>
        </div>
        <div>
          <button
            type="button"
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: r.apto ? 'var(--status-success-bg)' : 'var(--surface-sunken)',
              color: r.apto ? 'var(--status-success-text)' : 'var(--text-muted)',
            }"
            @click="onToggleApto(r, $event)"
          >
            {{ r.apto ? 'Apto' : 'Inapto' }}
          </button>
        </div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.masterContractDate ?? '—' }}</div>
        <div>
          <FileText v-if="r.masterContractUrl" :size="18" style="color: var(--gci-base)" />
          <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
        </div>
        <div style="text-align: right; position: relative">
          <button
            type="button"
            aria-label="Ações"
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; margin-left: auto; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
            @click="toggleMenu(r.id, $event)"
          >
            <MoreVertical :size="16" />
          </button>
          <div
            v-if="openMenuId === r.id"
            class="flex flex-col"
            style="position: absolute; top: 40px; right: 0; z-index: 40; min-width: 180px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
            @click.stop
          >
            <button
              type="button"
              class="flex items-center"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onUpload(r)"
            >
              <Upload :size="14" /> Subir Contrato Mãe
            </button>
            <button
              type="button"
              class="flex items-center"
              :disabled="!r.masterContractUrl"
              :style="{ opacity: r.masterContractUrl ? 1 : 0.4, cursor: r.masterContractUrl ? 'pointer' : 'not-allowed' }"
              style="gap: 8px; padding: 10px 12px; background: none; border: none; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left"
              @click="onVisualizar(r)"
            >
              <Eye :size="14" /> Visualizar
            </button>
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
  </div>
</template>
```

### SacadosTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bell, BellOff } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { type Sacado } from '../../data/craData';

const props = defineProps<{ sacados: Sacado[] }>();
const emit = defineEmits<{
  open: [id: string];
  update: [Sacado];
}>();

const filterDocumento = ref('');
const filterNome = ref('');
const filterTipo = ref('');
const filterParte = ref('');
const filterEspecial = ref('');

const filtered = computed(() =>
  props.sacados.filter((s) => {
    if (filterDocumento.value && !s.documento.includes(filterDocumento.value)) return false;
    if (filterNome.value && !s.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterTipo.value && !s.tipo.toLowerCase().includes(filterTipo.value.toLowerCase())) return false;
    if (filterParte.value === 'Sim' && !s.parteRelacionada) return false;
    if (filterParte.value === 'Não' && s.parteRelacionada) return false;
    if (filterEspecial.value === 'Sim' && !s.especial) return false;
    if (filterEspecial.value === 'Não' && s.especial) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS = '1.05fr 1.35fr 0.55fr 0.75fr 0.95fr 0.7fr 0.75fr 1.1fr';

const filterInputStyle = {
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

function onLimiteBlur(s: Sacado, e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d,]/g, '').replace(',', '.');
  const limite = parseFloat(raw) || 0;
  if (limite === s.limite) return;
  emit('update', { ...s, limite });
}

function formatLimiteInput(n: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n);
}

function onEspecialChange(s: Sacado) {
  emit('update', { ...s, especial: !s.especial });
}
</script>

<template>
  <div>
    <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Sacados</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ sacados.length }} sacados cadastrados
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Documento</div>
        <input v-model="filterDocumento" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo</div>
        <input v-model="filterTipo" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Parte relacionada</div>
        <select v-model="filterParte" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Sacado especial</div>
        <select v-model="filterEspecial" :style="{ ...filterInputStyle, appearance: 'none' }" @change="setPage(1)">
          <option value="">Todos</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum sacado encontrado.
    </div>
    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Notificação</div>
        <div>Tipo</div>
        <div>Limite</div>
        <div style="text-align: center">Especial</div>
        <div>Parte rel.</div>
        <div>Grupo Econômico</div>
      </div>
      <div
        v-for="r in pageItems"
        :key="r.id"
        class="sacado-row grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="emit('open', r.id)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ r.documento }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div @click.stop>
          <Bell v-if="r.notificacao" :size="18" style="color: var(--gci-base)" aria-label="Notificações ativas" />
          <BellOff v-else :size="18" style="color: var(--text-muted)" aria-label="Notificações inativas" />
        </div>
        <div>{{ r.tipo }}</div>
        <div @click.stop style="padding-right: 12px">
          <input
            :value="formatLimiteInput(r.limite)"
            :style="{
              width: '100%',
              maxWidth: '120px',
              height: '34px',
              padding: '0 8px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontVariantNumeric: 'tabular-nums',
            }"
            @blur="onLimiteBlur(r, $event)"
          />
        </div>
        <div class="flex items-center justify-center" @click.stop>
          <Checkbox :checked="r.especial" @change="onEspecialChange(r)" />
        </div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: r.parteRelacionada ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
              color: r.parteRelacionada ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
            }"
          >
            {{ r.parteRelacionada ? 'Sim' : 'Não' }}
          </span>
        </div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.grupoEconomico }}</div>
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
.sacado-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### SetupTab

```vue
<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import {
  Settings, SlidersHorizontal, FileCheck, Wallet, Receipt, ListChecks,
} from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import FormField from '../../components/create-cra-operacao-modal/FormField.vue';
import SelectField from '../../components/create-cra-operacao-modal/SelectField.vue';
import ToggleRow from '../../components/create-cra-operacao-modal/ToggleRow.vue';
import SectionGroup from '../../components/create-cra-operacao-modal/SectionGroup.vue';
import StepGrid from '../../components/create-cra-operacao-modal/StepGrid.vue';
import type { CraSetup } from '../../data/craData';

const props = defineProps<{ setup: CraSetup }>();
const emit = defineEmits<{ update: [CraSetup] }>();

const SUB_TABS = ['Dados gerais', 'Limites', 'Tipos de título', 'Carteira', 'Cobrança', 'Elegibilidade'] as const;
type SubTab = (typeof SUB_TABS)[number];

function cloneSetup(s: CraSetup): CraSetup {
  return JSON.parse(JSON.stringify(toRaw(s))) as CraSetup;
}

const subTab = ref<SubTab>('Dados gerais');
const local = ref<CraSetup>(cloneSetup(props.setup));

watch(
  () => props.setup,
  (s) => {
    local.value = cloneSetup(s);
  },
  { deep: true },
);

function save() {
  emit('update', cloneSetup(local.value));
}

function toggleBond(id: string) {
  const bt = local.value.bondTypes.find((b) => b.id === id);
  if (bt) bt.ativo = !bt.ativo;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding: 20px 20px 0">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Setup</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; margin-bottom: 24px">
        Configurações da operação
      </div>
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap; padding-top: 4px">
        <button
          v-for="t in SUB_TABS"
          :key="t"
          type="button"
          :style="{
            padding: '10px 4px',
            marginRight: '22px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            color: subTab === t ? 'var(--text-strong)' : 'var(--text-muted)',
            borderBottom: subTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px',
            whiteSpace: 'nowrap',
          }"
          @click="subTab = t"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div style="padding: 0 20px 20px; display: flex; flex-direction: column; gap: 16px">
      <template v-if="subTab === 'Dados gerais'">
        <SectionGroup :icon="Settings" title="Dados gerais">
          <StepGrid>
            <FormField v-model="local.nome" label="Nome" :span="6" />
            <FormField v-model="local.custodiante" label="Custodiante" :span="3" />
            <FormField v-model="local.cessionaria" label="Cessionária" :span="3" />
            <FormField v-model="local.prestadorServico" label="Prestador de serviço" :span="4" />
            <FormField v-model="local.beneficiarioFinal" label="Beneficiário final" :span="4" />
            <FormField v-model="local.grupoOperacao" label="Grupo de operação" :span="4" />
          </StepGrid>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Limites'">
        <SectionGroup :icon="SlidersHorizontal" title="Definições / Limites">
          <StepGrid>
            <SelectField
              v-model="local.tipoCalculoElegibilidade"
              label="Tipo de cálculo elegibilidade"
              :options="['Valor presente', 'Valor nominal', 'Deságio']"
              :span="6"
            />
            <FormField v-model="local.limiteConcentracaoPct" label="Limite concentração (%)" :span="3" />
            <FormField v-model="local.limiteVencimentoMin" label="Vencimento mín. (dias)" :span="3" />
            <FormField v-model="local.limiteVencimentoMax" label="Vencimento máx. (dias)" :span="4" />
          </StepGrid>
          <div class="flex flex-col" style="gap: 12px; margin-top: 16px">
            <ToggleRow label="Accrual" :on="local.accrual" @toggle="local.accrual = !local.accrual" />
            <ToggleRow label="Exigir IE" :on="local.exigirIe" @toggle="local.exigirIe = !local.exigirIe" />
            <ToggleRow label="Top sacados" :on="local.topSacados" @toggle="local.topSacados = !local.topSacados" />
            <ToggleRow label="Top cedentes" :on="local.topCedentes" @toggle="local.topCedentes = !local.topCedentes" />
            <ToggleRow label="Tipos título ativos" :on="local.tiposTituloAtivos" @toggle="local.tiposTituloAtivos = !local.tiposTituloAtivos" />
            <ToggleRow label="Entrega futura" :on="local.entregaFutura" @toggle="local.entregaFutura = !local.entregaFutura" />
          </div>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Tipos de título'">
        <SectionGroup :icon="FileCheck" title="Tipos de título">
          <div class="flex flex-col" style="gap: 10px">
            <div
              v-for="bt in local.bondTypes"
              :key="bt.id"
              class="flex items-center"
              style="gap: 12px; padding: 12px 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer"
              @click="toggleBond(bt.id)"
            >
              <Checkbox :checked="bt.ativo" @change="toggleBond(bt.id)" />
              <div style="flex: 1">
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ bt.abreviacao }}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ bt.descricao }}</div>
              </div>
            </div>
          </div>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Carteira'">
        <SectionGroup :icon="Wallet" title="Carteira">
          <StepGrid>
            <FormField v-model="local.carteiraNome" label="Nome da carteira" :span="6" />
            <FormField v-model="local.carteiraBanco" label="Banco" :span="6" />
            <FormField v-model="local.carteiraSlug" label="Slug" :span="4" />
            <FormField v-model="local.carteiraCnab" label="CNAB" :span="4" />
            <FormField v-model="local.carteiraAgencia" label="Agência" :span="2" />
            <FormField v-model="local.carteiraConta" label="Conta" :span="2" />
          </StepGrid>
        </SectionGroup>
      </template>

      <template v-else-if="subTab === 'Cobrança'">
        <SectionGroup :icon="Receipt" title="Cobrança">
          <StepGrid>
            <FormField v-model="local.beneficiarioNome" label="Beneficiário" :span="6" />
            <FormField v-model="local.beneficiarioCep" label="CEP" :span="2" />
            <FormField v-model="local.beneficiarioCidade" label="Cidade" :span="3" />
            <FormField v-model="local.beneficiarioUf" label="UF" :span="1" />
            <FormField v-model="local.jurosBoleto" label="Juros boleto (%)" :span="3" />
            <FormField v-model="local.multaBoleto" label="Multa boleto (%)" :span="3" />
          </StepGrid>
          <div style="margin-top: 16px">
            <ToggleRow label="Vencimento em fim de semana" :on="local.vencimentoFimSemana" @toggle="local.vencimentoFimSemana = !local.vencimentoFimSemana" />
          </div>
        </SectionGroup>
      </template>

      <template v-else>
        <SectionGroup :icon="ListChecks" title="Elegibilidade">
          <div class="flex flex-col" style="gap: 12px">
            <div
              v-for="top in local.eligibilityTops"
              :key="top.id"
              class="grid items-center"
              style="grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 12px 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card)"
            >
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Tipo</div>
                <select
                  v-model="top.tipo"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                >
                  <option value="CEDENTE">CEDENTE</option>
                  <option value="SACADO">SACADO</option>
                </select>
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Quantidade</div>
                <input
                  v-model.number="top.quantidade"
                  type="number"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">Concentração (%)</div>
                <input
                  v-model.number="top.concentracaoPct"
                  type="number"
                  style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm)"
                />
              </div>
            </div>
            <button
              type="button"
              style="background: none; border: none; cursor: default; font-size: var(--text-sm); color: var(--text-muted); text-align: left; padding: 4px 0"
            >
              Ver ranking (em breve)
            </button>
          </div>
        </SectionGroup>
      </template>

      <div class="flex justify-end">
        <button
          type="button"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="save"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
```

## Screens / cra-title-detail

### AccrualTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { brl, type CraTitulo } from '../../data/craData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: CraTitulo }>();

const rows = computed(() => [
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 3)) },
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 2)) },
  { data: props.titulo.vencimento, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((props.titulo.vrNominal * 0.0185) / 252) },
]);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, { defaultPageSize: 5 });
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style="text-align: right">Acumulado</div>
      </div>
      <div
        v-for="(r, i) in pageItems"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-variant-numeric: tabular-nums"
      >
        <div style="color: var(--text-muted)">{{ r.data }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.taxa }}</div>
        <div style="color: var(--text-muted)">{{ r.base }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.accrual }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right">{{ r.acumulado }}</div>
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
  </Section>
</template>
```

### AnexosTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { Download } from 'lucide-vue-next';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const files = computed(() => [
  { name: `CPR-${props.titulo.numero}.xml`, size: '14 KB', type: 'XML' },
  { name: `Laudo-${props.titulo.numero}.pdf`, size: '210 KB', type: 'PDF' },
  { name: `Nota-${props.titulo.numero}.jpg`, size: '88 KB', type: 'IMG' },
]);
</script>

<template>
  <Section title="Evidências e Lastro Físico">
    <div class="flex flex-col" style="gap: 12px">
      <div
        v-for="f in files"
        :key="f.name"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em">{{ f.type }}</div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ f.size }}</div>
        </div>
        <button class="flex items-center" style="gap: 8px; padding: 8px 14px; background: var(--surface-card); color: var(--text-strong); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)">
          <Download :size="14" /> Baixar
        </button>
      </div>
    </div>
  </Section>
</template>
```

### ConfirmacoesTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const items = computed(() => [
  { data: props.titulo.emissao, tipo: 'Confirmação do Sacado', resultado: props.titulo.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE', obs: 'Via portal eletrônico' },
  { data: props.titulo.emissao, tipo: 'Validação de Lastro', resultado: 'CONFIRMADO', obs: 'Documento verificado' },
  { data: props.titulo.emissao, tipo: 'Registro Registradora', resultado: 'CONFIRMADO', obs: 'B3 — protocolo #82341' },
]);

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap['PENDENTE'];
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in items"
        :key="i"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ c.tipo }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ c.data }} · {{ c.obs }}</div>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: tone(c.resultado).bg,
            color: tone(c.resultado).fg,
          }"
        >
          {{ c.resultado }}
        </span>
      </div>
    </div>
  </Section>
</template>
```

### CopyButton

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleCopy(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
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
      transition: 'color var(--duration-fast)',
    }"
    @click="handleCopy"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

### DetailsTab

```vue
<script setup lang="ts">
import { Mail, Phone, Building2, User } from 'lucide-vue-next';
import { brl, type CraOperacao, type CraTitulo, type CessaoStatus } from '../../data/craData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: CraTitulo; operacao: CraOperacao }>();

const cessaoTone: Record<CessaoStatus, { bg: string; fg: string }> = {
  LIQUIDADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  PARCIAL: { bg: '#FFF3CD', fg: '#856404' },
};
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <!-- ── Informações do Título ─────────────────────────────── -->
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Operação de Origem">{{ operacao.nome }}</Field>
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipo }}</Field>
        <Field label="Status">{{ titulo.status }}</Field>
      </div>
    </Section>

    <!-- ── Valores ───────────────────────────────────────────── -->
    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.vrNominal) }}</Field>
        <Field label="Valor de Aquisição">{{ titulo.vrAquisicao != null ? brl(titulo.vrAquisicao) : '—' }}</Field>
        <Field label="Valor Presente">{{ titulo.vrPresente != null ? brl(titulo.vrPresente) : '—' }}</Field>
        <Field label="Valor em Aberto">{{ titulo.vrAberto != null ? brl(titulo.vrAberto) : '—' }}</Field>
      </div>
    </Section>

    <!-- ── Datas e Prazos ────────────────────────────────────── -->
    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ titulo.emissao }}</Field>
        <Field label="Data de Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Prorrogação">Não aplicável</Field>
        <Field label="Protesto">—</Field>
      </div>
    </Section>

    <!-- ── Dados Fiscais ─────────────────────────────────────── -->
    <Section v-if="titulo.chaveNfe" title="Dados Fiscais">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <div style="grid-column: span 2">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Chave NF-e
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; word-break: break-all">
            {{ titulo.chaveNfe }}
            <CopyButton :value="titulo.chaveNfe ?? ''" />
          </div>
        </div>
        <Field label="CFOP">{{ titulo.cfop ?? '—' }}</Field>
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <Field label="Série">{{ titulo.serie ?? '—' }}</Field>
          <Field label="Modelo">{{ titulo.modelo ?? '—' }}</Field>
        </div>
      </div>
    </Section>

    <!-- ── Participantes ─────────────────────────────────────── -->
    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedente" :cnpj="titulo.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacado" :cnpj="titulo.sacadoCnpj" :icon="User" />
      </div>
    </Section>

    <!-- ── Dados de Cessão ───────────────────────────────────── -->
    <Section v-if="titulo.cessao" title="Dados de Cessão">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Cessionário">{{ titulo.cessao.cessionario }}</Field>
        <Field label="Data da Cessão">{{ titulo.cessao.data }}</Field>
        <Field label="Valor Cedido">{{ brl(titulo.cessao.valor) }}</Field>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Status
          </div>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: cessaoTone[titulo.cessao.status].bg,
              color: cessaoTone[titulo.cessao.status].fg,
            }"
          >
            {{ titulo.cessao.status }}
          </span>
        </div>
      </div>
    </Section>

    <!-- ── Contato Regulatório ───────────────────────────────── -->
    <Section title="Contato Regulatório">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 24px">
        <Field label="Email">
          <span class="flex items-center" style="gap: 6px"><Mail :size="14" color="var(--text-muted)" /> cobranca@cedente.com.br<CopyButton value="cobranca@cedente.com.br" /></span>
        </Field>
        <Field label="Telefone">
          <span class="flex items-center" style="gap: 6px"><Phone :size="14" color="var(--text-muted)" /> +55 (11) 4002-8922<CopyButton value="+55 (11) 4002-8922" /></span>
        </Field>
      </div>
    </Section>
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
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">{{ label }}</div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"><slot /></div>
  </div>
</template>
```

### MovimentacoesTab

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type CraTitulo } from '../../data/craData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: CraTitulo }>();

type MovSub = 'registro' | 'cessao';
const sub = ref<MovSub>('registro');

const registroRows = computed(() => [
  { data: props.titulo.emissao, operacao: 'Inclusão', registradora: 'B3', protocolo: '#82341', valor: brl(props.titulo.vrNominal) },
]);
const cessaoRows = computed(() => [
  { data: props.titulo.emissao, cedente: props.titulo.cedente, cessionario: 'CRA Operação', valor: brl(props.titulo.vrNominal) },
]);

const {
  page: registroPage,
  pageSize: registroPageSize,
  total: registroTotal,
  pageItems: registroPageItems,
  setPage: setRegistroPage,
  setPageSize: setRegistroPageSize,
} = useTablePagination(() => registroRows.value, { defaultPageSize: 5 });

const {
  page: cessaoPage,
  pageSize: cessaoPageSize,
  total: cessaoTotal,
  pageItems: cessaoPageItems,
  setPage: setCessaoPage,
  setPageSize: setCessaoPageSize,
} = useTablePagination(() => cessaoRows.value, { defaultPageSize: 5 });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start">
      <button
        v-for="s in (['registro', 'cessao'] as MovSub[])"
        :key="s"
        :style="{
          padding: '8px 16px',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          background: sub === s ? 'var(--surface-card)' : 'transparent',
          color: sub === s ? 'var(--text-strong)' : 'var(--text-muted)',
          boxShadow: sub === s ? 'var(--shadow-xs)' : 'none',
          transition: 'all var(--duration-base)',
        }"
        @click="sub = s"
      >
        {{ s === 'registro' ? 'MOVIMENTAÇÕES DE REGISTRO' : 'MOVIMENTO DE CESSÃO' }}
      </button>
    </div>

    <Section v-if="sub === 'registro'" title="Movimentações de Registro">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Operação</div><div>Registradora</div><div>Protocolo</div><div style="text-align: right">Valor</div>
        </div>
        <div
          v-for="(r, i) in registroPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.operacao }}</div>
          <div style="color: var(--text-default)">{{ r.registradora }}</div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.protocolo }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ r.valor }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="registroTotal"
          :page="registroPage"
          :page-size="registroPageSize"
          @update:page="setRegistroPage"
          @update:page-size="setRegistroPageSize"
        />
      </div>
    </Section>

    <Section v-if="sub === 'cessao'" title="Movimento de Cessão">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Cedente</div><div>Cessionário</div><div>Valor</div><div style="text-align: right">Status</div>
        </div>
        <div
          v-for="(r, i) in cessaoPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cessionario }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ r.valor }}</div>
          <div style="text-align: right">
            <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 8px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">LIQUIDADO</span>
          </div>
        </div>
        <TablePagination
          sunken
          compact
          :total="cessaoTotal"
          :page="cessaoPage"
          :page-size="cessaoPageSize"
          @update:page="setCessaoPage"
          @update:page-size="setCessaoPageSize"
        />
      </div>
    </Section>
  </div>
</template>
```

### MovimentoTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const events = computed(() => [
  { date: props.titulo.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
  { date: props.titulo.emissao, label: 'Registro enviado à registradora (B3)', tone: 'info' },
  { date: props.titulo.emissao, label: 'Confirmação física do sacado', tone: props.titulo.status === 'CONFIRMADO' ? 'success' : 'warning' },
  { date: props.titulo.vencimento, label: props.titulo.status === 'VENCIDO' ? 'Inadimplência identificada' : 'Vencimento programado', tone: props.titulo.status === 'VENCIDO' ? 'danger' : 'neutral' },
]);

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in events" :key="i" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; margin-top: 6px" :style="{ background: toneMap[e.tone] }" />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.label }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ e.date }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### PagamentosTab

```vue
<template>
  <div style="padding: 40px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    Histórico de repasses e custódias indisponível para este título.
  </div>
</template>
```

### Participant

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import CopyButton from './CopyButton.vue';

defineProps<{ role: string; name: string; cnpj: string; icon: Component }>();
</script>

<template>
  <div class="flex items-center" style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
    <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0">
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ role }}</div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ name }}</div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">{{ cnpj }}<CopyButton :value="cnpj" /></div>
    </div>
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
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">{{ title }}</div>
    <slot />
  </div>
</template>
```

## Screens / grupo-detail

### CedentesTab

```vue
<script setup lang="ts">
import type { GrupoCedente } from '../../data/craData';

defineProps<{ cedentes: GrupoCedente[] }>();

const COLS = '1fr 1.2fr 1fr 0.8fr 0.5fr';
</script>

<template>
  <div
    v-if="!cedentes.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhum cedente vinculado a este grupo.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Documento</div>
      <div>Nome</div>
      <div>Email</div>
      <div>Cidade-UF</div>
      <div>Tipo</div>
    </div>
    <div
      v-for="c in cedentes"
      :key="c.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ c.documento }}</div>
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
      <div style="color: var(--text-muted)">{{ c.email ?? '—' }}</div>
      <div style="color: var(--text-muted)">{{ c.cidadeUf ?? '—' }}</div>
      <div>
        <span style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">{{ c.tipo }}</span>
      </div>
    </div>
  </div>
</template>
```

### ContaBancariaTab

```vue
<script setup lang="ts">
import type { GrupoContaBancaria } from '../../data/craData';

defineProps<{ contas: GrupoContaBancaria[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.5fr';
</script>

<template>
  <div
    v-if="!contas.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhuma conta bancária cadastrada.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Banco</div>
      <div>Agência</div>
      <div>Conta</div>
      <div>Principal</div>
    </div>
    <div
      v-for="c in contas"
      :key="c.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.banco }}</div>
      <div style="color: var(--text-muted)">{{ c.agencia }}</div>
      <div style="color: var(--text-muted)">{{ c.conta }}</div>
      <div>
        <span
          v-if="c.principal"
          style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: 9999px; background: var(--status-success-bg); color: var(--status-success-text)"
        >
          Principal
        </span>
        <span v-else style="color: var(--text-muted)">—</span>
      </div>
    </div>
  </div>
</template>
```

### DocumentosTab

```vue
<script setup lang="ts">
import type { GrupoDocumento } from '../../data/craData';

defineProps<{ documentos: GrupoDocumento[] }>();

const COLS = '1.2fr 0.8fr 0.7fr';
</script>

<template>
  <div
    v-if="!documentos.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhum documento cadastrado.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Nome</div>
      <div>Tipo</div>
      <div>Data</div>
    </div>
    <div
      v-for="d in documentos"
      :key="d.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ d.nome }}</div>
      <div style="color: var(--text-muted)">{{ d.tipo }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ d.data }}</div>
    </div>
  </div>
</template>
```

### FaturamentoTab

```vue
<script setup lang="ts">
import { brl, type GrupoFaturamento } from '../../data/craData';

defineProps<{ faturamentos: GrupoFaturamento[] }>();

const COLS = '0.5fr 1fr';
</script>

<template>
  <div
    v-if="!faturamentos.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhum faturamento registrado.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Ano</div>
      <div>Valor</div>
    </div>
    <div
      v-for="f in faturamentos"
      :key="f.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.ano }}</div>
      <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(f.valor) }}</div>
    </div>
  </div>
</template>
```

### GarantiasTab

```vue
<script setup lang="ts">
import { brl, type GrupoGarantia } from '../../data/craData';

defineProps<{ garantias: GrupoGarantia[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.8fr 0.6fr 0.6fr';
</script>

<template>
  <div
    v-if="!garantias.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhuma garantia cadastrada.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Tipo</div>
      <div>Início</div>
      <div>Fim</div>
      <div>Valor</div>
      <div>Cobertura</div>
      <div>Status</div>
    </div>
    <div
      v-for="g in garantias"
      :key="g.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ g.dataInicio }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ g.dataFim }}</div>
      <div style="font-variant-numeric: tabular-nums">{{ brl(g.valor) }}</div>
      <div style="color: var(--text-muted)">{{ g.cobertura }}</div>
      <div>
        <span style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: 9999px; background: var(--status-success-bg); color: var(--status-success-text)">{{ g.status }}</span>
      </div>
    </div>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { Clock, History } from 'lucide-vue-next';
import type { GrupoHistoricoEvento } from '../../data/craData';

defineProps<{ eventos: GrupoHistoricoEvento[] }>();
</script>

<template>
  <div
    v-if="!eventos.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    <History :size="32" style="margin: 0 auto 12px; opacity: 0.5" />
    Nenhum evento registrado para este grupo.
  </div>
  <div
    v-else
    style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">
      Linha do Tempo
    </div>
    <div class="flex flex-col" style="gap: 0">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.message }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ e.datetime }}
            <span v-if="e.createdBy"> · {{ e.createdBy }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### PartesRelacionadasTab

```vue
<script setup lang="ts">
import type { GrupoParteRelacionada } from '../../data/craData';

defineProps<{ partes: GrupoParteRelacionada[] }>();

const COLS = '1fr 1.2fr 1fr';
</script>

<template>
  <div
    v-if="!partes.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhuma parte relacionada cadastrada.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Documento</div>
      <div>Nome</div>
      <div>Tipos</div>
    </div>
    <div
      v-for="p in partes"
      :key="p.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ p.documento }}</div>
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
      <div style="color: var(--text-muted)">{{ p.tipos }}</div>
    </div>
  </div>
</template>
```

## Screens / sacado-detail

### ContatosSubTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { Sacado, SacadoContato } from '../../data/craData';
import FormField from '../../components/create-cra-operacao-modal/FormField.vue';
import StepGrid from '../../components/create-cra-operacao-modal/StepGrid.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const showForm = ref(false);
const nome = ref('');
const email = ref('');
const ddi = ref('+55');
const telefone = ref('');

function addContato() {
  if (!nome.value.trim() || !email.value.trim()) return;
  const contato: SacadoContato = {
    id: `c-${Date.now()}`,
    nome: nome.value.trim(),
    email: email.value.trim(),
    ddi: ddi.value,
    telefone: telefone.value,
    principal: props.sacado.contatos.length === 0,
  };
  emit('update', { ...props.sacado, contatos: [...props.sacado.contatos, contato] });
  nome.value = '';
  email.value = '';
  telefone.value = '';
  showForm.value = false;
}

function removeContato(id: string) {
  emit('update', { ...props.sacado, contatos: props.sacado.contatos.filter((c) => c.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-center justify-between">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ sacado.contatos.length }} contato(s)
      </div>
      <button
        type="button"
        class="flex items-center"
        style="gap: 6px; padding: 8px 14px; background: var(--gci-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)"
        @click="showForm = !showForm"
      >
        <Plus :size="14" /> Adicionar
      </button>
    </div>

    <div
      v-if="showForm"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <StepGrid>
        <FormField v-model="nome" label="Nome" :span="5" />
        <FormField v-model="email" label="E-mail" type="email" :span="7" />
        <FormField v-model="ddi" label="DDI" :span="3" />
        <FormField v-model="telefone" label="Telefone" :span="9" />
      </StepGrid>
      <button
        type="button"
        style="margin-top: 12px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
        @click="addContato"
      >
        Salvar contato
      </button>
    </div>

    <div v-if="!sacado.contatos.length" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum contato cadastrado.
    </div>
    <div
      v-for="c in sacado.contatos"
      :key="c.id"
      class="flex items-center justify-between"
      style="padding: 14px 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
    >
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ c.nome }}
          <span v-if="c.principal" style="font-size: 9px; margin-left: 8px; padding: 2px 6px; background: var(--gci-light); color: var(--gci-base); border-radius: var(--radius-sm)">Principal</span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">{{ c.email }} · {{ c.ddi }} {{ c.telefone }}</div>
      </div>
      <button
        type="button"
        style="background: none; border: none; cursor: pointer; color: var(--danger-base); font-size: var(--text-xs); font-weight: var(--weight-semibold)"
        @click="removeContato(c.id)"
      >
        Remover
      </button>
    </div>
  </div>
</template>
```

### DadosTab

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Sacado } from '../../data/craData';
import FormField from '../../components/create-cra-operacao-modal/FormField.vue';
import SelectField from '../../components/create-cra-operacao-modal/SelectField.vue';
import StepGrid from '../../components/create-cra-operacao-modal/StepGrid.vue';
import ContatosSubTab from './ContatosSubTab.vue';
import EnderecosSubTab from './EnderecosSubTab.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const SUB_TABS = ['Contatos', 'Endereços'] as const;
type SubTab = (typeof SUB_TABS)[number];

const subTab = ref<SubTab>('Contatos');

const local = ref({ ...props.sacado });

watch(
  () => props.sacado,
  (s) => {
    local.value = { ...s };
  },
  { deep: true },
);

function patch(field: keyof Sacado, value: string) {
  local.value = { ...local.value, [field]: value };
  emit('update', { ...local.value });
}

function onSacadoUpdate(s: Sacado) {
  local.value = s;
  emit('update', s);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">
        {{ sacado.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica' }}
      </div>
      <StepGrid>
        <FormField
          :model-value="local.documento"
          label="Documento"
          disabled
          :span="4"
          @update:model-value="patch('documento', $event)"
        />
        <FormField
          :model-value="local.nome"
          label="Nome / Razão Social"
          :span="8"
          @update:model-value="patch('nome', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.nomeFantasia ?? ''"
          label="Nome Fantasia"
          :span="6"
          @update:model-value="patch('nomeFantasia', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.inscricaoEstadual ?? ''"
          label="Inscrição Estadual"
          :span="3"
          @update:model-value="patch('inscricaoEstadual', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.inscricaoMunicipal ?? ''"
          label="Inscrição Municipal"
          :span="3"
          @update:model-value="patch('inscricaoMunicipal', $event)"
        />
        <FormField
          v-if="sacado.pessoaFisica"
          :model-value="local.inscricaoProdutorRural ?? ''"
          label="Inscrição Produtor Rural"
          :span="6"
          @update:model-value="patch('inscricaoProdutorRural', $event)"
        />
        <FormField
          :model-value="local.tipo"
          label="Tipo"
          :span="3"
          @update:model-value="patch('tipo', $event)"
        />
        <FormField
          :model-value="local.grupoEconomico"
          label="Grupo Econômico"
          :span="5"
          @update:model-value="patch('grupoEconomico', $event)"
        />
        <SelectField
          :model-value="local.metodoNotificacao ?? 'E-mail'"
          label="Método de Notificação"
          :options="['E-mail', 'WhatsApp', 'Telefone']"
          :span="4"
          @update:model-value="patch('metodoNotificacao', $event)"
        />
        <FormField
          v-if="!sacado.pessoaFisica"
          :model-value="local.atividadePrincipal ?? ''"
          label="Atividade Principal"
          :span="12"
          @update:model-value="patch('atividadePrincipal', $event)"
        />
      </StepGrid>
    </div>

    <div style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap; margin-bottom: 20px">
        <button
          v-for="t in SUB_TABS"
          :key="t"
          type="button"
          :style="{
            padding: '10px 4px', marginRight: '22px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
            color: subTab === t ? 'var(--text-strong)' : 'var(--text-muted)',
            borderBottom: subTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', whiteSpace: 'nowrap',
          }"
          @click="subTab = t"
        >{{ t }}</button>
      </div>
      <ContatosSubTab v-if="subTab === 'Contatos'" :sacado="local" @update="onSacadoUpdate" />
      <EnderecosSubTab v-else :sacado="local" @update="onSacadoUpdate" />
    </div>
  </div>
</template>
```

### EnderecosSubTab

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { Sacado, SacadoEndereco } from '../../data/craData';
import FormField from '../../components/create-cra-operacao-modal/FormField.vue';
import StepGrid from '../../components/create-cra-operacao-modal/StepGrid.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const showForm = ref(false);
const cep = ref('');
const localidade = ref('');
const numero = ref('');
const bairro = ref('');
const cidade = ref('');
const uf = ref('');
const pais = ref('Brasil');

function addEndereco() {
  if (!localidade.value.trim() || !cidade.value.trim()) return;
  const endereco: SacadoEndereco = {
    id: `e-${Date.now()}`,
    cep: cep.value,
    localidade: localidade.value,
    numero: numero.value,
    bairro: bairro.value,
    cidade: cidade.value,
    uf: uf.value,
    pais: pais.value,
  };
  emit('update', { ...props.sacado, enderecos: [...props.sacado.enderecos, endereco] });
  cep.value = '';
  localidade.value = '';
  numero.value = '';
  bairro.value = '';
  cidade.value = '';
  uf.value = '';
  showForm.value = false;
}

function removeEndereco(id: string) {
  emit('update', { ...props.sacado, enderecos: props.sacado.enderecos.filter((e) => e.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-center justify-between">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ sacado.enderecos.length }} endereço(s)
      </div>
      <button
        type="button"
        class="flex items-center"
        style="gap: 6px; padding: 8px 14px; background: var(--gci-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)"
        @click="showForm = !showForm"
      >
        <Plus :size="14" /> Adicionar
      </button>
    </div>

    <div
      v-if="showForm"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <StepGrid>
        <FormField v-model="cep" label="CEP" :span="3" />
        <FormField v-model="localidade" label="Logradouro" :span="6" />
        <FormField v-model="numero" label="Número" :span="3" />
        <FormField v-model="bairro" label="Bairro" :span="4" />
        <FormField v-model="cidade" label="Cidade" :span="4" />
        <FormField v-model="uf" label="UF" :span="2" />
        <FormField v-model="pais" label="País" :span="2" />
      </StepGrid>
      <button
        type="button"
        style="margin-top: 12px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
        @click="addEndereco"
      >
        Salvar endereço
      </button>
    </div>

    <div v-if="!sacado.enderecos.length" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum endereço cadastrado.
    </div>
    <div
      v-for="e in sacado.enderecos"
      :key="e.id"
      class="flex items-center justify-between"
      style="padding: 14px 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
    >
      <div style="font-size: var(--text-sm); color: var(--text-strong)">
        {{ e.localidade }}, {{ e.numero }} — {{ e.bairro }}, {{ e.cidade }}/{{ e.uf }}
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">CEP {{ e.cep }} · {{ e.pais }}</div>
      </div>
      <button
        type="button"
        style="background: none; border: none; cursor: pointer; color: var(--danger-base); font-size: var(--text-xs); font-weight: var(--weight-semibold)"
        @click="removeEndereco(e.id)"
      >
        Remover
      </button>
    </div>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Clock, History } from 'lucide-vue-next';
import type { SacadoHistorico } from '../../data/craData';

defineProps<{ eventos: SacadoHistorico[] }>();
</script>

<template>
  <div
    v-if="!eventos.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    <History :size="32" style="margin: 0 auto 12px; opacity: 0.5" />
    Nenhum evento registrado para este sacado.
  </div>
  <div
    v-else
    style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">
      Linha do Tempo
    </div>
    <div class="flex flex-col" style="gap: 0">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.message }}
          </div>
          <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            <Clock :size="12" /> {{ e.datetime }}
            <span v-if="e.createdBy"> · {{ e.createdBy }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### TitulosSubTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { Cra, Sacado } from '../../data/craData';
import TitulosTable from '../cra-detail/TitulosTable.vue';

const props = defineProps<{ cra: Cra; sacado: Sacado }>();

const filteredTitulos = computed(() =>
  props.cra.operacoes.flatMap((o) => o.titulos).filter(
    (t) =>
      t.sacadoCnpj === props.sacado.documento ||
      t.sacado.toLowerCase() === props.sacado.nome.toLowerCase(),
  ),
);

const classMap = computed(() =>
  Object.fromEntries(props.cra.operacoes.map((o, i) => [o.id, String(i + 1)])),
);
</script>

<template>
  <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Títulos do sacado
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ filteredTitulos.length }} título(s) vinculados
      </div>
    </div>
    <TitulosTable :rows="filteredTitulos" :class-map="classMap" />
  </div>
</template>
```

## Components

### CraCard

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrendingUp, Wallet, Clock } from 'lucide-vue-next';
import { brl, num, type Cra } from '../data/craData';
import DonutRing from './cra-card/DonutRing.vue';

const props = defineProps<{ cra: Cra }>();
const emit = defineEmits<{ open: [id: string] }>();

const hover = ref(false);

const craType = computed(() =>
  props.cra.operacoes.length > 0
    ? (props.cra.operacoes.every((o) => o.tipo === 'MONO CRA') ? 'MONO CRA' : 'MULTI CRA')
    : (props.cra.tipo ?? 'MULTI CRA'),
);
const craTypeColor = computed(() =>
  craType.value === 'MONO CRA'
    ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
    : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
);

const totalCarteira = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const totalVencido = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.vencido.valor, titulos: a.titulos + o.vencido.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const avgPartesRel = computed(() =>
  props.cra.operacoes.length
    ? props.cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.pct, 0) / props.cra.operacoes.length
    : 0,
);
const totalPartesRelValor = computed(() =>
  props.cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.valor, 0),
);
const avgNovosSacados = computed(() =>
  props.cra.operacoes.length
    ? props.cra.operacoes.reduce((a, o) => a + o.novosSacados.pct, 0) / props.cra.operacoes.length
    : 0,
);
const totalNovosSacadosValor = computed(() =>
  props.cra.operacoes.reduce((a, o) => a + o.novosSacados.valor, 0),
);

</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '14px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', cra.id)"
  >
    <!-- Header: tag + nome + status -->
    <div class="flex items-start justify-between" style="gap: 8px">
      <div style="flex: 1; min-width: 0">
        <div class="flex items-center" style="gap: 8px; margin-bottom: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; padding: 3px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            CRA
          </span>
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.25;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ cra.nome }}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.4">
          {{ cra.cessionaria }} · {{ cra.cnpj }}
        </div>
      </div>
      <span
        class="flex items-center"
        style="
          gap: 5px;
          flex-shrink: 0;
          margin-top: 4px;
          white-space: nowrap;
          font-size: 9px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--success-dark);
          background: var(--success-light);
          padding: 5px 10px;
          border-radius: 9999px;
        "
      >
        <TrendingUp :size="10" :stroke-width="2.5" />
        EM ANDAMENTO
      </span>
    </div>

    <!-- CRA type badge -->
    <div>
      <span
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          background: craTypeColor.bg,
          color: craTypeColor.fg,
        }"
      >
        {{ craType }}
      </span>
    </div>

    <!-- Carteira vs Vencido -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
      <div>
        <div class="flex items-center" style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          <Wallet :size="11" /> Valor em Carteira
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(totalCarteira.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px">
          Títulos: <strong style="color: var(--text-default)">{{ num(totalCarteira.titulos) }}</strong>
        </div>
      </div>
      <div style="text-align: right">
        <div class="flex items-center" style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; justify-content: flex-end">
          <Clock :size="11" /> Valor em Vencido
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums">
          {{ brl(totalVencido.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px">
          Títulos: <strong style="color: var(--danger-base)">{{ num(totalVencido.titulos) }}</strong>
        </div>
      </div>
    </div>

    <!-- Donut metrics -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 2px">
      <div class="flex items-center" style="gap: 10px">
        <DonutRing :pct="avgPartesRel" color="var(--danger-base)" track-color="var(--danger-light)" />
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--danger-base); letter-spacing: 0.04em; margin-bottom: 3px">
            Partes Relacionadas
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(totalPartesRelValor) }}
          </div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 10px; justify-content: flex-end; flex-direction: row">
        <DonutRing :pct="avgNovosSacados" color="#7C3AED" track-color="#EDE9FE" />
        <div style="text-align: right">
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: #7C3AED; letter-spacing: 0.04em; margin-bottom: 3px">
            Novos Sacados
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(totalNovosSacadosValor) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### CreateCraModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Info, Check, ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';
import StepGrid from './create-cra-modal/StepGrid.vue';
import FormField from './create-cra-modal/FormField.vue';
import SelectField from './create-cra-modal/SelectField.vue';

export interface NewCraData {
  tipoOperacao: string;
  nomeFantasia: string;
}

const emit = defineEmits<{ close: []; create: [data: NewCraData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Campos de CRA', icon: Info, hint: 'Identificação da operação' },
];

const stepIdx = ref(0);
const form = ref<NewCraData>({
  tipoOperacao: '',
  nomeFantasia: '',
});

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function handleCreate() {
  emit('create', form.value);
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
        max-width: 900px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- ── Header ── -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Novo CRA
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
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

      <!-- ── Stepper ── -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          class="step-btn flex flex-col items-center justify-center"
          :class="{ 'step-btn--pending': i !== stepIdx && i >= stepIdx }"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- ── Body ── -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <!-- Campos de CRA -->
        <StepGrid v-if="step.key === 'info'">
          <SelectField
            label="Categoria de Operação"
            :options="['Mono CRA', 'Multi CRA']"
            placeholder="Selecione"
            :span="6"
            v-model="form.tipoOperacao"
          />
          <FormField
            label="Nome do CRA"
            placeholder="Ex: CRA Semeagro"
            :span="6"
            v-model="form.nomeFantasia"
          />
        </StepGrid>
      </div>

      <!-- ── Footer ── -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="isFirst ? emit('close') : stepIdx--"
        >
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="isLast ? handleCreate() : stepIdx++"
        >
          {{ isLast ? 'Finalizar Cadastro' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-btn {
  opacity: 1;
}
.step-btn--pending {
  opacity: 0.55;
}
.step-btn--pending:hover {
  opacity: 1;
}
</style>
```

### CreateCraOperacaoModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X, Info, SlidersHorizontal, Network, Settings, Percent,
  Wallet, FileText, AlertTriangle, ClipboardCheck,
  Check, ChevronRight, Search, Layers, UserCheck,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { gruposEmpresariais } from '../data/craData';
import StepGrid from './create-cra-operacao-modal/StepGrid.vue';
import FieldLabel from './create-cra-operacao-modal/FieldLabel.vue';
import Input from './create-cra-operacao-modal/Input.vue';
import FormField from './create-cra-operacao-modal/FormField.vue';
import SelectField from './create-cra-operacao-modal/SelectField.vue';
import SectionHelp from './create-cra-operacao-modal/SectionHelp.vue';
import ToggleRow from './create-cra-operacao-modal/ToggleRow.vue';
import SectionGroup from './create-cra-operacao-modal/SectionGroup.vue';
import SectionTitle from './create-cra-operacao-modal/SectionTitle.vue';
import AddButton from './create-cra-operacao-modal/AddButton.vue';
import DataTable from './create-cra-operacao-modal/DataTable.vue';
import LimiteRow from './create-cra-operacao-modal/LimiteRow.vue';
import SummaryItem from './create-cra-operacao-modal/SummaryItem.vue';

const BENEFICIARIO_OPTS = [
  'CERES SECURIZADORA S/A',
  'BTG SECURIZADORA S/A',
  'ISEC SECURIZADORA S/A',
  'RB CAPITAL',
  'Oliveira Trust',
  'Vórtx',
  'BRL Trust',
];

export interface NewCraOperacaoData {
  tipoCliente: string;
  beneficiarioFinal: string;
  nome: string;
  numeroEmissao: string;
  cessionaria: string;
  prestadorServico: string;
  custodiante: string;
  toggles: Record<string, boolean>;
  gruposSelecionados: string[];
  diasMinVencimento: string;
  diasMaxVencimento: string;
  tipoOperacaoCra: string;
  tipoCalculoElegibilidade: string;
  grupoLimites: string;
  dataEmissao: string;
  dataInicio: string;
  dataVencimento: string;
  valorEmissao: string;
  valorGarantiaMinimo: string;
  taxaDescontoPadrao: string;
  metodoNotificacao: string;
  // Carteira de cobrança
  carteiraNome: string;
  banco: string;
  carteira: string;
  tipoCnab: string;
  conta: string;
  agencia: string;
  codigoEmpresa: string;
  taxaJurosPadrao: string;
  taxaMultaPadrao: string;
  permiteFimDeSemana: boolean;
  cadastrarNovoBeneficiario: boolean;
  benefSelecionado: string;
  benefDesde: string;
  benefCnpj: string;
  benefNome: string;
  benefCep: string;
  benefEndereco: string;
  benefNumero: string;
  benefComplemento: string;
  benefBairro: string;
  benefCidade: string;
  benefEstado: string;
  titularConta: string;
  // Carteira de registro
  registradora: string;
  idCarteira: string;
  apiToken: string;
  apiSecret: string;
}

const emit = defineEmits<{ close: []; create: [data: NewCraOperacaoData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info',     label: 'Cadastrais',  icon: Info,              hint: 'Informações cadastrais da operação' },
  { key: 'veiculo',  label: 'Veículo',     icon: Settings,          hint: 'Configurações do veículo' },
  { key: 'config',   label: 'Adicionais',  icon: SlidersHorizontal, hint: 'Configurações adicionais' },
  { key: 'limites',  label: 'Limites',     icon: Percent,           hint: 'Configuração de limites' },
  { key: 'cobranca', label: 'Cobrança',    icon: Wallet,            hint: 'Carteira de cobrança' },
  { key: 'registro', label: 'Registro',    icon: Network,           hint: 'Carteira de registro' },
  { key: 'pdd',      label: 'PDD',         icon: AlertTriangle,     hint: 'Parametrização de PDD' },
  { key: 'grupos',   label: 'Grupos',      icon: Layers,            hint: 'Seleção de grupos empresariais' },
  // Etapa "Ativos" temporariamente desativada — visual mantido comentado (abaixo e no template) para reuso futuro.
  // { key: 'ativos', label: 'Ativos',      icon: FileText,          hint: 'Tipo de ativos aceitos' },
  { key: 'resumo',   label: 'Resumo',      icon: ClipboardCheck,    hint: 'Resumo dos dados cadastrados' },
];

const TOGGLE_KEYS = [
  { key: 'accrual',         label: 'Veículo calcula accrual' },
  { key: 'inscricaoEst',    label: 'Veículo valida Inscrição Estadual' },
  { key: 'vencidoSacado',   label: 'Veículo valida vencidos por sacado' },
  { key: 'topSacados',      label: 'Veículo valida TOP Sacados' },
  { key: 'topCedentes',     label: 'Veículo valida TOP Cedentes' },
  { key: 'distribTipo',     label: 'Veículo valida distribuição por tipo de título' },
  { key: 'nfEntregaFutura', label: 'Veículo pode operar com NF de entrega futura' },
];

const initToggles = () =>
  Object.fromEntries(TOGGLE_KEYS.map((t) => [t.key, false]));

const lastroOpts = [
  { key: 'CPR',    label: 'Cédula de Produto Rural' },
  { key: 'CPR-F',  label: 'Cédula de Produto Rural Financeira' },
  { key: 'CDA',    label: 'Certificado de Depósito Agropecuário' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agrop. e Warrant' },
  { key: 'CDCA',   label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'WAR',    label: 'Warrant' },
  { key: 'NF',     label: 'Nota Fiscal' },
  { key: 'NFE',    label: 'Nota Fiscal Eletrônica' },
  { key: 'DM',     label: 'Duplicata Mercantil' },
  { key: 'DS',     label: 'Duplicata de Serviço' },
  { key: 'CTE',    label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'NC',     label: 'Nota Comercial' },
  { key: 'CCB',    label: 'Cédula de Crédito Bancário' },
  { key: 'CTR',    label: 'Contrato' },
  { key: 'PV',     label: 'Pedido de Venda' },
  { key: 'FAT',    label: 'Fatura' },
];

const stepIdx = ref(0);
const form = ref<NewCraOperacaoData>({
  tipoCliente: '', beneficiarioFinal: '',
  nome: '', numeroEmissao: '',
  cessionaria: '', prestadorServico: '', custodiante: '',
  toggles: initToggles(), gruposSelecionados: [],
  diasMinVencimento: '', diasMaxVencimento: '', tipoOperacaoCra: '',
  tipoCalculoElegibilidade: '', grupoLimites: '',
  dataEmissao: '', dataInicio: '', dataVencimento: '',
  valorEmissao: '', valorGarantiaMinimo: '', taxaDescontoPadrao: '',
  metodoNotificacao: '',
  carteiraNome: '', banco: '', carteira: '', tipoCnab: '', conta: '',
  agencia: '', codigoEmpresa: '', taxaJurosPadrao: '', taxaMultaPadrao: '',
  permiteFimDeSemana: false,
  cadastrarNovoBeneficiario: false,
  benefSelecionado: '', benefDesde: '',
  benefCnpj: '', benefNome: '', benefCep: '', benefEndereco: '',
  benefNumero: '', benefComplemento: '', benefBairro: '', benefCidade: '', benefEstado: '',
  titularConta: '',
  registradora: '', idCarteira: '', apiToken: '', apiSecret: '',
});
const grupoQ = ref('');

// Step Limites — 4 sub-tabs
type LimitTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
const limitTab = ref<LimitTab>('concentracao');
const CONCENTRACAO_LABELS = [
  'Partes relacionadas (total)',
  'Novos sacados (totais)',
  'Novos sacados (individuais)',
  'Sacados elegíveis (individual)',
];
const concentracao = ref<Record<string, { base: string; pct: string }>>(
  Object.fromEntries(CONCENTRACAO_LABELS.map((l) => [l, { base: 'Garantia', pct: '' }])),
);
function setConcentracaoField(label: string, field: 'base' | 'pct', value: string) {
  concentracao.value[label] = { ...concentracao.value[label], [field]: value };
}

const totalizadores = ref<{ tipo: string; pct: string }[]>([
  { tipo: 'CPR-F', pct: '40,0' },
  { tipo: 'CDCA', pct: '35,0' },
]);
const totalForm = ref({ tipo: 'CPR', pct: '' });
function addTotalizador() {
  if (!totalForm.value.pct) return;
  totalizadores.value = [...totalizadores.value, totalForm.value];
  totalForm.value = { tipo: 'CPR', pct: '' };
}

const topCedente = ref<{ top: string; pct: string }[]>([
  { top: 'TOP 1', pct: '15,0' },
  { top: 'TOP 5', pct: '45,0' },
]);
const topCedForm = ref({ top: 'TOP 1', pct: '' });
function addTopCedente() {
  if (!topCedForm.value.pct) return;
  topCedente.value = [...topCedente.value, topCedForm.value];
  topCedForm.value = { top: 'TOP 1', pct: '' };
}

const topSacado = ref<{ top: string; pct: string }[]>([
  { top: 'TOP 1', pct: '20,0' },
  { top: 'TOP 10', pct: '60,0' },
]);
const topSacForm = ref({ top: 'TOP 1', pct: '' });
function addTopSacado() {
  if (!topSacForm.value.pct) return;
  topSacado.value = [...topSacado.value, topSacForm.value];
  topSacForm.value = { top: 'TOP 1', pct: '' };
}

// Step 7 — Ativos aceitos
const ativos = ref<string[]>(['CPR', 'CPR-F', 'CDCA']);
function toggleAtivo(k: string) {
  ativos.value = ativos.value.includes(k) ? ativos.value.filter((a) => a !== k) : [...ativos.value, k];
}

// Step 8 — PDD
const pddFaixas = ref<{ de: string; ate: string; rating: string; pct: string }[]>([
  { de: '0',   ate: '30',  rating: 'A', pct: '0,5'  },
  { de: '31',  ate: '60',  rating: 'B', pct: '1,0'  },
  { de: '61',  ate: '90',  rating: 'C', pct: '3,0'  },
  { de: '91',  ate: '180', rating: 'D', pct: '10,0' },
  { de: '181', ate: '360', rating: 'E', pct: '50,0' },
]);
const pddForm = ref({ de: '', ate: '', rating: 'A', pct: '' });
function addPdd() {
  if (!pddForm.value.de || !pddForm.value.ate || !pddForm.value.pct) return;
  pddFaixas.value = [...pddFaixas.value, pddForm.value];
  pddForm.value = { de: '', ate: '', rating: 'A', pct: '' };
}

function toggleSwitch(key: string) {
  form.value.toggles = { ...form.value.toggles, [key]: !form.value.toggles[key] };
}
function toggleGrupo(nome: string) {
  form.value.gruposSelecionados = form.value.gruposSelecionados.includes(nome)
    ? form.value.gruposSelecionados.filter((x) => x !== nome)
    : [...form.value.gruposSelecionados, nome];
}

const filteredGrupos = computed(() =>
  gruposEmpresariais.filter(
    (g) => !grupoQ.value || g.nome.toLowerCase().includes(grupoQ.value.toLowerCase()),
  ),
);

// Step Resumo — dados agregados das demais etapas
const activeToggles = computed(() =>
  TOGGLE_KEYS.filter((t) => form.value.toggles[t.key]).map((t) => t.label),
);
const concentracaoConfiguradas = computed(
  () => Object.values(concentracao.value).filter((c) => c.pct).length,
);

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

const beneficiarioFinalLabel = computed(() =>
  form.value.cadastrarNovoBeneficiario
    ? form.value.benefNome
    : form.value.benefSelecionado,
);

function handleCreate() {
  form.value.beneficiarioFinal = beneficiarioFinalLabel.value;
  emit('create', form.value);
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
        max-width: 1100px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- ── Header ── -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Nova Operação CRA
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
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

      <!-- ── Stepper ── -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          class="step-btn flex flex-col items-center justify-center"
          :class="{ 'step-btn--pending': i !== stepIdx && i >= stepIdx }"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- ── Body ── -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <!-- Step 1 — Informações cadastrais -->
        <StepGrid v-if="step.key === 'info'">
          <SelectField label="Tipo da Operação" :options="['CRA Carteira', 'CRA Controle', 'CRA Terceiro']" placeholder="Selecione" :span="6" v-model="form.tipoOperacaoCra" />
          <SelectField label="Tipo de Cliente" :options="['Monocedente', 'Multicedente']" placeholder="Selecione" :span="6" v-model="form.tipoCliente" />
          <FormField label="Número de Emissão" placeholder="Ex: 4ª" :span="3" v-model="form.numeroEmissao" />
          <FormField label="Nome da Operação" placeholder="Ex: 4ª Emissão CRA Semeagro" :span="9" v-model="form.nome" />
          <SelectField label="Cessionária" :options="['CERES SECURIZADORA S/A', 'BTG SECURIZADORA S/A', 'ISEC SECURIZADORA S/A', 'RB CAPITAL']" placeholder="Selecione" :span="4" v-model="form.cessionaria" />
          <SelectField label="Prestador de Serviço" :options="['Oliveira Trust', 'Vórtx', 'Singulare', 'Daycoval', 'BRL Trust']" placeholder="Selecione" :span="4" v-model="form.prestadorServico" />
          <SelectField label="Custodiante" :options="['B3', 'Cetip', 'Daycoval', 'Singulare', 'Oliveira Trust']" placeholder="Selecione" :span="4" v-model="form.custodiante" />
        </StepGrid>

        <!-- Step 2 — Configurações do veículo (toggles) -->
        <div v-else-if="step.key === 'veiculo'" class="flex flex-col" style="gap: 10px">
          <SectionHelp>
            Defina as regras de validação e cálculo que o veículo deve aplicar a esta operação.
          </SectionHelp>
          <ToggleRow
            v-for="t in TOGGLE_KEYS"
            :key="t.key"
            :label="t.label"
            :on="form.toggles[t.key]"
            @toggle="toggleSwitch(t.key)"
          />
        </div>

        <!-- Step 8 — Grupos Empresariais -->
        <div v-else-if="step.key === 'grupos'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Selecione os grupos empresariais autorizados a operar nesta operação.
            <strong style="color: var(--text-default)">{{ form.gruposSelecionados.length }} selecionados</strong>.
          </SectionHelp>
          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
            <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
            <input
              v-model="grupoQ"
              placeholder="Filtrar grupos..."
              style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
            />
          </div>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px">
            <button
              v-for="g in filteredGrupos"
              :key="g.nome"
              class="flex items-center"
              :style="{
                gap: '10px',
                padding: '12px 14px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-light)' : 'var(--surface-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-base)',
              }"
              @click="toggleGrupo(g.nome)"
            >
              <span
                class="flex items-center justify-center"
                :style="{
                  width: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  flexShrink: 0,
                  background: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                  color: form.gruposSelecionados.includes(g.nome) ? '#fff' : 'var(--text-muted)',
                  transition: 'all var(--duration-base)',
                }"
              >
                <Check v-if="form.gruposSelecionados.includes(g.nome)" :size="11" />
              </span>
              <div style="flex: 1; min-width: 0">
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    fontWeight: form.gruposSelecionados.includes(g.nome) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                    color: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--text-default)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }"
                >
                  {{ g.nome }}
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">{{ g.cnpj }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 3 — Configurações adicionais -->
        <StepGrid v-else-if="step.key === 'config'">
          <FormField label="Dias Mínimo para Vencimento" placeholder="Ex: 30" type="number" :span="3" v-model="form.diasMinVencimento" />
          <FormField label="Dias Máximo para Vencimento" placeholder="Ex: 720" type="number" :span="3" v-model="form.diasMaxVencimento" />
          <SelectField label="Tipo de Cálculo de Elegibilidade" :options="['Valor de garantia', 'Valor da emissão']" placeholder="Selecione" :span="3" v-model="form.tipoCalculoElegibilidade" />
          <SelectField label="Grupo de Limites" :options="['Confina', 'Op Multicedentes', 'Op Monocedentes', 'Trading', 'CeresSec']" placeholder="Selecione" :span="3" v-model="form.grupoLimites" />
          <FormField label="Data de Emissão" type="date" :span="3" v-model="form.dataEmissao" />
          <FormField label="Data de Início da Operação" type="date" :span="3" v-model="form.dataInicio" />
          <FormField label="Data de Vencimento" type="date" :span="3" v-model="form.dataVencimento" />
          <SelectField label="Método de Notificação Padrão" :options="['E-mail', 'Telefone', 'Mensagem de Texto', 'WhatsApp']" placeholder="Selecione" :span="3" v-model="form.metodoNotificacao" />
          <FormField label="Valor de Emissão da Operação" placeholder="R$ 0,00" :span="6" v-model="form.valorEmissao" />
          <FormField label="Valor Mínimo de Garantia da Emissão" placeholder="R$ 0,00" :span="6" v-model="form.valorGarantiaMinimo" />
        </StepGrid>

        <!-- Step 4 — Configuração de limites (4 abas) -->
        <div v-else-if="step.key === 'limites'" class="flex flex-col" style="gap: 20px">
          <SectionHelp>
            Configure os limites de concentração da carteira e os totalizadores por tipo de ativo e TOP.
          </SectionHelp>
          <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start; flex-wrap: wrap">
            <button
              v-for="[k, label] in ([
                ['concentracao', 'Concentração'],
                ['totalizadores', 'Totalizadores de ativos'],
                ['topCedente', 'TOP Cedente'],
                ['topSacado', 'TOP Sacado'],
              ] as [LimitTab, string][])"
              :key="k"
              :style="{
                padding: '8px 16px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                background: limitTab === k ? 'var(--surface-card)' : 'transparent',
                color: limitTab === k ? 'var(--text-strong)' : 'var(--text-muted)',
                boxShadow: limitTab === k ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--duration-base)',
              }"
              @click="limitTab = k"
            >
              {{ label }}
            </button>
          </div>

          <div v-if="limitTab === 'concentracao'" class="flex flex-col" style="gap: 12px">
            <LimiteRow
              v-for="label in CONCENTRACAO_LABELS"
              :key="label"
              :label="label"
              :base="concentracao[label].base"
              :pct="concentracao[label].pct"
              @update:base="(v) => setConcentracaoField(label, 'base', v)"
              @update:pct="(v) => setConcentracaoField(label, 'pct', v)"
            />
          </div>

          <SectionGroup v-else-if="limitTab === 'totalizadores'" :icon="FileText" title="Totalizadores de ativos">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de Ativo</FieldLabel>
                <SelectField :options="lastroOpts.map((o) => o.key)" v-model="totalForm.tipo" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="totalForm.pct" />
              </div>
              <AddButton @click="addTotalizador" />
            </div>
            <DataTable
              :cols="[
                { key: 'tipo', label: 'Tipo de Ativo', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="totalizadores"
              empty="Nenhum totalizador cadastrado."
              @remove="(i) => (totalizadores = totalizadores.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>

          <SectionGroup v-else-if="limitTab === 'topCedente'" :icon="Percent" title="TOP Cedente">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de TOP</FieldLabel>
                <SelectField :options="['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']" v-model="topCedForm.top" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="topCedForm.pct" />
              </div>
              <AddButton @click="addTopCedente" />
            </div>
            <DataTable
              :cols="[
                { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="topCedente"
              empty="Nenhum TOP cedente cadastrado."
              @remove="(i) => (topCedente = topCedente.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>

          <SectionGroup v-else-if="limitTab === 'topSacado'" :icon="Percent" title="TOP Sacado">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de TOP</FieldLabel>
                <SelectField :options="['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']" v-model="topSacForm.top" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="topSacForm.pct" />
              </div>
              <AddButton @click="addTopSacado" />
            </div>
            <DataTable
              :cols="[
                { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="topSacado"
              empty="Nenhum TOP sacado cadastrado."
              @remove="(i) => (topSacado = topSacado.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

        <!-- Step 5 — Carteira de cobrança -->
        <div v-else-if="step.key === 'cobranca'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>Parâmetros bancários para emissão de boletos e cobrança dos títulos.</SectionHelp>
          <StepGrid>
            <FormField label="Nome da Carteira" placeholder="Ex: Carteira Principal" :span="6" v-model="form.carteiraNome" />
            <SelectField label="Banco" :options="['001 - Banco do Brasil', '237 - Bradesco', '341 - Itaú', '033 - Santander', '748 - Sicredi', '756 - Sicoob']" placeholder="Selecione" :span="3" v-model="form.banco" />
            <SelectField label="Tipo de CNAB" :options="['CNAB 240', 'CNAB 400']" placeholder="Selecione" :span="3" v-model="form.tipoCnab" />
            <FormField label="Carteira" placeholder="Ex: 17" :span="3" v-model="form.carteira" />
            <FormField label="Agência" placeholder="0000" :span="3" v-model="form.agencia" />
            <FormField label="Conta" placeholder="00000-0" :span="3" v-model="form.conta" />
            <FormField label="Código da Empresa" placeholder="Código no banco" :span="3" v-model="form.codigoEmpresa" />
            <FormField label="Taxa de Juros Padrão" placeholder="0,0000% a.m." :span="4" v-model="form.taxaJurosPadrao" />
            <FormField label="Taxa de Multa Padrão" placeholder="0,00%" :span="4" v-model="form.taxaMultaPadrao" />
            <FormField label="Taxa de Desconto Padrão" placeholder="0,0000%" :span="4" v-model="form.taxaDescontoPadrao" />
            <div style="grid-column: span 12">
              <FieldLabel>Titular da Conta</FieldLabel>
              <Input disabled :model-value="beneficiarioFinalLabel || '—'" style="color: var(--text-muted)" />
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px">
                Preenchido automaticamente conforme a Identificação de Beneficiário Final.
              </div>
            </div>
          </StepGrid>
          <ToggleRow
            label="Permite vencimento em finais de semana e feriado"
            hint="Se ativo, parcelas podem ser liquidadas sem prorrogação para o próximo dia útil."
            :on="form.permiteFimDeSemana"
            @toggle="form.permiteFimDeSemana = !form.permiteFimDeSemana"
          />

          <div>
            <SectionTitle :icon="UserCheck">Identificação de Beneficiário Final</SectionTitle>
            <div class="flex flex-col" style="gap: 16px">
              <ToggleRow
                label="Cadastrar novo beneficiário final"
                hint="Se ativo, preencha o formulário de cadastro. Se inativo, selecione um beneficiário já existente."
                :on="form.cadastrarNovoBeneficiario"
                @toggle="form.cadastrarNovoBeneficiario = !form.cadastrarNovoBeneficiario"
              />
              <StepGrid v-if="!form.cadastrarNovoBeneficiario">
                <SelectField
                  label="Beneficiário final"
                  :options="BENEFICIARIO_OPTS"
                  placeholder="Selecione"
                  :span="8"
                  v-model="form.benefSelecionado"
                />
                <FormField
                  label="Beneficiário Final do fundo desde"
                  placeholder="dd/mm/aaaa"
                  :span="4"
                  v-model="form.benefDesde"
                />
              </StepGrid>
              <StepGrid v-else>
                <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" v-model="form.benefCnpj" />
                <FormField label="Nome" placeholder="Razão social do beneficiário" :span="5" v-model="form.benefNome" />
                <FormField
                  label="Beneficiário Final do fundo desde"
                  placeholder="dd/mm/aaaa"
                  :span="3"
                  v-model="form.benefDesde"
                />
                <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.benefCep" />
                <FormField label="Endereço" placeholder="Rua / Avenida" :span="7" v-model="form.benefEndereco" />
                <FormField label="Número" placeholder="—" :span="2" v-model="form.benefNumero" />
                <FormField label="Complemento" placeholder="Sala / Andar" :span="3" v-model="form.benefComplemento" />
                <FormField label="Bairro" placeholder="—" :span="3" v-model="form.benefBairro" />
                <FormField label="Cidade" placeholder="—" :span="4" v-model="form.benefCidade" />
                <SelectField
                  label="Estado"
                  :options="['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'MT', 'MS', 'DF']"
                  placeholder="UF"
                  :span="2"
                  v-model="form.benefEstado"
                />
              </StepGrid>
            </div>
          </div>
        </div>

        <!-- Step 6 — Carteira de registro -->
        <div v-else-if="step.key === 'registro'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>Credenciais de integração com a registradora do veículo.</SectionHelp>
          <StepGrid>
            <SelectField label="Registradora" :options="['B3', 'CERC', 'Núclea', 'CRDC']" placeholder="Selecione" :span="6" v-model="form.registradora" />
            <FormField label="ID da Carteira" placeholder="Identificador na registradora" :span="6" v-model="form.idCarteira" />
            <FormField label="API Token" placeholder="Token de integração" :span="6" v-model="form.apiToken" />
            <FormField label="API Secret" type="password" placeholder="••••••••" :span="6" v-model="form.apiSecret" />
          </StepGrid>
        </div>

        <!--
        Step — Tipo de Ativos Aceitos
        Temporariamente oculta desta etapa (ver comentário em `steps`). Visual mantido
        comentado aqui para ser reaproveitado futuramente.

        <div v-else-if="step.key === 'ativos'">
          <SectionHelp>
            Selecione os tipos de ativos creditórios aceitos nesta operação CRA.
          </SectionHelp>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
            <button
              v-for="o in lastroOpts"
              :key="o.key"
              :style="{
                padding: '16px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: ativos.includes(o.key) ? 'var(--agro-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: ativos.includes(o.key) ? 'var(--agro-light)' : 'var(--surface-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-base)',
              }"
              @click="toggleAtivo(o.key)"
            >
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.12em',
                  color: ativos.includes(o.key) ? 'var(--agro-base)' : 'var(--text-muted)',
                  marginBottom: '6px',
                }"
              >
                {{ o.key }}
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ o.label }}
              </div>
            </button>
          </div>
        </div>
        -->

        <!-- Step 8 — Parametrização de PDD -->
        <div v-else-if="step.key === 'pdd'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Defina as faixas de aging e o percentual de provisão para cada classificação de risco.
          </SectionHelp>
          <SectionGroup :icon="AlertTriangle" title="Provisão para Devedores Duvidosos">
            <div class="grid items-end" style="grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Dias Mín.</FieldLabel>
                <Input type="number" placeholder="0" v-model="pddForm.de" />
              </div>
              <div>
                <FieldLabel>Dias Máx.</FieldLabel>
                <Input type="number" placeholder="30" v-model="pddForm.ate" />
              </div>
              <div>
                <FieldLabel>% de PDD</FieldLabel>
                <Input placeholder="0,50" v-model="pddForm.pct" />
              </div>
              <div>
                <FieldLabel>Classificação</FieldLabel>
                <SelectField :options="['A', 'B', 'C', 'D', 'E', 'F']" v-model="pddForm.rating" />
              </div>
              <AddButton @click="addPdd" />
            </div>
            <DataTable
              :cols="[
                { key: 'de', label: 'Dias Mín.', width: '1fr' },
                { key: 'ate', label: 'Dias Máx.', width: '1fr' },
                { key: 'rating', label: 'Classificação', width: '1fr' },
                { key: 'pct', label: '% Provisão', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="pddFaixas"
              empty="Nenhuma faixa cadastrada."
              @remove="(i) => (pddFaixas = pddFaixas.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

        <!-- Step 9 — Resumo dos dados cadastrados -->
        <div v-else-if="step.key === 'resumo'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Revise as informações cadastradas em todas as etapas antes de finalizar a operação.
          </SectionHelp>

          <SectionGroup :icon="Info" title="Dados Cadastrais">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Tipo de Operação" :value="form.tipoOperacaoCra" />
              <SummaryItem label="Tipo de Cliente" :value="form.tipoCliente" />
              <SummaryItem label="Nº de Emissão" :value="form.numeroEmissao" />
              <SummaryItem label="Nome da Operação" :value="form.nome" />
              <SummaryItem label="Cessionária" :value="form.cessionaria" />
              <SummaryItem label="Prestador de Serviço" :value="form.prestadorServico" />
              <SummaryItem label="Custodiante" :value="form.custodiante" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Settings" title="Configurações do Veículo">
            <div v-if="activeToggles.length" class="flex flex-wrap" style="gap: 8px">
              <span v-for="t in activeToggles" :key="t" class="summary-tag">{{ t }}</span>
            </div>
            <div v-else style="font-size: var(--text-sm); color: var(--text-muted)">Nenhuma configuração ativada.</div>
          </SectionGroup>

          <SectionGroup :icon="SlidersHorizontal" title="Configurações Adicionais">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Dias Mín. Vencimento" :value="form.diasMinVencimento" />
              <SummaryItem label="Dias Máx. Vencimento" :value="form.diasMaxVencimento" />
              <SummaryItem label="Cálculo de Elegibilidade" :value="form.tipoCalculoElegibilidade" />
              <SummaryItem label="Grupo de Limites" :value="form.grupoLimites" />
              <SummaryItem label="Data de Emissão" :value="form.dataEmissao" />
              <SummaryItem label="Data de Início" :value="form.dataInicio" />
              <SummaryItem label="Data de Vencimento" :value="form.dataVencimento" />
              <SummaryItem label="Método de Notificação" :value="form.metodoNotificacao" />
              <SummaryItem label="Valor de Emissão" :value="form.valorEmissao" />
              <SummaryItem label="Valor Mín. de Garantia" :value="form.valorGarantiaMinimo" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Percent" title="Limites">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Regras de Concentração" :value="`${concentracaoConfiguradas} configuradas`" />
              <SummaryItem label="Totalizadores de Ativos" :value="`${totalizadores.length} cadastrados`" />
              <SummaryItem label="TOP Cedente" :value="`${topCedente.length} cadastrados`" />
              <SummaryItem label="TOP Sacado" :value="`${topSacado.length} cadastrados`" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Wallet" title="Carteira de Cobrança">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Nome da Carteira" :value="form.carteiraNome" />
              <SummaryItem label="Banco" :value="form.banco" />
              <SummaryItem label="Tipo de CNAB" :value="form.tipoCnab" />
              <SummaryItem label="Carteira" :value="form.carteira" />
              <SummaryItem label="Agência" :value="form.agencia" />
              <SummaryItem label="Conta" :value="form.conta" />
              <SummaryItem label="Taxa de Juros Padrão" :value="form.taxaJurosPadrao" />
              <SummaryItem label="Taxa de Multa Padrão" :value="form.taxaMultaPadrao" />
              <SummaryItem label="Fim de Semana" :value="form.permiteFimDeSemana ? 'Permitido' : 'Não permitido'" />
              <SummaryItem
                label="Beneficiário Final (Cobrança)"
                :value="beneficiarioFinalLabel || '—'"
              />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Network" title="Carteira de Registro">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Registradora" :value="form.registradora" />
              <SummaryItem label="ID da Carteira" :value="form.idCarteira" />
              <SummaryItem label="Credenciais de API" :value="form.apiToken ? 'Configuradas' : 'Não configuradas'" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Layers" title="Grupos Empresariais">
            <div v-if="form.gruposSelecionados.length" class="flex flex-wrap" style="gap: 8px">
              <span v-for="g in form.gruposSelecionados" :key="g" class="summary-tag">{{ g }}</span>
            </div>
            <div v-else style="font-size: var(--text-sm); color: var(--text-muted)">Nenhum grupo selecionado.</div>
          </SectionGroup>

          <SectionGroup :icon="AlertTriangle" title="Parametrização de PDD">
            <SummaryItem label="Faixas de Aging Cadastradas" :value="`${pddFaixas.length} faixas`" />
          </SectionGroup>
        </div>
      </div>

      <!-- ── Footer ── -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="isFirst ? emit('close') : stepIdx--"
        >
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="isLast ? handleCreate() : stepIdx++"
        >
          {{ isLast ? 'Finalizar Cadastro' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.ccm-row .ccm-trash {
  opacity: 0;
  transition: opacity 0.15s;
}
.ccm-row:hover .ccm-trash {
  opacity: 1;
}
.ccm-trash button {
  background: transparent;
  color: var(--text-muted);
  transition: all 0.15s;
}
.ccm-trash button:hover {
  background: var(--danger-light);
  color: var(--danger-base);
}
.summary-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--gci-base);
  background: var(--gci-light);
  border-radius: var(--radius-md);
}
</style>

<style scoped>
.step-btn {
  opacity: 1;
}
.step-btn--pending {
  opacity: 0.55;
}
.step-btn--pending:hover {
  opacity: 1;
}
</style>
```

## Components / cra-card

### DonutRing

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ pct: number; color: string; trackColor?: string }>(),
  { trackColor: 'var(--border-default)' },
);

const r = 20;
const circ = 2 * Math.PI * r;
const dashoffset = computed(() => circ * (1 - Math.min(Math.max(props.pct, 0), 100) / 100));
const label = computed(() => props.pct.toFixed(1).replace('.', ',') + '%');
</script>

<template>
  <svg width="52" height="52" viewBox="0 0 52 52" style="flex-shrink: 0">
    <circle cx="26" cy="26" :r="r" fill="none" :stroke="trackColor" stroke-width="5" />
    <circle
      cx="26"
      cy="26"
      :r="r"
      fill="none"
      :stroke="color"
      stroke-width="5"
      :stroke-dasharray="`${circ}`"
      :stroke-dashoffset="dashoffset"
      stroke-linecap="round"
      style="transform: rotate(-90deg); transform-origin: 26px 26px; transition: stroke-dashoffset 0.6s ease"
    />
    <text
      x="50%"
      y="52%"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ fontSize: '9px', fontWeight: 700, fill: color, fontFamily: 'var(--font-sans)' }"
    >
      {{ label }}
    </text>
  </svg>
</template>
```

## Components / create-cra-modal

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

### FormField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <Input v-model="model" :placeholder="placeholder" :type="type" :disabled="disabled" />
  </div>
</template>
```

### Input

```vue
<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });
defineProps<{ disabled?: boolean }>();
const model = defineModel<string>();
const attrs = useAttrs();
</script>

<template>
  <input
    v-model="model"
    :disabled="disabled"
    :style="{
      height: '40px',
      padding: '0 14px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      fontSize: 'var(--text-sm)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
      width: '100%',
    }"
    v-bind="attrs"
  />
</template>
```

### SelectField

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          height: '40px',
          paddingLeft: '14px',
          paddingRight: '40px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          width: '100%',
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
        style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none"
      />
    </div>
  </div>
</template>
```

### StepGrid

```vue
<template>
  <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
    <slot />
  </div>
</template>
```

## Components / create-cra-operacao-modal

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
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.10em;
      white-space: nowrap;
    "
    @click="emit('click')"
  >
    <Plus :size="14" /> ADICIONAR
  </button>
</template>
```

### DataTable

```vue
<script setup lang="ts" generic="T extends Record<string, string>">
import { computed } from 'vue';
import RowTrash from './RowTrash.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{
  cols: { key: string; label: string; width: string; format?: (v: string) => string }[];
  rows: T[];
  empty: string;
}>();
const emit = defineEmits<{ remove: [i: number] }>();

const template = computed(() => props.cols.map((c) => c.width).join(' ') + ' 36px');
const { page, pageSize, total, pageItems, clampedPage, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 5 },
);

function globalIndex(localIdx: number) {
  return (clampedPage.value - 1) * pageSize.value + localIdx;
}
</script>

<template>
  <div v-if="!rows.length" style="padding: 16px 0; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
    {{ empty }}
  </div>
  <div v-else style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); overflow: hidden">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: template,
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="c.key">{{ c.label }}</div>
      <div />
    </div>
    <div
      v-for="(row, i) in pageItems"
      :key="globalIndex(i)"
      class="grid items-center ccm-row"
      :style="{
        gridTemplateColumns: template,
        padding: '12px 14px',
        borderTop: '1px solid var(--border-default)',
        fontSize: 'var(--text-sm)',
        fontVariantNumeric: 'tabular-nums',
      }"
    >
      <div v-for="c in cols" :key="c.key" style="color: var(--text-strong); font-weight: var(--weight-semibold)">
        {{ c.format ? c.format(row[c.key] ?? '') : (row[c.key] ?? '') }}
      </div>
      <RowTrash @click="emit('remove', globalIndex(i))" />
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

### FormField

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <Input v-model="model" :placeholder="placeholder" :type="type" :disabled="disabled" />
  </div>
</template>
```

### Input

```vue
<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });
defineProps<{ disabled?: boolean }>();
const model = defineModel<string>();
const attrs = useAttrs();
</script>

<template>
  <input
    v-model="model"
    :disabled="disabled"
    :style="{
      height: '40px',
      padding: '0 14px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      fontSize: 'var(--text-sm)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
      width: '100%',
    }"
    v-bind="attrs"
  />
</template>
```

### LimiteRow

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import SelectField from './SelectField.vue';
import Input from './Input.vue';

defineProps<{ label: string; base: string; pct: string }>();
const emit = defineEmits<{ 'update:base': [v: string]; 'update:pct': [v: string] }>();
</script>

<template>
  <div
    class="grid items-end"
    style="grid-template-columns: 2fr 1.2fr 1fr; gap: 12px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
  >
    <div style="align-self: center; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      {{ label }}
    </div>
    <div>
      <FieldLabel>Base de Cálculo</FieldLabel>
      <SelectField
        :options="['Garantia', 'Emissão']"
        :model-value="base"
        @update:model-value="emit('update:base', $event ?? '')"
      />
    </div>
    <div>
      <FieldLabel>% Atribuído</FieldLabel>
      <Input placeholder="0,00" :model-value="pct" @update:model-value="emit('update:pct', $event ?? '')" />
    </div>
  </div>
</template>
```

### RowTrash

```vue
<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <div class="ccm-trash" style="display: flex; align-items: center; justify-content: center">
    <button
      class="flex items-center justify-center"
      style="width: 32px; height: 32px; border-radius: var(--radius-md); border: none; cursor: pointer"
      @click="emit('click')"
    >
      <Trash2 :size="14" />
    </button>
  </div>
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
      v-if="title || icon"
      class="flex items-center"
      style="gap: 8px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px"
    >
      <span
        v-if="icon"
        class="flex items-center justify-center"
        style="width: 24px; height: 24px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base)"
      >
        <component :is="icon" :size="13" :stroke-width="2" />
      </span>
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### SectionHelp

```vue
<template>
  <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 8px; line-height: var(--leading-relaxed)">
    <slot />
  </div>
</template>
```

### SectionTitle

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon?: Component }>();
</script>

<template>
  <div
    class="flex items-center"
    style="
      gap: 8px;
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.18em;
      color: var(--accent);
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 10px;
    "
  >
    <span
      v-if="icon"
      class="flex items-center justify-center"
      style="width: 24px; height: 24px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base)"
    >
      <component :is="icon" :size="13" :stroke-width="2" />
    </span>
    <slot />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

defineProps<{
  label?: string;
  options: string[];
  span?: number;
  placeholder?: string;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          height: '40px',
          paddingLeft: '14px',
          paddingRight: '40px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          width: '100%',
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
        style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none"
      />
    </div>
  </div>
</template>
```

### StepGrid

```vue
<template>
  <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
    <slot />
  </div>
</template>
```

### SummaryItem

```vue
<script setup lang="ts">
defineProps<{ label: string; value?: string | null }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      {{ value || '—' }}
    </div>
  </div>
</template>
```

### ToggleRow

```vue
<script setup lang="ts">
defineProps<{ label: string; on: boolean; hint?: string }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      padding: '14px 16px',
      borderRadius: 'var(--radius-lg)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      cursor: 'pointer',
      gap: '12px',
    }"
    @click="emit('toggle')"
  >
    <div style="min-width: 0">
      <div
        :style="{
          fontSize: 'var(--text-sm)',
          color: on ? 'var(--success-dark)' : 'var(--text-default)',
          fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
          userSelect: 'none',
          lineHeight: '1.4',
        }"
      >
        {{ label }}
      </div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ hint }}</div>
    </div>
    <div
      style="width: 44px; height: 24px; border-radius: 9999px; position: relative; flex-shrink: 0"
      :style="{ background: on ? 'var(--success-base)' : 'var(--border-default)', transition: 'background var(--duration-base)' }"
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }"
      />
    </div>
  </div>
</template>
```

## Components / modals

### CessaoFormModal

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, FileText, Percent, SlidersHorizontal } from 'lucide-vue-next';
import {
  CESSAO_TIPOS,
  type Cessao,
  type CessaoTipo,
  type RoundStatus,
} from '../../data/craData';
import SectionGroup from '../create-cra-operacao-modal/SectionGroup.vue';
import StepGrid from '../create-cra-operacao-modal/StepGrid.vue';
import FormField from '../create-cra-operacao-modal/FormField.vue';
import SelectField from '../create-cra-operacao-modal/SelectField.vue';
import ToggleRow from '../create-cra-operacao-modal/ToggleRow.vue';

const props = defineProps<{ cessao?: Cessao | null }>();
const emit = defineEmits<{ close: []; save: [Cessao] }>();

const isCreate = computed(() => !props.cessao?.id);

const nome = ref('');
const data = ref('');
const tipo = ref<CessaoTipo>('DESEMBOLSO');
const parametrizacao = ref('Padrão');
const taxaCessao = ref('');
const descontoAdicional = ref('');
const tipoCalculo = ref('Deságio por valor nominal');
const usoArtesanal = ref(false);
const indicadorTaxa = ref('CDI');
const operadorTaxa = ref('Percentual');
const frequenciaTaxa = ref('Mensal');
const baseCalculo = ref('252');
const capitalizacao = ref('Composto');
const inicioContagem = ref('D+0');
const inicioCalculo = ref('Cessão');
const coobrigacao = ref(false);
const obrigacaoRecompra = ref(false);
const certificadorEmail = ref(false);

function hydrateFromProp(c: Cessao | null | undefined) {
  if (!c) {
    nome.value = '';
    data.value = new Date().toISOString().slice(0, 10);
    tipo.value = 'DESEMBOLSO';
    parametrizacao.value = 'Padrão';
    taxaCessao.value = '';
    descontoAdicional.value = '';
    tipoCalculo.value = 'Deságio por valor nominal';
    usoArtesanal.value = false;
    indicadorTaxa.value = 'CDI';
    operadorTaxa.value = 'Percentual';
    frequenciaTaxa.value = 'Mensal';
    baseCalculo.value = '252';
    capitalizacao.value = 'Composto';
    inicioContagem.value = 'D+0';
    inicioCalculo.value = 'Cessão';
    coobrigacao.value = false;
    obrigacaoRecompra.value = false;
    certificadorEmail.value = false;
    return;
  }
  nome.value = c.nome;
  data.value = c.data;
  tipo.value = c.tipo;
  parametrizacao.value = c.parametrizacao ?? 'Padrão';
  taxaCessao.value = c.taxaCessao != null ? String(c.taxaCessao) : '';
  descontoAdicional.value = c.descontoAdicional ?? '';
  tipoCalculo.value = c.tipoCalculo ?? 'Deságio por valor nominal';
  usoArtesanal.value = c.usoArtesanal ?? false;
  indicadorTaxa.value = c.indicadorTaxa ?? 'CDI';
  operadorTaxa.value = c.operadorTaxa ?? 'Percentual';
  frequenciaTaxa.value = c.frequenciaTaxa ?? 'Mensal';
  baseCalculo.value = c.baseCalculo ?? '252';
  capitalizacao.value = c.capitalizacao ?? 'Composto';
  inicioContagem.value = c.inicioContagem ?? 'D+0';
  inicioCalculo.value = c.inicioCalculo ?? 'Cessão';
  coobrigacao.value = c.coobrigacao ?? false;
  obrigacaoRecompra.value = c.obrigacaoRecompra ?? false;
  certificadorEmail.value = c.certificadorEmail ?? false;
}

watch(() => props.cessao, (c) => hydrateFromProp(c), { immediate: true });

function handleSave() {
  const taxa = parseFloat(taxaCessao.value.replace(',', '.')) || undefined;
  const payload: Cessao = {
    id: props.cessao?.id ?? `ces-${Date.now()}`,
    nome: nome.value.trim() || 'Nova Cessão',
    data: data.value,
    tipo: tipo.value,
    valorAberto: props.cessao?.valorAberto ?? 0,
    status: (props.cessao?.status ?? 'ABERTA') as RoundStatus,
    taxaCessao: taxa,
    valorPresente: props.cessao?.valorPresente,
    valorTotal: props.cessao?.valorTotal,
    temTermo: props.cessao?.temTermo,
    cedente: props.cessao?.cedente,
    descontoAdicional: descontoAdicional.value || undefined,
    parametrizacao: parametrizacao.value,
    tipoCalculo: tipoCalculo.value,
    usoArtesanal: usoArtesanal.value,
    indicadorTaxa: indicadorTaxa.value,
    operadorTaxa: operadorTaxa.value,
    frequenciaTaxa: frequenciaTaxa.value,
    baseCalculo: baseCalculo.value,
    capitalizacao: capitalizacao.value,
    inicioContagem: inicioContagem.value,
    inicioCalculo: inicioCalculo.value,
    coobrigacao: coobrigacao.value,
    obrigacaoRecompra: obrigacaoRecompra.value,
    certificadorEmail: certificadorEmail.value,
  };
  emit('save', payload);
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
    "
    @click.self="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 900px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 6px">
            CRA · Cessão
          </div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ isCreate ? 'Nova Cessão' : 'Editar Cessão' }}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px"
          @click="emit('close')"
        >
          <X :size="22" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <SectionGroup :icon="FileText" title="Dados">
          <StepGrid>
        <FormField v-model="nome" label="Nome" placeholder="Nome da cessão" :span="6" />
        <FormField v-model="data" label="Data" type="date" :span="3" />
        <SelectField v-model="tipo" label="Tipo de Cessão" :options="[...CESSAO_TIPOS]" :span="3" />
        <SelectField
          v-if="isCreate"
          v-model="parametrizacao"
          label="Indicativo de Parametrização"
          :options="['Padrão', 'Personalizado']"
          :span="6"
        />
      </StepGrid>
        </SectionGroup>

        <SectionGroup :icon="Percent" title="Cálculo e Taxas">
          <StepGrid>
            <FormField v-model="taxaCessao" label="Taxa de Cessão (%)" placeholder="0,00" :span="3" />
            <FormField v-model="descontoAdicional" label="Desconto Adicional" placeholder="—" :span="3" />
            <SelectField
              v-model="tipoCalculo"
              label="Tipo de Cálculo"
              :options="['Deságio por valor nominal', 'Ágio', 'Sem cálculo']"
              :span="6"
            />
          </StepGrid>
          <div style="margin-top: 16px">
            <ToggleRow label="Metodologia artesanal" :on="usoArtesanal" @toggle="usoArtesanal = !usoArtesanal" />
          </div>
          <div style="margin-top: 16px">
          <StepGrid>
            <SelectField v-model="indicadorTaxa" label="Indicador" :options="['CDI', 'Indefinido']" :span="4" />
            <SelectField v-model="operadorTaxa" label="Operador" :options="['Percentual', 'Spread', 'Indefinido']" :span="4" />
            <SelectField v-model="frequenciaTaxa" label="Frequência" :options="['Diário', 'Mensal', 'Anual']" :span="4" />
            <SelectField v-model="baseCalculo" label="Base" :options="['252', '360', '30']" :span="3" />
            <SelectField v-model="capitalizacao" label="Capitalização" :options="['Simples', 'Composto']" :span="3" />
            <SelectField v-model="inicioContagem" label="Início contagem" :options="['D+0', 'D+1']" :span="3" />
            <SelectField v-model="inicioCalculo" label="Início cálculo" :options="['Emissão', 'Cessão']" :span="3" />
          </StepGrid>
          </div>
        </SectionGroup>

        <SectionGroup :icon="SlidersHorizontal" title="Flags">
          <div class="flex flex-col" style="gap: 12px">
            <ToggleRow label="Coobrigação" :on="coobrigacao" @toggle="coobrigacao = !coobrigacao" />
            <ToggleRow label="Obrigação de Recompra" :on="obrigacaoRecompra" @toggle="obrigacaoRecompra = !obrigacaoRecompra" />
            <ToggleRow label="Certificador de e-mail" :on="certificadorEmail" @toggle="certificadorEmail = !certificadorEmail" />
          </div>
        </SectionGroup>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="handleSave"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
```

### SubirContratoMaeModal

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Upload } from 'lucide-vue-next';

const props = defineProps<{ initialDate?: string }>();
const emit = defineEmits<{
  close: [];
  save: [{ date: string; fileName: string }];
}>();

const dataFirma = ref('');
const fileName = ref('');

watch(
  () => props.initialDate,
  (d) => {
    dataFirma.value = d ?? new Date().toISOString().slice(0, 10);
  },
  { immediate: true },
);

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  fileName.value = file?.name ?? '';
}

function handleSave() {
  if (!fileName.value) return;
  emit('save', { date: dataFirma.value, fileName: fileName.value });
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
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 6px">
            CRA · Grupo Empresarial
          </div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Subir Contrato Mãe
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px"
          @click="emit('close')"
        >
          <X :size="22" />
        </button>
      </div>

      <div style="padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
            Data firma
          </div>
          <input
            v-model="dataFirma"
            type="date"
            style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--text-strong); outline: none"
          />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
            Contrato Mãe (PDF)
          </div>
          <label
            class="flex items-center"
            style="gap: 12px; padding: 16px; border: 2px dashed var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer"
          >
            <Upload :size="20" style="color: var(--gci-base); flex-shrink: 0" />
            <div style="flex: 1; min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ fileName || 'Selecionar arquivo PDF' }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                Apenas arquivos .pdf
              </div>
            </div>
            <input type="file" accept=".pdf" style="display: none" @change="onFileChange" />
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!fileName"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40); opacity: 1"
          :style="{ opacity: fileName ? 1 : 0.5, cursor: fileName ? 'pointer' : 'not-allowed' }"
          @click="handleSave"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
```
