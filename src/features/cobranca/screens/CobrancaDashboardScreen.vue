<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  AlertTriangle,
  FileText,
  BellRing,
  Receipt,
  Clock,
  ChevronRight,
  Wallet,
  Search,
} from 'lucide-vue-next';
import { TITULOS_SEED, brl, statusTituloLabel } from '../data/titulosData';
import {
  NOTIFICACOES_CESSAO_SEED,
  statusCessaoLabel,
} from '../data/notificacoesCessaoData';
import TituloDetailScreen from './TituloDetailScreen.vue';
import NotificacaoCessaoDetailScreen from './NotificacaoCessaoDetailScreen.vue';

const emit = defineEmits<{ navigate: [view: string] }>();

type Route =
  | { level: 'dashboard' }
  | { level: 'titulo'; id: string }
  | { level: 'notif'; id: string };

const route = ref<Route>({ level: 'dashboard' });
const query = ref('');
const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const titulos = ref(TITULOS_SEED.map((t) => ({ ...t })));
const notifs = ref(NOTIFICACOES_CESSAO_SEED.map((n) => ({ ...n })));

const tituloAtual = computed(() => {
  const r = route.value;
  return r.level === 'titulo' ? titulos.value.find((t) => t.id === r.id) : undefined;
});

const notifAtual = computed(() => {
  const r = route.value;
  return r.level === 'notif' ? notifs.value.find((n) => n.id === r.id) : undefined;
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

function nowBR() {
  const d = new Date();
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

const vencidos = computed(() =>
  titulos.value.filter((t) => t.status === 'VENCIDO' || t.diasAtraso > 0).sort((a, b) => b.diasAtraso - a.diasAtraso),
);

const semBoleto = computed(() =>
  titulos.value.filter((t) => t.vrAberto > 0 && !t.boletoGeradoEm),
);

const notifsPendentes = computed(() =>
  notifs.value.filter((n) => n.status === 'PENDENTE' || n.status === 'FALHOU'),
);

const valorVencido = computed(() =>
  vencidos.value.reduce((s, t) => s + t.vrAberto, 0),
);

const valorAbertoTotal = computed(() =>
  titulos.value.reduce((s, t) => s + t.vrAberto, 0),
);

interface KpiCard {
  icon: Component;
  title: string;
  tone: string;
  metrics: { label: string; value: string }[];
}

const kpis = computed<KpiCard[]>(() => [
  {
    icon: AlertTriangle,
    title: 'Inadimplência',
    tone: 'var(--danger-base)',
    metrics: [
      { label: 'Valor vencido', value: brl(valorVencido.value, { compact: true }) },
      { label: 'Títulos vencidos', value: String(vencidos.value.length) },
    ],
  },
  {
    icon: Wallet,
    title: 'Carteira em aberto',
    tone: 'var(--gci-base)',
    metrics: [
      { label: 'Valor em aberto', value: brl(valorAbertoTotal.value, { compact: true }) },
      { label: 'Total de títulos', value: String(titulos.value.length) },
    ],
  },
  {
    icon: Receipt,
    title: 'Boletagem',
    tone: 'var(--agro-base)',
    metrics: [
      { label: 'Pendentes de boleto', value: String(semBoleto.value.length) },
      {
        label: 'Com boleto gerado',
        value: String(titulos.value.filter((t) => !!t.boletoGeradoEm).length),
      },
    ],
  },
  {
    icon: BellRing,
    title: 'Notificações de cessão',
    tone: 'var(--warning-base)',
    metrics: [
      { label: 'Pendentes / falhas', value: String(notifsPendentes.value.length) },
      {
        label: 'Enviadas',
        value: String(notifs.value.filter((n) => n.status === 'ENVIADA').length),
      },
    ],
  },
]);

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
    t.id === id ? { ...t, ultimaNotificacaoEm: todayBR() } : t,
  );
  showToast('Notificação enviada (mock)');
}

function handleNegociar(id: string) {
  titulos.value = titulos.value.map((t) =>
    t.id === id ? { ...t, status: 'EM_NEGOCIACAO' } : t,
  );
  showToast('Título marcado em negociação');
}

function handleReenviar(id: string) {
  notifs.value = notifs.value.map((n) =>
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
  notifs.value = notifs.value.map((n) =>
    n.id === id ? { ...n, status: 'CANCELADA' } : n,
  );
  showToast('Notificação cancelada');
}

const emNegociacao = computed(() =>
  titulos.value.filter((t) => t.status === 'EM_NEGOCIACAO'),
);

const TITULO_GRID = 'minmax(120px, 1.3fr) minmax(130px, 1.4fr) minmax(90px, 1fr) minmax(70px, 0.8fr)';
const NOTIF_GRID = 'minmax(110px, 1.2fr) minmax(110px, 1.2fr) minmax(80px, 0.9fr) minmax(90px, 1fr)';
</script>

<template>
  <TituloDetailScreen
    v-if="tituloAtual"
    :titulo="tituloAtual"
    @back="route = { level: 'dashboard' }"
    @gerar-boleto="handleGerarBoleto"
    @notificar="handleNotificarTitulo"
    @negociar="handleNegociar"
  />
  <NotificacaoCessaoDetailScreen
    v-else-if="notifAtual"
    :notificacao="notifAtual"
    @back="route = { level: 'dashboard' }"
    @reenviar="handleReenviar"
    @cancelar="handleCancelar"
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
          Dashboard de Atuação
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          O que precisa ser resolvido hoje pela equipe de cobrança
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

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 18px;
        "
      >
        <div class="flex items-center" style="gap: 10px; margin-bottom: 14px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="17" />
          </div>
          <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted)">
            {{ kpi.title }}
          </div>
        </div>
        <div class="flex flex-col" style="gap: 8px">
          <div v-for="m in kpi.metrics" :key="m.label" class="flex items-center justify-between">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ m.label }}</span>
            <span
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                font-variant-numeric: tabular-nums;
              "
            >
              {{ m.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filas de atuação -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <!-- Vencidos -->
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          overflow: hidden;
        "
      >
        <div
          class="flex items-center justify-between"
          style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)"
        >
          <div class="flex items-center" style="gap: 10px">
            <AlertTriangle :size="16" style="color: var(--danger-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Títulos vencidos
            </h3>
          </div>
          <button
            style="
              background: none;
              border: none;
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--accent);
            "
            @click="emit('navigate', 'cobranca-titulos')"
          >
            Ver todos
          </button>
        </div>
        <div
          v-if="vencidos.length === 0"
          style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center"
        >
          Nenhum título vencido.
        </div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: TITULO_GRID }">
            <div>Título</div>
            <div>Sacado</div>
            <div style="text-align: right">Aberto</div>
            <div style="text-align: right">Dias</div>
          </div>
          <button
            v-for="t in vencidos.slice(0, 6)"
            :key="t.id"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: TITULO_GRID }"
            @click="openTitulo(t.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              #{{ t.numero }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ t.sacado }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--danger-base)">
              {{ brl(t.vrAberto, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--danger-base); font-weight: var(--weight-bold)">
              {{ t.diasAtraso }}d
            </div>
          </button>
        </template>
      </div>

      <!-- Boletagem -->
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          overflow: hidden;
        "
      >
        <div
          class="flex items-center justify-between"
          style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)"
        >
          <div class="flex items-center" style="gap: 10px">
            <Receipt :size="16" style="color: var(--agro-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Pendências de boletagem
            </h3>
          </div>
          <button
            style="
              background: none;
              border: none;
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--accent);
            "
            @click="emit('navigate', 'cobranca-titulos')"
          >
            Ver todos
          </button>
        </div>
        <div
          v-if="semBoleto.length === 0"
          style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center"
        >
          Nenhuma pendência de boleto.
        </div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: TITULO_GRID }">
            <div>Título</div>
            <div>Veículo</div>
            <div style="text-align: right">Aberto</div>
            <div style="text-align: right">Status</div>
          </div>
          <button
            v-for="t in semBoleto.slice(0, 6)"
            :key="t.id"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: TITULO_GRID }"
            @click="openTitulo(t.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              #{{ t.numero }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ t.veiculoNome }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ brl(t.vrAberto, { compact: true }) }}
            </div>
            <div style="text-align: right; font-size: var(--text-xs); color: var(--text-muted)">
              {{ statusTituloLabel(t.status) }}
            </div>
          </button>
        </template>
      </div>
    </div>

    <!-- Notificações + Em negociação -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          overflow: hidden;
        "
      >
        <div
          class="flex items-center justify-between"
          style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)"
        >
          <div class="flex items-center" style="gap: 10px">
            <BellRing :size="16" style="color: var(--warning-base)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              Notificações pendentes / falhas
            </h3>
          </div>
          <button
            style="
              background: none;
              border: none;
              cursor: pointer;
              font-size: var(--text-xs);
              font-weight: var(--weight-bold);
              color: var(--accent);
            "
            @click="emit('navigate', 'cobranca-notif-cessao')"
          >
            Ver todos
          </button>
        </div>
        <div
          v-if="notifsPendentes.length === 0"
          style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center"
        >
          Nenhuma notificação pendente.
        </div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: NOTIF_GRID }">
            <div>Protocolo</div>
            <div>Título</div>
            <div>Canal</div>
            <div>Status</div>
          </div>
          <button
            v-for="n in notifsPendentes.slice(0, 6)"
            :key="n.id"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: NOTIF_GRID }"
            @click="route = { level: 'notif', id: n.id }"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ n.protocolo }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">#{{ n.tituloNumero }}</div>
            <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ n.canal }}</div>
            <div style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--warning-base)">
              {{ statusCessaoLabel(n.status) }}
            </div>
          </button>
        </template>
      </div>

      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          overflow: hidden;
        "
      >
        <div
          class="flex items-center"
          style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)"
        >
          <Clock :size="16" style="color: var(--agro-base)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            Em negociação
          </h3>
        </div>
        <div
          v-if="emNegociacao.length === 0"
          style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center"
        >
          Nenhum título em negociação.
        </div>
        <template v-else>
          <div class="grid dash-table-header" :style="{ gridTemplateColumns: TITULO_GRID }">
            <div>Título</div>
            <div>Sacado</div>
            <div style="text-align: right">Aberto</div>
            <div style="text-align: right">Dias</div>
          </div>
          <button
            v-for="t in emNegociacao.slice(0, 6)"
            :key="t.id"
            class="grid items-center dash-queue-row"
            :style="{ gridTemplateColumns: TITULO_GRID }"
            @click="openTitulo(t.id)"
          >
            <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              #{{ t.numero }}
            </div>
            <div style="color: var(--text-default); overflow: hidden; text-overflow: ellipsis">{{ t.sacado }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ brl(t.vrAberto, { compact: true }) }}
            </div>
            <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-muted)">
              {{ t.diasAtraso }}d
            </div>
          </button>
        </template>
      </div>
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
  cursor: pointer;
  font-size: var(--text-sm);
  text-align: left;
  transition: background var(--duration-fast);
}
.dash-queue-row:hover,
.dash-search-item:hover,
.dash-shortcut:hover {
  background: var(--surface-sunken) !important;
}
@media (max-width: 1100px) {
  .grid[style*='1fr 1fr'] {
    grid-template-columns: 1fr !important;
  }
}
</style>
