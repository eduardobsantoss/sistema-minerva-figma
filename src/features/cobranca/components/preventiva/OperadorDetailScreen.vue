<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, BadgeCheck, Banknote, Percent, Users } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { brl, fmtPct, type ContatoOperador } from '../../data/cobrancaPreventivaData';

const props = defineProps<{ operador: string; contatos: ContatoOperador[] }>();
const emit = defineEmits<{ back: [] }>();

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => props.contatos, {
  defaultPageSize: 10,
});

const kpis = computed(() => {
  const sacados = props.contatos.length;
  const confirmados = props.contatos.filter((c) => c.confirmado).length;
  const valorConfirmado = props.contatos.reduce((acc, c) => acc + c.valorConfirmado, 0);
  const taxa = sacados === 0 ? 0 : (confirmados / sacados) * 100;
  return [
    {
      label: 'Sacados contactados',
      value: String(sacados),
      icon: Users,
      tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
    },
    {
      label: 'Confirmados',
      value: String(confirmados),
      icon: BadgeCheck,
      tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    },
    {
      label: 'Taxa de confirmação',
      value: fmtPct(taxa),
      icon: Percent,
      tone: { bg: 'color-mix(in srgb, var(--warning-base) 14%, transparent)', fg: 'var(--warning-base)' },
    },
    {
      label: 'Valor confirmado',
      value: brl(valorConfirmado),
      icon: Banknote,
      tone: { bg: 'color-mix(in srgb, var(--agro-base) 14%, transparent)', fg: 'var(--agro-base)' },
    },
  ];
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button type="button" aria-label="Voltar" class="back" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div class="eyebrow">Cobrança · Operador</div>
        <h2>{{ operador }}</h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Sacados contactados no período da análise.
        </p>
      </div>
    </div>

    <div class="grid kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi">
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: kpi.tone.bg, color: kpi.tone.fg, flexShrink: 0 }"
        >
          <component :is="kpi.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </div>
      </div>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div style="padding: 16px 20px">
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Sacados contactados</h3>
      </div>
      <div v-if="contatos.length === 0" class="empty">Nenhum sacado neste período.</div>
      <template v-else>
        <div class="grid op-row op-header" style="grid-template-columns: 1.6fr 1.2fr 70px 120px 110px">
          <div>Sacado</div>
          <div>CPF/CNPJ</div>
          <div style="text-align: right">Títulos</div>
          <div style="text-align: right">Valor a pagar</div>
          <div style="text-align: right">Último contato</div>
        </div>
        <div
          v-for="c in pageItems"
          :key="c.id"
          class="grid op-row"
          style="grid-template-columns: 1.6fr 1.2fr 70px 120px 110px"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.sacado }}</div>
          <div style="font-variant-numeric: tabular-nums">{{ c.documento }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ c.titulos }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(c.valorAPagar) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">
            {{ c.ultimoContato.split('-').reverse().join('/') }}
          </div>
        </div>
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.back {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  cursor: pointer;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.18em;
  color: var(--accent);
  text-transform: uppercase;
}
h2 {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-top: 4px;
}
.kpi-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 20px;
}
.kpi-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.kpi-value {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}
.op-row {
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.op-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.op-row:not(.op-header) {
  border-top: 1px solid var(--border-default);
}
.empty {
  padding: 28px 16px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
