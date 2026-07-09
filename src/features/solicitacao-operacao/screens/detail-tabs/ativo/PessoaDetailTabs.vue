<script setup lang="ts">
import { computed, ref } from 'vue';
import type { AtivoPessoa } from '../../../data/ativoData';
import type { EventoHistorico } from '../../../data/operacaoData';
import DadosSubTab from './pessoa/DadosSubTab.vue';
import ContatosSubTab from './pessoa/ContatosSubTab.vue';
import EnderecosSubTab from './pessoa/EnderecosSubTab.vue';
import HistoricoSubTab from './pessoa/HistoricoSubTab.vue';

const props = defineProps<{
  pessoa: AtivoPessoa;
  titulo: string;
  historico?: EventoHistorico[];
}>();

const tabs = computed(() => {
  const base = ['Dados', 'Contatos', 'Endereços'] as const;
  return props.historico ? ([...base, 'Histórico'] as const) : base;
});
type SubTab = 'Dados' | 'Contatos' | 'Endereços' | 'Histórico';
const tab = ref<SubTab>('Dados');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in tabs"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
        @click="tab = t as SubTab"
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DadosSubTab v-if="tab === 'Dados'" :pessoa="pessoa" :titulo="titulo" />
      <ContatosSubTab v-else-if="tab === 'Contatos'" :pessoa="pessoa" />
      <EnderecosSubTab v-else-if="tab === 'Endereços'" :pessoa="pessoa" />
      <HistoricoSubTab v-else-if="historico" :historico="historico" />
    </div>
  </div>
</template>
