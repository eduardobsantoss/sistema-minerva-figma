<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import {
  puEventLabel,
  puEventUsesAmount,
  puEventUsesQuantity,
  type CreatePuEventInput,
  type PuEventType,
  type Serie,
} from '../../data/passivoNovoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{
  type: PuEventType;
  serie: Serie;
  defaultDateIso: string;
}>();
const emit = defineEmits<{ close: []; confirm: [input: CreatePuEventInput] }>();

const dateIso = ref(props.defaultDateIso);
const quantity = ref('');
const amount = ref('');
const payAll = ref(false);

watch(
  () => props.type,
  () => {
    quantity.value = '';
    amount.value = '';
    payAll.value = false;
  },
);

const showQuantity = computed(() => puEventUsesQuantity(props.type));
const showAmount = computed(() => puEventUsesAmount(props.type) && !(props.type === 'interest' && payAll.value));
const showPayAll = computed(() => props.type === 'interest');

const canSave = computed(() => {
  if (!dateIso.value) return false;
  if (showQuantity.value) return Number(quantity.value) > 0;
  if (props.type === 'interest' && payAll.value) return true;
  if (showAmount.value) return Number(amount.value) > 0;
  return false;
});

function submit() {
  if (!canSave.value) return;
  const input: CreatePuEventInput = {
    type: props.type,
    date: dateIso.value,
    payAllAccruedInterest: props.type === 'interest' ? payAll.value : false,
  };
  if (showQuantity.value) input.quantity = Number(quantity.value);
  if (showAmount.value) input.amount = Number(amount.value);
  emit('confirm', input);
}

const fieldStyle =
  'width: 100%; height: 40px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)';
</script>

<template>
  <Teleport to="body">
  <AdminModal size="sm" eyebrow="Passivo" :title="puEventLabel(type)" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <p style="font-size: var(--text-sm); color: var(--text-muted)">
        Série: <strong style="color: var(--text-strong)">{{ serie.nome }}</strong>
      </p>
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Tipo</span>
        <input :value="puEventLabel(type)" type="text" disabled :style="fieldStyle + '; opacity: 0.7'" />
      </label>
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Data</span>
        <AdminDateField v-model="dateIso" />
      </label>
      <label v-if="showQuantity" class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Quantidade de cotas</span>
        <input v-model="quantity" type="number" min="1" step="1" placeholder="Ex.: 360000" :style="fieldStyle" />
      </label>
      <label v-if="showPayAll" class="flex items-center" style="gap: 10px; cursor: pointer">
        <input v-model="payAll" type="checkbox" />
        <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
          Pagar 100% dos juros do dia
        </span>
      </label>
      <label v-if="showAmount" class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Valor (R$)</span>
        <input v-model="amount" type="number" min="0.01" step="0.01" placeholder="0,00" :style="fieldStyle" />
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSave" @click="submit" type="button">Lançar evento</AdminButton>
    </template>
  </AdminModal>
  </Teleport>
</template>
