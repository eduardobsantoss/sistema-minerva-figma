import type { Veiculo } from './passivoNovoData';
import { brl, pct, pu } from './passivoNovoData';

export interface PosicaoCotaRow {
  id: string;
  serie: string;
  quantidade: number;
  taxa: string;
  pu: number;
  valorTotal: number;
}

export interface ResumoComplementar {
  valorNominal: number;
  cedentes: number;
  sacados: number;
  lastrosAtivos: number;
  proximoPagamentoSenior: string;
  farolPagamento: string;
  carregoCraPct: number;
  carregoCraAa: string;
  prazoMedioDias: number;
  taxaMediaPct: number;
}

export interface CotaPrecificacaoRow {
  id: string;
  serie: string;
  quantidade: number;
  taxa: string;
  pu: number;
  valorTotal: number;
  resultadoDia: number;
  resultadoMes: number;
  resultado30Dias: number;
}

export interface RentabilidadeDiariaRow {
  id: string;
  data: string;
  seriesPct: Record<string, number>;
  subAcumMes: number;
  puSr: number;
  plSenior: number;
  puSub: number;
  plSub: number;
}

export interface HistoricoMensalSubRow {
  id: string;
  mes: string;
  resultadoMensal: number;
  cdiPeriodo: number;
  pctCdi: number;
  puFechamento: number;
}

export interface PuEvolucaoPoint {
  data: string;
  dataIso: string;
  series: Record<string, number>;
}

export interface LaminaBundle {
  posicaoCotas: PosicaoCotaRow[];
  resumoComplementar: ResumoComplementar;
  cotasPrecificacao: CotaPrecificacaoRow[];
  rentabilidadeDiaria: RentabilidadeDiariaRow[];
  historicoMensalSub: HistoricoMensalSubRow[];
  evolucaoPu: PuEvolucaoPoint[];
  evolucaoSeriesLabels: string[];
}

const CRA42_LAMINA: LaminaBundle = {
  posicaoCotas: [
    { id: 'sr1', serie: 'Sênior 1ª', quantidade: 360_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 366_039_655.2 },
    { id: 'sr2', serie: 'Sênior 2ª', quantidade: 140_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 142_348_754.8 },
    { id: 'sr3', serie: 'Sênior 3ª', quantidade: 100_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 101_677_682 },
    { id: 'sub', serie: 'Subordinada', quantidade: 400_000, taxa: '—', pu: 1005.589131, valorTotal: 402_235_652.41 },
  ],
  resumoComplementar: {
    valorNominal: 625_059_954.12,
    cedentes: 136,
    sacados: 1185,
    lastrosAtivos: 18_123,
    proximoPagamentoSenior: '—',
    farolPagamento: 'Sem evento projetado',
    carregoCraPct: 0.0152,
    carregoCraAa: '19,86% a.a. | DI 21/08/2026',
    prazoMedioDias: 548,
    taxaMediaPct: 0.0188,
  },
  cotasPrecificacao: [
    { id: 'sr1', serie: 'Sênior 1ª', quantidade: 360_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 366_039_655.2, resultadoDia: 0.0006, resultadoMes: 0.0098, resultado30Dias: 0.0174 },
    { id: 'sr2', serie: 'Sênior 2ª', quantidade: 140_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 142_348_754.8, resultadoDia: 0.0006, resultadoMes: 0.0098, resultado30Dias: 0.0174 },
    { id: 'sr3', serie: 'Sênior 3ª', quantidade: 100_000, taxa: '110,00% DI', pu: 1016.77682, valorTotal: 101_677_682, resultadoDia: 0.0006, resultadoMes: 0.0098, resultado30Dias: 0.0174 },
    { id: 'sub', serie: 'Subordinada', quantidade: 400_000, taxa: '—', pu: 1005.589131, valorTotal: 402_235_652.41, resultadoDia: 0.0002, resultadoMes: 0.0046, resultado30Dias: 0.0367 },
  ],
  rentabilidadeDiaria: [
    { id: 'd0', data: '25/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0046, puSr: 1016.77682, plSenior: 610_066_092, puSub: 1005.589131, plSub: 402_235_652 },
    { id: 'd1', data: '24/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0005 }, subAcumMes: 0.0044, puSr: 1016.19935, plSenior: 609_700_000, puSub: 1005.375897, plSub: 402_150_000 },
    { id: 'd2', data: '21/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0006 }, subAcumMes: 0.0039, puSr: 1015.62221, plSenior: 609_400_000, puSub: 1004.875109, plSub: 402_000_000 },
    { id: 'd3', data: '20/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0033, puSr: 1015.0454, plSenior: 609_000_000, puSub: 1004.322386, plSub: 401_700_000 },
    { id: 'd4', data: '19/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0003 }, subAcumMes: 0.0031, puSr: 1014.46892, plSenior: 608_700_000, puSub: 1004.116602, plSub: 401_600_000 },
    { id: 'd5', data: '18/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0003 }, subAcumMes: 0.0028, puSr: 1013.892763, plSenior: 608_300_000, puSub: 1003.841147, plSub: 401_500_000 },
    { id: 'd6', data: '17/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0005 }, subAcumMes: 0.0026, puSr: 1013.316936, plSenior: 608_000_000, puSub: 1003.578275, plSub: 401_400_000 },
    { id: 'd7', data: '14/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0004 }, subAcumMes: 0.0021, puSr: 1012.741435, plSenior: 607_600_000, puSub: 1003.071608, plSub: 401_200_000 },
    { id: 'd8', data: '13/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0016, puSr: 1012.166262, plSenior: 607_300_000, puSub: 1002.632797, plSub: 401_100_000 },
    { id: 'd9', data: '12/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0014, puSr: 1011.591415, plSenior: 607_000_000, puSub: 1002.396111, plSub: 401_000_000 },
    { id: 'd10', data: '11/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0012, puSr: 1011.016894, plSenior: 606_600_000, puSub: 1002.234752, plSub: 400_900_000 },
    { id: 'd11', data: '10/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0005 }, subAcumMes: 0.001, puSr: 1010.4427, plSenior: 606_300_000, puSub: 1001.989631, plSub: 400_800_000 },
    { id: 'd12', data: '07/08/2026', seriesPct: { 'Sênior 1ª': 0.0006, 'Sênior 2ª': 0.0006, 'Sênior 3ª': 0.0006, Subordinada: 0.0002 }, subAcumMes: 0.0005, puSr: 1009.868832, plSenior: 605_900_000, puSub: 1001.481064, plSub: 400_600_000 },
  ],
  historicoMensalSub: [
    { id: 'm0', mes: '08/26', resultadoMensal: 0.0046, cdiPeriodo: 0.0089, pctCdi: 0.5164, puFechamento: 1005.589131 },
    { id: 'm1', mes: '07/26', resultadoMensal: 0.0411, cdiPeriodo: 0.0122, pctCdi: 3.3821, puFechamento: 1001.005709 },
    { id: 'm2', mes: '06/26', resultadoMensal: 0.0147, cdiPeriodo: 0.0112, pctCdi: 1.311, puFechamento: 1085.912893 },
    { id: 'm3', mes: '05/26', resultadoMensal: 0.0151, cdiPeriodo: 0.0107, pctCdi: 1.4071, puFechamento: 1070.181155 },
    { id: 'm4', mes: '04/26', resultadoMensal: 0.0124, cdiPeriodo: 0.0109, pctCdi: 1.1388, puFechamento: 1054.244157 },
    { id: 'm5', mes: '03/26', resultadoMensal: 0.017, cdiPeriodo: 0.0121, pctCdi: 1.3973, puFechamento: 1041.307304 },
    { id: 'm6', mes: '02/26', resultadoMensal: 0.0138, cdiPeriodo: 0.01, pctCdi: 1.3822, puFechamento: 1023.941103 },
    { id: 'm7', mes: '01/26', resultadoMensal: 0.019, cdiPeriodo: 0.0116, pctCdi: 1.6353, puFechamento: 1010.022207 },
    { id: 'm8', mes: '12/25', resultadoMensal: 0.0151, cdiPeriodo: 0.0122, pctCdi: 1.2351, puFechamento: 1129.387691 },
    { id: 'm9', mes: '11/25', resultadoMensal: 0.0376, cdiPeriodo: 0.0105, pctCdi: 3.573, puFechamento: 1112.623595 },
    { id: 'm10', mes: '10/25', resultadoMensal: 0.0074, cdiPeriodo: 0.0128, pctCdi: 0.5801, puFechamento: 1072.291023 },
    { id: 'm11', mes: '09/25', resultadoMensal: 0.0133, cdiPeriodo: 0.0122, pctCdi: 1.0932, puFechamento: 1064.413672 },
  ],
  evolucaoSeriesLabels: ['Sênior 1ª', 'Sênior 2ª', 'Sênior 3ª', 'Subordinada'],
  evolucaoPu: [
    { data: '30/05/2025', dataIso: '2025-05-30', series: { 'Sênior 1ª': 994.7, 'Sênior 2ª': 993.2, 'Sênior 3ª': 991.8, Subordinada: 988.5 } },
    { data: '31/07/2025', dataIso: '2025-07-31', series: { 'Sênior 1ª': 1012.3, 'Sênior 2ª': 1010.1, 'Sênior 3ª': 1008.0, Subordinada: 1018.6 } },
    { data: '30/09/2025', dataIso: '2025-09-30', series: { 'Sênior 1ª': 1035.8, 'Sênior 2ª': 1032.4, 'Sênior 3ª': 1029.0, Subordinada: 1048.2 } },
    { data: '31/10/2025', dataIso: '2025-10-31', series: { 'Sênior 1ª': 1048.5, 'Sênior 2ª': 1044.9, 'Sênior 3ª': 1041.2, Subordinada: 1072.3 } },
    { data: '30/11/2025', dataIso: '2025-11-30', series: { 'Sênior 1ª': 1055.2, 'Sênior 2ª': 1051.0, 'Sênior 3ª': 1046.8, Subordinada: 1112.6 } },
    { data: '31/12/2025', dataIso: '2025-12-31', series: { 'Sênior 1ª': 1062.04, 'Sênior 2ª': 1057.5, 'Sênior 3ª': 1053.0, Subordinada: 1129.39 } },
    { data: '31/01/2026', dataIso: '2026-01-31', series: { 'Sênior 1ª': 1054.8, 'Sênior 2ª': 1050.2, 'Sênior 3ª': 1045.6, Subordinada: 1010.02 } },
    { data: '28/02/2026', dataIso: '2026-02-28', series: { 'Sênior 1ª': 1042.1, 'Sênior 2ª': 1037.8, 'Sênior 3ª': 1033.5, Subordinada: 1023.94 } },
    { data: '31/03/2026', dataIso: '2026-03-31', series: { 'Sênior 1ª': 1030.5, 'Sênior 2ª': 1026.4, 'Sênior 3ª': 1022.3, Subordinada: 1041.31 } },
    { data: '30/04/2026', dataIso: '2026-04-30', series: { 'Sênior 1ª': 1024.2, 'Sênior 2ª': 1020.1, 'Sênior 3ª': 1016.0, Subordinada: 1054.24 } },
    { data: '31/05/2026', dataIso: '2026-05-31', series: { 'Sênior 1ª': 1020.8, 'Sênior 2ª': 1018.5, 'Sênior 3ª': 1015.2, Subordinada: 1070.18 } },
    { data: '30/06/2026', dataIso: '2026-06-30', series: { 'Sênior 1ª': 1018.9, 'Sênior 2ª': 1017.2, 'Sênior 3ª': 1014.5, Subordinada: 1085.91 } },
    { data: '31/07/2026', dataIso: '2026-07-31', series: { 'Sênior 1ª': 1017.5, 'Sênior 2ª': 1016.1, 'Sênior 3ª': 1013.8, Subordinada: 1001.01 } },
    { data: '25/08/2026', dataIso: '2026-08-25', series: { 'Sênior 1ª': 1016.77682, 'Sênior 2ª': 1015.12, 'Sênior 3ª': 1013.45, Subordinada: 1005.589131 } },
  ],
};

function buildCompactLamina(veiculo: Veiculo): LaminaBundle {
  const posicaoCotas = veiculo.series.map((s) => ({
    id: s.id,
    serie: s.nome,
    quantidade: s.quantidade,
    taxa: s.remuneracao,
    pu: s.pu,
    valorTotal: s.valor,
  }));

  const cotasPrecificacao = veiculo.series.map((s) => ({
    id: s.id,
    serie: s.nome,
    quantidade: s.quantidade,
    taxa: s.remuneracao,
    pu: s.pu,
    valorTotal: s.valor,
    resultadoDia: s.resultadoDia,
    resultadoMes: s.resultadoMes,
    resultado30Dias: s.resultadoMes * 1.8,
  }));

  const sub = veiculo.series.find((s) => s.classe === 'SUB');
  const labels = veiculo.series.map((s) => s.nome);

  const rentabilidadeDiaria: RentabilidadeDiariaRow[] = veiculo.series[0]?.historicoPu.slice(0, 8).map((h, i) => {
    const seriesPct: Record<string, number> = {};
    for (const s of veiculo.series) {
      seriesPct[s.nome] = s.resultadoDia * (1 + i * 0.02);
    }
    return {
      id: `rd-${i}`,
      data: h.data,
      seriesPct,
      subAcumMes: (sub?.resultadoMes ?? 0) * (1 - i * 0.05),
      puSr: veiculo.puSenior - i * 0.5,
      plSenior: veiculo.funding,
      puSub: veiculo.puSubResidual - i * 0.3,
      plSub: veiculo.subordinada,
    };
  }) ?? [];

  const historicoMensalSub: HistoricoMensalSubRow[] = Array.from({ length: 6 }, (_, i) => ({
    id: `hm-${i}`,
    mes: `${String(8 - i).padStart(2, '0')}/26`,
    resultadoMensal: (sub?.resultadoMes ?? 0.01) * (1 + i * 0.1),
    cdiPeriodo: 0.01 + i * 0.001,
    pctCdi: 1.1 + i * 0.05,
    puFechamento: (sub?.pu ?? 100) + i * 2,
  }));

  const evolucaoPu: PuEvolucaoPoint[] = [
    { data: '01/03/2026', dataIso: '2026-03-01', series: Object.fromEntries(veiculo.series.map((s, i) => [s.nome, s.pu - (veiculo.series.length - i) * 1.2])) },
    { data: '01/05/2026', dataIso: '2026-05-01', series: Object.fromEntries(veiculo.series.map((s, i) => [s.nome, s.pu - (veiculo.series.length - i) * 0.8 + i * 0.4])) },
    { data: '01/07/2026', dataIso: '2026-07-01', series: Object.fromEntries(veiculo.series.map((s, i) => [s.nome, s.pu - (veiculo.series.length - i) * 0.3 + (i % 2 === 0 ? 0.6 : -0.4)])) },
    { data: veiculo.dataBase, dataIso: veiculo.dataBaseIso, series: Object.fromEntries(veiculo.series.map((s) => [s.nome, s.pu])) },
  ];

  return {
    posicaoCotas,
    resumoComplementar: {
      valorNominal: veiculo.carteiraVp,
      cedentes: Math.round(veiculo.carteiraVp / 4_500_000),
      sacados: Math.round(veiculo.carteiraVp / 520_000),
      lastrosAtivos: Math.round(veiculo.carteiraVp / 34_000),
      proximoPagamentoSenior: brl(veiculo.proximoPagamento, true),
      farolPagamento: 'Sem evento projetado',
      carregoCraPct: 0.012,
      carregoCraAa: '—',
      prazoMedioDias: 420,
      taxaMediaPct: 0.015,
    },
    cotasPrecificacao,
    rentabilidadeDiaria,
    historicoMensalSub,
    evolucaoPu,
    evolucaoSeriesLabels: labels,
  };
}

export function getLamina(veiculo: Veiculo): LaminaBundle {
  if (veiculo.id === 'cra-42') return CRA42_LAMINA;
  return buildCompactLamina(veiculo);
}

export function formatRentPct(n: number, decimals = 2): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${pct(n, decimals)}`;
}

export function formatPuShort(n: number): string {
  return pu(n, n >= 100 ? 4 : 6);
}
