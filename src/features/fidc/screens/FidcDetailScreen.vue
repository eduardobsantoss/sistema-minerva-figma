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
