import {
  GRUPOS_CADASTRO_SEED,
  cloneGrupo,
} from '@/features/grupos-empresariais/data/gruposCadastroData';
import { isModalPath, type PreviewConfig } from './solicitacaoPreviewProps';

function exampleBlock(setup: string, template: string): string {
  return `<script setup lang="ts">
${setup}
</script>

<template>
${template}
</template>`;
}

function baseExample(name: string, attrs: string): string {
  return exampleBlock(
    `import ${name} from './${name}.vue';`,
    `  <${name}${attrs ? ` ${attrs}` : ''} />`,
  );
}

const sampleGrupo = cloneGrupo(GRUPOS_CADASTRO_SEED[0]!);

/** Resolve props + exemplo mínimo para Grupos Empresariais. */
export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  if (path.endsWith('GruposCadastroScreen.vue')) {
    return {
      props: {},
      frame: 'wide',
      example: baseExample(name, ''),
    };
  }

  if (path.endsWith('GruposCadastroListScreen.vue')) {
    return {
      props: { grupos: GRUPOS_CADASTRO_SEED.map(cloneGrupo) },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../data/gruposCadastroData';`,
        `  <${name} :grupos="GRUPOS_CADASTRO_SEED" />`,
      ),
    };
  }

  if (path.endsWith('GrupoCadastroView.vue')) {
    return {
      props: { grupo: sampleGrupo, mode: 'detail' },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../data/gruposCadastroData';`,
        `  <${name} :grupo="GRUPOS_CADASTRO_SEED[0]" mode="detail" />`,
      ),
    };
  }

  if (path.endsWith('PartesRelacionadasTab.vue')) {
    return {
      props: { partes: sampleGrupo.partes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../data/gruposCadastroData';`,
        `  <${name} :partes="GRUPOS_CADASTRO_SEED[0].partes" />`,
      ),
    };
  }

  if (path.endsWith('DocumentosTab.vue')) {
    return {
      props: { documentos: sampleGrupo.documentos },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';`,
        `  <${name} :documentos="GRUPOS_CADASTRO_SEED[0].documentos" />`,
      ),
    };
  }

  if (path.endsWith('ContasBancariasTab.vue')) {
    return {
      props: { contas: sampleGrupo.contas },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';`,
        `  <${name} :contas="GRUPOS_CADASTRO_SEED[0].contas" />`,
      ),
    };
  }

  if (path.endsWith('FaturamentoTab.vue')) {
    return {
      props: { faturamentos: sampleGrupo.faturamentos },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';`,
        `  <${name} :faturamentos="GRUPOS_CADASTRO_SEED[0].faturamentos" />`,
      ),
    };
  }

  if (path.endsWith('NotificacoesTab.vue')) {
    return {
      props: { fundos: sampleGrupo.fundosNotificacao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';`,
        `  <${name} :fundos="GRUPOS_CADASTRO_SEED[0].fundosNotificacao" />`,
      ),
    };
  }

  if (path.endsWith('GarantiasTab.vue')) {
    return {
      props: { garantias: sampleGrupo.garantias },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';`,
        `  <${name} :garantias="GRUPOS_CADASTRO_SEED[0].garantias" />`,
      ),
    };
  }

  if (isModalPath(path)) {
    return {
      props: {},
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" @close="open = false" />`,
      ),
    };
  }

  return {
    props: {},
    frame: 'wide',
    example: exampleBlock(
      `import ${name} from './${name}.vue';`,
      `  <${name} />`,
    ),
  };
}
