<script setup lang="ts">
import { computed } from 'vue';
import type { Cra, Sacado } from '../../data/craData';
import TitulosTable from '../cra-detail/TitulosTable.vue';

const props = defineProps<{ cra: Cra; sacado: Sacado }>();

const filteredTitulos = computed(() =>
  props.cra.operacoes.flatMap((o) => o.titulos).filter(
    (t) =>
      t.sacadoCnpj === props.sacado.documento ||
      t.sacado.toLowerCase() === props.sacado.nome.toLowerCase(),
  ),
);

const classMap = computed(() =>
  Object.fromEntries(props.cra.operacoes.map((o, i) => [o.id, String(i + 1)])),
);
</script>

<template>
  <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Títulos do sacado
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ filteredTitulos.length }} título(s) vinculados
      </div>
    </div>
    <TitulosTable :rows="filteredTitulos" :class-map="classMap" />
  </div>
</template>
