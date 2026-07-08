<script setup lang="ts">
import { computed } from 'vue';
import { Download } from 'lucide-vue-next';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const files = computed(() => [
  { name: `CPR-${props.titulo.numero}.xml`, size: '14 KB', type: 'XML' },
  { name: `Laudo-${props.titulo.numero}.pdf`, size: '210 KB', type: 'PDF' },
  { name: `Nota-${props.titulo.numero}.jpg`, size: '88 KB', type: 'IMG' },
]);
</script>

<template>
  <Section title="Evidências e Lastro Físico">
    <div class="flex flex-col" style="gap: 12px">
      <div
        v-for="f in files"
        :key="f.name"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em">{{ f.type }}</div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ f.size }}</div>
        </div>
        <button class="flex items-center" style="gap: 8px; padding: 8px 14px; background: var(--surface-card); color: var(--text-strong); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)">
          <Download :size="14" /> Baixar
        </button>
      </div>
    </div>
  </Section>
</template>
