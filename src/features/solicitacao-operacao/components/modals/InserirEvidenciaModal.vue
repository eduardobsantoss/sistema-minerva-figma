<script setup lang="ts">
import { computed, ref } from 'vue';
import { Paperclip } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ tituloValidacao: string }>();
const emit = defineEmits<{
  close: [];
  confirm: [data: { arquivo: string; descricao: string }];
}>();

const arquivo = ref('Exemplo.pdf');
const descricao = ref('');
const canSubmit = computed(() => descricao.value.trim().length > 0 || arquivo.value.trim().length > 0);

function salvar() {
  if (!canSubmit.value) return;
  emit('confirm', {
    arquivo: arquivo.value || 'Evidencia.pdf',
    descricao: descricao.value.trim() || '—',
  });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Inserir evidência de autorização" :subtitle="`${tituloValidacao}`" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 8px;
          "
        >
          Arquivo
        </div>
        <div
          class="flex items-center"
          style="
            gap: 8px;
            height: 42px;
            padding: 0 14px;
            background: var(--surface-sunken);
            border: 1px dashed var(--border-default);
            border-radius: var(--radius-lg);
            color: var(--text-default);
            font-size: var(--text-sm);
          "
        >
          <Paperclip :size="15" style="color: var(--text-muted)" />
          {{ arquivo }}
        </div>
      </div>

      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 8px;
          "
        >
          Descrição
        </div>
        <textarea
          v-model="descricao"
          rows="4"
          maxlength="500"
          placeholder="Descreva a evidência..."
          style="
            width: 100%;
            padding: 12px 14px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            outline: none;
            font-size: var(--text-sm);
            color: var(--text-strong);
            font-family: inherit;
            resize: vertical;
          "
        />
        <div style="text-align: right; font-size: 11px; color: var(--text-muted); margin-top: 4px">
          {{ descricao.length }} / 500
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSubmit" @click="salvar" type="button">Inserir</AdminButton>
    </template>
  </AdminModal>
</template>
