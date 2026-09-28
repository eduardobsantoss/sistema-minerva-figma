<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { pu, isoToBr } from '../../data/passivoNovoData';

export interface ValidarDateOption {
  iso: string;
  label: string;
  pu: number;
  payment?: boolean;
}

const props = defineProps<{
  mode: 'validar' | 'atualizar';
  puValue: number;
  dateIso: string;
  serieNome: string;
  dates?: ValidarDateOption[];
}>();
const emit = defineEmits<{ close: []; confirm: [] }>();

const selectedIso = ref(props.dateIso);

watch(
  () => props.dateIso,
  (iso) => {
    selectedIso.value = iso;
  },
);

const selectedDate = computed(() => props.dates?.find((d) => d.iso === selectedIso.value));
const shownPu = computed(() =>
  props.mode === 'validar' && selectedDate.value ? selectedDate.value.pu : props.puValue,
);
const shownDate = computed(() =>
  props.mode === 'validar' && selectedDate.value ? selectedDate.value.label : isoToBr(props.dateIso),
);

const title = props.mode === 'validar' ? 'Validar PU programado' : 'Atualizar PU D-1';
const confirmLabel = props.mode === 'validar' ? 'Confirmar e notificar AF' : 'Confirmar atualização';
const copy =
  props.mode === 'validar'
    ? 'Ao validar o PU, o Agente Fiduciário será notificado com os valores para liquidação conforme o cronograma (protótipo — sem e-mail real).'
    : 'Recalcula o PU da série na data-base D-1 com a curva disponível (protótipo — sem recálculo real de DI).';
</script>

<template>
  <Teleport to="body">
  <div
    class="minerva-modal-overlay"
    style="
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 560px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); text-transform: uppercase; letter-spacing: -0.01em">
          {{ title }}
        </h3>
        <button
          type="button"
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 20px">
        <div v-if="mode === 'validar' && dates?.length" class="flex flex-col" style="gap: 8px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
            Data do PU
          </span>
          <div class="flex" style="gap: 8px; flex-wrap: wrap">
            <button
              v-for="d in dates"
              :key="d.iso"
              type="button"
              :style="{
                height: '32px',
                padding: '0 12px',
                borderRadius: '9999px',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'var(--weight-bold)',
                background: selectedIso === d.iso ? 'var(--gci-base)' : 'var(--surface-card)',
                color: selectedIso === d.iso ? '#fff' : 'var(--text-strong)',
              }"
              @click="selectedIso = d.iso"
            >
              {{ d.label }}<span v-if="d.payment"> · Pgto</span>
            </button>
          </div>
        </div>
        <div
          style="
            background: var(--gci-light);
            border: 1px solid var(--gci-subtle);
            border-radius: var(--radius-lg);
            padding: 20px;
          "
        >
          <div class="flex justify-between items-center" style="margin-bottom: 12px">
            <p
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                color: var(--gci-base);
                text-transform: uppercase;
                letter-spacing: 0.12em;
                opacity: 0.7;
              "
            >
              {{ serieNome }} · {{ shownDate }}
            </p>
          </div>
          <h3
            style="
              font-size: var(--text-3xl);
              font-weight: var(--weight-bold);
              color: var(--gci-base);
              font-variant-numeric: tabular-nums;
              line-height: 1.1;
            "
          >
            {{ pu(shownPu, 5) }}
          </h3>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-relaxed); font-weight: var(--weight-medium)">
          {{ copy }}
        </p>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
            text-transform: uppercase;
          "
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>
