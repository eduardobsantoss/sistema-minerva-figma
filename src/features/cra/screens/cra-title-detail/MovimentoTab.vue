<script setup lang="ts">
import { computed } from 'vue';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const events = computed(() => [
  { date: props.titulo.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
  { date: props.titulo.emissao, label: 'Registro enviado à registradora (B3)', tone: 'info' },
  { date: props.titulo.emissao, label: 'Confirmação física do sacado', tone: props.titulo.status === 'CONFIRMADO' ? 'success' : 'warning' },
  { date: props.titulo.vencimento, label: props.titulo.status === 'VENCIDO' ? 'Inadimplência identificada' : 'Vencimento programado', tone: props.titulo.status === 'VENCIDO' ? 'danger' : 'neutral' },
]);

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in events" :key="i" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; margin-top: 6px" :style="{ background: toneMap[e.tone] }" />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.label }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ e.date }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>
