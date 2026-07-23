import { FileText, Plus, User } from 'lucide-vue-next';
import {
  detalheSolicitacao,
  solicitacoes,
} from '@/features/solicitacao-operacao/data/operacaoData';
import { seedAtivos } from '@/features/solicitacao-operacao/data/ativoData';
import type { NewPedidoData } from '@/features/solicitacao-operacao/components/novo-pedido/types';
import { IDENTIFICACAO_FIELDS } from '@/features/solicitacao-operacao/data/parteRelacionadaFields';

export type PreviewConfig = {
  props?: Record<string, unknown>;
  slotText?: string;
  frame?: 'plain' | 'card' | 'wide' | 'modal';
  example: string;
};

export function isModalPath(relPath: string): boolean {
  const p = relPath.replace(/\\/g, '/');
  return /Modal\.vue$/i.test(p) || p.includes('NovoPedidoModal');
}

/** Preferir solicitação que já tem ativos no seed (#1383 não tem). */
const sampleSolicitacao =
  solicitacoes.find((s) => seedAtivos(s.id).length > 0) ??
  solicitacoes.find((s) => s.id === '#1384') ??
  solicitacoes[1];
const sampleDet = detalheSolicitacao(sampleSolicitacao);
const sampleAtivo =
  sampleDet.ativos[0] ??
  seedAtivos('#1384')[0] ??
  seedAtivos('#1386')[0]!;

if (!sampleDet.ativos.length && sampleAtivo) {
  sampleDet.ativos = [sampleAtivo];
}

const sampleParte = sampleDet.partes[0];
const sampleValidacao = sampleDet.validacoes[0];
const sampleGarantia = sampleDet.garantias[0] ?? {
  id: 'g-demo',
  tipo: 'Imóvel',
  nome: 'Cessão fiduciária',
  valor: 'R$ 100.000,00',
  anexos: [],
};

const emptyFilters = {
  idPedido: '',
  veiculo: '',
  tipoPedido: '',
  dataAbertura: '',
  grupoEmpresarial: '',
  gerenteComercial: '',
  requerente: '',
  usuarioAtendimento: '',
};

const samplePedidoForm: NewPedidoData = {
  tipoOperacao: 'Desconto Duplicata',
  esteira: 'COMERCIAL',
  tipoContrato: 'CCB',
  unidadeNegocio: 'Agro',
  gerenteComercial: 'Ana Silva',
  fundo: 'FIDC Alpha',
  grupoEmpresarial: 'Agro Norte',
  contaBancaria: 'Banco do Brasil · 1234-5',
  tipoTaxa: 'Pré-fixado',
  taxaOperacao: '1,85',
  indicePos: '',
  operadorPos: '',
  valorTaxaPos: '',
  fee: '0,50',
  valorOperacao: '1250000',
  quitacaoVencidos: false,
  requerGarantia: true,
};

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

/** Resolve props + exemplo mínimo para cada path da feature. */
export function resolvePreview(relPath: string, name: string): PreviewConfig {
  const path = relPath.replace(/\\/g, '/');

  if (path.endsWith('shared/Field.vue')) {
    return {
      props: { label: 'Grupo empresarial' },
      slotText: 'Agro Norte Holding',
      frame: 'card',
      example: baseExample(name, 'label="Grupo empresarial"', 'Agro Norte Holding'),
    };
  }
  if (path.endsWith('shared/Section.vue')) {
    return {
      props: { title: 'Dados da operação' },
      slotText: 'Conteúdo da seção',
      frame: 'card',
      example: baseExample(name, 'title="Dados da operação"', 'Conteúdo da seção'),
    };
  }
  if (path.endsWith('shared/Card.vue')) {
    return {
      props: { title: 'Resumo', icon: FileText },
      slotText: 'Conteúdo do card',
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} title="Resumo" :icon="FileText">Conteúdo do card</${name}>`,
      ),
    };
  }
  if (path.endsWith('shared/EmptyState.vue')) {
    return {
      props: { icon: FileText, title: 'Nenhum item', hint: 'Não há registros para exibir.' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} :icon="FileText" title="Nenhum item" hint="Não há registros para exibir." />`,
      ),
    };
  }
  if (path.endsWith('shared/GhostButton.vue')) {
    return {
      props: { icon: Plus },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { Plus } from 'lucide-vue-next';`,
        `  <${name} :icon="Plus" />`,
      ),
    };
  }
  if (path.endsWith('shared/CopyButton.vue')) {
    return {
      props: { value: '12.345.678/0001-90' },
      frame: 'card',
      example: baseExample(name, 'value="12.345.678/0001-90"'),
    };
  }

  if (path.endsWith('SolicitacaoCard.vue')) {
    return {
      props: { solicitacao: sampleSolicitacao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes } from '../data/operacaoData';\nconst solicitacao = solicitacoes[0];`,
        `  <${name} :solicitacao="solicitacao" />`,
      ),
    };
  }
  if (path.endsWith('FilterSelect.vue')) {
    return {
      props: { placeholder: 'Veículo', modelValue: '', options: ['FIDC Alpha', 'CRA Beta'] },
      frame: 'card',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst value = ref('');`,
        `  <${name} v-model="value" placeholder="Veículo" :options="['FIDC Alpha', 'CRA Beta']" />`,
      ),
    };
  }
  if (path.endsWith('SolicitacaoFiltersPanel.vue')) {
    return {
      props: {
        modelValue: emptyFilters,
        veiculos: ['FIDC Alpha', 'CRA Beta'],
        tiposPedido: ['Desconto Duplicata', 'CPR'],
        grupos: ['Agro Norte'],
        gerentes: ['Ana Silva'],
        requerentes: ['João'],
        atendentes: ['Maria'],
      },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst filters = ref({ idPedido: '', veiculo: '', tipoPedido: '', dataAbertura: '', grupoEmpresarial: '', gerenteComercial: '', requerente: '', usuarioAtendimento: '' });`,
        `  <${name}
    v-model="filters"
    :veiculos="['FIDC Alpha']"
    :tipos-pedido="['Desconto Duplicata']"
    :grupos="['Agro Norte']"
    :gerentes="['Ana Silva']"
    :requerentes="['João']"
    :atendentes="['Maria']"
  />`,
      ),
    };
  }
  if (path.endsWith('SolicitacaoTable.vue') || path.endsWith('SolicitacaoKanban.vue')) {
    return {
      props: { solicitacoes: solicitacoes.slice(0, 4) },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes } from '../data/operacaoData';`,
        `  <${name} :solicitacoes="solicitacoes.slice(0, 4)" />`,
      ),
    };
  }
  if (path.endsWith('SolicitacaoScreen.vue')) {
    return { props: {}, frame: 'wide', example: baseExample(name, '') };
  }
  if (path.endsWith('SolicitacaoDetailScreen.vue')) {
    return {
      props: { solicitacao: sampleSolicitacao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes } from '../data/operacaoData';`,
        `  <${name} :solicitacao="solicitacoes[0]" />`,
      ),
    };
  }
  if (path.endsWith('RejectModal.vue')) {
    return {
      props: { id: String(sampleSolicitacao.id) },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" id="${sampleSolicitacao.id}" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('ActionMenu.vue')) {
    return { props: {}, frame: 'card', example: baseExample(name, '') };
  }

  if (path.endsWith('DadosGeraisTab.vue')) {
    return {
      props: { s: sampleSolicitacao, det: sampleDet },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../data/operacaoData';\nconst s = solicitacoes[0];\nconst det = detalheSolicitacao(s);`,
        `  <${name} :s="s" :det="det" />`,
      ),
    };
  }
  if (
    path.endsWith('AtivosTab.vue') ||
    path.endsWith('GarantiasTab.vue') ||
    path.endsWith('AnexosTab.vue') ||
    path.endsWith('HistoricoTab.vue') ||
    path.endsWith('ValidacoesTab.vue')
  ) {
    return {
      props: { det: sampleDet },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../data/operacaoData';\nconst det = detalheSolicitacao(solicitacoes[0]);`,
        `  <${name} :det="det" />`,
      ),
    };
  }
  if (path.endsWith('ValidacoesFullView.vue')) {
    return {
      props: { det: sampleDet, solicitacaoId: sampleSolicitacao.id },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst s = solicitacoes[0];\nconst det = detalheSolicitacao(s);`,
        `  <${name} :det="det" :solicitacao-id="s.id" />`,
      ),
    };
  }
  if (path.endsWith('ValidacaoRow.vue')) {
    return {
      props: { v: sampleValidacao },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst v = detalheSolicitacao(solicitacoes[0]).validacoes[0];`,
        `  <${name} :v="v" />`,
      ),
    };
  }
  if (path.endsWith('AtaTab.vue')) {
    return { props: {}, frame: 'wide', example: baseExample(name, '') };
  }
  if (path.endsWith('AtivosTable.vue')) {
    return {
      props: { ativos: sampleDet.ativos, selectedIds: new Set<string>() },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst ativos = detalheSolicitacao(solicitacoes[0]).ativos;\nconst selectedIds = ref(new Set());`,
        `  <${name} :ativos="ativos" :selected-ids="selectedIds" />`,
      ),
    };
  }

  if (path.endsWith('AtivoDetailView.vue')) {
    return {
      props: { ativo: sampleAtivo, solicitacaoId: sampleSolicitacao.id },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst s = solicitacoes.find(x => x.id === '${sampleSolicitacao.id}')!;\nconst ativo = detalheSolicitacao(s).ativos[0];`,
        `  <${name} :ativo="ativo" :solicitacao-id="s.id" />`,
      ),
    };
  }
  if (path.endsWith('PessoaDetailTabs.vue') || path.endsWith('DadosSubTab.vue')) {
    return {
      props: {
        pessoa: sampleAtivo.cedente,
        titulo: 'Cedente',
        historico: sampleAtivo.historicoTitulo,
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst pessoa = detalheSolicitacao(solicitacoes.find(x => x.id === '${sampleSolicitacao.id}')!).ativos[0].cedente;`,
        `  <${name} :pessoa="pessoa" titulo="Cedente" />`,
      ),
    };
  }
  if (path.endsWith('ContatosSubTab.vue') || path.endsWith('EnderecosSubTab.vue')) {
    return {
      props: { pessoa: sampleAtivo.cedente },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst pessoa = detalheSolicitacao(solicitacoes[0]).ativos[0].cedente;`,
        `  <${name} :pessoa="pessoa" />`,
      ),
    };
  }
  if (path.endsWith('HistoricoSubTab.vue')) {
    return {
      props: { historico: sampleAtivo.historicoTitulo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst historico = detalheSolicitacao(solicitacoes[0]).ativos[0].historicoTitulo;`,
        `  <${name} :historico="historico" />`,
      ),
    };
  }
  if (
    path.endsWith('TituloTab.vue') ||
    path.endsWith('DetalhesTituloTab.vue') ||
    path.endsWith('PagamentosTituloTab.vue') ||
    path.endsWith('ConfirmacoesTituloTab.vue') ||
    path.endsWith('MovimentacoesTituloTab.vue') ||
    path.endsWith('AnexosTituloTab.vue') ||
    path.endsWith('ObservacoesCobrancaTab.vue')
  ) {
    return {
      props: { ativo: sampleAtivo },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst ativo = detalheSolicitacao(solicitacoes[0]).ativos[0];`,
        `  <${name} :ativo="ativo" />`,
      ),
    };
  }
  if (path.endsWith('Participant.vue')) {
    return {
      props: {
        role: 'Cedente',
        name: sampleAtivo.cedenteNome,
        cnpj: sampleAtivo.cedenteDocumento,
        icon: User,
      },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { User } from 'lucide-vue-next';`,
        `  <${name} role="Cedente" name="Empresa Demo" cnpj="12.345.678/0001-90" :icon="User" />`,
      ),
    };
  }
  if (path.endsWith('DynamicPagamentoFormGrid.vue')) {
    return {
      props: { fields: [], cols: 3 },
      frame: 'wide',
      example: baseExample(name, ':fields="[]" :cols="3"'),
    };
  }
  if (path.endsWith('DynamicConfigGrid.vue')) {
    return {
      props: { fields: [], data: {}, cols: 3 },
      frame: 'wide',
      example: baseExample(name, ':fields="[]" :data="{}" :cols="3"'),
    };
  }
  if (path.endsWith('ParteRelacionadaDetailView.vue')) {
    return {
      props: { parte: sampleParte, solicitacaoId: sampleSolicitacao.id },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst s = solicitacoes[0];\nconst parte = detalheSolicitacao(s).partes[0];`,
        `  <${name} :parte="parte" :solicitacao-id="s.id" />`,
      ),
    };
  }
  if (path.endsWith('DynamicFieldGrid.vue')) {
    return {
      props: { parte: sampleParte, fields: IDENTIFICACAO_FIELDS, cols: 3 },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nimport { IDENTIFICACAO_FIELDS } from '../../../data/parteRelacionadaFields';\nconst parte = detalheSolicitacao(solicitacoes[0]).partes[0];`,
        `  <${name} :parte="parte" :fields="IDENTIFICACAO_FIELDS" :cols="3" />`,
      ),
    };
  }

  if (path.includes('/FormField.vue')) {
    return {
      props: { label: 'Grupo empresarial', placeholder: 'Digite…', modelValue: 'Agro Norte' },
      frame: 'card',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst value = ref('Agro Norte');`,
        `  <${name} v-model="value" label="Grupo empresarial" placeholder="Digite…" />`,
      ),
    };
  }
  if (path.includes('/SelectField.vue')) {
    return {
      props: {
        label: 'Status',
        modelValue: '',
        options: ['Ativo', 'Inativo'],
        placeholder: 'Selecione',
      },
      frame: 'card',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst value = ref('');`,
        `  <${name} v-model="value" label="Status" :options="['Ativo', 'Inativo']" placeholder="Selecione" />`,
      ),
    };
  }
  if (path.includes('/FieldLabel.vue')) {
    return {
      slotText: 'Taxa da operação',
      frame: 'card',
      example: baseExample(name, '', 'Taxa da operação'),
    };
  }
  if (path.includes('/ToggleRow.vue')) {
    return {
      props: { label: 'Quitação de vencidos', on: true },
      frame: 'card',
      example: baseExample(name, 'label="Quitação de vencidos" :on="true"'),
    };
  }
  if (path.includes('/Switch.vue') && path.includes('novo-pedido')) {
    return {
      props: { on: true },
      frame: 'card',
      example: baseExample(name, ':on="true"'),
    };
  }
  if (path.includes('/AddButton.vue')) {
    return { props: {}, frame: 'card', example: baseExample(name, '') };
  }
  if (path.includes('/IconAction.vue')) {
    return {
      props: { icon: Plus, label: 'Adicionar' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { Plus } from 'lucide-vue-next';`,
        `  <${name} :icon="Plus" label="Adicionar" />`,
      ),
    };
  }
  if (path.includes('/SectionGroup.vue')) {
    return {
      props: { title: 'Documentos', icon: FileText },
      slotText: 'Itens do grupo',
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} title="Documentos" :icon="FileText">Itens</${name}>`,
      ),
    };
  }
  if (path.includes('/BentoBox.vue')) {
    return {
      props: { title: 'Bloco' },
      slotText: 'Conteúdo',
      frame: 'card',
      example: baseExample(name, 'title="Bloco"', 'Conteúdo'),
    };
  }
  if (path.includes('/BentoGrid.vue')) {
    return {
      props: { cols: 2 },
      slotText: 'Colunas',
      frame: 'wide',
      example: baseExample(name, ':cols="2"', 'Colunas'),
    };
  }
  if (path.includes('/DataTable.vue')) {
    return {
      props: {
        cols: [
          { key: 'tipo', label: 'Tipo', width: '1fr' },
          { key: 'nome', label: 'Nome', width: '1.6fr' },
        ],
        rows: [{ tipo: 'Aval', nome: 'Demo' }],
        empty: 'Nenhum item',
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nconst cols = [{ key: 'tipo', label: 'Tipo', width: '1fr' }, { key: 'nome', label: 'Nome', width: '1.6fr' }];\nconst rows = [{ tipo: 'Aval', nome: 'Demo' }];`,
        `  <${name} :cols="cols" :rows="rows" empty="Nenhum item" />`,
      ),
    };
  }
  if (path.endsWith('DadosGeraisStep.vue')) {
    return {
      props: { form: samplePedidoForm },
      frame: 'wide',
      example: exampleBlock(
        `import { reactive } from 'vue';\nimport ${name} from './${name}.vue';\nimport type { NewPedidoData } from './types';\nconst form = reactive<NewPedidoData>({ tipoOperacao: 'Desconto Duplicata', esteira: 'COMERCIAL', tipoContrato: 'CCB', unidadeNegocio: '', gerenteComercial: '', fundo: '', grupoEmpresarial: 'Agro Norte', contaBancaria: '', tipoTaxa: 'Pré-fixado', taxaOperacao: '1,85', indicePos: '', operadorPos: '', valorTaxaPos: '', fee: '', valorOperacao: '100000', quitacaoVencidos: false, requerGarantia: false });`,
        `  <${name} :form="form" />`,
      ),
    };
  }
  if (path.endsWith('GarantiaStep.vue')) {
    return {
      props: {
        requer: true,
        itens: [{ tipo: 'Aval', nome: 'Avalista Demo', valor: 'R$ 50.000,00' }],
        gForm: { tipo: '', nome: '', valor: '' },
      },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst requer = ref(true);\nconst itens = ref([{ tipo: 'Aval', nome: 'Avalista Demo', valor: 'R$ 50.000,00' }]);\nconst gForm = ref({ tipo: '', nome: '', valor: '' });`,
        `  <${name} :requer="requer" :itens="itens" :g-form="gForm" />`,
      ),
    };
  }
  if (path.endsWith('AtivosDuplicataStep.vue')) {
    return {
      props: { phase: 'upload', xmlFiles: [], titulosExtraidos: [], ativosVinculados: [] },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';`,
        `  <${name} phase="upload" :xml-files="[]" :titulos-extraidos="[]" :ativos-vinculados="[]" />`,
      ),
    };
  }
  if (path.endsWith('AnexosStep.vue')) {
    return {
      props: {
        docsGerais: [{ id: 'd1', nome: 'Contrato social', obrigatorio: true }],
        docsGarantia: [{ id: 'd2', nome: 'Matrícula', obrigatorio: false }],
        docFiles: { d1: false, d2: false },
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';`,
        `  <${name} :docs-gerais="[{ id: 'd1', nome: 'Contrato social', obrigatorio: true }]" :docs-garantia="[]" :doc-files="{ d1: false }" />`,
      ),
    };
  }
  if (path.endsWith('DocGroup.vue')) {
    return {
      props: {
        title: 'Documentos gerais',
        docs: [{ id: 'd1', nome: 'Contrato social', obrigatorio: true }],
        docFiles: { d1: false },
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';`,
        `  <${name} title="Documentos gerais" :docs="[{ id: 'd1', nome: 'Contrato social', obrigatorio: true }]" :doc-files="{ d1: false }" />`,
      ),
    };
  }

  if (path.endsWith('ExcluirGarantiaModal.vue')) {
    return {
      props: { garantia: sampleGarantia },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);\nconst garantia = { id: 'g1', tipo: 'Imóvel', nome: 'Cessão fiduciária', valor: 'R$ 100.000,00', anexos: [] };`,
        `  <${name} v-if="open" :garantia="garantia" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('ConfirmarTituloModal.vue') || path.endsWith('ProrrogarVencimentoModal.vue')) {
    return {
      props: { ativos: sampleDet.ativos.slice(0, 1) },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../data/operacaoData';\nconst open = ref(true);\nconst ativos = detalheSolicitacao(solicitacoes[0]).ativos.slice(0, 1);`,
        `  <${name} v-if="open" :ativos="ativos" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('MoverEtapaModal.vue')) {
    return {
      props: {
        solicitacaoId: sampleSolicitacao.id,
        cedente: sampleSolicitacao.grupoEmpresarial,
        etapaOrigem: 'Em análise',
        etapaDestino: 'Aprovado',
      },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" solicitacao-id="10482" cedente="Agro Norte" etapa-origem="Em análise" etapa-destino="Aprovado" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('DetalheValidacaoModal.vue')) {
    return {
      props: { v: sampleValidacao },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../data/operacaoData';\nconst open = ref(true);\nconst v = detalheSolicitacao(solicitacoes[0]).validacoes[0];`,
        `  <${name} v-if="open" :v="v" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('InserirEvidenciaModal.vue')) {
    return {
      props: { tituloValidacao: sampleValidacao.titulo },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" titulo-validacao="Validação KYC" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('DetalheEvidenciaModal.vue')) {
    const evidencia = sampleValidacao.evidencia ?? {
      arquivo: 'evidencia.pdf',
      descricao: 'Documento de exemplo',
      autor: 'Sistema',
      data: '23/07/2026',
    };
    return {
      props: { tituloValidacao: sampleValidacao.titulo, evidencia },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);\nconst evidencia = { arquivo: 'evidencia.pdf', descricao: 'Documento', autor: 'Sistema', data: '23/07/2026' };`,
        `  <${name} v-if="open" titulo-validacao="Validação KYC" :evidencia="evidencia" @close="open = false" />`,
      ),
    };
  }
  if (path.endsWith('EditarValorOperacaoModal.vue')) {
    return {
      props: { valorAtual: sampleSolicitacao.valor, feePercent: 0.5 },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);`,
        `  <${name} v-if="open" :valor-atual="1250000" :fee-percent="0.5" @close="open = false" />`,
      ),
    };
  }
  if (isModalPath(path)) {
    return {
      props: {},
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst open = ref(true);\n// Ajuste props conforme defineProps do SFC`,
        `  <${name} v-if="open" @close="open = false" />`,
      ),
    };
  }

  if (
    path.endsWith('RelatorioPedidosScreen.vue') ||
    path.endsWith('FundoPadraoScreen.vue') ||
    path.endsWith('TaxasVeiculosScreen.vue') ||
    path.endsWith('ValidacoesConfigScreen.vue') ||
    path.endsWith('OperationFundRankList.vue') ||
    path.endsWith('OperationFundRankEditor.vue') ||
    path.endsWith('VehicleRateDetailView.vue') ||
    path.endsWith('ValidationDetailView.vue') ||
    path.endsWith('StepGrid.vue') ||
    path.endsWith('EmptyState.vue') ||
    path.includes('/minuta/')
  ) {
    return {
      props: {},
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\n// Se houver props obrigatórias, veja defineProps no SFC abaixo`,
        `  <${name} />`,
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

export function getPreviewConfig(relPath: string): PreviewConfig {
  const name = relPath.split('/').pop()?.replace(/\.vue$/, '') ?? 'Component';
  return resolvePreview(relPath, name);
}

export function frameStyle(frame: PreviewConfig['frame'] = 'wide'): Record<string, string> {
  if (frame === 'modal') {
    return {
      position: 'relative',
      transform: 'translateZ(0)',
      isolation: 'isolate',
      minHeight: '420px',
      maxHeight: '560px',
      overflow: 'auto',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--surface-sunken)',
      border: '1px dashed var(--border-strong)',
    };
  }
  if (frame === 'card') {
    return {
      padding: '22px',
      background: 'var(--surface-page)',
      borderRadius: 'var(--radius-xl)',
      maxWidth: '520px',
    };
  }
  return {
    padding: '16px',
    background: 'var(--surface-page)',
    borderRadius: 'var(--radius-xl)',
    minHeight: '120px',
  };
}
