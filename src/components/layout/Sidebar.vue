<script setup lang="ts">
import { ref, type Component } from 'vue';
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
} from 'lucide-vue-next';
import gciLogoMark from '@/assets/gci-logo-mark.png';
import gciLogoFull from '@/assets/gci-logo-full.png';

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
  { key: 'solicitacoes', label: 'Solicitação de Operação', icon: ClipboardList },
  { key: 'fidcs', label: "FIDC's", icon: Landmark },
  { key: 'cras', label: "CRA's", icon: Briefcase },
  {
    key: 'cobranca',
    label: 'Cobrança',
    icon: Receipt,
    children: [
      { key: 'cobranca-notif', label: 'Notificações de Cobrança', icon: BellRing },
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

const hoveredKey = ref<string | null>(null);

function isAnyChildActive(it: NavItem) {
  return !!it.children?.length && it.children.some((c) => c.key === props.active);
}

function handleItemClick(it: NavItem) {
  if (it.children?.length && !props.collapsed) {
    emit('toggleMenu', it.key);
  } else {
    emit('navigate', it.children?.length ? it.children[0].key : it.key);
  }
}
</script>

<template>
  <aside
    class="relative flex flex-col"
    :style="{
      width: collapsed ? COLLAPSED + 'px' : EXPANDED,
      background: 'var(--gci-base)',
      padding: collapsed ? '24px 12px 16px' : '24px 16px 16px',
      boxShadow: '6px 0 24px rgba(15,23,42,0.12)',
      transition:
        'width var(--duration-slow) var(--ease-standard), padding var(--duration-slow) var(--ease-standard)',
      flexShrink: 0,
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
        z-index: 10;
        transition: background var(--duration-fast);
      "
      @click="emit('toggle')"
    >
      <ChevronRight v-if="collapsed" :size="14" />
      <ChevronLeft v-else :size="14" />
    </button>

    <!-- Nav -->
    <nav class="flex flex-col" style="gap: 4px">
      <div v-for="it in items" :key="it.key">
        <button
          class="sidebar-nav-btn relative flex items-center"
          :class="{ 'sidebar-nav-btn--active': it.key === active || isAnyChildActive(it) }"
          :style="{
            gap: '16px',
            padding: collapsed ? '12px 0' : '12px',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-xl)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition:
              'background var(--duration-fast), color var(--duration-fast), padding var(--duration-slow)',
          }"
          @click="handleItemClick(it)"
          @mouseenter="collapsed && (hoveredKey = it.key)"
          @mouseleave="hoveredKey = null"
        >
          <div
            v-if="collapsed && hoveredKey === it.key"
            class="flex items-center"
            style="
              position: absolute;
              left: 100%;
              top: 50%;
              transform: translateY(-50%);
              margin-left: 14px;
              z-index: 100;
              pointer-events: none;
            "
          >
            <div
              style="
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 5px solid var(--surface-card);
              "
            />
            <div
              style="
                background: var(--surface-card);
                color: var(--text-strong);
                font-size: var(--text-xs);
                font-weight: var(--weight-semibold);
                padding: 7px 12px;
                border-radius: var(--radius-md);
                white-space: nowrap;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--border-default);
              "
            >
              {{ it.label }}
            </div>
          </div>
          <span
            v-if="it.key === active || isAnyChildActive(it)"
            :style="{
              position: 'absolute',
              left: collapsed ? '-12px' : '0',
              top: '8px',
              bottom: '8px',
              width: '4px',
              background: 'var(--agro-base)',
              borderRadius: '0 4px 4px 0',
              transition: 'left var(--duration-slow)',
            }"
          />
          <component :is="it.icon" :size="18" style="flex-shrink: 0" />
          <template v-if="!collapsed">
            <span style="flex: 1; white-space: nowrap">{{ it.label }}</span>
            <ChevronDown
              v-if="it.children?.length"
              :size="16"
              :style="{
                transform: openMenu === it.key && !collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--duration-base)',
              }"
            />
          </template>
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
        marginTop: 'auto',
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
</style>
