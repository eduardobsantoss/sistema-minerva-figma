export type TipoOperacaoSemi = 'NC' | 'CPRF' | 'CCB' | 'CDCA' | 'CDA' | 'CPR';

export type SemiLastroStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';

export type SemiParcelaStatus = 'A_PAGAR' | 'PAGO' | 'VENCIDO';

export interface SemiParcelaCota {
  id: string;
  numero: number;
  vencimento: string;
  valor: number;
  status: SemiParcelaStatus;
  tipoObrigacao?: string;
}

export interface SemiCota {
  id: string;
  veiculoAdquirente: string;
  percentualAdquirido: number;
  quantidadeCotas: number;
  valorUnitario: number;
  valorTotal: number;
  cronograma: SemiParcelaCota[];
}

export interface SemiLastro {
  id: string;
  numero: string;
  lastro: string;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  vencimento: string;
  vrNominal: number;
  status: SemiLastroStatus;
}

export interface SemiGarantia extends SemiLastro {
  tipoGarantia: string;
}

export interface SemiOperacao {
  id: string;
  tipo: TipoOperacaoSemi;
  nome: string;
  cedente: string;
  cedenteCnpj: string;
  valorNominal: number;
  valorComposicao: number;
  garantiasDuplicatas: { valor: number; pct: number };
  demaisGarantias: { valor: number; pct: number };
  valorAbertoGarantia: number;
  coberturaPct: number;
  status: string;
  cotas: SemiCota[];
  lastros: SemiLastro[];
  garantias: SemiGarantia[];
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

export function pct(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

function cronograma(prefix: string, baseValor: number): SemiParcelaCota[] {
  return [
    {
      id: `${prefix}-p1`,
      numero: 1,
      vencimento: '15/03/2026',
      valor: baseValor * 0.25,
      status: 'PAGO',
      tipoObrigacao: 'Amortização',
    },
    {
      id: `${prefix}-p2`,
      numero: 2,
      vencimento: '15/06/2026',
      valor: baseValor * 0.25,
      status: 'A_PAGAR',
      tipoObrigacao: 'Amortização',
    },
    {
      id: `${prefix}-p3`,
      numero: 3,
      vencimento: '15/09/2026',
      valor: baseValor * 0.25,
      status: 'A_PAGAR',
      tipoObrigacao: 'Juros',
    },
    {
      id: `${prefix}-p4`,
      numero: 4,
      vencimento: '15/12/2026',
      valor: baseValor * 0.25,
      status: 'A_PAGAR',
      tipoObrigacao: 'Amortização + Juros',
    },
  ];
}

function lastros(prefix: string, cedente: string, cedenteCnpj: string): SemiLastro[] {
  return [
    {
      id: `${prefix}-l1`,
      numero: `${prefix}-001`,
      lastro: 'NC',
      cedente,
      cedenteCnpj,
      sacado: 'Cooperativa Agro Norte',
      sacadoCnpj: '11.222.333/0001-44',
      vencimento: '20/04/2026',
      vrNominal: 850_000,
      status: 'CONFIRMADO',
    },
    {
      id: `${prefix}-l2`,
      numero: `${prefix}-002`,
      lastro: 'DM',
      cedente,
      cedenteCnpj,
      sacado: 'Trading Grãos Sul',
      sacadoCnpj: '22.333.444/0001-55',
      vencimento: '10/06/2026',
      vrNominal: 1_200_000,
      status: 'PENDENTE',
    },
    {
      id: `${prefix}-l3`,
      numero: `${prefix}-003`,
      lastro: 'CPR_F',
      cedente,
      cedenteCnpj,
      sacado: 'Fazenda Boa Vista',
      sacadoCnpj: '33.444.555/0001-66',
      vencimento: '05/02/2026',
      vrNominal: 640_000,
      status: 'VENCIDO',
    },
  ];
}

function garantias(prefix: string, cedente: string, cedenteCnpj: string): SemiGarantia[] {
  return [
    {
      id: `${prefix}-g1`,
      numero: `${prefix}-G01`,
      lastro: 'NFE',
      tipoGarantia: 'NFe',
      cedente,
      cedenteCnpj,
      sacado: 'Indústria Alimentos Beta',
      sacadoCnpj: '44.555.666/0001-77',
      vencimento: '30/05/2026',
      vrNominal: 980_000,
      status: 'CONFIRMADO',
    },
    {
      id: `${prefix}-g2`,
      numero: `${prefix}-G02`,
      lastro: 'AF',
      tipoGarantia: 'AF Imóvel',
      cedente,
      cedenteCnpj,
      sacado: '—',
      sacadoCnpj: '—',
      vencimento: '15/12/2027',
      vrNominal: 2_500_000,
      status: 'CONFIRMADO',
    },
    {
      id: `${prefix}-g3`,
      numero: `${prefix}-G03`,
      lastro: 'AF',
      tipoGarantia: 'AF Agrícola',
      cedente,
      cedenteCnpj,
      sacado: '—',
      sacadoCnpj: '—',
      vencimento: '20/08/2026',
      vrNominal: 1_100_000,
      status: 'PENDENTE',
    },
    {
      id: `${prefix}-g4`,
      numero: `${prefix}-G04`,
      lastro: 'AF',
      tipoGarantia: 'AF Estoque',
      cedente,
      cedenteCnpj,
      sacado: 'Armazém Central',
      sacadoCnpj: '55.666.777/0001-88',
      vencimento: '01/10/2026',
      vrNominal: 750_000,
      status: 'CONFIRMADO',
    },
  ];
}

export const operacoes: SemiOperacao[] = [
  {
    id: 'semi-nc-polli',
    tipo: 'NC',
    nome: 'NC_POLLI_122025',
    cedente: 'Polli Agropecuária S.A.',
    cedenteCnpj: '12.345.678/0001-90',
    valorNominal: 15_000_000,
    valorComposicao: 18_200_000,
    garantiasDuplicatas: { valor: 9_800_000, pct: 53.8 },
    demaisGarantias: { valor: 8_400_000, pct: 46.2 },
    valorAbertoGarantia: 16_450_000,
    coberturaPct: 121.3,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-nc-polli-c1',
        veiculoAdquirente: 'FIDC Agro Horizonte',
        percentualAdquirido: 40,
        quantidadeCotas: 6000,
        valorUnitario: 1000,
        valorTotal: 6_000_000,
        cronograma: cronograma('nc-polli-c1', 6_000_000),
      },
      {
        id: 'semi-nc-polli-c2',
        veiculoAdquirente: 'CRA Semeagro',
        percentualAdquirido: 35,
        quantidadeCotas: 5250,
        valorUnitario: 1000,
        valorTotal: 5_250_000,
        cronograma: cronograma('nc-polli-c2', 5_250_000),
      },
      {
        id: 'semi-nc-polli-c3',
        veiculoAdquirente: 'FIDC Cultura Premium',
        percentualAdquirido: 25,
        quantidadeCotas: 3750,
        valorUnitario: 1000,
        valorTotal: 3_750_000,
        cronograma: cronograma('nc-polli-c3', 3_750_000),
      },
    ],
    lastros: lastros('NC-POLLI', 'Polli Agropecuária S.A.', '12.345.678/0001-90'),
    garantias: garantias('NC-POLLI', 'Polli Agropecuária S.A.', '12.345.678/0001-90'),
  },
  {
    id: 'semi-cdca-cultura',
    tipo: 'CDCA',
    nome: 'CDCA_CULTURA_092025',
    cedente: 'Cultura Commodities Ltda.',
    cedenteCnpj: '23.456.789/0001-01',
    valorNominal: 22_500_000,
    valorComposicao: 26_800_000,
    garantiasDuplicatas: { valor: 14_200_000, pct: 53.0 },
    demaisGarantias: { valor: 12_600_000, pct: 47.0 },
    valorAbertoGarantia: 24_100_000,
    coberturaPct: 119.1,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-cdca-cultura-c1',
        veiculoAdquirente: 'FIDC Vale Verde',
        percentualAdquirido: 55,
        quantidadeCotas: 12375,
        valorUnitario: 1000,
        valorTotal: 12_375_000,
        cronograma: cronograma('cdca-cultura-c1', 12_375_000),
      },
      {
        id: 'semi-cdca-cultura-c2',
        veiculoAdquirente: 'CRA Multiagro',
        percentualAdquirido: 45,
        quantidadeCotas: 10125,
        valorUnitario: 1000,
        valorTotal: 10_125_000,
        cronograma: cronograma('cdca-cultura-c2', 10_125_000),
      },
    ],
    lastros: lastros('CDCA-CULT', 'Cultura Commodities Ltda.', '23.456.789/0001-01').map((l) => ({
      ...l,
      lastro: l.lastro === 'NC' ? 'CDCA' : l.lastro,
    })),
    garantias: [
      ...garantias('CDCA-CULT', 'Cultura Commodities Ltda.', '23.456.789/0001-01'),
      {
        id: 'cdca-cultura-g5',
        numero: 'CDCA-CULT-G05',
        lastro: 'AF',
        tipoGarantia: 'AF Produção',
        cedente: 'Cultura Commodities Ltda.',
        cedenteCnpj: '23.456.789/0001-01',
        sacado: '—',
        sacadoCnpj: '—',
        vencimento: '30/11/2026',
        vrNominal: 3_200_000,
        status: 'CONFIRMADO',
      },
    ],
  },
  {
    id: 'semi-cpr-enevva',
    tipo: 'CPR',
    nome: 'CPR_ENEVVA_012026',
    cedente: 'Enevva Agronegócios',
    cedenteCnpj: '34.567.890/0001-12',
    valorNominal: 8_750_000,
    valorComposicao: 10_400_000,
    garantiasDuplicatas: { valor: 4_100_000, pct: 39.4 },
    demaisGarantias: { valor: 6_300_000, pct: 60.6 },
    valorAbertoGarantia: 9_200_000,
    coberturaPct: 118.9,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-cpr-enevva-c1',
        veiculoAdquirente: 'FIDC Solo Rico',
        percentualAdquirido: 70,
        quantidadeCotas: 6125,
        valorUnitario: 1000,
        valorTotal: 6_125_000,
        cronograma: cronograma('cpr-enevva-c1', 6_125_000),
      },
      {
        id: 'semi-cpr-enevva-c2',
        veiculoAdquirente: 'CRA Terra Forte',
        percentualAdquirido: 30,
        quantidadeCotas: 2625,
        valorUnitario: 1000,
        valorTotal: 2_625_000,
        cronograma: cronograma('cpr-enevva-c2', 2_625_000),
      },
    ],
    lastros: lastros('CPR-ENEV', 'Enevva Agronegócios', '34.567.890/0001-12').map((l) => ({
      ...l,
      lastro: 'CPR',
    })),
    garantias: garantias('CPR-ENEV', 'Enevva Agronegócios', '34.567.890/0001-12').map((g, i) =>
      i === 2 ? { ...g, tipoGarantia: 'AF Produção' } : g,
    ),
  },
  {
    id: 'semi-cprf-cultura',
    tipo: 'CPRF',
    nome: 'CPRF_CULTURA_112026',
    cedente: 'Cultura Commodities Ltda.',
    cedenteCnpj: '23.456.789/0001-01',
    valorNominal: 12_000_000,
    valorComposicao: 14_500_000,
    garantiasDuplicatas: { valor: 7_800_000, pct: 53.8 },
    demaisGarantias: { valor: 6_700_000, pct: 46.2 },
    valorAbertoGarantia: 13_100_000,
    coberturaPct: 120.8,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-cprf-cultura-c1',
        veiculoAdquirente: 'FIDC Agro Horizonte',
        percentualAdquirido: 50,
        quantidadeCotas: 6000,
        valorUnitario: 1000,
        valorTotal: 6_000_000,
        cronograma: cronograma('cprf-cultura-c1', 6_000_000),
      },
      {
        id: 'semi-cprf-cultura-c2',
        veiculoAdquirente: 'FIDC Cultura Premium',
        percentualAdquirido: 50,
        quantidadeCotas: 6000,
        valorUnitario: 1000,
        valorTotal: 6_000_000,
        cronograma: cronograma('cprf-cultura-c2', 6_000_000),
      },
    ],
    lastros: lastros('CPRF-CULT', 'Cultura Commodities Ltda.', '23.456.789/0001-01').map((l) => ({
      ...l,
      lastro: 'CPR_F',
    })),
    garantias: garantias('CPRF-CULT', 'Cultura Commodities Ltda.', '23.456.789/0001-01'),
  },
  {
    id: 'semi-ccb-atlas',
    tipo: 'CCB',
    nome: 'CCB_ATLAS_032026',
    cedente: 'Atlas Trading Agrícola',
    cedenteCnpj: '45.678.901/0001-23',
    valorNominal: 5_500_000,
    valorComposicao: 6_800_000,
    garantiasDuplicatas: { valor: 3_900_000, pct: 57.4 },
    demaisGarantias: { valor: 2_900_000, pct: 42.6 },
    valorAbertoGarantia: 6_050_000,
    coberturaPct: 123.6,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-ccb-atlas-c1',
        veiculoAdquirente: 'FIDC Vale Verde',
        percentualAdquirido: 100,
        quantidadeCotas: 5500,
        valorUnitario: 1000,
        valorTotal: 5_500_000,
        cronograma: cronograma('ccb-atlas-c1', 5_500_000),
      },
    ],
    lastros: lastros('CCB-ATLAS', 'Atlas Trading Agrícola', '45.678.901/0001-23').map((l) => ({
      ...l,
      lastro: 'CCB',
    })),
    garantias: garantias('CCB-ATLAS', 'Atlas Trading Agrícola', '45.678.901/0001-23'),
  },
  {
    id: 'semi-cda-safra',
    tipo: 'CDA',
    nome: 'CDA_SAFRA_062026',
    cedente: 'Safra Armazéns S.A.',
    cedenteCnpj: '56.789.012/0001-34',
    valorNominal: 9_200_000,
    valorComposicao: 11_000_000,
    garantiasDuplicatas: { valor: 2_200_000, pct: 20.0 },
    demaisGarantias: { valor: 8_800_000, pct: 80.0 },
    valorAbertoGarantia: 10_150_000,
    coberturaPct: 119.6,
    status: 'EM ANDAMENTO',
    cotas: [
      {
        id: 'semi-cda-safra-c1',
        veiculoAdquirente: 'CRA Semeagro',
        percentualAdquirido: 60,
        quantidadeCotas: 5520,
        valorUnitario: 1000,
        valorTotal: 5_520_000,
        cronograma: cronograma('cda-safra-c1', 5_520_000),
      },
      {
        id: 'semi-cda-safra-c2',
        veiculoAdquirente: 'FIDC Solo Rico',
        percentualAdquirido: 40,
        quantidadeCotas: 3680,
        valorUnitario: 1000,
        valorTotal: 3_680_000,
        cronograma: cronograma('cda-safra-c2', 3_680_000),
      },
    ],
    lastros: lastros('CDA-SAFRA', 'Safra Armazéns S.A.', '56.789.012/0001-34').map((l) => ({
      ...l,
      lastro: 'CDA',
    })),
    garantias: garantias('CDA-SAFRA', 'Safra Armazéns S.A.', '56.789.012/0001-34').map((g, i) =>
      i === 1 ? { ...g, tipoGarantia: 'AF Estoque' } : g,
    ),
  },
];
