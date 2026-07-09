<script setup lang="ts">
import type { ConfiguracaoTituloDisplay, ConfiguracaoTituloFieldDef } from '../../../../data/pagamentoFields';
import { Field } from '../../shared';

withDefaults(defineProps<{ fields: ConfiguracaoTituloFieldDef[]; data: ConfiguracaoTituloDisplay; cols?: number }>(), {
  cols: 3,
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '20px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <Field :label="field.label">{{ data[field.key] || '—' }}</Field>
    </div>
  </div>
</template>
