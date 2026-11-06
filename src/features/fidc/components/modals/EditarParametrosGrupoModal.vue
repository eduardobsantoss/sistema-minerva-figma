<script setup lang="ts">
import { ref, watch } from 'vue';
import type { GrupoEmpresarialVinculo } from '../../data/fidcsData';
import FormField from '../create-class/FormField.vue';
import StepGrid from '../create-class/StepGrid.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ grupo: GrupoEmpresarialVinculo | null }>();
const emit = defineEmits<{ close: []; save: [GrupoEmpresarialVinculo] }>();

const limite = ref('');
const juros = ref('');
const desconto = ref('');

watch(
  () => props.grupo,
  (g) => {
    if (!g) return;
    limite.value = String(g.limite);
    juros.value = g.juros != null ? String(g.juros) : '';
    desconto.value = g.desconto != null ? String(g.desconto) : '';
  },
  { immediate: true },
);

function parseNum(v: string) {
  return parseFloat(v.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

function handleSave() {
  if (!props.grupo) return;
  emit('save', {
    ...props.grupo,
    limite: parseNum(limite.value),
    juros: parseNum(juros.value),
    desconto: parseNum(desconto.value),
  });
}
</script>

<template>
  <AdminModal size="md" eyebrow="FIDC · Grupo empresarial" title="Editar Parâmetros" :subtitle="grupo?.nome" @close="emit('close')">
    <div>
      <StepGrid>
        <FormField v-model="limite" label="Limite (R$)" type="number" :span="6" />
        <FormField v-model="juros" label="Juros (% a.m.)" type="number" :span="3" />
        <FormField v-model="desconto" label="Desconto (%)" type="number" :span="3" />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" @click="handleSave" type="button">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
