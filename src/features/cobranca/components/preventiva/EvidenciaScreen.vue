<script setup lang="ts">
import { ArrowLeft, Download, FileText } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import {
  fmtData,
  statusPreventivoColor,
  statusPreventivoLabel,
  type RegistroTentativa,
  type SacadoPreventivo,
} from '../../data/cobrancaPreventivaData';

const props = defineProps<{ registro: RegistroTentativa; sacado: SacadoPreventivo }>();
const emit = defineEmits<{ back: [] }>();
const { success } = useToast();

function baixar() {
  success(`Download iniciado: ${props.registro.evidencia}`);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button type="button" aria-label="Voltar" class="back" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div class="eyebrow">Cobrança · Evidência</div>
        <h2 style="margin-top: 4px">{{ registro.evidencia }}</h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ sacado.nome }} · {{ fmtData(registro.dataContato) }} · {{ registro.registradoPor }}
        </p>
      </div>
      <button type="button" class="outline" @click="baixar"><Download :size="15" /> Baixar</button>
    </div>

    <div class="viewer">
      <div class="page">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 20px">
          <div
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent)"
          >
            <FileText :size="20" />
          </div>
          <div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Registro de contato
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ registro.geral }}</div>
          </div>
        </div>

        <dl class="fields">
          <dt>Sacado</dt>
          <dd>{{ sacado.nome }}</dd>
          <dt>Documento</dt>
          <dd>{{ sacado.documento }}</dd>
          <dt>Data do contato</dt>
          <dd>{{ fmtData(registro.dataContato) }}</dd>
          <dt>Retorno</dt>
          <dd>
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                padding: '4px 9px',
                borderRadius: '9999px',
                background: `color-mix(in srgb, ${statusPreventivoColor(registro.status)} 14%, transparent)`,
                color: statusPreventivoColor(registro.status),
              }"
            >
              {{ statusPreventivoLabel(registro.status) }}
            </span>
          </dd>
          <dt>Observações</dt>
          <dd>{{ registro.observacoes || '—' }}</dd>
        </dl>

        <div class="lines">
          <span v-for="n in 9" :key="n" :style="{ width: `${94 - ((n * 13) % 40)}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  cursor: pointer;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.18em;
  color: var(--accent);
  text-transform: uppercase;
}
h2 {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.outline:hover {
  background: var(--surface-sunken);
}
.viewer {
  background: var(--surface-sunken);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 32px 16px;
  display: flex;
  justify-content: center;
}
.page {
  width: 100%;
  max-width: 720px;
  min-height: 560px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 40px;
}
.fields {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 12px;
  column-gap: 16px;
  font-size: var(--text-sm);
}
.fields dt {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-top: 3px;
}
.fields dd {
  color: var(--text-strong);
}
.lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 32px;
}
.lines span {
  height: 8px;
  border-radius: 4px;
  background: var(--surface-sunken);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
