<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { type BankBalanceInput, type CaixaAccount } from '../../data/passivoNovoData';

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
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Caixas
        </h3>
        <button type="button" aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Data</span>
          <input v-model="dateIso" type="date" :style="fieldStyle" />
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

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
        <button type="button" style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="emit('close')">
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
          @click="submit"
        >
          Salvar caixas
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>
