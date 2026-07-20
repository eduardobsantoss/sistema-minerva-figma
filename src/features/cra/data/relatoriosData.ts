/** Relatórios de portfólio CRA (GER001–GER005) — espelho do legado ReportTypes.craReports */

export type PortfolioReportKey = 'ger001' | 'ger002' | 'ger003' | 'ger004' | 'ger005';

export interface PortfolioReportDef {
  key: PortfolioReportKey;
  value: number;
  title: string;
  description: string;
  fileName: string;
}

export const PORTFOLIO_REPORTS: PortfolioReportDef[] = [
  {
    key: 'ger001',
    value: 1,
    title: 'GER001 — Carteira',
    description: 'Posição consolidada da carteira por CRA selecionado: valores, títulos e enquadramento.',
    fileName: 'cra-ger001-carteira.csv',
  },
  {
    key: 'ger002',
    value: 2,
    title: 'GER002 — Cobrança',
    description: 'Indicadores de cobrança e liquidações agregados nos CRA\'s filtrados.',
    fileName: 'cra-ger002-cobranca.csv',
  },
  {
    key: 'ger003',
    value: 3,
    title: 'GER003 — Notificações',
    description: 'Histórico e status de notificações disparadas no portfólio de CRA\'s.',
    fileName: 'cra-ger003-notificacoes.csv',
  },
  {
    key: 'ger004',
    value: 4,
    title: 'GER004 — Títulos',
    description: 'Relação de títulos abertos/liquidados nos CRA\'s selecionados.',
    fileName: 'cra-ger004-titulos.csv',
  },
  {
    key: 'ger005',
    value: 15,
    title: 'GER005 — Sacados',
    description: 'Base de sacados vinculados aos CRA\'s do filtro, com limites e exposição.',
    fileName: 'cra-ger005-sacados.csv',
  },
];

export const SITUACAO_FUNDO_OPTS = ['EM ANDAMENTO', 'ENCERRADO'] as const;

export interface PortfolioResultRow {
  id: string;
  fundo: string;
  cnpj: string;
  cessionaria: string;
  status: string;
  metrica: string;
  valor: string;
}

export function mockCraPortfolioRows(
  reportKey: PortfolioReportKey,
  funds: { id: string; nome: string; cnpj: string; cessionaria: string; status: string }[],
): PortfolioResultRow[] {
  const suffix: Record<PortfolioReportKey, { metrica: string; valor: (i: number) => string }> = {
    ger001: { metrica: 'Carteira', valor: (i) => `R$ ${(4.2 + i * 1.3).toFixed(1)}M` },
    ger002: { metrica: 'Em cobrança', valor: (i) => `R$ ${(0.8 + i * 0.4).toFixed(1)}M` },
    ger003: { metrica: 'Notificações', valor: (i) => String(12 + i * 5) },
    ger004: { metrica: 'Títulos', valor: (i) => String(34 + i * 11) },
    ger005: { metrica: 'Sacados', valor: (i) => String(18 + i * 7) },
  };
  const s = suffix[reportKey];
  return funds.map((f, i) => ({
    id: f.id,
    fundo: f.nome,
    cnpj: f.cnpj,
    cessionaria: f.cessionaria,
    status: f.status,
    metrica: s.metrica,
    valor: s.valor(i),
  }));
}

export function toPortfolioCsv(rows: PortfolioResultRow[]): string {
  const header = ['Fundo', 'CNPJ', 'Cessionária', 'Status', 'Métrica', 'Valor'];
  const lines = rows.map((r) =>
    [r.fundo, r.cnpj, r.cessionaria, r.status, r.metrica, r.valor]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(';'),
  );
  return [header.join(';'), ...lines].join('\n');
}
