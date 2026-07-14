<script setup lang="ts">
import type { ValidacaoAf } from '../../data/passivoData';
import { TONE_VALIDACAO_AF } from '../../data/passivoData';

defineProps<{ status: ValidacaoAf }>();
</script>

<template>
  <span
    :style="{
      padding: '5px 10px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      background: TONE_VALIDACAO_AF[status].bg,
      color: TONE_VALIDACAO_AF[status].fg,
    }"
  >
    {{ status }}
  </span>
</template>
