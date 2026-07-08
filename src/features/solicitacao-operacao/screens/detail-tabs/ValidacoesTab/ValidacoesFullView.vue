<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, ArrowLeft, CheckCircle2, RefreshCw, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
import { detalheSolicitacao } from '../../../data/operacaoData';
import { Section, GhostButton } from '../shared';
import ValidacaoRow from './ValidacaoRow.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

const erros = computed(() => props.det.validacoes.filter((v) => v.status === 'ERRO'));
const alertas = computed(() => props.det.validacoes.filter((v) => v.status === 'ALERTA'));
const ok = computed(() => props.det.validacoes.filter((v) => v.status === 'OK'));

const kpis = computed(() => [
  { label: 'Erros', count: erros.value.length, bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle as Component },
  { label: 'Alertas', count: alertas.value.length, bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle as Component },
  { label: 'Aprovadas', count: ok.value.length, bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 as Component },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Solicitação de Operação
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          Validações
        </h2>
      </div>
      <GhostButton :icon="RefreshCw">Revalidar todas</GhostButton>
    </div>

    <!-- KPI cards -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        :style="{ gap: '16px', padding: '20px 24px', background: k.bg, borderRadius: 'var(--radius-xl)' }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.60)',
            color: k.fg,
            flexShrink: 0,
          }"
        >
          <component :is="k.icon" :size="22" />
        </div>
        <div>
          <div
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.14em',
              color: k.fg,
              textTransform: 'uppercase',
              marginBottom: '6px',
              opacity: 0.8,
            }"
          >
            {{ k.label }}
          </div>
          <div :style="{ fontSize: '32px', fontWeight: 'var(--weight-bold)', color: k.fg, lineHeight: 1 }">
            {{ k.count }}
          </div>
        </div>
      </div>
    </div>

    <!-- Dica -->
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: var(--text-xs);
        color: var(--text-muted);
        padding: 10px 14px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <AlertCircle :size="14" />
      As validações só rodam quando a operação tiver título e veículo vinculado. Use "Revalidar todas" para
      atualizar.
    </div>

    <!-- Listas por status -->
    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="flex flex-col" style="gap: 32px">
        <Section v-if="erros.length > 0" :title="`Erros (${erros.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow v-for="v in erros" :key="v.titulo" :v="v" />
          </div>
        </Section>
        <Section v-if="alertas.length > 0" :title="`Alertas (${alertas.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow v-for="v in alertas" :key="v.titulo" :v="v" />
          </div>
        </Section>
        <Section v-if="ok.length > 0" :title="`Aprovadas (${ok.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow v-for="v in ok" :key="v.titulo" :v="v" />
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>
