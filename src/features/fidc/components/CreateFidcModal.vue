<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { X, Info, Mail, Check, ChevronRight, Phone, MapPin } from 'lucide-vue-next';
import StepGrid from './create-fidc/StepGrid.vue';
import SectionTitle from './create-fidc/SectionTitle.vue';
import FormField from './create-fidc/FormField.vue';
import SelectField from './create-fidc/SelectField.vue';
import CreateClassModal, { type NewClassData } from './CreateClassModal.vue';

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
  return current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
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
    @click="emit('close')"
  >
    <!-- Mono: após dados do fundo, embute o wizard de Nova Classe -->
    <div v-if="classPhase" style="width: 100%; max-width: 1280px" @click.stop>
      <CreateClassModal
        naked
        title="Novo FIDC · Classe"
        @back="classPhase = false"
        @close="emit('close')"
        @create="handleClassCreate"
      />
    </div>

    <div
      v-else
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 900px;
        max-height: calc(100vh - 64px);
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
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Novo FIDC
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ fundSteps.length }}
            <template v-if="isMono"> · depois: cadastro da classe</template>
          </p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
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

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
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

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px" @click="isFirst ? emit('close') : stepIdx--">
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ fundSteps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLastFundStep && !isMono ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLastFundStep && !isMono ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="handleFundNext"
        >
          {{ isLastFundStep && !isMono ? 'Finalizar Cadastro' : isLastFundStep && isMono ? 'Cadastrar Classe' : 'Próxima Etapa' }}
          <Check v-if="isLastFundStep && !isMono" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
