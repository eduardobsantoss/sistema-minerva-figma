<script setup lang="ts">
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import { etiquetaEtapa, type ComentarioDesembolso } from '../../data/desembolsoClienteData';

defineProps<{
  solicitacaoId: string;
  cedente: string;
  comentarios: ComentarioDesembolso[];
}>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <AdminModal
    size="sm"
    footer-align="end"
    eyebrow="Solicitação · Desembolso do Cliente"
    title="Comentários"
    :subtitle="`${solicitacaoId} · ${cedente}`"
    @close="emit('close')"
  >
    <p v-if="comentarios.length === 0" class="vazio">
      Nenhum comentário ainda. Ao voltar uma etapa, você pode registrar o motivo.
    </p>

    <ul v-else class="lista">
      <li v-for="item in comentarios" :key="item.id" class="item">
        <div class="item-topo">
          <span class="chip">Voltou · {{ etiquetaEtapa(item.etapa) }}</span>
          <span class="quando">{{ item.quando }}</span>
        </div>
        <p class="texto">{{ item.texto }}</p>
        <div class="autor">{{ item.autor }}</div>
      </li>
    </ul>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')">Fechar</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.vazio {
  margin: 0;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
}
.lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.item {
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
}
.item-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  padding: 3px 8px;
  border-radius: 9999px;
  background: var(--status-warning-bg);
  color: var(--status-warning-text);
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.quando {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.texto {
  margin: 8px 0 6px;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-strong);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.autor {
  font-size: 11px;
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
}
</style>
