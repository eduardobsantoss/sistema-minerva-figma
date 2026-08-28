<script setup lang="ts">
import { computed, ref } from 'vue';
import { TrendingUp } from 'lucide-vue-next';
import UnderlineSubTabs from '../../components/UnderlineSubTabs.vue';
import { brl, type Veiculo } from '../../data/passivoNovoData';
import { getLamina } from '../../data/laminaData';
import ResumoSubTab from './sub-tabs/ResumoSubTab.vue';
import RentabilidadeSubTab from './sub-tabs/RentabilidadeSubTab.vue';

const props = defineProps<{ veiculo: Veiculo }>();

const LAMINA_TABS = ['Resumo', 'Rentabilidade'] as const;
type LaminaTabId = (typeof LAMINA_TABS)[number];

const activeTab = ref<LaminaTabId>('Resumo');
const lamina = computed(() => getLamina(props.veiculo));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
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
      <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Total do ativo
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(veiculo.ativoTotal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          {{ veiculo.series.length }} séries · Funding {{ brl(veiculo.funding, true) }} · Caixa {{ brl(veiculo.caixa, true) }}
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1"
      >
        <TrendingUp :size="26" />
      </div>
    </div>

    <UnderlineSubTabs v-model="activeTab" :tabs="[...LAMINA_TABS]" />

    <ResumoSubTab v-if="activeTab === 'Resumo'" :veiculo="veiculo" :lamina="lamina" />
    <RentabilidadeSubTab v-else :veiculo="veiculo" :lamina="lamina" />
  </div>
</template>
