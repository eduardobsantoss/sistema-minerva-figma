# FIDC's

## Screens

### ClassDetailScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, FileText, TrendingUp, Calendar, AlertCircle, Search, Filter } from 'lucide-vue-next';
import { brl, type Fidc, type FidcClass, type Title } from '../data/fidcsData';
import PLHero from '../components/PLHero.vue';
import TitlesTable from '../components/TitlesTable.vue';
import ClassKPI from './class-detail/ClassKPI.vue';

const props = defineProps<{ fidc: Fidc; klass: FidcClass }>();
const emit = defineEmits<{ back: []; openTitle: [titleId: string] }>();

const q = ref('');
const filtered = computed(() =>
  props.klass.titulos.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const classMap = computed(() => ({
  [props.klass.id]: String(props.fidc.classes.findIndex((c) => c.id === props.klass.id) + 1),
}));

function handleOpenTitle(t: Title) {
  emit('openTitle', t.id);
}
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
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ fidc.name }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ klass.name }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Classe • {{ klass.cnpj }}
        </p>
      </div>
    </div>

    <PLHero :fidc="fidc" />

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <ClassKPI
        :icon="FileText"
        label="Valor Nominal"
        :value="brl(klass.vrNominal)"
        :tone="{ bg: 'var(--success-light)', fg: 'var(--success-base)' }"
      />
      <ClassKPI
        :icon="TrendingUp"
        label="Valor em Aberto"
        :value="brl(klass.vrAberto)"
        :tone="{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }"
      />
      <ClassKPI
        :icon="Calendar"
        label="Valor Presente"
        :value="brl(klass.vrPresente)"
        :tone="{ bg: '#EEF0FF', fg: '#4F46E5' }"
      />
      <ClassKPI
        :icon="AlertCircle"
        label="Valor Vencido"
        :value="brl(klass.vrVencido)"
        :tone="{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }"
        danger
      />
    </div>

    <div
      style="
        background: var(--surface-card);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div
          class="flex items-center justify-center"
          style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)"
        >
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Títulos da Classe
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ klass.titulos.length }} direitos creditórios vinculados
          </div>
        </div>
        <button
          aria-label="Filtros"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
        >
          <Filter :size="16" />
        </button>
      </div>

      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, lastro, cedente ou sacado..."
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
      </div>

      <TitlesTable :rows="filtered" :class-map="classMap" @open="handleOpenTitle" />
    </div>
  </div>
</template>
```

### FidcDetailScreen

```vue
<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Settings2,
  Layers,
  ArrowLeftRight,
  Users,
  Building2,
} from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import {
  brl,
  num,
  type Fidc,
  type Title,
  type Cessao,
  type Sacado,
  type GrupoEmpresarialVinculo,
  type FidcSetup,
} from '../data/fidcsData';
import TitlesTable from '../components/TitlesTable.vue';
import PLHero from '../components/PLHero.vue';
import SubKPI from './fidc-detail/SubKPI.vue';
import TabBtn from './fidc-detail/TabBtn.vue';
import ClassesTable from './fidc-detail/ClassesTable.vue';
import FidcColPanel from './fidc-detail/FidcColPanel.vue';
import CessoesTab from './fidc-detail-tabs/CessoesTab.vue';
import SacadosTab from './fidc-detail-tabs/SacadosTab.vue';
import GruposEmpresariaisTab from './fidc-detail-tabs/GruposEmpresariaisTab.vue';
import SetupTab from './fidc-detail-tabs/SetupTab.vue';
import CessaoFormModal from '../components/modals/CessaoFormModal.vue';
import SubirContratoMaeModal from '../components/modals/SubirContratoMaeModal.vue';
import EditarParametrosGrupoModal from '../components/modals/EditarParametrosGrupoModal.vue';

const props = defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{
  back: [];
  openClass: [classId: string];
  openTitle: [classId: string, titleId: string];
  createClass: [];
  openSacado: [sacadoId: string];
  openGrupo: [grupoId: string];
  updateCessoes: [cessoes: Cessao[]];
  updateSacados: [sacados: Sacado[]];
  updateGrupos: [grupos: GrupoEmpresarialVinculo[]];
  updateSetup: [setup: FidcSetup];
}>();

type Section = 'classes' | 'cessoes' | 'sacados' | 'grupos' | 'setup';
type ViewTab = 'classes' | 'titulos';

const SECTION_TABS: { key: Section; label: string; icon: Component }[] = [
  { key: 'classes', label: 'Classes', icon: Layers },
  { key: 'cessoes', label: 'Cessões', icon: ArrowLeftRight },
  { key: 'sacados', label: 'Sacados', icon: Users },
  { key: 'grupos', label: 'Grupos Empresariais', icon: Building2 },
  { key: 'setup', label: 'Setup', icon: Settings2 },
];

const openCarteira = ref(true);
const section = ref<Section>('classes');
const viewTab = ref<ViewTab>('classes');
const q = ref('');
const showColPanel = ref(false);

const cessaoModalOpen = ref(false);
const editingCessao = ref<Cessao | null>(null);

const uploadModalOpen = ref(false);
const uploadGrupo = ref<GrupoEmpresarialVinculo | null>(null);
const editParamsModalOpen = ref(false);
const editParamsGrupo = ref<GrupoEmpresarialVinculo | null>(null);

const allTitles = computed<Title[]>(() => props.fidc.classes.flatMap((c) => c.titulos));
const filteredTitles = computed(() =>
  allTitles.value.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const isMulticlasse = computed(() => props.fidc.category === 'MULTICLASSE');

const classMap = computed(() =>
  Object.fromEntries(props.fidc.classes.map((c, i) => [c.id, String(i + 1)])),
);

function handleOpenTitle(t: Title) {
  emit('openTitle', t.classId, t.id);
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
  const list = [...props.fidc.cessoes];
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) list[idx] = c;
  else list.push(c);
  emit('updateCessoes', list);
  closeCessaoModal();
}

function deleteCessao(id: string) {
  emit(
    'updateCessoes',
    props.fidc.cessoes.filter((c) => c.id !== id),
  );
}

function handleSacadoUpdate(s: Sacado) {
  emit(
    'updateSacados',
    props.fidc.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

function updateGruposList(list: GrupoEmpresarialVinculo[]) {
  emit('updateGrupos', list);
}

function handleToggleApto(id: string) {
  updateGruposList(
    props.fidc.grupos.map((g) => (g.id === id ? { ...g, apto: !g.apto } : g)),
  );
}

function openUploadModal(g: GrupoEmpresarialVinculo) {
  uploadGrupo.value = g;
  uploadModalOpen.value = true;
}

function closeUploadModal() {
  uploadModalOpen.value = false;
  uploadGrupo.value = null;
}

function saveContratoMae(payload: { date: string; fileName: string }) {
  if (!uploadGrupo.value) return;
  const dateFormatted = payload.date.includes('-')
    ? payload.date.split('-').reverse().join('/')
    : payload.date;
  updateGruposList(
    props.fidc.grupos.map((g) =>
      g.id === uploadGrupo.value!.id
        ? {
            ...g,
            masterContractDate: dateFormatted,
            masterContractUrl: `#${payload.fileName}`,
          }
        : g,
    ),
  );
  closeUploadModal();
}

function openEditParamsModal(g: GrupoEmpresarialVinculo) {
  editParamsGrupo.value = g;
  editParamsModalOpen.value = true;
}

function closeEditParamsModal() {
  editParamsModalOpen.value = false;
  editParamsGrupo.value = null;
}

function saveGrupoParams(g: GrupoEmpresarialVinculo) {
  updateGruposList(props.fidc.grupos.map((x) => (x.id === g.id ? g : x)));
  closeEditParamsModal();
}

function handleSetupUpdate(setup: FidcSetup) {
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
          {{ fidc.name }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ fidc.cnpj }} • Gestão de Carteira e Títulos
        </p>
      </div>
    </div>

    <PLHero :fidc="fidc" />

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
            Carteira do Fundo
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ num(fidc.carteiraSummaryTitles) }} títulos ativos
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

      <div v-if="openCarteira" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 20px">
        <SubKPI
          :icon="FileText"
          label="Valor Nominal"
          :value="brl(fidc.carteira.valor)"
          :tone="{ bg: 'var(--success-light)', fg: 'var(--success-base)' }"
        />
        <SubKPI
          :icon="TrendingUp"
          label="Valor em Aberto"
          :value="brl(fidc.carteira.valor)"
          :tone="{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }"
        />
        <SubKPI
          :icon="Calendar"
          label="Valor Presente"
          :value="brl(fidc.carteira.valor * 0.82)"
          :tone="{ bg: '#EEF0FF', fg: '#4F46E5' }"
        />
        <SubKPI
          :icon="AlertCircle"
          label="Valor Vencido"
          :value="brl(fidc.vencido.valor)"
          :tone="{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }"
          :badge="fidc.carteira.valor ? `${((fidc.vencido.valor / fidc.carteira.valor) * 100).toFixed(2).replace('.', ',')}%` : undefined"
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
      v-if="section === 'classes'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ viewTab === 'classes' ? 'Classes do Fundo' : 'Títulos da Carteira' }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ viewTab === 'classes' ? `${fidc.classes.length} unidades cadastradas` : `${allTitles.length} títulos na carteira` }}
          </div>
        </div>
        <button
          v-if="isMulticlasse && viewTab === 'classes'"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="emit('createClass')"
        >
          <Plus :size="14" /> NOVA CLASSE
        </button>
        <div class="flex" style="padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <TabBtn :active="viewTab === 'classes'" @click="viewTab = 'classes'">VISUALIZAR CLASSES</TabBtn>
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
          <FidcColPanel v-if="showColPanel" :tab="viewTab" @close="showColPanel = false" />
        </div>
      </div>

      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, lastro, cedente ou sacado..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <ClassesTable v-if="viewTab === 'classes'" :rows="fidc.classes" @open="emit('openClass', $event)" />
      <TitlesTable v-else :rows="filteredTitles" :class-map="classMap" @open="handleOpenTitle" />

      <div class="flex items-center justify-end" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
            Classe Ativa:
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
        :cessoes="fidc.cessoes"
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
        :sacados="fidc.sacados"
        @open="emit('openSacado', $event)"
        @update="handleSacadoUpdate"
      />
    </div>

    <div
      v-else-if="section === 'grupos'"
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <GruposEmpresariaisTab
        :grupos="fidc.grupos"
        @open="emit('openGrupo', $event)"
        @upload="openUploadModal"
        @toggle-apto="handleToggleApto"
        @edit-params="openEditParamsModal"
        @update="(g) => updateGruposList(fidc.grupos.map((x) => (x.id === g.id ? g : x)))"
      />
    </div>

    <div
      v-else
      style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <SetupTab :setup="fidc.setup" @update="handleSetupUpdate" />
    </div>

    <CessaoFormModal
      v-if="cessaoModalOpen"
      :cessao="editingCessao"
      @close="closeCessaoModal"
      @save="saveCessao"
    />
    <SubirContratoMaeModal
      v-if="uploadModalOpen"
      :initial-date="uploadGrupo?.masterContractDate?.split('/').reverse().join('-')"
      @close="closeUploadModal"
      @save="saveContratoMae"
    />
    <EditarParametrosGrupoModal
      v-if="editParamsModalOpen"
      :grupo="editParamsGrupo"
      @close="closeEditParamsModal"
      @save="saveGrupoParams"
    />
  </div>
</template>
```

### FidcListScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Landmark, Wallet, CheckCircle2, Clock } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Fidc } from '../data/fidcsData';
import FidcCard from '../components/FidcCard.vue';

interface Props {
  fidcs: Fidc[];
}

interface KpiDef {
  label: string;
  value: string;
  icon: Component;
  tone: { bg: string; fg: string };
}

const props = defineProps<Props>();
const emit = defineEmits<{ open: [id: string]; new: [] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() =>
  props.fidcs.filter(
    (f) => !q.value || f.name.toLowerCase().includes(q.value.toLowerCase()) || f.cnpj.includes(q.value),
  ),
);

const kpis: KpiDef[] = [
  { label: 'Total de Fundos', value: '3', icon: Landmark, tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { label: 'Valor Total', value: 'R$ 552,1M', icon: Wallet, tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { label: 'Títulos Ativos', value: '31.288', icon: CheckCircle2, tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
  { label: 'Pendências', value: '1,1M', icon: Clock, tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Search bar + actions -->
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
          placeholder="Pesquisar por nome do fundo ou CNPJ..."
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
          @focus="focus = true"
          @blur="focus = false"
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
        style="gap: 8px; height: 56px; padding: 0 24px; background: var(--agro-base); color: #fff; border-radius: var(--radius-xl); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -8px rgba(242,125,38,0.40)"
        @click="emit('new')"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVO FIDC
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
        <div class="flex items-center justify-center" :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }">
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

    <!-- Grid de FIDC -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <FidcCard v-for="f in filtered" :key="f.id" :fidc="f" @open="emit('open', $event)" />
    </div>
  </div>
</template>
```

### FidcRelatoriosScreen

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
import { fidcs } from '../data/fidcsData';
import {
  PORTFOLIO_REPORTS,
  SITUACAO_FUNDO_OPTS,
  mockFidcPortfolioRows,
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
const draft = reactive({ situacao: '' });
const selectedIds = ref<string[]>([]);
const applied = ref(false);

const report = computed(() => PORTFOLIO_REPORTS.find((r) => r.key === selected.value) ?? null);

const filteredFunds = computed(() =>
  fidcs.filter((f) => {
    if (draft.situacao && f.status !== draft.situacao) return false;
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
  return mockFidcPortfolioRows(selected.value, funds);
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => results.value,
  { defaultPageSize: 10 },
);

function selectReport(key: PortfolioReportKey) {
  selected.value = key;
  draft.situacao = '';
  selectedIds.value = fidcs.map((f) => f.id);
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
        FIDC's
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
          Relatórios · FIDC's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div style="margin-bottom: 18px; max-width: 320px">
        <div :style="labelStyle">Situação do fundo</div>
        <select v-model="draft.situacao" :style="inputStyle">
          <option value="">Todos</option>
          <option v-for="o in SITUACAO_FUNDO_OPTS" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>

      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
        Selecionar FIDC's
      </div>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 18px">
        <div
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allFilteredSelected" @change="toggleAllFiltered" />
          </div>
          <div>Nome</div>
          <div>CNPJ</div>
          <div>Categoria</div>
          <div>Status</div>
        </div>
        <div
          v-for="f in filteredFunds"
          :key="f.id"
          class="grid items-center"
          style="grid-template-columns: 40px 2fr 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="toggleFund(f.id)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.includes(f.id)" @change="toggleFund(f.id)" />
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ f.cnpj }}</div>
          <div style="color: var(--text-default)">{{ f.category }}</div>
          <div style="color: var(--text-muted)">{{ f.status }}</div>
        </div>
        <div v-if="filteredFunds.length === 0" style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
          Nenhum FIDC para os filtros.
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
        Selecione ao menos um FIDC e gere o relatório.
      </div>
      <template v-else>
        <div
          class="grid"
          style="grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Fundo</div><div>CNPJ</div><div>Categoria</div><div>Status</div><div>Métrica</div><div>Valor</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          style="grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.fundo }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ row.cnpj }}</div>
          <div style="color: var(--text-default)">{{ row.categoria }}</div>
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

### FidcScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import FidcListScreen from './FidcListScreen.vue';
import FidcDetailScreen from './FidcDetailScreen.vue';
import ClassDetailScreen from './ClassDetailScreen.vue';
import TitleDetailScreen from './TitleDetailScreen.vue';
import SacadoDetailScreen from './SacadoDetailScreen.vue';
import GrupoEmpresarialDetailScreen from './GrupoEmpresarialDetailScreen.vue';
import CreateClassModal from '../components/CreateClassModal.vue';
import type { NewClassData } from '../components/CreateClassModal.vue';
import CreateFidcModal from '../components/CreateFidcModal.vue';
import type { NewFidcData } from '../components/CreateFidcModal.vue';
import {
  fidcs as initialFidcs,
  defaultFidcSetup,
  type Fidc,
  type FidcClass,
  type Cessao,
  type Sacado,
  type GrupoEmpresarialVinculo,
  type FidcSetup,
} from '../data/fidcsData';

type Route =
  | { level: 'list' }
  | { level: 'fidc'; fidcId: string }
  | { level: 'class'; fidcId: string; classId: string }
  | { level: 'title'; fidcId: string; classId: string; titleId: string }
  | { level: 'sacado'; fidcId: string; sacadoId: string }
  | { level: 'grupo'; fidcId: string; grupoId: string };

function buildClassFromForm(data: NewClassData): FidcClass {
  return {
    id: `class-${Date.now()}`,
    name: data.nomeFantasia || data.identificacaoVeiculo || data.razaoSocial || 'NOVA CLASSE',
    cnpj: data.cnpjVeiculo || '—',
    status: 'EM ANDAMENTO',
    vrNominal: 0,
    vrAberto: 0,
    vrPresente: 0,
    vrVencido: 0,
    titulos: [],
  };
}

function buildFidcFromForm(data: NewFidcData): Fidc {
  const name = data.razaoSocial || data.nomeFantasia || 'NOVO FIDC';
  const category = data.tipoFundo === 'MONOCLASSE' ? 'MONOCLASSE' : 'MULTICLASSE';
  const classes =
    category === 'MONOCLASSE' && data.classData ? [buildClassFromForm(data.classData)] : [];
  return {
    id: `fidc-${Date.now()}`,
    name,
    cnpj: data.cnpj || '—',
    category,
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    vencendoHoje: 0,
    vencendoMes: 0,
    confirmacaoPct: 0,
    pl: 0,
    plRef: 'R$ 0',
    plRefAgo: 'R$ 0',
    carteiraSummaryTitles: 0,
    classes,
    cessoes: [],
    sacados: [],
    grupos: [],
    setup: defaultFidcSetup(name, data.cnpj || '—'),
  };
}

const route = ref<Route>({ level: 'list' });
const creating = ref(false);
const creatingFidc = ref(false);
const fidcList = ref<Fidc[]>(initialFidcs);

function handleCreateFidc(data: NewFidcData) {
  fidcList.value = [...fidcList.value, buildFidcFromForm(data)];
  creatingFidc.value = false;
}

function handleCreateClass(data: NewClassData) {
  if (route.value.level !== 'fidc') return;
  const fidcId = route.value.fidcId;
  const klass = buildClassFromForm(data);
  fidcList.value = fidcList.value.map((f) =>
    f.id === fidcId ? { ...f, classes: [...f.classes, klass] } : f,
  );
  creating.value = false;
}

function updateCessoes(fidcId: string, cessoes: Cessao[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, cessoes } : f));
}

function updateSacados(fidcId: string, sacados: Sacado[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, sacados } : f));
}

function updateGrupos(fidcId: string, grupos: GrupoEmpresarialVinculo[]) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, grupos } : f));
}

function updateSetup(fidcId: string, setup: FidcSetup) {
  fidcList.value = fidcList.value.map((f) => (f.id === fidcId ? { ...f, setup } : f));
}

function handleSacadoUpdate(s: Sacado) {
  const r = route.value;
  if (r.level !== 'sacado') return;
  const current = fidcList.value.find((f) => f.id === r.fidcId);
  if (!current) return;
  updateSacados(
    r.fidcId,
    current.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

const currentFidc = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return fidcList.value.find((f) => f.id === r.fidcId);
});

const currentClass = computed(() => {
  const r = route.value;
  if (r.level !== 'class' && r.level !== 'title') return undefined;
  return currentFidc.value?.classes.find((c) => c.id === r.classId);
});

const currentTitle = computed(() => {
  const r = route.value;
  if (r.level !== 'title') return undefined;
  return currentClass.value?.titulos.find((t) => t.id === r.titleId);
});

const currentSacado = computed(() => {
  const r = route.value;
  if (r.level !== 'sacado') return undefined;
  return currentFidc.value?.sacados.find((s) => s.id === r.sacadoId);
});

const currentGrupo = computed(() => {
  const r = route.value;
  if (r.level !== 'grupo') return undefined;
  return currentFidc.value?.grupos.find((g) => g.id === r.grupoId);
});
</script>

<template>
  <template v-if="route.level === 'list'">
    <FidcListScreen :fidcs="fidcList" @open="(fidcId) => (route = { level: 'fidc', fidcId })" @new="creatingFidc = true" />
    <CreateFidcModal v-if="creatingFidc" @close="creatingFidc = false" @create="handleCreateFidc" />
  </template>

  <template v-else-if="route.level === 'fidc' && currentFidc">
    <FidcDetailScreen
      :fidc="currentFidc"
      @back="route = { level: 'list' }"
      @open-class="(classId) => (route = { level: 'class', fidcId: currentFidc!.id, classId })"
      @open-title="(classId, titleId) => (route = { level: 'title', fidcId: currentFidc!.id, classId, titleId })"
      @create-class="creating = true"
      @open-sacado="(sacadoId) => (route = { level: 'sacado', fidcId: currentFidc!.id, sacadoId })"
      @open-grupo="(grupoId) => (route = { level: 'grupo', fidcId: currentFidc!.id, grupoId })"
      @update-cessoes="(cessoes) => updateCessoes(currentFidc!.id, cessoes)"
      @update-sacados="(sacados) => updateSacados(currentFidc!.id, sacados)"
      @update-grupos="(grupos) => updateGrupos(currentFidc!.id, grupos)"
      @update-setup="(setup) => updateSetup(currentFidc!.id, setup)"
    />
    <CreateClassModal v-if="creating" @close="creating = false" @create="handleCreateClass" />
  </template>

  <SacadoDetailScreen
    v-else-if="route.level === 'sacado' && currentFidc && currentSacado"
    :fidc="currentFidc"
    :sacado="currentSacado"
    @back="route = { level: 'fidc', fidcId: currentFidc.id }"
    @update="handleSacadoUpdate"
  />

  <GrupoEmpresarialDetailScreen
    v-else-if="route.level === 'grupo' && currentFidc && currentGrupo"
    :fidc="currentFidc"
    :grupo="currentGrupo"
    @back="route = { level: 'fidc', fidcId: currentFidc.id }"
  />

  <template v-else-if="route.level === 'class' && currentFidc && currentClass">
    <ClassDetailScreen
      :fidc="currentFidc"
      :klass="currentClass"
      @back="route = { level: 'fidc', fidcId: currentFidc.id }"
      @open-title="(titleId) => (route = { level: 'title', fidcId: currentFidc!.id, classId: currentClass!.id, titleId })"
    />
  </template>

  <template v-else-if="route.level === 'title' && currentFidc && currentClass && currentTitle">
    <TitleDetailScreen
      :fidc="currentFidc"
      :klass="currentClass"
      :title="currentTitle"
      @back="route = { level: 'class', fidcId: currentFidc.id, classId: currentClass.id }"
    />
  </template>
</template>
```

### FidcSimuladorScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ArrowLeft, Search, Plus, FileText, Banknote, PawPrint } from 'lucide-vue-next';
import { brl, fidcs, type Fidc } from '../data/fidcsData';
import { gruposEmpresariais } from '@/features/cra/data/craData';
import {
  MOCK_FIDC_SIMULATIONS,
  LOAN_SIMULATION_TYPES,
  BASE_DAYS_OPTS,
  simulateCprf,
  simulateLoan,
  type FidcSavedSimulation,
  type CprfPreview,
  type LoanPreview,
} from '../data/simuladorData';
import FidcCard from '../components/FidcCard.vue';
import ConfinaPromissoryModal from '../components/modals/ConfinaPromissoryModal.vue';
import StepGrid from '../components/create-class/StepGrid.vue';
import FormField from '../components/create-class/FormField.vue';
import SelectField from '../components/create-class/SelectField.vue';
import SectionGroup from '../components/create-class/SectionGroup.vue';
import SummaryItem from '../components/create-class/SummaryItem.vue';

type SubTab = 'cprf' | 'loan' | 'confina';

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'cprf', label: 'CPR-F' },
  { key: 'loan', label: 'Adiantamento/Empréstimo' },
  { key: 'confina', label: 'Termo Confina' },
];

const selected = ref<Fidc | null>(null);
const q = ref('');
const focus = ref(false);
const subTab = ref<SubTab>('cprf');
const modalOpen = ref(false);
const simulations = ref<FidcSavedSimulation[]>([...MOCK_FIDC_SIMULATIONS]);

const filtered = computed(() =>
  fidcs.filter(
    (f) =>
      !q.value ||
      f.name.toLowerCase().includes(q.value.toLowerCase()) ||
      f.cnpj.includes(q.value),
  ),
);

const vehicleName = computed(() => selected.value?.name ?? '');
const grupoOpts = gruposEmpresariais.map((g) => g.nome);

const cprf = reactive({
  valorNominal: '500000',
  vencimento: '',
  parcelas: '6',
  taxa: '1.2',
  grupo: grupoOpts[0] ?? '',
  docCedente: '',
});
const cprfPreview = ref<CprfPreview | null>(null);

const loan = reactive({
  tipoLabel: LOAN_SIMULATION_TYPES[0]?.label ?? 'Adiantamento',
  valor: '300000',
  emissao: '',
  parcelas: '4',
  baseDias: '30',
  taxa: '1.5',
  vencimento: '',
  grupo: grupoOpts[0] ?? '',
});
const loanPreview = ref<LoanPreview | null>(null);

const loanTipo = computed(
  () => LOAN_SIMULATION_TYPES.find((t) => t.label === loan.tipoLabel) ?? LOAN_SIMULATION_TYPES[0],
);
const loanRateLabel = computed(() => loanTipo.value?.rateLabel ?? 'Taxa');
const loanParcelasDisabled = computed(() => loanTipo.value?.value === '4');

const filteredSims = computed(() => {
  const typeMap: Record<SubTab, number> = { cprf: 7, loan: 3, confina: 6 };
  return simulations.value.filter((s) => s.type === typeMap[subTab.value]);
});

function openVehicle(id: string) {
  selected.value = fidcs.find((f) => f.id === id) ?? null;
  subTab.value = 'cprf';
}

function handleCprfSimulate() {
  cprfPreview.value = simulateCprf({
    requestedValue: Number(cprf.valorNominal) || 0,
    totalInstallment: Number(cprf.parcelas) || 1,
    rate: Number(cprf.taxa) || 0,
  });
}

function handleCprfSave() {
  if (!cprfPreview.value) handleCprfSimulate();
  const p = cprfPreview.value;
  if (!p) return;
  simulations.value = [
    {
      id: `sim-cprf-${Date.now()}`,
      type: 7,
      typeLabel: 'CPR-F',
      grupo: cprf.grupo || '—',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: p.valorNominal,
    },
    ...simulations.value,
  ];
}

function handleLoanSimulate() {
  loanPreview.value = simulateLoan({
    tipo: loanTipo.value?.value ?? '3',
    valor: Number(loan.valor) || 0,
    parcelas: Number(loan.parcelas) || 1,
    rate: Number(loan.taxa) || 0,
  });
}

function handleLoanSave() {
  if (!loanPreview.value) handleLoanSimulate();
  const p = loanPreview.value;
  if (!p) return;
  simulations.value = [
    {
      id: `sim-loan-${Date.now()}`,
      type: 3,
      typeLabel: 'Adiantamento/Empréstimo',
      grupo: loan.grupo || '—',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: p.valorTotal,
    },
    ...simulations.value,
  ];
}

function handleConfinaCreated() {
  simulations.value = [
    {
      id: `sim-confina-${Date.now()}`,
      type: 6,
      typeLabel: 'Termo Confina',
      grupo: 'Nova simulação',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: 1_050_000,
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
          placeholder="Pesquisar FIDC para simular..."
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
      <FidcCard v-for="f in filtered" :key="f.id" :fidc="f" @open="openVehicle" />
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
          Simulador · FIDC's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ selected.name }}
        </h2>
      </div>
    </div>

    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in SUB_TABS"
        :key="t.key"
        type="button"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: subTab === t.key ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: subTab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
        @click="subTab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <SectionGroup v-if="subTab === 'cprf'" :icon="FileText" title="Simulação CPR-F">
      <StepGrid>
        <FormField v-model="cprf.valorNominal" label="Valor nominal / solicitado" type="number" :span="4" />
        <FormField v-model="cprf.vencimento" label="Vencimento inicial" type="date" :span="4" />
        <FormField v-model="cprf.parcelas" label="Total de parcelas" type="number" :span="4" />
        <FormField v-model="cprf.taxa" label="Taxa (% a.m.)" type="number" :span="3" />
        <SelectField v-model="cprf.grupo" label="Grupo empresarial" :options="grupoOpts" :span="5" />
        <FormField v-model="cprf.docCedente" label="Doc. cedente" placeholder="CPF/CNPJ" :span="4" />
      </StepGrid>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; color: var(--text-default)"
          @click="handleCprfSimulate"
        >
          SIMULAR
        </button>
        <button
          type="button"
          class="flex items-center"
          style="height: 42px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleCprfSave"
        >
          SALVAR SIMULAÇÃO
        </button>
      </div>
      <div v-if="cprfPreview" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px">
        <SummaryItem label="Valor nominal" :value="brl(cprfPreview.valorNominal)" />
        <SummaryItem label="Parcelas" :value="String(cprfPreview.parcelas)" />
        <SummaryItem label="Valor parcela" :value="brl(cprfPreview.valorParcela)" />
        <SummaryItem label="Taxa" :value="`${cprfPreview.taxa}% a.m.`" />
      </div>
    </SectionGroup>

    <SectionGroup v-else-if="subTab === 'loan'" :icon="Banknote" title="Adiantamento / Empréstimo">
      <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0 0 16px; line-height: 1.5">
        Análogo mais próximo de “Agrovita” no legado (template de geração de título).
      </p>
      <StepGrid>
        <SelectField
          v-model="loan.tipoLabel"
          label="Tipo de simulação"
          :options="LOAN_SIMULATION_TYPES.map((t) => t.label)"
          :span="6"
        />
        <FormField v-model="loan.valor" label="Valor solicitado" type="number" :span="6" />
        <FormField v-model="loan.emissao" label="Data da emissão" type="date" :span="4" />
        <FormField v-model="loan.parcelas" label="Nº de parcelas" type="number" :span="4" :disabled="loanParcelasDisabled" />
        <SelectField v-model="loan.baseDias" label="Dias p/ base de cálculo" :options="[...BASE_DAYS_OPTS]" :span="4" />
        <FormField v-model="loan.taxa" :label="loanRateLabel" type="number" :span="4" />
        <FormField v-model="loan.vencimento" label="Vencimento inicial" type="date" :span="4" />
        <SelectField v-model="loan.grupo" label="Grupo / cedente" :options="grupoOpts" :span="4" />
      </StepGrid>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; color: var(--text-default)"
          @click="handleLoanSimulate"
        >
          SIMULAR
        </button>
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleLoanSave"
        >
          SALVAR SIMULAÇÃO
        </button>
      </div>
      <div v-if="loanPreview" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px">
        <SummaryItem label="Solicitado" :value="brl(loanPreview.valorSolicitado)" />
        <SummaryItem label="Valor total" :value="brl(loanPreview.valorTotal)" />
        <SummaryItem label="Parcelas" :value="String(loanPreview.parcelas)" />
        <SummaryItem label="Valor parcela" :value="brl(loanPreview.valorParcela)" />
      </div>
    </SectionGroup>

    <SectionGroup v-else :icon="PawPrint" title="Nota promissória de gado">
      <div class="flex items-start justify-between" style="gap: 16px">
        <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0; max-width: 560px; line-height: 1.5">
          Wizard de 5 etapas no padrão de Nova Classe: operação, promissória, animais, notas fiscais e parceiro.
        </p>
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; height: 42px; padding: 0 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; flex-shrink: 0; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="modalOpen = true"
        >
          <Plus :size="15" /> GERAR TÍTULO
        </button>
      </div>
    </SectionGroup>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="padding: 14px 20px; border-bottom: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Simulações salvas
      </div>
      <div
        class="grid"
        style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
      >
        <div>Tipo</div><div>Grupo</div><div>Criado em</div><div>Valor</div>
      </div>
      <div
        v-for="s in filteredSims"
        :key="s.id"
        class="grid items-center"
        style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ s.typeLabel }}</div>
        <div style="color: var(--text-default)">{{ s.grupo }}</div>
        <div style="color: var(--text-muted)">{{ s.createdAt }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(s.valorNominal) }}</div>
      </div>
      <div v-if="filteredSims.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhuma simulação neste tipo.
      </div>
    </div>

    <ConfinaPromissoryModal
      v-if="modalOpen"
      :vehicle-name="vehicleName"
      @close="modalOpen = false"
      @created="handleConfinaCreated"
    />
  </div>
</template>
```

### GrupoEmpresarialDetailScreen

```vue
<script setup lang="ts">
import { ref, type Component } from 'vue';
import {
  ArrowLeft,
  Users,
  Link2,
  FileText,
  Landmark,
  TrendingUp,
  Shield,
  History,
  Wallet,
  AlertTriangle,
  Calendar,
} from 'lucide-vue-next';
import { brl, type Fidc, type GrupoEmpresarialVinculo } from '../data/fidcsData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import CedentesTab from './grupo-detail/CedentesTab.vue';
import PartesRelacionadasTab from './grupo-detail/PartesRelacionadasTab.vue';
import DocumentosTab from './grupo-detail/DocumentosTab.vue';
import ContaBancariaTab from './grupo-detail/ContaBancariaTab.vue';
import FaturamentoTab from './grupo-detail/FaturamentoTab.vue';
import GarantiasTab from './grupo-detail/GarantiasTab.vue';
import HistoricoTab from './grupo-detail/HistoricoTab.vue';

defineProps<{ fidc: Fidc; grupo: GrupoEmpresarialVinculo }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'cedentes' | 'partes' | 'documentos' | 'conta' | 'faturamento' | 'garantias' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'partes', label: 'Partes Relacionadas', icon: Link2 },
  { key: 'documentos', label: 'Documentos', icon: FileText },
  { key: 'conta', label: 'Conta Bancária', icon: Landmark },
  { key: 'faturamento', label: 'Faturamento', icon: TrendingUp },
  { key: 'garantias', label: 'Garantias', icon: Shield },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('cedentes');
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
          FIDC · Grupo Empresarial
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ grupo.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ fidc.name }} · {{ grupo.statusOperacao }} · {{ grupo.apto ? 'Apto' : 'Inapto' }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <Wallet :size="18" style="color: var(--gci-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Limite</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.limite) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <AlertTriangle :size="18" style="color: var(--warning-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Risco tomado</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.riscoTomado) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <TrendingUp :size="18" style="color: var(--success-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Faturamento</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.faturamento) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <Calendar :size="18" style="color: var(--text-muted)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Data cadastro</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold)">{{ grupo.dataCadastro }}</div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <CedentesTab v-if="tab === 'cedentes'" :cedentes="grupo.cedentes" />
    <PartesRelacionadasTab v-else-if="tab === 'partes'" :partes="grupo.partesRelacionadas" />
    <DocumentosTab v-else-if="tab === 'documentos'" :documentos="grupo.documentos" />
    <ContaBancariaTab v-else-if="tab === 'conta'" :contas="grupo.contas" />
    <FaturamentoTab v-else-if="tab === 'faturamento'" :faturamentos="grupo.faturamentos" />
    <GarantiasTab v-else-if="tab === 'garantias'" :garantias="grupo.garantias" />
    <HistoricoTab v-else :eventos="grupo.historico" />
  </div>
</template>
```

### SacadoDetailScreen

```vue
<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import { ArrowLeft, FileText, User, History } from 'lucide-vue-next';
import type { Fidc, Sacado } from '../data/fidcsData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TitulosSubTab from './sacado-detail/TitulosSubTab.vue';
import DadosTab from './sacado-detail/DadosTab.vue';
import HistoricoTab from './sacado-detail/HistoricoTab.vue';

const props = defineProps<{ fidc: Fidc; sacado: Sacado }>();
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
          FIDC · Sacado
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ localSacado.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ localSacado.documento }} · {{ fidc.name }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <TitulosSubTab v-if="tab === 'titulos'" :fidc="fidc" :sacado="localSacado" />
    <DadosTab v-else-if="tab === 'dados'" :sacado="localSacado" @update="onUpdate" />
    <HistoricoTab v-else :eventos="localSacado.historico" />
  </div>
</template>
```

### TitleDetailScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  CreditCard,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  BadgeCheck,
  ArrowLeftRight,
} from 'lucide-vue-next';
import { brl, detalhePagamentos, type Fidc, type FidcClass, type Title, type TitleStatus } from '../data/fidcsData';
import PagamentosTab from './detail-tabs/PagamentosTab.vue';
import CopyButton from './title-detail/CopyButton.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './title-detail/DetailsTab.vue';
import AnexosTab from './title-detail/AnexosTab.vue';
import AccrualTab from './title-detail/AccrualTab.vue';
import ConfirmacoesTab from './title-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './title-detail/MovimentacoesTab.vue';
import MovimentoTab from './title-detail/MovimentoTab.vue';

const props = defineProps<{ fidc: Fidc; klass: FidcClass; title: Title }>();
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

const statusTone: Record<TitleStatus, { bg: string; fg: string; iconBg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', iconBg: 'var(--success-base)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', iconBg: 'var(--warning-base)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', iconBg: 'var(--danger-base)' },
};

const tab = ref<Tab>('detalhes');
const det = ref(detalhePagamentos(props.title));
const tone = computed(() => statusTone[props.title.status]);
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
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ fidc.name }} • {{ klass.name }}
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          Título #{{ title.numero }}
          <CopyButton :value="`Título #${title.numero}`" />
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Auditoria e ciclo de vida do direito creditório
        </p>
      </div>
      <span
        class="flex items-center"
        :style="{
          gap: '8px',
          fontSize: '11px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '8px 14px',
          background: tone.bg,
          color: tone.fg,
          borderRadius: '9999px',
        }"
      >
        <CheckCircle2 v-if="title.status === 'CONFIRMADO'" :size="14" />
        <Clock v-else :size="14" />
        {{ title.status }}
      </span>
    </div>

    <!-- Painel valor -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8,60,74,0.40);
      "
    >
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(title.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Lastro: {{ title.lastro.replace('_', '-') }} • Emissão {{ title.emissao }} • Vencimento
          {{ title.vencimento }}
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

    <div
      style="
        background: var(--surface-card);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <DetailsTab v-if="tab === 'detalhes'" :title="title" :klass="klass" />
      <AnexosTab v-else-if="tab === 'anexos'" :title="title" />
      <AccrualTab v-else-if="tab === 'accrual'" :title="title" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" :title="title" v-model:det="det" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :title="title" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :title="title" />
      <MovimentoTab v-else-if="tab === 'historico'" :title="title" />
    </div>
  </div>
</template>
```

## Screens / class-detail

### ClassKPI

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  danger?: boolean;
}>();
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-xl);
      padding: 18px;
    "
  >
    <div class="flex items-center" style="gap: 12px; margin-bottom: 12px">
      <div
        class="flex items-center justify-center"
        :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: tone.bg, color: tone.fg }"
      >
        <component :is="icon" :size="18" :stroke-width="1.75" />
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        {{ label }}
      </div>
    </div>
    <div
      :style="{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--weight-bold)',
        color: danger ? 'var(--danger-base)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }"
    >
      {{ value }}
    </div>
  </div>
</template>
```

## Screens / detail-tabs

### PagamentosTab

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Wallet, CalendarClock, ChevronDown, ChevronUp, Undo2, Calculator, Pencil } from 'lucide-vue-next';
import {
  brl, TIPO_PAGAMENTO_OPTS,
  type Title, type PagamentoTitulo, type StatusParcela, type ParcelaCronograma, type DetalhePagamentos,
} from '../../data/fidcsData';
import SimularValorizacaoModal from '../../components/modals/SimularValorizacaoModal.vue';
import EditarParcelasModal from '../../components/modals/EditarParcelasModal.vue';
import EstornoPagamentoModal from '../../components/modals/EstornoPagamentoModal.vue';
import HeaderStat from './pagamentos/HeaderStat.vue';
import Section from './pagamentos/Section.vue';
import Field from './pagamentos/Field.vue';
import EmptyState from './pagamentos/EmptyState.vue';
import GhostButton from './pagamentos/GhostButton.vue';
import FormField from './pagamentos/FormField.vue';
import SelectField from './pagamentos/SelectField.vue';
import ToggleRow from './pagamentos/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

defineProps<{ title: Title }>();
const det = defineModel<DetalhePagamentos>('det', { required: true });

const STATUS_TONE: Record<StatusParcela, { bg: string; fg: string; label: string }> = {
  PAGO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', label: 'Pago' },
  PAGO_PARCIAL_VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', label: 'Pago Parcial (Vencido)' },
  DESCONHECIDO: { bg: 'var(--neutral-100)', fg: 'var(--text-muted)', label: 'Desconhecido' },
};

const emptyForm = {
  valorAmortizacao: '', dataPagamento: '', tipoPagamento: '',
  jurosMoratorio: '', multa: '', jurosRemuneratorio: '',
  transferenciaParcial: false, observacao: '',
};

const form = ref({ ...emptyForm });
const showSimular = ref(false);
const showEditarParcelas = ref(false);
const estornoAlvo = ref<number | null>(null);
const configOpen = ref(false);

const totalPago = computed(() =>
  det.value.pagamentos.filter((p) => !p.estornado).reduce((acc, p) => acc + p.valorAmortizacao, 0),
);

const {
  page: pagamentosPage,
  pageSize: pagamentosPageSize,
  total: pagamentosTotal,
  pageItems: pagamentosPageItems,
  setPage: setPagamentosPage,
  setPageSize: setPagamentosPageSize,
} = useTablePagination(() => det.value.pagamentos, { defaultPageSize: 5 });

const {
  page: cronogramaPage,
  pageSize: cronogramaPageSize,
  total: cronogramaTotal,
  pageItems: cronogramaPageItems,
  setPage: setCronogramaPage,
  setPageSize: setCronogramaPageSize,
} = useTablePagination(() => det.value.cronograma, { defaultPageSize: 5 });

const pagamentosStartIndex = computed(() => (pagamentosPage.value - 1) * pagamentosPageSize.value);

const canSalvar = computed(
  () => form.value.valorAmortizacao.trim() !== '' && form.value.dataPagamento.trim() !== '' && form.value.tipoPagamento.trim() !== '',
);

function handleSalvar() {
  if (!canSalvar.value) return;
  const novo: PagamentoTitulo = {
    data: form.value.dataPagamento,
    valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
    tipoPagamento: form.value.tipoPagamento as PagamentoTitulo['tipoPagamento'],
    jurosRemuneratorio: Number(form.value.jurosRemuneratorio) || 0,
    jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
    multa: Number(form.value.multa) || 0,
    desconto: 0,
    observacao: form.value.observacao || undefined,
  };
  det.value = { ...det.value, pagamentos: [novo, ...det.value.pagamentos] };
  form.value = { ...emptyForm };
}

function handleUpdateCronograma(cronograma: ParcelaCronograma[]) {
  det.value = { ...det.value, cronograma };
  showEditarParcelas.value = false;
}

function handleConfirmEstorno(justificativa: string) {
  if (estornoAlvo.value === null) return;
  const idx = estornoAlvo.value;
  det.value = {
    ...det.value,
    pagamentos: det.value.pagamentos.map((p, i) => (i === idx ? { ...p, estornado: true, justificativaEstorno: justificativa } : p)),
  };
  estornoAlvo.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <!-- Header context -->
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <HeaderStat label="Valor em aberto" :value="brl(Math.max(title.vrNominal - totalPago, 0))" />
      <HeaderStat label="Juros remuneratórios em aberto" :value="brl(det.jurosRemuneratorioAberto)" />
    </div>

    <!-- Registrar Pagamento — sempre visível (mesmo padrão do compositor da Ata de Deliberação) -->
    <Section title="Registrar Pagamento">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <FormField label="Valor de amortização" placeholder="R$ 0,00" v-model="form.valorAmortizacao" />
        <FormField label="Data de pagamento" placeholder="dd/mm/aaaa" v-model="form.dataPagamento" />
        <SelectField label="Tipo de pagamento" :options="TIPO_PAGAMENTO_OPTS" placeholder="Selecione" v-model="form.tipoPagamento" />
        <FormField label="Juros moratório" placeholder="R$ 0,00" v-model="form.jurosMoratorio" />
        <FormField label="Multa" placeholder="R$ 0,00" v-model="form.multa" />
        <FormField label="Juros remuneratório" placeholder="R$ 0,00" v-model="form.jurosRemuneratorio" />
        <div style="grid-column: span 2; display: flex; align-items: flex-end">
          <ToggleRow label="Transferência parcial" :on="form.transferenciaParcial" @toggle="form.transferenciaParcial = !form.transferenciaParcial" />
        </div>
      </div>
      <div style="margin-top: 14px">
        <FormField label="Observação" placeholder="—" v-model="form.observacao" />
      </div>
      <div class="flex items-center justify-end" style="margin-top: 16px">
        <button
          :disabled="!canSalvar"
          :style="{
            height: '42px', padding: '0 24px', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: canSalvar ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
            background: canSalvar ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSalvar ? '#fff' : 'var(--text-disabled)',
            transition: 'background var(--duration-base)',
          }"
          @click="handleSalvar"
        >
          SALVAR
        </button>
      </div>
    </Section>

    <!-- Histórico de Pagamentos -->
    <Section title="Histórico de Pagamentos">
      <EmptyState v-if="det.pagamentos.length === 0" :icon="Wallet" title="Nenhum pagamento registrado" hint="Use o formulário acima para registrar baixas manuais deste título." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Val. Amortização</div><div>Tipo pagamento</div><div>Val. Juros Rem.</div><div>Val. Juros Mor.</div><div>Val. Multa</div><div>Val. Desconto</div><div style="text-align: right">Estornar</div>
        </div>
        <div
          v-for="(p, i) in pagamentosPageItems"
          :key="pagamentosStartIndex + i"
          class="grid items-center"
          :style="{
            gridTemplateColumns: '0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr', padding: '12px 16px',
            borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)',
            opacity: p.estornado ? 0.5 : 1,
          }"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.data }}</div>
          <div :style="{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', textDecoration: p.estornado ? 'line-through' : 'none' }">{{ brl(p.valorAmortizacao) }}</div>
          <div style="color: var(--text-default)">{{ p.tipoPagamento }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.jurosRemuneratorio) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.jurosMoratorio) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.multa) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(p.desconto) }}</div>
          <div class="flex justify-end">
            <button
              aria-label="Estornar pagamento"
              :title="p.estornado ? 'Pagamento já estornado' : 'Estornar pagamento'"
              :disabled="p.estornado"
              class="flex items-center justify-center"
              :style="{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: p.estornado ? 'not-allowed' : 'pointer', color: p.estornado ? 'var(--text-disabled)' : 'var(--action-danger-text-only)' }"
              @click="estornoAlvo = pagamentosStartIndex + i"
            >
              <Undo2 :size="14" />
            </button>
          </div>
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

    <!-- Configuração do Título — somente leitura -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <button
        class="flex items-center justify-between"
        style="width: 100%; padding: 14px 18px; background: var(--surface-sunken); border: none; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
        @click="configOpen = !configOpen"
      >
        Configuração do Título — {{ det.configuracao.tipoCalculo }}
        <ChevronUp v-if="configOpen" :size="16" />
        <ChevronDown v-else :size="16" />
      </button>
      <div v-if="configOpen" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px">
        <Field label="Emissão">{{ title.emissao }}</Field>
        <Field label="Valor Emissão">{{ brl(det.configuracao.valorEmissao) }}</Field>
        <Field label="Vencimento final">{{ det.configuracao.vencimentoFinal }}</Field>
        <Field label="Taxa">{{ det.configuracao.taxa }}</Field>
        <Field label="Frequência da taxa">{{ det.configuracao.frequenciaTaxa }}</Field>
        <Field label="Tipo de capitalização">{{ det.configuracao.tipoCapitalizacao }}</Field>
        <Field label="Base de dias para cálculo">{{ det.configuracao.baseDias }}</Field>
        <Field label="Fluxo de amortização">{{ det.configuracao.fluxoAmortizacao }}</Field>
        <Field label="Fluxo de juros">{{ det.configuracao.fluxoJuros }}</Field>
      </div>
    </div>

    <!-- Cronograma de Pagamentos -->
    <Section title="Cronograma de Pagamentos">
      <template #action>
        <div class="flex items-center" style="gap: 10px">
          <GhostButton :icon="Calculator" @click="showSimular = true">Simular valorização</GhostButton>
          <GhostButton :icon="Pencil" @click="showEditarParcelas = true">Editar parcelas</GhostButton>
        </div>
      </template>
      <EmptyState v-if="det.cronograma.length === 0" :icon="CalendarClock" title="Nenhum pagamento esperado encontrado" hint="O cronograma será exibido aqui assim que houver parcelas programadas para este título." />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.3fr 1.2fr 1.2fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
          <div>Vencimento</div><div>Status</div><div>Total Esperado (PMT)</div><div style="text-align: right">Em Aberto</div>
        </div>
        <div
          v-for="(c, i) in cronogramaPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.3fr 1.2fr 1.2fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.vencimento }}</div>
          <div>
            <span :style="{ fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '9999px', background: STATUS_TONE[c.status].bg, color: STATUS_TONE[c.status].fg, textTransform: 'uppercase' }">{{ STATUS_TONE[c.status].label }}</span>
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(c.totalEsperado) }}</div>
          <div :style="{ textAlign: 'right', fontWeight: 'var(--weight-bold)', color: c.emAberto > 0 ? 'var(--warning-dark)' : 'var(--success-dark)', fontVariantNumeric: 'tabular-nums' }">{{ brl(c.emAberto) }}</div>
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

    <SimularValorizacaoModal v-if="showSimular" :title="title" :cronograma="det.cronograma" @close="showSimular = false" />

    <EditarParcelasModal
      v-if="showEditarParcelas"
      :cronograma="det.cronograma"
      @close="showEditarParcelas = false"
      @update="handleUpdateCronograma"
    />

    <EstornoPagamentoModal
      v-if="estornoAlvo !== null"
      :pagamento="det.pagamentos[estornoAlvo]"
      @close="estornoAlvo = null"
      @confirm="handleConfirmEstorno"
    />
  </div>
</template>
```

## Screens / detail-tabs / pagamentos

### EmptyState

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; title: string; hint?: string }>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)"
  >
    <component :is="icon" :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">{{ title }}</div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">{{ hint }}</div>
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

### FieldLabel

```vue
<template>
  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
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
    style="gap: 8px; height: 38px; padding: 0 16px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
    @click="emit('click')"
  >
    <component :is="icon" :size="15" /><slot />
  </button>
</template>
```

### HeaderStat

```vue
<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div style="text-align: right">
    <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ label }}</div>
    <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ value }}</div>
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
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase">{{ title }}</div>
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

defineProps<{ label?: string; options: string[]; placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <div>
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
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
      width: '100%',
      padding: '10px 16px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('toggle')"
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ label }}: {{ on ? 'Sim' : 'Não' }}</span>
    <div :style="{ position: 'relative', width: '40px', height: '22px', borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
      <span :style="{ position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
    </div>
  </div>
</template>
```

## Screens / fidc-detail

### ClassesTable

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { brl, type FidcClass } from '../../data/fidcsData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ rows: FidcClass[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const rowHover = ref<string | null>(null);
</script>

<template>
  <div
    v-if="!rows.length"
    style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
  >
    Nenhuma classe cadastrada para este fundo.
  </div>
  <div v-else>
    <div
      class="grid"
      style="
        grid-template-columns: 2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr;
        padding: 14px 20px;
        background: var(--surface-sunken);
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.14em;
        color: var(--text-muted);
        text-transform: uppercase;
      "
    >
      <div>Nome da Unidade</div>
      <div>Status</div>
      <div>VR. Nominal</div>
      <div>VR. Aberto</div>
      <div>VR. Presente</div>
      <div style="text-align: right">VR. Vencido</div>
    </div>
    <div
      v-for="r in pageItems"
      :key="r.id"
      class="grid items-center"
      :style="{
        gridTemplateColumns: '2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr',
        padding: '18px 20px',
        borderTop: '1px solid var(--border-default)',
        borderLeft: '3px solid var(--gci-base)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
        background: rowHover === r.id ? 'var(--surface-sunken)' : 'transparent',
      }"
      @click="emit('open', r.id)"
      @mouseenter="rowHover = r.id"
      @mouseleave="rowHover = null"
    >
      <div class="flex items-center" style="gap: 12px">
        <div
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            background: var(--surface-sunken);
            color: var(--gci-base);
            font-size: var(--text-xs);
            font-weight: var(--weight-bold);
          "
        >
          T
        </div>
        <div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-size: var(--text-sm)">
            {{ r.name }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ r.cnpj }}
          </div>
        </div>
      </div>
      <div>
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            padding: 5px 10px;
            border-radius: 9999px;
            background: var(--success-light);
            color: var(--success-dark);
          "
        >
          EM ANDAMENTO
        </span>
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrNominal) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrAberto) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ brl(r.vrPresente) }}
      </div>
      <div style="font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums; text-align: right">
        {{ brl(r.vrVencido) }}
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
```

### FidcColPanel

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';

const props = defineProps<{ tab: 'classes' | 'titulos' }>();
const emit = defineEmits<{ close: [] }>();

const FIDC_CLASS_COLS = ['Nome da Unidade', 'Status', 'VR. Nominal', 'VR. Aberto', 'VR. Presente', 'VR. Vencido'];
const FIDC_TIT_COLS = ['Classe', 'Nº Título', 'Lastro', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'];

const cols = props.tab === 'classes' ? FIDC_CLASS_COLS : FIDC_TIT_COLS;
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

### SubKPI

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  badge?: string;
}>();
</script>

<template>
  <div
    class="flex items-center"
    :style="{
      gap: '14px',
      padding: '14px',
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
    }"
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-lg)',
        background: tone.bg,
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="icon" :size="18" :stroke-width="1.75" />
    </div>
    <div style="flex: 1; min-width: 0">
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
        {{ label }}
      </div>
      <div class="flex items-center" style="gap: 8px">
        <span
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ value }}
        </span>
        <span
          v-if="badge"
          style="
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            padding: 3px 7px;
            border-radius: 9999px;
            background: var(--danger-base);
            color: #fff;
          "
        >
          {{ badge }}
        </span>
      </div>
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

## Screens / fidc-detail-tabs

### CessoesTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  CESSAO_TIPOS,
  ROUND_STATUSES,
  type Cessao,
  type RoundStatus,
} from '../../data/fidcsData';

const props = defineProps<{ cessoes: Cessao[] }>();
const emit = defineEmits<{
  create: [];
  edit: [Cessao];
  delete: [id: string];
  update: [Cessao];
}>();

const filterNome = ref('');
const filterData = ref('');
const filterStatus = ref('');
const filterTipo = ref('');
const filterCedente = ref('');

const openMenuId = ref<string | null>(null);
const linkDraft = ref<Record<string, string>>({});

const filtered = computed(() =>
  props.cessoes.filter((c) => {
    if (filterNome.value && !c.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterData.value && !c.data.includes(filterData.value)) return false;
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

function linkValue(c: Cessao) {
  return linkDraft.value[c.id] ?? c.linkAssinatura ?? '';
}

function onLinkInput(id: string, v: string) {
  linkDraft.value = { ...linkDraft.value, [id]: v };
}

function onLinkBlur(c: Cessao) {
  const next = linkDraft.value[c.id] ?? c.linkAssinatura ?? '';
  if (next === (c.linkAssinatura ?? '')) return;
  emit('update', { ...c, linkAssinatura: next });
  const { [c.id]: _, ...rest } = linkDraft.value;
  linkDraft.value = rest;
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
        <input v-model="filterData" placeholder="dd/mm/aaaa" :style="filterInputStyle" @input="setPage(1)" />
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
    <div v-else style="overflow-x: auto">
      <div style="min-width: 1400px">
        <div
          class="grid items-center"
          style="
            grid-template-columns: 1.2fr 0.85fr 1fr 0.85fr 0.75fr 0.9fr 0.75fr 0.85fr 0.85fr 0.65fr 1.1fr 0.5fr;
            padding: 14px 20px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Nome</div>
          <div>Data de Cessão</div>
          <div>Tipo</div>
          <div>Valor Aberto</div>
          <div>Status</div>
          <div>Grupo Empresarial</div>
          <div>Aprovação da taxa</div>
          <div>Valor Presente</div>
          <div>Valor Total</div>
          <div>Taxa de Desconto</div>
          <div>Link assinatura</div>
          <div style="text-align: right">Ações</div>
        </div>
        <div
          v-for="r in pageItems"
          :key="r.id"
          class="grid items-center"
          style="
            grid-template-columns: 1.2fr 0.85fr 1fr 0.85fr 0.75fr 0.9fr 0.75fr 0.85fr 0.85fr 0.65fr 1.1fr 0.5fr;
            padding: 14px 20px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
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
          <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ r.grupoEmpresarial ?? '—' }}</div>
          <div>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                padding: '4px 8px',
                borderRadius: '9999px',
                background: r.aprovacaoTaxa ? 'var(--success-light)' : 'var(--status-neutral-bg)',
                color: r.aprovacaoTaxa ? 'var(--success-dark)' : 'var(--status-neutral-text)',
              }"
            >
              {{ r.aprovacaoTaxa ? 'Aprovada' : 'Pendente' }}
            </span>
          </div>
          <div style="font-variant-numeric: tabular-nums">{{ r.valorPresente != null ? brl(r.valorPresente) : '—' }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ r.valorTotal != null ? brl(r.valorTotal) : '—' }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ r.taxaDesconto != null ? `${r.taxaDesconto}%` : '—' }}</div>
          <div @click.stop>
            <input
              :value="linkValue(r)"
              placeholder="https://..."
              style="width: 100%; height: 34px; padding: 0 8px; border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--text-xs)"
              @input="onLinkInput(r.id, ($event.target as HTMLInputElement).value)"
              @blur="onLinkBlur(r)"
            />
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
                @click="emit('edit', r); closeMenu()"
              >
                <Pencil :size="14" /> Editar
              </button>
              <button
                type="button"
                class="flex items-center"
                style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--danger-base); width: 100%; text-align: left"
                @click="emit('delete', r.id); closeMenu()"
              >
                <Trash2 :size="14" /> Excluir
              </button>
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
  </div>
</template>
```

### GruposEmpresariaisTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { MoreVertical, Upload, Eye, FileText, SlidersHorizontal } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  GRUPO_STATUS_OPERACAO,
  type GrupoEmpresarialVinculo,
  type GrupoStatusOperacao,
} from '../../data/fidcsData';

const props = defineProps<{ grupos: GrupoEmpresarialVinculo[] }>();
const emit = defineEmits<{
  open: [id: string];
  upload: [grupo: GrupoEmpresarialVinculo];
  toggleApto: [id: string];
  editParams: [grupo: GrupoEmpresarialVinculo];
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

const COLS = '1.2fr 1fr 0.75fr 0.85fr 0.55fr 0.55fr 0.55fr 0.45fr';

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

function onEditParams(g: GrupoEmpresarialVinculo) {
  closeMenu();
  emit('editParams', g);
}
</script>

<template>
  <div @click="closeMenu">
    <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Grupos Empresariais</div>
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
    <div v-else style="overflow-x: auto">
      <div style="min-width: 1100px">
        <div
          class="grid"
          :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
        >
          <div>Nome</div>
          <div>Status de Operação</div>
          <div>Apto/Inapto</div>
          <div>Limite</div>
          <div>Juros</div>
          <div>Desconto</div>
          <div>Contrato Mãe</div>
          <div style="text-align: right">Ações</div>
        </div>
        <div
          v-for="r in pageItems"
          :key="r.id"
          class="grid items-center"
          :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer' }"
          @click="emit('open', r.id)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
          <div>
            <span :style="{ fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', padding: '4px 8px', borderRadius: '9999px', background: statusStyle(r.statusOperacao).bg, color: statusStyle(r.statusOperacao).fg }">
              {{ r.statusOperacao }}
            </span>
          </div>
          <div>
            <button
              type="button"
              :style="{ fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: r.apto ? 'var(--status-success-bg)' : 'var(--surface-sunken)', color: r.apto ? 'var(--status-success-text)' : 'var(--text-muted)' }"
              @click="onToggleApto(r, $event)"
            >
              {{ r.apto ? 'Apto' : 'Inapto' }}
            </button>
          </div>
          <div style="font-variant-numeric: tabular-nums">{{ brl(r.limite) }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ r.juros != null ? `${r.juros}%` : '—' }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ r.desconto != null ? `${r.desconto}%` : '—' }}</div>
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
              style="position: absolute; top: 40px; right: 0; z-index: 40; min-width: 200px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
              @click.stop
            >
              <button type="button" class="flex items-center" style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left" @click="onUpload(r)">
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
              <button type="button" class="flex items-center" style="gap: 8px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; text-align: left" @click="onEditParams(r)">
                <SlidersHorizontal :size="14" /> Editar parâmetros
              </button>
            </div>
          </div>
        </div>
      </div>
      <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
    </div>
  </div>
</template>
```

### SacadosTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { type Sacado } from '../../data/fidcsData';

const props = defineProps<{ sacados: Sacado[] }>();
const emit = defineEmits<{
  open: [id: string];
  update: [Sacado];
}>();

const filterDocumento = ref('');
const filterNome = ref('');
const filterTipo = ref('');

const filtered = computed(() =>
  props.sacados.filter((s) => {
    if (filterDocumento.value && !s.documento.includes(filterDocumento.value)) return false;
    if (filterNome.value && !s.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterTipo.value && !s.tipo.toLowerCase().includes(filterTipo.value.toLowerCase())) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS = '1.1fr 1.35fr 0.75fr 0.95fr 0.7fr 0.9fr 1.1fr';

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

function onEspecialChange(s: Sacado, checked: boolean) {
  if (checked === s.especial) return;
  emit('update', { ...s, especial: checked });
}

function formatLimiteInput(n: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n);
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

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
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
        <div>Tipo</div>
        <div>Limite</div>
        <div style="text-align: center">Especial</div>
        <div>Parte relacionada</div>
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
          <Checkbox :checked="r.especial" @change="onEspecialChange(r, !r.especial)" />
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
import { Info, Settings2, FileType, Wallet, Receipt, Target, Save } from 'lucide-vue-next';
import type { FidcSetup } from '../../data/fidcsData';
import Checkbox from '@/components/ui/Checkbox.vue';
import SectionGroup from '../../components/create-class/SectionGroup.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';
import FormField from '../../components/create-class/FormField.vue';
import SelectField from '../../components/create-class/SelectField.vue';
import ToggleRow from '../../components/modals/ToggleRow.vue';

const props = defineProps<{ setup: FidcSetup }>();
const emit = defineEmits<{ update: [FidcSetup] }>();

const SUB_TABS = ['Informações', 'Configurações', 'Tipos de título', 'Carteira', 'Cobrança', 'Elegibilidade'] as const;
type SubTab = (typeof SUB_TABS)[number];

function cloneSetup(s: FidcSetup): FidcSetup {
  return JSON.parse(JSON.stringify(toRaw(s))) as FidcSetup;
}

const subTab = ref<SubTab>('Informações');
const local = ref<FidcSetup>(cloneSetup(props.setup));
const saved = ref(false);

watch(
  () => props.setup,
  (s) => {
    local.value = cloneSetup(s);
  },
  { deep: true },
);

function save() {
  emit('update', cloneSetup(local.value));
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 2000);
}

function toggleBondType(id: string) {
  local.value = {
    ...local.value,
    bondTypes: local.value.bondTypes.map((b) => (b.id === id ? { ...b, ativo: !b.ativo } : b)),
  };
}

function togglePosse() {
  local.value = { ...local.value, posseDocumentos: !local.value.posseDocumentos };
}

function toggleVencimentoFimSemana() {
  local.value = { ...local.value, vencimentoFimSemana: !local.value.vencimentoFimSemana };
}
</script>

<template>
  <div>
    <div style="padding: 20px 20px 0; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Setup da Operação</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; margin-bottom: 24px">
        Configurações fund-scoped do FIDC
      </div>
    </div>

    <div style="padding: 16px 20px 0">
      <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
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
    </div>

    <div style="padding: 20px">
      <SectionGroup v-if="subTab === 'Informações'" title="Informações gerais" :icon="Info">
        <StepGrid>
          <FormField v-model="local.cnpj" label="CNPJ" :span="4" />
          <FormField v-model="local.razaoSocial" label="Razão social" :span="8" />
          <FormField v-model="local.identificacao" label="Identificação" :span="6" />
          <FormField v-model="local.website" label="Website" :span="6" />
          <FormField v-model="local.ddi" label="DDI" :span="3" />
          <FormField v-model="local.telefone" label="Telefone" :span="5" />
          <FormField v-model="local.dataRegistroCvm" label="Data registro CVM" type="date" :span="2" />
          <FormField v-model="local.valorInicial" label="Valor inicial" :span="2" />
        </StepGrid>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Configurações'" title="Configurações" :icon="Settings2">
        <StepGrid>
          <FormField v-model="local.singulareCompanyCode" label="Código Singulare" :span="4" />
          <FormField v-model="local.grupoOperacao" label="Grupo operação" :span="4" />
          <SelectField v-model="local.perfilTributario" label="Perfil tributário" :options="['Longo prazo', 'Curto prazo']" :span="4" />
          <SelectField v-model="local.tipoCondomino" label="Tipo condômino" :options="['Aberto', 'Fechado']" :span="4" />
          <SelectField v-model="local.perfilCota" label="Perfil cota" :options="['Sênior', 'Mezanino', 'Subordinada']" :span="4" />
          <FormField v-model="local.limiteVencimentoMin" label="Vencimento mín. (dias)" :span="2" />
          <FormField v-model="local.limiteVencimentoMax" label="Vencimento máx. (dias)" :span="2" />
        </StepGrid>
        <div style="margin-top: 16px">
          <ToggleRow label="Posse de documentos" :on="local.posseDocumentos" @toggle="togglePosse" />
        </div>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Tipos de título'" title="Tipos de título" :icon="FileType">
        <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid" style="grid-template-columns: 0.6fr 1.4fr 0.5fr; padding: 14px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
            <div>Abreviação</div>
            <div>Descrição</div>
            <div>Ativo</div>
          </div>
          <div v-for="bt in local.bondTypes" :key="bt.id" class="grid items-center" style="grid-template-columns: 0.6fr 1.4fr 0.5fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold)">{{ bt.abreviacao }}</div>
            <div style="color: var(--text-muted)">{{ bt.descricao }}</div>
            <div>
              <Checkbox :checked="bt.ativo" @change="toggleBondType(bt.id)" />
            </div>
          </div>
        </div>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Carteira'" title="Carteira de cobrança" :icon="Wallet">
        <StepGrid>
          <FormField v-model="local.carteiraNome" label="Nome da carteira" :span="6" />
          <FormField v-model="local.carteiraBanco" label="Banco" :span="6" />
          <FormField v-model="local.carteiraSlug" label="Slug" :span="4" />
          <FormField v-model="local.carteiraCnab" label="CNAB" :span="4" />
          <FormField v-model="local.carteiraAgencia" label="Agência" :span="2" />
          <FormField v-model="local.carteiraConta" label="Conta" :span="2" />
        </StepGrid>
      </SectionGroup>

      <SectionGroup v-else-if="subTab === 'Cobrança'" title="Cobrança" :icon="Receipt">
        <StepGrid>
          <FormField v-model="local.jurosBoleto" label="Juros boleto (%)" :span="3" />
          <FormField v-model="local.multaBoleto" label="Multa boleto (%)" :span="3" />
          <FormField v-model="local.beneficiarioNome" label="Beneficiário" :span="6" />
          <FormField v-model="local.beneficiarioCep" label="CEP" :span="2" />
          <FormField v-model="local.beneficiarioCidade" label="Cidade" :span="3" />
          <FormField v-model="local.beneficiarioUf" label="UF" :span="1" />
        </StepGrid>
        <div style="margin-top: 16px">
          <ToggleRow label="Vencimento em fim de semana" :on="local.vencimentoFimSemana" @toggle="toggleVencimentoFimSemana" />
        </div>
      </SectionGroup>

      <SectionGroup v-else title="Elegibilidade TOP" :icon="Target">
        <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid" style="grid-template-columns: 0.8fr 0.6fr 0.6fr; padding: 14px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
            <div>Tipo</div>
            <div>Quantidade</div>
            <div>Concentração %</div>
          </div>
          <div v-for="top in local.eligibilityTops" :key="top.id" class="grid items-center" style="grid-template-columns: 0.8fr 0.6fr 0.6fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
            <div style="font-weight: var(--weight-semibold)">{{ top.tipo }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ top.quantidade }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ top.concentracaoPct }}%</div>
          </div>
        </div>
        <p style="font-size: var(--text-xs); color: var(--gci-base); margin-top: 12px; font-weight: var(--weight-semibold); cursor: pointer">
          Ver ranking de concentração →
        </p>
      </SectionGroup>

      <div class="flex items-center" style="gap: 12px; margin-top: 20px">
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="save"
        >
          <Save :size="14" /> SALVAR
        </button>
        <span v-if="saved" style="font-size: var(--text-sm); color: var(--success-base); font-weight: var(--weight-semibold)">Alterações salvas</span>
      </div>
    </div>
  </div>
</template>
```

## Screens / grupo-detail

### CedentesTab

```vue
<script setup lang="ts">
import type { GrupoCedente } from '../../data/fidcsData';

defineProps<{ cedentes: GrupoCedente[] }>();

const COLS = '1fr 1.2fr 1fr 0.8fr 0.5fr';
</script>

<template>
  <div v-if="!cedentes.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhum cedente vinculado a este grupo.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Documento</div>
      <div>Nome</div>
      <div>Email</div>
      <div>Cidade-UF</div>
      <div>Tipo</div>
    </div>
    <div v-for="c in cedentes" :key="c.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
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
import type { GrupoContaBancaria } from '../../data/fidcsData';

defineProps<{ contas: GrupoContaBancaria[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.5fr';
</script>

<template>
  <div v-if="!contas.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhuma conta bancária cadastrada.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Banco</div>
      <div>Agência</div>
      <div>Conta</div>
      <div>Principal</div>
    </div>
    <div v-for="c in contas" :key="c.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.banco }}</div>
      <div style="color: var(--text-muted)">{{ c.agencia }}</div>
      <div style="color: var(--text-muted)">{{ c.conta }}</div>
      <div>
        <span v-if="c.principal" style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: 9999px; background: var(--status-success-bg); color: var(--status-success-text)">Principal</span>
        <span v-else style="color: var(--text-muted)">—</span>
      </div>
    </div>
  </div>
</template>
```

### DocumentosTab

```vue
<script setup lang="ts">
import type { GrupoDocumento } from '../../data/fidcsData';

defineProps<{ documentos: GrupoDocumento[] }>();

const COLS = '1.2fr 0.8fr 0.7fr';
</script>

<template>
  <div v-if="!documentos.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhum documento cadastrado.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Nome</div>
      <div>Tipo</div>
      <div>Data</div>
    </div>
    <div v-for="d in documentos" :key="d.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
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
import { brl, type GrupoFaturamento } from '../../data/fidcsData';

defineProps<{ faturamentos: GrupoFaturamento[] }>();

const COLS = '0.5fr 1fr';
</script>

<template>
  <div v-if="!faturamentos.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhum faturamento registrado.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Ano</div>
      <div>Valor</div>
    </div>
    <div v-for="f in faturamentos" :key="f.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.ano }}</div>
      <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(f.valor) }}</div>
    </div>
  </div>
</template>
```

### GarantiasTab

```vue
<script setup lang="ts">
import { brl, type GrupoGarantia } from '../../data/fidcsData';

defineProps<{ garantias: GrupoGarantia[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.8fr 0.6fr 0.6fr';
</script>

<template>
  <div v-if="!garantias.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhuma garantia cadastrada.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Tipo</div>
      <div>Início</div>
      <div>Fim</div>
      <div>Valor</div>
      <div>Cobertura</div>
      <div>Status</div>
    </div>
    <div v-for="g in garantias" :key="g.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
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
import type { GrupoHistoricoEvento } from '../../data/fidcsData';

defineProps<{ eventos: GrupoHistoricoEvento[] }>();
</script>

<template>
  <div v-if="!eventos.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    <History :size="32" style="margin: 0 auto 12px; opacity: 0.5" />
    Nenhum evento registrado para este grupo.
  </div>
  <div v-else style="padding: 20px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 16px">
      Linha do Tempo
    </div>
    <div class="flex flex-col" style="gap: 0">
      <div v-for="(e, i) in eventos" :key="e.id" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--gci-base); margin-top: 4px" />
          <span v-if="i < eventos.length - 1" style="position: absolute; left: 5px; top: 16px; bottom: -12px; width: 2px; background: var(--border-default)" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.message }}</div>
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
import type { GrupoParteRelacionada } from '../../data/fidcsData';

defineProps<{ partes: GrupoParteRelacionada[] }>();

const COLS = '1fr 1.2fr 1fr';
</script>

<template>
  <div v-if="!partes.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhuma parte relacionada cadastrada.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Documento</div>
      <div>Nome</div>
      <div>Tipos</div>
    </div>
    <div v-for="p in partes" :key="p.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
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
import type { Sacado, SacadoContato } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';

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
import { ref } from 'vue';
import type { Sacado } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import SelectField from '../../components/create-class/SelectField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';
import ContatosSubTab from './ContatosSubTab.vue';
import EnderecosSubTab from './EnderecosSubTab.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const SUB_TABS = ['Contatos', 'Endereços'] as const;
type SubTab = (typeof SUB_TABS)[number];

const subTab = ref<SubTab>('Contatos');

const local = ref({ ...props.sacado });

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
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 16px">
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
import type { Sacado, SacadoEndereco } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';

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
import { Clock, History } from 'lucide-vue-next';
import type { SacadoHistorico } from '../../data/fidcsData';

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
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 16px">
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
import type { Fidc, Sacado } from '../../data/fidcsData';
import TitlesTable from '../../components/TitlesTable.vue';

const props = defineProps<{ fidc: Fidc; sacado: Sacado }>();

const filteredTitles = computed(() =>
  props.fidc.classes
    .flatMap((c) => c.titulos)
    .filter((t) => t.sacadoCnpj === props.sacado.documento),
);

const classMap = computed(() =>
  Object.fromEntries(props.fidc.classes.map((c) => [c.id, c.name.split(' ').pop()?.slice(0, 6).toUpperCase() ?? c.id])),
);
</script>

<template>
  <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Títulos do sacado
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ filteredTitles.length }} título(s) vinculados
      </div>
    </div>
    <TitlesTable v-if="filteredTitles.length" :rows="filteredTitles" :class-map="classMap" />
    <div v-else style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum título vinculado a este sacado na carteira.
    </div>
  </div>
</template>
```

## Screens / title-detail

### AccrualTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { brl, type Title } from '../../data/fidcsData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: Title }>();

const rows = computed(() => [
  { data: props.title.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.title.vrNominal * 0.0185) / 252), acumulado: brl(((props.title.vrNominal * 0.0185) / 252) * 3) },
  { data: props.title.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.title.vrNominal * 0.0185) / 252), acumulado: brl(((props.title.vrNominal * 0.0185) / 252) * 2) },
  { data: props.title.vencimento, taxa: '1,8500%', base: '252', accrual: brl((props.title.vrNominal * 0.0185) / 252), acumulado: brl((props.title.vrNominal * 0.0185) / 252) },
]);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, { defaultPageSize: 5 });
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase"
      >
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
import type { Title } from '../../data/fidcsData';
import Section from './Section.vue';

const props = defineProps<{ title: Title }>();

const files = computed(() => [
  { name: `NFE-${props.title.numero}.xml`, size: '14 KB', type: 'XML' },
  { name: `DANFE-${props.title.numero}.pdf`, size: '128 KB', type: 'PDF' },
  { name: `Canhoto-${props.title.numero}.jpg`, size: '342 KB', type: 'IMG' },
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
        <div
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em"
        >
          {{ f.type }}
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ f.name }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ f.size }}
          </div>
        </div>
        <button
          class="flex items-center"
          style="
            gap: 8px;
            padding: 8px 14px;
            background: var(--surface-card);
            color: var(--text-strong);
            border-width: 1px;
            border-style: solid;
            border-color: var(--border-default);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--text-xs);
            font-weight: var(--weight-bold);
          "
        >
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
import type { Title } from '../../data/fidcsData';
import Section from './Section.vue';

const props = defineProps<{ title: Title }>();

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
};

const confirmacoes = computed(() => [
  { data: props.title.emissao, tipo: 'Confirmação do Sacado', resultado: props.title.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE', obs: 'Via portal eletrônico' },
  { data: props.title.emissao, tipo: 'Validação de Lastro', resultado: 'CONFIRMADO', obs: 'Documento verificado' },
  { data: props.title.emissao, tipo: 'Registro Registradora', resultado: 'CONFIRMADO', obs: 'B3 — protocolo #82341' },
]);

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap['PENDENTE'];
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in confirmacoes"
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
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    style="
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      display: inline-flex;
      align-items: center;
      border-radius: 4px;
      flex-shrink: 0;
      transition: color var(--duration-fast);
    "
    :style="{ color: copied ? 'var(--success-base)' : 'var(--text-muted)' }"
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
import type { Title, FidcClass } from '../../data/fidcsData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ title: Title; klass: FidcClass }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Classe de Origem">{{ klass.name }}</Field>
        <Field label="ID de Lastro">LST-{{ title.numero }}</Field>
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ title.numero }}<CopyButton :value="title.numero" /></span>
        </Field>
        <Field label="Tipo de Ativo">{{ title.lastro.replace('_', '-') }}</Field>
      </div>
    </Section>

    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ title.emissao }}</Field>
        <Field label="Data de Vencimento">{{ title.vencimento }}</Field>
        <Field label="Prorrogação">Não aplicável</Field>
        <Field label="Protesto">—</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="title.cedente" :cnpj="title.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="title.sacado" :cnpj="title.sacadoCnpj" :icon="User" />
      </div>
    </Section>

    <Section title="Contato Regulatório">
      <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 24px">
        <Field label="Email">
          <span class="flex items-center" style="gap: 6px">
            <Mail :size="14" color="var(--text-muted)" /> cobranca@cedente.com.br
            <CopyButton value="cobranca@cedente.com.br" />
          </span>
        </Field>
        <Field label="Telefone">
          <span class="flex items-center" style="gap: 6px">
            <Phone :size="14" color="var(--text-muted)" /> +55 (11) 4002-8922
            <CopyButton value="+55 (11) 4002-8922" />
          </span>
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
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      <slot />
    </div>
  </div>
</template>
```

### MovimentacoesTab

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type Title } from '../../data/fidcsData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: Title }>();

type MovSub = 'registro' | 'cessao';

const sub = ref<MovSub>('registro');

const registros = computed(() => [
  { data: props.title.emissao, operacao: 'Inclusão', registradora: 'B3', protocolo: '#82341', valor: brl(props.title.vrNominal) },
  { data: props.title.vencimento, operacao: 'Atualização', registradora: 'B3', protocolo: '#82411', valor: brl(props.title.vrNominal * 0.98) },
]);

const cessoes = computed(() => [
  { data: props.title.emissao, cedente: props.title.cedente, cessionario: 'FIDC Fundo', valor: brl(props.title.vrNominal), status: 'LIQUIDADO' },
]);

const {
  page: registroPage,
  pageSize: registroPageSize,
  total: registroTotal,
  pageItems: registroPageItems,
  setPage: setRegistroPage,
  setPageSize: setRegistroPageSize,
} = useTablePagination(() => registros.value, { defaultPageSize: 5 });

const {
  page: cessaoPage,
  pageSize: cessaoPageSize,
  total: cessaoTotal,
  pageItems: cessaoPageItems,
  setPage: setCessaoPage,
  setPageSize: setCessaoPageSize,
} = useTablePagination(() => cessoes.value, { defaultPageSize: 5 });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <!-- Sub-navigation -->
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
        <div
          class="grid"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase"
        >
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
        <div
          class="grid"
          style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase"
        >
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
            <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 8px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">{{ r.status }}</span>
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
import type { Title } from '../../data/fidcsData';
import Section from './Section.vue';

const props = defineProps<{ title: Title }>();

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};

const events = computed(() => [
  { date: props.title.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
  { date: props.title.emissao, label: 'Registro enviado à registradora (CERC)', tone: 'info' },
  {
    date: props.title.emissao,
    label: 'Confirmação física do sacado',
    tone: props.title.status === 'CONFIRMADO' ? 'success' : 'warning',
  },
  {
    date: props.title.vencimento,
    label: props.title.status === 'VENCIDO' ? 'Inadimplência identificada' : 'Vencimento programado',
    tone: props.title.status === 'VENCIDO' ? 'danger' : 'neutral',
  },
]);
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div
        v-for="(e, i) in events"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span
            :style="{
              display: 'block',
              width: '12px',
              height: '12px',
              borderRadius: '9999px',
              background: toneMap[e.tone],
              marginTop: '6px',
            }"
          />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.label }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ e.date }}
          </div>
        </div>
      </div>
    </div>
  </Section>
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

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

## Components

### CreateClassModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import {
  X,
  Info,
  Mail,
  FileText,
  Users,
  Network,
  Banknote,
  ClipboardList,
  AlertTriangle,
  ClipboardCheck,
  Check,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Phone,
  Wallet,
  UserCheck,
  Percent,
  Users2,
  Crown,
} from 'lucide-vue-next';
import { gruposEmpresariais } from '@/features/cra/data/craData';
import StepGrid from './create-class/StepGrid.vue';
import SectionTitle from './create-class/SectionTitle.vue';
import FieldLabel from './create-class/FieldLabel.vue';
import Input from './create-class/Input.vue';
import FormField from './create-class/FormField.vue';
import SelectField from './create-class/SelectField.vue';
import RadioPill from './create-class/RadioPill.vue';
import SectionHelp from './create-class/SectionHelp.vue';
import ToggleRow from './modals/ToggleRow.vue';
import ParticipantBlock from './create-class/ParticipantBlock.vue';
import SectionGroup from './create-class/SectionGroup.vue';
import AddButton from './create-class/AddButton.vue';
import DataTable from './create-class/DataTable.vue';
import DynamicConcentration from './create-class/DynamicConcentration.vue';
import SummaryItem from './create-class/SummaryItem.vue';

export interface NewClassData {
  cnpjVeiculo: string;
  identificacaoVeiculo: string;
  tipoEmpresa: string;
  razaoSocial: string;
  nomeFantasia: string;
  naturezaLegal: string;
  atividadePrincipal: string;
  codigoSingulare: string;
  dataConstituicao: string;
  dataFimPrazo: string;
  email: string;
  ddi: string;
  ddd: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  nomeCarteira: string;
  banco: string;
  carteiraSelecionada: string;
  cnab: string;
  codigoEmpresa: string;
  numeroConta: string;
  numeroAgencia: string;
  campoExtra1: string;
  boletoInstrucoes: string;
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
}

const props = withDefaults(
  defineProps<{
    /** Sem overlay — usado dentro do Novo FIDC (Mono). */
    naked?: boolean;
    title?: string;
  }>(),
  { naked: false, title: 'Nova Classe de Fundo' },
);

const emit = defineEmits<{ close: []; back: []; create: [data: NewClassData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Info', icon: Info, hint: 'Identificação inicial' },
  { key: 'contato', label: 'Contato', icon: Mail, hint: 'Endereçamento' },
  // Etapa "Ativos" temporariamente desativada — visual mantido comentado (abaixo e no template) para reuso futuro.
  // { key: 'ativos', label: 'Ativos', icon: FileText, hint: 'Lastros elegíveis' },
  { key: 'partic', label: 'Participantes', icon: Users, hint: 'Prestadores' },
  { key: 'limites', label: 'Limites', icon: Percent, hint: 'Configuração de limites' },
  { key: 'grupos', label: 'Grupos', icon: Network, hint: 'Econômicos' },
  { key: 'banco', label: 'Banco', icon: Banknote, hint: 'Domicílio bancário' },
  { key: 'registro', label: 'Registro', icon: ClipboardList, hint: 'Registradoras' },
  { key: 'pdd', label: 'PDD', icon: AlertTriangle, hint: 'Provisão' },
  { key: 'resumo', label: 'Resumo', icon: ClipboardCheck, hint: 'Resumo dos dados cadastrados' },
];

const lastroOpts = [
  { key: 'CH', label: 'Cheque' },
  { key: 'DM', label: 'Duplicata Mercantil' },
  { key: 'DS', label: 'Duplicata de Serviço' },
  { key: 'LC', label: 'Letra de Câmbio' },
  { key: 'NP', label: 'Nota Promissória' },
  { key: 'REC', label: 'Recibo' },
  { key: 'FAT', label: 'Fatura' },
  { key: 'CPR', label: 'Cédula de Produto Rural' },
  { key: 'WAR', label: 'Warrant' },
  { key: 'PV', label: 'Pedido de Venda' },
  { key: 'OUT', label: 'Outros' },
  { key: 'NF', label: 'Nota Fiscal' },
  { key: 'CTR', label: 'Contrato' },
  { key: 'CTE', label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'CPRF', label: 'Cédula de Produto Rural Financeira' },
  { key: 'CCB', label: 'Cédula de Crédito Bancário' },
  { key: 'CDCA', label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agropecuário e Warrant Agropecuário' },
  { key: 'CDA', label: 'Certificado de Depósito Agropecuário' },
  { key: 'NC', label: 'Nota Comercial' },
  { key: 'CD', label: 'Confissão de Dívida' },
];

const partOpcionais: { key: string; label: string; toggleLabel: string }[] = [
  { key: 'custodiante', label: 'Custodiante', toggleLabel: 'Fundo tem Custodiante' },
  { key: 'cobranca', label: 'Agente de Cobrança', toggleLabel: 'Fundo tem Agente de Cobrança' },
  { key: 'consultor', label: 'Consultor', toggleLabel: 'Fundo tem Consultor' },
  { key: 'benef', label: 'Beneficiário Final', toggleLabel: 'Fundo tem Beneficiário Final' },
];


const BENEFICIARIO_OPTS = [
  'CERES SECURIZADORA S/A',
  'BTG SECURIZADORA S/A',
  'ISEC SECURIZADORA S/A',
  'RB CAPITAL',
  'Oliveira Trust',
  'Vórtx',
  'BRL Trust',
];

const form = ref<NewClassData>({
  cnpjVeiculo: '', identificacaoVeiculo: '', tipoEmpresa: '',
  razaoSocial: '', nomeFantasia: '', naturezaLegal: '', atividadePrincipal: '', codigoSingulare: '',
  dataConstituicao: '', dataFimPrazo: '',
  email: '', ddi: '', ddd: '', telefone: '',
  cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', pais: '',
  nomeCarteira: '', banco: '', carteiraSelecionada: '', cnab: '', codigoEmpresa: '',
  numeroConta: '', numeroAgencia: '', campoExtra1: '', boletoInstrucoes: '', permiteFimDeSemana: true,
  cadastrarNovoBeneficiario: false,
  benefSelecionado: '', benefDesde: '',
  benefCnpj: '', benefNome: '', benefCep: '', benefEndereco: '', benefNumero: '',
  benefComplemento: '', benefBairro: '', benefCidade: '', benefEstado: '',
});

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);
const prazo = ref<'determinado' | 'indeterminado'>('determinado');
const ativos = ref<string[]>(['NF', 'DM']);
const cedTipo = ref<'mono' | 'multi'>('multi');
const sacTipo = ref<'mono' | 'multi'>('multi');
const concentracaoPool = ref({ sacadosNovos: '', sacadosElegiveis: '', totalNovos: '', totalElegiveis: '' });
const ativoLimites = ref<{ tipo: string; limite: string }[]>([{ tipo: 'DM', limite: '30,00' }]);
const ativoForm = ref<{ tipo: string; limite: string }>({ tipo: 'DM', limite: '' });
const topCed = ref<{ qtd: string; limite: string }[]>([{ qtd: '5', limite: '40,00' }]);
const topCedForm = ref<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
const topSac = ref<{ qtd: string; limite: string }[]>([]);
const topSacForm = ref<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
const partToggles = ref<Record<string, boolean>>({
  custodiante: true,
  cobranca: false,
  consultor: false,
  benef: false,
});

function togglePart(k: string) {
  partToggles.value = { ...partToggles.value, [k]: !partToggles.value[k] };
}

function ativoLabel(k: string) {
  return lastroOpts.find((o) => o.key === k)?.label ?? k;
}

function addAtivoLimite() {
  if (!ativoForm.value.limite) return;
  ativoLimites.value = [...ativoLimites.value, ativoForm.value];
  ativoForm.value = { tipo: ativoForm.value.tipo, limite: '' };
}
function addTopCed() {
  if (!topCedForm.value.qtd || !topCedForm.value.limite) return;
  topCed.value = [...topCed.value, topCedForm.value];
  topCedForm.value = { qtd: '', limite: '' };
}
function addTopSac() {
  if (!topSacForm.value.qtd || !topSacForm.value.limite) return;
  topSac.value = [...topSac.value, topSacForm.value];
  topSacForm.value = { qtd: '', limite: '' };
}

type LimitTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
const limitTab = ref<LimitTab>('concentracao');
const limitTabs: [LimitTab, string][] = [
  ['concentracao', 'Concentração'],
  ['totalizadores', 'Totalizadores de ativos'],
  ['topCedente', 'TOP Cedente'],
  ['topSacado', 'TOP Sacado'],
];

const ativoRows = computed(() =>
  ativoLimites.value.map((r) => ({ tipo: r.tipo, descricao: ativoLabel(r.tipo), limite: r.limite })),
);
const topCedRows = computed(() =>
  topCed.value.map((r) => ({ tipo: `TOP ${r.qtd}`, descricao: `TOP ${r.qtd}`, limite: r.limite })),
);
const topSacRows = computed(() =>
  topSac.value.map((r) => ({ tipo: `TOP ${r.qtd}`, descricao: `TOP ${r.qtd}`, limite: r.limite })),
);

const gruposSelecionados = ref<string[]>([]);
const grupoQ = ref('');
function toggleGrupo(nome: string) {
  gruposSelecionados.value = gruposSelecionados.value.includes(nome)
    ? gruposSelecionados.value.filter((x) => x !== nome)
    : [...gruposSelecionados.value, nome];
}
const filteredGrupos = computed(() =>
  gruposEmpresariais.filter(
    (g) => !grupoQ.value || g.nome.toLowerCase().includes(grupoQ.value.toLowerCase()),
  ),
);

const pddFaixas = ref([
  { de: '0', ate: '30', rating: 'A', pct: '0,5' },
  { de: '31', ate: '60', rating: 'B', pct: '1,0' },
  { de: '61', ate: '90', rating: 'C', pct: '3,0' },
  { de: '91', ate: '180', rating: 'D', pct: '10,0' },
  { de: '181', ate: '360', rating: 'E', pct: '50,0' },
]);
const pddForm = ref({ de: '', ate: '', rating: 'A', pct: '' });

const regList = ref<{ registradora: string; idCarteira: string; usuario: string }[]>([
  { registradora: 'B3', idCarteira: '000123', usuario: 'minerva.b3' },
]);
const regForm = ref({ registradora: 'B3', idCarteira: '', usuario: '', senha: '' });

function addReg() {
  if (!regForm.value.idCarteira || !regForm.value.usuario) return;
  regList.value = [
    ...regList.value,
    { registradora: regForm.value.registradora, idCarteira: regForm.value.idCarteira, usuario: regForm.value.usuario },
  ];
  regForm.value = { registradora: regForm.value.registradora, idCarteira: '', usuario: '', senha: '' };
}
function addPdd() {
  if (!pddForm.value.de || !pddForm.value.ate || !pddForm.value.pct) return;
  pddFaixas.value = [...pddFaixas.value, pddForm.value];
  pddForm.value = { de: '', ate: '', rating: 'A', pct: '' };
}

const step = computed(() => steps[stepIdx.value]);
const isLast = computed(() => stepIdx.value === steps.length - 1);

// Step Resumo — dados agregados das demais etapas
const activePartLabels = computed(() =>
  partOpcionais.filter((p) => partToggles.value[p.key]).map((p) => p.label),
);

function toggleAtivo(k: string) {
  ativos.value = ativos.value.includes(k) ? ativos.value.filter((a) => a !== k) : [...ativos.value, k];
}

function stepColor(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
}
function stepDimmed(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return !current && !done && hoverIdx.value !== i ? 0.55 : 1;
}

function handleBack() {
  if (stepIdx.value === 0) {
    if (props.naked) emit('back');
    else emit('close');
    return;
  }
  stepIdx.value = Math.max(0, stepIdx.value - 1);
}

function handleNext() {
  if (isLast.value) emit('create', { ...form.value });
  else stepIdx.value++;
}
</script>

<template>
  <div
    :style="
      naked
        ? { width: '100%', maxWidth: '1280px', animation: 'fadeIn 0.2s ease-out' }
        : {
            position: 'fixed',
            inset: '0',
            background: 'rgba(8, 60, 74, 0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            animation: 'fadeIn 0.2s ease-out',
          }
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1280px;
        max-height: calc(100vh - 64px);
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
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            {{ title }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          class="flex flex-col items-center justify-center"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: stepColor(i),
            opacity: stepDimmed(i),
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="hoverIdx = i"
          @mouseleave="hoverIdx = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <StepGrid v-if="step.key === 'info'">
          <FormField label="CNPJ do Veículo (Classe)" placeholder="00.000.000/0000-00" :span="4" v-model="form.cnpjVeiculo" />
          <FormField label="Identificação do Veículo" placeholder="Ex: CLASSE TECH A" :span="5" v-model="form.identificacaoVeiculo" />
          <SelectField label="Tipo de Empresa" :options="['Matriz', 'Filial']" :span="3" v-model="form.tipoEmpresa" />

          <FormField label="Razão Social" placeholder="Razão social completa" :span="8" v-model="form.razaoSocial" />
          <FormField label="Nome Fantasia / Classe" placeholder="Ex: Sênior Classe A" :span="4" v-model="form.nomeFantasia" />

          <FormField label="Natureza Legal" placeholder="Fundo" :span="4" v-model="form.naturezaLegal" />
          <FormField label="Atividade Principal" placeholder="Direitos Creditórios" :span="5" v-model="form.atividadePrincipal" />
          <FormField label="Código Singulare (CNAB 444)" placeholder="000" :span="3" v-model="form.codigoSingulare" />

          <SelectField
            label="Indicativo de Prazo"
            :options="['Prazo Determinado', 'Prazo Indeterminado']"
            @change="(v) => (prazo = v === 'Prazo Determinado' ? 'determinado' : 'indeterminado')"
            :span="prazo === 'determinado' ? 4 : 6"
          />
          <FormField
            label="Data de Constituição"
            placeholder="dd/mm/aaaa"
            type="date"
            :span="prazo === 'determinado' ? 4 : 6"
            v-model="form.dataConstituicao"
          />
          <FormField v-if="prazo === 'determinado'" label="Data Fim do Prazo" placeholder="dd/mm/aaaa" type="date" :span="4" v-model="form.dataFimPrazo" />

          <FormField label="Categoria CVM" placeholder="FIDC" disabled default-value="FIDC" :span="12" />
        </StepGrid>

        <div v-else-if="step.key === 'contato'" class="flex flex-col" style="gap: 20px">
          <div>
            <SectionTitle :icon="Phone">Contato</SectionTitle>
            <StepGrid>
              <FormField label="Email do Veículo" placeholder="contato@classe.com.br" type="email" :span="6" v-model="form.email" />
              <FormField label="DDI" placeholder="+55" :span="2" v-model="form.ddi" />
              <FormField label="DDD" placeholder="11" :span="1" v-model="form.ddd" />
              <FormField label="Telefone" placeholder="0000-0000" :span="3" v-model="form.telefone" />
            </StepGrid>
          </div>
          <div>
            <SectionTitle :icon="MapPin">Endereço</SectionTitle>
            <StepGrid>
              <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.cep" />
              <FormField label="Endereço" placeholder="Av. ..." :span="7" v-model="form.endereco" />
              <FormField label="Número" placeholder="—" :span="2" v-model="form.numero" />
              <FormField label="Complemento" placeholder="Sala 101" :span="4" v-model="form.complemento" />
              <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
              <FormField label="Cidade" placeholder="—" :span="4" v-model="form.cidade" />
              <FormField label="Estado" placeholder="SP" :span="2" v-model="form.estado" />
              <FormField label="País" placeholder="Brasil" default-value="Brasil" :span="4" v-model="form.pais" />
            </StepGrid>
          </div>
        </div>

        <!--
        Step — Tipo de Ativos Aceitos
        Temporariamente oculta desta etapa (ver comentário em `steps`). Visual mantido
        comentado aqui para ser reaproveitado futuramente.

        <div v-else-if="step.key === 'ativos'">
          <SectionHelp>
            Selecione os tipos de direitos creditórios aceitos por esta classe.
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
                {{ o.key.replace('_', '-') }}
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ o.label }}
              </div>
            </button>
          </div>
        </div>
        -->

        <div v-else-if="step.key === 'partic'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Cadastre os prestadores de serviço da classe. Administradora e Gestor são
            obrigatórios; os demais participantes podem ser ativados conforme a estrutura
            operacional do fundo.
          </SectionHelp>

          <ParticipantBlock
            title="Identificação de Administradora"
            name-label="Administradora"
            doc-label="Documento"
            date-label="Administradora do fundo desde"
            required
          />

          <ParticipantBlock
            title="Identificação de Gestor"
            name-label="Gestor"
            doc-label="Documento"
            date-label="Gestor do fundo desde"
            required
          />

          <ParticipantBlock
            v-for="p in partOpcionais"
            :key="p.key"
            :title="`Identificação de ${p.label}`"
            :name-label="p.label"
            doc-label="Documento"
            :date-label="`${p.label} do fundo desde`"
            :toggle-label="p.toggleLabel"
            :toggle-enabled="partToggles[p.key]"
            @toggle="togglePart(p.key)"
          />
        </div>

        <div v-else-if="step.key === 'limites'" class="flex flex-col" style="gap: 20px">
          <SectionHelp>
            Configure os limites de concentração da carteira e os totalizadores por tipo de ativo e TOP.
          </SectionHelp>
          <!-- Tab bar -->
          <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start; flex-wrap: wrap">
            <button
              v-for="[k, label] in limitTabs"
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

          <!-- Tab 1 — Concentração (diversificação do pool) -->
          <SectionGroup v-if="limitTab === 'concentracao'" :icon="Users2" title="Diversificação do Pool">
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 20px">
              <div>
                <FieldLabel>Tipo de Cedente</FieldLabel>
                <div class="flex" style="gap: 8px; margin-top: 8px">
                  <RadioPill :active="cedTipo === 'mono'" @click="cedTipo = 'mono'">Monocedente</RadioPill>
                  <RadioPill :active="cedTipo === 'multi'" @click="cedTipo = 'multi'">Multicedente</RadioPill>
                </div>
              </div>
              <div>
                <FieldLabel>Tipo de Sacado</FieldLabel>
                <div class="flex" style="gap: 8px; margin-top: 8px">
                  <RadioPill :active="sacTipo === 'mono'" @click="sacTipo = 'mono'">Monosacado</RadioPill>
                  <RadioPill :active="sacTipo === 'multi'" @click="sacTipo = 'multi'">Multissacado</RadioPill>
                </div>
              </div>
            </div>
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px">
              <div>
                <FieldLabel>Conc. Sacados Novos (%)</FieldLabel>
                <Input placeholder="5,00" v-model="concentracaoPool.sacadosNovos" />
              </div>
              <div>
                <FieldLabel>Conc. Sacados Elegíveis (%)</FieldLabel>
                <Input placeholder="20,00" v-model="concentracaoPool.sacadosElegiveis" />
              </div>
              <div>
                <FieldLabel>Conc. Total Novos (%)</FieldLabel>
                <Input placeholder="3,00" v-model="concentracaoPool.totalNovos" />
              </div>
              <div>
                <FieldLabel>Conc. Total Elegíveis (%)</FieldLabel>
                <Input placeholder="100,00" v-model="concentracaoPool.totalElegiveis" />
              </div>
            </div>
          </SectionGroup>

          <!-- Tab 2 — Totalizadores de ativos -->
          <DynamicConcentration
            v-else-if="limitTab === 'totalizadores'"
            :icon="Percent"
            title="% Concentração por Tipo de Ativo"
            qtd-label="Tipo de Ativo"
            qtd-placeholder="Selecione"
            :qtd-options="ativos.length ? ativos : lastroOpts.map((o) => o.key)"
            limite-placeholder="0,00"
            :rows="ativoRows"
            :form="ativoForm"
            @update:form="ativoForm = $event"
            @add="addAtivoLimite"
            @remove="(i) => (ativoLimites = ativoLimites.filter((_, idx) => idx !== i))"
          />

          <!-- Tab 3 — TOP Cedente -->
          <DynamicConcentration
            v-else-if="limitTab === 'topCedente'"
            :icon="Crown"
            title="Concentração de TOP's Cedentes"
            qtd-label="Quantidade"
            qtd-placeholder="Ex: 5"
            qtd-numeric
            limite-placeholder="0,00"
            :rows="topCedRows"
            :form="{ tipo: topCedForm.qtd, limite: topCedForm.limite }"
            @update:form="(v) => (topCedForm = { qtd: v.tipo, limite: v.limite })"
            @add="addTopCed"
            @remove="(i) => (topCed = topCed.filter((_, idx) => idx !== i))"
          />

          <!-- Tab 4 — TOP Sacado -->
          <DynamicConcentration
            v-else-if="limitTab === 'topSacado'"
            :icon="Crown"
            title="Concentração de TOP's Sacados"
            qtd-label="Quantidade"
            qtd-placeholder="Ex: 10"
            qtd-numeric
            limite-placeholder="0,00"
            :rows="topSacRows"
            :form="{ tipo: topSacForm.qtd, limite: topSacForm.limite }"
            @update:form="(v) => (topSacForm = { qtd: v.tipo, limite: v.limite })"
            @add="addTopSac"
            @remove="(i) => (topSac = topSac.filter((_, idx) => idx !== i))"
          />
        </div>

        <div v-else-if="step.key === 'grupos'">
          <SectionHelp>
            Selecione quais grupos econômicos estão aptos a operar nesta classe.
          </SectionHelp>
          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg); margin-bottom: 16px">
            <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
            <input
              v-model="grupoQ"
              placeholder="Pesquisar grupos empresariais..."
              style="width: 100%; height: 44px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
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
                borderColor: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: gruposSelecionados.includes(g.nome) ? 'var(--gci-light)' : 'var(--surface-card)',
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
                  background: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                  color: gruposSelecionados.includes(g.nome) ? '#fff' : 'var(--text-muted)',
                  transition: 'all var(--duration-base)',
                }"
              >
                <Check v-if="gruposSelecionados.includes(g.nome)" :size="11" />
              </span>
              <div style="flex: 1; min-width: 0">
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    fontWeight: gruposSelecionados.includes(g.nome) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                    color: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--text-default)',
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

        <div v-else-if="step.key === 'banco'" class="flex flex-col" style="gap: 20px">
          <div>
            <SectionTitle :icon="Wallet">Dados da Carteira</SectionTitle>
            <StepGrid>
              <FormField label="Nome da Carteira" placeholder="Ex: Agrovita FIDC - Santander" :span="6" v-model="form.nomeCarteira" />
              <SelectField
                label="Selecione o Banco"
                :options="['033 - Santander', '237 - Bradesco', '341 - Itaú', '001 - Banco do Brasil', '104 - Caixa']"
                placeholder="Selecione"
                :span="6"
                v-model="form.banco"
              />
              <SelectField label="Selecione a Carteira" :options="['Carteira 1', 'Carteira 2', 'Carteira 3']" placeholder="Selecione" :span="4" v-model="form.carteiraSelecionada" />
              <SelectField label="Selecione o CNAB" :options="['CNAB 240', 'CNAB 400']" placeholder="Selecione" :span="4" v-model="form.cnab" />
              <FormField label="Código da Empresa" placeholder="—" :span="4" v-model="form.codigoEmpresa" />
              <FormField label="Número da Conta" placeholder="000000-0" :span="4" v-model="form.numeroConta" />
              <FormField label="Número da Agência" placeholder="0000-0" :span="4" v-model="form.numeroAgencia" />
              <FormField label="Campo Extra 1" placeholder="—" :span="4" v-model="form.campoExtra1" />
              <FormField label="Configuração de dados padrões para Boleto" placeholder="Texto de instrução para impressão" :span="12" v-model="form.boletoInstrucoes" />
            </StepGrid>
            <div style="margin-top: 16px">
              <ToggleRow
                label="Permite vencimento em finais de semana e feriado"
                hint="Se ativo, parcelas podem ser liquidadas sem prorrogação para o próximo dia útil."
                :on="form.permiteFimDeSemana"
                @toggle="form.permiteFimDeSemana = !form.permiteFimDeSemana"
              />
            </div>
          </div>

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

        <div v-else-if="step.key === 'registro'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Cadastre as registradoras homologadas e suas credenciais de acesso.
          </SectionHelp>

          <SectionGroup :icon="ClipboardList" title="Configuração de Registradoras">
            <div class="grid items-end" style="grid-template-columns: 1.1fr 1.4fr 1.4fr 1.4fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Registradora</FieldLabel>
                <SelectField :options="['B3', 'CERC', 'TAG', 'CIP']" @change="(v) => (regForm.registradora = v)" />
              </div>
              <div>
                <FieldLabel>ID Carteira</FieldLabel>
                <Input placeholder="Identificador" v-model="regForm.idCarteira" />
              </div>
              <div>
                <FieldLabel>Usuário</FieldLabel>
                <Input placeholder="Usuário API/SFTP" v-model="regForm.usuario" />
              </div>
              <div>
                <FieldLabel>Senha</FieldLabel>
                <Input type="password" placeholder="••••••••" v-model="regForm.senha" />
              </div>
              <AddButton @click="addReg" />
            </div>

            <DataTable
              :cols="[
                { key: 'registradora', label: 'Registradora', width: '1fr' },
                { key: 'idCarteira', label: 'ID Carteira', width: '1.4fr' },
                { key: 'usuario', label: 'Usuário', width: '1.4fr' },
              ]"
              :rows="regList"
              empty="Nenhuma registradora cadastrada."
              @remove="(i) => (regList = regList.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

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
                <SelectField :options="['A', 'B', 'C', 'D', 'E', 'F']" @change="(v) => (pddForm.rating = v)" />
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

        <!-- Step — Resumo dos dados cadastrados -->
        <div v-else-if="step.key === 'resumo'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Revise as informações cadastradas em todas as etapas antes de finalizar o cadastro da classe.
          </SectionHelp>

          <SectionGroup :icon="Info" title="Dados Cadastrais">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="CNPJ do Veículo" :value="form.cnpjVeiculo" />
              <SummaryItem label="Identificação do Veículo" :value="form.identificacaoVeiculo" />
              <SummaryItem label="Tipo de Empresa" :value="form.tipoEmpresa" />
              <SummaryItem label="Razão Social" :value="form.razaoSocial" />
              <SummaryItem label="Nome Fantasia / Classe" :value="form.nomeFantasia" />
              <SummaryItem label="Natureza Legal" :value="form.naturezaLegal" />
              <SummaryItem label="Atividade Principal" :value="form.atividadePrincipal" />
              <SummaryItem label="Código Singulare" :value="form.codigoSingulare" />
              <SummaryItem label="Indicativo de Prazo" :value="prazo === 'determinado' ? 'Prazo Determinado' : 'Prazo Indeterminado'" />
              <SummaryItem label="Data de Constituição" :value="form.dataConstituicao" />
              <SummaryItem v-if="prazo === 'determinado'" label="Data Fim do Prazo" :value="form.dataFimPrazo" />
              <SummaryItem label="Categoria CVM" value="FIDC" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Phone" title="Contato e Endereço">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Email do Veículo" :value="form.email" />
              <SummaryItem label="Telefone" :value="form.ddd || form.telefone ? `(${form.ddi || '+55'}) ${form.ddd} ${form.telefone}` : ''" />
              <SummaryItem label="CEP" :value="form.cep" />
              <SummaryItem label="Endereço" :value="form.endereco ? `${form.endereco}, ${form.numero || 's/n'}` : ''" />
              <SummaryItem label="Bairro" :value="form.bairro" />
              <SummaryItem label="Cidade / Estado" :value="form.cidade ? `${form.cidade} / ${form.estado}` : ''" />
              <SummaryItem label="País" :value="form.pais" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Users" title="Participantes">
            <div v-if="activePartLabels.length" class="flex flex-wrap" style="gap: 8px">
              <span class="summary-tag">Administradora</span>
              <span class="summary-tag">Gestor</span>
              <span v-for="p in activePartLabels" :key="p" class="summary-tag">{{ p }}</span>
            </div>
            <div v-else class="flex flex-wrap" style="gap: 8px">
              <span class="summary-tag">Administradora</span>
              <span class="summary-tag">Gestor</span>
            </div>
          </SectionGroup>

          <SectionGroup :icon="Percent" title="Limites">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Tipo de Cedente / Sacado" :value="`${cedTipo === 'mono' ? 'Monocedente' : 'Multicedente'} · ${sacTipo === 'mono' ? 'Monosacado' : 'Multissacado'}`" />
              <SummaryItem label="Totalizadores de Ativos" :value="`${ativoLimites.length} cadastrados`" />
              <SummaryItem label="TOP Cedente" :value="`${topCed.length} cadastrados`" />
              <SummaryItem label="TOP Sacado" :value="`${topSac.length} cadastrados`" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Network" title="Grupos Econômicos">
            <div v-if="gruposSelecionados.length" class="flex flex-wrap" style="gap: 8px">
              <span v-for="g in gruposSelecionados" :key="g" class="summary-tag">{{ g }}</span>
            </div>
            <div v-else style="font-size: var(--text-sm); color: var(--text-muted)">Nenhum grupo selecionado.</div>
          </SectionGroup>

          <SectionGroup :icon="Wallet" title="Banco e Beneficiário">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Nome da Carteira" :value="form.nomeCarteira" />
              <SummaryItem label="Banco" :value="form.banco" />
              <SummaryItem label="Carteira" :value="form.carteiraSelecionada" />
              <SummaryItem label="CNAB" :value="form.cnab" />
              <SummaryItem label="Fim de Semana" :value="form.permiteFimDeSemana ? 'Permitido' : 'Não permitido'" />
              <SummaryItem
                label="Beneficiário"
                :value="form.cadastrarNovoBeneficiario ? form.benefNome : form.benefSelecionado"
              />
              <SummaryItem
                label="CNPJ do Beneficiário"
                :value="form.cadastrarNovoBeneficiario ? form.benefCnpj : '—'"
              />
              <SummaryItem label="Beneficiário desde" :value="form.benefDesde" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="ClipboardList" title="Registro">
            <SummaryItem label="Registradoras Cadastradas" :value="`${regList.length} cadastradas`" />
          </SectionGroup>

          <SectionGroup :icon="AlertTriangle" title="Parametrização de PDD">
            <SummaryItem label="Faixas de Aging Cadastradas" :value="`${pddFaixas.length} faixas`" />
          </SectionGroup>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="handleBack"
        >
          {{ stepIdx === 0 ? (naked ? '← Voltar ao fundo' : 'Cancelar') : '← Voltar' }}
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
          @click="handleNext"
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
```

### CreateFidcModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { X, Info, Mail, Check, ChevronRight, Phone, MapPin } from 'lucide-vue-next';
import StepGrid from './create-fidc/StepGrid.vue';
import SectionTitle from './create-fidc/SectionTitle.vue';
import FormField from './create-fidc/FormField.vue';
import SelectField from './create-fidc/SelectField.vue';
import CreateClassModal, { type NewClassData } from './CreateClassModal.vue';

export interface NewFidcData {
  tipoFundo: string;
  cnpj: string;
  tipoEmpresa: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataConstituicao: string;
  naturezaLegal: string;
  atividadePrincipal: string;
  categoriaCvm: string;
  email: string;
  ddi: string;
  ddd: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  /** Preenchido quando Tipo de Fundo = MONOCLASSE (wizard de classe embutido). */
  classData?: NewClassData;
}

const emit = defineEmits<{ close: []; create: [data: NewFidcData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const fundSteps: Step[] = [
  { key: 'info', label: 'Informações', icon: Info, hint: 'Dados cadastrais' },
  { key: 'contato', label: 'Contato', icon: Mail, hint: 'Contato & Endereço' },
];

const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);
const classPhase = ref(false);
const form = ref<NewFidcData>({
  tipoFundo: '',
  cnpj: '',
  tipoEmpresa: '',
  razaoSocial: '',
  nomeFantasia: '',
  dataConstituicao: '',
  naturezaLegal: '',
  atividadePrincipal: '',
  categoriaCvm: '',
  email: '',
  ddi: '+55',
  ddd: '',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
});

const isMono = computed(() => form.value.tipoFundo === 'MONOCLASSE');
const step = computed(() => fundSteps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLastFundStep = computed(() => stepIdx.value === fundSteps.length - 1);

function stepColor(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
}

function stepDimmed(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return !current && !done && hoverIdx.value !== i ? 0.55 : 1;
}

function handleFundNext() {
  if (!isLastFundStep.value) {
    stepIdx.value++;
    return;
  }
  if (isMono.value) {
    classPhase.value = true;
    return;
  }
  emit('create', { ...form.value });
}

function handleClassCreate(classData: NewClassData) {
  emit('create', { ...form.value, classData });
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
    @click="emit('close')"
  >
    <!-- Mono: após dados do fundo, embute o wizard de Nova Classe -->
    <div v-if="classPhase" style="width: 100%; max-width: 1280px" @click.stop>
      <CreateClassModal
        naked
        title="Novo FIDC · Classe"
        @back="classPhase = false"
        @close="emit('close')"
        @create="handleClassCreate"
      />
    </div>

    <div
      v-else
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
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Novo FIDC
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ fundSteps.length }}
            <template v-if="isMono"> · depois: cadastro da classe</template>
          </p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in fundSteps"
          :key="s.key"
          class="flex flex-col items-center justify-center"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: stepColor(i),
            opacity: stepDimmed(i),
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="hoverIdx = i"
          @mouseleave="hoverIdx = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <StepGrid v-if="step.key === 'info'">
          <SelectField label="Tipo de Fundo" :options="['MULTICLASSE', 'MONOCLASSE']" placeholder="Selecione" :span="4" v-model="form.tipoFundo" />
          <FormField label="CNPJ do Veículo" placeholder="00.000.000/0000-00" :span="5" v-model="form.cnpj" />
          <SelectField label="Tipo de Empresa" :options="['Fundo', 'Companhia', 'Sociedade Limitada']" placeholder="Selecione" :span="3" v-model="form.tipoEmpresa" />

          <FormField label="Razão Social" placeholder="Razão social completa" :span="8" v-model="form.razaoSocial" />
          <FormField label="Nome Fantasia" placeholder="Ex: Ceres Agro I" :span="4" v-model="form.nomeFantasia" />

          <SelectField label="Natureza Legal" :options="['Condomínio Fechado', 'Condomínio Aberto', 'Sociedade Anônima']" placeholder="Selecione" :span="4" v-model="form.naturezaLegal" />
          <FormField label="Atividade Principal" placeholder="Direitos Creditórios" :span="5" v-model="form.atividadePrincipal" />
          <FormField label="Data de Constituição" type="date" :span="3" v-model="form.dataConstituicao" />

          <SelectField label="Categoria CVM" :options="['FIDC', 'FIDC-NP', 'FIDC Agro']" placeholder="Selecione" :span="12" v-model="form.categoriaCvm" />
        </StepGrid>

        <div v-else-if="step.key === 'contato'" class="flex flex-col" style="gap: 20px">
          <div>
            <SectionTitle :icon="Phone">Contato</SectionTitle>
            <StepGrid>
              <FormField label="E-mail do Veículo" placeholder="contato@fidc.com.br" type="email" :span="6" v-model="form.email" />
              <FormField label="DDI" placeholder="+55" :span="2" v-model="form.ddi" />
              <FormField label="DDD" placeholder="11" :span="1" v-model="form.ddd" />
              <FormField label="Telefone" placeholder="0000-0000" :span="3" v-model="form.telefone" />
            </StepGrid>
          </div>
          <div>
            <SectionTitle :icon="MapPin">Endereço</SectionTitle>
            <StepGrid>
              <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.cep" />
              <FormField label="Endereço" placeholder="Av. Brigadeiro Faria Lima" :span="9" v-model="form.endereco" />
              <FormField label="Número" placeholder="—" :span="2" v-model="form.numero" />
              <FormField label="Complemento" placeholder="Sala 101" :span="4" v-model="form.complemento" />
              <FormField label="Bairro" placeholder="—" :span="6" v-model="form.bairro" />
              <FormField label="Cidade" placeholder="—" :span="5" v-model="form.cidade" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
              <FormField label="País" placeholder="Brasil" :span="4" v-model="form.pais" />
            </StepGrid>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px" @click="isFirst ? emit('close') : stepIdx--">
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ fundSteps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLastFundStep && !isMono ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLastFundStep && !isMono ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="handleFundNext"
        >
          {{ isLastFundStep && !isMono ? 'Finalizar Cadastro' : isLastFundStep && isMono ? 'Cadastrar Classe' : 'Próxima Etapa' }}
          <Check v-if="isLastFundStep && !isMono" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### FidcCard

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Wallet, Clock } from 'lucide-vue-next';
import { brl, type Fidc } from '../data/fidcsData';
import ShortKPI from './fidc-card/ShortKPI.vue';

const props = defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{ open: [id: string] }>();

const hover = ref(false);

const catColor = computed(() =>
  props.fidc.category === 'MONOCLASSE'
    ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
    : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
);
</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '16px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', fidc.id)"
  >
    <!-- Topo: FIDC tag + CNPJ + status -->
    <div class="flex items-center justify-between">
      <div class="flex items-center" style="gap: 10px">
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            background: var(--gci-light);
            color: var(--gci-base);
          "
        >
          FIDC
        </span>
        <span style="font-size: var(--text-xs); color: var(--text-muted)">
          {{ fidc.cnpj }}
        </span>
      </div>
      <span
        class="flex items-center"
        style="
          gap: 6px;
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--success-dark);
          background: var(--success-light);
          padding: 4px 10px;
          border-radius: 9999px;
        "
      >
        <span
          style="
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: var(--success-base);
            animation: pulse 2s ease-in-out infinite;
          "
        />
        EM ANDAMENTO
      </span>
    </div>

    <!-- Nome -->
    <div
      style="
        font-size: var(--text-md);
        font-weight: var(--weight-bold);
        color: var(--text-strong);
        line-height: 1.3;
        letter-spacing: -0.01em;
        min-height: 42px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      "
    >
      {{ fidc.name }}
    </div>

    <!-- Categoria tag -->
    <div>
      <span
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          background: catColor.bg,
          color: catColor.fg,
        }"
      >
        {{ fidc.category }}
      </span>
    </div>

    <!-- Carteira vs Vencido -->
    <div
      class="grid"
      style="
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 12px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <div>
        <div
          class="flex items-center"
          style="
            gap: 6px;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          <Wallet :size="12" /> Carteira
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ brl(fidc.carteira.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px">
          Títulos: <strong style="color: var(--text-default)">{{ fidc.carteira.titulos }}</strong>
        </div>
      </div>
      <div style="text-align: right">
        <div
          class="flex items-center"
          style="
            gap: 6px;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 4px;
            justify-content: flex-end;
          "
        >
          <Clock :size="12" /> Vencido
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--danger-base);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ brl(fidc.vencido.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px">
          Títulos:
          <strong style="color: var(--danger-base)">{{ fidc.vencido.titulos }}</strong>
        </div>
      </div>
    </div>

    <!-- Indicadores curto prazo -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 4px">
      <ShortKPI label="Venc. Hoje" :value="brl(fidc.vencendoHoje)" />
      <ShortKPI label="Venc. Mês" :value="brl(fidc.vencendoMes)" />
      <ShortKPI label="Confirmação" :value="brl(0)">
        <template #trailing>
          <span
            style="
              font-size: 10px;
              color: var(--success-base);
              font-weight: var(--weight-bold);
              margin-left: 4px;
            "
          >
            {{ fidc.confirmacaoPct.toString().replace('.', ',') }}%
          </span>
        </template>
      </ShortKPI>
    </div>
  </div>
</template>
```

### PLHero

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TrendingUp } from 'lucide-vue-next';
import { brl, type Fidc } from '../data/fidcsData';
import PLAuditModal from './pl-hero/PLAuditModal.vue';

defineProps<{ fidc: Fidc }>();

const showAudit = ref(false);
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
      cursor: pointer;
    "
    @click="showAudit = true"
  >
    <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
    <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />

    <!-- "Ver histórico" affordance — top-right corner -->
    <span
      class="flex items-center"
      style="
        position: absolute;
        top: 16px;
        right: 20px;
        z-index: 2;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.12em;
        color: rgba(255, 255, 255, 0.45);
        gap: 4px;
      "
    >
      <TrendingUp :size="12" /> VER HISTÓRICO
    </span>

    <div style="flex: 1; position: relative; z-index: 1">
      <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
        Patrimônio Líquido
      </div>
      <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
        {{ brl(fidc.pl) }}
      </div>
      <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
        Ref: {{ fidc.plRef }} • {{ fidc.plRefAgo }}
      </div>
    </div>
    <div class="flex items-center justify-center" style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1">
      <TrendingUp :size="26" />
    </div>
  </div>

  <PLAuditModal v-if="showAudit" :fidc="fidc" @close="showAudit = false" />
</template>
```

### TitlesTable

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type Title, type TitleStatus } from '../data/fidcsData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const statusTone: Record<TitleStatus, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

interface Props {
  rows: Title[];
  /** classId → class display label (e.g. { leite: 'LEITE', animais: 'ANIMAIS' }) */
  classMap?: Record<string, string>;
}

const props = defineProps<Props>();
const emit = defineEmits<{ open: [t: Title] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => props.rows, { defaultPageSize: 10 });

const hasClass = computed(() => !!props.classMap);

const cols = computed(() =>
  hasClass.value
    ? '0.5fr 1fr 0.65fr 1.5fr 1.5fr 0.95fr 1fr 0.9fr'
    : '1fr 0.7fr 1.6fr 1.6fr 1fr 1.1fr 1fr',
);

const rowHover = ref<string | null>(null);
</script>

<template>
  <div>
    <!-- Sem resultados -->
    <div
      v-if="!rows.length"
      style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Nenhum título encontrado.
    </div>

    <template v-else>
      <!-- Cabeçalho -->
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
        <div v-if="hasClass">Classe</div>
        <div>Nº Título</div>
        <div>Lastro</div>
        <div>Cedente</div>
        <div>Sacado</div>
        <div>Vencimento</div>
        <div style="text-align: right">VR. Nominal</div>
        <div style="text-align: center">Status</div>
      </div>

      <!-- Linhas -->
      <div
        v-for="t in pageItems"
        :key="t.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: rowHover === t.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @click="emit('open', t)"
        @mouseenter="rowHover = t.id"
        @mouseleave="rowHover = null"
      >
        <div v-if="hasClass && classMap?.[t.classId]">
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 4px 8px;
              border-radius: var(--radius-sm);
              background: var(--status-neutral-bg);
              color: var(--status-neutral-text);
              white-space: nowrap;
            "
          >
            {{ classMap[t.classId] }}
          </span>
        </div>
        <div v-else-if="hasClass" />

        <div
          style="
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          #{{ t.numero }}
        </div>

        <div>
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.10em;
              padding: 4px 8px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
            "
          >
            {{ t.lastro.replace('_', '-') }}
          </span>
        </div>

        <div>
          <div style="color: var(--text-strong); font-weight: var(--weight-semibold)">
            {{ t.cedente }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ t.cedenteCnpj }}
          </div>
        </div>

        <div>
          <div style="color: var(--text-strong); font-weight: var(--weight-semibold)">
            {{ t.sacado }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ t.sacadoCnpj }}
          </div>
        </div>

        <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ t.vencimento }}
        </div>

        <div
          :style="{
            fontWeight: 'var(--weight-bold)',
            color: t.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
          }"
        >
          {{ brl(t.vrNominal) }}
        </div>

        <div style="text-align: center">
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: statusTone[t.status].bg,
              color: statusTone[t.status].fg,
            }"
          >
            {{ t.status }}
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

## Components / create-class

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
      padding: 0 18px;
      background: var(--success-base);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.10em;
      gap: 8px;
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

interface ColDef {
  key: string;
  label: string;
  width: string;
  format?: (v: string) => string;
}

const props = defineProps<{
  cols: ColDef[];
  rows: T[];
  empty: string;
}>();

const emit = defineEmits<{ remove: [idx: number] }>();

const template = computed(() => `${props.cols.map((c) => c.width).join(' ')} 36px`);
const { page, pageSize, total, pageItems, clampedPage, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 5 },
);

function globalIndex(localIdx: number) {
  return (clampedPage.value - 1) * pageSize.value + localIdx;
}
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
      overflow: hidden;
    "
  >
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
      v-if="rows.length === 0"
      style="padding: 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      {{ empty }}
    </div>
    <template v-else>
      <div
        v-for="(r, i) in pageItems"
        :key="globalIndex(i)"
        class="ccm-row grid items-center"
        :style="{
          gridTemplateColumns: template,
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div
          v-for="(c, ci) in cols"
          :key="c.key"
          :style="{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: ci === 0 ? 'var(--weight-bold)' : 'var(--weight-regular)',
            color: ci === 0 ? 'var(--text-strong)' : 'var(--text-default)',
          }"
        >
          {{ c.format ? c.format(r[c.key]) : r[c.key] }}
        </div>
        <div style="text-align: center">
          <RowTrash @click="emit('remove', globalIndex(i))" />
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
    </template>
  </div>
</template>
```

### DynamicConcentration

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import SectionGroup from './SectionGroup.vue';
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';
import SelectField from './SelectField.vue';
import AddButton from './AddButton.vue';
import DataTable from './DataTable.vue';

type RowData = {
  tipo: string;
  descricao: string;
  limite: string;
};

interface FormData {
  tipo: string;
  limite: string;
}

const props = defineProps<{
  title: string;
  icon?: Component;
  qtdLabel: string;
  qtdPlaceholder: string;
  qtdOptions?: string[];
  qtdNumeric?: boolean;
  limitePlaceholder: string;
  rows: RowData[];
  form: FormData;
}>();

const emit = defineEmits<{
  'update:form': [v: FormData];
  add: [];
  remove: [idx: number];
}>();

function setTipo(v: string) {
  emit('update:form', { ...props.form, tipo: v });
}

function setLimite(v: string) {
  emit('update:form', { ...props.form, limite: v });
}
</script>

<template>
  <SectionGroup :title="title" :icon="icon">
    <div class="grid items-end" style="grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 16px">
      <div>
        <FieldLabel>{{ qtdLabel }}</FieldLabel>
        <SelectField v-if="qtdOptions" :options="qtdOptions" @change="setTipo" />
        <Input
          v-else
          :placeholder="qtdPlaceholder"
          :model-value="form.tipo"
          :type="qtdNumeric ? 'number' : 'text'"
          @update:model-value="setTipo"
        />
      </div>
      <div>
        <FieldLabel>Limite de Concentração (%)</FieldLabel>
        <Input :placeholder="limitePlaceholder" :model-value="form.limite" @update:model-value="setLimite" />
      </div>
      <AddButton @click="emit('add')" />
    </div>

    <DataTable
      :cols="[
        { key: 'tipo', label: 'Tipo', width: '0.7fr' },
        { key: 'descricao', label: 'Descrição', width: '1.6fr' },
        { key: 'limite', label: 'Limite (%)', width: '1fr', format: (v: string) => `${v}%` },
      ]"
      :rows="rows"
      empty="Nenhum registro adicionado."
      @remove="emit('remove', $event)"
    />
  </SectionGroup>
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
  defaultValue?: string;
}>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <Input v-model="model" :placeholder="placeholder" :type="type" :disabled="disabled" :default-value="defaultValue" />
  </div>
</template>
```

### Input

```vue
<script setup lang="ts">
const props = defineProps<{
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  defaultValue?: string;
}>();

const model = defineModel<string>();
if (model.value === undefined) {
  model.value = props.defaultValue ?? '';
}
</script>

<template>
  <input
    v-model="model"
    :placeholder="placeholder"
    :type="type"
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
  />
</template>
```

### ParticipantBlock

```vue
<script setup lang="ts">
import { computed } from 'vue';
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';

const props = defineProps<{
  title: string;
  nameLabel: string;
  docLabel: string;
  dateLabel: string;
  required?: boolean;
  toggleLabel?: string;
  toggleEnabled?: boolean;
}>();

const emit = defineEmits<{ toggle: [] }>();

const disabled = computed(() => (props.toggleLabel ? !props.toggleEnabled : false));
</script>

<template>
  <div
    :style="{
      padding: '20px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: disabled ? 'var(--border-default)' : 'var(--border-strong, var(--border-default))',
      borderRadius: 'var(--radius-lg)',
    }"
  >
    <div class="flex items-center" style="gap: 12px; margin-bottom: 16px">
      <div
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.18em',
          color: required || toggleEnabled ? 'var(--accent)' : 'var(--text-muted)',
          textTransform: 'uppercase',
          flex: 1,
        }"
      >
        {{ title }}
      </div>
      <span
        v-if="required"
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: var(--danger-light);
          color: var(--danger-dark);
        "
      >
        OBRIGATÓRIO
      </span>
      <button
        v-if="toggleLabel"
        class="flex items-center"
        style="gap: 10px; background: none; border: none; cursor: pointer"
        @click="emit('toggle')"
      >
        <span
          :style="{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: toggleEnabled ? 'var(--gci-base)' : 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          {{ toggleLabel }}
        </span>
        <span
          :style="{
            width: '36px',
            height: '20px',
            borderRadius: '9999px',
            background: toggleEnabled ? 'var(--gci-base)' : 'var(--neutral-300, #d4d4d8)',
            position: 'relative',
            transition: 'background var(--duration-base)',
          }"
        >
          <span
            :style="{
              position: 'absolute',
              top: '2px',
              left: toggleEnabled ? '18px' : '2px',
              width: '16px',
              height: '16px',
              background: '#fff',
              borderRadius: '9999px',
              transition: 'left var(--duration-base)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }"
          />
        </span>
      </button>
    </div>
    <div v-if="!disabled" class="flex flex-col" style="gap: 12px">
      <div>
        <FieldLabel>{{ nameLabel }}</FieldLabel>
        <Input placeholder="Razão social / nome comercial" />
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
        <div>
          <FieldLabel>{{ docLabel }}</FieldLabel>
          <Input placeholder="00.000.000/0000-00" />
        </div>
        <div>
          <FieldLabel>{{ dateLabel }}</FieldLabel>
          <Input type="date" />
        </div>
      </div>
    </div>
  </div>
</template>
```

### RadioPill

```vue
<script setup lang="ts">
defineProps<{ active: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :style="{
      padding: '10px 18px',
      borderRadius: 'var(--radius-full)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: active ? 'var(--gci-base)' : 'var(--border-default)',
      background: active ? 'var(--gci-light)' : 'var(--surface-card)',
      color: active ? 'var(--gci-base)' : 'var(--text-muted)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.10em',
      cursor: 'pointer',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
```

### RowTrash

```vue
<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <div class="ccm-trash" style="display: inline-flex">
    <button
      aria-label="Remover"
      style="
        width: 32px;
        height: 32px;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      "
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
import SectionTitle from './SectionTitle.vue';

defineProps<{ title: string; icon?: Component }>();
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
      padding: 20px;
      background: var(--surface-card);
    "
  >
    <SectionTitle :icon="icon">{{ title }}</SectionTitle>
    <slot />
  </div>
</template>
```

### SectionHelp

```vue
<template>
  <div
    style="
      font-size: var(--text-sm);
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: var(--leading-relaxed);
    "
  >
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

const emit = defineEmits<{ change: [v: string] }>();
const model = defineModel<string>();
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <div style="position: relative">
      <select
        v-model="model"
        style="
          height: 40px;
          padding-left: 14px;
          padding-right: 40px;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-md);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
          width: 100%;
          appearance: none;
        "
        @change="emit('change', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
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

### SimpleTable

```vue
<script setup lang="ts">
import FieldLabel from './FieldLabel.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: string; cols: string[]; rows: string[][] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.rows,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div>
    <FieldLabel>{{ title }}</FieldLabel>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
      "
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols.map(() => '1fr').join(' '),
          padding: '10px 14px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div v-for="c in cols" :key="c">{{ c }}</div>
      </div>
      <div
        v-if="rows.length === 0"
        style="padding: 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum registro
      </div>
      <template v-else>
        <div
          v-for="(r, i) in pageItems"
          :key="i"
          class="grid"
          :style="{
            gridTemplateColumns: cols.map(() => '1fr').join(' '),
            padding: '12px 14px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-default)',
          }"
        >
          <div v-for="(cell, j) in r" :key="j">{{ cell }}</div>
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
      </template>
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

## Components / create-fidc

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

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
}>();

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <FieldLabel>{{ label }}</FieldLabel>
    <input
      v-model="model"
      :placeholder="placeholder"
      :type="type"
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
    />
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

const model = defineModel<string>({ default: '' });
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

## Components / fidc-card

### ShortKPI

```vue
<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div>
    <div
      style="
        font-size: 9px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.12em;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 4px;
      "
    >
      {{ label }}
    </div>
    <div
      style="
        font-size: var(--text-sm);
        font-weight: var(--weight-semibold);
        color: var(--text-default);
        font-variant-numeric: tabular-nums;
      "
    >
      {{ value }}
      <slot name="trailing" />
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
import { gruposEmpresariais } from '@/features/cra/data/craData';
import {
  CESSAO_TIPOS,
  type Cessao,
  type CessaoTipo,
  type RoundStatus,
} from '../../data/fidcsData';
import SectionGroup from '../create-class/SectionGroup.vue';
import StepGrid from '../create-class/StepGrid.vue';
import FormField from '../create-class/FormField.vue';
import SelectField from '../create-class/SelectField.vue';
import ToggleRow from './ToggleRow.vue';

const GRUPO_OPTS = gruposEmpresariais.map((g) => g.nome);

const props = defineProps<{ cessao?: Cessao | null }>();
const emit = defineEmits<{ close: []; save: [Cessao] }>();

const isCreate = computed(() => !props.cessao?.id);

const nome = ref('');
const data = ref('');
const tipo = ref<CessaoTipo>('DESEMBOLSO');
const grupoEmpresarial = ref('');
const parametrizacao = ref('Padrão');
const taxaCessao = ref('');
const taxaDesconto = ref('');
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
    grupoEmpresarial.value = '';
    parametrizacao.value = 'Padrão';
    taxaCessao.value = '';
    taxaDesconto.value = '';
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
  data.value = c.data.includes('/') ? c.data.split('/').reverse().join('-') : c.data;
  tipo.value = c.tipo;
  grupoEmpresarial.value = c.grupoEmpresarial ?? '';
  parametrizacao.value = c.parametrizacao ?? 'Padrão';
  taxaCessao.value = c.taxaCessao != null ? String(c.taxaCessao) : '';
  taxaDesconto.value = c.taxaDesconto != null ? String(c.taxaDesconto) : '';
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

function formatDataOut(iso: string) {
  if (!iso) return '';
  if (iso.includes('/')) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function handleSave() {
  const taxa = parseFloat(taxaCessao.value.replace(',', '.')) || undefined;
  const desconto = parseFloat(taxaDesconto.value.replace(',', '.')) || undefined;
  const payload: Cessao = {
    id: props.cessao?.id ?? `ces-${Date.now()}`,
    nome: nome.value.trim() || 'Nova Cessão',
    data: formatDataOut(data.value),
    tipo: tipo.value,
    valorAberto: props.cessao?.valorAberto ?? 0,
    status: (props.cessao?.status ?? 'ABERTA') as RoundStatus,
    taxaCessao: taxa,
    valorPresente: props.cessao?.valorPresente,
    valorTotal: props.cessao?.valorTotal,
    temTermo: props.cessao?.temTermo,
    cedente: props.cessao?.cedente,
    grupoEmpresarial: grupoEmpresarial.value || undefined,
    aprovacaoTaxa: props.cessao?.aprovacaoTaxa,
    taxaDesconto: desconto,
    linkAssinatura: props.cessao?.linkAssinatura ?? '',
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
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            {{ isCreate ? 'Nova Cessão' : 'Editar Cessão' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            Parametrização da cessão no fundo · FIDC
          </p>
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

      <div style="flex: 1; overflow-y: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <SectionGroup :icon="FileText" title="Dados">
          <StepGrid>
            <FormField v-model="nome" label="Nome" placeholder="Nome da cessão" :span="6" />
            <FormField v-model="data" label="Data de Cessão" type="date" :span="3" />
            <SelectField v-model="tipo" label="Tipo de Cessão" :options="[...CESSAO_TIPOS]" :span="3" />
            <SelectField
              v-model="grupoEmpresarial"
              label="Grupo Empresarial"
              :options="GRUPO_OPTS"
              placeholder="Selecione"
              :span="6"
            />
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
            <FormField v-model="taxaDesconto" label="Taxa de Desconto (%)" placeholder="0,00" :span="3" />
            <FormField v-model="descontoAdicional" label="Desconto Adicional" placeholder="—" :span="3" />
            <SelectField
              v-model="tipoCalculo"
              label="Tipo de Cálculo"
              :options="['Deságio por valor nominal', 'Ágio', 'Sem cálculo']"
              :span="3"
            />
          </StepGrid>
          <div style="margin-top: 16px">
            <ToggleRow label="Metodologia artesanal" :on="usoArtesanal" @toggle="usoArtesanal = !usoArtesanal" />
          </div>
          <StepGrid style="margin-top: 16px">
            <SelectField v-model="indicadorTaxa" label="Indicador" :options="['CDI', 'Indefinido']" :span="4" />
            <SelectField v-model="operadorTaxa" label="Operador" :options="['Percentual', 'Spread', 'Indefinido']" :span="4" />
            <SelectField v-model="frequenciaTaxa" label="Frequência" :options="['Diário', 'Mensal', 'Anual']" :span="4" />
            <SelectField v-model="baseCalculo" label="Base" :options="['252', '360', '30']" :span="3" />
            <SelectField v-model="capitalizacao" label="Capitalização" :options="['Simples', 'Composto']" :span="3" />
            <SelectField v-model="inicioContagem" label="Início contagem" :options="['D+0', 'D+1']" :span="3" />
            <SelectField v-model="inicioCalculo" label="Início cálculo" :options="['Emissão', 'Cessão']" :span="3" />
          </StepGrid>
        </SectionGroup>

        <SectionGroup :icon="SlidersHorizontal" title="Flags">
          <div class="flex flex-col" style="gap: 12px">
            <ToggleRow label="Coobrigação" :on="coobrigacao" @toggle="coobrigacao = !coobrigacao" />
            <ToggleRow label="Obrigação de Recompra" :on="obrigacaoRecompra" @toggle="obrigacaoRecompra = !obrigacaoRecompra" />
            <ToggleRow label="Certificador de e-mail" :on="certificadorEmail" @toggle="certificadorEmail = !certificadorEmail" />
          </div>
        </SectionGroup>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
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

### ConfinaPromissoryModal

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch, type Component } from 'vue';
import {
  X,
  ChevronRight,
  Check,
  Info,
  FileText,
  PawPrint,
  Receipt,
  Users,
} from 'lucide-vue-next';
import { brl, gruposEmpresariais } from '@/features/cra/data/craData';
import {
  BASE_DAYS_OPTS,
  CONFINA_CATEGORIA_OPTS,
  CONFINA_RACA_OPTS,
  FAZENDAS_OPTS,
  simulatePromissoryNote,
  type ConfinaPreview,
} from '@/features/cra/data/simuladorData';
import StepGrid from '../create-class/StepGrid.vue';
import FormField from '../create-class/FormField.vue';
import SelectField from '../create-class/SelectField.vue';
import SectionGroup from '../create-class/SectionGroup.vue';
import SummaryItem from '../create-class/SummaryItem.vue';
import AddButton from '../create-class/AddButton.vue';
import Checkbox from '@/components/ui/Checkbox.vue';

defineProps<{ vehicleName: string }>();
const emit = defineEmits<{ close: []; created: [] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'operacao', label: 'Operação', icon: Info, hint: 'Dados da operação' },
  { key: 'promissoria', label: 'Promissória', icon: FileText, hint: 'Dados da promissória' },
  { key: 'animais', label: 'Animais', icon: PawPrint, hint: 'Categoria e lote' },
  { key: 'notas', label: 'Notas', icon: Receipt, hint: 'Notas fiscais e GTAs' },
  { key: 'parceiro', label: 'Parceiro', icon: Users, hint: 'Fazenda e testemunhas' },
];

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);

const form = reactive({
  grupo: gruposEmpresariais[0]?.nome ?? '',
  outorgado: '',
  qtdAnimais: '100',
  valorUnitario: '320',
  pesoLote: '1800',
  taxa: '1.85',
  emissao: '',
  vencimento: '',
  baseDias: '30',
  numeroTitulo: '',
  filial: '',
  feeMonitoramento: '0.5',
  prazoAssinatura: '5',
  vigenciaMeses: '12',
  certificadorEmail: true,
  categoria: CONFINA_CATEGORIA_OPTS[0],
  raca: CONFINA_RACA_OPTS[0],
  pesoMinIndividual: '12',
  pesoLoteKg: '',
  infos: [{ tipo: 'Bezerro', idade: '12-18', qtd: '50' }] as { tipo: string; idade: string; qtd: string }[],
  notas: [{ nf: '', gta: '' }] as { nf: string; gta: string }[],
  fazenda: FAZENDAS_OPTS[0],
  proprietario: '',
  posicaoAnexo: 'Final',
  testemunhas: '',
});

const preview = ref<ConfinaPreview | null>(null);
const grupoOpts = gruposEmpresariais.map((g) => g.nome);

watch(
  () => [form.qtdAnimais, form.valorUnitario, form.pesoLote, form.taxa, form.emissao, form.vencimento],
  () => {
    const qty = Number(form.qtdAnimais) || 0;
    const unit = Number(form.valorUnitario) || 0;
    const weight = Number(form.pesoLote) || 0;
    const rate = Number(form.taxa) || 0;
    if (!qty || !unit || !weight) {
      preview.value = null;
      return;
    }
    preview.value = simulatePromissoryNote({
      animalsQuantity: qty,
      unitValue: unit,
      batchWeightInArroba: weight,
      rate,
      issueDate: form.emissao,
      dueDate: form.vencimento,
    });
  },
  { immediate: true },
);

const step = computed(() => steps[stepIdx.value]);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function stepColor(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
}
function stepDimmed(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return !current && !done && hoverIdx.value !== i ? 0.55 : 1;
}

function addInfo() {
  form.infos.push({ tipo: '', idade: '', qtd: '' });
}
function removeInfo(i: number) {
  if (form.infos.length <= 1) return;
  form.infos.splice(i, 1);
}
function addNota() {
  form.notas.push({ nf: '', gta: '' });
}
function removeNota(i: number) {
  if (form.notas.length <= 1) return;
  form.notas.splice(i, 1);
}

function handleNext() {
  if (isLast.value) {
    emit('created');
    emit('close');
    return;
  }
  stepIdx.value++;
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
        max-width: 1280px;
        max-height: calc(100vh - 64px);
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
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Termo Confina — Gerar Título
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ vehicleName }} · {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          type="button"
          class="flex flex-col items-center justify-center"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: stepColor(i),
            opacity: stepDimmed(i),
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="hoverIdx = i"
          @mouseleave="hoverIdx = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <template v-if="step.key === 'operacao'">
          <StepGrid>
            <SelectField v-model="form.grupo" label="Grupo empresarial" :options="grupoOpts" :span="6" />
            <FormField v-model="form.outorgado" label="Outorgado" placeholder="Nome / razão social" :span="6" />
            <FormField v-model="form.qtdAnimais" label="Qtd. animais" type="number" :span="3" />
            <FormField v-model="form.valorUnitario" label="Valor unitário @" type="number" :span="3" />
            <FormField v-model="form.pesoLote" label="Peso lote @" type="number" :span="3" />
            <FormField v-model="form.taxa" label="Taxa (% a.m.)" type="number" :span="3" />
            <FormField v-model="form.emissao" label="Emissão" type="date" :span="4" />
            <FormField v-model="form.vencimento" label="Vencimento" type="date" :span="4" />
            <SelectField v-model="form.baseDias" label="Base de cálculo (dias)" :options="[...BASE_DAYS_OPTS]" :span="4" />
          </StepGrid>
          <div v-if="preview" style="margin-top: 24px">
            <SectionGroup :icon="Info" title="Prévia da simulação">
              <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
                <SummaryItem label="Valor compra" :value="brl(preview.valorCompra)" />
                <SummaryItem label="Juros" :value="brl(preview.juros)" />
                <SummaryItem label="Valor nominal" :value="brl(preview.valorNominal)" />
                <SummaryItem label="Prazo" :value="`${preview.dias} dias`" />
              </div>
            </SectionGroup>
          </div>
        </template>

        <template v-else-if="step.key === 'promissoria'">
          <StepGrid>
            <FormField v-model="form.numeroTitulo" label="Número do título" :span="4" />
            <FormField v-model="form.filial" label="Filial / Outorgante" :span="8" />
            <FormField v-model="form.feeMonitoramento" label="FEE monitoramento (%)" type="number" :span="4" />
            <FormField v-model="form.prazoAssinatura" label="Prazo assinatura (dias)" type="number" :span="4" />
            <FormField v-model="form.vigenciaMeses" label="Vigência contrato (meses)" type="number" :span="4" />
            <div
              class="flex items-center"
              style="gap: 12px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg); grid-column: span 12; cursor: pointer"
              @click="form.certificadorEmail = !form.certificadorEmail"
            >
              <Checkbox :checked="form.certificadorEmail" @change="form.certificadorEmail = !form.certificadorEmail" />
              <span style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">
                Certificador de e-mail
              </span>
            </div>
          </StepGrid>
        </template>

        <template v-else-if="step.key === 'animais'">
          <StepGrid>
            <SelectField v-model="form.categoria" label="Categoria" :options="[...CONFINA_CATEGORIA_OPTS]" :span="4" />
            <SelectField v-model="form.raca" label="Raça" :options="[...CONFINA_RACA_OPTS]" :span="4" />
            <FormField v-model="form.pesoMinIndividual" label="Peso mín. individual @" type="number" :span="4" />
            <FormField v-model="form.pesoLote" label="Peso lote @" type="number" :span="6" />
            <FormField v-model="form.pesoLoteKg" label="Peso lote (kg)" type="number" placeholder="Opcional" :span="6" />
          </StepGrid>
          <div style="margin-top: 24px">
            <div class="flex items-center justify-between" style="margin-bottom: 12px">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
                Informações adicionais
              </div>
              <AddButton @click="addInfo" />
            </div>
            <div class="flex flex-col" style="gap: 12px">
              <StepGrid v-for="(info, i) in form.infos" :key="i">
                <FormField v-model="info.tipo" label="Tipo" :span="4" />
                <FormField v-model="info.idade" label="Idade" :span="4" />
                <FormField v-model="info.qtd" label="Qtd" type="number" :span="3" />
                <div style="grid-column: span 1; display: flex; align-items: flex-end">
                  <button
                    type="button"
                    :disabled="form.infos.length <= 1"
                    style="height: 40px; width: 100%; background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                    @click="removeInfo(i)"
                  >
                    ×
                  </button>
                </div>
              </StepGrid>
            </div>
          </div>
        </template>

        <template v-else-if="step.key === 'notas'">
          <div class="flex items-center justify-between" style="margin-bottom: 16px">
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
              Informe ao menos uma nota fiscal. GTA é opcional.
            </p>
            <AddButton @click="addNota" />
          </div>
          <div class="flex flex-col" style="gap: 12px">
            <StepGrid v-for="(n, i) in form.notas" :key="i">
              <FormField v-model="n.nf" label="Nota fiscal" :span="5" />
              <FormField v-model="n.gta" label="GTA" placeholder="Opcional" :span="6" />
              <div style="grid-column: span 1; display: flex; align-items: flex-end">
                <button
                  type="button"
                  :disabled="form.notas.length <= 1"
                  style="height: 40px; width: 100%; background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                  @click="removeNota(i)"
                >
                  ×
                </button>
              </div>
            </StepGrid>
          </div>
        </template>

        <template v-else>
          <StepGrid>
            <SelectField v-model="form.fazenda" label="Fazenda" :options="[...FAZENDAS_OPTS]" :span="8" />
            <SelectField v-model="form.posicaoAnexo" label="Posição do anexo" :options="['Início', 'Final']" :span="4" />
            <FormField v-model="form.proprietario" label="Proprietário" :span="6" />
            <FormField v-model="form.testemunhas" label="Testemunhas" placeholder="Separar por vírgula" :span="6" />
          </StepGrid>
        </template>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="stepIdx === 0 ? emit('close') : (stepIdx = Math.max(0, stepIdx - 1))"
        >
          {{ stepIdx === 0 ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          type="button"
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
          @click="handleNext"
        >
          {{ isLast ? 'Gerar Título' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### EditarParametrosGrupoModal

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, SlidersHorizontal } from 'lucide-vue-next';
import type { GrupoEmpresarialVinculo } from '../../data/fidcsData';
import FormField from '../create-class/FormField.vue';
import StepGrid from '../create-class/StepGrid.vue';

const props = defineProps<{ grupo: GrupoEmpresarialVinculo | null }>();
const emit = defineEmits<{ close: []; save: [GrupoEmpresarialVinculo] }>();

const limite = ref('');
const juros = ref('');
const desconto = ref('');

watch(
  () => props.grupo,
  (g) => {
    if (!g) return;
    limite.value = String(g.limite);
    juros.value = g.juros != null ? String(g.juros) : '';
    desconto.value = g.desconto != null ? String(g.desconto) : '';
  },
  { immediate: true },
);

function parseNum(v: string) {
  return parseFloat(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handleSave() {
  if (!props.grupo) return;
  emit('save', {
    ...props.grupo,
    limite: parseNum(limite.value),
    juros: parseNum(juros.value),
    desconto: parseNum(desconto.value),
  });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px"
    @click.self="emit('close')"
  >
    <div
      style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 6px">
            FIDC · Grupo Empresarial
          </div>
          <h3 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); gap: 10px">
            <SlidersHorizontal :size="22" style="color: var(--gci-base)" />
            Editar Parâmetros
          </h3>
          <p v-if="grupo" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">{{ grupo.nome }}</p>
        </div>
        <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px" @click="emit('close')">
          <X :size="22" />
        </button>
      </div>

      <div style="padding: 24px 28px; background: var(--surface-sunken)">
        <StepGrid>
          <FormField v-model="limite" label="Limite (R$)" type="number" :span="6" />
          <FormField v-model="juros" label="Juros (% a.m.)" type="number" :span="3" />
          <FormField v-model="desconto" label="Desconto (%)" type="number" :span="3" />
        </StepGrid>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button type="button" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px" @click="emit('close')">
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

### EditarParcelasModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Pencil } from 'lucide-vue-next';
import { brl, type ParcelaCronograma } from '../../data/fidcsData';
import EditableCell from './editar-parcelas/EditableCell.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ cronograma: ParcelaCronograma[] }>();
const emit = defineEmits<{ close: []; update: [cronograma: ParcelaCronograma[]] }>();

const rows = ref<ParcelaCronograma[]>(props.cronograma.map((c) => ({ ...c })));

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => rows.value, { defaultPageSize: 5 });

const pageStartIndex = computed(() => (page.value - 1) * pageSize.value);

function setValor(i: number, field: 'amortizacao' | 'juros', value: string) {
  const num = Number(value.replace(',', '.')) || 0;
  rows.value = rows.value.map((r, idx) => (idx === i ? { ...r, [field]: num } : r));
}

const totalAmortizacao = computed(() => rows.value.reduce((acc, r) => acc + r.amortizacao, 0));
const totalJuros = computed(() => rows.value.reduce((acc, r) => acc + r.juros, 0));
const totalGeral = computed(() => totalAmortizacao.value + totalJuros.value);
</script>

<template>
  <div
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
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 900px;
        max-height: 86vh;
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
            Editar Parcelas
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Ajuste os valores de amortização e juros de cada parcela do cronograma
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="grid" style="grid-template-columns: 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
            <div>Vencimento</div><div>Amortização</div><div>Juros</div>
          </div>
          <div
            v-for="(r, i) in pageItems"
            :key="pageStartIndex + i"
            class="grid items-center"
            style="grid-template-columns: 1.2fr 1fr 1fr; padding: 10px 16px; border-top: 1px solid var(--border-default)"
          >
            <div style="font-size: var(--text-sm); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ r.vencimento }}</div>
            <EditableCell :value="r.amortizacao" @change="(v) => setValor(pageStartIndex + i, 'amortizacao', v)" />
            <EditableCell :value="r.juros" @change="(v) => setValor(pageStartIndex + i, 'juros', v)" />
          </div>
          <div class="grid items-center" style="grid-template-columns: 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); background: var(--surface-sunken); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            <div>Total</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(totalAmortizacao) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(totalJuros) }}</div>
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
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          Valor Total: <span style="color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(totalGeral) }}</span>
        </div>
        <div class="flex items-center" style="gap: 12px">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            class="flex items-center"
            style="gap: 8px; height: 44px; padding: 0 24px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; background: var(--action-primary-bg); color: #fff"
            @click="emit('update', rows)"
          >
            <Pencil :size="15" /> ATUALIZAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

### EstornoPagamentoModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import { brl, type PagamentoTitulo } from '../../data/fidcsData';

const props = defineProps<{ pagamento: PagamentoTitulo }>();
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
        Estornar pagamento de {{ brl(pagamento.valorAmortizacao) }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 18px">
        Esta ação é crítica e não pode ser desfeita. O pagamento de <strong>{{ pagamento.data }}</strong> ({{ pagamento.tipoPagamento }}) será marcado como estornado no histórico do título.
      </p>

      <div style="margin-bottom: 22px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--danger-base); text-transform: uppercase; margin-bottom: 6px">
          * Justificativa do estorno
        </div>
        <textarea
          v-model="justificativa"
          placeholder="Descreva o motivo do estorno..."
          rows="3"
          style="
            width: 100%;
            padding: 10px 14px;
            resize: vertical;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
            font-family: inherit;
          "
        />
      </div>

      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '42px',
            padding: '0 18px',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-sm)',
            background: canConfirm ? 'var(--action-danger-bg)' : 'var(--neutral-200)',
            color: canConfirm ? 'var(--action-danger-text)' : 'var(--text-disabled)',
          }"
          @click="handleConfirm"
        >
          Confirmar estorno
        </button>
      </div>
    </div>
  </div>
</template>
```

### SimularValorizacaoModal

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Calculator, Download } from 'lucide-vue-next';
import { brl, type Title, type ParcelaCronograma } from '../../data/fidcsData';
import FieldLabel from './simular-valorizacao/FieldLabel.vue';
import FooterTotal from './simular-valorizacao/FooterTotal.vue';
import ToggleRow from './simular-valorizacao/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: Title; cronograma: ParcelaCronograma[] }>();
const emit = defineEmits<{ close: [] }>();

interface LinhaSimulacao {
  data: string;
  saldoDevedor: number;
  juros: number;
  jurosAcumulado: number;
  valorPresente: number;
  amortizacaoPaga: number;
  jurosPago: number;
  valorPago: number;
  fatorCdi: number;
  fatorTaxa: number;
  fatorTotal: number;
}

function simular(title: Title, cronograma: ParcelaCronograma[]): LinhaSimulacao[] {
  let saldo = title.vrNominal;
  let jurosAcumulado = 0;
  let amortPaga = 0;
  let jurosPago = 0;
  return cronograma.map((c, i) => {
    jurosAcumulado += c.juros;
    saldo = Math.max(saldo - c.amortizacao, 0);
    amortPaga += c.amortizacao;
    jurosPago += c.juros;
    const fatorCdi = 1 + 0.0002 * (i + 1);
    const fatorTaxa = 1 + 0.00035 * (i + 1);
    return {
      data: c.vencimento,
      saldoDevedor: saldo,
      juros: c.juros,
      jurosAcumulado,
      valorPresente: saldo + jurosAcumulado,
      amortizacaoPaga: amortPaga,
      jurosPago,
      valorPago: c.amortizacao + c.juros,
      fatorCdi,
      fatorTaxa,
      fatorTotal: fatorCdi * fatorTaxa,
    };
  });
}

const dataSimular = ref('');
const cenarioSimulado = ref(false);
const linhas = ref<LinhaSimulacao[] | null>(null);

function handleSimular() {
  linhas.value = simular(props.title, props.cronograma);
  setPage(1);
}

const totalJuros = computed(() => linhas.value?.at(-1)?.jurosPago ?? 0);
const totalPago = computed(() => (linhas.value ? linhas.value.reduce((acc, l) => acc + l.valorPago, 0) : 0));

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => linhas.value ?? [], { defaultPageSize: 5 });
</script>

<template>
  <div
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
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1120px;
        height: 86vh;
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
            Simular Valorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Título #{{ title.numero }} · projeção de saldo devedor e juros acumulados
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 24px">
          <div class="grid items-end" style="grid-template-columns: 1fr 1fr auto auto; gap: 14px">
            <div>
              <FieldLabel>Data para simular</FieldLabel>
              <input
                v-model="dataSimular"
                type="text"
                placeholder="dd/mm/aaaa"
                style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
              />
            </div>
            <ToggleRow label="Cenário simulado" :on="cenarioSimulado" @toggle="cenarioSimulado = !cenarioSimulado" />
            <button
              class="flex items-center"
              style="gap: 8px; height: 40px; padding: 0 20px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
              @click="handleSimular"
            >
              <Calculator :size="15" /> SIMULAR
            </button>
            <button
              class="flex items-center"
              style="gap: 8px; height: 40px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
            >
              <Download :size="14" /> GERAR CSV
            </button>
          </div>

          <div
            v-if="!linhas"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)"
          >
            <Calculator :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhuma simulação gerada</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Informe a data desejada e clique em "Simular" para projetar a valorização do título.</div>
          </div>
          <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div style="overflow-x: auto">
              <div style="min-width: 1180px">
                <div class="grid" style="grid-template-columns: repeat(11, 1fr); padding: 10px 14px; background: var(--surface-sunken); font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
                  <div>Data</div><div>Saldo devedor</div><div>Juros</div><div>Juros acum.</div><div>Valor presente</div><div>Amort. paga</div><div>Juros pago</div><div>Valor pago</div><div>Fator CDI</div><div>Fator taxa</div><div>Fator total</div>
                </div>
                <div
                  v-for="(l, i) in pageItems"
                  :key="i"
                  class="grid items-center"
                  style="grid-template-columns: repeat(11, 1fr); padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
                >
                  <div style="color: var(--text-muted)">{{ l.data }}</div>
                  <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ brl(l.saldoDevedor) }}</div>
                  <div>{{ brl(l.juros) }}</div>
                  <div>{{ brl(l.jurosAcumulado) }}</div>
                  <div>{{ brl(l.valorPresente) }}</div>
                  <div>{{ brl(l.amortizacaoPaga) }}</div>
                  <div>{{ brl(l.jurosPago) }}</div>
                  <div style="font-weight: var(--weight-semibold)">{{ brl(l.valorPago) }}</div>
                  <div>{{ l.fatorCdi.toFixed(6) }}</div>
                  <div>{{ l.fatorTaxa.toFixed(6) }}</div>
                  <div>{{ l.fatorTotal.toFixed(6) }}</div>
                </div>
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
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; padding: 14px 20px; border-top: 1px solid var(--border-default); background: var(--surface-sunken)">
              <FooterTotal label="Amortização Paga" :value="brl(linhas.at(-1)?.amortizacaoPaga ?? 0)" />
              <FooterTotal label="Juros Pago" :value="brl(totalJuros)" />
              <FooterTotal label="Valor Total Pago" :value="brl(totalPago)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Fechar
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
import FormField from '../create-class/FormField.vue';

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
    style="position: fixed; inset: 0; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px"
    @click.self="emit('close')"
  >
    <div
      style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--gci-base); text-transform: uppercase; margin-bottom: 6px">
            FIDC · Grupo Empresarial
          </div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Subir Contrato Mãe
          </h3>
        </div>
        <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px" @click="emit('close')">
          <X :size="22" />
        </button>
      </div>

      <div style="padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <FormField v-model="dataFirma" label="Data firma" type="date" :span="12" />
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
            Contrato Mãe (PDF)
          </div>
          <label class="flex items-center" style="gap: 12px; padding: 16px; border: 2px dashed var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer">
            <Upload :size="20" style="color: var(--gci-base); flex-shrink: 0" />
            <div style="flex: 1; min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ fileName || 'Selecionar arquivo PDF' }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">Apenas arquivos .pdf</div>
            </div>
            <input type="file" accept=".pdf" style="display: none" @change="onFileChange" />
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button type="button" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px" @click="emit('close')">
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!fileName"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
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

## Components / modals / editar-parcelas

### EditableCell

```vue
<script setup lang="ts">
defineProps<{ value: number }>();
const emit = defineEmits<{ change: [v: string] }>();
</script>

<template>
  <input
    type="text"
    inputmode="decimal"
    :value="value.toFixed(2)"
    style="
      width: 100%;
      height: 36px;
      padding: 0 12px;
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      outline: none;
      font-size: var(--text-sm);
      color: var(--text-strong);
      font-variant-numeric: tabular-nums;
    "
    @blur="emit('change', ($event.target as HTMLInputElement).value)"
  />
</template>
```

### PageBtn

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ icon: Component; disabled?: boolean }>();
</script>

<template>
  <button
    :disabled="disabled"
    class="flex items-center justify-center"
    style="width: 30px; height: 30px; border-radius: var(--radius-md); background: var(--surface-card); border: 1px solid var(--border-default); color: var(--text-disabled); cursor: not-allowed"
  >
    <component :is="icon" :size="14" />
  </button>
</template>
```

## Components / modals / simular-valorizacao

### FieldLabel

```vue
<template>
  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
    <slot />
  </div>
</template>
```

### FooterTotal

```vue
<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div>
    <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ label }}</div>
    <div style="font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ value }}</div>
  </div>
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
      gap: '12px',
      height: '40px',
      padding: '0 14px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
    @click="emit('toggle')"
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ label }}</span>
    <div :style="{ position: 'relative', width: '36px', height: '20px', borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }">
      <span :style="{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '14px', height: '14px', borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }" />
    </div>
  </div>
</template>
```

## Components / pl-hero

### PLAuditModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { brl, type Fidc } from '../../data/fidcsData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{ close: [] }>();

const PL_AUDIT_LOG = [
  { dt: '22/06/2026 14:32', value: 16359182.1, user: 'Eduardo Santos' },
  { dt: '21/06/2026 09:15', value: 16120450.0, user: 'Mariana Costa' },
  { dt: '20/06/2026 16:48', value: 15987631.44, user: 'Eduardo Santos' },
  { dt: '18/06/2026 11:22', value: 15740200.0, user: 'Rafael Oliveira' },
  { dt: '15/06/2026 10:05', value: 15500000.0, user: 'Mariana Costa' },
  { dt: '10/06/2026 08:30', value: 15200000.0, user: 'Eduardo Santos' },
];

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => PL_AUDIT_LOG, { defaultPageSize: 5 });
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.50);
      backdrop-filter: blur(6px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
    @click="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 680px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: 800; color: var(--text-strong); letter-spacing: -0.02em; margin-bottom: 4px">
            Histórico — Patrimônio Líquido
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ fidc.name }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Log entries -->
      <div style="flex: 1; overflow-y: auto">
        <!-- Table header -->
        <div
          class="grid"
          style="
            grid-template-columns: 1.2fr 1.4fr 1fr;
            padding: 12px 28px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Data e Hora</div>
          <div style="text-align: center">Valor Atualizado</div>
          <div style="text-align: right">Responsável</div>
        </div>
        <div
          v-for="(entry, i) in pageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1.4fr 1fr; padding: 16px 28px; border-top: 1px solid var(--border-default)"
        >
          <div style="font-size: var(--text-sm); color: var(--text-muted); font-variant-numeric: tabular-nums">
            {{ entry.dt }}
          </div>
          <div style="text-align: center; font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(entry.value) }}
          </div>
          <div style="text-align: right; font-size: var(--text-sm); color: var(--text-default); font-weight: var(--weight-semibold)">
            {{ entry.user }}
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
    </div>
  </div>
</template>
```
