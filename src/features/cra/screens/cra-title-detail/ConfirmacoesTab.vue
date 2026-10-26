<script setup lang="ts">
import { computed } from 'vue';
import TituloConfirmacoesHistorico from '@/components/titulos/TituloConfirmacoesHistorico.vue';
import { buildConfirmacoesHistorico } from '@/components/titulos/confirmacoesHistorico';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const items = computed(() =>
  buildConfirmacoesHistorico({
    emissao: props.titulo.emissao,
    numero: props.titulo.numero,
    docRef: props.titulo.chaveNfe ?? props.titulo.numero,
    arquivoSlug: props.titulo.numero,
    sacadoResultado: props.titulo.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE',
    lastroResultado: 'CONFIRMADO',
    registroResultado: 'CONFIRMADO',
  }),
);
</script>

<template>
  <Section title="Histórico de Confirmações">
    <TituloConfirmacoesHistorico :items="items" />
  </Section>
</template>
