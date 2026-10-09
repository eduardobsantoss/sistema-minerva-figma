<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { brl, pct, type SemiCota, type SemiOperacao } from '../data/semiestruturadasData';
import {
  PCT_EPSILON,
  VEICULOS_ADQUIRENTES,
  novaCota,
  parsePct,
  reaplicarCota,
  round2,
  valorPorPct,
} from '../data/distribuicaoCotas';

const props = defineProps<{ operacao: SemiOperacao; cotaId: string }>();
const emit = defineEmits<{ close: []; save: [cotas: SemiCota[]] }>();

const cota = computed(() => props.operacao.cotas.find((c) => c.id === props.cotaId)!);
const total = computed(() => props.operacao.valorAbertoGarantia);

const veiculo = ref('');
const pctNovaTexto = ref('');

const veiculosDisponiveis = computed(() =>
  VEICULOS_ADQUIRENTES.filter((v) => v !== cota.value.veiculoAdquirente),
);

const pctNova = computed(() => parsePct(pctNovaTexto.value));
const pctNovaPreenchida = computed(() => !Number.isNaN(pctNova.value));
const acimaDoLimite = computed(
  () => pctNovaPreenchida.value && pctNova.value > cota.value.percentualAdquirido + PCT_EPSILON,
);
const pctNovaValida = computed(
  () => pctNovaPreenchida.value && pctNova.value > 0 && !acimaDoLimite.value,
);
const podeSalvar = computed(() => veiculo.value !== '' && pctNovaValida.value);

const pctAntigaRestante = computed(() =>
  pctNovaValida.value ? Math.max(0, round2(cota.value.percentualAdquirido - pctNova.value)) : null,
);
const valorAntiga = computed(() =>
  pctAntigaRestante.value === null ? null : valorPorPct(pctAntigaRestante.value, total.value),
);
const valorNova = computed(() =>
  pctNovaValida.value ? valorPorPct(pctNova.value, total.value) : null,
);

const erro = computed(() => {
  if (acimaDoLimite.value)
    return `A porcentagem nova não pode passar de ${pct(cota.value.percentualAdquirido)}, a cota que está sendo distribuída.`;
  if (pctNovaPreenchida.value && pctNova.value <= 0) return 'Informe uma porcentagem maior que zero.';
  return '';
});

function salvar() {
  if (!podeSalvar.value) return;
  const origem = cota.value;
  const restante = pctAntigaRestante.value ?? 0;
  const alvo = props.operacao.cotas.find((c) => c.veiculoAdquirente === veiculo.value);

  const resultado: SemiCota[] = [];
  for (const c of props.operacao.cotas) {
    if (c.id === origem.id) {
      if (restante > PCT_EPSILON) resultado.push(reaplicarCota(c, restante, total.value));
    } else if (alvo && c.id === alvo.id) {
      resultado.push(reaplicarCota(c, c.percentualAdquirido + pctNova.value, total.value));
    } else {
      resultado.push(c);
    }
  }
  if (!alvo) resultado.push(novaCota(veiculo.value, pctNova.value, total.value));
  emit('save', resultado);
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      class="flex flex-col"
      style="width: 100%; max-width: 640px; max-height: 85vh; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
            Semiestruturadas · Cota
          </div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2">
            Distribuir cotas
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Repasse parte desta cota para outro veículo
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
        <div class="dist-grid">
          <div class="dist-field">
            <div class="dist-label">Cota distribuída</div>
            <div class="dist-readonly dist-readonly-strong">{{ cota.veiculoAdquirente }}</div>
          </div>
          <div class="dist-field">
            <div class="dist-label">Porcentagem da cota</div>
            <div class="dist-readonly dist-readonly-strong">{{ pct(cota.percentualAdquirido) }}</div>
          </div>
        </div>

        <div class="dist-grid">
          <label class="dist-field">
            <span class="dist-label">Veículo que adquire</span>
            <select v-model="veiculo" class="dist-input" :data-empty="veiculo === ''">
              <option value="" disabled>Selecione</option>
              <option v-for="v in veiculosDisponiveis" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
          <label class="dist-field">
            <span class="dist-label">Porcentagem da nova cota</span>
            <div class="dist-affix-wrap">
              <input
                v-model="pctNovaTexto"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                class="dist-input dist-input-affixed"
                :data-invalid="erro !== ''"
              />
              <span class="dist-affix">%</span>
            </div>
          </label>
        </div>

        <p v-if="erro" style="font-size: var(--text-xs); color: var(--danger-base); margin-top: -8px">{{ erro }}</p>

        <div class="dist-grid">
          <div class="dist-field">
            <div class="dist-label">Valor da cota antiga</div>
            <div class="dist-readonly dist-readonly-strong">
              {{ valorAntiga === null ? '—' : brl(valorAntiga) }}
            </div>
            <div v-if="pctAntigaRestante !== null" class="dist-hint">{{ pct(pctAntigaRestante) }} da cota total</div>
          </div>
          <div class="dist-field">
            <div class="dist-label">Valor da cota nova</div>
            <div class="dist-readonly dist-readonly-strong">
              {{ valorNova === null ? '—' : brl(valorNova) }}
            </div>
            <div v-if="pctNovaValida" class="dist-hint">{{ pct(pctNova) }} da cota total</div>
          </div>
        </div>

        <p style="font-size: var(--text-xs); color: var(--text-muted)">
          Valores pela regra de três sobre a cota total de {{ brl(total) }}.
        </p>
      </div>

      <div class="dist-footer">
        <button type="button" class="dist-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="dist-primary" :disabled="!podeSalvar" @click="salvar">
          Salvar distribuição
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dist-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.dist-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.dist-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.dist-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.dist-input,
.dist-readonly {
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
.dist-input[data-empty='true'] {
  color: var(--text-muted);
}
.dist-input[data-invalid='true'] {
  border-color: var(--danger-base);
}
.dist-readonly {
  display: flex;
  align-items: center;
  background: var(--surface-sunken);
  color: var(--text-muted);
}
.dist-readonly-strong {
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.dist-affix-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.dist-input-affixed {
  padding-right: 36px;
}
.dist-affix {
  position: absolute;
  right: 14px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  pointer-events: none;
}
.dist-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 16px 22px;
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}
.dist-secondary,
.dist-primary {
  height: 44px;
  padding: 0 22px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-xs);
  letter-spacing: 0.10em;
  text-transform: uppercase;
}
.dist-secondary {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border: 1px solid var(--action-secondary-border);
  cursor: pointer;
}
.dist-secondary:hover {
  background: var(--action-secondary-bg-hover);
}
.dist-primary {
  border: none;
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  cursor: pointer;
}
.dist-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
.dist-primary:not(:disabled):hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
