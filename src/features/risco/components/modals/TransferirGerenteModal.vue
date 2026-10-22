<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import { GERENTES_SEED } from '../../data/riscoData';

const props = defineProps<{ grupoNome: string; gerenteAtual: string }>();
const emit = defineEmits<{ close: []; confirm: [novoGerente: string] }>();

const gerente = ref('');
const canConfirm = computed(() => gerente.value !== '' && gerente.value !== props.gerenteAtual);
const gerenteOptions = computed(() => [
  { value: '', label: 'Selecione' },
  ...GERENTES_SEED.filter((item) => item.nome !== props.gerenteAtual).map((item) => ({ value: item.nome, label: item.nome })),
]);
</script>

<template>
  <AdminModal :width="460" eyebrow="Risco · Grupos" title="Transferir gerente" :subtitle="grupoNome" @close="emit('close')">
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Gerente atual</div>
    <div style="font-size: var(--text-sm); color: var(--text-default); margin-bottom: 18px">{{ gerenteAtual }}</div>

    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Novo gerente</div>
    <AdminSelect v-model="gerente" :options="gerenteOptions" />

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm" @click="emit('confirm', gerente)">Transferir</AdminButton>
    </template>
  </AdminModal>
</template>
