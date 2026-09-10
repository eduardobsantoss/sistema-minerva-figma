import { brl, type Veiculo } from './passivoNovoData';

export type CarteiraSliceKey =
  | 'posicao'
  | 'aging'
  | 'pmts'
  | 'pdd-estresse'
  | 'waterfall'
  | 'abertura-pdd'
  | 'movimentacao'
  | 'enquadramento';

export interface EnquadramentoRow {
  id: string;
  label: string;
  permitido: number | null;
  posicaoAtual: number;
  vp?: number;
  status: 'OK' | 'Alerta';
}

export interface BaseEnquadramento {
  label: string;
  valor: number;
}

export interface ConcentracaoRow {
  id: string;
  nome: string;
  lastros: number;
  vpLiquido: number;
  pctBase: number;
}

export interface AgingFaixaRow {
  id: string;
  faixa: string;
  valor: number;
  pct: number;
}

export interface Vencimento30dRow {
  id: string;
  devedor: string;
  vencimento: string;
  dias: number;
  vp: number;
}

export interface CedenteVencidoRow {
  id: string;
  cedente: string;
  lastros: number;
  diasVenc: number;
  vp: number;
  pctPl: number;
}

export interface PmtVencidaRow {
  id: string;
  lastro: string;
  cedente: string;
  tipo: string;
  dataPmt: string;
  diasVenc: number;
  valorPmt: number;
}

export interface FaixaPddRow {
  id: string;
  cedente: string;
  lastros: number;
  vencimento: string;
  faixaAtual: string;
  proxFaixa: string;
  mudaEm: number;
  vp: number;
  farol: 'Critico' | 'Atencao' | 'Ok';
}

export interface PddBarPoint {
  data: string;
  valor: number;
}

export interface WaterfallStep {
  id: string;
  label: string;
  delta: number;
  kind: 'base' | 'delta' | 'proj';
}

export interface RolagemRow {
  id: string;
  rolagem: string;
  sacado: string;
  vpRisco: number;
  atraso: number;
}

export interface RolagemJanela {
  id: string;
  periodo: string;
  rows: RolagemRow[];
}

export interface PddRankingRow {
  id: string;
  nome: string;
  pdd: number;
  vn: number;
  dias: number;
}

export interface AgingListRow {
  id: string;
  faixa: string;
  vn: number;
  vp: number;
  pctCarteira: number;
}

export interface AberturaPddRow {
  id: string;
  cedente: string;
  valorAberto: number;
  pdd: number;
  status: string;
}

export interface MovimentoRow {
  id: string;
  cedente: string;
  valorNominal: number;
  valor: number;
  pctPl: number;
}

export interface CarteiraBundle {
  valorNominal: number;
  valorPresente: number;
  cedentes: number;
  sacados: number;
  prazoMedioDias: number;
  taxaMediaPct: number;
  carregoCraPct: number;
  carregoCraAa: string;
  preFixado: number;
  posFixado: number;
  pddTotal: number;
  vpVencido: number;
  rolagens30d: number;
  rolagens7d: number;
  cedentesComPdd: number;
  topCedentes: ConcentracaoRow[];
  topSacados: ConcentracaoRow[];
  agingVencimentos: AgingFaixaRow[];
  vencimentos30d: Vencimento30dRow[];
  cedentesVencidos: CedenteVencidoRow[];
  pmtsVencidas: PmtVencidaRow[];
  mudancasFaixa: FaixaPddRow[];
  estressePdd: PddBarPoint[];
  estressePeriodo: string;
  waterfall: WaterfallStep[];
  waterfallPeriodo: string;
  vencidosJanelas: RolagemJanela[];
  aVencerJanelas: RolagemJanela[];
  pddPorSacado: PddRankingRow[];
  pddPorCedente: PddRankingRow[];
  agingList: AgingListRow[];
  aberturaPdd: AberturaPddRow[];
  aquisicoesDia: number;
  aquisicoesCedentes: number;
  liquidacoesDia: number;
  liquidacoesCedentes: number;
  maiorAquisicaoNome: string;
  maiorAquisicaoValor: number;
  maiorLiquidacaoNome: string;
  maiorLiquidacaoValor: number;
  aberturaAquisicoes: MovimentoRow[];
  aberturaLiquidacoes: MovimentoRow[];
  baseEnquadramento: BaseEnquadramento;
  tipoAtivo: EnquadramentoRow[];
  limitesCedente: EnquadramentoRow[];
  limitesSacado: EnquadramentoRow[];
}

const CRA42_CARTEIRA: CarteiraBundle = {
  valorNominal: 625_059_954.12,
  valorPresente: 609_945_210.31,
  cedentes: 136,
  sacados: 1185,
  prazoMedioDias: 548,
  taxaMediaPct: 0.0188,
  carregoCraPct: 0.0152,
  carregoCraAa: '19,86% a.a. | DI 21/08/2026',
  preFixado: 285_100_000,
  posFixado: 322_100_000,
  pddTotal: 2_685_566,
  vpVencido: 40_100_000,
  rolagens30d: 1362,
  rolagens7d: 1058,
  cedentesComPdd: 10,
  topCedentes: [
    { id: 'c1', nome: 'ALLAS', lastros: 1, vpLiquido: 58_800_000, pctBase: 0.0581 },
    { id: 'c2', nome: 'ELETRO MANGANES', lastros: 1, vpLiquido: 53_900_000, pctBase: 0.0533 },
    { id: 'c3', nome: 'CULTURA AGRONEGOCIOS', lastros: 126, vpLiquido: 50_000_000, pctBase: 0.0494 },
    { id: 'c4', nome: 'CONFINA', lastros: 1, vpLiquido: 39_600_000, pctBase: 0.0391 },
    { id: 'c5', nome: 'RENOVAGRO - AGRONEGOCIOS', lastros: 189, vpLiquido: 39_100_000, pctBase: 0.0386 },
    { id: 'c6', nome: 'BRUNO PEIXOTO', lastros: 1, vpLiquido: 32_400_000, pctBase: 0.032 },
    { id: 'c7', nome: 'CLAUDIO NASSER', lastros: 1, vpLiquido: 25_800_000, pctBase: 0.0255 },
    { id: 'c8', nome: 'AGRO BOA E. C. D.', lastros: 3, vpLiquido: 25_200_000, pctBase: 0.0249 },
    { id: 'c9', nome: 'FORTE AGRO LTDA', lastros: 1, vpLiquido: 21_400_000, pctBase: 0.0211 },
    { id: 'c10', nome: 'BOIPREMIUM AGRO', lastros: 1, vpLiquido: 18_200_000, pctBase: 0.018 },
  ],
  topSacados: [
    { id: 's1', nome: 'ALLAS', lastros: 1, vpLiquido: 58_800_000, pctBase: 0.0581 },
    { id: 's2', nome: 'ELETRO MANGANES', lastros: 1, vpLiquido: 53_900_000, pctBase: 0.0533 },
    { id: 's3', nome: 'CONFINA', lastros: 1, vpLiquido: 39_600_000, pctBase: 0.0391 },
    { id: 's4', nome: 'CULTURA AGRONEGOCIOS', lastros: 11, vpLiquido: 35_900_000, pctBase: 0.0355 },
    { id: 's5', nome: 'BRUNO PEIXOTO', lastros: 1, vpLiquido: 32_400_000, pctBase: 0.032 },
    { id: 's6', nome: 'RENOVAGRO AGRICOLA', lastros: 2, vpLiquido: 27_500_000, pctBase: 0.0271 },
    { id: 's7', nome: 'CLAUDIO NASSER', lastros: 1, vpLiquido: 25_800_000, pctBase: 0.0255 },
    { id: 's8', nome: 'AGRO BOA E. C. D.', lastros: 3, vpLiquido: 25_200_000, pctBase: 0.0249 },
    { id: 's9', nome: 'FORTE AGRO LTDA', lastros: 1, vpLiquido: 21_400_000, pctBase: 0.0211 },
    { id: 's10', nome: 'BOIPREMIUM AGRO', lastros: 1, vpLiquido: 18_200_000, pctBase: 0.018 },
  ],
  agingVencimentos: [
    { id: 'a1', faixa: 'Vencidos', valor: 40_100_000, pct: 0.066 },
    { id: 'a2', faixa: '0 a 30 dias', valor: 51_300_000, pct: 0.0845 },
    { id: 'a3', faixa: '31 a 60 dias', valor: 69_800_000, pct: 0.1149 },
    { id: 'a4', faixa: '61 a 90 dias', valor: 18_900_000, pct: 0.0311 },
    { id: 'a5', faixa: '91 a 180 dias', valor: 27_200_000, pct: 0.0449 },
    { id: 'a6', faixa: '181 a 360 dias', valor: 52_200_000, pct: 0.0859 },
    { id: 'a7', faixa: 'Acima de 360 dias', valor: 347_800_000, pct: 0.5727 },
  ],
  vencimentos30d: [
    { id: 'v1', devedor: 'SUPERAGRO AGRONEGOCIOS EIRELI', vencimento: '30/08/2026', dias: 5, vp: 3_600_000 },
    { id: 'v2', devedor: 'W&L AGRONEGOCIOS LTDA', vencimento: '10/09/2026', dias: 16, vp: 846_000 },
    { id: 'v3', devedor: 'PEDRO RIBEIRO MEROLA', vencimento: '12/09/2026', dias: 18, vp: 1_700_000 },
    { id: 'v4', devedor: 'PEDRO RIBEIRO MEROLA', vencimento: '14/09/2026', dias: 20, vp: 1_120_000 },
    { id: 'v5', devedor: 'PEDRO RIBEIRO MEROLA', vencimento: '20/09/2026', dias: 26, vp: 980_000 },
  ],
  cedentesVencidos: [
    { id: 'cv1', cedente: 'INDUSTRIA QUIMICA KIMBERLIT LTDA', lastros: 1, diasVenc: 56, vp: 17_700_000, pctPl: 0.0174 },
    { id: 'cv2', cedente: 'NIVALDO ALVES PEREIRA FILHO', lastros: 1, diasVenc: 27, vp: 15_200_000, pctPl: 0.015 },
    { id: 'cv3', cedente: 'SIAP COMERCIO DE PRODUTOS AGROPECUARIOS LTDA', lastros: 81, diasVenc: 26, vp: 2_100_000, pctPl: 0.0021 },
    { id: 'cv4', cedente: 'ZITRA AGRONEGOCIOS LTDA', lastros: 3, diasVenc: 26, vp: 349_800, pctPl: 0.0003 },
    { id: 'cv5', cedente: 'B&F AGRO COMERCIO DE GRAOS E INSUMOS AGRICOLAS', lastros: 1, diasVenc: 14, vp: 3_000_000, pctPl: 0.0029 },
  ],
  pmtsVencidas: [
    { id: 'p1', lastro: '401111', cedente: 'OPENEEM BIOSCIENCE INDUSTRIA E COMERCIO S.A', tipo: 'NC', dataPmt: '26/03/2026', diasVenc: 150, valorPmt: 1_020_000 },
    { id: 'p2', lastro: '401208', cedente: 'ER FLOW MAQUINAS E COMPONENTES LTDA', tipo: 'CPR_F', dataPmt: '01/06/2026', diasVenc: 85, valorPmt: 757_600 },
    { id: 'p3', lastro: '401334', cedente: 'MARBO AGRICOLA LTDA', tipo: 'NC', dataPmt: '02/07/2026', diasVenc: 54, valorPmt: 412_000 },
    { id: 'p4', lastro: '401401', cedente: 'ALMO COFFEE AGRICOLA LTDA', tipo: 'NC', dataPmt: '18/07/2026', diasVenc: 38, valorPmt: 289_400 },
    { id: 'p5', lastro: '401455', cedente: 'BR AGRO AGRONEGOCIOS S.A', tipo: 'CPR_F', dataPmt: '24/07/2026', diasVenc: 32, valorPmt: 198_000 },
    { id: 'p6', lastro: '401512', cedente: 'SMARTFRIG COMERCIAL DE CARNES LTDA', tipo: 'NC', dataPmt: '01/08/2026', diasVenc: 24, valorPmt: 156_200 },
    { id: 'p7', lastro: '401588', cedente: 'SUPREMO CARNES LTDA', tipo: 'CPR_F', dataPmt: '08/08/2026', diasVenc: 17, valorPmt: 134_800 },
    { id: 'p8', lastro: '401620', cedente: 'TRES CORACOES ALIMENTOS SA', tipo: 'NC', dataPmt: '12/08/2026', diasVenc: 13, valorPmt: 98_500 },
    { id: 'p9', lastro: '401677', cedente: 'FOLIGREEN FERTILIZANTES LTDA', tipo: 'NC', dataPmt: '18/08/2026', diasVenc: 7, valorPmt: 72_300 },
  ],
  mudancasFaixa: [
    { id: 'f1', cedente: 'BR AGRO AGRONEGOCIOS S.A', lastros: 186, vencimento: '25/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 1, vp: 1_400_000, farol: 'Critico' },
    { id: 'f2', cedente: 'MARBO AGRICOLA LTDA', lastros: 32, vencimento: '26/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 1, vp: 528_800, farol: 'Critico' },
    { id: 'f3', cedente: 'OPENEEM BIOSCIENCE INDUSTRIA E COMERCIO S.A', lastros: 24, vencimento: '27/08/2026', faixaAtual: '121 a 150 dias', proxFaixa: '151 a 180 dias', mudaEm: 2, vp: 1_020_000, farol: 'Critico' },
    { id: 'f4', cedente: 'ELEVA AGRICOLA REPRESENTACOES', lastros: 1, vencimento: '28/03/2026', faixaAtual: '121 a 150 dias', proxFaixa: '151 a 180 dias', mudaEm: 2, vp: 1_700_000, farol: 'Critico' },
    { id: 'f5', cedente: 'CULTURA AGRONEGOCIOS', lastros: 18, vencimento: '28/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 3, vp: 412_000, farol: 'Critico' },
    { id: 'f6', cedente: 'SIAP COMERCIO DE PRODUTOS AGROPECUARIOS', lastros: 9, vencimento: '29/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 4, vp: 298_000, farol: 'Critico' },
    { id: 'f7', cedente: 'ZITRA AGRONEGOCIOS LTDA', lastros: 3, vencimento: '29/08/2026', faixaAtual: '1 a 30 dias', proxFaixa: '31 a 60 dias', mudaEm: 4, vp: 349_800, farol: 'Critico' },
    { id: 'f8', cedente: 'ALMO COFFEE AGRICOLA LTDA', lastros: 6, vencimento: '30/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 5, vp: 189_700, farol: 'Critico' },
    { id: 'f9', cedente: 'ER FLOW MAQUINAS E COMPONENTES', lastros: 2, vencimento: '30/08/2026', faixaAtual: '91 a 120 dias', proxFaixa: '121 a 150 dias', mudaEm: 5, vp: 202_700, farol: 'Critico' },
    { id: 'f10', cedente: 'SMARTFRIG COMERCIAL DE CARNES', lastros: 4, vencimento: '31/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 6, vp: 156_200, farol: 'Critico' },
    { id: 'f11', cedente: 'SUPREMO CARNES LTDA', lastros: 5, vencimento: '31/08/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 6, vp: 134_800, farol: 'Critico' },
    { id: 'f12', cedente: 'TRES CORACOES ALIMENTOS SA', lastros: 8, vencimento: '01/09/2026', faixaAtual: 'Em dia', proxFaixa: '1 a 30 dias', mudaEm: 7, vp: 98_500, farol: 'Critico' },
  ],
  estressePdd: [
    { data: '27/07', valor: 2_210_000 },
    { data: '28/07', valor: 2_240_000 },
    { data: '29/07', valor: 2_280_000 },
    { data: '30/07', valor: 2_310_000 },
    { data: '31/07', valor: 2_350_000 },
    { data: '01/08', valor: 2_380_000 },
    { data: '04/08', valor: 2_420_000 },
    { data: '05/08', valor: 2_460_000 },
    { data: '06/08', valor: 2_490_000 },
    { data: '07/08', valor: 2_520_000 },
    { data: '08/08', valor: 2_540_000 },
    { data: '11/08', valor: 2_560_000 },
    { data: '12/08', valor: 2_580_000 },
    { data: '13/08', valor: 2_600_000 },
    { data: '14/08', valor: 2_620_000 },
    { data: '15/08', valor: 2_640_000 },
    { data: '18/08', valor: 2_650_000 },
    { data: '19/08', valor: 2_660_000 },
    { data: '20/08', valor: 2_670_000 },
    { data: '21/08', valor: 2_680_000 },
    { data: '22/08', valor: 2_685_000 },
    { data: '25/08', valor: 2_685_566 },
  ],
  estressePeriodo: '27/07/2026 a 25/08/2026',
  waterfall: [
    { id: 'w0', label: 'Base', delta: 2_685_566, kind: 'base' },
    { id: 'w1', label: '26/08', delta: 11_500, kind: 'delta' },
    { id: 'w2', label: '27/08', delta: 18_200, kind: 'delta' },
    { id: 'w3', label: '28/08', delta: 22_400, kind: 'delta' },
    { id: 'w4', label: '29/08', delta: 15_800, kind: 'delta' },
    { id: 'w5', label: '30/08', delta: 5_300_000, kind: 'delta' },
    { id: 'w6', label: '03/09', delta: 225_000, kind: 'delta' },
    { id: 'w7', label: '10/09', delta: 186_000, kind: 'delta' },
    { id: 'w8', label: '17/09', delta: 142_000, kind: 'delta' },
    { id: 'w9', label: '24/09', delta: 98_000, kind: 'delta' },
    { id: 'w10', label: 'Proj.', delta: 8_904_466, kind: 'proj' },
  ],
  waterfallPeriodo: '26/08/2026 a 24/09/2026',
  vencidosJanelas: [
    {
      id: 'vj1',
      periodo: '26/08/2026 a 03/09/2026',
      rows: [
        { id: 'vr1', rolagem: '26/08/2026', sacado: 'OPENEEM BIOSCIENCE IND E C.', vpRisco: 202_700, atraso: 150 },
        { id: 'vr2', rolagem: '27/08/2026', sacado: 'ER FLOW M. E C.', vpRisco: 26_000, atraso: 120 },
        { id: 'vr3', rolagem: '28/08/2026', sacado: 'MARBO AGRICOLA LTDA', vpRisco: 88_400, atraso: 54 },
        { id: 'vr4', rolagem: '30/08/2026', sacado: 'ALMO COFFEE AGRICOLA LTDA', vpRisco: 64_200, atraso: 38 },
        { id: 'vr5', rolagem: '01/09/2026', sacado: 'BR AGRO AGRONEGOCIOS S.A', vpRisco: 41_000, atraso: 32 },
        { id: 'vr6', rolagem: '03/09/2026', sacado: 'SMARTFRIG COMERCIAL DE C.', vpRisco: 33_500, atraso: 24 },
      ],
    },
    {
      id: 'vj2',
      periodo: '04/09/2026 a 14/09/2026',
      rows: [
        { id: 'vr7', rolagem: '04/09/2026', sacado: 'MARINO TIEPO E OU E. P. T.', vpRisco: 282_200, atraso: 15 },
        { id: 'vr8', rolagem: '08/09/2026', sacado: 'ER FLOW M. E C.', vpRisco: 25_800, atraso: 105 },
        { id: 'vr9', rolagem: '10/09/2026', sacado: 'W&L AGRONEGOCIOS LTDA', vpRisco: 112_000, atraso: 16 },
        { id: 'vr10', rolagem: '11/09/2026', sacado: 'SUPREMO CARNES LTDA', vpRisco: 54_600, atraso: 17 },
        { id: 'vr11', rolagem: '12/09/2026', sacado: 'TRES CORACOES ALIMENTOS SA', vpRisco: 48_200, atraso: 13 },
        { id: 'vr12', rolagem: '14/09/2026', sacado: 'FOLIGREEN FERTILIZANTES', vpRisco: 29_400, atraso: 7 },
      ],
    },
    {
      id: 'vj3',
      periodo: '15/09/2026 a 24/09/2026',
      rows: [
        { id: 'vr13', rolagem: '15/09/2026', sacado: 'ALMO COFFEE AGRICOLA LTDA', vpRisco: 89_700, atraso: 5 },
        { id: 'vr14', rolagem: '17/09/2026', sacado: 'ER FLOW M. E C.', vpRisco: 26_500, atraso: 95 },
        { id: 'vr15', rolagem: '18/09/2026', sacado: 'PEDRO RIBEIRO MEROLA', vpRisco: 71_200, atraso: 3 },
        { id: 'vr16', rolagem: '20/09/2026', sacado: 'SUPERAGRO AGRONEGOCIOS', vpRisco: 58_000, atraso: 8 },
        { id: 'vr17', rolagem: '22/09/2026', sacado: 'CULTURA AGRONEGOCIOS', vpRisco: 44_100, atraso: 4 },
        { id: 'vr18', rolagem: '24/09/2026', sacado: 'CONFINA', vpRisco: 31_800, atraso: 2 },
      ],
    },
  ],
  aVencerJanelas: [
    {
      id: 'av1',
      periodo: '26/08/2026 a 03/09/2026',
      rows: [
        { id: 'ar1', rolagem: '26/08/2026', sacado: 'EDUARDO DIETER MINGRONE', vpRisco: 23_000, atraso: 0 },
        { id: 'ar2', rolagem: '27/08/2026', sacado: 'SMARTFRIG COMERCIAL DE C.', vpRisco: 726_800, atraso: 0 },
        { id: 'ar3', rolagem: '28/08/2026', sacado: 'FRANCISCO PAULO NETO', vpRisco: 18_400, atraso: 0 },
        { id: 'ar4', rolagem: '30/08/2026', sacado: 'SUPERAGRO AGRONEGOCIOS', vpRisco: 3_600_000, atraso: 0 },
        { id: 'ar5', rolagem: '01/09/2026', sacado: 'TRES CORACOES ALIMENTOS SA', vpRisco: 61_200, atraso: 0 },
        { id: 'ar6', rolagem: '03/09/2026', sacado: 'SUPREMO CARNES LTDA', vpRisco: 388_300, atraso: 0 },
      ],
    },
    {
      id: 'av2',
      periodo: '04/09/2026 a 14/09/2026',
      rows: [
        { id: 'ar7', rolagem: '04/09/2026', sacado: 'FRANCISCO PAULO NETO', vpRisco: 4_100, atraso: 0 },
        { id: 'ar8', rolagem: '08/09/2026', sacado: 'TRES CORACOES ALIMENTOS SA', vpRisco: 42_600, atraso: 0 },
        { id: 'ar9', rolagem: '10/09/2026', sacado: 'W&L AGRONEGOCIOS LTDA', vpRisco: 846_000, atraso: 0 },
        { id: 'ar10', rolagem: '11/09/2026', sacado: 'TRES CORACOES ALIMENTOS SA', vpRisco: 58_900, atraso: 0 },
        { id: 'ar11', rolagem: '12/09/2026', sacado: 'PEDRO RIBEIRO MEROLA', vpRisco: 1_700_000, atraso: 0 },
        { id: 'ar12', rolagem: '14/09/2026', sacado: 'PEDRO RIBEIRO MEROLA', vpRisco: 1_120_000, atraso: 0 },
      ],
    },
    {
      id: 'av3',
      periodo: '15/09/2026 a 24/09/2026',
      rows: [
        { id: 'ar13', rolagem: '15/09/2026', sacado: 'PEDRO RIBEIRO MEROLA', vpRisco: 2_800_000, atraso: 0 },
        { id: 'ar14', rolagem: '17/09/2026', sacado: 'SUPREMO CARNES LTDA', vpRisco: 388_300, atraso: 0 },
        { id: 'ar15', rolagem: '18/09/2026', sacado: 'ALLAS', vpRisco: 214_000, atraso: 0 },
        { id: 'ar16', rolagem: '20/09/2026', sacado: 'CONFINA', vpRisco: 176_500, atraso: 0 },
        { id: 'ar17', rolagem: '22/09/2026', sacado: 'FORTE AGRO LTDA', vpRisco: 98_700, atraso: 0 },
        { id: 'ar18', rolagem: '24/09/2026', sacado: 'BOIPREMIUM AGRO', vpRisco: 64_200, atraso: 0 },
      ],
    },
  ],
  pddPorSacado: [
    { id: 'ps1', nome: 'ELEVA AGRICOLA REPRESENTACOES', pdd: 1_300_000, vn: 1_700_000, dias: 148 },
    { id: 'ps2', nome: 'OPENEEM BIOSCIENCE IND E C.', pdd: 420_000, vn: 1_020_000, dias: 150 },
    { id: 'ps3', nome: 'ER FLOW MAQUINAS E COMPONENTES', pdd: 186_000, vn: 757_600, dias: 85 },
    { id: 'ps4', nome: 'MARBO AGRICOLA LTDA', pdd: 98_000, vn: 528_800, dias: 54 },
    { id: 'ps5', nome: 'ALMO COFFEE AGRICOLA LTDA', pdd: 72_000, vn: 289_400, dias: 38 },
    { id: 'ps6', nome: 'BR AGRO AGRONEGOCIOS S.A', pdd: 54_000, vn: 198_000, dias: 32 },
    { id: 'ps7', nome: 'SMARTFRIG COMERCIAL DE CARNES', pdd: 41_000, vn: 156_200, dias: 24 },
  ],
  pddPorCedente: [
    { id: 'pc1', nome: 'ELEVA AGRICOLA REPRESENTACOES LTDA', pdd: 1_300_000, vn: 1_700_000, dias: 148 },
    { id: 'pc2', nome: 'OPENEEM BIOSCIENCE INDUSTRIA E COMERCIO', pdd: 420_000, vn: 1_020_000, dias: 150 },
    { id: 'pc3', nome: 'INDUSTRIA QUIMICA KIMBERLIT LTDA', pdd: 310_000, vn: 17_700_000, dias: 56 },
    { id: 'pc4', nome: 'NIVALDO ALVES PEREIRA FILHO', pdd: 198_000, vn: 15_200_000, dias: 27 },
    { id: 'pc5', nome: 'SIAP COMERCIO DE PRODUTOS AGROPECUARIOS', pdd: 86_000, vn: 2_100_000, dias: 26 },
    { id: 'pc6', nome: 'ZITRA AGRONEGOCIOS LTDA', pdd: 28_000, vn: 349_800, dias: 26 },
    { id: 'pc7', nome: 'B&F AGRO COMERCIO DE GRAOS', pdd: 22_000, vn: 3_000_000, dias: 14 },
  ],
  agingList: [
    { id: 'al1', faixa: 'Em dia', vn: 585_000_000, vp: 567_200_000, pctCarteira: 0.934 },
    { id: 'al2', faixa: 'Entre 1 e 30 dias', vn: 16_400_000, vp: 15_800_000, pctCarteira: 0.0259 },
    { id: 'al3', faixa: 'Entre 31 e 60 dias', vn: 8_200_000, vp: 7_900_000, pctCarteira: 0.013 },
    { id: 'al4', faixa: 'Entre 61 e 90 dias', vn: 4_100_000, vp: 3_900_000, pctCarteira: 0.0064 },
    { id: 'al5', faixa: 'Entre 91 e 120 dias', vn: 3_200_000, vp: 3_000_000, pctCarteira: 0.0049 },
    { id: 'al6', faixa: 'Entre 121 e 150 dias', vn: 3_800_000, vp: 3_600_000, pctCarteira: 0.0059 },
    { id: 'al7', faixa: 'Entre 151 e 180 dias', vn: 2_100_000, vp: 1_900_000, pctCarteira: 0.0031 },
    { id: 'al8', faixa: 'Acima de 180 dias', vn: 2_259_954, vp: 2_100_000, pctCarteira: 0.0034 },
  ],
  aberturaPdd: [
    { id: 'ap1', cedente: 'ELEVA AGRICOLA REPRESENTACOES', valorAberto: 1_700_000, pdd: 1_300_000, status: 'Entre 121 e 150 dias' },
    { id: 'ap2', cedente: 'OPENEEM BIOSCIENCE INDUSTRIA', valorAberto: 1_020_000, pdd: 420_000, status: 'Entre 121 e 150 dias' },
    { id: 'ap3', cedente: 'INDUSTRIA QUIMICA KIMBERLIT', valorAberto: 17_700_000, pdd: 310_000, status: 'Entre 31 e 60 dias' },
    { id: 'ap4', cedente: 'NIVALDO ALVES PEREIRA FILHO', valorAberto: 15_200_000, pdd: 198_000, status: 'Entre 1 e 30 dias' },
    { id: 'ap5', cedente: 'ER FLOW MAQUINAS E COMPONENTES', valorAberto: 757_600, pdd: 186_000, status: 'Entre 61 e 90 dias' },
    { id: 'ap6', cedente: 'MARBO AGRICOLA LTDA', valorAberto: 528_800, pdd: 98_000, status: 'Entre 31 e 60 dias' },
    { id: 'ap7', cedente: 'SIAP COMERCIO DE PRODUTOS', valorAberto: 2_100_000, pdd: 86_000, status: 'Entre 1 e 30 dias' },
    { id: 'ap8', cedente: 'ALMO COFFEE AGRICOLA LTDA', valorAberto: 289_400, pdd: 72_000, status: 'Entre 31 e 60 dias' },
    { id: 'ap9', cedente: 'BR AGRO AGRONEGOCIOS S.A', valorAberto: 198_000, pdd: 54_000, status: 'Entre 1 e 30 dias' },
    { id: 'ap10', cedente: 'ZITRA AGRONEGOCIOS LTDA', valorAberto: 349_800, pdd: 28_000, status: 'Entre 1 e 30 dias' },
  ],
  aquisicoesDia: 3_015_006.98,
  aquisicoesCedentes: 4,
  liquidacoesDia: 2_792_878.69,
  liquidacoesCedentes: 19,
  maiorAquisicaoNome: 'AGROPECUARIA DAS AMERICAS S/A',
  maiorAquisicaoValor: 1_900_000,
  maiorLiquidacaoNome: 'FRIGORIFICO FRILEM LTDA',
  maiorLiquidacaoValor: 1_500_000,
  aberturaAquisicoes: [
    { id: 'aq1', cedente: 'AGROPECUARIA DAS AMERICAS S/A', valorNominal: 2_300_000, valor: 1_900_000, pctPl: 0.0022 },
    { id: 'aq2', cedente: 'CULTURA AGRONEGOCIOS', valorNominal: 777_007.89, valor: 668_090.78, pctPl: 0.0008 },
    { id: 'aq3', cedente: 'INTERGRAOS COMERCIAL', valorNominal: 402_192, valor: 389_306.67, pctPl: 0.0004 },
    { id: 'aq4', cedente: 'FOLIGREEN FERTILIZANTES', valorNominal: 100_000, valor: 85_917.2, pctPl: 0.0001 },
  ],
  aberturaLiquidacoes: [
    { id: 'lq1', cedente: 'FRIGORIFICO FRILEM LTDA', valorNominal: 1_500_000, valor: 1_500_000, pctPl: 0.0015 },
    { id: 'lq2', cedente: 'AGRO DIRECTA P. A.', valorNominal: 292_930, valor: 292_930.02, pctPl: 0.0003 },
    { id: 'lq3', cedente: 'ZITRA AGRONEGOCIOS', valorNominal: 188_806.15, valor: 188_806.15, pctPl: 0.0002 },
    { id: 'lq4', cedente: 'CORDEIRO COMERCIO E', valorNominal: 148_803, valor: 148_803, pctPl: 0.0001 },
    { id: 'lq5', cedente: 'CULTURA AGRONEGOCIOS', valorNominal: 103_400, valor: 103_400, pctPl: 0.0001 },
    { id: 'lq6', cedente: 'FORTE AGRO LTDA', valorNominal: 86_200, valor: 86_200, pctPl: 0.0001 },
    { id: 'lq7', cedente: 'BOIPREMIUM AGRO', valorNominal: 64_800, valor: 64_800, pctPl: 0.0001 },
    { id: 'lq8', cedente: 'SIAP COMERCIO', valorNominal: 48_100, valor: 48_100, pctPl: 0 },
    { id: 'lq9', cedente: 'ALMO COFFEE AGRICOLA', valorNominal: 36_400, valor: 36_400, pctPl: 0 },
    { id: 'lq10', cedente: 'MARBO AGRICOLA LTDA', valorNominal: 28_900, valor: 28_900, pctPl: 0 },
    { id: 'lq11', cedente: 'SMARTFRIG COMERCIAL', valorNominal: 22_100, valor: 22_100, pctPl: 0 },
    { id: 'lq12', cedente: 'SUPREMO CARNES LTDA', valorNominal: 16_400, valor: 16_400, pctPl: 0 },
  ],
  baseEnquadramento: { label: 'Patrimônio líquido', valor: 1_012_301_744 },
  tipoAtivo: [
    { id: 'ta1', label: 'CPR Financeira', permitido: 1, posicaoAtual: 0.412, vp: 251_200_000, status: 'OK' },
    { id: 'ta2', label: 'Notas Promissórias', permitido: 0.4, posicaoAtual: 0.186, vp: 113_400_000, status: 'OK' },
    { id: 'ta3', label: 'Outros Direitos Creditórios', permitido: 0.3, posicaoAtual: 0.221, vp: 134_800_000, status: 'OK' },
    { id: 'ta4', label: 'Cessão de crédito', permitido: null, posicaoAtual: 0.181, vp: 110_545_210, status: 'OK' },
  ],
  limitesCedente: [
    { id: 'lc1', label: 'Maior cedente', permitido: 0.2, posicaoAtual: 0.0581, status: 'OK' },
    { id: 'lc2', label: '5 maiores cedentes', permitido: 0.5, posicaoAtual: 0.2385, status: 'OK' },
    { id: 'lc3', label: '10 maiores cedentes', permitido: 0.7, posicaoAtual: 0.36, status: 'OK' },
    { id: 'lc4', label: 'Cedente relacionado', permitido: 0.1, posicaoAtual: 0.018, status: 'OK' },
  ],
  limitesSacado: [
    { id: 'ls1', label: 'Maior sacado', permitido: 0.15, posicaoAtual: 0.0581, status: 'OK' },
    { id: 'ls2', label: '5 maiores sacados', permitido: 0.4, posicaoAtual: 0.218, status: 'OK' },
    { id: 'ls3', label: '10 maiores sacados', permitido: 0.6, posicaoAtual: 0.3346, status: 'OK' },
    { id: 'ls4', label: 'Sacado relacionado', permitido: 0.08, posicaoAtual: 0.0211, status: 'OK' },
  ],
};

function scaleMoney<T extends object>(row: T, keys: (keyof T)[], factor: number): T {
  const next = { ...row };
  for (const key of keys) {
    const value = next[key];
    if (typeof value === 'number') (next[key] as number) = value * factor;
  }
  return next;
}

export function buildCarteira(veiculo: Veiculo): CarteiraBundle {
  if (veiculo.id === 'cra-42') return CRA42_CARTEIRA;

  const factor = veiculo.carteiraVp / CRA42_CARTEIRA.valorPresente;
  const src = CRA42_CARTEIRA;
  return {
    ...src,
    valorNominal: veiculo.carteiraVp * 1.025,
    valorPresente: veiculo.carteiraVp,
    cedentes: Math.max(8, Math.round(src.cedentes * factor)),
    sacados: Math.max(20, Math.round(src.sacados * factor)),
    pddTotal: veiculo.pdd,
    vpVencido: veiculo.carteiraVp * 0.0657,
    preFixado: veiculo.carteiraVp * 0.47,
    posFixado: veiculo.carteiraVp * 0.53,
    aquisicoesDia: src.aquisicoesDia * factor,
    liquidacoesDia: src.liquidacoesDia * factor,
    maiorAquisicaoValor: src.maiorAquisicaoValor * factor,
    maiorLiquidacaoValor: src.maiorLiquidacaoValor * factor,
    topCedentes: src.topCedentes.slice(0, 5).map((r) => scaleMoney(r, ['vpLiquido'], factor)),
    topSacados: src.topSacados.slice(0, 5).map((r) => scaleMoney(r, ['vpLiquido'], factor)),
    agingVencimentos: src.agingVencimentos.map((r) => scaleMoney(r, ['valor'], factor)),
    vencimentos30d: src.vencimentos30d.map((r) => scaleMoney(r, ['vp'], factor)),
    cedentesVencidos: src.cedentesVencidos.map((r) => scaleMoney(r, ['vp'], factor)),
    pmtsVencidas: src.pmtsVencidas.slice(0, 5).map((r) => scaleMoney(r, ['valorPmt'], factor)),
    mudancasFaixa: src.mudancasFaixa.slice(0, 6).map((r) => scaleMoney(r, ['vp'], factor)),
    estressePdd: src.estressePdd.map((r) => ({ ...r, valor: r.valor * factor })),
    waterfall: src.waterfall.map((r) => ({ ...r, delta: r.delta * factor })),
    vencidosJanelas: src.vencidosJanelas.map((j) => ({
      ...j,
      rows: j.rows.slice(0, 3).map((r) => scaleMoney(r, ['vpRisco'], factor)),
    })),
    aVencerJanelas: src.aVencerJanelas.map((j) => ({
      ...j,
      rows: j.rows.slice(0, 3).map((r) => scaleMoney(r, ['vpRisco'], factor)),
    })),
    pddPorSacado: src.pddPorSacado.slice(0, 4).map((r) => scaleMoney(r, ['pdd', 'vn'], factor)),
    pddPorCedente: src.pddPorCedente.slice(0, 4).map((r) => scaleMoney(r, ['pdd', 'vn'], factor)),
    agingList: src.agingList.map((r) => scaleMoney(r, ['vn', 'vp'], factor)),
    aberturaPdd: src.aberturaPdd.slice(0, 5).map((r) => scaleMoney(r, ['valorAberto', 'pdd'], factor)),
    aberturaAquisicoes: src.aberturaAquisicoes.map((r) => scaleMoney(r, ['valorNominal', 'valor'], factor)),
    aberturaLiquidacoes: src.aberturaLiquidacoes.slice(0, 6).map((r) => scaleMoney(r, ['valorNominal', 'valor'], factor)),
    baseEnquadramento: { label: src.baseEnquadramento.label, valor: veiculo.ativoTotal },
    tipoAtivo: src.tipoAtivo.map((r) => scaleMoney(r, ['vp'], factor)),
    limitesCedente: src.limitesCedente,
    limitesSacado: src.limitesSacado,
  };
}

export function carteiraPctOfVp(value: number, vp: number): string {
  if (!vp) return '—';
  return `${((value / vp) * 100).toFixed(2).replace('.', ',')}% da carteira VP`;
}

export function moneyHint(n: number): string {
  return brl(n, true);
}
