<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';

defineProps<{
  date: string;
  value: string;
  absolute: string;
  trend: 'up' | 'down';
}>();
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      padding: 20px;
    "
  >
    <p
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        margin-bottom: 12px;
      "
    >
      {{ date }}
    </p>
    <div class="flex items-center justify-between">
      <div>
        <p
          :style="{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--weight-bold)',
            fontVariantNumeric: 'tabular-nums',
            color: trend === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
          }"
        >
          {{ value }}
        </p>
        <p
          style="
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ absolute }}
        </p>
      </div>
      <div
        class="flex items-center justify-center"
        :style="{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-lg)',
          background: trend === 'up' ? 'var(--success-light)' : 'var(--danger-light)',
          color: trend === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
        }"
      >
        <TrendingUp :size="20" />
      </div>
    </div>
  </div>
</template>
