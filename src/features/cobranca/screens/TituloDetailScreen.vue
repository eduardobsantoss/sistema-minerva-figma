<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  BellRing,
  Receipt,
  Handshake,
  BadgeCheck,
  Paperclip,
  CreditCard,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next';
import {
  brl,
  statusPagamentoColor,
  statusPagamentoLabel,
  type Titulo,
} from '../data/titulosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './titulo-detail/DetailsTab.vue';
import AnexosTab from './titulo-detail/AnexosTab.vue';
import AccrualTab from './titulo-detail/AccrualTab.vue';
import PagamentosTab from './titulo-detail/PagamentosTab.vue';
import ConfirmacoesTab from './titulo-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './titulo-detail/MovimentacoesTab.vue';
import HistoricoTab from './titulo-detail/HistoricoTab.vue';

const props = defineProps<{ titulo: Titulo }>();
const emit = defineEmits<{
  back: [];
  gerarBoleto: [id: string];
  notificar: [id: string];
  confirmar: [id: string];
  negociar: [id: string];
}>();

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
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusPagamentoColor(props.titulo.statusPagamento));

const StatusIcon = computed<Component>(() => {
  if (props.titulo.statusPagamento === 'LIQUIDADO') return CheckCircle2;
  if (props.titulo.statusPagamento === 'VENCIDO') return AlertTriangle;
  return Clock;
});

const actions = [
  {
    label: 'Gerar Boleto',
    icon: Receipt,
    onClick: () => emit('gerarBoleto', props.titulo.id),
  },
  {
    label: 'Confirmar Ativo',
    icon: BadgeCheck,
    onClick: () => emit('confirmar', props.titulo.id),
  },
  {
    label: 'Notificar Ativo',
    icon: BellRing,
    onClick: () => emit('notificar', props.titulo.id),
  },
  {
    label: 'Sinalizar Negociação',
    icon: Handshake,
    onClick: () => emit('negociar', props.titulo.id),
  },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Cobrança · Título
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          #{{ titulo.numero }}
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 4px 9px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
              border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent);
            "
          >
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
            {{ statusPagamentoLabel(titulo.statusPagamento).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ titulo.veiculoNome }} · {{ titulo.veiculoTipo }}
          <template v-if="titulo.classeOuOperacao"> · {{ titulo.classeOuOperacao }}</template>
          · {{ titulo.gerente }}
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-strong);
          "
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 220px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center detalle-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="handleActionClick(a)"
          >
            <component :is="a.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Value hero -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        gap: 24px;
        flex-wrap: wrap;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          Valor Nominal do Título
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          {{ brl(titulo.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Tipo: {{ titulo.tipo }} · Emissão: {{ titulo.emissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
      <div
        class="flex flex-col"
        style="
          position: relative;
          z-index: 1;
          gap: 8px;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          min-width: 160px;
        "
      >
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55)">
          Valor em Aberto
        </div>
        <div style="font-size: var(--text-xl); font-weight: 700; font-variant-numeric: tabular-nums">
          {{ brl(titulo.vrAberto) }}
        </div>
        <div
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-xs); color: rgba(255, 255, 255, 0.7)"
        >
          <component :is="StatusIcon" :size="13" />
          {{ titulo.diasAtraso > 0 ? `${titulo.diasAtraso} dias em atraso` : 'Sem atraso' }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
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

<style scoped>
.detalle-action-item:hover {
  background: var(--surface-sunken);
}
</style>
