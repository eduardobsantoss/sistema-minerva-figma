<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import {
  ArrowLeft, Users, UserCog, FileText, Landmark, TrendingUp, Shield, History,
} from 'lucide-vue-next';
import { brl, type Cra, type GrupoEmpresarialVinculo } from '../data/craData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import CedentesTab from './grupo-detail/CedentesTab.vue';
import PartesRelacionadasTab from './grupo-detail/PartesRelacionadasTab.vue';
import DocumentosTab from './grupo-detail/DocumentosTab.vue';
import ContaBancariaTab from './grupo-detail/ContaBancariaTab.vue';
import FaturamentoTab from './grupo-detail/FaturamentoTab.vue';
import GarantiasTab from './grupo-detail/GarantiasTab.vue';
import HistoricoTab from './grupo-detail/HistoricoTab.vue';

const props = defineProps<{ cra: Cra; grupo: GrupoEmpresarialVinculo }>();
const emit = defineEmits<{ back: []; update: [GrupoEmpresarialVinculo] }>();

type Tab = 'cedentes' | 'partes' | 'documentos' | 'conta' | 'faturamento' | 'garantias' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'partes', label: 'Partes Relacionadas', icon: UserCog },
  { key: 'documentos', label: 'Documentos', icon: FileText },
  { key: 'conta', label: 'Conta Bancária', icon: Landmark },
  { key: 'faturamento', label: 'Faturamento', icon: TrendingUp },
  { key: 'garantias', label: 'Garantias', icon: Shield },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('cedentes');
const localGrupo = ref<GrupoEmpresarialVinculo>({ ...props.grupo });

watch(
  () => props.grupo,
  (g) => {
    localGrupo.value = { ...g };
  },
  { deep: true },
);

const kpis = [
  { label: 'Limite', key: 'limite' as const, money: true },
  { label: 'Risco tomado', key: 'riscoTomado' as const, money: true },
  { label: 'Faturamento', key: 'faturamento' as const, money: true },
  { label: 'Data cadastro', key: 'dataCadastro' as const, money: false },
];
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
          CRA · Grupo Empresarial
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ localGrupo.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Gerente: {{ localGrupo.gerente ?? '—' }} · {{ cra.nome }}
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.key"
        style="padding: 20px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
      >
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
          {{ k.label }}
        </div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ k.money ? brl(localGrupo[k.key] as number) : localGrupo[k.key] }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <CedentesTab v-if="tab === 'cedentes'" :cedentes="localGrupo.cedentes" />
    <PartesRelacionadasTab v-else-if="tab === 'partes'" :partes="localGrupo.partesRelacionadas" />
    <DocumentosTab v-else-if="tab === 'documentos'" :documentos="localGrupo.documentos" />
    <ContaBancariaTab v-else-if="tab === 'conta'" :contas="localGrupo.contas" />
    <FaturamentoTab v-else-if="tab === 'faturamento'" :faturamentos="localGrupo.faturamentos" />
    <GarantiasTab v-else-if="tab === 'garantias'" :garantias="localGrupo.garantias" />
    <HistoricoTab v-else :eventos="localGrupo.historico" />
  </div>
</template>
