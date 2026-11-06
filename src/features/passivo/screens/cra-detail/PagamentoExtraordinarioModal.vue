<script setup lang="ts">
import { ref } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [] }>();

const dataPagamento = ref('');
const puJuros = ref('');
const valorAmortizacao = ref('');
</script>

<template>
  <AdminModal size="sm" eyebrow="Passivo · CRA" title="Novo Pagamento Extraordinário" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <div class="flex flex-col" style="gap: 6px">
        <label
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
          "
        >
          Data do Pagamento
        </label>
        <AdminDateField v-model="dataPagamento" />
      </div>

      <div class="flex flex-col" style="gap: 6px">
        <label
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
          "
        >
          PU de Juros
        </label>
        <input
          v-model="puJuros"
          type="text"
          placeholder="0.00000"
          style="
            width: 100%;
            height: 48px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            padding: 0 16px;
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-default);
            outline: none;
          "
        />
      </div>

      <div class="flex flex-col" style="gap: 6px">
        <label
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
          "
        >
          Valor de Amortização
        </label>
        <input
          v-model="valorAmortizacao"
          type="text"
          placeholder="R$ 0,00"
          style="
            width: 100%;
            height: 48px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            padding: 0 16px;
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-default);
            outline: none;
          "
        />
      </div>

      <div
        class="flex items-start"
        style="
          gap: 10px;
          padding: 14px 16px;
          background: var(--status-danger-bg);
          border: 1px solid color-mix(in srgb, var(--danger-base) 20%, transparent);
          border-radius: var(--radius-lg);
          color: var(--status-danger-text);
        "
      >
        <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
        <p style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.4">
          Atenção: Esta é uma operação extraordinária fora do cronograma original. O status ficará pendente de validação pela custódia.
        </p>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="emit('confirm')" type="button">Registrar operação</AdminButton>
    </template>
  </AdminModal>
</template>
