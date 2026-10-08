export type CanalCessao = 'Email' | 'WhatsApp' | 'SMS' | 'Carta';
export type StatusNotificacaoCessao = 'PENDENTE' | 'ENVIADA' | 'FALHOU' | 'CANCELADA';
export type VeiculoTipoCessao = 'CRA' | 'FIDC';
export type TipoNotificacao = 'Regua' | 'Cessao';

export type SituacaoGrupo = 'ATIVO' | 'EM_ANALISE' | 'BLOQUEADO';

/** Dados do grupo empresarial e condições que a cessão precisa cumprir. */
export interface CessaoExtra {
  grupoEmpresarial: string;
  situacaoGrupo: SituacaoGrupo;
  dataCessao: string;
  boleto: boolean;
  cartaGerada: boolean;
  titulosAVencerOuVencidos: boolean;
  emailSacado: boolean;
  cedentePermiteNotificacao: boolean;
  sacadoPermiteNotificacao: boolean;
  contaBancariaVeiculo: boolean;
  titulosGrupoIds: string[];
}

export interface NotificacaoCessao extends CessaoExtra {
  id: string;
  protocolo: string;
  tipo: TipoNotificacao;
  lastro: string;
  tituloNumero: string;
  tituloId: string;
  veiculoTipo: VeiculoTipoCessao;
  veiculoNome: string;
  veiculoId: string;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  canal: CanalCessao;
  destinatario: string;
  dataEnvio: string | null;
  dataCriacao: string;
  status: StatusNotificacaoCessao;
  tentativas: number;
  comprovanteRef?: string | null;
  valorCessao: number;
}

export const STATUS_CESSAO_OPTS: StatusNotificacaoCessao[] = [
  'PENDENTE',
  'ENVIADA',
  'FALHOU',
  'CANCELADA',
];

export const CANAL_CESSAO_OPTS: CanalCessao[] = ['Email', 'WhatsApp', 'SMS', 'Carta'];
export const TIPO_NOTIFICACAO_OPTS: { key: TipoNotificacao; label: string }[] = [
  { key: 'Regua', label: 'Cobrança' },
  { key: 'Cessao', label: 'Cessão' },
];

export function tipoNotificacaoLabel(t: TipoNotificacao): string {
  return t === 'Regua' ? 'Cobrança' : 'Cessão';
}

export function statusCessaoLabel(s: StatusNotificacaoCessao): string {
  return (
    {
      PENDENTE: 'Pendente',
      ENVIADA: 'Enviada',
      FALHOU: 'Falhou',
      CANCELADA: 'Cancelada',
    } as const
  )[s];
}

export function statusCessaoColor(s: StatusNotificacaoCessao): string {
  return (
    {
      PENDENTE: 'var(--warning-base)',
      ENVIADA: 'var(--success-base)',
      FALHOU: 'var(--danger-base)',
      CANCELADA: 'var(--text-muted)',
    } as const
  )[s];
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

const NOTIFICACOES_BASE: Omit<NotificacaoCessao, keyof CessaoExtra>[] = [
  {
    id: 'nc-1',
    protocolo: 'NC-2026-1001',
    tipo: 'Cessao',
    lastro: 'CPR-F',
    tituloNumero: 'CRA-SEA4-002',
    tituloId: 'tit-2',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    cedente: 'Fazenda Santa Clara',
    cedenteCnpj: '23.456.789/0001-01',
    sacado: 'Trading Grãos Sul',
    sacadoCnpj: '11.222.333/0001-44',
    canal: 'Email',
    destinatario: 'financeiro@tradinggraos.com.br',
    dataEnvio: '08/07/2026 14:32',
    dataCriacao: '08/07/2026',
    status: 'ENVIADA',
    tentativas: 1,
    comprovanteRef: 'CMP-1001-A',
    valorCessao: 92000,
  },
  {
    id: 'nc-2',
    protocolo: 'NC-2026-1002',
    tipo: 'Regua',
    lastro: 'NFE',
    tituloNumero: 'FIDC-TITEC-118',
    tituloId: 'tit-5',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    cedente: 'Tech Rural BR',
    cedenteCnpj: '56.789.012/0001-34',
    sacado: 'Rede Agro Markets',
    sacadoCnpj: '22.333.444/0001-55',
    canal: 'WhatsApp',
    destinatario: '+55 11 98877-2211',
    dataEnvio: null,
    dataCriacao: '12/07/2026',
    status: 'PENDENTE',
    tentativas: 0,
    comprovanteRef: null,
    valorCessao: 47500,
  },
  {
    id: 'nc-3',
    protocolo: 'NC-2026-1003',
    tipo: 'Regua',
    lastro: 'CPR-F',
    tituloNumero: 'CRA-FUT-022',
    tituloId: 'tit-9',
    veiculoTipo: 'CRA',
    veiculoNome: '2ª CRA Futura Insumos',
    veiculoId: 'cra-futura',
    cedente: 'Futura Agro',
    cedenteCnpj: '90.123.456/0001-78',
    sacado: 'Revenda Oeste Brasil',
    sacadoCnpj: '66.777.888/0001-11',
    canal: 'SMS',
    destinatario: '+55 43 99765-4433',
    dataEnvio: '11/07/2026 09:15',
    dataCriacao: '11/07/2026',
    status: 'FALHOU',
    tentativas: 3,
    comprovanteRef: null,
    valorCessao: 55000,
  },
  {
    id: 'nc-4',
    protocolo: 'NC-2026-1004',
    tipo: 'Cessao',
    lastro: 'NC',
    tituloNumero: 'FIDC-AGRO-033',
    tituloId: 'tit-6',
    veiculoTipo: 'FIDC',
    veiculoNome: 'BOASAFRA FIDC',
    veiculoId: 'fidc-boasafra',
    cedente: 'Sementes Vale do Sol',
    cedenteCnpj: '67.890.123/0001-45',
    sacado: 'Produtor João Mendes',
    sacadoCnpj: '123.456.789-00',
    canal: 'Carta',
    destinatario: 'Rua das Palmeiras, 120 — Londrina/PR',
    dataEnvio: '07/07/2026 16:00',
    dataCriacao: '06/07/2026',
    status: 'ENVIADA',
    tentativas: 1,
    comprovanteRef: 'CMP-1004-B',
    valorCessao: 150000,
  },
  {
    id: 'nc-5',
    protocolo: 'NC-2026-1005',
    tipo: 'Cessao',
    lastro: 'DM',
    tituloNumero: 'FIDC-CER-055',
    tituloId: 'tit-10',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Ceres Confina LTDA',
    veiculoId: 'fidc-ceres',
    cedente: 'Confina Horizonte',
    cedenteCnpj: '01.234.567/0001-89',
    sacado: 'Frigorífico Centro Sul',
    sacadoCnpj: '77.888.999/0001-22',
    canal: 'Email',
    destinatario: 'cobranca@frigosul.com.br',
    dataEnvio: '13/07/2026 11:48',
    dataCriacao: '13/07/2026',
    status: 'ENVIADA',
    tentativas: 1,
    comprovanteRef: 'CMP-1005-C',
    valorCessao: 280000,
  },
  {
    id: 'nc-6',
    protocolo: 'NC-2026-1006',
    tipo: 'Cessao',
    lastro: 'CCB',
    tituloNumero: 'CRA-BTG2-001',
    tituloId: 'tit-3',
    veiculoTipo: 'CRA',
    veiculoNome: '42ª CRA Ceres',
    veiculoId: 'cra-ceres',
    cedente: 'Insumos Campo Verde',
    cedenteCnpj: '34.567.890/0001-12',
    sacado: 'Agro Norte Distribuidora',
    sacadoCnpj: '55.666.777/0001-88',
    canal: 'WhatsApp',
    destinatario: '+55 44 99123-8899',
    dataEnvio: null,
    dataCriacao: '14/07/2026',
    status: 'PENDENTE',
    tentativas: 0,
    comprovanteRef: null,
    valorCessao: 64000,
  },
  {
    id: 'nc-7',
    protocolo: 'NC-2026-1007',
    tipo: 'Regua',
    lastro: 'CPR-F',
    tituloNumero: 'CRA-NAT-014',
    tituloId: 'tit-7',
    veiculoTipo: 'CRA',
    veiculoNome: '34ª CRA Nativa',
    veiculoId: 'cra-nativa',
    cedente: 'Nativa Insumos',
    cedenteCnpj: '78.901.234/0001-56',
    sacado: 'Fazenda Três Barras',
    sacadoCnpj: '33.444.555/0001-66',
    canal: 'Email',
    destinatario: 'admin@fazendatresbarras.com',
    dataEnvio: '09/07/2026 10:02',
    dataCriacao: '09/07/2026',
    status: 'CANCELADA',
    tentativas: 1,
    comprovanteRef: null,
    valorCessao: 89000,
  },
  {
    id: 'nc-8',
    protocolo: 'NC-2026-1008',
    tipo: 'Regua',
    lastro: 'CDCA',
    tituloNumero: 'FIDC-VAL-007',
    tituloId: 'tit-8',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Valoriza FIDC',
    veiculoId: 'fidc-valoriza',
    cedente: 'Valoriza Commodities',
    cedenteCnpj: '89.012.345/0001-67',
    sacado: 'Exportadora Atlântico',
    sacadoCnpj: '44.555.666/0001-77',
    canal: 'Email',
    destinatario: 'juridico@atlantico.exp',
    dataEnvio: '02/07/2026 17:20',
    dataCriacao: '02/07/2026',
    status: 'FALHOU',
    tentativas: 2,
    comprovanteRef: null,
    valorCessao: 312000,
  },
  {
    id: 'nc-9',
    protocolo: 'NC-2026-1009',
    tipo: 'Cessao',
    lastro: 'NFE',
    tituloNumero: 'CRA-SEA4-001',
    tituloId: 'tit-1',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    cedente: 'Agropecuária Boa Safra',
    cedenteCnpj: '12.345.678/0001-90',
    sacado: 'Cooperativa Rural Oeste',
    sacadoCnpj: '98.765.432/0001-10',
    canal: 'SMS',
    destinatario: '+55 44 99876-1122',
    dataEnvio: '10/07/2026 08:40',
    dataCriacao: '10/07/2026',
    status: 'ENVIADA',
    tentativas: 1,
    comprovanteRef: 'CMP-1009-D',
    valorCessao: 185000,
  },
  {
    id: 'nc-10',
    protocolo: 'NC-2026-1010',
    tipo: 'Regua',
    lastro: 'DM',
    tituloNumero: 'FIDC-TITEC-101',
    tituloId: 'tit-4',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    cedente: 'SoftAgro Soluções',
    cedenteCnpj: '45.678.901/0001-23',
    sacado: 'Prefeitura de Londrina',
    sacadoCnpj: '76.543.210/0001-99',
    canal: 'Carta',
    destinatario: 'Av. Parigot de Souza, 800 — Londrina/PR',
    dataEnvio: null,
    dataCriacao: '14/07/2026',
    status: 'PENDENTE',
    tentativas: 0,
    comprovanteRef: null,
    valorCessao: 128500,
  },
];

const x = (
  grupoEmpresarial: string,
  situacaoGrupo: SituacaoGrupo,
  dataCessao: string,
  flags: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
  titulosGrupoIds: string[],
): CessaoExtra => ({
  grupoEmpresarial,
  situacaoGrupo,
  dataCessao,
  boleto: flags[0],
  cartaGerada: flags[1],
  titulosAVencerOuVencidos: flags[2],
  emailSacado: flags[3],
  cedentePermiteNotificacao: flags[4],
  sacadoPermiteNotificacao: flags[5],
  contaBancariaVeiculo: flags[6],
  titulosGrupoIds,
});

const EXTRAS: Record<string, CessaoExtra> = {
  'nc-1': x('Grupo Santa Clara', 'ATIVO', '05/07/2026', [false, false, true, true, true, true, true], ['tit-2', 'tit-1', 'tit-3']),
  'nc-2': x('Grupo Tech Rural', 'EM_ANALISE', '10/07/2026', [true, false, true, false, true, false, true], ['tit-5', 'tit-4']),
  'nc-3': x('Grupo Futura', 'ATIVO', '09/07/2026', [false, true, true, true, true, true, false], ['tit-9']),
  'nc-4': x('Grupo Vale do Sol', 'ATIVO', '04/07/2026', [true, true, false, false, true, true, true], ['tit-6', 'tit-10']),
  'nc-5': x('Grupo Horizonte', 'BLOQUEADO', '11/07/2026', [true, true, true, true, false, true, true], ['tit-10', 'tit-8']),
  'nc-6': x('Grupo Campo Verde', 'ATIVO', '12/07/2026', [false, false, false, true, true, true, true], ['tit-3', 'tit-7', 'tit-9']),
  'nc-7': x('Grupo Nativa', 'EM_ANALISE', '07/07/2026', [false, false, false, false, true, false, false], ['tit-7']),
  'nc-8': x('Grupo Valoriza', 'ATIVO', '30/06/2026', [true, true, false, true, true, true, true], ['tit-8']),
  'nc-9': x('Grupo Boa Safra', 'ATIVO', '08/07/2026', [true, false, true, true, true, true, true], ['tit-1', 'tit-2']),
  'nc-10': x('Grupo SoftAgro', 'ATIVO', '12/07/2026', [false, false, true, true, true, false, true], ['tit-4', 'tit-5']),
};

export const NOTIFICACOES_CESSAO_SEED: NotificacaoCessao[] = NOTIFICACOES_BASE.map((n) => ({
  ...n,
  ...EXTRAS[n.id],
}));

export const GRUPO_CESSAO_OPTS = Array.from(new Set(NOTIFICACOES_CESSAO_SEED.map((n) => n.grupoEmpresarial))).sort();

export const SITUACAO_GRUPO_OPTS: SituacaoGrupo[] = ['ATIVO', 'EM_ANALISE', 'BLOQUEADO'];

export function situacaoGrupoLabel(s: SituacaoGrupo): string {
  return ({ ATIVO: 'Ativo', EM_ANALISE: 'Em análise', BLOQUEADO: 'Bloqueado' } as const)[s];
}

export function situacaoGrupoColor(s: SituacaoGrupo): string {
  return (
    { ATIVO: 'var(--success-base)', EM_ANALISE: 'var(--warning-base)', BLOQUEADO: 'var(--danger-base)' } as const
  )[s];
}

export type TomTag = 'ok' | 'alerta' | 'falta' | 'neutro';

export interface TagCessao {
  key: string;
  label: string;
  tom: TomTag;
}

/** Tags em texto: cada uma diz a condição e o estado, sem depender de ícone ou cor. */
export function tagsCessao(n: NotificacaoCessao): TagCessao[] {
  return [
    { key: 'boleto', label: n.boleto ? 'Boleto gerado' : 'Boleto pendente', tom: n.boleto ? 'ok' : 'falta' },
    {
      key: 'carta',
      label: n.cartaGerada ? 'Carta gerada' : 'Carta não gerada',
      tom: n.cartaGerada ? 'ok' : 'neutro',
    },
    {
      key: 'titulos',
      label: n.titulosAVencerOuVencidos ? 'Títulos a vencer ou vencidos' : 'Sem títulos a vencer ou vencidos',
      tom: n.titulosAVencerOuVencidos ? 'alerta' : 'neutro',
    },
    {
      key: 'email',
      label: n.emailSacado ? 'E-mail do sacado informado' : 'Sem e-mail do sacado',
      tom: n.emailSacado ? 'ok' : 'falta',
    },
    {
      key: 'cedente',
      label: n.cedentePermiteNotificacao ? 'Cedente permite notificação' : 'Cedente não permite notificação',
      tom: n.cedentePermiteNotificacao ? 'ok' : 'falta',
    },
    {
      key: 'sacado',
      label: n.sacadoPermiteNotificacao ? 'Sacado permite notificação' : 'Sacado não permite notificação',
      tom: n.sacadoPermiteNotificacao ? 'ok' : 'falta',
    },
    {
      key: 'conta',
      label: n.contaBancariaVeiculo ? 'Conta bancária do veículo' : 'Sem conta bancária do veículo',
      tom: n.contaBancariaVeiculo ? 'ok' : 'falta',
    },
  ];
}

export const VEICULO_CESSAO_OPTS = Array.from(
  new Map(NOTIFICACOES_CESSAO_SEED.map((n) => [n.veiculoId, n.veiculoNome])).entries(),
).map(([id, nome]) => ({ id, nome }));
