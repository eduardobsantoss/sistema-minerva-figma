<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import { ArrowLeft, Info, FileText, History } from 'lucide-vue-next';
import { brl, type ContratoAtivoGlobal, type TituloAtivoGlobal } from '../data/ativosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetalhesTab from './contrato-detail/DetalhesTab.vue';
import TitulosTab from './contrato-detail/TitulosTab.vue';
import HistoricoTab from './contrato-detail/HistoricoTab.vue';

const props = defineProps<{ contrato: ContratoAtivoGlobal; titulos: TituloAtivoGlobal[] }>();
const emit = defineEmits<{ back: []; openTitulo: [id: string] }>();

type Tab = 'detalhes' | 'titulos' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'detalhes', label: 'Detalhes', icon: Info },
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('detalhes');

const titulosContrato = computed(() =>
  props.titulos.filter((t) => t.contratoId === props.contrato.id),
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
          Ativos · Contrato
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ contrato.numero }}
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; padding: 4px 9px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            {{ contrato.tipoAtivo }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ contrato.veiculoNome }} · {{ contrato.qtdParcelas }} parcela(s) · {{ contrato.grupoEmpresarial }}
        </p>
      </div>

      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor Nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(contrato.valorNominal) }}
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
      <DetalhesTab v-if="tab === 'detalhes'" :contrato="contrato" />
      <TitulosTab v-else-if="tab === 'titulos'" :titulos="titulosContrato" @open-titulo="emit('openTitulo', $event)" />
      <HistoricoTab v-else-if="tab === 'historico'" :contrato="contrato" :titulos="titulosContrato" />
    </div>
  </div>
</template>
