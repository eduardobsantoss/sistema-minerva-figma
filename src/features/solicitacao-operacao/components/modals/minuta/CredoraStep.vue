<script setup lang="ts">
import { computed, watch } from 'vue';
import { User } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  CREDORA_PADRAO_OPTS,
  CREDORAS_PADRAO,
  emptyPessoaMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';

const credoraPadrao = defineModel<string>('credoraPadrao', { default: '' });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });
const contatoSel = defineModel<string>('contato', { default: '' });
const enderecoSel = defineModel<string>('endereco', { default: '' });
const representanteSel = defineModel<string>('representante', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const modoCredoraPadrao = computed(() => !!credoraPadrao.value);
const modoCliente = computed(() => !!docBusca.value && !credoraPadrao.value);
const camposHabilitados = computed(() => modoCredoraPadrao.value || modoCliente.value);

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const DOC_OPTS = [
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  '56.025.302/0001-79 - CERES TRADING E INVESTIMENTOS S.A.',
];

const contatoOpts = computed(() => form.value.contatos ?? []);
const enderecoOpts = computed(() => form.value.enderecos ?? []);
const representanteOpts = computed(() => form.value.representantes ?? []);

watch(credoraPadrao, (v) => {
  if (!v) return;
  const data = CREDORAS_PADRAO[v];
  if (!data) return;
  Object.assign(form.value, JSON.parse(JSON.stringify(data)));
  docBusca.value = '';
  contatoSel.value = '';
  enderecoSel.value = '';
  representanteSel.value = '';
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function onDocSelect(v: string) {
  if (credoraPadrao.value) return;
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (found) {
    Object.assign(form.value, JSON.parse(JSON.stringify(found)));
    contatoSel.value = found.contatos?.[0] ?? '';
    enderecoSel.value = found.enderecos?.[0] ?? '';
  } else {
    form.value = emptyPessoaMinuta('JURIDICA');
  }
}

function limparCredoraPadrao() {
  credoraPadrao.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Selecione a credora padrão"
        :options="CREDORA_PADRAO_OPTS"
        placeholder="Selecione"
        :span="4"
        v-model="credoraPadrao"
      />
      <SelectField
        label="Insira o doc. do cliente"
        :options="DOC_OPTS"
        placeholder="Selecione"
        :span="5"
        :model-value="docBusca"
        :disabled="modoCredoraPadrao"
        @update:model-value="onDocSelect"
      />
      <SelectField
        v-if="modoCliente"
        label="Contato do cliente"
        :options="contatoOpts"
        placeholder="Selecione"
        :span="3"
        v-model="contatoSel"
      />
      <SelectField
        v-else-if="modoCredoraPadrao"
        label="Natureza"
        :options="NATUREZA_OPTS"
        :span="3"
        v-model="natureza"
      />
    </StepGrid>

    <template v-if="modoCliente">
      <StepGrid>
        <SelectField label="Endereço do cliente" :options="enderecoOpts" placeholder="Selecione" :span="6" v-model="enderecoSel" />
        <SelectField label="Representante legal do cliente" :options="representanteOpts" placeholder="Selecione" :span="6" v-model="representanteSel" />
      </StepGrid>
    </template>

    <template v-else-if="camposHabilitados">
      <template v-if="form.tipoPessoa === 'FISICA'">
        <StepGrid>
          <FormField label="CPF" placeholder="—" :span="3" v-model="form.cpf!" />
          <FormField label="Nome" placeholder="—" :span="5" v-model="form.nome" />
          <FormField label="RG" placeholder="—" :span="4" v-model="form.rg!" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.nacionalidade!" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataNascimento!" />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
          <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" :span="4" v-model="form.estadoCivil!" />
        </StepGrid>
      </template>
      <template v-else>
        <StepGrid>
          <FormField label="CNPJ" placeholder="—" :span="4" v-model="form.cnpj!" />
          <FormField label="Razão social" placeholder="—" :span="5" v-model="form.razaoSocial!" />
          <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia!" />
          <FormField label="Data de abertura" placeholder="—" :span="3" v-model="form.dataAbertura!" />
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
            <FormField label="RG" placeholder="—" :span="4" v-model="form.representante!.rg" />
            <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.representante!.inscricaoProdutorRural" />
            <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.representante!.nacionalidade" />
            <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.representante!.dataNascimento" />
            <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
          </StepGrid>
        </BentoBox>
      </template>

      <StepGrid>
        <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep!" />
        <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade!" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numero!" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro!" />
        <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais!" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado!" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="5"
          :disabled="!form.estado"
          v-model="form.cidade!"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="4" v-model="form.pais!" />
      </StepGrid>
    </template>

    <button
      v-if="modoCredoraPadrao"
      type="button"
      style="
        align-self: flex-start;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: var(--text-xs);
        font-weight: var(--weight-semibold);
        text-decoration: underline;
      "
      @click="limparCredoraPadrao"
    >
      Limpar credora padrão
    </button>
  </div>
</template>
