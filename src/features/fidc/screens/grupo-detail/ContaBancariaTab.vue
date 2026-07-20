<script setup lang="ts">
import type { GrupoContaBancaria } from '../../data/fidcsData';

defineProps<{ contas: GrupoContaBancaria[] }>();

const COLS = '1fr 0.7fr 0.7fr 0.5fr';
</script>

<template>
  <div v-if="!contas.length" style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
    Nenhuma conta bancária cadastrada.
  </div>
  <div v-else style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div class="grid" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }">
      <div>Banco</div>
      <div>Agência</div>
      <div>Conta</div>
      <div>Principal</div>
    </div>
    <div v-for="c in contas" :key="c.id" class="grid items-center" :style="{ gridTemplateColumns: COLS, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }">
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.banco }}</div>
      <div style="color: var(--text-muted)">{{ c.agencia }}</div>
      <div style="color: var(--text-muted)">{{ c.conta }}</div>
      <div>
        <span v-if="c.principal" style="font-size: 9px; font-weight: var(--weight-bold); padding: 4px 8px; border-radius: 9999px; background: var(--status-success-bg); color: var(--status-success-text)">Principal</span>
        <span v-else style="color: var(--text-muted)">—</span>
      </div>
    </div>
  </div>
</template>
