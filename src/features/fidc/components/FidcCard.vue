<script setup lang="ts">
import { ref, computed } from 'vue';
import { Wallet, Clock } from 'lucide-vue-next';
import { brl, type Fidc } from '../data/fidcsData';
import ShortKPI from './fidc-card/ShortKPI.vue';

const props = defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{ open: [id: string] }>();

const hover = ref(false);

const catColor = computed(() =>
  props.fidc.category === 'MONOCLASSE'
    ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
    : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
);
</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '16px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', fidc.id)"
  >
    <!-- Topo: FIDC tag + CNPJ + status -->
    <div class="flex items-center justify-between">
      <div class="flex items-center" style="gap: 10px">
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            background: var(--gci-light);
            color: var(--gci-base);
          "
        >
          FIDC
        </span>
        <span style="font-size: var(--text-xs); color: var(--text-muted)">
          {{ fidc.cnpj }}
        </span>
      </div>
      <span
        class="flex items-center"
        style="
          gap: 6px;
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--success-dark);
          background: var(--success-light);
          padding: 4px 10px;
          border-radius: 9999px;
        "
      >
        <span
          style="
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: var(--success-base);
            animation: pulse 2s ease-in-out infinite;
          "
        />
        EM ANDAMENTO
      </span>
    </div>

    <!-- Nome -->
    <div
      style="
        font-size: var(--text-md);
        font-weight: var(--weight-bold);
        color: var(--text-strong);
        line-height: 1.3;
        letter-spacing: -0.01em;
        min-height: 42px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      "
    >
      {{ fidc.name }}
    </div>

    <!-- Categoria tag -->
    <div>
      <span
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          background: catColor.bg,
          color: catColor.fg,
        }"
      >
        {{ fidc.category }}
      </span>
    </div>

    <!-- Carteira vs Vencido -->
    <div
      class="grid"
      style="
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 12px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <div>
        <div
          class="flex items-center"
          style="
            gap: 6px;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          <Wallet :size="12" /> Carteira
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ brl(fidc.carteira.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px">
          Títulos: <strong style="color: var(--text-default)">{{ fidc.carteira.titulos }}</strong>
        </div>
      </div>
      <div style="text-align: right">
        <div
          class="flex items-center"
          style="
            gap: 6px;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 4px;
            justify-content: flex-end;
          "
        >
          <Clock :size="12" /> Vencido
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--danger-base);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ brl(fidc.vencido.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px">
          Títulos:
          <strong style="color: var(--danger-base)">{{ fidc.vencido.titulos }}</strong>
        </div>
      </div>
    </div>

    <!-- Indicadores curto prazo -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 4px">
      <ShortKPI label="Venc. Hoje" :value="brl(fidc.vencendoHoje)" />
      <ShortKPI label="Venc. Mês" :value="brl(fidc.vencendoMes)" />
      <ShortKPI label="Confirmação" :value="brl(0)">
        <template #trailing>
          <span
            style="
              font-size: 10px;
              color: var(--success-base);
              font-weight: var(--weight-bold);
              margin-left: 4px;
            "
          >
            {{ fidc.confirmacaoPct.toString().replace('.', ',') }}%
          </span>
        </template>
      </ShortKPI>
    </div>
  </div>
</template>
