<script setup lang="ts">
import { ref } from 'vue';
import { notificacoes as initialData, type Notificacao } from '../data/cobrancaData';
import CobrancaListScreen from './CobrancaListScreen.vue';
import NovaNotificacaoModal, { type NewNotificacaoData } from '../components/NovaNotificacaoModal.vue';

function buildNotificacaoFromForm(data: NewNotificacaoData): Notificacao {
  return {
    id: `notif-${Date.now()}`,
    nome: data.nome || 'Nova Régua',
    metodos: data.metodos,
    intervalosAVencer: data.intervalosAVencer,
    intervalosVencidos: data.intervalosVencidos,
    veiculos: data.veiculos,
    status: 'Ativa',
  };
}

const list = ref<Notificacao[]>(initialData);
const creating = ref(false);

function handleCreate(data: NewNotificacaoData) {
  list.value = [...list.value, buildNotificacaoFromForm(data)];
  creating.value = false;
}

function handleToggleStatus(id: string) {
  list.value = list.value.map((n) =>
    n.id === id ? { ...n, status: n.status === 'Ativa' ? 'Inativa' : 'Ativa' } : n,
  );
}

function handleEdit() {
  // Edit opens the create modal pre-filled (future enhancement)
  creating.value = true;
}
</script>

<template>
  <CobrancaListScreen
    :notificacoes="list"
    @new="creating = true"
    @edit="handleEdit"
    @toggle-status="handleToggleStatus"
  />
  <NovaNotificacaoModal
    v-if="creating"
    @close="creating = false"
    @create="handleCreate"
  />
</template>
