import { TIPO_PEDIDO_OPTS } from './tipoPedidoOptions';

export { TIPO_PEDIDO_OPTS };

export const REQUEST_REPORTS = [
  {
    text: 'Relatório Solicitação',
    value: 20,
    format: 'csv' as const,
    description: 'Exporta solicitações filtradas por número, gerente, grupo empresarial e tipo.',
  },
  {
    text: 'Relatório Checklist da Solicitação',
    value: 22,
    format: 'pdf' as const,
    description: 'Gera o checklist de validações das solicitações em PDF (protótipo simulado).',
  },
  {
    text: 'Relatório de Titulos da Solicitação',
    value: 34,
    format: 'csv' as const,
    description: 'Lista títulos vinculados às solicitações, com opção de quitação de vencidos.',
  },
  {
    text: 'Pedidos Aprovados Abaixo da Taxa',
    value: 29,
    format: 'csv' as const,
    description: 'Pedidos aprovados abaixo da taxa, com filtros de datas, veículos e hierarquia comercial.',
  },
  {
    text: 'Relatório de Primeira Validação',
    value: 33,
    format: 'csv' as const,
    description: 'Exporta o status da primeira validação das solicitações filtradas.',
  },
] as const;

export type RequestReportValue = (typeof REQUEST_REPORTS)[number]['value'];

export const GERENTES_COMERCIAIS = [
  'Ana Paula Ferreira',
  'Carlos Mendes',
  'Juliana Costa',
  'Roberto Almeida',
];

export const SUPERINTENDENTES = [
  'Marcos Oliveira',
  'Patricia Souza',
  'Fernando Lima',
];

export const GRUPOS_EMPRESARIAIS = [
  'Grupo Agrovita',
  'Grupo Confina',
  'Grupo Ceres Trading',
  'Grupo Norte Grãos',
  'Grupo Sul Cereais',
];

export const VEICULOS_OPERACAO = [
  'FIDC Ceres Multicedente',
  'FIDC Agro Recebíveis',
  'CRA Agrovita I',
  'CRA Confina II',
  'FIDC Trading Senior',
];

export interface RelatorioPedidosFilters {
  numeroSolicitacao: string;
  gerenteComercial: string;
  grupoEmpresarial: string;
  tipoSolicitacao: string;
  quitacaoVencidos: boolean;
  aprovacaoDe: string;
  aprovacaoAte: string;
  veiculos: string[];
  tipoPedido: string;
  superintendente: string;
}

export function emptyRelatorioFilters(): RelatorioPedidosFilters {
  return {
    numeroSolicitacao: '',
    gerenteComercial: '',
    grupoEmpresarial: '',
    tipoSolicitacao: '',
    quitacaoVencidos: false,
    aprovacaoDe: '',
    aprovacaoAte: '',
    veiculos: [],
    tipoPedido: '',
    superintendente: '',
  };
}

export function isAbaixoDaTaxa(tipo: RequestReportValue | null): boolean {
  return tipo === 29;
}

export function isChecklistPdf(tipo: RequestReportValue | null): boolean {
  return tipo === 22;
}

export function isTitulosReport(tipo: RequestReportValue | null): boolean {
  return tipo === 34;
}

export function reportFileName(tipo: RequestReportValue, ext: string): string {
  const label = REQUEST_REPORTS.find((r) => r.value === tipo)?.text ?? 'relatorio';
  const slug = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `${slug}-${date}.${ext}`;
}

export interface RelatorioResultRow {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5?: string;
}
