<script setup lang="ts">

import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <AdminModal size="sm" eyebrow="Passivo · CRA" title="Validar PU Programado" @close="emit('close')">
    <div class="flex flex-col" style="gap: 20px">
      <div
        style="
          background: var(--gci-light);
          border: 1px solid var(--gci-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
        "
      >
        <div class="flex justify-between items-center" style="margin-bottom: 12px">
          <p
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              color: var(--gci-base);
              text-transform: uppercase;
              letter-spacing: 0.12em;
              opacity: 0.7;
            "
          >
            PU Calculado para data de pagamento
          </p>
          <span style="font-size: 10px; font-weight: var(--weight-bold); color: var(--gci-base)">28/05/2026</span>
        </div>
        <h3
          style="
            font-size: var(--text-3xl);
            font-weight: var(--weight-bold);
            color: var(--gci-base);
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          R$ 108,74219
        </h3>
      </div>

      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-relaxed); font-weight: var(--weight-medium)">
        Ao validar o PU, um e-mail de notificação será disparado automaticamente para o AF (Agente Fiduciário) confirmando os valores para liquidação regular conforme cronograma.
      </p>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('confirm')" type="button">Confirmar e enviar e-mail</AdminButton>
    </template>
  </AdminModal>
</template>
