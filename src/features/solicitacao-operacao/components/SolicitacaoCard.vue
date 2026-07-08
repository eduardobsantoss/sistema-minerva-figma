<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, fmtDuracao, slaRatio, type Solicitacao } from '../data/operacaoData';

interface Props {
  solicitacao: Solicitacao;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), { compact: false });
const emit = defineEmits<{ open: [id: string] }>();

/** Cor leve por tipo de contrato (badge). */
function contratoTone(tipo: string): { bg: string; fg: string } {
  const t = tipo.toUpperCase();
  if (t.includes('CDCA')) return { bg: 'var(--success-light)', fg: 'var(--success-dark)' };
  if (t.includes('CPR') || t.includes('NC')) return { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' };
  return { bg: 'var(--surface-sunken)', fg: 'var(--text-default)' };
}

const hover = ref(false);
const expanded = ref(false);

const s = computed(() => props.solicitacao);
const valido = computed(() => s.value.validacao === 'VALIDO');
const atrasado = computed(() => slaRatio(s.value) > 1);
const barColor = computed(() => (atrasado.value ? 'var(--danger-base)' : 'var(--success-base)'));
const ct = computed(() => contratoTone(s.value.tipoContrato));
const isCliente = computed(() => s.value.esteira === 'CLIENTE');

const timeCols = computed(() => [
  { icon: Clock as Component, label: 'Total', value: fmtDuracao(s.value.tempoTotalHoras), emphasize: false },
  { icon: RefreshCw as Component, label: 'Etapa', value: fmtDuracao(s.value.tempoEtapaHoras), emphasize: atrasado.value },
]);

const detailRows = computed(() => [
  { label: 'Veículo', value: s.value.veiculo },
  { label: 'Taxa', value: `${s.value.taxa.toFixed(2).replace('.', ',')}%` },
  { label: 'Gerente', value: s.value.gerente },
  { label: 'Atendente', value: s.value.atendente },
]);

function handleClick() {
  emit('open', s.value.id);
}

function toggleExpanded(e: MouseEvent) {
  e.stopPropagation();
  expanded.value = !expanded.value;
}
</script>

<template>
  <div
    class="flex flex-col"
    :style="{
      position: 'relative',
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: compact ? '12px' : '16px',
      gap: compact ? '10px' : '12px',
      cursor: 'pointer',
      boxShadow: hover ? '0 12px 28px -14px rgba(8,60,74,0.18)' : 'var(--shadow-xs)',
      transform: hover && !compact ? 'translateY(-3px)' : 'translateY(0)',
      transition:
        'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <Bookmark
      v-if="isCliente"
      :size="18"
      :style="{
        position: 'absolute',
        top: compact ? '8px' : '10px',
        right: compact ? '8px' : '10px',
        color: 'var(--agro-base)',
        fill: 'var(--agro-base)',
        pointerEvents: 'none',
      }"
    />
    <!-- Badges: tipo de contrato + validação -->
    <div class="flex items-center justify-between" style="gap: 8px">
      <span
        :style="{
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          background: ct.bg,
          color: ct.fg,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '60%',
        }"
      >
        {{ s.tipoContrato }}
      </span>
      <span
        class="flex items-center"
        :style="{
          gap: '4px',
          flexShrink: 0,
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.06em',
          padding: '3px 8px',
          borderRadius: '9999px',
          background: valido ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
          color: valido ? 'var(--status-success-text)' : 'var(--status-danger-text)',
        }"
      >
        <CheckCircle2 v-if="valido" :size="10" :stroke-width="2.5" />
        <XCircle v-else :size="10" :stroke-width="2.5" />
        {{ valido ? 'VÁLIDO' : 'INVÁLIDO' }}
      </span>
    </div>

    <!-- Cedente + ID -->
    <div>
      <div
        :style="{
          fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }"
      >
        {{ s.cedente }}
      </div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
        {{ s.id }}
      </div>
    </div>

    <!-- Valor -->
    <div
      :style="{
        fontSize: compact ? 'var(--text-md)' : 'var(--text-lg)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }"
    >
      {{ brl(s.valor) }}
    </div>

    <!-- Vínculo (pill) -->
    <div
      class="flex items-center"
      :style="{
        gap: '8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunken)',
        fontSize: '11px',
        color: s.vinculo ? 'var(--text-default)' : 'var(--text-muted)',
      }"
    >
      <Building2 :size="13" :stroke-width="2" style="flex-shrink: 0; color: var(--text-muted)" />
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ s.vinculo || 'Sem vínculo' }}
      </span>
    </div>

    <!-- Divisor -->
    <div style="height: 1px; background: var(--border-default)" />

    <!-- TOTAL | ETAPA -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
      <div v-for="tc in timeCols" :key="tc.label" class="flex flex-col" style="gap: 5px">
        <div
          class="flex items-center"
          style="
            gap: 5px;
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <component :is="tc.icon" :size="11" :stroke-width="2" /> {{ tc.label }}
        </div>
        <div
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            color: tc.emphasize ? 'var(--danger-base)' : 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
          }"
        >
          {{ tc.value }}
        </div>
        <div :style="{ height: '3px', borderRadius: '9999px', background: barColor }" />
      </div>
    </div>

    <!-- Detalhes expandidos -->
    <div v-if="expanded" class="flex flex-col" style="gap: 10px; padding-top: 4px">
      <div v-for="row in detailRows" :key="row.label" class="flex items-center justify-between" style="gap: 12px">
        <span
          style="
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            flex-shrink: 0;
          "
        >
          {{ row.label }}
        </span>
        <span
          style="
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
            color: var(--text-strong);
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ row.value || '—' }}
        </span>
      </div>
    </div>

    <!-- Toggle Mais/Menos detalhes -->
    <button
      class="flex items-center justify-center"
      style="
        gap: 6px;
        margin-top: 2px;
        padding: 6px 0;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: var(--weight-semibold);
      "
      @click="toggleExpanded"
    >
      <template v-if="expanded"><ChevronUp :size="14" /> Menos detalhes</template>
      <template v-else><ChevronDown :size="14" /> Mais detalhes</template>
    </button>
  </div>
</template>
