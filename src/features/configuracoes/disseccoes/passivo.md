# Passivo

## Screens

### PassivoScreen

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import {
  COTAS,
  CRAS,
  EXTRAORDINARY_VALUE_LABEL,
  BASE_D1_LABEL,
  type Cota,
  type CraComposicao,
  type EventoPagamento,
} from '../data/passivoData';
import PassivoOverviewScreen from './overview/PassivoOverviewScreen.vue';
import CotaDetailScreen from './cota-detail/CotaDetailScreen.vue';
import CraDetailScreen from './cra-detail/CraDetailScreen.vue';

type Route =
  | { level: 1 }
  | { level: 2; cotaId: string }
  | { level: 3; cotaId?: string; craId?: string };

const route = ref<Route>({ level: 1 });
const showD1Prompt = ref(true);

const currentCota = computed<Cota | undefined>(() => {
  const r = route.value;
  if (r.level === 1 || !r.cotaId) return undefined;
  return COTAS.find((c) => c.id === r.cotaId);
});

const currentCra = computed<CraComposicao | undefined>(() => {
  const r = route.value;
  if (r.level !== 3) return undefined;
  if (r.craId) return CRAS.find((c) => c.id === r.craId);
  return CRAS[0];
});

function handleBack() {
  const r = route.value;
  if (r.level === 3) {
    if (r.cotaId) {
      route.value = { level: 2, cotaId: r.cotaId };
    } else {
      route.value = { level: 1 };
    }
  } else if (r.level === 2) {
    route.value = { level: 1 };
  }
}

function openCota(cotaId: string) {
  route.value = { level: 2, cotaId };
}

function openEvent(_evento: EventoPagamento) {
  route.value = { level: 3 };
  showD1Prompt.value = true;
}

function openCra(cra: CraComposicao) {
  const cotaId = route.value.level === 2 ? route.value.cotaId : undefined;
  route.value = { level: 3, cotaId, craId: cra.id };
  showD1Prompt.value = true;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px; position: relative">
    <!-- Meta D-1 no nível overview -->
    <div
      v-if="route.level === 1"
      class="flex items-center justify-end"
      style="gap: 10px; margin-bottom: -8px"
    >
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        "
      >
        Base D-1:
      </span>
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          background: var(--surface-card);
          padding: 6px 12px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
          letter-spacing: 0.06em;
        "
      >
        {{ BASE_D1_LABEL }}
      </span>
    </div>

    <!-- Banner D-1 (nível 3) -->
    <Transition name="banner">
      <div
        v-if="route.level === 3 && showD1Prompt"
        class="flex items-center justify-between"
        style="
          background: var(--gci-base);
          color: #fff;
          padding: 14px 20px;
          border-radius: var(--radius-xl);
          gap: 16px;
          box-shadow: var(--shadow-md);
        "
      >
        <div class="flex items-center" style="gap: 12px">
          <div
            class="flex items-center justify-center"
            style="
              width: 36px;
              height: 36px;
              background: rgba(255, 255, 255, 0.15);
              border-radius: var(--radius-lg);
              flex-shrink: 0;
            "
          >
            <AlertCircle :size="18" />
          </div>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
            O pagamento extraordinário de
            <span style="color: var(--accent); font-weight: var(--weight-bold)">R$ {{ EXTRAORDINARY_VALUE_LABEL }}</span>
            em 26/05 foi realizado?
          </p>
        </div>
        <div class="flex" style="gap: 8px; flex-shrink: 0">
          <button
            type="button"
            style="
              height: 36px;
              padding: 0 16px;
              background: rgba(255, 255, 255, 0.12);
              border: none;
              border-radius: var(--radius-lg);
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              cursor: pointer;
            "
            @click="showD1Prompt = false"
          >
            Não
          </button>
          <button
            type="button"
            style="
              height: 36px;
              padding: 0 16px;
              background: #fff;
              border: none;
              border-radius: var(--radius-lg);
              color: var(--gci-base);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              cursor: pointer;
            "
            @click="showD1Prompt = false"
          >
            Sim, Confirmar
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="level" mode="out-in">
      <PassivoOverviewScreen
        v-if="route.level === 1"
        key="level1"
        @open-cota="openCota"
        @open-event="openEvent"
      />
      <CotaDetailScreen
        v-else-if="route.level === 2 && currentCota"
        key="level2"
        :cota="currentCota"
        @back="handleBack"
        @open-cra="openCra"
      />
      <CraDetailScreen
        v-else-if="route.level === 3 && currentCra"
        key="level3"
        :cra="currentCra"
        :cota-nome="currentCota?.nome"
        @back="handleBack"
      />
    </Transition>
  </div>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition:
    opacity var(--duration-slow) var(--ease-standard),
    transform var(--duration-slow) var(--ease-standard);
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.level-enter-active,
.level-leave-active {
  transition:
    opacity var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}
.level-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.level-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
```

## Screens / cota-detail

### CotaDetailScreen

```vue
<script setup lang="ts">
import { ArrowLeft, TrendingUp } from 'lucide-vue-next';
import type { Cota, CraComposicao } from '../../data/passivoData';
import { TONE_RISCO } from '../../data/passivoData';
import ValuationCard from './ValuationCard.vue';
import HistoricoPuTable from './HistoricoPuTable.vue';
import CronogramaTimeline from './CronogramaTimeline.vue';
import CrasTable from './CrasTable.vue';

defineProps<{ cota: Cota }>();
const emit = defineEmits<{
  back: [];
  openCra: [cra: CraComposicao];
}>();
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header — padrão CRA detail -->
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
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
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
          Passivo · Cota {{ cota.sigla }}
        </div>
        <div class="flex items-center" style="gap: 10px">
          <h2
            style="
              font-size: var(--text-xl);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              letter-spacing: -0.01em;
              line-height: 1.2;
            "
          >
            {{ cota.nome }}
          </h2>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: TONE_RISCO[cota.nivelRisco].bg,
              color: TONE_RISCO[cota.nivelRisco].fg,
            }"
          >
            {{ cota.nivelRisco }}
          </span>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ cota.tipoRemuneracao }} · Rentabilidade +{{ cota.rentabilidade }}% a.a. · {{ cota.percentualPL }}% do PL
        </p>
      </div>
    </div>

    <!-- Hero gci — padrão CraHero -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
      "
    >
      <div
        style="
          position: absolute;
          top: -80px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1">
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
          PU Base da Cota
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
          R$ {{ cota.puBase.toFixed(2) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          PU × 100: R$ {{ (cota.puBase * 100).toFixed(2) }} · PU × 1.000: R$ {{ (cota.puBase * 1000).toFixed(2) }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          position: relative;
          z-index: 1;
        "
      >
        <TrendingUp :size="26" />
      </div>
    </div>

    <!-- Valorização recente -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <ValuationCard date="D-1 (Ontem)" value="+0.042%" absolute="+R$ 42.503,12" trend="up" />
      <ValuationCard date="D-2 (22/05)" value="+0.038%" absolute="+R$ 38.291,05" trend="up" />
      <ValuationCard date="D-3 (21/05)" value="+0.041%" absolute="+R$ 41.109,88" trend="up" />
    </div>

    <HistoricoPuTable />
    <CronogramaTimeline />
    <CrasTable @open-cra="emit('openCra', $event)" />
  </div>
</template>
```

### CrasTable

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Building2, ChevronRight } from 'lucide-vue-next';
import {
  CRAS,
  brl,
  TONE_CRA_STATUS,
  toneAtraso,
  type CraComposicao,
  type CraStatus,
} from '../../data/passivoData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const emit = defineEmits<{ openCra: [cra: CraComposicao] }>();

const filter = ref('');
const statusFilter = ref<'Tudo' | CraStatus>('Tudo');
const statusOptions = ['Tudo', 'Em carteira', 'Liquidado'] as const;

const filtered = computed(() =>
  CRAS.filter((cra) => {
    const q = filter.value.toLowerCase();
    const matchesSearch =
      !q ||
      cra.cedente.toLowerCase().includes(q) ||
      cra.sacado.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === 'Tudo' || cra.status === statusFilter.value;
    return matchesSearch && matchesStatus;
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

const cols = '1.6fr 1fr 1.1fr 1fr 0.9fr 0.9fr';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex flex-col md:flex-row md:items-center justify-between"
      style="padding: 20px; border-bottom: 1px solid var(--border-default); gap: 16px"
    >
      <div class="flex items-center" style="gap: 16px">
        <div
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            color: var(--gci-base);
          "
        >
          <Building2 :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Composição da Carteira (CRAs)
          </div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-top: 4px;
            "
          >
            {{ filtered.length }} títulos na carteira
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center" style="gap: 12px">
        <div class="relative">
          <Search
            :size="14"
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted)"
          />
          <input
            v-model="filter"
            type="text"
            placeholder="Buscar CRA..."
            style="
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 8px 14px 8px 34px;
              font-size: var(--text-xs);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
              width: 180px;
            "
            @input="setPage(1)"
          />
        </div>

        <div
          class="flex"
          style="
            background: var(--surface-sunken);
            padding: 4px;
            border-radius: var(--radius-lg);
            gap: 2px;
          "
        >
          <button
            v-for="s in statusOptions"
            :key="s"
            type="button"
            :style="{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              background: statusFilter === s ? 'var(--surface-card)' : 'transparent',
              color: statusFilter === s ? 'var(--gci-base)' : 'var(--text-muted)',
              boxShadow: statusFilter === s ? 'var(--shadow-xs)' : 'none',
            }"
            @click="statusFilter = s; setPage(1)"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>

    <div style="overflow-x: auto">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          minWidth: '700px',
        }"
      >
        <div>Cedente / Sacado</div>
        <div style="text-align: right">Vencimento</div>
        <div style="text-align: right">Valor Face</div>
        <div style="text-align: center">Status</div>
        <div style="text-align: center">Atraso</div>
        <div style="text-align: right">Ação</div>
      </div>

      <template v-if="filtered.length">
        <div
          v-for="cra in pageItems"
          :key="cra.id"
          class="cra-row grid items-center"
          :style="{
            gridTemplateColumns: cols,
            padding: '18px 20px',
            borderTop: '1px solid var(--border-default)',
            cursor: 'pointer',
            minWidth: '700px',
            transition: 'background var(--duration-fast)',
          }"
          @click="emit('openCra', cra)"
        >
          <div>
            <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
              {{ cra.cedente }}
            </p>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              {{ cra.sacado }}
            </p>
          </div>
          <div style="text-align: right; font-size: var(--text-xs); color: var(--text-muted)">
            {{ cra.dataVencimento }}
          </div>
          <div
            style="
              text-align: right;
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              font-variant-numeric: tabular-nums;
            "
          >
            {{ brl(cra.valorFace) }}
          </div>
          <div style="text-align: center">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: TONE_CRA_STATUS[cra.status].bg,
                color: TONE_CRA_STATUS[cra.status].fg,
              }"
            >
              {{ cra.status }}
            </span>
          </div>
          <div style="text-align: center">
            <span
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: toneAtraso(cra.faixaAtraso).bg,
                color: toneAtraso(cra.faixaAtraso).fg,
              }"
            >
              {{ cra.faixaAtraso }}
            </span>
          </div>
          <div class="flex items-center justify-end" style="gap: 8px">
            <span
              class="analisar-label"
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.10em;
                text-transform: uppercase;
                color: var(--gci-base);
                opacity: 0;
                transition: opacity var(--duration-fast);
              "
            >
              Analisar
            </span>
            <ChevronRight :size="16" style="color: var(--neutral-300)" />
          </div>
        </div>
      </template>

      <div
        v-else
        style="padding: 60px 24px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
      >
        Nenhum CRA encontrado.
      </div>
    </div>

    <TablePagination
      v-if="filtered.length"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="setPage"
      @update:page-size="setPageSize"
    />
  </div>
</template>

<style scoped>
.cra-row:hover {
  background: var(--surface-sunken);
}
.cra-row:hover .analisar-label {
  opacity: 1;
}
</style>
```

### CronogramaTimeline

```vue
<script setup lang="ts">
import { History } from 'lucide-vue-next';
import { CRONOGRAMA } from '../../data/passivoData';
import StepIndicator from './StepIndicator.vue';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex items-center"
      style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
          color: var(--gci-base);
        "
      >
        <History :size="20" />
      </div>
      <div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Cronograma Completo da Cota
        </div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 4px;
          "
        >
          Etapas de liquidação
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 28px; padding: 24px">
      <div
        v-for="cron in CRONOGRAMA"
        :key="cron.id"
        class="flex flex-col lg:flex-row lg:items-center"
        style="gap: 24px"
      >
        <div style="min-width: 180px">
          <p
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.14em;
              margin-bottom: 4px;
            "
          >
            {{ cron.data }}
          </p>
          <h5 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ cron.evento }}
          </h5>
        </div>
        <div class="flex items-center justify-between" style="flex: 1; gap: 8px">
          <StepIndicator label="Validação PU" :status="cron.statusEtapa.validacaoPU" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Envio Comunicado" :status="cron.statusEtapa.envioComunicado" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Confirmação B3" :status="cron.statusEtapa.confirmacaoB3" />
          <div style="flex: 1; height: 1px; background: var(--stepper-track)" />
          <StepIndicator label="Banco Liquidante" :status="cron.statusEtapa.bancoLiquidante" />
        </div>
      </div>
    </div>
  </div>
</template>
```

### HistoricoPuTable

```vue
<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';
import { HISTORICO_PU } from '../../data/passivoData';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const cols = '0.9fr 0.8fr 1fr 0.7fr 0.5fr 1.1fr 0.8fr';

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => HISTORICO_PU, { defaultPageSize: 10 });
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex items-center justify-between"
      style="padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div class="flex items-center" style="gap: 16px">
        <div
          class="flex items-center justify-center"
          style="
            width: 44px;
            height: 44px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            color: var(--gci-base);
          "
        >
          <TrendingUp :size="20" />
        </div>
        <div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Histórico de PU
          </div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-top: 4px;
            "
          >
            Acompanhamento diário de PU
          </div>
        </div>
      </div>
      <button
        type="button"
        style="
          background: none;
          border: none;
          cursor: pointer;
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--text-link);
        "
      >
        Ver Gráfico Completo
      </button>
    </div>

    <div>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-default)',
        }"
      >
        <div>Data</div>
        <div>Taxa DI</div>
        <div>Fator DI Acum</div>
        <div>Spread</div>
        <div>DU</div>
        <div>PU Atualizado</div>
        <div>Juros</div>
      </div>

      <div
        v-for="h in pageItems"
        :key="h.id"
        class="pu-row grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
        }"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.data }}</div>
        <div style="color: var(--text-muted)">{{ h.taxaDI }}%</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.fatorDIAcum }}</div>
        <div style="color: var(--text-muted)">{{ h.spread }}%</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default)">{{ h.du }}</div>
        <div style="font-weight: var(--weight-bold); color: var(--gci-base); font-variant-numeric: tabular-nums">
          {{ h.puAtualizado.toFixed(2) }}
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-default); font-variant-numeric: tabular-nums">
          {{ h.juros.toFixed(2) }}
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
.pu-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### StepIndicator

```vue
<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';
import type { EtapaStatus } from '../../data/passivoData';

defineProps<{ label: string; status: EtapaStatus }>();

function circleStyle(status: EtapaStatus) {
  if (status === 'concluido') {
    return {
      background: 'var(--stepper-done)',
      borderColor: 'var(--stepper-done)',
      color: '#fff',
    };
  }
  if (status === 'em-andamento') {
    return {
      background: 'var(--surface-card)',
      borderColor: 'var(--warning-base)',
      color: 'var(--warning-base)',
      boxShadow: '0 4px 12px color-mix(in srgb, var(--warning-base) 20%, transparent)',
    };
  }
  return {
    background: 'var(--surface-sunken)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-disabled)',
  };
}
</script>

<template>
  <div class="flex flex-col items-center" style="gap: 8px">
    <div
      class="flex items-center justify-center"
      :style="{
        width: '32px',
        height: '32px',
        borderRadius: '9999px',
        borderWidth: '2px',
        borderStyle: 'solid',
        ...circleStyle(status),
      }"
    >
      <CheckCircle2 v-if="status === 'concluido'" :size="16" />
      <div
        v-else
        :style="{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          background: 'currentColor',
        }"
      />
    </div>
    <span
      :style="{
        fontSize: '8px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color: status === 'pendente' ? 'var(--text-muted)' : 'var(--text-strong)',
      }"
    >
      {{ label }}
    </span>
  </div>
</template>
```

### ValuationCard

```vue
<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next';

defineProps<{
  date: string;
  value: string;
  absolute: string;
  trend: 'up' | 'down';
}>();
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      padding: 20px;
    "
  >
    <p
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        margin-bottom: 12px;
      "
    >
      {{ date }}
    </p>
    <div class="flex items-center justify-between">
      <div>
        <p
          :style="{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--weight-bold)',
            fontVariantNumeric: 'tabular-nums',
            color: trend === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
          }"
        >
          {{ value }}
        </p>
        <p
          style="
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ absolute }}
        </p>
      </div>
      <div
        class="flex items-center justify-center"
        :style="{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-lg)',
          background: trend === 'up' ? 'var(--success-light)' : 'var(--danger-light)',
          color: trend === 'up' ? 'var(--success-base)' : 'var(--danger-base)',
        }"
      >
        <TrendingUp :size="20" />
      </div>
    </div>
  </div>
</template>
```

## Screens / cra-detail

### CraDetailScreen

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Building2,
  User,
} from 'lucide-vue-next';
import {
  brl,
  TONE_CRA_STATUS,
  type CraComposicao,
} from '../../data/passivoData';
import Section from '../shared/Section.vue';
import Field from '../shared/Field.vue';
import ValidarPuModal from './ValidarPuModal.vue';
import PagamentoExtraordinarioModal from './PagamentoExtraordinarioModal.vue';

defineProps<{ cra: CraComposicao; cotaNome?: string }>();
const emit = defineEmits<{ back: [] }>();

const showValidarPu = ref(false);
const showExtraordinario = ref(false);

function pct(n: number): string {
  return `${(n * 100).toFixed(3)}%`;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header — Guidelines §10 / CraTitleDetail -->
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
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ cotaNome || 'Passivo' }} · Drilldown CRA
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          {{ cra.cedente }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Sacado: {{ cra.sacado }} · Tipo {{ cra.tipoTitulo }}
        </p>
      </div>
      <span
        class="flex items-center"
        :style="{
          gap: '8px',
          fontSize: '11px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          padding: '8px 14px',
          background: TONE_CRA_STATUS[cra.status].bg,
          color: TONE_CRA_STATUS[cra.status].fg,
          borderRadius: '9999px',
        }"
      >
        <CheckCircle2 v-if="cra.status === 'Em carteira'" :size="14" />
        {{ cra.status }}
      </span>
    </div>

    <!-- Hero PU -->
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
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
      <div style="flex: 1; position: relative; z-index: 1">
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
          PU Atualizado
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
          R$ {{ cra.puAtualizado.toFixed(2) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Face: {{ brl(cra.valorFace) }} · Taxa {{ cra.taxa }}% a.a. · Venc. {{ cra.dataVencimento }}
        </div>
      </div>
    </div>

    <!-- Content card -->
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
        gap: 32px;
      "
    >
      <Section title="Informações do CRA">
        <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px">
          <Field label="Valor de Aquisição">{{ brl(cra.valorAquisicao) }}</Field>
          <Field label="Valor de Face">{{ brl(cra.valorFace) }}</Field>
          <Field label="Data de Aquisição">{{ cra.dataAquisicao }}</Field>
          <Field label="Vencimento">{{ cra.dataVencimento }}</Field>
          <Field label="Valor de Liquidação">{{ brl(cra.valorLiquidacao) }}</Field>
          <Field label="Data de Liquidação">{{ cra.dataLiquidacao }}</Field>
          <Field label="Faixa de Atraso">
            <span
              :style="{
                color: cra.faixaAtraso === 'Em dia' ? 'var(--success-base)' : 'var(--danger-base)',
                fontWeight: 'var(--weight-bold)',
              }"
            >
              {{ cra.faixaAtraso }}
            </span>
          </Field>
          <Field label="Taxa">{{ cra.taxa }}% a.a.</Field>
          <Field label="PDD">{{ (cra.pdd * 100).toFixed(2) }}%</Field>
          <Field label="Tipo de Título">{{ cra.tipoTitulo }}</Field>
        </div>
      </Section>

      <Section title="Participantes">
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
          <div
            class="flex"
            style="
              gap: 14px;
              padding: 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div
              class="flex items-center justify-center"
              style="
                width: 44px;
                height: 44px;
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                color: var(--gci-base);
                flex-shrink: 0;
              "
            >
              <Building2 :size="20" />
            </div>
            <div>
              <div
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.14em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Cedente
              </div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 2px">
                {{ cra.cedente }}
              </div>
            </div>
          </div>
          <div
            class="flex"
            style="
              gap: 14px;
              padding: 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div
              class="flex items-center justify-center"
              style="
                width: 44px;
                height: 44px;
                border-radius: var(--radius-lg);
                background: var(--surface-card);
                color: var(--gci-base);
                flex-shrink: 0;
              "
            >
              <User :size="20" />
            </div>
            <div>
              <div
                style="
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.14em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Sacado
              </div>
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 2px">
                {{ cra.sacado }}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Valorização recente">
        <div class="flex flex-col" style="gap: 14px">
          <div
            v-for="row in [
              { date: 'Hoje (D-0)', percent: pct(cra.valorizacaoD1), value: '+R$ 4.291,55', neg: cra.valorizacaoD1 < 0 },
              { date: 'D-1', percent: pct(cra.valorizacaoD2), value: '+R$ 3.844,12', neg: cra.valorizacaoD2 < 0 },
              { date: 'D-2', percent: pct(cra.valorizacaoD3), value: '+R$ 4.103,09', neg: cra.valorizacaoD3 < 0 },
            ]"
            :key="row.date"
            class="flex items-center justify-between"
            style="
              padding: 12px 16px;
              background: var(--surface-sunken);
              border-radius: var(--radius-lg);
            "
          >
            <div class="flex items-center" style="gap: 10px">
              <div
                :style="{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: row.neg ? 'var(--danger-base)' : 'var(--success-base)',
                }"
              />
              <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
                {{ row.date }}
              </span>
            </div>
            <div class="flex items-center" style="gap: 16px">
              <span
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)',
                  fontVariantNumeric: 'tabular-nums',
                  color: row.neg ? 'var(--danger-base)' : 'var(--success-base)',
                }"
              >
                {{ row.percent }}
              </span>
              <span
                style="
                  font-size: var(--text-xs);
                  font-weight: var(--weight-semibold);
                  font-variant-numeric: tabular-nums;
                  color: var(--text-muted);
                "
              >
                {{ row.value }}
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Gestão de Pagamento">
        <div class="flex" style="gap: 12px">
          <button
            type="button"
            class="flex items-center justify-center btn-animated btn-primary"
            style="
              height: 44px;
              padding: 0 24px;
              gap: 8px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.08em;
            "
            @click="showValidarPu = true"
          >
            <CheckCircle2 :size="16" />
            VALIDAR PU PROGRAMADO
          </button>
          <button
            type="button"
            class="flex items-center justify-center"
            style="
              height: 44px;
              padding: 0 24px;
              gap: 8px;
              background: var(--action-secondary-bg);
              color: var(--action-secondary-text);
              border: 1px solid var(--action-secondary-border);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.08em;
            "
            @click="showExtraordinario = true"
          >
            <Plus :size="16" style="color: var(--warning-base)" />
            PAGAMENTO EXTRAORDINÁRIO
          </button>
        </div>
      </Section>
    </div>

    <ValidarPuModal
      v-if="showValidarPu"
      @close="showValidarPu = false"
      @confirm="showValidarPu = false"
    />
    <PagamentoExtraordinarioModal
      v-if="showExtraordinario"
      @close="showExtraordinario = false"
      @confirm="showExtraordinario = false"
    />
  </div>
</template>
```

### PagamentoExtraordinarioModal

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { X, AlertTriangle } from 'lucide-vue-next';

const emit = defineEmits<{ close: []; confirm: [] }>();

const dataPagamento = ref('');
const puJuros = ref('');
const valorAmortizacao = ref('');
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: var(--z-modal);
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div
        class="flex items-center justify-between"
        style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)"
      >
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); text-transform: uppercase; letter-spacing: -0.01em">
          Novo Pagamento Extraordinário
        </h3>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            Data do Pagamento
          </label>
          <input
            v-model="dataPagamento"
            type="date"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            PU de Juros
          </label>
          <input
            v-model="puJuros"
            type="text"
            placeholder="0.00000"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div class="flex flex-col" style="gap: 6px">
          <label
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            "
          >
            Valor de Amortização
          </label>
          <input
            v-model="valorAmortizacao"
            type="text"
            placeholder="R$ 0,00"
            style="
              width: 100%;
              height: 48px;
              background: var(--surface-sunken);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              padding: 0 16px;
              font-size: var(--text-sm);
              font-weight: var(--weight-semibold);
              color: var(--text-default);
              outline: none;
            "
          />
        </div>

        <div
          class="flex items-start"
          style="
            gap: 10px;
            padding: 14px 16px;
            background: var(--status-danger-bg);
            border: 1px solid color-mix(in srgb, var(--danger-base) 20%, transparent);
            border-radius: var(--radius-lg);
            color: var(--status-danger-text);
          "
        >
          <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
          <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.4">
            Atenção: Esta é uma operação extraordinária fora do cronograma original. O status ficará pendente de validação pela custódia.
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-end"
        style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)"
      >
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="emit('confirm')"
        >
          REGISTRAR OPERAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
```

### ValidarPuModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: var(--z-modal);
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div
        class="flex items-center justify-between"
        style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)"
      >
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); text-transform: uppercase; letter-spacing: -0.01em">
          Validar PU Programado
        </h3>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 20px">
        <div
          style="
            background: var(--gci-light);
            border: 1px solid var(--gci-subtle);
            border-radius: var(--radius-lg);
            padding: 20px;
          "
        >
          <div class="flex justify-between items-center" style="margin-bottom: 12px">
            <p
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                color: var(--gci-base);
                text-transform: uppercase;
                letter-spacing: 0.12em;
                opacity: 0.7;
              "
            >
              PU Calculado para data de pagamento
            </p>
            <span style="font-size: 10px; font-weight: var(--weight-bold); color: var(--gci-base)">28/05/2026</span>
          </div>
          <h3
            style="
              font-size: var(--text-3xl);
              font-weight: var(--weight-bold);
              color: var(--gci-base);
              font-variant-numeric: tabular-nums;
              line-height: 1.1;
            "
          >
            R$ 108,74219
          </h3>
        </div>

        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-relaxed); font-weight: var(--weight-medium)">
          Ao validar o PU, um e-mail de notificação será disparado automaticamente para o AF (Agente Fiduciário) confirmando os valores para liquidação regular conforme cronograma.
        </p>
      </div>

      <div
        class="flex items-center justify-end"
        style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)"
      >
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="emit('confirm')"
        >
          CONFIRMAR &amp; ENVIAR EMAIL
        </button>
      </div>
    </div>
  </div>
</template>
```

## Screens / overview

### CotaCard

```vue
<script setup lang="ts">
import type { Cota } from '../../data/passivoData';
import { TONE_RISCO } from '../../data/passivoData';

defineProps<{ cota: Cota }>();
const emit = defineEmits<{ open: [] }>();
</script>

<template>
  <div
    class="cota-card flex flex-col"
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow var(--duration-base), border-color var(--duration-base);
      height: 100%;
    "
    @click="emit('open')"
  >
    <div style="padding: 20px 20px 16px">
      <div class="flex justify-between items-start" style="margin-bottom: 16px">
        <div>
          <div class="flex items-center" style="gap: 8px; margin-bottom: 8px">
            <span
              :style="{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: '#fff',
                background: cota.cor,
              }"
            >
              {{ cota.siglaBadge }}
            </span>
            <span
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.10em;
              "
            >
              {{ cota.sigla }}
            </span>
          </div>
          <h4
            class="cota-title"
            style="
              font-size: var(--text-lg);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              letter-spacing: -0.01em;
              transition: color var(--duration-base);
            "
          >
            {{ cota.nome }}
          </h4>
        </div>
        <span
          :style="{
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '5px 10px',
            borderRadius: '9999px',
            background: TONE_RISCO[cota.nivelRisco].bg,
            color: TONE_RISCO[cota.nivelRisco].fg,
          }"
        >
          {{ cota.nivelRisco }}
        </span>
      </div>

      <div
        style="
          background: var(--surface-sunken);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
        "
      >
        <p
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.14em;
            margin-bottom: 12px;
          "
        >
          Tabela de Precificação
        </p>
        <div class="flex flex-col" style="gap: 8px">
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU Base</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ cota.puBase.toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU × 100</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ (cota.puBase * 100).toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: var(--text-xs); color: var(--text-muted)">PU × 1.000</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              R$ {{ (cota.puBase * 1000).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: auto; padding: 16px 20px 20px; border-top: 1px solid var(--border-default)">
      <div class="flex justify-between items-end" style="margin-bottom: 12px">
        <div>
          <p style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px">
            Rentabilidade
          </p>
          <p style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--gci-base); line-height: 1.1">
            +{{ cota.rentabilidade }}%
            <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-muted)">a.a.</span>
          </p>
        </div>
        <div style="text-align: right">
          <p style="font-size: 10px; font-weight: var(--weight-bold); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px">
            % do PL
          </p>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{ cota.percentualPL }}%</span>
        </div>
      </div>
      <div style="width: 100%; height: 6px; background: var(--neutral-200); border-radius: 9999px; overflow: hidden">
        <div
          :style="{
            width: `${cota.percentualPL}%`,
            height: '100%',
            background: cota.cor,
            borderRadius: '9999px',
          }"
        />
      </div>
      <p style="font-size: 10px; color: var(--text-muted); margin-top: 10px">{{ cota.tipoRemuneracao }}</p>
    </div>
  </div>
</template>

<style scoped>
.cota-card:hover {
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--gci-base) 25%, var(--border-default));
}
.cota-card:hover .cota-title {
  color: var(--gci-base);
}
</style>
```

### EventosTable

```vue
<script setup lang="ts">
import { Calendar, ChevronRight } from 'lucide-vue-next';
import { EVENTOS, brl, TONE_B3, type EventoPagamento } from '../../data/passivoData';
import ValidacaoAfBadge from './ValidacaoAfBadge.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const emit = defineEmits<{ openEvent: [evento: EventoPagamento] }>();

const {
  page,
  pageSize,
  total,
  pageItems,
  setPage,
  setPageSize,
} = useTablePagination(() => EVENTOS, { defaultPageSize: 10 });

const cols = '1fr 1.4fr 1fr 1.2fr 1fr 0.9fr 48px';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex items-center"
      style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
          color: var(--gci-base);
        "
      >
        <Calendar :size="20" />
      </div>
      <div style="flex: 1">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Próximos Eventos de Pagamento
        </div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 4px;
          "
        >
          Acompanhamento de liquidação e cronograma
        </div>
      </div>
    </div>

    <div style="overflow-x: auto">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          minWidth: '720px',
        }"
      >
        <div>Cota</div>
        <div>Evento</div>
        <div style="text-align: center">Cronograma</div>
        <div style="text-align: right">Valor Previsto</div>
        <div style="text-align: center">Validação AF</div>
        <div style="text-align: center">B3 Status</div>
        <div />
      </div>

      <div
        v-for="evento in pageItems"
        :key="evento.id"
        class="evento-row grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '18px 20px',
          borderTop: '1px solid var(--border-default)',
          cursor: 'pointer',
          minWidth: '720px',
          transition: 'background var(--duration-fast)',
        }"
        @click="emit('openEvent', evento)"
      >
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ evento.cota }}
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
          {{ evento.evento }}
        </div>
        <div
          style="
            text-align: center;
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ evento.data }}
        </div>
        <div
          style="
            text-align: right;
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ evento.valorPrevisto > 0 ? brl(evento.valorPrevisto) : '—' }}
        </div>
        <div style="text-align: center">
          <ValidacaoAfBadge :status="evento.validacaoAF" />
        </div>
        <div
          style="
            text-align: center;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            text-transform: uppercase;
          "
          :style="{ color: TONE_B3[evento.b3Status] }"
        >
          {{ evento.b3Status }}
        </div>
        <div class="flex justify-end">
          <ChevronRight
            :size="16"
            class="row-chevron"
            style="color: var(--neutral-300); transition: color var(--duration-fast), transform var(--duration-fast)"
          />
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
</template>

<style scoped>
.evento-row:hover {
  background: var(--surface-sunken);
}
.evento-row:hover .row-chevron {
  color: var(--gci-base);
  transform: translateX(2px);
}
</style>
```

### KpiMiniCard

```vue
<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}>();
</script>

<template>
  <div
    class="flex items-center"
    style="
      gap: 16px;
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      padding: 20px;
    "
  >
    <div
      class="flex items-center justify-center"
      :style="{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-lg)',
        background: tone.bg,
        color: tone.fg,
        flexShrink: 0,
      }"
    >
      <component :is="icon" :size="22" :stroke-width="1.75" />
    </div>
    <div>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.14em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        "
      >
        {{ label }}
      </div>
      <div
        style="
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          font-variant-numeric: tabular-nums;
        "
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
```

### PassivoOverviewScreen

```vue
<script setup lang="ts">
import { KPIS, COTAS, type EventoPagamento } from '../../data/passivoData';
import CotaCard from './CotaCard.vue';
import KpiMiniCard from './KpiMiniCard.vue';
import EventosTable from './EventosTable.vue';

const emit = defineEmits<{
  openCota: [cotaId: string];
  openEvent: [evento: EventoPagamento];
}>();

const kpiTones = [
  { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
  { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- KPIs — padrão CRA/FIDC list -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
      <KpiMiniCard
        v-for="(kpi, i) in KPIS"
        :key="kpi.label"
        :icon="kpi.icon"
        :label="kpi.label"
        :value="kpi.value"
        :tone="kpiTones[i]!"
      />
    </div>

    <!-- Cards de cotas -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CotaCard
        v-for="cota in COTAS"
        :key="cota.id"
        :cota="cota"
        @open="emit('openCota', cota.id)"
      />
    </div>

    <EventosTable @open-event="emit('openEvent', $event)" />
  </div>
</template>
```

### ValidacaoAfBadge

```vue
<script setup lang="ts">
import type { ValidacaoAf } from '../../data/passivoData';
import { TONE_VALIDACAO_AF } from '../../data/passivoData';

defineProps<{ status: ValidacaoAf }>();
</script>

<template>
  <span
    :style="{
      padding: '5px 10px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      background: TONE_VALIDACAO_AF[status].bg,
      color: TONE_VALIDACAO_AF[status].fg,
    }"
  >
    {{ status }}
  </span>
</template>
```

## Screens / shared

### Field

```vue
<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.14em;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 6px;
      "
    >
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      <slot />
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
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 16px;
      "
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```
