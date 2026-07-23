<script setup lang="ts">
import type { Component } from 'vue';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-vue-next';
import ShowcaseSection from './ShowcaseSection.vue';

const ICONS: { name: string; icon: Component }[] = [
  { name: 'Search', icon: Search },
  { name: 'Plus', icon: Plus },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'Filter', icon: Filter },
  { name: 'Settings', icon: Settings },
  { name: 'FileText', icon: FileText },
  { name: 'ClipboardList', icon: ClipboardList },
  { name: 'ChevronRight', icon: ChevronRight },
  { name: 'ArrowLeft', icon: ArrowLeft },
  { name: 'Check', icon: Check },
  { name: 'X', icon: X },
  { name: 'Trash2', icon: Trash2 },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
  { name: 'LayoutGrid', icon: LayoutGrid },
  { name: 'List', icon: List },
];

const SIZES = [14, 16, 20] as const;
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Tamanhos padrão"
      description="Lucide (lucide-vue-next). Preferir 14 (inline/CTA), 16 (campos/ações densas), 20 (cards e navegação)."
      token="lucide-vue-next"
    >
      <div class="flex" style="gap: 24px; flex-wrap: wrap">
        <div
          v-for="size in SIZES"
          :key="size"
          class="flex flex-col items-center"
          style="gap: 8px"
        >
          <div
            class="flex items-center justify-center"
            style="
              width: 48px;
              height: 48px;
              border-radius: var(--radius-lg);
              background: var(--accent-bg);
              color: var(--accent);
            "
          >
            <Settings :size="size" />
          </div>
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ size }}px</span>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Catálogo usado no produto"
      description="Amostra dos ícones mais recorrentes. Importe pelo nome; não embutir SVGs soltos."
    >
      <div
        class="grid"
        style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px"
      >
        <div
          v-for="item in ICONS"
          :key="item.name"
          class="flex flex-col items-center"
          style="
            gap: 8px;
            padding: 14px 8px;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            background: var(--surface-page);
          "
        >
          <component :is="item.icon" :size="20" style="color: var(--text-strong)" />
          <code
            style="
              font-size: var(--text-micro);
              color: var(--text-muted);
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              text-align: center;
            "
          >
            {{ item.name }}
          </code>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection title="Cor e contraste">
      <div class="flex" style="gap: 16px; flex-wrap: wrap">
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <Settings :size="20" />
        </div>
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--gci-light);
            color: var(--gci-base);
          "
        >
          <Settings :size="20" />
        </div>
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--gci-base);
            color: var(--text-on-brand);
          "
        >
          <Settings :size="20" />
        </div>
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--danger-light);
            color: var(--danger-base);
          "
        >
          <Trash2 :size="20" />
        </div>
      </div>
    </ShowcaseSection>
  </div>
</template>
