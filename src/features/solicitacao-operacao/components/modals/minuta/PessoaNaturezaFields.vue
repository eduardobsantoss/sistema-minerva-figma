<script setup lang="ts">
import { computed } from 'vue';
import { User } from 'lucide-vue-next';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  ESTADO_CIVIL_GARANTIA_OPTS,
  NACIONALIDADE_OPTS,
  REGIME_CASAMENTO_OPTS,
  emptyConjugeMinuta,
  emptyPessoaMinuta,
  estadoCivilExigeConjuge,
  parteExigeFormularioConjuge,
  type PessoaMinuta,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const form = defineModel<PessoaMinuta>({ required: true });

const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    const next = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
    if (form.value.tipoPessoa === next) return;
    // Mantém a referência do objeto no pai (reactive) e reseta o conteúdo
    Object.assign(form.value, emptyPessoaMinuta(next));
  },
});

const conjugeModel = computed({
  get: () => form.value.conjuge ?? emptyConjugeMinuta(),
  set: (v) => {
    form.value.conjuge = v;
  },
});
</script>

<template>
  <div class="flex flex-col" style="gap: 14px">
    <StepGrid>
      <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" v-model="natureza" />
    </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="000.000.000-00" required :span="3" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="6" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="3" v-model="form.rg!" />
        <SelectField
          label="Nacionalidade"
          :options="NACIONALIDADE_OPTS"
          placeholder="Selecione"
          required
          :span="4"
          v-model="form.nacionalidade!"
        />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
        <SelectField
          label="Estado Civil"
          :options="ESTADO_CIVIL_GARANTIA_OPTS"
          placeholder="Selecione"
          required
          :span="4"
          v-model="form.estadoCivil!"
        />
        <SelectField
          v-if="estadoCivilExigeConjuge(form.estadoCivil)"
          label="Regime"
          :options="REGIME_CASAMENTO_OPTS"
          placeholder="Selecione"
          :span="4"
          v-model="form.regime!"
        />
      </StepGrid>
      <template v-if="parteExigeFormularioConjuge(form.estadoCivil, form.regime)">
        <StepGrid>
          <FormField
            label="Data do Casamento"
            placeholder="dd/mm/aaaa"
            :span="4"
            v-model="form.dataCasamento!"
          />
        </StepGrid>
        <SpouseFields v-model="conjugeModel" :mostrar-data-nascimento="false" />
      </template>
    </template>

    <template v-else>
      <StepGrid>
        <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" v-model="form.cnpj!" />
        <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
        <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
        <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="3" v-model="form.dataAbertura!" />
        <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa!" />
        <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte!" />
        <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal!" />
        <FormField label="Natureza jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica!" />
        <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal!" />
        <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual!" />
      </StepGrid>

      <BentoBox title="Representante Legal" :icon="User">
        <StepGrid>
          <FormField label="CPF" placeholder="—" :span="3" v-model="form.representante!.cpf" />
          <FormField label="Nome" placeholder="—" :span="5" v-model="form.representante!.nome" />
          <SelectField
            label="Nacionalidade"
            :options="NACIONALIDADE_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.representante!.nacionalidade"
          />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
          <SelectField
            label="Estado Civil"
            :options="ESTADO_CIVIL_GARANTIA_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.representante!.estadoCivil"
          />
          <FormField label="E-mail" placeholder="—" :span="4" v-model="form.representante!.email" />
          <FormField label="Telefone" placeholder="—" :span="4" v-model="form.representante!.telefone" />
        </StepGrid>
      </BentoBox>
    </template>
  </div>
</template>
