<script setup lang="ts">
import { computed, ref } from 'vue';
import MonitoramentoListScreen from './MonitoramentoListScreen.vue';
import MonitoramentoDetailScreen from './MonitoramentoDetailScreen.vue';
import CessaoDetailScreen from './CessaoDetailScreen.vue';
import { PEDIDOS_SEED } from '../data/monitoramentoData';

type Route =
  | { level: 'list' }
  | { level: 'detail'; pedidoId: string }
  | { level: 'cessao'; pedidoId: string; cessaoId: string };

const route = ref<Route>({ level: 'list' });

const pedidoAtual = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return PEDIDOS_SEED.find((p) => p.id === r.pedidoId);
});

const cessaoAtual = computed(() => {
  const r = route.value;
  if (r.level !== 'cessao' || !pedidoAtual.value) return undefined;
  return pedidoAtual.value.cessoes.find((c) => c.id === r.cessaoId);
});

function openDetail(pedidoId: string) {
  route.value = { level: 'detail', pedidoId };
}

function openCessao(cessaoId: string) {
  const pedido = pedidoAtual.value;
  if (!pedido) return;
  route.value = { level: 'cessao', pedidoId: pedido.id, cessaoId };
}

function handleBack() {
  const r = route.value;
  if (r.level === 'cessao') {
    route.value = { level: 'detail', pedidoId: r.pedidoId };
    return;
  }
  route.value = { level: 'list' };
}
</script>

<template>
  <MonitoramentoListScreen v-if="route.level === 'list'" @open="openDetail" />
  <CessaoDetailScreen
    v-else-if="route.level === 'cessao' && pedidoAtual && cessaoAtual"
    :pedido="pedidoAtual"
    :cessao="cessaoAtual"
    @back="handleBack"
  />
  <MonitoramentoDetailScreen
    v-else-if="pedidoAtual"
    :pedido="pedidoAtual"
    @back="handleBack"
    @open-cessao="openCessao"
  />
  <MonitoramentoListScreen v-else @open="openDetail" />
</template>
