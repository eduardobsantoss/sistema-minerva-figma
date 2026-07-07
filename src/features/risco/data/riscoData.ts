/**
 * Cadastro de Rating — registro global (PART 2).
 * Campo set confirmado com o usuário: Nome (texto livre, sem opções fixas),
 * Taxa (percentual) e Criado em (data). Sem status/ativo-inativo.
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

/**
 * Grupos Empresariais — listagem + detalhe (PART 4/5).
 * Status de Operação e estados do Parecer de Crédito confirmados com o usuário.
 */
export type StatusOperacao = 'Normal' | 'Terceiro' | 'Pré-Recovery' | 'Recovery' | 'Especial' | 'Special-Sit';
export const STATUS_OPERACAO_OPTS: StatusOperacao[] = ['Normal', 'Terceiro', 'Pré-Recovery', 'Recovery', 'Especial', 'Special-Sit'];

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

export const GERENTES_SEED: string[] = [
  'Carlos Mendes',
  'Fernanda Rocha',
  'Rodrigo Alves',
  'Juliana Prado',
  'Marcelo Nogueira',
  'Patrícia Lima',
];

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
  parecerCredito: ParecerStatus;
}

/**
 * Detalhe do Grupo — Parametrizações / Cedentes / Histórico (PART 5).
 * Indicativo de rating usa a lista de `RATINGS_SEED` + "NÃO SE APLICA" (confirmado).
 * Frequência do laudo: Mensal/Trimestral/Semestral/Anual (confirmado).
 * Tipo de cedente: Pessoa Física/Pessoa Jurídica (confirmado).
 */
export interface AgrupamentoLimiteRow {
  agrupamentoId: string;
  produtos: number;
  limite: number;
  risco: number;
}

export interface ParametrizacaoLimite {
  parecerCreditoArquivo: string;
  indicativoRating: string;
  reparametrizacaoData: string | null;
  agrupamentos: AgrupamentoLimiteRow[];
}

export interface ParametrizacaoAutoatendimento {
  limiteOperacoesAutomaticas: number;
  taxaFee: number;
  taxaRisco: number;
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
  obrigatorio: boolean;
}

export type FrequenciaLaudo = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
export const FREQUENCIA_LAUDO_OPTS: FrequenciaLaudo[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];

/**
 * Campo set de "Geral" confirmado com o usuário a partir do sistema legado
 * (Parametrizações › Geral de um Grupo Empresarial): 6 blocos — Confirmação de
 * Cessões, Sacado, NF de Entrega Futura, Crédito e Validade Serasa, Laudo de
 * Ativo/Imóvel e Protocolos por Produto — além das tabelas de Exceções de
 * Concentração por Sacado e Avalistas com Obrigatoriedade de Assinatura.
 */
export interface ParametrizacaoGeral {
  // Confirmação de Cessões
  confirmacaoPreDesembolsoPct: number;
  prazoConfirmacaoTitulosDias: number;
  confirmacaoClientesNovosPct: number;
  confirmacaoClientesAntigosPct: number;
  // Sacado
  notificacaoSacadosPct: number;
  concentracaoMaximaSacadoPct: number;
  // NF de Entrega Futura
  nfEntregaFuturaPodeOperar: boolean;
  nfEntregaFuturaOperacaoMaximaPct: number;
  // Crédito e Validade Serasa
  creditoPreAprovacaoSacado: boolean;
  validadeSerasaSacadoDias: number;
  validadeSerasaAvalistaDias: number;
  validadeSerasaCedenteDias: number;
  necessitaAvalConjuge: boolean;
  // Laudo de Ativo/Imóvel
  laudoAtivoAntesDesembolso: boolean;
  laudoFrequencia: FrequenciaLaudo;
  afImovelPrazoLaudoPosComiteDias: number;
  afImovelAprovadoSoEscrituraPublica: boolean;
  // Protocolos por Produto
  protocoloCpr: boolean;
  protocoloGarantiaImovel: boolean;
  // Tabelas
  excecoesConcentracao: ExcecaoConcentracao[];
  avalistas: AvalistaObrigatorio[];
}

export interface ParametrizacaoGarantia {
  requerConfirmacaoTitulos: boolean;
  percentualGarantia: number;
}

export interface Parametrizacoes {
  limite: ParametrizacaoLimite;
  autoatendimento: ParametrizacaoAutoatendimento;
  geral: ParametrizacaoGeral;
  garantia: ParametrizacaoGarantia;
}

export type TipoCedente = 'Pessoa Física' | 'Pessoa Jurídica';
export const TIPO_CEDENTE_OPTS: TipoCedente[] = ['Pessoa Física', 'Pessoa Jurídica'];

/**
 * Modal de Detalhes do Cedente (aba Cedentes > clique na linha).
 * Status Apto/Inapto: mockado manualmente, sem regra de negócio por trás.
 * KPIs (qtd. títulos em aberto, risco tomado): valores mockados estáticos.
 */
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
  // Cadastro — Pessoa Física
  rg?: string;
  inscricaoProdutorRural?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  profissao?: string;
  estadoCivil?: string;
  // Cadastro — Pessoa Jurídica
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
  parametrizacoes: Parametrizacoes;
  cedentes: Cedente[];
  historico: HistoricoEvento[];
}

export function detalheGrupo(grupo: GrupoEmpresarial): DetalheGrupo {
  return {
    parametrizacoes: {
      limite: {
        parecerCreditoArquivo: grupo.parecerCredito === 'AUSENTE' ? '' : `parecer-credito-${grupo.id}.pdf`,
        indicativoRating: grupo.statusOperacao === 'Normal' ? 'A' : 'NÃO SE APLICA',
        reparametrizacaoData: grupo.statusOperacao === 'Recovery' || grupo.statusOperacao === 'Special-Sit' ? '15/09/2026' : null,
        agrupamentos: [
          { agrupamentoId: 'agp-confina', produtos: 3, limite: grupo.limite * 0.4, risco: grupo.riscoTotal * 0.35 },
          { agrupamentoId: 'agp-agrovita', produtos: 2, limite: grupo.limite * 0.35, risco: grupo.riscoTotal * 0.3 },
        ],
      },
      autoatendimento: {
        limiteOperacoesAutomaticas: grupo.limiteAutoatendimento,
        taxaFee: 0.35,
        taxaRisco: 0.55,
      },
      geral: {
        confirmacaoPreDesembolsoPct: 40,
        prazoConfirmacaoTitulosDias: 60,
        confirmacaoClientesNovosPct: 70,
        confirmacaoClientesAntigosPct: 50,
        notificacaoSacadosPct: 0,
        concentracaoMaximaSacadoPct: grupo.tipoCliente === 'Multicedente' ? 20 : 0,
        nfEntregaFuturaPodeOperar: grupo.tipoCliente === 'Multicedente',
        nfEntregaFuturaOperacaoMaximaPct: grupo.tipoCliente === 'Multicedente' ? 30 : 0,
        creditoPreAprovacaoSacado: true,
        validadeSerasaSacadoDias: 30,
        validadeSerasaAvalistaDias: 30,
        validadeSerasaCedenteDias: 60,
        necessitaAvalConjuge: false,
        laudoAtivoAntesDesembolso: true,
        laudoFrequencia: 'Semestral',
        afImovelPrazoLaudoPosComiteDias: 15,
        afImovelAprovadoSoEscrituraPublica: false,
        protocoloCpr: true,
        protocoloGarantiaImovel: false,
        excecoesConcentracao: [],
        avalistas: [
          { id: 'aval-1', nome: 'José Roberto Andrade', documento: '111.222.333-44', obrigatorio: true },
        ],
      },
      garantia: {
        requerConfirmacaoTitulos: grupo.statusOperacao !== 'Normal',
        percentualGarantia: 120,
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

/**
 * Relatórios de Risco (PART 6).
 * Único relatório confirmado com o usuário: "Relatório de Parecer de Crédito",
 * com filtros Nome do grupo, Status do grupo, Gerente e Status do parecer.
 * Exportação: CSV.
 */
export const STATUS_GRUPO_RELATORIO_OPTS = ['Normal', 'Recovery', 'Terceiro'] as const;
export const STATUS_PARECER_RELATORIO_OPTS = ['Vencido', 'A vencer'] as const;

export const GRUPOS_SEED: GrupoEmpresarial[] = [
  {
    id: 'grp-3a', documento: '12.345.678/0001-90', nome: '3A MAQUINAS E TRANSPORTES LTDA', tipoCliente: 'Multicedente',
    statusOperacao: 'Normal', limite: 4_500_000, limiteAutoatendimento: 800_000, riscoTotal: 2_150_000, riscoUraStt: 640_000,
    gerente: 'Carlos Mendes', vencimentoLimite: '30/11/2026', parecerCredito: 'CONFORME',
  },
  {
    id: 'grp-fazenda-sn', documento: '98.765.432/0001-11', nome: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA', tipoCliente: 'Monocedente',
    statusOperacao: 'Terceiro', limite: 1_200_000, limiteAutoatendimento: 200_000, riscoTotal: 980_000, riscoUraStt: 150_000,
    gerente: 'Fernanda Rocha', vencimentoLimite: '15/09/2026', parecerCredito: 'EXPIRANDO',
  },
  {
    id: 'grp-agropec-vale', documento: '45.112.998/0001-22', nome: 'AGROPECUARIA VALE VERDE S/A', tipoCliente: 'Multicedente',
    statusOperacao: 'Pré-Recovery', limite: 3_000_000, limiteAutoatendimento: 0, riscoTotal: 2_890_000, riscoUraStt: 410_000,
    gerente: 'Rodrigo Alves', vencimentoLimite: '02/07/2026', parecerCredito: 'EXPIRADO',
  },
  {
    id: 'grp-cerrado-graos', documento: '33.220.114/0001-05', nome: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA', tipoCliente: 'Monocedente',
    statusOperacao: 'Recovery', limite: 5_600_000, limiteAutoatendimento: 500_000, riscoTotal: 5_450_000, riscoUraStt: 1_020_000,
    gerente: 'Juliana Prado', vencimentoLimite: null, parecerCredito: 'AUSENTE',
  },
  {
    id: 'grp-boi-forte', documento: '11.998.223/0001-77', nome: 'BOI FORTE PECUARIA LTDA', tipoCliente: 'Multicedente',
    statusOperacao: 'Especial', limite: 900_000, limiteAutoatendimento: 100_000, riscoTotal: 610_000, riscoUraStt: 90_000,
    gerente: 'Marcelo Nogueira', vencimentoLimite: '20/12/2026', parecerCredito: 'CONFORME',
  },
  {
    id: 'grp-sertao-algodao', documento: '77.443.221/0001-38', nome: 'SERTAO ALGODAO PROCESSAMENTO S/A', tipoCliente: 'Monocedente',
    statusOperacao: 'Special-Sit', limite: 2_400_000, limiteAutoatendimento: 0, riscoTotal: 2_395_000, riscoUraStt: 380_000,
    gerente: 'Patrícia Lima', vencimentoLimite: '10/08/2026', parecerCredito: 'EXPIRADO',
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

/**
 * Agrupamentos de Limite — cadastro global (PART 3).
 * Campo set confirmado com o usuário: Nome (texto livre), CRAs/FIDCs/Total
 * (agora CALCULADOS a partir dos vínculos reais em `OPERACOES_VINCULAVEIS_SEED`,
 * ver `contarVinculos`), Criado em. Ações: renomear e deletar (sem status/
 * ativo-inativo, sem Limite/Risco aqui — esses vivem por grupo, na aba Limite
 * do Detalhe do Grupo).
 */
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

/**
 * Vinculação de Agrupamento — CRAs/FIDCs vinculáveis a um agrupamento (PART 3.1).
 * Uma operação PODE pertencer a vários agrupamentos ao mesmo tempo (confirmado
 * com o usuário) — por isso `agrupamentoIds` é um array, não um único id.
 */
export type TipoOperacaoVinculo = 'CRA' | 'FIDC';

export interface OperacaoVinculavel {
  id: string;
  nome: string;
  tipo: TipoOperacaoVinculo;
  agrupamentoIds: string[];
}

export const OPERACOES_VINCULAVEIS_SEED: OperacaoVinculavel[] = [
  // CRAs
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
  // FIDCs
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
