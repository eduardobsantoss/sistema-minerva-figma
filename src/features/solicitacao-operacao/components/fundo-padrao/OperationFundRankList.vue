<script setup lang="ts">
import {
  type RankItemAtivo,
  formatMoney,
  progressPct,
  progressColor,
} from '../../data/fundoPadraoData';

defineProps<{ items: RankItemAtivo[] }>();

function typeChipStyle(type: RankItemAtivo['fundType']) {
  if (type === 'CRA') {
    return { background: 'var(--agro-light, rgba(242,125,38,0.12))', color: 'var(--agro-base)' };
  }
  return { background: 'var(--gci-light)', color: 'var(--gci-base)' };
}
</script>

<template>
  <div
    v-if="items.length === 0"
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <div style="font-size: var(--text-sm); color: var(--text-muted)">
      Nenhum rank de fundos ativo configurado.
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 12px">
    <article
      v-for="item in items"
      :key="`${item.priority}-${item.fundId}`"
      class="flex flex-col"
      :style="{
        padding: '18px 20px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        borderLeft: item.isCurrent ? '4px solid #16a34a' : '1px solid var(--border-default)',
        opacity: item.isExhausted ? 0.72 : 1,
        gap: '12px',
        transition: 'opacity var(--duration-fast)',
      }"
    >
      <div class="flex flex-wrap items-center justify-between" style="gap: 10px">
        <div class="flex flex-wrap items-center" style="gap: 8px">
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 4px 10px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            #{{ item.priority }}
          </span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ item.fundName }}
          </span>
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
            "
            :style="typeChipStyle(item.fundType)"
          >
            {{ item.fundType }}
          </span>
          <span
            v-if="item.isCurrent"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: rgba(22, 163, 74, 0.12);
              color: #16a34a;
            "
          >
            Atual
          </span>
          <span
            v-if="item.isExhausted"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            Esgotado
          </span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); text-align: right">
          Configurado por {{ item.configuradoPor }} · {{ item.dataConfiguracao }}
        </div>
      </div>

      <div class="flex flex-wrap items-end justify-between" style="gap: 16px">
        <div class="flex flex-wrap" style="gap: 24px">
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Operado
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.operado) }}
            </div>
          </div>
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Limite
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.limite) }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 6px; gap: 8px">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Utilização</span>
          <span
            style="font-size: var(--text-xs); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums"
            :style="{ color: progressColor(progressPct(item.operado, item.limite)) }"
          >
            {{ progressPct(item.operado, item.limite) }}%
          </span>
        </div>
        <div
          style="
            height: 8px;
            border-radius: 9999px;
            background: var(--surface-sunken);
            overflow: hidden;
          "
        >
          <div
            :style="{
              width: `${progressPct(item.operado, item.limite)}%`,
              height: '100%',
              borderRadius: '9999px',
              background: progressColor(progressPct(item.operado, item.limite)),
              transition: 'width var(--duration-normal)',
            }"
          />
        </div>
      </div>
    </article>
  </div>
</template>
