<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileText,
  Paperclip,
  CreditCard,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  BadgeCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next';
import {
  brl,
  statusTituloColor,
  statusTituloLabel,
  type TituloAtivoGlobal,
} from '../data/ativosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './titulo-detail/DetailsTab.vue';
import AnexosTab from './titulo-detail/AnexosTab.vue';
import AccrualTab from './titulo-detail/AccrualTab.vue';
import PagamentosTab from './titulo-detail/PagamentosTab.vue';
import ConfirmacoesTab from './titulo-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './titulo-detail/MovimentacoesTab.vue';
import HistoricoTab from './titulo-detail/HistoricoTab.vue';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'anexos' as const, label: 'Anexos', icon: Paperclip },
  { key: 'accrual' as const, label: 'Accrual', icon: TrendingUp },
  { key: 'pagamentos' as const, label: 'Pagamentos', icon: CreditCard },
  { key: 'confirmacoes' as const, label: 'Confirmações', icon: BadgeCheck },
  { key: 'movimentacoes' as const, label: 'Movimentações', icon: ArrowLeftRight },
  { key: 'historico' as const, label: 'Histórico', icon: Activity },
];

const tab = ref<Tab>('detalhes');
const statusColor = computed(() => statusTituloColor(props.titulo.statusTitulo));

const StatusIcon = computed<Component>(() => {
  if (props.titulo.statusTitulo === 'LIQUIDADO') return CheckCircle2;
  if (props.titulo.statusTitulo === 'VENCIDO') return AlertTriangle;
  return Clock;
});
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
          Ativos · Título
        </div>
        <h2
          class="flex items-center"
          style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap"
        >
          #{{ titulo.numero }}
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 9px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base); border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent)">
            Lastro {{ titulo.lastro }}
          </span>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusTituloLabel(titulo.statusTitulo).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ titulo.veiculoNome }} · {{ titulo.contratoNumero }} · {{ titulo.gerente }}
        </p>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 28px 32px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4); gap: 24px; flex-wrap: wrap"
    >
      <div style="position: absolute; top: -100px; right: -100px; width: 320px; height: 320px; border-radius: 9999px; background: rgba(255, 255, 255, 0.04)" />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Nominal do Título
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(titulo.valorNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Tipo: {{ titulo.tipoAtivo }} · Emissão: {{ titulo.dataEmissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
      <div
        class="flex flex-col"
        style="position: relative; z-index: 1; gap: 8px; padding: 16px 20px; border-radius: var(--radius-lg); background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); min-width: 160px"
      >
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55)">
          Valor em Aberto
        </div>
        <div style="font-size: var(--text-xl); font-weight: 700; font-variant-numeric: tabular-nums">
          {{ brl(titulo.valorAberto) }}
        </div>
        <div class="flex items-center" style="gap: 6px; font-size: var(--text-xs); color: rgba(255, 255, 255, 0.7)">
          <component :is="StatusIcon" :size="13" />
          {{ statusTituloLabel(titulo.statusTitulo) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <DetailsTab v-if="tab === 'detalhes'" :titulo="titulo" />
      <AnexosTab v-else-if="tab === 'anexos'" :titulo="titulo" />
      <AccrualTab v-else-if="tab === 'accrual'" :titulo="titulo" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" :titulo="titulo" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :titulo="titulo" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :titulo="titulo" />
      <HistoricoTab v-else-if="tab === 'historico'" :titulo="titulo" />
    </div>
  </div>
</template>
