<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Alert from '@/components/feedback/Alert.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    aviso?: string;
    /** Cancelar à esquerda e confirmar à direita. */
    spreadFooter?: boolean;
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
    aviso: '',
    spreadFooter: false,
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'primary',
    persistent: false,
  },
);

const emit = defineEmits<{ close: []; confirm: [] }>();

const typed = ref('');

const confirmEnabled = computed(() => typed.value === props.confirmPhrase);

watch(
  () => props.confirmPhrase,
  () => {
    typed.value = '';
  },
);
</script>

<template>
  <AdminModal
    :width="420"
    :title="title"
    :subtitle="subtitle"
    :persistent="persistent"
    body-tone="card"
    :footer-align="spreadFooter ? 'between' : 'end'"
    @close="emit('close')"
  >
    <Alert
      v-if="aviso"
      type="warning"
      title="Parte da seleção fica de fora"
      :message="aviso"
      :dismissible="false"
      style="margin-bottom: 16px"
    />
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
        height: 40px;
        padding: 0 14px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        outline: none;
        font-size: var(--text-sm);
        color: var(--text-strong);
      "
    />

    <template #footer>
      <AdminButton variant="secondary" @click="emit('close')">{{ cancelLabel }}</AdminButton>
      <AdminButton :variant="variant" :disabled="!confirmEnabled" @click="emit('confirm')">
        {{ confirmLabel }}
      </AdminButton>
    </template>
  </AdminModal>
</template>
