<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  AlertTriangle,
  FileText,
  BellRing,
  Receipt,
  CalendarClock,
  ChevronRight,
  Search,
  BadgeCheck,
} from 'lucide-vue-next';
import {
  TITULOS_SEED,
  brl,
  pct,
  isVencido,
  isVincendoHoje,
  isNaoBoletado,
  isNaoNotificado,
  getResumoPorVeiculo,
  getResumoPorCliente,
  getBoletagemPorVeiculo,
  getNotificacoesPendentesPorCliente,
  getConfirmacoesPendentesPorCliente,
} from '../data/titulosData';
import TituloDetailScreen from './TituloDetailScreen.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const emit = defineEmits<{ navigate: [view: string] }>();

type Route = { level: 'dashboard' } | { level: 'titulo'; id: string };

const route = ref<Route>({ level: 'dashboard' });
const query = ref('');
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const titulos = ref(TITULOS_SEED.map((t) => ({ ...t })));

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'titulo' ? titulos.value.find((t) => t.id === r.id) : undefined;
});

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 2400);
}

function todayBR() {
  return new Date().toLocaleDateString('pt-BR');
}

const valorCarteira = computed(() => titulos.value.reduce((s, t) => s + t.vrNominal, 0));
const valorVencido = computed(() =>
  titulos.value.filter(isVencido).reduce((s, t) => s + t.vrAberto, 0),
);
const pctVencido = computed(() =>
  valorCarteira.value > 0 ? (valorVencido.value / valorCarteira.value) * 100 : 0,
);

const vincendoHoje = computed(() => titulos.value.filter(isVincendoHoje));
const valorVincendoHoje = computed(() =>
  vincendoHoje.value.reduce((s, t) => s + t.vrAberto, 0),
);
const pctVincendo = computed(() =>
  valorCarteira.value > 0 ? (valorVincendoHoje.value / valorCarteira.value) * 100 : 0,
);

const semBoleto = computed(() => titulos.value.filter(isNaoBoletado));
const valorNaoBoletado = computed(() =>
  semBoleto.value.reduce((s, t) => s + t.vrAberto, 0),
);

const naoNotificados = computed(() =>
  titulos.value.filter((t) => isNaoNotificado(t) && t.vrAberto > 0),
);
const valorNaoNotificado = computed(() =>
  naoNotificados.value.reduce((s, t) => s + t.vrAberto, 0),
);
const pctNotificacao = computed(() => {
  const comAberto = titulos.value.filter((t) => t.vrAberto > 0);
  if (comAberto.length === 0) return 100;
  const notificados = comAberto.filter((t) => t.statusNotificacao === 'NOTIFICADO').length;
  return (notificados / comAberto.length) * 100;
});

interface KpiHero {
  icon: Component;
  title: string;
  tone: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

const kpis = computed<KpiHero[]>(() => [
  {
    icon: AlertTriangle,
    title: 'Inadimplência Geral',
    tone: 'var(--danger-base)',
    primaryLabel: 'Valor vencido',
    primaryValue: brl(valorVencido.value),
    secondaryLabel: '% vencidos na carteira',
    secondaryValue: pct(pctVencido.value),
  },
  {
    icon: CalendarClock,
    title: 'Vincendo Hoje',
    tone: 'var(--warning-base)',
    primaryLabel: 'Valor vincendo hoje',
    primaryValue: brl(valorVincendoHoje.value),
    secondaryLabel: '% vincendo',
    secondaryValue: pct(pctVincendo.value),
  },
  {
    icon: Receipt,
    title: 'Boletagem',
    tone: 'var(--agro-base)',
    primaryLabel: 'Valor não boletado',
    primaryValue: brl(valorNaoBoletado.value),
    secondaryLabel: 'Títulos não boletados',
    secondaryValue: String(semBoleto.value.length),
  },
  {
    icon: BellRing,
    title: 'Notificação',
    tone: 'var(--gci-base)',
    primaryLabel: 'Valor não notificado',
    primaryValue: brl(valorNaoNotificado.value),
    secondaryLabel: '% notificação geral',
    secondaryValue: pct(pctNotificacao.value),
  },
]);

const vencidosPorVeiculo = computed(() => getResumoPorVeiculo(titulos.value));
const vencidosPorCliente = computed(() => getResumoPorCliente(titulos.value));
const boletagemPorVeiculo = computed(() => getBoletagemPorVeiculo(titulos.value));
const notifsPendentes = computed(() => getNotificacoesPendentesPorCliente(titulos.value));
const confirmacoesPendentes = computed(() => getConfirmacoesPendentesPorCliente(titulos.value));

const {
  page: veiculoPage,
  pageSize: veiculoPageSize,
  total: veiculoTotal,
  pageItems: veiculoPageItems,
  setPage: setVeiculoPage,
  setPageSize: setVeiculoPageSize,
} = useTablePagination(() => vencidosPorVeiculo.value, { defaultPageSize: 10 });

const {
  page: clientePage,
  pageSize: clientePageSize,
  total: clienteTotal,
  pageItems: clientePageItems,
  setPage: setClientePage,
  setPageSize: setClientePageSize,
} = useTablePagination(() => vencidosPorCliente.value, { defaultPageSize: 10 });

const {
  page: boletaPage,
  pageSize: boletaPageSize,
  total: boletaTotal,
  pageItems: boletaPageItems,
  setPage: setBoletaPage,
  setPageSize: setBoletaPageSize,
} = useTablePagination(() => boletagemPorVeiculo.value, { defaultPageSize: 10 });

const {
  page: notifPage,
  pageSize: notifPageSize,
  total: notifTotal,
  pageItems: notifPageItems,
  setPage: setNotifPage,
  setPageSize: setNotifPageSize,
} = useTablePagination(() => notifsPendentes.value, { defaultPageSize: 10 });

const {
  page: confPage,
  pageSize: confPageSize,
  total: confTotal,
  pageItems: confPageItems,
  setPage: setConfPage,
  setPageSize: setConfPageSize,
} = useTablePagination(() => confirmacoesPendentes.value, { defaultPageSize: 10 });

const searchResults = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return titulos.value
    .filter(
      (t) =>
        t.numero.toLowerCase().includes(q) ||
        t.cedente.toLowerCase().includes(q) ||
        t.sacado.toLowerCase().includes(q),
    )
    .slice(0, 6);
});

function openTitulo(id: string) {
  route.value = { level: 'titulo', id };
  query.value = '';
}

function handleGerarBoleto(id: string) {
  titulos.value = titulos.value.map((t) =>
    t.id === id ? { ...t, boletoGeradoEm: todayBR() } : t,
  );
  showToast('Boleto gerado (mock)');
}

function handleNotificarTitulo(id: string) {
  titulos.value = titulos.value.map((t) =>
    t.id === id
      ? { ...t, ultimaNotificacaoEm: todayBR(), statusNotificacao: 'NOTIFICADO' }
      : t,
  );
  showToast('Notificação enviada (mock)');
}

function handleConfirmar(id: string) {
  titulos.value = titulos.value.map((t) =>
    t.id === id ? { ...t, statusConfirmacao: 'CONFIRMADO' } : t,
  );
  showToast('Ativo confirmado (mock)');
}

function handleNegociar(id: string) {
  titulos.value = titulos.value.map((t) =>
    t.id === id ? { ...t, emNegociacao: true } : t,
  );
  showToast('Negociação sinalizada');
}

const VEICULO_GRID = 'minmax(140px, 1.6fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(80px, 0.8fr) minmax(70px, 0.7fr)';
const CLIENTE_GRID = 'minmax(120px, 1.3fr) minmax(160px, 1.8fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(80px, 0.8fr)';
const BOLETA_GRID = 'minmax(140px, 1.6fr) minmax(120px, 1.2fr) minmax(90px, 0.9fr) minmax(90px, 0.9fr)';
const NOTIF_GRID = 'minmax(120px, 1.3fr) minmax(160px, 1.8fr) minmax(110px, 1.1fr) minmax(90px, 0.9fr)';
const CONF_GRID = 'minmax(110px, 1.2fr) minmax(150px, 1.6fr) minmax(100px, 1fr) minmax(80px, 0.8fr) minmax(80px, 0.8fr)';
</script>

<template>
  <TituloDetailScreen
    v-if="tituloAtual"
    :titulo="tituloAtual"
    @back="route = { level: 'dashboard' }"
    @gerar-boleto="handleGerarBoleto"
    @notificar="handleNotificarTitulo"
    @confirmar="handleConfirmar"
    @negociar="handleNegociar"
  />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 6px;
          "
        >
          Cobrança
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
          "
        >
          Dashboard
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Visão geral da carteira: inadimplência, boletagem e notificações
        </p>
      </div>

      <div style="position: relative; width: 320px">
        <Search
          :size="15"
          style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="query"
          placeholder="Buscar título por nº, cedente ou sacado"
          style="
            width: 100%;
            height: 42px;
            padding: 0 14px 0 38px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />
        <div
          v-if="searchResults.length > 0"
          style="
            position: absolute;
            top: 46px;
            left: 0;
            right: 0;
            z-index: 40;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            overflow: hidden;
          "
        >
          <button
            v-for="t in searchResults"
            :key="t.id"
            class="flex items-center justify-between dash-search-item"
            style="
              width: 100%;
              padding: 10px 14px;
              background: none;
              border: none;
              border-top: 1px solid var(--border-default);
              cursor: pointer;
              text-align: left;
            "
            @click="openTitulo(t.id)"
          >
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                #{{ t.numero }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted)">{{ t.sacado }}</div>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted)" />
          </button>
        </div>
      </div>
    </div>

    <!-- KPI cards com valor em destaque -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 20px;
        "
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
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ kpi.title }}
          </div>
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
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ kpi.secondaryValue }}
          </span>
        </div>
      </div>
    </div>

    <!-- Containers linha 1 -->
    <div class="grid dash-two-col" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <!-- Vencidos por Veículo -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div class="flex items-center" style="gap: 10px">
            <AlertTriangle :size="16" style="color: var(--danger-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Vencidos por Veículo
            </h3>
          </div>
          <button class="dash-link" @click="emit('navigate', 'cobranca-titulos')">Ver todos</button>
        </div>
        <div v-if="vencidosPorVeiculo.length === 0" class="dash-empty">Nenhum veículo com vencidos.</div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: VEICULO_GRID }">
            <div>Veículo</div>
            <div style="text-align: right">Carteira</div>
            <div style="text-align: right">Vencido</div>
            <div style="text-align: right">Inadimp.</div>
            <div style="text-align: right">PDD</div>
          </div>
          <div
            v-for="r in veiculoPageItems"
            :key="r.veiculoId"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: VEICULO_GRID }"
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
              {{ r.veiculoNome }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ brl(r.valorCarteira, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--danger-base)">
              {{ brl(r.valorVencido, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--danger-base)">
              {{ pct(r.pctInadimplencia) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-muted)">
              {{ pct(r.pctPdd) }}
            </div>
          </div>
          <TablePagination
            :total="veiculoTotal"
            :page="veiculoPage"
            :page-size="veiculoPageSize"
            @update:page="setVeiculoPage"
            @update:page-size="setVeiculoPageSize"
          />
        </template>
      </div>

      <!-- Vencidos por Cliente -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div class="flex items-center" style="gap: 10px">
            <AlertTriangle :size="16" style="color: var(--danger-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Vencidos por Cliente
            </h3>
          </div>
          <button class="dash-link" @click="emit('navigate', 'cobranca-titulos')">Ver todos</button>
        </div>
        <div v-if="vencidosPorCliente.length === 0" class="dash-empty">Nenhum cliente inadimplente.</div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: CLIENTE_GRID }">
            <div>Veículo</div>
            <div>Cliente</div>
            <div style="text-align: right">Total</div>
            <div style="text-align: right">Vencido</div>
            <div style="text-align: right">Inadimp.</div>
          </div>
          <div
            v-for="r in clientePageItems"
            :key="r.key"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: CLIENTE_GRID }"
          >
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ r.veiculoNome }}</div>
            <div>
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
                {{ r.clienteNome }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
                {{ r.clienteDocumento }}
              </div>
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ brl(r.valorTotal, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--danger-base)">
              {{ brl(r.valorVencido, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--danger-base)">
              {{ pct(r.pctInadimplencia) }}
            </div>
          </div>
          <TablePagination
            :total="clienteTotal"
            :page="clientePage"
            :page-size="clientePageSize"
            @update:page="setClientePage"
            @update:page-size="setClientePageSize"
          />
        </template>
      </div>
    </div>

    <!-- Containers linha 2 -->
    <div class="grid dash-two-col" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <!-- Boletagem por Veículo -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div class="flex items-center" style="gap: 10px">
            <Receipt :size="16" style="color: var(--agro-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Boletagem por Veículo
            </h3>
          </div>
          <button class="dash-link" @click="emit('navigate', 'cobranca-titulos')">Ver todos</button>
        </div>
        <div v-if="boletagemPorVeiculo.length === 0" class="dash-empty">Nenhuma pendência de boleto.</div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: BOLETA_GRID }">
            <div>Veículo</div>
            <div style="text-align: right">Não boletado</div>
            <div style="text-align: right">Qtd</div>
            <div style="text-align: right">Dias carteira</div>
          </div>
          <div
            v-for="r in boletaPageItems"
            :key="r.veiculoId"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: BOLETA_GRID }"
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
              {{ r.veiculoNome }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ brl(r.valorNaoBoletado, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ r.qtdNaoBoletado }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-muted)">
              {{ r.diasEmCarteira }}d
            </div>
          </div>
          <TablePagination
            :total="boletaTotal"
            :page="boletaPage"
            :page-size="boletaPageSize"
            @update:page="setBoletaPage"
            @update:page-size="setBoletaPageSize"
          />
        </template>
      </div>

      <!-- Notificações Pendentes -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div class="flex items-center" style="gap: 10px">
            <BellRing :size="16" style="color: var(--warning-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Notificações Pendentes
            </h3>
          </div>
          <button class="dash-link" @click="emit('navigate', 'cobranca-titulos')">Ver todos</button>
        </div>
        <div v-if="notifsPendentes.length === 0" class="dash-empty">Nenhuma notificação pendente.</div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: NOTIF_GRID }">
            <div>Veículo</div>
            <div>Cliente</div>
            <div style="text-align: right">Valor</div>
            <div style="text-align: right">Dias</div>
          </div>
          <div
            v-for="r in notifPageItems"
            :key="r.key"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: NOTIF_GRID }"
          >
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ r.veiculoNome }}</div>
            <div>
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
                {{ r.clienteNome }}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
                {{ r.clienteDocumento }}
              </div>
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ brl(r.valorNotificacao, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-muted)">
              {{ r.diasParaNotificacao }}d
            </div>
          </div>
          <TablePagination
            :total="notifTotal"
            :page="notifPage"
            :page-size="notifPageSize"
            @update:page="setNotifPage"
            @update:page-size="setNotifPageSize"
          />
        </template>
      </div>
    </div>

    <!-- Confirmações Pendentes (full width) -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div class="flex items-center" style="gap: 10px">
          <BadgeCheck :size="16" style="color: var(--gci-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Confirmações Pendentes
          </h3>
        </div>
        <button class="dash-link" @click="emit('navigate', 'cobranca-titulos')">Ver todos</button>
      </div>
      <div v-if="confirmacoesPendentes.length === 0" class="dash-empty">Nenhuma confirmação pendente.</div>
      <template v-else>
        <div class="grid dash-table-header" :style="{ gridTemplateColumns: CONF_GRID }">
          <div>Veículo</div>
          <div>Cliente</div>
          <div style="text-align: right">Valor</div>
          <div style="text-align: right">% Confirmado</div>
          <div style="text-align: right">Dias</div>
        </div>
        <div
          v-for="r in confPageItems"
          :key="r.key"
          class="grid items-center dash-queue-row"
          :style="{ gridTemplateColumns: CONF_GRID }"
        >
          <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ r.veiculoNome }}</div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis">
              {{ r.clienteNome }}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ r.clienteDocumento }}
            </div>
          </div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ brl(r.valorConfirmacao, { compact: true }) }}
          </div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
            {{ pct(r.pctConfirmado, 0) }}
          </div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-muted)">
            {{ r.diasParaNotificacao }}d
          </div>
        </div>
        <TablePagination
          :total="confTotal"
          :page="confPage"
          :page-size="confPageSize"
          @update:page="setConfPage"
          @update:page-size="setConfPageSize"
        />
      </template>
    </div>

    <!-- Atalhos -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px">
      <button
        class="flex items-center dash-shortcut"
        style="
          gap: 12px;
          padding: 16px 18px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          cursor: pointer;
          text-align: left;
        "
        @click="emit('navigate', 'cobranca-titulos')"
      >
        <FileText :size="18" style="color: var(--gci-base); flex-shrink: 0" />
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Listagem de títulos
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Atuar sobre a carteira completa
          </div>
        </div>
        <ChevronRight :size="16" style="color: var(--text-muted)" />
      </button>
      <button
        class="flex items-center dash-shortcut"
        style="
          gap: 12px;
          padding: 16px 18px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          cursor: pointer;
          text-align: left;
        "
        @click="emit('navigate', 'cobranca-notif-cessao')"
      >
        <BellRing :size="18" style="color: var(--warning-base); flex-shrink: 0" />
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Notificações de cessão
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Acompanhar envios e falhas
          </div>
        </div>
        <ChevronRight :size="16" style="color: var(--text-muted)" />
      </button>
      <button
        class="flex items-center dash-shortcut"
        style="
          gap: 12px;
          padding: 16px 18px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          cursor: pointer;
          text-align: left;
        "
        @click="emit('navigate', 'cobranca-notif')"
      >
        <Receipt :size="18" style="color: var(--agro-base); flex-shrink: 0" />
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Réguas de notificação
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Configurar disparos automáticos
          </div>
        </div>
        <ChevronRight :size="16" style="color: var(--text-muted)" />
      </button>
    </div>
  </div>

  <div
    v-if="toast"
    style="
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 500;
      background: var(--gci-base);
      color: #fff;
      padding: 12px 18px;
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-md);
    "
  >
    {{ toast }}
  </div>
</template>

<style scoped>
.dash-panel {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
  overflow: hidden;
}
.dash-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-default);
}
.dash-link {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--accent);
}
.dash-empty {
  padding: 24px 20px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
}
.dash-table-header {
  column-gap: 12px;
  padding: 10px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.dash-queue-row {
  width: 100%;
  column-gap: 12px;
  padding: 12px 20px;
  border: none;
  border-top: 1px solid var(--border-default);
  background: transparent;
  font-size: var(--text-sm);
  text-align: left;
}
.dash-search-item:hover,
.dash-shortcut:hover {
  background: var(--surface-sunken) !important;
}
@media (max-width: 1100px) {
  .dash-two-col {
    grid-template-columns: 1fr !important;
  }
}
</style>
