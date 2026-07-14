export type VeiculoTipo = 'CRA' | 'FIDC';
export type TituloStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO' | 'EM_NEGOCIACAO';

export interface Titulo {
  id: string;
  numero: string;
  veiculoTipo: VeiculoTipo;
  veiculoNome: string;
  veiculoId: string;
  tipo: string;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  emissao: string;
  vencimento: string;
  vrNominal: number;
  vrAberto: number;
  vrPresente?: number;
  status: TituloStatus;
  diasAtraso: number;
  ultimaNotificacaoEm?: string | null;
  boletoGeradoEm?: string | null;
  classeOuOperacao?: string;
}

export const TITULO_STATUS_OPTS: TituloStatus[] = [
  'CONFIRMADO',
  'PENDENTE',
  'VENCIDO',
  'EM_NEGOCIACAO',
];

export const VEICULO_TIPO_OPTS: VeiculoTipo[] = ['CRA', 'FIDC'];

export function statusTituloLabel(s: TituloStatus): string {
  return (
    {
      CONFIRMADO: 'Confirmado',
      PENDENTE: 'Pendente',
      VENCIDO: 'Vencido',
      EM_NEGOCIACAO: 'Em Negociação',
    } as const
  )[s];
}

export function statusTituloColor(s: TituloStatus): string {
  return (
    {
      CONFIRMADO: 'var(--success-base)',
      PENDENTE: 'var(--warning-base)',
      VENCIDO: 'var(--danger-base)',
      EM_NEGOCIACAO: 'var(--agro-base)',
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

export const TITULOS_SEED: Titulo[] = [
  {
    id: 'tit-1',
    numero: 'CRA-SEA4-001',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    tipo: 'CPR-F',
    cedente: 'Agropecuária Boa Safra',
    cedenteCnpj: '12.345.678/0001-90',
    sacado: 'Cooperativa Rural Oeste',
    sacadoCnpj: '98.765.432/0001-10',
    emissao: '12/01/2026',
    vencimento: '15/08/2026',
    vrNominal: 185000,
    vrAberto: 0,
    vrPresente: 182400,
    status: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '10/07/2026',
    boletoGeradoEm: '05/07/2026',
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-2',
    numero: 'CRA-SEA4-002',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    tipo: 'CPR-F',
    cedente: 'Fazenda Santa Clara',
    cedenteCnpj: '23.456.789/0001-01',
    sacado: 'Trading Grãos Sul',
    sacadoCnpj: '11.222.333/0001-44',
    emissao: '20/12/2025',
    vencimento: '26/06/2026',
    vrNominal: 92000,
    vrAberto: 92000,
    vrPresente: 94500,
    status: 'VENCIDO',
    diasAtraso: 18,
    ultimaNotificacaoEm: '08/07/2026',
    boletoGeradoEm: null,
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-3',
    numero: 'CRA-BTG2-001',
    veiculoTipo: 'CRA',
    veiculoNome: '42ª CRA Ceres',
    veiculoId: 'cra-ceres',
    tipo: 'NFE',
    cedente: 'Insumos Campo Verde',
    cedenteCnpj: '34.567.890/0001-12',
    sacado: 'Agro Norte Distribuidora',
    sacadoCnpj: '55.666.777/0001-88',
    emissao: '03/03/2026',
    vencimento: '20/09/2026',
    vrNominal: 64000,
    vrAberto: 64000,
    status: 'PENDENTE',
    diasAtraso: 0,
    ultimaNotificacaoEm: null,
    boletoGeradoEm: null,
    classeOuOperacao: 'Mezanino',
  },
  {
    id: 'tit-4',
    numero: 'FIDC-TITEC-101',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    tipo: 'NFE',
    cedente: 'SoftAgro Soluções',
    cedenteCnpj: '45.678.901/0001-23',
    sacado: 'Prefeitura de Londrina',
    sacadoCnpj: '76.543.210/0001-99',
    emissao: '15/02/2026',
    vencimento: '10/10/2026',
    vrNominal: 128500,
    vrAberto: 128500,
    vrPresente: 125100,
    status: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '01/07/2026',
    boletoGeradoEm: '01/07/2026',
    classeOuOperacao: 'Classe A',
  },
  {
    id: 'tit-5',
    numero: 'FIDC-TITEC-118',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    tipo: 'DM',
    cedente: 'Tech Rural BR',
    cedenteCnpj: '56.789.012/0001-34',
    sacado: 'Rede Agro Markets',
    sacadoCnpj: '22.333.444/0001-55',
    emissao: '08/11/2025',
    vencimento: '30/05/2026',
    vrNominal: 47500,
    vrAberto: 47500,
    status: 'VENCIDO',
    diasAtraso: 45,
    ultimaNotificacaoEm: '12/07/2026',
    boletoGeradoEm: '20/06/2026',
    classeOuOperacao: 'Classe A',
  },
  {
    id: 'tit-6',
    numero: 'FIDC-AGRO-033',
    veiculoTipo: 'FIDC',
    veiculoNome: 'BOASAFRA FIDC',
    veiculoId: 'fidc-boasafra',
    tipo: 'CPR_F',
    cedente: 'Sementes Vale do Sol',
    cedenteCnpj: '67.890.123/0001-45',
    sacado: 'Produtor João Mendes',
    sacadoCnpj: '123.456.789-00',
    emissao: '22/01/2026',
    vencimento: '05/07/2026',
    vrNominal: 210000,
    vrAberto: 150000,
    status: 'EM_NEGOCIACAO',
    diasAtraso: 9,
    ultimaNotificacaoEm: '07/07/2026',
    boletoGeradoEm: '28/06/2026',
    classeOuOperacao: 'Única',
  },
  {
    id: 'tit-7',
    numero: 'CRA-NAT-014',
    veiculoTipo: 'CRA',
    veiculoNome: '34ª CRA Nativa',
    veiculoId: 'cra-nativa',
    tipo: 'CDCA',
    cedente: 'Nativa Insumos',
    cedenteCnpj: '78.901.234/0001-56',
    sacado: 'Fazenda Três Barras',
    sacadoCnpj: '33.444.555/0001-66',
    emissao: '10/04/2026',
    vencimento: '18/11/2026',
    vrNominal: 89000,
    vrAberto: 89000,
    status: 'PENDENTE',
    diasAtraso: 0,
    ultimaNotificacaoEm: null,
    boletoGeradoEm: null,
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-8',
    numero: 'FIDC-VAL-007',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Valoriza FIDC',
    veiculoId: 'fidc-valoriza',
    tipo: 'NFE',
    cedente: 'Valoriza Commodities',
    cedenteCnpj: '89.012.345/0001-67',
    sacado: 'Exportadora Atlântico',
    sacadoCnpj: '44.555.666/0001-77',
    emissao: '28/02/2026',
    vencimento: '30/08/2026',
    vrNominal: 312000,
    vrAberto: 0,
    vrPresente: 308200,
    status: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '02/07/2026',
    boletoGeradoEm: '02/07/2026',
    classeOuOperacao: 'Classe Sênior',
  },
  {
    id: 'tit-9',
    numero: 'CRA-FUT-022',
    veiculoTipo: 'CRA',
    veiculoNome: '2ª CRA Futura Insumos',
    veiculoId: 'cra-futura',
    tipo: 'DUPLICATA',
    cedente: 'Futura Agro',
    cedenteCnpj: '90.123.456/0001-78',
    sacado: 'Revenda Oeste Brasil',
    sacadoCnpj: '66.777.888/0001-11',
    emissao: '05/01/2026',
    vencimento: '07/07/2026',
    vrNominal: 55000,
    vrAberto: 55000,
    status: 'VENCIDO',
    diasAtraso: 7,
    ultimaNotificacaoEm: '11/07/2026',
    boletoGeradoEm: null,
    classeOuOperacao: 'Subordinada',
  },
  {
    id: 'tit-10',
    numero: 'FIDC-CER-055',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Ceres Confina LTDA',
    veiculoId: 'fidc-ceres',
    tipo: 'CPR_F',
    cedente: 'Confina Horizonte',
    cedenteCnpj: '01.234.567/0001-89',
    sacado: 'Frigorífico Centro Sul',
    sacadoCnpj: '77.888.999/0001-22',
    emissao: '18/03/2026',
    vencimento: '22/06/2026',
    vrNominal: 430000,
    vrAberto: 280000,
    status: 'EM_NEGOCIACAO',
    diasAtraso: 22,
    ultimaNotificacaoEm: '13/07/2026',
    boletoGeradoEm: '15/06/2026',
    classeOuOperacao: 'Única',
  },
];

export const VEICULO_OPTS = Array.from(
  new Map(TITULOS_SEED.map((t) => [t.veiculoId, t.veiculoNome])).entries(),
).map(([id, nome]) => ({ id, nome }));
