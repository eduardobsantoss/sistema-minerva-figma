<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin, User, Trash2, Users } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  buscarClientePorDoc,
  emptyPessoaMinuta,
  emptyConjugeMinuta,
  ESTADO_CIVIL_OPTS,
  NACIONALIDADE_OPTS,
  estadoCivilExigeConjuge,
  cidadesDaUf,
  type PessoaMinuta,
} from '../../../data/minutaData';
import SpouseFields from './SpouseFields.vue';

const props = withDefaults(
  defineProps<{ apenasPessoaJuridica?: boolean; maxEmitentes?: number }>(),
  { apenasPessoaJuridica: false, maxEmitentes: undefined },
);

const emitentes = defineModel<PessoaMinuta[]>('emitentes', { default: () => [] });
const form = defineModel<PessoaMinuta>('form', { required: true });
const docBusca = defineModel<string>('docBusca', { default: '' });

const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const NATUREZA_OPTS = ['Pessoa Física', 'Pessoa Jurídica'];

const atingiuLimite = computed(
  () => props.maxEmitentes != null && emitentes.value.length >= props.maxEmitentes,
);

const natureza = computed({
  get: () => (form.value.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    if (props.apenasPessoaJuridica) return;
    form.value.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado ?? ''));

watch(
  () => props.apenasPessoaJuridica,
  (v) => {
    if (v && form.value.tipoPessoa !== 'JURIDICA') {
      form.value = emptyPessoaMinuta('JURIDICA');
    }
  },
  { immediate: true },
);

watch(docBusca, (v) => {
  const found = buscarClientePorDoc(v);
  if (!found) return;
  if (props.apenasPessoaJuridica && found.tipoPessoa !== 'JURIDICA') return;
  Object.assign(form.value, JSON.parse(JSON.stringify(found)));
});

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

function addEmitente() {
  const nome = form.value.tipoPessoa === 'FISICA' ? form.value.nome || form.value.cpf : form.value.razaoSocial || form.value.nomeFantasia;
  const doc = form.value.tipoPessoa === 'FISICA' ? form.value.cpf || form.value.documento : form.value.cnpj || form.value.documento;
  if (!nome || !doc) return;
  form.value.documento = doc;
  form.value.nome = nome;
  emitentes.value = [...emitentes.value, JSON.parse(JSON.stringify(form.value))];
  form.value = emptyPessoaMinuta(form.value.tipoPessoa);
  docBusca.value = '';
}

function removeEmitente(i: number) {
  emitentes.value = emitentes.value.filter((_, idx) => idx !== i);
}

const DOC_OPTS = [
  '34.470.721/0001-87 - AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  '144.112.938-38 - MARCELO TARTARO',
  '56.025.302/0001-79 - CERES TRADING E INVESTIMENTOS S.A.',
];

function onDocSelect(v: string) {
  docBusca.value = v;
  const docPart = v.split(' - ')[0]?.trim() ?? v;
  const found = buscarClientePorDoc(docPart);
  if (!found) return;
  if (props.apenasPessoaJuridica && found.tipoPessoa !== 'JURIDICA') return;
  Object.assign(form.value, JSON.parse(JSON.stringify(found)));
}

const docOptsFiltrados = computed(() =>
  props.apenasPessoaJuridica
    ? DOC_OPTS.filter((o) => !o.includes('144.112.938-38'))
    : DOC_OPTS,
);
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <template v-if="!atingiuLimite">
      <StepGrid>
        <SelectField
          label="Insira o doc. do cliente"
          :options="docOptsFiltrados"
          placeholder="Selecione"
          :span="apenasPessoaJuridica ? 12 : 7"
          :model-value="docBusca"
          @update:model-value="onDocSelect"
        />
        <SelectField
          v-if="!apenasPessoaJuridica"
          label="Natureza"
          :options="NATUREZA_OPTS"
          :span="5"
          v-model="natureza"
        />
      </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="000.000.000-00" required :span="3" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="5" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="2" v-model="form.rg!" />
        <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" v-model="form.orgaoEmissorRg!" />
        <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
        <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" v-model="form.nacionalidade!" />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
        <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" v-model="form.estadoCivil!" />
        <FormField label="E-mail do representante" placeholder="—" :span="4" v-model="form.emailRepresentante!" />
      </StepGrid>
      <SpouseFields
        v-if="estadoCivilExigeConjuge(form.estadoCivil)"
        :model-value="form.conjuge ?? emptyConjugeMinuta()"
        @update:model-value="form.conjuge = $event"
      />
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
          <FormField label="RG" placeholder="—" :span="4" v-model="form.representante!.rg" />
          <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.representante!.inscricaoProdutorRural" />
          <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.representante!.nacionalidade" />
          <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.representante!.dataNascimento" />
          <FormField label="Profissão" placeholder="—" :span="4" v-model="form.representante!.profissao" />
        </StepGrid>
      </BentoBox>
    </template>

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

    <div class="flex justify-end">
      <AddButton @click="addEmitente">Adicionar emitente</AddButton>
    </div>
    </template>

    <div
      v-if="atingiuLimite"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        font-size: var(--text-sm);
        color: var(--text-muted);
      "
    >
      Limite de 1 emissora atingido para Nota Comercial. Remova a emissora atual para adicionar outra.
    </div>

    <EmptyState
      v-if="emitentes.length === 0"
      :icon="Users"
      title="Nenhum emitente adicionado"
      hint="Preencha os dados acima e clique em Adicionar emitente."
    />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.6fr 1.2fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Nome / Razão Social</div>
        <div>CPF / CNPJ</div>
        <div />
      </div>
      <div
        v-for="(e, i) in emitentes"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1.6fr 1.2fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.documento }}</div>
        <button
          aria-label="Remover"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; color: var(--danger-base)"
          @click="removeEmitente(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
