<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import type { Agrupamento } from '../../data/riscoData';

const props = defineProps<{ initial?: Agrupamento }>();
const emit = defineEmits<{ close: []; save: [nome: string] }>();

const nome = ref(props.initial?.nome ?? '');
const canSave = computed(() => nome.value.trim() !== '');

function handleSave() {
  if (!canSave.value) return;
  emit('save', nome.value.trim());
}
</script>

<template>
  <AdminModal
    size="sm"
    eyebrow="Risco · Agrupamentos"
    :title="initial ? 'Renomear Agrupamento' : 'Novo Agrupamento'"
    subtitle='Usado no bloco "Agrupamentos" da parametrização de limite dos grupos'
    @close="emit('close')"
  >
    <div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
      <input v-model="nome" placeholder="Ex.: Confina" style="width: 100%; height: 40px; padding: 0 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)" />
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton size="large" :disabled="!canSave" @click="handleSave">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
