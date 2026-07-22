<script setup lang="ts">
import DocGroup from './DocGroup.vue';

withDefaults(
  defineProps<{
    docsGerais: { id: string; nome: string; obrigatorio: boolean }[];
    docsGarantia: { id: string; nome: string; obrigatorio: boolean }[];
    docFiles: Record<string, boolean>;
    /** Quando true, esconde o bloco de documentos das garantias */
    hideGarantiaDocs?: boolean;
    geraisTitle?: string;
  }>(),
  { hideGarantiaDocs: false, geraisTitle: 'Documentos gerais' },
);
const emit = defineEmits<{ toggleDoc: [id: string] }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <DocGroup
      :title="geraisTitle"
      :docs="docsGerais"
      :doc-files="docFiles"
      @toggle-doc="emit('toggleDoc', $event)"
    />
    <DocGroup
      v-if="!hideGarantiaDocs && docsGarantia.length > 0"
      title="Documentos das garantias"
      :docs="docsGarantia"
      :doc-files="docFiles"
      @toggle-doc="emit('toggleDoc', $event)"
    />
  </div>
</template>
