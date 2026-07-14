<script setup lang="ts">
import { computed, ref } from 'vue';
import { DISPAROS_SEED, type DisparoNotificacao } from '../data/resultadoNotificacoesData';
import ResultadoNotificacoesListScreen from './ResultadoNotificacoesListScreen.vue';
import DisparoDetailScreen from './DisparoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<DisparoNotificacao[]>(DISPAROS_SEED.map((d) => ({ ...d })));
const route = ref<Route>({ level: 'list' });
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const atual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((d) => d.id === r.id) : undefined;
});

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 2400);
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

  <div
    v-if="toast"
    style="
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 500;
      background: var(--gci-base);
      color: #fff;
      padding: 12px 18px;
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-md);
    "
  >
    {{ toast }}
  </div>
</template>
