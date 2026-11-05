<script setup lang="ts">
import { Paperclip } from 'lucide-vue-next';
import type { ValidacaoEvidencia } from '../../data/operacaoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{
  tituloValidacao: string;
  evidencia: ValidacaoEvidencia;
}>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Detalhes da autorização" :subtitle="`${tituloValidacao}`" footer-align="end" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          De: {{ evidencia.autor }}
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ evidencia.data }}
        </div>
      </div>

      <div
        v-if="evidencia.arquivo"
        class="flex items-center"
        style="gap: 8px; font-size: var(--text-sm); color: var(--text-default)"
      >
        <Paperclip :size="15" style="color: var(--text-muted)" />
        {{ evidencia.arquivo }}
      </div>

      <div
        style="
          padding: 16px;
          background: var(--surface-sunken);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
          color: var(--text-strong);
          line-height: 1.5;
          min-height: 96px;
        "
      >
        {{ evidencia.descricao }}
      </div>
    </div>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>
