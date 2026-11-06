<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { Info, Mail, Check, ChevronLeft, ChevronRight, Phone, MapPin } from 'lucide-vue-next';
import StepGrid from './create-fidc/StepGrid.vue';
import SectionTitle from './create-fidc/SectionTitle.vue';
import FormField from './create-fidc/FormField.vue';
import SelectField from './create-fidc/SelectField.vue';
import CreateClassModal, { type NewClassData } from './CreateClassModal.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

export interface NewFidcData {
  tipoFundo: string;
  cnpj: string;
  tipoEmpresa: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataConstituicao: string;
  naturezaLegal: string;
  atividadePrincipal: string;
  categoriaCvm: string;
  email: string;
  ddi: string;
  ddd: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  /** Preenchido quando Tipo de Fundo = MONOCLASSE (wizard de classe embutido). */
  classData?: NewClassData;
}

const emit = defineEmits<{ close: []; create: [data: NewFidcData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const fundSteps: Step[] = [
  { key: 'info', label: 'Informações', icon: Info, hint: 'Dados cadastrais' },
  { key: 'contato', label: 'Contato', icon: Mail, hint: 'Contato & Endereço' },
];

const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);
const classPhase = ref(false);
const form = ref<NewFidcData>({
  tipoFundo: '',
  cnpj: '',
  tipoEmpresa: '',
  razaoSocial: '',
  nomeFantasia: '',
  dataConstituicao: '',
  naturezaLegal: '',
  atividadePrincipal: '',
  categoriaCvm: '',
  email: '',
  ddi: '+55',
  ddd: '',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
});

const isMono = computed(() => form.value.tipoFundo === 'MONOCLASSE');
const step = computed(() => fundSteps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLastFundStep = computed(() => stepIdx.value === fundSteps.length - 1);

function stepColor(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return current ? 'var(--agro-base)' : done ? 'var(--stepper-done)' : 'var(--text-muted)';
}

function stepDimmed(i: number) {
  const done = i < stepIdx.value;
  const current = i === stepIdx.value;
  return !current && !done && hoverIdx.value !== i ? 0.55 : 1;
}

function handleFundNext() {
  if (!isLastFundStep.value) {
    stepIdx.value++;
    return;
  }
  if (isMono.value) {
    classPhase.value = true;
    return;
  }
  emit('create', { ...form.value });
}

function handleClassCreate(classData: NewClassData) {
  emit('create', { ...form.value, classData });
}
</script>

<template>
  <!-- Mono: após dados do fundo, embute o wizard de Nova Classe -->
  <CreateClassModal
    v-if="classPhase"
    naked
    title="Novo FIDC · Classe"
    @back="classPhase = false"
    @close="emit('close')"
    @create="handleClassCreate"
  />
  <AdminModal
    v-else
    size="lg"
    tall
    eyebrow="FIDC"
    title="Novo FIDC"
    :subtitle="`${step.hint} · Etapa ${stepIdx + 1} de ${fundSteps.length}${isMono ? ' · depois: cadastro da classe' : ''}`"
    @close="emit('close')"
  >
    <template #subheader>
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in fundSteps"
          :key="s.key"
          class="flex flex-col items-center justify-center"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: stepColor(i),
            opacity: stepDimmed(i),
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="hoverIdx = i"
          @mouseleave="hoverIdx = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>
    </template>

    <div>
      <StepGrid v-if="step.key === 'info'">
        <SelectField label="Tipo de Fundo" :options="['MULTICLASSE', 'MONOCLASSE']" placeholder="Selecione" :span="4" v-model="form.tipoFundo" />
        <FormField label="CNPJ do Veículo" placeholder="00.000.000/0000-00" :span="5" v-model="form.cnpj" />
        <SelectField label="Tipo de Empresa" :options="['Fundo', 'Companhia', 'Sociedade Limitada']" placeholder="Selecione" :span="3" v-model="form.tipoEmpresa" />

        <FormField label="Razão Social" placeholder="Razão social completa" :span="8" v-model="form.razaoSocial" />
        <FormField label="Nome Fantasia" placeholder="Ex: Ceres Agro I" :span="4" v-model="form.nomeFantasia" />

        <SelectField label="Natureza Legal" :options="['Condomínio Fechado', 'Condomínio Aberto', 'Sociedade Anônima']" placeholder="Selecione" :span="4" v-model="form.naturezaLegal" />
        <FormField label="Atividade Principal" placeholder="Direitos Creditórios" :span="5" v-model="form.atividadePrincipal" />
        <FormField label="Data de Constituição" type="date" :span="3" v-model="form.dataConstituicao" />

        <SelectField label="Categoria CVM" :options="['FIDC', 'FIDC-NP', 'FIDC Agro']" placeholder="Selecione" :span="12" v-model="form.categoriaCvm" />
      </StepGrid>

      <div v-else-if="step.key === 'contato'" class="flex flex-col" style="gap: 20px">
        <div>
          <SectionTitle :icon="Phone">Contato</SectionTitle>
          <StepGrid>
            <FormField label="E-mail do Veículo" placeholder="contato@fidc.com.br" type="email" :span="6" v-model="form.email" />
            <FormField label="DDI" placeholder="+55" :span="2" v-model="form.ddi" />
            <FormField label="DDD" placeholder="11" :span="1" v-model="form.ddd" />
            <FormField label="Telefone" placeholder="0000-0000" :span="3" v-model="form.telefone" />
          </StepGrid>
        </div>
        <div>
          <SectionTitle :icon="MapPin">Endereço</SectionTitle>
          <StepGrid>
            <FormField label="CEP" placeholder="00000-000" :span="3" v-model="form.cep" />
            <FormField label="Endereço" placeholder="Av. Brigadeiro Faria Lima" :span="9" v-model="form.endereco" />
            <FormField label="Número" placeholder="—" :span="2" v-model="form.numero" />
            <FormField label="Complemento" placeholder="Sala 101" :span="4" v-model="form.complemento" />
            <FormField label="Bairro" placeholder="—" :span="6" v-model="form.bairro" />
            <FormField label="Cidade" placeholder="—" :span="5" v-model="form.cidade" />
            <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="3" v-model="form.estado" />
            <FormField label="País" placeholder="Brasil" :span="4" v-model="form.pais" />
          </StepGrid>
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" :icon="isFirst ? undefined : ChevronLeft" @click="isFirst ? emit('close') : stepIdx--">{{ isFirst ? 'Cancelar' : 'Voltar' }}</AdminButton>
      <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
        {{ stepIdx + 1 }} / {{ fundSteps.length }}
      </span>
      <AdminButton variant="primary" size="large" :trailing-icon="isLastFundStep && !isMono ? Check : ChevronRight" @click="handleFundNext">
        {{ isLastFundStep && !isMono ? 'Finalizar cadastro' : isLastFundStep && isMono ? 'Cadastrar classe' : 'Próxima etapa' }}
      </AdminButton>
    </template>
  </AdminModal>
</template>
