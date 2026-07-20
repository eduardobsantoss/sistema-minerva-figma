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
