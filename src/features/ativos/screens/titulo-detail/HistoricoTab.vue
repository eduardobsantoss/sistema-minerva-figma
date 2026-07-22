<script setup lang="ts">
import { computed } from 'vue';
import { situacaoLabel, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.titulo.dataCriacao, label: 'Título criado no sistema', tone: 'info' },
    { date: props.titulo.dataEmissao, label: `Lastro ${props.titulo.lastro} vinculado ao veículo ${props.titulo.veiculoNome}`, tone: 'info' },
    { date: props.titulo.dataEntrada, label: `Situação: ${situacaoLabel(props.titulo.situacao)}`, tone: props.titulo.situacao === 'REJEITADO' ? 'danger' : 'success' },
  ];
  if (props.titulo.dataCessao) {
    list.push({ date: props.titulo.dataCessao, label: `Cessão ${props.titulo.cessao} registrada`, tone: 'info' });
  }
  if (props.titulo.ultimoPagamento) {
    list.push({ date: props.titulo.ultimoPagamento, label: 'Pagamento registrado', tone: 'success' });
  }
  list.push({
    date: props.titulo.vencimento,
    label:
      props.titulo.statusTitulo === 'VENCIDO'
        ? 'Inadimplência identificada'
        : props.titulo.statusTitulo === 'LIQUIDADO'
          ? 'Título liquidado'
          : 'Vencimento programado',
    tone:
      props.titulo.statusTitulo === 'VENCIDO'
        ? 'danger'
        : props.titulo.statusTitulo === 'LIQUIDADO'
          ? 'success'
          : 'neutral',
  });
  return list;
});

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
