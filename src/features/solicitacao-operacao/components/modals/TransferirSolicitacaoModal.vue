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

const props = defineProps<{ veiculoAtual?: string }>();
const emit = defineEmits<{ close: []; confirm: [veiculo: string] }>();

const VEICULO_OPTS = computed(() =>
  [
    ...new Set([
      ...VEICULOS_FIDC_SEED.map((v) => v.vehicleName),
      ...VEICULOS_CRA_SEED.map((v) => v.vehicleName),
      ...VEICULOS_GARANTIAS_SEED.map((v) => v.vehicleName),
      'Ceres Investimentos',
    ]),
  ].filter((v) => v !== props.veiculoAtual),
);

const veiculo = ref('');
const canSubmit = computed(() => veiculo.value.trim() !== '');

function confirmar() {
  if (!canSubmit.value) return;
  emit('confirm', veiculo.value);
  emit('close');
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Transferir entre veículo de operação" subtitle="Mova esta solicitação para outro veículo" @close="emit('close')">
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
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="confirmar" type="button">Transferir</AdminButton>
    </template>
  </AdminModal>
</template>
