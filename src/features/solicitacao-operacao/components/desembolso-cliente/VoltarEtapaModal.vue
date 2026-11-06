<script setup lang="ts">
import { ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { etiquetaEtapa, type EtapaDesembolsoKey } from '../../data/desembolsoClienteData';

defineProps<{
  solicitacaoId: string;
  cedente: string;
  etapa: EtapaDesembolsoKey;
}>();

const emit = defineEmits<{ close: []; confirm: [motivo: string] }>();

const MAX = 500;
const motivo = ref('');
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Solicitação · Desembolso do Cliente"
    title="Voltar etapa"
    :subtitle="`${solicitacaoId} · ${cedente}`"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 16px">
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
        A etapa <strong style="color: var(--text-strong)">{{ etiquetaEtapa(etapa) }}</strong> volta para pendente.
        Nenhum e-mail é reenviado.
      </p>

      <div>
        <div class="field-label">Comentário (opcional)</div>
        <textarea
          v-model="motivo"
          class="motivo"
          rows="4"
          :maxlength="MAX"
          placeholder="Explique por que a etapa voltou. O comentário fica visível no card."
        />
        <div class="counter">{{ motivo.length }}/{{ MAX }}</div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" @click="emit('confirm', motivo.trim())">Voltar etapa</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.motivo {
  width: 100%;
  padding: 10px 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-strong);
}
.motivo:focus {
  box-shadow: var(--focus-ring);
}
.counter {
  margin-top: 4px;
  text-align: right;
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
