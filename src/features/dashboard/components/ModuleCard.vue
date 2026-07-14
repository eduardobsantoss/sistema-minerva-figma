<script setup lang="ts">
import { toneStyles, type ModuleItem } from '../data/modulesData';
import { useCardHover } from '@/composables/useCardHover';

const props = defineProps<{ item: ModuleItem }>();
const { hover, onMouseenter, onMouseleave } = useCardHover();
const tone = toneStyles[props.item.tone];
</script>

<template>
  <div
    class="relative overflow-hidden flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      border: `1px solid ${hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      height: '100%',
      minHeight: '200px',
      cursor: 'pointer',
      boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition:
        'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <!-- Quarto de círculo decorativo no canto superior direito -->
    <div
      :style="{
        position: 'absolute',
        top: '-64px',
        right: '-64px',
        width: '128px',
        height: '128px',
        borderRadius: '9999px',
        background: hover ? 'rgba(242,125,38,0.08)' : 'var(--neutral-100)',
        transition: 'background var(--duration-base)',
        zIndex: 0,
      }"
    />

    <div class="relative flex flex-col" style="gap: 16px; z-index: 1; flex: 1">
      <div
        class="flex items-center justify-center"
        :style="{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-xl)',
          background: tone.bg,
          color: tone.color,
        }"
      >
        <component :is="item.icon" :size="28" :stroke-width="1.75" />
      </div>

      <div>
        <div
          style="
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin-bottom: 6px;
            letter-spacing: -0.01em;
          "
        >
          {{ item.title }}
        </div>
        <div
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            line-height: var(--leading-relaxed);
          "
        >
          {{ item.description }}
        </div>
      </div>

      <div style="flex: 1" />

      <div
        :style="{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--accent)',
          fontWeight: 'var(--weight-bold)',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity var(--duration-base), transform var(--duration-base)',
        }"
      >
        Acessar módulo →
      </div>
    </div>
  </div>
</template>
