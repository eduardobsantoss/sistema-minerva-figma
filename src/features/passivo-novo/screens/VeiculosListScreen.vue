<script setup lang="ts">
import { computed, ref } from 'vue';
import { Search, Briefcase, Landmark, Wallet, Calendar } from 'lucide-vue-next';
import type { Veiculo } from '../data/passivoNovoData';
import { brl } from '../data/passivoNovoData';
import VeiculoCard from '../components/VeiculoCard.vue';
import KpiStripCard from '../components/KpiStripCard.vue';

const props = defineProps<{ veiculos: Veiculo[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return props.veiculos;
  return props.veiculos.filter(
    (v) =>
      v.nome.toLowerCase().includes(term) ||
      v.cessionaria.toLowerCase().includes(term) ||
      v.tipo.toLowerCase().includes(term),
  );
});

const kpis = computed(() => {
  const list = props.veiculos;
  const funding = list.reduce((s, v) => s + v.funding, 0);
  const caixa = list.reduce((s, v) => s + v.caixa, 0);
  return [
    {
      label: 'Veículos',
      value: String(list.length),
      icon: Briefcase,
      tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
    },
    {
      label: 'Funding consolidado',
      value: brl(funding, true),
      icon: Landmark,
      tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
    },
    {
      label: 'Caixa',
      value: brl(caixa, true),
      icon: Wallet,
      tone: { bg: 'var(--accent-bg)', fg: 'var(--accent)' },
    },
    {
      label: 'Base D-1',
      value: list[0]?.dataBase ?? '—',
      icon: Calendar,
      tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
    },
  ];
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search
          :size="18"
          style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
        />
        <input
          v-model="q"
          placeholder="Pesquisar por veículo, cessionária ou tipo..."
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
          @focus="focus = true"
          @blur="focus = false"
        />
        <button
          type="button"
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
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <KpiStripCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <VeiculoCard
        v-for="veiculo in filtered"
        :key="veiculo.id"
        :veiculo="veiculo"
        @open="emit('open', veiculo.id)"
      />
    </div>
  </div>
</template>
