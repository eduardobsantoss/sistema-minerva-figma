<script setup lang="ts">
import { computed, reactive, ref, watch, type Component } from 'vue';
import {
  X,
  ChevronRight,
  Check,
  Info,
  FileText,
  PawPrint,
  Receipt,
  Users,
} from 'lucide-vue-next';
import { brl, gruposEmpresariais } from '@/features/cra/data/craData';
import {
  BASE_DAYS_OPTS,
  CONFINA_CATEGORIA_OPTS,
  CONFINA_RACA_OPTS,
  FAZENDAS_OPTS,
  simulatePromissoryNote,
  type ConfinaPreview,
} from '@/features/cra/data/simuladorData';
import StepGrid from '../create-class/StepGrid.vue';
import FormField from '../create-class/FormField.vue';
import SelectField from '../create-class/SelectField.vue';
import SectionGroup from '../create-class/SectionGroup.vue';
import SummaryItem from '../create-class/SummaryItem.vue';
import AddButton from '../create-class/AddButton.vue';
import Checkbox from '@/components/ui/Checkbox.vue';

defineProps<{ vehicleName: string }>();
const emit = defineEmits<{ close: []; created: [] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'operacao', label: 'Operação', icon: Info, hint: 'Dados da operação' },
  { key: 'promissoria', label: 'Promissória', icon: FileText, hint: 'Dados da promissória' },
  { key: 'animais', label: 'Animais', icon: PawPrint, hint: 'Categoria e lote' },
  { key: 'notas', label: 'Notas', icon: Receipt, hint: 'Notas fiscais e GTAs' },
  { key: 'parceiro', label: 'Parceiro', icon: Users, hint: 'Fazenda e testemunhas' },
];

const stepIdx = ref(0);
const hoverIdx = ref<number | null>(null);

const form = reactive({
  grupo: gruposEmpresariais[0]?.nome ?? '',
  outorgado: '',
  qtdAnimais: '100',
  valorUnitario: '320',
  pesoLote: '1800',
  taxa: '1.85',
  emissao: '',
  vencimento: '',
  baseDias: '30',
  numeroTitulo: '',
  filial: '',
  feeMonitoramento: '0.5',
  prazoAssinatura: '5',
  vigenciaMeses: '12',
  certificadorEmail: true,
  categoria: CONFINA_CATEGORIA_OPTS[0],
  raca: CONFINA_RACA_OPTS[0],
  pesoMinIndividual: '12',
  pesoLoteKg: '',
  infos: [{ tipo: 'Bezerro', idade: '12-18', qtd: '50' }] as { tipo: string; idade: string; qtd: string }[],
  notas: [{ nf: '', gta: '' }] as { nf: string; gta: string }[],
  fazenda: FAZENDAS_OPTS[0],
  proprietario: '',
  posicaoAnexo: 'Final',
  testemunhas: '',
});

const preview = ref<ConfinaPreview | null>(null);
const grupoOpts = gruposEmpresariais.map((g) => g.nome);

watch(
  () => [form.qtdAnimais, form.valorUnitario, form.pesoLote, form.taxa, form.emissao, form.vencimento],
  () => {
    const qty = Number(form.qtdAnimais) || 0;
    const unit = Number(form.valorUnitario) || 0;
    const weight = Number(form.pesoLote) || 0;
    const rate = Number(form.taxa) || 0;
    if (!qty || !unit || !weight) {
      preview.value = null;
      return;
    }
    preview.value = simulatePromissoryNote({
      animalsQuantity: qty,
      unitValue: unit,
      batchWeightInArroba: weight,
      rate,
      issueDate: form.emissao,
      dueDate: form.vencimento,
    });
  },
  { immediate: true },
);

const step = computed(() => steps[stepIdx.value]);
const isLast = computed(() => stepIdx.value === steps.length - 1);

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

function addInfo() {
  form.infos.push({ tipo: '', idade: '', qtd: '' });
}
function removeInfo(i: number) {
  if (form.infos.length <= 1) return;
  form.infos.splice(i, 1);
}
function addNota() {
  form.notas.push({ nf: '', gta: '' });
}
function removeNota(i: number) {
  if (form.notas.length <= 1) return;
  form.notas.splice(i, 1);
}

function handleNext() {
  if (isLast.value) {
    emit('created');
    emit('close');
    return;
  }
  stepIdx.value++;
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
            Termo Confina — Gerar Título
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            {{ vehicleName }} · {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          type="button"
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
        <template v-if="step.key === 'operacao'">
          <StepGrid>
            <SelectField v-model="form.grupo" label="Grupo empresarial" :options="grupoOpts" :span="6" />
            <FormField v-model="form.outorgado" label="Outorgado" placeholder="Nome / razão social" :span="6" />
            <FormField v-model="form.qtdAnimais" label="Qtd. animais" type="number" :span="3" />
            <FormField v-model="form.valorUnitario" label="Valor unitário @" type="number" :span="3" />
            <FormField v-model="form.pesoLote" label="Peso lote @" type="number" :span="3" />
            <FormField v-model="form.taxa" label="Taxa (% a.m.)" type="number" :span="3" />
            <FormField v-model="form.emissao" label="Emissão" type="date" :span="4" />
            <FormField v-model="form.vencimento" label="Vencimento" type="date" :span="4" />
            <SelectField v-model="form.baseDias" label="Base de cálculo (dias)" :options="[...BASE_DAYS_OPTS]" :span="4" />
          </StepGrid>
          <div v-if="preview" style="margin-top: 24px">
            <SectionGroup :icon="Info" title="Prévia da simulação">
              <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
                <SummaryItem label="Valor compra" :value="brl(preview.valorCompra)" />
                <SummaryItem label="Juros" :value="brl(preview.juros)" />
                <SummaryItem label="Valor nominal" :value="brl(preview.valorNominal)" />
                <SummaryItem label="Prazo" :value="`${preview.dias} dias`" />
              </div>
            </SectionGroup>
          </div>
        </template>

        <template v-else-if="step.key === 'promissoria'">
          <StepGrid>
            <FormField v-model="form.numeroTitulo" label="Número do título" :span="4" />
            <FormField v-model="form.filial" label="Filial / Outorgante" :span="8" />
            <FormField v-model="form.feeMonitoramento" label="FEE monitoramento (%)" type="number" :span="4" />
            <FormField v-model="form.prazoAssinatura" label="Prazo assinatura (dias)" type="number" :span="4" />
            <FormField v-model="form.vigenciaMeses" label="Vigência contrato (meses)" type="number" :span="4" />
            <div
              class="flex items-center"
              style="gap: 12px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg); grid-column: span 12; cursor: pointer"
              @click="form.certificadorEmail = !form.certificadorEmail"
            >
              <Checkbox :checked="form.certificadorEmail" @change="form.certificadorEmail = !form.certificadorEmail" />
              <span style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">
                Certificador de e-mail
              </span>
            </div>
          </StepGrid>
        </template>

        <template v-else-if="step.key === 'animais'">
          <StepGrid>
            <SelectField v-model="form.categoria" label="Categoria" :options="[...CONFINA_CATEGORIA_OPTS]" :span="4" />
            <SelectField v-model="form.raca" label="Raça" :options="[...CONFINA_RACA_OPTS]" :span="4" />
            <FormField v-model="form.pesoMinIndividual" label="Peso mín. individual @" type="number" :span="4" />
            <FormField v-model="form.pesoLote" label="Peso lote @" type="number" :span="6" />
            <FormField v-model="form.pesoLoteKg" label="Peso lote (kg)" type="number" placeholder="Opcional" :span="6" />
          </StepGrid>
          <div style="margin-top: 24px">
            <div class="flex items-center justify-between" style="margin-bottom: 12px">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
                Informações adicionais
              </div>
              <AddButton @click="addInfo" />
            </div>
            <div class="flex flex-col" style="gap: 12px">
              <StepGrid v-for="(info, i) in form.infos" :key="i">
                <FormField v-model="info.tipo" label="Tipo" :span="4" />
                <FormField v-model="info.idade" label="Idade" :span="4" />
                <FormField v-model="info.qtd" label="Qtd" type="number" :span="3" />
                <div style="grid-column: span 1; display: flex; align-items: flex-end">
                  <button
                    type="button"
                    :disabled="form.infos.length <= 1"
                    style="height: 40px; width: 100%; background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                    @click="removeInfo(i)"
                  >
                    ×
                  </button>
                </div>
              </StepGrid>
            </div>
          </div>
        </template>

        <template v-else-if="step.key === 'notas'">
          <div class="flex items-center justify-between" style="margin-bottom: 16px">
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
              Informe ao menos uma nota fiscal. GTA é opcional.
            </p>
            <AddButton @click="addNota" />
          </div>
          <div class="flex flex-col" style="gap: 12px">
            <StepGrid v-for="(n, i) in form.notas" :key="i">
              <FormField v-model="n.nf" label="Nota fiscal" :span="5" />
              <FormField v-model="n.gta" label="GTA" placeholder="Opcional" :span="6" />
              <div style="grid-column: span 1; display: flex; align-items: flex-end">
                <button
                  type="button"
                  :disabled="form.notas.length <= 1"
                  style="height: 40px; width: 100%; background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)"
                  @click="removeNota(i)"
                >
                  ×
                </button>
              </div>
            </StepGrid>
          </div>
        </template>

        <template v-else>
          <StepGrid>
            <SelectField v-model="form.fazenda" label="Fazenda" :options="[...FAZENDAS_OPTS]" :span="8" />
            <SelectField v-model="form.posicaoAnexo" label="Posição do anexo" :options="['Início', 'Final']" :span="4" />
            <FormField v-model="form.proprietario" label="Proprietário" :span="6" />
            <FormField v-model="form.testemunhas" label="Testemunhas" placeholder="Separar por vírgula" :span="6" />
          </StepGrid>
        </template>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="stepIdx === 0 ? emit('close') : (stepIdx = Math.max(0, stepIdx - 1))"
        >
          {{ stepIdx === 0 ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          type="button"
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
          @click="handleNext"
        >
          {{ isLast ? 'Gerar Título' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
