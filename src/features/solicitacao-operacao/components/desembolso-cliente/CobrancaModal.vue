<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { brl } from '../../data/operacaoData';
import { formatCurrencyInput, parseCurrencyInput } from '../../utils/currencyMask';

const props = defineProps<{
  solicitacaoId: string;
  cedente: string;
  valorAquisicao: number;
  /** Vencidos previstos no pedido, usados para pré-preencher o campo. */
  valorVencido: number;
}>();

const emit = defineEmits<{ close: []; confirm: [valor: number] }>();

const valor = ref(formatCurrencyInput(String(Math.round(props.valorVencido * 100))));
const valorNumero = computed(() => parseCurrencyInput(valor.value));
const excede = computed(() => valorNumero.value > props.valorAquisicao);
const aDesembolsar = computed(() => Math.max(props.valorAquisicao - valorNumero.value, 0));
const canConfirm = computed(() => valorNumero.value > 0 && !excede.value);

function onValor(event: Event) {
  valor.value = formatCurrencyInput((event.target as HTMLInputElement).value);
}

function confirmar() {
  if (!canConfirm.value) return;
  emit('confirm', valorNumero.value);
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Solicitação · Desembolso do Cliente"
    title="Cobrança"
    :subtitle="`${solicitacaoId} · ${cedente}`"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 16px">
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
        Informe os valores vencidos do cedente a abater. Eles saem do valor a desembolsar e a Cobrança é avisada por e-mail.
      </p>

      <div>
        <div class="field-label">Vencidos a abater <span class="req">*</span></div>
        <input :value="valor" inputmode="decimal" class="valor-input" @input="onValor" />
        <div v-if="excede" class="erro">O valor não pode ser maior que o valor de aquisição ({{ brl(valorAquisicao) }}).</div>
      </div>

      <div class="resumo">
        <div class="linha">
          <span>Valor de aquisição</span>
          <span>{{ brl(valorAquisicao) }}</span>
        </div>
        <div class="linha">
          <span>Vencidos a abater</span>
          <span>− {{ brl(excede ? 0 : valorNumero) }}</span>
        </div>
        <div class="linha linha--total">
          <span>Valor a desembolsar</span>
          <span>{{ brl(aDesembolsar) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm" @click="confirmar">Enviar para abater</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.req {
  color: var(--danger-base);
}
.valor-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.valor-input:focus {
  box-shadow: var(--focus-ring);
}
.erro {
  margin-top: 4px;
  font-size: var(--text-xs);
  color: var(--danger-base);
}
.resumo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
}
.linha {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: var(--text-sm);
  color: var(--text-default);
  font-variant-numeric: tabular-nums;
}
.linha--total {
  padding-top: 8px;
  border-top: 1px solid var(--border-default);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
</style>
