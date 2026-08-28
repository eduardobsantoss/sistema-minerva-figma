<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, User, Building2, Phone, MapPin } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI, enriquecerParteRelacionada, type ParteTipo, type ParteRelacionada } from '../../data/operacaoData';
import { BentoBox } from './parte-relacionada';
import { StepGrid, FormField, SelectField } from './adicionar-contrato';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  estadoCivilExigeConjuge,
  parteExigeFormularioConjuge,
  emptyConjugeMinuta,
  emptyPessoaMinuta,
  NACIONALIDADE_OPTS as NAC_OPTS,
  ESTADO_CIVIL_OPTS,
  REGIME_CASAMENTO_OPTS,
  type ConjugeMinuta,
  type RepresentanteLegal,
} from '../../data/minutaData';
import SpouseFields from './minuta/SpouseFields.vue';

const props = defineProps<{ parte?: ParteRelacionada | null }>();
const emit = defineEmits<{ close: []; create: [data: ParteRelacionada]; save: [data: ParteRelacionada] }>();

export interface NewParteRelacionadaData {
  tipoPessoa: 'FISICA' | 'JURIDICA';
  cpf: string;
  nomeFisica: string;
  rg: string;
  inscricaoProdutorRural: string;
  nacionalidade: string;
  dataNascimento: string;
  profissao: string;
  estadoCivil: string;
  regime: string;
  dataCasamento: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  tipoEmpresa: string;
  porte: string;
  atividadePrincipal: string;
  naturezaJuridica: string;
  inscricaoMunicipal: string;
  inscricaoEstadual: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  nomeContato: string;
  email: string;
  ddi: string;
  telefone: string;
  tipos: string[];
  possuiConjuge: boolean;
  orgaoEmissorRg: string;
}

const NACIONALIDADE_OPTS = NAC_OPTS;
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

const TIPOS_OPTS: { label: string; codigo: ParteTipo }[] = [
  { label: 'Cônjuge', codigo: 'CON' },
  { label: 'Avalista', codigo: 'AVA' },
  { label: 'Sócio', codigo: 'SOC' },
  { label: 'Interveniente Anuente', codigo: 'ITA' },
  { label: 'Representante Legal', codigo: 'REP' },
  { label: 'Procurador', codigo: 'PROC' },
];

const isEdit = computed(() => !!props.parte);

function emptyForm(): NewParteRelacionadaData {
  return {
    tipoPessoa: 'FISICA',
    cpf: '',
    nomeFisica: '',
    rg: '',
    inscricaoProdutorRural: '',
    nacionalidade: '',
    dataNascimento: '',
    profissao: '',
    estadoCivil: '',
    regime: '',
    dataCasamento: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    dataAbertura: '',
    tipoEmpresa: '',
    porte: '',
    atividadePrincipal: '',
    naturezaJuridica: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    cep: '',
    localidade: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    nomeContato: '',
    email: '',
    ddi: '+55',
    telefone: '',
    tipos: [],
    possuiConjuge: false,
    orgaoEmissorRg: '',
  };
}

function hydrate(p: ParteRelacionada) {
  Object.assign(form, emptyForm(), {
    tipoPessoa: p.tipoPessoa,
    cpf: p.cpf ?? (p.tipoPessoa === 'FISICA' ? p.documento : ''),
    nomeFisica: p.tipoPessoa === 'FISICA' ? p.nome : '',
    rg: p.rg ?? '',
    inscricaoProdutorRural: p.inscricaoProdutorRural ?? '',
    nacionalidade: p.nacionalidade ?? '',
    dataNascimento: p.dataNascimento ?? '',
    profissao: p.profissao ?? '',
    estadoCivil: p.estadoCivil ?? '',
    regime: p.regime ?? '',
    dataCasamento: p.dataCasamento ?? '',
    cnpj: p.cnpj ?? (p.tipoPessoa === 'JURIDICA' ? p.documento : ''),
    razaoSocial: p.razaoSocial ?? (p.tipoPessoa === 'JURIDICA' ? p.nome : ''),
    nomeFantasia: p.nomeFantasia ?? '',
    dataAbertura: p.dataAbertura ?? '',
    tipoEmpresa: p.tipoEmpresa ?? '',
    porte: p.porte ?? '',
    atividadePrincipal: p.atividadePrincipal ?? '',
    naturezaJuridica: p.naturezaJuridica ?? '',
    inscricaoMunicipal: p.inscricaoMunicipal ?? '',
    inscricaoEstadual: p.inscricaoEstadual ?? '',
    cep: p.cep ?? '',
    localidade: p.localidade ?? '',
    numero: p.numero ?? '',
    bairro: p.bairro ?? '',
    infoAdicionais: p.infoAdicionais ?? '',
    cidade: p.cidade ?? '',
    estado: p.estado ?? '',
    pais: p.pais ?? 'Brasil',
    nomeContato: p.nomeContato ?? p.nome,
    email: p.email,
    ddi: p.ddi ?? '+55',
    telefone: p.telefone,
    tipos: TIPOS_OPTS.filter((t) => p.tipos.includes(t.codigo)).map((t) => t.label),
    possuiConjuge: !!p.possuiConjuge,
  });
  Object.assign(conjuge, p.conjuge ?? emptyConjugeMinuta());
  Object.assign(representante, p.representante ?? { ...emptyPessoaMinuta('JURIDICA').representante! });
}

const form = reactive<NewParteRelacionadaData>(emptyForm());

const conjuge = reactive<ConjugeMinuta>(emptyConjugeMinuta());
const representante = reactive<RepresentanteLegal>({ ...emptyPessoaMinuta('JURIDICA').representante! });

watch(
  () => [form.estadoCivil, form.regime] as const,
  ([ec, regime]) => {
    if (!estadoCivilExigeConjuge(ec)) {
      form.regime = '';
      form.dataCasamento = '';
      form.possuiConjuge = false;
      return;
    }
    form.possuiConjuge = parteExigeFormularioConjuge(ec, regime);
  },
);

if (props.parte) hydrate(props.parte);

const tipoPessoaLabel = computed({
  get: () => (form.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'),
  set: (v: string) => {
    form.tipoPessoa = v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA';
  },
});

function toggleTipo(label: string) {
  const idx = form.tipos.indexOf(label);
  if (idx >= 0) form.tipos.splice(idx, 1);
  else form.tipos.push(label);
}

function onPaisChange(v: string) {
  form.pais = v;
  const match = PAISES_DDI.find((p) => p.pais === v);
  if (match) form.ddi = match.ddi;
}

const nome = computed(() => (form.tipoPessoa === 'FISICA' ? form.nomeFisica : form.razaoSocial || form.nomeFantasia));
const documento = computed(() => (form.tipoPessoa === 'FISICA' ? form.cpf : form.cnpj));
const canSubmit = computed(() => nome.value.trim() !== '' && documento.value.trim() !== '');

function handleSubmit() {
  if (!canSubmit.value) return;
  const codigos = TIPOS_OPTS.filter((t) => form.tipos.includes(t.label)).map((t) => t.codigo);
  const data = enriquecerParteRelacionada({
    nome: nome.value,
    documento: documento.value,
    email: form.email,
    telefone: form.telefone,
    tipos: codigos,
    tipoPessoa: form.tipoPessoa,
    cpf: form.cpf,
    rg: form.rg,
    inscricaoProdutorRural: form.inscricaoProdutorRural,
    nacionalidade: form.nacionalidade,
    dataNascimento: form.dataNascimento,
    profissao: form.profissao,
    estadoCivil: form.estadoCivil,
    regime: form.regime || undefined,
    dataCasamento: form.dataCasamento || undefined,
    cnpj: form.cnpj,
    razaoSocial: form.razaoSocial,
    nomeFantasia: form.nomeFantasia,
    dataAbertura: form.dataAbertura,
    tipoEmpresa: form.tipoEmpresa,
    porte: form.porte,
    atividadePrincipal: form.atividadePrincipal,
    naturezaJuridica: form.naturezaJuridica,
    inscricaoMunicipal: form.inscricaoMunicipal,
    inscricaoEstadual: form.inscricaoEstadual,
    cep: form.cep,
    localidade: form.localidade,
    numero: form.numero,
    bairro: form.bairro,
    infoAdicionais: form.infoAdicionais,
    cidade: form.cidade,
    estado: form.estado,
    pais: form.pais,
    nomeContato: form.nomeContato,
    ddi: form.ddi,
    possuiConjuge: form.tipoPessoa === 'FISICA' ? parteExigeFormularioConjuge(form.estadoCivil, form.regime) : false,
    conjuge:
      form.tipoPessoa === 'FISICA' && parteExigeFormularioConjuge(form.estadoCivil, form.regime)
        ? { ...conjuge }
        : undefined,
    representante: form.tipoPessoa === 'JURIDICA' ? { ...representante } : undefined,
    contatosRelacionados: props.parte?.contatosRelacionados ?? [],
  });
  if (props.parte) emit('save', data);
  else emit('create', data);
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 960px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ isEdit ? 'Editar Parte Relacionada' : 'Nova Parte Relacionada' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ isEdit ? 'Atualize identificação, endereço, contato e vínculo' : 'Identificação, endereço, contato e vínculo com a solicitação' }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 24px">
          <BentoBox title="Identificação">
            <div class="flex flex-col" style="gap: 14px">
              <StepGrid>
                <SelectField
                  label="Natureza"
                  :options="['Pessoa Física', 'Pessoa Jurídica']"
                  :span="4"
                  v-model="tipoPessoaLabel"
                />
              </StepGrid>

              <template v-if="form.tipoPessoa === 'FISICA'">
                <StepGrid>
                  <FormField label="CPF" placeholder="000.000.000-00" :span="3" v-model="form.cpf" />
                  <FormField label="Nome completo" placeholder="Nome completo" :span="6" v-model="form.nomeFisica" />
                  <FormField label="RG" placeholder="0000000" :span="3" v-model="form.rg" />
                  <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="4" v-model="form.orgaoEmissorRg" />
                  <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural" />
                  <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="form.nacionalidade" />
                  <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataNascimento" />
                  <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao" />
                  <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" :span="4" v-model="form.estadoCivil" />
                  <SelectField
                    v-if="estadoCivilExigeConjuge(form.estadoCivil)"
                    label="Regime"
                    :options="REGIME_CASAMENTO_OPTS"
                    placeholder="Selecione"
                    :span="4"
                    v-model="form.regime"
                  />
                  <FormField
                    v-if="estadoCivilExigeConjuge(form.estadoCivil)"
                    label="Data do Casamento"
                    placeholder="dd/mm/aaaa"
                    :span="4"
                    v-model="form.dataCasamento"
                  />
                </StepGrid>
                <SpouseFields
                  v-if="parteExigeFormularioConjuge(form.estadoCivil, form.regime)"
                  v-model="conjuge"
                />
              </template>
              <template v-else>
                <StepGrid>
                  <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" v-model="form.cnpj" />
                  <FormField label="Razão Social" placeholder="—" :span="5" v-model="form.razaoSocial" />
                  <FormField label="Nome Fantasia" placeholder="—" :span="3" v-model="form.nomeFantasia" />
                  <FormField label="Data de abertura" placeholder="dd/mm/aaaa" :span="3" v-model="form.dataAbertura" />
                  <FormField label="Tipo" placeholder="—" :span="3" v-model="form.tipoEmpresa" />
                  <FormField label="Porte" placeholder="—" :span="3" v-model="form.porte" />
                  <FormField label="Atividade principal" placeholder="—" :span="3" v-model="form.atividadePrincipal" />
                  <FormField label="Natureza Jurídica" placeholder="—" :span="6" v-model="form.naturezaJuridica" />
                  <FormField label="Inscrição municipal" placeholder="—" :span="3" v-model="form.inscricaoMunicipal" />
                  <FormField label="Inscrição estadual" placeholder="—" :span="3" v-model="form.inscricaoEstadual" />
                </StepGrid>

                <BentoBox title="Representante Legal" :icon="User">
                  <StepGrid>
                    <FormField label="CPF" placeholder="000.000.000-00" :span="3" v-model="representante.cpf" />
                    <FormField label="Nome" placeholder="—" :span="5" v-model="representante.nome" />
                    <FormField label="RG" placeholder="—" :span="4" v-model="representante.rg" />
                    <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="representante.inscricaoProdutorRural" />
                    <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" :span="4" v-model="representante.nacionalidade" />
                    <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" :span="4" v-model="representante.dataNascimento" />
                    <FormField label="Profissão" placeholder="—" :span="4" v-model="representante.profissao" />
                  </StepGrid>
                </BentoBox>
              </template>
            </div>
          </BentoBox>

          <BentoBox title="Endereço" :icon="MapPin">
            <StepGrid>
              <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.cep" />
              <FormField label="Localidade" placeholder="—" :span="6" v-model="form.localidade" />
              <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
              <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
              <FormField label="Informações adicionais" placeholder="—" :span="8" v-model="form.infoAdicionais" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
              <FormField label="Cidade" placeholder="—" :span="5" v-model="form.cidade" />
              <SelectField
                label="País"
                :options="PAIS_OPTS"
                placeholder="Selecione"
                :span="4"
                :model-value="form.pais"
                @update:model-value="onPaisChange"
              />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Contato" :icon="Phone">
            <StepGrid>
              <FormField label="Nome" placeholder="—" :span="4" v-model="form.nomeContato" />
              <FormField label="E-mail" placeholder="contato@email.com" :span="4" v-model="form.email" />
              <SelectField label="DDI" :options="DDI_OPTS" :span="2" v-model="form.ddi" />
              <FormField label="Telefone" placeholder="(00) 00000-0000" :span="2" v-model="form.telefone" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Tipos" :icon="User">
            <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
              <label
                v-for="t in TIPOS_OPTS"
                :key="t.label"
                class="flex items-center"
                style="gap: 10px; cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"
              >
                <Checkbox :checked="form.tipos.includes(t.label)" @change="toggleTipo(t.label)" />
                {{ t.label }}
              </label>
            </div>
          </BentoBox>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canSubmit"
          class="flex items-center btn-animated"
          :class="{ 'btn-primary': canSubmit }"
          :style="{
            gap: '8px',
            height: '44px',
            padding: '0 24px',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
          }"
          @click="handleSubmit"
        >
          <Building2 :size="15" /> {{ isEdit ? 'ATUALIZAR' : 'CADASTRAR' }}
        </button>
      </div>
    </div>
  </div>
</template>
