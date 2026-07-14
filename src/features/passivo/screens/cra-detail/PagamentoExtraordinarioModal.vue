<script setup lang="ts">
import { ref } from 'vue';
import { X, AlertTriangle } from 'lucide-vue-next';

const emit = defineEmits<{ close: []; confirm: [] }>();

const dataPagamento = ref('');
const puJuros = ref('');
const valorAmortizacao = ref('');
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: var(--z-modal);
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
      <div
        class="flex items-center justify-between"
        style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)"
      >
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); text-transform: uppercase; letter-spacing: -0.01em">
          Novo Pagamento Extraordinário
        </h3>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            Data do Pagamento
          </label>
          <input
            v-model="dataPagamento"
            type="date"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            PU de Juros
          </label>
          <input
            v-model="puJuros"
            type="text"
            placeholder="0.00000"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            Valor de Amortização
          </label>
          <input
            v-model="valorAmortizacao"
            type="text"
            placeholder="R$ 0,00"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div
          class="flex items-start"
          style="
            gap: 10px;
            padding: 14px 16px;
            background: var(--status-danger-bg);
            border: 1px solid color-mix(in srgb, var(--danger-base) 20%, transparent);
            border-radius: var(--radius-lg);
            color: var(--status-danger-text);
          "
        >
          <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.4">
            Atenção: Esta é uma operação extraordinária fora do cronograma original. O status ficará pendente de validação pela custódia.
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-end"
        style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)"
      >
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
          "
          @click="emit('confirm')"
        >
          REGISTRAR OPERAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
