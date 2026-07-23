<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  ArrowLeft,
  ChevronRight,
  Columns3,
  FormInput,
  Layers,
  Palette,
  Ruler,
  SquareMousePointer,
  Type,
} from 'lucide-vue-next';
import {
  COMPONENTES_CATEGORIES,
  type ComponenteCategoryKey,
} from '../data/componentesCatalog';
import BotoesShowcase from '../components/componentes/BotoesShowcase.vue';
import TabelasShowcase from '../components/componentes/TabelasShowcase.vue';
import CamposShowcase from '../components/componentes/CamposShowcase.vue';
import IconesShowcase from '../components/componentes/IconesShowcase.vue';
import TipografiaShowcase from '../components/componentes/TipografiaShowcase.vue';
import EspacamentoShowcase from '../components/componentes/EspacamentoShowcase.vue';
import CoresShowcase from '../components/componentes/CoresShowcase.vue';

const emit = defineEmits<{ back: [] }>();

const CATEGORY_ICONS: Record<ComponenteCategoryKey, Component> = {
  botoes: SquareMousePointer,
  tabelas: Columns3,
  campos: FormInput,
  icones: Layers,
  tipografia: Type,
  espacamento: Ruler,
  cores: Palette,
};

const SHOWCASES: Record<ComponenteCategoryKey, Component> = {
  botoes: BotoesShowcase,
  tabelas: TabelasShowcase,
  campos: CamposShowcase,
  icones: IconesShowcase,
  tipografia: TipografiaShowcase,
  espacamento: EspacamentoShowcase,
  cores: CoresShowcase,
};

const selected = ref<ComponenteCategoryKey | null>(null);
const hoveredKey = ref<ComponenteCategoryKey | null>(null);

const category = computed(
  () => COMPONENTES_CATEGORIES.find((c) => c.key === selected.value) ?? null,
);

function selectCategory(key: ComponenteCategoryKey) {
  selected.value = key;
}

function goBack() {
  if (selected.value) {
    selected.value = null;
    return;
  }
  emit('back');
}
</script>

<template>
  <!-- Grid de categorias -->
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
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
          flex-shrink: 0;
        "
        @click="goBack"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Configurações · Componentes
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
            margin: 0;
          "
        >
          Componentes
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Referência visual para desenvolvimento fiel à prototipação.
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="c in COMPONENTES_CATEGORIES"
        :key="c.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === c.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === c.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === c.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="selectCategory(c.key)"
        @mouseenter="hoveredKey = c.key"
        @mouseleave="hoveredKey = null"
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <component :is="CATEGORY_ICONS[c.key]" :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 6px;
            "
          >
            {{ c.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ c.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === c.key ? 1 : 0,
            transform: hoveredKey === c.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          {{ c.cta }} <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <!-- Detalhe da categoria -->
  <div v-else class="flex flex-col" style="gap: 24px">
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
          flex-shrink: 0;
        "
        @click="goBack"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Componentes · Galeria
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            margin: 0;
          "
        >
          {{ category?.title }}
        </h2>
        <p
          v-if="category"
          style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px"
        >
          {{ category.description }}
        </p>
      </div>
    </div>

    <component :is="SHOWCASES[selected]" />
  </div>
</template>
