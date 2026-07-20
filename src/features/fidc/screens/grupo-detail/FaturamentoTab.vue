<script setup lang="ts">
import { brl, type GrupoFaturamento } from '../../data/fidcsData';

defineProps<{ faturamentos: GrupoFaturamento[] }>();

const COLS = '0.5fr 1fr';
</script>

<template>
  <div v-if="!faturamentos.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhum faturamento registrado.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Ano</div>
      <div>Valor</div>
    </div>
    <div v-for="f in faturamentos" :key="f.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ f.ano }}</div>
      <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(f.valor) }}</div>
    </div>
  </div>
</template>
