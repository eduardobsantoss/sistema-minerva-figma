<script setup lang="ts">
import { ref } from 'vue';
import type { Parametrizacoes, ParteRelacionada } from '../../data/riscoData';
import LimiteSubTab from './LimiteSubTab.vue';
import AutoatendimentoSubTab from './AutoatendimentoSubTab.vue';
import GeralSubTab from './GeralSubTab.vue';
import GarantiaSubTab from './GarantiaSubTab.vue';

interface Props {
  data: Parametrizacoes;
  partesRelacionadas: ParteRelacionada[];
}

defineProps<Props>();
const emit = defineEmits<{
  change: [data: Parametrizacoes];
  'update:partes-relacionadas': [data: ParteRelacionada[]];
}>();

const SUB_TABS = ['Limite', 'Autoatendimento', 'Geral', 'Garantia'] as const;
type SubTab = (typeof SUB_TABS)[number];

const tab = ref<SubTab>('Limite');
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default)">
      <button
        v-for="t in SUB_TABS"
        :key="t"
        :style="{
          padding: '10px 4px', marginRight: '22px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
        }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <LimiteSubTab v-if="tab === 'Limite'" :data="data.limite" @save="(limite) => emit('change', { ...data, limite })" />
    <AutoatendimentoSubTab v-if="tab === 'Autoatendimento'" :data="data.autoatendimento" @save="(autoatendimento) => emit('change', { ...data, autoatendimento })" />
    <GeralSubTab
      v-if="tab === 'Geral'"
      :data="data.geral"
      :partes-relacionadas="partesRelacionadas"
      @save="(geral) => emit('change', { ...data, geral })"
      @update:partes-relacionadas="(pr) => emit('update:partes-relacionadas', pr)"
    />
    <GarantiaSubTab v-if="tab === 'Garantia'" :data="data.garantia" @save="(garantia) => emit('change', { ...data, garantia })" />
  </div>
</template>
