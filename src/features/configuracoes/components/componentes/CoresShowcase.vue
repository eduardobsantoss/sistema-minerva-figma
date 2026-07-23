<script setup lang="ts">
import ShowcaseSection from './ShowcaseSection.vue';

interface Swatch {
  token: string;
  label: string;
  textOn?: 'light' | 'dark';
}

const PRIMITIVES: Swatch[] = [
  { token: '--gci-base', label: 'GCI Base', textOn: 'dark' },
  { token: '--gci-hover', label: 'GCI Hover', textOn: 'dark' },
  { token: '--gci-active', label: 'GCI Active', textOn: 'dark' },
  { token: '--gci-light', label: 'GCI Light', textOn: 'light' },
  { token: '--agro-base', label: 'Agro Base', textOn: 'dark' },
  { token: '--agro-hover', label: 'Agro Hover', textOn: 'dark' },
  { token: '--agro-light', label: 'Agro Light', textOn: 'light' },
];

const SURFACES: Swatch[] = [
  { token: '--surface-page', label: 'Page', textOn: 'light' },
  { token: '--surface-card', label: 'Card', textOn: 'light' },
  { token: '--surface-sunken', label: 'Sunken', textOn: 'light' },
  { token: '--surface-selected', label: 'Selected', textOn: 'light' },
];

const TEXT: Swatch[] = [
  { token: '--text-strong', label: 'Strong', textOn: 'dark' },
  { token: '--text-default', label: 'Default', textOn: 'dark' },
  { token: '--text-muted', label: 'Muted', textOn: 'dark' },
  { token: '--text-disabled', label: 'Disabled', textOn: 'dark' },
  { token: '--text-link', label: 'Link', textOn: 'dark' },
];

const STATUS: Swatch[] = [
  { token: '--success-base', label: 'Success', textOn: 'dark' },
  { token: '--warning-base', label: 'Warning', textOn: 'dark' },
  { token: '--danger-base', label: 'Danger', textOn: 'dark' },
  { token: '--info-base', label: 'Info', textOn: 'dark' },
  { token: '--status-success-bg', label: 'Success BG', textOn: 'light' },
  { token: '--status-warning-bg', label: 'Warning BG', textOn: 'light' },
  { token: '--status-danger-bg', label: 'Danger BG', textOn: 'light' },
  { token: '--status-active-bg', label: 'Active BG', textOn: 'light' },
];

const BORDERS: Swatch[] = [
  { token: '--border-default', label: 'Default', textOn: 'light' },
  { token: '--border-strong', label: 'Strong', textOn: 'light' },
  { token: '--border-focus', label: 'Focus', textOn: 'dark' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Primárias"
      description="Marca GCI e accent agro. Preferir tokens semânticos (--action-*, --accent) em UI."
      token="--gci-* / --agro-*"
    >
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px">
        <div v-for="c in PRIMITIVES" :key="c.token" class="flex flex-col" style="gap: 6px">
          <div
            :style="{
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: `var(${c.token})`,
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '8px',
              color: c.textOn === 'dark' ? '#fff' : 'var(--text-strong)',
              fontSize: 'var(--text-micro)',
              fontWeight: 'var(--weight-semibold)',
            }"
          >
            {{ c.label }}
          </div>
          <code style="font-size: var(--text-micro); color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ c.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection title="Surfaces" token="--surface-*">
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px">
        <div v-for="c in SURFACES" :key="c.token" class="flex flex-col" style="gap: 6px">
          <div
            :style="{
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: `var(${c.token})`,
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '8px',
              fontSize: 'var(--text-micro)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-strong)',
            }"
          >
            {{ c.label }}
          </div>
          <code style="font-size: var(--text-micro); color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ c.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection title="Texto" token="--text-*">
      <div class="flex flex-col" style="gap: 10px">
        <div
          v-for="c in TEXT"
          :key="c.token"
          class="flex items-center"
          style="gap: 14px"
        >
          <div
            :style="{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              background: `var(${c.token})`,
              border: '1px solid var(--border-default)',
              flexShrink: 0,
            }"
          />
          <span :style="{ color: `var(${c.token})`, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }">
            {{ c.label }} — The quick brown fox
          </span>
          <code style="font-size: var(--text-micro); color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ c.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection title="Status" token="--success-* / --status-*">
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px">
        <div v-for="c in STATUS" :key="c.token" class="flex flex-col" style="gap: 6px">
          <div
            :style="{
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: `var(${c.token})`,
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '8px',
              color: c.textOn === 'dark' ? '#fff' : 'var(--text-strong)',
              fontSize: 'var(--text-micro)',
              fontWeight: 'var(--weight-semibold)',
            }"
          >
            {{ c.label }}
          </div>
          <code style="font-size: var(--text-micro); color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ c.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection title="Bordas" token="--border-*">
      <div class="flex" style="gap: 16px; flex-wrap: wrap">
        <div
          v-for="c in BORDERS"
          :key="c.token"
          class="flex flex-col"
          style="gap: 8px; width: 140px"
        >
          <div
            :style="{
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-card)',
              border: `2px solid var(${c.token})`,
            }"
          />
          <span style="font-size: var(--text-xs); color: var(--text-strong); font-weight: var(--weight-semibold)">
            {{ c.label }}
          </span>
          <code style="font-size: var(--text-micro); color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            {{ c.token }}
          </code>
        </div>
      </div>
    </ShowcaseSection>
  </div>
</template>
