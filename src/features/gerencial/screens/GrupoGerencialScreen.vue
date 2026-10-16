<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlertTriangle, ArrowLeft, CircleDollarSign, Layers, Settings2, Wallet } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  PAGE_SIZE_OPTIONS,
  brl,
  corConfirmacao,
  corNaoConfirmado,
  filtrarGerencial,
  fmtPct,
  formatDateBR,
  toneOf,
  totaisTitulos,
  veiculoPorId,
  type Cessao,
  type RecorteGerencial,
  type TotaisTitulos,
} from '../data/gerencialData';

const props = defineProps<{ grupoId: string; recorte: RecorteGerencial }>();
const emit = defineEmits<{ back: []; openCessao: [cessaoId: string] }>();

const visao = computed(() => filtrarGerencial(props.recorte).find((g) => g.grupo.id === props.grupoId));

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => visao.value?.cessoes ?? [],
  { defaultPageSize: 5 },
);

watch(() => props.grupoId, () => setPage(1));

type ColKey =
  | 'veiculo'
  | 'cessao'
  | 'data'
  | 'liquidacao'
  | 'titulos'
  | 'tipo'
  | 'valorCessao'
  | 'aberto'
  | 'vencido'
  | 'notificados'
  | 'confirmEsperada'
  | 'confirmados'
  | 'pre'
  | 'nao'
  | 'dispensado';

const ALL_COLS: { key: ColKey; label: string; width: string; align?: 'right' }[] = [
  { key: 'veiculo', label: 'Veículo', width: '150px' },
  { key: 'cessao', label: 'Cessão', width: 'minmax(180px, 1.4fr)' },
  { key: 'data', label: 'Data', width: '110px' },
  { key: 'liquidacao', label: 'Sit. Liquidação', width: '150px' },
  { key: 'titulos', label: 'Sit. Títulos', width: '170px' },
  { key: 'tipo', label: 'Tipo de Cessão', width: '150px' },
  { key: 'valorCessao', label: 'Valor cessão', width: '140px', align: 'right' },
  { key: 'aberto', label: 'Valor Aberto', width: '140px', align: 'right' },
  { key: 'vencido', label: 'Valor Vencido', width: '140px', align: 'right' },
  { key: 'notificados', label: 'Tít. Notificados', width: '150px', align: 'right' },
  { key: 'confirmEsperada', label: '% Confirmação Esperada', width: '160px', align: 'right' },
  { key: 'confirmados', label: 'Tít. Confirmados + Liquidados + Dispensados', width: '220px', align: 'right' },
  { key: 'pre', label: 'Tít. Pré Confirmados', width: '160px', align: 'right' },
  { key: 'nao', label: 'Tít. Não Confirmados', width: '170px', align: 'right' },
  { key: 'dispensado', label: 'Val. Dispensado', width: '140px', align: 'right' },
];

const visibleCols = ref<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
const colsMenuOpen = ref(false);
const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(() => cols.value.map((c) => c.width).join(' '));

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) {
    if (next.size === 1) return;
    next.delete(key);
  } else next.add(key);
  visibleCols.value = next;
}

const statusChip = computed(() => {
  const grupo = visao.value?.grupo;
  if (!grupo || grupo.risco <= 0) return { label: 'SEM RISCO', color: 'var(--text-muted)' };
  if (grupo.risco > grupo.limite) return { label: 'ACIMA DO LIMITE', color: 'var(--danger-base)' };
  return { label: 'DENTRO DO LIMITE', color: 'var(--success-base)' };
});

const somas = computed(() => {
  const cess = visao.value?.cessoes ?? [];
  return {
    valorCessao: cess.reduce((s, c) => s + c.valorCessao, 0),
    aberto: cess.reduce((s, c) => s + c.valorAberto, 0),
    vencido: cess.reduce((s, c) => s + c.valorVencido, 0),
    nao: cess.reduce((s, c) => s + totaisTitulos(c.titulos).valorNao, 0),
  };
});

const kpis = computed(() => [
  { icon: CircleDollarSign, label: 'Valor da cessão', value: brl(somas.value.valorCessao), hint: 'Soma das cessões do grupo' },
  { icon: Wallet, label: 'Valor aberto', value: brl(somas.value.aberto), hint: 'Soma dos veículos' },
  { icon: AlertTriangle, label: 'Valor vencido', value: brl(somas.value.vencido), hint: 'Soma dos veículos' },
  { icon: Wallet, label: 'Não confirmado', value: brl(somas.value.nao), hint: 'Soma dos títulos' },
]);

function totaisDa(c: Cessao): TotaisTitulos {
  return totaisTitulos(c.titulos);
}

const okBadge = { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
const mutedBadge = { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-default)' };
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Gerencial · Grupo empresarial
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ visao?.grupo.nome ?? 'Grupo empresarial' }}
          <span
            v-if="visao"
            class="flex items-center"
            :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusChip.color} 14%, transparent)`, color: statusChip.color }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusChip.color }" />
            {{ statusChip.label }}
          </span>
        </h2>
        <p v-if="visao" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Gerente: {{ visao.grupo.gerente ?? '—' }} · {{ visao.grupo.tipoCliente }}
        </p>
      </div>
    </div>

    <div v-if="visao" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
      >
        <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base); flex-shrink: 0">
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div style="min-width: 0">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ k.hint }}</div>
        </div>
      </div>
    </div>

    <div v-else style="padding: 32px; text-align: center; color: var(--text-muted); border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card)">
      Este grupo não está no recorte atual.
    </div>

    <div v-if="visao" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <Layers :size="20" />
        </div>
        <div style="flex: 1; min-width: 160px">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">Cessões do grupo</div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ total }} {{ total === 1 ? 'cessão' : 'cessões' }}
          </div>
        </div>
        <div style="position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="colsMenuOpen = !colsMenuOpen"
          >
            <Settings2 :size="16" />
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div class="cols-menu">
              <div class="cols-title">Colunas visíveis</div>
              <div v-for="c in ALL_COLS" :key="c.key" class="flex items-center cols-item" @click="toggleCol(c.key)">
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                {{ c.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="ger-tbl-head" :style="{ gridTemplateColumns: gridTemplate }">
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
          </div>
          <div v-if="pageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
            Nenhuma cessão neste recorte.
          </div>
          <div
            v-for="c in pageItems"
            :key="c.id"
            class="ger-tbl-row"
            :style="{ gridTemplateColumns: gridTemplate, color: c.liquidada ? 'var(--text-muted)' : undefined }"
            @click="emit('openCessao', c.id)"
          >
            <template v-for="col in cols" :key="col.key">
              <div v-if="col.key === 'veiculo'" class="cell-clip" :title="veiculoPorId(c.veiculoId)?.nome">
                {{ veiculoPorId(c.veiculoId)?.nome ?? '—' }}
              </div>
              <div v-else-if="col.key === 'cessao'" class="cell-strong cell-clip" :title="c.nome">{{ c.nome }}</div>
              <div v-else-if="col.key === 'data'" class="cell-num" style="text-align: left">{{ formatDateBR(c.data) }}</div>
              <div v-else-if="col.key === 'liquidacao'">
                <span class="badge" :style="c.liquidada ? mutedBadge : okBadge">
                  {{ c.liquidada ? 'Cessão liquidada' : 'Cessão aberta' }}
                </span>
              </div>
              <div v-else-if="col.key === 'titulos'">
                <span class="badge" :style="c.titulosEmCarteira && !c.liquidada ? okBadge : mutedBadge">
                  {{ c.titulosEmCarteira ? 'Títulos em carteira' : 'Títulos fora de carteira' }}
                </span>
              </div>
              <div v-else-if="col.key === 'tipo'">{{ c.tipoCessao }}</div>
              <div v-else-if="col.key === 'valorCessao'" class="cell-num">{{ brl(c.valorCessao) }}</div>
              <div v-else-if="col.key === 'aberto'" class="cell-num">{{ brl(c.valorAberto) }}</div>
              <div v-else-if="col.key === 'vencido'" class="cell-num">{{ brl(c.valorVencido) }}</div>
              <div v-else-if="col.key === 'notificados'" class="ger-tbl-stack">
                <div class="cell-num">{{ brl(totaisDa(c).valorNotificado) }}</div>
                <div class="ger-tbl-sub">{{ fmtPct(totaisDa(c).pctNotificado) }}</div>
              </div>
              <div v-else-if="col.key === 'confirmEsperada'" class="cell-num">
                {{ c.pctConfirmacaoEsperada == null ? '—' : fmtPct(c.pctConfirmacaoEsperada) }}
              </div>
              <div v-else-if="col.key === 'confirmados'" class="ger-tbl-stack">
                <div
                  class="cell-num"
                  :style="{ color: c.liquidada ? 'inherit' : toneOf(corConfirmacao(totaisDa(c).pctConfirmados, c.pctConfirmacaoEsperada, c.liquidada)).text, fontWeight: 'var(--weight-bold)' }"
                >
                  {{ brl(totaisDa(c).valorConfirmados) }}
                </div>
                <div class="ger-tbl-sub">{{ fmtPct(totaisDa(c).pctConfirmados) }}</div>
              </div>
              <div v-else-if="col.key === 'pre'" class="ger-tbl-stack">
                <div class="cell-num">{{ brl(totaisDa(c).valorPre) }}</div>
                <div class="ger-tbl-sub">{{ fmtPct(totaisDa(c).pctPre) }}</div>
              </div>
              <div v-else-if="col.key === 'nao'" class="ger-tbl-stack">
                <div
                  class="cell-num"
                  :style="{ color: c.liquidada ? 'inherit' : toneOf(corNaoConfirmado(totaisDa(c).pctNao, c.liquidada)).text, fontWeight: 'var(--weight-bold)' }"
                >
                  {{ brl(totaisDa(c).valorNao) }}
                </div>
                <div class="ger-tbl-sub">{{ fmtPct(totaisDa(c).pctNao) }}</div>
              </div>
              <div v-else class="cell-num">{{ brl(totaisDa(c).valorDispensado) }}</div>
            </template>
          </div>
        </div>
      </div>
      <TablePagination
        sunken
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-size-options="PAGE_SIZE_OPTIONS"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.cols-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 31;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  min-width: 280px;
  max-height: 360px;
  overflow-y: auto;
  padding: 8px;
}
.cols-title {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  padding: 6px 10px 10px;
}
.cols-item {
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
}
.cols-item:hover { background: var(--surface-sunken); }
.cell-strong { font-weight: var(--weight-semibold); color: var(--text-strong); }
.cell-clip { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cell-num { font-variant-numeric: tabular-nums; text-align: right; }
.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
