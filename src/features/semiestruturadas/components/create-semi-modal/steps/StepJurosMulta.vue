<script setup lang="ts">
import type { NewSemiData } from '../types';
import StepGrid from '../StepGrid.vue';
import FormField from '../FormField.vue';

const form = defineModel<NewSemiData>({ required: true });
</script>

<template>
  <StepGrid>
    <FormField
      label="Juros moratórios (% mensal)"
      placeholder="Ex: 1,00"
      type="number"
      :span="6"
      v-model="form.interestRate"
    />
    <FormField
      label="Multa em caso de atraso (%)"
      placeholder="Mínimo 1"
      type="number"
      :span="6"
      v-model="form.paymentDelayFine"
    />
  </StepGrid>
</template>
