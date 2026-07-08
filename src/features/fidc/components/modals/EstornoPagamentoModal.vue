<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import { brl, type PagamentoTitulo } from '../../data/fidcsData';

const props = defineProps<{ pagamento: PagamentoTitulo }>();
const emit = defineEmits<{ close: []; confirm: [justificativa: string] }>();

const justificativa = ref('');
const canConfirm = computed(() => justificativa.value.trim().length > 0);

function handleConfirm() {
  if (canConfirm.value) emit('confirm', justificativa.value.trim());
}
</script>

<template>
  <div class="flex items-center justify-center" style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px">
    <div style="width: 100%; max-width: 460px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 28px">
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px">
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Estornar pagamento de {{ brl(pagamento.valorAmortizacao) }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 18px">
        Esta ação é crítica e não pode ser desfeita. O pagamento de <strong>{{ pagamento.data }}</strong> ({{ pagamento.tipoPagamento }}) será marcado como estornado no histórico do título.
      </p>

      <div style="margin-bottom: 22px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--danger-base); text-transform: uppercase; margin-bottom: 6px">
          * Justificativa do estorno
        </div>
        <textarea
          v-model="justificativa"
          placeholder="Descreva o motivo do estorno..."
          rows="3"
          style="
            width: 100%;
            padding: 10px 14px;
            resize: vertical;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
            font-family: inherit;
          "
        />
      </div>

      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '42px',
            padding: '0 18px',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-sm)',
            background: canConfirm ? 'var(--action-danger-bg)' : 'var(--neutral-200)',
            color: canConfirm ? 'var(--action-danger-text)' : 'var(--text-disabled)',
          }"
          @click="handleConfirm"
        >
          Confirmar estorno
        </button>
      </div>
    </div>
  </div>
</template>
