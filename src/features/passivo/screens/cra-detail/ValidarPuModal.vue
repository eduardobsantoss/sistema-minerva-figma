<script setup lang="ts">
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: []; confirm: [] }>();
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
          Validar PU Programado
        </h3>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 20px">
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
              PU Calculado para data de pagamento
            </p>
            <span style="font-size: 10px; font-weight: var(--weight-bold); color: var(--gci-base)">28/05/2026</span>
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
            R$ 108,74219
          </h3>
        </div>

        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-relaxed); font-weight: var(--weight-medium)">
          Ao validar o PU, um e-mail de notificação será disparado automaticamente para o AF (Agente Fiduciário) confirmando os valores para liquidação regular conforme cronograma.
        </p>
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
          CONFIRMAR &amp; ENVIAR EMAIL
        </button>
      </div>
    </div>
  </div>
</template>
