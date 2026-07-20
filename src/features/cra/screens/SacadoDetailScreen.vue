<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import { ArrowLeft, FileText, User, History } from 'lucide-vue-next';
import type { Cra, Sacado } from '../data/craData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TitulosSubTab from './sacado-detail/TitulosSubTab.vue';
import DadosTab from './sacado-detail/DadosTab.vue';
import HistoricoTab from './sacado-detail/HistoricoTab.vue';

const props = defineProps<{ cra: Cra; sacado: Sacado }>();
const emit = defineEmits<{ back: []; update: [Sacado] }>();

type Tab = 'titulos' | 'dados' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'titulos', label: 'Títulos', icon: FileText },
  { key: 'dados', label: 'Dados', icon: User },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<Tab>('titulos');
const localSacado = ref<Sacado>({ ...props.sacado });

watch(
  () => props.sacado,
  (s) => {
    localSacado.value = { ...s };
  },
  { deep: true },
);

function onUpdate(s: Sacado) {
  localSacado.value = s;
  emit('update', s);
}
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
          CRA · Sacado
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ localSacado.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ localSacado.documento }} · {{ cra.nome }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as Tab"
    />

    <TitulosSubTab v-if="tab === 'titulos'" :cra="cra" :sacado="localSacado" />
    <DadosTab v-else-if="tab === 'dados'" :sacado="localSacado" @update="onUpdate" />
    <HistoricoTab v-else :eventos="localSacado.historico" />
  </div>
</template>
