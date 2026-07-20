<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import { NACIONALIDADE_OPTS, type ConjugeMinuta } from '../../../data/minutaData';

withDefaults(
  defineProps<{ disabled?: boolean }>(),
  { disabled: false },
);

const conjuge = defineModel<ConjugeMinuta>({ required: true });
</script>

<template>
  <BentoBox title="Dados do cônjuge" :icon="Users">
    <StepGrid>
      <FormField label="Nome completo do cônjuge" placeholder="—" required :span="5" :disabled="disabled" v-model="conjuge.nome" />
      <FormField label="CPF do cônjuge" placeholder="000.000.000-00" required :span="3" :disabled="disabled" v-model="conjuge.cpf" />
      <FormField label="RG do cônjuge" placeholder="—" :span="4" :disabled="disabled" v-model="conjuge.rg" />
      <FormField label="Data de nascimento do cônjuge" placeholder="dd/mm/aaaa" required :span="4" :disabled="disabled" v-model="conjuge.dataNascimento" />
      <SelectField
        label="Nacionalidade do cônjuge"
        :options="NACIONALIDADE_OPTS"
        placeholder="Selecione"
        required
        :span="4"
        :disabled="disabled"
        v-model="conjuge.nacionalidade"
      />
      <FormField label="Profissão do cônjuge" placeholder="—" :span="4" :disabled="disabled" v-model="conjuge.profissao" />
    </StepGrid>
  </BentoBox>
</template>
