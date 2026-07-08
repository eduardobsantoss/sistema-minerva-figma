<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Topbar from '@/components/layout/Topbar.vue';
import DashboardView from './DashboardView.vue';
import Placeholder from './Placeholder.vue';
import { FidcScreen } from '@/features/fidc';
import { CraScreen } from '@/features/cra';
import { CobrancaScreen } from '@/features/cobranca';
import { SolicitacaoScreen } from '@/features/solicitacao-operacao';
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
  | 'fidcs'
  | 'cras'
  | 'cobranca'
  | 'cobranca-notif'
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
  fidcs: "Gestão de FIDC's",
  cras: "Gestão de CRA's",
  cobranca: 'Cobrança',
  'cobranca-notif': 'Notificações de Cobrança',
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
  'dashboard', 'solicitacoes', 'fidcs', 'cras', 'cobranca', 'cobranca-notif',
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
  } else if (title === "FIDC's") {
    view.value = 'fidcs';
  } else if (title === "CRA's") {
    view.value = 'cras';
  } else if (title === 'Cobrança') {
    view.value = 'cobranca-notif';
    openMenu.value = 'cobranca';
  } else if (title === 'Risco') {
    view.value = 'risco-grupos';
    openMenu.value = 'risco';
  }
}
</script>

<template>
  <div class="flex h-full w-full" style="background: var(--surface-page)">
    <Sidebar
      :active="view"
      :collapsed="collapsed"
      :open-menu="openMenu"
      @navigate="handleNavigate"
      @toggle="handleToggleSidebar"
      @toggle-menu="onToggleMenu"
    />

    <div class="flex flex-col" style="flex: 1; min-width: 0">
      <Topbar :title="titleMap[view]" />

      <main class="overflow-auto" style="flex: 1; padding: var(--main-padding)">
        <div style="max-width: 1456px; margin: 0 auto">
          <DashboardView v-if="view === 'dashboard'" @module-click="handleModuleClick" />
          <SolicitacaoScreen v-else-if="view === 'solicitacoes'" />
          <FidcScreen v-else-if="view === 'fidcs'" />
          <CraScreen v-else-if="view === 'cras'" />
          <CobrancaScreen v-else-if="view === 'cobranca-notif'" />
          <RatingsScreen v-else-if="view === 'risco-ratings'" />
          <AgrupamentosScreen v-else-if="view === 'risco-agrupamentos'" />
          <GruposScreen v-else-if="view === 'risco-grupos'" />
          <RelatoriosScreen v-else-if="view === 'risco-rel'" />
          <RiscoDashboardScreen v-else-if="view === 'risco-dashboard'" />
          <Placeholder v-else :name="titleMap[view]" />
        </div>
      </main>
    </div>
  </div>
</template>
