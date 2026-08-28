<script setup lang="ts">
import { Calendar } from 'lucide-vue-next';
import { useCardHover } from '@/composables/useCardHover';
import { brl, pu, type Veiculo } from '../data/passivoNovoData';

defineProps<{ veiculo: Veiculo }>();
const emit = defineEmits<{ open: [] }>();

const { hover, onMouseenter, onMouseleave } = useCardHover();
</script>

<template>
  <button
    type="button"
    class="veiculo-card flex flex-col"
    :style="{
      width: '100%',
      textAlign: 'left',
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'color-mix(in srgb, var(--gci-base) 25%, var(--border-default))' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: hover ? 'var(--shadow-md)' : 'none',
      transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      transition: 'box-shadow var(--duration-base), border-color var(--duration-base), transform var(--duration-base) var(--ease-standard)',
    }"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @click="emit('open')"
  >
    <div style="padding: 18px 18px 14px">
      <div class="flex items-start justify-between" style="gap: 10px; margin-bottom: 12px">
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 8px; margin-bottom: 8px">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.12em',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: veiculo.tipo === 'CRA' ? 'var(--gci-light)' : 'var(--agro-light)',
                color: veiculo.tipo === 'CRA' ? 'var(--gci-base)' : 'var(--agro-base)',
              }"
            >
              {{ veiculo.tipo }}
            </span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.10em;
                text-transform: uppercase;
                color: var(--success-dark);
                background: var(--success-light);
                padding: 4px 8px;
                border-radius: 9999px;
              "
            >
              {{ veiculo.status }}
            </span>
          </div>
          <h4
            :style="{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-bold)',
              color: hover ? 'var(--gci-base)' : 'var(--text-strong)',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              transition: 'color var(--duration-base)',
            }"
          >
            {{ veiculo.nome }}
          </h4>
        </div>
      </div>

      <div class="flex items-center" style="gap: 6px; color: var(--text-muted); margin-bottom: 14px">
        <Calendar :size="12" />
        <span style="font-size: 11px; font-weight: var(--weight-semibold)">
          Base D-1 · {{ veiculo.dataBase }}
        </span>
      </div>

      <div
        class="grid"
        style="grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 12px"
      >
        <div>
          <p style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Funding
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(veiculo.funding, true) }}
          </p>
        </div>
        <div>
          <p style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            PU Sênior
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ pu(veiculo.puSenior, 4) }}
          </p>
        </div>
        <div>
          <p style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Caixa
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(veiculo.caixa, true) }}
          </p>
        </div>
      </div>
    </div>
  </button>
</template>
