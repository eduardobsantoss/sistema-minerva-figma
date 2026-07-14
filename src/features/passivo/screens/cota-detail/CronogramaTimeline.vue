<script setup lang="ts">
import { History } from 'lucide-vue-next';
import { CRONOGRAMA } from '../../data/passivoData';
import StepIndicator from './StepIndicator.vue';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex items-center"
      style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
          color: var(--gci-base);
        "
      >
        <History :size="20" />
      </div>
      <div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Cronograma Completo da Cota
        </div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 4px;
          "
        >
          Etapas de liquidação
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 28px; padding: 24px">
      <div
        v-for="cron in CRONOGRAMA"
        :key="cron.id"
        class="flex flex-col lg:flex-row lg:items-center"
        style="gap: 24px"
      >
        <div style="min-width: 180px">
          <p
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.14em;
              margin-bottom: 4px;
            "
          >
            {{ cron.data }}
          </p>
          <h5 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ cron.evento }}
          </h5>
        </div>
        <div class="flex items-center justify-between" style="flex: 1; gap: 8px">
          <StepIndicator label="Validação PU" :status="cron.statusEtapa.validacaoPU" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Envio Comunicado" :status="cron.statusEtapa.envioComunicado" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Confirmação B3" :status="cron.statusEtapa.confirmacaoB3" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Banco Liquidante" :status="cron.statusEtapa.bancoLiquidante" />
        </div>
      </div>
    </div>
  </div>
</template>
