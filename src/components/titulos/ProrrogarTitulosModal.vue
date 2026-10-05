<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import type { TituloSelecionado } from './types';

const props = defineProps<{ titulos: TituloSelecionado[] }>();
const emit = defineEmits<{ close: [] }>();

const motivoProrrogacao = ref('');
const taxaJuros = ref('0.00');
const novaDataVencimento = ref('');
const removerMultaMoratoria = ref(false);
const removerJurosMoratorios = ref(false);

const totalValor = computed(() => props.titulos.reduce((acc, t) => acc + t.valor, 0));
const totalJurosPago = computed(() => 0);

const podeProrrogar = computed(() => novaDataVencimento.value.trim() !== '');

const rotuloConfirmar = computed(() =>
  props.titulos.length === 1 ? 'Prorrogar título' : 'Prorrogar títulos',
);

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseBrDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function diasAtraso(vencimento: string): number {
  const due = parseBrDate(vencimento);
  if (!due) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - due.getTime()) / 86_400_000);
  return Math.max(0, diff);
}

function diasAtrasoLabel(vencimento: string): string {
  const dias = diasAtraso(vencimento);
  return `${dias} dia(s)`;
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      class="flex flex-col"
      style="width: 100%; max-width: 960px; height: min(85vh, 820px); background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Prorrogação de título(s)
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados da prorrogação dos títulos selecionados
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px">
        <section class="flex flex-col" style="gap: 16px">
          <div class="lote-section" style="margin-bottom: 0">Dados da prorrogação</div>
          <div class="lote-grid">
            <label class="lote-field span-12">
              <span class="lote-label">Motivo da prorrogação</span>
              <select v-model="motivoProrrogacao" class="lote-input" :data-empty="motivoProrrogacao === ''">
                <option value="" disabled>Selecione</option>
              </select>
            </label>

            <label class="lote-field span-6">
              <span class="lote-label">Taxa de juros</span>
              <div class="lote-input-affix">
                <input v-model="taxaJuros" type="text" inputmode="decimal" class="lote-input lote-input-affixed" />
                <span class="lote-affix">%</span>
              </div>
            </label>
            <label class="lote-field span-6">
              <span class="lote-label">Nova data de vencimento</span>
              <input v-model="novaDataVencimento" type="date" class="lote-input" />
            </label>
          </div>

          <div class="flex flex-col" style="gap: 12px">
            <button
              type="button"
              class="lote-toggle-row"
              :data-on="removerMultaMoratoria"
              @click="removerMultaMoratoria = !removerMultaMoratoria"
            >
              <div style="min-width: 0; text-align: left">
                <div class="lote-toggle-label">Remover multa moratória</div>
                <div class="lote-toggle-hint">
                  Se marcado, zera a multa moratória no vínculo ativo antes de recalcular a prorrogação.
                </div>
              </div>
              <span class="lote-switch-track" :data-on="removerMultaMoratoria">
                <span class="lote-switch-knob" />
              </span>
            </button>
            <button
              type="button"
              class="lote-toggle-row"
              :data-on="removerJurosMoratorios"
              @click="removerJurosMoratorios = !removerJurosMoratorios"
            >
              <div style="min-width: 0; text-align: left">
                <div class="lote-toggle-label">Remover juros moratórios</div>
                <div class="lote-toggle-hint">
                  Se marcado, zera os juros moratórios no vínculo ativo antes de recalcular a prorrogação.
                </div>
              </div>
              <span class="lote-switch-track" :data-on="removerJurosMoratorios">
                <span class="lote-switch-knob" />
              </span>
            </button>
          </div>

          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            Taxa de juros do CRA: <span style="font-variant-numeric: tabular-nums">1,000000%</span>
          </p>
        </section>

        <section>
          <div class="lote-section">Títulos selecionados</div>
          <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div
              class="lote-table-row lote-table-head"
              style="grid-template-columns: 1.1fr 1fr 1fr 0.9fr 1fr"
            >
              <div>Número</div>
              <div style="text-align: right">Valor</div>
              <div>Vencimento</div>
              <div>Dias de atraso</div>
              <div style="text-align: right">Juros pago</div>
            </div>
            <div
              v-for="t in titulos"
              :key="t.id"
              class="lote-table-row"
              style="grid-template-columns: 1.1fr 1fr 1fr 0.9fr 1fr"
            >
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.numero }}</div>
              <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(t.valor) }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ t.vencimento }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ diasAtrasoLabel(t.vencimento) }}</div>
              <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(0) }}</div>
            </div>
          </div>

          <div class="lote-grid" style="margin-top: 16px">
            <div class="span-6">
              <div class="lote-label">Valor total</div>
              <div class="lote-readonly lote-readonly-strong">{{ brl(totalValor) }}</div>
            </div>
            <div class="span-6">
              <div class="lote-label">Total de juros pago</div>
              <div class="lote-readonly lote-readonly-strong">{{ brl(totalJurosPago) }}</div>
            </div>
          </div>
        </section>
      </div>

      <div class="lote-footer">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="lote-primary" :disabled="!podeProrrogar" @click="podeProrrogar && emit('close')">
          {{ rotuloConfirmar }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}
.span-6 {
  grid-column: span 6;
}
.span-12 {
  grid-column: span 12;
}
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.lote-input,
.lote-readonly {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}
.lote-readonly {
  display: flex;
  align-items: center;
  background: var(--surface-sunken);
  color: var(--text-muted);
}
.lote-readonly-strong {
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.lote-input[data-empty='true'] {
  color: var(--text-muted);
}
.lote-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  cursor: pointer;
  text-align: left;
  transition:
    background var(--duration-fast),
    border-color var(--duration-fast);
}
.lote-toggle-row[data-on='true'] {
  border-color: var(--success-base);
  background: var(--success-light);
}
.lote-toggle-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  line-height: 1.4;
}
.lote-toggle-row[data-on='true'] .lote-toggle-label {
  color: var(--success-dark);
}
.lote-toggle-hint {
  margin-top: 4px;
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.45;
}
.lote-switch-track {
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: var(--border-strong);
  position: relative;
  flex-shrink: 0;
}
.lote-switch-track[data-on='true'] {
  background: var(--success-base);
}
.lote-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: left var(--duration-base);
}
.lote-switch-track[data-on='true'] .lote-switch-knob {
  left: 23px;
}
.lote-input-affix {
  position: relative;
  display: flex;
  align-items: center;
}
.lote-input-affixed {
  padding-right: 36px;
}
.lote-affix {
  position: absolute;
  right: 14px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  pointer-events: none;
}
.lote-section {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.lote-table-row {
  display: grid;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  font-size: var(--text-sm);
  color: var(--text-default);
  border-top: 1px solid var(--border-default);
}
.lote-table-head {
  background: var(--surface-sunken);
  border-top: none;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.lote-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 16px 22px;
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}
.lote-secondary,
.lote-primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
}
.lote-secondary {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border: 1px solid var(--action-secondary-border);
  cursor: pointer;
}
.lote-secondary:hover {
  background: var(--action-secondary-bg-hover);
}
.lote-primary {
  border: none;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  cursor: pointer;
}
.lote-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
.lote-primary:not(:disabled):hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
