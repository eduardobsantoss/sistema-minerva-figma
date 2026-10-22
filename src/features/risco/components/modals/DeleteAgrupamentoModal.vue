<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import type { Agrupamento } from '../../data/riscoData';

const props = defineProps<{ agrupamento: Agrupamento }>();
const emit = defineEmits<{ close: []; confirm: [justificativa: string] }>();

const justificativa = ref('');
const canConfirm = computed(() => justificativa.value.trim().length > 0);

function handleConfirm() {
  if (canConfirm.value) emit('confirm', justificativa.value.trim());
}
</script>

<template>
  <AdminModal :width="460" :title="`Excluir o agrupamento ${agrupamento.nome}?`" body-tone="card" headless flush @close="emit('close')">
    <div style="padding: 28px">
      <div class="flex items-center justify-center" style="width: 52px; height: 52px; border-radius: var(--radius-full); background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px">
        <AlertTriangle :size="24" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Excluir o agrupamento "{{ agrupamento.nome }}"?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 18px">
        Esta ação é crítica e não pode ser desfeita. Grupos que consomem limite através deste agrupamento perderão essa referência.
      </p>

      <div style="margin-bottom: 24px">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--danger-base); text-transform: uppercase; margin-bottom: 6px">
          * Justificativa da exclusão
        </div>
        <textarea
          v-model="justificativa"
          placeholder="Descreva o motivo da exclusão..."
          rows="3"
          style="
            width: 100%; padding: 10px 14px; resize: vertical;
            background: var(--surface-card); border: 1px solid var(--border-default);
            border-radius: var(--radius-lg); outline: none;
            font-size: var(--text-sm); color: var(--text-strong); font-family: inherit;
          "
        />
      </div>

      <div class="flex items-center justify-end" style="gap: 10px">
        <AdminButton variant="secondary" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton variant="danger" :disabled="!canConfirm" @click="handleConfirm">Confirmar exclusão</AdminButton>
      </div>
    </div>
  </AdminModal>
</template>
