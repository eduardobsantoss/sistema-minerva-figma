<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
import { detalheSolicitacao, type ItemValidacao } from '../../../data/operacaoData';
import { Section, GhostButton } from '../shared';
import ValidacaoRow from './ValidacaoRow.vue';

const props = defineProps<{
  det: ReturnType<typeof detalheSolicitacao>;
  solicitacaoId: string;
}>();
const emit = defineEmits<{
  back: [];
  inserirEvidencia: [v: ItemValidacao];
  verEvidencia: [v: ItemValidacao];
  autorizar: [v: ItemValidacao];
  verDetalhes: [v: ItemValidacao];
}>();

const pendentes = computed(() => props.det.validacoes.filter((v) => v.status === 'PENDENTE'));
const processando = computed(() => props.det.validacoes.filter((v) => v.status === 'PROCESSANDO'));
const naoOk = computed(() => props.det.validacoes.filter((v) => v.status === 'NAO_OK'));
const excecoes = computed(() => props.det.validacoes.filter((v) => v.status === 'EXCECAO'));
const ok = computed(() => props.det.validacoes.filter((v) => v.status === 'OK'));

const kpis = computed(() => [
  { label: 'Pendentes', count: pendentes.value.length, bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', icon: Clock as Component },
  { label: 'Processando', count: processando.value.length, bg: 'var(--status-active-bg)', fg: 'var(--gci-base)', icon: Loader2 as Component },
  { label: 'Não ok', count: naoOk.value.length, bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', icon: XCircle as Component },
  { label: 'Exceção', count: excecoes.value.length, bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle as Component },
  { label: 'Ok', count: ok.value.length, bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 as Component },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
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

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        :style="{ gap: '12px', padding: '16px 18px', background: k.bg, borderRadius: 'var(--radius-xl)' }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.60)',
            color: k.fg,
            flexShrink: 0,
          }"
        >
          <component :is="k.icon" :size="18" />
        </div>
        <div>
          <div
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: k.fg,
              textTransform: 'uppercase',
              marginBottom: '4px',
              opacity: 0.8,
            }"
          >
            {{ k.label }}
          </div>
          <div :style="{ fontSize: '24px', fontWeight: 'var(--weight-bold)', color: k.fg, lineHeight: 1 }">
            {{ k.count }}
          </div>
        </div>
      </div>
    </div>

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

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="flex flex-col" style="gap: 32px">
        <Section v-if="pendentes.length > 0" :title="`Pendentes (${pendentes.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in pendentes"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="processando.length > 0" :title="`Processando (${processando.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in processando"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="naoOk.length > 0" :title="`Não ok (${naoOk.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in naoOk"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="excecoes.length > 0" :title="`Exceção (${excecoes.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in excecoes"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
        <Section v-if="ok.length > 0" :title="`Ok (${ok.length})`">
          <div class="flex flex-col" style="gap: 10px">
            <ValidacaoRow
              v-for="v in ok"
              :key="v.titulo"
              :v="v"
              @inserir-evidencia="emit('inserirEvidencia', $event)"
              @ver-evidencia="emit('verEvidencia', $event)"
              @autorizar="emit('autorizar', $event)"
              @ver-detalhes="emit('verDetalhes', $event)"
            />
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>
