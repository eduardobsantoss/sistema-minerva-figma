<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';
import type { EtapaStatus } from '../../data/passivoData';

defineProps<{ label: string; status: EtapaStatus }>();

function circleStyle(status: EtapaStatus) {
  if (status === 'concluido') {
    return {
      background: 'var(--stepper-done)',
      borderColor: 'var(--stepper-done)',
      color: '#fff',
    };
  }
  if (status === 'em-andamento') {
    return {
      background: 'var(--surface-card)',
      borderColor: 'var(--warning-base)',
      color: 'var(--warning-base)',
      boxShadow: '0 4px 12px color-mix(in srgb, var(--warning-base) 20%, transparent)',
    };
  }
  return {
    background: 'var(--surface-sunken)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-disabled)',
  };
}
</script>

<template>
  <div class="flex flex-col items-center" style="gap: 8px">
    <div
      class="flex items-center justify-center"
      :style="{
        width: '32px',
        height: '32px',
        borderRadius: '9999px',
        borderWidth: '2px',
        borderStyle: 'solid',
        ...circleStyle(status),
      }"
    >
      <CheckCircle2 v-if="status === 'concluido'" :size="16" />
      <div
        v-else
        :style="{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          background: 'currentColor',
        }"
      />
    </div>
    <span
      :style="{
        fontSize: '8px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color: status === 'pendente' ? 'var(--text-muted)' : 'var(--text-strong)',
      }"
    >
      {{ label }}
    </span>
  </div>
</template>
