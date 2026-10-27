<script setup lang="ts">
import { computed, ref } from 'vue';
import { DISPAROS_SEED, type DisparoNotificacao } from '../data/resultadoNotificacoesData';
import { useBackgroundReport } from '@/composables/useBackgroundReport';
import { useToast } from '@/composables/useToast';
import ResultadoNotificacoesListScreen from './ResultadoNotificacoesListScreen.vue';
import DisparoDetailScreen from './DisparoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<DisparoNotificacao[]>(DISPAROS_SEED.map((d) => ({ ...d })));
const route = ref<Route>({ level: 'list' });
const { success } = useToast();
const { enqueueReport } = useBackgroundReport();

const atual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((d) => d.id === r.id) : undefined;
});

function showToast(msg: string) {
  success(msg);
}

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function handleReenviar(id: string) {
  list.value = list.value.map((d) =>
    d.id === id
      ? {
          ...d,
          status: 'PROCESSANDO',
          dataHora: nowBR(),
          entregues: 0,
          abertos: 0,
          falhas: 0,
        }
      : d,
  );
  showToast('Lote reenviado (mock)');
}

function handleExportar(id: string) {
  const d = list.value.find((x) => x.id === id);
  if (!d) return;
  enqueueReport({ reportName: `Exportação do lote ${d.lote}` });
}
</script>

<template>
  <ResultadoNotificacoesListScreen
    v-if="route.level === 'list'"
    :disparos="list"
    @open="route = { level: 'detail', id: $event }"
    @reenviar="handleReenviar"
    @exportar="handleExportar"
  />
  <template v-else>
    <DisparoDetailScreen
      v-if="atual"
      :disparo="atual"
      @back="route = { level: 'list' }"
      @reenviar="handleReenviar"
      @exportar="handleExportar"
    />
    <ResultadoNotificacoesListScreen
      v-else
      :disparos="list"
      @open="route = { level: 'detail', id: $event }"
      @reenviar="handleReenviar"
      @exportar="handleExportar"
    />
  </template>
</template>
