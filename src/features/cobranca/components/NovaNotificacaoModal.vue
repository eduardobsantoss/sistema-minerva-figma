<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X, Settings, Clock, AlertCircle, Building2, ChevronRight, Check } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Metodo } from '../data/cobrancaData';
import FieldLabel from './nova-notificacao/FieldLabel.vue';
import TextInput from './nova-notificacao/TextInput.vue';
import TemplateSelector from './nova-notificacao/TemplateSelector.vue';
import IntervalStep from './nova-notificacao/IntervalStep.vue';
import VeiculosStep from './nova-notificacao/VeiculosStep.vue';
import { TEMPLATES, type TemplateTom } from './nova-notificacao/templates';

export interface NewNotificacaoData {
  nome: string;
  metodos: Metodo[];
  templateAVencer: string;
  templateVencidos: string;
  intervalosAVencer: number[];
  intervalosVencidos: number[];
  veiculos: string[];
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
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
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
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 840px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Nova Notificação de Cobrança
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            Configure a régua de notificação · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
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
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--gci-base)' : 'var(--text-muted)',
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

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <!-- Step 1 — Configuração -->
        <div v-if="step.key === 'config'" style="display: flex; flex-direction: column; gap: 28px">
          <div>
            <FieldLabel>Nome da Notificação *</FieldLabel>
            <TextInput v-model="nome" placeholder="Ex: Régua Padrão — A Vencer" />
          </div>

          <div>
            <FieldLabel>Método de Notificação</FieldLabel>
            <div class="flex" style="gap: 8px">
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
                }"
                @click="toggleMetodo(m)"
              >
                {{ m }}
              </button>
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

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        :style="{
          padding: '16px 32px',
          borderTop: '1px solid var(--border-default)',
          background: isLast ? 'rgba(5,150,105,0.04)' : 'var(--surface-card)',
          flexShrink: 0,
          transition: 'background var(--duration-base)',
        }"
      >
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
          @click="isLast ? handleSave() : stepIdx++"
        >
          {{ isLast ? 'Salvar Notificação' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
