<script setup lang="ts">
import { computed } from 'vue';
import {
  Briefcase,
  Landmark,
  Wallet,
  LayoutGrid,
  Clock,
  ShieldAlert,
  Percent,
  FileText,
  Users,
  Calendar,
} from 'lucide-vue-next';
import KpiStripCard from '../../../components/KpiStripCard.vue';
import { brl, pct, num, pu, type Veiculo } from '../../../data/passivoNovoData';
import { type LaminaBundle } from '../../../data/laminaData';

const props = defineProps<{ veiculo: Veiculo; lamina: LaminaBundle }>();

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

const kpisSecundarios = computed(() => [
  {
    label: 'Despesas / provisões',
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
    label: 'Cobertura de caixa',
    value: pct(props.veiculo.coberturaCaixa),
    icon: Percent,
    tone: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  },
]);

const resumo = computed(() => props.lamina.resumoComplementar);

const POS_COLS = '1.4fr 1fr 1.4fr 1.1fr 1.4fr';
const COMP_COLS = '1fr 1fr 1fr';
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
        v-for="row in lamina.posicaoCotas"
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
        <FileText :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Dados complementares
        </h3>
      </div>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COMP_COLS,
          padding: '16px',
          gap: '16px',
        }"
      >
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Valor nominal
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
            {{ brl(resumo.valorNominal) }}
          </p>
        </div>
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Cedentes / Sacados
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
            <Users :size="14" style="display: inline; vertical-align: -2px; margin-right: 4px; color: var(--gci-base)" />
            {{ num(resumo.cedentes, 0) }} / {{ num(resumo.sacados, 0) }}
          </p>
        </div>
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Lastros ativos
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
            {{ num(resumo.lastrosAtivos, 0) }}
          </p>
        </div>
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Próx. pagamento sênior
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
            <Calendar :size="14" style="display: inline; vertical-align: -2px; margin-right: 4px; color: var(--gci-base)" />
            {{ resumo.proximoPagamentoSenior }}
          </p>
        </div>
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Carrego CRA
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
            {{ pct(resumo.carregoCraPct, 2) }} · {{ resumo.carregoCraAa }}
          </p>
        </div>
        <div style="padding: 12px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Prazo / taxa média
          </p>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
            {{ num(resumo.prazoMedioDias, 0) }} dias · {{ pct(resumo.taxaMediaPct, 2) }}
          </p>
        </div>
      </div>
      <div style="padding: 0 16px 16px; font-size: var(--text-xs); color: var(--text-muted)">
        Farol de pagamento: {{ resumo.farolPagamento }}
      </div>
    </div>
  </div>
</template>
