import {
  resolvePreview as resolveSolicitacaoPreview,
  isModalPath,
  frameStyle,
  type PreviewConfig,
} from './solicitacaoPreviewProps';
import { resolvePreview as resolveRiscoPreview } from './riscoPreviewProps';

export type { PreviewConfig };
export { isModalPath, frameStyle };

function exampleBlock(setup: string, template: string): string {
  return `<script setup lang="ts">
${setup}
</script>

<template>
${template}
</template>`;
}

/** Preview genérico para módulos sem fixtures dedicadas. */
function resolveGeneric(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');
  const overlay = isModalPath(path);
  const props: Record<string, unknown> = {};

  // Colunas visíveis (CRA / FIDC) — precisam de tab
  if (/ColPanel\.vue$/i.test(path)) {
    props.tab = 'titulos';
  }

  return {
    props,
    frame: overlay ? 'modal' : 'wide',
    example: exampleBlock(
      `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\n${
        overlay
          ? "const open = ref(true);\n// Ajuste props conforme defineProps do SFC"
          : '// Ajuste props conforme defineProps do SFC'
      }`,
      overlay
        ? Object.keys(props).length
          ? `  <${name} v-if="open" tab="titulos" @close="open = false" />`
          : `  <${name} v-if="open" @close="open = false" />`
        : `  <${name} />`,
    ),
  };
}

export function resolvePreview(
  feature: string,
  relPath: string,
  name: string,
): PreviewConfig {
  if (feature === 'solicitacao-operacao') {
    return resolveSolicitacaoPreview(relPath, name);
  }
  if (feature === 'risco') {
    return resolveRiscoPreview(relPath, name);
  }
  return resolveGeneric(relPath, name);
}
