<script setup lang="ts">
import { computed } from 'vue';
import TituloConfirmacoesHistorico from '@/components/titulos/TituloConfirmacoesHistorico.vue';
import { buildConfirmacoesHistorico } from '@/components/titulos/confirmacoesHistorico';
import type { Title } from '../../data/fidcsData';
import Section from './Section.vue';

const props = defineProps<{ title: Title }>();

const items = computed(() =>
  buildConfirmacoesHistorico({
    emissao: props.title.emissao,
    numero: props.title.numero,
    docRef: String(props.title.lastro),
    arquivoSlug: props.title.numero,
    sacadoResultado: props.title.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE',
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
