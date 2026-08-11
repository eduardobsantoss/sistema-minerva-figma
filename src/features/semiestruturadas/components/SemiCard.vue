<script setup lang="ts">
import { ref } from 'vue';
import { TrendingUp, Wallet, Layers } from 'lucide-vue-next';
import { brl, type SemiOperacao, type TipoOperacaoSemi } from '../data/semiestruturadasData';
import DonutRing from './semi-card/DonutRing.vue';

defineProps<{ operacao: SemiOperacao }>();
const emit = defineEmits<{ open: [id: string] }>();

const hover = ref(false);

const tipoTone: Record<TipoOperacaoSemi, { bg: string; fg: string }> = {
  NC: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  CPRF: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  CPR: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  CCB: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  CDCA: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  CDA: { bg: '#EEF0FF', fg: '#4F46E5' },
};
</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '14px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', operacao.id)"
  >
    <div class="flex items-start justify-between" style="gap: 8px">
      <div style="flex: 1; min-width: 0">
        <div class="flex items-center" style="gap: 8px; margin-bottom: 6px">
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: tipoTone[operacao.tipo].bg,
              color: tipoTone[operacao.tipo].fg,
            }"
          >
            {{ operacao.tipo }}
          </span>
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.25;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ operacao.nome }}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.4">
          {{ operacao.cedente }} · {{ operacao.cedenteCnpj }}
        </div>
      </div>
      <span
        class="flex items-center"
        style="
          gap: 5px;
          flex-shrink: 0;
          margin-top: 4px;
          white-space: nowrap;
          font-size: 9px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--success-dark);
          background: var(--success-light);
          padding: 5px 10px;
          border-radius: 9999px;
        "
      >
        <TrendingUp :size="10" :stroke-width="2.5" />
        {{ operacao.status }}
      </span>
    </div>

    <div
      class="grid"
      style="grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
    >
      <div>
        <div
          class="flex items-center"
          style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px"
        >
          <Wallet :size="11" /> Valor da Operação
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(operacao.valorNominal) }}
        </div>
      </div>
      <div style="text-align: right">
        <div
          class="flex items-center"
          style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; justify-content: flex-end"
        >
          <Layers :size="11" /> Valor da Composição
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(operacao.valorComposicao) }}
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 2px">
      <div class="flex items-center" style="gap: 10px">
        <DonutRing
          :pct="operacao.garantiasDuplicatas.pct"
          color="var(--gci-base)"
          track-color="var(--gci-light)"
        />
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--gci-base); letter-spacing: 0.04em; margin-bottom: 3px">
            Garantias Duplicatas
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(operacao.garantiasDuplicatas.valor) }}
          </div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 10px; justify-content: flex-end; flex-direction: row">
        <DonutRing
          :pct="operacao.demaisGarantias.pct"
          color="var(--agro-base)"
          track-color="var(--agro-light)"
        />
        <div style="text-align: right">
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--agro-base); letter-spacing: 0.04em; margin-bottom: 3px">
            Demais Garantias
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(operacao.demaisGarantias.valor) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
