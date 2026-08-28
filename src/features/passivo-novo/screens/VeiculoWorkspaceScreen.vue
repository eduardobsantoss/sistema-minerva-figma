<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, FileText, TrendingUp, Calculator, FileDown } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useToast } from '@/composables/useToast';
import type { Veiculo } from '../data/passivoNovoData';
import LaminaTab from './lamina/LaminaTab.vue';
import ValidarPuTab from './pu/ValidarPuTab.vue';
import SimularEventoTab from './eventos/SimularEventoTab.vue';

const props = defineProps<{ veiculo: Veiculo }>();
const emit = defineEmits<{ back: [] }>();
const { success } = useToast();

const tab = ref('lamina');

const TABS = [
  { key: 'lamina', label: 'Lâmina', icon: FileText },
  { key: 'pu', label: 'Validar PU', icon: TrendingUp },
  { key: 'eventos', label: 'Simular evento', icon: Calculator },
];

const statusColor = computed(() =>
  props.veiculo.status === 'Em andamento' ? 'var(--success-base)' : 'var(--text-muted)',
);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
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
          Passivo · {{ veiculo.tipo }}
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
          {{ veiculo.nome }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ veiculo.status.toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ veiculo.cessionaria }} · Base D-1 {{ veiculo.dataBase }} · Vencimento {{ veiculo.vencimento }}
        </p>
      </div>

      <button
        v-if="tab === 'lamina'"
        type="button"
        class="flex items-center btn-animated btn-primary"
        style="
          gap: 8px;
          height: 44px;
          padding: 0 20px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          box-shadow: 0 10px 24px -10px rgba(8, 60, 74, 0.45);
          flex-shrink: 0;
        "
        @click="success('PDF da lâmina gerado (protótipo).')"
      >
        <FileDown :size="16" />
        GERAR PDF
      </button>
    </div>

    <SegmentedToggle v-model="tab" :options="TABS" variant="brand" />

    <LaminaTab v-if="tab === 'lamina'" :veiculo="veiculo" />
    <ValidarPuTab v-else-if="tab === 'pu'" :veiculo="veiculo" />
    <SimularEventoTab v-else :veiculo="veiculo" />
  </div>
</template>
