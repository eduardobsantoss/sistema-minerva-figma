<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Settings, Clock, AlertCircle, Building2, ChevronLeft, ChevronRight, Check } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Metodo } from '../data/cobrancaData';
import FieldLabel from './nova-notificacao/FieldLabel.vue';
import TextInput from './nova-notificacao/TextInput.vue';
import TemplateSelector from './nova-notificacao/TemplateSelector.vue';
import IntervalStep from './nova-notificacao/IntervalStep.vue';
import VeiculosStep from './nova-notificacao/VeiculosStep.vue';
import { TEMPLATES, type TemplateTom } from './nova-notificacao/templates';
import ToggleRow from '@/features/risco/screens/detail-tabs/shared/ToggleRow.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

export interface NewNotificacaoData {
  nome: string;
  metodos: Metodo[];
  templateAVencer: string;
  templateVencidos: string;
  intervalosAVencer: number[];
  intervalosVencidos: number[];
  veiculos: string[];
  enviaFimSemanaFeriado: boolean;
}

const emit = defineEmits<{ close: []; create: [data: NewNotificacaoData] }>();

interface StepDef {
  key: string;
  label: string;
  icon: Component;
}

const steps: StepDef[] = [
  { key: 'config', label: 'Configuração', icon: Settings },
  { key: 'avencer', label: 'A Vencer', icon: Clock },
  { key: 'vencidos', label: 'Vencidos', icon: AlertCircle },
  { key: 'veiculos', label: 'Veículos', icon: Building2 },
];

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];

const stepIdx = ref(0);
const nome = ref('');
const metodos = ref<Metodo[]>(['Email']);
const templateAVencer = ref<TemplateTom>('amigavel');
const templateVencidos = ref<TemplateTom>('formal');
const intervalosAVencer = ref<number[]>([30, 15, 7]);
const intervalosVencidos = ref<number[]>([1, 5, 10]);
const veiculos = ref<string[]>([]);
const enviaFimSemanaFeriado = ref(false);
const stepHover = ref<number | null>(null);

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function toggleMetodo(m: Metodo) {
  metodos.value = metodos.value.includes(m)
    ? metodos.value.filter((x) => x !== m)
    : [...metodos.value, m];
}

function handleSave() {
  emit('create', {
    nome: nome.value,
    metodos: metodos.value,
    templateAVencer: TEMPLATES[templateAVencer.value].avencer,
    templateVencidos: TEMPLATES[templateVencidos.value].vencidos,
    intervalosAVencer: intervalosAVencer.value,
    intervalosVencidos: intervalosVencidos.value,
    veiculos: veiculos.value,
    enviaFimSemanaFeriado: enviaFimSemanaFeriado.value,
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <AdminModal size="lg" tall eyebrow="Cobrança" title="Nova notificação de régua de cobrança" :subtitle="`Configure a régua de notificação · Etapa ${stepIdx + 1} de ${steps.length}`" @close="emit('close')">
    <template #subheader>
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); flex-shrink: 0">
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
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--stepper-done)' : 'var(--text-muted)',
            opacity: i !== stepIdx && i >= stepIdx && stepHover !== i ? 0.55 : 1,
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="stepHover = i"
          @mouseleave="stepHover = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>
    </template>

    <div>
      <!-- Step 1 — Configuração -->
      <div v-if="step.key === 'config'" style="display: flex; flex-direction: column; gap: 28px">
        <div>
          <FieldLabel>Nome da Notificação *</FieldLabel>
          <TextInput v-model="nome" placeholder="Ex: Régua Padrão — A Vencer" />
        </div>

        <div>
          <FieldLabel>Método de Notificação</FieldLabel>
          <div class="flex items-center" style="gap: 8px; width: 100%">
            <button
              v-for="m in METODOS"
              :key="m"
              type="button"
              :style="{
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: metodos.includes(m) ? 'var(--action-primary-bg)' : 'var(--action-secondary-border)',
                background: metodos.includes(m) ? 'var(--action-primary-bg)' : 'var(--action-secondary-bg)',
                color: metodos.includes(m) ? '#fff' : 'var(--action-secondary-text)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                transition: 'all var(--duration-fast)',
                flexShrink: 0,
              }"
              @click="toggleMetodo(m)"
            >
              {{ m }}
            </button>
            <div style="flex: 1; min-width: 0">
              <ToggleRow
                compact
                label="Enviar em finais de semana e feriados"
                :on="enviaFimSemanaFeriado"
                @toggle="enviaFimSemanaFeriado = !enviaFimSemanaFeriado"
              />
            </div>
          </div>
        </div>

        <div
          style="
            padding: 20px;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
            border-width: 1px;
            border-style: solid;
            border-color: var(--border-default);
            display: flex;
            flex-direction: column;
            gap: 24px;
          "
        >
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: var(--text-muted); text-transform: uppercase">
            Templates de Mensagem
          </div>
          <TemplateSelector
            v-model="templateAVencer"
            label="Template para mensagens a vencer"
            text-key="avencer"
          />
          <div style="height: 1px; background: var(--border-default)" />
          <TemplateSelector
            v-model="templateVencidos"
            label="Template para mensagens vencidas"
            text-key="vencidos"
          />
        </div>
      </div>

      <!-- Step 2 — A Vencer -->
      <IntervalStep
        v-else-if="step.key === 'avencer'"
        title="Intervalos de Notificação — A Vencer"
        subtitle="Defina quantos dias antes do vencimento cada disparo deve ocorrer."
        input-label="Dias antes do vencimento"
        :intervals="intervalosAVencer"
        mode="avencer"
        @update:intervals="intervalosAVencer = $event"
      />

      <!-- Step 3 — Vencidos -->
      <IntervalStep
        v-else-if="step.key === 'vencidos'"
        title="Intervalos de Notificação — Vencidos"
        subtitle="Defina quantos dias após o vencimento cada disparo deve ocorrer."
        input-label="Dias após o vencimento"
        :intervals="intervalosVencidos"
        mode="vencidos"
        @update:intervals="intervalosVencidos = $event"
      />

      <!-- Step 4 — Veículos -->
      <VeiculosStep
        v-else-if="step.key === 'veiculos'"
        :selected="veiculos"
        @update:selected="veiculos = $event"
      />
    </div>
    <template #footer>
      <AdminButton variant="ghost" size="large" :icon="isFirst ? undefined : ChevronLeft" @click="isFirst ? emit('close') : stepIdx--">
        {{ isFirst ? 'Cancelar' : 'Voltar' }}
      </AdminButton>
      <AdminButton variant="primary" size="large" :trailing-icon="isLast ? Check : ChevronRight" @click="isLast ? handleSave() : stepIdx++">
        {{ isLast ? 'Salvar notificação' : 'Próxima etapa' }}
      </AdminButton>
    </template>
  </AdminModal>
</template>
