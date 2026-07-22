<script setup lang="ts">
import { computed, watch } from 'vue';
import { User, Mail, MapPin, Landmark } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField, ToggleRow } from '../adicionar-contrato';
import {
  CREDORAS_PADRAO,
  CONTAS_BANCARIAS_MOCK,
  labelContaBancaria,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type BoletimSubscricao,
  type ContaBancaria,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const boletim = defineModel<BoletimSubscricao>({ required: true });
const contasExtras = defineModel<ContaBancaria[]>('contasExtras', { default: () => [] });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const form = computed(() => boletim.value.subscritor);
const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const todasContas = computed(() => [...CONTAS_BANCARIAS_MOCK, ...contasExtras.value]);
const contaOpts = computed(() => todasContas.value.map(labelContaBancaria));
const contaSelecionada = computed({
  get: () => {
    const c = todasContas.value.find((x) => x.id === boletim.value.contaBancariaId);
    return c ? labelContaBancaria(c) : '';
  },
  set: (label: string) => {
    const c = todasContas.value.find((x) => labelContaBancaria(x) === label);
    boletim.value.contaBancariaId = c?.id ?? '';
  },
});

watch(
  () => boletim.value.subscritorPadrao,
  (on) => {
    if (on) {
      const data = CREDORAS_PADRAO['Ceres Securitizadora'];
      if (data) Object.assign(boletim.value.subscritor, JSON.parse(JSON.stringify(data)));
    } else {
      boletim.value.subscritor = emptyPessoaMinuta('JURIDICA');
    }
  },
);

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <ToggleRow
      label="Subscritor Ceres Securitizadora"
      :on="boletim.subscritorPadrao"
      @toggle="boletim.subscritorPadrao = !boletim.subscritorPadrao"
    />

    <StepGrid>
      <SelectField label="Natureza" :options="NATUREZA_OPTS" :span="4" :disabled="boletim.subscritorPadrao" v-model="natureza" />
    </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="—" required :span="3" :disabled="boletim.subscritorPadrao" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="5" :disabled="boletim.subscritorPadrao" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="2" :disabled="boletim.subscritorPadrao" v-model="form.rg!" />
        <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" :disabled="boletim.subscritorPadrao" v-model="form.orgaoEmissorRg!" />
        <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoProdutorRural!" />
        <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.nacionalidade!" />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.profissao!" />
        <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.estadoCivil!" />
      </StepGrid>
      <SpouseFields
        v-if="estadoCivilExigeConjuge(form.estadoCivil)"
        :disabled="boletim.subscritorPadrao"
        :model-value="form.conjuge ?? emptyConjugeMinuta()"
        @update:model-value="form.conjuge = $event"
      />
    </template>
    <template v-else>
      <StepGrid>
        <FormField label="CNPJ" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.cnpj!" />
        <FormField label="Razão social" placeholder="—" :span="5" :disabled="boletim.subscritorPadrao" v-model="form.razaoSocial!" />
        <FormField label="Nome Fantasia" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.nomeFantasia!" />
        <FormField label="Data de abertura" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.dataAbertura!" />
        <FormField label="Tipo" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.tipoEmpresa!" />
        <FormField label="Porte" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.porte!" />
        <FormField label="Atividade principal" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.atividadePrincipal!" />
        <FormField label="Natureza jurídica" placeholder="—" :span="6" :disabled="boletim.subscritorPadrao" v-model="form.naturezaJuridica!" />
        <FormField label="Inscrição municipal" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoMunicipal!" />
        <FormField label="Inscrição estadual" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.inscricaoEstadual!" />
      </StepGrid>

      <BentoBox title="Representante Legal" :icon="User">
        <StepGrid>
          <FormField label="CPF" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.representante!.cpf" />
          <FormField label="Nome" placeholder="—" :span="5" :disabled="boletim.subscritorPadrao" v-model="form.representante!.nome" />
          <FormField label="RG" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.rg" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.inscricaoProdutorRural" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.nacionalidade" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.dataNascimento" />
          <FormField label="Profissão" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.representante!.profissao" />
        </StepGrid>
      </BentoBox>
    </template>

    <BentoBox title="Contato" :icon="Mail">
      <StepGrid>
        <FormField label="E-mail" placeholder="—" required :span="5" :disabled="boletim.subscritorPadrao" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" required :span="4" :disabled="boletim.subscritorPadrao" v-model="form.telefone!" />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Endereço" :icon="MapPin">
      <StepGrid>
        <FormField label="CEP" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" :disabled="boletim.subscritorPadrao" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" :disabled="boletim.subscritorPadrao" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" :disabled="boletim.subscritorPadrao" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="boletim.subscritorPadrao || !form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" :disabled="boletim.subscritorPadrao" v-model="form.pais!" />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Dados bancários do subscritor" :icon="Landmark">
      <StepGrid>
        <SelectField
          label="Conta bancária"
          :options="contaOpts"
          placeholder="Selecione"
          :span="12"
          v-model="contaSelecionada"
        />
      </StepGrid>
    </BentoBox>

    <BentoBox title="Notas subscritas">
      <StepGrid>
        <FormField label="Quantidade" placeholder="—" required :span="3" v-model="boletim.quantidade" />
        <FormField label="Preço total unitário" placeholder="R$ 0,00" required currency :span="3" v-model="boletim.precoTotalUnitario" />
        <FormField label="Preço de subscrição" placeholder="R$ 0,00" required currency :span="3" v-model="boletim.precoSubscricao" />
        <FormField label="Dias de integração" placeholder="—" :span="3" v-model="boletim.diasIntegracao" />
      </StepGrid>
    </BentoBox>
  </div>
</template>
