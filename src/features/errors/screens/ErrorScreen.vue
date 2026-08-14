<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, Home } from 'lucide-vue-next';
import ImageWithFallback from '@/components/figma/ImageWithFallback.vue';
import logoSrc from '@/assets/logo-azul-sem-bg.png';
import { resolveErrorPreset } from '../data/errorPresets';

/** Ilustração estática (handoff). Em produção pode ser substituída pela API de GIFs. */
const PUPPY_IMG =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop';

const props = withDefaults(
  defineProps<{
    code?: string | number;
    title?: string;
    description?: string;
    primaryLabel?: string;
  }>(),
  { code: '404' },
);

const emit = defineEmits<{
  primary: [];
  home: [];
}>();

const resolved = computed(() => {
  const preset = resolveErrorPreset(props.code ?? '404');
  return {
    code: String(props.code ?? preset.code),
    title: props.title ?? preset.title,
    description: props.description ?? preset.description,
    primaryLabel: props.primaryLabel ?? preset.primaryLabel,
  };
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      width: 100%;
      height: 100%;
      min-height: 560px;
      background: var(--surface-page);
      padding: 40px 24px;
    "
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        padding: 36px 36px 32px;
        gap: 0;
      "
    >
      <ImageWithFallback
        :src="logoSrc"
        alt="Grupo Ceres Investimentos"
        :style="{ height: '56px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }"
      />

      <div
        style="
          width: 48px;
          height: 4px;
          background: var(--agro-base);
          border-radius: 2px;
          margin: 24px 0 20px;
        "
      />

      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 8px;
        "
      >
        Erro {{ resolved.code }}
      </div>

      <h1
        style="
          font-size: var(--text-3xl);
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: var(--leading-tight);
          margin: 0 0 10px;
        "
      >
        {{ resolved.title }}
      </h1>

      <p
        style="
          margin: 0 0 24px;
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: var(--leading-relaxed);
        "
      >
        {{ resolved.description }}
      </p>

      <div
        style="
          border-radius: var(--radius-xl);
          overflow: hidden;
          height: 180px;
          background: var(--surface-sunken);
          margin-bottom: 28px;
        "
      >
        <ImageWithFallback
          :src="PUPPY_IMG"
          alt="Cachorrinho"
          :style="{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }"
        />
      </div>

      <div class="flex items-center" style="gap: 12px">
        <button
          type="button"
          class="btn-animated btn-primary flex items-center justify-center"
          style="
            flex: 1;
            height: 44px;
            padding: 0 16px;
            border: none;
            border-radius: var(--radius-xl);
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
            cursor: pointer;
            gap: 6px;
            box-shadow: 0 10px 24px -8px rgba(8, 60, 74, 0.18);
          "
          @click="emit('primary')"
        >
          {{ resolved.primaryLabel }}
          <ChevronRight :size="16" />
        </button>
        <button
          type="button"
          class="btn-animated flex items-center justify-center"
          style="
            height: 44px;
            padding: 0 14px;
            border: 1px solid var(--border-strong);
            border-radius: var(--radius-xl);
            background: var(--surface-card);
            color: var(--text-default);
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
            cursor: pointer;
            gap: 8px;
          "
          @click="emit('home')"
        >
          <Home :size="16" />
          Início
        </button>
      </div>
    </div>
  </div>
</template>
