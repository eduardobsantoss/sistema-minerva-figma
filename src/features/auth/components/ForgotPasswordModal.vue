<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { Mail, CheckCircle2 } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = withDefaults(
  defineProps<{
    /** Pré-preenche o e-mail (ex.: valor já digitado no login). */
    initialEmail?: string;
  }>(),
  { initialEmail: '' },
);

const emit = defineEmits<{
  close: [];
  /** Disparado ao enviar o e-mail (mock). */
  submit: [email: string];
}>();

const step = ref<'form' | 'sent'>('form');
const email = ref(props.initialEmail);
const focused = ref(false);
const submittedEmail = ref('');

const canSubmit = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));

const inputStyle = computed((): CSSProperties => ({
  background: 'var(--surface-sunken)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: focused.value ? 'var(--gci-base)' : 'var(--border-default)',
  boxShadow: focused.value ? 'var(--focus-ring)' : 'none',
  borderRadius: 'var(--radius-xl)',
  height: '48px',
  color: 'var(--text-strong)',
  width: '100%',
  paddingLeft: '44px',
  paddingRight: '16px',
  outline: 'none',
  fontSize: 'var(--text-base)',
  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
}));

function handleSubmit() {
  if (!canSubmit.value) return;
  const value = email.value.trim();
  submittedEmail.value = value;
  emit('submit', value);
  step.value = 'sent';
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Acesso"
    :title="step === 'form' ? 'Esqueceu a senha?' : 'E-mail enviado'"
    :subtitle="
      step === 'form'
        ? 'Informe o e-mail corporativo. Enviaremos uma nova senha temporária.'
        : undefined
    "
    :footer-align="step === 'sent' ? 'end' : 'between'"
    @close="emit('close')"
  >
    <template v-if="step === 'form'">
      <label
        style="
          display: block;
          font-size: 11px;
          font-weight: var(--weight-bold);
          color: var(--neutral-400);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        "
      >
        E-mail corporativo
      </label>
      <div class="relative">
        <Mail
          :size="18"
          style="
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--neutral-400);
          "
        />
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="exemplo@empresa.com.br"
          :style="inputStyle"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.enter.prevent="handleSubmit"
        />
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center" style="text-align: center; padding: 8px 0 4px">
        <div
          class="flex items-center justify-center"
          style="
            width: 56px;
            height: 56px;
            border-radius: var(--radius-full);
            background: var(--success-light);
            color: var(--success-base);
            margin-bottom: 16px;
          "
        >
          <CheckCircle2 :size="28" :stroke-width="2" />
        </div>
        <p
          style="
            margin: 0;
            font-size: var(--text-sm);
            color: var(--text-default);
            line-height: var(--leading-relaxed);
            max-width: 360px;
          "
        >
          Se existir uma conta para
          <strong style="color: var(--text-strong); font-weight: var(--weight-bold)">{{
            submittedEmail
          }}</strong
          >, você receberá uma nova senha temporária por e-mail em instantes.
        </p>
        <p
          style="
            margin: 12px 0 0;
            font-size: var(--text-xs);
            color: var(--text-muted);
            line-height: var(--leading-relaxed);
          "
        >
          Verifique também a pasta de spam. Em caso de dúvidas, fale com a Equipe de TI.
        </p>
      </div>
    </template>

    <template #footer>
      <template v-if="step === 'form'">
        <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton size="large" :disabled="!canSubmit" @click="handleSubmit">
          Enviar nova senha
        </AdminButton>
      </template>
      <AdminButton v-else size="large" @click="emit('close')">Voltar ao login</AdminButton>
    </template>
  </AdminModal>
</template>
