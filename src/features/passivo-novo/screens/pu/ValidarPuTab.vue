<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Landmark, Calendar, TrendingUp, Wallet, History, Plus } from 'lucide-vue-next';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import KpiStripCard from '../../components/KpiStripCard.vue';
import PuHistoricoProjetadoChart from '../../components/charts/PuHistoricoProjetadoChart.vue';
import UnderlineSubTabs from '../../components/UnderlineSubTabs.vue';
import ConfirmPuModal from './ConfirmPuModal.vue';
import NovaCotaModal from './NovaCotaModal.vue';
import {
  addNovaCota,
  brl,
  pu,
  pct,
  num,
  isoToBr,
  TAXA_TONE,
  type HistoricoPuRow,
  type NovaCotaInput,
  type Serie,
  type TaxaStatus,
  type Veiculo,
} from '../../data/passivoNovoData';
import type { ValidarDateOption } from './ConfirmPuModal.vue';

const props = defineProps<{ veiculo: Veiculo }>();
const serieId = defineModel<string>('serieId', { default: '' });
const { success } = useToast();

const dateIso = ref(props.veiculo.dataBaseIso);
const modalMode = ref<'validar' | 'atualizar' | null>(null);
const showNovaCota = ref(false);

watch(
  () => props.veiculo.id,
  () => {
    dateIso.value = props.veiculo.dataBaseIso;
  },
);

watch(
  () => props.veiculo.series.map((s) => s.id).join('|'),
  () => {
    if (!props.veiculo.series.some((s) => s.id === serieId.value)) {
      serieId.value = props.veiculo.series[0]?.id ?? '';
    }
  },
  { immediate: true },
);

const serie = computed<Serie>(() => props.veiculo.series.find((s) => s.id === serieId.value) ?? props.veiculo.series[0]!);
const senior = computed(() => props.veiculo.series.find((s) => s.classe === 'SR'));
const serieTabs = computed(() => props.veiculo.series.map((s) => s.nome));
const activeSerieTab = computed({
  get: () => serie.value?.nome ?? '',
  set: (nome: string) => {
    const found = props.veiculo.series.find((s) => s.nome === nome);
    if (found) serieId.value = found.id;
  },
});

function confirmNovaCota(input: NovaCotaInput) {
  const created = addNovaCota(props.veiculo, input);
  serieId.value = created.id;
  showNovaCota.value = false;
  success(`${created.nome} criada.`);
}

type PuBand = 'passado' | 'hoje' | 'futuro';

interface TimelineRow extends HistoricoPuRow {
  band: PuBand;
}

const BAND_TABS: { key: PuBand; label: string }[] = [
  { key: 'passado', label: 'Passado' },
  { key: 'hoje', label: 'Presente' },
  { key: 'futuro', label: 'Futuro' },
];

const bandTab = ref<PuBand>('hoje');

const timeline = computed<TimelineRow[]>(() => {
  const today = dateIso.value;
  const hist = [...serie.value.historicoPu].sort((a, b) => a.dataIso.localeCompare(b.dataIso));
  const anchor = hist.find((h) => h.dataIso === today) ?? hist[hist.length - 1];
  const known = new Set(hist.map((h) => h.dataIso));
  const fromHist: TimelineRow[] = hist
    .filter((h) => h.dataIso !== today)
    .map((h) => ({
      ...h,
      band: h.dataIso < today ? 'passado' : 'futuro',
    }));
  const hoje: TimelineRow = anchor && anchor.dataIso === today
    ? { ...anchor, band: 'hoje' }
    : {
        id: `hoje-${today}`,
        data: isoToBr(today),
        dataIso: today,
        taxaAa: anchor?.taxaAa ?? 0,
        du: anchor?.du ?? serie.value.acumulacaoD1.du,
        valorNominal: anchor?.valorNominal ?? serie.value.principalResidual,
        puAtualizado: serie.value.pu,
        puJuros: Math.max(0, serie.value.pu - serie.value.principalResidual),
        evento: '—',
        statusTaxa: 'Divulgada' satisfies TaxaStatus,
        band: 'hoje',
      };
  const vn = anchor?.valorNominal ?? serie.value.principalResidual;
  const future: TimelineRow[] = serie.value.previsao
    .filter((p) => p.dataIso !== today && !known.has(p.dataIso))
    .map((p, i) => ({
      id: `prev-${serie.value.id}-${p.dataIso}`,
      data: p.data,
      dataIso: p.dataIso,
      taxaAa: anchor?.taxaAa ?? 0,
      du: (anchor?.du ?? 0) + i + 1,
      valorNominal: vn,
      puAtualizado: p.pu,
      puJuros: Math.max(0, p.pu - vn),
      evento: p.ehDataPagamentoTs ? 'Pgto TS' : '—',
      statusTaxa: 'Projetada',
      band: p.dataIso < today ? 'passado' : 'futuro',
    }));
  return [...fromHist, hoje, ...future].sort((a, b) => a.dataIso.localeCompare(b.dataIso));
});

const visibleRows = computed(() => timeline.value.filter((row) => row.band === bandTab.value));

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(visibleRows, {
  defaultPageSize: 5,
});

watch(bandTab, () => setPage(1));

const validarDates = computed<ValidarDateOption[]>(() => {
  const base = dateIso.value;
  const byIso = new Map<string, ValidarDateOption>();
  const histHit = serie.value.historicoPu.find((h) => h.dataIso === base);
  byIso.set(base, {
    iso: base,
    label: isoToBr(base),
    pu: histHit?.puAtualizado ?? serie.value.pu,
  });
  for (const row of serie.value.previsao) {
    if (byIso.has(row.dataIso)) continue;
    const hist = serie.value.historicoPu.find((h) => h.dataIso === row.dataIso);
    byIso.set(row.dataIso, {
      iso: row.dataIso,
      label: row.data,
      pu: hist?.puAtualizado ?? row.pu,
      payment: row.ehDataPagamentoTs,
    });
  }
  return [...byIso.values()].sort((a, b) => a.iso.localeCompare(b.iso));
});

const kpis = computed(() => [
  {
    icon: Landmark,
    label: 'Valor sênior',
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
      <label class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)">
          Data-base
        </span>
        <input v-model="dateIso" type="date" class="date-input" />
      </label>
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

    <div class="flex items-end justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 0">
        <UnderlineSubTabs v-model="activeSerieTab" :tabs="serieTabs" />
      </div>
      <button
        type="button"
        class="flex items-center"
        style="
          gap: 8px;
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
          flex-shrink: 0;
        "
        @click="showNovaCota = true"
      >
        <Plus :size="14" />
        Nova Cota
      </button>
    </div>

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
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
            <div class="flex items-center justify-between" style="gap: 16px; margin-bottom: 12px; flex-wrap: wrap">
              <div class="flex items-center" style="gap: 8px">
                <History :size="16" style="color: var(--gci-base)" />
                <div>
                  <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                    Histórico e projeção
                  </h4>
                  <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-top: 2px">
                    {{ visibleRows.length }} {{ visibleRows.length === 1 ? 'dia' : 'dias' }}
                  </p>
                </div>
              </div>
              <div class="flex" style="padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
                <button
                  v-for="tab in BAND_TABS"
                  :key="tab.key"
                  type="button"
                  class="band-tab"
                  :class="{ 'band-tab--active': bandTab === tab.key }"
                  @click="bandTab = tab.key"
                >
                  {{ tab.label }}
                </button>
              </div>
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
                  <p
                    v-if="!pageItems.length"
                    style="padding: 24px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); color: var(--text-muted)"
                  >
                    Nenhum dia neste período.
                  </p>
                  <div
                    v-for="row in pageItems"
                    :key="row.id"
                    class="grid items-center hist-row"
                    :style="{
                      gridTemplateColumns: HIST_COLS,
                      padding: '12px 16px',
                      borderTop: '1px solid var(--border-default)',
                      fontSize: 'var(--text-sm)',
                      background: row.band === 'hoje' ? 'var(--gci-light)' : 'transparent',
                      boxShadow: row.band === 'hoje' ? 'inset 3px 0 0 var(--gci-base)' : 'none',
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

          <section style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 16px">
            <h4 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 12px">
              Eventos realizados
            </h4>
            <p v-if="!serie.eventosRealizados.length" style="font-size: var(--text-sm); color: var(--text-muted)">
              Nenhum evento nesta série.
            </p>
            <div v-else class="flex flex-col" style="gap: 10px">
              <div v-for="(ev, i) in serie.eventosRealizados" :key="ev.data + ev.componente + i">
                <p style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                  {{ ev.data }} · {{ ev.componente }}
                </p>
                <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                  PU {{ pu(ev.puEvento, 4) }} · {{ brl(ev.valorEvento, true) }} · {{ ev.detalhe }}
                </p>
              </div>
            </div>
          </section>
      </div>
    </div>

    <ConfirmPuModal
      v-if="modalMode"
      :mode="modalMode"
      :pu-value="serie.pu"
      :date-iso="dateIso"
      :serie-nome="serie.nome"
      :dates="modalMode === 'validar' ? validarDates : undefined"
      @close="modalMode = null"
      @confirm="confirmModal"
    />
    <NovaCotaModal
      v-if="showNovaCota"
      :default-date-iso="veiculo.dataBaseIso"
      @close="showNovaCota = false"
      @confirm="confirmNovaCota"
    />
  </div>
</template>

<style scoped>
.date-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  color: var(--text-strong);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  outline: none;
}
.date-input:focus {
  border-color: var(--gci-base);
}
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
.band-tab {
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  background: transparent;
  color: var(--text-muted);
  box-shadow: none;
}
.band-tab--active {
  background: var(--surface-card);
  color: var(--text-strong);
  box-shadow: var(--shadow-xs);
}
.hist-row {
  transition: background var(--duration-fast);
}
.hist-row:hover {
  background: var(--surface-sunken);
}
</style>
