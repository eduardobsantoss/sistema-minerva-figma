<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, FileText, User, Building2 } from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, type ContratoAtivo } from '../../../data/operacaoData';
import { TONE_SITUACAO } from '../../../data/ativoData';
import { CopyButton } from '../shared';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TituloTab from './TituloTab.vue';
import PessoaDetailTabs from './PessoaDetailTabs.vue';

const props = defineProps<{
  ativo: ContratoAtivo;
  solicitacaoId: string;
}>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'titulo' | 'cedente' | 'sacado';
const tab = ref<Tab>('titulo');

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'titulo', label: 'Título', icon: FileText },
  { key: 'cedente', label: 'Cedente', icon: Building2 },
  { key: 'sacado', label: 'Sacado', icon: User },
];

const tone = computed(() => TONE_SITUACAO[props.ativo.situacao]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          {{ solicitacaoId }} · Detalhes do Ativo
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; gap: 8px; flex-wrap: wrap">
          Título {{ ativo.numero }}
          <CopyButton :value="ativo.numero" />
          <span
            class="flex items-center"
            :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: tone.bg, color: tone.fg }"
          >
            {{ ativo.situacao }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Lastro {{ ativo.lastro }} · {{ ativo.cedenteNome }} → {{ ativo.sacadoNome }}
        </p>
      </div>
      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: -0.02em">
          {{ brl(ativo.valorTotal) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <TituloTab v-if="tab === 'titulo'" :ativo="ativo" />
    <PessoaDetailTabs v-else-if="tab === 'cedente'" :pessoa="ativo.cedente" titulo="Cedente" />
    <PessoaDetailTabs v-else :pessoa="ativo.sacado" titulo="Sacado" :historico="ativo.historicoTitulo" />
  </div>
</template>
