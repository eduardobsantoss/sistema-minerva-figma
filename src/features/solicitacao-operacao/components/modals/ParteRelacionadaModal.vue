<script setup lang="ts">
import { computed, reactive } from 'vue';
import { X, Tag, User, Building2, Phone } from 'lucide-vue-next';
import { UF_OPTIONS, PAISES_DDI, type ParteTipo, type ParteRelacionada } from '../../data/operacaoData';
import { BentoBox, BentoGrid, FormField, SelectField, Checkbox } from './parte-relacionada';

const emit = defineEmits<{ close: []; create: [data: ParteRelacionada] }>();

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
}

const NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira'];
const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
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

const form = reactive<NewParteRelacionadaData>({
  tipoPessoa: 'FISICA',
  cpf: '',
  nomeFisica: '',
  rg: '',
  inscricaoProdutorRural: '',
  nacionalidade: '',
  dataNascimento: '',
  profissao: '',
  estadoCivil: '',
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
});

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
  emit('create', {
    nome: nome.value,
    documento: documento.value,
    email: form.email,
    telefone: form.telefone,
    tipos: codigos,
  });
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
        max-width: 860px;
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
            Nova Parte Relacionada
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Identificação, endereço, contato e vínculo com a solicitação
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
              <div style="max-width: 280px">
                <SelectField label="Natureza" :options="['Pessoa Física', 'Pessoa Jurídica']" v-model="tipoPessoaLabel" />
              </div>

              <BentoGrid v-if="form.tipoPessoa === 'FISICA'" :cols="3">
                <FormField label="CPF" placeholder="000.000.000-00" v-model="form.cpf" />
                <FormField label="Nome" placeholder="Nome completo" v-model="form.nomeFisica" />
                <FormField label="RG" placeholder="0000000" v-model="form.rg" />
                <FormField label="Inscrição do produtor rural" placeholder="—" v-model="form.inscricaoProdutorRural" />
                <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" v-model="form.nacionalidade" />
                <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" v-model="form.dataNascimento" />
                <FormField label="Profissão" placeholder="—" v-model="form.profissao" />
                <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" v-model="form.estadoCivil" />
              </BentoGrid>
              <BentoGrid v-else :cols="3">
                <FormField label="CNPJ" placeholder="00.000.000/0000-00" v-model="form.cnpj" />
                <FormField label="Razão Social" placeholder="—" v-model="form.razaoSocial" />
                <FormField label="Nome Fantasia" placeholder="—" v-model="form.nomeFantasia" />
                <FormField label="Data de abertura" placeholder="dd/mm/aaaa" v-model="form.dataAbertura" />
                <FormField label="Tipo" placeholder="—" v-model="form.tipoEmpresa" />
                <FormField label="Porte" placeholder="—" v-model="form.porte" />
                <FormField label="Atividade principal" placeholder="—" v-model="form.atividadePrincipal" />
                <FormField label="Natureza Jurídica" placeholder="—" v-model="form.naturezaJuridica" />
                <FormField label="Inscrição municipal" placeholder="—" v-model="form.inscricaoMunicipal" />
                <FormField label="Inscrição estadual" placeholder="—" v-model="form.inscricaoEstadual" />
              </BentoGrid>
            </div>
          </BentoBox>

          <BentoBox title="Endereço" :icon="Tag">
            <BentoGrid :cols="2">
              <FormField label="CEP" placeholder="00000-000" v-model="form.cep" />
              <FormField label="Localidade" placeholder="—" v-model="form.localidade" />
              <FormField label="Número" placeholder="—" v-model="form.numero" />
              <FormField label="Bairro" placeholder="—" v-model="form.bairro" />
              <div style="grid-column: span 2">
                <FormField label="Informações adicionais" placeholder="—" v-model="form.infoAdicionais" />
              </div>
              <FormField label="Cidade" placeholder="—" v-model="form.cidade" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" v-model="form.estado" />
              <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :model-value="form.pais" @update:model-value="onPaisChange" />
            </BentoGrid>
          </BentoBox>

          <BentoBox title="Contato" :icon="Phone">
            <BentoGrid :cols="2">
              <FormField label="Nome" placeholder="—" v-model="form.nomeContato" />
              <FormField label="E-mail" placeholder="contato@email.com" v-model="form.email" />
              <SelectField label="DDI" :options="DDI_OPTS" v-model="form.ddi" />
              <FormField label="Telefone" placeholder="(00) 00000-0000" v-model="form.telefone" />
            </BentoGrid>
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
          class="flex items-center"
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
            transition: 'background var(--duration-base)',
          }"
          @click="handleSubmit"
        >
          <Building2 :size="15" /> CADASTRAR
        </button>
      </div>
    </div>
  </div>
</template>
