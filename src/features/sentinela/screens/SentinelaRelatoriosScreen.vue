<script setup lang="ts">
import { ref, type Component } from 'vue';
import { ChevronRight, FileSpreadsheet, FileText } from 'lucide-vue-next';

type ReportKey = 'csv' | 'pdf';

const REPORTS: {
  key: ReportKey;
  title: string;
  description: string;
  icon: Component;
  tone: { iconBg: string; iconFg: string };
}[] = [
  {
    key: 'csv',
    title: 'Exportação CSV',
    description: 'Base tabular do monitoramento de crédito e contrapartes para análise em planilha.',
    icon: FileSpreadsheet,
    tone: { iconBg: 'var(--accent-bg)', iconFg: 'var(--accent)' },
  },
  {
    key: 'pdf',
    title: 'Exportação PDF',
    description: 'Resumo executivo do Sentinela para compartilhar com o time e a diretoria.',
    icon: FileText,
    tone: { iconBg: 'var(--danger-light)', iconFg: 'var(--danger-base)' },
  },
];

const hoveredKey = ref<ReportKey | null>(null);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Sentinela
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Referência visual dos formatos de exportação. Sem geração neste protótipo.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="item in REPORTS"
        :key="item.key"
        class="flex flex-col"
        type="button"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === item.key ? item.tone.iconFg : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === item.key ? 'var(--shadow-md)' : 'none',
          transform: hoveredKey === item.key ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @mouseenter="hoveredKey = item.key"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-lg)',
            background: item.tone.iconBg,
            color: item.tone.iconFg,
          }"
        >
          <component :is="item.icon" :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
            {{ item.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ item.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: item.tone.iconFg,
            opacity: hoveredKey === item.key ? 1 : 0,
            transform: hoveredKey === item.key ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>
</template>
