# Cobrança

## Screens

### CobrancaDashboardScreen

```vue
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
```

### CobrancaListScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Search,
  Plus,
  BellRing,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Smartphone,
  Building2,
  Pencil,
  PowerOff,
  Power,
  MoreVertical,
  Trash2,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Notificacao, Metodo } from '../data/cobrancaData';
import CobrancaCard from '../components/CobrancaCard.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ notificacoes: Notificacao[] }>();
const emit = defineEmits<{
  new: [];
  edit: [id: string];
  toggleStatus: [id: string];
  delete: [id: string];
}>();

type ViewMode = 'cards' | 'list';

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];
const METODO_ICONS: Record<Metodo, Component> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: Smartphone,
};

const q = ref('');
const focusSearch = ref(false);
const viewMode = ref<ViewMode>('cards');
const openRowMenu = ref<string | null>(null);
const rowHover = ref<string | null>(null);

const VIEW_MODE_OPTIONS = [
  { key: 'cards' as const, label: 'Visualização em Cards', icon: LayoutGrid },
  { key: 'list' as const, label: 'Visualização em Lista', icon: List },
];

const filtered = computed(() =>
  props.notificacoes.filter((n) => !q.value || n.nome.toLowerCase().includes(q.value.toLowerCase())),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });

const kpis = computed(() => [
  {
    label: 'Total de Réguas',
    value: String(props.notificacoes.length),
    icon: BellRing,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Réguas Ativas',
    value: String(props.notificacoes.filter((n) => n.status === 'Ativa').length),
    icon: BellRing,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  },
  {
    label: 'Total de Veículos',
    value: String(new Set(props.notificacoes.flatMap((n) => n.veiculos)).size),
    icon: Building2,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
  {
    label: 'Réguas Inativas',
    value: String(props.notificacoes.filter((n) => n.status === 'Inativa').length),
    icon: BellRing,
    tone: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  },
]);

function toggleRowMenu(id: string) {
  openRowMenu.value = openRowMenu.value === id ? null : id;
}

function handleEdit(id: string) {
  openRowMenu.value = null;
  emit('edit', id);
}

function handleToggleStatus(id: string) {
  openRowMenu.value = null;
  emit('toggleStatus', id);
}

function handleDelete(id: string) {
  openRowMenu.value = null;
  emit('delete', id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Search + actions bar -->
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focusSearch ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focusSearch ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar régua de notificação..."
          style="
            width: 100%;
            height: 56px;
            border: none;
            outline: none;
            background: transparent;
            padding-left: 52px;
            padding-right: 160px;
            font-size: var(--text-base);
            color: var(--text-strong);
            border-radius: var(--radius-xl);
          "
          @focus="focusSearch = true"
          @blur="focusSearch = false"
          @input="setPage(1)"
        />
        <button
          style="
            position: absolute;
            right: 8px;
            top: 8px;
            bottom: 8px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
          "
        >
          PESQUISAR
        </button>
      </div>

      <SegmentedToggle
        :model-value="viewMode"
        :options="VIEW_MODE_OPTIONS"
        variant="brand"
        icon-only
        @update:model-value="viewMode = $event as ViewMode"
      />

      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 56px;
          padding: 0 24px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-xl);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          white-space: nowrap;
        "
        @click="emit('new')"
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVA NOTIFICAÇÃO
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 20px"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="viewMode === 'cards'" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CobrancaCard
        v-for="n in filtered"
        :key="n.id"
        :notificacao="n"
        @edit="emit('edit', $event)"
        @toggle-status="emit('toggleStatus', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
    <div v-else style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <!-- Table header -->
      <div class="grid" style="grid-template-columns: 2fr 1.4fr 120px 120px 100px 100px 56px; padding: 10px 20px; background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <div
          v-for="col in ['Nome', 'Métodos', 'A Vencer', 'Vencidos', 'Veículos', 'Status', '']"
          :key="col"
          style="font-size: 9px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted)"
        >
          {{ col }}
        </div>
      </div>

      <!-- Rows -->
      <div
        v-for="(n, idx) in pageItems"
        :key="n.id"
        class="grid"
        :style="{
          gridTemplateColumns: '2fr 1.4fr 120px 120px 100px 100px 56px',
          padding: '14px 20px',
          alignItems: 'center',
          borderBottom: idx < pageItems.length - 1 ? '1px solid var(--border-default)' : 'none',
          transition: 'background var(--duration-fast)',
          background: rowHover === n.id ? 'var(--surface-sunken)' : 'transparent',
        }"
        @mouseenter="rowHover = n.id"
        @mouseleave="rowHover = null"
      >
        <!-- Nome -->
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 12px">
          {{ n.nome }}
        </div>

        <!-- Métodos -->
        <div class="flex flex-wrap" style="gap: 4px">
          <span
            v-for="m in METODOS"
            :key="m"
            :title="m"
            :style="{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              background: n.metodos.includes(m) ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
              color: n.metodos.includes(m) ? 'var(--status-active-text)' : 'var(--neutral-300)',
            }"
          >
            <component :is="METODO_ICONS[m]" :size="12" :stroke-width="2.5" />
          </span>
        </div>

        <!-- A Vencer -->
        <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ n.intervalosAVencer.length }} intervalos
        </div>

        <!-- Vencidos -->
        <div style="font-size: var(--text-sm); color: var(--danger-base); font-variant-numeric: tabular-nums">
          {{ n.intervalosVencidos.length }} intervalos
        </div>

        <!-- Veículos -->
        <div class="flex items-center" style="gap: 4px; font-size: var(--text-sm); color: var(--text-default)">
          <Building2 :size="12" style="color: var(--text-muted)" />
          {{ n.veiculos.length }}
        </div>

        <!-- Status -->
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: n.status === 'Ativa' ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
              color: n.status === 'Ativa' ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
            }"
          >
            {{ n.status }}
          </span>
        </div>

        <!-- Actions -->
        <div style="position: relative">
          <button
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: openRowMenu === n.id ? 'var(--surface-sunken)' : 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
            @click.stop="toggleRowMenu(n.id)"
          >
            <MoreVertical :size="15" />
          </button>
          <div
            v-if="openRowMenu === n.id"
            style="
              position: absolute;
              top: 36px;
              right: 0;
              background: var(--surface-card);
              border-width: 1px;
              border-style: solid;
              border-color: var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-md);
              z-index: 20;
              overflow: hidden;
              min-width: 160px;
            "
          >
            <button
              class="cobranca-row-menu-item flex items-center"
              style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left"
              @click="handleEdit(n.id)"
            >
              <Pencil :size="14" /> Editar
            </button>
            <button
              class="cobranca-row-menu-item flex items-center"
              :style="{
                gap: '10px', width: '100%', padding: '10px 14px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                color: n.status === 'Ativa' ? 'var(--text-default)' : 'var(--success-dark)',
                textAlign: 'left',
              }"
              @click="handleToggleStatus(n.id)"
            >
              <PowerOff v-if="n.status === 'Ativa'" :size="14" />
              <Power v-else :size="14" />
              {{ n.status === 'Ativa' ? 'Desativar' : 'Ativar' }}
            </button>
            <div style="height: 1px; background: var(--border-default); margin: 2px 0" />
            <button
              class="cobranca-row-menu-item flex items-center"
              style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--action-danger-text-only); text-align: left"
              @click="handleDelete(n.id)"
            >
              <Trash2 :size="14" /> Deletar notificação
            </button>
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
  </div>
</template>

<style scoped>
.cobranca-row-menu-item:hover {
  background: var(--surface-sunken) !important;
}
</style>
```

### CobrancaRelatoriosScreen

```vue
<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue';
import {
  ArrowLeft,
  FileSpreadsheet,
  ChevronRight,
  Download,
  AlertTriangle,
  BellRing,
  Receipt,
} from 'lucide-vue-next';
import {
  TITULOS_SEED,
  VEICULO_OPTS,
  STATUS_PAGAMENTO_OPTS,
  brl,
  statusPagamentoLabel,
  statusPagamentoColor,
  type StatusPagamento,
} from '../data/titulosData';
import {
  DISPAROS_SEED,
  statusDisparoLabel,
  statusDisparoColor,
  taxaEntrega,
  fmtPct,
} from '../data/resultadoNotificacoesData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

type ReportKey = 'inadimplencia' | 'efetividade' | 'boletagem';

interface ReportDef {
  key: ReportKey;
  title: string;
  description: string;
  icon: Component;
}

const REPORTS: ReportDef[] = [
  {
    key: 'inadimplencia',
    title: 'Relatório de Inadimplência',
    description: 'Títulos vencidos e em atraso, com valor em aberto, dias de atraso e veículo.',
    icon: AlertTriangle,
  },
  {
    key: 'efetividade',
    title: 'Efetividade de Notificação',
    description: 'Desempenho dos disparos de notificação: taxa de entrega, abertura e falhas por campanha.',
    icon: BellRing,
  },
  {
    key: 'boletagem',
    title: 'Relatório de Boletagem',
    description: 'Situação de boletos gerados versus pendentes sobre títulos com valor em aberto.',
    icon: Receipt,
  },
];

interface Filters {
  veiculoId: string;
  status: string;
  campanha: string;
}

const EMPTY_FILTERS: Filters = { veiculoId: '', status: '', campanha: '' };

const selected = ref<ReportKey | null>(null);
const hoveredKey = ref<ReportKey | null>(null);
const draft = reactive<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters | null>(null);

const report = computed(() => REPORTS.find((r) => r.key === selected.value) ?? null);

const resultadosTitulos = computed(() => {
  if (!applied.value || (selected.value !== 'inadimplencia' && selected.value !== 'boletagem')) return [];
  const f = applied.value;
  return TITULOS_SEED.filter((t) => {
    if (selected.value === 'inadimplencia' && !(t.statusPagamento === 'VENCIDO' || t.diasAtraso > 0)) return false;
    if (selected.value === 'boletagem' && t.vrAberto <= 0) return false;
    if (f.veiculoId && t.veiculoId !== f.veiculoId) return false;
    if (f.status && t.statusPagamento !== f.status) return false;
    return true;
  });
});

const resultadosDisparos = computed(() => {
  if (!applied.value || selected.value !== 'efetividade') return [];
  const f = applied.value;
  return DISPAROS_SEED.filter((d) => {
    if (f.campanha && d.campanha !== f.campanha) return false;
    if (f.status && d.status !== f.status) return false;
    return true;
  });
});

const {
  page: disparosPage,
  pageSize: disparosPageSize,
  total: disparosTotal,
  pageItems: disparosPageItems,
  setPage: setDisparosPage,
  setPageSize: setDisparosPageSize,
} = useTablePagination(() => resultadosDisparos.value, { defaultPageSize: 10 });

const {
  page: titulosPage,
  pageSize: titulosPageSize,
  total: titulosTotal,
  pageItems: titulosPageItems,
  setPage: setTitulosPage,
  setPageSize: setTitulosPageSize,
} = useTablePagination(() => resultadosTitulos.value, { defaultPageSize: 10 });

function selectReport(key: ReportKey) {
  selected.value = key;
  Object.assign(draft, EMPTY_FILTERS);
  applied.value = null;
}

function handleGerar() {
  applied.value = { ...draft };
  setDisparosPage(1);
  setTitulosPage(1);
}

function handleExportCsv() {
  if (selected.value === 'efetividade') {
    const header = ['Lote', 'Campanha', 'Canal', 'Entrega %', 'Falhas', 'Status'];
    const lines = resultadosDisparos.value.map((d) =>
      [d.lote, d.campanha, d.canal, fmtPct(taxaEntrega(d)), String(d.falhas), statusDisparoLabel(d.status)]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(';'),
    );
    downloadCsv([header.join(';'), ...lines].join('\n'), 'efetividade-notificacao.csv');
    return;
  }

  const header = ['Nº Título', 'Veículo', 'Sacado', 'VR. Aberto', 'Status', 'Dias atraso', 'Boleto'];
  const lines = resultadosTitulos.value.map((t) =>
    [
      t.numero,
      t.veiculoNome,
      t.sacado,
      brl(t.vrAberto),
      statusPagamentoLabel(t.statusPagamento),
      String(t.diasAtraso),
      t.boletoGeradoEm ?? 'Pendente',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(';'),
  );
  const name =
    selected.value === 'boletagem' ? 'relatorio-boletagem.csv' : 'relatorio-inadimplencia.csv';
  downloadCsv([header.join(';'), ...lines].join('\n'), name);
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const CAMPANHAS = Array.from(new Set(DISPAROS_SEED.map((d) => d.campanha)));
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
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
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in REPORTS"
        :key="r.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectReport(r.key)"
        @mouseenter="hoveredKey = r.key"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <component :is="r.icon" :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 6px;
            "
          >
            {{ r.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ r.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === r.key ? 1 : 0,
            transform: hoveredKey === r.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
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
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Relatórios · Cobrança
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ report?.title }}
        </h2>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div
        class="grid"
        :style="{
          gridTemplateColumns: selected === 'efetividade' ? '1fr 1fr' : '1fr 1fr',
          gap: '14px',
        }"
      >
        <div v-if="selected !== 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Veículo
          </div>
          <select
            v-model="draft.veiculoId"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option v-for="v in VEICULO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
          </select>
        </div>
        <div v-if="selected !== 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Status do título
          </div>
          <select
            v-model="draft.status"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option v-for="s in STATUS_PAGAMENTO_OPTS" :key="s" :value="s">
              {{ statusPagamentoLabel(s as StatusPagamento) }}
            </option>
          </select>
        </div>
        <div v-if="selected === 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Campanha
          </div>
          <select
            v-model="draft.campanha"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todas</option>
            <option v-for="c in CAMPANHAS" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div v-if="selected === 'efetividade'">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Status do disparo
          </div>
          <select
            v-model="draft.status"
            style="
              width: 100%;
              height: 38px;
              padding: 0 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          >
            <option value="">Todos</option>
            <option value="SUCESSO">Sucesso</option>
            <option value="FALHA">Falha</option>
            <option value="PROCESSANDO">Em processamento</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="
            gap: 8px;
            height: 42px;
            padding: 0 20px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="handleGerar"
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <div
      v-if="applied"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div
        class="flex items-center justify-between"
        style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          <template v-if="selected === 'efetividade'">
            {{ resultadosDisparos.length }}
            {{ resultadosDisparos.length === 1 ? 'resultado' : 'resultados' }}
          </template>
          <template v-else>
            {{ resultadosTitulos.length }}
            {{ resultadosTitulos.length === 1 ? 'resultado' : 'resultados' }}
          </template>
        </span>
        <button
          class="flex items-center"
          :disabled="
            selected === 'efetividade' ? resultadosDisparos.length === 0 : resultadosTitulos.length === 0
          "
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor:
              (selected === 'efetividade' ? resultadosDisparos.length : resultadosTitulos.length) === 0
                ? 'not-allowed'
                : 'pointer',
            color:
              (selected === 'efetividade' ? resultadosDisparos.length : resultadosTitulos.length) === 0
                ? 'var(--text-disabled)'
                : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
          @click="handleExportCsv"
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <template v-if="selected === 'efetividade'">
        <div
          v-if="resultadosDisparos.length === 0"
          style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
        >
          Nenhum disparo encontrado para os filtros selecionados.
        </div>
        <template v-else>
          <div
            class="grid"
            style="
              grid-template-columns: 1.2fr 1.6fr 0.8fr 0.8fr 0.7fr 1fr;
              padding: 10px 20px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Lote</div>
            <div>Campanha</div>
            <div>Canal</div>
            <div>Entrega</div>
            <div>Falhas</div>
            <div>Status</div>
          </div>
          <div
            v-for="d in disparosPageItems"
            :key="d.id"
            class="grid items-center"
            style="
              grid-template-columns: 1.2fr 1.6fr 0.8fr 0.8fr 0.7fr 1fr;
              padding: 12px 20px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ d.lote }}
            </div>
            <div style="color: var(--text-default)">{{ d.campanha }}</div>
            <div style="color: var(--text-muted)">{{ d.canal }}</div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold)">
              {{ fmtPct(taxaEntrega(d)) }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--danger-base)">{{ d.falhas }}</div>
            <div :style="{ color: statusDisparoColor(d.status), fontWeight: 'var(--weight-semibold)' }">
              {{ statusDisparoLabel(d.status) }}
            </div>
          </div>
          <TablePagination
            :total="disparosTotal"
            :page="disparosPage"
            :page-size="disparosPageSize"
            @update:page="setDisparosPage"
            @update:page-size="setDisparosPageSize"
          />
        </template>
      </template>

      <template v-else>
        <div
          v-if="resultadosTitulos.length === 0"
          style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
        >
          Nenhum título encontrado para os filtros selecionados.
        </div>
        <template v-else>
          <div
            class="grid"
            style="
              grid-template-columns: 1.2fr 1.4fr 1.4fr 1fr 1fr 0.8fr 1fr;
              padding: 10px 20px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Nº Título</div>
            <div>Veículo</div>
            <div>Sacado</div>
            <div>VR. Aberto</div>
            <div>Status</div>
            <div>Dias</div>
            <div>Boleto</div>
          </div>
          <div
            v-for="t in titulosPageItems"
            :key="t.id"
            class="grid items-center"
            style="
              grid-template-columns: 1.2fr 1.4fr 1.4fr 1fr 1fr 0.8fr 1fr;
              padding: 12px 20px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              #{{ t.numero }}
            </div>
            <div style="color: var(--text-default)">{{ t.veiculoNome }}</div>
            <div style="color: var(--text-default)">{{ t.sacado }}</div>
            <div style="font-variant-numeric: tabular-nums; font-weight: var(--weight-bold)">
              {{ brl(t.vrAberto) }}
            </div>
            <div :style="{ color: statusPagamentoColor(t.statusPagamento), fontWeight: 'var(--weight-semibold)' }">
              {{ statusPagamentoLabel(t.statusPagamento) }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ t.diasAtraso }}</div>
            <div style="color: var(--text-muted); font-size: var(--text-xs)">
              {{ t.boletoGeradoEm ?? 'Pendente' }}
            </div>
          </div>
          <TablePagination
            :total="titulosTotal"
            :page="titulosPage"
            :page-size="titulosPageSize"
            @update:page="setTitulosPage"
            @update:page-size="setTitulosPageSize"
          />
        </template>
      </template>
    </div>
  </div>
</template>
```

### CobrancaScreen

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { notificacoes as initialData, type Notificacao } from '../data/cobrancaData';
import CobrancaListScreen from './CobrancaListScreen.vue';
import NovaNotificacaoModal, { type NewNotificacaoData } from '../components/NovaNotificacaoModal.vue';

function buildNotificacaoFromForm(data: NewNotificacaoData): Notificacao {
  return {
    id: `notif-${Date.now()}`,
    nome: data.nome || 'Nova Régua',
    metodos: data.metodos,
    intervalosAVencer: data.intervalosAVencer,
    intervalosVencidos: data.intervalosVencidos,
    veiculos: data.veiculos,
    status: 'Ativa',
    enviaFimSemanaFeriado: data.enviaFimSemanaFeriado,
  };
}

const list = ref<Notificacao[]>([...initialData]);
const creating = ref(false);

function handleCreate(data: NewNotificacaoData) {
  list.value = [...list.value, buildNotificacaoFromForm(data)];
  creating.value = false;
}

function handleToggleStatus(id: string) {
  list.value = list.value.map((n) =>
    n.id === id ? { ...n, status: n.status === 'Ativa' ? 'Inativa' : 'Ativa' } : n,
  );
}

function handleDelete(id: string) {
  list.value = list.value.filter((n) => n.id !== id);
}

function handleEdit() {
  // Edit opens the create modal pre-filled (future enhancement)
  creating.value = true;
}
</script>

<template>
  <CobrancaListScreen
    :notificacoes="list"
    @new="creating = true"
    @edit="handleEdit"
    @toggle-status="handleToggleStatus"
    @delete="handleDelete"
  />
  <NovaNotificacaoModal
    v-if="creating"
    @close="creating = false"
    @create="handleCreate"
  />
</template>
```

### DisparoDetailScreen

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ArrowLeft, MoreVertical, RefreshCw, Download, FileText, BarChart3 } from 'lucide-vue-next';
import {
  statusDisparoColor,
  statusDisparoLabel,
  taxaEntrega,
  taxaAbertura,
  fmtPct,
  type DisparoNotificacao,
} from '../data/resultadoNotificacoesData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const props = defineProps<{ disparo: DisparoNotificacao }>();
const emit = defineEmits<{
  back: [];
  reenviar: [id: string];
  exportar: [id: string];
}>();

type Tab = 'resumo' | 'destinatarios';

const TABS = [
  { key: 'resumo' as const, label: 'Resumo', icon: BarChart3 },
  { key: 'destinatarios' as const, label: 'Destinatários', icon: FileText },
];

const tab = ref<Tab>('resumo');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusDisparoColor(props.disparo.status));

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
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
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Cobrança · Resultado de Notificação
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          {{ disparo.lote }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusDisparoLabel(disparo.status).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ disparo.campanha }} · {{ disparo.dataHora }}
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-strong);
          "
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 180px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-if="disparo.status !== 'PROCESSANDO'"
            class="flex items-center disp-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="
              actionMenuOpen = false;
              emit('reenviar', disparo.id);
            "
          >
            <RefreshCw :size="15" style="color: var(--text-muted)" />
            Reenviar lote
          </button>
          <button
            class="flex items-center disp-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="
              actionMenuOpen = false;
              emit('exportar', disparo.id);
            "
          >
            <Download :size="15" style="color: var(--text-muted)" />
            Exportar
          </button>
        </div>
      </div>
    </div>

    <div
      class="relative overflow-hidden grid"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Destinatários
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.totalDestinatarios }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Entregues
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.entregues }}
        </div>
        <div style="font-size: var(--text-xs); color: var(--agro-base); margin-top: 4px">
          {{ fmtPct(taxaEntrega(disparo)) }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Abertos
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">
          {{ disparo.abertos }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 4px">
          {{ fmtPct(taxaAbertura(disparo)) }}
        </div>
      </div>
      <div style="position: relative; z-index: 1">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
          Falhas
        </div>
        <div style="margin-top: 8px; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; color: #FCA5A5">
          {{ disparo.falhas }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div v-if="tab === 'resumo'" class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Canal
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ disparo.canal }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Veículo
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ disparo.veiculoNome }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
            Notificações vinculadas
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ disparo.notificacaoIds.length }}
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col" style="gap: 10px">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Notificações do lote
        </div>
        <div
          v-for="nid in disparo.notificacaoIds"
          :key="nid"
          style="
            padding: 12px 14px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-sunken);
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ nid.toUpperCase() }}
        </div>
        <div
          v-if="!disparo.notificacaoIds.length"
          style="padding: 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
        >
          Nenhuma notificação vinculada a este disparo.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.disp-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### NotificacaoCessaoDetailScreen

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  RefreshCw,
  XCircle,
  Building2,
  User,
  Mail,
} from 'lucide-vue-next';
import {
  brl,
  statusCessaoColor,
  statusCessaoLabel,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const props = defineProps<{ notificacao: NotificacaoCessao }>();
const emit = defineEmits<{
  back: [];
  reenviar: [id: string];
  cancelar: [id: string];
}>();

type Tab = 'detalhes' | 'comprovante';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'comprovante' as const, label: 'Comprovante', icon: Mail },
];

const tab = ref<Tab>('detalhes');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusCessaoColor(props.notificacao.status));

const actions = computed(() => {
  const items: { label: string; icon: typeof RefreshCw; onClick: () => void; danger?: boolean }[] = [];
  if (props.notificacao.status === 'PENDENTE' || props.notificacao.status === 'FALHOU') {
    items.push({
      label: 'Reenviar',
      icon: RefreshCw,
      onClick: () => emit('reenviar', props.notificacao.id),
    });
  }
  if (props.notificacao.status === 'PENDENTE' || props.notificacao.status === 'ENVIADA') {
    items.push({
      label: 'Cancelar',
      icon: XCircle,
      onClick: () => emit('cancelar', props.notificacao.id),
      danger: true,
    });
  }
  return items;
});

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
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
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Cobrança · Notificação de Cessão
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          {{ notificacao.protocolo }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusCessaoLabel(notificacao.status).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Título #{{ notificacao.tituloNumero }} · {{ notificacao.veiculoNome }}
        </p>
      </div>

      <div v-if="actions.length" ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-strong);
          "
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 180px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center nc-action-item"
            :style="{
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: a.danger ? 'var(--action-danger-text-only)' : 'var(--text-default)',
              textAlign: 'left',
            }"
            @click="
              actionMenuOpen = false;
              a.onClick();
            "
          >
            <component :is="a.icon" :size="15" style="flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        gap: 24px;
        flex-wrap: wrap;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          Valor da Cessão
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          {{ brl(notificacao.valorCessao) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Canal: {{ notificacao.canal }} · Criada em {{ notificacao.dataCriacao }}
          <template v-if="notificacao.dataEnvio"> · Enviada em {{ notificacao.dataEnvio }}</template>
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div v-if="tab === 'detalhes'" class="flex flex-col" style="gap: 28px">
        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Dados da notificação
          </div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Protocolo
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ notificacao.protocolo }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Título
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                #{{ notificacao.tituloNumero }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Canal
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ notificacao.canal }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Tentativas
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ notificacao.tentativas }}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Destinatário
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ notificacao.destinatario }}
          </div>
        </section>

        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Participantes
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
            <div
              class="flex items-start"
              style="gap: 12px; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
            >
              <div
                class="flex items-center justify-center"
                style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); flex-shrink: 0"
              >
                <Building2 :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Cedente
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ notificacao.cedente }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ notificacao.cedenteCnpj }}
                </div>
              </div>
            </div>
            <div
              class="flex items-start"
              style="gap: 12px; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
            >
              <div
                class="flex items-center justify-center"
                style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base); flex-shrink: 0"
              >
                <User :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Sacado
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ notificacao.sacado }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ notificacao.sacadoCnpj }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="flex flex-col" style="gap: 16px">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase">
          Comprovante de envio
        </div>
        <div
          v-if="notificacao.comprovanteRef"
          style="padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
        >
          <div style="font-size: var(--text-xs); color: var(--text-muted)">Referência</div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 6px; font-variant-numeric: tabular-nums">
            {{ notificacao.comprovanteRef }}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 10px">
            Enviado em {{ notificacao.dataEnvio }} via {{ notificacao.canal }} para
            <strong style="color: var(--text-default)">{{ notificacao.destinatario }}</strong>.
          </div>
        </div>
        <div
          v-else
          style="
            padding: 32px;
            text-align: center;
            border-radius: var(--radius-lg);
            border: 1px dashed var(--border-default);
            color: var(--text-muted);
            font-size: var(--text-sm);
          "
        >
          Nenhum comprovante disponível para esta notificação.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nc-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### NotificacoesCessaoListScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
  Search,
  BellRing,
  RefreshCw,
  XCircle,
  FileCheck2,
} from 'lucide-vue-next';
import {
  VEICULO_CESSAO_OPTS,
  CANAL_CESSAO_OPTS,
  STATUS_CESSAO_OPTS,
  brl,
  statusCessaoColor,
  statusCessaoLabel,
  type NotificacaoCessao,
  type StatusNotificacaoCessao,
} from '../data/notificacoesCessaoData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ itens: NotificacaoCessao[] }>();
const emit = defineEmits<{
  open: [id: string];
  reenviar: [id: string];
  cancelar: [id: string];
}>();

type ColKey = 'titulo' | 'veiculo' | 'cedente' | 'sacado' | 'canal' | 'dataEnvio' | 'valor' | 'status';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'titulo', label: 'Título' },
  { key: 'veiculo', label: 'Veículo' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'canal', label: 'Canal' },
  { key: 'dataEnvio', label: 'Data envio' },
  { key: 'valor', label: 'VR. Cessão', align: 'right' },
  { key: 'status', label: 'Status' },
];

type QuickFilter = StatusNotificacaoCessao | null;

interface Filters {
  veiculoId: string;
  canal: string;
  status: string;
  cedente: string;
}

const EMPTY_FILTERS: Filters = { veiculoId: '', canal: '', status: '', cedente: '' };

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set(['titulo', 'veiculo', 'cedente', 'sacado', 'canal', 'dataEnvio', 'status']),
);
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: StatusNotificacaoCessao; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'ENVIADA', label: 'Enviadas' },
  { key: 'FALHOU', label: 'Falhas' },
];

const filtered = computed(() =>
  props.itens.filter((n) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !n.protocolo.toLowerCase().includes(q) &&
      !n.tituloNumero.toLowerCase().includes(q) &&
      !n.cedente.toLowerCase().includes(q) &&
      !n.sacado.toLowerCase().includes(q) &&
      !n.veiculoNome.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value && n.status !== quickFilter.value) return false;
    if (applied.value.veiculoId && n.veiculoId !== applied.value.veiculoId) return false;
    if (applied.value.canal && n.canal !== applied.value.canal) return false;
    if (applied.value.status && n.status !== applied.value.status) return false;
    if (applied.value.cedente && !n.cedente.toLowerCase().includes(applied.value.cedente.toLowerCase())) {
      return false;
    }
    return true;
  }),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });
const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  titulo: 'minmax(120px, 1.1fr)',
  veiculo: 'minmax(140px, 1.3fr)',
  cedente: 'minmax(150px, 1.4fr)',
  sacado: 'minmax(150px, 1.4fr)',
  canal: 'minmax(90px, 0.8fr)',
  dataEnvio: 'minmax(120px, 1fr)',
  valor: 'minmax(110px, 1fr)',
  status: 'minmax(110px, 1fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(
  () => `minmax(130px, 1.2fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`,
);

function handleFilter() {
  applied.value = { ...draft.value };
  setPage(1);
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  setPage(1);
  filterOpen.value = false;
}

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  visibleCols.value = next;
}

function toggleQuickFilter(status: StatusNotificacaoCessao) {
  quickFilter.value = quickFilter.value === status ? null : status;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function menuActions(n: NotificacaoCessao) {
  const items = [
    {
      icon: FileCheck2,
      label: 'Ver comprovante',
      onClick: () => {
        menuOpenId.value = null;
        emit('open', n.id);
      },
    },
  ];
  if (n.status === 'PENDENTE' || n.status === 'FALHOU') {
    items.push({
      icon: RefreshCw,
      label: 'Reenviar',
      onClick: () => {
        menuOpenId.value = null;
        emit('reenviar', n.id);
      },
    });
  }
  if (n.status === 'PENDENTE' || n.status === 'ENVIADA') {
    items.push({
      icon: XCircle,
      label: 'Cancelar',
      onClick: () => {
        menuOpenId.value = null;
        emit('cancelar', n.id);
      },
    });
  }
  return items;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
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
        Notificações de Cessão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }}
        {{ filtered.length === 1 ? 'notificação encontrada' : 'notificações encontradas' }}
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search
          :size="15"
          style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="searchQuery"
          placeholder="Buscar por protocolo, título, cedente ou sacado"
          style="
            width: 100%;
            height: 38px;
            padding: 0 12px 0 36px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
          @input="setPage(1)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.key"
            :style="{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              border:
                quickFilter === qf.key
                  ? `1px solid ${statusCessaoColor(qf.key)}`
                  : '1px solid var(--border-default)',
              background:
                quickFilter === qf.key
                  ? `color-mix(in srgb, ${statusCessaoColor(qf.key)} 12%, transparent)`
                  : 'var(--surface-card)',
              color: quickFilter === qf.key ? statusCessaoColor(qf.key) : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.key)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="
              gap: 8px;
              height: 38px;
              padding: 0 16px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-strong);
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
            "
            @click="openFilters"
          >
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                padding: 2px 8px;
                border-radius: 9999px;
                background: var(--accent-bg);
                color: var(--accent);
              "
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown
              :size="14"
              :style="{
                color: 'var(--text-muted)',
                transform: filterOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform var(--duration-base)',
              }"
            />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              :style="{
                position: 'absolute',
                [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                right: 0,
                zIndex: 31,
                width: '400px',
                maxWidth: 'calc(100vw - 48px)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Veículo
                  </div>
                  <select
                    v-model="draft.veiculoId"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_CESSAO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Canal
                  </div>
                  <select
                    v-model="draft.canal"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="c in CANAL_CESSAO_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Status
                  </div>
                  <select
                    v-model="draft.status"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  >
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_CESSAO_OPTS" :key="s" :value="s">{{ statusCessaoLabel(s) }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Cedente
                  </div>
                  <input
                    v-model="draft.cedente"
                    placeholder="Buscar cedente"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
                  />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button
                  style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
                  @click="handleClear"
                >
                  Limpar
                </button>
                <button
                  class="flex items-center"
                  style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
                  @click="handleFilter"
                >
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button
            class="flex items-center"
            style="gap: 6px; height: 38px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold)"
            @click="colsMenuOpen = !colsMenuOpen"
          >
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); min-width: 200px; padding: 8px">
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center nc-cols-item"
                style="gap: 10px; padding: 8px 10px; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
                @click="toggleCol(c.key)"
              >
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                {{ c.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid nc-table-row nc-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Protocolo</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <BellRing :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhuma notificação encontrada
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">
              Ajuste os filtros para ver outros resultados.
            </div>
          </div>

          <div
            v-for="n in pageItems"
            :key="n.id"
            class="grid items-center nc-row nc-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', n.id)"
          >
            <div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ n.protocolo }}
              </div>
              <span
                style="
                  display: inline-block;
                  margin-top: 4px;
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 2px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--gci-light);
                  color: var(--gci-base);
                "
              >
                {{ n.veiculoTipo }}
              </span>
            </div>

            <div v-if="visibleCols.has('titulo')" style="font-variant-numeric: tabular-nums; font-weight: var(--weight-semibold); color: var(--text-strong)">
              #{{ n.tituloNumero }}
            </div>
            <div v-if="visibleCols.has('veiculo')" style="color: var(--text-default)">{{ n.veiculoNome }}</div>
            <div v-if="visibleCols.has('cedente')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.cedente }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ n.cedenteCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('sacado')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.sacado }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ n.sacadoCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('canal')">
              <span
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 4px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ n.canal }}
              </span>
            </div>
            <div
              v-if="visibleCols.has('dataEnvio')"
              style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
            >
              {{ n.dataEnvio ?? '—' }}
            </div>
            <div
              v-if="visibleCols.has('valor')"
              style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)"
            >
              {{ brl(n.valorCessao) }}
            </div>
            <div v-if="visibleCols.has('status')">
              <span
                class="flex items-center"
                :style="{
                  gap: '6px',
                  width: 'fit-content',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.04em',
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  background: `color-mix(in srgb, ${statusCessaoColor(n.status)} 14%, transparent)`,
                  color: statusCessaoColor(n.status),
                  whiteSpace: 'nowrap',
                }"
              >
                <span
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: statusCessaoColor(n.status),
                  }"
                />
                {{ statusCessaoLabel(n.status) }}
              </span>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
                class="flex items-center justify-center"
                :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: menuOpenId === n.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === n.id ? null : n.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === n.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div
                  style="
                    position: absolute;
                    top: 36px;
                    right: 0;
                    z-index: 31;
                    background: var(--surface-card);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    min-width: 180px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(n)"
                    :key="action.label"
                    class="flex items-center nc-menu-item"
                    style="
                      gap: 10px;
                      width: 100%;
                      padding: 10px 14px;
                      background: transparent;
                      border: none;
                      cursor: pointer;
                      font-size: var(--text-sm);
                      color: var(--text-default);
                      text-align: left;
                    "
                    @click.stop="action.onClick"
                  >
                    <component :is="action.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
                    {{ action.label }}
                  </button>
                </div>
              </template>
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
  </div>
</template>

<style scoped>
.nc-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.nc-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.nc-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.nc-row:hover {
  background: var(--surface-sunken);
}
.nc-cols-item:hover {
  background: var(--surface-sunken);
}
.nc-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### NotificacoesCessaoScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NOTIFICACOES_CESSAO_SEED,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';
import NotificacoesCessaoListScreen from './NotificacoesCessaoListScreen.vue';
import NotificacaoCessaoDetailScreen from './NotificacaoCessaoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<NotificacaoCessao[]>(NOTIFICACOES_CESSAO_SEED.map((n) => ({ ...n })));
const route = ref<Route>({ level: 'list' });
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const atual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((n) => n.id === r.id) : undefined;
});

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 2400);
}

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function openDetail(id: string) {
  route.value = { level: 'detail', id };
}

function handleReenviar(id: string) {
  list.value = list.value.map((n) =>
    n.id === id
      ? {
          ...n,
          status: 'ENVIADA',
          dataEnvio: nowBR(),
          tentativas: n.tentativas + 1,
          comprovanteRef: n.comprovanteRef ?? `CMP-${id.toUpperCase()}`,
        }
      : n,
  );
  showToast('Notificação reenviada (mock)');
}

function handleCancelar(id: string) {
  list.value = list.value.map((n) =>
    n.id === id ? { ...n, status: 'CANCELADA' } : n,
  );
  showToast('Notificação cancelada');
}
</script>

<template>
  <NotificacoesCessaoListScreen
    v-if="route.level === 'list'"
    :itens="list"
    @open="openDetail"
    @reenviar="handleReenviar"
    @cancelar="handleCancelar"
  />
  <template v-else>
    <NotificacaoCessaoDetailScreen
      v-if="atual"
      :notificacao="atual"
      @back="route = { level: 'list' }"
      @reenviar="handleReenviar"
      @cancelar="handleCancelar"
    />
    <NotificacoesCessaoListScreen
      v-else
      :itens="list"
      @open="openDetail"
      @reenviar="handleReenviar"
      @cancelar="handleCancelar"
    />
  </template>

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
```

### ResultadoNotificacoesListScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  Search,
  RefreshCw,
  Download,
  Send,
} from 'lucide-vue-next';
import {
  CAMPANHA_OPTS,
  CANAL_DISPARO_OPTS,
  STATUS_DISPARO_OPTS,
  statusDisparoColor,
  statusDisparoLabel,
  taxaEntrega,
  taxaAbertura,
  fmtPct,
  type DisparoNotificacao,
  type StatusDisparo,
} from '../data/resultadoNotificacoesData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ disparos: DisparoNotificacao[] }>();
const emit = defineEmits<{
  open: [id: string];
  reenviar: [id: string];
  exportar: [id: string];
}>();

type QuickFilter = StatusDisparo | null;

interface Filters {
  campanha: string;
  canal: string;
  status: string;
}

const EMPTY_FILTERS: Filters = { campanha: '', canal: '', status: '' };

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: StatusDisparo; label: string }[] = [
  { key: 'SUCESSO', label: 'Sucesso' },
  { key: 'FALHA', label: 'Falha' },
  { key: 'PROCESSANDO', label: 'Em processamento' },
];

const filtered = computed(() =>
  props.disparos.filter((d) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !d.lote.toLowerCase().includes(q) &&
      !d.campanha.toLowerCase().includes(q) &&
      !d.veiculoNome.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value && d.status !== quickFilter.value) return false;
    if (applied.value.campanha && d.campanha !== applied.value.campanha) return false;
    if (applied.value.canal && d.canal !== applied.value.canal) return false;
    if (applied.value.status && d.status !== applied.value.status) return false;
    return true;
  }),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });
const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const gridTemplate =
  'minmax(130px, 1.2fr) minmax(160px, 1.6fr) minmax(80px, 0.8fr) minmax(120px, 1.2fr) minmax(110px, 1fr) minmax(80px, 0.8fr) minmax(80px, 0.8fr) minmax(110px, 1fr) 56px';

function handleFilter() {
  applied.value = { ...draft.value };
  setPage(1);
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  setPage(1);
  filterOpen.value = false;
}

function toggleQuickFilter(status: StatusDisparo) {
  quickFilter.value = quickFilter.value === status ? null : status;
  setPage(1);
}

function menuActions(d: DisparoNotificacao) {
  const items = [
    {
      icon: Download,
      label: 'Exportar',
      onClick: () => {
        menuOpenId.value = null;
        emit('exportar', d.id);
      },
    },
  ];
  if (d.status === 'FALHA' || d.status === 'SUCESSO') {
    items.unshift({
      icon: RefreshCw,
      label: 'Reenviar lote',
      onClick: () => {
        menuOpenId.value = null;
        emit('reenviar', d.id);
      },
    });
  }
  return items;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
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
        Resultado de Notificações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'disparo encontrado' : 'disparos encontrados' }}
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search
          :size="15"
          style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="searchQuery"
          placeholder="Buscar por lote, campanha ou veículo"
          style="
            width: 100%;
            height: 38px;
            padding: 0 12px 0 36px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
          @input="setPage(1)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.key"
            :style="{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              border:
                quickFilter === qf.key
                  ? `1px solid ${statusDisparoColor(qf.key)}`
                  : '1px solid var(--border-default)',
              background:
                quickFilter === qf.key
                  ? `color-mix(in srgb, ${statusDisparoColor(qf.key)} 12%, transparent)`
                  : 'var(--surface-card)',
              color: quickFilter === qf.key ? statusDisparoColor(qf.key) : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.key)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="
              gap: 8px;
              height: 38px;
              padding: 0 16px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-strong);
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
            "
            @click="filterOpen = !filterOpen"
          >
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                padding: 2px 8px;
                border-radius: 9999px;
                background: var(--accent-bg);
                color: var(--accent);
              "
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" style="color: var(--text-muted)" />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              style="
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                z-index: 31;
                width: 360px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-lg);
                padding: 20px;
              "
            >
              <div class="flex flex-col" style="gap: 14px">
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Campanha
                  </div>
                  <select
                    v-model="draft.campanha"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todas</option>
                    <option v-for="c in CAMPANHA_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Canal
                  </div>
                  <select
                    v-model="draft.canal"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todos</option>
                    <option v-for="c in CANAL_DISPARO_OPTS" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                    Status
                  </div>
                  <select
                    v-model="draft.status"
                    style="width: 100%; height: 38px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
                  >
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_DISPARO_OPTS" :key="s" :value="s">{{ statusDisparoLabel(s) }}</option>
                  </select>
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button
                  style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
                  @click="handleClear"
                >
                  Limpar
                </button>
                <button
                  class="flex items-center"
                  style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
                  @click="handleFilter"
                >
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid disp-table-row disp-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Lote</div>
            <div>Campanha</div>
            <div>Canal</div>
            <div>Data/Hora</div>
            <div>Veículo</div>
            <div style="text-align: right">Entrega</div>
            <div style="text-align: right">Abertura</div>
            <div>Status</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <Send :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum disparo encontrado
            </div>
          </div>

          <div
            v-for="d in pageItems"
            :key="d.id"
            class="grid items-center disp-row disp-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', d.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ d.lote }}
            </div>
            <div style="color: var(--text-default)">{{ d.campanha }}</div>
            <div>
              <span
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  padding: 4px 8px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ d.canal }}
              </span>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ d.dataHora }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ d.veiculoNome }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ fmtPct(taxaEntrega(d)) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">
              {{ fmtPct(taxaAbertura(d)) }}
            </div>
            <div>
              <span
                class="flex items-center"
                :style="{
                  gap: '6px',
                  width: 'fit-content',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.04em',
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  background: `color-mix(in srgb, ${statusDisparoColor(d.status)} 14%, transparent)`,
                  color: statusDisparoColor(d.status),
                  whiteSpace: 'nowrap',
                }"
              >
                <span
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: statusDisparoColor(d.status),
                  }"
                />
                {{ statusDisparoLabel(d.status) }}
              </span>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
                class="flex items-center justify-center"
                :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: menuOpenId === d.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === d.id ? null : d.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === d.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div
                  style="
                    position: absolute;
                    top: 36px;
                    right: 0;
                    z-index: 31;
                    background: var(--surface-card);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    min-width: 170px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(d)"
                    :key="action.label"
                    class="flex items-center disp-menu-item"
                    style="
                      gap: 10px;
                      width: 100%;
                      padding: 10px 14px;
                      background: transparent;
                      border: none;
                      cursor: pointer;
                      font-size: var(--text-sm);
                      color: var(--text-default);
                      text-align: left;
                    "
                    @click.stop="action.onClick"
                  >
                    <component :is="action.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
                    {{ action.label }}
                  </button>
                </div>
              </template>
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
  </div>
</template>

<style scoped>
.disp-table-row {
  column-gap: 14px;
  padding: 14px 20px;
  white-space: nowrap;
}
.disp-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.disp-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.disp-row:hover {
  background: var(--surface-sunken);
}
.disp-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### ResultadoNotificacoesScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DISPAROS_SEED, type DisparoNotificacao } from '../data/resultadoNotificacoesData';
import ResultadoNotificacoesListScreen from './ResultadoNotificacoesListScreen.vue';
import DisparoDetailScreen from './DisparoDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; id: string };

const list = ref<DisparoNotificacao[]>(DISPAROS_SEED.map((d) => ({ ...d })));
const route = ref<Route>({ level: 'list' });
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const atual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((d) => d.id === r.id) : undefined;
});

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 2400);
}

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function handleReenviar(id: string) {
  list.value = list.value.map((d) =>
    d.id === id
      ? {
          ...d,
          status: 'PROCESSANDO',
          dataHora: nowBR(),
          entregues: 0,
          abertos: 0,
          falhas: 0,
        }
      : d,
  );
  showToast('Lote reenviado (mock)');
}

function handleExportar(id: string) {
  const d = list.value.find((x) => x.id === id);
  if (!d) return;
  const csv = [
    'Lote;Campanha;Canal;Data;Destinatarios;Entregues;Abertos;Falhas;Status',
    `"${d.lote}";"${d.campanha}";"${d.canal}";"${d.dataHora}";${d.totalDestinatarios};${d.entregues};${d.abertos};${d.falhas};"${d.status}"`,
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${d.lote}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exportado');
}
</script>

<template>
  <ResultadoNotificacoesListScreen
    v-if="route.level === 'list'"
    :disparos="list"
    @open="route = { level: 'detail', id: $event }"
    @reenviar="handleReenviar"
    @exportar="handleExportar"
  />
  <template v-else>
    <DisparoDetailScreen
      v-if="atual"
      :disparo="atual"
      @back="route = { level: 'list' }"
      @reenviar="handleReenviar"
      @exportar="handleExportar"
    />
    <ResultadoNotificacoesListScreen
      v-else
      :disparos="list"
      @open="route = { level: 'detail', id: $event }"
      @reenviar="handleReenviar"
      @exportar="handleExportar"
    />
  </template>

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
```

### TituloDetailScreen

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  BellRing,
  Receipt,
  Handshake,
  BadgeCheck,
  Paperclip,
  CreditCard,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next';
import {
  brl,
  statusPagamentoColor,
  statusPagamentoLabel,
  type Titulo,
} from '../data/titulosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import DetailsTab from './titulo-detail/DetailsTab.vue';
import AnexosTab from './titulo-detail/AnexosTab.vue';
import AccrualTab from './titulo-detail/AccrualTab.vue';
import PagamentosTab from './titulo-detail/PagamentosTab.vue';
import ConfirmacoesTab from './titulo-detail/ConfirmacoesTab.vue';
import MovimentacoesTab from './titulo-detail/MovimentacoesTab.vue';
import HistoricoTab from './titulo-detail/HistoricoTab.vue';

const props = defineProps<{ titulo: Titulo }>();
const emit = defineEmits<{
  back: [];
  gerarBoleto: [id: string];
  notificar: [id: string];
  confirmar: [id: string];
  negociar: [id: string];
}>();

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'anexos' as const, label: 'Anexos', icon: Paperclip },
  { key: 'accrual' as const, label: 'Accrual', icon: TrendingUp },
  { key: 'pagamentos' as const, label: 'Pagamentos', icon: CreditCard },
  { key: 'confirmacoes' as const, label: 'Confirmações', icon: BadgeCheck },
  { key: 'movimentacoes' as const, label: 'Movimentações', icon: ArrowLeftRight },
  { key: 'historico' as const, label: 'Histórico', icon: Activity },
];

const tab = ref<Tab>('detalhes');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusPagamentoColor(props.titulo.statusPagamento));

const StatusIcon = computed<Component>(() => {
  if (props.titulo.statusPagamento === 'LIQUIDADO') return CheckCircle2;
  if (props.titulo.statusPagamento === 'VENCIDO') return AlertTriangle;
  return Clock;
});

const actions = [
  {
    label: 'Gerar Boleto',
    icon: Receipt,
    onClick: () => emit('gerarBoleto', props.titulo.id),
  },
  {
    label: 'Confirmar Ativo',
    icon: BadgeCheck,
    onClick: () => emit('confirmar', props.titulo.id),
  },
  {
    label: 'Notificar Ativo',
    icon: BellRing,
    onClick: () => emit('notificar', props.titulo.id),
  },
  {
    label: 'Sinalizar Negociação',
    icon: Handshake,
    onClick: () => emit('negociar', props.titulo.id),
  },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
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
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Cobrança · Título
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          #{{ titulo.numero }}
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 4px 9px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
              border: 1px solid color-mix(in srgb, var(--gci-base) 20%, transparent);
            "
          >
            Lastro {{ titulo.lastro }}
          </span>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusPagamentoLabel(titulo.statusPagamento).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ titulo.veiculoNome }} · {{ titulo.veiculoTipo }}
          <template v-if="titulo.classeOuOperacao"> · {{ titulo.classeOuOperacao }}</template>
          · {{ titulo.gerente }}
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            cursor: pointer;
            color: var(--text-strong);
          "
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 220px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center detalle-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="handleActionClick(a)"
          >
            <component :is="a.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Value hero -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        gap: 24px;
        flex-wrap: wrap;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          Valor Nominal do Título
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          {{ brl(titulo.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Tipo: {{ titulo.tipo }} · Emissão: {{ titulo.emissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
      <div
        class="flex flex-col"
        style="
          position: relative;
          z-index: 1;
          gap: 8px;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          min-width: 160px;
        "
      >
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55)">
          Valor em Aberto
        </div>
        <div style="font-size: var(--text-xl); font-weight: 700; font-variant-numeric: tabular-nums">
          {{ brl(titulo.vrAberto) }}
        </div>
        <div
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-xs); color: rgba(255, 255, 255, 0.7)"
        >
          <component :is="StatusIcon" :size="13" />
          {{ titulo.diasAtraso > 0 ? `${titulo.diasAtraso} dias em atraso` : 'Sem atraso' }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <DetailsTab v-if="tab === 'detalhes'" :titulo="titulo" />
      <AnexosTab v-else-if="tab === 'anexos'" :titulo="titulo" />
      <AccrualTab v-else-if="tab === 'accrual'" :titulo="titulo" />
      <PagamentosTab v-else-if="tab === 'pagamentos'" :titulo="titulo" />
      <ConfirmacoesTab v-else-if="tab === 'confirmacoes'" :titulo="titulo" />
      <MovimentacoesTab v-else-if="tab === 'movimentacoes'" :titulo="titulo" />
      <HistoricoTab v-else-if="tab === 'historico'" :titulo="titulo" />
    </div>
  </div>
</template>

<style scoped>
.detalle-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### TitulosListScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
  Search,
  FileText,
  Receipt,
  BellRing,
  Handshake,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-vue-next';
import {
  VEICULO_OPTS,
  VEICULO_TIPO_OPTS,
  STATUS_PAGAMENTO_OPTS,
  brl,
  statusPagamentoColor,
  statusPagamentoLabel,
  situacaoTituloColor,
  situacaoTituloLabel,
  statusNotificacaoColor,
  statusNotificacaoLabel,
  statusConfirmacaoColor,
  statusConfirmacaoLabel,
  type Titulo,
  type StatusPagamento,
} from '../data/titulosData';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulos: Titulo[] }>();
const emit = defineEmits<{
  open: [id: string];
  gerarBoleto: [id: string];
  notificar: [id: string];
  confirmar: [id: string];
  negociar: [id: string];
}>();

type ColKey =
  | 'veiculo'
  | 'tipo'
  | 'cedente'
  | 'sacado'
  | 'gerente'
  | 'vencimento'
  | 'vrNominal'
  | 'vrAquisicao'
  | 'vrPresente'
  | 'vrAberto'
  | 'vrJuros'
  | 'vrMulta'
  | 'statusNotificacao'
  | 'statusConfirmacao'
  | 'situacaoTitulo'
  | 'statusPagamento'
  | 'diasAtraso'
  | 'boleto';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' }[] = [
  { key: 'veiculo', label: 'Veículo' },
  { key: 'tipo', label: 'Tipo do Ativo' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimento', label: 'Vencimento' },
  { key: 'vrNominal', label: 'VR. Nominal', align: 'right' },
  { key: 'vrAquisicao', label: 'VR. Aquisição', align: 'right' },
  { key: 'vrPresente', label: 'VR. Presente', align: 'right' },
  { key: 'vrAberto', label: 'VR. Aberto', align: 'right' },
  { key: 'vrJuros', label: 'VR. Juros', align: 'right' },
  { key: 'vrMulta', label: 'VR. Multa', align: 'right' },
  { key: 'statusNotificacao', label: 'Notificação' },
  { key: 'statusConfirmacao', label: 'Confirmação' },
  { key: 'situacaoTitulo', label: 'Situação' },
  { key: 'statusPagamento', label: 'Pagamento' },
  { key: 'diasAtraso', label: 'Dias atraso', align: 'right' },
  { key: 'boleto', label: 'Boleto' },
];

type QuickFilter = StatusPagamento | 'EM_NEGOCIACAO' | null;

interface Filters {
  veiculoId: string;
  veiculoTipo: string;
  statusPagamento: string;
  cedente: string;
  sacado: string;
}

const EMPTY_FILTERS: Filters = {
  veiculoId: '',
  veiculoTipo: '',
  statusPagamento: '',
  cedente: '',
  sacado: '',
};

const searchQuery = ref('');
const quickFilter = ref<QuickFilter>(null);
const filterOpen = ref(false);
const filterPlacement = ref<'below' | 'above'>('below');
const filterBtnRef = ref<HTMLButtonElement | null>(null);
const draft = ref<Filters>({ ...EMPTY_FILTERS });
const applied = ref<Filters>({ ...EMPTY_FILTERS });
const visibleCols = ref<Set<ColKey>>(
  new Set([
    'veiculo',
    'tipo',
    'cedente',
    'sacado',
    'gerente',
    'vencimento',
    'vrNominal',
    'vrAberto',
    'statusNotificacao',
    'statusConfirmacao',
    'situacaoTitulo',
    'statusPagamento',
    'diasAtraso',
    'boleto',
  ]),
);
const colsMenuOpen = ref(false);
const menuOpenId = ref<string | null>(null);

const QUICK_FILTERS: { key: NonNullable<QuickFilter>; label: string; color: string }[] = [
  { key: 'VENCIDO', label: 'Vencidos', color: statusPagamentoColor('VENCIDO') },
  { key: 'VINCENDO', label: 'Vincendo', color: statusPagamentoColor('VINCENDO') },
  { key: 'PAGO_PARCIAL', label: 'Pago Parcial', color: statusPagamentoColor('PAGO_PARCIAL') },
  { key: 'EM_NEGOCIACAO', label: 'Em Negociação', color: 'var(--agro-base)' },
];

const filtered = computed(() =>
  props.titulos.filter((t) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (
      q &&
      !t.numero.toLowerCase().includes(q) &&
      !t.cedente.toLowerCase().includes(q) &&
      !t.sacado.toLowerCase().includes(q) &&
      !t.veiculoNome.toLowerCase().includes(q) &&
      !t.lastro.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (quickFilter.value === 'EM_NEGOCIACAO') {
      if (!t.emNegociacao) return false;
    } else if (quickFilter.value && t.statusPagamento !== quickFilter.value) {
      return false;
    }
    if (applied.value.veiculoId && t.veiculoId !== applied.value.veiculoId) return false;
    if (applied.value.veiculoTipo && t.veiculoTipo !== applied.value.veiculoTipo) return false;
    if (applied.value.statusPagamento && t.statusPagamento !== applied.value.statusPagamento) return false;
    if (applied.value.cedente && !t.cedente.toLowerCase().includes(applied.value.cedente.toLowerCase())) {
      return false;
    }
    if (applied.value.sacado && !t.sacado.toLowerCase().includes(applied.value.sacado.toLowerCase())) {
      return false;
    }
    return true;
  }),
);

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => filtered.value, { defaultPageSize: 10 });
const activeFilterCount = computed(() => Object.values(applied.value).filter((v) => v !== '').length);

const COL_WIDTHS: Record<ColKey, string> = {
  veiculo: 'minmax(140px, 1.4fr)',
  tipo: 'minmax(80px, 0.7fr)',
  cedente: 'minmax(150px, 1.5fr)',
  sacado: 'minmax(150px, 1.5fr)',
  gerente: 'minmax(120px, 1fr)',
  vencimento: 'minmax(100px, 0.9fr)',
  vrNominal: 'minmax(110px, 1fr)',
  vrAquisicao: 'minmax(110px, 1fr)',
  vrPresente: 'minmax(110px, 1fr)',
  vrAberto: 'minmax(110px, 1fr)',
  vrJuros: 'minmax(90px, 0.9fr)',
  vrMulta: 'minmax(90px, 0.9fr)',
  statusNotificacao: 'minmax(110px, 1fr)',
  statusConfirmacao: 'minmax(110px, 1fr)',
  situacaoTitulo: 'minmax(110px, 1fr)',
  statusPagamento: 'minmax(110px, 1fr)',
  diasAtraso: 'minmax(90px, 0.8fr)',
  boleto: 'minmax(80px, 0.7fr)',
};

const cols = computed(() => ALL_COLS.filter((c) => visibleCols.value.has(c.key)));
const gridTemplate = computed(
  () => `minmax(160px, 1.4fr) ${cols.value.map((c) => COL_WIDTHS[c.key]).join(' ')} 56px`,
);

function handleFilter() {
  applied.value = { ...draft.value };
  setPage(1);
  filterOpen.value = false;
}

function handleClear() {
  draft.value = { ...EMPTY_FILTERS };
  applied.value = { ...EMPTY_FILTERS };
  setPage(1);
  filterOpen.value = false;
}

function toggleCol(key: ColKey) {
  const next = new Set(visibleCols.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  visibleCols.value = next;
}

function toggleQuickFilter(key: NonNullable<QuickFilter>) {
  quickFilter.value = quickFilter.value === key ? null : key;
  setPage(1);
}

function openFilters() {
  if (!filterOpen.value && filterBtnRef.value) {
    const rect = filterBtnRef.value.getBoundingClientRect();
    const estimatedPanelHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    filterPlacement.value = spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below';
  }
  filterOpen.value = !filterOpen.value;
}

function pillStyle(color: string) {
  return {
    gap: '6px',
    width: 'fit-content',
    fontSize: '10px',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: '0.04em',
    padding: '4px 9px',
    borderRadius: '9999px',
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    color,
    whiteSpace: 'nowrap' as const,
  };
}

function menuActions(t: Titulo) {
  return [
    {
      icon: Receipt,
      label: 'Gerar Boleto',
      onClick: () => {
        menuOpenId.value = null;
        emit('gerarBoleto', t.id);
      },
    },
    {
      icon: BadgeCheck,
      label: 'Confirmar Ativo',
      onClick: () => {
        menuOpenId.value = null;
        emit('confirmar', t.id);
      },
    },
    {
      icon: BellRing,
      label: 'Notificar Ativo',
      onClick: () => {
        menuOpenId.value = null;
        emit('notificar', t.id);
      },
    },
    {
      icon: Handshake,
      label: 'Sinalizar Negociação',
      onClick: () => {
        menuOpenId.value = null;
        emit('negociar', t.id);
      },
    },
  ];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
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
        Títulos e Ativos
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ filtered.length }} {{ filtered.length === 1 ? 'título encontrado' : 'títulos encontrados' }}
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 10px; flex-wrap: wrap">
      <div style="position: relative; flex: 1 1 50%; min-width: 240px; max-width: 50%">
        <Search
          :size="15"
          style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
        />
        <input
          v-model="searchQuery"
          placeholder="Buscar por nº, lastro, cedente, sacado ou veículo"
          style="
            width: 100%;
            height: 38px;
            padding: 0 12px 0 36px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
          @input="setPage(1)"
        />
      </div>

      <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
        <div class="flex items-center" style="gap: 6px">
          <button
            v-for="qf in QUICK_FILTERS"
            :key="qf.key"
            :style="{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              border:
                quickFilter === qf.key
                  ? `1px solid ${qf.color}`
                  : '1px solid var(--border-default)',
              background:
                quickFilter === qf.key
                  ? `color-mix(in srgb, ${qf.color} 12%, transparent)`
                  : 'var(--surface-card)',
              color: quickFilter === qf.key ? qf.color : 'var(--text-muted)',
            }"
            @click="toggleQuickFilter(qf.key)"
          >
            {{ qf.label }}
          </button>
        </div>

        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            style="
              gap: 8px;
              height: 38px;
              padding: 0 16px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-strong);
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
            "
            @click="openFilters"
          >
            <Filter :size="15" style="color: var(--text-muted)" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                padding: 2px 8px;
                border-radius: 9999px;
                background: var(--accent-bg);
                color: var(--accent);
              "
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown
              :size="14"
              :style="{
                color: 'var(--text-muted)',
                transform: filterOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform var(--duration-base)',
              }"
            />
          </button>

          <template v-if="filterOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="filterOpen = false" />
            <div
              :style="{
                position: 'absolute',
                [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                right: 0,
                zIndex: 31,
                width: '420px',
                maxWidth: 'calc(100vw - 48px)',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '20px',
              }"
            >
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
                <div>
                  <div class="filter-label">Veículo</div>
                  <select v-model="draft.veiculoId" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="v in VEICULO_OPTS" :key="v.id" :value="v.id">{{ v.nome }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Tipo de veículo</div>
                  <select v-model="draft.veiculoTipo" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="t in VEICULO_TIPO_OPTS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Status de pagamento</div>
                  <select v-model="draft.statusPagamento" class="filter-input">
                    <option value="">Todos</option>
                    <option v-for="s in STATUS_PAGAMENTO_OPTS" :key="s" :value="s">
                      {{ statusPagamentoLabel(s) }}
                    </option>
                  </select>
                </div>
                <div>
                  <div class="filter-label">Cedente</div>
                  <input v-model="draft.cedente" placeholder="Buscar cedente" class="filter-input" />
                </div>
                <div style="grid-column: span 2">
                  <div class="filter-label">Sacado</div>
                  <input v-model="draft.sacado" placeholder="Buscar sacado" class="filter-input" />
                </div>
              </div>
              <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
                <button
                  style="
                    height: 38px;
                    padding: 0 16px;
                    background: none;
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    color: var(--text-muted);
                    font-weight: var(--weight-semibold);
                    font-size: var(--text-sm);
                  "
                  @click="handleClear"
                >
                  Limpar
                </button>
                <button
                  class="flex items-center"
                  style="
                    gap: 6px;
                    height: 38px;
                    padding: 0 18px;
                    background: var(--action-primary-bg);
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    font-weight: var(--weight-bold);
                    font-size: var(--text-xs);
                    letter-spacing: 0.06em;
                  "
                  @click="handleFilter"
                >
                  <Filter :size="13" /> FILTRAR
                </button>
              </div>
            </div>
          </template>
        </div>

        <div style="position: relative">
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 38px;
              padding: 0 14px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: var(--text-muted);
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
            "
            @click="colsMenuOpen = !colsMenuOpen"
          >
            <SlidersHorizontal :size="14" /> Colunas
          </button>
          <template v-if="colsMenuOpen">
            <div style="position: fixed; inset: 0; z-index: 30" @click="colsMenuOpen = false" />
            <div
              style="
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                z-index: 31;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-md);
                min-width: 220px;
                max-height: 360px;
                overflow-y: auto;
                padding: 8px;
              "
            >
              <div
                v-for="c in ALL_COLS"
                :key="c.key"
                class="flex items-center titulos-cols-item"
                style="
                  gap: 10px;
                  padding: 8px 10px;
                  border-radius: var(--radius-md);
                  cursor: pointer;
                  font-size: var(--text-sm);
                  color: var(--text-default);
                "
                @click="toggleCol(c.key)"
              >
                <div @click.stop>
                  <Checkbox :checked="visibleCols.has(c.key)" @change="toggleCol(c.key)" />
                </div>
                {{ c.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div style="overflow-x: auto">
        <div style="width: max-content; min-width: 100%">
          <div class="grid titulos-table-row titulos-table-header" :style="{ gridTemplateColumns: gridTemplate }">
            <div>Nº Título</div>
            <div v-for="c in cols" :key="c.key" :style="{ textAlign: c.align }">{{ c.label }}</div>
            <div style="text-align: right">Ações</div>
          </div>

          <div
            v-if="pageItems.length === 0"
            class="flex flex-col items-center justify-center"
            style="gap: 10px; padding: 48px 24px; text-align: center"
          >
            <FileText :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
              Nenhum título encontrado
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted)">
              Ajuste os filtros para ver outros resultados.
            </div>
          </div>

          <div
            v-for="t in pageItems"
            :key="t.id"
            class="grid items-center titulos-row titulos-table-row"
            :style="{ gridTemplateColumns: gridTemplate }"
            @click="emit('open', t.id)"
          >
            <div>
              <div
                style="
                  font-weight: var(--weight-bold);
                  color: var(--text-strong);
                  font-variant-numeric: tabular-nums;
                "
              >
                #{{ t.numero }}
              </div>
              <span
                style="
                  display: inline-block;
                  margin-top: 4px;
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
                Lastro {{ t.lastro }}
              </span>
            </div>

            <div v-if="visibleCols.has('veiculo')" style="color: var(--text-default)">
              {{ t.veiculoNome }}
            </div>
            <div v-if="visibleCols.has('tipo')">
              <span
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.1em;
                  padding: 4px 7px;
                  border-radius: var(--radius-sm);
                  background: var(--surface-sunken);
                  color: var(--text-muted);
                "
              >
                {{ t.tipo }}
              </span>
            </div>
            <div v-if="visibleCols.has('cedente')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.cedente }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ t.cedenteCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('sacado')">
              <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ t.sacado }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                {{ t.sacadoCnpj }}
              </div>
            </div>
            <div v-if="visibleCols.has('gerente')" style="color: var(--text-default)">
              {{ t.gerente }}
            </div>
            <div
              v-if="visibleCols.has('vencimento')"
              style="color: var(--text-muted); font-size: var(--text-xs); font-variant-numeric: tabular-nums"
            >
              {{ t.vencimento }}
            </div>
            <div
              v-if="visibleCols.has('vrNominal')"
              style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)"
            >
              {{ brl(t.vrNominal) }}
            </div>
            <div
              v-if="visibleCols.has('vrAquisicao')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ t.vrAquisicao != null ? brl(t.vrAquisicao) : '—' }}
            </div>
            <div
              v-if="visibleCols.has('vrPresente')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ t.vrPresente != null ? brl(t.vrPresente) : '—' }}
            </div>
            <div
              v-if="visibleCols.has('vrAberto')"
              :style="{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color: t.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-strong)',
              }"
            >
              {{ brl(t.vrAberto) }}
            </div>
            <div
              v-if="visibleCols.has('vrJuros')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ brl(t.vrJuros) }}
            </div>
            <div
              v-if="visibleCols.has('vrMulta')"
              style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)"
            >
              {{ brl(t.vrMulta) }}
            </div>
            <div v-if="visibleCols.has('statusNotificacao')">
              <span class="flex items-center" :style="pillStyle(statusNotificacaoColor(t.statusNotificacao))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusNotificacaoColor(t.statusNotificacao) }" />
                {{ statusNotificacaoLabel(t.statusNotificacao) }}
              </span>
            </div>
            <div v-if="visibleCols.has('statusConfirmacao')">
              <span class="flex items-center" :style="pillStyle(statusConfirmacaoColor(t.statusConfirmacao))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusConfirmacaoColor(t.statusConfirmacao) }" />
                {{ statusConfirmacaoLabel(t.statusConfirmacao) }}
              </span>
            </div>
            <div v-if="visibleCols.has('situacaoTitulo')">
              <span class="flex items-center" :style="pillStyle(situacaoTituloColor(t.situacaoTitulo))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: situacaoTituloColor(t.situacaoTitulo) }" />
                {{ situacaoTituloLabel(t.situacaoTitulo) }}
              </span>
            </div>
            <div v-if="visibleCols.has('statusPagamento')">
              <span class="flex items-center" :style="pillStyle(statusPagamentoColor(t.statusPagamento))">
                <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: statusPagamentoColor(t.statusPagamento) }" />
                {{ statusPagamentoLabel(t.statusPagamento) }}
              </span>
            </div>
            <div
              v-if="visibleCols.has('diasAtraso')"
              :style="{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'var(--weight-bold)',
                color: t.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-muted)',
              }"
            >
              {{ t.diasAtraso }}
            </div>
            <div v-if="visibleCols.has('boleto')" class="flex items-center" style="gap: 8px">
              <span
                :style="{
                  fontVariantNumeric: 'tabular-nums',
                  color: t.boletoGeradoEm ? 'var(--text-default)' : 'var(--text-muted)',
                }"
              >
                {{ t.boletoGeradoEm ?? 'Não Informado' }}
              </span>
              <Tooltip :content="t.boletoGeradoEm ? 'Boleto gerado' : 'Sem boleto'">
                <CheckCircle2
                  v-if="t.boletoGeradoEm"
                  :size="15"
                  :stroke-width="2.25"
                  style="color: var(--success-base); flex-shrink: 0"
                />
                <XCircle
                  v-else
                  :size="15"
                  :stroke-width="2.25"
                  style="color: var(--danger-base); flex-shrink: 0"
                />
              </Tooltip>
            </div>

            <div class="flex justify-end" style="position: relative">
              <button
                class="flex items-center justify-center"
                :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: menuOpenId === t.id ? 'var(--surface-sunken)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }"
                @click.stop="menuOpenId = menuOpenId === t.id ? null : t.id"
              >
                <MoreVertical :size="16" />
              </button>
              <template v-if="menuOpenId === t.id">
                <div style="position: fixed; inset: 0; z-index: 30" @click.stop="menuOpenId = null" />
                <div
                  style="
                    position: absolute;
                    top: 36px;
                    right: 0;
                    z-index: 31;
                    background: var(--surface-card);
                    border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    min-width: 220px;
                    overflow: hidden;
                  "
                >
                  <button
                    v-for="action in menuActions(t)"
                    :key="action.label"
                    class="flex items-center titulos-menu-item"
                    style="
                      gap: 10px;
                      width: 100%;
                      padding: 10px 14px;
                      background: transparent;
                      border: none;
                      cursor: pointer;
                      font-size: var(--text-sm);
                      color: var(--text-default);
                      text-align: left;
                    "
                    @click.stop="action.onClick"
                  >
                    <component
                      :is="action.icon"
                      :size="15"
                      style="color: var(--text-muted); flex-shrink: 0"
                    />
                    {{ action.label }}
                  </button>
                </div>
              </template>
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
  </div>
</template>

<style scoped>
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
.titulos-table-row {
  column-gap: 16px;
  padding: 14px 20px;
  white-space: nowrap;
}
.titulos-table-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.titulos-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.titulos-row:hover {
  background: var(--surface-sunken);
}
.titulos-cols-item:hover {
  background: var(--surface-sunken);
}
.titulos-menu-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### TitulosScreen

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { TITULOS_SEED, type Titulo } from '../data/titulosData';
import TitulosListScreen from './TitulosListScreen.vue';
import TituloDetailScreen from './TituloDetailScreen.vue';

type Route = { level: 'list' } | { level: 'detail'; tituloId: string };

const list = ref<Titulo[]>(TITULOS_SEED.map((t) => ({ ...t })));
const route = ref<Route>({ level: 'list' });
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? list.value.find((t) => t.id === r.tituloId) : undefined;
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

function openDetail(tituloId: string) {
  route.value = { level: 'detail', tituloId };
}

function handleGerarBoleto(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, boletoGeradoEm: todayBR() } : t,
  );
  showToast('Boleto gerado (mock)');
}

function handleNotificar(id: string) {
  list.value = list.value.map((t) =>
    t.id === id
      ? { ...t, ultimaNotificacaoEm: todayBR(), statusNotificacao: 'NOTIFICADO' }
      : t,
  );
  showToast('Notificação enviada (mock)');
}

function handleConfirmar(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, statusConfirmacao: 'CONFIRMADO' } : t,
  );
  showToast('Ativo confirmado (mock)');
}

function handleNegociar(id: string) {
  list.value = list.value.map((t) =>
    t.id === id ? { ...t, emNegociacao: true } : t,
  );
  showToast('Negociação sinalizada');
}
</script>

<template>
  <TitulosListScreen
    v-if="route.level === 'list'"
    :titulos="list"
    @open="openDetail"
    @gerar-boleto="handleGerarBoleto"
    @notificar="handleNotificar"
    @confirmar="handleConfirmar"
    @negociar="handleNegociar"
  />
  <template v-else>
    <TituloDetailScreen
      v-if="tituloAtual"
      :titulo="tituloAtual"
      @back="route = { level: 'list' }"
      @gerar-boleto="handleGerarBoleto"
      @notificar="handleNotificar"
      @confirmar="handleConfirmar"
      @negociar="handleNegociar"
    />
    <TitulosListScreen
      v-else
      :titulos="list"
      @open="openDetail"
      @gerar-boleto="handleGerarBoleto"
      @notificar="handleNotificar"
      @confirmar="handleConfirmar"
      @negociar="handleNegociar"
    />
  </template>

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
```

## Screens / titulo-detail

### AccrualTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { brl, type Titulo } from '../../data/titulosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: Titulo }>();

const rows = computed(() => [
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 3)) },
  { data: props.titulo.emissao, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((((props.titulo.vrNominal * 0.0185) / 252) * 2)) },
  { data: props.titulo.vencimento, taxa: '1,8500%', base: '252', accrual: brl((props.titulo.vrNominal * 0.0185) / 252), acumulado: brl((props.titulo.vrNominal * 0.0185) / 252) },
]);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => rows.value, { defaultPageSize: 5 });
</script>

<template>
  <Section title="Cálculo de Accrual">
    <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
        <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style="text-align: right">Acumulado</div>
      </div>
      <div
        v-for="(r, i) in pageItems"
        :key="i"
        class="grid items-center"
        style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-variant-numeric: tabular-nums"
      >
        <div style="color: var(--text-muted)">{{ r.data }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.taxa }}</div>
        <div style="color: var(--text-muted)">{{ r.base }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.accrual }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right">{{ r.acumulado }}</div>
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
  </Section>
</template>
```

### AnexosTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { Download } from 'lucide-vue-next';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

const files = computed(() => [
  { name: `${props.titulo.tipo}-${props.titulo.numero}.xml`, size: '14 KB', type: 'XML' },
  { name: `Laudo-${props.titulo.numero}.pdf`, size: '210 KB', type: 'PDF' },
  { name: `Boleto-${props.titulo.numero}.pdf`, size: '88 KB', type: 'PDF' },
  ...(props.titulo.boletoGeradoEm
    ? [{ name: `Comprovante-boleto-${props.titulo.numero}.pdf`, size: '42 KB', type: 'PDF' }]
    : []),
]);
</script>

<template>
  <Section title="Anexos do Título">
    <div class="flex flex-col" style="gap: 12px">
      <div
        v-for="f in files"
        :key="f.name"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div class="flex items-center justify-center" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em">{{ f.type }}</div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ f.name }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ f.size }}</div>
        </div>
        <button class="flex items-center" style="gap: 8px; padding: 8px 14px; background: var(--surface-card); color: var(--text-strong); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)">
          <Download :size="14" /> Baixar
        </button>
      </div>
    </div>
  </Section>
</template>
```

### ConfirmacoesTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

const items = computed(() => [
  {
    data: props.titulo.emissao,
    tipo: 'Confirmação do Sacado',
    resultado: props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao,
    obs: 'Via portal eletrônico',
  },
  {
    data: props.titulo.emissao,
    tipo: 'Validação de Lastro',
    resultado: 'CONFIRMADO',
    obs: `Documento ${props.titulo.lastro} verificado`,
  },
  {
    data: props.titulo.emissao,
    tipo: 'Registro Registradora',
    resultado: props.titulo.situacaoTitulo === 'VALIDADO' || props.titulo.situacaoTitulo === 'EM_CARTEIRA' ? 'CONFIRMADO' : 'PENDENTE',
    obs: 'B3 — protocolo #' + props.titulo.numero.replace(/\D/g, '').slice(-5),
  },
]);

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap.PENDENTE;
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="(c, i) in items"
        :key="i"
        class="flex items-center"
        style="gap: 14px; padding: 14px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
      >
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ c.tipo }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ c.data }} · {{ c.obs }}</div>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: tone(c.resultado).bg,
            color: tone(c.resultado).fg,
          }"
        >
          {{ c.resultado }}
        </span>
      </div>
    </div>
  </Section>
</template>
```

### CopyButton

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check as CheckIcon } from 'lucide-vue-next';

const props = defineProps<{ value: string }>();

const copied = ref(false);

function handleCopy(e: MouseEvent) {
  e.stopPropagation();
  navigator.clipboard.writeText(props.value).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    :style="{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      flexShrink: 0,
      transition: 'color var(--duration-fast)',
    }"
    @click="handleCopy"
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

### DetailsTab

```vue
<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
import {
  brl,
  situacaoTituloLabel,
  statusPagamentoLabel,
  statusNotificacaoLabel,
  statusConfirmacaoLabel,
  type Titulo,
} from '../../data/titulosData';
import Section from './Section.vue';
import Field from './Field.vue';
import Participant from './Participant.vue';
import CopyButton from './CopyButton.vue';

defineProps<{ titulo: Titulo }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <Section title="Informações do Título">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Número">
          <span class="flex items-center" style="gap: 6px">#{{ titulo.numero }}<CopyButton :value="titulo.numero" /></span>
        </Field>
        <Field label="Lastro">
          <span
            style="
              display: inline-block;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: var(--gci-light);
              color: var(--gci-base);
            "
          >
            {{ titulo.lastro }}
          </span>
        </Field>
        <Field label="Tipo de Ativo">{{ titulo.tipo }}</Field>
        <Field label="Veículo">{{ titulo.veiculoNome }}</Field>
        <Field label="Classe / Operação">{{ titulo.classeOuOperacao ?? '—' }}</Field>
        <Field label="Gerente">{{ titulo.gerente }}</Field>
        <Field label="Situação do Título">{{ situacaoTituloLabel(titulo.situacaoTitulo) }}</Field>
        <Field label="Status de Pagamento">{{ statusPagamentoLabel(titulo.statusPagamento) }}</Field>
        <Field label="Status de Notificação">{{ statusNotificacaoLabel(titulo.statusNotificacao) }}</Field>
        <Field label="Status de Confirmação">{{ statusConfirmacaoLabel(titulo.statusConfirmacao) }}</Field>
        <Field label="Dias em atraso">{{ titulo.diasAtraso }}</Field>
        <Field label="Boleto">{{ titulo.boletoGeradoEm ? `Gerado em ${titulo.boletoGeradoEm}` : 'Não gerado' }}</Field>
      </div>
    </Section>

    <Section title="Valores">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Valor Nominal">{{ brl(titulo.vrNominal) }}</Field>
        <Field label="Valor de Aquisição">{{ titulo.vrAquisicao != null ? brl(titulo.vrAquisicao) : '—' }}</Field>
        <Field label="Valor Presente">{{ titulo.vrPresente != null ? brl(titulo.vrPresente) : '—' }}</Field>
        <Field label="Valor em Aberto">{{ brl(titulo.vrAberto) }}</Field>
        <Field label="Valor de Juros">{{ brl(titulo.vrJuros) }}</Field>
        <Field label="Valor de Multa">{{ brl(titulo.vrMulta) }}</Field>
      </div>
    </Section>

    <Section title="Datas e Prazos">
      <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
        <Field label="Data de Emissão">{{ titulo.emissao }}</Field>
        <Field label="Data de Vencimento">{{ titulo.vencimento }}</Field>
        <Field label="Última Notificação">{{ titulo.ultimaNotificacaoEm ?? '—' }}</Field>
        <Field label="Boleto Gerado em">{{ titulo.boletoGeradoEm ?? '—' }}</Field>
      </div>
    </Section>

    <Section title="Participantes">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <Participant role="Cedente" :name="titulo.cedente" :cnpj="titulo.cedenteCnpj" :icon="Building2" />
        <Participant role="Sacado" :name="titulo.sacado" :cnpj="titulo.sacadoCnpj" :icon="User" />
      </div>
    </Section>
  </div>
</template>
```

### Field

```vue
<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">{{ label }}</div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)"><slot /></div>
  </div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

const events = computed(() => {
  const list: { date: string; label: string; tone: string }[] = [
    { date: props.titulo.emissao, label: 'Título emitido pelo cedente', tone: 'info' },
    { date: props.titulo.emissao, label: `Lastro ${props.titulo.lastro} vinculado ao veículo ${props.titulo.veiculoNome}`, tone: 'info' },
  ];
  if (props.titulo.statusConfirmacao === 'CONFIRMADO') {
    list.push({ date: props.titulo.emissao, label: 'Confirmação do sacado registrada', tone: 'success' });
  } else if (props.titulo.statusConfirmacao === 'REJEITADO') {
    list.push({ date: props.titulo.emissao, label: 'Confirmação do sacado rejeitada', tone: 'danger' });
  } else {
    list.push({ date: props.titulo.emissao, label: 'Aguardando confirmação do sacado', tone: 'warning' });
  }
  if (props.titulo.boletoGeradoEm) {
    list.push({ date: props.titulo.boletoGeradoEm, label: 'Boleto gerado', tone: 'info' });
  }
  if (props.titulo.ultimaNotificacaoEm) {
    list.push({ date: props.titulo.ultimaNotificacaoEm, label: 'Notificação de cobrança enviada', tone: 'info' });
  }
  if (props.titulo.emNegociacao) {
    list.push({ date: props.titulo.ultimaNotificacaoEm ?? props.titulo.vencimento, label: 'Negociação sinalizada', tone: 'warning' });
  }
  list.push({
    date: props.titulo.vencimento,
    label: props.titulo.statusPagamento === 'VENCIDO' ? 'Inadimplência identificada' : props.titulo.statusPagamento === 'LIQUIDADO' ? 'Título liquidado' : 'Vencimento programado',
    tone: props.titulo.statusPagamento === 'VENCIDO' ? 'danger' : props.titulo.statusPagamento === 'LIQUIDADO' ? 'success' : 'neutral',
  });
  return list;
});

const toneMap: Record<string, string> = {
  info: 'var(--gci-base)',
  success: 'var(--success-base)',
  warning: 'var(--warning-base)',
  danger: 'var(--danger-base)',
  neutral: 'var(--neutral-300)',
};
</script>

<template>
  <Section title="Linha do Tempo">
    <div class="flex flex-col" style="gap: 0; position: relative">
      <div v-for="(e, i) in events" :key="i" class="flex items-start" style="gap: 16px; padding: 12px 0; position: relative">
        <div style="position: relative; width: 12px">
          <span style="display: block; width: 12px; height: 12px; border-radius: 9999px; margin-top: 6px" :style="{ background: toneMap[e.tone] }" />
          <span
            v-if="i < events.length - 1"
            style="position: absolute; left: 5px; top: 18px; bottom: -12px; width: 2px; background: var(--border-default)"
          />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.label }}</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ e.date }}</div>
        </div>
      </div>
    </div>
  </Section>
</template>
```

### MovimentacoesTab

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { brl, type Titulo } from '../../data/titulosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: Titulo }>();

type MovSub = 'registro' | 'cessao';
const sub = ref<MovSub>('registro');

const registroRows = computed(() => [
  { data: props.titulo.emissao, operacao: 'Inclusão', registradora: 'B3', protocolo: '#' + props.titulo.lastro, valor: brl(props.titulo.vrNominal) },
  ...(props.titulo.boletoGeradoEm
    ? [{ data: props.titulo.boletoGeradoEm, operacao: 'Boleto gerado', registradora: '—', protocolo: '—', valor: brl(props.titulo.vrAberto) }]
    : []),
]);

const cessaoRows = computed(() => [
  { data: props.titulo.emissao, cedente: props.titulo.cedente, cessionario: props.titulo.veiculoNome, valor: brl(props.titulo.vrNominal) },
]);

const {
  page: registroPage,
  pageSize: registroPageSize,
  total: registroTotal,
  pageItems: registroPageItems,
  setPage: setRegistroPage,
  setPageSize: setRegistroPageSize,
} = useTablePagination(() => registroRows.value, { defaultPageSize: 5 });

const {
  page: cessaoPage,
  pageSize: cessaoPageSize,
  total: cessaoTotal,
  pageItems: cessaoPageItems,
  setPage: setCessaoPage,
  setPageSize: setCessaoPageSize,
} = useTablePagination(() => cessaoRows.value, { defaultPageSize: 5 });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex" style="gap: 4px; padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg); align-self: flex-start">
      <button
        v-for="s in (['registro', 'cessao'] as MovSub[])"
        :key="s"
        :style="{
          padding: '8px 16px',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.10em',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          background: sub === s ? 'var(--surface-card)' : 'transparent',
          color: sub === s ? 'var(--text-strong)' : 'var(--text-muted)',
          boxShadow: sub === s ? 'var(--shadow-xs)' : 'none',
          transition: 'all var(--duration-base)',
        }"
        @click="sub = s"
      >
        {{ s === 'registro' ? 'MOVIMENTAÇÕES DE REGISTRO' : 'MOVIMENTO DE CESSÃO' }}
      </button>
    </div>

    <Section v-if="sub === 'registro'" title="Movimentações de Registro">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Operação</div><div>Registradora</div><div>Protocolo</div><div style="text-align: right">Valor</div>
        </div>
        <div
          v-for="(r, i) in registroPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.operacao }}</div>
          <div style="color: var(--text-default)">{{ r.registradora }}</div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.protocolo }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); text-align: right; font-variant-numeric: tabular-nums">{{ r.valor }}</div>
        </div>
        <TablePagination
          sunken
          compact
          :total="registroTotal"
          :page="registroPage"
          :page-size="registroPageSize"
          @update:page="setRegistroPage"
          @update:page-size="setRegistroPageSize"
        />
      </div>
    </Section>

    <Section v-if="sub === 'cessao'" title="Movimento de Cessão">
      <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div><div>Cedente</div><div>Cessionário</div><div>Valor</div><div style="text-align: right">Status</div>
        </div>
        <div
          v-for="(r, i) in cessaoPageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1.4fr 1.4fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted)">{{ r.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cessionario }}</div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ r.valor }}</div>
          <div style="text-align: right">
            <span style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 8px; border-radius: 9999px; background: var(--success-light); color: var(--success-dark)">LIQUIDADO</span>
          </div>
        </div>
        <TablePagination
          sunken
          compact
          :total="cessaoTotal"
          :page="cessaoPage"
          :page-size="cessaoPageSize"
          @update:page="setCessaoPage"
          @update:page-size="setCessaoPageSize"
        />
      </div>
    </Section>
  </div>
</template>
```

### PagamentosTab

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { brl, type Titulo } from '../../data/titulosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: Titulo }>();

interface PagamentoLocal {
  data: string;
  valorAmortizacao: number;
  tipoPagamento: string;
  jurosRemuneratorio: number;
  jurosMoratorio: number;
  multa: number;
  desconto: number;
}

const pagamentos = ref<PagamentoLocal[]>(
  props.titulo.vrAberto < props.titulo.vrNominal
    ? [
        {
          data: props.titulo.emissao,
          valorAmortizacao: props.titulo.vrNominal - props.titulo.vrAberto,
          tipoPagamento: 'TED',
          jurosRemuneratorio: 0,
          jurosMoratorio: 0,
          multa: 0,
          desconto: 0,
        },
      ]
    : [],
);

const form = ref({
  dataPagamento: '',
  valorAmortizacao: '',
  tipoPagamento: 'TED',
  jurosMoratorio: '',
  multa: '',
});

const canSalvar = computed(
  () => form.value.dataPagamento.trim() !== '' && form.value.valorAmortizacao.trim() !== '',
);

function handleSalvar() {
  if (!canSalvar.value) return;
  pagamentos.value = [
    {
      data: form.value.dataPagamento,
      valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
      tipoPagamento: form.value.tipoPagamento,
      jurosRemuneratorio: 0,
      jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
      multa: Number(form.value.multa) || 0,
      desconto: 0,
    },
    ...pagamentos.value,
  ];
  form.value = {
    dataPagamento: '',
    valorAmortizacao: '',
    tipoPagamento: 'TED',
    jurosMoratorio: '',
    multa: '',
  };
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => pagamentos.value,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <Section title="Registrar Pagamento">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
        <div>
          <div class="field-label">Data do pagamento</div>
          <input v-model="form.dataPagamento" type="text" placeholder="dd/mm/aaaa" class="field-input" />
        </div>
        <div>
          <div class="field-label">Valor amortização</div>
          <input v-model="form.valorAmortizacao" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Tipo</div>
          <select v-model="form.tipoPagamento" class="field-input">
            <option value="TED">TED</option>
            <option value="PIX">PIX</option>
            <option value="BOLETO">Boleto</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <div class="field-label">Juros moratório</div>
          <input v-model="form.jurosMoratorio" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Multa</div>
          <input v-model="form.multa" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div class="flex items-end">
          <button
            :disabled="!canSalvar"
            :style="{
              height: '38px',
              padding: '0 18px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: canSalvar ? 'pointer' : 'not-allowed',
              background: canSalvar ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
              color: canSalvar ? '#fff' : 'var(--text-muted)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              opacity: canSalvar ? 1 : 0.7,
            }"
            @click="handleSalvar"
          >
            SALVAR PAGAMENTO
          </button>
        </div>
      </div>
    </Section>

    <Section title="Pagamentos Realizados">
      <div v-if="pagamentos.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhum pagamento registrado para este título.
      </div>
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div>
          <div>Tipo</div>
          <div style="text-align: right">Amortização</div>
          <div style="text-align: right">Juros</div>
          <div style="text-align: right">Multa</div>
        </div>
        <div
          v-for="(p, i) in pageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipoPagamento }}</div>
          <div style="text-align: right; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(p.valorAmortizacao) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.jurosMoratorio) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.multa) }}</div>
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
    </Section>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.field-input {
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
</style>
```

### Participant

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import CopyButton from './CopyButton.vue';

defineProps<{ role: string; name: string; cnpj: string; icon: Component }>();
</script>

<template>
  <div class="flex items-center" style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
    <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0">
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ role }}</div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ name }}</div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">{{ cnpj }}<CopyButton :value="cnpj" /></div>
    </div>
  </div>
</template>
```

### Section

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 16px">{{ title }}</div>
    <slot />
  </div>
</template>
```

## Components

### CobrancaCard

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Mail, MessageCircle, Smartphone, Building2, MoreVertical, Pencil, EyeOff, Eye, Trash2 } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Notificacao, Metodo } from '../data/cobrancaData';

const props = defineProps<{
  notificacao: Notificacao;
}>();

const emit = defineEmits<{
  edit: [id: string];
  toggleStatus: [id: string];
  delete: [id: string];
}>();

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];
const METODO_ICONS: Record<Metodo, Component> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: Smartphone,
};

function formatDias(dias: number[], max = 4) {
  if (dias.length === 0) return '—';
  const shown = dias.slice(0, max);
  const rest = dias.length - max;
  const base = shown.map((d) => `${d}d`).join(', ');
  return rest > 0 ? `${base} +${rest}` : base;
}

const hover = ref(false);
const menuOpen = ref(false);
const isAtiva = computed(() => props.notificacao.status === 'Ativa');

function onMouseLeaveCard() {
  hover.value = false;
  menuOpen.value = false;
}

function handleEdit() {
  menuOpen.value = false;
  emit('edit', props.notificacao.id);
}

function handleToggleStatus() {
  menuOpen.value = false;
  emit('toggleStatus', props.notificacao.id);
}

function handleDelete() {
  menuOpen.value = false;
  emit('delete', props.notificacao.id);
}
</script>

<template>
  <div
    class="relative flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.20)' : 'var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      gap: '14px',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      opacity: isAtiva ? 1 : 0.75,
    }"
    @mouseenter="hover = true"
    @mouseleave="onMouseLeaveCard"
  >
    <!-- Header: name + status + menu -->
    <div class="flex items-start justify-between" style="gap: 8px">
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: var(--text-md);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            line-height: 1.25;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ notificacao.nome }}
        </div>
        <span
          :style="{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: isAtiva ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
            color: isAtiva ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
          }"
        >
          {{ notificacao.status }}
        </span>
      </div>

      <!-- Three-dot menu -->
      <div style="position: relative; flex-shrink: 0">
        <button
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: menuOpen ? 'var(--surface-sunken)' : 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--duration-fast)',
          }"
          @click.stop="menuOpen = !menuOpen"
        >
          <MoreVertical :size="16" />
        </button>
        <div
          v-if="menuOpen"
          style="
            position: absolute;
            top: 36px;
            right: 0;
            background: var(--surface-card);
            border-width: 1px;
            border-style: solid;
            border-color: var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            z-index: 20;
            overflow: hidden;
            min-width: 172px;
          "
        >
          <button
            class="cobranca-menu-item flex items-center"
            style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--text-default); text-align: left"
            @click.stop="handleEdit"
          >
            <Pencil :size="14" />
            Editar régua
          </button>

          <button
            class="cobranca-menu-item flex items-center"
            :style="{
              gap: '10px', width: '100%', padding: '10px 14px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              color: isAtiva ? 'var(--text-default)' : 'var(--success-dark)',
              textAlign: 'left',
            }"
            @click.stop="handleToggleStatus"
          >
            <EyeOff v-if="isAtiva" :size="14" />
            <Eye v-else :size="14" />
            {{ isAtiva ? 'Pausar envios' : 'Reativar régua' }}
          </button>

          <div style="height: 1px; background: var(--border-default); margin: 2px 0" />

          <button
            class="cobranca-menu-item flex items-center"
            style="gap: 10px; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: var(--text-sm); color: var(--action-danger-text-only); text-align: left"
            @click.stop="handleDelete"
          >
            <Trash2 :size="14" />
            Deletar notificação
          </button>
        </div>
      </div>
    </div>

    <!-- Methods -->
    <div class="flex flex-wrap" style="gap: 6px">
      <span
        v-for="m in METODOS"
        :key="m"
        class="flex items-center"
        :style="{
          gap: '4px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          background: notificacao.metodos.includes(m) ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
          color: notificacao.metodos.includes(m) ? 'var(--status-active-text)' : 'var(--status-neutral-text)',
        }"
      >
        <component :is="METODO_ICONS[m]" :size="10" :stroke-width="2.5" />
        {{ m }}
      </span>
    </div>

    <!-- Interval counts + day breakdown -->
    <div class="flex" style="gap: 1px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-default)">
      <!-- A Vencer -->
      <div style="flex: 1; padding: 10px 12px; background: var(--surface-sunken); display: flex; flex-direction: column; gap: 4px">
        <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          A Vencer
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span style="font-size: var(--text-xl); font-weight: 700; color: var(--text-strong); font-variant-numeric: tabular-nums; line-height: 1">
            {{ notificacao.intervalosAVencer.length }}
          </span>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-muted)">
            {{ notificacao.intervalosAVencer.length === 1 ? 'envio' : 'envios' }}
          </span>
        </div>
        <div
          style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          :title="notificacao.intervalosAVencer.map((d) => `${d}d antes`).join(', ')"
        >
          {{ formatDias(notificacao.intervalosAVencer) }} antes
        </div>
      </div>

      <div style="width: 1px; background: var(--border-default); flex-shrink: 0" />

      <!-- Vencidos -->
      <div style="flex: 1; padding: 10px 12px; background: var(--surface-sunken); display: flex; flex-direction: column; gap: 4px">
        <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          Vencidos
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span style="font-size: var(--text-xl); font-weight: 700; color: var(--danger-base); font-variant-numeric: tabular-nums; line-height: 1">
            {{ notificacao.intervalosVencidos.length }}
          </span>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-muted)">
            {{ notificacao.intervalosVencidos.length === 1 ? 'envio' : 'envios' }}
          </span>
        </div>
        <div
          style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          :title="notificacao.intervalosVencidos.map((d) => `${d}d depois`).join(', ')"
        >
          {{ formatDias(notificacao.intervalosVencidos) }} depois
        </div>
      </div>
    </div>

    <!-- Vehicles -->
    <div class="flex items-center" style="gap: 6px">
      <Building2 :size="13" style="color: var(--text-muted); flex-shrink: 0" />
      <span style="font-size: var(--text-xs); color: var(--text-muted)">
        <strong style="color: var(--text-default)">{{ notificacao.veiculos.length }}</strong>
        {{ notificacao.veiculos.length === 1 ? 'veículo associado' : 'veículos associados' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.cobranca-menu-item:hover {
  background: var(--surface-sunken) !important;
}
</style>
```

### NovaNotificacaoModal

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X, Settings, Clock, AlertCircle, Building2, ChevronRight, Check } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Metodo } from '../data/cobrancaData';
import FieldLabel from './nova-notificacao/FieldLabel.vue';
import TextInput from './nova-notificacao/TextInput.vue';
import TemplateSelector from './nova-notificacao/TemplateSelector.vue';
import IntervalStep from './nova-notificacao/IntervalStep.vue';
import VeiculosStep from './nova-notificacao/VeiculosStep.vue';
import { TEMPLATES, type TemplateTom } from './nova-notificacao/templates';
import ToggleRow from '@/features/risco/screens/detail-tabs/shared/ToggleRow.vue';

export interface NewNotificacaoData {
  nome: string;
  metodos: Metodo[];
  templateAVencer: string;
  templateVencidos: string;
  intervalosAVencer: number[];
  intervalosVencidos: number[];
  veiculos: string[];
  enviaFimSemanaFeriado: boolean;
}

const emit = defineEmits<{ close: []; create: [data: NewNotificacaoData] }>();

interface StepDef {
  key: string;
  label: string;
  icon: Component;
}

const steps: StepDef[] = [
  { key: 'config', label: 'Configuração', icon: Settings },
  { key: 'avencer', label: 'A Vencer', icon: Clock },
  { key: 'vencidos', label: 'Vencidos', icon: AlertCircle },
  { key: 'veiculos', label: 'Veículos', icon: Building2 },
];

const METODOS: Metodo[] = ['Email', 'WhatsApp', 'SMS'];

const stepIdx = ref(0);
const nome = ref('');
const metodos = ref<Metodo[]>(['Email']);
const templateAVencer = ref<TemplateTom>('amigavel');
const templateVencidos = ref<TemplateTom>('formal');
const intervalosAVencer = ref<number[]>([30, 15, 7]);
const intervalosVencidos = ref<number[]>([1, 5, 10]);
const veiculos = ref<string[]>([]);
const enviaFimSemanaFeriado = ref(false);
const stepHover = ref<number | null>(null);

const step = computed(() => steps[stepIdx.value]);
const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function toggleMetodo(m: Metodo) {
  metodos.value = metodos.value.includes(m)
    ? metodos.value.filter((x) => x !== m)
    : [...metodos.value, m];
}

function handleSave() {
  emit('create', {
    nome: nome.value,
    metodos: metodos.value,
    templateAVencer: TEMPLATES[templateAVencer.value].avencer,
    templateVencidos: TEMPLATES[templateVencidos.value].vencidos,
    intervalosAVencer: intervalosAVencer.value,
    intervalosVencidos: intervalosVencidos.value,
    veiculos: veiculos.value,
    enviaFimSemanaFeriado: enviaFimSemanaFeriado.value,
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
    @click="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 840px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-strong); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 4px">
            Nova Notificação de Cobrança
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted)">
            Configure a régua de notificação · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Stepper -->
      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          class="flex flex-col items-center justify-center"
          :style="{
            flex: 1,
            gap: '6px',
            padding: '14px 8px 11px',
            background: 'transparent',
            border: 'none',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            cursor: 'pointer',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--gci-base)' : 'var(--text-muted)',
            opacity: i !== stepIdx && i >= stepIdx && stepHover !== i ? 0.55 : 1,
            transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
          }"
          @click="stepIdx = i"
          @mouseenter="stepHover = i"
          @mouseleave="stepHover = null"
        >
          <component :is="s.icon" :size="18" :stroke-width="i === stepIdx ? 2.25 : 1.5" />
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
            {{ s.label }}
          </span>
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 40px">
        <!-- Step 1 — Configuração -->
        <div v-if="step.key === 'config'" style="display: flex; flex-direction: column; gap: 28px">
          <div>
            <FieldLabel>Nome da Notificação *</FieldLabel>
            <TextInput v-model="nome" placeholder="Ex: Régua Padrão — A Vencer" />
          </div>

          <div>
            <FieldLabel>Método de Notificação</FieldLabel>
            <div class="flex items-center" style="gap: 8px; width: 100%">
              <button
                v-for="m in METODOS"
                :key="m"
                type="button"
                :style="{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: metodos.includes(m) ? 'var(--action-primary-bg)' : 'var(--action-secondary-border)',
                  background: metodos.includes(m) ? 'var(--action-primary-bg)' : 'var(--action-secondary-bg)',
                  color: metodos.includes(m) ? '#fff' : 'var(--action-secondary-text)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--duration-fast)',
                  flexShrink: 0,
                }"
                @click="toggleMetodo(m)"
              >
                {{ m }}
              </button>
              <div style="flex: 1; min-width: 0">
                <ToggleRow
                  compact
                  label="Enviar em finais de semana e feriados"
                  :on="enviaFimSemanaFeriado"
                  @toggle="enviaFimSemanaFeriado = !enviaFimSemanaFeriado"
                />
              </div>
            </div>
          </div>

          <div
            style="
              padding: 20px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
              border-width: 1px;
              border-style: solid;
              border-color: var(--border-default);
              display: flex;
              flex-direction: column;
              gap: 24px;
            "
          >
            <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: var(--text-muted); text-transform: uppercase">
              Templates de Mensagem
            </div>
            <TemplateSelector
              v-model="templateAVencer"
              label="Template para mensagens a vencer"
              text-key="avencer"
            />
            <div style="height: 1px; background: var(--border-default)" />
            <TemplateSelector
              v-model="templateVencidos"
              label="Template para mensagens vencidas"
              text-key="vencidos"
            />
          </div>
        </div>

        <!-- Step 2 — A Vencer -->
        <IntervalStep
          v-else-if="step.key === 'avencer'"
          title="Intervalos de Notificação — A Vencer"
          subtitle="Defina quantos dias antes do vencimento cada disparo deve ocorrer."
          input-label="Dias antes do vencimento"
          :intervals="intervalosAVencer"
          mode="avencer"
          @update:intervals="intervalosAVencer = $event"
        />

        <!-- Step 3 — Vencidos -->
        <IntervalStep
          v-else-if="step.key === 'vencidos'"
          title="Intervalos de Notificação — Vencidos"
          subtitle="Defina quantos dias após o vencimento cada disparo deve ocorrer."
          input-label="Dias após o vencimento"
          :intervals="intervalosVencidos"
          mode="vencidos"
          @update:intervals="intervalosVencidos = $event"
        />

        <!-- Step 4 — Veículos -->
        <VeiculosStep
          v-else-if="step.key === 'veiculos'"
          :selected="veiculos"
          @update:selected="veiculos = $event"
        />
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        :style="{
          padding: '16px 32px',
          borderTop: '1px solid var(--border-default)',
          background: isLast ? 'rgba(5,150,105,0.04)' : 'var(--surface-card)',
          flexShrink: 0,
          transition: 'background var(--duration-base)',
        }"
      >
        <button
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="isFirst ? emit('close') : stepIdx--"
        >
          {{ isFirst ? 'Cancelar' : '← Voltar' }}
        </button>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ stepIdx + 1 }} / {{ steps.length }}
        </span>
        <button
          class="flex items-center"
          :style="{
            gap: '8px',
            padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }"
          @click="isLast ? handleSave() : stepIdx++"
        >
          {{ isLast ? 'Salvar Notificação' : 'Próxima Etapa' }}
          <Check v-if="isLast" :size="15" />
          <ChevronRight v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>
```

## Components / nova-notificacao

### FieldLabel

```vue
<template>
  <div
    style="
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    "
  >
    <slot />
  </div>
</template>
```

### IntervalStep

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Trash2, Plus } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';

const props = defineProps<{
  title: string;
  subtitle: string;
  inputLabel: string;
  intervals: number[];
  mode: 'avencer' | 'vencidos';
}>();
const emit = defineEmits<{ 'update:intervals': [v: number[]] }>();

const listRef = ref<HTMLDivElement | null>(null);
const removeHover = ref<number | null>(null);
const addHover = ref(false);

function addRow() {
  const last = props.intervals[props.intervals.length - 1] ?? (props.mode === 'avencer' ? 31 : 0);
  const next = props.mode === 'avencer' ? Math.max(last - 1, 1) : last + 1;
  emit('update:intervals', [...props.intervals, next]);
  setTimeout(() => {
    listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' });
  }, 30);
}

function removeRow(idx: number) {
  emit('update:intervals', props.intervals.filter((_, i) => i !== idx));
}

function updateRow(idx: number, val: string) {
  const n = parseInt(val, 10);
  const clamped = Math.max(1, isNaN(n) ? 1 : n);
  emit('update:intervals', props.intervals.map((v, i) => (i === idx ? clamped : v)));
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div>
      <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-strong); margin-bottom: 6px">{{ title }}</div>
      <div style="font-size: var(--text-sm); color: var(--text-muted)">{{ subtitle }}</div>
    </div>

    <div ref="listRef" style="display: flex; flex-direction: column; gap: 8px; max-height: 340px; overflow-y: auto">
      <div v-for="(val, idx) in intervals" :key="idx" class="flex items-center" style="gap: 12px">
        <div
          style="
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background: var(--surface-sunken);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ idx + 1 }}
        </div>
        <div style="flex: 1">
          <FieldLabel>{{ inputLabel }}</FieldLabel>
          <input
            type="number"
            :min="1"
            :value="val"
            style="
              height: 40px;
              padding: 0 14px;
              width: 100%;
              background: var(--surface-card);
              border-width: 1px;
              border-style: solid;
              border-color: var(--border-default);
              border-radius: var(--radius-md);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
            "
            @input="updateRow(idx, ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button
          title="Remover intervalo"
          :style="{
            marginTop: '20px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: removeHover === idx ? 'var(--danger-light)' : 'transparent',
            cursor: 'pointer',
            color: removeHover === idx ? 'var(--action-danger-text-only)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color var(--duration-fast), background var(--duration-fast)',
          }"
          @click="removeRow(idx)"
          @mouseenter="removeHover = idx"
          @mouseleave="removeHover = null"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <button
      class="flex items-center"
      :style="{
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-link)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        padding: '4px 0',
        alignSelf: 'flex-start',
        opacity: addHover ? 0.75 : 1,
      }"
      @click="addRow"
      @mouseenter="addHover = true"
      @mouseleave="addHover = false"
    >
      <Plus :size="15" /> Adicionar intervalo
    </button>
  </div>
</template>
```

### TemplateSelector

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';
import FieldLabel from './FieldLabel.vue';
import { TEMPLATES, type TemplateTom } from './templates';

const props = defineProps<{
  label: string;
  modelValue: TemplateTom;
  textKey: 'avencer' | 'vencidos';
}>();
const emit = defineEmits<{ 'update:modelValue': [v: TemplateTom] }>();

const open = ref(false);

function select(key: TemplateTom) {
  emit('update:modelValue', key);
  open.value = false;
}

const templateEntries = Object.entries(TEMPLATES) as [TemplateTom, (typeof TEMPLATES)['amigavel']][];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <FieldLabel>{{ label }}</FieldLabel>

    <!-- Selector trigger -->
    <div style="position: relative">
      <button
        type="button"
        :style="{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: open ? 'var(--border-focus)' : 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }"
        @click="open = !open"
      >
        <div style="flex: 1; min-width: 0">
          <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-strong)">
            {{ TEMPLATES[modelValue].label }}
          </div>
          <div
            style="
              font-size: 11px;
              color: var(--text-muted);
              margin-top: 2px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ TEMPLATES[modelValue][textKey].slice(0, 90) }}…
          </div>
        </div>
        <ChevronDown
          :size="15"
          :style="{
            color: 'var(--text-muted)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--duration-base)',
          }"
        />
      </button>

      <div
        v-if="open"
        style="
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 30;
          overflow: hidden;
        "
      >
        <button
          v-for="[key, t] in templateEntries"
          :key="key"
          type="button"
          class="template-option"
          :class="{ 'template-option--selected': modelValue === key }"
          :style="{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            borderBottom: key !== 'cobranca' ? '1px solid var(--border-default)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }"
          @click="select(key)"
        >
          <div style="display: flex; align-items: center; gap: 8px">
            <Check v-if="modelValue === key" :size="13" style="color: var(--success-base); flex-shrink: 0" />
            <span style="font-size: var(--text-sm); font-weight: 600; color: var(--text-strong)">{{ t.label }}</span>
          </div>
          <span :style="{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: modelValue === key ? '21px' : '0' }">
            {{ t[textKey].slice(0, 80) }}…
          </span>
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div>
      <div
        style="
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        "
      >
        Pré-visualização do template
      </div>
      <div
        style="
          padding: 14px;
          background: var(--surface-sunken);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: var(--leading-relaxed);
        "
      >
        {{ TEMPLATES[modelValue][textKey] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-option {
  background: transparent;
}
.template-option:hover {
  background: var(--surface-sunken);
}
.template-option--selected,
.template-option--selected:hover {
  background: var(--surface-sunken);
}
</style>
```

### TextInput

```vue
<script setup lang="ts">
defineProps<{ placeholder?: string }>();
const model = defineModel<string>({ default: '' });
</script>

<template>
  <input
    v-model="model"
    :placeholder="placeholder"
    style="
      height: 40px;
      padding: 0 14px;
      width: 100%;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-md);
      outline: none;
      font-size: var(--text-sm);
      color: var(--text-strong);
    "
  />
</template>
```

### VeiculosStep

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Search } from 'lucide-vue-next';
import type { VeiculoTipo } from '../../data/cobrancaData';
import { mockVeiculos } from '../../data/cobrancaData';
import Checkbox from '@/components/ui/Checkbox.vue';

type VeiculosTabKey = 'Todos' | 'FIDC' | 'CRA' | 'Garantia';

const TAB_LABELS: Record<VeiculosTabKey, string> = {
  Todos: 'Todos',
  FIDC: 'FIDCs',
  CRA: 'CRAs',
  Garantia: 'Garantias',
};

const TIPO_BADGE: Record<VeiculoTipo, { bg: string; fg: string }> = {
  FIDC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  CRA: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  Garantia: { bg: '#EEF0FF', fg: '#4F46E5' },
};

const TABS: VeiculosTabKey[] = ['Todos', 'FIDC', 'CRA', 'Garantia'];

const props = defineProps<{ selected: string[] }>();
const emit = defineEmits<{ 'update:selected': [v: string[]] }>();

const tab = ref<VeiculosTabKey>('Todos');
const query = ref('');
const rowHover = ref<string | null>(null);

const tabVeiculos = computed(() =>
  tab.value === 'Todos' ? mockVeiculos : mockVeiculos.filter((v) => v.tipo === tab.value),
);

const visible = computed(() =>
  query.value.trim()
    ? tabVeiculos.value.filter((v) => v.nome.toLowerCase().includes(query.value.toLowerCase()))
    : tabVeiculos.value,
);

function toggle(id: string) {
  emit(
    'update:selected',
    props.selected.includes(id)
      ? props.selected.filter((s) => s !== id)
      : [...props.selected, id],
  );
}

function remove(id: string) {
  emit('update:selected', props.selected.filter((s) => s !== id));
}

const visibleIds = computed(() => visible.value.map((v) => v.id));
const allChecked = computed(
  () => visibleIds.value.length > 0 && visibleIds.value.every((id) => props.selected.includes(id)),
);
const someChecked = computed(() => visibleIds.value.some((id) => props.selected.includes(id)));
const indeterminate = computed(() => someChecked.value && !allChecked.value);

function toggleAll() {
  if (allChecked.value) {
    emit('update:selected', props.selected.filter((id) => !visibleIds.value.includes(id)));
  } else {
    emit('update:selected', [...new Set([...props.selected, ...visibleIds.value])]);
  }
}

const selectedInTab = computed(() =>
  tab.value === 'Todos'
    ? mockVeiculos.filter((v) => props.selected.includes(v.id))
    : mockVeiculos.filter((v) => v.tipo === tab.value && props.selected.includes(v.id)),
);

function countByType(t: VeiculoTipo) {
  return mockVeiculos.filter((v) => v.tipo === t && props.selected.includes(v.id)).length;
}

function tabCount(t: VeiculosTabKey) {
  return t === 'Todos'
    ? props.selected.length
    : mockVeiculos.filter((v) => v.tipo === t && props.selected.includes(v.id)).length;
}

function selectTab(t: VeiculosTabKey) {
  tab.value = t;
  query.value = '';
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div>
      <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-strong); margin-bottom: 6px">
        Veículos associados
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted)">
        Selecione os veículos que executarão esta notificação.
      </div>
    </div>

    <!-- Tabs -->
    <div style="display: flex; border-bottom: 1px solid var(--border-default)">
      <button
        v-for="t in TABS"
        :key="t"
        class="flex items-center"
        :style="{
          gap: '6px',
          padding: '10px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: tab === t ? '2px solid var(--agro-base)' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: tab === t ? 700 : 500,
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          marginBottom: '-1px',
          transition: 'color var(--duration-fast)',
        }"
        @click="selectTab(t)"
      >
        {{ TAB_LABELS[t] }}
        <span
          v-if="tabCount(t) > 0"
          :style="{
            fontSize: '9px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            background: tab === t ? 'var(--agro-light)' : 'var(--status-neutral-bg)',
            color: tab === t ? 'var(--agro-base)' : 'var(--status-neutral-text)',
          }"
        >
          {{ tabCount(t) }}
        </span>
      </button>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
      <input
        v-model="query"
        placeholder="Filtrar por nome..."
        style="
          height: 40px;
          padding-left: 36px;
          padding-right: 14px;
          width: 100%;
          background: var(--surface-card);
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          border-radius: var(--radius-md);
          outline: none;
          font-size: var(--text-sm);
          color: var(--text-strong);
        "
      />
    </div>

    <!-- Vehicle list -->
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <label
        class="flex items-center"
        style="
          gap: 10px;
          padding: 10px 14px;
          background: var(--surface-sunken);
          border-bottom: 1px solid var(--border-default);
          cursor: pointer;
        "
      >
        <Checkbox :checked="allChecked" :indeterminate="indeterminate" @change="toggleAll" />
        <span style="font-size: var(--text-xs); font-weight: 700; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase">
          Selecionar todos
        </span>
        <span style="font-size: 11px; color: var(--text-muted); margin-left: auto">
          {{ visibleIds.filter((id) => selected.includes(id)).length }} / {{ visible.length }}
        </span>
      </label>

      <div
        v-if="visible.length === 0"
        class="flex items-center justify-center"
        style="padding: 24px 14px; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum veículo encontrado.
      </div>
      <template v-else>
        <label
          v-for="(v, idx) in visible"
          :key="v.id"
          class="flex items-center"
          :style="{
            gap: '10px',
            padding: '11px 14px',
            borderBottom: idx < visible.length - 1 ? '1px solid var(--border-default)' : 'none',
            background: selected.includes(v.id)
              ? 'rgba(8,60,74,0.03)'
              : rowHover === v.id
                ? 'var(--surface-sunken)'
                : 'transparent',
            cursor: 'pointer',
            transition: 'background var(--duration-fast)',
          }"
          @mouseenter="rowHover = v.id"
          @mouseleave="rowHover = null"
        >
          <Checkbox :checked="selected.includes(v.id)" @change="toggle(v.id)" />
          <span
            :style="{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: TIPO_BADGE[v.tipo].bg,
              color: TIPO_BADGE[v.tipo].fg,
              flexShrink: 0,
            }"
          >
            {{ v.tipo }}
          </span>
          <span :style="{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: selected.includes(v.id) ? 600 : 400, color: 'var(--text-strong)' }">
            {{ v.nome }}
          </span>
        </label>
      </template>
    </div>

    <!-- Selected chips -->
    <div v-if="selectedInTab.length > 0">
      <div class="flex items-center" style="gap: 8px; margin-bottom: 10px">
        <span style="font-size: var(--text-sm); font-weight: 700; color: var(--text-strong)">
          {{ tab === 'Todos' ? 'Selecionados' : `Selecionados — ${TAB_LABELS[tab]}` }}
        </span>
        <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: var(--status-active-bg); color: var(--status-active-text)">
          {{ selectedInTab.length }}
        </span>
      </div>
      <div class="flex flex-wrap" style="gap: 8px">
        <span
          v-for="v in selectedInTab"
          :key="v.id"
          class="flex items-center"
          style="gap: 6px; padding: 5px 10px; border-radius: var(--radius-full); background: var(--status-active-bg); color: var(--status-active-text); font-size: var(--text-xs); font-weight: 600"
        >
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              background: TIPO_BADGE[v.tipo].bg,
              color: TIPO_BADGE[v.tipo].fg,
            }"
          >
            {{ v.tipo }}
          </span>
          {{ v.nome }}
          <button
            title="Remover"
            style="background: none; border: none; cursor: pointer; color: var(--status-active-text); display: flex; padding: 0; margin-left: 2px"
            @click="remove(v.id)"
          >
            <X :size="12" />
          </button>
        </span>
      </div>
    </div>

    <!-- Cross-tab summary -->
    <div style="padding: 10px 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); font-size: var(--text-xs); color: var(--text-muted)">
      <strong style="color: var(--text-default)">{{ countByType('FIDC') }}</strong> FIDCs ·
      <strong style="color: var(--text-default)">{{ countByType('CRA') }}</strong> CRAs ·
      <strong style="color: var(--text-default)">{{ countByType('Garantia') }}</strong> Garantias selecionados
    </div>
  </div>
</template>
```
