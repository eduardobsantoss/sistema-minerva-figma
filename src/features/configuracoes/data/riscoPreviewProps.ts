import { ChevronRight, FileText, History, Users } from 'lucide-vue-next';
import {
  AGRUPAMENTOS_SEED,
  GRUPOS_SEED,
  OPERACOES_VINCULAVEIS_SEED,
  RATINGS_SEED,
  detalheGrupo,
} from '@/features/risco/data/riscoData';
import { veiculosFromVinculos } from '@/features/risco/data/vinculosStore';
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
  const setup = `import ${name} from './${name}.vue';`;
  const template = slot
    ? `  <${name}${attrs ? ` ${attrs}` : ''}>${slot}</${name}>`
    : `  <${name}${attrs ? ` ${attrs}` : ''} />`;
  return exampleBlock(setup, template);
}

const sampleGrupo = GRUPOS_SEED[0];
const sampleDet = detalheGrupo(sampleGrupo);
sampleDet.parametrizacoes.autoatendimento.veiculosOperacao = veiculosFromVinculos(sampleGrupo.id);

const sampleCedente = sampleDet.cedentes[0]!;
const sampleGarantia = sampleDet.parametrizacoes.garantia.garantias[0]!;
const sampleLimite = sampleDet.parametrizacoes.limite.limites[0]!;

const sampleAgrupamento = AGRUPAMENTOS_SEED[0];
const sampleOperacao = OPERACOES_VINCULAVEIS_SEED[0];
const entidadesGrupo = GRUPOS_SEED.map(({ id, nome }) => ({ id, nome }));

/** Resolve props + exemplo mínimo para a feature Risco. */
export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  if (path.endsWith('GrupoDetailScreen.vue')) {
    return {
      props: { grupo: sampleGrupo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED } from '../data/riscoData';`,
        `  <${name} :grupo="GRUPOS_SEED[0]" />`,
      ),
    };
  }

  if (path.endsWith('AutoatendimentoSubTab.vue')) {
    return {
      props: {
        data: sampleDet.parametrizacoes.autoatendimento,
        grupoId: sampleGrupo.id,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst g = GRUPOS_SEED[0];\nconst data = detalheGrupo(g).parametrizacoes.autoatendimento;`,
        `  <${name} :data="data" :grupo-id="g.id" />`,
      ),
    };
  }

  if (path.endsWith('ParametrizacoesTab.vue')) {
    return {
      props: {
        data: sampleDet.parametrizacoes,
        partesRelacionadas: sampleDet.partesRelacionadas,
        grupoId: sampleGrupo.id,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst g = GRUPOS_SEED[0];\nconst det = detalheGrupo(g);`,
        `  <${name} :data="det.parametrizacoes" :partes-relacionadas="det.partesRelacionadas" :grupo-id="g.id" />`,
      ),
    };
  }

  if (path.endsWith('DetalhesTab.vue')) {
    return {
      props: {
        grupo: sampleGrupo,
        partesRelacionadas: sampleDet.partesRelacionadas,
        limite: sampleDet.parametrizacoes.limite,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst g = GRUPOS_SEED[0];\nconst det = detalheGrupo(g);`,
        `  <${name} :grupo="g" :partes-relacionadas="det.partesRelacionadas" :limite="det.parametrizacoes.limite" />`,
      ),
    };
  }

  if (path.endsWith('CedentesTab.vue')) {
    return {
      props: { cedentes: sampleDet.cedentes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst cedentes = detalheGrupo(GRUPOS_SEED[0]).cedentes;`,
        `  <${name} :cedentes="cedentes" />`,
      ),
    };
  }

  if (path.endsWith('HistoricoTab.vue')) {
    return {
      props: { eventos: sampleDet.historico },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst eventos = detalheGrupo(GRUPOS_SEED[0]).historico;`,
        `  <${name} :eventos="eventos" />`,
      ),
    };
  }

  if (path.endsWith('LimiteSubTab.vue')) {
    return {
      props: { data: sampleDet.parametrizacoes.limite },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst data = detalheGrupo(GRUPOS_SEED[0]).parametrizacoes.limite;`,
        `  <${name} :data="data" />`,
      ),
    };
  }

  if (path.endsWith('GeralSubTab.vue')) {
    return {
      props: {
        data: sampleDet.parametrizacoes.geral,
        partesRelacionadas: sampleDet.partesRelacionadas,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst det = detalheGrupo(GRUPOS_SEED[0]);`,
        `  <${name} :data="det.parametrizacoes.geral" :partes-relacionadas="det.partesRelacionadas" />`,
      ),
    };
  }

  if (path.endsWith('GarantiaSubTab.vue')) {
    return {
      props: { data: sampleDet.parametrizacoes.garantia },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst data = detalheGrupo(GRUPOS_SEED[0]).parametrizacoes.garantia;`,
        `  <${name} :data="data" />`,
      ),
    };
  }

  // ── Shared ────────────────────────────────────────────────────────────
  if (path.endsWith('shared/CopyButton.vue')) {
    return {
      props: { value: sampleGrupo.documento },
      frame: 'card',
      example: baseExample(name, `value="${sampleGrupo.documento}"`),
    };
  }
  if (path.endsWith('shared/DiasInput.vue')) {
    return {
      props: { label: 'Prazo', value: 30 },
      frame: 'card',
      example: baseExample(name, 'label="Prazo" :value="30"'),
    };
  }
  if (path.endsWith('shared/EmptyState.vue')) {
    return {
      props: { icon: History, title: 'Nenhum item', hint: 'Não há registros para exibir.' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { History } from 'lucide-vue-next';`,
        `  <${name} :icon="History" title="Nenhum item" hint="Não há registros para exibir." />`,
      ),
    };
  }
  if (path.endsWith('shared/FormField.vue')) {
    return {
      props: { label: 'Grupo empresarial' },
      slotText: sampleGrupo.nome,
      frame: 'card',
      example: baseExample(name, 'label="Grupo empresarial"', sampleGrupo.nome),
    };
  }
  if (path.endsWith('shared/PctInput.vue')) {
    return {
      props: { label: 'Taxa', value: 1.5 },
      frame: 'card',
      example: baseExample(name, 'label="Taxa" :value="1.5"'),
    };
  }
  if (path.endsWith('shared/Section.vue')) {
    return {
      props: { title: 'Dados do grupo' },
      slotText: 'Conteúdo',
      frame: 'card',
      example: baseExample(name, 'title="Dados do grupo"', 'Conteúdo'),
    };
  }
  if (path.endsWith('shared/SelectField.vue')) {
    return {
      props: {
        label: 'Rating',
        options: RATINGS_SEED.map((r) => r.nome),
        value: sampleGrupo.rating,
        placeholder: 'Selecione',
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';`,
        `  <${name} label="Rating" :options="['A', 'A-', 'B']" value="A" />`,
      ),
    };
  }
  if (path.endsWith('shared/TabCard.vue')) {
    return {
      props: { title: 'Autoatendimento', icon: FileText, hasSave: true },
      slotText: 'Conteúdo',
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} title="Autoatendimento" :icon="FileText" :has-save="true">Conteúdo</${name}>`,
      ),
    };
  }
  if (path.endsWith('shared/ToggleRow.vue')) {
    return {
      props: { label: 'Ativo', on: true },
      frame: 'card',
      example: baseExample(name, 'label="Ativo" :on="true"'),
    };
  }
  if (path.endsWith('shared/FieldLabel.vue')) {
    return {
      slotText: 'Campo',
      frame: 'card',
      example: baseExample(name, '', 'Campo'),
    };
  }
  if (path.endsWith('shared/AddButton.vue')) {
    return { props: {}, frame: 'card', example: baseExample(name, '') };
  }

  // ── Modals ────────────────────────────────────────────────────────────
  if (
    path.endsWith('CedenteDetailModal.vue') ||
    path.endsWith('EditarCadastroCedenteModal.vue') ||
    path.endsWith('ContatosPanel.vue') ||
    path.endsWith('EnderecosPanel.vue') ||
    path.endsWith('DocumentosPanel.vue')
  ) {
    return {
      props: { cedente: sampleCedente },
      frame: path.includes('Panel') ? 'wide' : 'modal',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, detalheGrupo } from '../../data/riscoData';\nconst cedente = detalheGrupo(GRUPOS_SEED[0]).cedentes[0];`,
        path.includes('Panel')
          ? `  <${name} :cedente="cedente" />`
          : `  <${name} :cedente="cedente" @close="() => {}" />`,
      ),
    };
  }

  if (path.endsWith('DeleteAgrupamentoModal.vue')) {
    return {
      props: { agrupamento: sampleAgrupamento },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { AGRUPAMENTOS_SEED } from '../../data/riscoData';\nconst open = ref(true);`,
        `  <${name} v-if="open" :agrupamento="AGRUPAMENTOS_SEED[0]" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('ConfigurarNotificacoesModal.vue') || path.endsWith('HabilitarOperarModal.vue')) {
    return {
      props: { grupoNome: sampleGrupo.nome },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" grupo-nome="${sampleGrupo.nome}" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('TransferirGerenteModal.vue')) {
    return {
      props: { grupoNome: sampleGrupo.nome, gerenteAtual: sampleGrupo.gerente },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" grupo-nome="${sampleGrupo.nome}" gerente-atual="${sampleGrupo.gerente}" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('EditarGarantiaModal.vue')) {
    return {
      props: { garantia: sampleGarantia },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);\nconst garantia = { id: 'g1', tipo: 'AF Imóvel', descricao: 'Demo', valor: 100000, vencimento: '31/12/2026' };`,
        `  <${name} v-if="open" :garantia="garantia" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('EditarLimiteModal.vue')) {
    return {
      props: {
        agrupamento: sampleLimite.agrupamento,
        produto: sampleLimite.produto,
        valor: sampleLimite.valor,
        vencimento: sampleLimite.vencimento,
      },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" agrupamento="Operações Multicedente" produto="Desconto Duplicata" :valor="100000" vencimento="31/12/2026" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('VincularAgrupamentoModal.vue')) {
    return {
      props: {
        target: { id: sampleGrupo.id, nome: sampleGrupo.nome },
        targetLabel: 'Grupo',
        linkKey: 'grupoIds',
        operacoes: OPERACOES_VINCULAVEIS_SEED,
      },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { GRUPOS_SEED, OPERACOES_VINCULAVEIS_SEED } from '../../data/riscoData';\nconst open = ref(true);\nconst g = GRUPOS_SEED[0];`,
        `  <${name} v-if="open" :target="{ id: g.id, nome: g.nome }" target-label="Grupo" link-key="grupoIds" :operacoes="OPERACOES_VINCULAVEIS_SEED" @close="open = false" />`,
      ),
    };
  }

  if (path.endsWith('OperationRow.vue')) {
    return {
      props: {
        op: sampleOperacao,
        entidades: entidadesGrupo,
        entityLabel: 'Grupo',
        linkKey: 'grupoIds',
        checked: true,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { GRUPOS_SEED, OPERACOES_VINCULAVEIS_SEED } from '../../../data/riscoData';`,
        `  <${name} :op="OPERACOES_VINCULAVEIS_SEED[0]" :entidades="GRUPOS_SEED.map(g => ({ id: g.id, nome: g.nome }))" entity-label="Grupo" link-key="grupoIds" :checked="true" />`,
      ),
    };
  }

  if (path.endsWith('TransferPanel.vue')) {
    return {
      props: {
        title: 'Disponíveis',
        search: '',
        filter: 'TODOS',
        items: OPERACOES_VINCULAVEIS_SEED.slice(0, 4),
        entidades: entidadesGrupo,
        entityLabel: 'Grupo',
        linkKey: 'grupoIds',
        selected: new Set<string>(),
      },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { GRUPOS_SEED, OPERACOES_VINCULAVEIS_SEED } from '../../../data/riscoData';\nconst search = ref('');\nconst selected = ref(new Set());`,
        `  <${name} title="Disponíveis" v-model:search="search" filter="TODOS" :items="OPERACOES_VINCULAVEIS_SEED" :entidades="GRUPOS_SEED.map(g => ({ id: g.id, nome: g.nome }))" entity-label="Grupo" link-key="grupoIds" :selected="selected" />`,
      ),
    };
  }

  if (path.endsWith('SummaryCard.vue')) {
    return {
      props: { label: 'Selecionados', value: 3, strong: true },
      frame: 'card',
      example: baseExample(name, 'label="Selecionados" :value="3" :strong="true"'),
    };
  }

  if (path.endsWith('TransferButton.vue')) {
    return {
      props: { icon: ChevronRight, label: 'Vincular', active: true },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { ChevronRight } from 'lucide-vue-next';`,
        `  <${name} :icon="ChevronRight" label="Vincular" :active="true" />`,
      ),
    };
  }

  if (path.endsWith('KpiCard.vue')) {
    return {
      props: { icon: Users, label: 'Cedentes', value: '12' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { Users } from 'lucide-vue-next';`,
        `  <${name} :icon="Users" label="Cedentes" value="12" />`,
      ),
    };
  }

  // Telas self-contained / modais com props opcionais
  if (
    path.endsWith('AgrupamentosScreen.vue') ||
    path.endsWith('GruposListScreen.vue') ||
    path.endsWith('GruposScreen.vue') ||
    path.endsWith('RatingsScreen.vue') ||
    path.endsWith('RelatoriosScreen.vue') ||
    path.endsWith('RiscoDashboardScreen.vue') ||
    path.endsWith('IncluirLimiteModal.vue') ||
    path.endsWith('CreateAgrupamentoModal.vue') ||
    path.endsWith('CreateRatingModal.vue')
  ) {
    return {
      props: {},
      frame: isModalPath(path) ? 'modal' : 'wide',
      example: isModalPath(path)
        ? exampleBlock(
            `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
            `  <${name} v-if="open" @close="open = false" />`,
          )
        : baseExample(name, ''),
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
      `import ${name} from './${name}.vue';\n// Preencha as props obrigatórias do defineProps deste SFC`,
      `  <${name} />`,
    ),
  };
}
