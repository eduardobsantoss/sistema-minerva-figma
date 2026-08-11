<script setup lang="ts">
import { computed, type Component } from 'vue';
import { ArrowLeft, Building2, Percent, Hash, Wallet, Layers } from 'lucide-vue-next';
import {
  brl,
  pct,
  num,
  type SemiOperacao,
  type SemiCota,
  type SemiParcelaStatus,
} from '../data/semiestruturadasData';

const props = defineProps<{ operacao: SemiOperacao; cota: SemiCota }>();
const emit = defineEmits<{ back: [] }>();

const statusTone: Record<SemiParcelaStatus, { bg: string; fg: string; label: string }> = {
  A_PAGAR: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', label: 'A PAGAR' },
  PAGO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', label: 'PAGO' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)', label: 'VENCIDO' },
};

interface InfoCard {
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}

const infoCards = computed<InfoCard[]>(() => [
  {
    icon: Building2,
    label: 'Veículo Adquirente',
    value: props.cota.veiculoAdquirente,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    icon: Percent,
    label: '% Adquirido',
    value: pct(props.cota.percentualAdquirido),
    tone: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  },
  {
    icon: Hash,
    label: 'Quantidade de Cotas',
    value: num(props.cota.quantidadeCotas),
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
  {
    icon: Wallet,
    label: 'Valor Unitário',
    value: brl(props.cota.valorUnitario),
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          Semiestruturadas · Cota
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ cota.veiculoAdquirente }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ operacao.nome }} · {{ operacao.tipo }}
        </p>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.40);
      "
    >
      <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Total da Cota
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(cota.valorTotal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Associada a {{ cota.veiculoAdquirente }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1"
      >
        <Layers :size="26" />
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in infoCards"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl)"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div style="min-width: 0">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div
            style="
              font-size: var(--text-md);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <Wallet :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Cronograma de Pagamentos
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ cota.cronograma.length }} parcelas / obrigações
          </div>
        </div>
      </div>

      <div
        v-if="!cota.cronograma.length"
        style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
      >
        Nenhum pagamento no cronograma.
      </div>

      <template v-else>
        <div
          class="grid"
          style="
            grid-template-columns: 64px 140px minmax(140px, 1.2fr) minmax(180px, 1.8fr) 120px;
            column-gap: 20px;
            padding: 14px 20px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Nº</div>
          <div>Vencimento</div>
          <div style="text-align: right; padding-right: 8px">Valor</div>
          <div>Tipo Obrigação</div>
          <div style="text-align: center">Status</div>
        </div>

        <div
          v-for="p in cota.cronograma"
          :key="p.id"
          class="grid items-center"
          style="
            grid-template-columns: 64px 140px minmax(140px, 1.2fr) minmax(180px, 1.8fr) 120px;
            column-gap: 20px;
            padding: 16px 20px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ p.numero }}
          </div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">
            {{ p.vencimento }}
          </div>
          <div style="text-align: right; padding-right: 8px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; white-space: nowrap">
            {{ brl(p.valor) }}
          </div>
          <div style="color: var(--text-strong); min-width: 0">
            {{ p.tipoObrigacao ?? '—' }}
          </div>
          <div style="text-align: center">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: statusTone[p.status].bg,
                color: statusTone[p.status].fg,
                whiteSpace: 'nowrap',
              }"
            >
              {{ statusTone[p.status].label }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
