<script setup lang="ts">
import { computed, watch } from 'vue';
import { FileText } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../../data/operacaoData';
import { BentoBox, StepGrid, SelectField, FormField } from '../adicionar-contrato';
import { cidadesDaUf, SERIE_EMISSAO_OPTS, type EmissaoMinuta } from '../../../data/minutaData';

const props = withDefaults(defineProps<{ modoNc?: boolean }>(), { modoNc: false });
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
  <div class="flex flex-col" style="gap: 20px">
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

    <BentoBox v-if="modoNc" title="Dados da emissão — Nota Comercial" :icon="FileText">
      <StepGrid>
        <FormField label="Número de emissão" placeholder="—" required :span="3" v-model="form.numero!" />
        <SelectField label="Série" :options="SERIE_EMISSAO_OPTS" placeholder="Selecione" required :span="3" v-model="form.serie!" />
        <FormField label="Valor nominal unitário" placeholder="R$ 0,00" required currency :span="3" v-model="form.valorNominalUnitario!" />
        <FormField label="Quantidade" placeholder="—" required :span="3" v-model="form.quantidade!" />
        <FormField label="Valor total" placeholder="R$ 0,00" required currency :span="4" v-model="form.valorTotal!" />
      </StepGrid>
    </BentoBox>
  </div>
</template>
