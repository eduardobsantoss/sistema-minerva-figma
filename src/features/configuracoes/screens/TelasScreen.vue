<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import { ArrowLeft, ChevronRight, ClipboardList } from 'lucide-vue-next';
import { TELAS_DISSECCOES, type TelaDisseccaoKey } from '../data/telasCatalog';
import DisseccaoMarkdownViewer from './DisseccaoMarkdownViewer.vue';
import solicitacaoCatalog from '../disseccoes/solicitacao-operacao.catalog.json';

const emit = defineEmits<{ back: [] }>();

const CARD_ICONS: Record<TelaDisseccaoKey, Component> = {
  'solicitacao-operacao': ClipboardList,
};

const CATALOGS: Record<TelaDisseccaoKey, typeof solicitacaoCatalog> = {
  'solicitacao-operacao': solicitacaoCatalog,
};

const selected = ref<TelaDisseccaoKey | null>(null);
const hoveredKey = ref<TelaDisseccaoKey | null>(null);

const selectedMeta = computed(
  () => TELAS_DISSECCOES.find((t) => t.key === selected.value) ?? null,
);

function openTela(key: TelaDisseccaoKey) {
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
  <DisseccaoMarkdownViewer
    v-if="selected && selectedMeta"
    :catalog="CATALOGS[selected]"
    @back="goBack"
  />

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
          Configurações · Telas
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
          Telas
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Dissecção visual por componente — copie o MD de cada um.
        </p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="tela in TELAS_DISSECCOES"
        :key="tela.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === tela.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === tela.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === tela.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="openTela(tela.key)"
        @mouseenter="hoveredKey = tela.key"
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
          <component :is="CARD_ICONS[tela.key]" :size="20" />
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
            {{ tela.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ tela.description }}
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
            opacity: hoveredKey === tela.key ? 1 : 0,
            transform: hoveredKey === tela.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          {{ tela.cta }} <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>
</template>
