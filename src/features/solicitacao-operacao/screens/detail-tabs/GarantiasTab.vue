<script setup lang="ts">
import { Plus, ShieldCheck } from 'lucide-vue-next';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';

defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>();
</script>

<template>
  <Section title="Garantias">
    <template #action>
      <GhostButton :icon="Plus">Adicionar garantia</GhostButton>
    </template>
    <EmptyState
      v-if="det.garantias.length === 0"
      :icon="ShieldCheck"
      title="Nenhuma garantia cadastrada"
      hint="Adicione garantias reais ou fidejussórias para fortalecer a operação."
    />
  </Section>
</template>
