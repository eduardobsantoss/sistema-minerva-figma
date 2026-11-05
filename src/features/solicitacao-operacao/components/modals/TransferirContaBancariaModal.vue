<script setup lang="ts">
import { computed, ref } from 'vue';

import { SelectField, StepGrid } from './adicionar-contrato';
import { CONTAS_BANCARIAS_MOCK, labelContaBancaria } from '../../data/minutaData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{
  close: [];
  confirm: [payload: { id: string; label: string }];
}>();

const CONTA_OPTS = CONTAS_BANCARIAS_MOCK.map((c) => labelContaBancaria(c));
const contaLabel = ref('');

const canSubmit = computed(() => contaLabel.value.trim() !== '');

function confirmar() {
  if (!canSubmit.value) return;
  const conta = CONTAS_BANCARIAS_MOCK.find((c) => labelContaBancaria(c) === contaLabel.value);
  if (!conta) return;
  emit('confirm', { id: conta.id, label: contaLabel.value });
  emit('close');
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Transferir conta bancária" subtitle="Defina a conta bancária de destino desta solicitação" @close="emit('close')">
    <div>
      <StepGrid>
        <SelectField
          label="Conta bancária de destino"
          :options="CONTA_OPTS"
          placeholder="Selecione"
          :span="12"
          v-model="contaLabel"
        />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="confirmar" type="button">Transferir</AdminButton>
    </template>
  </AdminModal>
</template>
