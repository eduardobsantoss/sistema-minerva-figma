/**
 * Cadastro de Rating — registro global (PART 2).
 */
export interface Rating {
  id: string;
  nome: string;
  taxa: number;
  criadoEm: string;
}

export const RATINGS_SEED: Rating[] = [
  { id: 'rating-1', nome: 'A++', taxa: 0.85, criadoEm: '12/01/2025' },
  { id: 'rating-2', nome: 'A+', taxa: 1.10, criadoEm: '12/01/2025' },
  { id: 'rating-3', nome: 'A', taxa: 1.45, criadoEm: '12/01/2025' },
  { id: 'rating-4', nome: 'A-', taxa: 1.80, criadoEm: '03/02/2025' },
  { id: 'rating-5', nome: 'B++', taxa: 2.30, criadoEm: '03/02/2025' },
  { id: 'rating-6', nome: 'B', taxa: 2.95, criadoEm: '18/03/2025' },
];

export function fmtPct(n: number): string {
  return `${n.toFixed(2).replace('.', ',')}%`;
}

export type StatusOperacao = 'Normal' | 'Terceiro' | 'Pré-Recovery' | 'Recovery' | 'Especial' | 'Special-Sit';
export const STATUS_OPERACAO_OPTS: StatusOperacao[] = ['Normal', 'Terceiro', 'Pré-Recovery', 'Recovery', 'Especial', 'Special-Sit'];

export type StatusGrupoPizza = 'Normal' | 'Recovery' | 'Especial' | 'Terceiro';

export function statusGrupoPizza(s: StatusOperacao): StatusGrupoPizza {
  switch (s) {
    case 'Normal': return 'Normal';
    case 'Terceiro': return 'Terceiro';
    case 'Pré-Recovery':
    case 'Recovery': return 'Recovery';
    case 'Especial':
    case 'Special-Sit': return 'Especial';
  }
}

export function statusOperacaoColor(s: StatusOperacao): string {
  switch (s) {
    case 'Normal': return 'var(--success-base)';
    case 'Terceiro': return 'var(--gci-base)';
    case 'Pré-Recovery': return 'var(--agro-base)';
    case 'Recovery': return 'var(--warning-base)';
    case 'Especial': return 'var(--neutral-500)';
    case 'Special-Sit': return 'var(--danger-base)';
  }
}

export type ParecerStatus = 'CONFORME' | 'EXPIRANDO' | 'EXPIRADO' | 'AUSENTE';

export function parecerLabel(s: ParecerStatus): string {
  switch (s) {
    case 'CONFORME': return 'Em conformidade';
    case 'EXPIRANDO': return 'Prestes a expirar';
    case 'EXPIRADO': return 'Expirado';
    case 'AUSENTE': return 'Não possui';
  }
}

export function parecerColor(s: ParecerStatus): string {
  switch (s) {
    case 'CONFORME': return 'var(--success-base)';
    case 'EXPIRANDO': return 'var(--warning-base)';
    case 'EXPIRADO': return 'var(--danger-base)';
    case 'AUSENTE': return 'var(--text-disabled)';
  }
}

export type TipoCliente = 'Monocedente' | 'Multicedente';
export const TIPO_CLIENTE_OPTS: TipoCliente[] = ['Monocedente', 'Multicedente'];

export interface Gerente {
  id: string;
  nome: string;
  documento: string;
  cidade: string;
  uf: string;
  telefone: string;
}

export const GERENTES_SEED: Gerente[] = [
  { id: 'ger-1', nome: 'Carlos Mendes', documento: '123.456.789-00', cidade: 'Goiânia', uf: 'GO', telefone: '(62) 99876-5432' },
  { id: 'ger-2', nome: 'Fernanda Rocha', documento: '234.567.890-11', cidade: 'São Paulo', uf: 'SP', telefone: '(11) 98765-4321' },
  { id: 'ger-3', nome: 'Rodrigo Alves', documento: '345.678.901-22', cidade: 'Rio Verde', uf: 'GO', telefone: '(64) 99123-4567' },
  { id: 'ger-4', nome: 'Juliana Prado', documento: '456.789.012-33', cidade: 'Cuiabá', uf: 'MT', telefone: '(65) 99234-5678' },
  { id: 'ger-5', nome: 'Marcelo Nogueira', documento: '567.890.123-44', cidade: 'Campo Grande', uf: 'MS', telefone: '(67) 99345-6789' },
  { id: 'ger-6', nome: 'Patrícia Lima', documento: '678.901.234-55', cidade: 'Brasília', uf: 'DF', telefone: '(61) 99456-7890' },
];

export function gerentePorNome(nome: string): Gerente | undefined {
  return GERENTES_SEED.find((g) => g.nome === nome);
}

export interface GrupoEmpresarial {
  id: string;
  documento: string;
  nome: string;
  tipoCliente: TipoCliente;
  statusOperacao: StatusOperacao;
  limite: number;
  limiteAutoatendimento: number;
  riscoTotal: number;
  riscoUraStt: number;
  gerente: string;
  vencimentoLimite: string | null;
  vencimentoParecer: string | null;
  parecerCredito: ParecerStatus;
  rating: string;
  valorVencido: number;
}

export type PapelParteRelacionada = 'Avalista' | 'Sócio' | 'Representante Legal';

export interface ParteRelacionada {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  papel: PapelParteRelacionada;
  estadoCivil: string;
}

export const AGRUPAMENTO_LIMITE_OPTS = [
  'Operações Monocedente',
  'Operações Multicedente',
  'Operações Confina',
  'Operações Agrovita',
  'Operações Securitizações',
] as const;

export type AgrupamentoLimite = (typeof AGRUPAMENTO_LIMITE_OPTS)[number];

export const PRODUTO_LIMITE_OPTS = [
  'Desconto Duplicata',
  'Contrato CCB',
  'Contrato CPRF',
  'Contrato NC',
] as const;

export type ProdutoLimite = (typeof PRODUTO_LIMITE_OPTS)[number];

export interface LimiteProdutoRow {
  id: string;
  agrupamento: AgrupamentoLimite;
  produto: ProdutoLimite;
  valor: number;
  vencimento: string;
}

export interface ParametrizacaoLimite {
  parecerCreditoArquivo: string;
  parecerAtualizadoEm: string | null;
  parecerProximoVencimento: string | null;
  indicativoRating: string;
  reparametrizacaoData: string | null;
  limites: LimiteProdutoRow[];
}

export const VEICULO_OPERACAO_OPTS = [
  'CRA CERES',
  'FIDC URA',
  'FIDC CULTURA',
  'CRA ARTESANAL',
  'CRA BTG',
  'FIDC AGRO 25',
] as const;

export interface ParametrizacaoAutoatendimento {
  limiteOperacoesAutomaticas: number;
  taxaFee: number;
  taxaRisco: number;
  taxaCessaoPadrao: number;
  veiculoOperacaoPreferencial: string;
}

export interface ExcecaoConcentracao {
  id: string;
  sacadoDocumento: string;
  sacadoNome: string;
  percentual: number;
}

export interface AvalistaObrigatorio {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  estadoCivil: string;
  conjugeAnuente: boolean;
  obrigatorio: boolean;
}

export type FrequenciaLaudo = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
export const FREQUENCIA_LAUDO_OPTS: FrequenciaLaudo[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];

export interface ParametrizacaoGeral {
  confirmacaoPreDesembolsoPct: number;
  prazoConfirmacaoTitulosDias: number;
  confirmacaoClientesNovosPct: number;
  confirmacaoClientesAntigosPct: number;
  notificacaoSacadosPct: number;
  prazoConfirmacaoSacadosDias: number;
  concentracaoMaximaSacadoPct: number;
  nfEntregaFuturaPodeOperar: boolean;
  nfEntregaFuturaOperacaoMaximaPct: number;
  creditoPreAprovacaoSacado: boolean;
  validadeSerasaSacadoDias: number;
  validadeSerasaAvalistaDias: number;
  validadeSerasaCedenteDias: number;
  necessitaAvalConjuge: boolean;
  exigeAnuenciaConjuge: boolean;
  aceitaRestritivoFinanceiroCedente: boolean;
  valorRestritivoAceitoCedente: number;
  aceitaRestritivoSocios: boolean;
  valorRestritivoSocios: number;
  laudoAtivoAntesDesembolso: boolean;
  laudoFrequencia: FrequenciaLaudo;
  afImovelPrazoLaudoPosComiteDias: number;
  afImovelAprovadoSoEscrituraPublica: boolean;
  protocoloCpr: boolean;
  protocoloGarantiaImovel: boolean;
  excecoesConcentracao: ExcecaoConcentracao[];
  avalistas: AvalistaObrigatorio[];
}

export interface GarantiaRow {
  id: string;
  tipo: string;
  percentualExigido: number;
  prazoLaudoDias: number;
  frequenciaLaudo: FrequenciaLaudo;
  exigeEscrituraPublica: boolean;
  exigeProtocolo: boolean;
}

export interface ParametrizacaoGarantia {
  requerConfirmacaoTitulos: boolean;
  garantiasObrigatorias: boolean;
  percentualGarantia: number;
  garantias: GarantiaRow[];
}

export interface Parametrizacoes {
  limite: ParametrizacaoLimite;
  autoatendimento: ParametrizacaoAutoatendimento;
  geral: ParametrizacaoGeral;
  garantia: ParametrizacaoGarantia;
}

export type TipoCedente = 'Pessoa Física' | 'Pessoa Jurídica';
export const TIPO_CEDENTE_OPTS: TipoCedente[] = ['Pessoa Física', 'Pessoa Jurídica'];

export type StatusCedente = 'Apto' | 'Inapto';

export function statusCedenteColor(s: StatusCedente): string {
  return s === 'Apto' ? 'var(--success-base)' : 'var(--danger-base)';
}

export interface ContatoCedente {
  id: string;
  nome: string;
  email: string;
  ddi: string;
  telefone: string;
}

export interface EnderecoCedente {
  id: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  uf: string;
  pais: string;
}

export interface DocumentoCedente {
  id: string;
  nome: string;
  tipo: string;
}

export const NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira'];
export const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
export const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
export const PAIS_OPTS = ['Brasil', 'Argentina', 'Paraguai', 'Uruguai', 'Estados Unidos'];
export const DDI_OPTS = ['+55', '+54', '+595', '+598', '+1'];
export const TIPO_ARQUIVO_OPTS = ['Contrato Social', 'Comprovante de Endereço', 'RG/CNH', 'Procuração', 'Balanço', 'Outros'];

export interface Cedente {
  id: string;
  documento: string;
  nome: string;
  email: string | null;
  cidade: string;
  uf: string;
  tipo: TipoCedente;
  status: StatusCedente;
  qtdTitulosAberto: number;
  riscoTomado: number;
  dataAbertura: string;
  rg?: string;
  inscricaoProdutorRural?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  profissao?: string;
  estadoCivil?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  tipoEmpresa?: string;
  porte?: string;
  atividadePrincipal?: string;
  naturezaJuridica?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  contatos: ContatoCedente[];
  enderecos: EnderecoCedente[];
  documentos: DocumentoCedente[];
}

export interface HistoricoEvento {
  id: string;
  datetime: string;
  descricao: string;
}

export interface DetalheGrupo {
  partesRelacionadas: ParteRelacionada[];
  parametrizacoes: Parametrizacoes;
  cedentes: Cedente[];
  historico: HistoricoEvento[];
}

export function parseDateBR(d: string | null): number {
  if (!d) return NaN;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

export function diasEntre(dataBR: string | null, ref = new Date()): number {
  const t = parseDateBR(dataBR);
  if (Number.isNaN(t)) return NaN;
  const refMs = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate()).getTime();
  return Math.floor((refMs - t) / (1000 * 60 * 60 * 24));
}

export function isLimiteVencido(vencimento: string | null, ref = new Date()): boolean {
  const t = parseDateBR(vencimento);
  if (Number.isNaN(t)) return false;
  const refMs = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate()).getTime();
  return t < refMs;
}

export function isProximoAVencer(vencimento: string | null, dias = 30, ref = new Date()): boolean {
  const t = parseDateBR(vencimento);
  if (Number.isNaN(t)) return false;
  const refMs = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate()).getTime();
  const diff = Math.floor((t - refMs) / (1000 * 60 * 60 * 24));
  return diff >= 0 && diff <= dias;
}

export function temRiscoAtivo(g: GrupoEmpresarial): boolean {
  return g.riscoTotal > 0;
}

function buildLimites(grupo: GrupoEmpresarial): LimiteProdutoRow[] {
  const agrup = (grupo.tipoCliente === 'Monocedente' ? 'Operações Monocedente' : 'Operações Multicedente') as AgrupamentoLimite;
  return [
    { id: `lim-${grupo.id}-1`, agrupamento: agrup, produto: 'Desconto Duplicata', valor: grupo.limite * 0.5, vencimento: grupo.vencimentoLimite ?? '31/12/2026' },
    { id: `lim-${grupo.id}-2`, agrupamento: agrup, produto: 'Contrato CCB', valor: grupo.limite * 0.3, vencimento: grupo.vencimentoLimite ?? '31/12/2026' },
    { id: `lim-${grupo.id}-3`, agrupamento: 'Operações Confina', produto: 'Contrato CPRF', valor: grupo.limite * 0.2, vencimento: grupo.vencimentoLimite ?? '31/12/2026' },
  ].filter((l) => l.valor > 0);
}

function buildPartesRelacionadas(grupo: GrupoEmpresarial): ParteRelacionada[] {
  return [
    {
      id: `pr-${grupo.id}-1`,
      nome: 'José Roberto Andrade',
      documento: '111.222.333-44',
      email: 'jose.andrade@email.com',
      telefone: '(64) 99901-2233',
      papel: 'Avalista',
      estadoCivil: 'Casado(a)',
    },
    {
      id: `pr-${grupo.id}-2`,
      nome: 'Maria Helena Andrade',
      documento: '222.333.444-55',
      email: 'maria.andrade@email.com',
      telefone: '(64) 99902-3344',
      papel: 'Sócio',
      estadoCivil: 'Casado(a)',
    },
    {
      id: `pr-${grupo.id}-3`,
      nome: 'Paulo César Lima',
      documento: '333.444.555-66',
      email: 'paulo.lima@email.com',
      telefone: '(64) 99903-4455',
      papel: 'Representante Legal',
      estadoCivil: 'Solteiro(a)',
    },
  ];
}

export function detalheGrupo(grupo: GrupoEmpresarial): DetalheGrupo {
  const parecerArquivo = grupo.parecerCredito === 'AUSENTE' ? '' : `parecer-credito-${grupo.id}.pdf`;
  return {
    partesRelacionadas: buildPartesRelacionadas(grupo),
    parametrizacoes: {
      limite: {
        parecerCreditoArquivo: parecerArquivo,
        parecerAtualizadoEm: parecerArquivo ? '18/06/2026' : null,
        parecerProximoVencimento: grupo.vencimentoParecer,
        indicativoRating: grupo.rating,
        reparametrizacaoData: grupo.statusOperacao === 'Recovery' || grupo.statusOperacao === 'Special-Sit' ? '15/09/2026' : null,
        limites: buildLimites(grupo),
      },
      autoatendimento: {
        limiteOperacoesAutomaticas: grupo.limiteAutoatendimento,
        taxaFee: 0.35,
        taxaRisco: 0.55,
        taxaCessaoPadrao: 1.20,
        veiculoOperacaoPreferencial: 'CRA CERES',
      },
      geral: {
        confirmacaoPreDesembolsoPct: 40,
        prazoConfirmacaoTitulosDias: 60,
        confirmacaoClientesNovosPct: 70,
        confirmacaoClientesAntigosPct: 50,
        notificacaoSacadosPct: 0,
        prazoConfirmacaoSacadosDias: 30,
        concentracaoMaximaSacadoPct: grupo.tipoCliente === 'Multicedente' ? 20 : 0,
        nfEntregaFuturaPodeOperar: grupo.tipoCliente === 'Multicedente',
        nfEntregaFuturaOperacaoMaximaPct: grupo.tipoCliente === 'Multicedente' ? 30 : 0,
        creditoPreAprovacaoSacado: true,
        validadeSerasaSacadoDias: 30,
        validadeSerasaAvalistaDias: 30,
        validadeSerasaCedenteDias: 60,
        necessitaAvalConjuge: false,
        exigeAnuenciaConjuge: false,
        aceitaRestritivoFinanceiroCedente: true,
        valorRestritivoAceitoCedente: 5000,
        aceitaRestritivoSocios: false,
        valorRestritivoSocios: 0,
        laudoAtivoAntesDesembolso: true,
        laudoFrequencia: 'Semestral',
        afImovelPrazoLaudoPosComiteDias: 15,
        afImovelAprovadoSoEscrituraPublica: false,
        protocoloCpr: true,
        protocoloGarantiaImovel: false,
        excecoesConcentracao: [],
        avalistas: [
          {
            id: 'aval-1',
            nome: 'José Roberto Andrade',
            documento: '111.222.333-44',
            email: 'jose.andrade@email.com',
            telefone: '(64) 99901-2233',
            estadoCivil: 'Casado(a)',
            conjugeAnuente: true,
            obrigatorio: true,
          },
        ],
      },
      garantia: {
        requerConfirmacaoTitulos: grupo.statusOperacao !== 'Normal',
        garantiasObrigatorias: grupo.statusOperacao === 'Recovery' || grupo.statusOperacao === 'Special-Sit',
        percentualGarantia: 120,
        garantias: [
          {
            id: 'gar-1',
            tipo: 'Imóvel Rural',
            percentualExigido: 120,
            prazoLaudoDias: 15,
            frequenciaLaudo: 'Semestral',
            exigeEscrituraPublica: true,
            exigeProtocolo: false,
          },
        ],
      },
    },
    cedentes: [
      {
        id: 'ced-1', documento: '12.345.678/0001-90', nome: grupo.nome,
        email: 'financeiro@' + grupo.nome.toLowerCase().split(' ')[0] + '.com.br',
        cidade: 'Rio Verde', uf: 'GO', tipo: 'Pessoa Jurídica',
        status: 'Apto', qtdTitulosAberto: 3, riscoTomado: grupo.riscoTotal * 0.4, dataAbertura: '14/03/2021',
        razaoSocial: grupo.nome, nomeFantasia: grupo.nome.split(' ')[0], tipoEmpresa: 'Ltda',
        porte: 'Médio', atividadePrincipal: 'Comércio de insumos agrícolas', naturezaJuridica: 'Sociedade Empresária Limitada',
        inscricaoMunicipal: '00123456', inscricaoEstadual: '10.234.567-8',
        contatos: [
          { id: 'cont-1', nome: 'Financeiro ' + grupo.nome.split(' ')[0], email: 'financeiro@' + grupo.nome.toLowerCase().split(' ')[0] + '.com.br', ddi: '+55', telefone: '(64) 99909-1183' },
        ],
        enderecos: [
          { id: 'end-1', cep: '75901-000', localidade: 'Fazenda Santa Bárbara', numero: 'S/N', bairro: 'Zona Rural', infoAdicionais: '', cidade: 'Rio Verde', uf: 'GO', pais: 'Brasil' },
        ],
        documentos: [],
      },
      {
        id: 'ced-2', documento: '234.567.890-12', nome: 'José Carlos ' + grupo.gerente.split(' ')[1],
        email: null, cidade: 'Luís Eduardo Magalhães', uf: 'BA', tipo: 'Pessoa Física',
        status: 'Inapto', qtdTitulosAberto: 0, riscoTomado: 0, dataAbertura: '02/07/1995',
        rg: '0000000', inscricaoProdutorRural: '', nacionalidade: 'Brasileira',
        dataNascimento: '02/07/1995', profissao: 'Produtor Rural', estadoCivil: 'Casado(a)',
        contatos: [
          { id: 'cont-2', nome: 'José Carlos ' + grupo.gerente.split(' ')[1], email: 'jose.carlos620@gmail.com', ddi: '+55', telefone: '(77) 3351-8356' },
        ],
        enderecos: [],
        documentos: [],
      },
    ],
    historico: [
      { id: 'hist-3', datetime: '18/06/2026 09:12', descricao: `Parecer de crédito atualizado — status alterado para "${parecerLabel(grupo.parecerCredito)}".` },
      { id: 'hist-2', datetime: '02/05/2026 14:40', descricao: `Limite de autoatendimento ajustado para ${brl(grupo.limiteAutoatendimento, { compact: true })}.` },
      { id: 'hist-1', datetime: '10/01/2026 11:05', descricao: `Grupo cadastrado com status de operação "${grupo.statusOperacao}".` },
    ],
  };
}

export const STATUS_GRUPO_RELATORIO_OPTS = ['Normal', 'Recovery', 'Terceiro'] as const;
export const STATUS_PARECER_RELATORIO_OPTS = ['Vencido', 'A vencer'] as const;

export const GRUPOS_SEED: GrupoEmpresarial[] = [
  {
    id: 'grp-3a', documento: '12.345.678/0001-90', nome: '3A MAQUINAS E TRANSPORTES LTDA', tipoCliente: 'Multicedente',
    statusOperacao: 'Normal', limite: 4_500_000, limiteAutoatendimento: 800_000, riscoTotal: 2_150_000, riscoUraStt: 640_000,
    gerente: 'Carlos Mendes', vencimentoLimite: '30/11/2026', vencimentoParecer: '30/11/2026', parecerCredito: 'CONFORME',
    rating: 'A', valorVencido: 120_000,
  },
  {
    id: 'grp-fazenda-sn', documento: '98.765.432/0001-11', nome: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA', tipoCliente: 'Monocedente',
    statusOperacao: 'Terceiro', limite: 1_200_000, limiteAutoatendimento: 200_000, riscoTotal: 980_000, riscoUraStt: 150_000,
    gerente: 'Fernanda Rocha', vencimentoLimite: '15/09/2026', vencimentoParecer: '15/09/2026', parecerCredito: 'EXPIRANDO',
    rating: 'A-', valorVencido: 85_000,
  },
  {
    id: 'grp-agropec-vale', documento: '45.112.998/0001-22', nome: 'AGROPECUARIA VALE VERDE S/A', tipoCliente: 'Multicedente',
    statusOperacao: 'Pré-Recovery', limite: 3_000_000, limiteAutoatendimento: 0, riscoTotal: 2_890_000, riscoUraStt: 410_000,
    gerente: 'Rodrigo Alves', vencimentoLimite: '02/07/2026', vencimentoParecer: '02/07/2026', parecerCredito: 'EXPIRADO',
    rating: 'B++', valorVencido: 450_000,
  },
  {
    id: 'grp-cerrado-graos', documento: '33.220.114/0001-05', nome: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA', tipoCliente: 'Monocedente',
    statusOperacao: 'Recovery', limite: 5_600_000, limiteAutoatendimento: 500_000, riscoTotal: 5_450_000, riscoUraStt: 1_020_000,
    gerente: 'Juliana Prado', vencimentoLimite: '01/06/2026', vencimentoParecer: null, parecerCredito: 'AUSENTE',
    rating: 'B', valorVencido: 890_000,
  },
  {
    id: 'grp-boi-forte', documento: '11.998.223/0001-77', nome: 'BOI FORTE PECUARIA LTDA', tipoCliente: 'Multicedente',
    statusOperacao: 'Especial', limite: 900_000, limiteAutoatendimento: 100_000, riscoTotal: 610_000, riscoUraStt: 90_000,
    gerente: 'Marcelo Nogueira', vencimentoLimite: '20/12/2026', vencimentoParecer: '20/12/2026', parecerCredito: 'CONFORME',
    rating: 'A+', valorVencido: 0,
  },
  {
    id: 'grp-sertao-algodao', documento: '77.443.221/0001-38', nome: 'SERTAO ALGODAO PROCESSAMENTO S/A', tipoCliente: 'Monocedente',
    statusOperacao: 'Special-Sit', limite: 2_400_000, limiteAutoatendimento: 0, riscoTotal: 2_395_000, riscoUraStt: 380_000,
    gerente: 'Patrícia Lima', vencimentoLimite: '10/08/2026', vencimentoParecer: '10/08/2026', parecerCredito: 'EXPIRADO',
    rating: 'B', valorVencido: 320_000,
  },
  {
    id: 'grp-sem-limite', documento: '88.554.332/0001-49', nome: 'COOPERATIVA RURAL DO SUL LTDA', tipoCliente: 'Monocedente',
    statusOperacao: 'Normal', limite: 0, limiteAutoatendimento: 0, riscoTotal: 0, riscoUraStt: 0,
    gerente: 'Carlos Mendes', vencimentoLimite: null, vencimentoParecer: null, parecerCredito: 'AUSENTE',
    rating: 'NÃO SE APLICA', valorVencido: 0,
  },
  {
    id: 'grp-sem-risco', documento: '99.665.443/0001-50', nome: 'AGRO INSUMOS PLANALTO LTDA', tipoCliente: 'Multicedente',
    statusOperacao: 'Normal', limite: 1_500_000, limiteAutoatendimento: 300_000, riscoTotal: 0, riscoUraStt: 0,
    gerente: 'Fernanda Rocha', vencimentoLimite: '25/10/2026', vencimentoParecer: '25/10/2026', parecerCredito: 'CONFORME',
    rating: 'A', valorVencido: 0,
  },
];

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

export interface Agrupamento {
  id: string;
  nome: string;
  criadoEm: string;
}

export const AGRUPAMENTOS_SEED: Agrupamento[] = [
  { id: 'agp-confina', nome: 'Confina', criadoEm: '10/01/2025' },
  { id: 'agp-agrovita', nome: 'Operações Agrovita', criadoEm: '10/01/2025' },
  { id: 'agp-estruturadas', nome: 'Operações Estruturadas (Fundo & Sec)', criadoEm: '22/01/2025' },
  { id: 'agp-multicedentes', nome: 'Operações Multicedentes (Ura, Stt, Cra, Ceres, Cra Artesanal)', criadoEm: '22/01/2025' },
  { id: 'agp-securitizacao', nome: 'Securitização', criadoEm: '05/02/2025' },
  { id: 'agp-trading', nome: 'Trading', criadoEm: '05/02/2025' },
];

export type TipoOperacaoVinculo = 'CRA' | 'FIDC';

export interface OperacaoVinculavel {
  id: string;
  nome: string;
  tipo: TipoOperacaoVinculo;
  agrupamentoIds: string[];
}

export const OPERACOES_VINCULAVEIS_SEED: OperacaoVinculavel[] = [
  { id: 'ov-cra-1', nome: '4ª Emissão CRA Semeagro', tipo: 'CRA', agrupamentoIds: ['agp-agrovita'] },
  { id: 'ov-cra-2', nome: '5ª Emissão CRA Semeagro', tipo: 'CRA', agrupamentoIds: ['agp-agrovita', 'agp-multicedentes'] },
  { id: 'ov-cra-3', nome: '7ª Emissão CRA Ceres Agro', tipo: 'CRA', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-cra-4', nome: '2ª Emissão CRA BTG Agro', tipo: 'CRA', agrupamentoIds: ['agp-securitizacao'] },
  { id: 'ov-cra-5', nome: '65ª - Confina CRA', tipo: 'CRA', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-cra-6', nome: '16ª - CRA Ura Agro (6)', tipo: 'CRA', agrupamentoIds: ['agp-multicedentes'] },
  { id: 'ov-cra-7', nome: '20ª - CRA Jatobá', tipo: 'CRA', agrupamentoIds: [] },
  { id: 'ov-cra-8', nome: '44ª - CRA Carteira', tipo: 'CRA', agrupamentoIds: ['agp-multicedentes'] },
  { id: 'ov-cra-9', nome: '51ª - CRA Spaço', tipo: 'CRA', agrupamentoIds: ['agp-estruturadas'] },
  { id: 'ov-cra-10', nome: '62ª - CRA Carteira', tipo: 'CRA', agrupamentoIds: ['agp-multicedentes'] },
  { id: 'ov-cra-11', nome: 'Confina - CRA Interno - 50 MM - Junho/2025', tipo: 'CRA', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-cra-12', nome: 'Confina BTG 100 MM', tipo: 'CRA', agrupamentoIds: ['agp-confina', 'agp-securitizacao'] },
  { id: 'ov-cra-13', nome: '18ª Emissão CRA Cargill Agro', tipo: 'CRA', agrupamentoIds: ['agp-multicedentes'] },
  { id: 'ov-cra-14', nome: '33ª Emissão CRA Amaggi Group', tipo: 'CRA', agrupamentoIds: ['agp-multicedentes'] },
  { id: 'ov-cra-15', nome: '9ª Emissão CRA SLC Agrícola', tipo: 'CRA', agrupamentoIds: ['agp-estruturadas'] },
  { id: 'ov-cra-16', nome: '12ª Emissão CRA BrasilAgro', tipo: 'CRA', agrupamentoIds: [] },
  { id: 'ov-cra-17', nome: 'BMG FOODS IMPORTAÇÃO E EXPORTAÇÃO LTDA', tipo: 'CRA', agrupamentoIds: [] },
  { id: 'ov-cra-18', nome: '27ª Emissão CRA São Martinho', tipo: 'CRA', agrupamentoIds: [] },
  { id: 'ov-fidc-1', nome: 'AGRO 25 FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS', tipo: 'FIDC', agrupamentoIds: ['agp-agrovita'] },
  { id: 'ov-fidc-2', nome: 'T.I TECNOLOGIA FUNDO DE INVESTIMENTOS', tipo: 'FIDC', agrupamentoIds: ['agp-estruturadas'] },
  { id: 'ov-fidc-3', nome: 'T.I TECNOLOGIA COMPRA DE LEITE', tipo: 'FIDC', agrupamentoIds: ['agp-estruturadas'] },
  { id: 'ov-fidc-4', nome: 'T.I TECNOLOGIA COMPRA DE ANIMAIS', tipo: 'FIDC', agrupamentoIds: ['agp-estruturadas', 'agp-trading'] },
  { id: 'ov-fidc-5', nome: 'CERES BTG URA AGRO 2 FUNDO DE INVESTIMENTO', tipo: 'FIDC', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-fidc-6', nome: 'ARROBANK FIDC', tipo: 'FIDC', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-fidc-7', nome: 'ARROBANK RECEBÍVEIS AGROPECUÁRIOS FIDC', tipo: 'FIDC', agrupamentoIds: [] },
  { id: 'ov-fidc-8', nome: 'CERES CONFINA FIDC', tipo: 'FIDC', agrupamentoIds: ['agp-confina'] },
  { id: 'ov-fidc-9', nome: 'CERES TRADING FIDC', tipo: 'FIDC', agrupamentoIds: ['agp-trading'] },
  { id: 'ov-fidc-10', nome: 'SECURITIZAÇÃO AGRO FIDC', tipo: 'FIDC', agrupamentoIds: ['agp-securitizacao'] },
  { id: 'ov-fidc-11', nome: 'MULTICEDENTES RURAL FIDC', tipo: 'FIDC', agrupamentoIds: [] },
  { id: 'ov-fidc-12', nome: 'ESTRUTURADAS FUNDO & SEC FIDC II', tipo: 'FIDC', agrupamentoIds: ['agp-estruturadas'] },
  { id: 'ov-fidc-13', nome: 'AGROVITA RECEBÍVEIS FIDC', tipo: 'FIDC', agrupamentoIds: ['agp-agrovita'] },
  { id: 'ov-fidc-14', nome: 'BTG PACTUAL AGRO FIDC', tipo: 'FIDC', agrupamentoIds: [] },
];

export function contarVinculos(agrupamentoId: string, operacoes: OperacaoVinculavel[]) {
  const vinculadas = operacoes.filter((o) => o.agrupamentoIds.includes(agrupamentoId));
  const cras = vinculadas.filter((o) => o.tipo === 'CRA').length;
  const fidcs = vinculadas.filter((o) => o.tipo === 'FIDC').length;
  return { cras, fidcs, total: cras + fidcs };
}

export function nomesAgrupamentos(op: OperacaoVinculavel, agrupamentos: Agrupamento[]): string[] {
  return op.agrupamentoIds
    .map((id) => agrupamentos.find((a) => a.id === id)?.nome)
    .filter((n): n is string => Boolean(n));
}
