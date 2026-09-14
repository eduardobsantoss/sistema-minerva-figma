<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { X, Info, Building2, Percent, ShieldCheck, Layers, Check, ChevronRight } from 'lucide-vue-next';
import { GRUPOS_SEED } from '@/features/risco/data/riscoData';
import { defaultSemiNome, slugGrupo } from '../data/semiestruturadasData';
import type { NewSemiData } from './create-semi-modal/types';
import StepDadosGerais from './create-semi-modal/steps/StepDadosGerais.vue';
import StepGrupos from './create-semi-modal/steps/StepGrupos.vue';
import StepJurosMulta from './create-semi-modal/steps/StepJurosMulta.vue';
import StepTiposAceitos from './create-semi-modal/steps/StepTiposAceitos.vue';
import StepExigidas from './create-semi-modal/steps/StepExigidas.vue';

export type { NewSemiData };

const emit = defineEmits<{ close: []; create: [data: NewSemiData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'dados', label: 'Dados gerais', icon: Info, hint: 'Identificação da operação' },
  { key: 'grupos', label: 'Grupos', icon: Building2, hint: 'Cedente / grupo empresarial' },
  { key: 'juros', label: 'Juros e multa', icon: Percent, hint: 'Encargos do contrato' },
  { key: 'tipos', label: 'Tipos aceitos', icon: ShieldCheck, hint: 'Cobertura aceita por tipo' },
  { key: 'exigidas', label: 'Exigidas', icon: Layers, hint: 'Garantias exigidas' },
];

const stepIdx = ref(0);
const lastAutoNome = ref(defaultSemiNome('NC'));

const form = ref<NewSemiData>({
  nome: defaultSemiNome('NC'),
  credorId: '',
  escrituradorId: '',
  contractType: 'NC',
  needsPayerBondsExpireValidation: false,
  operateWithFutureDelivery: false,
  grupoIds: [],
  interestRate: '',
  paymentDelayFine: '',
  accepted: [],
  required: [],
});

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function parseNum(raw: string): number {
  return Number(String(raw).replace(',', '.'));
}

function isValidPct(n: number) {
  return Number.isFinite(n) && n >= 0 && n <= 100;
}

function syncRequired() {
  const prev = new Map(form.value.required.map((r) => [r.warrantyTypeId, r]));
  form.value.required = form.value.accepted.map(
    (a) => prev.get(a.warrantyTypeId) ?? { warrantyTypeId: a.warrantyTypeId, mode: 'value' as const },
  );
}

function cedenteSlug(): string {
  const g = GRUPOS_SEED.find((x) => x.id === form.value.grupoIds[0]);
  return g ? slugGrupo(g.nome) : '';
}

watch(
  () => form.value.contractType,
  (tipo, prev) => {
    if (!tipo) return;
    const slug = cedenteSlug();
    const prevTipo = (prev || '') as string;
    if (
      !form.value.nome.trim() ||
      form.value.nome === lastAutoNome.value ||
      form.value.nome === defaultSemiNome(prevTipo, slug) ||
      form.value.nome === defaultSemiNome(prevTipo)
    ) {
      form.value.nome = defaultSemiNome(tipo, slug);
      lastAutoNome.value = form.value.nome;
    }
  },
);

watch(
  () => form.value.grupoIds.slice(),
  () => {
    const tipo = form.value.contractType;
    if (!tipo) return;
    const slug = cedenteSlug();
    if (
      !form.value.nome.trim() ||
      form.value.nome === lastAutoNome.value ||
      form.value.nome === defaultSemiNome(tipo) ||
      /^semiestruturada_[A-Z]+_$/.test(form.value.nome)
    ) {
      form.value.nome = defaultSemiNome(tipo, slug);
      lastAutoNome.value = form.value.nome;
    }
  },
);

const canAdvance = computed(() => {
  const f = form.value;
  if (stepIdx.value === 0) {
    return Boolean(f.nome.trim() && f.credorId && f.contractType);
  }
  if (stepIdx.value === 1) return f.grupoIds.length >= 1;
  if (stepIdx.value === 2) {
    const juros = parseNum(f.interestRate);
    const multa = parseNum(f.paymentDelayFine);
    return f.interestRate !== '' && isValidPct(juros) && f.paymentDelayFine !== '' && isValidPct(multa) && multa >= 1;
  }
  if (stepIdx.value === 3) {
    const ids = f.accepted.map((a) => a.warrantyTypeId);
    return (
      f.accepted.length >= 1 &&
      new Set(ids).size === ids.length &&
      f.accepted.every((a) => isValidPct(a.acceptedPercentage))
    );
  }
  return (
    f.required.length >= 1 &&
    f.required.every((r) =>
      r.mode === 'value' ? r.value != null && r.value >= 0 : r.percentage != null && isValidPct(r.percentage),
    )
  );
});

function next() {
  if (!canAdvance.value) return;
  if (isLast.value) {
    emit('create', { ...form.value, accepted: [...form.value.accepted], required: [...form.value.required] });
    return;
  }
  if (stepIdx.value === 3) syncRequired();
  stepIdx.value += 1;
}

function goTo(i: number) {
  if (i > stepIdx.value && !canAdvance.value) return;
  if (i >= 4) syncRequired();
  stepIdx.value = i;
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
        max-width: 900px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Nova Semiestruturada
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
          @click="goTo(i)"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 32px 40px">
        <StepDadosGerais v-if="step.key === 'dados'" v-model="form" />
        <StepGrupos v-else-if="step.key === 'grupos'" v-model="form" />
        <StepJurosMulta v-else-if="step.key === 'juros'" v-model="form" />
        <StepTiposAceitos v-else-if="step.key === 'tipos'" v-model="form" />
        <StepExigidas v-else v-model="form" />
      </div>

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
          :disabled="!canAdvance"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: !canAdvance ? 'var(--neutral-400)' : isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            opacity: canAdvance ? 1 : 0.7,
            boxShadow: !canAdvance
              ? 'none'
              : isLast
                ? '0 8px 20px -8px rgba(5,150,105,0.40)'
                : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="next"
        >
          {{ isLast ? 'Finalizar Cadastro' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

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
