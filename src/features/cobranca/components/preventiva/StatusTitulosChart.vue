<script setup lang="ts">
import { computed } from 'vue';
import {
  STATUS_PREVENTIVO,
  brl,
  statusPreventivoLabel,
  type StatusPreventivo,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';

const props = withDefaults(
  defineProps<{
    titulos: TituloPreventivo[];
    active?: StatusPreventivo | null;
    selectable?: boolean;
  }>(),
  { active: null, selectable: false },
);

const emit = defineEmits<{ select: [status: StatusPreventivo] }>();

const slices = computed(() => {
  const totals = new Map<StatusPreventivo, { valor: number; titulos: number }>();
  for (const status of STATUS_PREVENTIVO) totals.set(status.key, { valor: 0, titulos: 0 });
  for (const titulo of props.titulos) {
    const row = totals.get(titulo.status)!;
    row.valor += titulo.valor;
    row.titulos += 1;
  }
  const valorTotal = props.titulos.reduce((acc, t) => acc + t.valor, 0);
  return STATUS_PREVENTIVO.map((status) => {
    const row = totals.get(status.key)!;
    return {
      ...status,
      valor: row.valor,
      titulos: row.titulos,
      pct: valorTotal === 0 ? 0 : (row.valor / valorTotal) * 100,
    };
  }).sort((a, b) => {
    if (a.valor === 0 && b.valor === 0) return a.label.localeCompare(b.label, 'pt-BR');
    if (a.valor === 0) return 1;
    if (b.valor === 0) return -1;
    return b.valor - a.valor;
  });
});

const comValor = computed(() => slices.value.filter((s) => s.valor > 0));
const valorTotal = computed(() => props.titulos.reduce((acc, t) => acc + t.valor, 0));
const maxValor = computed(() => Math.max(...comValor.value.map((s) => s.valor), 0));

function barWidth(valor: number): string {
  if (valor <= 0 || maxValor.value === 0) return '0%';
  return `${Math.max((valor / maxValor.value) * 100, 3)}%`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

function onSelect(status: StatusPreventivo) {
  if (props.selectable) emit('select', status);
}
</script>

<template>
  <section class="chart-card">
    <div style="padding: 20px 24px 12px">
      <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Visão geral por título
      </h2>
      <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
        Valor total {{ brl(valorTotal) }} · {{ titulos.length }}
        {{ titulos.length === 1 ? 'título' : 'títulos' }}
      </p>
    </div>

    <div
      v-if="comValor.length === 0"
      style="padding: 12px 24px 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Nenhum título para distribuir.
    </div>

    <div v-else class="bars">
      <button
        v-for="slice in comValor"
        :key="slice.key"
        type="button"
        class="bar-row"
        :disabled="!selectable"
        @click="onSelect(slice.key)"
      >
        <span class="bar-name">{{ statusPreventivoLabel(slice.key) }}</span>
        <span class="bar-track">
          <span class="bar-fill" :style="{ width: barWidth(slice.valor), background: slice.color }" />
        </span>
        <span class="bar-value">{{ brl(slice.valor) }}</span>
      </button>
    </div>

    <footer class="chart-footer">
      <p v-if="selectable" class="hint">Clique em um status para filtrar os sacados.</p>
      <div class="legend">
        <button
          v-for="slice in slices"
          :key="slice.key"
          type="button"
          class="chip"
          :disabled="!selectable"
          :style="{
            borderColor: active === slice.key ? slice.color : 'var(--border-default)',
            background: active === slice.key ? `color-mix(in srgb, ${slice.color} 12%, transparent)` : 'var(--surface-card)',
          }"
          @click="onSelect(slice.key)"
        >
          <span class="dot" :style="{ background: slice.valor > 0 ? slice.color : 'var(--border-strong)' }" />
          <span>{{ statusPreventivoLabel(slice.key) }}</span>
          <span class="chip-meta">{{ slice.titulos }} · {{ fmtPct(slice.pct) }}</span>
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.chart-card {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 24px 16px;
}
.bar-row {
  display: grid;
  grid-template-columns: minmax(140px, 220px) 1fr auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 4px 0;
  background: none;
  border: none;
  text-align: left;
}
.bar-row:not(:disabled) {
  cursor: pointer;
}
.bar-row:not(:disabled):hover .bar-name {
  color: var(--text-strong);
}
.bar-name {
  font-size: var(--text-xs);
  color: var(--text-default);
}
.bar-track {
  height: 10px;
  border-radius: 9999px;
  background: var(--surface-sunken);
  overflow: hidden;
}
.bar-fill {
  display: block;
  height: 100%;
  border-radius: 9999px;
  min-width: 6px;
}
.bar-value {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.chart-footer {
  padding: 14px 24px 18px;
  border-top: 1px solid var(--border-default);
  background: var(--surface-page);
}
.hint {
  margin: 0 0 10px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  font-size: var(--text-xs);
  color: var(--text-default);
  background: var(--surface-card);
}
.chip:not(:disabled) {
  cursor: pointer;
}
.chip:not(:disabled):hover {
  background: var(--surface-sunken);
}
.chip:disabled {
  cursor: default;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.chip-meta {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
@media (max-width: 720px) {
  .bar-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
