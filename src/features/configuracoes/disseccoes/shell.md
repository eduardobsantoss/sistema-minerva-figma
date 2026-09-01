# Login / Shell / Home

> Shell global do Minerva: login, topbar, sidebar, home (DashboardView), ModuleCard, toasts, alerts e tela de erro.
> Preview em `src/features/shell/`; source canônico nos caminhos originais.
> Handoff: `docs/handoff/login-header-sidebar.md` · `docs/handoff/layout-shell.md`.

## Screens

### LoginScreen

```vue
<script setup lang="ts">
import { ref, computed, type CSSProperties } from 'vue';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-vue-next';
import ImageWithFallback from '@/components/figma/ImageWithFallback.vue';
import logoSrc from '@/assets/logo-azul-sem-bg.png';

const HERO_IMG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop';

const emit = defineEmits<{ submit: [] }>();

const showPwd = ref(false);
const focused = ref<string | null>(null);
const email = ref('');
const password = ref('');
function handle() {
  emit('submit');
}

const inputBase: CSSProperties = {
  background: 'var(--surface-sunken)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  height: '50px',
  color: 'var(--text-strong)',
};

const focusStyle: CSSProperties = {
  borderColor: 'var(--gci-base)',
  boxShadow: '0 0 0 4px rgba(8,60,74,0.06)',
};

const emailInputStyle = computed(() => ({
  ...inputBase,
  ...(focused.value === 'email' ? focusStyle : {}),
  width: '100%',
  paddingLeft: '44px',
  paddingRight: '16px',
  outline: 'none',
  fontSize: 'var(--text-base)',
  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
}));

const passwordInputStyle = computed(() => ({
  ...inputBase,
  ...(focused.value === 'password' ? focusStyle : {}),
  width: '100%',
  paddingLeft: '44px',
  paddingRight: '44px',
  outline: 'none',
  fontSize: 'var(--text-base)',
  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
}));

const submitButtonStyle = {
  width: '100%',
  height: '48px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--action-primary-bg)',
  color: 'var(--action-primary-text)',
  fontWeight: 'var(--weight-bold)',
  fontSize: 'var(--text-base)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '0 10px 24px -8px rgba(8,60,74,0.18)',
};
</script>

<template>
  <div
    class="grid h-full w-full"
    style="grid-template-columns: 560px 1fr; background: var(--surface-page)"
  >
    <!-- Coluna esquerda -->
    <div class="flex flex-col" style="background: var(--surface-card); padding: 56px 64px 48px">
      <div style="margin-bottom: auto">
        <ImageWithFallback
          :src="logoSrc"
          alt="Grupo Ceres Investimentos"
          :style="{ height: '96px', width: 'auto', objectFit: 'contain' }"
        />
      </div>

      <form style="max-width: 384px; width: 100%; margin-top: auto" @submit.prevent="handle">
        <h1
          style="
            font-size: 30px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.2;
            margin-bottom: 12px;
          "
        >
          Acesso Interno
        </h1>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            line-height: var(--leading-relaxed);
            margin-bottom: 32px;
          "
        >
          Bem-vindo à plataforma interna do Grupo Ceres. Acesse para gerenciar as operações do
          agronegócio.
        </p>

        <!-- Email -->
        <div style="margin-bottom: 20px">
          <label
            style="
              display: block;
              font-size: 11px;
              font-weight: var(--weight-bold);
              color: var(--neutral-400);
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-bottom: 8px;
            "
          >
            E-mail corporativo
          </label>
          <div class="relative">
            <Mail
              :size="18"
              style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
              "
            />
            <input
              v-model="email"
              type="email"
              placeholder="exemplo@empresa.com.br"
              :style="emailInputStyle"
              @focus="focused = 'email'"
              @blur="focused = null"
            />
          </div>
        </div>

        <!-- Senha -->
        <div style="margin-bottom: 24px">
          <div class="flex items-center justify-between" style="margin-bottom: 8px">
            <label
              style="
                font-size: 11px;
                font-weight: var(--weight-bold);
                color: var(--neutral-400);
                text-transform: uppercase;
                letter-spacing: 0.08em;
              "
            >
              Senha
            </label>
            <a
              href="#"
              style="
                font-size: var(--text-xs);
                color: var(--gci-base);
                font-weight: var(--weight-bold);
                text-decoration: none;
              "
            >
              Esqueceu a senha?
            </a>
          </div>
          <div class="relative">
            <Lock
              :size="18"
              style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
              "
            />
            <input
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="••••••••"
              :style="passwordInputStyle"
              @focus="focused = 'password'"
              @blur="focused = null"
            />
            <button
              type="button"
              aria-label="Mostrar senha"
              style="
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
              "
              @click="showPwd = !showPwd"
            >
              <EyeOff v-if="showPwd" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>

        <button type="submit" class="group btn-animated btn-primary" :style="submitButtonStyle">
          Entrar no Sistema
          <ChevronRight :size="18" />
        </button>

        <div
          style="
            border-top: 1px solid var(--neutral-100);
            margin-top: 32px;
            padding-top: 20px;
            font-size: 12px;
            color: var(--neutral-400);
            line-height: var(--leading-relaxed);
          "
        >
          Problemas com o acesso? Por favor, entre em contato com a
          <a
            href="#"
            style="color: var(--gci-base); font-weight: var(--weight-bold); text-decoration: none"
          >
            Equipe de TI
          </a>
          .
        </div>
      </form>

      <div
        style="
          margin-top: auto;
          padding-top: 48px;
          font-size: 10px;
          text-transform: uppercase;
          color: var(--neutral-400);
          letter-spacing: 0.18em;
        "
      >
        © 2025 Grupo Ceres Investimentos.
      </div>
    </div>

    <!-- Coluna direita — hero -->
    <div class="relative overflow-hidden" style="background: var(--gci-base)">
      <ImageWithFallback
        :src="HERO_IMG"
        alt="Agronegócio ao pôr do sol"
        class="absolute inset-0 w-full h-full"
        :style="{ objectFit: 'cover' }"
      />
      <!-- Overlay -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            135deg,
            rgba(8, 60, 74, 0.8) 0%,
            rgba(8, 60, 74, 0.4) 45%,
            transparent 100%
          );
          z-index: 1;
        "
      />
      <!-- Blobs decorativos -->
      <div
        class="absolute"
        style="
          top: -120px;
          right: -80px;
          width: 360px;
          height: 360px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          filter: blur(60px);
          z-index: 1;
        "
      />
      <div
        class="absolute"
        style="
          bottom: -100px;
          right: -60px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(242, 125, 38, 0.1);
          filter: blur(60px);
          z-index: 1;
        "
      />

      <!-- Conteúdo -->
      <div class="absolute flex flex-col" style="left: 64px; right: 64px; bottom: 64px; z-index: 2">
        <div
          style="
            width: 48px;
            height: 4px;
            background: var(--agro-base);
            border-radius: 2px;
            margin-bottom: 24px;
          "
        />
        <h2
          style="
            font-size: 52px;
            font-weight: 900;
            letter-spacing: -0.025em;
            color: #fff;
            line-height: 1.05;
            text-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
            margin-bottom: 20px;
            max-width: 720px;
          "
        >
          Gestão interna e estratégica do agronegócio.
        </h2>
        <p
          style="
            font-size: 18px;
            color: rgba(255, 255, 255, 0.82);
            font-weight: var(--weight-medium);
            line-height: var(--leading-relaxed);
            max-width: 560px;
          "
        >
          Ferramentas integradas para eficiência operacional e análise de dados estratégica do
          Grupo Ceres.
        </p>
      </div>
    </div>
  </div>
</template>
```

### DashboardView

```vue
<script setup lang="ts">
import { ModuleCard, modules } from '@/features/dashboard';

defineEmits<{ moduleClick: [title: string] }>();
</script>

<template>
  <div
    style="
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--accent);
      font-weight: var(--weight-bold);
      margin-bottom: 12px;
    "
  >
    Visão Geral
  </div>
  <h1
    style="
      font-size: 28px;
      font-weight: var(--weight-bold);
      color: var(--text-strong);
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    "
  >
    Módulos do Sistema
  </h1>
  <p
    style="font-size: var(--text-base); color: var(--text-muted); margin-bottom: 40px"
  >
    Selecione um módulo para começar seu fluxo de trabalho.
  </p>

  <div
    class="grid"
    style="grid-template-columns: repeat(auto-fit, minmax(var(--dashboard-grid-min), 1fr)); gap: 24px"
  >
    <div v-for="m in modules" :key="m.title" @click="$emit('moduleClick', m.title)">
      <ModuleCard :item="m" />
    </div>
  </div>
</template>
```

### ErrorScreen

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, Home } from 'lucide-vue-next';
import ImageWithFallback from '@/components/figma/ImageWithFallback.vue';
import logoSrc from '@/assets/logo-azul-sem-bg.png';
import { resolveErrorPreset } from '../data/errorPresets';

/** Ilustração estática (handoff). Em produção pode ser substituída pela API de GIFs. */
const PUPPY_IMG =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop';

const props = withDefaults(
  defineProps<{
    code?: string | number;
    title?: string;
    description?: string;
    primaryLabel?: string;
  }>(),
  { code: '404' },
);

const emit = defineEmits<{
  primary: [];
  home: [];
}>();

const resolved = computed(() => {
  const preset = resolveErrorPreset(props.code ?? '404');
  return {
    code: String(props.code ?? preset.code),
    title: props.title ?? preset.title,
    description: props.description ?? preset.description,
    primaryLabel: props.primaryLabel ?? preset.primaryLabel,
  };
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      width: 100%;
      height: 100%;
      min-height: 560px;
      background: var(--surface-page);
      padding: 40px 24px;
    "
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        padding: 36px 36px 32px;
        gap: 0;
      "
    >
      <ImageWithFallback
        :src="logoSrc"
        alt="Grupo Ceres Investimentos"
        :style="{ height: '56px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }"
      />

      <div
        style="
          width: 48px;
          height: 4px;
          background: var(--agro-base);
          border-radius: 2px;
          margin: 24px 0 20px;
        "
      />

      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 8px;
        "
      >
        Erro {{ resolved.code }}
      </div>

      <h1
        style="
          font-size: var(--text-3xl);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: var(--leading-tight);
          margin: 0 0 10px;
        "
      >
        {{ resolved.title }}
      </h1>

      <p
        style="
          margin: 0 0 24px;
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: var(--leading-relaxed);
        "
      >
        {{ resolved.description }}
      </p>

      <div
        style="
          border-radius: var(--radius-xl);
          overflow: hidden;
          height: 180px;
          background: var(--surface-sunken);
          margin-bottom: 28px;
        "
      >
        <ImageWithFallback
          :src="PUPPY_IMG"
          alt="Cachorrinho"
          :style="{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }"
        />
      </div>

      <div class="flex items-center" style="gap: 12px">
        <button
          type="button"
          class="btn-animated btn-primary flex items-center justify-center"
          style="
            flex: 1;
            height: 44px;
            padding: 0 16px;
            border: none;
            border-radius: var(--radius-xl);
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
            cursor: pointer;
            gap: 6px;
            box-shadow: 0 10px 24px -8px rgba(8, 60, 74, 0.18);
          "
          @click="emit('primary')"
        >
          {{ resolved.primaryLabel }}
          <ChevronRight :size="16" />
        </button>
        <button
          type="button"
          class="btn-animated flex items-center justify-center"
          style="
            height: 44px;
            padding: 0 14px;
            border: 1px solid var(--border-strong);
            border-radius: var(--radius-xl);
            background: var(--surface-card);
            color: var(--text-default);
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
            cursor: pointer;
            gap: 8px;
          "
          @click="emit('home')"
        >
          <Home :size="16" />
          Início
        </button>
      </div>
    </div>
  </div>
</template>
```

## Layout

### Topbar

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Search, Bell } from 'lucide-vue-next';
import { CURRENT_USER, getUserInitials } from '@/lib/userDisplay';

defineProps<{ title: string }>();

const searchFocus = ref(false);
const initials = computed(() => getUserInitials(CURRENT_USER.fullName));
</script>

<template>
  <header
    class="flex items-center"
    style="
      height: var(--topbar-height);
      background: var(--surface-card);
      border-bottom: 1px solid var(--border-default);
      padding: 0 var(--topbar-padding-x);
      gap: 24px;
      transition: height var(--duration-base), padding var(--duration-base);
    "
  >
    <h2
      style="
        font-size: var(--text-xl);
        font-weight: var(--weight-bold);
        color: var(--text-strong);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      "
    >
      {{ title }}
    </h2>

    <div style="flex: 1; min-width: 8px" />

    <!-- Search -->
    <div class="topbar-search relative" style="width: 256px; flex-shrink: 1; min-width: 140px">
      <Search
        :size="16"
        style="
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
        "
      />
      <input
        type="text"
        placeholder="Buscar no sistema..."
        :style="{
          width: '100%',
          height: '40px',
          paddingLeft: '36px',
          paddingRight: '12px',
          background: 'var(--surface-sunken)',
          border: 'none',
          outline: 'none',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          boxShadow: searchFocus ? '0 0 0 3px rgba(8,60,74,0.20)' : 'none',
          transition: 'box-shadow var(--duration-base)',
        }"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
      />
    </div>

    <!-- Bell -->
    <button
      aria-label="Notificações"
      class="relative flex items-center justify-center"
      style="
        width: 40px;
        height: 40px;
        border-radius: var(--radius-lg);
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--neutral-600);
      "
    >
      <Bell :size="18" />
      <span
        style="
          position: absolute;
          top: 11px;
          right: 11px;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: var(--agro-base);
          border: 1.5px solid var(--surface-card);
          box-sizing: content-box;
        "
      />
    </button>

    <!-- Divisor -->
    <div
      class="topbar-user-meta"
      style="width: 1px; height: 32px; background: var(--border-default); flex-shrink: 0"
    />

    <!-- User chip -->
    <div class="flex items-center" style="gap: 12px; flex-shrink: 0">
      <div class="topbar-user-meta" style="text-align: right; min-width: 0; max-width: 200px">
        <div
          style="
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ CURRENT_USER.fullName }}
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
          {{ CURRENT_USER.role }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xl);
          background: var(--gci-base);
          color: #fff;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          letter-spacing: 0.02em;
          flex-shrink: 0;
        "
      >
        {{ initials }}
      </div>
    </div>
  </header>
</template>
```

### Sidebar

```vue
<script setup lang="ts">
import { type Component } from "vue";
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
  Package,
  Search,
  Radar,
  Banknote,
} from "lucide-vue-next";
import gciLogoMark from "@/assets/gci-logo-mark.png";
import gciLogoFull from "@/assets/gci-logo-full.png";
import Tooltip from "@/components/ui/Tooltip.vue";
import { CURRENT_USER } from "@/lib/userDisplay";

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
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    key: "solicitacoes",
    label: "Solicitação de Operação",
    icon: ClipboardList,
    children: [
      { key: "solicitacoes", label: "Solicitações", icon: ClipboardList },
      { key: "solicitacoes-fundo-padrao", label: "Fundo Padrão", icon: Wallet },
      { key: "solicitacoes-relatorios", label: "Relatórios", icon: BarChart3 },
      {
        key: "solicitacoes-taxas-veiculos",
        label: "Taxas dos Veículos",
        icon: Percent,
      },
      {
        key: "solicitacoes-validacoes",
        label: "Validações",
        icon: ShieldCheck,
      },
    ],
  },
  { key: "ativos", label: "Ativos", icon: Package },
  {
    key: "fidcs",
    label: "FIDC's",
    icon: Landmark,
    children: [
      { key: "fidcs", label: "Gestão", icon: Landmark },
      { key: "fidcs-simulador", label: "Simulador", icon: Gauge },
      { key: "fidcs-relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    key: "cras",
    label: "CRA's",
    icon: Briefcase,
    children: [
      { key: "cras", label: "Gestão", icon: Briefcase },
      { key: "cras-simulador", label: "Simulador", icon: Gauge },
      { key: "cras-relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    key: "semiestruturadas",
    label: "Semiestruturadas",
    icon: Layers,
    children: [{ key: "semiestruturadas", label: "Gestão", icon: Layers }],
  },
  {
    key: "cobranca",
    label: "Cobrança",
    icon: Receipt,
    children: [
      { key: "cobranca-dashboard", label: "Dashboard", icon: Gauge },
      { key: "cobranca-titulos", label: "Títulos", icon: FileText },
      {
        key: "cobranca-notif",
        label: "Notificações de Cobrança",
        icon: BellRing,
      },
      {
        key: "cobranca-notif-cessao",
        label: "Notificações de Cessão",
        icon: ScrollText,
      },
      {
        key: "cobranca-resultado-notif",
        label: "Resultado de Notificações",
        icon: Layers,
      },
      { key: "cobranca-rel", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    key: "risco",
    label: "Risco",
    icon: AlertCircle,
    children: [
      { key: "risco-dashboard", label: "Dashboard", icon: Gauge },
      { key: "risco-grupos", label: "Grupos Empresariais", icon: Building2 },
      { key: "risco-ratings", label: "Ratings", icon: Layers },
      {
        key: "risco-agrupamentos",
        label: "Agrupamentos de Limite",
        icon: ScrollText,
      },
      { key: "risco-serasa", label: "Consultas", icon: Search },
      { key: "risco-rel", label: "Relatórios", icon: BarChart3 },
    ],
  },
  { key: "grupos-cadastro", label: "Grupos Empresariais", icon: Building2 },
  { key: "monitoramento", label: "Monitoramento", icon: Radar },
  { key: "passivo", label: "Passivo", icon: Database },
  { key: "passivo-novo", label: "Passivo (novo)", icon: Banknote },
  { key: "colab", label: "Colaboradores", icon: Users },
  { key: "rel", label: "Relatórios", icon: FileText },
  { key: "conf", label: "Configurações", icon: Settings },
];

const EXPANDED = "var(--sidebar-width-expanded)";
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
  return (
    !!it.children?.length && it.children.some((c) => c.key === props.active)
  );
}

function handleItemClick(it: NavItem) {
  if (it.children?.length) {
    if (!props.collapsed) emit("toggleMenu", it.key);
    emit("navigate", it.children[0].key);
  } else {
    emit("navigate", it.key);
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
        :style="{
          width: '42px',
          height: '42px',
          objectFit: 'contain',
          flexShrink: 0,
        }"
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
    <nav
      class="sidebar-nav-scroll flex flex-col"
      style="gap: 4px; flex: 1; min-height: 0; overflow-y: auto"
    >
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
            :class="{
              'sidebar-nav-btn--active':
                it.key === active || isAnyChildActive(it),
            }"
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
              transition:
                background var(--duration-fast),
                color var(--duration-fast);
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
          :class="{
            'sidebar-nav-btn--active':
              it.key === active || isAnyChildActive(it),
          }"
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
            transition:
              background var(--duration-fast),
              color var(--duration-fast),
              padding var(--duration-slow);
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
              transform:
                openMenu === it.key ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <!-- Submenu -->
        <div
          v-if="it.children?.length && !collapsed"
          :style="{
            overflow: 'hidden',
            maxHeight:
              openMenu === it.key ? it.children.length * 40 + 8 + 'px' : '0px',
            opacity: openMenu === it.key ? 1 : 0,
            transition:
              'max-height var(--duration-slow) var(--ease-standard), opacity var(--duration-base)',
          }"
        >
          <div
            class="flex flex-col"
            style="gap: 2px; padding: 6px 0 6px 36px; position: relative"
          >
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
                transition:
                  background var(--duration-fast),
                  color var(--duration-fast);
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
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ CURRENT_USER.fullName }}
          </div>
          <div
            style="
              font-size: 10px;
              color: rgba(255, 255, 255, 0.6);
              margin-top: 2px;
              white-space: nowrap;
            "
          >
            {{ CURRENT_USER.role }}
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
```

## Components

### ModuleCard

```vue
<script setup lang="ts">
import { toneStyles, type ModuleItem } from '../data/modulesData';
import { useCardHover } from '@/composables/useCardHover';

const props = defineProps<{ item: ModuleItem }>();
const { hover, onMouseenter, onMouseleave } = useCardHover();
const tone = toneStyles[props.item.tone];
</script>

<template>
  <div
    class="relative overflow-hidden flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      border: `1px solid ${hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      height: '100%',
      minHeight: '200px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition:
        'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <!-- Quarto de círculo decorativo no canto superior direito -->
    <div
      :style="{
        position: 'absolute',
        top: '-64px',
        right: '-64px',
        width: '128px',
        height: '128px',
        borderRadius: '9999px',
        background: hover ? 'rgba(242,125,38,0.08)' : 'var(--neutral-100)',
        transition: 'background var(--duration-base)',
        zIndex: 0,
      }"
    />

    <div class="relative flex flex-col" style="gap: 16px; z-index: 1; flex: 1">
      <div
        class="flex items-center justify-center"
        :style="{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-xl)',
          background: tone.bg,
          color: tone.color,
        }"
      >
        <component :is="item.icon" :size="28" :stroke-width="1.75" />
      </div>

      <div>
        <div
          style="
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin-bottom: 6px;
            letter-spacing: -0.01em;
          "
        >
          {{ item.title }}
        </div>
        <div
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            line-height: var(--leading-relaxed);
          "
        >
          {{ item.description }}
        </div>
      </div>

      <div style="flex: 1" />

      <div
        :style="{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--accent)',
          fontWeight: 'var(--weight-bold)',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity var(--duration-base), transform var(--duration-base)',
        }"
      >
        Acessar módulo →
      </div>
    </div>
  </div>
</template>
```

### ToastCard

```vue
<script setup lang="ts">
import { computed, type Component } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next';
import type { ToastItem, ToastType } from '@/composables/useToast';

const props = defineProps<{ toast: ToastItem }>();
const emit = defineEmits<{
  dismiss: [];
  action: [];
}>();

const tone = computed(() => {
  const map: Record<
    ToastType,
    { icon: Component; fg: string; bg: string; btnBg: string; btnFg: string }
  > = {
    error: {
      icon: CircleAlert,
      fg: 'var(--danger-base)',
      bg: 'var(--danger-light)',
      btnBg: 'var(--danger-light)',
      btnFg: 'var(--danger-dark)',
    },
    warning: {
      icon: TriangleAlert,
      fg: 'var(--warning-base)',
      bg: 'var(--warning-light)',
      btnBg: 'var(--warning-light)',
      btnFg: 'var(--warning-dark)',
    },
    success: {
      icon: CircleCheck,
      fg: 'var(--success-base)',
      bg: 'var(--success-light)',
      btnBg: 'var(--success-light)',
      btnFg: 'var(--success-dark)',
    },
    info: {
      icon: Info,
      fg: 'var(--gci-base)',
      bg: 'var(--gci-light)',
      btnBg: 'var(--gci-light)',
      btnFg: 'var(--gci-base)',
    },
  };
  return map[props.toast.type];
});

function handleAction() {
  props.toast.action?.onClick?.();
  emit('action');
}
</script>

<template>
  <div
    role="status"
    :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
    class="flex flex-col"
    :style="{
      width: '360px',
      maxWidth: '100%',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderLeft: `4px solid ${tone.fg}`,
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
    }"
  >
    <div class="flex" style="gap: 12px; padding: 14px 14px 0 14px; align-items: flex-start">
      <div
        class="flex items-center justify-center"
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          background: tone.bg,
          color: tone.fg,
          flexShrink: 0,
        }"
      >
        <component :is="tone.icon" :size="16" :stroke-width="2.25" />
      </div>

      <div style="flex: 1; min-width: 0; padding-top: 4px">
        <div class="flex items-start" style="gap: 8px">
          <p
            style="
              margin: 0;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-strong);
              line-height: var(--leading-snug);
              flex: 1;
              min-width: 0;
            "
          >
            {{ toast.message }}
          </p>
          <span
            v-if="toast.count > 1"
            :style="{
              flexShrink: 0,
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              color: tone.fg,
              background: tone.bg,
              borderRadius: 'var(--radius-full)',
              padding: '2px 7px',
              lineHeight: 1.4,
            }"
          >
            ×{{ toast.count }}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Fechar"
        class="btn-animated flex items-center justify-center"
        style="
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-md);
          flex-shrink: 0;
          padding: 0;
        "
        @click="emit('dismiss')"
      >
        <X :size="14" :stroke-width="2.25" />
      </button>
    </div>

    <div
      class="flex items-center justify-between"
      style="padding: 12px 14px 14px; gap: 12px"
    >
      <button
        v-if="toast.action"
        type="button"
        class="btn-animated"
        :style="{
          height: '32px',
          padding: '0 12px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          background: tone.btnBg,
          color: tone.btnFg,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          cursor: 'pointer',
        }"
        @click="handleAction"
      >
        {{ toast.action.label }}
      </button>
      <span v-else />
      <button
        type="button"
        class="btn-animated"
        style="
          height: 32px;
          padding: 0 4px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          cursor: pointer;
        "
        @click="emit('dismiss')"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>
```

### ToastStack

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ToastItem } from '@/composables/useToast';
import ToastCard from './ToastCard.vue';

const VISIBLE = 3;

const props = withDefaults(
  defineProps<{
    toasts: readonly ToastItem[];
    contained?: boolean;
  }>(),
  { contained: false },
);

const emit = defineEmits<{
  dismiss: [id: string];
  'dismiss-all': [];
}>();

const expanded = ref(false);

const ordered = computed(() => [...props.toasts].sort((a, b) => b.createdAt - a.createdAt));

const visible = computed(() =>
  expanded.value ? ordered.value : ordered.value.slice(0, VISIBLE),
);

const hiddenCount = computed(() => Math.max(0, ordered.value.length - VISIBLE));

function cardStyle(index: number) {
  if (expanded.value) {
    return {
      position: 'relative' as const,
      transform: 'none',
      zIndex: String(visible.value.length - index),
      opacity: 1,
      pointerEvents: 'auto' as const,
      marginBottom: '0px',
    };
  }
  return {
    position: (index === 0 ? 'relative' : 'absolute') as 'relative' | 'absolute',
    right: '0',
    bottom: index === 0 ? '0' : `${index * 10}px`,
    transform: `scale(${1 - index * 0.04})`,
    transformOrigin: 'bottom right',
    zIndex: String(visible.value.length - index),
    opacity: 1,
    pointerEvents: (index === 0 ? 'auto' : 'none') as 'auto' | 'none',
  };
}
</script>

<template>
  <div
    v-if="toasts.length"
    class="flex flex-col items-end"
    :style="{
      position: contained ? 'absolute' : 'fixed',
      right: '28px',
      bottom: '28px',
      zIndex: 'var(--z-toast)',
      width: '360px',
      maxWidth: 'calc(100% - 56px)',
      gap: expanded ? '10px' : '0',
    }"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <div
      v-if="toasts.length > 1"
      class="flex items-center justify-between"
      style="width: 100%; gap: 12px; padding: 0 2px"
    >
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        "
      >
        {{ toasts.length }} {{ toasts.length === 1 ? 'aviso' : 'avisos' }}
        <template v-if="!expanded && hiddenCount > 0"> · +{{ hiddenCount }}</template>
      </span>
      <button
        type="button"
        class="btn-animated"
        style="
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          color: var(--gci-base);
          padding: 0;
        "
        @click="emit('dismiss-all')"
      >
        Dispensar todos
      </button>
    </div>

    <div
      class="relative"
      :style="{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: expanded ? '10px' : '0',
        maxHeight: expanded ? '70vh' : 'none',
        overflow: expanded ? 'auto' : 'visible',
        paddingBottom: expanded || visible.length <= 1 ? '0' : `${Math.min(visible.length - 1, 2) * 10}px`,
      }"
    >
      <div
        v-for="(item, index) in visible"
        :key="item.id"
        :style="cardStyle(index)"
      >
        <ToastCard :toast="item" @dismiss="emit('dismiss', item.id)" @action="emit('dismiss', item.id)" />
      </div>
    </div>
  </div>
</template>
```

### Alert

```vue
<script setup lang="ts">
import { computed, type Component } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

const props = withDefaults(
  defineProps<{
    type?: AlertType;
    title?: string;
    message?: string;
    dismissible?: boolean;
    actionLabel?: string;
  }>(),
  {
    type: 'info',
    dismissible: true,
  },
);

const emit = defineEmits<{
  dismiss: [];
  action: [];
}>();

const tone = computed(() => {
  const map: Record<
    AlertType,
    { icon: Component; fg: string; bg: string; border: string; btnBg: string; btnFg: string }
  > = {
    error: {
      icon: CircleAlert,
      fg: 'var(--danger-base)',
      bg: 'var(--danger-light)',
      border: 'var(--danger-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--danger-dark)',
    },
    warning: {
      icon: TriangleAlert,
      fg: 'var(--warning-base)',
      bg: 'var(--warning-light)',
      border: 'var(--warning-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--warning-dark)',
    },
    success: {
      icon: CircleCheck,
      fg: 'var(--success-base)',
      bg: 'var(--success-light)',
      border: 'var(--success-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--success-dark)',
    },
    info: {
      icon: Info,
      fg: 'var(--gci-base)',
      bg: 'var(--gci-light)',
      border: 'var(--gci-base)',
      btnBg: 'var(--surface-card)',
      btnFg: 'var(--gci-base)',
    },
  };
  return map[props.type];
});
</script>

<template>
  <div
    role="alert"
    class="flex"
    :style="{
      gap: '12px',
      alignItems: 'flex-start',
      width: '100%',
      background: tone.bg,
      border: `1px solid color-mix(in srgb, ${tone.border} 28%, transparent)`,
      borderLeft: `4px solid ${tone.border}`,
      borderRadius: 'var(--radius-xl)',
      padding: '14px 16px',
    }"
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--surface-card)',
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="tone.icon" :size="16" :stroke-width="2.25" />
    </div>

    <div style="flex: 1; min-width: 0; padding-top: 4px">
      <div
        v-if="title"
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          line-height: var(--leading-snug);
          margin-bottom: 4px;
        "
      >
        {{ title }}
      </div>
      <p
        v-if="message"
        style="
          margin: 0;
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: var(--leading-normal);
        "
      >
        {{ message }}
      </p>
      <slot />
      <button
        v-if="actionLabel"
        type="button"
        class="btn-animated"
        :style="{
          marginTop: '10px',
          height: '32px',
          padding: '0 12px',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          background: tone.btnBg,
          color: tone.btnFg,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          cursor: 'pointer',
        }"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <button
      v-if="dismissible"
      type="button"
      aria-label="Fechar"
      class="btn-animated flex items-center justify-center"
      style="
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        border-radius: var(--radius-md);
        flex-shrink: 0;
        padding: 0;
      "
      @click="emit('dismiss')"
    >
      <X :size="14" :stroke-width="2.25" />
    </button>
  </div>
</template>
```
