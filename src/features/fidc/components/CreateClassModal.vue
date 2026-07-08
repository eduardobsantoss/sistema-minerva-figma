<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import {
  X,
  Info,
  Mail,
  FileText,
  Users,
  SlidersHorizontal,
  Network,
  Banknote,
  ClipboardList,
  AlertTriangle,
  Check,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Phone,
  Wallet,
  UserCheck,
  Percent,
  Users2,
  Crown,
} from 'lucide-vue-next';
import { gruposEmpresariais } from '@/features/cra/data/craData';
import StepGrid from './create-class/StepGrid.vue';
import SectionTitle from './create-class/SectionTitle.vue';
import FieldLabel from './create-class/FieldLabel.vue';
import Input from './create-class/Input.vue';
import FormField from './create-class/FormField.vue';
import SelectField from './create-class/SelectField.vue';
import RadioPill from './create-class/RadioPill.vue';
import SectionHelp from './create-class/SectionHelp.vue';
import ParticipantBlock from './create-class/ParticipantBlock.vue';
import SectionGroup from './create-class/SectionGroup.vue';
import AddButton from './create-class/AddButton.vue';
import DataTable from './create-class/DataTable.vue';
import DynamicConcentration from './create-class/DynamicConcentration.vue';

defineEmits<{ close: [] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Info', icon: Info, hint: 'Identificação inicial' },
  { key: 'contato', label: 'Contato', icon: Mail, hint: 'Endereçamento' },
  { key: 'ativos', label: 'Ativos', icon: FileText, hint: 'Lastros elegíveis' },
  { key: 'partic', label: 'Participantes', icon: Users, hint: 'Prestadores' },
  { key: 'configs', label: 'Configs', icon: SlidersHorizontal, hint: 'Limites' },
  { key: 'grupos', label: 'Grupos', icon: Network, hint: 'Econômicos' },
  { key: 'banco', label: 'Banco', icon: Banknote, hint: 'Domicílio bancário' },
  { key: 'registro', label: 'Registro', icon: ClipboardList, hint: 'Registradoras' },
  { key: 'pdd', label: 'PDD', icon: AlertTriangle, hint: 'Provisão' },
];

const lastroOpts = [
  { key: 'CH', label: 'Cheque' },
  { key: 'DM', label: 'Duplicata Mercantil' },
  { key: 'DS', label: 'Duplicata de Serviço' },
  { key: 'LC', label: 'Letra de Câmbio' },
  { key: 'NP', label: 'Nota Promissória' },
  { key: 'REC', label: 'Recibo' },
  { key: 'FAT', label: 'Fatura' },
  { key: 'CPR', label: 'Cédula de Produto Rural' },
  { key: 'WAR', label: 'Warrant' },
  { key: 'PV', label: 'Pedido de Venda' },
  { key: 'OUT', label: 'Outros' },
  { key: 'NF', label: 'Nota Fiscal' },
  { key: 'CTR', label: 'Contrato' },
  { key: 'CTE', label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'CPRF', label: 'Cédula de Produto Rural Financeira' },
  { key: 'CCB', label: 'Cédula de Crédito Bancário' },
  { key: 'CDCA', label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agropecuário e Warrant Agropecuário' },
  { key: 'CDA', label: 'Certificado de Depósito Agropecuário' },
  { key: 'NC', label: 'Nota Comercial' },
  { key: 'CD', label: 'Confissão de Dívida' },
];

const partOpcionais: { key: string; label: string; toggleLabel: string }[] = [
  { key: 'custodiante', label: 'Custodiante', toggleLabel: 'Fundo tem Custodiante' },
  { key: 'cobranca', label: 'Agente de Cobrança', toggleLabel: 'Fundo tem Agente de Cobrança' },
  { key: 'consultor', label: 'Consultor', toggleLabel: 'Fundo tem Consultor' },
  { key: 'benef', label: 'Beneficiário Final', toggleLabel: 'Fundo tem Beneficiário Final' },
];

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);
const prazo = ref<'determinado' | 'indeterminado'>('determinado');
const ativos = ref<string[]>(['NF', 'DM']);
const cedTipo = ref<'mono' | 'multi'>('multi');
const sacTipo = ref<'mono' | 'multi'>('multi');
const ativoLimites = ref<{ tipo: string; limite: string }[]>([{ tipo: 'DM', limite: '30,00' }]);
const ativoForm = ref<{ tipo: string; limite: string }>({ tipo: 'DM', limite: '' });
const topCed = ref<{ qtd: string; limite: string }[]>([{ qtd: '5', limite: '40,00' }]);
const topCedForm = ref<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
const topSac = ref<{ qtd: string; limite: string }[]>([]);
const topSacForm = ref<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
const partToggles = ref<Record<string, boolean>>({
  custodiante: true,
  cobranca: false,
  consultor: false,
  benef: false,
});

function togglePart(k: string) {
  partToggles.value = { ...partToggles.value, [k]: !partToggles.value[k] };
}

function ativoLabel(k: string) {
  return lastroOpts.find((o) => o.key === k)?.label ?? k;
}

function addAtivoLimite() {
  if (!ativoForm.value.limite) return;
  ativoLimites.value = [...ativoLimites.value, ativoForm.value];
  ativoForm.value = { tipo: ativoForm.value.tipo, limite: '' };
}
function addTopCed() {
  if (!topCedForm.value.qtd || !topCedForm.value.limite) return;
  topCed.value = [...topCed.value, topCedForm.value];
  topCedForm.value = { qtd: '', limite: '' };
}
function addTopSac() {
  if (!topSacForm.value.qtd || !topSacForm.value.limite) return;
  topSac.value = [...topSac.value, topSacForm.value];
  topSacForm.value = { qtd: '', limite: '' };
}

type ConfigTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
const configTab = ref<ConfigTab>('concentracao');
const configTabs: [ConfigTab, string][] = [
  ['concentracao', 'Concentração'],
  ['totalizadores', 'Totalizadores de ativos'],
  ['topCedente', 'TOP Cedente'],
  ['topSacado', 'TOP Sacado'],
];

const ativoRows = computed(() =>
  ativoLimites.value.map((r) => ({ tipo: r.tipo, descricao: ativoLabel(r.tipo), limite: r.limite })),
);
const topCedRows = computed(() =>
  topCed.value.map((r) => ({ tipo: `TOP ${r.qtd}`, descricao: `TOP ${r.qtd}`, limite: r.limite })),
);
const topSacRows = computed(() =>
  topSac.value.map((r) => ({ tipo: `TOP ${r.qtd}`, descricao: `TOP ${r.qtd}`, limite: r.limite })),
);

const gruposSelecionados = ref<string[]>([]);
const grupoQ = ref('');
function toggleGrupo(nome: string) {
  gruposSelecionados.value = gruposSelecionados.value.includes(nome)
    ? gruposSelecionados.value.filter((x) => x !== nome)
    : [...gruposSelecionados.value, nome];
}
const filteredGrupos = computed(() =>
  gruposEmpresariais.filter(
    (g) => !grupoQ.value || g.nome.toLowerCase().includes(grupoQ.value.toLowerCase()),
  ),
);

const pddFaixas = ref([
  { de: '0', ate: '30', rating: 'A', pct: '0,5' },
  { de: '31', ate: '60', rating: 'B', pct: '1,0' },
  { de: '61', ate: '90', rating: 'C', pct: '3,0' },
  { de: '91', ate: '180', rating: 'D', pct: '10,0' },
  { de: '181', ate: '360', rating: 'E', pct: '50,0' },
]);
const pddForm = ref({ de: '', ate: '', rating: 'A', pct: '' });

const regList = ref<{ registradora: string; idCarteira: string; usuario: string }[]>([
  { registradora: 'B3', idCarteira: '000123', usuario: 'minerva.b3' },
]);
const regForm = ref({ registradora: 'B3', idCarteira: '', usuario: '', senha: '' });

function addReg() {
  if (!regForm.value.idCarteira || !regForm.value.usuario) return;
  regList.value = [
    ...regList.value,
    { registradora: regForm.value.registradora, idCarteira: regForm.value.idCarteira, usuario: regForm.value.usuario },
  ];
  regForm.value = { registradora: regForm.value.registradora, idCarteira: '', usuario: '', senha: '' };
}
function addPdd() {
  if (!pddForm.value.de || !pddForm.value.ate || !pddForm.value.pct) return;
  pddFaixas.value = [...pddFaixas.value, pddForm.value];
  pddForm.value = { de: '', ate: '', rating: 'A', pct: '' };
}

const step = computed(() => steps[stepIdx.value]);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function toggleAtivo(k: string) {
  ativos.value = ativos.value.includes(k) ? ativos.value.filter((a) => a !== k) : [...ativos.value, k];
}

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
        max-width: 1280px;
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
            Nova Classe de Fundo
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button aria-label="Fechar" class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0" @click="$emit('close')">
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
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
          <FormField label="CNPJ do Veículo (Classe)" placeholder="00.000.000/0000-00" :span="4" />
          <FormField label="Identificação do Veículo" placeholder="Ex: CLASSE TECH A" :span="5" />
          <SelectField label="Tipo de Empresa" :options="['Matriz', 'Filial']" :span="3" />

          <FormField label="Razão Social" placeholder="Razão social completa" :span="8" />
          <FormField label="Nome Fantasia / Classe" placeholder="Ex: Sênior Classe A" :span="4" />

          <FormField label="Natureza Legal" placeholder="Fundo" :span="4" />
          <FormField label="Atividade Principal" placeholder="Direitos Creditórios" :span="5" />
          <FormField label="Código Singulare (CNAB 444)" placeholder="000" :span="3" />

          <SelectField
            label="Indicativo de Prazo"
            :options="['Prazo Determinado', 'Prazo Indeterminado']"
            @change="(v) => (prazo = v === 'Prazo Determinado' ? 'determinado' : 'indeterminado')"
            :span="prazo === 'determinado' ? 4 : 6"
          />
          <FormField
            label="Data de Constituição"
            placeholder="dd/mm/aaaa"
            type="date"
            :span="prazo === 'determinado' ? 4 : 6"
          />
          <FormField v-if="prazo === 'determinado'" label="Data Fim do Prazo" placeholder="dd/mm/aaaa" type="date" :span="4" />

          <FormField label="Categoria CVM" placeholder="FIDC" disabled default-value="FIDC" :span="12" />
        </StepGrid>

        <div v-else-if="step.key === 'contato'" class="flex flex-col" style="gap: 20px">
          <div>
            <SectionTitle :icon="Phone">Contato</SectionTitle>
            <StepGrid>
              <FormField label="Email do Veículo" placeholder="contato@classe.com.br" type="email" :span="6" />
              <FormField label="DDI" placeholder="+55" :span="2" />
              <FormField label="DDD" placeholder="11" :span="1" />
              <FormField label="Telefone" placeholder="0000-0000" :span="3" />
            </StepGrid>
          </div>
          <div>
            <SectionTitle :icon="MapPin">Endereço</SectionTitle>
            <StepGrid>
              <FormField label="CEP" placeholder="00000-000" :span="3" />
              <FormField label="Endereço" placeholder="Av. ..." :span="7" />
              <FormField label="Número" placeholder="—" :span="2" />
              <FormField label="Complemento" placeholder="Sala 101" :span="4" />
              <FormField label="Bairro" placeholder="—" :span="4" />
              <FormField label="Cidade" placeholder="—" :span="4" />
              <FormField label="Estado" placeholder="SP" :span="2" />
              <FormField label="País" placeholder="Brasil" default-value="Brasil" :span="4" />
            </StepGrid>
          </div>
        </div>

        <div v-else-if="step.key === 'ativos'">
          <SectionHelp>
            Selecione os tipos de direitos creditórios aceitos por esta classe.
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
                {{ o.key.replace('_', '-') }}
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ o.label }}
              </div>
            </button>
          </div>
        </div>

        <div v-else-if="step.key === 'partic'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Cadastre os prestadores de serviço da classe. Administradora e Gestor são
            obrigatórios; os demais participantes podem ser ativados conforme a estrutura
            operacional do fundo.
          </SectionHelp>

          <ParticipantBlock
            title="Identificação de Administradora"
            name-label="Administradora"
            doc-label="Documento"
            date-label="Administradora do fundo desde"
            required
          />

          <ParticipantBlock
            title="Identificação de Gestor"
            name-label="Gestor"
            doc-label="Documento"
            date-label="Gestor do fundo desde"
            required
          />

          <ParticipantBlock
            v-for="p in partOpcionais"
            :key="p.key"
            :title="`Identificação de ${p.label}`"
            :name-label="p.label"
            doc-label="Documento"
            :date-label="`${p.label} do fundo desde`"
            :toggle-label="p.toggleLabel"
            :toggle-enabled="partToggles[p.key]"
            @toggle="togglePart(p.key)"
          />
        </div>

        <div v-else-if="step.key === 'configs'" class="flex flex-col" style="gap: 20px">
          <!-- Tab bar -->
          <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start; flex-wrap: wrap">
            <button
              v-for="[k, label] in configTabs"
              :key="k"
              :style="{
                padding: '8px 16px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                background: configTab === k ? 'var(--surface-card)' : 'transparent',
                color: configTab === k ? 'var(--text-strong)' : 'var(--text-muted)',
                boxShadow: configTab === k ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--duration-base)',
              }"
              @click="configTab = k"
            >
              {{ label }}
            </button>
          </div>

          <!-- Tab 1 — Concentração (diversificação do pool) -->
          <SectionGroup v-if="configTab === 'concentracao'" :icon="Users2" title="Diversificação do Pool">
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 20px">
              <div>
                <FieldLabel>Tipo de Cedente</FieldLabel>
                <div class="flex" style="gap: 8px; margin-top: 8px">
                  <RadioPill :active="cedTipo === 'mono'" @click="cedTipo = 'mono'">Monocedente</RadioPill>
                  <RadioPill :active="cedTipo === 'multi'" @click="cedTipo = 'multi'">Multicedente</RadioPill>
                </div>
              </div>
              <div>
                <FieldLabel>Tipo de Sacado</FieldLabel>
                <div class="flex" style="gap: 8px; margin-top: 8px">
                  <RadioPill :active="sacTipo === 'mono'" @click="sacTipo = 'mono'">Monosacado</RadioPill>
                  <RadioPill :active="sacTipo === 'multi'" @click="sacTipo = 'multi'">Multissacado</RadioPill>
                </div>
              </div>
            </div>
            <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px">
              <div>
                <FieldLabel>Conc. Sacados Novos (%)</FieldLabel>
                <Input placeholder="5,00" />
              </div>
              <div>
                <FieldLabel>Conc. Sacados Elegíveis (%)</FieldLabel>
                <Input placeholder="20,00" />
              </div>
              <div>
                <FieldLabel>Conc. Total Novos (%)</FieldLabel>
                <Input placeholder="3,00" />
              </div>
              <div>
                <FieldLabel>Conc. Total Elegíveis (%)</FieldLabel>
                <Input placeholder="100,00" />
              </div>
            </div>
          </SectionGroup>

          <!-- Tab 2 — Totalizadores de ativos -->
          <DynamicConcentration
            v-else-if="configTab === 'totalizadores'"
            :icon="Percent"
            title="% Concentração por Tipo de Ativo"
            qtd-label="Tipo de Ativo"
            qtd-placeholder="Selecione"
            :qtd-options="ativos.length ? ativos : lastroOpts.map((o) => o.key)"
            limite-placeholder="0,00"
            :rows="ativoRows"
            :form="ativoForm"
            @update:form="ativoForm = $event"
            @add="addAtivoLimite"
            @remove="(i) => (ativoLimites = ativoLimites.filter((_, idx) => idx !== i))"
          />

          <!-- Tab 3 — TOP Cedente -->
          <DynamicConcentration
            v-else-if="configTab === 'topCedente'"
            :icon="Crown"
            title="Concentração de TOP's Cedentes"
            qtd-label="Quantidade"
            qtd-placeholder="Ex: 5"
            qtd-numeric
            limite-placeholder="0,00"
            :rows="topCedRows"
            :form="{ tipo: topCedForm.qtd, limite: topCedForm.limite }"
            @update:form="(v) => (topCedForm = { qtd: v.tipo, limite: v.limite })"
            @add="addTopCed"
            @remove="(i) => (topCed = topCed.filter((_, idx) => idx !== i))"
          />

          <!-- Tab 4 — TOP Sacado -->
          <DynamicConcentration
            v-else-if="configTab === 'topSacado'"
            :icon="Crown"
            title="Concentração de TOP's Sacados"
            qtd-label="Quantidade"
            qtd-placeholder="Ex: 10"
            qtd-numeric
            limite-placeholder="0,00"
            :rows="topSacRows"
            :form="{ tipo: topSacForm.qtd, limite: topSacForm.limite }"
            @update:form="(v) => (topSacForm = { qtd: v.tipo, limite: v.limite })"
            @add="addTopSac"
            @remove="(i) => (topSac = topSac.filter((_, idx) => idx !== i))"
          />
        </div>

        <div v-else-if="step.key === 'grupos'">
          <SectionHelp>
            Selecione quais grupos econômicos estão aptos a operar nesta classe.
          </SectionHelp>
          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg); margin-bottom: 16px">
            <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
            <input
              v-model="grupoQ"
              placeholder="Pesquisar grupos empresariais..."
              style="width: 100%; height: 44px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
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
                borderColor: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                background: gruposSelecionados.includes(g.nome) ? 'var(--gci-light)' : 'var(--surface-card)',
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
                  background: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--surface-sunken)',
                  color: gruposSelecionados.includes(g.nome) ? '#fff' : 'var(--text-muted)',
                  transition: 'all var(--duration-base)',
                }"
              >
                <Check v-if="gruposSelecionados.includes(g.nome)" :size="11" />
              </span>
              <div style="flex: 1; min-width: 0">
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    fontWeight: gruposSelecionados.includes(g.nome) ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                    color: gruposSelecionados.includes(g.nome) ? 'var(--gci-base)' : 'var(--text-default)',
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

        <div v-else-if="step.key === 'banco'" class="flex flex-col" style="gap: 20px">
          <div>
            <SectionTitle :icon="Wallet">Dados da Carteira</SectionTitle>
            <StepGrid>
              <FormField label="Nome da Carteira" placeholder="Ex: Agrovita FIDC - Santander" :span="6" />
              <SelectField
                label="Selecione o Banco"
                :options="['033 - Santander', '237 - Bradesco', '341 - Itaú', '001 - Banco do Brasil', '104 - Caixa']"
                placeholder="Selecione"
                :span="6"
              />
              <SelectField label="Selecione a Carteira" :options="['Carteira 1', 'Carteira 2', 'Carteira 3']" placeholder="Selecione" :span="4" />
              <SelectField label="Selecione o CNAB" :options="['CNAB 240', 'CNAB 400']" placeholder="Selecione" :span="4" />
              <FormField label="Código da Empresa" placeholder="—" :span="4" />
              <FormField label="Número da Conta" placeholder="000000-0" :span="4" />
              <FormField label="Número da Agência" placeholder="0000-0" :span="4" />
              <FormField label="Campo Extra 1" placeholder="—" :span="4" />
              <FormField label="Configuração de dados padrões para Boleto" placeholder="Texto de instrução para impressão" :span="12" />
              <div class="flex items-center" style="gap: 12px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg); grid-column: span 12">
                <input type="checkbox" checked style="accent-color: var(--gci-base)" />
                <div>
                  <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                    Permitir Vencimento em Finais de Semana e Feriado
                  </div>
                  <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                    Se ativo, parcelas podem ser liquidadas sem prorrogação para o próximo dia útil.
                  </div>
                </div>
              </div>
            </StepGrid>
          </div>

          <div>
            <SectionTitle :icon="UserCheck">Dados do Beneficiário</SectionTitle>
            <StepGrid>
              <FormField label="CNPJ" placeholder="00.000.000/0000-00" :span="4" />
              <FormField label="Nome" placeholder="Razão social do beneficiário" :span="8" />
              <FormField label="CEP" placeholder="00000-000" :span="3" />
              <FormField label="Endereço" placeholder="Rua / Avenida" :span="7" />
              <FormField label="Número" placeholder="—" :span="2" />
              <FormField label="Complemento" placeholder="Sala / Andar" :span="4" />
              <FormField label="Bairro" placeholder="—" :span="4" />
              <FormField label="Cidade" placeholder="—" :span="4" />
              <SelectField label="Estado" :options="['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'MT', 'MS', 'DF']" placeholder="UF" :span="12" />
            </StepGrid>
          </div>
        </div>

        <div v-else-if="step.key === 'registro'" class="flex flex-col" style="gap: 16px">
          <SectionHelp>
            Cadastre as registradoras homologadas e suas credenciais de acesso.
          </SectionHelp>

          <SectionGroup :icon="ClipboardList" title="Configuração de Registradoras">
            <div class="grid items-end" style="grid-template-columns: 1.1fr 1.4fr 1.4fr 1.4fr auto; gap: 12px; margin-bottom: 16px">
              <div>
                <FieldLabel>Registradora</FieldLabel>
                <SelectField :options="['B3', 'CERC', 'TAG', 'CIP']" @change="(v) => (regForm.registradora = v)" />
              </div>
              <div>
                <FieldLabel>ID Carteira</FieldLabel>
                <Input placeholder="Identificador" v-model="regForm.idCarteira" />
              </div>
              <div>
                <FieldLabel>Usuário</FieldLabel>
                <Input placeholder="Usuário API/SFTP" v-model="regForm.usuario" />
              </div>
              <div>
                <FieldLabel>Senha</FieldLabel>
                <Input type="password" placeholder="••••••••" v-model="regForm.senha" />
              </div>
              <AddButton @click="addReg" />
            </div>

            <DataTable
              :cols="[
                { key: 'registradora', label: 'Registradora', width: '1fr' },
                { key: 'idCarteira', label: 'ID Carteira', width: '1.4fr' },
                { key: 'usuario', label: 'Usuário', width: '1.4fr' },
              ]"
              :rows="regList"
              empty="Nenhuma registradora cadastrada."
              @remove="(i) => (regList = regList.filter((_, idx) => idx !== i))"
            />
          </SectionGroup>
        </div>

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
                <SelectField :options="['A', 'B', 'C', 'D', 'E', 'F']" @change="(v) => (pddForm.rating = v)" />
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
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="stepIdx === 0 ? $emit('close') : (stepIdx = Math.max(0, stepIdx - 1))"
        >
          {{ stepIdx === 0 ? 'Cancelar' : '← Voltar' }}
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
          @click="isLast ? $emit('close') : stepIdx++"
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
</style>
