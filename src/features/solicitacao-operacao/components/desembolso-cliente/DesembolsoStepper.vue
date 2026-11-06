<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import type { EtapaDesembolso, EtapaDesembolsoKey } from '../../data/desembolsoClienteData';

const props = defineProps<{
  etapas: EtapaDesembolso[];
  concluidas: EtapaDesembolsoKey[];
}>();

const emit = defineEmits<{
  concluir: [key: EtapaDesembolsoKey];
  desfazer: [key: EtapaDesembolsoKey];
}>();

function estado(index: number): 'done' | 'current' | 'locked' {
  if (index < props.concluidas.length) return 'done';
  if (index === props.concluidas.length) return 'current';
  return 'locked';
}

function podeDesfazer(index: number, _key: EtapaDesembolsoKey): boolean {
  return estado(index) === 'done' && index === props.concluidas.length - 1;
}

function rotulo(etapa: EtapaDesembolso, index: number): string {
  if (estado(index) === 'current') {
    return etapa.key === 'ENCARTEIRAR' ? 'Encarteirar pedido' : `Concluir ${etapa.label}`;
  }
  if (podeDesfazer(index, etapa.key)) return `Desfazer ${etapa.label}`;
  if (estado(index) === 'done') return `${etapa.label} concluída`;
  return `${etapa.label} bloqueada até a etapa anterior`;
}

function aoClicar(etapa: EtapaDesembolso, index: number) {
  if (estado(index) === 'current') {
    emit('concluir', etapa.key);
    return;
  }
  if (podeDesfazer(index, etapa.key)) emit('desfazer', etapa.key);
}
</script>

<template>
  <ol class="steps">
    <li
      v-for="(etapa, index) in etapas"
      :key="etapa.key"
      class="step"
      :data-state="estado(index)"
    >
      <button
        type="button"
        class="dot"
        :disabled="estado(index) === 'locked' || (estado(index) === 'done' && !podeDesfazer(index, etapa.key))"
        :aria-label="rotulo(etapa, index)"
        :title="rotulo(etapa, index)"
        @click="aoClicar(etapa, index)"
      >
        <Check v-if="estado(index) === 'done'" :size="16" :stroke-width="2.5" />
        <span v-else class="dot-index">{{ index + 1 }}</span>
      </button>
      <span class="label">{{ etapa.label }}</span>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  display: flex;
  gap: 0;
  width: 100%;
  margin: 0;
  padding: 4px 0 0;
  list-style: none;
}
.step {
  position: relative;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background: var(--stepper-track);
  z-index: 0;
}
.step[data-state='done']:not(:last-child)::after {
  background: var(--stepper-done);
}
.dot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 2px solid var(--stepper-future);
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
  outline: none;
  padding: 0;
  transition: background var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.dot:focus-visible {
  box-shadow: var(--focus-ring);
}
.step[data-state='done'] .dot {
  border-color: var(--stepper-done);
  background: var(--stepper-done);
  color: #fff;
}
.step[data-state='done'] .dot:disabled {
  cursor: default;
}
.step[data-state='current'] .dot {
  border-color: var(--stepper-current);
  color: var(--stepper-current);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--stepper-current) 14%, transparent);
}
.step[data-state='current'] .dot:hover {
  background: var(--stepper-current);
  color: #fff;
}
.step[data-state='locked'] .dot {
  cursor: not-allowed;
}
.dot-index {
  font-size: 12px;
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
}
.label {
  width: 100%;
  padding: 0 4px;
  font-size: 11px;
  font-weight: var(--weight-semibold);
  line-height: 1.3;
  text-align: center;
  color: var(--text-muted);
}
.step[data-state='done'] .label,
.step[data-state='current'] .label {
  color: var(--text-strong);
}
.step[data-state='current'] .label {
  font-weight: var(--weight-bold);
}
</style>
