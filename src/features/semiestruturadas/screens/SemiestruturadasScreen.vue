<script setup lang="ts">
import { ref, computed } from 'vue';
import SemiListScreen from './SemiListScreen.vue';
import SemiOperacaoDetailScreen from './SemiOperacaoDetailScreen.vue';
import SemiCotaDetailScreen from './SemiCotaDetailScreen.vue';
import { operacoes as initialOperacoes } from '../data/semiestruturadasData';

type Route =
  | { level: 'list' }
  | { level: 'operacao'; operacaoId: string }
  | { level: 'cota'; operacaoId: string; cotaId: string };

const route = ref<Route>({ level: 'list' });
const operacaoList = ref(initialOperacoes);

const operacao = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return operacaoList.value.find((o) => o.id === r.operacaoId);
});

const cota = computed(() => {
  const r = route.value;
  if (r.level !== 'cota') return undefined;
  return operacao.value?.cotas.find((c) => c.id === r.cotaId);
});
</script>

<template>
  <SemiListScreen
    v-if="route.level === 'list'"
    :operacoes="operacaoList"
    @open="(operacaoId) => (route = { level: 'operacao', operacaoId })"
  />

  <SemiOperacaoDetailScreen
    v-else-if="route.level === 'operacao' && operacao"
    :operacao="operacao"
    @back="route = { level: 'list' }"
    @open-cota="(cotaId) => (route = { level: 'cota', operacaoId: operacao!.id, cotaId })"
  />

  <SemiCotaDetailScreen
    v-else-if="route.level === 'cota' && operacao && cota"
    :operacao="operacao"
    :cota="cota"
    @back="route = { level: 'operacao', operacaoId: operacao.id }"
  />
</template>
