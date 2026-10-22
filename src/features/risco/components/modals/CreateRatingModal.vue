<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import type { Rating } from '../../data/riscoData';

const props = defineProps<{ initial?: Rating }>();
const emit = defineEmits<{ close: []; save: [data: { nome: string; taxa: number }] }>();

const nome = ref(props.initial?.nome ?? '');
const taxa = ref(props.initial ? String(props.initial.taxa).replace('.', ',') : '');

const canSave = computed(() => nome.value.trim() !== '' && taxa.value.trim() !== '');

function handleSave() {
  if (!canSave.value) return;
  emit('save', {
    nome: nome.value.trim(),
    taxa: Number(taxa.value.replace(',', '.')) || 0,
  });
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Risco · Ratings"
    :title="initial ? 'Editar Rating' : 'Novo Rating'"
    subtitle='Usado no "Indicativo de rating do cliente" na parametrização de grupos'
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 16px">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="nome" placeholder="Ex.: A++" style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Taxa</div>
        <input v-model="taxa" placeholder="0,00%" style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canSave" @click="handleSave">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
