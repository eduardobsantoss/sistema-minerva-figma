<script setup lang="ts">
import { ref, computed } from 'vue';
import { Info, Check, ChevronRight, ChevronLeft } from 'lucide-vue-next';
import type { Component } from 'vue';
import StepGrid from './create-cra-modal/StepGrid.vue';
import FormField from './create-cra-modal/FormField.vue';
import SelectField from './create-cra-modal/SelectField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

export interface NewCraData {
  tipoOperacao: string;
  nomeFantasia: string;
}

const emit = defineEmits<{ close: []; create: [data: NewCraData] }>();

interface Step {
  key: string;
  label: string;
  icon: Component;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Campos de CRA', icon: Info, hint: 'Identificação da operação' },
];

const stepIdx = ref(0);
const form = ref<NewCraData>({
  tipoOperacao: '',
  nomeFantasia: '',
});

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function handleCreate() {
  emit('create', form.value);
}
</script>

<template>
  <AdminModal size="lg" eyebrow="CRA" title="Novo CRA" :subtitle="`${step.hint} · Etapa ${stepIdx + 1} de ${steps.length}`" @close="emit('close')">
    <template #subheader>
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
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--stepper-done)' : 'var(--text-muted)',
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
    </template>

    <div>
      <!-- Campos de CRA -->
      <StepGrid v-if="step.key === 'info'">
        <SelectField
          label="Categoria de Operação"
          :options="['Mono CRA', 'Multi CRA']"
          placeholder="Selecione"
          :span="6"
          v-model="form.tipoOperacao"
        />
        <FormField
          label="Nome do CRA"
          placeholder="Ex: CRA Semeagro"
          :span="6"
          v-model="form.nomeFantasia"
        />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" :icon="isFirst ? undefined : ChevronLeft" @click="isFirst ? emit('close') : stepIdx--">{{ isFirst ? 'Cancelar' : 'Voltar' }}</AdminButton>
      <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
        {{ stepIdx + 1 }} / {{ steps.length }}
      </span>
      <AdminButton variant="primary" size="large" :trailing-icon="isLast ? Check : ChevronRight" @click="isLast ? handleCreate() : stepIdx++">{{ isLast ? 'Finalizar cadastro' : 'Próxima etapa' }}</AdminButton>
    </template>
  </AdminModal>
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
