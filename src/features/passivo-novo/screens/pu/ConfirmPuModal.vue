<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { pu, isoToBr } from '../../data/passivoNovoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
const shownDate = computed(() => {
  const iso = props.mode === 'validar' ? selectedIso.value : props.dateIso;
  return iso.includes('-') ? isoToBr(iso) : '—';
});

const title = props.mode === 'validar' ? 'Validar PU programado' : 'Atualizar PU D-1';
const confirmLabel = props.mode === 'validar' ? 'Confirmar e notificar AF' : 'Confirmar atualização';
const copy =
  props.mode === 'validar'
    ? 'Ao validar o PU, o Agente Fiduciário será notificado com os valores para liquidação conforme o cronograma (protótipo — sem e-mail real).'
    : 'Recalcula o PU da série na data-base D-1 com a curva disponível (protótipo — sem recálculo real de DI).';
</script>

<template>
  <Teleport to="body">
  <AdminModal size="sm" eyebrow="Passivo" :title="title" @close="emit('close')">
    <div class="flex flex-col" style="gap: 20px">
      <label v-if="mode === 'validar'" class="flex flex-col" style="gap: 8px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
          Data do PU
        </span>
        <AdminDateField v-model="selectedIso" />
      </label>
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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('confirm')" type="button">{{ confirmLabel }}</AdminButton>
    </template>
  </AdminModal>
  </Teleport>
</template>

<style scoped>
.date-input {
  height: 40px;
  width: 100%;
  padding: 0 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  color: var(--text-strong);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  outline: none;
}
.date-input:focus {
  border-color: var(--gci-base);
}
</style>
