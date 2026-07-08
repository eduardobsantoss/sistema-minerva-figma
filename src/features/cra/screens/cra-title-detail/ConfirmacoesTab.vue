<script setup lang="ts">
import { computed } from 'vue';
import type { CraTitulo } from '../../data/craData';
import Section from './Section.vue';

const props = defineProps<{ titulo: CraTitulo }>();

const items = computed(() => [
  { data: props.titulo.emissao, tipo: 'Confirmação do Sacado', resultado: props.titulo.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE', obs: 'Via portal eletrônico' },
  { data: props.titulo.emissao, tipo: 'Validação de Lastro', resultado: 'CONFIRMADO', obs: 'Documento verificado' },
  { data: props.titulo.emissao, tipo: 'Registro Registradora', resultado: 'CONFIRMADO', obs: 'B3 — protocolo #82341' },
]);

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap['PENDENTE'];
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in items"
        :key="i"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ c.tipo }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ c.data }} · {{ c.obs }}</div>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: tone(c.resultado).bg,
            color: tone(c.resultado).fg,
          }"
        >
          {{ c.resultado }}
        </span>
      </div>
    </div>
  </Section>
</template>
