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
const showValorHero = computed(
  () => props.ativo.tipo === 'NP' || !!props.ativo.minuta?.confina,
);
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
      <div v-if="!showValorHero" style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: -0.02em">
          {{ brl(ativo.valorTotal) }}
        </div>
      </div>
    </div>

    <div
      v-if="showValorHero"
      class="relative overflow-hidden flex items-center"
      style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 28px 32px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8,60,74,0.40)"
    >
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(ativo.valorTotal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Tipo: {{ ativo.tipo }} · Emissão: {{ ativo.emissao || '—' }} · Vencimento: {{ ativo.vencimento || '—' }}
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
