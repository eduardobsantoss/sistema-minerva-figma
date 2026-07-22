<script setup lang="ts">
import {
  brl,
  situacaoLabel,
  situacaoColor,
  statusTituloLabel,
  statusTituloColor,
  type TituloAtivoGlobal,
} from '../../data/ativosData';
import Section from './Section.vue';

defineProps<{ titulos: TituloAtivoGlobal[] }>();
const emit = defineEmits<{ openTitulo: [id: string] }>();
</script>

<template>
  <Section title="Títulos do Contrato">
    <div v-if="titulos.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum título vinculado a este contrato.
    </div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; overflow-x: auto">
      <div style="min-width: 900px">
        <div
          class="grid"
          style="grid-template-columns: 100px 90px 1.2fr 1fr 110px 120px 120px 120px; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Número</div>
          <div>Lastro</div>
          <div>Sacado</div>
          <div>Situação</div>
          <div>Status</div>
          <div style="text-align: right">Nominal</div>
          <div style="text-align: right">Aberto</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="t in titulos"
          :key="t.id"
          class="grid items-center titulo-row"
          style="grid-template-columns: 100px 90px 1.2fr 1fr 110px 120px 120px 120px; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); cursor: pointer"
          @click="emit('openTitulo', t.id)"
        >
          <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ t.numero }}</div>
          <div style="color: var(--text-muted)">{{ t.lastro }}</div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.sacadoNome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ t.sacadoDocumento }}</div>
          </div>
          <div>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '4px 8px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${situacaoColor(t.situacao)} 14%, transparent)`,
                color: situacaoColor(t.situacao),
              }"
            >
              {{ situacaoLabel(t.situacao) }}
            </span>
          </div>
          <div>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '4px 8px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${statusTituloColor(t.statusTitulo)} 14%, transparent)`,
                color: statusTituloColor(t.statusTitulo),
              }"
            >
              {{ statusTituloLabel(t.statusTitulo) }}
            </span>
          </div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">{{ brl(t.valorNominal) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(t.valorAberto) }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ t.vencimento }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.titulo-row:hover {
  background: var(--surface-sunken);
}
</style>
