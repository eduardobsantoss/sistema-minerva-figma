<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlertTriangle, ArrowLeft, CheckCircle2, TrendingUp, Wallet } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  NIVEL_CONFIRMACAO_LABEL,
  PAGE_SIZE_OPTIONS,
  brl,
  cessoesDoCliente,
  corAlertaComposicao,
  corAlertaRegistro,
  corConfirmacao,
  corFaixa,
  fmtPct,
  formatDateBR,
  grupoPorId,
  somarTotais,
  totaisTitulos,
  toneOf,
  veiculoPorId,
  type Cessao,
  type RecortePos,
} from '../data/gerencialData';

const props = defineProps<{ grupoId: string; recorte: RecortePos }>();
const emit = defineEmits<{ back: []; openCessao: [cessaoId: string] }>();

const incluirLiquidadas = ref(true);
const grupo = computed(() => grupoPorId(props.grupoId));
const lista = computed(() => cessoesDoCliente(props.grupoId, props.recorte, incluirLiquidadas.value));

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => lista.value,
  { defaultPageSize: 5 },
);

const grid = 'minmax(120px, 1fr) minmax(150px, 1.3fr) 120px 100px 110px 120px 150px 90px';

const totais = computed(() => somarTotais(lista.value.map((c) => totaisTitulos(c.titulos))));

const statusChip = computed(() => {
  const atual = grupo.value;
  if (!atual || atual.risco <= 0) return { label: 'SEM RISCO', color: 'var(--text-muted)' };
  if (atual.risco > atual.limite) return { label: 'ACIMA DO LIMITE', color: 'var(--danger-base)' };
  return { label: 'DENTRO DO LIMITE', color: 'var(--success-base)' };
});

const kpis = computed(() => {
  const atual = grupo.value;
  if (!atual) return [];
  return [
    { icon: Wallet, label: 'Limite', value: brl(atual.limite), hint: 'Limite do cliente' },
    { icon: TrendingUp, label: 'Risco', value: atual.risco <= 0 ? 'Sem risco' : brl(atual.risco), hint: statusChip.value.label.toLowerCase() },
    { icon: AlertTriangle, label: 'Inadimplência', value: brl(atual.inadimplencia), hint: atual.inadimplencia > 0 ? 'Há dívida' : 'Sem dívida' },
    { icon: CheckCircle2, label: 'Confirmação', value: fmtPct(totais.value.pctConfirmados), hint: brl(totais.value.valorConfirmados) },
    { icon: Wallet, label: 'Registro', value: fmtPct(totais.value.pctRegistrado), hint: brl(totais.value.valorRegistrado) },
  ];
});

function notif(c: Cessao) {
  return totaisTitulos(c.titulos);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px; flex-wrap: wrap">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 220px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Pós desembolso · Cliente
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ grupo?.nome ?? 'Cliente' }}
          <span
            class="flex items-center"
            :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.1em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusChip.color} 14%, transparent)`, color: statusChip.color }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusChip.color }" />
            {{ statusChip.label }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ grupo?.tipoCliente }} · {{ lista.length }} cessões no recorte
        </p>
        <div v-if="grupo" class="flex items-center" style="gap: 6px; flex-wrap: wrap; margin-top: 8px">
          <span v-if="!grupo.temGarantia" class="ger-pill" :style="toneOf('muted')">Sem garantia</span>
          <template v-else>
            <span class="ger-pill" :style="toneOf(corAlertaComposicao(grupo.composicaoAlerta))">{{ grupo.composicaoTexto }}</span>
            <span class="ger-pill" :style="toneOf(corAlertaRegistro(grupo.registroAlerta))">{{ grupo.registroTexto }}</span>
          </template>
        </div>
      </div>
      <label class="flex items-center" style="gap: 10px; font-size: var(--text-sm); color: var(--text-default)">
        <button
          type="button"
          class="ger-switch"
          :class="{ 'ger-switch--on': incluirLiquidadas }"
          role="switch"
          :aria-checked="incluirLiquidadas"
          aria-label="Incluir cessões liquidadas"
          @click="incluirLiquidadas = !incluirLiquidadas"
        >
          <span />
        </button>
        Incluir cessões liquidadas
      </label>
    </div>

    <div v-if="grupo" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
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
          <div
            style="font-size: var(--text-lg); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums"
            :style="{ color: k.label === 'Confirmação' || k.label === 'Registro' ? toneOf(corFaixa(k.label === 'Confirmação' ? totais.pctConfirmados : totais.pctRegistrado)).text : 'var(--text-strong)' }"
          >
            {{ k.value }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ k.hint }}</div>
        </div>
      </div>
    </div>

    <div class="ger-card">
      <div class="ger-scroll">
        <div style="min-width: 1080px">
          <div class="grid ger-table-head" :style="{ gridTemplateColumns: grid }">
            <div>Veículo</div>
            <div>Cessão</div>
            <div>Tipo</div>
            <div>Data</div>
            <div>Aberto</div>
            <div>Notificação</div>
            <div>Conf. atingida</div>
            <div>Dias</div>
          </div>
          <div v-if="pageItems.length === 0" style="padding: 40px 24px; text-align: center; color: var(--text-muted)">
            Nenhuma cessão neste recorte.
          </div>
          <div
            v-for="c in pageItems"
            :key="c.id"
            class="grid ger-row ger-row--click"
            :style="{ gridTemplateColumns: grid }"
            @click="emit('openCessao', c.id)"
          >
            <div :title="veiculoPorId(c.veiculoId)?.nome" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ veiculoPorId(c.veiculoId)?.nome }}
            </div>
            <div class="ger-strong" :title="c.nome" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ c.nome }}</div>
            <div>{{ c.tipoTitulo }}</div>
            <div class="ger-num">{{ formatDateBR(c.data) }}</div>
            <div class="ger-num">{{ brl(c.valorAberto) }}</div>
            <div>
              <span class="ger-pill" :style="toneOf(notif(c).pctNotificado >= 100 ? 'ok' : 'bad')">{{ brl(notif(c).valorNotificado) }}</span>
              <div class="ger-hint">{{ fmtPct(notif(c).pctNotificado) }}</div>
            </div>
            <div>
              <span class="ger-pill" :style="toneOf(corConfirmacao(notif(c).pctConfirmados, c.pctConfirmacaoEsperada))">
                {{ brl(notif(c).valorConfirmados) }}
              </span>
              <div class="ger-hint">
                {{ c.pctConfirmacaoEsperada == null ? 'sem meta' : fmtPct(c.pctConfirmacaoEsperada) }} / {{ fmtPct(notif(c).pctConfirmados) }}
              </div>
            </div>
            <div
              class="ger-num"
              :title="NIVEL_CONFIRMACAO_LABEL[c.nivelConfirmacao]"
              :style="{ color: c.nivelConfirmacao === 'confirmado' ? 'var(--status-success-text)' : 'var(--status-danger-text)', fontWeight: 'var(--weight-bold)' }"
            >
              {{ c.diasRestantes }}
            </div>
          </div>
        </div>
      </div>
      <TablePagination
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
