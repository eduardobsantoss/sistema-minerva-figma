<script setup lang="ts">
import { computed, ref } from 'vue';
import { DISPAROS_SEED, type DisparoNotificacao } from '../data/resultadoNotificacoesData';
import { useToast } from '@/composables/useToast';
import ResultadoNotificacoesListScreen from './ResultadoNotificacoesListScreen.vue';
import DisparoDetailScreen from './DisparoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<DisparoNotificacao[]>(DISPAROS_SEED.map((d) => ({ ...d })));
const route = ref<Route>({ level: 'list' });
const { success } = useToast();

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
  const csv = [
    'Lote;Campanha;Canal;Data;Destinatarios;Entregues;Abertos;Falhas;Status',
    `"${d.lote}";"${d.campanha}";"${d.canal}";"${d.dataHora}";${d.totalDestinatarios};${d.entregues};${d.abertos};${d.falhas};"${d.status}"`,
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${d.lote}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exportado');
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
