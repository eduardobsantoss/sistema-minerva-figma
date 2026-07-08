<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, FileText, TrendingUp, Calendar, AlertCircle, Search, Filter } from 'lucide-vue-next';
import { brl, type Fidc, type FidcClass, type Title } from '../data/fidcsData';
import PLHero from '../components/PLHero.vue';
import TitlesTable from '../components/TitlesTable.vue';
import ClassKPI from './class-detail/ClassKPI.vue';

const props = defineProps<{ fidc: Fidc; klass: FidcClass }>();
const emit = defineEmits<{ back: []; openTitle: [titleId: string] }>();

const q = ref('');
const filtered = computed(() =>
  props.klass.titulos.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const classMap = computed(() => ({
  [props.klass.id]: String(props.fidc.classes.findIndex((c) => c.id === props.klass.id) + 1),
}));

function handleOpenTitle(t: Title) {
  emit('openTitle', t.id);
}
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
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ fidc.name }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ klass.name }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Classe • {{ klass.cnpj }}
        </p>
      </div>
    </div>

    <PLHero :fidc="fidc" />

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <ClassKPI
        :icon="FileText"
        label="Valor Nominal"
        :value="brl(klass.vrNominal)"
        :tone="{ bg: 'var(--success-light)', fg: 'var(--success-base)' }"
      />
      <ClassKPI
        :icon="TrendingUp"
        label="Valor em Aberto"
        :value="brl(klass.vrAberto)"
        :tone="{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }"
      />
      <ClassKPI
        :icon="Calendar"
        label="Valor Presente"
        :value="brl(klass.vrPresente)"
        :tone="{ bg: '#EEF0FF', fg: '#4F46E5' }"
      />
      <ClassKPI
        :icon="AlertCircle"
        label="Valor Vencido"
        :value="brl(klass.vrVencido)"
        :tone="{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }"
        danger
      />
    </div>

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
            Títulos da Classe
          </div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ klass.titulos.length }} direitos creditórios vinculados
          </div>
        </div>
        <button
          aria-label="Filtros"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
        >
          <Filter :size="16" />
        </button>
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

      <TitlesTable :rows="filtered" :class-map="classMap" @open="handleOpenTitle" />
    </div>
  </div>
</template>
