<script setup lang="ts">
import { ref, type Component } from 'vue';
import { Boxes, ChevronRight, PanelTop } from 'lucide-vue-next';
import {
  CONFIGURACOES_CARDS,
  type ConfiguracoesCardKey,
} from '../data/configuracoesCards';
import ComponentesScreen from './ComponentesScreen.vue';
import TelasScreen from './TelasScreen.vue';

const CARD_ICONS: Record<ConfiguracoesCardKey, Component> = {
  componentes: Boxes,
  telas: PanelTop,
};

const section = ref<ConfiguracoesCardKey | null>(null);
const hoveredKey = ref<ConfiguracoesCardKey | null>(null);

function openSection(key: ConfiguracoesCardKey) {
  section.value = key;
}

function goHub() {
  section.value = null;
}
</script>

<template>
  <ComponentesScreen v-if="section === 'componentes'" @back="goHub" />
  <TelasScreen v-else-if="section === 'telas'" @back="goHub" />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Sistema · Administração
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
        Configurações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Ferramentas e referências para manter o produto alinhado à prototipação.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="card in CONFIGURACOES_CARDS"
        :key="card.key"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === card.key ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === card.key ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === card.key ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
        @click="openSection(card.key)"
        @mouseenter="hoveredKey = card.key"
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
          <component :is="CARD_ICONS[card.key]" :size="20" />
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
            {{ card.title }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ card.description }}
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
            opacity: hoveredKey === card.key ? 1 : 0,
            transform: hoveredKey === card.key ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          {{ card.cta }} <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>
</template>
