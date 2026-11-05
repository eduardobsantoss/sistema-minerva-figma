<script setup lang="ts">
import { computed, ref } from 'vue';

import { SelectField, StepGrid } from './adicionar-contrato';
import {
  VEICULOS_FIDC_SEED,
  VEICULOS_CRA_SEED,
  VEICULOS_GARANTIAS_SEED,
} from '../../data/taxasVeiculosData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [veiculo: string] }>();

const VEICULO_OPTS = [
  ...new Set([
    ...VEICULOS_FIDC_SEED.map((v) => v.vehicleName),
    ...VEICULOS_CRA_SEED.map((v) => v.vehicleName),
    ...VEICULOS_GARANTIAS_SEED.map((v) => v.vehicleName),
    'Ceres Investimentos',
  ]),
];

const veiculo = ref('');
const canSubmit = computed(() => veiculo.value.trim() !== '');

function confirmar() {
  if (!canSubmit.value) return;
  emit('confirm', veiculo.value);
  emit('close');
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Vincular a um veículo de operação" subtitle="Selecione o veículo ao qual esta solicitação será vinculada" @close="emit('close')">
    <div>
      <StepGrid>
        <SelectField
          label="Veículo"
          :options="VEICULO_OPTS"
          placeholder="Selecione"
          :span="12"
          v-model="veiculo"
        />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="confirmar" type="button">Vincular</AdminButton>
    </template>
  </AdminModal>
</template>
