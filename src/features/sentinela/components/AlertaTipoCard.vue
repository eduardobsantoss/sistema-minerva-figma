<script setup lang="ts">
import { computed } from 'vue';
import { Minus, TrendingDown, TrendingUp } from 'lucide-vue-next';
import { brl, fmtPct } from '@/features/risco/data/riscoData';

const props = defineProps<{
  label: string;
  quantidade: number;
  exposicao: number;
  variacaoPct: number | null;
  active: boolean;
}>();

defineEmits<{ toggle: [] }>();

const delta = computed(() => {
  if (props.variacaoPct == null) {
    return { text: '—', color: 'var(--text-muted)', icon: Minus };
  }
  if (props.variacaoPct > 0) {
    return { text: `+${fmtPct(props.variacaoPct)}`, color: 'var(--status-danger-text)', icon: TrendingUp };
  }
  if (props.variacaoPct < 0) {
    return { text: fmtPct(props.variacaoPct), color: 'var(--status-success-text)', icon: TrendingDown };
  }
  return { text: fmtPct(0), color: 'var(--text-muted)', icon: Minus };
});
</script>

<template>
  <button
    type="button"
    class="sn-focus"
    :aria-pressed="active"
    :style="{
      textAlign: 'left',
      background: active ? 'var(--surface-selected)' : 'var(--surface-card)',
      border: `1px solid ${active ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '16px 18px',
      cursor: 'pointer',
    }"
    @click="$emit('toggle')"
  >
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
      {{ label }}
    </div>
    <div class="flex items-end justify-between" style="gap: 12px; margin-top: 8px">
      <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
        {{ quantidade }}
      </div>
      <div class="flex items-center" :style="{ gap: '4px', color: delta.color, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums' }">
        <component :is="delta.icon" :size="14" />
        {{ delta.text }}
      </div>
    </div>
    <div style="margin-top: 4px; font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">
      {{ brl(exposicao) }} expostos
    </div>
  </button>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
