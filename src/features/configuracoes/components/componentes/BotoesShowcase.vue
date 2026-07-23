<script setup lang="ts">
import ShowcaseSection from './ShowcaseSection.vue';

const baseBtn = {
  height: '38px',
  padding: '0 16px',
  borderRadius: 'var(--radius-lg)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--weight-bold)' as const,
  cursor: 'pointer',
  border: '1px solid transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Primary"
      description="Ação principal. Classes: btn-animated btn-primary + tokens --action-primary-*."
      token="btn-primary · --action-primary-*"
    >
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <button
          class="btn-animated btn-primary"
          :style="{
            ...baseBtn,
            background: 'var(--action-primary-bg)',
            color: 'var(--action-primary-text)',
          }"
        >
          Salvar
        </button>
        <button
          class="btn-animated btn-primary"
          disabled
          :style="{
            ...baseBtn,
            background: 'var(--action-primary-bg)',
            color: 'var(--action-primary-text)',
            opacity: 0.45,
            cursor: 'not-allowed',
          }"
        >
          Disabled
        </button>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Secondary"
      description="Ação secundária / cancelar. Fundo card + borda forte."
      token="--action-secondary-*"
    >
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <button
          class="btn-animated"
          :style="{
            ...baseBtn,
            background: 'var(--action-secondary-bg)',
            color: 'var(--action-secondary-text)',
            borderColor: 'var(--action-secondary-border)',
          }"
        >
          Cancelar
        </button>
        <button
          class="btn-animated"
          disabled
          :style="{
            ...baseBtn,
            background: 'var(--action-secondary-bg)',
            color: 'var(--text-disabled)',
            borderColor: 'var(--border-default)',
            opacity: 0.7,
            cursor: 'not-allowed',
          }"
        >
          Disabled
        </button>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Danger"
      description="Ações destrutivas. Tokens --action-danger-*."
      token="--action-danger-*"
    >
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <button
          class="btn-animated"
          :style="{
            ...baseBtn,
            background: 'var(--action-danger-bg)',
            color: 'var(--action-danger-text)',
          }"
        >
          Excluir
        </button>
        <button
          class="btn-animated"
          :style="{
            ...baseBtn,
            background: 'transparent',
            color: 'var(--action-danger-text-only)',
            borderColor: 'transparent',
          }"
        >
          Remover (text)
        </button>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Agro / accent"
      description="CTA de destaque laranja (exportar, ações agro). Classes btn-animated btn-agro."
      token="btn-agro · --agro-*"
    >
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <button
          class="btn-animated btn-agro"
          :style="{
            ...baseBtn,
            background: 'var(--agro-base)',
            color: 'var(--text-on-brand)',
          }"
        >
          Exportar
        </button>
        <button
          class="btn-animated btn-agro"
          disabled
          :style="{
            ...baseBtn,
            background: 'var(--agro-base)',
            color: 'var(--text-on-brand)',
            opacity: 0.45,
            cursor: 'not-allowed',
          }"
        >
          Disabled
        </button>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Altura e tipografia"
      description="Padrão de formulário: altura 38px, --text-sm, --weight-bold, --radius-lg."
    >
      <div
        class="flex items-end"
        style="gap: 16px; flex-wrap: wrap; color: var(--text-muted); font-size: var(--text-xs)"
      >
        <div class="flex flex-col" style="gap: 6px; align-items: flex-start">
          <span>Compact 32px</span>
          <button
            class="btn-animated btn-primary"
            :style="{
              ...baseBtn,
              height: '32px',
              padding: '0 12px',
              fontSize: 'var(--text-xs)',
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
            }"
          >
            Compact
          </button>
        </div>
        <div class="flex flex-col" style="gap: 6px; align-items: flex-start">
          <span>Default 38px</span>
          <button
            class="btn-animated btn-primary"
            :style="{
              ...baseBtn,
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
            }"
          >
            Default
          </button>
        </div>
        <div class="flex flex-col" style="gap: 6px; align-items: flex-start">
          <span>Large 44px</span>
          <button
            class="btn-animated btn-primary"
            :style="{
              ...baseBtn,
              height: '44px',
              padding: '0 20px',
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
            }"
          >
            Large
          </button>
        </div>
      </div>
    </ShowcaseSection>
  </div>
</template>
