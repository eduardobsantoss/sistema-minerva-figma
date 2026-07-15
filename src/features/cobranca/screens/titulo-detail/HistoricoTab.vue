<script setup lang="ts">
import { computed } from 'vue';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.titulo.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
    { date: props.titulo.emissao, label: `Lastro ${props.titulo.lastro} vinculado ao veículo ${props.titulo.veiculoNome}`, tone: 'info' },
  ];
  if (props.titulo.statusConfirmacao === 'CONFIRMADO') {
    list.push({ date: props.titulo.emissao, label: 'Confirmação do sacado registrada', tone: 'success' });
  } else if (props.titulo.statusConfirmacao === 'REJEITADO') {
    list.push({ date: props.titulo.emissao, label: 'Confirmação do sacado rejeitada', tone: 'danger' });
  } else {
    list.push({ date: props.titulo.emissao, label: 'Aguardando confirmação do sacado', tone: 'warning' });
  }
  if (props.titulo.boletoGeradoEm) {
    list.push({ date: props.titulo.boletoGeradoEm, label: 'Boleto gerado', tone: 'info' });
  }
  if (props.titulo.ultimaNotificacaoEm) {
    list.push({ date: props.titulo.ultimaNotificacaoEm, label: 'Notificação de cobrança enviada', tone: 'info' });
  }
  if (props.titulo.emNegociacao) {
    list.push({ date: props.titulo.ultimaNotificacaoEm ?? props.titulo.vencimento, label: 'Negociação sinalizada', tone: 'warning' });
  }
  list.push({
    date: props.titulo.vencimento,
    label: props.titulo.statusPagamento === 'VENCIDO' ? 'Inadimplência identificada' : props.titulo.statusPagamento === 'LIQUIDADO' ? 'Título liquidado' : 'Vencimento programado',
    tone: props.titulo.statusPagamento === 'VENCIDO' ? 'danger' : props.titulo.statusPagamento === 'LIQUIDADO' ? 'success' : 'neutral',
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
