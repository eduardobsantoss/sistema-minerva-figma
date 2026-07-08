<script setup lang="ts">
import DocGroup from './DocGroup.vue';

defineProps<{
  docsGerais: { id: string; nome: string; obrigatorio: boolean }[];
  docsGarantia: { id: string; nome: string; obrigatorio: boolean }[];
  docFiles: Record<string, boolean>;
}>();
const emit = defineEmits<{ toggleDoc: [id: string] }>();
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <DocGroup title="Documentos gerais" :docs="docsGerais" :doc-files="docFiles" @toggle-doc="emit('toggleDoc', $event)" />
    <DocGroup
      v-if="docsGarantia.length > 0"
      title="Documentos das garantias"
      :docs="docsGarantia"
      :doc-files="docFiles"
      @toggle-doc="emit('toggleDoc', $event)"
    />
  </div>
</template>
