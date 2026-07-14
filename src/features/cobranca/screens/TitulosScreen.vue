<script setup lang="ts">
import { computed, ref } from 'vue';
import { TITULOS_SEED, type Titulo } from '../data/titulosData';
import TitulosListScreen from './TitulosListScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; tituloId: string };

const list = ref<Titulo[]>(TITULOS_SEED.map((t) => ({ ...t })));
const route = ref<Route>({ level: 'list' });
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((t) => t.id === r.tituloId) : undefined;
});

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 2400);
}

function todayBR() {
  return new Date().toLocaleDateString('pt-BR');
}

function openDetail(tituloId: string) {
  route.value = { level: 'detail', tituloId };
}

function handleGerarBoleto(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, boletoGeradoEm: todayBR() } : t,
  );
  showToast('Boleto gerado (mock)');
}

function handleNotificar(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, ultimaNotificacaoEm: todayBR() } : t,
  );
  showToast('Notificação enviada (mock)');
}

function handleNegociar(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, status: 'EM_NEGOCIACAO' } : t,
  );
  showToast('Título marcado em negociação');
}
</script>

<template>
  <TitulosListScreen
    v-if="route.level === 'list'"
    :titulos="list"
    @open="openDetail"
    @gerar-boleto="handleGerarBoleto"
    @notificar="handleNotificar"
    @negociar="handleNegociar"
  />
  <template v-else>
    <TituloDetailScreen
      v-if="tituloAtual"
      :titulo="tituloAtual"
      @back="route = { level: 'list' }"
      @gerar-boleto="handleGerarBoleto"
      @notificar="handleNotificar"
      @negociar="handleNegociar"
    />
    <TitulosListScreen
      v-else
      :titulos="list"
      @open="openDetail"
      @gerar-boleto="handleGerarBoleto"
      @notificar="handleNotificar"
      @negociar="handleNegociar"
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
