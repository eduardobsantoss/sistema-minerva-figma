<script setup lang="ts">
import { StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  CONFINA_BASE_DIAS_OPTS,
  CONFINA_GRUPO_OPTS,
  CONFINA_OUTORGADO_OPTS,
  type ConfinaOperacaoForm,
} from '../../../data/minutaData';
import ConfinaPreviaSimulacao from './ConfinaPreviaSimulacao.vue';

const form = defineModel<ConfinaOperacaoForm>({ required: true });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Insira o grupo empresarial"
        :options="[...CONFINA_GRUPO_OPTS]"
        placeholder="Selecione"
        :span="6"
        v-model="form.grupoEmpresarial"
      />
      <SelectField
        label="Insira o doc. do outorgado"
        :options="[...CONFINA_OUTORGADO_OPTS]"
        placeholder="Selecione"
        :span="6"
        v-model="form.outorgado"
      />
      <FormField label="Quantidade de animais" placeholder="0" :span="4" v-model="form.quantidadeAnimais" />
      <FormField label="Valor unitário no dia (Arroba)" placeholder="0" :span="4" v-model="form.valorUnitarioArroba" />
      <FormField label="Peso do lote (Arroba)" placeholder="0" :span="4" v-model="form.pesoLoteArroba" />
      <FormField label="Taxa de Juros" placeholder="0" :span="4" v-model="form.taxaJuros" />
      <FormField label="Emissão" placeholder="dd/mm/aaaa" :span="4" v-model="form.emissao" />
      <FormField label="Vencimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.vencimento" />
      <SelectField
        label="Base de cálculo (dias)"
        :options="[...CONFINA_BASE_DIAS_OPTS]"
        placeholder="Selecione"
        :span="12"
        v-model="form.baseCalculoDias"
      />
    </StepGrid>

    <ConfinaPreviaSimulacao :operacao="form" />
  </div>
</template>
