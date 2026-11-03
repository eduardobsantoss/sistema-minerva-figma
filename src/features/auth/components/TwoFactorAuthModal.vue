<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { ShieldCheck } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const CODE_LENGTH = 6;

withDefaults(
  defineProps<{
    /** Nome do app autenticador exibido no subtítulo. */
    authenticatorApp?: string;
  }>(),
  { authenticatorApp: 'Microsoft Authenticator' },
);

const emit = defineEmits<{
  close: [];
  /** Código completo (6 dígitos). */
  verify: [code: string];
}>();

const digits = ref<string[]>(Array.from({ length: CODE_LENGTH }, () => ''));
const focusedIndex = ref(0);
const inputsRef = useTemplateRef<HTMLInputElement[]>('inputs');

const code = computed(() => digits.value.join(''));
const canVerify = computed(() => code.value.length === CODE_LENGTH && /^\d{6}$/.test(code.value));

onMounted(() => {
  focusAt(0);
});

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
  if (e.key === 'Enter' && canVerify.value) {
    e.preventDefault();
    handleVerify();
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

function handleVerify() {
  if (!canVerify.value) return;
  emit('verify', code.value);
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Acesso"
    title="Autenticação em dois fatores"
    :subtitle="`Digite o código de ${CODE_LENGTH} dígitos gerado no ${authenticatorApp}.`"
    @close="emit('close')"
  >
    <div class="flex flex-col items-center" style="gap: 20px">
      <div
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          background: var(--gci-light);
          color: var(--gci-base);
        "
      >
        <ShieldCheck :size="24" :stroke-width="2" />
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
            width: '48px',
            height: '56px',
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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canVerify" @click="handleVerify">Confirmar</AdminButton>
    </template>
  </AdminModal>
</template>
