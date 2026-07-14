<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Settings2,
} from 'lucide-vue-next';
import { brl, num, type Fidc, type Title } from '../data/fidcsData';
import TitlesTable from '../components/TitlesTable.vue';
import PLHero from '../components/PLHero.vue';
import SubKPI from './fidc-detail/SubKPI.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import ClassesTable from './fidc-detail/ClassesTable.vue';
import FidcColPanel from './fidc-detail/FidcColPanel.vue';

const props = defineProps<{ fidc: Fidc }>();
const emit = defineEmits<{
  back: [];
  openClass: [classId: string];
  openTitle: [classId: string, titleId: string];
  createClass: [];
}>();

type Tab = 'classes' | 'titulos';

const VIEW_TABS = [
  { key: 'classes' as const, label: 'VISUALIZAR CLASSES' },
  { key: 'titulos' as const, label: 'VISUALIZAR TÍTULOS' },
];

const openCarteira = ref(true);
const tab = ref<Tab>('classes');
const q = ref('');
const showColPanel = ref(false);

const allTitles = computed<Title[]>(() => props.fidc.classes.flatMap((c) => c.titulos));
const filteredTitles = computed(() =>
  allTitles.value.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const isMulticlasse = computed(() => props.fidc.category === 'MULTICLASSE');

const classMap = computed(() =>
  Object.fromEntries(props.fidc.classes.map((c, i) => [c.id, String(i + 1)])),
);

function handleOpenTitle(t: Title) {
  emit('openTitle', t.classId, t.id);
}
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
          border-width: 1px;
          border-style: solid;
          border-color: var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
        "
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          {{ fidc.name }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ fidc.cnpj }} • Gestão de Carteira e Títulos
        </p>
      </div>
    </div>

    <!-- Painel PL -->
    <PLHero :fidc="fidc" />

    <!-- Carteira do fundo -->
    <div
      style="
        background: var(--surface-card);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
      "
    >
      <button
        class="relative w-full flex items-center"
        style="
          gap: 16px;
          padding: 20px 24px;
          background: var(--success-base);
          color: #fff;
          border: none;
          cursor: pointer;
          text-align: left;
        "
        @click="openCarteira = !openCarteira"
      >
        <div
          style="
            position: absolute;
            top: -60px;
            right: -60px;
            width: 200px;
            height: 200px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.06);
          "
        />
        <div
          class="flex items-center justify-center"
          style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.18); position: relative; z-index: 1"
        >
          <Wallet :size="22" />
        </div>
        <div style="flex: 1; position: relative; z-index: 1">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.18em;
              text-transform: uppercase;
              opacity: 0.85;
              margin-bottom: 4px;
            "
          >
            Carteira do Fundo
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ num(fidc.carteiraSummaryTitles) }} títulos ativos
          </div>
        </div>
        <span
          class="flex items-center"
          style="
            gap: 8px;
            font-size: var(--text-xs);
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 8px 14px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: var(--radius-lg);
            position: relative;
            z-index: 1;
          "
        >
          {{ openCarteira ? 'Recolher Indicadores' : 'Exibir Indicadores' }}
          <ChevronUp v-if="openCarteira" :size="14" />
          <ChevronDown v-else :size="14" />
        </span>
      </button>

      <div v-if="openCarteira" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 20px">
        <SubKPI
          :icon="FileText"
          label="Valor Nominal"
          :value="brl(fidc.carteira.valor)"
          :tone="{ bg: 'var(--success-light)', fg: 'var(--success-base)' }"
        />
        <SubKPI
          :icon="TrendingUp"
          label="Valor em Aberto"
          :value="brl(fidc.carteira.valor)"
          :tone="{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }"
        />
        <SubKPI
          :icon="Calendar"
          label="Valor Presente"
          :value="brl(fidc.carteira.valor * 0.82)"
          :tone="{ bg: '#EEF0FF', fg: '#4F46E5' }"
        />
        <SubKPI
          :icon="AlertCircle"
          label="Valor Vencido"
          :value="brl(fidc.vencido.valor)"
          :tone="{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }"
          :badge="fidc.carteira.valor ? `${((fidc.vencido.valor / fidc.carteira.valor) * 100).toFixed(2).replace('.', ',')}%` : undefined"
        />
      </div>
    </div>

    <!-- Classes/Títulos -->
    <div
      style="
        background: var(--surface-card);
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
      "
    >
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div
          class="flex items-center justify-center"
          style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)"
        >
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ tab === 'classes' ? 'Classes do Fundo' : 'Títulos da Carteira' }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ tab === 'classes' ? `${fidc.classes.length} unidades cadastradas` : `${allTitles.length} títulos na carteira` }}
          </div>
        </div>
        <button
          v-if="isMulticlasse && tab === 'classes'"
          class="flex items-center btn-animated btn-agro"
          style="
            gap: 8px;
            padding: 10px 18px;
            background: var(--agro-base);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
            box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40);
          "
          @click="emit('createClass')"
        >
          <Plus :size="14" /> NOVA CLASSE
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
          <FidcColPanel v-if="showColPanel" :tab="tab" @close="showColPanel = false" />
        </div>
      </div>

      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, lastro, cedente ou sacado..."
            style="
              width: 100%;
              height: 44px;
              padding-left: 44px;
              padding-right: 16px;
              background: transparent;
              border: none;
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
            "
          />
        </div>
      </div>

      <ClassesTable v-if="tab === 'classes'" :rows="fidc.classes" @open="emit('openClass', $event)" />
      <TitlesTable v-else :rows="filteredTitles" :class-map="classMap" @open="handleOpenTitle" />

      <div class="flex items-center justify-end" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
            Classe Ativa:
          </span>
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 6px 12px; background: var(--gci-base); color: #fff; border-radius: var(--radius-sm)">
            TODAS
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
