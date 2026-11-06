<script setup lang="ts">
import { computed, ref } from 'vue';

import XmlDropzone from '@/features/solicitacao-operacao/components/modals/XmlDropzone.vue';
import { LAMINA_UPLOAD_KINDS, type LaminaUploadKind } from '../../data/passivoNovoData';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{
  close: [];
  confirm: [payload: { kind: LaminaUploadKind; fileName: string }];
}>();

const kind = ref<LaminaUploadKind>('cota-subordinada');
const fileName = ref('');

const canSave = computed(() => Boolean(kind.value && fileName.value));

function onFiles(files: File[]) {
  fileName.value = files[0]?.name ?? '';
}

function submit() {
  if (!canSave.value) return;
  emit('confirm', { kind: kind.value, fileName: fileName.value });
}

const fieldStyle =
  'width: 100%; height: 40px; padding: 0 12px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)';
</script>

<template>
  <Teleport to="body">
  <AdminModal size="sm" eyebrow="Passivo" title="Subir arquivo" @close="emit('close')">
    <div class="flex flex-col" style="gap: 16px">
      <label class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Tipo do arquivo</span>
        <AdminSelect v-model="kind" :options="[...LAMINA_UPLOAD_KINDS.map((k) => ({ value: k.id, label: k.label }))]" />
      </label>
      <div class="flex flex-col" style="gap: 6px">
        <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-muted)">Arquivo</span>
        <XmlDropzone
          :multiple="false"
          :extensions="['*']"
          heading="Solte o arquivo aqui"
          hint="Planilha da cota ou da caixa"
          @files="onFiles"
        />
        <div
          v-if="fileName"
          style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        >
          {{ fileName }}
        </div>
      </div>
      <p style="font-size: var(--text-xs); color: var(--text-muted)">
        O tipo descreve o conteúdo (cota ou caixa), não a extensão. Protótipo: preenche os dados sem ler a planilha.
      </p>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSave" @click="submit" type="button">Preencher dados</AdminButton>
    </template>
  </AdminModal>
  </Teleport>
</template>
