<script setup lang="ts">
import { computed } from 'vue';
import type { TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const items = computed(() => [
  {
    data: props.titulo.dataEmissao,
    tipo: 'Confirmação do Sacado',
    resultado: props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao,
    obs: 'Via portal eletrônico',
  },
  {
    data: props.titulo.dataEmissao,
    tipo: 'Validação de Lastro',
    resultado: props.titulo.situacao === 'REJEITADO' ? 'REJEITADO' : 'CONFIRMADO',
    obs: `Documento ${props.titulo.lastro} verificado`,
  },
  {
    data: props.titulo.dataEntrada,
    tipo: 'Registro Registradora',
    resultado: props.titulo.statusRegistro === 'REGISTRADO' ? 'CONFIRMADO' : props.titulo.statusRegistro === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE',
    obs: 'B3 — protocolo #' + props.titulo.numero.replace(/\D/g, '').slice(-5),
  },
]);

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap.PENDENTE;
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in items"
        :key="i"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ c.tipo }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ c.data }} · {{ c.obs }}</div>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: tone(c.resultado).bg,
            color: tone(c.resultado).fg,
          }"
        >
          {{ c.resultado }}
        </span>
      </div>
    </div>
  </Section>
</template>
