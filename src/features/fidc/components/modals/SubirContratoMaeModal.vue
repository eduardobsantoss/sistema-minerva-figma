<script setup lang="ts">
import { ref, watch } from 'vue';
import { Upload } from 'lucide-vue-next';
import FormField from '../create-class/FormField.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ initialDate?: string }>();
const emit = defineEmits<{
  close: [];
  save: [{ date: string; fileName: string }];
}>();

const dataFirma = ref('');
const fileName = ref('');

watch(
  () => props.initialDate,
  (d) => {
    dataFirma.value = d ?? new Date().toISOString().slice(0, 10);
  },
  { immediate: true },
);

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  fileName.value = file?.name ?? '';
}

function handleSave() {
  if (!fileName.value) return;
  emit('save', { date: dataFirma.value, fileName: fileName.value });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="FIDC" title="Subir Contrato Mãe" @close="emit('close')">
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <FormField v-model="dataFirma" label="Data firma" type="date" :span="12" />
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px">
          Contrato Mãe (PDF)
        </div>
        <label class="flex items-center" style="gap: 12px; padding: 16px; border: 2px dashed var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer">
          <Upload :size="20" style="color: var(--gci-base); flex-shrink: 0" />
          <div style="flex: 1; min-width: 0">
            <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
              {{ fileName || 'Selecionar arquivo PDF' }}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">Apenas arquivos .pdf</div>
          </div>
          <input type="file" accept=".pdf" style="display: none" @change="onFileChange" />
        </label>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" :disabled="!fileName" @click="handleSave" type="button">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>
