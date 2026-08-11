<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import {
  ArrowLeft,
  ShieldCheck,
  Layers,
  Wallet,
  Percent,
  FileText,
  PieChart,
  Search,
  Settings2,
  Filter,
} from 'lucide-vue-next';
import { brl, pct, type SemiOperacao } from '../data/semiestruturadasData';
import CotasTab from './operacao-tabs/CotasTab.vue';
import LastrosTab from './operacao-tabs/LastrosTab.vue';
import GarantiasTab from './operacao-tabs/GarantiasTab.vue';
import TabBtn from './operacao-tabs/TabBtn.vue';

const props = defineProps<{ operacao: SemiOperacao }>();
const emit = defineEmits<{ back: []; openCota: [cotaId: string] }>();

type ViewTab = 'cotas' | 'lastros' | 'garantias';
const tab = ref<ViewTab>('cotas');
const q = ref('');

interface Kpi {
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}

const kpis = computed<Kpi[]>(() => [
  {
    icon: ShieldCheck,
    label: 'Valor Aberto Total',
    value: brl(props.operacao.valorAbertoGarantia),
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    icon: Wallet,
    label: 'Garantias Duplicatas',
    value: brl(props.operacao.garantiasDuplicatas.valor),
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    icon: Layers,
    label: 'Demais Garantias',
    value: brl(props.operacao.demaisGarantias.valor),
    tone: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  },
  {
    icon: Percent,
    label: 'Cobertura',
    value: pct(props.operacao.coberturaPct),
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
]);

const tabMeta = computed(() => {
  if (tab.value === 'lastros') {
    return {
      icon: FileText,
      title: 'Lastros da Operação',
      subtitle: `${props.operacao.lastros.length} títulos / parcelas`,
      searchPlaceholder: 'Buscar por número, lastro, cedente ou sacado...',
    };
  }
  if (tab.value === 'garantias') {
    return {
      icon: ShieldCheck,
      title: 'Garantias da Operação',
      subtitle: `${props.operacao.garantias.length} garantias cadastradas`,
      searchPlaceholder: 'Buscar por número, tipo, cedente ou sacado...',
    };
  }
  return {
    icon: PieChart,
    title: 'Cotas da Operação',
    subtitle: `${props.operacao.cotas.length} cotas adquiridas`,
    searchPlaceholder: 'Buscar por veículo adquirente...',
  };
});

const filteredCotas = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return props.operacao.cotas;
  return props.operacao.cotas.filter((c) => c.veiculoAdquirente.toLowerCase().includes(term));
});

const filteredLastros = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return props.operacao.lastros;
  return props.operacao.lastros.filter(
    (t) =>
      t.numero.toLowerCase().includes(term) ||
      t.lastro.toLowerCase().includes(term) ||
      t.cedente.toLowerCase().includes(term) ||
      t.sacado.toLowerCase().includes(term),
  );
});

const filteredGarantias = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return props.operacao.garantias;
  return props.operacao.garantias.filter(
    (t) =>
      t.numero.toLowerCase().includes(term) ||
      t.tipoGarantia.toLowerCase().includes(term) ||
      t.lastro.toLowerCase().includes(term) ||
      t.cedente.toLowerCase().includes(term) ||
      t.sacado.toLowerCase().includes(term),
  );
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
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
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          Semiestruturadas · Operação
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ operacao.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ operacao.tipo }} · {{ operacao.cedente }}
        </p>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.40);
      "
    >
      <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Valor Aberto Total da Garantia
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(operacao.valorAbertoGarantia) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          Nominal {{ brl(operacao.valorNominal) }} · Composição {{ brl(operacao.valorComposicao) }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1"
      >
        <ShieldCheck :size="26" />
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl)"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center flex-wrap" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <component :is="tabMeta.icon" :size="20" />
        </div>
        <div style="flex: 1; min-width: 180px">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            {{ tabMeta.title }}
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ tabMeta.subtitle }}
          </div>
        </div>

        <div class="flex" style="padding: 4px; background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <TabBtn :active="tab === 'cotas'" @click="tab = 'cotas'; q = ''">VISUALIZAR COTAS</TabBtn>
          <TabBtn :active="tab === 'lastros'" @click="tab = 'lastros'; q = ''">VISUALIZAR LASTROS</TabBtn>
          <TabBtn :active="tab === 'garantias'" @click="tab = 'garantias'; q = ''">VISUALIZAR GARANTIAS</TabBtn>
        </div>

        <div class="flex items-center" style="gap: 6px">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
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
        </div>
      </div>

      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            :placeholder="tabMeta.searchPlaceholder"
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <CotasTab v-if="tab === 'cotas'" :rows="filteredCotas" @open="emit('openCota', $event)" />
      <LastrosTab v-else-if="tab === 'lastros'" :rows="filteredLastros" />
      <GarantiasTab v-else :rows="filteredGarantias" />

      <div class="flex items-center justify-end" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
            Visão Ativa:
          </span>
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 6px 12px; background: var(--gci-base); color: #fff; border-radius: var(--radius-sm)">
            {{ tab === 'cotas' ? 'COTAS' : tab === 'lastros' ? 'LASTROS' : 'GARANTIAS' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
