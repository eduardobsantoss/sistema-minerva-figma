<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Fidc, Sacado } from '../../data/fidcsData';
import TitlesTable from '../../components/TitlesTable.vue';
import TituloAcoesLote from '@/components/titulos/TituloAcoesLote.vue';
import type { TituloSelecionado } from '@/components/titulos/types';

const props = defineProps<{ fidc: Fidc; sacado: Sacado }>();
const selectedIds = ref<string[]>([]);

const filteredTitles = computed(() =>
  props.fidc.classes
    .flatMap((c) => c.titulos)
    .filter((t) => t.sacadoCnpj === props.sacado.documento),
);

const classMap = computed(() =>
  Object.fromEntries(props.fidc.classes.map((c) => [c.id, c.name.split(' ').pop()?.slice(0, 6).toUpperCase() ?? c.id])),
);

const selecionados = computed<TituloSelecionado[]>(() =>
  filteredTitles.value
    .filter((t) => selectedIds.value.includes(t.id))
    .map((t) => ({
      id: t.id,
      lastro: t.lastro,
      numero: t.numero,
      valor: t.vrNominal,
      valorAberto: null,
      vencimento: t.vencimento,
    })),
);

watch(filteredTitles, (rows) => {
  const ids = new Set(rows.map((t) => t.id));
  selectedIds.value = selectedIds.value.filter((id) => ids.has(id));
});
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
    <TitlesTable v-if="filteredTitles.length" v-model:selected-ids="selectedIds" selectable :rows="filteredTitles" :class-map="classMap" />
    <div v-else style="padding: 48px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum título vinculado a este sacado na carteira.
    </div>
  </div>
  <TituloAcoesLote v-if="selecionados.length" :titulos="selecionados" />
</template>
