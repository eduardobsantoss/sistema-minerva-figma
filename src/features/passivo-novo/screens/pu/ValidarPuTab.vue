<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { Landmark, Calendar, TrendingUp, Wallet, History, Layers, LayoutGrid } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import KpiStripCard from '../../components/KpiStripCard.vue';
import PuHistoricoProjetadoChart from '../../components/charts/PuHistoricoProjetadoChart.vue';
import ConfirmPuModal from './ConfirmPuModal.vue';
import {
  brl,
  pu,
  pct,
  num,
  CLASSE_LABEL,
  TAXA_TONE,
  type SerieClasse,
  type Serie,
  type Veiculo,
} from '../../data/passivoNovoData';

const props = defineProps<{ veiculo: Veiculo }>();
const { success } = useToast();

const serieIndex = ref(0);
const dateIso = ref(props.veiculo.dataBaseIso);
const modalMode = ref<'validar' | 'atualizar' | null>(null);

const SERIE_ICONS: Record<SerieClasse, Component> = {
  SR: Landmark,
  MEZ: Layers,
  SUB: LayoutGrid,
};

watch(
  () => props.veiculo.id,
  () => {
    serieIndex.value = 0;
    dateIso.value = props.veiculo.dataBaseIso;
  },
);

const serie = computed<Serie>(() => props.veiculo.series[serieIndex.value] ?? props.veiculo.series[0]!);
const senior = computed(() => props.veiculo.series.find((s) => s.classe === 'SR'));
const serieTabs = computed(() =>
  props.veiculo.series.map((s) => ({
    key: s.id,
    label: s.nome,
    icon: SERIE_ICONS[s.classe],
  })),
);

function setSerie(id: string) {
  const i = props.veiculo.series.findIndex((s) => s.id === id);
  if (i >= 0) serieIndex.value = i;
}

const history = computed(() => serie.value.historicoPu);
const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(history, {
  defaultPageSize: 10,
});

const kpis = computed(() => [
  {
    icon: Landmark,
    label: 'Valor total sênior',
    value: brl(senior.value?.valor ?? 0, true),
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    icon: Wallet,
    label: 'Próx. pagamento',
    value: brl(senior.value?.proximoPagamentoValor ?? 0, true),
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    icon: Calendar,
    label: 'Vencimento',
    value: props.veiculo.vencimento,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
  {
    icon: TrendingUp,
    label: 'PU SUB residual',
    value: pu(props.veiculo.puSubResidual, 4),
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
]);

const HIST_COLS = '1fr 1fr 0.7fr 1fr 1.3fr 1.2fr 1.2fr 1.1fr';

function confirmModal() {
  const mode = modalMode.value;
  modalMode.value = null;
  if (mode === 'validar') success('PU validado. AF seria notificado (protótipo).');
  else success('PU D-1 atualizado (protótipo).');
}

function field(label: string, value: string) {
  return { label, value };
}

const fields = computed(() => [
  field('Classe', serie.value.nome),
  field('IF', serie.value.ifCodigo),
  field('Tipo', serie.value.tipo),
  field('Data inicial', serie.value.dataInicio),
  field('Vencimento', serie.value.vencimento),
  field('VNU inicial', pu(serie.value.valorNominalInicial, 4)),
  field('Quantidade', num(serie.value.quantidade, 0)),
  field('Principal residual', pu(serie.value.principalResidual, 4)),
  field('PU', pu(serie.value.pu, 6)),
  field('Valor total', brl(serie.value.valor)),
  field('Remuneração', serie.value.remuneracao),
  field('Próx. pagamento', brl(serie.value.proximoPagamentoValor)),
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
          Data-base
        </span>
        <button
          v-for="chip in veiculo.dateChips"
          :key="chip.iso"
          type="button"
          :style="{
            height: '32px',
            padding: '0 12px',
            borderRadius: '9999px',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'var(--weight-bold)',
            background: dateIso === chip.iso ? 'var(--gci-base)' : 'var(--surface-card)',
            color: dateIso === chip.iso ? '#fff' : 'var(--text-strong)',
          }"
          @click="dateIso = chip.iso"
        >
          {{ chip.label }}
        </button>
      </div>
      <div class="flex" style="gap: 8px">
        <button type="button" class="ghost-btn" @click="modalMode = 'atualizar'">
          Atualizar PU
        </button>
        <button
          type="button"
          style="
            height: 40px;
            padding: 0 16px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            text-transform: uppercase;
          "
          @click="modalMode = 'validar'"
        >
          Validar PU
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>

    <SegmentedToggle
      :model-value="serie.id"
      :options="serieTabs"
      variant="brand"
      @update:model-value="setSerie"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="grid" style="grid-template-columns: 1.6fr 1fr; gap: 24px; align-items: start">
        <div class="flex flex-col" style="gap: 24px">
          <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; gap: 0; border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
            <div
              v-for="f in fields"
              :key="f.label"
              style="padding: 14px 16px; border-bottom: 1px solid var(--border-default); border-right: 1px solid var(--border-default)"
            >
              <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
                {{ f.label }}
              </p>
              <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ f.value }}
              </p>
            </div>
          </div>

          <PuHistoricoProjetadoChart :historico="serie.historicoPu" />

          <div>
            <div class="flex items-center" style="gap: 8px; margin-bottom: 12px">
              <History :size="16" style="color: var(--gci-base)" />
              <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                Histórico diário
              </h4>
            </div>
            <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
              <div style="overflow-x: auto">
                <div style="min-width: 760px">
                  <div
                    class="grid"
                    :style="{
                      gridTemplateColumns: HIST_COLS,
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
                    <div>Taxa a.a.</div>
                    <div>DU</div>
                    <div>VN</div>
                    <div>PU atualizado</div>
                    <div>PU juros</div>
                    <div>Evento</div>
                    <div>Status taxa</div>
                  </div>
                  <div
                    v-for="row in pageItems"
                    :key="row.id"
                    class="grid items-center hist-row"
                    :style="{
                      gridTemplateColumns: HIST_COLS,
                      padding: '12px 16px',
                      borderTop: '1px solid var(--border-default)',
                      fontSize: 'var(--text-sm)',
                      background: row.dataIso === dateIso ? 'var(--gci-light)' : 'transparent',
                    }"
                  >
                    <div style="font-weight: var(--weight-bold); white-space: nowrap">{{ row.data }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ pct(row.taxaAa) }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ row.du }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ pu(row.valorNominal, 4) }}</div>
                    <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">{{ pu(row.puAtualizado, 6) }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ pu(row.puJuros, 6) }}</div>
                    <div>{{ row.evento }}</div>
                    <div>
                      <span
                        :style="{
                          fontSize: '10px',
                          fontWeight: 'var(--weight-bold)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          background: TAXA_TONE[row.statusTaxa].bg,
                          color: TAXA_TONE[row.statusTaxa].fg,
                        }"
                      >
                        {{ row.statusTaxa }}
                      </span>
                    </div>
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
          </div>
        </div>

        <aside class="flex flex-col" style="gap: 16px">
          <section style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 16px">
            <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
              Previsão próximos dias
            </h4>
            <div class="flex flex-col" style="gap: 8px">
              <div
                v-for="row in serie.previsao"
                :key="row.dataIso"
                class="flex items-center justify-between"
                style="gap: 8px"
              >
                <span style="font-size: var(--text-sm); color: var(--text-muted)">
                  {{ row.data }}
                  <span
                    v-if="row.ehDataPagamentoTs"
                    style="margin-left: 6px; font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent)"
                  >
                    Pgto TS
                  </span>
                </span>
                <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
                  {{ pu(row.pu, 4) }}
                </span>
              </div>
            </div>
          </section>

          <section style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 16px">
            <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
              Eventos realizados
            </h4>
            <p v-if="!serie.eventosRealizados.length" style="font-size: var(--text-sm); color: var(--text-muted)">
              Nenhum evento nesta série.
            </p>
            <div v-else class="flex flex-col" style="gap: 10px">
              <div v-for="ev in serie.eventosRealizados" :key="ev.data + ev.componente">
                <p style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                  {{ ev.data }} · {{ ev.componente }}
                </p>
                <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                  PU {{ pu(ev.puEvento, 4) }} · {{ brl(ev.valorEvento, true) }} · {{ ev.detalhe }}
                </p>
              </div>
            </div>
          </section>

          <section style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 16px">
            <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
              Acumulação D-1
            </h4>
            <div class="flex flex-col" style="gap: 8px">
              <div class="flex justify-between"><span style="font-size: var(--text-sm); color: var(--text-muted)">PU</span><strong style="font-size: var(--text-sm); font-variant-numeric: tabular-nums">{{ pu(serie.acumulacaoD1.pu, 6) }}</strong></div>
              <div class="flex justify-between"><span style="font-size: var(--text-sm); color: var(--text-muted)">Juros</span><strong style="font-size: var(--text-sm); font-variant-numeric: tabular-nums">{{ pu(serie.acumulacaoD1.juros, 6) }}</strong></div>
              <div class="flex justify-between"><span style="font-size: var(--text-sm); color: var(--text-muted)">Fator</span><strong style="font-size: var(--text-sm); font-variant-numeric: tabular-nums">{{ pu(serie.acumulacaoD1.fator, 6) }}</strong></div>
              <div class="flex justify-between"><span style="font-size: var(--text-sm); color: var(--text-muted)">DU</span><strong style="font-size: var(--text-sm); font-variant-numeric: tabular-nums">{{ serie.acumulacaoD1.du }}</strong></div>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <ConfirmPuModal
      v-if="modalMode"
      :mode="modalMode"
      :pu-value="serie.pu"
      :date-iso="dateIso"
      :serie-nome="serie.nome"
      @close="modalMode = null"
      @confirm="confirmModal"
    />
  </div>
</template>

<style scoped>
.ghost-btn {
  height: 40px;
  padding: 0 16px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hist-row {
  transition: background var(--duration-fast);
}
.hist-row:hover {
  background: var(--surface-sunken);
}
</style>
