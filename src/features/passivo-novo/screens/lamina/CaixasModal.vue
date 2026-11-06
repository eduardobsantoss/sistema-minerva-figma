<script setup lang="ts">
import { computed, ref } from 'vue';

import { type BankBalanceInput, type CaixaAccount } from '../../data/passivoNovoData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{
  defaultDateIso: string;
  accounts: CaixaAccount[];
}>();
const emit = defineEmits<{ close: []; confirm: [input: BankBalanceInput] }>();

function accountValue(label: string) {
  return props.accounts.find((a) => a.label === label)?.value ?? 0;
}

const dateIso = ref(props.defaultDateIso);
const currentAccount = ref(String(accountValue('Conta corrente')));
const investments = ref(String(accountValue('Conta investimentos')));
const sweep = ref(String(accountValue('Fundo de zeragem')));

const canSave = computed(() => Boolean(dateIso.value));

function submit() {
  if (!canSave.value) return;
  emit('confirm', {
    date: dateIso.value,
    currentAccountBalance: Number(currentAccount.value) || 0,
    investmentsBalance: Number(investments.value) || 0,
    sweepFundBalance: Number(sweep.value) || 0,
  });
}

const fieldStyle =
  'width: 100%; height: 40px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)';
</script>

<template>
  <Teleport to="body">
  <AdminModal size="sm" eyebrow="Passivo" title="Caixas" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Data</span>
        <AdminDateField v-model="dateIso" />
      </label>
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Conta corrente</span>
        <input v-model="currentAccount" type="number" step="0.01" :style="fieldStyle" />
      </label>
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Conta investimentos</span>
        <input v-model="investments" type="number" step="0.01" :style="fieldStyle" />
      </label>
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Fundo de zeragem</span>
        <input v-model="sweep" type="number" step="0.01" :style="fieldStyle" />
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="submit" type="button">Salvar caixas</AdminButton>
    </template>
  </AdminModal>
  </Teleport>
</template>
