<script setup lang="ts">
import { type Component } from 'vue';
import {
  LayoutDashboard,
  Landmark,
  Briefcase,
  Database,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Building2,
  BellRing,
  BarChart3,
  Receipt,
  ClipboardList,
  AlertCircle,
  Gauge,
  ScrollText,
  Layers,
  Wallet,
  Percent,
  ShieldCheck,
} from 'lucide-vue-next';
import gciLogoMark from '@/assets/gci-logo-mark.png';
import gciLogoFull from '@/assets/gci-logo-full.png';
import Tooltip from '@/components/ui/Tooltip.vue';

interface SubItem {
  key: string;
  label: string;
  icon: Component;
}

interface NavItem {
  key: string;
  label: string;
  icon: Component;
  children?: SubItem[];
}

const items: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    key: 'solicitacoes',
    label: 'Solicitação de Operação',
    icon: ClipboardList,
    children: [
      { key: 'solicitacoes', label: 'Solicitações', icon: ClipboardList },
      { key: 'solicitacoes-fundo-padrao', label: 'Fundo Padrão', icon: Wallet },
      { key: 'solicitacoes-relatorios', label: 'Relatórios', icon: BarChart3 },
      { key: 'solicitacoes-taxas-veiculos', label: 'Taxas dos Veículos', icon: Percent },
      { key: 'solicitacoes-validacoes', label: 'Validações', icon: ShieldCheck },
    ],
  },
  {
    key: 'fidcs',
    label: "FIDC's",
    icon: Landmark,
    children: [
      { key: 'fidcs', label: 'Gestão', icon: Landmark },
      { key: 'fidcs-simulador', label: 'Simulador', icon: Gauge },
      { key: 'fidcs-relatorios', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    key: 'cras',
    label: "CRA's",
    icon: Briefcase,
    children: [
      { key: 'cras', label: 'Gestão', icon: Briefcase },
      { key: 'cras-simulador', label: 'Simulador', icon: Gauge },
      { key: 'cras-relatorios', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    key: 'cobranca',
    label: 'Cobrança',
    icon: Receipt,
    children: [
      { key: 'cobranca-dashboard', label: 'Dashboard', icon: Gauge },
      { key: 'cobranca-titulos', label: 'Títulos', icon: FileText },
      { key: 'cobranca-notif', label: 'Notificações de Cobrança', icon: BellRing },
      { key: 'cobranca-notif-cessao', label: 'Notificações de Cessão', icon: ScrollText },
      { key: 'cobranca-resultado-notif', label: 'Resultado de Notificações', icon: Layers },
      { key: 'cobranca-rel', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    key: 'risco',
    label: 'Risco',
    icon: AlertCircle,
    children: [
      { key: 'risco-dashboard', label: 'Dashboard', icon: Gauge },
      { key: 'risco-grupos', label: 'Grupos Empresariais', icon: Building2 },
      { key: 'risco-ratings', label: 'Ratings', icon: Layers },
      { key: 'risco-agrupamentos', label: 'Agrupamentos de Limite', icon: ScrollText },
      { key: 'risco-rel', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  { key: 'passivo', label: 'Passivo', icon: Database },
  { key: 'colab', label: 'Colaboradores', icon: Users },
  { key: 'rel', label: 'Relatórios', icon: FileText },
  { key: 'conf', label: 'Configurações', icon: Settings },
];

const EXPANDED = 'var(--sidebar-width-expanded)';
const COLLAPSED = 80;

interface Props {
  active: string;
  collapsed: boolean;
  openMenu: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  navigate: [key: string];
  toggle: [];
  toggleMenu: [key: string];
}>();

function isAnyChildActive(it: NavItem) {
  return !!it.children?.length && it.children.some((c) => c.key === props.active);
}

function handleItemClick(it: NavItem) {
  if (it.children?.length) {
    if (!props.collapsed) emit('toggleMenu', it.key);
    emit('navigate', it.children[0].key);
  } else {
    emit('navigate', it.key);
  }
}
</script>

<template>
  <aside
    class="sidebar-shell relative flex flex-col"
    :style="{
      width: collapsed ? COLLAPSED + 'px' : EXPANDED,
      height: '100%',
      background: 'var(--gci-base)',
      padding: collapsed ? '24px 12px 16px' : '24px 16px 16px',
      boxShadow: '6px 0 24px rgba(15,23,42,0.12)',
      transition:
        'width var(--duration-slow) var(--ease-standard), padding var(--duration-slow) var(--ease-standard)',
      flexShrink: 0,
      position: 'relative',
      zIndex: 2,
    }"
  >
    <!-- Brand -->
    <button
      class="flex items-center"
      :style="{
        padding: '0 4px',
        marginBottom: '32px',
        height: '56px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        flexShrink: 0,
      }"
      @click="emit('navigate', 'dashboard')"
    >
      <img
        v-if="collapsed"
        :src="gciLogoMark"
        alt="GCI"
        :style="{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }"
      />
      <img
        v-else
        :src="gciLogoFull"
        alt="Grupo Ceres Investimentos"
        :style="{
          height: '56px',
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'cover',
          flexShrink: 0,
          borderRadius: 'var(--radius-md)',
        }"
      />
    </button>

    <!-- Botão colapsar -->
    <button
      :aria-label="collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
      style="
        position: absolute;
        right: -12px;
        top: 76px;
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        background: var(--agro-base);
        color: #fff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
        z-index: 30;
        transition: background var(--duration-fast);
      "
      @click="emit('toggle')"
    >
      <ChevronRight v-if="collapsed" :size="14" />
      <ChevronLeft v-else :size="14" />
    </button>

    <!-- Nav -->
    <nav class="sidebar-nav-scroll flex flex-col" style="gap: 4px; flex: 1; min-height: 0; overflow-y: auto">
      <div v-for="it in items" :key="it.key">
        <Tooltip
          v-if="collapsed"
          :content="it.label"
          variant="light"
          side="right"
          block
        >
          <button
            class="sidebar-nav-btn relative flex items-center"
            :class="{ 'sidebar-nav-btn--active': it.key === active || isAnyChildActive(it) }"
            style="
              gap: 16px;
              padding: 12px 0;
              width: 100%;
              justify-content: center;
              border-radius: var(--radius-xl);
              font-size: var(--text-sm);
              font-weight: var(--weight-medium);
              border: none;
              cursor: pointer;
              text-align: left;
              transition: background var(--duration-fast), color var(--duration-fast);
            "
            @click="handleItemClick(it)"
          >
            <span
              v-if="it.key === active || isAnyChildActive(it)"
              style="
                position: absolute;
                left: -12px;
                top: 8px;
                bottom: 8px;
                width: 4px;
                background: var(--agro-base);
                border-radius: 0 4px 4px 0;
              "
            />
            <component :is="it.icon" :size="18" style="flex-shrink: 0" />
          </button>
        </Tooltip>
        <button
          v-else
          class="sidebar-nav-btn relative flex items-center"
          :class="{ 'sidebar-nav-btn--active': it.key === active || isAnyChildActive(it) }"
          style="
            gap: 16px;
            padding: 12px;
            width: 100%;
            justify-content: flex-start;
            border-radius: var(--radius-xl);
            font-size: var(--text-sm);
            font-weight: var(--weight-medium);
            border: none;
            cursor: pointer;
            text-align: left;
            transition: background var(--duration-fast), color var(--duration-fast), padding var(--duration-slow);
          "
          @click="handleItemClick(it)"
        >
          <span
            v-if="it.key === active || isAnyChildActive(it)"
            style="
              position: absolute;
              left: 0;
              top: 8px;
              bottom: 8px;
              width: 4px;
              background: var(--agro-base);
              border-radius: 0 4px 4px 0;
            "
          />
          <component :is="it.icon" :size="18" style="flex-shrink: 0" />
          <span style="flex: 1; white-space: nowrap">{{ it.label }}</span>
          <ChevronDown
            v-if="it.children?.length"
            :size="16"
            :style="{
              transform: openMenu === it.key ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <!-- Submenu -->
        <div
          v-if="it.children?.length && !collapsed"
          :style="{
            overflow: 'hidden',
            maxHeight: openMenu === it.key ? it.children.length * 40 + 8 + 'px' : '0px',
            opacity: openMenu === it.key ? 1 : 0,
            transition:
              'max-height var(--duration-slow) var(--ease-standard), opacity var(--duration-base)',
          }"
        >
          <div class="flex flex-col" style="gap: 2px; padding: 6px 0 6px 36px; position: relative">
            <span
              style="
                position: absolute;
                left: 25px;
                top: 6px;
                bottom: 6px;
                width: 1px;
                background: rgba(255, 255, 255, 0.1);
              "
            />
            <button
              v-for="c in it.children"
              :key="c.key"
              class="sidebar-sub-btn relative flex items-center"
              :class="{ 'sidebar-sub-btn--active': active === c.key }"
              style="
                gap: 12px;
                padding: 8px 12px;
                border-radius: var(--radius-lg);
                border: none;
                cursor: pointer;
                font-size: var(--text-xs);
                font-weight: var(--weight-medium);
                text-align: left;
                transition: background var(--duration-fast), color var(--duration-fast);
              "
              @click="emit('navigate', c.key)"
            >
              <component :is="c.icon" :size="14" style="flex-shrink: 0" />
              <span style="white-space: nowrap">{{ c.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- User card -->
    <div
      class="flex items-center"
      :style="{
        marginTop: '12px',
        flexShrink: 0,
        gap: '12px',
        padding: collapsed ? '8px' : '12px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255,255,255,0.05)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.10)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'padding var(--duration-slow)',
      }"
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background: var(--agro-base);
          color: #fff;
          flex-shrink: 0;
        "
      >
        <User :size="16" />
      </div>
      <template v-if="!collapsed">
        <div style="flex: 1; min-width: 0; overflow: hidden">
          <div
            style="
              font-size: 12px;
              font-weight: var(--weight-bold);
              color: #fff;
              line-height: 1.2;
              white-space: nowrap;
            "
          >
            Eduardo Santos
          </div>
          <div
            style="
              font-size: 10px;
              color: rgba(255, 255, 255, 0.6);
              margin-top: 2px;
              white-space: nowrap;
            "
          >
            Administrador
          </div>
        </div>
        <button
          aria-label="Sair"
          style="
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            display: flex;
            padding: 4px;
          "
        >
          <LogOut :size="16" />
        </button>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-nav-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
}
.sidebar-nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.sidebar-nav-btn--active,
.sidebar-nav-btn--active:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--agro-base);
}

.sidebar-sub-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
}
.sidebar-sub-btn:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}
.sidebar-sub-btn--active,
.sidebar-sub-btn--active:hover {
  background: rgba(242, 125, 38, 0.12);
  color: var(--agro-base);
}

.sidebar-nav-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-nav-scroll::-webkit-scrollbar {
  display: none;
}
</style>
