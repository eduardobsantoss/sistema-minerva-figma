<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, Wallet, FileText, Search, Filter,
  ChevronUp, ChevronDown, Plus, Settings2, Clock,
  CheckCircle2, XCircle, ScanLine,
} from 'lucide-vue-next';
import { brl, num, type Cra, type CraTitulo } from '../data/craData';
import CraHero from './cra-detail/CraHero.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import OperacoesTable from './cra-detail/OperacoesTable.vue';
import TitulosTable from './cra-detail/TitulosTable.vue';
import StatusKPI from './cra-detail/StatusKPI.vue';
import ColPanel from './cra-detail/ColPanel.vue';

const props = defineProps<{ cra: Cra }>();
const emit = defineEmits<{
  back: [];
  createOperacao: [];
  openOperacao: [operacaoId: string];
  openTitulo: [operacaoId: string, tituloId: string];
}>();

type Tab = 'operacoes' | 'titulos';

const VIEW_TABS = [
  { key: 'operacoes' as const, label: 'VISUALIZAR OPERAÇÕES' },
  { key: 'titulos' as const, label: 'VISUALIZAR TÍTULOS' },
];

const openCarteira = ref(true);
const tab = ref<Tab>('operacoes');
const q = ref('');
const showColPanel = ref(false);

const allTitulos = computed<CraTitulo[]>(() => props.cra.operacoes.flatMap((o) => o.titulos));
const filteredTitulos = computed(() =>
  allTitulos.value.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const totalCarteira = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const totalVencido = computed(() =>
  props.cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.vencido.valor, titulos: a.titulos + o.vencido.titulos }),
    { valor: 0, titulos: 0 },
  ),
);
const totalEmissao = computed(() => props.cra.operacoes.reduce((a, o) => a + o.valorEmissao, 0));

const operacaoClassMap = computed(() =>
  Object.fromEntries(props.cra.operacoes.map((o, i) => [o.id, String(i + 1)])),
);

function handleOpenTitulo(r: CraTitulo) {
  emit('openTitulo', r.operacaoId, r.id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ cra.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ cra.cessionaria }} · {{ cra.cnpj }} · Gestão de Operações e Títulos
        </p>
      </div>
    </div>

    <!-- Hero -->
    <CraHero :total-emissao="totalEmissao" :cra="cra" />

    <!-- Carteira -->
    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <button
        class="relative w-full flex items-center"
        style="gap: 16px; padding: 20px 24px; background: var(--success-base); color: #fff; border: none; cursor: pointer; text-align: left"
        @click="openCarteira = !openCarteira"
      >
        <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 9999px; background: rgba(255,255,255,0.06)" />
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.18); position: relative; z-index: 1">
          <Wallet :size="22" />
        </div>
        <div style="flex: 1; position: relative; z-index: 1">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.85; margin-bottom: 4px">
            Carteira da Operação
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ num(totalCarteira.titulos) }} títulos ativos
          </div>
        </div>
        <span
          class="flex items-center"
          style="gap: 8px; font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 14px; background: rgba(255,255,255,0.15); border-radius: var(--radius-lg); position: relative; z-index: 1"
        >
          {{ openCarteira ? 'Recolher Indicadores' : 'Exibir Indicadores' }}
          <ChevronUp v-if="openCarteira" :size="14" />
          <ChevronDown v-else :size="14" />
        </span>
      </button>
      <div v-if="openCarteira" class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 20px">
        <StatusKPI
          :icon="Clock" label="Pendente"
          :qty="allTitulos.filter((t) => t.status === 'PENDENTE').length"
          :value="brl(allTitulos.filter((t) => t.status === 'PENDENTE').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-warning-bg)" fg="var(--status-warning-text)"
        />
        <StatusKPI
          :icon="ScanLine" label="Análise Documental"
          :qty="0"
          :value="brl(0, true)"
          bg="var(--status-neutral-bg)" fg="var(--status-neutral-text)"
        />
        <StatusKPI
          :icon="XCircle" label="Rejeitado"
          :qty="allTitulos.filter((t) => t.status === 'VENCIDO').length"
          :value="brl(allTitulos.filter((t) => t.status === 'VENCIDO').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-danger-bg)" fg="var(--status-danger-text)"
        />
        <StatusKPI
          :icon="CheckCircle2" label="Validado"
          :qty="allTitulos.filter((t) => t.status === 'CONFIRMADO').length"
          :value="brl(allTitulos.filter((t) => t.status === 'CONFIRMADO').reduce((s, t) => s + t.vrNominal, 0), true)"
          bg="var(--status-success-bg)" fg="var(--status-success-text)"
        />
        <StatusKPI
          :icon="Wallet" label="Em Carteira"
          :qty="totalCarteira.titulos"
          :value="brl(totalCarteira.valor, true)"
          bg="var(--status-active-bg)" fg="var(--status-active-text)"
        />
      </div>
    </div>

    <!-- Operações / Títulos -->
    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <!-- Panel header -->
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ tab === 'operacoes' ? 'Operações do CRA' : 'Títulos da Carteira' }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ tab === 'operacoes' ? `${cra.operacoes.length} operações cadastradas` : `${allTitulos.length} títulos na carteira` }}
          </div>
        </div>

        <button
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="emit('createOperacao')"
        >
          <Plus :size="14" /> NOVA OPERAÇÃO
        </button>

        <SegmentedToggle
          :model-value="tab"
          :options="VIEW_TABS"
          variant="surface"
          @update:model-value="tab = $event as Tab"
        />

        <div class="flex items-center" style="gap: 6px; position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="showColPanel = !showColPanel"
          >
            <Settings2 :size="16" />
          </button>
          <button
            aria-label="Filtros"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
          >
            <Filter :size="16" />
          </button>
          <ColPanel v-if="showColPanel" :tab="tab" @close="showColPanel = false" />
        </div>
      </div>

      <!-- Search (only in títulos tab) -->
      <div v-if="tab === 'titulos'" style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, cedente ou sacado..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <!-- Content -->
      <OperacoesTable v-if="tab === 'operacoes'" :rows="cra.operacoes" @open="emit('openOperacao', $event)" />
      <TitulosTable v-else :rows="filteredTitulos" :class-map="operacaoClassMap" @open="handleOpenTitulo" />

      <!-- Footer -->
      <div class="flex items-center justify-end" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
            Operação Ativa:
          </span>
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 6px 12px; background: var(--gci-base); color: #fff; border-radius: var(--radius-sm)">
            TODAS
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
