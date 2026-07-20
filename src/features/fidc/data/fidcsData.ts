export type FidcCategory = 'MONOCLASSE' | 'MULTICLASSE';

export type TitleStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';
export type LastroTipo = 'NFE' | 'DM' | 'CPR_F' | 'NC' | 'CTE' | 'CH' | 'DS';

export type RoundStatus = 'ABERTA' | 'FECHADA' | 'CANCELADA' | 'EM ANDAMENTO';

export type CessaoTipo =
  | 'COMPOSIÇÃO DE GARANTIA'
  | 'DESEMBOLSO'
  | 'DESEMBOLSO PARCIAL'
  | 'INTEGRALIZAÇÃO';

export const CESSAO_TIPOS: CessaoTipo[] = [
  'COMPOSIÇÃO DE GARANTIA',
  'DESEMBOLSO',
  'DESEMBOLSO PARCIAL',
  'INTEGRALIZAÇÃO',
];

export const ROUND_STATUSES: RoundStatus[] = ['ABERTA', 'FECHADA', 'CANCELADA', 'EM ANDAMENTO'];

export interface Cessao {
  id: string;
  nome: string;
  data: string;
  tipo: CessaoTipo;
  valorAberto: number;
  status: RoundStatus;
  taxaCessao?: number;
  valorPresente?: number;
  valorTotal?: number;
  temTermo?: boolean;
  cedente?: string;
  grupoEmpresarial?: string;
  aprovacaoTaxa?: boolean;
  taxaDesconto?: number;
  linkAssinatura?: string;
  descontoAdicional?: string;
  parametrizacao?: string;
  tipoCalculo?: string;
  usoArtesanal?: boolean;
  indicadorTaxa?: string;
  operadorTaxa?: string;
  frequenciaTaxa?: string;
  baseCalculo?: string;
  capitalizacao?: string;
  inicioContagem?: string;
  inicioCalculo?: string;
  coobrigacao?: boolean;
  obrigacaoRecompra?: boolean;
  certificadorEmail?: boolean;
}

export interface SacadoContato {
  id: string;
  nome: string;
  email: string;
  ddi: string;
  telefone: string;
  principal?: boolean;
}

export interface SacadoEndereco {
  id: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  adicional?: string;
}

export interface SacadoHistorico {
  id: string;
  datetime: string;
  message: string;
  createdBy?: string;
}

export interface Sacado {
  id: string;
  documento: string;
  nome: string;
  tipo: string;
  limite: number;
  especial: boolean;
  parteRelacionada: boolean;
  grupoEconomico: string;
  pessoaFisica: boolean;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  inscricaoProdutorRural?: string;
  atividadePrincipal?: string;
  metodoNotificacao?: string;
  contatos: SacadoContato[];
  enderecos: SacadoEndereco[];
  historico: SacadoHistorico[];
}

export interface Title {
  id: string;
  numero: string;
  lastro: LastroTipo;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  emissao: string;
  vencimento: string;
  vrNominal: number;
  status: TitleStatus;
  classId: string;
}

export interface FidcClass {
  id: string;
  name: string;
  cnpj: string;
  status: 'EM ANDAMENTO';
  vrNominal: number;
  vrAberto: number;
  vrPresente: number;
  vrVencido: number;
  titulos: Title[];
}

export type GrupoStatusOperacao = 'EM ANÁLISE' | 'APROVADO' | 'REJEITADO' | 'PENDENTE';

export const GRUPO_STATUS_OPERACAO: GrupoStatusOperacao[] = [
  'EM ANÁLISE',
  'APROVADO',
  'REJEITADO',
  'PENDENTE',
];

export interface GrupoCedente {
  id: string;
  documento: string;
  nome: string;
  email?: string;
  cidadeUf?: string;
  tipo: 'PF' | 'PJ';
}

export interface GrupoParteRelacionada {
  id: string;
  documento: string;
  nome: string;
  tipos: string;
}

export interface GrupoDocumento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

export interface GrupoContaBancaria {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  principal?: boolean;
}

export interface GrupoFaturamento {
  id: string;
  ano: number;
  valor: number;
}

export interface GrupoGarantia {
  id: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  cobertura: string;
  status: string;
}

export interface GrupoHistoricoEvento {
  id: string;
  datetime: string;
  message: string;
  createdBy?: string;
}

export interface GrupoEmpresarialVinculo {
  id: string;
  nome: string;
  statusOperacao: GrupoStatusOperacao;
  apto: boolean;
  masterContractDate?: string;
  masterContractUrl?: string;
  limite: number;
  riscoTomado: number;
  faturamento: number;
  dataCadastro: string;
  gerente?: string;
  juros?: number;
  desconto?: number;
  cedentes: GrupoCedente[];
  partesRelacionadas: GrupoParteRelacionada[];
  documentos: GrupoDocumento[];
  contas: GrupoContaBancaria[];
  faturamentos: GrupoFaturamento[];
  garantias: GrupoGarantia[];
  historico: GrupoHistoricoEvento[];
}

export interface SetupBondType {
  id: string;
  abreviacao: string;
  descricao: string;
  ativo: boolean;
}

export interface SetupEligibilityTop {
  id: string;
  tipo: 'CEDENTE' | 'SACADO';
  quantidade: number;
  concentracaoPct: number;
}

export interface FidcSetup {
  cnpj: string;
  razaoSocial: string;
  identificacao: string;
  website: string;
  ddi: string;
  telefone: string;
  singulareCompanyCode: string;
  grupoOperacao: string;
  dataRegistroCvm: string;
  valorInicial: string;
  posseDocumentos: boolean;
  perfilTributario: string;
  tipoCondomino: string;
  perfilCota: string;
  jurosBoleto: string;
  multaBoleto: string;
  limiteVencimentoMin: string;
  limiteVencimentoMax: string;
  bondTypes: SetupBondType[];
  carteiraNome: string;
  carteiraBanco: string;
  carteiraSlug: string;
  carteiraCnab: string;
  carteiraConta: string;
  carteiraAgencia: string;
  vencimentoFimSemana: boolean;
  beneficiarioNome: string;
  beneficiarioCep: string;
  beneficiarioCidade: string;
  beneficiarioUf: string;
  eligibilityTops: SetupEligibilityTop[];
}

export interface Fidc {
  id: string;
  name: string;
  cnpj: string;
  category: FidcCategory;
  status: 'EM ANDAMENTO';
  carteira: { valor: number; titulos: number };
  vencido: { valor: number; titulos: number };
  vencendoHoje: number;
  vencendoMes: number;
  confirmacaoPct: number;
  pl: number;
  plRef: string;
  plRefAgo: string;
  carteiraSummaryTitles: number;
  classes: FidcClass[];
  cessoes: Cessao[];
  sacados: Sacado[];
  grupos: GrupoEmpresarialVinculo[];
  setup: FidcSetup;
}

function makeFidcCessoes(prefix: string): Cessao[] {
  return [
    {
      id: `${prefix}-ces-1`,
      nome: `Cessão ${prefix} — Desembolso`,
      data: '15/01/2025',
      tipo: 'DESEMBOLSO',
      valorAberto: 2_450_000,
      status: 'ABERTA',
      taxaCessao: 1.75,
      valorPresente: 2_300_000,
      valorTotal: 2_500_000,
      temTermo: true,
      cedente: 'LATICÍNIOS PRADO LTDA',
      grupoEmpresarial: 'Grupo Ceres',
      aprovacaoTaxa: true,
      taxaDesconto: 1.5,
      linkAssinatura: 'https://assinatura.exemplo.com/ces-1',
      certificadorEmail: true,
      indicadorTaxa: 'CDI',
    },
    {
      id: `${prefix}-ces-2`,
      nome: `Cessão ${prefix} — Integralização`,
      data: '20/02/2025',
      tipo: 'INTEGRALIZAÇÃO',
      valorAberto: 0,
      status: 'FECHADA',
      taxaCessao: 2.0,
      valorPresente: 980_000,
      valorTotal: 1_000_000,
      temTermo: true,
      cedente: 'FAZENDA SÃO BENTO',
      grupoEmpresarial: 'Semeagro',
      aprovacaoTaxa: false,
      taxaDesconto: 1.8,
      linkAssinatura: '',
    },
    {
      id: `${prefix}-ces-3`,
      nome: `Cessão ${prefix} — Desembolso Parcial`,
      data: '05/03/2025',
      tipo: 'DESEMBOLSO PARCIAL',
      valorAberto: 320_000,
      status: 'EM ANDAMENTO',
      taxaCessao: 1.6,
      valorPresente: 300_000,
      valorTotal: 350_000,
      temTermo: false,
      cedente: 'AGROPECUÁRIA NOVA ERA',
      grupoEmpresarial: 'Grupo Ceres',
      aprovacaoTaxa: true,
      taxaDesconto: 1.4,
      linkAssinatura: 'https://assinatura.exemplo.com/ces-3',
    },
  ];
}

function makeFidcSacados(prefix: string): Sacado[] {
  return [
    {
      id: `${prefix}-sac-1`,
      documento: '98.765.432/0001-10',
      nome: 'COOP. AGRO CENTRAL',
      tipo: 'Standard',
      limite: 8_000_000,
      especial: false,
      parteRelacionada: false,
      grupoEconomico: 'Grupo Ceres',
      pessoaFisica: false,
      nomeFantasia: 'Coop Agro Central',
      metodoNotificacao: 'E-mail',
      contatos: [
        { id: 'c1', nome: 'Roberto Lima', email: 'roberto@coopagro.com.br', ddi: '+55', telefone: '(11) 97777-3333', principal: true },
      ],
      enderecos: [
        { id: 'e1', cep: '13010-000', localidade: 'Rua Barão de Jaguara', numero: '100', bairro: 'Centro', cidade: 'Campinas', uf: 'SP', pais: 'Brasil' },
      ],
      historico: [
        { id: 'h1', datetime: '12/02/2025 11:00', message: 'Sacado cadastrado no fundo', createdBy: 'sistema' },
      ],
    },
    {
      id: `${prefix}-sac-2`,
      documento: '23.456.789/0001-22',
      nome: 'MERCADO BOM PRECO',
      tipo: 'Elegível',
      limite: 1_200_000,
      especial: true,
      parteRelacionada: false,
      grupoEconomico: 'Semeagro',
      pessoaFisica: false,
      nomeFantasia: 'Bom Preço',
      metodoNotificacao: 'WhatsApp',
      contatos: [],
      enderecos: [
        { id: 'e1', cep: '14010-000', localidade: 'Av. Presidente Vargas', numero: '50', bairro: 'Centro', cidade: 'Ribeirão Preto', uf: 'SP', pais: 'Brasil' },
      ],
      historico: [],
    },
    {
      id: `${prefix}-sac-3`,
      documento: '67.890.123/0001-66',
      nome: 'JBS FRIBOI S.A.',
      tipo: 'Standard',
      limite: 15_000_000,
      especial: false,
      parteRelacionada: false,
      grupoEconomico: 'JBS Agro',
      pessoaFisica: false,
      nomeFantasia: 'JBS Friboi',
      metodoNotificacao: 'E-mail',
      contatos: [
        { id: 'c1', nome: 'Financeiro JBS', email: 'financeiro@jbs.com.br', ddi: '+55', telefone: '(11) 3000-0000', principal: true },
      ],
      enderecos: [
        { id: 'e1', cep: '05305-000', localidade: 'Av. Marginal Direita do Tietê', numero: '500', bairro: 'Vila Jaguara', cidade: 'São Paulo', uf: 'SP', pais: 'Brasil' },
      ],
      historico: [
        { id: 'h1', datetime: '18/02/2025 09:30', message: 'Limite inicial definido', createdBy: 'eduardo.santos' },
      ],
    },
  ];
}

function makeFidcGrupos(prefix: string): GrupoEmpresarialVinculo[] {
  return [
    {
      id: `${prefix}-grp-1`,
      nome: 'Grupo Ceres',
      statusOperacao: 'APROVADO',
      apto: true,
      masterContractDate: '2024-03-01',
      masterContractUrl: '#contrato-mae-ceres-fidc.pdf',
      limite: 40_000_000,
      riscoTomado: 8_200_000,
      faturamento: 180_000_000,
      dataCadastro: '2023-08-12',
      gerente: 'Ana Paula',
      juros: 1.85,
      desconto: 0.5,
      cedentes: [
        { id: 'ced-1', documento: '04.851.443/0001-10', nome: 'Ceres Agronegócios S.A.', cidadeUf: 'São Paulo-SP', tipo: 'PJ' },
      ],
      partesRelacionadas: [
        { id: 'pr-1', documento: '11.222.333/0001-44', nome: 'Ceres Participações', tipos: 'Controladora' },
      ],
      documentos: [
        { id: 'doc-1', nome: 'Contrato Mãe', tipo: 'Operacional', data: '01/03/2024' },
      ],
      contas: [
        { id: 'cta-1', banco: '341 — Itaú', agencia: '1234', conta: '56789-0', principal: true },
      ],
      faturamentos: [{ id: 'fat-1', ano: 2024, valor: 180_000_000 }],
      garantias: [
        { id: 'gar-1', tipo: 'Cessão fiduciária', dataInicio: '01/03/2024', dataFim: '01/03/2027', valor: 15_000_000, cobertura: '37%', status: 'Ativa' },
      ],
      historico: [
        { id: 'gh-1', datetime: '12/08/2023 10:00', message: 'Grupo vinculado ao FIDC', createdBy: 'sistema' },
        { id: 'gh-2', datetime: '01/03/2024 15:00', message: 'Parâmetros de limite/juros/desconto atualizados', createdBy: 'eduardo.santos' },
      ],
    },
    {
      id: `${prefix}-grp-2`,
      nome: 'JBS Agro',
      statusOperacao: 'EM ANÁLISE',
      apto: false,
      limite: 60_000_000,
      riscoTomado: 15_000_000,
      faturamento: 900_000_000,
      dataCadastro: '2024-06-01',
      gerente: 'Carlos Lima',
      juros: 2.1,
      desconto: 0.75,
      cedentes: [
        { id: 'ced-1', documento: '02.916.265/0001-60', nome: 'JBS S.A.', cidadeUf: 'São Paulo-SP', tipo: 'PJ' },
      ],
      partesRelacionadas: [],
      documentos: [],
      contas: [],
      faturamentos: [{ id: 'fat-1', ano: 2024, valor: 900_000_000 }],
      garantias: [],
      historico: [
        { id: 'gh-1', datetime: '01/06/2024 09:00', message: 'Grupo em análise — sem contrato mãe', createdBy: 'sistema' },
      ],
    },
  ];
}

export function defaultFidcSetup(name = 'NOVO FIDC', cnpj = '—'): FidcSetup {
  return makeFidcSetup(name, cnpj);
}

function makeFidcSetup(name: string, cnpj: string): FidcSetup {
  return {
    cnpj,
    razaoSocial: name,
    identificacao: name.slice(0, 40),
    website: 'https://www.exemplo.com.br',
    ddi: '+55',
    telefone: '(11) 3000-0000',
    singulareCompanyCode: '',
    grupoOperacao: 'FIDC Agro',
    dataRegistroCvm: '2023-01-15',
    valorInicial: '10000000',
    posseDocumentos: true,
    perfilTributario: 'Longo prazo',
    tipoCondomino: 'Aberto',
    perfilCota: 'Sênior',
    jurosBoleto: '1,00',
    multaBoleto: '2,00',
    limiteVencimentoMin: '15',
    limiteVencimentoMax: '365',
    bondTypes: [
      { id: 'bt-1', abreviacao: 'NFE', descricao: 'Nota Fiscal Eletrônica', ativo: true },
      { id: 'bt-2', abreviacao: 'DM', descricao: 'Duplicata Mercantil', ativo: true },
      { id: 'bt-3', abreviacao: 'CPR_F', descricao: 'CPR Financeira', ativo: true },
    ],
    carteiraNome: 'Carteira Kobana FIDC',
    carteiraBanco: '341 — Itaú',
    carteiraSlug: 'kobana-fidc',
    carteiraCnab: 'CNAB 400',
    carteiraConta: '99887-1',
    carteiraAgencia: '0001',
    vencimentoFimSemana: true,
    beneficiarioNome: name,
    beneficiarioCep: '01310-100',
    beneficiarioCidade: 'São Paulo',
    beneficiarioUf: 'SP',
    eligibilityTops: [
      { id: 'top-1', tipo: 'CEDENTE', quantidade: 8, concentracaoPct: 30 },
      { id: 'top-2', tipo: 'SACADO', quantidade: 12, concentracaoPct: 25 },
    ],
  };
}

export const fidcs: Fidc[] = [
  {
    id: 'agro25',
    name: 'AGRO 25 FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS',
    cnpj: '58.982.241/0001-63',
    category: 'MONOCLASSE',
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    vencendoHoje: 0,
    vencendoMes: 0,
    confirmacaoPct: 0,
    pl: 0,
    plRef: '20/03/2025',
    plRefAgo: '11 meses atrás',
    carteiraSummaryTitles: 0,
    classes: [],
    cessoes: [],
    sacados: [],
    grupos: makeFidcGrupos('AGRO25'),
    setup: makeFidcSetup('AGRO 25 FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS', '58.982.241/0001-63'),
  },
  {
    id: 'ti-tec',
    name: 'T.I TECNOLOGIA FUNDO DE INVESTIMENTOS',
    cnpj: '53.125.630/0001-59',
    category: 'MULTICLASSE',
    status: 'EM ANDAMENTO',
    carteira: { valor: 23155469.11, titulos: 1818 },
    vencido: { valor: 845703.51, titulos: 150 },
    vencendoHoje: 0,
    vencendoMes: 40000,
    confirmacaoPct: 20.74,
    pl: 16359182.1,
    plRef: '20/03/2025',
    plRefAgo: '11 meses atrás',
    carteiraSummaryTitles: 1818,
    classes: [
      {
        id: 'leite',
        name: 'T.I TECNOLOGIA COMPRA DE LEITE',
        cnpj: '53.125.630/0001-59',
        status: 'EM ANDAMENTO',
        vrNominal: 23155469.11,
        vrAberto: 23075151.44,
        vrPresente: 19001921.4,
        vrVencido: 845703.51,
        titulos: [
          {
            id: 't1',
            numero: '00041287',
            lastro: 'NFE',
            cedente: 'LATICÍNIOS PRADO LTDA',
            cedenteCnpj: '12.345.678/0001-90',
            sacado: 'COOP. AGRO CENTRAL',
            sacadoCnpj: '98.765.432/0001-10',
            emissao: '12/02/2025',
            vencimento: '12/04/2025',
            vrNominal: 154280.5,
            status: 'CONFIRMADO',
            classId: 'leite',
          },
          {
            id: 't2',
            numero: '00041288',
            lastro: 'DM',
            cedente: 'LATICÍNIOS PRADO LTDA',
            cedenteCnpj: '12.345.678/0001-90',
            sacado: 'MERCADO BOM PRECO',
            sacadoCnpj: '23.456.789/0001-22',
            emissao: '12/02/2025',
            vencimento: '20/03/2025',
            vrNominal: 87900.0,
            status: 'VENCIDO',
            classId: 'leite',
          },
          {
            id: 't3',
            numero: '00041289',
            lastro: 'CPR_F',
            cedente: 'FAZENDA SÃO BENTO',
            cedenteCnpj: '34.567.890/0001-33',
            sacado: 'FRIGORÍFICO MINAS',
            sacadoCnpj: '45.678.901/0001-44',
            emissao: '05/03/2025',
            vencimento: '05/05/2025',
            vrNominal: 312450.75,
            status: 'PENDENTE',
            classId: 'leite',
          },
        ],
      },
      {
        id: 'animais',
        name: 'T.I TECNOLOGIA COMPRA DE ANIMAIS',
        cnpj: '53.125.630/0001-59',
        status: 'EM ANDAMENTO',
        vrNominal: 2250359.43,
        vrAberto: 2250359.43,
        vrPresente: 2100000,
        vrVencido: 0,
        titulos: [
          {
            id: 't4',
            numero: '00052001',
            lastro: 'CPR_F',
            cedente: 'AGROPECUÁRIA NOVA ERA',
            cedenteCnpj: '56.789.012/0001-55',
            sacado: 'JBS FRIBOI S.A.',
            sacadoCnpj: '67.890.123/0001-66',
            emissao: '18/02/2025',
            vencimento: '18/06/2025',
            vrNominal: 980000.0,
            status: 'CONFIRMADO',
            classId: 'animais',
          },
          {
            id: 't5',
            numero: '00052002',
            lastro: 'NC',
            cedente: 'AGROPECUÁRIA NOVA ERA',
            cedenteCnpj: '56.789.012/0001-55',
            sacado: 'MARFRIG GLOBAL FOODS',
            sacadoCnpj: '78.901.234/0001-77',
            emissao: '22/02/2025',
            vencimento: '22/05/2025',
            vrNominal: 1270359.43,
            status: 'CONFIRMADO',
            classId: 'animais',
          },
        ],
      },
    ],
    cessoes: makeFidcCessoes('TI'),
    sacados: makeFidcSacados('TI'),
    grupos: makeFidcGrupos('TI'),
    setup: makeFidcSetup('T.I TECNOLOGIA FUNDO DE INVESTIMENTOS', '53.125.630/0001-59'),
  },
  {
    id: 'ceres-btg',
    name: 'CERES BTG URA AGRO 2 FUNDO DE INVESTIMENTO',
    cnpj: '63.326.551/0001-60',
    category: 'MONOCLASSE',
    status: 'EM ANDAMENTO',
    carteira: { valor: 10284647.98, titulos: 1 },
    vencido: { valor: 0, titulos: 0 },
    vencendoHoje: 0,
    vencendoMes: 0,
    confirmacaoPct: 100,
    pl: 10284647.98,
    plRef: '20/03/2025',
    plRefAgo: '11 meses atrás',
    carteiraSummaryTitles: 1,
    classes: [],
    cessoes: makeFidcCessoes('CBTG'),
    sacados: makeFidcSacados('CBTG'),
    grupos: makeFidcGrupos('CBTG'),
    setup: makeFidcSetup('CERES BTG URA AGRO 2 FUNDO DE INVESTIMENTO', '63.326.551/0001-60'),
  },
];

/* ─── Pagamentos (aba "Pagamentos" da tela de detalhe do título) ──── */

export type TipoPagamento =
  | 'Baixa com desconto' | 'Baixa manual' | 'Baixa por exclusão' | 'Baixa por Recompra'
  | 'Baixa por substituição' | 'Baixa por venda' | 'Boleto' | 'Devolução ao cedente'
  | 'Pago pelo cedente' | 'Pago pelo sacado';

export const TIPO_PAGAMENTO_OPTS: TipoPagamento[] = [
  'Baixa com desconto', 'Baixa manual', 'Baixa por exclusão', 'Baixa por Recompra',
  'Baixa por substituição', 'Baixa por venda', 'Boleto', 'Devolução ao cedente',
  'Pago pelo cedente', 'Pago pelo sacado',
];

export interface PagamentoTitulo {
  data: string;
  valorAmortizacao: number;
  tipoPagamento: TipoPagamento;
  jurosRemuneratorio: number;
  jurosMoratorio: number;
  multa: number;
  desconto: number;
  observacao?: string;
  estornado?: boolean;
  justificativaEstorno?: string;
}

export type StatusParcela = 'PAGO' | 'PAGO_PARCIAL_VENCIDO' | 'DESCONHECIDO';
export interface ParcelaCronograma {
  vencimento: string;
  status: StatusParcela;
  totalEsperado: number;
  emAberto: number;
  amortizacao: number;
  juros: number;
}

export interface ConfiguracaoTitulo {
  tipoCalculo: 'Pré-Fixado' | 'Pós-Fixado';
  valorEmissao: number;
  vencimentoFinal: string;
  taxa: string;
  frequenciaTaxa: string;
  tipoCapitalizacao: string;
  baseDias: string;
  fluxoAmortizacao: string;
  fluxoJuros: string;
}

export interface DetalhePagamentos {
  jurosRemuneratorioAberto: number;
  configuracao: ConfiguracaoTitulo;
  pagamentos: PagamentoTitulo[];
  cronograma: ParcelaCronograma[];
}

/** dd/mm/aaaa + N meses -> dd/mm/aaaa */
function addMonths(dateStr: string, months: number): string {
  const [d, m, y] = dateStr.split('/').map(Number);
  const date = new Date(y, (m - 1) + months, d);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Deriva os dados de pagamentos/cronograma de um título para a aba Pagamentos.
 * Tudo mockado a partir dos campos que o título já possui.
 */
export function detalhePagamentos(title: Title): DetalhePagamentos {
  const parcela = title.vrNominal / 5;
  const cronograma: ParcelaCronograma[] = [
    { vencimento: title.emissao, status: 'PAGO', totalEsperado: parcela, emAberto: 0, amortizacao: parcela, juros: 0 },
    { vencimento: addMonths(title.emissao, 1), status: title.status === 'VENCIDO' ? 'PAGO_PARCIAL_VENCIDO' : 'PAGO', totalEsperado: parcela * 1.02, emAberto: title.status === 'VENCIDO' ? parcela * 0.4 : 0, amortizacao: parcela, juros: parcela * 0.02 },
    { vencimento: addMonths(title.emissao, 2), status: 'DESCONHECIDO', totalEsperado: parcela * 1.03, emAberto: parcela * 1.03, amortizacao: parcela, juros: parcela * 0.03 },
    { vencimento: addMonths(title.emissao, 3), status: 'DESCONHECIDO', totalEsperado: parcela * 1.04, emAberto: parcela * 1.04, amortizacao: parcela, juros: parcela * 0.04 },
    { vencimento: title.vencimento, status: 'DESCONHECIDO', totalEsperado: parcela * 1.05, emAberto: parcela * 1.05, amortizacao: parcela, juros: parcela * 0.05 },
  ];

  return {
    jurosRemuneratorioAberto: 0,
    configuracao: {
      tipoCalculo: 'Pré-Fixado',
      valorEmissao: title.vrNominal,
      vencimentoFinal: title.vencimento,
      taxa: '1,85% a.m.',
      frequenciaTaxa: 'Mensal',
      tipoCapitalizacao: 'Composto',
      baseDias: 'M252',
      fluxoAmortizacao: 'Indefinido',
      fluxoJuros: 'Indefinido',
    },
    pagamentos: [],
    cronograma,
  };
}

export function brl(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function num(n: number) {
  return n.toLocaleString('pt-BR');
}
