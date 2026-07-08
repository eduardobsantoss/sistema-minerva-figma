<script setup lang="ts">
import { computed } from 'vue';
import type { Title } from '../../data/fidcsData';
import Section from './Section.vue';

const props = defineProps<{ title: Title }>();

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};

const events = computed(() => [
  { date: props.title.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
  { date: props.title.emissao, label: 'Registro enviado à registradora (CERC)', tone: 'info' },
  {
    date: props.title.emissao,
    label: 'Confirmação física do sacado',
    tone: props.title.status === 'CONFIRMADO' ? 'success' : 'warning',
  },
  {
    date: props.title.vencimento,
    label: props.title.status === 'VENCIDO' ? 'Inadimplência identificada' : 'Vencimento programado',
    tone: props.title.status === 'VENCIDO' ? 'danger' : 'neutral',
  },
]);
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div
        v-for="(e, i) in events"
        :key="i"
        class="flex items-start"
        style="gap: 16px; padding: 12px 0; position: relative"
      >
        <div style="position: relative; width: 12px">
          <span
            :style="{
              display: 'block',
              width: '12px',
              height: '12px',
              borderRadius: '9999px',
              background: toneMap[e.tone],
              marginTop: '6px',
            }"
          />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ e.label }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            {{ e.date }}
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
