<script setup lang="ts">
import { computed } from 'vue';
import { brl, type CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const rows = computed(() => [
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 3)) },
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 2)) },
  { data: props.titulo.vencimento, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((props.titulo.vrNominal * 0.0185) / 252) },
]);
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style="text-align: right">Acumulado</div>
      </div>
      <div
        v-for="(r, i) in rows"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-variant-numeric: tabular-nums"
      >
        <div style="color: var(--text-muted)">{{ r.data }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.taxa }}</div>
        <div style="color: var(--text-muted)">{{ r.base }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.accrual }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right">{{ r.acumulado }}</div>
      </div>
    </div>
  </Section>
</template>
