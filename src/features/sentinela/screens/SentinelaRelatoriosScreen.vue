<script setup lang="ts">
import { FileSpreadsheet, FileText } from 'lucide-vue-next';

const REPORTS = [
  {
    key: 'csv',
    title: 'Exportação CSV',
    description: 'Base tabular do monitoramento de crédito e contrapartes para análise em planilha.',
    icon: FileSpreadsheet,
    tone: {
      iconBg: 'var(--accent-bg)',
      iconFg: 'var(--accent)',
      label: 'var(--accent)',
    },
    badge: 'CSV',
  },
  {
    key: 'pdf',
    title: 'Exportação PDF',
    description: 'Resumo executivo do Sentinela para compartilhar com o time e a diretoria.',
    icon: FileText,
    tone: {
      iconBg: 'var(--danger-light)',
      iconFg: 'var(--danger-base)',
      label: 'var(--danger-base)',
    },
    badge: 'PDF',
  },
] as const;
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
      <article
        v-for="item in REPORTS"
        :key="item.key"
        class="flex flex-col"
        style="gap: 14px; padding: 22px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
      >
        <div class="flex items-center justify-between" style="gap: 12px">
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
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: 'var(--radius-full)',
              background: item.tone.iconBg,
              color: item.tone.label,
            }"
          >
            {{ item.badge }}
          </span>
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
            {{ item.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ item.description }}
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
