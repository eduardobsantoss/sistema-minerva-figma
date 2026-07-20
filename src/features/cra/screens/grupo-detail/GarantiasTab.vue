<script setup lang="ts">
import { brl, type GrupoGarantia } from '../../data/craData';

defineProps<{ garantias: GrupoGarantia[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.8fr 0.6fr 0.6fr';
</script>

<template>
  <div
    v-if="!garantias.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhuma garantia cadastrada.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Tipo</div>
      <div>Início</div>
      <div>Fim</div>
      <div>Valor</div>
      <div>Cobertura</div>
      <div>Status</div>
    </div>
    <div
      v-for="g in garantias"
      :key="g.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ g.dataInicio }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ g.dataFim }}</div>
      <div style="font-variant-numeric: tabular-nums">{{ brl(g.valor) }}</div>
      <div style="color: var(--text-muted)">{{ g.cobertura }}</div>
      <div>
        <span style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: 9999px; background: var(--status-success-bg); color: var(--status-success-text)">{{ g.status }}</span>
      </div>
    </div>
  </div>
</template>
