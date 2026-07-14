<script setup lang="ts">
import type { Cota } from '../../data/passivoData';
import { TONE_RISCO } from '../../data/passivoData';

defineProps<{ cota: Cota }>();
const emit = defineEmits<{ open: [] }>();
</script>

<template>
  <div
    class="cota-card flex flex-col"
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow var(--duration-base), border-color var(--duration-base);
      height: 100%;
    "
    @click="emit('open')"
  >
    <div style="padding: 20px 20px 16px">
      <div class="flex justify-between items-start" style="margin-bottom: 16px">
        <div>
          <div class="flex items-center" style="gap: 8px; margin-bottom: 8px">
            <span
              :style="{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: '#fff',
                background: cota.cor,
              }"
            >
              {{ cota.siglaBadge }}
            </span>
            <span
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.10em;
              "
            >
              {{ cota.sigla }}
            </span>
          </div>
          <h4
            class="cota-title"
            style="
              font-size: var(--text-lg);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              letter-spacing: -0.01em;
              transition: color var(--duration-base);
            "
          >
            {{ cota.nome }}
          </h4>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: TONE_RISCO[cota.nivelRisco].bg,
            color: TONE_RISCO[cota.nivelRisco].fg,
          }"
        >
          {{ cota.nivelRisco }}
        </span>
      </div>

      <div
        style="
          background: var(--surface-sunken);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
        "
      >
        <p
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.14em;
            margin-bottom: 12px;
          "
        >
          Tabela de Precificação
        </p>
        <div class="flex flex-col" style="gap: 8px">
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU Base</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ cota.puBase.toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU × 100</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ (cota.puBase * 100).toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU × 1.000</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ (cota.puBase * 1000).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: auto; padding: 16px 20px 20px; border-top: 1px solid var(--border-default)">
      <div class="flex justify-between items-end" style="margin-bottom: 12px">
        <div>
          <p style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px">
            Rentabilidade
          </p>
          <p style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--gci-base); line-height: 1.1">
            +{{ cota.rentabilidade }}%
            <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)">a.a.</span>
          </p>
        </div>
        <div style="text-align: right">
          <p style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px">
            % do PL
          </p>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ cota.percentualPL }}%</span>
        </div>
      </div>
      <div style="width: 100%; height: 6px; background: var(--neutral-200); border-radius: 9999px; overflow: hidden">
        <div
          :style="{
            width: `${cota.percentualPL}%`,
            height: '100%',
            background: cota.cor,
            borderRadius: '9999px',
          }"
        />
      </div>
      <p style="font-size: 10px; color: var(--text-muted); margin-top: 10px">{{ cota.tipoRemuneracao }}</p>
    </div>
  </div>
</template>

<style scoped>
.cota-card:hover {
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--gci-base) 25%, var(--border-default));
}
.cota-card:hover .cota-title {
  color: var(--gci-base);
}
</style>
