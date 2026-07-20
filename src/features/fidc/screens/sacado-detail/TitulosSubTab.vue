<script setup lang="ts">
import { computed } from 'vue';
import type { Fidc, Sacado } from '../../data/fidcsData';
import TitlesTable from '../../components/TitlesTable.vue';

const props = defineProps<{ fidc: Fidc; sacado: Sacado }>();

const filteredTitles = computed(() =>
  props.fidc.classes
    .flatMap((c) => c.titulos)
    .filter((t) => t.sacadoCnpj === props.sacado.documento),
);

const classMap = computed(() =>
  Object.fromEntries(props.fidc.classes.map((c) => [c.id, c.name.split(' ').pop()?.slice(0, 6).toUpperCase() ?? c.id])),
);
</script>

<template>
  <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default); overflow: hidden">
    <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Títulos do sacado
      </div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ filteredTitles.length }} título(s) vinculados
      </div>
    </div>
    <TitlesTable v-if="filteredTitles.length" :rows="filteredTitles" :class-map="classMap" />
    <div v-else style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum título vinculado a este sacado na carteira.
    </div>
  </div>
</template>
