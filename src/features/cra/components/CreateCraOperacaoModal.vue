<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X, Info, SlidersHorizontal, Network, Settings, Percent,
  Wallet, FileText, AlertTriangle, ClipboardCheck,
  Check, ChevronRight, Search, Layers,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { gruposEmpresariais } from '../data/craData';
import StepGrid from './create-cra-operacao-modal/StepGrid.vue';
import FieldLabel from './create-cra-operacao-modal/FieldLabel.vue';
import Input from './create-cra-operacao-modal/Input.vue';
import FormField from './create-cra-operacao-modal/FormField.vue';
import SelectField from './create-cra-operacao-modal/SelectField.vue';
import SectionHelp from './create-cra-operacao-modal/SectionHelp.vue';
import ToggleRow from './create-cra-operacao-modal/ToggleRow.vue';
import SectionGroup from './create-cra-operacao-modal/SectionGroup.vue';
import AddButton from './create-cra-operacao-modal/AddButton.vue';
import DataTable from './create-cra-operacao-modal/DataTable.vue';
import LimiteRow from './create-cra-operacao-modal/LimiteRow.vue';
import SummaryItem from './create-cra-operacao-modal/SummaryItem.vue';

const BENEFICIARIO_OPTS = [
  'CERES SECURIZADORA S/A',
  'BTG SECURIZADORA S/A',
  'ISEC SECURIZADORA S/A',
  'RB CAPITAL',
  'Oliveira Trust',
  'Vórtx',
  'BRL Trust',
];

export interface NewCraOperacaoData {
  tipoCliente: string;
  beneficiarioFinal: string;
  nome: string;
  numeroEmissao: string;
  cessionaria: string;
  prestadorServico: string;
  custodiante: string;
  toggles: Record<string, boolean>;
  gruposSelecionados: string[];
  diasMinVencimento: string;
  diasMaxVencimento: string;
  tipoOperacaoCra: string;
  tipoCalculoElegibilidade: string;
  grupoLimites: string;
  dataEmissao: string;
  dataInicio: string;
  dataVencimento: string;
  valorEmissao: string;
  valorGarantiaMinimo: string;
  taxaDescontoPadrao: string;
  metodoNotificacao: string;
  // Carteira de cobrança
  carteiraNome: string;
  banco: string;
  carteira: string;
  tipoCnab: string;
  conta: string;
  agencia: string;
  codigoEmpresa: string;
  taxaJurosPadrao: string;
  taxaMultaPadrao: string;
  permiteFimDeSemana: boolean;
  titularConta: string;
  // Carteira de registro
  registradora: string;
  idCarteira: string;
  apiToken: string;
  apiSecret: string;
}

const emit = defineEmits<{ close: []; create: [data: NewCraOperacaoData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info',     label: 'Cadastrais',  icon: Info,              hint: 'Informações cadastrais da operação' },
  { key: 'veiculo',  label: 'Veículo',     icon: Settings,          hint: 'Configurações do veículo' },
  { key: 'config',   label: 'Adicionais',  icon: SlidersHorizontal, hint: 'Configurações adicionais' },
  { key: 'limites',  label: 'Limites',     icon: Percent,           hint: 'Configuração de limites' },
  { key: 'cobranca', label: 'Cobrança',    icon: Wallet,            hint: 'Carteira de cobrança' },
  { key: 'registro', label: 'Registro',    icon: Network,           hint: 'Carteira de registro' },
  { key: 'pdd',      label: 'PDD',         icon: AlertTriangle,     hint: 'Parametrização de PDD' },
  { key: 'grupos',   label: 'Grupos',      icon: Layers,            hint: 'Seleção de grupos empresariais' },
  // Etapa "Ativos" temporariamente desativada — visual mantido comentado (abaixo e no template) para reuso futuro.
  // { key: 'ativos', label: 'Ativos',      icon: FileText,          hint: 'Tipo de ativos aceitos' },
  { key: 'resumo',   label: 'Resumo',      icon: ClipboardCheck,    hint: 'Resumo dos dados cadastrados' },
];

const TOGGLE_KEYS = [
  { key: 'accrual',         label: 'Veículo calcula accrual' },
  { key: 'inscricaoEst',    label: 'Veículo valida Inscrição Estadual' },
  { key: 'vencidoSacado',   label: 'Veículo valida vencidos por sacado' },
  { key: 'topSacados',      label: 'Veículo valida TOP Sacados' },
  { key: 'topCedentes',     label: 'Veículo valida TOP Cedentes' },
  { key: 'distribTipo',     label: 'Veículo valida distribuição por tipo de título' },
  { key: 'nfEntregaFutura', label: 'Veículo pode operar com NF de entrega futura' },
];

const initToggles = () =>
  Object.fromEntries(TOGGLE_KEYS.map((t) => [t.key, false]));

const lastroOpts = [
  { key: 'CPR',    label: 'Cédula de Produto Rural' },
  { key: 'CPR-F',  label: 'Cédula de Produto Rural Financeira' },
  { key: 'CDA',    label: 'Certificado de Depósito Agropecuário' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agrop. e Warrant' },
  { key: 'CDCA',   label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'WAR',    label: 'Warrant' },
  { key: 'NF',     label: 'Nota Fiscal' },
  { key: 'NFE',    label: 'Nota Fiscal Eletrônica' },
  { key: 'DM',     label: 'Duplicata Mercantil' },
  { key: 'DS',     label: 'Duplicata de Serviço' },
  { key: 'CTE',    label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'NC',     label: 'Nota Comercial' },
  { key: 'CCB',    label: 'Cédula de Crédito Bancário' },
  { key: 'CTR',    label: 'Contrato' },
  { key: 'PV',     label: 'Pedido de Venda' },
  { key: 'FAT',    label: 'Fatura' },
];

const stepIdx = ref(0);
const form = ref<NewCraOperacaoData>({
  tipoCliente: '', beneficiarioFinal: '',
  nome: '', numeroEmissao: '',
  cessionaria: '', prestadorServico: '', custodiante: '',
  toggles: initToggles(), gruposSelecionados: [],
  diasMinVencimento: '', diasMaxVencimento: '', tipoOperacaoCra: '',
  tipoCalculoElegibilidade: '', grupoLimites: '',
  dataEmissao: '', dataInicio: '', dataVencimento: '',
  valorEmissao: '', valorGarantiaMinimo: '', taxaDescontoPadrao: '',
  metodoNotificacao: '',
  carteiraNome: '', banco: '', carteira: '', tipoCnab: '', conta: '',
  agencia: '', codigoEmpresa: '', taxaJurosPadrao: '', taxaMultaPadrao: '',
  permiteFimDeSemana: false, titularConta: '',
  registradora: '', idCarteira: '', apiToken: '', apiSecret: '',
});
const grupoQ = ref('');

// Step Limites — 4 sub-tabs
type LimitTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
const limitTab = ref<LimitTab>('concentracao');
const CONCENTRACAO_LABELS = [
  'Partes relacionadas (total)',
  'Novos sacados (totais)',
  'Novos sacados (individuais)',
  'Sacados elegíveis (individual)',
];
const concentracao = ref<Record<string, { base: string; pct: string }>>(
  Object.fromEntries(CONCENTRACAO_LABELS.map((l) => [l, { base: 'Garantia', pct: '' }])),
);
function setConcentracaoField(label: string, field: 'base' | 'pct', value: string) {
  concentracao.value[label] = { ...concentracao.value[label], [field]: value };
}

const totalizadores = ref<{ tipo: string; pct: string }[]>([
  { tipo: 'CPR-F', pct: '40,0' },
  { tipo: 'CDCA', pct: '35,0' },
]);
const totalForm = ref({ tipo: 'CPR', pct: '' });
function addTotalizador() {
  if (!totalForm.value.pct) return;
  totalizadores.value = [...totalizadores.value, totalForm.value];
  totalForm.value = { tipo: 'CPR', pct: '' };
}

const topCedente = ref<{ top: string; pct: string }[]>([
  { top: 'TOP 1', pct: '15,0' },
  { top: 'TOP 5', pct: '45,0' },
]);
const topCedForm = ref({ top: 'TOP 1', pct: '' });
function addTopCedente() {
  if (!topCedForm.value.pct) return;
  topCedente.value = [...topCedente.value, topCedForm.value];
  topCedForm.value = { top: 'TOP 1', pct: '' };
}

const topSacado = ref<{ top: string; pct: string }[]>([
  { top: 'TOP 1', pct: '20,0' },
  { top: 'TOP 10', pct: '60,0' },
]);
const topSacForm = ref({ top: 'TOP 1', pct: '' });
function addTopSacado() {
  if (!topSacForm.value.pct) return;
  topSacado.value = [...topSacado.value, topSacForm.value];
  topSacForm.value = { top: 'TOP 1', pct: '' };
}

// Step 7 — Ativos aceitos
const ativos = ref<string[]>(['CPR', 'CPR-F', 'CDCA']);
function toggleAtivo(k: string) {
  ativos.value = ativos.value.includes(k) ? ativos.value.filter((a) => a !== k) : [...ativos.value, k];
}

// Step 8 — PDD
const pddFaixas = ref<{ de: string; ate: string; rating: string; pct: string }[]>([
  { de: '0',   ate: '30',  rating: 'A', pct: '0,5'  },
  { de: '31',  ate: '60',  rating: 'B', pct: '1,0'  },
  { de: '61',  ate: '90',  rating: 'C', pct: '3,0'  },
  { de: '91',  ate: '180', rating: 'D', pct: '10,0' },
  { de: '181', ate: '360', rating: 'E', pct: '50,0' },
]);
const pddForm = ref({ de: '', ate: '', rating: 'A', pct: '' });
function addPdd() {
  if (!pddForm.value.de || !pddForm.value.ate || !pddForm.value.pct) return;
  pddFaixas.value = [...pddFaixas.value, pddForm.value];
  pddForm.value = { de: '', ate: '', rating: 'A', pct: '' };
}

function toggleSwitch(key: string) {
  form.value.toggles = { ...form.value.toggles, [key]: !form.value.toggles[key] };
}
function toggleGrupo(nome: string) {
  form.value.gruposSelecionados = form.value.gruposSelecionados.includes(nome)
    ? form.value.gruposSelecionados.filter((x) => x !== nome)
    : [...form.value.gruposSelecionados, nome];
}

const filteredGrupos = computed(() =>
  gruposEmpresariais.filter(
    (g) => !grupoQ.value || g.nome.toLowerCase().includes(grupoQ.value.toLowerCase()),
  ),
);

// Step Resumo — dados agregados das demais etapas
const activeToggles = computed(() =>
  TOGGLE_KEYS.filter((t) => form.value.toggles[t.key]).map((t) => t.label),
);
const concentracaoConfiguradas = computed(
  () => Object.values(concentracao.value).filter((c) => c.pct).length,
);

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function handleCreate() {
  emit('create', form.value);
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
        max-width: 1100px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- ── Header ── -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Nova Operação CRA
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- ── Stepper ── -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          class="step-btn flex flex-col items-center justify-center"
          :class="{ 'step-btn--pending': i !== stepIdx && i >= stepIdx }"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- ── Body ── -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <!-- Step 1 — Informações cadastrais -->
        <StepGrid v-if="step.key === 'info'">
          <SelectField label="Tipo da Operação" :options="['CRA Carteira', 'CRA Controle', 'CRA Terceiro']" placeholder="Selecione" :span="6" v-model="form.tipoOperacaoCra" />
          <SelectField label="Tipo de Cliente" :options="['Monocedente', 'Multicedente']" placeholder="Selecione" :span="6" v-model="form.tipoCliente" />
          <FormField label="Número de Emissão" placeholder="Ex: 4ª" :span="3" v-model="form.numeroEmissao" />
          <FormField label="Nome da Operação" placeholder="Ex: 4ª Emissão CRA Semeagro" :span="9" v-model="form.nome" />
          <SelectField label="Cessionária" :options="['CERES SECURIZADORA S/A', 'BTG SECURIZADORA S/A', 'ISEC SECURIZADORA S/A', 'RB CAPITAL']" placeholder="Selecione" :span="3" v-model="form.cessionaria" />
          <SelectField label="Prestador de Serviço" :options="['Oliveira Trust', 'Vórtx', 'Singulare', 'Daycoval', 'BRL Trust']" placeholder="Selecione" :span="3" v-model="form.prestadorServico" />
          <SelectField label="Custodiante" :options="['B3', 'Cetip', 'Daycoval', 'Singulare', 'Oliveira Trust']" placeholder="Selecione" :span="3" v-model="form.custodiante" />
          <SelectField label="Beneficiário Final" :options="BENEFICIARIO_OPTS" placeholder="Selecione" :span="3" v-model="form.beneficiarioFinal" />
        </StepGrid>

        <!-- Step 2 — Configurações do veículo (toggles) -->
        <div v-else-if="step.key === 'veiculo'" class="flex flex-col" style="gap: 10px">
          <SectionHelp>
            Defina as regras de validação e cálculo que o veículo deve aplicar a esta operação.
          </SectionHelp>
          <ToggleRow
            v-for="t in TOGGLE_KEYS"
            :key="t.key"
            :label="t.label"
            :on="form.toggles[t.key]"
            @toggle="toggleSwitch(t.key)"
          />
        </div>

        <!-- Step 8 — Grupos Empresariais -->
        <div v-else-if="step.key === 'grupos'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Selecione os grupos empresariais autorizados a operar nesta operação.
            <strong style="color: var(--text-default)">{{ form.gruposSelecionados.length }} selecionados</strong>.
          </SectionHelp>
          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
            <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
            <input
              v-model="grupoQ"
              placeholder="Filtrar grupos..."
              style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
            />
          </div>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px">
            <button
              v-for="g in filteredGrupos"
              :key="g.nome"
              class="flex items-center"
              :style="{
                gap: '10px',
                padding: '12px 14px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-light)' : 'var(--surface-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-base)',
              }"
              @click="toggleGrupo(g.nome)"
            >
              <span
                class="flex items-center justify-center"
                :style="{
                  width: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  flexShrink: 0,
                  background: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                  color: form.gruposSelecionados.includes(g.nome) ? '#fff' : 'var(--text-muted)',
                  transition: 'all var(--duration-base)',
                }"
              >
                <Check v-if="form.gruposSelecionados.includes(g.nome)" :size="11" />
              </span>
              <div style="flex: 1; min-width: 0">
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    fontWeight: form.gruposSelecionados.includes(g.nome) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                    color: form.gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--text-default)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }"
                >
                  {{ g.nome }}
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">{{ g.cnpj }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 3 — Configurações adicionais -->
        <StepGrid v-else-if="step.key === 'config'">
          <FormField label="Dias Mínimo para Vencimento" placeholder="Ex: 30" type="number" :span="3" v-model="form.diasMinVencimento" />
          <FormField label="Dias Máximo para Vencimento" placeholder="Ex: 720" type="number" :span="3" v-model="form.diasMaxVencimento" />
          <SelectField label="Tipo de Cálculo de Elegibilidade" :options="['Valor de garantia', 'Valor da emissão']" placeholder="Selecione" :span="3" v-model="form.tipoCalculoElegibilidade" />
          <SelectField label="Grupo de Limites" :options="['Confina', 'Op Multicedentes', 'Op Monocedentes', 'Trading', 'CeresSec']" placeholder="Selecione" :span="3" v-model="form.grupoLimites" />
          <FormField label="Data de Emissão" type="date" :span="3" v-model="form.dataEmissao" />
          <FormField label="Data de Início da Operação" type="date" :span="3" v-model="form.dataInicio" />
          <FormField label="Data de Vencimento" type="date" :span="3" v-model="form.dataVencimento" />
          <SelectField label="Método de Notificação Padrão" :options="['E-mail', 'Telefone', 'Mensagem de Texto', 'WhatsApp']" placeholder="Selecione" :span="3" v-model="form.metodoNotificacao" />
          <FormField label="Valor de Emissão da Operação" placeholder="R$ 0,00" :span="6" v-model="form.valorEmissao" />
          <FormField label="Valor Mínimo de Garantia da Emissão" placeholder="R$ 0,00" :span="6" v-model="form.valorGarantiaMinimo" />
        </StepGrid>

        <!-- Step 4 — Configuração de limites (4 abas) -->
        <div v-else-if="step.key === 'limites'" class="flex flex-col" style="gap: 20px">
          <SectionHelp>
            Configure os limites de concentração da carteira e os totalizadores por tipo de ativo e TOP.
          </SectionHelp>
          <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start; flex-wrap: wrap">
            <button
              v-for="[k, label] in ([
                ['concentracao', 'Concentração'],
                ['totalizadores', 'Totalizadores de ativos'],
                ['topCedente', 'TOP Cedente'],
                ['topSacado', 'TOP Sacado'],
              ] as [LimitTab, string][])"
              :key="k"
              :style="{
                padding: '8px 16px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                background: limitTab === k ? 'var(--surface-card)' : 'transparent',
                color: limitTab === k ? 'var(--text-strong)' : 'var(--text-muted)',
                boxShadow: limitTab === k ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--duration-base)',
              }"
              @click="limitTab = k"
            >
              {{ label }}
            </button>
          </div>

          <div v-if="limitTab === 'concentracao'" class="flex flex-col" style="gap: 12px">
            <LimiteRow
              v-for="label in CONCENTRACAO_LABELS"
              :key="label"
              :label="label"
              :base="concentracao[label].base"
              :pct="concentracao[label].pct"
              @update:base="(v) => setConcentracaoField(label, 'base', v)"
              @update:pct="(v) => setConcentracaoField(label, 'pct', v)"
            />
          </div>

          <SectionGroup v-else-if="limitTab === 'totalizadores'" :icon="FileText" title="Totalizadores de ativos">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de Ativo</FieldLabel>
                <SelectField :options="lastroOpts.map((o) => o.key)" v-model="totalForm.tipo" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="totalForm.pct" />
              </div>
              <AddButton @click="addTotalizador" />
            </div>
            <DataTable
              :cols="[
                { key: 'tipo', label: 'Tipo de Ativo', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="totalizadores"
              empty="Nenhum totalizador cadastrado."
              @remove="(i) => (totalizadores = totalizadores.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>

          <SectionGroup v-else-if="limitTab === 'topCedente'" :icon="Percent" title="TOP Cedente">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de TOP</FieldLabel>
                <SelectField :options="['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']" v-model="topCedForm.top" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="topCedForm.pct" />
              </div>
              <AddButton @click="addTopCedente" />
            </div>
            <DataTable
              :cols="[
                { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="topCedente"
              empty="Nenhum TOP cedente cadastrado."
              @remove="(i) => (topCedente = topCedente.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>

          <SectionGroup v-else-if="limitTab === 'topSacado'" :icon="Percent" title="TOP Sacado">
            <div class="grid items-end" style="grid-template-columns: 2fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Tipo de TOP</FieldLabel>
                <SelectField :options="['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']" v-model="topSacForm.top" />
              </div>
              <div>
                <FieldLabel>% de Limite</FieldLabel>
                <Input placeholder="0,00" v-model="topSacForm.pct" />
              </div>
              <AddButton @click="addTopSacado" />
            </div>
            <DataTable
              :cols="[
                { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                { key: 'pct', label: '% de Limite', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="topSacado"
              empty="Nenhum TOP sacado cadastrado."
              @remove="(i) => (topSacado = topSacado.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

        <!-- Step 5 — Carteira de cobrança -->
        <div v-else-if="step.key === 'cobranca'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>Parâmetros bancários para emissão de boletos e cobrança dos títulos.</SectionHelp>
          <StepGrid>
            <FormField label="Nome da Carteira" placeholder="Ex: Carteira Principal" :span="6" v-model="form.carteiraNome" />
            <SelectField label="Banco" :options="['001 - Banco do Brasil', '237 - Bradesco', '341 - Itaú', '033 - Santander', '748 - Sicredi', '756 - Sicoob']" placeholder="Selecione" :span="3" v-model="form.banco" />
            <SelectField label="Tipo de CNAB" :options="['CNAB 240', 'CNAB 400']" placeholder="Selecione" :span="3" v-model="form.tipoCnab" />
            <FormField label="Carteira" placeholder="Ex: 17" :span="3" v-model="form.carteira" />
            <FormField label="Agência" placeholder="0000" :span="3" v-model="form.agencia" />
            <FormField label="Conta" placeholder="00000-0" :span="3" v-model="form.conta" />
            <FormField label="Código da Empresa" placeholder="Código no banco" :span="3" v-model="form.codigoEmpresa" />
            <FormField label="Taxa de Juros Padrão" placeholder="0,0000% a.m." :span="4" v-model="form.taxaJurosPadrao" />
            <FormField label="Taxa de Multa Padrão" placeholder="0,00%" :span="4" v-model="form.taxaMultaPadrao" />
            <FormField label="Taxa de Desconto Padrão" placeholder="0,0000%" :span="4" v-model="form.taxaDescontoPadrao" />
            <div style="grid-column: span 12">
              <FieldLabel>Titular da Conta</FieldLabel>
              <Input disabled :model-value="form.beneficiarioFinal || '—'" style="color: var(--text-muted)" />
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px">
                Preenchido automaticamente conforme o Beneficiário Final da Etapa 1.
              </div>
            </div>
          </StepGrid>
          <ToggleRow
            label="Permite vencimento em finais de semana e feriado"
            :on="form.permiteFimDeSemana"
            @toggle="form.permiteFimDeSemana = !form.permiteFimDeSemana"
          />
        </div>

        <!-- Step 6 — Carteira de registro -->
        <div v-else-if="step.key === 'registro'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>Credenciais de integração com a registradora do veículo.</SectionHelp>
          <StepGrid>
            <SelectField label="Registradora" :options="['B3', 'CERC', 'Núclea', 'CRDC']" placeholder="Selecione" :span="6" v-model="form.registradora" />
            <FormField label="ID da Carteira" placeholder="Identificador na registradora" :span="6" v-model="form.idCarteira" />
            <FormField label="API Token" placeholder="Token de integração" :span="6" v-model="form.apiToken" />
            <FormField label="API Secret" type="password" placeholder="••••••••" :span="6" v-model="form.apiSecret" />
          </StepGrid>
        </div>

        <!--
        Step — Tipo de Ativos Aceitos
        Temporariamente oculta desta etapa (ver comentário em `steps`). Visual mantido
        comentado aqui para ser reaproveitado futuramente.

        <div v-else-if="step.key === 'ativos'">
          <SectionHelp>
            Selecione os tipos de ativos creditórios aceitos nesta operação CRA.
          </SectionHelp>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
            <button
              v-for="o in lastroOpts"
              :key="o.key"
              :style="{
                padding: '16px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: ativos.includes(o.key) ? 'var(--agro-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: ativos.includes(o.key) ? 'var(--agro-light)' : 'var(--surface-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-base)',
              }"
              @click="toggleAtivo(o.key)"
            >
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.12em',
                  color: ativos.includes(o.key) ? 'var(--agro-base)' : 'var(--text-muted)',
                  marginBottom: '6px',
                }"
              >
                {{ o.key }}
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ o.label }}
              </div>
            </button>
          </div>
        </div>
        -->

        <!-- Step 8 — Parametrização de PDD -->
        <div v-else-if="step.key === 'pdd'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Defina as faixas de aging e o percentual de provisão para cada classificação de risco.
          </SectionHelp>
          <SectionGroup :icon="AlertTriangle" title="Provisão para Devedores Duvidosos">
            <div class="grid items-end" style="grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Dias Mín.</FieldLabel>
                <Input type="number" placeholder="0" v-model="pddForm.de" />
              </div>
              <div>
                <FieldLabel>Dias Máx.</FieldLabel>
                <Input type="number" placeholder="30" v-model="pddForm.ate" />
              </div>
              <div>
                <FieldLabel>% de PDD</FieldLabel>
                <Input placeholder="0,50" v-model="pddForm.pct" />
              </div>
              <div>
                <FieldLabel>Classificação</FieldLabel>
                <SelectField :options="['A', 'B', 'C', 'D', 'E', 'F']" v-model="pddForm.rating" />
              </div>
              <AddButton @click="addPdd" />
            </div>
            <DataTable
              :cols="[
                { key: 'de', label: 'Dias Mín.', width: '1fr' },
                { key: 'ate', label: 'Dias Máx.', width: '1fr' },
                { key: 'rating', label: 'Classificação', width: '1fr' },
                { key: 'pct', label: '% Provisão', width: '1fr', format: (v: string) => `${v}%` },
              ]"
              :rows="pddFaixas"
              empty="Nenhuma faixa cadastrada."
              @remove="(i) => (pddFaixas = pddFaixas.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

        <!-- Step 9 — Resumo dos dados cadastrados -->
        <div v-else-if="step.key === 'resumo'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Revise as informações cadastradas em todas as etapas antes de finalizar a operação.
          </SectionHelp>

          <SectionGroup :icon="Info" title="Dados Cadastrais">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Tipo de Operação" :value="form.tipoOperacaoCra" />
              <SummaryItem label="Tipo de Cliente" :value="form.tipoCliente" />
              <SummaryItem label="Nº de Emissão" :value="form.numeroEmissao" />
              <SummaryItem label="Nome da Operação" :value="form.nome" />
              <SummaryItem label="Cessionária" :value="form.cessionaria" />
              <SummaryItem label="Prestador de Serviço" :value="form.prestadorServico" />
              <SummaryItem label="Custodiante" :value="form.custodiante" />
              <SummaryItem label="Beneficiário Final" :value="form.beneficiarioFinal" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Settings" title="Configurações do Veículo">
            <div v-if="activeToggles.length" class="flex flex-wrap" style="gap: 8px">
              <span v-for="t in activeToggles" :key="t" class="summary-tag">{{ t }}</span>
            </div>
            <div v-else style="font-size: var(--text-sm); color: var(--text-muted)">Nenhuma configuração ativada.</div>
          </SectionGroup>

          <SectionGroup :icon="SlidersHorizontal" title="Configurações Adicionais">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Dias Mín. Vencimento" :value="form.diasMinVencimento" />
              <SummaryItem label="Dias Máx. Vencimento" :value="form.diasMaxVencimento" />
              <SummaryItem label="Cálculo de Elegibilidade" :value="form.tipoCalculoElegibilidade" />
              <SummaryItem label="Grupo de Limites" :value="form.grupoLimites" />
              <SummaryItem label="Data de Emissão" :value="form.dataEmissao" />
              <SummaryItem label="Data de Início" :value="form.dataInicio" />
              <SummaryItem label="Data de Vencimento" :value="form.dataVencimento" />
              <SummaryItem label="Método de Notificação" :value="form.metodoNotificacao" />
              <SummaryItem label="Valor de Emissão" :value="form.valorEmissao" />
              <SummaryItem label="Valor Mín. de Garantia" :value="form.valorGarantiaMinimo" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Percent" title="Limites">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Regras de Concentração" :value="`${concentracaoConfiguradas} configuradas`" />
              <SummaryItem label="Totalizadores de Ativos" :value="`${totalizadores.length} cadastrados`" />
              <SummaryItem label="TOP Cedente" :value="`${topCedente.length} cadastrados`" />
              <SummaryItem label="TOP Sacado" :value="`${topSacado.length} cadastrados`" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Wallet" title="Carteira de Cobrança">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Nome da Carteira" :value="form.carteiraNome" />
              <SummaryItem label="Banco" :value="form.banco" />
              <SummaryItem label="Tipo de CNAB" :value="form.tipoCnab" />
              <SummaryItem label="Carteira" :value="form.carteira" />
              <SummaryItem label="Agência" :value="form.agencia" />
              <SummaryItem label="Conta" :value="form.conta" />
              <SummaryItem label="Taxa de Juros Padrão" :value="form.taxaJurosPadrao" />
              <SummaryItem label="Taxa de Multa Padrão" :value="form.taxaMultaPadrao" />
              <SummaryItem label="Fim de Semana" :value="form.permiteFimDeSemana ? 'Permitido' : 'Não permitido'" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Network" title="Carteira de Registro">
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
              <SummaryItem label="Registradora" :value="form.registradora" />
              <SummaryItem label="ID da Carteira" :value="form.idCarteira" />
              <SummaryItem label="Credenciais de API" :value="form.apiToken ? 'Configuradas' : 'Não configuradas'" />
            </div>
          </SectionGroup>

          <SectionGroup :icon="Layers" title="Grupos Empresariais">
            <div v-if="form.gruposSelecionados.length" class="flex flex-wrap" style="gap: 8px">
              <span v-for="g in form.gruposSelecionados" :key="g" class="summary-tag">{{ g }}</span>
            </div>
            <div v-else style="font-size: var(--text-sm); color: var(--text-muted)">Nenhum grupo selecionado.</div>
          </SectionGroup>

          <SectionGroup :icon="AlertTriangle" title="Parametrização de PDD">
            <SummaryItem label="Faixas de Aging Cadastradas" :value="`${pddFaixas.length} faixas`" />
          </SectionGroup>
        </div>
      </div>

      <!-- ── Footer ── -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="isFirst ? emit('close') : stepIdx--"
        >
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="isLast ? handleCreate() : stepIdx++"
        >
          {{ isLast ? 'Finalizar Cadastro' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.ccm-row .ccm-trash {
  opacity: 0;
  transition: opacity 0.15s;
}
.ccm-row:hover .ccm-trash {
  opacity: 1;
}
.ccm-trash button {
  background: transparent;
  color: var(--text-muted);
  transition: all 0.15s;
}
.ccm-trash button:hover {
  background: var(--danger-light);
  color: var(--danger-base);
}
.summary-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--gci-base);
  background: var(--gci-light);
  border-radius: var(--radius-md);
}
</style>

<style scoped>
.step-btn {
  opacity: 1;
}
.step-btn--pending {
  opacity: 0.55;
}
.step-btn--pending:hover {
  opacity: 1;
}
</style>
