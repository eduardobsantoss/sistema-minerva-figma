<script setup lang="ts">
import { ref, type Component } from 'vue';
import {
  Boxes,
  Check,
  ChevronRight,
  Copy,
  KeyRound,
  MessageSquare,
  PanelTop,
  QrCode,
  ShieldCheck,
} from 'lucide-vue-next';
import {
  CONFIGURACOES_CARDS,
  type ConfiguracoesCardKey,
} from '../data/configuracoesCards';
import {
  buildModalPackageMarkdown,
  isModalPackageKey,
  type ModalPackageKey,
} from '../data/configuracoesModalPackages';
import { copyText } from '../utils/copyText';
import { useToast } from '@/composables/useToast';
import ComponentesScreen from './ComponentesScreen.vue';
import TelasScreen from './TelasScreen.vue';
import NpsModal, { type NpsSubmitPayload } from '../components/NpsModal.vue';
import ForgotPasswordModal from '@/features/auth/components/ForgotPasswordModal.vue';
import TwoFactorAuthModal from '@/features/auth/components/TwoFactorAuthModal.vue';
import ConfigureTwoFactorModal from '@/features/auth/components/ConfigureTwoFactorModal.vue';

const CARD_ICONS: Record<ConfiguracoesCardKey, Component> = {
  componentes: Boxes,
  telas: PanelTop,
  nps: MessageSquare,
  'auth-forgot': KeyRound,
  'auth-2fa': ShieldCheck,
  'auth-2fa-setup': QrCode,
};

type SectionKey = 'componentes' | 'telas';
type AuthModalKey = Exclude<ModalPackageKey, 'nps'>;

const { success } = useToast();

const section = ref<SectionKey | null>(null);
const hoveredKey = ref<ConfiguracoesCardKey | null>(null);
const npsOpen = ref(false);
const authModal = ref<AuthModalKey | null>(null);
const copiedKey = ref<ConfiguracoesCardKey | null>(null);
const copyErrorKey = ref<ConfiguracoesCardKey | null>(null);

function openSection(key: ConfiguracoesCardKey) {
  if (key === 'nps') {
    npsOpen.value = true;
    return;
  }
  if (key === 'auth-forgot' || key === 'auth-2fa' || key === 'auth-2fa-setup') {
    authModal.value = key;
    return;
  }
  section.value = key;
}

async function copyPackage(key: ConfiguracoesCardKey) {
  if (!isModalPackageKey(key)) return;
  copiedKey.value = null;
  copyErrorKey.value = null;
  const md = buildModalPackageMarkdown(key);
  const ok = await copyText(md);
  if (ok) {
    copiedKey.value = key;
    window.setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 1800);
  } else {
    copyErrorKey.value = key;
  }
}

function submitNps(payload: NpsSubmitPayload) {
  npsOpen.value = false;
  success(`Avaliação enviada (nota ${payload.nota}). Obrigado pelo feedback!`);
}

function goHub() {
  section.value = null;
}
</script>

<template>
  <ComponentesScreen v-if="section === 'componentes'" @back="goHub" />
  <TelasScreen v-else-if="section === 'telas'" @back="goHub" />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Sistema · Administração
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0;
        "
      >
        Configurações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Ferramentas e referências para manter o produto alinhado à prototipação.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <div
        v-for="card in CONFIGURACOES_CARDS"
        :key="card.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === card.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          boxShadow: hoveredKey === card.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === card.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @mouseenter="hoveredKey = card.key"
        @mouseleave="hoveredKey = null"
      >
        <button
          type="button"
          class="flex flex-col"
          style="
            gap: 14px;
            text-align: left;
            padding: 0;
            border: none;
            background: transparent;
            cursor: pointer;
            flex: 1;
            min-height: 0;
          "
          @click="openSection(card.key)"
        >
          <div
            class="flex items-center justify-center"
            style="
              width: 40px;
              height: 40px;
              border-radius: var(--radius-lg);
              background: var(--accent-bg);
              color: var(--accent);
            "
          >
            <component :is="CARD_ICONS[card.key]" :size="20" />
          </div>
          <div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                margin-bottom: 6px;
              "
            >
              {{ card.title }}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
              {{ card.description }}
            </div>
          </div>
        </button>

        <div v-if="card.copyable" class="flex items-center" style="gap: 8px; flex-wrap: wrap">
          <button
            type="button"
            class="btn-animated flex items-center"
            :style="{
              gap: '6px',
              height: '32px',
              padding: '0 12px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              background:
                copiedKey === card.key
                  ? 'var(--success-light)'
                  : copyErrorKey === card.key
                    ? 'var(--danger-light)'
                    : 'var(--surface-card)',
              color:
                copiedKey === card.key
                  ? 'var(--success-dark)'
                  : copyErrorKey === card.key
                    ? 'var(--danger-dark)'
                    : 'var(--text-default)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              flexShrink: 0,
            }"
            @click.stop="copyPackage(card.key)"
          >
            <Check v-if="copiedKey === card.key" :size="14" />
            <Copy v-else :size="14" />
            {{
              copiedKey === card.key
                ? 'Copiado'
                : copyErrorKey === card.key
                  ? 'Falha ao copiar'
                  : 'Copiar MD + tokens'
            }}
          </button>
          <button
            type="button"
            class="btn-animated flex items-center"
            style="
              gap: 4px;
              height: 32px;
              padding: 0 10px;
              border: none;
              background: transparent;
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--accent);
            "
            @click.stop="openSection(card.key)"
          >
            {{ card.cta }} <ChevronRight :size="14" />
          </button>
        </div>
        <button
          v-else
          type="button"
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === card.key ? 1 : 0,
            transform: hoveredKey === card.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            alignSelf: 'flex-start',
          }"
          @click="openSection(card.key)"
        >
          {{ card.cta }} <ChevronRight :size="14" />
        </button>
      </div>
    </div>

    <NpsModal v-if="npsOpen" @close="npsOpen = false" @submit="submitNps" />
    <ForgotPasswordModal
      v-if="authModal === 'auth-forgot'"
      initial-email="exemplo@empresa.com.br"
      @close="authModal = null"
    />
    <TwoFactorAuthModal
      v-if="authModal === 'auth-2fa'"
      @close="authModal = null"
      @verify="authModal = null"
    />
    <ConfigureTwoFactorModal
      v-if="authModal === 'auth-2fa-setup'"
      account-label="usuario@empresa.com.br"
      @close="authModal = null"
      @activate="authModal = null"
    />
  </div>
</template>
