import { resolvePreview } from './previewResolve';
import { componentMarkdown } from '../utils/copyText';
import designTokensJson from '../disseccoes/minerva-design-tokens.json';
import type { TokenMap } from '../utils/usedTokens';
import type { ConfiguracoesCardKey } from './configuracoesCards';

import npsSource from '../components/NpsModal.vue?raw';
import forgotSource from '@/features/auth/components/ForgotPasswordModal.vue?raw';
import twoFactorSource from '@/features/auth/components/TwoFactorAuthModal.vue?raw';
import configureSource from '@/features/auth/components/ConfigureTwoFactorModal.vue?raw';
import totpQrSource from '@/features/auth/components/TotpQrPlaceholder.vue?raw';

export type ModalPackageKey = Extract<
  ConfiguracoesCardKey,
  'nps' | 'auth-forgot' | 'auth-2fa' | 'auth-2fa-setup'
>;

interface ModalPackage {
  name: string;
  /** Caminho usado em resolvePreview (feature/shell ou genérico). */
  feature: string;
  path: string;
  source: string;
  /** SFCs auxiliares incluídos no pacote copiado. */
  extras?: { name: string; source: string }[];
}

const PACKAGES: Record<ModalPackageKey, ModalPackage> = {
  nps: {
    name: 'NpsModal',
    feature: 'configuracoes',
    path: 'components/NpsModal.vue',
    source: npsSource,
  },
  'auth-forgot': {
    name: 'ForgotPasswordModal',
    feature: 'shell',
    path: 'components/ForgotPasswordModal.vue',
    source: forgotSource,
  },
  'auth-2fa': {
    name: 'TwoFactorAuthModal',
    feature: 'shell',
    path: 'components/TwoFactorAuthModal.vue',
    source: twoFactorSource,
  },
  'auth-2fa-setup': {
    name: 'ConfigureTwoFactorModal',
    feature: 'shell',
    path: 'components/ConfigureTwoFactorModal.vue',
    source: configureSource,
    extras: [{ name: 'TotpQrPlaceholder', source: totpQrSource }],
  },
};

function npsExample(): string {
  return `<script setup lang="ts">
import { ref } from 'vue';
import NpsModal from '@/features/configuracoes/components/NpsModal.vue';

const open = ref(true);
</script>

<template>
  <NpsModal
    v-if="open"
    @close="open = false"
    @submit="open = false"
  />
</template>`;
}

export function isModalPackageKey(key: ConfiguracoesCardKey): key is ModalPackageKey {
  return key in PACKAGES;
}

/** Monta o mesmo pacote MD usado em Telas → Copiar MD deste componente. */
export function buildModalPackageMarkdown(key: ModalPackageKey): string {
  const pkg = PACKAGES[key];
  const example =
    key === 'nps'
      ? npsExample()
      : resolvePreview(pkg.feature, pkg.path, pkg.name).example;

  let md = componentMarkdown(
    pkg.name,
    pkg.source,
    example,
    designTokensJson as TokenMap,
  );

  for (const extra of pkg.extras ?? []) {
    md += [
      '',
      '---',
      '',
      `## Dependência: ${extra.name}`,
      '',
      '```vue',
      extra.source.trim(),
      '```',
      '',
    ].join('\n');
  }

  return md;
}
