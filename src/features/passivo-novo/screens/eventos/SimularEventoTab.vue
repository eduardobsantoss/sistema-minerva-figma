<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { FileSpreadsheet, LayoutGrid, Landmark, Wallet } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import { useToast } from '@/composables/useToast';
import KpiStripCard from '../../components/KpiStripCard.vue';
import {
  brl,
  pu,
  isoToBr,
  CLASSE_LABEL,
  FAROL_TONE,
  defaultEventDate,
  simulateEvent,
  type EventConfig,
  type EventSimulation,
  type Farol,
  type Serie,
  type Veiculo,
} from '../../data/passivoNovoData';

const props = defineProps<{ veiculo: Veiculo }>();
const { success } = useToast();

interface RowState {
  selected: boolean;
  dateKey: string;
  afLeadDays: number;
  cash: string;
  interest: boolean;
  ordinaryAmortization: boolean;
  amex: boolean;
  rescue: boolean;
  premium: boolean;
}

function emptyState(dateKey: string): RowState {
  return {
    selected: false,
    dateKey,
    afLeadDays: 5,
    cash: '',
    interest: true,
    ordinaryAmortization: false,
    amex: false,
    rescue: false,
    premium: false,
  };
}

const globalDate = ref(defaultEventDate(props.veiculo.dataBaseIso));
const filter = ref('');
const rowState = reactive<Record<string, RowState>>({});

function hydrateStates() {
  Object.keys(rowState).forEach((k) => delete rowState[k]);
  for (const s of props.veiculo.series) {
    rowState[s.id] = emptyState(globalDate.value);
  }
}

hydrateStates();

function stateOf(serie: Serie): RowState {
  return rowState[serie.id] ?? emptyState(globalDate.value);
}

watch(
  () => props.veiculo.id,
  () => {
    globalDate.value = defaultEventDate(props.veiculo.dataBaseIso);
    filter.value = '';
    hydrateStates();
  },
);

const visibleSeries = computed(() => {
  const q = filter.value.trim().toLowerCase();
  return props.veiculo.series.filter((s) => {
    if (!q) return true;
    return (
      CLASSE_LABEL[s.classe].toLowerCase().includes(q) ||
      s.ifCodigo.toLowerCase().includes(q) ||
      s.nome.toLowerCase().includes(q)
    );
  });
});

function parseCash(raw: string, fallback: number): number {
  const n = Number(String(raw).replace(/\./g, '').replace(',', '.'));
  if (!raw.trim()) return fallback;
  return Number.isFinite(n) ? n : fallback;
}

function configFor(serie: Serie): EventConfig {
  const st = stateOf(serie);
  return {
    dateKey: st.dateKey || globalDate.value,
    afLeadDays: st.afLeadDays,
    interest: st.interest,
    ordinaryAmortization: st.ordinaryAmortization,
    amex: st.amex,
    rescue: st.rescue,
    premium: st.premium,
    premiumPct: st.premium ? 2 : 0,
    cash: parseCash(st.cash, props.veiculo.caixa),
  };
}

function simFor(serie: Serie): EventSimulation {
  return simulateEvent(serie, configFor(serie));
}

const selectedSeries = computed(() =>
  props.veiculo.series.filter((s) => stateOf(s).selected),
);

const selectedSims = computed(() =>
  selectedSeries.value.map((s) => ({ serie: s, sim: simFor(s) })),
);

const summary = computed(() => {
  const sims = selectedSims.value;
  const eventValue = sims.reduce((a, x) => a + x.sim.eventValue, 0);
  const cashAfter = sims.length
    ? Math.min(...sims.map((x) => x.sim.cashAfter))
    : props.veiculo.caixa;
  return {
    count: sims.length,
    eventValue,
    cashAfter,
  };
});

const summaryKpis = computed(() => [
  {
    icon: LayoutGrid,
    label: 'Séries selecionadas',
    value: String(summary.value.count),
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    icon: Landmark,
    label: 'Valor do evento',
    value: brl(summary.value.eventValue, true),
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    icon: Wallet,
    label: 'Saldo pós-evento',
    value: brl(summary.value.cashAfter, true),
    tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  },
]);

function applyGlobalDate() {
  for (const s of props.veiculo.series) {
    stateOf(s).dateKey = globalDate.value;
  }
}

function selectVisible() {
  for (const s of visibleSeries.value) {
    stateOf(s).selected = true;
  }
}

function suggestCash() {
  const share = props.veiculo.caixa;
  for (const s of visibleSeries.value) {
    stateOf(s).cash = String(Math.round(share));
  }
}

function clearSelection() {
  for (const s of props.veiculo.series) {
    stateOf(s).selected = false;
  }
}

function farolOf(serie: Serie): Farol {
  const st = stateOf(serie);
  if (!st.selected) return 'sem-evento';
  return simFor(serie).farol;
}

const cols = [
  'Sel.',
  'Série',
  'IF',
  'Qtd.',
  'Data',
  'AF (DU)',
  'Caixa',
  'Juros',
  'Amort.',
  'AMEX',
  'Resgate',
  'Prêmio',
  'PU antes',
  'Juros PU',
  'PU evento',
  'Valor',
  'PU pós',
  'Caixa pós',
  'AF até',
  'Farol',
];

const TABLE_COLS =
  '56px 110px 130px 80px 138px 80px 128px 56px 64px 56px 72px 64px 100px 100px 100px 110px 100px 110px 100px 110px';
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in summaryKpis" :key="kpi.label" v-bind="kpi" />
    </div>

    <section
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 18px 20px;
      "
    >
      <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
        Padrão de data
      </p>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 16px">
        Data geral do evento
      </h3>
      <div class="flex items-end" style="gap: 10px; flex-wrap: wrap">
        <label class="flex flex-col" style="gap: 6px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Data geral</span>
          <input v-model="globalDate" type="date" class="field-input" />
        </label>
        <button type="button" class="ghost-btn" @click="applyGlobalDate">Aplicar data a todas</button>
        <label class="flex flex-col" style="gap: 6px; flex: 1; min-width: 180px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Filtrar</span>
          <input v-model="filter" type="search" class="field-input" placeholder="Série ou IF" />
        </label>
        <button type="button" class="ghost-btn" @click="selectVisible">Selecionar visíveis</button>
        <button type="button" class="ghost-btn" @click="suggestCash">Sugerir caixa</button>
        <button type="button" class="ghost-btn" @click="clearSelection">Limpar</button>
      </div>
    </section>

    <section
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <LayoutGrid :size="16" style="color: var(--gci-base)" />
        <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          Parâmetros e cálculo por série
        </h3>
      </div>
      <div style="overflow-x: auto">
        <div style="min-width: 1680px">
          <div
            class="grid"
            :style="{
              gridTemplateColumns: TABLE_COLS,
              padding: '12px 16px',
              background: 'var(--surface-sunken)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              alignItems: 'center',
            }"
          >
            <div v-for="col in cols" :key="col" style="white-space: nowrap">{{ col }}</div>
          </div>
          <div
            v-for="serie in visibleSeries"
            :key="serie.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: TABLE_COLS,
              padding: '12px 16px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
            }"
          >
            <div>
              <Checkbox
                :checked="stateOf(serie).selected"
                @change="stateOf(serie).selected = !stateOf(serie).selected"
              />
            </div>
            <div style="font-weight: var(--weight-bold); white-space: nowrap">{{ CLASSE_LABEL[serie.classe] }}</div>
            <div style="white-space: nowrap">{{ serie.ifCodigo }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ serie.quantidade.toLocaleString('pt-BR') }}</div>
            <div>
              <input v-model="stateOf(serie).dateKey" type="date" class="cell-input" />
            </div>
            <div>
              <input v-model.number="stateOf(serie).afLeadDays" type="number" min="0" max="30" class="cell-input" style="width: 64px" />
            </div>
            <div>
              <input v-model="stateOf(serie).cash" type="text" class="cell-input" style="width: 110px" :placeholder="String(Math.round(veiculo.caixa))" />
            </div>
            <div><Checkbox :checked="stateOf(serie).interest" @change="stateOf(serie).interest = !stateOf(serie).interest" /></div>
            <div><Checkbox :checked="stateOf(serie).ordinaryAmortization" @change="stateOf(serie).ordinaryAmortization = !stateOf(serie).ordinaryAmortization" /></div>
            <div><Checkbox :checked="stateOf(serie).amex" @change="stateOf(serie).amex = !stateOf(serie).amex" /></div>
            <div><Checkbox :checked="stateOf(serie).rescue" @change="stateOf(serie).rescue = !stateOf(serie).rescue" /></div>
            <div><Checkbox :checked="stateOf(serie).premium" @change="stateOf(serie).premium = !stateOf(serie).premium" /></div>
            <template v-if="stateOf(serie).selected">
              <div style="font-variant-numeric: tabular-nums">{{ pu(simFor(serie).puBefore, 4) }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ pu(simFor(serie).interestPu, 4) }}</div>
              <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold)">{{ pu(simFor(serie).eventPu, 4) }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ brl(simFor(serie).eventValue, true) }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ pu(simFor(serie).puAfter, 4) }}</div>
              <div style="font-variant-numeric: tabular-nums">{{ brl(simFor(serie).cashAfter, true) }}</div>
              <div style="white-space: nowrap">{{ isoToBr(simFor(serie).afDeadline) }}</div>
              <div>
                <span
                  :style="{
                    fontSize: '10px',
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    background: FAROL_TONE[farolOf(serie)].bg,
                    color: FAROL_TONE[farolOf(serie)].fg,
                    whiteSpace: 'nowrap',
                  }"
                >
                  {{ FAROL_TONE[farolOf(serie)].label }}
                </span>
              </div>
            </template>
            <template v-else>
              <div v-for="n in 8" :key="n" style="color: var(--text-muted)">—</div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <section
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 18px 20px;
      "
    >
      <div class="flex items-center justify-between" style="margin-bottom: 16px; gap: 12px">
        <div>
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">
            Memória gerencial
          </p>
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Componentes por evento
          </h3>
        </div>
        <button
          type="button"
          class="flex items-center"
          style="
            gap: 8px;
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
          @click="success('Excel AF gerado (protótipo).')"
        >
          <FileSpreadsheet :size="16" />
          Gerar Excel AF
        </button>
      </div>

      <p v-if="!selectedSims.length" style="font-size: var(--text-sm); color: var(--text-muted)">
        Selecione uma série e os tipos de evento para gerar a memória.
      </p>
      <div v-else class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px">
        <article
          v-for="item in selectedSims"
          :key="item.serie.id"
          style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 14px"
        >
          <p style="font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 10px">
            {{ CLASSE_LABEL[item.serie.classe] }}
          </p>
          <div
            v-for="c in item.sim.components"
            :key="c.component"
            class="flex justify-between"
            style="gap: 8px; padding: 6px 0; border-top: 1px solid var(--border-default)"
          >
            <div>
              <p style="font-size: 12px; font-weight: var(--weight-semibold)">{{ c.component }}</p>
              <p style="font-size: 11px; color: var(--text-muted)">{{ c.detail }}</p>
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">
              <p style="font-size: 12px; font-weight: var(--weight-bold)">{{ brl(c.value) }}</p>
              <p v-if="c.pu != null" style="font-size: 11px; color: var(--text-muted)">PU {{ pu(c.pu, 4) }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ghost-btn {
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.field-input,
.cell-input {
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  color: var(--text-strong);
  font-size: var(--text-sm);
}
</style>
