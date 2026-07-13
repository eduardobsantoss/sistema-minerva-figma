<script setup lang="ts">
import { computed, watch } from 'vue';
import { FileText } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../../data/operacaoData';
import { BentoBox, StepGrid, SelectField } from '../adicionar-contrato';
import { cidadesDaUf, type EmissaoMinuta } from '../../../data/minutaData';

const form = defineModel<EmissaoMinuta>({ required: true });

const cidadeOpts = computed(() => cidadesDaUf(form.value.uf));
const ufEmissaoOpts = computed(() =>
  ['MG', 'SP', 'MT', 'GO', 'PR', 'MS', 'BA', 'TO'].filter((u) => UF_OPTIONS.includes(u)),
);

watch(
  () => form.value.uf,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);
</script>

<template>
  <BentoBox title="Emissão" :icon="FileText">
    <StepGrid>
      <SelectField label="UF da emissão" :options="ufEmissaoOpts" placeholder="Selecione" required :span="4" v-model="form.uf" />
      <SelectField
        label="Cidade da emissão"
        :options="cidadeOpts"
        placeholder="Selecione"
        required
        :span="8"
        :disabled="!form.uf"
        v-model="form.cidade"
      />
    </StepGrid>
  </BentoBox>
</template>
