<script setup lang="ts">
import { ref, type Component } from 'vue';
import {
  ArrowLeft,
  Users,
  Link2,
  FileText,
  Landmark,
  TrendingUp,
  Shield,
  History,
  Wallet,
  AlertTriangle,
  Calendar,
} from 'lucide-vue-next';
import { brl, type Fidc, type GrupoEmpresarialVinculo } from '../data/fidcsData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import CedentesTab from './grupo-detail/CedentesTab.vue';
import PartesRelacionadasTab from './grupo-detail/PartesRelacionadasTab.vue';
import DocumentosTab from './grupo-detail/DocumentosTab.vue';
import ContaBancariaTab from './grupo-detail/ContaBancariaTab.vue';
import FaturamentoTab from './grupo-detail/FaturamentoTab.vue';
import GarantiasTab from './grupo-detail/GarantiasTab.vue';
import HistoricoTab from './grupo-detail/HistoricoTab.vue';

defineProps<{ fidc: Fidc; grupo: GrupoEmpresarialVinculo }>();
const emit = defineEmits<{ back: [] }>();

type Tab = 'cedentes' | 'partes' | 'documentos' | 'conta' | 'faturamento' | 'garantias' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'partes', label: 'Partes Relacionadas', icon: Link2 },
  { key: 'documentos', label: 'Documentos', icon: FileText },
  { key: 'conta', label: 'Conta Bancária', icon: Landmark },
  { key: 'faturamento', label: 'Faturamento', icon: TrendingUp },
  { key: 'garantias', label: 'Garantias', icon: Shield },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('cedentes');
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          FIDC · Grupo Empresarial
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ grupo.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ fidc.name }} · {{ grupo.statusOperacao }} · {{ grupo.apto ? 'Apto' : 'Inapto' }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <Wallet :size="18" style="color: var(--gci-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Limite</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.limite) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <AlertTriangle :size="18" style="color: var(--warning-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Risco tomado</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.riscoTomado) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <TrendingUp :size="18" style="color: var(--success-base)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Faturamento</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(grupo.faturamento) }}</div>
      </div>
      <div style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 8px">
          <Calendar :size="18" style="color: var(--text-muted)" />
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">Data cadastro</span>
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold)">{{ grupo.dataCadastro }}</div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <CedentesTab v-if="tab === 'cedentes'" :cedentes="grupo.cedentes" />
    <PartesRelacionadasTab v-else-if="tab === 'partes'" :partes="grupo.partesRelacionadas" />
    <DocumentosTab v-else-if="tab === 'documentos'" :documentos="grupo.documentos" />
    <ContaBancariaTab v-else-if="tab === 'conta'" :contas="grupo.contas" />
    <FaturamentoTab v-else-if="tab === 'faturamento'" :faturamentos="grupo.faturamentos" />
    <GarantiasTab v-else-if="tab === 'garantias'" :garantias="grupo.garantias" />
    <HistoricoTab v-else :eventos="grupo.historico" />
  </div>
</template>
