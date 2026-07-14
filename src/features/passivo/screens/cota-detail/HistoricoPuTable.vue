<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';
import { HISTORICO_PU } from '../../data/passivoData';

const cols = '0.9fr 0.8fr 1fr 0.7fr 0.5fr 1.1fr 0.8fr';
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
      class="flex items-center justify-between"
      style="padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div class="flex items-center" style="gap: 16px">
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
          <TrendingUp :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Histórico de PU
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
            {{ HISTORICO_PU.length }} registros diários
          </div>
        </div>
      </div>
      <button
        type="button"
        style="
          background: none;
          border: none;
          cursor: pointer;
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--text-link);
        "
      >
        Ver Gráfico Completo
      </button>
    </div>

    <div style="max-height: 400px; overflow-y: auto">
      <div
        class="grid sticky top-0"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-default)',
          zIndex: 1,
        }"
      >
        <div>Data</div>
        <div>Taxa DI</div>
        <div>Fator DI Acum</div>
        <div>Spread</div>
        <div>DU</div>
        <div>PU Atualizado</div>
        <div>Juros</div>
      </div>

      <div
        v-for="h in HISTORICO_PU"
        :key="h.id"
        class="pu-row grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.data }}</div>
        <div style="color: var(--text-muted)">{{ h.taxaDI }}%</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.fatorDIAcum }}</div>
        <div style="color: var(--text-muted)">{{ h.spread }}%</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.du }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--gci-base); font-variant-numeric: tabular-nums">
          {{ h.puAtualizado.toFixed(2) }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ h.juros.toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pu-row:hover {
  background: var(--surface-sunken);
}
</style>
