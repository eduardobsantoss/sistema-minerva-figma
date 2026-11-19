<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminFormField from '@/components/ui/AdminFormField.vue';
import AdminTextField from '@/components/ui/AdminTextField.vue';
import {
  brl,
  formatDate,
  moneyToInput,
  parcelaSaldo,
  parseMoney,
  todayIso,
  type EstoqueParcela,
} from '../data/estoqueData';

const props = defineProps<{ parcela: EstoqueParcela; imovelNome: string }>();
const emit = defineEmits<{ close: []; confirm: [payload: { valor: number; data: string }] }>();

const saldo = parcelaSaldo(props.parcela);
const valor = ref(moneyToInput(saldo));
const data = ref(todayIso());
const tentou = ref(false);

const valorNum = computed(() => parseMoney(valor.value));
const erroValor = computed(() => {
  if (valorNum.value <= 0) return 'Informe o valor recebido.';
  if (valorNum.value > saldo) return `O valor não pode passar do saldo (${brl(saldo)}).`;
  return '';
});
const erroData = computed(() => (data.value ? '' : 'Informe a data do recebimento.'));
const restante = computed(() => Math.max(0, saldo - valorNum.value));

function confirmar() {
  tentou.value = true;
  if (erroValor.value || erroData.value) return;
  emit('confirm', { valor: valorNum.value, data: data.value });
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Estoque · Baixa manual"
    :title="`Baixar parcela ${parcela.numero}`"
    :subtitle="imovelNome"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 16px">
      <div
        class="grid"
        style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">Vencimento</div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px">{{ formatDate(parcela.vencimento) }}</div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">Valor</div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px; font-variant-numeric: tabular-nums">{{ brl(parcela.valor) }}</div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">Saldo</div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px; font-variant-numeric: tabular-nums">{{ brl(saldo) }}</div>
        </div>
      </div>

      <AdminFormField label="Valor recebido (R$)" :error="tentou ? erroValor : ''" :hint="valorNum > 0 && !erroValor && restante > 0 ? `Baixa parcial: restam ${brl(restante)} em aberto.` : ''">
        <AdminTextField v-model="valor" inputmode="decimal" placeholder="0,00" :invalid="tentou && !!erroValor" />
      </AdminFormField>
      <AdminFormField label="Data do recebimento" :error="tentou ? erroData : ''">
        <AdminDateField v-model="data" :max="todayIso()" />
      </AdminFormField>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" type="button" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" type="button" @click="confirmar">Confirmar baixa</AdminButton>
    </template>
  </AdminModal>
</template>
