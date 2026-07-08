<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';
import { brl, type Cra } from '../../data/craData';

defineProps<{ totalEmissao: number; cra: Cra }>();
</script>

<template>
  <div
    class="relative overflow-hidden flex items-center"
    style="
      background: var(--gci-base);
      border-radius: var(--radius-xl);
      padding: 28px 32px;
      color: #fff;
      box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.40);
    "
  >
    <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
    <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />
    <div style="flex: 1; position: relative; z-index: 1">
      <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
        Valor Total de Emissão
      </div>
      <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
        {{ brl(totalEmissao) }}
      </div>
      <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
        {{ cra.operacoes.length }} {{ cra.operacoes.length === 1 ? 'operação' : 'operações' }} · {{ cra.cessionaria }}
      </div>
    </div>
    <div class="flex items-center justify-center" style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1">
      <TrendingUp :size="26" />
    </div>
  </div>
</template>
