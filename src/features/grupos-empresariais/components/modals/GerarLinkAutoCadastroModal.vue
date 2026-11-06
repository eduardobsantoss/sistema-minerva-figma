<script setup lang="ts">
import { ref } from 'vue';
import { Check, Copy } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="sm" eyebrow="Grupos empresariais" title="Link de auto cadastro" :subtitle="grupoNome" footer-align="end" @close="emit('close')">

    <div>
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
        <AdminButton :icon="copied ? Check : Copy" style="flex-shrink: 0" @click="copiar(link)">{{ copied ? 'Copiado' : 'Copiar' }}</AdminButton>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>
