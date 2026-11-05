<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{
  solicitacaoId: string;
  cedente: string;
  etapaOrigem: string;
  etapaDestino: string;
}>();
const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" :title="`Mover solicitação ${solicitacaoId}`" :subtitle="`${cedente}`" @close="emit('close')">
    <div>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 16px">
        Confirme a mudança de etapa no kanban. A solicitação será movida imediatamente após a confirmação.
      </p>

      <div
        class="flex items-center"
        style="
          gap: 12px;
          padding: 16px;
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
        "
      >
        <div style="flex: 1; min-width: 0">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            De
          </div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ etapaOrigem }}
          </div>
        </div>

        <div
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: color-mix(in srgb, var(--gci-base) 12%, transparent);
            color: var(--gci-base);
            flex-shrink: 0;
          "
        >
          <ArrowRight :size="16" />
        </div>

        <div style="flex: 1; min-width: 0; text-align: right">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Para
          </div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ etapaDestino }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('confirm')" type="button">Confirmar</AdminButton>
    </template>
  </AdminModal>
</template>
