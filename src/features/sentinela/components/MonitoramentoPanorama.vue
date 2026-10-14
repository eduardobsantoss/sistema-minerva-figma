<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CircleCheck,
  ClipboardList,
  Clock,
  Radar,
  ShieldAlert,
} from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import ConfirmTypedActionModal from '@/components/ui/ConfirmTypedActionModal.vue';
import EmptyState from '@/features/risco/screens/detail-tabs/shared/EmptyState.vue';
import { brl, fmtPct } from '@/features/risco/data/riscoData';
import { maskDocumentInput, onlyDigits } from '@/features/serasa/utils/serasaFormatters';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import AlertaTipoCard from './AlertaTipoCard.vue';
import SentinelaFiltersBar from './SentinelaFiltersBar.vue';
import TratativaModal from './TratativaModal.vue';
import SeveridadeChart from './charts/SeveridadeChart.vue';
import EvolucaoAlertasChart from './charts/EvolucaoAlertasChart.vue';
import ConcentracaoTopChart from './charts/ConcentracaoTopChart.vue';
import {
  BLOQUEIO_PHRASE,
  ESCOPO_OPCOES,
  FILTRO_VAZIO,
  SEVERIDADE_LABEL,
  TIPO_ALERTA_LABEL,
  TIPO_ENTIDADE_LABEL,
  formatDateBR,
  labelsEvolucao,
  linhasPorIds,
  montarPainel,
  rotuloRecorte,
  type EscopoSentinela,
  type FiltroSentinela,
  type ModoSentinela,
  type ModuloSentinela,
  type Severidade,
  type TipoAlerta,
} from '../data/sentinelaData';

const props = defineProps<{ modulo: ModuloSentinela }>();
const emit = defineEmits<{ back: [] }>();

const ESCOPO_COR: Record<EscopoSentinela, string> = {
  total: 'var(--gci-base)',
  fundo: 'var(--success-base)',
  cra: 'var(--warning-base)',
  cedente: 'var(--danger-base)',
  sacado: 'var(--accent)',
};

const { success, info } = useToast();
const modo = ref<ModoSentinela>('operacional');
const buscaDocumento = ref('');
const buscaNome = ref('');
const filtro = ref<FiltroSentinela>({ ...FILTRO_VAZIO, tiposAlerta: [] });
const modoTabs = [
  { key: 'operacional', label: 'Operacional', icon: ClipboardList },
  { key: 'gerencial', label: 'Gerencial', icon: BarChart3 },
];
const selected = ref<string[]>([]);
const drawerIds = ref<string[]>([]);
const bloqueioAberto = ref(false);
const bloqueadas = ref<string[]>([]);
const tratadas = ref<string[]>([]);
const meses = labelsEvolucao();

const painel = computed(() => montarPainel(props.modulo, filtro.value));
const linhasTabela = computed(() => {
  const base = modo.value === 'gerencial'
    ? painel.value.linhas.filter((linha) => linha.severidade === 'critico')
    : painel.value.linhas;
  const nome = buscaNome.value.trim().toLowerCase();
  const digits = onlyDigits(buscaDocumento.value);
  if (!nome && !digits) return base;
  return base.filter((linha) => {
    const nomeOk = !nome || linha.entidade.nome.toLowerCase().includes(nome);
    const docOk = !digits || linha.entidade.documento.includes(digits);
    return nomeOk && docOk;
  });
});
const piorSeveridade = computed<Severidade>(() => {
  if (painel.value.critico.quantidade > 0) return 'critico';
  if (painel.value.atencao.quantidade > 0) return 'atencao';
  return 'ok';
});
const kpis = computed(() => [
  {
    icon: Radar,
    title: 'Monitorados',
    tone: 'var(--text-strong)',
    primaryLabel: 'Entidades',
    primaryValue: String(painel.value.total.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(painel.value.total.exposicao),
  },
  {
    icon: AlertTriangle,
    title: 'Crítico',
    tone: 'var(--status-danger-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(painel.value.critico.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(painel.value.critico.exposicao),
  },
  {
    icon: Clock,
    title: 'Atenção',
    tone: 'var(--status-warning-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(painel.value.atencao.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(painel.value.atencao.exposicao),
  },
  {
    icon: CircleCheck,
    title: 'Ok',
    tone: 'var(--status-success-text)',
    primaryLabel: 'Entidades',
    primaryValue: String(painel.value.ok.quantidade),
    secondaryLabel: 'Exposição',
    secondaryValue: brl(painel.value.ok.exposicao),
  },
]);
const semAlertas = computed(() => painel.value.alertas.length === 0);
const recorte = computed(() => rotuloRecorte(filtro.value));
const drawerLinhas = computed(() => linhasPorIds(drawerIds.value, props.modulo));

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => linhasTabela.value, { defaultPageSize: 10 });

watch(filtro, () => setPage(1), { deep: true });
watch([buscaDocumento, buscaNome], () => setPage(1));
watch(modo, () => {
  selected.value = [];
  setPage(1);
});

const pageIds = computed(() => pageItems.value.map((linha) => linha.entidade.id));
const allPage = computed(() => pageIds.value.length > 0 && pageIds.value.every((id) => selected.value.includes(id)));
const somePage = computed(() => pageIds.value.some((id) => selected.value.includes(id)) && !allPage.value);

const titulo = computed(() => (props.modulo === 'credito' ? 'Monitoramento de Crédito' : 'Cedente/Sacado'));
const hintVazio = computed(() =>
  props.modulo === 'credito'
    ? 'Serasa, protesto e concentração sem apontamentos neste recorte.'
    : 'Serasa e protesto sem apontamentos neste recorte.',
);

const grid = computed(() =>
  modo.value === 'operacional'
    ? '36px 72px minmax(180px, 1.7fr) 96px 112px minmax(180px, 1.5fr) 148px 128px minmax(170px, 1.2fr) 112px 132px'
    : '72px minmax(180px, 1.8fr) 96px 112px minmax(180px, 1.4fr) 148px 128px 132px',
);

function tone(severidade: Severidade) {
  if (severidade === 'critico') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  if (severidade === 'atencao') return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
  return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
}

function setModo(key: string) {
  modo.value = key as ModoSentinela;
}

function setEscopo(key: string) {
  filtro.value = { ...filtro.value, escopo: key as FiltroSentinela['escopo'] };
}

function onDocumento(event: Event) {
  buscaDocumento.value = maskDocumentInput((event.target as HTMLInputElement).value);
}

function scopeBtnStyle(key: EscopoSentinela, on: boolean) {
  const color = ESCOPO_COR[key];
  return {
    height: '38px',
    padding: '0 14px',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-bold)',
    border: on ? `1px solid ${color}` : '1px solid var(--border-default)',
    background: on ? `color-mix(in srgb, ${color} 14%, transparent)` : 'var(--surface-card)',
    color: on ? color : 'var(--text-muted)',
  };
}

function toggleTipo(tipo: TipoAlerta) {
  const next = new Set(filtro.value.tiposAlerta);
  if (next.has(tipo)) next.delete(tipo);
  else next.add(tipo);
  filtro.value = { ...filtro.value, tiposAlerta: [...next] };
}

function toggleRow(id: string) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id];
}

function togglePage() {
  if (allPage.value) {
    const drop = new Set(pageIds.value);
    selected.value = selected.value.filter((id) => !drop.has(id));
  } else {
    selected.value = [...new Set([...selected.value, ...pageIds.value])];
  }
}

function abrir(ids: string[]) {
  const linhas = linhasPorIds(ids, props.modulo).filter((linha) => linha.alertas.length > 0);
  if (linhas.length === 0) {
    info('Nenhum alerta para registrar neste recorte.');
    return;
  }
  drawerIds.value = linhas.map((linha) => linha.entidade.id);
}

function registrar() {
  const ids = drawerLinhas.value.map((linha) => linha.entidade.id);
  const merged = new Set([...tratadas.value, ...ids]);
  tratadas.value = [...merged];
  success(ids.length === 1 ? `Tratativa registrada para ${drawerLinhas.value[0].entidade.nome}.` : `Tratativa registrada para ${ids.length} entidades.`);
  selected.value = selected.value.filter((id) => !ids.includes(id));
  drawerIds.value = [];
}

function confirmarBloqueio() {
  const id = drawerIds.value[0];
  if (!id || bloqueadas.value.includes(id)) {
    bloqueioAberto.value = false;
    return;
  }
  bloqueadas.value = [...bloqueadas.value, id];
  const nome = drawerLinhas.value[0]?.entidade.nome ?? 'entidade';
  success(`Novas operações bloqueadas para ${nome}.`);
  bloqueioAberto.value = false;
}

function encaminhar() {
  const n = painel.value.critico.quantidade;
  success(n > 0 ? `${n} críticos encaminhados ao time operacional.` : 'Time operacional avisado. Nenhum crítico neste recorte.');
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 16px; min-width: 0">
        <button
          type="button"
          aria-label="Voltar para a visão geral"
          class="sn-focus flex items-center justify-center"
          style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
          @click="emit('back')"
        >
          <ArrowLeft :size="20" />
        </button>
        <div style="min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Sentinela
        </div>
        <h1 class="flex items-center" style="gap: 10px; flex-wrap: wrap; font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ titulo }}
          <span class="sn-chip" :style="tone(piorSeveridade)">{{ SEVERIDADE_LABEL[piorSeveridade] }}</span>
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
          {{ painel.total.quantidade }} entidades · {{ brl(painel.total.exposicao) }} · {{ recorte }}
        </p>
        </div>
      </div>
      <button
        v-if="modo === 'gerencial'"
        type="button"
        class="sn-focus btn-animated btn-primary"
        style="height: 44px; padding: 0 16px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold)"
        @click="encaminhar"
      >
        Encaminhar ao time operacional
      </button>
    </div>

    <SegmentedToggle variant="brand" :options="modoTabs" :model-value="modo" @update:model-value="setModo" />

    <SentinelaFiltersBar :filtro="filtro" :modulo="modulo" @update:filtro="filtro = $event">
      <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
        <button
          v-for="opt in ESCOPO_OPCOES"
          :key="opt.key"
          type="button"
          class="sn-focus"
          :style="scopeBtnStyle(opt.key, filtro.escopo === opt.key)"
          @click="setEscopo(opt.key)"
        >
          {{ opt.label }}
        </button>
      </div>
    </SentinelaFiltersBar>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px"
      >
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="18" />
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ kpi.title }}</div>
        </div>
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px">
          {{ kpi.primaryLabel }}
        </div>
        <div
          :style="{
            fontSize: '28px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            color: kpi.tone,
            marginBottom: '14px',
          }"
        >
          {{ kpi.primaryValue }}
        </div>
        <div class="flex items-center justify-between" style="padding-top: 12px; border-top: 1px solid var(--border-default)">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ kpi.secondaryValue }}</span>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px">
      <section style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Distribuição por severidade</h2>
        </div>
        <SeveridadeChart :critico="painel.critico.quantidade" :atencao="painel.atencao.quantidade" :ok="painel.ok.quantidade" />
      </section>
      <section style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Evolução de alertas</h2>
        </div>
        <EvolucaoAlertasChart :labels="meses" :valores="painel.evolucao" />
      </section>
      <section v-if="modulo === 'credito'" style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 20px">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <BarChart3 :size="16" style="color: var(--text-muted)" />
          <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Top 10 de concentração</h2>
        </div>
        <ConcentracaoTopChart :itens="painel.topConcentracao" />
      </section>
    </div>

    <div class="grid search-grid">
      <label class="search-field">
        <span class="filter-label">Documento</span>
        <input
          class="filter-input sn-focus"
          placeholder="CPF ou CNPJ"
          :value="buscaDocumento"
          inputmode="numeric"
          @input="onDocumento"
        />
      </label>
      <label class="search-field">
        <span class="filter-label">Nome</span>
        <input v-model="buscaNome" class="filter-input sn-focus" placeholder="Nome da entidade" />
      </label>
    </div>

    <EmptyState
      v-if="semAlertas"
      :icon="CircleCheck"
      tone="success"
      :title="`Nenhum alerta em ${recorte}`"
      :hint="hintVazio"
    />
    <div v-else class="grid" :style="{ gridTemplateColumns: `repeat(${painel.blocos.length}, minmax(0, 1fr))`, gap: '12px' }">
      <AlertaTipoCard
        v-for="bloco in painel.blocos"
        :key="bloco.tipo"
        :label="TIPO_ALERTA_LABEL[bloco.tipo]"
        :quantidade="bloco.quantidade"
        :exposicao="bloco.exposicao"
        :variacao-pct="bloco.variacaoPct"
        :active="filtro.tiposAlerta.includes(bloco.tipo)"
        @toggle="toggleTipo(bloco.tipo)"
      />
    </div>

    <div
      v-if="modo === 'operacional' && selected.length > 0"
      class="flex items-center justify-between"
      style="gap: 12px; padding: 10px 14px; background: var(--surface-selected); border: 1px solid var(--border-default); border-radius: var(--radius-lg); flex-wrap: wrap"
    >
      <span style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums">
        {{ selected.length }} selecionada{{ selected.length === 1 ? '' : 's' }}
      </span>
      <div class="flex items-center" style="gap: 8px">
        <button type="button" class="sn-focus" style="height: 36px; padding: 0 12px; background: var(--action-secondary-bg); color: var(--action-secondary-text); border: 1px solid var(--action-secondary-border); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm)" @click="selected = []">
          Limpar seleção
        </button>
        <button type="button" class="sn-focus btn-animated btn-primary" style="height: 36px; padding: 0 14px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-bold)" @click="abrir(selected)">
          Registrar tratativa
        </button>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
        <ShieldAlert :size="16" style="color: var(--text-muted)" />
        <h2 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ modo === 'gerencial' ? 'Críticos do recorte' : 'Entidades monitoradas' }}
        </h2>
        <span style="margin-left: auto; font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ linhasTabela.length }}
        </span>
      </div>
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid sn-head" :style="{ gridTemplateColumns: grid }">
            <div v-if="modo === 'operacional'">
              <Checkbox :checked="allPage" :indeterminate="somePage" @change="togglePage" />
            </div>
            <div>Classe</div>
            <div>Entidade</div>
            <div>Tipo</div>
            <div>Severidade</div>
            <div>Alertas</div>
            <div>Exposição (R$)</div>
            <div>% da carteira</div>
            <div v-if="modo === 'operacional'">Ação sugerida</div>
            <div v-if="modo === 'operacional'">Prazo</div>
            <div>Atualizado em</div>
          </div>

          <EmptyState
            v-if="linhasTabela.length === 0"
            :icon="ShieldAlert"
            :title="modo === 'gerencial' ? `Nenhum crítico em ${recorte}` : 'Nenhuma entidade no recorte'"
            hint="Ajuste o escopo ou os filtros para ver outras entidades."
          />

          <div
            v-for="linha in pageItems"
            :key="linha.entidade.id"
            class="grid items-center sn-row"
            :style="{ gridTemplateColumns: grid }"
          >
            <div v-if="modo === 'operacional'" @click.stop>
              <Checkbox :checked="selected.includes(linha.entidade.id)" @change="toggleRow(linha.entidade.id)" />
            </div>
            <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ linha.entidade.classe }}</div>
            <div>
              <Tooltip :content="linha.entidade.nome" side="top">
                <span style="font-weight: var(--weight-medium); color: var(--text-strong)">{{ linha.entidade.nome }}</span>
              </Tooltip>
              <div v-if="bloqueadas.includes(linha.entidade.id)" style="font-size: 10px; font-weight: var(--weight-bold); color: var(--status-danger-text); margin-top: 2px">
                Bloqueada
              </div>
            </div>
            <div style="color: var(--text-default)">{{ TIPO_ENTIDADE_LABEL[linha.entidade.tipo] }}</div>
            <div>
              <span class="sn-chip" :style="tone(linha.severidade)">{{ SEVERIDADE_LABEL[linha.severidade] }}</span>
            </div>
            <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
              <span v-if="linha.alertas.length === 0" style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
              <span v-for="alerta in linha.alertas" :key="alerta.id" class="sn-chip" :style="tone(alerta.severidade)">
                {{ TIPO_ALERTA_LABEL[alerta.tipo] }}
              </span>
            </div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ brl(linha.entidade.exposicao) }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ fmtPct(linha.pctCarteira) }}
            </div>
            <div v-if="modo === 'operacional'">
              <button
                v-if="linha.acaoSugerida"
                type="button"
                class="sn-focus"
                style="background: none; border: none; padding: 0; color: var(--text-link); font-weight: var(--weight-semibold); cursor: pointer; text-align: left; font-size: var(--text-sm)"
                @click="abrir([linha.entidade.id])"
              >
                {{ linha.acaoSugerida }}
              </button>
              <span v-else style="color: var(--text-muted); font-size: var(--text-sm)">Manter monitoramento</span>
            </div>
            <div v-if="modo === 'operacional'" style="font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ formatDateBR(linha.prazo) }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ formatDateBR(linha.entidade.atualizadoEm) }}
            </div>
          </div>
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

    <TratativaModal
      v-if="drawerLinhas.length > 0"
      :linhas="drawerLinhas"
      :bloqueadas="bloqueadas"
      :tratadas="tratadas"
      @close="drawerIds = []"
      @registrar="registrar"
      @bloquear="bloqueioAberto = true"
    />

    <ConfirmTypedActionModal
      v-if="bloqueioAberto"
      title="Bloquear novas operações"
      subtitle="A entidade deixa de receber novas operações neste protótipo."
      instruction="Digite BLOQUEAR-OPERACOES para confirmar o bloqueio."
      :confirm-phrase="BLOQUEIO_PHRASE"
      confirm-label="Bloquear"
      variant="danger"
      @close="bloqueioAberto = false"
      @confirm="confirmarBloqueio"
    />
  </div>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.search-grid {
  grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap: 10px;
  max-width: 560px;
}

.search-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.filter-input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}

.sn-head,
.sn-row {
  column-gap: 12px;
  padding: 12px 16px;
}

.sn-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  white-space: nowrap;
  color: var(--text-muted);
  text-transform: uppercase;
  align-items: center;
}

.sn-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.sn-row:hover {
  background: var(--surface-sunken);
}

.sn-chip {
  display: inline-flex;
  width: fit-content;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.03em;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
</style>
