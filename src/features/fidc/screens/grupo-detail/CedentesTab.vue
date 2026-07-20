<script setup lang="ts">
import type { GrupoCedente } from '../../data/fidcsData';

defineProps<{ cedentes: GrupoCedente[] }>();

const COLS = '1fr 1.2fr 1fr 0.8fr 0.5fr';
</script>

<template>
  <div v-if="!cedentes.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhum cedente vinculado a este grupo.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Documento</div>
      <div>Nome</div>
      <div>Email</div>
      <div>Cidade-UF</div>
      <div>Tipo</div>
    </div>
    <div v-for="c in cedentes" :key="c.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
      <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ c.documento }}</div>
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
      <div style="color: var(--text-muted)">{{ c.email ?? '—' }}</div>
      <div style="color: var(--text-muted)">{{ c.cidadeUf ?? '—' }}</div>
      <div>
        <span style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">{{ c.tipo }}</span>
      </div>
    </div>
  </div>
</template>
