<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import type { TituloSelecionado } from './types';

const props = defineProps<{ titulos: TituloSelecionado[] }>();
const emit = defineEmits<{ close: [] }>();

const motivosBaixa = [
  'Baixa manual',
  'Pago pelo cedente',
  'Baixa por substituição',
  'Pago pelo sacado',
  'Devolução ao cedente',
  'Baixa com desconto',
];

const pagamentoParcial = ref(false);
const baixaValorPresente = ref(false);
const motivoBaixa = ref('');
const valorPagamento = ref('');
const taxaDesconto = ref('');
const taxaJuros = ref('');
const taxaMulta = ref('');
const dataPagamento = ref('');

const totalValor = computed(() => props.titulos.reduce((acc, t) => acc + t.valor, 0));
const totalAberto = computed(() => {
  if (props.titulos.some((t) => t.valorAberto == null)) return null;
  return props.titulos.reduce((acc, t) => acc + (t.valorAberto ?? 0), 0);
});

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
            Pagamento em lote
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados do pagamento dos títulos selecionados
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
          <div class="lote-section" style="margin-bottom: 0">Dados do pagamento</div>
          <div class="lote-grid">
            <label class="lote-field span-8">
              <span class="lote-label">Motivo da baixa</span>
              <select v-model="motivoBaixa" class="lote-input" :data-empty="motivoBaixa === ''">
                <option value="" disabled>Selecione</option>
                <option v-for="motivo in motivosBaixa" :key="motivo" :value="motivo">{{ motivo }}</option>
              </select>
            </label>
            <label class="lote-field span-4">
              <span class="lote-label">Data de pagamento</span>
              <input v-model="dataPagamento" type="date" class="lote-input" />
            </label>
            <label class="lote-field span-3">
              <span class="lote-label">Valor do pagamento</span>
              <input v-model="valorPagamento" type="text" inputmode="decimal" placeholder="R$ 0,00" class="lote-input" />
            </label>
            <label class="lote-field span-3">
              <span class="lote-label">Taxa de desconto</span>
              <input v-model="taxaDesconto" type="text" inputmode="decimal" placeholder="%" class="lote-input" />
            </label>
            <label class="lote-field span-3">
              <span class="lote-label">Taxa de juros</span>
              <input v-model="taxaJuros" type="text" inputmode="decimal" placeholder="%" class="lote-input" />
            </label>
            <label class="lote-field span-3">
              <span class="lote-label">Taxa de multa</span>
              <input v-model="taxaMulta" type="text" inputmode="decimal" placeholder="%" class="lote-input" />
            </label>
            <div class="span-6">
              <div class="lote-label">Taxa de juros do FIDC</div>
              <div class="lote-readonly">—</div>
            </div>
            <div class="span-6">
              <div class="lote-label">Taxa de multa do FIDC</div>
              <div class="lote-readonly">—</div>
            </div>
          </div>

          <div class="flex flex-col" style="gap: 12px">
            <button type="button" class="lote-toggle" :data-on="pagamentoParcial" @click="pagamentoParcial = !pagamentoParcial">
              <span>Pagamento parcial</span>
              <span class="lote-switch-track" :data-on="pagamentoParcial">
                <span class="lote-switch-knob" />
              </span>
            </button>
            <button type="button" class="lote-toggle" :data-on="baixaValorPresente" @click="baixaValorPresente = !baixaValorPresente">
              <span>Baixa por valor presente</span>
              <span class="lote-switch-track" :data-on="baixaValorPresente">
                <span class="lote-switch-knob" />
              </span>
            </button>
          </div>

          <div class="flex justify-end">
            <button type="button" class="lote-secondary">Simular</button>
          </div>
        </section>

        <section>
          <div class="lote-section">Títulos selecionados</div>
          <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div class="lote-table-row lote-table-head" style="grid-template-columns: 1.2fr 1fr 1fr 1fr">
              <div>Número</div>
              <div style="text-align: right">Valor</div>
              <div style="text-align: right">Valor aberto</div>
              <div>Vencimento</div>
            </div>
            <div
              v-for="t in titulos"
              :key="t.id"
              class="lote-table-row"
              style="grid-template-columns: 1.2fr 1fr 1fr 1fr"
            >
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.numero }}</div>
              <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(t.valor) }}</div>
              <div style="text-align: right; font-variant-numeric: tabular-nums">
                {{ t.valorAberto == null ? '—' : brl(t.valorAberto) }}
              </div>
              <div style="font-variant-numeric: tabular-nums">{{ t.vencimento }}</div>
            </div>
          </div>
          <div class="lote-grid" style="margin-top: 16px">
            <div class="span-6">
              <div class="lote-label">Valor total dos títulos</div>
              <div class="lote-readonly lote-readonly-strong">{{ brl(totalValor) }}</div>
            </div>
            <div class="span-6">
              <div class="lote-label">Valor total aberto dos títulos</div>
              <div class="lote-readonly lote-readonly-strong">{{ totalAberto == null ? '—' : brl(totalAberto) }}</div>
            </div>
          </div>
        </section>

        <section>
          <div class="lote-section">Valores simulados</div>
          <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div class="lote-table-row lote-table-head" style="grid-template-columns: repeat(9, minmax(88px, 1fr))">
              <div>Número</div>
              <div>Valor pago</div>
              <div>Valor aberto</div>
              <div>Vencimento</div>
              <div>Dias de atraso</div>
              <div>Juros pago</div>
              <div>Multa paga</div>
              <div>Desconto concedido</div>
              <div>Pagamento considerado</div>
            </div>
            <div style="padding: 28px 16px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
              Não foi encontrado nenhum resultado.
            </div>
          </div>
          <div class="lote-grid" style="margin-top: 16px">
            <div class="span-4">
              <div class="lote-label">Valor total de juros</div>
              <div class="lote-readonly">{{ brl(0) }}</div>
            </div>
            <div class="span-4">
              <div class="lote-label">Valor total de multa</div>
              <div class="lote-readonly">{{ brl(0) }}</div>
            </div>
            <div class="span-4">
              <div class="lote-label">Valor total pago</div>
              <div class="lote-readonly">{{ brl(0) }}</div>
            </div>
            <div class="span-6">
              <div class="lote-label">Valor total de desconto</div>
              <div class="lote-readonly">{{ brl(0) }}</div>
            </div>
            <div class="span-6">
              <div class="lote-label">Valor total considerado</div>
              <div class="lote-readonly">{{ brl(0) }}</div>
            </div>
          </div>
        </section>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; padding: 16px 22px; border-top: 1px solid var(--border-default); flex-shrink: 0">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="lote-primary" disabled>Realizar pagamentos</button>
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
.span-3 { grid-column: span 3; }
.span-4 { grid-column: span 4; }
.span-6 { grid-column: span 6; }
.span-8 { grid-column: span 8; }
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
.lote-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  text-align: left;
}
.lote-toggle[data-on='true'] {
  border-color: var(--success-base);
  background: var(--success-light);
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
  background: var(--neutral-200);
  color: var(--text-disabled);
  border: none;
  cursor: not-allowed;
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
