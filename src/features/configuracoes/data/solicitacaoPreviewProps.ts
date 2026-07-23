import { FileText, Plus, User, Building2 } from 'lucide-vue-next';
import {
  detalheSolicitacao,
  solicitacoes,
  type ParteRelacionada,
} from '@/features/solicitacao-operacao/data/operacaoData';
import { seedAtivos } from '@/features/solicitacao-operacao/data/ativoData';
import type { NewPedidoData } from '@/features/solicitacao-operacao/components/novo-pedido/types';
import { IDENTIFICACAO_FIELDS } from '@/features/solicitacao-operacao/data/parteRelacionadaFields';
import {
  emptyBoletimSubscricao,
  emptyCessaoForm,
  emptyCetForm,
  emptyConjugeMinuta,
  emptyPessoaMinuta,
  emptyProdutoMinuta,
  MOCK_CLIENTES_MINUTA,
  type AvalistaMinutaRow,
  type TituloMinutaForm,
} from '@/features/solicitacao-operacao/data/minutaData';
import { RANK_ATIVO_SEED } from '@/features/solicitacao-operacao/data/fundoPadraoData';
import { VEICULOS_FIDC_SEED } from '@/features/solicitacao-operacao/data/taxasVeiculosData';
import { VALIDACOES_SEED } from '@/features/solicitacao-operacao/data/validacoesConfigData';

export type PreviewConfig = {
  props?: Record<string, unknown>;
  slotText?: string;
  frame?: 'plain' | 'card' | 'wide' | 'modal';
  example: string;
};

export function isModalPath(relPath: string): boolean {
  const p = relPath.replace(/\\/g, '/');
  const base = p.split('/').pop() ?? '';
  return (
    /Modal\.vue$/i.test(base) ||
    /ColPanel\.vue$/i.test(base) ||
    /Popover\.vue$/i.test(base) ||
    /Dropdown\.vue$/i.test(base) ||
    base === 'ActionMenu.vue' ||
    p.includes('NovoPedidoModal')
  );
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

const sampleParteFallback: ParteRelacionada = {
  tipos: ['AVA'],
  tipoPessoa: 'JURIDICA',
  nome: 'Parte Demo LTDA',
  documento: '12.345.678/0001-90',
  email: 'contato@demo.com',
  telefone: '(11) 99999-0000',
};
const sampleParte = sampleDet.partes[0] ?? sampleParteFallback;
const sampleValidacao = sampleDet.validacoes[0] ?? {
  titulo: 'Validação KYC',
  descricao: 'Documento de exemplo',
  area: 'Compliance',
  status: 'PENDENTE' as const,
};
const sampleGarantia = sampleDet.garantias[0] ?? {
  id: 'g-demo',
  tipo: 'Imóvel',
  nome: 'Cessão fiduciária',
  valor: 'R$ 100.000,00',
  anexos: [],
};

const samplePessoaAtivo = sampleAtivo.cedente ?? {
  nome: 'NATIVA AGRONEGOCIOS LTDA',
  documento: '00.000.000/0001-00',
  contatos: [],
  enderecos: [],
};
const samplePessoaMinuta = MOCK_CLIENTES_MINUTA[0] ?? emptyPessoaMinuta('FISICA');
const sampleAvalistaRows: AvalistaMinutaRow[] = (sampleDet.partes.length
  ? sampleDet.partes.filter((p) => p.tipos.includes('AVA'))
  : [sampleParte]
).map((p) => ({
  documento: p.documento,
  nome: p.nome,
  possuiConjuge: !!p.possuiConjuge,
  selecionadoAssinatura: false,
  conjugeInterveniente: false,
}));

const sampleTituloMinutaForm: TituloMinutaForm = {
  tipoValorLiquido: true,
  numero: '001',
  tipo: 'CPR',
  emissao: '01/01/2026',
  vencimento: '01/07/2026',
  chaveNota: '',
  docCedente: samplePessoaMinuta.documento ?? '',
  gerarOperacaoGarantias: false,
  possuiCronograma: true,
  cronogramaAutomatico: false,
  fluxoAmortizacao: '',
  fluxoJuros: '',
  cessao: emptyCessaoForm(),
  sacadoDocumento: '',
  sacadoNome: '',
  sacadoEmail: '',
  ddi: '+55',
  telefone: '',
  cep: '',
  endereco: '',
  numeroEndereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
};

const sampleEmissaoMinuta = {
  uf: 'MG',
  cidade: 'Uberaba',
  numero: '1',
  serie: 'ÚNICA',
  valorNominalUnitario: '100000',
  quantidade: '1',
  valorTotal: '100000',
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
        pessoa: samplePessoaAtivo,
        titulo: 'Cedente',
        historico: sampleAtivo.historicoTitulo ?? [],
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
      props: { pessoa: samplePessoaAtivo },
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
  if (path.endsWith('AdicionarContratoModal.vue')) {
    return {
      props: {
        valorOperacao: sampleSolicitacao.valor,
        tipoCalculo: sampleSolicitacao.tipoTaxa ?? 'Pré-fixado',
        partes: sampleDet.partes,
        unidadeNegocio: sampleSolicitacao.unidadeNegocio ?? 'Agro',
      },
      frame: 'modal',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../data/operacaoData';\nconst open = ref(true);\nconst s = solicitacoes[0];\nconst det = detalheSolicitacao(s);`,
        `  <${name} v-if="open" :valor-operacao="s.valor" tipo-calculo="Pré-fixado" :partes="det.partes" @close="open = false" />`,
      ),
    };
  }

  // ── Minuta (defineModel + props obrigatórias) ──────────────────────────
  if (path.endsWith('SpouseFields.vue')) {
    return {
      props: { modelValue: emptyConjugeMinuta() },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyConjugeMinuta } from '../../../data/minutaData';\nconst conjuge = ref(emptyConjugeMinuta());`,
        `  <${name} v-model="conjuge" />`,
      ),
    };
  }
  if (
    path.endsWith('EmitenteStep.vue') ||
    path.endsWith('CredoraStep.vue') ||
    path.endsWith('EndossatarioStep.vue') ||
    path.endsWith('EscrituradorStep.vue')
  ) {
    const form =
      path.endsWith('EmitenteStep.vue')
        ? { ...samplePessoaMinuta }
        : emptyPessoaMinuta('JURIDICA');
    return {
      props: { form, docBusca: '' },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyPessoaMinuta } from '../../../data/minutaData';\nconst form = ref(emptyPessoaMinuta('JURIDICA'));`,
        `  <${name} v-model:form="form" />`,
      ),
    };
  }
  if (path.endsWith('AvalistaStep.vue')) {
    return {
      props: {
        possuiAvalistas: true,
        rows: sampleAvalistaRows.length
          ? sampleAvalistaRows
          : [
              {
                documento: '105.746.818-50',
                nome: 'Avalista Demo',
                possuiConjuge: false,
                selecionadoAssinatura: false,
                conjugeInterveniente: false,
              },
            ],
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nconst rows = [{ documento: '105.746.818-50', nome: 'Avalista Demo', possuiConjuge: false, selecionadoAssinatura: false, conjugeInterveniente: false }];`,
        `  <${name} :possui-avalistas="true" :rows="rows" />`,
      ),
    };
  }
  if (path.endsWith('EmissaoStep.vue')) {
    return {
      props: { modelValue: { ...sampleEmissaoMinuta } },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nconst form = ref({ uf: 'MG', cidade: 'Uberaba' });`,
        `  <${name} v-model="form" />`,
      ),
    };
  }
  if (path.endsWith('ProdutoStep.vue')) {
    return {
      props: { form: emptyProdutoMinuta(), produtos: [] },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyProdutoMinuta } from '../../../data/minutaData';\nconst form = ref(emptyProdutoMinuta());`,
        `  <${name} v-model:form="form" />`,
      ),
    };
  }
  if (path.endsWith('TituloMinutaStep.vue')) {
    return {
      props: {
        modelValue: { ...sampleTituloMinutaForm, cessao: emptyCessaoForm() },
        valorOperacao: sampleSolicitacao.valor,
        tipoCalculo: sampleSolicitacao.tipoTaxa ?? 'Pré-fixado',
      },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyCessaoForm } from '../../../data/minutaData';\nconst form = ref({ tipoValorLiquido: true, numero: '', tipo: 'CPR', emissao: '', vencimento: '', chaveNota: '', docCedente: '', gerarOperacaoGarantias: false, possuiCronograma: true, cronogramaAutomatico: false, fluxoAmortizacao: '', fluxoJuros: '', cessao: emptyCessaoForm(), sacadoDocumento: '', sacadoNome: '', sacadoEmail: '', ddi: '+55', telefone: '', cep: '', endereco: '', numeroEndereco: '', complemento: '', bairro: '', cidade: '', estado: '', pais: 'Brasil' });`,
        `  <${name} v-model="form" :valor-operacao="1250000" tipo-calculo="Pré-fixado" />`,
      ),
    };
  }
  if (path.endsWith('BoletimSubscricaoStep.vue')) {
    return {
      props: { modelValue: emptyBoletimSubscricao() },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyBoletimSubscricao } from '../../../data/minutaData';\nconst boletim = ref(emptyBoletimSubscricao());`,
        `  <${name} v-model="boletim" />`,
      ),
    };
  }
  if (path.endsWith('CetStep.vue')) {
    return {
      props: {
        modelValue: emptyCetForm(),
        valorTitulo: sampleSolicitacao.valor,
        dataEmissao: '01/01/2026',
        dataVencimento: '01/07/2026',
      },
      frame: 'wide',
      example: exampleBlock(
        `import { ref } from 'vue';\nimport ${name} from './${name}.vue';\nimport { emptyCetForm } from '../../../data/minutaData';\nconst form = ref(emptyCetForm());`,
        `  <${name} v-model="form" :valor-titulo="1250000" data-emissao="01/01/2026" data-vencimento="01/07/2026" />`,
      ),
    };
  }
  if (path.endsWith('MinutaStepper.vue')) {
    return {
      props: {
        current: 0,
        steps: [
          { key: 'emitente', label: 'Emitente', icon: User },
          { key: 'credora', label: 'Credora', icon: Building2 },
        ],
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { User, Building2 } from 'lucide-vue-next';\nconst steps = [{ key: 'emitente', label: 'Emitente', icon: User }, { key: 'credora', label: 'Credora', icon: Building2 }];`,
        `  <${name} :steps="steps" :current="0" />`,
      ),
    };
  }
  if (path.endsWith('MinutaWizard.vue')) {
    return {
      props: {
        valorOperacao: sampleSolicitacao.valor,
        tipoCalculo: sampleSolicitacao.tipoTaxa ?? 'Pré-fixado',
        tipo: 'Contrato CPR',
        partes: sampleDet.partes,
        gerarMinuta: true,
        unidadeNegocio: sampleSolicitacao.unidadeNegocio ?? 'Agro',
      },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { solicitacoes, detalheSolicitacao } from '../../../data/operacaoData';\nconst s = solicitacoes[0];\nconst det = detalheSolicitacao(s);`,
        `  <${name} :valor-operacao="s.valor" tipo-calculo="Pré-fixado" tipo="Contrato CPR" :partes="det.partes" :gerar-minuta="true" />`,
      ),
    };
  }
  if (path.endsWith('GarantiaMinutaStep.vue') || path.endsWith('InformacaoPagamentoStep.vue')) {
    return {
      props: {},
      frame: 'wide',
      example: baseExample(name, ''),
    };
  }

  // ── Fundo / Taxas / Validações config ──────────────────────────────────
  if (path.endsWith('OperationFundRankList.vue')) {
    return {
      props: { items: RANK_ATIVO_SEED },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { RANK_ATIVO_SEED } from '../../data/fundoPadraoData';`,
        `  <${name} :items="RANK_ATIVO_SEED" />`,
      ),
    };
  }
  if (path.endsWith('OperationFundRankEditor.vue')) {
    return {
      props: { activeRank: RANK_ATIVO_SEED },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { RANK_ATIVO_SEED } from '../../data/fundoPadraoData';`,
        `  <${name} :active-rank="RANK_ATIVO_SEED" />`,
      ),
    };
  }
  if (path.endsWith('VehicleRateDetailView.vue')) {
    return {
      props: { vehicle: VEICULOS_FIDC_SEED[0], tabLabel: 'FIDC' },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { VEICULOS_FIDC_SEED } from '../../data/taxasVeiculosData';`,
        `  <${name} :vehicle="VEICULOS_FIDC_SEED[0]" tab-label="FIDC" />`,
      ),
    };
  }
  if (path.endsWith('ValidationDetailView.vue')) {
    return {
      props: { item: VALIDACOES_SEED[0] },
      frame: 'wide',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { VALIDACOES_SEED } from '../../data/validacoesConfigData';`,
        `  <${name} :item="VALIDACOES_SEED[0]" />`,
      ),
    };
  }
  if (path.includes('/adicionar-contrato/EmptyState.vue')) {
    return {
      props: { icon: FileText, title: 'Nenhum item', hint: 'Não há registros para exibir.' },
      frame: 'card',
      example: exampleBlock(
        `import ${name} from './${name}.vue';\nimport { FileText } from 'lucide-vue-next';`,
        `  <${name} :icon="FileText" title="Nenhum item" hint="Não há registros para exibir." />`,
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
    path.endsWith('StepGrid.vue')
  ) {
    return {
      props: {},
      frame: 'wide',
      example: baseExample(name, ''),
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
