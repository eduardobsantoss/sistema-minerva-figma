export type CraTipo = 'MONO CRA' | 'MULTI CRA';
export type CraStatus = 'EM ANDAMENTO' | 'ENCERRADO';
export type TituloStatus = 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';

export type CessaoStatus = 'LIQUIDADO' | 'PENDENTE' | 'PARCIAL';

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

export interface Cra {
  id: string;
  nome: string;
  cnpj: string;
  cessionaria: string;
  status: CraStatus;
  tipo?: CraTipo;
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
