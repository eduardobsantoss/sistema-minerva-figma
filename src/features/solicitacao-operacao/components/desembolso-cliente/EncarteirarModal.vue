<script setup lang="ts">
import { computed, ref } from 'vue';
import { Paperclip } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { brl } from '../../data/operacaoData';
import type { EncarteirarPayload } from '../../data/desembolsoClienteData';
import { formatCurrencyInput, parseCurrencyInput } from '../../utils/currencyMask';

const props = defineProps<{
  solicitacaoId: string;
  cedente: string;
  valorOperacao: number;
}>();

const emit = defineEmits<{ close: []; confirm: [payload: EncarteirarPayload] }>();

const comprovante = ref('');
const dataDesembolso = ref('');
const valor = ref(formatCurrencyInput(String(Math.round(props.valorOperacao * 100))));
const fileRef = ref<HTMLInputElement | null>(null);

const valorNumero = computed(() => parseCurrencyInput(valor.value));
const canConfirm = computed(
  () => comprovante.value.trim().length > 0 && dataDesembolso.value !== '' && valorNumero.value > 0,
);

function onValor(event: Event) {
  valor.value = formatCurrencyInput((event.target as HTMLInputElement).value);
}

function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  comprovante.value = file?.name ?? '';
}

function confirmar() {
  if (!canConfirm.value) return;
  emit('confirm', {
    comprovante: comprovante.value,
    dataDesembolso: dataDesembolso.value,
    valorDesembolsado: valorNumero.value,
  });
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Solicitação · Desembolso do Cliente"
    title="Encarteirar"
    :subtitle="`${solicitacaoId} · ${cedente}`"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 16px">
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
        Anexe o comprovante de pagamento e informe a data e o valor desembolsados para concluir o pedido.
      </p>

      <div>
        <div class="field-label">Comprovante de pagamento <span class="req">*</span></div>
        <div class="flex items-center" style="gap: 12px">
          <AdminButton variant="secondary" :icon="Paperclip" @click="fileRef?.click()">
            Selecionar arquivo
          </AdminButton>
          <span
            style="font-size: var(--text-sm); color: var(--text-default); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            {{ comprovante || 'Nenhum arquivo selecionado' }}
          </span>
        </div>
        <input
          ref="fileRef"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          class="file-input"
          @change="onFile"
        />
      </div>

      <div>
        <div class="field-label">Data de desembolso <span class="req">*</span></div>
        <AdminDateField v-model="dataDesembolso" />
      </div>

      <div>
        <div class="field-label">Valor desembolsado <span class="req">*</span></div>
        <input
          :value="valor"
          inputmode="decimal"
          class="valor-input"
          @input="onValor"
        />
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
          Valor da operação: {{ brl(valorOperacao) }}
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canConfirm" @click="confirmar">Encarteirar</AdminButton>
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
.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
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
</style>
