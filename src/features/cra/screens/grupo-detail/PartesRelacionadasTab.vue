<script setup lang="ts">
import type { GrupoParteRelacionada } from '../../data/craData';

defineProps<{ partes: GrupoParteRelacionada[] }>();

const COLS = '1fr 1.2fr 1fr';
</script>

<template>
  <div
    v-if="!partes.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhuma parte relacionada cadastrada.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Documento</div>
      <div>Nome</div>
      <div>Tipos</div>
    </div>
    <div
      v-for="p in partes"
      :key="p.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ p.documento }}</div>
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
      <div style="color: var(--text-muted)">{{ p.tipos }}</div>
    </div>
  </div>
</template>
