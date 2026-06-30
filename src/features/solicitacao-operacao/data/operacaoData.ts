export type Etapa =
  | 'RASCUNHO'
  | 'PENDENTE'
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

export type ParteTipo = 'AVA' | 'ITA' | 'SOC' | 'REP';
export interface ParteRelacionada {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  tipos: ParteTipo[];
}

export type ValidacaoStatus = 'OK' | 'ALERTA' | 'ERRO';
export interface ItemValidacao {
  titulo: string;
  descricao: string;
  area: string;
  status: ValidacaoStatus;
  /** quando true, o item crítico expõe ações de autorização */
  exigeAutorizacao?: boolean;
}

export interface AnexoDoc {
  nome: string;
  arquivo: string;
  obrigatorio: boolean;
  enviado: boolean;
}

export interface EventoHistorico {
  data: string;
  autor: string;
  acao: string;
}

export interface DetalheSolicitacao {
  partes: ParteRelacionada[];
  limites: { agrupamento: string; limite: string; risco: string; riscoSolic: string }[];
  ativos: unknown[];
  garantias: { tipo: string; nome: string; valor: number }[];
  validacoes: ItemValidacao[];
  anexos: AnexoDoc[];
  historico: EventoHistorico[];
}

const PARTES_BASE: ParteRelacionada[] = [
  { nome: 'Antonio Mazzo Junior',        documento: '105.746.818-50',     email: 'teste@email.com',    telefone: '(34) 3832-4637',  tipos: ['AVA'] },
  { nome: 'Carlos Roberto Rosa',         documento: '003.876.916-69',     email: 'teste@email.com',    telefone: '(34) 99514-9848', tipos: ['AVA', 'ITA'] },
  { nome: 'Mario Cesar de Oliveira',     documento: '902.712.036-68',     email: 'q32131@242342.com',  telefone: '(93) 84923-4234', tipos: ['AVA', 'SOC'] },
  { nome: 'Helen Kristina Ferreira',     documento: '045.496.716-02',     email: 'cccw@email.com',     telefone: '(34) 99878-9789', tipos: ['SOC', 'AVA', 'ITA'] },
  { nome: 'Hidiovana de Melo Freitas',   documento: '054.698.026-04',     email: 'email@email.com',    telefone: '(34) 99547-8979', tipos: ['AVA', 'ITA'] },
  { nome: 'Eduardo Barbosa dos Santos',  documento: '116.644.266-71',     email: 'teste@email.com',    telefone: '(34) 99254-7879', tipos: ['REP'] },
  { nome: 'Banco do Brasil SA',          documento: '00.000.000/0001-91', email: 'teste@email.com',    telefone: '(34) 99521-4589', tipos: ['ITA', 'AVA'] },
  { nome: 'Receita Federal',             documento: '000.000.001-91',     email: 'asgvfgw@ctqw.com',   telefone: '(34) 99521-5967', tipos: ['AVA'] },
  { nome: 'Cencosud Brasil Comercial',   documento: '39.346.861/0001-61', email: 'cdszgcgw@cgwgtw.com', telefone: '(34) 95195-4897', tipos: ['AVA'] },
];

/**
 * Deriva os dados ricos (exibição) de uma solicitação para a tela de detalhe.
 * Mantém a lógica intacta: apenas preenche defaults quando os campos opcionais
 * não vieram no mock.
 */
export function detalheSolicitacao(s: Solicitacao): DetalheSolicitacao {
  const validacoes: ItemValidacao[] = [
    { titulo: 'Contato Válido do Sacado (E-mail e Telefone)', descricao: 'Verifica se o(s) Sacado(s) possuem contato válido cadastrado.', area: 'Comercial', status: 'ALERTA' },
    { titulo: 'Endereço Válido do Sacado',                    descricao: 'Verifica se o(s) Sacado(s) possuem endereço válido cadastrado.', area: 'Comercial', status: 'ALERTA' },
    { titulo: 'Taxa da Operação',                             descricao: 'Verifica se esta operação está em conformidade com a taxa previamente aprovada.', area: 'Comercial', status: s.validacao === 'INVALIDO' ? 'ERRO' : 'OK', exigeAutorizacao: s.validacao === 'INVALIDO' },
  ];
  return {
    partes: PARTES_BASE,
    limites: [],
    ativos: [],
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
    valor: 11_377_082.43, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'COMERCIAL',
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
    valor: 12_500_000, vinculo: '', veiculo: 'Ceres Investimentos', etapa: 'ANALISE',
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
