<script setup lang="ts">
import { ref } from 'vue';
import type { ContratoAtivo } from '../../../data/operacaoData';
import DetalhesTituloTab from './titulo/DetalhesTituloTab.vue';
import AnexosTituloTab from './titulo/AnexosTituloTab.vue';
import PagamentosTituloTab from './titulo/PagamentosTituloTab.vue';
import ConfirmacoesTituloTab from './titulo/ConfirmacoesTituloTab.vue';
import ObservacoesCobrancaTab from './titulo/ObservacoesCobrancaTab.vue';
import MovimentacoesTituloTab from './titulo/MovimentacoesTituloTab.vue';

defineProps<{ ativo: ContratoAtivo }>();

const SUB_TABS = [
  'Detalhes do Título',
  'Anexos',
  'Pagamentos',
  'Confirmações',
  'Observações de Cobrança',
  'Movimentações',
] as const;
type SubTab = (typeof SUB_TABS)[number];
const tab = ref<SubTab>('Detalhes do Título');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in SUB_TABS"
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
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetalhesTituloTab v-if="tab === 'Detalhes do Título'" :ativo="ativo" />
      <AnexosTituloTab v-else-if="tab === 'Anexos'" :ativo="ativo" />
      <PagamentosTituloTab v-else-if="tab === 'Pagamentos'" :ativo="ativo" />
      <ConfirmacoesTituloTab v-else-if="tab === 'Confirmações'" :ativo="ativo" />
      <ObservacoesCobrancaTab v-else-if="tab === 'Observações de Cobrança'" :ativo="ativo" />
      <MovimentacoesTituloTab v-else :ativo="ativo" />
    </div>
  </div>
</template>
