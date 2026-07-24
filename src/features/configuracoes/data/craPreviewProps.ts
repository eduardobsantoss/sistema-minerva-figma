import { Building2, Clock, FileText, Plus } from 'lucide-vue-next';
import { cras } from '@/features/cra/data/craData';
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

const sampleCra = cras[0]!;
const sampleOperacao = sampleCra.operacoes[0]!;
const sampleTitulo = sampleOperacao.titulos[0]!;
const sampleGrupo = sampleCra.grupos[0]!;
const sampleSacado = sampleCra.sacados[0]!;
const sampleCessao = sampleCra.cessoes[0] ?? null;
const classMap = Object.fromEntries(sampleCra.operacoes.map((o, i) => [o.id, String(i + 1)]));

/** Resolve props + exemplo mínimo para a feature CRA. */
export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  // ── Screens ────────────────────────────────────────────────────────────
  if (path.endsWith('CraDetailScreen.vue')) {
    return {
      props: { cra: sampleCra },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';`,
        `  <${name} :cra="cras[0]" />`,
      ),
    };
  }
  if (path.endsWith('CraListScreen.vue')) {
    return {
      props: { cras },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';`,
        `  <${name} :cras="cras" />`,
      ),
    };
  }
  if (path.endsWith('CraOperacaoDetailScreen.vue')) {
    return {
      props: { cra: sampleCra, operacao: sampleOperacao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';\nconst cra = cras[0];\nconst operacao = cra.operacoes[0];`,
        `  <${name} :cra="cra" :operacao="operacao" />`,
      ),
    };
  }
  if (path.endsWith('CraTitleDetailScreen.vue')) {
    return {
      props: { cra: sampleCra, operacao: sampleOperacao, titulo: sampleTitulo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';\nconst cra = cras[0];\nconst operacao = cra.operacoes[0];\nconst titulo = operacao.titulos[0];`,
        `  <${name} :cra="cra" :operacao="operacao" :titulo="titulo" />`,
      ),
    };
  }
  if (path.endsWith('GrupoEmpresarialDetailScreen.vue')) {
    return {
      props: { cra: sampleCra, grupo: sampleGrupo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';\nconst cra = cras[0];\nconst grupo = cra.grupos[0];`,
        `  <${name} :cra="cra" :grupo="grupo" />`,
      ),
    };
  }
  if (path.endsWith('SacadoDetailScreen.vue')) {
    return {
      props: { cra: sampleCra, sacado: sampleSacado },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';\nconst cra = cras[0];\nconst sacado = cra.sacados[0];`,
        `  <${name} :cra="cra" :sacado="sacado" />`,
      ),
    };
  }

  // ── Cards / heroes / tables ────────────────────────────────────────────
  if (path.endsWith('CraCard.vue')) {
    return {
      props: { cra: sampleCra },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../data/craData';`,
        `  <${name} :cra="cras[0]" />`,
      ),
    };
  }
  if (path.endsWith('CraHero.vue')) {
    return {
      props: { cra: sampleCra, totalEmissao: sampleOperacao.valorEmissao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';\nconst cra = cras[0];`,
        `  <${name} :cra="cra" :total-emissao="cra.operacoes[0].valorEmissao" />`,
      ),
    };
  }
  if (path.endsWith('OperacoesTable.vue')) {
    return {
      props: { rows: sampleCra.operacoes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
        `  <${name} :rows="cras[0].operacoes" />`,
      ),
    };
  }
  if (path.endsWith('TitulosTable.vue')) {
    return {
      props: { rows: sampleOperacao.titulos, classMap },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';\nconst op = cras[0].operacoes[0];\nconst classMap = { [op.id]: '1' };`,
        `  <${name} :rows="op.titulos" :class-map="classMap" />`,
      ),
    };
  }
  if (path.endsWith('ColPanel.vue')) {
    return {
      props: { tab: 'titulos' },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" tab="titulos" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('StatusKPI.vue')) {
    return {
      props: {
        icon: Clock,
        label: 'Pendente',
        qty: 2,
        value: 'R$ 10.000',
        bg: 'var(--status-warning-bg)',
        fg: 'var(--status-warning-text)',
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { Clock } from 'lucide-vue-next';`,
        `  <${name} :icon="Clock" label="Pendente" :qty="2" value="R$ 10.000" bg="var(--status-warning-bg)" fg="var(--status-warning-text)" />`,
      ),
    };
  }

  // ── Detail tabs ────────────────────────────────────────────────────────
  if (path.endsWith('CessoesTab.vue')) {
    return {
      props: { cessoes: sampleCra.cessoes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
        `  <${name} :cessoes="cras[0].cessoes" />`,
      ),
    };
  }
  if (path.endsWith('SacadosTab.vue') && path.includes('cra-detail-tabs')) {
    return {
      props: { sacados: sampleCra.sacados },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
        `  <${name} :sacados="cras[0].sacados" />`,
      ),
    };
  }
  if (path.endsWith('GruposEmpresariaisTab.vue')) {
    return {
      props: { grupos: sampleCra.grupos },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
        `  <${name} :grupos="cras[0].grupos" />`,
      ),
    };
  }
  if (path.endsWith('SetupTab.vue')) {
    return {
      props: { setup: sampleCra.setup },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
        `  <${name} :setup="cras[0].setup" />`,
      ),
    };
  }

  // ── Grupo detail tabs ──────────────────────────────────────────────────
  if (path.includes('/grupo-detail/')) {
    if (path.endsWith('CedentesTab.vue')) {
      return {
        props: { cedentes: sampleGrupo.cedentes },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :cedentes="cras[0].grupos[0].cedentes" />`,
        ),
      };
    }
    if (path.endsWith('PartesRelacionadasTab.vue')) {
      return {
        props: { partes: sampleGrupo.partesRelacionadas },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :partes="cras[0].grupos[0].partesRelacionadas" />`,
        ),
      };
    }
    if (path.endsWith('DocumentosTab.vue')) {
      return {
        props: { documentos: sampleGrupo.documentos },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :documentos="cras[0].grupos[0].documentos" />`,
        ),
      };
    }
    if (path.endsWith('ContaBancariaTab.vue')) {
      return {
        props: { contas: sampleGrupo.contas },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :contas="cras[0].grupos[0].contas" />`,
        ),
      };
    }
    if (path.endsWith('FaturamentoTab.vue')) {
      return {
        props: { faturamentos: sampleGrupo.faturamentos },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :faturamentos="cras[0].grupos[0].faturamentos" />`,
        ),
      };
    }
    if (path.endsWith('GarantiasTab.vue')) {
      return {
        props: { garantias: sampleGrupo.garantias },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :garantias="cras[0].grupos[0].garantias" />`,
        ),
      };
    }
    if (path.endsWith('HistoricoTab.vue')) {
      return {
        props: { eventos: sampleGrupo.historico },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :eventos="cras[0].grupos[0].historico" />`,
        ),
      };
    }
  }

  // ── Sacado detail ──────────────────────────────────────────────────────
  if (path.includes('/sacado-detail/')) {
    if (path.endsWith('TitulosSubTab.vue')) {
      return {
        props: { cra: sampleCra, sacado: sampleSacado },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';\nconst cra = cras[0];`,
          `  <${name} :cra="cra" :sacado="cra.sacados[0]" />`,
        ),
      };
    }
    if (path.endsWith('DadosTab.vue') || path.endsWith('ContatosSubTab.vue') || path.endsWith('EnderecosSubTab.vue')) {
      return {
        props: { sacado: sampleSacado },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :sacado="cras[0].sacados[0]" />`,
        ),
      };
    }
    if (path.endsWith('HistoricoTab.vue')) {
      return {
        props: { eventos: sampleSacado.historico },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :eventos="cras[0].sacados[0].historico" />`,
        ),
      };
    }
  }

  // ── Title detail tabs ──────────────────────────────────────────────────
  if (path.includes('/cra-title-detail/')) {
    if (path.endsWith('DetailsTab.vue')) {
      return {
        props: { titulo: sampleTitulo, operacao: sampleOperacao },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';\nconst op = cras[0].operacoes[0];`,
          `  <${name} :titulo="op.titulos[0]" :operacao="op" />`,
        ),
      };
    }
    if (
      path.endsWith('AnexosTab.vue') ||
      path.endsWith('AccrualTab.vue') ||
      path.endsWith('ConfirmacoesTab.vue') ||
      path.endsWith('MovimentacoesTab.vue') ||
      path.endsWith('MovimentoTab.vue')
    ) {
      return {
        props: { titulo: sampleTitulo },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { cras } from '../../data/craData';`,
          `  <${name} :titulo="cras[0].operacoes[0].titulos[0]" />`,
        ),
      };
    }
    if (path.endsWith('CopyButton.vue')) {
      return {
        props: { value: sampleTitulo.numero },
        frame: 'card',
        example: baseExample(name, `value="${sampleTitulo.numero}"`),
      };
    }
    if (path.endsWith('Field.vue')) {
      return {
        props: { label: 'Cedente' },
        slotText: sampleTitulo.cedente,
        frame: 'card',
        example: baseExample(name, 'label="Cedente"', sampleTitulo.cedente),
      };
    }
    if (path.endsWith('Section.vue')) {
      return {
        props: { title: 'Dados do título' },
        slotText: 'Conteúdo',
        frame: 'card',
        example: baseExample(name, 'title="Dados do título"', 'Conteúdo'),
      };
    }
  }

  // ── Modals ─────────────────────────────────────────────────────────────
  if (path.endsWith('CessaoFormModal.vue')) {
    return {
      props: { cessao: sampleCessao },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('SubirContratoMaeModal.vue')) {
    return {
      props: { initialDate: sampleGrupo.masterContractDate ?? '' },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" @close="open = false" />`,
      ),
    };
  }

  // ── Create / card primitives ───────────────────────────────────────────
  if (path.endsWith('DonutRing.vue')) {
    return {
      props: { pct: 62.5, color: 'var(--gci-base)' },
      frame: 'card',
      example: baseExample(name, ':pct="62.5" color="var(--gci-base)"'),
    };
  }
  if (path.endsWith('DataTable.vue')) {
    return {
      props: {
        cols: [
          { key: 'tipo', label: 'Tipo', width: '1fr' },
          { key: 'limite', label: 'Limite (%)', width: '1fr' },
        ],
        rows: [
          { tipo: 'Sacado', limite: '20' },
          { tipo: 'Cedente', limite: '15' },
        ],
        empty: 'Nenhum registro.',
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nconst cols = [{ key: 'tipo', label: 'Tipo', width: '1fr' }];\nconst rows = [{ tipo: 'Sacado' }];`,
        `  <${name} :cols="cols" :rows="rows" empty="Nenhum registro." />`,
      ),
    };
  }
  if (path.endsWith('LimiteRow.vue')) {
    return {
      props: { label: 'Garantia', base: 'Emissão', pct: '10,00' },
      frame: 'wide',
      example: baseExample(name, 'label="Garantia" base="Emissão" pct="10,00"'),
    };
  }
  if (path.endsWith('SectionGroup.vue')) {
    return {
      props: { title: 'Participantes' },
      slotText: 'Conteúdo',
      frame: 'card',
      example: baseExample(name, 'title="Participantes"', 'Conteúdo'),
    };
  }
  if (path.endsWith('Participant.vue')) {
    return {
      props: {
        role: 'Cedente',
        name: sampleTitulo.cedente || 'Empresa Demo',
        cnpj: sampleTitulo.cedenteCnpj || '12.345.678/0001-90',
        icon: Building2,
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { Building2 } from 'lucide-vue-next';`,
        `  <${name} role="Cedente" name="Empresa Demo" cnpj="12.345.678/0001-90" :icon="Building2" />`,
      ),
    };
  }
  if (path.endsWith('DynamicConcentration.vue')) {
    return {
      props: {
        title: 'Concentração por sacado',
        qtdLabel: 'Tipo',
        qtdPlaceholder: 'Selecione',
        qtdOptions: ['Sacado', 'Cedente'],
        limitePlaceholder: '0,00',
        rows: [{ tipo: 'Sacado', descricao: 'Demo SA', limite: '10' }],
        form: { tipo: 'Sacado', limite: '10' },
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nconst form = { tipo: 'Sacado', limite: '10' };\nconst rows = [{ tipo: 'Sacado', descricao: 'Demo SA', limite: '10' }];`,
        `  <${name} title="Concentração" qtd-label="Tipo" qtd-placeholder="…" limite-placeholder="0,00" :rows="rows" :form="form" />`,
      ),
    };
  }
  if (path.endsWith('SimpleTable.vue')) {
    return {
      props: {
        title: 'Resumo',
        cols: ['Item', 'Valor'],
        rows: [
          ['PL', 'R$ 10.000'],
          ['Carteira', 'R$ 8.000'],
        ],
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';`,
        `  <${name} title="Resumo" :cols="['Item', 'Valor']" :rows="[['PL', 'R$ 10.000']]" />`,
      ),
    };
  }
  if (path.endsWith('EditableCell.vue')) {
    return {
      props: { value: 1250.5 },
      frame: 'card',
      example: baseExample(name, ':value="1250.5"'),
    };
  }
  if (path.endsWith('ShortKPI.vue') || path.endsWith('FooterTotal.vue') || path.endsWith('HeaderStat.vue')) {
    return {
      props: { label: 'Total', value: 'R$ 10.000,00' },
      frame: 'card',
      example: baseExample(name, 'label="Total" value="R$ 10.000,00"'),
    };
  }
  if (path.endsWith('RadioPill.vue')) {
    return {
      props: { active: true },
      slotText: 'Opção',
      frame: 'card',
      example: baseExample(name, ':active="true"', 'Opção'),
    };
  }
  if (path.endsWith('ParticipantBlock.vue')) {
    return {
      props: {
        title: 'Cedente',
        nameLabel: 'Nome',
        docLabel: 'CNPJ',
        dateLabel: 'Data',
        required: true,
      },
      frame: 'wide',
      example: baseExample(
        name,
        'title="Cedente" name-label="Nome" doc-label="CNPJ" date-label="Data" :required="true"',
      ),
    };
  }

  // ── Form primitives ────────────────────────────────────────────────────
  if (path.endsWith('FormField.vue') || path.includes('/FormField.vue')) {
    return {
      props: { label: 'Nome', modelValue: 'Demo', placeholder: 'Digite…' },
      frame: 'card',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst value = ref('Demo');`,
        `  <${name} v-model="value" label="Nome" />`,
      ),
    };
  }
  if (path.endsWith('SelectField.vue') || path.includes('/SelectField.vue')) {
    return {
      props: { label: 'Status', modelValue: '', options: ['Ativo', 'Inativo'], placeholder: 'Selecione' },
      frame: 'card',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst value = ref('');`,
        `  <${name} v-model="value" label="Status" :options="['Ativo', 'Inativo']" />`,
      ),
    };
  }
  if (path.endsWith('ToggleRow.vue')) {
    return {
      props: { label: 'Ativo', on: true },
      frame: 'card',
      example: baseExample(name, 'label="Ativo" :on="true"'),
    };
  }
  if (path.endsWith('EmptyState.vue')) {
    return {
      props: { icon: FileText, title: 'Nenhum item', hint: 'Não há registros.' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} :icon="FileText" title="Nenhum item" />`,
      ),
    };
  }
  if (path.endsWith('AddButton.vue') || path.endsWith('GhostButton.vue')) {
    return {
      props: path.endsWith('GhostButton.vue') ? { icon: Plus } : {},
      frame: 'card',
      example: baseExample(name, ''),
    };
  }
  if (
    path.endsWith('FieldLabel.vue') ||
    path.endsWith('SectionTitle.vue') ||
    path.endsWith('SectionHelp.vue')
  ) {
    return {
      slotText: 'Label',
      frame: 'card',
      example: baseExample(name, '', 'Label'),
    };
  }
  if (path.endsWith('SummaryItem.vue')) {
    return {
      props: { label: 'Total', value: 'R$ 10.000' },
      frame: 'card',
      example: baseExample(name, 'label="Total" value="R$ 10.000"'),
    };
  }
  if (path.endsWith('TabBtn.vue')) {
    return {
      props: { active: true },
      slotText: 'ABA',
      frame: 'card',
      example: baseExample(name, ':active="true"', 'ABA'),
    };
  }

  // Self-contained screens / create modals
  if (
    path.endsWith('CraScreen.vue') ||
    path.endsWith('CraRelatoriosScreen.vue') ||
    path.endsWith('CraSimuladorScreen.vue') ||
    path.endsWith('CreateCraModal.vue') ||
    path.endsWith('CreateCraOperacaoModal.vue')
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
