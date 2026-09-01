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

function baseExample(name: string, attrs: string, slot?: string): string {
  const template = slot
    ? `  <${name}${attrs ? ` ${attrs}` : ''}>${slot}</${name}>`
    : `  <${name}${attrs ? ` ${attrs}` : ''} />`;
  return exampleBlock(`import ${name} from './${name}.vue';`, template);
}

const sampleGrupo = cloneGrupo(GRUPOS_CADASTRO_SEED[0]!);
const sampleGarantia =
  sampleGrupo.garantias.find((g) => g.id === 'gar-3') ?? sampleGrupo.garantias[0]!;

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

  if (path.endsWith('GarantiaGrupoDetailView.vue')) {
    return {
      props: { grupo: sampleGrupo, garantia: sampleGarantia },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../data/gruposCadastroData';\nconst grupo = GRUPOS_CADASTRO_SEED[0];\nconst garantia = grupo.garantias.find((g) => g.id === 'gar-3') ?? grupo.garantias[0];`,
        `  <${name} :grupo="grupo" :garantia="garantia" />`,
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

  if (path.endsWith('CessoesPanel.vue')) {
    return {
      props: {
        cessoes: sampleGarantia.cessoes ?? [],
        cessaoVinculada: sampleGarantia.constituicao?.cessaoVinculada,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';\nconst garantia = GRUPOS_CADASTRO_SEED[0].garantias.find((g) => g.id === 'gar-3') ?? GRUPOS_CADASTRO_SEED[0].garantias[0];`,
        `  <${name} :cessoes="garantia.cessoes ?? []" :cessao-vinculada="garantia.constituicao?.cessaoVinculada" />`,
      ),
    };
  }

  if (path.endsWith('EstoqueListPanel.vue')) {
    return {
      props: { items: sampleGarantia.estoques ?? [] },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_CADASTRO_SEED } from '../../data/gruposCadastroData';\nconst garantia = GRUPOS_CADASTRO_SEED[0].garantias.find((g) => g.id === 'gar-3') ?? GRUPOS_CADASTRO_SEED[0].garantias[0];`,
        `  <${name} :items="garantia.estoques ?? []" />`,
      ),
    };
  }

  if (path.endsWith('DetailField.vue')) {
    return {
      props: { label: 'Valor da garantia' },
      frame: 'wide',
      example: baseExample(name, ' label="Valor da garantia"', 'R$ 12.000.000,00'),
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
