<script setup lang="ts">
import { ref } from 'vue';
import { Check, Copy, Link2, X } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

defineProps<{ grupoNome: string; link: string }>();
const emit = defineEmits<{ close: [] }>();

const toast = useToast();
const copied = ref(false);
const linkInput = ref<HTMLInputElement | null>(null);

function marcarCopiado() {
  copied.value = true;
  toast.success('Link de auto cadastro copiado.');
  setTimeout(() => {
    copied.value = false;
  }, 1600);
}

function copiar(link: string) {
  const field = linkInput.value;
  if (field) {
    field.focus();
    field.select();
  }
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  if (ok) {
    marcarCopiado();
    return;
  }
  void navigator.clipboard.writeText(link).then(marcarCopiado).catch(() => {
    toast.error('Não foi possível copiar o link. Selecione o endereço e copie manualmente.');
  });
}
</script>

<template>
  <div
    style="position: fixed; inset: 0; background: rgba(8,60,74,0.55); backdrop-filter: blur(8px); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 32px"
    @click.self="emit('close')"
  >
    <div
      style="background: var(--surface-card); border-radius: var(--radius-xl); width: 100%; max-width: 520px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg)"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center" style="gap: 12px">
          <div
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--accent-bg); color: var(--accent); flex-shrink: 0"
          >
            <Link2 :size="19" />
          </div>
          <div>
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
              Link de auto cadastro
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ grupoNome }}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 32px; height: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 28px">
        <p style="font-size: var(--text-sm); color: var(--text-default); margin-bottom: 14px">
          Envie este link para o grupo concluir o cadastro por conta própria.
        </p>
        <div class="flex items-center" style="gap: 8px">
          <input
            ref="linkInput"
            readonly
            :value="link"
            style="flex: 1; min-width: 0; height: 40px; padding: 0 12px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
          <button
            type="button"
            class="flex items-center"
            style="gap: 6px; height: 40px; padding: 0 14px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em; flex-shrink: 0"
            @click="copiar(link)"
          >
            <Check v-if="copied" :size="14" />
            <Copy v-else :size="14" />
            {{ copied ? 'COPIADO' : 'COPIAR' }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 42px; padding: 0 18px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>
