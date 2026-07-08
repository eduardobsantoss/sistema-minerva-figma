<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrendingUp, Wallet, Clock } from 'lucide-vue-next';
import { brl, num, type Cra } from '../data/craData';
import DonutRing from './cra-card/DonutRing.vue';

const props = defineProps<{ cra: Cra }>();
const emit = defineEmits<{ open: [id: string] }>();

const hover = ref(false);

const craType = computed(() =>
  props.cra.operacoes.length > 0
    ? (props.cra.operacoes.every((o) => o.tipo === 'MONO CRA') ? 'MONO CRA' : 'MULTI CRA')
    : (props.cra.tipo ?? 'MULTI CRA'),
);
const craTypeColor = computed(() =>
  craType.value === 'MONO CRA'
    ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
    : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
);

const totalCarteira = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const totalVencido = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.vencido.valor, titulos: a.titulos + o.vencido.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const avgPartesRel = computed(() =>
  props.cra.operacoes.length
    ? props.cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.pct, 0) / props.cra.operacoes.length
    : 0,
);
const totalPartesRelValor = computed(() =>
  props.cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.valor, 0),
);
const avgNovosSacados = computed(() =>
  props.cra.operacoes.length
    ? props.cra.operacoes.reduce((a, o) => a + o.novosSacados.pct, 0) / props.cra.operacoes.length
    : 0,
);
const totalNovosSacadosValor = computed(() =>
  props.cra.operacoes.reduce((a, o) => a + o.novosSacados.valor, 0),
);

</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '14px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', cra.id)"
  >
    <!-- Header: tag + nome + status -->
    <div class="flex items-start justify-between" style="gap: 8px">
      <div style="flex: 1; min-width: 0">
        <div class="flex items-center" style="gap: 8px; margin-bottom: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; padding: 3px 8px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">
            CRA
          </span>
        </div>
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.25;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ cra.nome }}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.4">
          {{ cra.cessionaria }} · {{ cra.cnpj }}
        </div>
      </div>
      <span
        class="flex items-center"
        style="
          gap: 5px;
          flex-shrink: 0;
          margin-top: 4px;
          white-space: nowrap;
          font-size: 9px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--success-dark);
          background: var(--success-light);
          padding: 5px 10px;
          border-radius: 9999px;
        "
      >
        <TrendingUp :size="10" :stroke-width="2.5" />
        EM ANDAMENTO
      </span>
    </div>

    <!-- CRA type badge -->
    <div>
      <span
        :style="{
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '5px 10px',
          borderRadius: 'var(--radius-sm)',
          background: craTypeColor.bg,
          color: craTypeColor.fg,
        }"
      >
        {{ craType }}
      </span>
    </div>

    <!-- Carteira vs Vencido -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
      <div>
        <div class="flex items-center" style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
          <Wallet :size="11" /> Valor em Carteira
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(totalCarteira.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px">
          Títulos: <strong style="color: var(--text-default)">{{ num(totalCarteira.titulos) }}</strong>
        </div>
      </div>
      <div style="text-align: right">
        <div class="flex items-center" style="gap: 5px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; justify-content: flex-end">
          <Clock :size="11" /> Valor em Vencido
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums">
          {{ brl(totalVencido.valor) }}
        </div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px">
          Títulos: <strong style="color: var(--danger-base)">{{ num(totalVencido.titulos) }}</strong>
        </div>
      </div>
    </div>

    <!-- Donut metrics -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 2px">
      <div class="flex items-center" style="gap: 10px">
        <DonutRing :pct="avgPartesRel" color="var(--danger-base)" track-color="var(--danger-light)" />
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: var(--danger-base); letter-spacing: 0.04em; margin-bottom: 3px">
            Partes Relacionadas
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(totalPartesRelValor) }}
          </div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 10px; justify-content: flex-end; flex-direction: row">
        <DonutRing :pct="avgNovosSacados" color="#7C3AED" track-color="#EDE9FE" />
        <div style="text-align: right">
          <div style="font-size: 10px; font-weight: var(--weight-bold); color: #7C3AED; letter-spacing: 0.04em; margin-bottom: 3px">
            Novos Sacados
          </div>
          <div style="font-size: 11px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(totalNovosSacadosValor) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
