<script setup lang="ts">
import { computed } from 'vue';
import {
  CREDORES_SEED,
  ESCRITURADORES_SEED,
  TIPOS_CONTRATO,
} from '../../../data/semiestruturadasData';
import type { NewSemiData } from '../types';
import StepGrid from '../StepGrid.vue';
import FormField from '../FormField.vue';
import SelectField from '../SelectField.vue';
import ToggleRow from '../ToggleRow.vue';

const form = defineModel<NewSemiData>({ required: true });

const credorOpts = CREDORES_SEED.map((c) => c.nome);
const escrituradorOpts = ESCRITURADORES_SEED.map((c) => c.nome);
const contratoOpts = [...TIPOS_CONTRATO];

const credorLabel = computed({
  get: () => CREDORES_SEED.find((c) => c.id === form.value.credorId)?.nome ?? '',
  set: (label: string) => {
    form.value.credorId = CREDORES_SEED.find((c) => c.nome === label)?.id ?? '';
  },
});

const escrituradorLabel = computed({
  get: () => ESCRITURADORES_SEED.find((c) => c.id === form.value.escrituradorId)?.nome ?? '',
  set: (label: string) => {
    form.value.escrituradorId = ESCRITURADORES_SEED.find((c) => c.nome === label)?.id ?? '';
  },
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <FormField
        label="Nome"
        placeholder="semiestruturada_NC_Grupo"
        :span="12"
        v-model="form.nome"
      />
      <SelectField
        label="Credor"
        :options="credorOpts"
        placeholder="Selecione"
        :span="6"
        v-model="credorLabel"
      />
      <SelectField
        label="Escriturador"
        :options="escrituradorOpts"
        placeholder="Opcional"
        :span="6"
        v-model="escrituradorLabel"
      />
      <SelectField
        label="Tipo de contrato"
        :options="contratoOpts"
        placeholder="Selecione"
        :span="12"
        v-model="form.contractType"
      />
    </StepGrid>
    <div class="flex flex-col" style="gap: 10px">
      <ToggleRow
        label="Validar títulos vencidos por sacado"
        :on="form.needsPayerBondsExpireValidation"
        @toggle="form.needsPayerBondsExpireValidation = !form.needsPayerBondsExpireValidation"
      />
      <ToggleRow
        label="Permite operar com entrega futura"
        :on="form.operateWithFutureDelivery"
        @toggle="form.operateWithFutureDelivery = !form.operateWithFutureDelivery"
      />
    </div>
  </div>
</template>
