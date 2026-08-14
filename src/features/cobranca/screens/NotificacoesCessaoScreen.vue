<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NOTIFICACOES_CESSAO_SEED,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';
import { useToast } from '@/composables/useToast';
import NotificacoesCessaoListScreen from './NotificacoesCessaoListScreen.vue';
import NotificacaoCessaoDetailScreen from './NotificacaoCessaoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<NotificacaoCessao[]>(NOTIFICACOES_CESSAO_SEED.map((n) => ({ ...n })));
const route = ref<Route>({ level: 'list' });
const { success } = useToast();

const atual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((n) => n.id === r.id) : undefined;
});

function showToast(msg: string) {
  success(msg);
}

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function openDetail(id: string) {
  route.value = { level: 'detail', id };
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
  showToast('Notificação reenviada (mock)');
}

function handleCancelar(id: string) {
  list.value = list.value.map((n) =>
    n.id === id ? { ...n, status: 'CANCELADA' } : n,
  );
  showToast('Notificação cancelada');
}
</script>

<template>
  <NotificacoesCessaoListScreen
    v-if="route.level === 'list'"
    :itens="list"
    @open="openDetail"
    @reenviar="handleReenviar"
    @cancelar="handleCancelar"
  />
  <template v-else>
    <NotificacaoCessaoDetailScreen
      v-if="atual"
      :notificacao="atual"
      @back="route = { level: 'list' }"
      @reenviar="handleReenviar"
      @cancelar="handleCancelar"
    />
    <NotificacoesCessaoListScreen
      v-else
      :itens="list"
      @open="openDetail"
      @reenviar="handleReenviar"
      @cancelar="handleCancelar"
    />
  </template>
</template>
