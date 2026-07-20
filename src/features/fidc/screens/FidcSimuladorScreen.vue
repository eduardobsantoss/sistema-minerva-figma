<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ArrowLeft, Search, Plus, FileText, Banknote, PawPrint } from 'lucide-vue-next';
import { brl, fidcs, type Fidc } from '../data/fidcsData';
import { gruposEmpresariais } from '@/features/cra/data/craData';
import {
  MOCK_FIDC_SIMULATIONS,
  LOAN_SIMULATION_TYPES,
  BASE_DAYS_OPTS,
  simulateCprf,
  simulateLoan,
  type FidcSavedSimulation,
  type CprfPreview,
  type LoanPreview,
} from '../data/simuladorData';
import FidcCard from '../components/FidcCard.vue';
import ConfinaPromissoryModal from '../components/modals/ConfinaPromissoryModal.vue';
import StepGrid from '../components/create-class/StepGrid.vue';
import FormField from '../components/create-class/FormField.vue';
import SelectField from '../components/create-class/SelectField.vue';
import SectionGroup from '../components/create-class/SectionGroup.vue';
import SummaryItem from '../components/create-class/SummaryItem.vue';

type SubTab = 'cprf' | 'loan' | 'confina';

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'cprf', label: 'CPR-F' },
  { key: 'loan', label: 'Adiantamento/Empréstimo' },
  { key: 'confina', label: 'Termo Confina' },
];

const selected = ref<Fidc | null>(null);
const q = ref('');
const focus = ref(false);
const subTab = ref<SubTab>('cprf');
const modalOpen = ref(false);
const simulations = ref<FidcSavedSimulation[]>([...MOCK_FIDC_SIMULATIONS]);

const filtered = computed(() =>
  fidcs.filter(
    (f) =>
      !q.value ||
      f.name.toLowerCase().includes(q.value.toLowerCase()) ||
      f.cnpj.includes(q.value),
  ),
);

const vehicleName = computed(() => selected.value?.name ?? '');
const grupoOpts = gruposEmpresariais.map((g) => g.nome);

const cprf = reactive({
  valorNominal: '500000',
  vencimento: '',
  parcelas: '6',
  taxa: '1.2',
  grupo: grupoOpts[0] ?? '',
  docCedente: '',
});
const cprfPreview = ref<CprfPreview | null>(null);

const loan = reactive({
  tipoLabel: LOAN_SIMULATION_TYPES[0]?.label ?? 'Adiantamento',
  valor: '300000',
  emissao: '',
  parcelas: '4',
  baseDias: '30',
  taxa: '1.5',
  vencimento: '',
  grupo: grupoOpts[0] ?? '',
});
const loanPreview = ref<LoanPreview | null>(null);

const loanTipo = computed(
  () => LOAN_SIMULATION_TYPES.find((t) => t.label === loan.tipoLabel) ?? LOAN_SIMULATION_TYPES[0],
);
const loanRateLabel = computed(() => loanTipo.value?.rateLabel ?? 'Taxa');
const loanParcelasDisabled = computed(() => loanTipo.value?.value === '4');

const filteredSims = computed(() => {
  const typeMap: Record<SubTab, number> = { cprf: 7, loan: 3, confina: 6 };
  return simulations.value.filter((s) => s.type === typeMap[subTab.value]);
});

function openVehicle(id: string) {
  selected.value = fidcs.find((f) => f.id === id) ?? null;
  subTab.value = 'cprf';
}

function handleCprfSimulate() {
  cprfPreview.value = simulateCprf({
    requestedValue: Number(cprf.valorNominal) || 0,
    totalInstallment: Number(cprf.parcelas) || 1,
    rate: Number(cprf.taxa) || 0,
  });
}

function handleCprfSave() {
  if (!cprfPreview.value) handleCprfSimulate();
  const p = cprfPreview.value;
  if (!p) return;
  simulations.value = [
    {
      id: `sim-cprf-${Date.now()}`,
      type: 7,
      typeLabel: 'CPR-F',
      grupo: cprf.grupo || '—',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: p.valorNominal,
    },
    ...simulations.value,
  ];
}

function handleLoanSimulate() {
  loanPreview.value = simulateLoan({
    tipo: loanTipo.value?.value ?? '3',
    valor: Number(loan.valor) || 0,
    parcelas: Number(loan.parcelas) || 1,
    rate: Number(loan.taxa) || 0,
  });
}

function handleLoanSave() {
  if (!loanPreview.value) handleLoanSimulate();
  const p = loanPreview.value;
  if (!p) return;
  simulations.value = [
    {
      id: `sim-loan-${Date.now()}`,
      type: 3,
      typeLabel: 'Adiantamento/Empréstimo',
      grupo: loan.grupo || '—',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: p.valorTotal,
    },
    ...simulations.value,
  ];
}

function handleConfinaCreated() {
  simulations.value = [
    {
      id: `sim-confina-${Date.now()}`,
      type: 6,
      typeLabel: 'Termo Confina',
      grupo: 'Nova simulação',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: 1_050_000,
    },
    ...simulations.value,
  ];
}
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar FIDC para simular..."
          style="width: 100%; height: 56px; border: none; outline: none; background: transparent; padding-left: 52px; padding-right: 160px; font-size: var(--text-base); color: var(--text-strong); border-radius: var(--radius-xl)"
          @focus="focus = true"
          @blur="focus = false"
        />
        <button
          type="button"
          style="position: absolute; right: 8px; top: 8px; bottom: 8px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em"
        >
          PESQUISAR
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <FidcCard v-for="f in filtered" :key="f.id" :fidc="f" @open="openVehicle" />
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Simulador · FIDC's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ selected.name }}
        </h2>
      </div>
    </div>

    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in SUB_TABS"
        :key="t.key"
        type="button"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: subTab === t.key ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: subTab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
        @click="subTab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <SectionGroup v-if="subTab === 'cprf'" :icon="FileText" title="Simulação CPR-F">
      <StepGrid>
        <FormField v-model="cprf.valorNominal" label="Valor nominal / solicitado" type="number" :span="4" />
        <FormField v-model="cprf.vencimento" label="Vencimento inicial" type="date" :span="4" />
        <FormField v-model="cprf.parcelas" label="Total de parcelas" type="number" :span="4" />
        <FormField v-model="cprf.taxa" label="Taxa (% a.m.)" type="number" :span="3" />
        <SelectField v-model="cprf.grupo" label="Grupo empresarial" :options="grupoOpts" :span="5" />
        <FormField v-model="cprf.docCedente" label="Doc. cedente" placeholder="CPF/CNPJ" :span="4" />
      </StepGrid>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; color: var(--text-default)"
          @click="handleCprfSimulate"
        >
          SIMULAR
        </button>
        <button
          type="button"
          class="flex items-center"
          style="height: 42px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleCprfSave"
        >
          SALVAR SIMULAÇÃO
        </button>
      </div>
      <div v-if="cprfPreview" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px">
        <SummaryItem label="Valor nominal" :value="brl(cprfPreview.valorNominal)" />
        <SummaryItem label="Parcelas" :value="String(cprfPreview.parcelas)" />
        <SummaryItem label="Valor parcela" :value="brl(cprfPreview.valorParcela)" />
        <SummaryItem label="Taxa" :value="`${cprfPreview.taxa}% a.m.`" />
      </div>
    </SectionGroup>

    <SectionGroup v-else-if="subTab === 'loan'" :icon="Banknote" title="Adiantamento / Empréstimo">
      <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0 0 16px; line-height: 1.5">
        Análogo mais próximo de “Agrovita” no legado (template de geração de título).
      </p>
      <StepGrid>
        <SelectField
          v-model="loan.tipoLabel"
          label="Tipo de simulação"
          :options="LOAN_SIMULATION_TYPES.map((t) => t.label)"
          :span="6"
        />
        <FormField v-model="loan.valor" label="Valor solicitado" type="number" :span="6" />
        <FormField v-model="loan.emissao" label="Data da emissão" type="date" :span="4" />
        <FormField v-model="loan.parcelas" label="Nº de parcelas" type="number" :span="4" :disabled="loanParcelasDisabled" />
        <SelectField v-model="loan.baseDias" label="Dias p/ base de cálculo" :options="[...BASE_DAYS_OPTS]" :span="4" />
        <FormField v-model="loan.taxa" :label="loanRateLabel" type="number" :span="4" />
        <FormField v-model="loan.vencimento" label="Vencimento inicial" type="date" :span="4" />
        <SelectField v-model="loan.grupo" label="Grupo / cedente" :options="grupoOpts" :span="4" />
      </StepGrid>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; color: var(--text-default)"
          @click="handleLoanSimulate"
        >
          SIMULAR
        </button>
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="handleLoanSave"
        >
          SALVAR SIMULAÇÃO
        </button>
      </div>
      <div v-if="loanPreview" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px">
        <SummaryItem label="Solicitado" :value="brl(loanPreview.valorSolicitado)" />
        <SummaryItem label="Valor total" :value="brl(loanPreview.valorTotal)" />
        <SummaryItem label="Parcelas" :value="String(loanPreview.parcelas)" />
        <SummaryItem label="Valor parcela" :value="brl(loanPreview.valorParcela)" />
      </div>
    </SectionGroup>

    <SectionGroup v-else :icon="PawPrint" title="Nota promissória de gado">
      <div class="flex items-start justify-between" style="gap: 16px">
        <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0; max-width: 560px; line-height: 1.5">
          Wizard de 5 etapas no padrão de Nova Classe: operação, promissória, animais, notas fiscais e parceiro.
        </p>
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; height: 42px; padding: 0 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; flex-shrink: 0; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="modalOpen = true"
        >
          <Plus :size="15" /> GERAR TÍTULO
        </button>
      </div>
    </SectionGroup>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="padding: 14px 20px; border-bottom: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Simulações salvas
      </div>
      <div
        class="grid"
        style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr; padding: 10px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
      >
        <div>Tipo</div><div>Grupo</div><div>Criado em</div><div>Valor</div>
      </div>
      <div
        v-for="s in filteredSims"
        :key="s.id"
        class="grid items-center"
        style="grid-template-columns: 1.4fr 1.4fr 1fr 1fr; padding: 12px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ s.typeLabel }}</div>
        <div style="color: var(--text-default)">{{ s.grupo }}</div>
        <div style="color: var(--text-muted)">{{ s.createdAt }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(s.valorNominal) }}</div>
      </div>
      <div v-if="filteredSims.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
        Nenhuma simulação neste tipo.
      </div>
    </div>

    <ConfinaPromissoryModal
      v-if="modalOpen"
      :vehicle-name="vehicleName"
      @close="modalOpen = false"
      @created="handleConfinaCreated"
    />
  </div>
</template>
