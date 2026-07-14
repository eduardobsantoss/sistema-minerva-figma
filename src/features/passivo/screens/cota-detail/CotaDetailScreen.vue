<script setup lang="ts">
import { ArrowLeft, TrendingUp } from 'lucide-vue-next';
import type { Cota, CraComposicao } from '../../data/passivoData';
import { TONE_RISCO } from '../../data/passivoData';
import ValuationCard from './ValuationCard.vue';
import HistoricoPuTable from './HistoricoPuTable.vue';
import CronogramaTimeline from './CronogramaTimeline.vue';
import CrasTable from './CrasTable.vue';

defineProps<{ cota: Cota }>();
const emit = defineEmits<{
  back: [];
  openCra: [cra: CraComposicao];
}>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header — padrão CRA detail -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Passivo · Cota {{ cota.sigla }}
        </div>
        <div class="flex items-center" style="gap: 10px">
          <h2
            style="
              font-size: var(--text-xl);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              letter-spacing: -0.01em;
              line-height: 1.2;
            "
          >
            {{ cota.nome }}
          </h2>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: TONE_RISCO[cota.nivelRisco].bg,
              color: TONE_RISCO[cota.nivelRisco].fg,
            }"
          >
            {{ cota.nivelRisco }}
          </span>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ cota.tipoRemuneracao }} · Rentabilidade +{{ cota.rentabilidade }}% a.a. · {{ cota.percentualPL }}% do PL
        </p>
      </div>
    </div>

    <!-- Hero gci — padrão CraHero -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
      "
    >
      <div
        style="
          position: absolute;
          top: -80px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          PU Base da Cota
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          R$ {{ cota.puBase.toFixed(2) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          PU × 100: R$ {{ (cota.puBase * 100).toFixed(2) }} · PU × 1.000: R$ {{ (cota.puBase * 1000).toFixed(2) }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          position: relative;
          z-index: 1;
        "
      >
        <TrendingUp :size="26" />
      </div>
    </div>

    <!-- Valorização recente -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <ValuationCard date="D-1 (Ontem)" value="+0.042%" absolute="+R$ 42.503,12" trend="up" />
      <ValuationCard date="D-2 (22/05)" value="+0.038%" absolute="+R$ 38.291,05" trend="up" />
      <ValuationCard date="D-3 (21/05)" value="+0.041%" absolute="+R$ 41.109,88" trend="up" />
    </div>

    <HistoricoPuTable />
    <CronogramaTimeline />
    <CrasTable @open-cra="emit('openCra', $event)" />
  </div>
</template>
