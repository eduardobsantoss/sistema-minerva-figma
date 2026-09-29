<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    /** Texto orientando o usuário (ex.: “Digite o código abaixo…”). */
    instruction: string;
    /** Código que deve ser digitado exatamente (use hífens, ex.: GARANTIA-EM-EXECUCAO). */
    confirmPhrase: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'primary' | 'danger';
    /** Quando verdadeiro, clique no overlay não fecha o modal. */
    persistent?: boolean;
  }>(),
  {
    subtitle: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'primary',
    persistent: false,
  },
);

const emit = defineEmits<{ close: []; confirm: [] }>();

const typed = ref('');

const confirmEnabled = computed(() => typed.value === props.confirmPhrase);

const confirmButtonStyle = computed(() => {
  if (!confirmEnabled.value) {
    return {
      background: 'var(--neutral-200)',
      color: 'var(--text-disabled)',
    };
  }
  if (props.variant === 'danger') {
    return {
      background: 'var(--action-danger-bg)',
      color: 'var(--action-danger-text)',
    };
  }
  return {
    background: 'var(--gci-base)',
    color: '#fff',
  };
});

watch(
  () => props.confirmPhrase,
  () => {
    typed.value = '';
  },
);
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
    @click.self="!persistent && emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 420px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4);
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ title }}
          </h2>
          <p v-if="subtitle" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ subtitle }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="padding: 20px 22px 22px">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0 0 14px">
          {{ instruction }}
        </p>

        <div class="flex justify-center" style="margin-bottom: 12px">
          <div
            style="
              display: inline-block;
              padding: 4px 10px;
              background: var(--surface-sunken);
              border-radius: var(--radius-md);
              font-size: 11px;
              font-weight: var(--weight-bold);
              color: var(--text-muted);
              letter-spacing: 0.06em;
              user-select: all;
              text-align: center;
            "
          >
            {{ confirmPhrase }}
          </div>
        </div>

        <input
          v-model="typed"
          type="text"
          autocomplete="off"
          spellcheck="false"
          style="
            width: 100%;
            height: 42px;
            padding: 0 14px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />

        <div class="flex items-center justify-end" style="gap: 10px; margin-top: 22px">
          <button
            type="button"
            style="
              height: 40px;
              padding: 0 18px;
              background: var(--surface-card);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="emit('close')"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :disabled="!confirmEnabled"
            :style="{
              height: '40px',
              padding: '0 18px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: confirmEnabled ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-sm)',
              ...confirmButtonStyle,
            }"
            @click="confirmEnabled && emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
