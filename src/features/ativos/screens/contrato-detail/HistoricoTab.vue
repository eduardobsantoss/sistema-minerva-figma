<script setup lang="ts">
import { computed } from 'vue';
import type { ContratoAtivoGlobal, TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ contrato: ContratoAtivoGlobal; titulos: TituloAtivoGlobal[] }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.contrato.dataPrimeiraEntrada, label: `Contrato ${props.contrato.numero} registrado`, tone: 'info' },
    { date: props.contrato.dataPrimeiraEntrada, label: `${props.titulos.length} título(s) vinculados`, tone: 'info' },
  ];
  for (const t of props.titulos) {
    if (t.dataCessao) {
      list.push({ date: t.dataCessao, label: `Cessão ${t.cessao} no título ${t.numero}`, tone: 'success' });
    }
    if (t.situacao === 'REJEITADO') {
      list.push({ date: t.dataEntrada, label: `Título ${t.numero} rejeitado`, tone: 'danger' });
    }
  }
  list.push({ date: props.contrato.ultimoVencimento, label: 'Último vencimento do contrato', tone: 'neutral' });
  return list.sort((a, b) => {
    const [da, ma, ya] = a.date.split('/').map(Number);
    const [db, mb, yb] = b.date.split('/').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });
});

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Histórico do Contrato">
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
