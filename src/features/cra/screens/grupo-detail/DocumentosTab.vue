<script setup lang="ts">
import type { GrupoDocumento } from '../../data/craData';

defineProps<{ documentos: GrupoDocumento[] }>();

const COLS = '1.2fr 0.8fr 0.7fr';
</script>

<template>
  <div
    v-if="!documentos.length"
    style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
  >
    Nenhum documento cadastrado.
  </div>
  <div
    v-else
    style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden"
  >
    <div
      class="grid"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
    >
      <div>Nome</div>
      <div>Tipo</div>
      <div>Data</div>
    </div>
    <div
      v-for="d in documentos"
      :key="d.id"
      class="grid items-center"
      :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ d.nome }}</div>
      <div style="color: var(--text-muted)">{{ d.tipo }}</div>
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ d.data }}</div>
    </div>
  </div>
</template>
