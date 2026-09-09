<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import {
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  FileWarning,
  ShieldAlert,
  Layers,
  PieChart,
  ArrowLeftRight,
  Landmark,
  Users,
  AlertTriangle,
} from 'lucide-vue-next';
import KpiStripCard from '../../../components/KpiStripCard.vue';
import { brl, num } from '../../../data/passivoNovoData';
import { carteiraPctOfVp, type CarteiraSliceKey } from '../../../data/carteiraData';
import type { LaminaBundle } from '../../../data/laminaData';
import type { Veiculo } from '../../../data/passivoNovoData';
import PosicaoConcentracaoView from './carteira/PosicaoConcentracaoView.vue';
import AgingVencimentosView from './carteira/AgingVencimentosView.vue';
import PmtsVencidasView from './carteira/PmtsVencidasView.vue';
import PddEstresseView from './carteira/PddEstresseView.vue';
import WaterfallPddView from './carteira/WaterfallPddView.vue';
import AberturaPddView from './carteira/AberturaPddView.vue';
import MovimentacaoDiaView from './carteira/MovimentacaoDiaView.vue';

const props = defineProps<{ veiculo: Veiculo; lamina: LaminaBundle }>();

const selected = ref<CarteiraSliceKey | null>(null);
const hoveredKey = ref<CarteiraSliceKey | null>(null);

watch(
  () => props.veiculo.id,
  () => {
    selected.value = null;
  },
);

const carteira = computed(() => props.lamina.carteira);

const hubKpis = computed(() => [
  {
    label: 'Valor presente',
    value: brl(carteira.value.valorPresente, true),
    icon: Landmark,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Cedentes / sacados',
    value: `${num(carteira.value.cedentes, 0)} / ${num(carteira.value.sacados, 0)}`,
    icon: Users,
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
  {
    label: 'PDD total',
    value: brl(carteira.value.pddTotal, true),
    hint: carteiraPctOfVp(carteira.value.pddTotal, carteira.value.valorPresente),
    icon: ShieldAlert,
    tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  },
  {
    label: 'VP vencido',
    value: brl(carteira.value.vpVencido, true),
    hint: carteiraPctOfVp(carteira.value.vpVencido, carteira.value.valorPresente),
    icon: AlertTriangle,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
]);

interface SliceCard {
  key: CarteiraSliceKey;
  title: string;
  description: string;
  icon: Component;
}

const SLICES: SliceCard[] = [
  {
    key: 'posicao',
    title: 'Posição e concentração',
    description: 'VN, VP, pré/pós e Top 10 de cedentes e sacados.',
    icon: Briefcase,
  },
  {
    key: 'aging',
    title: 'Aging e vencimentos',
    description: 'Faixas de prazo, maiores vencimentos em 30 dias e cedentes vencidos.',
    icon: Calendar,
  },
  {
    key: 'pmts',
    title: 'PMTs vencidas',
    description: 'Títulos com parcelas em atraso, lastro, cedente e valor.',
    icon: FileWarning,
  },
  {
    key: 'pdd-estresse',
    title: 'PDD e estresse',
    description: 'Provisão, VP vencido, mudanças de faixa e série diária de PDD.',
    icon: ShieldAlert,
  },
  {
    key: 'waterfall',
    title: 'Projeção waterfall',
    description: 'PDD projetado e rolagens vencidas / a vencer nas próximas janelas.',
    icon: Layers,
  },
  {
    key: 'abertura-pdd',
    title: 'Abertura de PDD',
    description: 'Maiores PDDs por sacado e cedente, aging list e abertura.',
    icon: PieChart,
  },
  {
    key: 'movimentacao',
    title: 'Movimentação do dia',
    description: 'Aquisições e liquidações do dia, com abertura por cedente.',
    icon: ArrowLeftRight,
  },
];

const current = computed(() => SLICES.find((s) => s.key === selected.value) ?? null);
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in hubKpis" :key="kpi.label" v-bind="kpi" />
    </div>
    <div>
      <p style="font-size: var(--text-sm); color: var(--text-muted)">
        Abertura detalhada da carteira. Selecione um recorte para ver tabelas e gráficos.
      </p>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="slice in SLICES"
        :key="slice.key"
        class="flex flex-col"
        type="button"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === slice.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === slice.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === slice.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selected = slice.key"
        @mouseenter="hoveredKey = slice.key"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          style="width: 42px; height: 42px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)"
        >
          <component :is="slice.icon" :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
            {{ slice.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ slice.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === slice.key ? 1 : 0,
            transform: hoveredKey === slice.key ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Abrir recorte <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Carteira
        </div>
        <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ current?.title }}
        </h3>
      </div>
    </div>

    <PosicaoConcentracaoView v-if="selected === 'posicao'" :carteira="carteira" />
    <AgingVencimentosView v-else-if="selected === 'aging'" :carteira="carteira" />
    <PmtsVencidasView v-else-if="selected === 'pmts'" :carteira="carteira" />
    <PddEstresseView v-else-if="selected === 'pdd-estresse'" :carteira="carteira" />
    <WaterfallPddView v-else-if="selected === 'waterfall'" :carteira="carteira" />
    <AberturaPddView v-else-if="selected === 'abertura-pdd'" :carteira="carteira" />
    <MovimentacaoDiaView v-else-if="selected === 'movimentacao'" :carteira="carteira" />
  </div>
</template>
