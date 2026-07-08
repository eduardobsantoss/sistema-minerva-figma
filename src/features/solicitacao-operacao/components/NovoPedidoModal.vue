<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  ShieldCheck,
  Paperclip,
  AlertTriangle,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import {
  DadosGeraisStep,
  GarantiaStep,
  AnexosStep,
  type NewPedidoData,
  type GarantiaItem,
} from './novo-pedido';

const emit = defineEmits<{ close: []; create: [data: NewPedidoData] }>();

interface Step {
  key: 'dados' | 'garantia' | 'anexos';
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'dados', label: 'Dados Gerais', icon: FileText, hint: 'Parâmetros comerciais e financeiros da operação' },
  { key: 'garantia', label: 'Garantia', icon: ShieldCheck, hint: 'Garantias vinculadas à operação' },
  { key: 'anexos', label: 'Anexos', icon: Paperclip, hint: 'Documentação comprobatória' },
];

const DOCS_GERAIS: { id: string; nome: string; obrigatorio: boolean }[] = [
  { id: 'contrato-social', nome: 'Contrato Social', obrigatorio: true },
  { id: 'cartao-cnpj', nome: 'Cartão CNPJ', obrigatorio: true },
  { id: 'balanco', nome: 'Balanço Patrimonial', obrigatorio: true },
  { id: 'end', nome: 'Comprovante de Endereço', obrigatorio: false },
  { id: 'procuracao', nome: 'Procuração', obrigatorio: false },
];

const stepIdx = ref(0);
const form = reactive<NewPedidoData>({
  tipoOperacao: '',
  esteira: '',
  tipoContrato: '',
  unidadeNegocio: '',
  gerenteComercial: '',
  fundo: '',
  grupoEmpresarial: '',
  contaBancaria: '',
  tipoTaxa: 'Pré-fixado',
  taxaOperacao: '',
  indicePos: '',
  operadorPos: '',
  valorTaxaPos: '',
  fee: '',
  valorOperacao: '',
  quitacaoVencidos: false,
  requerGarantia: false,
});

const garantiaItens = reactive<GarantiaItem[]>([]);
const garantiaForm = reactive<GarantiaItem>({ tipo: '', nome: '', valor: '' });

const docFiles = reactive<Record<string, boolean>>({});

function addGarantia() {
  if (!garantiaForm.tipo || !garantiaForm.nome) return;
  garantiaItens.push({ ...garantiaForm });
  garantiaForm.tipo = '';
  garantiaForm.nome = '';
  garantiaForm.valor = '';
}

function removeGarantia(i: number) {
  garantiaItens.splice(i, 1);
}

// Documentos por garantia adicionada
const docsGarantia = computed(() =>
  garantiaItens.map((g, i) => ({
    id: `garantia-${i}`,
    nome: `Laudo de Avaliação — ${g.nome}`,
    obrigatorio: true,
  })),
);

const requiredDocs = computed(() => [...DOCS_GERAIS, ...docsGarantia.value].filter((d) => d.obrigatorio));
const pendingRequired = computed(() => requiredDocs.value.filter((d) => !docFiles[d.id]).length);
const canConfirm = computed(() => pendingRequired.value === 0);

function toggleDoc(id: string) {
  docFiles[id] = !docFiles[id];
}

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function goNext() {
  if (isLast.value) {
    if (canConfirm.value) emit('create', { ...form });
  } else {
    stepIdx.value++;
  }
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
        max-width: 980px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-start justify-between"
        style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)"
      >
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Novo Pedido de Operação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
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

      <!-- Stepper (informativo, não clicável) -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <div
          v-for="(s, i) in steps"
          :key="s.key"
          class="flex items-center justify-center"
          :style="{
            flex: 1,
            gap: '8px',
            padding: '16px 8px 13px',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--stepper-done)' : 'var(--text-muted)',
            opacity: i !== stepIdx && i >= stepIdx ? 0.6 : 1,
          }"
        >
          <Check v-if="i < stepIdx" :size="16" :stroke-width="2.5" />
          <component :is="s.icon" v-else :size="16" :stroke-width="i === stepIdx ? 2.25 : 1.75" />
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">
            {{ s.label }}
          </span>
        </div>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <DadosGeraisStep v-if="step.key === 'dados'" :form="form" />

        <GarantiaStep
          v-else-if="step.key === 'garantia'"
          :requer="form.requerGarantia"
          :itens="garantiaItens"
          :g-form="garantiaForm"
          @toggle-requer="form.requerGarantia = !form.requerGarantia"
          @add="addGarantia"
          @remove="removeGarantia"
        />

        <AnexosStep
          v-else-if="step.key === 'anexos'"
          :docs-gerais="DOCS_GERAIS"
          :docs-garantia="docsGarantia"
          :doc-files="docFiles"
          @toggle-doc="toggleDoc"
        />
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          class="flex items-center"
          style="
            gap: 6px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
          @click="isFirst ? emit('close') : stepIdx--"
        >
          <template v-if="isFirst">Cancelar</template>
          <template v-else><ChevronLeft :size="15" /> Voltar</template>
        </button>

        <div class="flex items-center" style="gap: 16px">
          <span
            v-if="isLast && !canConfirm"
            class="flex items-center"
            style="gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--warning-base)"
          >
            <AlertTriangle :size="14" />
            {{ pendingRequired }} {{ pendingRequired === 1 ? 'documento obrigatório pendente' : 'documentos obrigatórios pendentes' }}
          </span>
          <button
            :disabled="isLast && !canConfirm"
            class="flex items-center"
            :style="{
              gap: '8px',
              height: '44px',
              padding: '0 22px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: isLast && !canConfirm ? 'not-allowed' : 'pointer',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: isLast ? (canConfirm ? 'var(--success-base)' : 'var(--neutral-200)') : 'var(--action-primary-bg)',
              color: isLast && !canConfirm ? 'var(--text-disabled)' : '#fff',
              transition: 'background var(--duration-base)',
            }"
            @click="goNext"
          >
            <template v-if="isLast">Confirmar solicitação <Check :size="15" /></template>
            <template v-else>Próxima etapa <ChevronRight :size="15" /></template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
