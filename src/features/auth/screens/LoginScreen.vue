<script setup lang="ts">
import { ref, computed, type CSSProperties } from 'vue';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-vue-next';
import ImageWithFallback from '@/components/figma/ImageWithFallback.vue';
import logoSrc from '@/assets/logo-azul-sem-bg.png';

const HERO_IMG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop';

const emit = defineEmits<{ submit: [] }>();

const showPwd = ref(false);
const focused = ref<string | null>(null);
const email = ref('');
const password = ref('');
function handle() {
  emit('submit');
}

const inputBase: CSSProperties = {
  background: 'var(--surface-sunken)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--border-default)',
  borderRadius: 'var(--radius-xl)',
  height: '50px',
  color: 'var(--text-strong)',
};

const focusStyle: CSSProperties = {
  borderColor: 'var(--gci-base)',
  boxShadow: '0 0 0 4px rgba(8,60,74,0.06)',
};

const emailInputStyle = computed(() => ({
  ...inputBase,
  ...(focused.value === 'email' ? focusStyle : {}),
  width: '100%',
  paddingLeft: '44px',
  paddingRight: '16px',
  outline: 'none',
  fontSize: 'var(--text-base)',
  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
}));

const passwordInputStyle = computed(() => ({
  ...inputBase,
  ...(focused.value === 'password' ? focusStyle : {}),
  width: '100%',
  paddingLeft: '44px',
  paddingRight: '44px',
  outline: 'none',
  fontSize: 'var(--text-base)',
  transition: 'box-shadow var(--duration-base), border-color var(--duration-base)',
}));

const submitButtonStyle = {
  width: '100%',
  height: '48px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--action-primary-bg)',
  color: 'var(--action-primary-text)',
  fontWeight: 'var(--weight-bold)',
  fontSize: 'var(--text-base)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '0 10px 24px -8px rgba(8,60,74,0.18)',
};
</script>

<template>
  <div
    class="grid h-full w-full"
    style="grid-template-columns: 560px 1fr; background: var(--surface-page)"
  >
    <!-- Coluna esquerda -->
    <div class="flex flex-col" style="background: var(--surface-card); padding: 56px 64px 48px">
      <div style="margin-bottom: auto">
        <ImageWithFallback
          :src="logoSrc"
          alt="Grupo Ceres Investimentos"
          :style="{ height: '96px', width: 'auto', objectFit: 'contain' }"
        />
      </div>

      <form style="max-width: 384px; width: 100%; margin-top: auto" @submit.prevent="handle">
        <h1
          style="
            font-size: 30px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.2;
            margin-bottom: 12px;
          "
        >
          Acesso Interno
        </h1>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            line-height: var(--leading-relaxed);
            margin-bottom: 32px;
          "
        >
          Bem-vindo à plataforma interna do Grupo Ceres. Acesse para gerenciar as operações do
          agronegócio.
        </p>

        <!-- Email -->
        <div style="margin-bottom: 20px">
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
              placeholder="exemplo@empresa.com.br"
              :style="emailInputStyle"
              @focus="focused = 'email'"
              @blur="focused = null"
            />
          </div>
        </div>

        <!-- Senha -->
        <div style="margin-bottom: 24px">
          <div class="flex items-center justify-between" style="margin-bottom: 8px">
            <label
              style="
                font-size: 11px;
                font-weight: var(--weight-bold);
                color: var(--neutral-400);
                text-transform: uppercase;
                letter-spacing: 0.08em;
              "
            >
              Senha
            </label>
            <a
              href="#"
              style="
                font-size: var(--text-xs);
                color: var(--gci-base);
                font-weight: var(--weight-bold);
                text-decoration: none;
              "
            >
              Esqueceu a senha?
            </a>
          </div>
          <div class="relative">
            <Lock
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
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="••••••••"
              :style="passwordInputStyle"
              @focus="focused = 'password'"
              @blur="focused = null"
            />
            <button
              type="button"
              aria-label="Mostrar senha"
              style="
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
              "
              @click="showPwd = !showPwd"
            >
              <EyeOff v-if="showPwd" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>

        <button type="submit" class="group btn-animated btn-primary" :style="submitButtonStyle">
          Entrar no Sistema
          <ChevronRight :size="18" />
        </button>

        <div
          style="
            border-top: 1px solid var(--neutral-100);
            margin-top: 32px;
            padding-top: 20px;
            font-size: 12px;
            color: var(--neutral-400);
            line-height: var(--leading-relaxed);
          "
        >
          Problemas com o acesso? Por favor, entre em contato com a
          <a
            href="#"
            style="color: var(--gci-base); font-weight: var(--weight-bold); text-decoration: none"
          >
            Equipe de TI
          </a>
          .
        </div>
      </form>

      <div
        style="
          margin-top: auto;
          padding-top: 48px;
          font-size: 10px;
          text-transform: uppercase;
          color: var(--neutral-400);
          letter-spacing: 0.18em;
        "
      >
        © 2025 Grupo Ceres Investimentos.
      </div>
    </div>

    <!-- Coluna direita — hero -->
    <div class="relative overflow-hidden" style="background: var(--gci-base)">
      <ImageWithFallback
        :src="HERO_IMG"
        alt="Agronegócio ao pôr do sol"
        class="absolute inset-0 w-full h-full"
        :style="{ objectFit: 'cover' }"
      />
      <!-- Overlay -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            135deg,
            rgba(8, 60, 74, 0.8) 0%,
            rgba(8, 60, 74, 0.4) 45%,
            transparent 100%
          );
          z-index: 1;
        "
      />
      <!-- Blobs decorativos -->
      <div
        class="absolute"
        style="
          top: -120px;
          right: -80px;
          width: 360px;
          height: 360px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          filter: blur(60px);
          z-index: 1;
        "
      />
      <div
        class="absolute"
        style="
          bottom: -100px;
          right: -60px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(242, 125, 38, 0.1);
          filter: blur(60px);
          z-index: 1;
        "
      />

      <!-- Conteúdo -->
      <div class="absolute flex flex-col" style="left: 64px; right: 64px; bottom: 64px; z-index: 2">
        <div
          style="
            width: 48px;
            height: 4px;
            background: var(--agro-base);
            border-radius: 2px;
            margin-bottom: 24px;
          "
        />
        <h2
          style="
            font-size: 52px;
            font-weight: 900;
            letter-spacing: -0.025em;
            color: #fff;
            line-height: 1.05;
            text-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
            margin-bottom: 20px;
            max-width: 720px;
          "
        >
          Gestão interna e estratégica do agronegócio.
        </h2>
        <p
          style="
            font-size: 18px;
            color: rgba(255, 255, 255, 0.82);
            font-weight: var(--weight-medium);
            line-height: var(--leading-relaxed);
            max-width: 560px;
          "
        >
          Ferramentas integradas para eficiência operacional e análise de dados estratégica do
          Grupo Ceres.
        </p>
      </div>
    </div>
  </div>
</template>
