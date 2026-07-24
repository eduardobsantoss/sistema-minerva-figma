import { Building2, ChevronLeft, FileText, Plus, TrendingUp } from 'lucide-vue-next';
import { detalhePagamentos, fidcs } from '@/features/fidc/data/fidcsData';
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

/** Preferir fundo com classes/sacados preenchidos (agro25 vem vazio). */
const sampleFidc = fidcs.find((f) => f.id === 'ti-tec') ?? fidcs.find((f) => f.classes.length > 0) ?? fidcs[0]!;
const sampleKlass = sampleFidc.classes[0]!;
const sampleTitle = sampleKlass.titulos[0]!;
const sampleGrupo = sampleFidc.grupos[0]!;
const sampleSacado = sampleFidc.sacados[0]!;
const sampleCessao = sampleFidc.cessoes[0] ?? null;
const samplePagDet = detalhePagamentos(sampleTitle);
const samplePagamento = samplePagDet.pagamentos[0] ?? {
  data: '01/01/2026',
  valorAmortizacao: sampleTitle.vrNominal * 0.1,
  tipoPagamento: 'Pago pelo sacado' as const,
  jurosRemuneratorio: 0,
  jurosMoratorio: 0,
  multa: 0,
  desconto: 0,
};
const classMap = Object.fromEntries(sampleFidc.classes.map((c, i) => [c.id, String(i + 1)]));

/** Resolve props + exemplo mínimo para a feature FIDC. */
export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  // ── Screens ────────────────────────────────────────────────────────────
  if (path.endsWith('FidcDetailScreen.vue')) {
    return {
      props: { fidc: sampleFidc },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;`,
        `  <${name} :fidc="fidc" />`,
      ),
    };
  }
  if (path.endsWith('FidcListScreen.vue')) {
    return {
      props: { fidcs },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';`,
        `  <${name} :fidcs="fidcs" />`,
      ),
    };
  }
  if (path.endsWith('ClassDetailScreen.vue')) {
    return {
      props: { fidc: sampleFidc, klass: sampleKlass },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;\nconst klass = fidc.classes[0];`,
        `  <${name} :fidc="fidc" :klass="klass" />`,
      ),
    };
  }
  if (path.endsWith('TitleDetailScreen.vue')) {
    return {
      props: { fidc: sampleFidc, klass: sampleKlass, title: sampleTitle },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;\nconst klass = fidc.classes[0];\nconst title = klass.titulos[0];`,
        `  <${name} :fidc="fidc" :klass="klass" :title="title" />`,
      ),
    };
  }
  if (path.endsWith('GrupoEmpresarialDetailScreen.vue')) {
    return {
      props: { fidc: sampleFidc, grupo: sampleGrupo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;\nconst grupo = fidc.grupos[0];`,
        `  <${name} :fidc="fidc" :grupo="grupo" />`,
      ),
    };
  }
  if (path.endsWith('SacadoDetailScreen.vue')) {
    return {
      props: { fidc: sampleFidc, sacado: sampleSacado },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;\nconst sacado = fidc.sacados[0];`,
        `  <${name} :fidc="fidc" :sacado="sacado" />`,
      ),
    };
  }

  // ── Cards / heroes / tables ────────────────────────────────────────────
  if (path.endsWith('FidcCard.vue')) {
    return {
      props: { fidc: sampleFidc },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';`,
        `  <${name} :fidc="fidcs.find(f => f.id === 'ti-tec')!" />`,
      ),
    };
  }
  if (path.endsWith('PLHero.vue')) {
    return {
      props: { fidc: sampleFidc },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';`,
        `  <${name} :fidc="fidcs.find(f => f.id === 'ti-tec')!" />`,
      ),
    };
  }
  if (path.endsWith('PLAuditModal.vue')) {
    return {
      props: { fidc: sampleFidc },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';\nconst open = ref(true);`,
        `  <${name} v-if="open" :fidc="fidcs.find(f => f.id === 'ti-tec')!" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('ClassesTable.vue')) {
    return {
      props: { rows: sampleFidc.classes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
        `  <${name} :rows="fidcs.find(f => f.id === 'ti-tec')!.classes" />`,
      ),
    };
  }
  if (path.endsWith('TitlesTable.vue')) {
    return {
      props: { rows: sampleKlass.titulos, classMap },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../data/fidcsData';\nconst klass = fidcs.find(f => f.id === 'ti-tec')!.classes[0];\nconst classMap = { [klass.id]: '1' };`,
        `  <${name} :rows="klass.titulos" :class-map="classMap" />`,
      ),
    };
  }
  if (path.endsWith('FidcColPanel.vue') || (path.endsWith('ColPanel.vue') && path.includes('fidc'))) {
    return {
      props: { tab: 'titulos' },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" tab="titulos" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('ClassKPI.vue') || path.endsWith('SubKPI.vue')) {
    return {
      props: {
        icon: TrendingUp,
        label: 'Valor Nominal',
        value: 'R$ 10.000',
        tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { TrendingUp } from 'lucide-vue-next';`,
        `  <${name} :icon="TrendingUp" label="Valor Nominal" value="R$ 10.000" :tone="{ bg: 'var(--success-light)', fg: 'var(--success-base)' }" />`,
      ),
    };
  }

  // ── Detail tabs ────────────────────────────────────────────────────────
  if (path.endsWith('CessoesTab.vue')) {
    return {
      props: { cessoes: sampleFidc.cessoes },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
        `  <${name} :cessoes="fidcs.find(f => f.id === 'ti-tec')!.cessoes" />`,
      ),
    };
  }
  if (path.endsWith('SacadosTab.vue') && path.includes('fidc-detail-tabs')) {
    return {
      props: { sacados: sampleFidc.sacados },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
        `  <${name} :sacados="fidcs.find(f => f.id === 'ti-tec')!.sacados" />`,
      ),
    };
  }
  if (path.endsWith('GruposEmpresariaisTab.vue')) {
    return {
      props: { grupos: sampleFidc.grupos },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
        `  <${name} :grupos="fidcs.find(f => f.id === 'ti-tec')!.grupos" />`,
      ),
    };
  }
  if (path.endsWith('SetupTab.vue')) {
    return {
      props: { setup: sampleFidc.setup },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
        `  <${name} :setup="fidcs.find(f => f.id === 'ti-tec')!.setup" />`,
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
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :cedentes="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].cedentes" />`,
        ),
      };
    }
    if (path.endsWith('PartesRelacionadasTab.vue')) {
      return {
        props: { partes: sampleGrupo.partesRelacionadas },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :partes="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].partesRelacionadas" />`,
        ),
      };
    }
    if (path.endsWith('DocumentosTab.vue')) {
      return {
        props: { documentos: sampleGrupo.documentos },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :documentos="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].documentos" />`,
        ),
      };
    }
    if (path.endsWith('ContaBancariaTab.vue')) {
      return {
        props: { contas: sampleGrupo.contas },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :contas="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].contas" />`,
        ),
      };
    }
    if (path.endsWith('FaturamentoTab.vue')) {
      return {
        props: { faturamentos: sampleGrupo.faturamentos },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :faturamentos="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].faturamentos" />`,
        ),
      };
    }
    if (path.endsWith('GarantiasTab.vue')) {
      return {
        props: { garantias: sampleGrupo.garantias },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :garantias="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].garantias" />`,
        ),
      };
    }
    if (path.endsWith('HistoricoTab.vue')) {
      return {
        props: { eventos: sampleGrupo.historico },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :eventos="fidcs.find(f => f.id === 'ti-tec')!.grupos[0].historico" />`,
        ),
      };
    }
  }

  // ── Sacado detail ──────────────────────────────────────────────────────
  if (path.includes('/sacado-detail/')) {
    if (path.endsWith('TitulosSubTab.vue')) {
      return {
        props: { fidc: sampleFidc, sacado: sampleSacado },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';\nconst fidc = fidcs.find(f => f.id === 'ti-tec')!;`,
          `  <${name} :fidc="fidc" :sacado="fidc.sacados[0]" />`,
        ),
      };
    }
    if (path.endsWith('DadosTab.vue') || path.endsWith('ContatosSubTab.vue') || path.endsWith('EnderecosSubTab.vue')) {
      return {
        props: { sacado: sampleSacado },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :sacado="fidcs.find(f => f.id === 'ti-tec')!.sacados[0]" />`,
        ),
      };
    }
    if (path.endsWith('HistoricoTab.vue')) {
      return {
        props: { eventos: sampleSacado.historico },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :eventos="fidcs.find(f => f.id === 'ti-tec')!.sacados[0].historico" />`,
        ),
      };
    }
  }

  // ── Title detail tabs ──────────────────────────────────────────────────
  if (path.includes('/title-detail/') || path.includes('/detail-tabs/')) {
    if (path.endsWith('DetailsTab.vue')) {
      return {
        props: { title: sampleTitle, klass: sampleKlass },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';\nconst klass = fidcs.find(f => f.id === 'ti-tec')!.classes[0];`,
          `  <${name} :title="klass.titulos[0]" :klass="klass" />`,
        ),
      };
    }
    if (path.endsWith('PagamentosTab.vue')) {
      return {
        props: { title: sampleTitle, det: samplePagDet },
        frame: 'wide',
        example: exampleBlock(
          `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { fidcs, detalhePagamentos } from '../../data/fidcsData';\nconst title = fidcs.find(f => f.id === 'ti-tec')!.classes[0].titulos[0];\nconst det = ref(detalhePagamentos(title));`,
          `  <${name} :title="title" v-model:det="det" />`,
        ),
      };
    }
    if (path.endsWith('Participant.vue')) {
      return {
        props: {
          role: 'Cedente',
          name: sampleTitle.cedente || 'Empresa Demo',
          cnpj: sampleTitle.cedenteCnpj || '12.345.678/0001-90',
          icon: Building2,
        },
        frame: 'card',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { Building2 } from 'lucide-vue-next';`,
          `  <${name} role="Cedente" name="Empresa Demo" cnpj="12.345.678/0001-90" :icon="Building2" />`,
        ),
      };
    }
    if (path.endsWith('Field.vue')) {
      return {
        props: { label: 'Valor nominal' },
        slotText: 'R$ 10.000,00',
        frame: 'card',
        example: baseExample(name, 'label="Valor nominal"', 'R$ 10.000,00'),
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
    if (path.endsWith('HeaderStat.vue')) {
      return {
        props: { label: 'Total pago', value: 'R$ 1.000,00' },
        frame: 'card',
        example: baseExample(name, 'label="Total pago" value="R$ 1.000,00"'),
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
        props: { title: sampleTitle },
        frame: 'wide',
        example: exampleBlock(
          `import ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';`,
          `  <${name} :title="fidcs.find(f => f.id === 'ti-tec')!.classes[0].titulos[0]" />`,
        ),
      };
    }
    if (path.endsWith('CopyButton.vue')) {
      return {
        props: { value: sampleTitle.numero },
        frame: 'card',
        example: baseExample(name, `value="${sampleTitle.numero}"`),
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
      props: {
        initialDate: sampleGrupo.masterContractDate?.split('/').reverse().join('-') ?? '',
      },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('EditarParametrosGrupoModal.vue')) {
    return {
      props: { grupo: sampleGrupo },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { fidcs } from '../../data/fidcsData';\nconst open = ref(true);`,
        `  <${name} v-if="open" :grupo="fidcs.find(f => f.id === 'ti-tec')!.grupos[0]" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('EditarParcelasModal.vue')) {
    return {
      props: { cronograma: samplePagDet.cronograma },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { fidcs, detalhePagamentos } from '../../data/fidcsData';\nconst open = ref(true);\nconst det = detalhePagamentos(fidcs.find(f => f.id === 'ti-tec')!.classes[0].titulos[0]);`,
        `  <${name} v-if="open" :cronograma="det.cronograma" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('SimularValorizacaoModal.vue')) {
    return {
      props: { title: sampleTitle, cronograma: samplePagDet.cronograma },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { fidcs, detalhePagamentos } from '../../data/fidcsData';\nconst open = ref(true);\nconst title = fidcs.find(f => f.id === 'ti-tec')!.classes[0].titulos[0];\nconst det = detalhePagamentos(title);`,
        `  <${name} v-if="open" :title="title" :cronograma="det.cronograma" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('EstornoPagamentoModal.vue')) {
    return {
      props: { pagamento: samplePagamento },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);\nconst pagamento = { id: 'p1', data: '01/01/2026', valor: 1000, tipo: 'Amortização' };`,
        `  <${name} v-if="open" :pagamento="pagamento" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('ConfinaPromissoryModal.vue')) {
    return {
      props: { vehicleName: sampleFidc.name },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" vehicle-name="FIDC Demo" @close="open = false" />`,
      ),
    };
  }

  // ── Create-class / card / modal primitives ─────────────────────────────
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
  if (path.endsWith('PageBtn.vue')) {
    return {
      props: { icon: ChevronLeft, disabled: false },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { ChevronLeft } from 'lucide-vue-next';`,
        `  <${name} :icon="ChevronLeft" />`,
      ),
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
  if (path.endsWith('RadioPill.vue')) {
    return {
      props: { active: true },
      slotText: 'Opção',
      frame: 'card',
      example: baseExample(name, ':active="true"', 'Opção'),
    };
  }
  if (path.endsWith('LimiteRow.vue')) {
    return {
      props: { label: 'Garantia', base: 'Emissão', pct: '10,00' },
      frame: 'wide',
      example: baseExample(name, 'label="Garantia" base="Emissão" pct="10,00"'),
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

  if (
    path.endsWith('FidcScreen.vue') ||
    path.endsWith('FidcRelatoriosScreen.vue') ||
    path.endsWith('FidcSimuladorScreen.vue') ||
    path.endsWith('CreateFidcModal.vue') ||
    path.endsWith('CreateClassModal.vue')
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
