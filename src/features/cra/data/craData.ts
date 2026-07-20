export type CraTipo = 'MONO CRA' | 'MULTI CRA';
export type CraStatus = 'EM ANDAMENTO' | 'ENCERRADO';
export type TituloStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';

export type CessaoStatus = 'LIQUIDADO' | 'PENDENTE' | 'PARCIAL';

/** Status da cessão (Round) na listagem do veículo */
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
  notificacao: boolean;
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

export interface CraTitulo {
  id: string;
  numero: string;
  tipo: string;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  emissao: string;
  vencimento: string;
  vrNominal: number;
  status: TituloStatus;
  operacaoId: string;
  // Fiscal
  chaveNfe?: string;
  cfop?: string;
  serie?: string;
  modelo?: string;
  // Valores
  vrAquisicao?: number;
  vrPresente?: number;
  vrAberto?: number;
  // Cessão
  cessao?: {
    cessionario: string;
    data: string;
    valor: number;
    status: CessaoStatus;
  };
}

export interface CraOperacao {
  id: string;
  nome: string;
  tipo: CraTipo;
  numeroEmissao: string;
  cessionaria: string;
  prestadorServico: string;
  custodiante: string;
  status: 'EM ANDAMENTO';
  carteira: { valor: number; titulos: number };
  vencido: { valor: number; titulos: number };
  partesRelacionadas: { pct: number; valor: number };
  novosSacados: { pct: number; valor: number };
  valorEmissao: number;
  dataEmissao: string;
  dataInicio: string;
  dataVencimento: string;
  titulos: CraTitulo[];
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

/** Vínculo fund-scoped de grupo empresarial na operação */
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

export interface CraSetup {
  nome: string;
  custodiante: string;
  cessionaria: string;
  prestadorServico: string;
  beneficiarioFinal: string;
  grupoOperacao: string;
  tipoCalculoElegibilidade: string;
  accrual: boolean;
  exigirIe: boolean;
  topSacados: boolean;
  topCedentes: boolean;
  tiposTituloAtivos: boolean;
  entregaFutura: boolean;
  limiteConcentracaoPct: string;
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
  jurosBoleto: string;
  multaBoleto: string;
  eligibilityTops: SetupEligibilityTop[];
}

export interface Cra {
  id: string;
  nome: string;
  cnpj: string;
  cessionaria: string;
  status: CraStatus;
  tipo?: CraTipo;
  operacoes: CraOperacao[];
  cessoes: Cessao[];
  sacados: Sacado[];
  grupos: GrupoEmpresarialVinculo[];
  setup: CraSetup;
}

export function brl(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000)
      return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (Math.abs(n) >= 1_000)
      return `R$ ${(n / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat('pt-BR').format(n);
}

function makeTitulos(prefix: string, operacaoId: string): CraTitulo[] {
  return [
    {
      id: `${prefix}-t1`, numero: `${prefix}-001`, tipo: 'CPR-F',
      cedente: 'Fazenda São João', cedenteCnpj: '12.345.678/0001-99',
      sacado: 'Exportações Agro LTDA', sacadoCnpj: '98.765.432/0001-10',
      emissao: '2024-01-15', vencimento: '2025-01-15', vrNominal: 450_000,
      status: 'CONFIRMADO', operacaoId,
      chaveNfe: '35240112345678000199550010000001011234567890',
      cfop: '6107', serie: '1', modelo: '55',
      vrAquisicao: 441_000, vrPresente: 435_200, vrAberto: 0,
      cessao: { cessionario: 'CERES SECURIZADORA S/A', data: '2024-01-16', valor: 441_000, status: 'LIQUIDADO' },
    },
    {
      id: `${prefix}-t2`, numero: `${prefix}-002`, tipo: 'CDA-WA',
      cedente: 'Agropecuária Bela Vista', cedenteCnpj: '11.222.333/0001-44',
      sacado: 'Coop. Agroindustrial Sul', sacadoCnpj: '55.666.777/0001-88',
      emissao: '2024-02-01', vencimento: '2025-02-01', vrNominal: 320_000,
      status: 'CONFIRMADO', operacaoId,
      chaveNfe: '35240211222333000144550010000002021234567890',
      cfop: '6101', serie: '1', modelo: '55',
      vrAquisicao: 313_600, vrPresente: 309_800, vrAberto: 0,
      cessao: { cessionario: 'CERES SECURIZADORA S/A', data: '2024-02-02', valor: 313_600, status: 'LIQUIDADO' },
    },
    {
      id: `${prefix}-t3`, numero: `${prefix}-003`, tipo: 'CDCA',
      cedente: 'Produtor Rural Santos', cedenteCnpj: '44.555.666/0001-77',
      sacado: 'Cerealista Norte LTDA', sacadoCnpj: '22.333.444/0001-55',
      emissao: '2024-03-10', vencimento: '2024-12-10', vrNominal: 185_000,
      status: 'VENCIDO', operacaoId,
      chaveNfe: '35240344555666000177550010000003031234567890',
      cfop: '6107', serie: '1', modelo: '55',
      vrAquisicao: 181_300, vrPresente: 183_700, vrAberto: 185_000,
      cessao: { cessionario: 'CERES SECURIZADORA S/A', data: '2024-03-11', valor: 181_300, status: 'PENDENTE' },
    },
    {
      id: `${prefix}-t4`, numero: `${prefix}-004`, tipo: 'CPR-F',
      cedente: 'Grupo Agroville', cedenteCnpj: '33.444.555/0001-22',
      sacado: 'Distribuidora Campo Verde', sacadoCnpj: '77.888.999/0001-11',
      emissao: '2024-04-05', vencimento: '2025-04-05', vrNominal: 610_000,
      status: 'PENDENTE', operacaoId,
      chaveNfe: '35240433444555000122550010000004041234567890',
      cfop: '6108', serie: '2', modelo: '55',
      vrAquisicao: 597_800, vrPresente: 591_500, vrAberto: 610_000,
      cessao: { cessionario: 'CERES SECURIZADORA S/A', data: '2024-04-06', valor: 597_800, status: 'PENDENTE' },
    },
    {
      id: `${prefix}-t5`, numero: `${prefix}-005`, tipo: 'CDCA',
      cedente: 'Fazenda Boa Terra', cedenteCnpj: '66.777.888/0001-33',
      sacado: 'Tradings do Brasil S/A', sacadoCnpj: '11.223.334/0001-56',
      emissao: '2024-05-20', vencimento: '2025-05-20', vrNominal: 390_000,
      status: 'CONFIRMADO', operacaoId,
      chaveNfe: '35240566777888000133550010000005051234567890',
      cfop: '6101', serie: '1', modelo: '55',
      vrAquisicao: 382_200, vrPresente: 378_900, vrAberto: 0,
      cessao: { cessionario: 'CERES SECURIZADORA S/A', data: '2024-05-21', valor: 382_200, status: 'LIQUIDADO' },
    },
  ];
}

function makeCessoes(prefix: string): Cessao[] {
  return [
    {
      id: `${prefix}-ces-1`,
      nome: `Cessão ${prefix} — Desembolso Inicial`,
      data: '2024-01-15',
      tipo: 'DESEMBOLSO',
      valorAberto: 1_250_000,
      status: 'ABERTA',
      taxaCessao: 1.85,
      valorPresente: 1_180_000,
      valorTotal: 1_300_000,
      temTermo: true,
      cedente: 'Fazenda São João',
      certificadorEmail: true,
      indicadorTaxa: 'CDI',
      operadorTaxa: 'Percentual',
      frequenciaTaxa: 'Mensal',
      capitalizacao: 'Composto',
    },
    {
      id: `${prefix}-ces-2`,
      nome: `Cessão ${prefix} — Composição de Garantia`,
      data: '2024-03-20',
      tipo: 'COMPOSIÇÃO DE GARANTIA',
      valorAberto: 0,
      status: 'FECHADA',
      taxaCessao: 2.1,
      valorPresente: 890_000,
      valorTotal: 920_000,
      temTermo: true,
      cedente: 'Agropecuária Bela Vista',
      certificadorEmail: true,
    },
    {
      id: `${prefix}-ces-3`,
      nome: `Cessão ${prefix} — Desembolso Parcial`,
      data: '2024-06-10',
      tipo: 'DESEMBOLSO PARCIAL',
      valorAberto: 450_000,
      status: 'EM ANDAMENTO',
      taxaCessao: 1.5,
      valorPresente: 420_000,
      valorTotal: 480_000,
      temTermo: false,
      cedente: 'Grupo Agroville',
      certificadorEmail: false,
    },
  ];
}

function makeSacados(prefix: string): Sacado[] {
  return [
    {
      id: `${prefix}-sac-1`,
      documento: '98.765.432/0001-10',
      nome: 'Exportações Agro LTDA',
      tipo: 'Standard',
      limite: 5_000_000,
      especial: false,
      parteRelacionada: false,
      grupoEconomico: 'Grupo Ceres',
      notificacao: true,
      pessoaFisica: false,
      nomeFantasia: 'Exportações Agro',
      inscricaoEstadual: '172.16.1.3',
      atividadePrincipal: 'Comércio atacadista de cereais',
      metodoNotificacao: 'E-mail',
      contatos: [
        { id: 'c1', nome: 'Ana Silva', email: 'ana@exportacoesagro.com.br', ddi: '+55', telefone: '(11) 98765-4321', principal: true },
        { id: 'c2', nome: 'Carlos Mendes', email: 'carlos@exportacoesagro.com.br', ddi: '+55', telefone: '(11) 91234-5678' },
      ],
      enderecos: [
        { id: 'e1', cep: '01310-100', localidade: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', pais: 'Brasil' },
      ],
      historico: [
        { id: 'h1', datetime: '15/01/2024 10:32', message: 'Sacado cadastrado no veículo', createdBy: 'sistema' },
        { id: 'h2', datetime: '20/02/2024 14:15', message: 'Limite atualizado para R$ 5.000.000', createdBy: 'eduardo.santos' },
      ],
    },
    {
      id: `${prefix}-sac-2`,
      documento: '55.666.777/0001-88',
      nome: 'Coop. Agroindustrial Sul',
      tipo: 'Elegível',
      limite: 2_500_000,
      especial: true,
      parteRelacionada: false,
      grupoEconomico: 'Semeagro',
      notificacao: true,
      pessoaFisica: false,
      nomeFantasia: 'Coopagro Sul',
      metodoNotificacao: 'WhatsApp',
      contatos: [
        { id: 'c1', nome: 'Maria Souza', email: 'maria@coopagro.com.br', ddi: '+55', telefone: '(41) 99999-1111', principal: true },
      ],
      enderecos: [
        { id: 'e1', cep: '80010-000', localidade: 'Rua XV de Novembro', numero: '500', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR', pais: 'Brasil' },
      ],
      historico: [
        { id: 'h1', datetime: '01/02/2024 09:00', message: 'Sacado marcado como especial', createdBy: 'eduardo.santos' },
      ],
    },
    {
      id: `${prefix}-sac-3`,
      documento: '123.456.789-00',
      nome: 'José da Silva Produtor',
      tipo: 'Novo',
      limite: 300_000,
      especial: false,
      parteRelacionada: true,
      grupoEconomico: 'Semeagro',
      notificacao: false,
      pessoaFisica: true,
      inscricaoProdutorRural: 'PR-123456',
      metodoNotificacao: 'Telefone',
      contatos: [
        { id: 'c1', nome: 'José da Silva', email: 'jose.silva@email.com', ddi: '+55', telefone: '(44) 98888-2222', principal: true },
      ],
      enderecos: [
        { id: 'e1', cep: '87020-000', localidade: 'Estrada Rural Km 12', numero: 's/n', bairro: 'Zona Rural', cidade: 'Maringá', uf: 'PR', pais: 'Brasil' },
      ],
      historico: [
        { id: 'h1', datetime: '10/03/2024 16:45', message: 'Sacado cadastrado como parte relacionada', createdBy: 'sistema' },
      ],
    },
    {
      id: `${prefix}-sac-4`,
      documento: '22.333.444/0001-55',
      nome: 'Cerealista Norte LTDA',
      tipo: 'Standard',
      limite: 1_800_000,
      especial: false,
      parteRelacionada: false,
      grupoEconomico: 'Grupo Ceres',
      notificacao: true,
      pessoaFisica: false,
      nomeFantasia: 'Cerealista Norte',
      metodoNotificacao: 'E-mail',
      contatos: [],
      enderecos: [
        { id: 'e1', cep: '78000-000', localidade: 'Av. do CPA', numero: '200', bairro: 'Centro-Norte', cidade: 'Cuiabá', uf: 'MT', pais: 'Brasil' },
      ],
      historico: [],
    },
  ];
}

function makeGrupos(prefix: string): GrupoEmpresarialVinculo[] {
  return [
    {
      id: `${prefix}-grp-1`,
      nome: 'Grupo Ceres',
      statusOperacao: 'APROVADO',
      apto: true,
      masterContractDate: '2024-01-15',
      masterContractUrl: '#contrato-mae-ceres.pdf',
      limite: 50_000_000,
      riscoTomado: 12_450_000,
      faturamento: 180_000_000,
      dataCadastro: '2023-05-10',
      gerente: 'Ana Paula',
      cedentes: [
        { id: 'ced-1', documento: '04.851.443/0001-10', nome: 'Ceres Agronegócios S.A.', email: 'contato@ceres.com.br', cidadeUf: 'São Paulo-SP', tipo: 'PJ' },
        { id: 'ced-2', documento: '12.345.678/0001-90', nome: 'Ceres Logística LTDA', email: 'log@ceres.com.br', cidadeUf: 'Campinas-SP', tipo: 'PJ' },
        { id: 'ced-3', documento: '987.654.321-00', nome: 'João Produtor Rural', email: 'joao@email.com', cidadeUf: 'Ribeirão Preto-SP', tipo: 'PF' },
      ],
      partesRelacionadas: [
        { id: 'pr-1', documento: '11.222.333/0001-44', nome: 'Ceres Participações', tipos: 'Controladora' },
      ],
      documentos: [
        { id: 'doc-1', nome: 'Contrato Social', tipo: 'Societário', data: '10/05/2023' },
        { id: 'doc-2', nome: 'Contrato Mãe', tipo: 'Operacional', data: '15/01/2024' },
      ],
      contas: [
        { id: 'cta-1', banco: '341 — Itaú', agencia: '1234', conta: '56789-0', principal: true },
        { id: 'cta-2', banco: '001 — BB', agencia: '0456', conta: '112233-4' },
      ],
      faturamentos: [
        { id: 'fat-1', ano: 2024, valor: 180_000_000 },
        { id: 'fat-2', ano: 2023, valor: 155_000_000 },
      ],
      garantias: [
        { id: 'gar-1', tipo: 'Alienação fiduciária', dataInicio: '01/01/2024', dataFim: '31/12/2026', valor: 20_000_000, cobertura: '40%', status: 'Ativa' },
      ],
      historico: [
        { id: 'gh-1', datetime: '10/05/2023 09:00', message: 'Grupo vinculado à operação', createdBy: 'sistema' },
        { id: 'gh-2', datetime: '15/01/2024 11:20', message: 'Contrato mãe anexado', createdBy: 'eduardo.santos' },
        { id: 'gh-3', datetime: '15/01/2024 11:25', message: 'Status alterado para Apto', createdBy: 'eduardo.santos' },
      ],
    },
    {
      id: `${prefix}-grp-2`,
      nome: 'Semeagro',
      statusOperacao: 'EM ANÁLISE',
      apto: false,
      masterContractDate: undefined,
      masterContractUrl: undefined,
      limite: 25_000_000,
      riscoTomado: 4_987_000,
      faturamento: 92_000_000,
      dataCadastro: '2024-02-01',
      gerente: 'Carlos Lima',
      cedentes: [
        { id: 'ced-1', documento: '12.345.678/0001-01', nome: 'Semeagro S.A.', cidadeUf: 'Curitiba-PR', tipo: 'PJ' },
      ],
      partesRelacionadas: [],
      documentos: [
        { id: 'doc-1', nome: 'Cartão CNPJ', tipo: 'Cadastral', data: '01/02/2024' },
      ],
      contas: [
        { id: 'cta-1', banco: '237 — Bradesco', agencia: '9876', conta: '1122-3', principal: true },
      ],
      faturamentos: [
        { id: 'fat-1', ano: 2024, valor: 92_000_000 },
      ],
      garantias: [],
      historico: [
        { id: 'gh-1', datetime: '01/02/2024 14:00', message: 'Grupo vinculado — aguardando contrato mãe', createdBy: 'sistema' },
      ],
    },
    {
      id: `${prefix}-grp-3`,
      nome: 'Raízen',
      statusOperacao: 'PENDENTE',
      apto: false,
      masterContractDate: '2023-11-20',
      masterContractUrl: '#contrato-mae-raizen.pdf',
      limite: 80_000_000,
      riscoTomado: 0,
      faturamento: 420_000_000,
      dataCadastro: '2023-11-01',
      gerente: 'Marina Costa',
      cedentes: [
        { id: 'ced-1', documento: '08.070.508/0001-78', nome: 'Raízen Energia S.A.', cidadeUf: 'Piracicaba-SP', tipo: 'PJ' },
      ],
      partesRelacionadas: [],
      documentos: [],
      contas: [],
      faturamentos: [
        { id: 'fat-1', ano: 2024, valor: 420_000_000 },
      ],
      garantias: [],
      historico: [
        { id: 'gh-1', datetime: '01/11/2023 10:00', message: 'Grupo cadastrado', createdBy: 'sistema' },
      ],
    },
  ];
}

function makeSetup(nome: string, cessionaria: string): CraSetup {
  return {
    nome,
    custodiante: 'B3',
    cessionaria,
    prestadorServico: 'Oliveira Trust',
    beneficiarioFinal: cessionaria,
    grupoOperacao: 'Agro padrão',
    tipoCalculoElegibilidade: 'Valor presente',
    accrual: true,
    exigirIe: false,
    topSacados: true,
    topCedentes: true,
    tiposTituloAtivos: true,
    entregaFutura: false,
    limiteConcentracaoPct: '25',
    limiteVencimentoMin: '30',
    limiteVencimentoMax: '360',
    bondTypes: [
      { id: 'bt-1', abreviacao: 'NFE', descricao: 'Nota Fiscal Eletrônica', ativo: true },
      { id: 'bt-2', abreviacao: 'CPR-F', descricao: 'CPR Financeira', ativo: true },
      { id: 'bt-3', abreviacao: 'DM', descricao: 'Duplicata Mercantil', ativo: false },
      { id: 'bt-4', abreviacao: 'NC', descricao: 'Nota Comercial', ativo: true },
    ],
    carteiraNome: `Carteira ${nome}`,
    carteiraBanco: '341 — Itaú',
    carteiraSlug: 'kobana-cra',
    carteiraCnab: 'CNAB 400',
    carteiraConta: '12345-6',
    carteiraAgencia: '0001',
    vencimentoFimSemana: true,
    beneficiarioNome: cessionaria,
    beneficiarioCep: '01310-100',
    beneficiarioCidade: 'São Paulo',
    beneficiarioUf: 'SP',
    jurosBoleto: '1,00',
    multaBoleto: '2,00',
    eligibilityTops: [
      { id: 'top-1', tipo: 'CEDENTE', quantidade: 10, concentracaoPct: 25 },
      { id: 'top-2', tipo: 'SACADO', quantidade: 15, concentracaoPct: 20 },
    ],
  };
}

export const cras: Cra[] = [
  {
    id: 'cra-semeagro',
    nome: 'CRA Semeagro',
    cnpj: '41.534.746/0001-62',
    cessionaria: 'CERES SECURIZADORA S/A',
    status: 'EM ANDAMENTO',
    operacoes: [
      {
        id: 'sea-op-4',
        nome: '4ª Emissão CRA Semeagro',
        tipo: 'MONO CRA',
        numeroEmissao: '4ª',
        cessionaria: 'CERES SECURIZADORA S/A',
        prestadorServico: 'Oliveira Trust',
        custodiante: 'B3',
        status: 'EM ANDAMENTO',
        carteira: { valor: 4_987_394.37, titulos: 34 },
        vencido: { valor: 4_987_394.37, titulos: 34 },
        partesRelacionadas: { pct: 98.3, valor: 1_081_494.08 },
        novosSacados: { pct: 53.9, valor: 889_000.01 },
        valorEmissao: 9_800_000,
        dataEmissao: '2023-06-01',
        dataInicio: '2023-06-15',
        dataVencimento: '2026-06-15',
        titulos: makeTitulos('SEA4', 'sea-op-4'),
      },
      {
        id: 'sea-op-5',
        nome: '5ª Emissão CRA Semeagro',
        tipo: 'MULTI CRA',
        numeroEmissao: '5ª',
        cessionaria: 'CERES SECURIZADORA S/A',
        prestadorServico: 'Oliveira Trust',
        custodiante: 'B3',
        status: 'EM ANDAMENTO',
        carteira: { valor: 2_150_000, titulos: 18 },
        vencido: { valor: 120_000, titulos: 2 },
        partesRelacionadas: { pct: 45.2, valor: 972_300 },
        novosSacados: { pct: 28.1, valor: 604_150 },
        valorEmissao: 3_000_000,
        dataEmissao: '2024-03-01',
        dataInicio: '2024-03-15',
        dataVencimento: '2027-03-15',
        titulos: makeTitulos('SEA5', 'sea-op-5'),
      },
    ],
    cessoes: makeCessoes('SEA'),
    sacados: makeSacados('SEA'),
    grupos: makeGrupos('SEA'),
    setup: makeSetup('CRA Semeagro', 'CERES SECURIZADORA S/A'),
  },
  {
    id: 'cra-ceres-agro',
    nome: 'CRA Ceres Agro',
    cnpj: '41.534.746/0001-62',
    cessionaria: 'CERES SECURIZADORA S/A',
    status: 'EM ANDAMENTO',
    operacoes: [
      {
        id: 'ca-op-7',
        nome: '7ª Emissão CRA Ceres Agro',
        tipo: 'MULTI CRA',
        numeroEmissao: '7ª',
        cessionaria: 'CERES SECURIZADORA S/A',
        prestadorServico: 'Vórtx',
        custodiante: 'Cetip',
        status: 'EM ANDAMENTO',
        carteira: { valor: 12_450_000, titulos: 87 },
        vencido: { valor: 340_000, titulos: 3 },
        partesRelacionadas: { pct: 22.4, valor: 2_788_800 },
        novosSacados: { pct: 31.2, valor: 3_884_400 },
        valorEmissao: 15_000_000,
        dataEmissao: '2023-09-01',
        dataInicio: '2023-09-20',
        dataVencimento: '2027-09-20',
        titulos: makeTitulos('CA7', 'ca-op-7'),
      },
    ],
    cessoes: makeCessoes('CA'),
    sacados: makeSacados('CA'),
    grupos: makeGrupos('CA'),
    setup: makeSetup('CRA Ceres Agro', 'CERES SECURIZADORA S/A'),
  },
  {
    id: 'cra-btg-agro',
    nome: 'CRA BTG Agro',
    cnpj: '29.871.345/0001-14',
    cessionaria: 'BTG SECURIZADORA S/A',
    status: 'EM ANDAMENTO',
    operacoes: [
      {
        id: 'btg-op-2',
        nome: '2ª Emissão CRA BTG Agro',
        tipo: 'MONO CRA',
        numeroEmissao: '2ª',
        cessionaria: 'BTG SECURIZADORA S/A',
        prestadorServico: 'BRL Trust',
        custodiante: 'B3',
        status: 'EM ANDAMENTO',
        carteira: { valor: 8_200_000, titulos: 55 },
        vencido: { valor: 615_000, titulos: 5 },
        partesRelacionadas: { pct: 67.8, valor: 5_559_600 },
        novosSacados: { pct: 15.6, valor: 1_279_200 },
        valorEmissao: 10_000_000,
        dataEmissao: '2024-01-10',
        dataInicio: '2024-01-25',
        dataVencimento: '2027-01-25',
        titulos: makeTitulos('BTG2', 'btg-op-2'),
      },
    ],
    cessoes: makeCessoes('BTG'),
    sacados: makeSacados('BTG'),
    grupos: makeGrupos('BTG'),
    setup: makeSetup('CRA BTG Agro', 'BTG SECURIZADORA S/A'),
  },
];

export interface GrupoEmpresarial {
  nome: string;
  cnpj: string;
}

export const gruposEmpresariais: GrupoEmpresarial[] = [
  { nome: 'Grupo Ceres',                cnpj: '04.851.443/0001-10' },
  { nome: 'Semeagro',                   cnpj: '12.345.678/0001-01' },
  { nome: 'BTG Agro',                   cnpj: '30.306.294/0001-45' },
  { nome: 'Raízen',                     cnpj: '08.070.508/0001-78' },
  { nome: 'Cargill Brasil',             cnpj: '60.498.706/0001-44' },
  { nome: 'JBS Agro',                   cnpj: '02.916.265/0001-60' },
  { nome: 'Marfrig Agro',              cnpj: '03.853.896/0001-40' },
  { nome: 'São Martinho',               cnpj: '51.466.860/0001-56' },
  { nome: 'Tereos',                     cnpj: '72.779.265/0001-20' },
  { nome: 'Amaggi Group',              cnpj: '37.527.352/0001-34' },
  { nome: 'SLC Agrícola',              cnpj: '04.811.636/0001-60' },
  { nome: 'BrasilAgro',                cnpj: '07.628.528/0001-06' },
  { nome: 'Boa Safra Sementes',        cnpj: '17.779.019/0001-04' },
  { nome: 'Lavoro',                    cnpj: '34.950.199/0001-10' },
  { nome: 'Vittia',                    cnpj: '12.789.953/0001-77' },
  { nome: 'Nutrien Soluções Agrícolas', cnpj: '26.674.547/0001-04' },
  { nome: 'Corteva Agriscience',       cnpj: '15.476.384/0001-48' },
  { nome: 'Bayer CropScience',         cnpj: '02.352.069/0001-97' },
  { nome: 'BASF Agricultural',         cnpj: '58.432.246/0001-82' },
  { nome: 'Mosaic Fertilizantes',      cnpj: '09.277.487/0001-44' },
  { nome: 'Heringer',                  cnpj: '92.887.190/0001-03' },
  { nome: 'Timac Agro',               cnpj: '23.145.612/0001-55' },
  { nome: 'Copercampos',              cnpj: '83.980.679/0001-06' },
  { nome: 'Coamo',                    cnpj: '75.593.261/0001-05' },
  { nome: 'Castrolanda',              cnpj: '76.789.457/0001-48' },
];
