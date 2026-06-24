export type FidcCategory = 'MONOCLASSE' | 'MULTICLASSE';

export type TitleStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';
export type LastroTipo = 'NFE' | 'DM' | 'CPR_F' | 'NC' | 'CTE' | 'CH' | 'DS';

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

export function num(n: number) {
  return n.toLocaleString('pt-BR');
}
