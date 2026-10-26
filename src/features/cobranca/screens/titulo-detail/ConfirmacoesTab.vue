<script setup lang="ts">
import { computed } from 'vue';
import TituloConfirmacoesHistorico from '@/components/titulos/TituloConfirmacoesHistorico.vue';
import { buildConfirmacoesHistorico } from '@/components/titulos/confirmacoesHistorico';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

const items = computed(() =>
  buildConfirmacoesHistorico({
    emissao: props.titulo.emissao,
    numero: props.titulo.numero,
    docRef: props.titulo.lastro,
    arquivoSlug: props.titulo.numero,
    sacadoResultado:
      props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao,
    lastroResultado: props.titulo.situacaoTitulo === 'PENDENTE' ? 'PENDENTE' : 'CONFIRMADO',
    registroResultado:
      props.titulo.situacaoTitulo === 'VALIDADO' || props.titulo.situacaoTitulo === 'EM_CARTEIRA'
        ? 'CONFIRMADO'
        : 'PENDENTE',
  }),
);
</script>

<template>
  <Section title="Histórico de Confirmações">
    <TituloConfirmacoesHistorico :items="items" />
  </Section>
</template>
