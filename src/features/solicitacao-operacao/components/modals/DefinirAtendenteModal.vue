<script setup lang="ts">
import { computed, ref } from 'vue';

import { SelectField, StepGrid } from './adicionar-contrato';
import { solicitacoes } from '../../data/operacaoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [atendente: string] }>();

const ATENDENTE_OPTS = [
  ...new Set(solicitacoes.map((s) => s.atendente).filter(Boolean)),
].sort();

const atendente = ref('');
const canSubmit = computed(() => atendente.value.trim() !== '');

function confirmar() {
  if (!canSubmit.value) return;
  emit('confirm', atendente.value);
  emit('close');
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Definir atendente atual" subtitle="Selecione o atendente responsável por esta solicitação" @close="emit('close')">
    <div>
      <StepGrid>
        <SelectField
          label="Atendente"
          :options="ATENDENTE_OPTS"
          placeholder="Selecione"
          :span="12"
          v-model="atendente"
        />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="confirmar" type="button">Definir</AdminButton>
    </template>
  </AdminModal>
</template>
