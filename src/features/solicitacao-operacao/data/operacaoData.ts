export type Etapa =
  | 'RASCUNHO'
  | 'PENDENTE'
  | 'ATUALIZACAO_SACADO'
  | 'SELECAO_PARCELAS'
  | 'COMERCIAL'
  | 'CREDITO'
  | 'CADASTRO'
  | 'ANALISE'
  | 'ANALISE_JURIDICA'
  | 'ANALISE_FUNDO'
  | 'VALIDADO'
  | 'ABONO'
  | 'ASSINATURA_CLIENTE'
  | 'DESEMBOLSO'
  | 'DESEMBOLSO_CLIENTE'
  | 'SOLUCIONADA'
  | 'REJEITADA';

/** Etapas exclusivas da esteira Cliente (visíveis no kanban só em Todas / Cliente). */
export const ETAPAS_CLIENTE: Etapa[] = ['ATUALIZACAO_SACADO', 'SELECAO_PARCELAS'];

export type Esteira =
  | 'CRA_MONOCEDENTE'
  | 'ESPECIAL'
  | 'CONVENCIONAL'
  | 'FIDC_MONOCEDENTE'
  | 'CLIENTE';

export type Validacao = 'VALIDO' | 'INVALIDO';

export interface Solicitacao {
  id: string;
  cedente: string;
  tipoContrato: string;
  validacao: Validacao;
  valor: number;
  vinculo: string;
  veiculo: string;
  etapa: Etapa;
  esteira: Esteira;
  tipoOperacao: string;
  grupoEmpresarial: string;
  abertura: string;
  tempoTotalHoras: number;
  tempoEtapaHoras: number;
  slaEtapaHoras: number;
  taxa: number;
  gerente: string;
  atendente: string;
  // ── Campos opcionais usados só na tela de detalhe (exibição) ──
  unidadeNegocio?: string;
  documento?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoTaxa?: string;
  frequencia?: string;
  fee?: number;
  valorFee?: number;
  percSeguro?: number;
  valorSeguro?: number;
  quitacaoVencidos?: boolean;
}

/* ─── Tipos auxiliares da tela de detalhe (somente exibição) ──────── */

export type ParteTipo = 'AVA' | 'ITA' | 'SOC' | 'REP' | 'CON' | 'PROC';
export type TipoPessoa = 'FISICA' | 'JURIDICA';

export interface ParteContatoRelacionado {
  documento: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface ParteRelacionada {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  tipos: ParteTipo[];
  tipoPessoa: TipoPessoa;
  // Anexo 1 — Identificação (PF)
  cpf?: string;
  rg?: string;
  inscricaoProdutorRural?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  profissao?: string;
  estadoCivil?: string;
  // Anexo 1 — Identificação (PJ)
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  dataAbertura?: string;
  tipoEmpresa?: string;
  porte?: string;
  atividadePrincipal?: string;
  naturezaJuridica?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  contatosRelacionados?: ParteContatoRelacionado[];
  // Anexo 2 — Endereço
  cep?: string;
  localidade?: string;
  numero?: string;
  bairro?: string;
  infoAdicionais?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  // Anexo 3 — Contato
  nomeContato?: string;
  ddi?: string;
  /** Usado na minuta CPR/CPR-F (etapa Avalista) e no cadastro de parte. */
  possuiConjuge?: boolean;
  /** Dados do cônjuge quando `possuiConjuge` (mesmo shape da minuta). */
  conjuge?: import('./minutaData').ConjugeMinuta;
  /** Representante legal quando PJ (mesmo shape da minuta). */
  representante?: import('./minutaData').RepresentanteLegal;
}

/** UFs usadas nos campos de Estado (mesma lista de CreateFidcModal.tsx). */
export const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

/** Países + DDI pareados, usados nos campos de Contato/Endereço. */
export const PAISES_DDI: { pais: string; ddi: string }[] = [
  { pais: 'Brasil', ddi: '+55' },
  { pais: 'Argentina', ddi: '+54' },
  { pais: 'Paraguai', ddi: '+595' },
  { pais: 'Uruguai', ddi: '+598' },
  { pais: 'Chile', ddi: '+56' },
  { pais: 'Bolívia', ddi: '+591' },
  { pais: 'Estados Unidos', ddi: '+1' },
];

/** Uma parcela do título (manual ou gerada automaticamente pelo fluxo de parcelas). */
export interface ParcelaAtivo {
  parcela: string;
  vencimento: string;
  amortizacao?: number;
  juros?: number;
  pagarJuros?: boolean;
  valor?: number;
}

/** Sacado já cadastrado na base (mock), usado na busca automática por CPF/CNPJ no Adicionar Contrato. */
export interface SacadoCadastrado {
  documento: string;
  nome: string;
}

/**
 * Base mock de sacados já cadastrados. Reaproveita documentos usados nos seeds de ativos
 * (`ativoData.ts`) para permitir simular a busca digitando um CPF/CNPJ conhecido:
 * 000.000.000-00, 111.222.333-44 ou 12.345.678/0001-90.
 */
export const SACADOS_CADASTRADOS_MOCK: SacadoCadastrado[] = [
  { documento: '000.000.000-00', nome: 'LAURO FRANCISCO DIEL' },
  { documento: '111.222.333-44', nome: 'CARLOS FORTUNA NETO E OUTRO' },
  { documento: '12.345.678/0001-90', nome: 'REGIONAL AGRO INSUMOS LTDA' },
];

/** Busca um sacado cadastrado (mock) comparando apenas os dígitos do documento informado. */
export function buscarSacadoCadastrado(documento: string): SacadoCadastrado | null {
  const digits = documento.replace(/\D/g, '');
  if (!digits) return null;
  return SACADOS_CADASTRADOS_MOCK.find((s) => s.documento.replace(/\D/g, '') === digits) ?? null;
}

import type {
  AtivoAnexoDoc,
  AtivoConfirmacao,
  AtivoDetalhePagamentos,
  AtivoObservacaoCobranca,
  AtivoPessoa,
  ConfirmacaoAtivo,
  EntregaTipo,
  SituacaoPagamento,
  SituacaoTitulo,
  StatusAnexos,
} from './ativoData';
import { seedAtivos } from './ativoData';

/** Um contrato/título vinculado a uma solicitação, criado via "Adicionar contrato". */
export interface ContratoAtivo {
  id: string;
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  valorTotal: number;
  sacadoNome: string;
  sacadoDocumento: string;
  parcelas: ParcelaAtivo[];
  // Tabela
  registro: string;
  statusAnexos: StatusAnexos;
  anexosEnviados: number;
  anexosTotal: number;
  lastro: string;
  entrega: EntregaTipo;
  confirmacao: ConfirmacaoAtivo;
  situacao: SituacaoTitulo;
  situacaoPagamento: SituacaoPagamento;
  entrada: string;
  cedenteNome: string;
  cedenteDocumento: string;
  // Detalhe
  cedente: AtivoPessoa;
  sacado: AtivoPessoa;
  pagamentosDetalhe: AtivoDetalhePagamentos;
  confirmacoes: AtivoConfirmacao[];
  observacoesCobranca: AtivoObservacaoCobranca[];
  historicoTitulo: EventoHistorico[];
  anexosDocs: AtivoAnexoDoc[];
  /** Resumo das etapas da minuta quando Gerar minuta está ativo (CPR/CPR-F). */
  minuta?: import('./minutaData').MinutaResumo;
}

export type ValidacaoStatus = 'PENDENTE' | 'PROCESSANDO' | 'OK' | 'NAO_OK' | 'EXCECAO';

export const VALIDACAO_STATUS_LABEL: Record<ValidacaoStatus, string> = {
  PENDENTE: 'Pendente',
  PROCESSANDO: 'Processando',
  OK: 'Ok',
  NAO_OK: 'Não ok',
  EXCECAO: 'Exceção',
};

export interface ValidacaoEvidencia {
  arquivo: string;
  descricao: string;
  autor: string;
  data: string;
}

export interface ItemValidacao {
  titulo: string;
  descricao: string;
  area: string;
  status: ValidacaoStatus;
  /** quando true, o item crítico expõe ações de autorização / evidência */
  exigeAutorizacao?: boolean;
  evidencia?: ValidacaoEvidencia;
  /** mensagens de erro/detalhe retornadas pela regra */
  erros?: string[];
}

export interface AnexoDoc {
  nome: string;
  arquivo: string;
  obrigatorio: boolean;
  enviado: boolean;
}

export interface GarantiaAnexo {
  id: string;
  nome: string;
  obrigatorio: boolean;
  enviado: boolean;
}

export interface GarantiaOperacao {
  id: string;
  tipo: string;
  nome: string;
  valor: string;
  anexos: GarantiaAnexo[];
}

/** Catálogo fixo de anexos do cadastro de garantia (Solicitação). Obrigatórios primeiro. */
export const GARANTIA_ANEXO_TEMPLATES: Omit<GarantiaAnexo, 'enviado'>[] = [
  { id: 'certidao-matricula', nome: 'Certidão da Matrícula', obrigatorio: true },
  { id: 'contrato-arrendamento', nome: 'Contrato de Arrendamento', obrigatorio: false },
  { id: 'contrato-comodato', nome: 'Contrato de Comodato', obrigatorio: false },
  { id: 'contrato-parceria', nome: 'Contrato de Parceria', obrigatorio: false },
  { id: 'contrato-locacao', nome: 'Contrato de Locação', obrigatorio: false },
  { id: 'relacao-estoque', nome: 'Relação do Estoque Detalhado', obrigatorio: false },
  { id: 'contrato-servicos', nome: 'Contrato de Prestação de Serviços', obrigatorio: false },
];

export const TIPO_GARANTIA_OPERACAO_OPTS = [
  'AF. Estoque',
  'Penhor de Estoque',
  'Alienação Fiduciária',
  'Hipoteca',
  'Penhor',
  'Fiança',
  'Cessão Fiduciária',
  'Aval',
  'Caução',
];

export function emptyGarantiaAnexos(): GarantiaAnexo[] {
  return GARANTIA_ANEXO_TEMPLATES.map((d) => ({ ...d, enviado: false }));
}

/** Garante obrigatórios antes dos opcionais (ex.: dados legados fora de ordem). */
export function sortGarantiaAnexos(anexos: GarantiaAnexo[]): GarantiaAnexo[] {
  return [...anexos].sort((a, b) => Number(b.obrigatorio) - Number(a.obrigatorio));
}

export function formatValorGarantia(valor: string): string {
  if (!valor.trim()) return '—';
  // reusa máscara de centavos (já normaliza R$ + milhares)
  const digits = valor.replace(/\D/g, '');
  if (!digits) return '—';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export interface EventoHistorico {
  data: string;
  autor: string;
  acao: string;
}

export interface DetalheSolicitacao {
  partes: ParteRelacionada[];
  limites: { agrupamento: string; limite: string; risco: string; riscoSolic: string }[];
  ativos: ContratoAtivo[];
  garantias: GarantiaOperacao[];
  validacoes: ItemValidacao[];
  anexos: AnexoDoc[];
  historico: EventoHistorico[];
}

function inferTipoPessoa(documento: string): TipoPessoa {
  const digits = documento.replace(/\D/g, '');
  return digits.length > 11 ? 'JURIDICA' : 'FISICA';
}

/** Preenche campos dos anexos 1–3 quando o mock trouxe só identificação básica. */
export function enriquecerParteRelacionada(
  parte: Omit<ParteRelacionada, 'tipoPessoa'> & Partial<Pick<ParteRelacionada, 'tipoPessoa'>>,
): ParteRelacionada {
  const tipoPessoa = parte.tipoPessoa ?? inferTipoPessoa(parte.documento);
  const isFisica = tipoPessoa === 'FISICA';

  return {
    ...parte,
    tipoPessoa,
    cpf: isFisica ? (parte.cpf ?? parte.documento) : parte.cpf,
    cnpj: !isFisica ? (parte.cnpj ?? parte.documento) : parte.cnpj,
    razaoSocial: !isFisica ? (parte.razaoSocial ?? parte.nome) : parte.razaoSocial,
    nacionalidade: isFisica ? (parte.nacionalidade ?? 'Brasileira') : parte.nacionalidade,
    pais: parte.pais ?? 'Brasil',
    ddi: parte.ddi ?? '+55',
    nomeContato: parte.nomeContato ?? parte.nome,
    contatosRelacionados: parte.contatosRelacionados ?? [],
  };
}

const PARTES_BASE: ParteRelacionada[] = [
  enriquecerParteRelacionada({
    nome: 'Antonio Mazzo Junior',
    documento: '105.746.818-50',
    email: 'teste@email.com',
    telefone: '(34) 3832-4637',
    tipos: ['AVA'],
    nacionalidade: 'Brasileira',
    estadoCivil: 'Casado(a)',
    profissao: 'Produtor Rural',
    cidade: 'Uberaba',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Antonio Mazzo Junior',
    possuiConjuge: true,
  }),
  enriquecerParteRelacionada({
    nome: 'Carlos Roberto Rosa',
    documento: '003.876.916-69',
    email: 'teste@email.com',
    telefone: '(34) 99514-9848',
    tipos: ['AVA', 'ITA'],
    nacionalidade: 'Brasileira',
    cidade: 'Uberlândia',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Carlos Roberto Rosa',
    possuiConjuge: false,
  }),
  enriquecerParteRelacionada({
    nome: 'Mario Cesar de Oliveira',
    documento: '902.712.036-68',
    email: 'q32131@242342.com',
    telefone: '(93) 84923-4234',
    tipos: ['AVA', 'SOC'],
    nacionalidade: 'Brasileira',
    cidade: 'Ituiutaba',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Mario Cesar de Oliveira',
    possuiConjuge: false,
  }),
  enriquecerParteRelacionada({
    nome: 'Helen Kristina Ferreira',
    documento: '045.496.716-02',
    email: 'cccw@email.com',
    telefone: '(34) 99878-9789',
    tipos: ['SOC', 'AVA', 'ITA'],
    nacionalidade: 'Brasileira',
    estadoCivil: 'Solteiro(a)',
    cidade: 'Araguari',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Helen Kristina Ferreira',
    possuiConjuge: false,
  }),
  enriquecerParteRelacionada({
    nome: 'Hidiovana de Melo Freitas',
    documento: '054.698.026-04',
    email: 'email@email.com',
    telefone: '(34) 99547-8979',
    tipos: ['AVA', 'ITA'],
    nacionalidade: 'Brasileira',
    cidade: 'Uberaba',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Hidiovana de Melo Freitas',
    possuiConjuge: true,
  }),
  enriquecerParteRelacionada({
    nome: 'Eduardo Barbosa dos Santos',
    documento: '116.644.266-71',
    email: 'teste@email.com',
    telefone: '(34) 99254-7879',
    tipos: ['REP'],
    nacionalidade: 'Brasileira',
    profissao: 'Administrador',
    cidade: 'Uberaba',
    estado: 'MG',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Eduardo Barbosa dos Santos',
  }),
  enriquecerParteRelacionada({
    nome: 'Banco do Brasil SA',
    documento: '00.000.000/0001-91',
    email: 'teste@email.com',
    telefone: '(34) 99521-4589',
    tipos: ['ITA', 'AVA'],
    razaoSocial: 'Banco do Brasil SA',
    nomeFantasia: 'Banco do Brasil',
    dataAbertura: '01/08/1808',
    tipoEmpresa: 'Sociedade de Economia Mista',
    porte: 'Grande',
    cidade: 'Brasília',
    estado: 'DF',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Central de Atendimento',
  }),
  enriquecerParteRelacionada({
    nome: 'Receita Federal',
    documento: '000.000.001-91',
    email: 'asgvfgw@ctqw.com',
    telefone: '(34) 99521-5967',
    tipos: ['AVA'],
    nacionalidade: 'Brasileira',
    cidade: 'Brasília',
    estado: 'DF',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Receita Federal',
  }),
  enriquecerParteRelacionada({
    nome: 'Cencosud Brasil Comercial',
    documento: '39.346.861/0001-61',
    email: 'cdszgcgw@cgwgtw.com',
    telefone: '(34) 95195-4897',
    tipos: ['AVA'],
    razaoSocial: 'Cencosud Brasil Comercial Ltda',
    nomeFantasia: 'Cencosud',
    dataAbertura: '12/03/2004',
    tipoEmpresa: 'Sociedade Limitada',
    porte: 'Grande',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    ddi: '+55',
    nomeContato: 'Departamento Financeiro',
  }),
];

/**
 * Deriva os dados ricos (exibição) de uma solicitação para a tela de detalhe.
 * Mantém a lógica intacta: apenas preenche defaults quando os campos opcionais
 * não vieram no mock.
 */
export function detalheSolicitacao(s: Solicitacao): DetalheSolicitacao {
  const validacoes: ItemValidacao[] = [
    { titulo: 'Contato Válido do Sacado (E-mail e Telefone)', descricao: 'Verifica se o(s) Sacado(s) possuem contato válido cadastrado.', area: 'Comercial', status: 'PENDENTE' },
    { titulo: 'Endereço Válido do Sacado',                    descricao: 'Verifica se o(s) Sacado(s) possuem endereço válido cadastrado.', area: 'Comercial', status: 'PROCESSANDO' },
    {
      titulo: 'Taxa da Operação',
      descricao: 'Verifica se esta operação está em conformidade com a taxa previamente aprovada.',
      area: 'Comercial',
      status: s.validacao === 'INVALIDO' ? 'NAO_OK' : 'OK',
      exigeAutorizacao: s.validacao === 'INVALIDO',
      erros: s.validacao === 'INVALIDO'
        ? ['Taxa da operação (1,85% a.m.) acima da taxa máxima aprovada no parecer de crédito (1,70% a.m.).']
        : undefined,
    },
    {
      titulo: 'Data de Vencimento - Mínimo e Máximo',
      descricao: 'Validação se a data de vencimento de um ativo está de acordo com a configuração de data mínima e máxima aceita pelo veículo.',
      area: 'Operação',
      status: 'NAO_OK',
      exigeAutorizacao: true,
      erros: [
        "data de vencimento: '7/16/2027 12:00:00 AM' do título '486254' ultrapassa o vencimento limite do fundo/cra: '7/11/2027 12:00:00 AM'",
      ],
    },
    {
      titulo: 'Conferência VADU Serasa Sacado',
      descricao: 'Consulta cadastral do sacado junto às bureaus de crédito.',
      area: 'Crédito',
      status: 'EXCECAO',
      exigeAutorizacao: true,
      erros: [
        'Consulta Serasa retornou restrição cadastral para o sacado. Requer análise e autorização de crédito.',
      ],
    },
  ];
  return {
    partes: PARTES_BASE,
    limites: [],
    ativos: seedAtivos(s.id),
    garantias: [],
    validacoes,
    anexos: [
      { nome: 'Parecer de Crédito', arquivo: '2025-10-22T20_45_42.253Z_parecer.pdf', obrigatorio: false, enviado: true },
    ],
    historico: [
      { data: '08/06/2026 às 13:53:00', autor: 'Daniel Santos Patrocinio', acao: `vinculou o pedido de operação ao ${s.veiculo || 'veículo'}` },
      { data: '08/06/2026 às 13:52:42', autor: 'Daniel Santos Patrocinio', acao: 'criou a solicitação' },
    ],
  };
}

export const ETAPAS: { key: Etapa; label: string; cor: string }[] = [
  { key: 'RASCUNHO',           label: 'Rascunho',             cor: 'var(--neutral-400)' },
  { key: 'PENDENTE',           label: 'Pendente',             cor: '#D97706' },
  { key: 'ATUALIZACAO_SACADO', label: 'Atualização de sacado', cor: '#EA580C' },
  { key: 'SELECAO_PARCELAS',   label: 'Seleção de Parcelas',  cor: '#C2410C' },
  { key: 'COMERCIAL',          label: 'Comercial',            cor: 'var(--gci-base)' },
  { key: 'CREDITO',            label: 'Crédito',              cor: '#CA8A04' },
  { key: 'CADASTRO',           label: 'Cadastro',             cor: '#0891B2' },
  { key: 'ANALISE',            label: 'Análise',              cor: '#7C3AED' },
  { key: 'ANALISE_JURIDICA',   label: 'Análise Jurídica',     cor: '#4F46E5' },
  { key: 'ANALISE_FUNDO',      label: 'Análise Fundo',        cor: '#9333EA' },
  { key: 'VALIDADO',           label: 'Validado',             cor: 'var(--success-base)' },
  { key: 'ABONO',              label: 'Abono',                cor: '#14B8A6' },
  { key: 'ASSINATURA_CLIENTE', label: 'Assinatura do Cliente', cor: 'var(--agro-base)' },
  { key: 'DESEMBOLSO',         label: 'Desembolso',           cor: '#2563EB' },
  { key: 'DESEMBOLSO_CLIENTE', label: 'Desembolso Cliente',   cor: '#0EA5E9' },
  { key: 'SOLUCIONADA',        label: 'Solucionada',          cor: 'var(--success-dark)' },
  { key: 'REJEITADA',          label: 'Rejeitada',            cor: 'var(--danger-base)' },
];

export const ESTEIRAS: { key: Esteira; label: string }[] = [
  { key: 'CRA_MONOCEDENTE',  label: 'CRA Monocedente' },
  { key: 'ESPECIAL',         label: 'Especial' },
  { key: 'CONVENCIONAL',     label: 'Convencional' },
  { key: 'FIDC_MONOCEDENTE', label: 'FIDC Monocedente' },
  { key: 'CLIENTE',          label: 'Cliente' },
];

export const etapaLabel = (e: Etapa) => ETAPAS.find((x) => x.key === e)?.label ?? e;
export const etapaCor = (e: Etapa) => ETAPAS.find((x) => x.key === e)?.cor ?? 'var(--neutral-400)';
export const esteiraLabel = (e: Esteira) => ESTEIRAS.find((x) => x.key === e)?.label ?? e;

export function brl(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000)
      return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (Math.abs(n) >= 1_000)
      return `R$ ${(n / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

/** Formata uma duração em horas como "3d 4h" ou "5h". */
export function fmtDuracao(horas: number): string {
  const dias = Math.floor(horas / 24);
  const h = Math.round(horas % 24);
  if (dias > 0) return h > 0 ? `${dias}d ${h}h` : `${dias}d`;
  return `${h}h`;
}

/** Razão de consumo do SLA na etapa atual. >1 = atrasado. */
export function slaRatio(s: Solicitacao): number {
  if (s.slaEtapaHoras <= 0) return 0;
  return s.tempoEtapaHoras / s.slaEtapaHoras;
}

/** Agrupa solicitações por etapa, preservando a ordem de ETAPAS. */
export function groupByEtapa(list: Solicitacao[]): Record<Etapa, Solicitacao[]> {
  const acc = Object.fromEntries(ETAPAS.map((e) => [e.key, [] as Solicitacao[]])) as Record<Etapa, Solicitacao[]>;
  for (const s of list) acc[s.etapa].push(s);
  return acc;
}

export const solicitacoes: Solicitacao[] = [
  {
    id: '#1383', cedente: 'Fazenda São João', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 1_250_000, vinculo: 'Grupo Ceres', veiculo: 'Ceres Investimentos', etapa: 'RASCUNHO',
    esteira: 'CRA_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Grupo Ceres',
    abertura: '2026-06-22', tempoTotalHoras: 6, tempoEtapaHoras: 6, slaEtapaHoras: 24,
    taxa: 1.92, gerente: 'Ana Martins', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1384', cedente: 'Agropecuária Bela Vista', tipoContrato: 'CPR-F', validacao: 'INVALIDO',
    valor: 820_000, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'PENDENTE',
    esteira: 'CONVENCIONAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Semeagro',
    abertura: '2026-06-21', tempoTotalHoras: 30, tempoEtapaHoras: 30, slaEtapaHoras: 24,
    taxa: 2.10, gerente: 'Carlos Eduardo', atendente: 'Juliana Prado',
  },
  {
    id: '#1385', cedente: 'Produtor Rural Santos', tipoContrato: 'CDCA', validacao: 'VALIDO',
    valor: 540_000, vinculo: 'Grupo Ceres', veiculo: 'Ceres Investimentos', etapa: 'PENDENTE',
    esteira: 'FIDC_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Grupo Ceres',
    abertura: '2026-06-20', tempoTotalHoras: 52, tempoEtapaHoras: 20, slaEtapaHoras: 48,
    taxa: 1.75, gerente: 'Fernanda Lima', atendente: 'Marcos Vinícius',
  },
  {
    id: '#1386', cedente: 'Regional Agro Insumos LTDA', tipoContrato: 'CPR-F', validacao: 'INVALIDO',
    valor: 2_500_000, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'COMERCIAL',
    esteira: 'ESPECIAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'BTG Agro',
    abertura: '2026-06-19', tempoTotalHoras: 334, tempoEtapaHoras: 334, slaEtapaHoras: 120,
    taxa: 2.04, gerente: 'Leynin Marcell Valério', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1387', cedente: 'Cerealista Norte LTDA', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 980_000, vinculo: 'Cargill Brasil', veiculo: 'Ceres Investimentos', etapa: 'COMERCIAL',
    esteira: 'CONVENCIONAL', tipoOperacao: 'Desconto', grupoEmpresarial: 'Cargill Brasil',
    abertura: '2026-06-18', tempoTotalHoras: 96, tempoEtapaHoras: 18, slaEtapaHoras: 36,
    taxa: 1.88, gerente: 'Roberto Alves', atendente: 'Patrícia Gomes',
  },
  {
    id: '#1388', cedente: 'Cultura Agronegócios LTDA', tipoContrato: 'NC', validacao: 'INVALIDO',
    valor: 11_377_082.43, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'ATUALIZACAO_SACADO',
    esteira: 'CLIENTE', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Raízen',
    abertura: '2026-06-08', tempoTotalHoras: 426, tempoEtapaHoras: 408, slaEtapaHoras: 120,
    taxa: 2.31, gerente: 'Leynin Marcell Valério', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1389', cedente: 'Distribuidora Campo Verde', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 430_000, vinculo: 'JBS Agro', veiculo: 'Ceres Investimentos', etapa: 'CREDITO',
    esteira: 'CRA_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'JBS Agro',
    abertura: '2026-06-16', tempoTotalHoras: 130, tempoEtapaHoras: 50, slaEtapaHoras: 72,
    taxa: 1.95, gerente: 'Ana Martins', atendente: 'Juliana Prado',
  },
  {
    id: '#1390', cedente: 'Tradings do Brasil S/A', tipoContrato: 'CPR-F', validacao: 'VALIDO',
    valor: 3_400_000, vinculo: 'Amaggi Group', veiculo: 'Ceres Investimentos', etapa: 'CADASTRO',
    esteira: 'ESPECIAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Amaggi Group',
    abertura: '2026-06-15', tempoTotalHoras: 160, tempoEtapaHoras: 20, slaEtapaHoras: 48,
    taxa: 2.00, gerente: 'Carlos Eduardo', atendente: 'Marcos Vinícius',
  },
  {
    id: '#1391', cedente: 'Coop. Agroindustrial Sul', tipoContrato: 'CDCA', validacao: 'VALIDO',
    valor: 760_000, vinculo: 'SLC Agrícola', veiculo: 'Ceres Investimentos', etapa: 'ANALISE',
    esteira: 'FIDC_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'SLC Agrícola',
    abertura: '2026-06-14', tempoTotalHoras: 180, tempoEtapaHoras: 22, slaEtapaHoras: 96,
    taxa: 1.70, gerente: 'Fernanda Lima', atendente: 'Patrícia Gomes',
  },
  {
    id: '#1392', cedente: 'Cultura Agronegócios LTDA', tipoContrato: 'CPR-F', validacao: 'INVALIDO',
    valor: 46_978_846.34, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'ANALISE',
    esteira: 'CONVENCIONAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Tereos',
    abertura: '2026-05-28', tempoTotalHoras: 1281, tempoEtapaHoras: 605, slaEtapaHoras: 240,
    taxa: 2.45, gerente: 'Leynin Marcell Valério', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1393', cedente: '3 Porteiras Agrícola Pecuária', tipoContrato: 'CDCA', validacao: 'INVALIDO',
    valor: 12_500_000, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'SELECAO_PARCELAS',
    esteira: 'CLIENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Vittia',
    abertura: '2026-05-25', tempoTotalHoras: 1177, tempoEtapaHoras: 692, slaEtapaHoras: 240,
    taxa: 2.18, gerente: 'Roberto Alves', atendente: 'Juliana Prado',
  },
  {
    id: '#1394', cedente: 'Lavoro Agro', tipoContrato: 'CDCA', validacao: 'VALIDO',
    valor: 1_950_000, vinculo: 'Lavoro', veiculo: 'Ceres Investimentos', etapa: 'ANALISE_JURIDICA',
    esteira: 'ESPECIAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Lavoro',
    abertura: '2026-06-09', tempoTotalHoras: 300, tempoEtapaHoras: 60, slaEtapaHoras: 120,
    taxa: 1.99, gerente: 'Ana Martins', atendente: 'Marcos Vinícius',
  },
  {
    id: '#1395', cedente: 'Castrolanda Cooperativa', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 2_800_000, vinculo: 'Castrolanda', veiculo: 'Ceres Investimentos', etapa: 'ANALISE_FUNDO',
    esteira: 'FIDC_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Castrolanda',
    abertura: '2026-06-05', tempoTotalHoras: 420, tempoEtapaHoras: 80, slaEtapaHoras: 120,
    taxa: 1.82, gerente: 'Carlos Eduardo', atendente: 'Patrícia Gomes',
  },
  {
    id: '#1396', cedente: 'Coamo Agroindustrial', tipoContrato: 'CPR-F', validacao: 'VALIDO',
    valor: 5_200_000, vinculo: 'Coamo', veiculo: 'Ceres Investimentos', etapa: 'VALIDADO',
    esteira: 'CRA_MONOCEDENTE', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Coamo',
    abertura: '2026-06-03', tempoTotalHoras: 480, tempoEtapaHoras: 36, slaEtapaHoras: 96,
    taxa: 2.05, gerente: 'Fernanda Lima', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1397', cedente: 'Bom Futuro Agropecuária', tipoContrato: 'CDCA', validacao: 'VALIDO',
    valor: 6_750_000, vinculo: 'Bom Futuro', veiculo: 'Ceres Investimentos', etapa: 'ABONO',
    esteira: 'ESPECIAL', tipoOperacao: 'Desconto', grupoEmpresarial: 'Bom Futuro',
    abertura: '2026-05-30', tempoTotalHoras: 560, tempoEtapaHoras: 28, slaEtapaHoras: 72,
    taxa: 1.78, gerente: 'Roberto Alves', atendente: 'Juliana Prado',
  },
  {
    id: '#1398', cedente: 'Agrícola Xingu', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 4_100_000, vinculo: 'Amaggi Group', veiculo: 'Ceres Investimentos', etapa: 'ASSINATURA_CLIENTE',
    esteira: 'CONVENCIONAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Amaggi Group',
    abertura: '2026-05-22', tempoTotalHoras: 720, tempoEtapaHoras: 96, slaEtapaHoras: 72,
    taxa: 2.12, gerente: 'Ana Martins', atendente: 'Marcos Vinícius',
  },
  {
    id: '#1399', cedente: 'Fazenda Santa Luzia', tipoContrato: 'CPR-F', validacao: 'VALIDO',
    valor: 1_430_000, vinculo: 'Grupo Ceres', veiculo: 'Ceres Investimentos', etapa: 'DESEMBOLSO',
    esteira: 'CRA_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Grupo Ceres',
    abertura: '2026-05-18', tempoTotalHoras: 840, tempoEtapaHoras: 12, slaEtapaHoras: 48,
    taxa: 1.90, gerente: 'Carlos Eduardo', atendente: 'Patrícia Gomes',
  },
  {
    id: '#1400', cedente: 'Sementes Talismã', tipoContrato: 'CDCA', validacao: 'VALIDO',
    valor: 2_260_000, vinculo: 'Lavoro', veiculo: 'Ceres Investimentos', etapa: 'DESEMBOLSO_CLIENTE',
    esteira: 'CLIENTE', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Lavoro',
    abertura: '2026-05-12', tempoTotalHoras: 960, tempoEtapaHoras: 30, slaEtapaHoras: 48,
    taxa: 1.85, gerente: 'Fernanda Lima', atendente: 'Eduardo Resende Mota',
  },
  {
    id: '#1401', cedente: 'Cooperativa Integrada', tipoContrato: 'CCB', validacao: 'VALIDO',
    valor: 8_900_000, vinculo: 'Integrada', veiculo: 'Ceres Investimentos', etapa: 'SOLUCIONADA',
    esteira: 'FIDC_MONOCEDENTE', tipoOperacao: 'Desconto', grupoEmpresarial: 'Integrada',
    abertura: '2026-04-28', tempoTotalHoras: 1320, tempoEtapaHoras: 240, slaEtapaHoras: 480,
    taxa: 1.73, gerente: 'Roberto Alves', atendente: 'Juliana Prado',
  },
  {
    id: '#1402', cedente: 'Insumos Vale Verde', tipoContrato: 'NC', validacao: 'INVALIDO',
    valor: 690_000, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'REJEITADA',
    esteira: 'CONVENCIONAL', tipoOperacao: 'Aquisição', grupoEmpresarial: 'Vale Verde',
    abertura: '2026-05-02', tempoTotalHoras: 1100, tempoEtapaHoras: 300, slaEtapaHoras: 240,
    taxa: 2.60, gerente: 'Ana Martins', atendente: 'Marcos Vinícius',
  },
];
