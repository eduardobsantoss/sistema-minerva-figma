<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import { Check, Copy } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import TotpQrPlaceholder from './TotpQrPlaceholder.vue';

const CODE_LENGTH = 6;

/** Segredo mock (TOTP) — em produção viria da API. */
const DEFAULT_SECRET = 'CGZJSIHEKA4HWQVZWTOIOPQWZFZSWF7Z';

const props = withDefaults(
  defineProps<{
    secret?: string;
    accountLabel?: string;
    issuer?: string;
    authenticatorApp?: string;
  }>(),
  {
    secret: DEFAULT_SECRET,
    accountLabel: 'usuario@empresa.com.br',
    issuer: 'Minerva',
    authenticatorApp: 'Microsoft Authenticator',
  },
);

const emit = defineEmits<{
  close: [];
  activate: [code: string];
}>();

const digits = ref<string[]>(Array.from({ length: CODE_LENGTH }, () => ''));
const focusedIndex = ref<number | null>(null);
const copied = ref(false);
const inputsRef = useTemplateRef<HTMLInputElement[]>('inputs');

const code = computed(() => digits.value.join(''));
const canActivate = computed(() => code.value.length === CODE_LENGTH && /^\d{6}$/.test(code.value));

function focusAt(index: number) {
  focusedIndex.value = index;
  nextTick(() => {
    const el = inputsRef.value?.[index];
    el?.focus();
    el?.select();
  });
}

function setDigit(index: number, value: string) {
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned) {
    digits.value[index] = '';
    return;
  }
  for (let i = 0; i < cleaned.length && index + i < CODE_LENGTH; i++) {
    digits.value[index + i] = cleaned[i]!;
  }
  focusAt(Math.min(index + cleaned.length, CODE_LENGTH - 1));
}

function onKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (digits.value[index]) {
      digits.value[index] = '';
    } else if (index > 0) {
      digits.value[index - 1] = '';
      focusAt(index - 1);
    }
    return;
  }
  if (e.key === 'ArrowLeft' && index > 0) {
    e.preventDefault();
    focusAt(index - 1);
  }
  if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
    e.preventDefault();
    focusAt(index + 1);
  }
  if (e.key === 'Enter' && canActivate.value) {
    e.preventDefault();
    handleActivate();
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault();
  const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, CODE_LENGTH);
  if (!pasted) return;
  for (let i = 0; i < CODE_LENGTH; i++) {
    digits.value[i] = pasted[i] ?? '';
  }
  focusAt(Math.min(pasted.length, CODE_LENGTH - 1));
}

async function copySecret() {
  try {
    await navigator.clipboard.writeText(props.secret);
  } catch {
    /* ignore */
  }
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1500);
}

function handleActivate() {
  if (!canActivate.value) return;
  emit('activate', code.value);
}
</script>

<template>
  <AdminModal
    :width="480"
    eyebrow="Acesso"
    title="Configurar autenticação em dois fatores"
    :subtitle="`Escaneie o QR Code no ${authenticatorApp} ou use a chave manual.`"
    @close="emit('close')"
  >
    <div class="flex flex-col items-center" style="gap: 20px">
      <div
        style="
          padding: 12px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
        "
      >
        <TotpQrPlaceholder :seed="`${secret}:${accountLabel}`" :size="180" />
      </div>

      <div style="width: 100%">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            color: var(--neutral-400);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
          "
        >
          Chave manual
        </div>
        <div
          class="flex items-center"
          style="
            gap: 8px;
            padding: 12px 14px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-xl);
          "
        >
          <code
            style="
              flex: 1;
              min-width: 0;
              font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
              font-size: var(--text-xs);
              color: var(--text-strong);
              letter-spacing: 0.04em;
              word-break: break-all;
              line-height: var(--leading-relaxed);
            "
            >{{ secret }}</code
          >
          <button
            type="button"
            :aria-label="copied ? 'Copiado' : 'Copiar chave'"
            :title="copied ? 'Copiado!' : 'Copiar'"
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              flex-shrink: 0;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              color: var(--text-muted);
              cursor: pointer;
              padding: 0;
            "
            @click="copySecret"
          >
            <Check v-if="copied" :size="14" style="color: var(--success-base)" />
            <Copy v-else :size="14" />
          </button>
        </div>
      </div>

      <div style="width: 100%">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            color: var(--neutral-400);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
            text-align: center;
          "
        >
          Código de {{ CODE_LENGTH }} dígitos
        </div>
        <div
          class="flex items-center justify-center"
          style="gap: 8px"
          role="group"
          aria-label="Código de verificação"
          @paste="onPaste"
        >
          <input
            v-for="(_, index) in digits"
            :key="index"
            ref="inputs"
            :value="digits[index]"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="1"
            :aria-label="`Dígito ${index + 1}`"
            :style="{
              width: '44px',
              height: '52px',
              textAlign: 'center',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              background: 'var(--surface-sunken)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: focusedIndex === index ? 'var(--gci-base)' : 'var(--border-default)',
              boxShadow: focusedIndex === index ? '0 0 0 4px rgba(8,60,74,0.06)' : 'none',
              borderRadius: 'var(--radius-xl)',
              outline: 'none',
              transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
            }"
            @focus="focusedIndex = index"
            @input="setDigit(index, ($event.target as HTMLInputElement).value)"
            @keydown="onKeydown(index, $event)"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canActivate" @click="handleActivate">Ativar</AdminButton>
    </template>
  </AdminModal>
</template>
