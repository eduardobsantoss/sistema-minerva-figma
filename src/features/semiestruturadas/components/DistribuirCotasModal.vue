<script setup lang="ts">
import { computed, ref } from 'vue';
import { Building2, Plus, Split, Trash2, X } from 'lucide-vue-next';
import { brl, pct, type SemiCota, type SemiOperacao } from '../data/semiestruturadasData';
import {
  PCT_EPSILON,
  VEICULOS_ADQUIRENTES,
  formatPctInput,
  novaCota,
  parsePct,
  reaplicarCota,
  round2,
  valorPorPct,
} from '../data/distribuicaoCotas';

const props = defineProps<{ operacao: SemiOperacao }>();
const emit = defineEmits<{ close: []; save: [cotas: SemiCota[]] }>();

interface LinhaExistente {
  id: string;
  veiculo: string;
  texto: string;
}
interface LinhaNova {
  key: number;
  veiculo: string;
  texto: string;
}

const total = computed(() => props.operacao.valorAbertoGarantia);

const existentes = ref<LinhaExistente[]>(
  props.operacao.cotas.map((c) => ({
    id: c.id,
    veiculo: c.veiculoAdquirente,
    texto: formatPctInput(c.percentualAdquirido),
  })),
);
const novas = ref<LinhaNova[]>([]);
let keySeq = 0;

function adicionarNova() {
  novas.value.push({ key: ++keySeq, veiculo: '', texto: '' });
}
function removerUltima() {
  novas.value.pop();
}

function veiculosParaLinha(atual: string): string[] {
  const usados = new Set<string>([
    ...existentes.value.map((e) => e.veiculo),
    ...novas.value.map((n) => n.veiculo),
  ]);
  return VEICULOS_ADQUIRENTES.filter((v) => v === atual || !usados.has(v));
}

function numeroOuNaN(texto: string): number {
  return parsePct(texto);
}

const temNova = computed(() => novas.value.length > 0);
const indiceUltima = computed(() => novas.value.length - 1);

// Linhas cujo percentual é digitado: todas as existentes e as novas, exceto a última.
const editaveis = computed(() => [
  ...existentes.value.map((e) => e.texto),
  ...novas.value.slice(0, Math.max(0, novas.value.length - 1)).map((n) => n.texto),
]);

const editaveisValidas = computed(() =>
  editaveis.value.every((t) => {
    const n = numeroOuNaN(t);
    return !Number.isNaN(n) && n >= 0;
  }),
);
const somaEditaveis = computed(() =>
  editaveis.value.reduce((s, t) => {
    const n = numeroOuNaN(t);
    return s + (Number.isNaN(n) ? 0 : n);
  }, 0),
);

// Quanto falta (positivo) ou quanto passa (negativo) para fechar 100%.
const diferenca = computed(() => round2(100 - somaEditaveis.value));
const pctUltima = computed(() => (temNova.value ? diferenca.value : null));

const fechaEm100 = computed(() => Math.abs(diferenca.value) <= PCT_EPSILON);
const acima = computed(() => diferenca.value < -PCT_EPSILON);

function pctDaNova(i: number): number {
  if (i === indiceUltima.value) return diferenca.value;
  return numeroOuNaN(novas.value[i].texto);
}

const novasValidas = computed(() =>
  novas.value.every((n, i) => {
    if (n.veiculo === '') return false;
    const v = pctDaNova(i);
    return !Number.isNaN(v) && v > PCT_EPSILON;
  }),
);

const podeSalvar = computed(() => {
  if (!editaveisValidas.value) return false;
  if (!temNova.value) return fechaEm100.value;
  return novasValidas.value && diferenca.value > PCT_EPSILON;
});

// Soma efetivamente distribuída (inclui a última cota automática quando positiva).
const somaDistribuida = computed(
  () => somaEditaveis.value + (temNova.value && diferenca.value > 0 ? diferenca.value : 0),
);

interface Resumo {
  tom: 'ok' | 'aviso' | 'erro' | 'info';
  titulo: string;
  texto: string;
}
const resumo = computed<Resumo>(() => {
  if (!editaveisValidas.value)
    return { tom: 'erro', titulo: 'Porcentagem inválida', texto: 'Informe números maiores ou iguais a zero.' };
  if (!temNova.value) {
    if (acima.value)
      return { tom: 'erro', titulo: `${pct(Math.abs(diferenca.value))} acima de 100%`, texto: 'Reduza alguma porcentagem para fechar em 100%.' };
    if (fechaEm100.value) return { tom: 'ok', titulo: 'Distribuição fechada em 100%', texto: 'Pronto para salvar.' };
    return { tom: 'aviso', titulo: `Resta distribuir ${pct(diferenca.value)}`, texto: 'Aumente alguma porcentagem ou adicione uma nova cota.' };
  }
  if (acima.value)
    return { tom: 'erro', titulo: `${pct(Math.abs(diferenca.value))} acima de 100%`, texto: 'Reduza alguma porcentagem para fechar em 100%.' };
  if (diferenca.value <= PCT_EPSILON)
    return { tom: 'erro', titulo: 'Nova cota sem porcentagem', texto: 'A última cota adicionada precisa receber mais de 0%. Reduza alguma porcentagem.' };
  return {
    tom: 'info',
    titulo: `A última cota adicionada recebe ${pct(diferenca.value)}`,
    texto: '100% menos a soma das demais cotas.',
  };
});

const resumoCores: Record<Resumo['tom'], { bg: string; fg: string; bar: string }> = {
  ok: { bg: 'var(--success-light)', fg: 'var(--success-dark)', bar: 'var(--success-base)' },
  aviso: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', bar: 'var(--warning-base)' },
  erro: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', bar: 'var(--danger-base)' },
  info: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)', bar: 'var(--gci-base)' },
};

function valorDe(pctValue: number): string {
  if (Number.isNaN(pctValue) || pctValue < 0) return '—';
  return brl(valorPorPct(pctValue, total.value));
}

function larguraBarra(pctValue: number): string {
  if (Number.isNaN(pctValue) || pctValue <= 0) return '0%';
  return `${Math.min(100, pctValue)}%`;
}

function invalidoExistente(e: LinhaExistente): boolean {
  const n = numeroOuNaN(e.texto);
  return Number.isNaN(n) || n < 0;
}

function salvar() {
  if (!podeSalvar.value) return;
  const resultado: SemiCota[] = [];
  for (const e of existentes.value) {
    const original = props.operacao.cotas.find((c) => c.id === e.id)!;
    const novoPct = numeroOuNaN(e.texto);
    if (novoPct > PCT_EPSILON) resultado.push(reaplicarCota(original, novoPct, total.value));
  }
  novas.value.forEach((n, i) => {
    resultado.push(novaCota(n.veiculo, pctDaNova(i), total.value));
  });
  emit('save', resultado);
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px; animation: fadeIn 0.2s ease-out"
  >
    <div
      class="flex flex-col"
      style="width: 100%; max-width: 820px; max-height: calc(100vh - 64px); background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <!-- Cabeçalho -->
      <div class="flex items-start justify-between" style="gap: 16px; padding: 24px 32px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div class="flex items-center" style="gap: 16px; min-width: 0">
          <div
            class="flex items-center justify-center"
            style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--agro-light); color: var(--agro-base); flex-shrink: 0"
          >
            <Split :size="22" />
          </div>
          <div style="min-width: 0">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
              Semiestruturadas · Cotas
            </div>
            <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2">
              Distribuir cotas
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
              {{ operacao.nome }} · altere as porcentagens ou adicione uma nova cota
            </p>
          </div>
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

      <div class="dist-body" style="flex: 1; overflow: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 20px; min-height: 0">
        <!-- Cota total -->
        <section
          class="relative overflow-hidden"
          style="background: var(--gci-base); border-radius: var(--radius-xl); padding: 22px 26px; color: #fff; box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.40)"
        >
          <div style="position: absolute; top: -70px; right: -60px; width: 220px; height: 220px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
          <div style="position: absolute; bottom: -100px; right: 120px; width: 200px; height: 200px; border-radius: 9999px; background: rgba(242,125,38,0.05)" />
          <div class="flex items-center justify-between" style="gap: 12px; position: relative; z-index: 1">
            <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase">
              Cota total
            </span>
            <button
              type="button"
              class="flex items-center btn-animated btn-agro"
              style="gap: 8px; height: 36px; padding: 0 14px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; text-transform: uppercase"
              @click="adicionarNova"
            >
              <Plus :size="14" />
              Adicionar nova cota
            </button>
          </div>
          <div class="flex items-end justify-between" style="gap: 12px; margin-top: 10px; position: relative; z-index: 1">
            <span style="font-size: 32px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
              {{ brl(total) }}
            </span>
            <span style="font-size: var(--text-2xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums; color: rgba(255,255,255,0.85); line-height: 1.2">
              100%
            </span>
          </div>
        </section>

        <!-- Lista de cotas -->
        <section>
          <div class="flex items-center justify-between" style="margin-bottom: 10px">
            <span class="dist-section">Cotas da operação</span>
            <span class="dist-section" style="letter-spacing: 0.10em">
              {{ existentes.length + novas.length }} cotas
            </span>
          </div>
          <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
            <div class="dist-row dist-head">
              <div>Veículo adquirente</div>
              <div>Porcentagem</div>
              <div style="text-align: right">Valor</div>
              <div />
            </div>

            <div class="dist-scroll">
            <div v-for="e in existentes" :key="e.id" class="dist-row">
              <div class="flex items-center" style="gap: 12px; min-width: 0">
                <div class="dist-tile" style="background: var(--gci-light); color: var(--gci-base)">
                  <Building2 :size="16" />
                </div>
                <div style="min-width: 0; flex: 1">
                  <div style="font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                    {{ e.veiculo }}
                  </div>
                  <div class="dist-bar">
                    <div class="dist-bar-fill" :style="{ width: larguraBarra(numeroOuNaN(e.texto)), background: 'var(--gci-base)' }" />
                  </div>
                </div>
              </div>
              <div class="dist-affix-wrap">
                <input
                  v-model="e.texto"
                  type="text"
                  inputmode="decimal"
                  class="dist-input dist-input-affixed"
                  :aria-label="`Porcentagem de ${e.veiculo}`"
                  :data-invalid="invalidoExistente(e) || acima"
                />
                <span class="dist-affix">%</span>
              </div>
              <div class="dist-valor">{{ valorDe(numeroOuNaN(e.texto)) }}</div>
              <div />
            </div>

            <div v-for="(n, i) in novas" :key="n.key" class="dist-row dist-row-nova">
              <div class="flex items-center" style="gap: 12px; min-width: 0">
                <div class="dist-tile" style="background: var(--gci-light); color: var(--gci-base)">
                  <Plus :size="16" />
                </div>
                <div style="min-width: 0; flex: 1">
                  <select v-model="n.veiculo" class="dist-input" :data-empty="n.veiculo === ''" aria-label="Veículo que adquire">
                    <option value="" disabled>Veículo que adquire</option>
                    <option v-for="v in veiculosParaLinha(n.veiculo)" :key="v" :value="v">{{ v }}</option>
                  </select>
                </div>
              </div>

              <div v-if="i === indiceUltima" class="dist-auto" :data-invalid="(pctUltima ?? 0) <= PCT_EPSILON">
                <span style="font-variant-numeric: tabular-nums">{{ pct(pctUltima ?? 0) }}</span>
                <span class="dist-auto-tag">automático</span>
              </div>
              <div v-else class="dist-affix-wrap">
                <input
                  v-model="n.texto"
                  type="text"
                  inputmode="decimal"
                  placeholder="0,00"
                  class="dist-input dist-input-affixed"
                  aria-label="Porcentagem da nova cota"
                  :data-invalid="Number.isNaN(numeroOuNaN(n.texto)) || acima"
                />
                <span class="dist-affix">%</span>
              </div>

              <div class="dist-valor">{{ valorDe(pctDaNova(i)) }}</div>

              <div class="flex items-center justify-end">
                <button
                  v-if="i === indiceUltima"
                  type="button"
                  aria-label="Remover nova cota"
                  class="dist-icon-btn"
                  @click="removerUltima"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
            </div>
          </div>
        </section>

        <!-- Resumo -->
        <section
          role="status"
          :style="{
            padding: '14px 18px',
            borderRadius: 'var(--radius-xl)',
            background: resumoCores[resumo.tom].bg,
            color: resumoCores[resumo.tom].fg,
          }"
        >
          <div class="flex items-center justify-between" style="gap: 12px">
            <div style="min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-bold)">{{ resumo.titulo }}</div>
              <div style="font-size: var(--text-xs); margin-top: 2px; opacity: 0.85">{{ resumo.texto }}</div>
            </div>
            <div style="text-align: right; flex-shrink: 0">
              <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
                {{ pct(somaDistribuida) }}
              </div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8">
                de 100%
              </div>
            </div>
          </div>
          <div style="margin-top: 10px; height: 6px; border-radius: 9999px; background: rgba(255,255,255,0.7); overflow: hidden">
            <div
              :style="{
                height: '100%',
                width: larguraBarra(somaDistribuida),
                borderRadius: '9999px',
                background: resumoCores[resumo.tom].bar,
                transition: 'width var(--duration-base) var(--ease-standard)',
              }"
            />
          </div>
        </section>
      </div>

      <!-- Rodapé -->
      <div class="flex items-center justify-between" style="gap: 10px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card); flex-shrink: 0">
        <button type="button" class="dist-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="dist-primary" :disabled="!podeSalvar" @click="salvar">
          Salvar distribuição
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dist-section {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.dist-row {
  display: grid;
  grid-template-columns: minmax(200px, 1.8fr) 150px minmax(130px, 1fr) 36px;
  align-items: center;
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
  border-top: 1px solid var(--border-default);
}
.dist-head {
  background: var(--surface-sunken);
  border-top: none;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.dist-row-nova {
  background: var(--surface-sunken);
}
.dist-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}
.dist-body > * {
  flex-shrink: 0;
}
.dist-scroll {
  max-height: 280px;
  overflow-y: auto;
}
.dist-bar {
  height: 4px;
  margin-top: 6px;
  border-radius: 9999px;
  background: var(--neutral-200);
  overflow: hidden;
}
.dist-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width var(--duration-base) var(--ease-standard);
}
.dist-valor {
  text-align: right;
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dist-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
  transition: border-color var(--duration-fast);
}
.dist-input:hover {
  border-color: var(--border-strong);
}
.dist-input[data-empty='true'] {
  color: var(--text-muted);
}
.dist-input[data-invalid='true'] {
  border-color: var(--danger-base);
  background: var(--danger-light);
}
.dist-auto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.dist-auto[data-invalid='true'] {
  border-color: var(--danger-base);
  color: var(--danger-dark);
}
.dist-auto-tag {
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.dist-auto[data-invalid='true'] .dist-auto-tag {
  color: var(--danger-base);
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
.dist-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
}
.dist-icon-btn:hover {
  background: var(--danger-light);
  border-color: var(--danger-base);
  color: var(--danger-dark);
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
  box-shadow: 0 8px 20px -8px rgba(8, 60, 74, 0.30);
}
.dist-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
  box-shadow: none;
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
