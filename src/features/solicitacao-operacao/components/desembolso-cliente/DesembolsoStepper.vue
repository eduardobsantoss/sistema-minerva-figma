<script setup lang="ts">
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';
import {
  etapasLiberadas,
  type EtapaDesembolso,
  type EtapaDesembolsoKey,
} from '../../data/desembolsoClienteData';

const props = defineProps<{
  etapas: EtapaDesembolso[];
  concluidas: EtapaDesembolsoKey[];
}>();

const emit = defineEmits<{
  concluir: [key: EtapaDesembolsoKey];
}>();

const liberadas = computed(() => etapasLiberadas(props.etapas, props.concluidas).map((e) => e.key));

/** Cada coluna é uma posição na linha. Etapas do grupo final (Financeiro e Cobrança) dividem a mesma posição. */
const colunas = computed(() => {
  const result: { key: string; itens: { etapa: EtapaDesembolso; numero: number }[] }[] = [];
  props.etapas.forEach((etapa, index) => {
    const item = { etapa, numero: index + 1 };
    const ultima = result[result.length - 1];
    if (etapa.grupo === 'FINAL' && ultima && ultima.itens[0].etapa.grupo === 'FINAL') {
      ultima.itens.push(item);
    } else {
      result.push({ key: etapa.key, itens: [item] });
    }
  });
  return result;
});

function estado(key: EtapaDesembolsoKey): 'done' | 'current' | 'locked' {
  if (props.concluidas.includes(key)) return 'done';
  if (liberadas.value.includes(key)) return 'current';
  return 'locked';
}

function rotulo(etapa: EtapaDesembolso): string {
  const s = estado(etapa.key);
  if (s === 'current') {
    return etapa.key === 'ENCARTEIRAR' ? 'Encarteirar pedido' : `Concluir ${etapa.label}`;
  }
  if (s === 'done') return `${etapa.label} concluída`;
  return `${etapa.label} bloqueada até a etapa anterior`;
}

function aoClicar(etapa: EtapaDesembolso) {
  if (estado(etapa.key) === 'current') emit('concluir', etapa.key);
}

/** Posição concluída quando todas as etapas dela estão feitas. */
function estadoColuna(itens: { etapa: EtapaDesembolso }[]): 'done' | 'current' | 'locked' {
  if (itens.every((i) => estado(i.etapa.key) === 'done')) return 'done';
  if (itens.some((i) => estado(i.etapa.key) !== 'locked')) return 'current';
  return 'locked';
}
</script>

<template>
  <ol class="steps">
    <li
      v-for="coluna in colunas"
      :key="coluna.key"
      class="step"
      :data-state="estadoColuna(coluna.itens)"
      :style="{ flexGrow: coluna.itens.length }"
    >
      <div class="cols">
        <div v-for="item in coluna.itens" :key="item.etapa.key" class="col" :data-state="estado(item.etapa.key)">
          <button
            type="button"
            class="dot"
            :disabled="estado(item.etapa.key) !== 'current'"
            :aria-label="rotulo(item.etapa)"
            :title="rotulo(item.etapa)"
            @click="aoClicar(item.etapa)"
          >
            <Check v-if="estado(item.etapa.key) === 'done'" :size="16" :stroke-width="2.5" />
            <span v-else class="dot-index">{{ item.numero }}</span>
          </button>
          <span class="label">{{ item.etapa.label }}</span>
        </div>
      </div>
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
  min-width: 0;
}
.cols {
  display: flex;
  width: 100%;
}
.col {
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
.col[data-state='done'] .dot {
  border-color: var(--stepper-done);
  background: var(--stepper-done);
  color: var(--text-on-brand);
}
.col[data-state='done'] .dot:disabled {
  cursor: default;
}
.col[data-state='current'] .dot {
  border-color: var(--stepper-current);
  color: var(--stepper-current);
  box-shadow: 0 0 0 4px var(--gci-light);
}
.col[data-state='current'] .dot:hover {
  background: var(--stepper-current);
  color: var(--text-on-brand);
}
.col[data-state='locked'] .dot {
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
.col[data-state='done'] .label,
.col[data-state='current'] .label {
  color: var(--text-strong);
}
.col[data-state='current'] .label {
  font-weight: var(--weight-bold);
}
</style>
