<script setup lang="ts">
import { computed, ref } from 'vue';
import type { NotificacaoCessao } from '../data/notificacoesCessaoData';
import type { Titulo } from '../data/titulosData';
import { useTitulosActions } from '../composables/useTitulosActions';
import { useToast } from '@/composables/useToast';
import NotificacoesCessaoListScreen from './NotificacoesCessaoListScreen.vue';
import NotificacaoCessaoDetailScreen from './NotificacaoCessaoDetailScreen.vue';
import NotificacaoCessaoTitulosScreen from './NotificacaoCessaoTitulosScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route =
  | { level: 'list' }
  | { level: 'detail'; id: string }
  | { level: 'titulos'; id: string }
  | { level: 'titulo'; id: string; tituloId: string };

const props = defineProps<{ itens: NotificacaoCessao[]; titulos: Titulo[] }>();
const emit = defineEmits<{
  'update:itens': [value: NotificacaoCessao[]];
  'update:titulos': [value: Titulo[]];
}>();

const list = computed<NotificacaoCessao[]>({
  get: () => props.itens,
  set: (value) => emit('update:itens', value),
});
const titulosList = computed<Titulo[]>({
  get: () => props.titulos,
  set: (value) => emit('update:titulos', value),
});

const route = ref<Route>({ level: 'list' });
const { success } = useToast();
const { gerarBoleto, notificar, confirmar, negociar } = useTitulosActions(titulosList);

const atual = computed(() => {
  const r = route.value;
  return r.level === 'list' ? undefined : list.value.find((n) => n.id === r.id);
});

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'titulo' ? titulosList.value.find((t) => t.id === r.tituloId) : undefined;
});

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function openDetail(id: string) {
  route.value = { level: 'detail', id };
}

function openTitulos(id: string) {
  route.value = { level: 'titulos', id };
}

function openTitulo(tituloId: string) {
  const r = route.value;
  if (r.level === 'titulos') route.value = { level: 'titulo', id: r.id, tituloId };
}

function backFromTitulo() {
  const r = route.value;
  route.value = r.level === 'titulo' ? { level: 'titulos', id: r.id } : { level: 'list' };
}

function handleReenviar(id: string) {
  list.value = list.value.map((n) =>
    n.id === id
      ? {
          ...n,
          status: 'ENVIADA',
          dataEnvio: nowBR(),
          tentativas: n.tentativas + 1,
          comprovanteRef: n.comprovanteRef ?? `CMP-${id.toUpperCase()}`,
        }
      : n,
  );
  success('Notificação enviada (mock)');
}

function handleCancelar(id: string) {
  list.value = list.value.map((n) => (n.id === id ? { ...n, status: 'CANCELADA' } : n));
  success('Notificação cancelada');
}
</script>

<template>
  <NotificacoesCessaoListScreen
    v-show="route.level === 'list' || !atual"
    :itens="list"
    @open="openDetail"
    @reenviar="handleReenviar"
    @cancelar="handleCancelar"
    @ver-titulos="openTitulos"
  >
    <template #tabs><slot name="tabs" /></template>
  </NotificacoesCessaoListScreen>

  <template v-if="atual">
    <NotificacaoCessaoDetailScreen
      v-if="route.level === 'detail'"
      :notificacao="atual"
      @back="route = { level: 'list' }"
      @reenviar="handleReenviar"
      @cancelar="handleCancelar"
    />
    <NotificacaoCessaoTitulosScreen
      v-else-if="route.level === 'titulos'"
      :notificacao="atual"
      :titulos="titulosList"
      @back="route = { level: 'list' }"
      @open-titulo="openTitulo"
    />
    <TituloDetailScreen
      v-else-if="tituloAtual"
      :titulo="tituloAtual"
      @back="backFromTitulo"
      @gerar-boleto="gerarBoleto"
      @notificar="notificar"
      @confirmar="confirmar"
      @negociar="negociar"
    />
  </template>
</template>
