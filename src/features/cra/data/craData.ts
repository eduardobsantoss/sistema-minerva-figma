export type CraTipo = 'MONO CRA' | 'MULTI CRA';
export type CraStatus = 'EM ANDAMENTO' | 'ENCERRADO';
export type TituloStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';

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

export interface Cra {
  id: string;
  nome: string;
  cnpj: string;
  cessionaria: string;
  status: CraStatus;
  operacoes: CraOperacao[];
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
    },
    {
      id: `${prefix}-t2`, numero: `${prefix}-002`, tipo: 'CDA-WA',
      cedente: 'Agropecuária Bela Vista', cedenteCnpj: '11.222.333/0001-44',
      sacado: 'Coop. Agroindustrial Sul', sacadoCnpj: '55.666.777/0001-88',
      emissao: '2024-02-01', vencimento: '2025-02-01', vrNominal: 320_000,
      status: 'CONFIRMADO', operacaoId,
    },
    {
      id: `${prefix}-t3`, numero: `${prefix}-003`, tipo: 'CDCA',
      cedente: 'Produtor Rural Santos', cedenteCnpj: '44.555.666/0001-77',
      sacado: 'Cerealista Norte LTDA', sacadoCnpj: '22.333.444/0001-55',
      emissao: '2024-03-10', vencimento: '2024-12-10', vrNominal: 185_000,
      status: 'VENCIDO', operacaoId,
    },
    {
      id: `${prefix}-t4`, numero: `${prefix}-004`, tipo: 'CPR-F',
      cedente: 'Grupo Agroville', cedenteCnpj: '33.444.555/0001-22',
      sacado: 'Distribuidora Campo Verde', sacadoCnpj: '77.888.999/0001-11',
      emissao: '2024-04-05', vencimento: '2025-04-05', vrNominal: 610_000,
      status: 'PENDENTE', operacaoId,
    },
    {
      id: `${prefix}-t5`, numero: `${prefix}-005`, tipo: 'CDCA',
      cedente: 'Fazenda Boa Terra', cedenteCnpj: '66.777.888/0001-33',
      sacado: 'Tradings do Brasil S/A', sacadoCnpj: '11.223.334/0001-56',
      emissao: '2024-05-20', vencimento: '2025-05-20', vrNominal: 390_000,
      status: 'CONFIRMADO', operacaoId,
    },
  ];
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
  },
];

export const gruposEmpresariais = [
  'Grupo Ceres', 'Semeagro', 'BTG Agro', 'Raízen', 'Cargill Brasil',
  'JBS Agro', 'Marfrig Agro', 'São Martinho', 'Tereos', 'Amaggi Group',
  'SLC Agrícola', 'BrasilAgro', 'Boa Safra Sementes', 'Lavoro', 'Vittia',
  'Nutrien Soluções Agrícolas', 'Corteva Agriscience', 'Bayer CropScience',
  'BASF Agricultural', 'Mosaic Fertilizantes', 'Heringer', 'Timac Agro',
  'Copercampos', 'Coamo', 'Castrolanda',
];
