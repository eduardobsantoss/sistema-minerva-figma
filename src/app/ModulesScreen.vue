<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Topbar from '@/components/layout/Topbar.vue';
import DashboardView from './DashboardView.vue';
import Placeholder from './Placeholder.vue';
import { FidcScreen, FidcSimuladorScreen, FidcRelatoriosScreen } from '@/features/fidc';
import { CraScreen, CraSimuladorScreen, CraRelatoriosScreen } from '@/features/cra';
import {
  CobrancaScreen,
  TitulosScreen,
  NotificacoesCessaoScreen,
  CobrancaDashboardScreen,
  ResultadoNotificacoesScreen,
  CobrancaRelatoriosScreen,
} from '@/features/cobranca';
import {
  SolicitacaoScreen,
  FundoPadraoScreen,
  RelatorioPedidosScreen,
  TaxasVeiculosScreen,
  ValidacoesConfigScreen,
} from '@/features/solicitacao-operacao';
import { PassivoScreen } from '@/features/passivo';
import { AtivosScreen } from '@/features/ativos';
import { ConfiguracoesScreen } from '@/features/configuracoes';

import {
  RatingsScreen,
  AgrupamentosScreen,
  GruposScreen,
  RelatoriosScreen,
  RiscoDashboardScreen,
} from '@/features/risco';

type View =
  | 'dashboard'
  | 'solicitacoes'
  | 'solicitacoes-fundo-padrao'
  | 'solicitacoes-relatorios'
  | 'solicitacoes-taxas-veiculos'
  | 'solicitacoes-validacoes'
  | 'ativos'
  | 'fidcs'
  | 'fidcs-simulador'
  | 'fidcs-relatorios'
  | 'cras'
  | 'cras-simulador'
  | 'cras-relatorios'
  | 'cobranca'
  | 'cobranca-titulos'
  | 'cobranca-dashboard'
  | 'cobranca-notif'
  | 'cobranca-notif-cessao'
  | 'cobranca-resultado-notif'
  | 'cobranca-rel'
  | 'risco-dashboard'
  | 'risco-grupos'
  | 'risco-ratings'
  | 'risco-agrupamentos'
  | 'risco-rel'
  | 'passivo'
  | 'colab'
  | 'rel'
  | 'conf';

const titleMap: Record<View, string> = {
  dashboard: 'Bem-vindo(a) ao Minerva Gestão',
  solicitacoes: 'Solicitação de Operação',
  'solicitacoes-fundo-padrao': 'Fundo Padrão',
  'solicitacoes-relatorios': 'Relatórios de Solicitações',
  'solicitacoes-taxas-veiculos': 'Taxas dos Veículos',
  'solicitacoes-validacoes': 'Validações',
  ativos: 'Ativos',
  fidcs: "Gestão de FIDC's",
  'fidcs-simulador': 'Simulador',
  'fidcs-relatorios': 'Relatórios',
  cras: "Gestão de CRA's",
  'cras-simulador': 'Simulador',
  'cras-relatorios': 'Relatórios',
  cobranca: 'Cobrança',
  'cobranca-titulos': 'Títulos',
  'cobranca-dashboard': 'Dashboard de Cobrança',
  'cobranca-notif': 'Notificações de Cobrança',
  'cobranca-notif-cessao': 'Notificações de Cessão',
  'cobranca-resultado-notif': 'Resultado de Notificações',
  'cobranca-rel': 'Relatórios de Cobrança',
  'risco-dashboard': 'Risco',
  'risco-grupos': 'Grupos Empresariais',
  'risco-ratings': 'Cadastro de Rating',
  'risco-agrupamentos': 'Agrupamentos de Limite',
  'risco-rel': 'Relatórios de Risco',
  passivo: 'Passivo',
  colab: 'Colaboradores',
  rel: 'Relatórios',
  conf: 'Configurações',
};

const VALID_VIEWS = new Set<View>([
  'dashboard', 'solicitacoes', 'solicitacoes-fundo-padrao', 'solicitacoes-relatorios', 'solicitacoes-taxas-veiculos', 'solicitacoes-validacoes',
  'ativos',
  'fidcs', 'fidcs-simulador', 'fidcs-relatorios',
  'cras', 'cras-simulador', 'cras-relatorios',
  'cobranca', 'cobranca-titulos', 'cobranca-dashboard', 'cobranca-notif', 'cobranca-notif-cessao', 'cobranca-resultado-notif', 'cobranca-rel',
  'risco-dashboard', 'risco-grupos', 'risco-ratings', 'risco-agrupamentos', 'risco-rel',
  'passivo', 'colab', 'rel', 'conf',
]);

function getViewFromUrl(): View {
  const v = new URLSearchParams(window.location.search).get('view') as View;
  return VALID_VIEWS.has(v) ? v : 'dashboard';
}

const LAPTOP_BREAKPOINT = 1366;

const view = ref<View>(getViewFromUrl());
const collapsed = ref(window.innerWidth <= LAPTOP_BREAKPOINT);
const openMenu = ref<string | null>((() => {
  const v = new URLSearchParams(window.location.search).get('view') ?? '';
  if (v.startsWith('cobranca')) return 'cobranca';
  if (v.startsWith('risco')) return 'risco';
  if (v.startsWith('solicitacoes')) return 'solicitacoes';
  if (v.startsWith('cras')) return 'cras';
  if (v.startsWith('fidcs')) return 'fidcs';
  return null;
})());
const userToggledSidebar = ref(false);

function handlePopstate() {
  const v = new URLSearchParams(window.location.search).get('view') as View;
  if (VALID_VIEWS.has(v)) view.value = v;
}

function handleResize() {
  if (userToggledSidebar.value) return;
  collapsed.value = window.innerWidth <= LAPTOP_BREAKPOINT;
}

onMounted(() => {
  window.addEventListener('popstate', handlePopstate);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopstate);
  window.removeEventListener('resize', handleResize);
});

function handleNavigate(key: string) {
  view.value = key as View;
}

function onToggleMenu(key: string) {
  openMenu.value = openMenu.value === key ? null : key;
}

function handleToggleSidebar() {
  userToggledSidebar.value = true;
  collapsed.value = !collapsed.value;
}

function handleModuleClick(title: string) {
  if (title === 'Solicitação de Operação') {
    view.value = 'solicitacoes';
    openMenu.value = 'solicitacoes';
  } else if (title === 'Ativos') {
    view.value = 'ativos';
  } else if (title === "FIDC's") {
    view.value = 'fidcs';
    openMenu.value = 'fidcs';
  } else if (title === "CRA's") {
    view.value = 'cras';
    openMenu.value = 'cras';
  } else if (title === 'Cobrança') {
    view.value = 'cobranca-dashboard';
    openMenu.value = 'cobranca';
  } else if (title === 'Risco') {
    view.value = 'risco-dashboard';
    openMenu.value = 'risco';
  } else if (title === 'Passivo') {
    view.value = 'passivo';
  }
}
</script>

<template>
  <div
    class="flex w-full"
    style="height: 100vh; overflow: hidden; background: var(--surface-page)"
  >
    <Sidebar
      :active="view"
      :collapsed="collapsed"
      :open-menu="openMenu"
      @navigate="handleNavigate"
      @toggle="handleToggleSidebar"
      @toggle-menu="onToggleMenu"
    />

    <div class="flex flex-col" style="flex: 1; min-width: 0; min-height: 0">
      <Topbar :title="titleMap[view]" />

      <main class="overflow-auto" style="flex: 1; padding: var(--main-padding)">
        <div style="max-width: 1456px; margin: 0 auto">
          <DashboardView v-if="view === 'dashboard'" @module-click="handleModuleClick" />
          <SolicitacaoScreen v-else-if="view === 'solicitacoes'" />
          <FundoPadraoScreen v-else-if="view === 'solicitacoes-fundo-padrao'" />
          <RelatorioPedidosScreen v-else-if="view === 'solicitacoes-relatorios'" />
          <TaxasVeiculosScreen v-else-if="view === 'solicitacoes-taxas-veiculos'" />
          <ValidacoesConfigScreen v-else-if="view === 'solicitacoes-validacoes'" />
          <AtivosScreen v-else-if="view === 'ativos'" />
          <FidcScreen v-else-if="view === 'fidcs'" />
          <FidcSimuladorScreen v-else-if="view === 'fidcs-simulador'" />
          <FidcRelatoriosScreen v-else-if="view === 'fidcs-relatorios'" />
          <CraScreen v-else-if="view === 'cras'" />
          <CraSimuladorScreen v-else-if="view === 'cras-simulador'" />
          <CraRelatoriosScreen v-else-if="view === 'cras-relatorios'" />
          <TitulosScreen v-else-if="view === 'cobranca-titulos'" />
          <CobrancaDashboardScreen
            v-else-if="view === 'cobranca-dashboard'"
            @navigate="handleNavigate"
          />
          <CobrancaScreen v-else-if="view === 'cobranca-notif'" />
          <NotificacoesCessaoScreen v-else-if="view === 'cobranca-notif-cessao'" />
          <ResultadoNotificacoesScreen v-else-if="view === 'cobranca-resultado-notif'" />
          <CobrancaRelatoriosScreen v-else-if="view === 'cobranca-rel'" />
          <RatingsScreen v-else-if="view === 'risco-ratings'" />
          <AgrupamentosScreen v-else-if="view === 'risco-agrupamentos'" />
          <GruposScreen v-else-if="view === 'risco-grupos'" />
          <RelatoriosScreen v-else-if="view === 'risco-rel'" />
          <RiscoDashboardScreen v-else-if="view === 'risco-dashboard'" />
          <PassivoScreen v-else-if="view === 'passivo'" />
          <ConfiguracoesScreen v-else-if="view === 'conf'" />
          <Placeholder v-else :name="titleMap[view]" />
        </div>
      </main>
    </div>
  </div>
</template>
