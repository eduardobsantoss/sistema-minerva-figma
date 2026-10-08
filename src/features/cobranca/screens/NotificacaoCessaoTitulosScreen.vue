<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, BadgeCheck, CheckCircle2, Clock, FileText, Wallet, XCircle } from 'lucide-vue-next';
import { brl, type Titulo } from '../data/titulosData';
import {
  situacaoGrupoColor,
  situacaoGrupoLabel,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ notificacao: NotificacaoCessao; titulos: Titulo[] }>();
const emit = defineEmits<{ back: []; openTitulo: [id: string] }>();

const rows = computed(() =>
  props.notificacao.titulosGrupoIds
    .map((id) => props.titulos.find((t) => t.id === id))
    .filter((t): t is Titulo => Boolean(t)),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, {
  defaultPageSize: 10,
});

const valorTotal = computed(() => rows.value.reduce((soma, t) => soma + t.vrNominal, 0));
const gerados = computed(() => rows.value.filter((t) => t.boletoGeradoEm).length);

const kpis = computed(() => [
  {
    label: 'Valor dos títulos',
    value: brl(valorTotal.value),
    icon: Wallet,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Títulos',
    value: String(rows.value.length),
    icon: FileText,
    tone: { bg: 'color-mix(in srgb, var(--agro-base) 14%, transparent)', fg: 'var(--agro-base)' },
  },
  {
    label: 'Boletos gerados',
    value: String(gerados.value),
    icon: BadgeCheck,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  },
  {
    label: 'Boletos pendentes',
    value: String(rows.value.length - gerados.value),
    icon: Clock,
    tone: { bg: 'color-mix(in srgb, var(--warning-base) 14%, transparent)', fg: 'var(--warning-base)' },
  },
]);

const GRID = 'minmax(110px, 0.9fr) minmax(160px, 1.3fr) minmax(130px, 1fr) minmax(120px, 1fr) minmax(170px, 1.2fr)';
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Notificações de cessão · {{ notificacao.protocolo }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Títulos de {{ notificacao.grupoEmpresarial }}
        </h2>
        <p
          class="flex items-center"
          style="gap: 8px; flex-wrap: wrap; margin-top: 4px; font-size: var(--text-sm); color: var(--text-muted)"
        >
          <span>{{ notificacao.sacado }} · {{ notificacao.veiculoNome }}</span>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${situacaoGrupoColor(notificacao.situacaoGrupo)} 14%, transparent)`,
              color: situacaoGrupoColor(notificacao.situacaoGrupo),
            }"
          >
            Grupo {{ situacaoGrupoLabel(notificacao.situacaoGrupo).toLowerCase() }}
          </span>
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

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid items-center row header" :style="{ gridTemplateColumns: GRID }">
            <div>Lastro</div>
            <div>Número</div>
            <div style="text-align: right">Valor</div>
            <div>Vencimento</div>
            <div>Boleto</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <FileText :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum título neste grupo
            </div>
          </div>

          <button
            v-for="t in pageItems"
            :key="t.id"
            type="button"
            class="grid items-center row body"
            :style="{ gridTemplateColumns: GRID }"
            @click="emit('openTitulo', t.id)"
          >
            <div>
              <span
                style="
                  display: inline-block;
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.06em;
                  padding: 2px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--gci-light);
                  color: var(--gci-base);
                  border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent);
                "
              >
                {{ t.lastro }}
              </span>
            </div>
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              #{{ t.numero }}
            </div>
            <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ brl(t.vrNominal) }}
            </div>
            <div style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums">
              {{ t.vencimento }}
            </div>
            <div class="flex items-center" style="gap: 8px">
              <CheckCircle2
                v-if="t.boletoGeradoEm"
                :size="15"
                :stroke-width="2.25"
                aria-hidden="true"
                style="color: var(--success-base); flex-shrink: 0"
              />
              <XCircle
                v-else
                :size="15"
                :stroke-width="2.25"
                aria-hidden="true"
                style="color: var(--danger-base); flex-shrink: 0"
              />
              <span
                :style="{
                  fontVariantNumeric: 'tabular-nums',
                  color: t.boletoGeradoEm ? 'var(--text-default)' : 'var(--text-muted)',
                }"
              >
                {{ t.boletoGeradoEm ? `Gerado em ${t.boletoGeradoEm}` : 'Não gerado' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
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
.row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
.header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.body {
  background: transparent;
  border: none;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  color: var(--text-default);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.body:hover {
  background: var(--surface-sunken);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
