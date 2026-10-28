<script setup lang="ts">
import { ref } from 'vue';
import { TITULOS_SEED, type Titulo } from '../data/titulosData';
import { NOTIFICACOES_CESSAO_SEED, type NotificacaoCessao } from '../data/notificacoesCessaoData';
import NotificacoesCessaoScreen from './NotificacoesCessaoScreen.vue';

const titulos = ref<Titulo[]>(TITULOS_SEED.map((t) => ({ ...t })));
const notificacoes = ref<NotificacaoCessao[]>(NOTIFICACOES_CESSAO_SEED.map((n) => ({ ...n })));
</script>

<template>
  <NotificacoesCessaoScreen v-model:itens="notificacoes" v-model:titulos="titulos" />
</template>
