<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, SelectField } from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  ESCRITURADOR_PADRAO_OPTS,
  ESCRITURADORES_PADRAO,
  emptyPessoaMinuta,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';

const escrituradorPadrao = defineModel<string>('escrituradorPadrao', { default: '' });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);

const modoPadrao = computed(() => !!escrituradorPadrao.value);
const camposHabilitados = computed(() => modoPadrao.value || !!docBusca.value);
const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

const DOC_OPTS = [
  '22.610.500/0001-88 - VÓRTX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
  '15.444.333/0001-22 - BMP MONEY PLUS SOCIEDADE DE CRÉDITO DIRETO S.A.',
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
];

watch(escrituradorPadrao, (v) => {
  if (!v) return;
  const data = ESCRITURADORES_PADRAO[v];
  if (!data) return;
  Object.assign(form.value, JSON.parse(JSON.stringify(data)));
  docBusca.value = '';
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
  if (escrituradorPadrao.value) return;
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (found) {
    Object.assign(form.value, JSON.parse(JSON.stringify(found)));
  } else {
    form.value = emptyPessoaMinuta('JURIDICA');
  }
}

function limparPadrao() {
  escrituradorPadrao.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <StepGrid>
      <SelectField
        label="Selecione o escriturador padrão"
        :options="ESCRITURADOR_PADRAO_OPTS"
        placeholder="Selecione"
        :span="5"
        v-model="escrituradorPadrao"
      />
      <SelectField
        label="Insira o doc. do cliente"
        :options="DOC_OPTS"
        placeholder="Selecione"
        :span="7"
        :model-value="docBusca"
        :disabled="modoPadrao"
        @update:model-value="onDocSelect"
      />
    </StepGrid>

    <template v-if="camposHabilitados">
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

      <BentoBox title="Contato" :icon="Mail">
        <StepGrid>
          <FormField label="E-mail" placeholder="—" :span="5" v-model="form.email!" />
          <SelectField label="DDI" :options="DDI_OPTS" :span="3" v-model="form.ddi!" />
          <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone!" />
        </StepGrid>
      </BentoBox>

      <BentoBox title="Endereço" :icon="MapPin">
        <StepGrid>
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
      </BentoBox>
    </template>

    <button
      v-if="modoPadrao"
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
      @click="limparPadrao"
    >
      Limpar escriturador padrão
    </button>
  </div>
</template>
