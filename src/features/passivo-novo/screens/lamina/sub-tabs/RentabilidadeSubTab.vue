<script setup lang="ts">
import { computed } from 'vue';
import { LayoutGrid, LineChart } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import PuEvolucaoChart from '../../../components/charts/PuEvolucaoChart.vue';
import { brl, pct, num, pu, type Veiculo } from '../../../data/passivoNovoData';
import {
  formatRentPct,
  type LaminaBundle,
} from '../../../data/laminaData';

const props = defineProps<{ veiculo: Veiculo; lamina: LaminaBundle }>();

function resultClass(n: number) {
  if (n > 0) return 'var(--success-base)';
  if (n < 0) return 'var(--danger-base)';
  return 'var(--text-muted)';
}

const COTAS_COLS = '1.4fr 1fr 1.4fr 1.1fr 1.4fr 0.9fr 0.9fr 1.1fr';

const cotasPrecificacao = computed(() => props.lamina.cotasPrecificacao);
const {
  page: cotasPage,
  pageSize: cotasPageSize,
  total: cotasTotal,
  pageItems: cotasPageItems,
  setPage: setCotasPage,
  setPageSize: setCotasPageSize,
} = useTablePagination(cotasPrecificacao, { defaultPageSize: 10 });

const rentDiaria = computed(() => props.lamina.rentabilidadeDiaria);
const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(rentDiaria, { defaultPageSize: 10 });

const historicoMensalSub = computed(() => props.lamina.historicoMensalSub);
const {
  page: histSubPage,
  pageSize: histSubPageSize,
  total: histSubTotal,
  pageItems: histSubPageItems,
  setPage: setHistSubPage,
  setPageSize: setHistSubPageSize,
} = useTablePagination(historicoMensalSub, { defaultPageSize: 10 });

const seriesNames = computed(() =>
  props.lamina.cotasPrecificacao.map((c) => c.serie),
);

const RENT_COLS = computed(() => {
  const base = '1fr';
  const series = seriesNames.value.map(() => '0.9fr').join(' ');
  return `${base} ${series} 1fr 1fr 1fr 1fr 1fr`;
});

const HIST_SUB_COLS = '0.8fr 1fr 1fr 1fr 1fr';
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <LayoutGrid :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Cotas e precificação
        </h3>
      </div>
      <div style="overflow-x: auto">
        <div style="min-width: 900px">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: COTAS_COLS,
              padding: '12px 16px',
              background: 'var(--surface-sunken)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }"
          >
            <div>Série</div>
            <div>Quantidade</div>
            <div>Taxa</div>
            <div>PU</div>
            <div>Valor total</div>
            <div>Dia</div>
            <div>Mês</div>
            <div>30 dias</div>
          </div>
          <div
            v-for="row in cotasPageItems"
            :key="row.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: COTAS_COLS,
              padding: '12px 16px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
            }"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ row.serie }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ num(row.quantidade, 0) }}</div>
            <div>{{ row.taxa }}</div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">
              {{ pu(row.pu, row.pu >= 100 ? 4 : 6) }}
            </div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(row.valorTotal) }}</div>
            <div :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.resultadoDia) }">
              {{ pct(row.resultadoDia, 3) }}
            </div>
            <div :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.resultadoMes) }">
              {{ pct(row.resultadoMes, 2) }}
            </div>
            <div :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.resultado30Dias) }">
              {{ pct(row.resultado30Dias, 2) }}
            </div>
          </div>
        </div>
      </div>
      <TablePagination
        sunken
        compact
        :total="cotasTotal"
        :page="cotasPage"
        :page-size="cotasPageSize"
        @update:page="setCotasPage"
        @update:page-size="setCotasPageSize"
      />
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <LineChart :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Rentabilidade diária
        </h3>
      </div>
      <div style="overflow-x: auto">
        <div style="min-width: 960px">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: RENT_COLS,
              padding: '12px 16px',
              background: 'var(--surface-sunken)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }"
          >
            <div>Data</div>
            <div v-for="name in seriesNames" :key="name">{{ name }}</div>
            <div>SUB acum. mês</div>
            <div>PU SR</div>
            <div>PL SR</div>
            <div>PU SUB</div>
            <div>PL SUB</div>
          </div>
          <div
            v-for="row in pageItems"
            :key="row.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: RENT_COLS,
              padding: '12px 16px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
            }"
          >
            <div style="font-weight: var(--weight-bold); white-space: nowrap">{{ row.data }}</div>
            <div
              v-for="name in seriesNames"
              :key="name"
              :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.seriesPct[name] ?? 0) }"
            >
              {{ formatRentPct(row.seriesPct[name] ?? 0, 2) }}
            </div>
            <div :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.subAcumMes) }">
              {{ formatRentPct(row.subAcumMes, 2) }}
            </div>
            <div style="font-variant-numeric: tabular-nums">{{ pu(row.puSr, 4) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(row.plSenior, true) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ pu(row.puSub, 4) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(row.plSub, true) }}</div>
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
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <LayoutGrid :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Histórico mensal da Subordinada
        </h3>
      </div>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: HIST_SUB_COLS,
          padding: '12px 16px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Mês</div>
        <div>Resultado</div>
        <div>CDI período</div>
        <div>% CDI</div>
        <div>PU fechamento</div>
      </div>
      <div
        v-for="row in histSubPageItems"
        :key="row.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: HIST_SUB_COLS,
          padding: '12px 16px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-weight: var(--weight-bold)">{{ row.mes }}</div>
        <div :style="{ fontVariantNumeric: 'tabular-nums', color: resultClass(row.resultadoMensal) }">
          {{ formatRentPct(row.resultadoMensal, 2) }}
        </div>
        <div style="font-variant-numeric: tabular-nums">{{ pct(row.cdiPeriodo, 2) }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ num(row.pctCdi, 2) }}x</div>
        <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">
          {{ pu(row.puFechamento, 4) }}
        </div>
      </div>
      <TablePagination
        sunken
        compact
        :total="histSubTotal"
        :page="histSubPage"
        :page-size="histSubPageSize"
        @update:page="setHistSubPage"
        @update:page-size="setHistSubPageSize"
      />
    </div>

    <PuEvolucaoChart :points="lamina.evolucaoPu" :series-labels="lamina.evolucaoSeriesLabels" />
  </div>
</template>
