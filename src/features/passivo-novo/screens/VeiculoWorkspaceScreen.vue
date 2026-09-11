<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowLeft, FileText, TrendingUp, Calculator, FileDown } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useToast } from '@/composables/useToast';
import {
  applyPuEvent,
  type CreatePuEventInput,
  type PuEventType,
  type Veiculo,
} from '../data/passivoNovoData';
import LaminaTab from './lamina/LaminaTab.vue';
import ValidarPuTab from './pu/ValidarPuTab.vue';
import SimularEventoTab from './eventos/SimularEventoTab.vue';
import PuActionMenu from './pu/PuActionMenu.vue';
import CreatePuEventModal from './pu/CreatePuEventModal.vue';

const props = defineProps<{ veiculo: Veiculo }>();
const emit = defineEmits<{ back: [] }>();
const { success, error } = useToast();

const tab = ref('lamina');
const serieId = ref(props.veiculo.series[0]?.id ?? '');
const eventType = ref<PuEventType | null>(null);

const TABS = [
  { key: 'lamina', label: 'Lâmina', icon: FileText },
  { key: 'pu', label: 'Validar PU', icon: TrendingUp },
  { key: 'eventos', label: 'Simular evento', icon: Calculator },
];

const statusColor = computed(() =>
  props.veiculo.status === 'Em andamento' ? 'var(--success-base)' : 'var(--text-muted)',
);

const activeSerie = computed(
  () => props.veiculo.series.find((s) => s.id === serieId.value) ?? props.veiculo.series[0],
);

watch(
  () => props.veiculo.id,
  () => {
    serieId.value = props.veiculo.series[0]?.id ?? '';
    eventType.value = null;
  },
);

function confirmEvent(input: CreatePuEventInput) {
  const serie = activeSerie.value;
  if (!serie) return;
  const msg = applyPuEvent(props.veiculo, serie.id, input);
  if (msg) {
    error(msg);
    return;
  }
  eventType.value = null;
  success('Evento lançado (protótipo).');
}
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

      <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
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
          "
          @click="success('PDF da lâmina gerado (protótipo).')"
        >
          <FileDown :size="16" />
          GERAR PDF
        </button>
        <PuActionMenu v-if="tab === 'pu'" @select="eventType = $event" />
      </div>
    </div>

    <SegmentedToggle v-model="tab" :options="TABS" variant="brand" />

    <LaminaTab v-if="tab === 'lamina'" :veiculo="veiculo" />
    <ValidarPuTab v-else-if="tab === 'pu'" v-model:serie-id="serieId" :veiculo="veiculo" />
    <SimularEventoTab v-else :veiculo="veiculo" />

    <CreatePuEventModal
      v-if="eventType && activeSerie"
      :type="eventType"
      :serie="activeSerie"
      :default-date-iso="veiculo.dataBaseIso"
      @close="eventType = null"
      @confirm="confirmEvent"
    />
  </div>
</template>
