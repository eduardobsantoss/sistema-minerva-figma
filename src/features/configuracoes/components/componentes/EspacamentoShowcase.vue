<script setup lang="ts">
import ShowcaseSection from './ShowcaseSection.vue';

const SPACES = [
  { token: '--space-1', px: '4px' },
  { token: '--space-2', px: '8px' },
  { token: '--space-3', px: '12px' },
  { token: '--space-4', px: '16px' },
  { token: '--space-5', px: '20px' },
  { token: '--space-6', px: '24px' },
  { token: '--space-8', px: '32px' },
  { token: '--space-9', px: '36px' },
  { token: '--space-10', px: '40px' },
  { token: '--space-12', px: '48px' },
  { token: '--space-15', px: '60px' },
  { token: '--space-18', px: '72px' },
  { token: '--space-20', px: '80px' },
] as const;

const RADII = [
  { token: '--radius-sm', px: '4px' },
  { token: '--radius-md', px: '6px' },
  { token: '--radius-lg', px: '8px' },
  { token: '--radius-xl', px: '12px' },
  { token: '--radius-full', px: '9999px' },
] as const;

const SHADOWS = [
  { token: '--shadow-xs', label: 'XS' },
  { token: '--shadow-sm', label: 'SM' },
  { token: '--shadow-md', label: 'MD' },
  { token: '--shadow-lg', label: 'LG' },
] as const;
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Espaçamento"
      description="Escala --space-* (4px base). Use em gaps, paddings e margens — não invente valores soltos."
      token="--space-1 … --space-20"
    >
      <div class="flex flex-col" style="gap: 10px">
        <div
          v-for="s in SPACES"
          :key="s.token"
          class="flex items-center"
          style="gap: 16px"
        >
          <code
            style="
              width: 110px;
              font-size: var(--text-micro);
              color: var(--gci-base);
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            "
          >
            {{ s.token }}
          </code>
          <span style="width: 40px; font-size: var(--text-xs); color: var(--text-muted)">{{ s.px }}</span>
          <div
            :style="{
              height: '12px',
              width: `var(${s.token})`,
              background: 'var(--gci-base)',
              borderRadius: 'var(--radius-sm)',
              opacity: 0.85,
            }"
          />
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Raio"
      description="Cantos arredondados. Cards de hub usam --radius-xl; inputs e botões costumam usar --radius-lg."
      token="--radius-*"
    >
      <div class="flex" style="gap: 16px; flex-wrap: wrap">
        <div
          v-for="r in RADII"
          :key="r.token"
          class="flex flex-col items-center"
          style="gap: 8px"
        >
          <div
            :style="{
              width: '64px',
              height: '64px',
              background: 'var(--gci-light)',
              border: '1px solid var(--border-default)',
              borderRadius: `var(${r.token})`,
            }"
          />
          <code style="font-size: var(--text-micro); color: var(--gci-base); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ r.token }}
          </code>
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ r.px }}</span>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Sombras"
      description="Elevação padrão do theme. Cards de Relatório usam sombra custom no hover; preferir estes tokens em superfícies estáveis."
      token="--shadow-*"
    >
      <div class="flex" style="gap: 20px; flex-wrap: wrap">
        <div
          v-for="sh in SHADOWS"
          :key="sh.token"
          class="flex flex-col items-center"
          style="gap: 10px"
        >
          <div
            :style="{
              width: '88px',
              height: '64px',
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: `var(${sh.token})`,
            }"
          />
          <code style="font-size: var(--text-micro); color: var(--gci-base); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ sh.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>
  </div>
</template>
