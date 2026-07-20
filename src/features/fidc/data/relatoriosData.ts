/** Relatórios de portfólio FIDC (GER001–GER005) — espelho do legado ReportTypes.fidcReports */

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
    description: 'Posição consolidada da carteira por FIDC selecionado: PL, títulos e enquadramento.',
    fileName: 'fidc-ger001-carteira.csv',
  },
  {
    key: 'ger002',
    value: 2,
    title: 'GER002 — Cobrança',
    description: 'Indicadores de cobrança e liquidações agregados nos FIDC\'s filtrados.',
    fileName: 'fidc-ger002-cobranca.csv',
  },
  {
    key: 'ger003',
    value: 3,
    title: 'GER003 — Notificações',
    description: 'Histórico e status de notificações disparadas no portfólio de FIDC\'s.',
    fileName: 'fidc-ger003-notificacoes.csv',
  },
  {
    key: 'ger004',
    value: 4,
    title: 'GER004 — Títulos',
    description: 'Relação de títulos abertos/liquidados nos FIDC\'s selecionados.',
    fileName: 'fidc-ger004-titulos.csv',
  },
  {
    key: 'ger005',
    value: 15,
    title: 'GER005 — Sacados',
    description: 'Base de sacados vinculados aos FIDC\'s do filtro, com limites e exposição.',
    fileName: 'fidc-ger005-sacados.csv',
  },
];

export const SITUACAO_FUNDO_OPTS = ['EM ANDAMENTO'] as const;

export interface PortfolioResultRow {
  id: string;
  fundo: string;
  cnpj: string;
  categoria: string;
  status: string;
  metrica: string;
  valor: string;
}

export function mockFidcPortfolioRows(
  reportKey: PortfolioReportKey,
  funds: { id: string; name: string; cnpj: string; category: string; status: string }[],
): PortfolioResultRow[] {
  const suffix: Record<PortfolioReportKey, { metrica: string; valor: (i: number) => string }> = {
    ger001: { metrica: 'Carteira', valor: (i) => `R$ ${(12.4 + i * 3.1).toFixed(1)}M` },
    ger002: { metrica: 'Em cobrança', valor: (i) => `R$ ${(1.1 + i * 0.6).toFixed(1)}M` },
    ger003: { metrica: 'Notificações', valor: (i) => String(20 + i * 8) },
    ger004: { metrica: 'Títulos', valor: (i) => String(48 + i * 15) },
    ger005: { metrica: 'Sacados', valor: (i) => String(22 + i * 9) },
  };
  const s = suffix[reportKey];
  return funds.map((f, i) => ({
    id: f.id,
    fundo: f.name,
    cnpj: f.cnpj,
    categoria: f.category,
    status: f.status,
    metrica: s.metrica,
    valor: s.valor(i),
  }));
}

export function toPortfolioCsv(rows: PortfolioResultRow[]): string {
  const header = ['Fundo', 'CNPJ', 'Categoria', 'Status', 'Métrica', 'Valor'];
  const lines = rows.map((r) =>
    [r.fundo, r.cnpj, r.categoria, r.status, r.metrica, r.valor]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(';'),
  );
  return [header.join(';'), ...lines].join('\n');
}
