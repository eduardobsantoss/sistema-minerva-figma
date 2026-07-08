<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Landmark, Wallet, CheckCircle2, Clock } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Fidc } from '../data/fidcsData';
import FidcCard from '../components/FidcCard.vue';

interface Props {
  fidcs: Fidc[];
}

interface KpiDef {
  label: string;
  value: string;
  icon: Component;
  tone: { bg: string; fg: string };
}

const props = defineProps<Props>();
const emit = defineEmits<{ open: [id: string]; new: [] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() =>
  props.fidcs.filter(
    (f) => !q.value || f.name.toLowerCase().includes(q.value.toLowerCase()) || f.cnpj.includes(q.value),
  ),
);

const kpis: KpiDef[] = [
  { label: 'Total de Fundos', value: '3', icon: Landmark, tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { label: 'Valor Total', value: 'R$ 552,1M', icon: Wallet, tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { label: 'Títulos Ativos', value: '31.288', icon: CheckCircle2, tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
  { label: 'Pendências', value: '1,1M', icon: Clock, tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
];
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Search bar + actions -->
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
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar por nome do fundo ou CNPJ..."
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
      <button class="flex items-center new-fidc-btn" style="gap: 8px; height: 56px; padding: 0 24px; color: #fff; border-radius: var(--radius-xl); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em; box-shadow: 0 10px 24px -8px rgba(242,125,38,0.40); transition: background var(--duration-base)" @click="emit('new')">
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)">
          <Plus :size="14" />
        </span>
        NOVO FIDC
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
        <div class="flex items-center justify-center" :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }">
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

    <!-- Grid de FIDC -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <FidcCard v-for="f in filtered" :key="f.id" :fidc="f" @open="emit('open', $event)" />
    </div>
  </div>
</template>

<style scoped>
.new-fidc-btn {
  background: var(--agro-base);
}
.new-fidc-btn:hover {
  background: var(--agro-hover);
}
</style>
