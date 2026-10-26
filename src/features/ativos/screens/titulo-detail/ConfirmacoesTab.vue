<script setup lang="ts">
import { computed } from 'vue';
import TituloConfirmacoesHistorico from '@/components/titulos/TituloConfirmacoesHistorico.vue';
import { buildConfirmacoesHistorico } from '@/components/titulos/confirmacoesHistorico';
import type { TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

const items = computed(() =>
  buildConfirmacoesHistorico({
    emissao: props.titulo.dataEmissao,
    numero: props.titulo.numero,
    docRef: props.titulo.lastro,
    arquivoSlug: props.titulo.numero,
    sacadoResultado:
      props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao,
    lastroResultado: props.titulo.situacao === 'REJEITADO' ? 'REJEITADO' : props.titulo.situacao === 'PENDENTE' ? 'PENDENTE' : 'CONFIRMADO',
    registroResultado:
      props.titulo.statusRegistro === 'REGISTRADO'
        ? 'CONFIRMADO'
        : props.titulo.statusRegistro === 'REJEITADO'
          ? 'REJEITADO'
          : 'PENDENTE',
  }),
);
</script>

<template>
  <Section title="Histórico de Confirmações">
    <TituloConfirmacoesHistorico :items="items" />
  </Section>
</template>
