<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Calculator, Download } from 'lucide-vue-next';
import { brl, type Title, type ParcelaCronograma } from '../../data/fidcsData';
import FieldLabel from './simular-valorizacao/FieldLabel.vue';
import FooterTotal from './simular-valorizacao/FooterTotal.vue';
import ToggleRow from './simular-valorizacao/ToggleRow.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ title: Title; cronograma: ParcelaCronograma[] }>();
const emit = defineEmits<{ close: [] }>();

interface LinhaSimulacao {
  data: string;
  saldoDevedor: number;
  juros: number;
  jurosAcumulado: number;
  valorPresente: number;
  amortizacaoPaga: number;
  jurosPago: number;
  valorPago: number;
  fatorCdi: number;
  fatorTaxa: number;
  fatorTotal: number;
}

function simular(title: Title, cronograma: ParcelaCronograma[]): LinhaSimulacao[] {
  let saldo = title.vrNominal;
  let jurosAcumulado = 0;
  let amortPaga = 0;
  let jurosPago = 0;
  return cronograma.map((c, i) => {
    jurosAcumulado += c.juros;
    saldo = Math.max(saldo - c.amortizacao, 0);
    amortPaga += c.amortizacao;
    jurosPago += c.juros;
    const fatorCdi = 1 + 0.0002 * (i + 1);
    const fatorTaxa = 1 + 0.00035 * (i + 1);
    return {
      data: c.vencimento,
      saldoDevedor: saldo,
      juros: c.juros,
      jurosAcumulado,
      valorPresente: saldo + jurosAcumulado,
      amortizacaoPaga: amortPaga,
      jurosPago,
      valorPago: c.amortizacao + c.juros,
      fatorCdi,
      fatorTaxa,
      fatorTotal: fatorCdi * fatorTaxa,
    };
  });
}

const dataSimular = ref('');
const cenarioSimulado = ref(false);
const linhas = ref<LinhaSimulacao[] | null>(null);

function handleSimular() {
  linhas.value = simular(props.title, props.cronograma);
  setPage(1);
}

const totalJuros = computed(() => linhas.value?.at(-1)?.jurosPago ?? 0);
const totalPago = computed(() => (linhas.value ? linhas.value.reduce((acc, l) => acc + l.valorPago, 0) : 0));

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => linhas.value ?? [], { defaultPageSize: 5 });
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1120px;
        height: 86vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Simular Valorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Título #{{ title.numero }} · projeção de saldo devedor e juros acumulados
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 24px">
          <div class="grid items-end" style="grid-template-columns: 1fr 1fr auto auto; gap: 14px">
            <div>
              <FieldLabel>Data para simular</FieldLabel>
              <input
                v-model="dataSimular"
                type="text"
                placeholder="dd/mm/aaaa"
                style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
              />
            </div>
            <ToggleRow label="Cenário simulado" :on="cenarioSimulado" @toggle="cenarioSimulado = !cenarioSimulado" />
            <button
              class="flex items-center"
              style="gap: 8px; height: 40px; padding: 0 20px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
              @click="handleSimular"
            >
              <Calculator :size="15" /> SIMULAR
            </button>
            <button
              class="flex items-center"
              style="gap: 8px; height: 40px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
            >
              <Download :size="14" /> GERAR CSV
            </button>
          </div>

          <div
            v-if="!linhas"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px dashed var(--border-default)"
          >
            <Calculator :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">Nenhuma simulação gerada</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">Informe a data desejada e clique em "Simular" para projetar a valorização do título.</div>
          </div>
          <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div style="overflow-x: auto">
              <div style="min-width: 1180px">
                <div class="grid" style="grid-template-columns: repeat(11, 1fr); padding: 10px 14px; background: var(--surface-sunken); font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
                  <div>Data</div><div>Saldo devedor</div><div>Juros</div><div>Juros acum.</div><div>Valor presente</div><div>Amort. paga</div><div>Juros pago</div><div>Valor pago</div><div>Fator CDI</div><div>Fator taxa</div><div>Fator total</div>
                </div>
                <div
                  v-for="(l, i) in pageItems"
                  :key="i"
                  class="grid items-center"
                  style="grid-template-columns: repeat(11, 1fr); padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
                >
                  <div style="color: var(--text-muted)">{{ l.data }}</div>
                  <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ brl(l.saldoDevedor) }}</div>
                  <div>{{ brl(l.juros) }}</div>
                  <div>{{ brl(l.jurosAcumulado) }}</div>
                  <div>{{ brl(l.valorPresente) }}</div>
                  <div>{{ brl(l.amortizacaoPaga) }}</div>
                  <div>{{ brl(l.jurosPago) }}</div>
                  <div style="font-weight: var(--weight-semibold)">{{ brl(l.valorPago) }}</div>
                  <div>{{ l.fatorCdi.toFixed(6) }}</div>
                  <div>{{ l.fatorTaxa.toFixed(6) }}</div>
                  <div>{{ l.fatorTotal.toFixed(6) }}</div>
                </div>
              </div>
            </div>
            <TablePagination
              sunken
              compact
              :total="total"
              :page="page"
              :page-size="pageSize"
              @update:page="setPage"
              @update:page-size="setPageSize"
            />
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; padding: 14px 20px; border-top: 1px solid var(--border-default); background: var(--surface-sunken)">
              <FooterTotal label="Amortização Paga" :value="brl(linhas.at(-1)?.amortizacaoPaga ?? 0)" />
              <FooterTotal label="Juros Pago" :value="brl(totalJuros)" />
              <FooterTotal label="Valor Total Pago" :value="brl(totalPago)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>
