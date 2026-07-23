<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
    <DocGroup
      v-if="!hideGarantiaDocs && docsGarantia.length > 0"
      title="Documentos das garantias"
      :docs="docsGarantia"
      :doc-files="docFiles"
     
    />
  </div>
</template>
