import type { ContratoAtivo, EventoHistorico, ParcelaAtivo } from './operacaoData';

export type StatusAnexos = 'PENDENTE' | 'ENVIADO' | 'REJEITADO';
export type EntregaTipo = 'PER' | 'FUT';
export type ConfirmacaoAtivo = 'PENDENTE' | 'CONFIRMADO' | 'REJEITADO';
export type SituacaoTitulo = 'VALIDADO' | 'REJEITADO' | 'PENDENTE';
export type SituacaoPagamento = 'VENCIDO' | 'EM_DIA' | 'LIQUIDADO' | 'PENDENTE';

export interface AtivoContato {
  id: string;
  nome: string;
  email: string;
  ddi: string;
  telefone: string;
}

export interface AtivoEndereco {
  id: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais?: string;
  cidade: string;
  uf: string;
  pais: string;
}

export interface AtivoPessoa {
  nome: string;
  documento: string;
  contatos: AtivoContato[];
  enderecos: AtivoEndereco[];
}

export interface AtivoPagamento {
  data: string;
  valorAmortizacao: number;
  tipoPagamento: string;
  jurosRemuneratorio: number;
  jurosMoratorio: number;
  multa: number;
  desconto: number;
  estornado?: boolean;
}

export interface AtivoConfirmacao {
  observacao: string;
  confirmadoPor: string;
  data: string;
  status: ConfirmacaoAtivo;
}

export interface AtivoObservacaoCobranca {
  data: string;
  autor: string;
  mensagem: string;
}

export interface AtivoAnexoDoc {
  id: string;
  nome: string;
  obrigatorio: boolean;
  enviado: boolean;
  arquivo?: string;
}

export interface AtivoConfiguracao {
  tipoCalculo: string;
  valorEmissao: number;
  vencimentoFinal: string;
  taxa: string;
  frequenciaTaxa: string;
  tipoCapitalizacao: string;
  baseDias: string;
  fluxoAmortizacao: string;
  fluxoJuros: string;
}

export interface AtivoDetalhePagamentos {
  jurosRemuneratorioAberto: number;
  pagamentos: AtivoPagamento[];
  configuracao: AtivoConfiguracao;
  cronograma: ParcelaAtivo[];
}

export const ANEXO_TITULO_DOCS = [
  'Garantia',
  'Boleto',
  'Notificação de Cessão',
  'Duplicata',
  'Recibo de Notificação',
  'Canhoto de Nota',
  'Cartão de Assinatura',
  'Carta de Correção',
  'Garantia Não Negociável',
  'Termo de Cessão',
  'Boletim de Entrega',
] as const;

export const TONE_STATUS_ANEXOS: Record<StatusAnexos, { bg: string; fg: string }> = {
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  ENVIADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

export const TONE_ENTREGA: Record<EntregaTipo, { bg: string; fg: string }> = {
  PER: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  FUT: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)' },
};

export const TONE_SITUACAO: Record<SituacaoTitulo, { bg: string; fg: string }> = {
  VALIDADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
};

export const TONE_SIT_PAGAMENTO: Record<SituacaoPagamento, { bg: string; fg: string }> = {
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
  EM_DIA: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  LIQUIDADO: { bg: 'var(--status-active-bg)', fg: 'var(--gci-base)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
};

function defaultAnexosDocs(): AtivoAnexoDoc[] {
  return ANEXO_TITULO_DOCS.map((nome, i) => ({
    id: `anexo-${i}`,
    nome,
    obrigatorio: i < 3,
    enviado: false,
  }));
}

function defaultPagamentos(valorTotal: number): AtivoDetalhePagamentos {
  return {
    jurosRemuneratorioAberto: 0,
    pagamentos: [],
    configuracao: {
      tipoCalculo: 'Pré-Fixado',
      valorEmissao: valorTotal,
      vencimentoFinal: '',
      taxa: '2,00%',
      frequenciaTaxa: 'Mensal',
      tipoCapitalizacao: 'Composta',
      baseDias: '252',
      fluxoAmortizacao: 'Mensal',
      fluxoJuros: 'Mensal',
    },
    cronograma: [],
  };
}

function pessoaBase(nome: string, documento: string): AtivoPessoa {
  return {
    nome,
    documento,
    contatos: nome
      ? [{ id: 'c1', nome, email: 'contato@email.com', ddi: '+55', telefone: '(34) 99999-0000' }]
      : [],
    enderecos: [],
  };
}

/** Preenche campos de tabela/detalhe quando o contrato veio só do modal. */
export function enriquecerContratoAtivo(
  ativo: Partial<ContratoAtivo> &
    Pick<ContratoAtivo, 'numero' | 'tipo' | 'emissao' | 'vencimento' | 'valorTotal' | 'sacadoNome' | 'sacadoDocumento'>,
): ContratoAtivo {
  const id = ativo.id ?? `ativo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    numero: ativo.numero,
    tipo: ativo.tipo,
    emissao: ativo.emissao,
    vencimento: ativo.vencimento,
    valorTotal: ativo.valorTotal,
    sacadoNome: ativo.sacadoNome,
    sacadoDocumento: ativo.sacadoDocumento,
    parcelas: ativo.parcelas ?? [],
    registro: ativo.registro ?? 'PENDENTE',
    statusAnexos: ativo.statusAnexos ?? 'PENDENTE',
    anexosEnviados: ativo.anexosEnviados ?? 0,
    anexosTotal: ativo.anexosTotal ?? ANEXO_TITULO_DOCS.length,
    lastro: ativo.lastro ?? String(Math.floor(100000 + Math.random() * 900000)),
    entrega: ativo.entrega ?? 'PER',
    confirmacao: ativo.confirmacao ?? 'PENDENTE',
    situacao: ativo.situacao ?? 'PENDENTE',
    situacaoPagamento: ativo.situacaoPagamento ?? 'PENDENTE',
    entrada: ativo.entrada ?? ativo.emissao,
    cedenteNome: ativo.cedenteNome ?? '—',
    cedenteDocumento: ativo.cedenteDocumento ?? '—',
    cedente: ativo.cedente ?? pessoaBase(ativo.cedenteNome ?? '—', ativo.cedenteDocumento ?? '—'),
    sacado: ativo.sacado ?? pessoaBase(ativo.sacadoNome, ativo.sacadoDocumento),
    pagamentosDetalhe: ativo.pagamentosDetalhe ?? defaultPagamentos(ativo.valorTotal),
    confirmacoes: ativo.confirmacoes ?? [],
    observacoesCobranca: ativo.observacoesCobranca ?? [],
    historicoTitulo: ativo.historicoTitulo ?? [],
    anexosDocs: ativo.anexosDocs ?? defaultAnexosDocs(),
    minuta: ativo.minuta,
  };
}

const ATIVO_1384: ContratoAtivo = enriquecerContratoAtivo({
  id: 'ativo-1384-1',
  numero: '50342-1',
  tipo: 'Duplicata',
  emissao: '21/09/2023',
  vencimento: '30/04/2024',
  valorTotal: 91_334.16,
  sacadoNome: 'LAURO FRANCISCO DIEL',
  sacadoDocumento: '000.000.000-00',
  parcelas: [],
  registro: 'PENDENTE',
  statusAnexos: 'ENVIADO',
  anexosEnviados: 1,
  anexosTotal: 11,
  lastro: '116385',
  entrega: 'PER',
  confirmacao: 'PENDENTE',
  situacao: 'REJEITADO',
  situacaoPagamento: 'VENCIDO',
  entrada: '15/01/2024',
  cedenteNome: 'NATIVA AGRONEGOCIOS LTDA',
  cedenteDocumento: '19.092.942/0001-75',
  cedente: {
    nome: 'NATIVA AGRONEGOCIOS LTDA',
    documento: '19.092.942/0001-75',
    contatos: [{ id: 'c1', nome: 'Departamento Financeiro', email: 'financeiro@nativa.com', ddi: '+55', telefone: '(34) 3832-1000' }],
    enderecos: [{ id: 'e1', cep: '38000-000', localidade: 'Centro', numero: '100', bairro: 'Centro', cidade: 'Uberaba', uf: 'MG', pais: 'Brasil' }],
  },
  sacado: {
    nome: 'LAURO FRANCISCO DIEL',
    documento: '000.000.000-00',
    contatos: [{ id: 'c1', nome: 'LAURO FRANCISCO DIEL', email: 'lauro@email.com', ddi: '+55', telefone: '(34) 99999-1234' }],
    enderecos: [{ id: 'e1', cep: '38010-000', localidade: 'Zona Rural', numero: 'S/N', bairro: 'Rural', cidade: 'Uberaba', uf: 'MG', pais: 'Brasil' }],
  },
  historicoTitulo: [
    { data: '08/06/2026 às 13:52:42', autor: 'Daniel Santos Patrocinio', acao: 'criou a solicitação' },
    { data: '08/06/2026 às 13:53:00', autor: 'Daniel Santos Patrocinio', acao: 'vinculou o título à cessão NATIVA_OP.1198_06072026' },
    { data: '06/07/2026 às 16:45:24', autor: 'Minerva', acao: 'alterou a situação de pagamento para VENCIDO' },
    { data: '06/07/2026 às 16:45:24', autor: 'Daniel Santos Patrocinio', acao: "alterou a situação do título de 'VALIDADO' para 'REJEITADO'" },
  ],
  anexosDocs: defaultAnexosDocs().map((a, i) => ({ ...a, enviado: i === 0 || i === 3 })),
});

const ATIVO_1388: ContratoAtivo = enriquecerContratoAtivo({
  id: 'ativo-1388-1',
  numero: '48201-2',
  tipo: 'CCB',
  emissao: '19/01/2024',
  vencimento: '30/01/2024',
  valorTotal: 89_990.4,
  sacadoNome: 'CARLOS FORTUNA NETO E OUTRO',
  sacadoDocumento: '111.222.333-44',
  cedenteNome: 'NATIVA AGRONEGOCIOS LTDA',
  cedenteDocumento: '19.092.942/0001-75',
  lastro: '117239',
  entrega: 'PER',
  situacao: 'REJEITADO',
  situacaoPagamento: 'VENCIDO',
  entrada: '19/01/2024',
  statusAnexos: 'PENDENTE',
  anexosEnviados: 0,
});

const ATIVO_1386: ContratoAtivo = enriquecerContratoAtivo({
  id: 'ativo-1386-1',
  numero: '47100-3',
  tipo: 'CPR-F',
  emissao: '10/05/2024',
  vencimento: '10/11/2024',
  valorTotal: 450_000,
  sacadoNome: 'REGIONAL AGRO INSUMOS LTDA',
  sacadoDocumento: '12.345.678/0001-90',
  cedenteNome: 'REGIONAL AGRO INSUMOS LTDA',
  cedenteDocumento: '12.345.678/0001-90',
  lastro: '115890',
  entrega: 'FUT',
  situacao: 'VALIDADO',
  situacaoPagamento: 'EM_DIA',
  entrada: '10/05/2024',
  statusAnexos: 'ENVIADO',
  anexosEnviados: 5,
  confirmacao: 'CONFIRMADO',
});

const SEED_MAP: Record<string, ContratoAtivo[]> = {
  '#1384': [ATIVO_1384],
  '#1388': [ATIVO_1388],
  '#1386': [ATIVO_1386],
};

export function seedAtivos(solicitacaoId: string): ContratoAtivo[] {
  const base = SEED_MAP[solicitacaoId];
  if (!base) return [];
  return base.map((a) => ({ ...a }));
}

/** Títulos disponíveis para vincular (mock do modal). */
export interface TituloDisponivel {
  id: string;
  lastro: string;
  numero: string;
  tipoOperacao: string;
  situacao: SituacaoTitulo;
  confirmacao: ConfirmacaoAtivo;
  dataCriacao: string;
  dataEmissao: string;
  valorNominal: number;
  cedente: string;
  sacado: string;
  vencimento: string;
  entrega: EntregaTipo;
}

export const TITULOS_DISPONIVEIS: TituloDisponivel[] = [
  { id: 'td-1', lastro: '117239', numero: '48327-1', tipoOperacao: 'PRÉ', situacao: 'REJEITADO', confirmacao: 'PENDENTE', dataCriacao: '19/01/2024', dataEmissao: '25/05/2023', valorNominal: 89_990.4, cedente: 'NATIVA AGRONEGOCIOS LTDA', sacado: 'CARLOS FORTUNA NETO E OUTRO', vencimento: '30/01/2024', entrega: 'PER' },
  { id: 'td-2', lastro: '117240', numero: '48328-1', tipoOperacao: 'PRÉ', situacao: 'REJEITADO', confirmacao: 'PENDENTE', dataCriacao: '19/01/2024', dataEmissao: '25/05/2023', valorNominal: 76_500, cedente: 'NATIVA AGRONEGOCIOS LTDA', sacado: 'SILVIO VALDIR KAFER E OUTROS', vencimento: '30/01/2024', entrega: 'PER' },
  { id: 'td-3', lastro: '117241', numero: '48329-1', tipoOperacao: 'PRÉ', situacao: 'PENDENTE', confirmacao: 'PENDENTE', dataCriacao: '20/01/2024', dataEmissao: '26/05/2023', valorNominal: 120_000, cedente: 'NATIVA AGRONEGOCIOS LTDA', sacado: 'JOÃO DA SILVA', vencimento: '15/02/2024', entrega: 'FUT' },
];

export function tituloDisponivelParaContrato(t: TituloDisponivel): ContratoAtivo {
  return enriquecerContratoAtivo({
    numero: t.numero,
    tipo: 'Duplicata',
    emissao: t.dataEmissao,
    vencimento: t.vencimento,
    valorTotal: t.valorNominal,
    sacadoNome: t.sacado,
    sacadoDocumento: '—',
    parcelas: [],
    lastro: t.lastro,
    entrega: t.entrega,
    situacao: t.situacao,
    confirmacao: t.confirmacao,
    situacaoPagamento: 'PENDENTE',
    entrada: t.dataCriacao,
    cedenteNome: t.cedente,
    cedenteDocumento: '—',
    statusAnexos: 'PENDENTE',
    anexosEnviados: 0,
  });
}

export function historicoSacadoFromTitulo(historico: EventoHistorico[]): EventoHistorico[] {
  return historico;
}
