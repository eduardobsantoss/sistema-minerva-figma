<script setup lang="ts">
import type { AtivoPessoa } from '../../../../data/ativoData';
import { Section, Field } from '../../shared';

defineProps<{ pessoa: AtivoPessoa; titulo: string }>();
</script>

<template>
  <Section :title="`Dados do ${titulo}`">
    <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 16px">
      <Field label="Nome">{{ pessoa.nome }}</Field>
      <Field label="Documento">{{ pessoa.documento }}</Field>
    </div>
  </Section>
</template>
