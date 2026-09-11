<script setup lang="ts">
import { computed } from 'vue';
import {
  Briefcase,
  Landmark,
  Wallet,
  LayoutGrid,
  Clock,
  ShieldAlert,
  FileText,
  Users,
  Calendar,
  Percent,
  AlertTriangle,
} from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import KpiStripCard from '../../../components/KpiStripCard.vue';
import { brl, pct, num, pu, type Veiculo } from '../../../data/passivoNovoData';
import { type LaminaBundle } from '../../../data/laminaData';

const props = defineProps<{ veiculo: Veiculo; lamina: LaminaBundle }>();

const BTG_FEE = 24_929_717.76;

const kpis = computed(() => [
  {
    label: 'Ativo',
    value: brl(props.veiculo.ativoTotal, true),
    icon: Briefcase,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Funding',
    value: brl(props.veiculo.funding, true),
    icon: Landmark,
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    label: 'Subordinada',
    value: brl(props.veiculo.subordinada, true),
    icon: LayoutGrid,
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
  {
    label: 'Caixa',
    value: brl(props.veiculo.caixa, true),
    icon: Wallet,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
]);

const resumo = computed(() => props.lamina.resumoComplementar);

const farolTone = computed(() => {
  const f = resumo.value.farolPagamento;
  if (f === 'OK') return { bg: 'var(--success-light)', fg: 'var(--success-base)' };
  if (f === 'Atencao') return { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' };
  return { bg: 'var(--status-neutral-bg)', fg: 'var(--text-muted)' };
});

const kpisSecundarios = computed(() => [
  {
    label: 'Despesas/provisões',
    value: brl(props.veiculo.despesas + props.veiculo.provisoes, true),
    icon: Clock,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
  {
    label: 'PDD',
    value: brl(props.veiculo.pdd, true),
    icon: ShieldAlert,
    tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  },
  {
    label: 'Farol pagamento',
    value: resumo.value.farolPagamento,
    hint: resumo.value.farolHint,
    icon: AlertTriangle,
    tone: farolTone.value,
  },
]);

const cra65Btg = computed(() => {
  if (props.veiculo.id !== 'cra-65') return null;
  const sub = props.veiculo.series.find((s) => s.classe === 'SUB');
  const qty = sub?.quantidade || 0;
  const official = props.veiculo.subordinada;
  if (!qty) return null;
  const simulated = official + BTG_FEE;
  const simulatedPu = simulated / qty;
  const base = sub?.valorNominalInicial || 100;
  return {
    pu: simulatedPu,
    rent: simulatedPu / base - 1,
    hint: `Sub + taxa BTG ${brl(BTG_FEE, true)}`,
  };
});

const complementares = computed(() => {
  const r = resumo.value;
  const items = [
    { label: 'Valor nominal', value: brl(r.valorNominal) },
    { label: 'Cedentes', value: num(r.cedentes, 0) },
    { label: 'Sacados', value: num(r.sacados, 0) },
    {
      label: 'Prox. pag. Senior',
      value: r.proximoPagamentoSeniorValor ? brl(r.proximoPagamentoSeniorValor, true) : '—',
      hint: r.proximoPagamentoSeniorData || undefined,
    },
    { label: 'Carrego CRA', value: pct(r.carregoCraPct, 2), hint: r.carregoCraAa },
    { label: 'Prazo médio', value: `${num(r.prazoMedioDias, 0)} dias` },
    { label: 'Taxa média', value: pct(r.taxaMediaPct, 2) },
    { label: 'Saldo revolvencia', value: brl(r.saldoRevolvencia, true) },
    { label: 'Patrimonio liquido', value: brl(r.patrimonioLiquido, true) },
    { label: 'Direitos cred. VN', value: brl(r.direitosCreditoriosVn, true) },
    { label: 'Direitos cred. VP', value: brl(r.direitosCreditoriosVp, true) },
    { label: 'DC em atraso', value: brl(r.dcAtraso, true) },
  ];
  if (cra65Btg.value) {
    items.push(
      { label: 'PU SUB sem taxa BTG', value: pu(cra65Btg.value.pu, 6), hint: cra65Btg.value.hint },
      { label: 'Rentabilidade acumulada sem taxa BTG', value: pct(cra65Btg.value.rent, 2), hint: `Valor simulado ${brl(props.veiculo.subordinada + BTG_FEE, true)}` },
    );
  }
  return items;
});

const POS_COLS = '1.4fr 1fr 1.4fr 1.1fr 1.4fr';

const posicaoCotas = computed(() => props.lamina.posicaoCotas);
const {
  page: posicaoPage,
  pageSize: posicaoPageSize,
  total: posicaoTotal,
  pageItems: posicaoPageItems,
  setPage: setPosicaoPage,
  setPageSize: setPosicaoPageSize,
} = useTablePagination(posicaoCotas, { defaultPageSize: 5 });

const posicaoTotais = computed(() => ({
  quantidade: posicaoCotas.value.reduce((sum, row) => sum + row.quantidade, 0),
  valorTotal: posicaoCotas.value.reduce((sum, row) => sum + row.valorTotal, 0),
}));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex flex-col" style="gap: 16px">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
        <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
      </div>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <KpiStripCard v-for="kpi in kpisSecundarios" :key="kpi.label" v-bind="kpi" />
      </div>
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
          Posição das cotas
        </h3>
      </div>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: POS_COLS,
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
      </div>
      <div
        v-for="row in posicaoPageItems"
        :key="row.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: POS_COLS,
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
      </div>
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: POS_COLS,
          padding: '12px 16px',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--surface-sunken)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
        }"
      >
        <div style="color: var(--text-strong)">Total</div>
        <div style="font-variant-numeric: tabular-nums">{{ num(posicaoTotais.quantidade, 0) }}</div>
        <div />
        <div />
        <div style="font-variant-numeric: tabular-nums">{{ brl(posicaoTotais.valorTotal) }}</div>
      </div>
      <TablePagination
        sunken
        compact
        :total="posicaoTotal"
        :page="posicaoPage"
        :page-size="posicaoPageSize"
        @update:page="setPosicaoPage"
        @update:page-size="setPosicaoPageSize"
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
      <div class="flex items-center justify-between" style="padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 10px">
          <FileText :size="16" style="color: var(--gci-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Dados complementares da posição
          </h3>
        </div>
        <span style="font-size: var(--text-xs); color: var(--text-muted)">
          {{ num(resumo.lastrosAtivos, 0) }} lastros ativos
        </span>
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; padding: 16px; gap: 16px">
        <div
          v-for="item in complementares"
          :key="item.label"
          style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
        >
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            {{ item.label }}
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
            <Users v-if="item.label === 'Cedentes' || item.label === 'Sacados'" :size="14" style="display: inline; vertical-align: -2px; margin-right: 4px; color: var(--gci-base)" />
            <Calendar v-else-if="item.label === 'Prox. pag. Senior'" :size="14" style="display: inline; vertical-align: -2px; margin-right: 4px; color: var(--gci-base)" />
            <Percent v-else-if="item.label === 'Carrego CRA' || item.label === 'Taxa média'" :size="14" style="display: inline; vertical-align: -2px; margin-right: 4px; color: var(--gci-base)" />
            {{ item.value }}
          </p>
          <p v-if="item.hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
            {{ item.hint }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
