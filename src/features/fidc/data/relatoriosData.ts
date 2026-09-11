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

export const STATUS_PAGAMENTO_PREVIEW = ['Confirmado', 'Pendente', 'Vencido'] as const;
export const STATUS_NOTIFICACAO_PREVIEW = ['Notificado', 'Pendente', 'Não notificado'] as const;

export interface PortfolioFundRef {
  id: string;
  nome: string;
}

export interface PortfolioTituloRow {
  id: string;
  fundo: string;
  fundoId: string;
  sacado: string;
  nfe: string;
  parcela: string;
  vencimento: string;
  valor: string;
  valorNum: number;
  statusPagamento: (typeof STATUS_PAGAMENTO_PREVIEW)[number];
  statusNotificacao: (typeof STATUS_NOTIFICACAO_PREVIEW)[number];
}

export interface PortfolioSacadoRow {
  id: string;
  fundo: string;
  fundoId: string;
  sacado: string;
  documento: string;
  limite: string;
}

const SACADOS = [
  'Exportações Agro LTDA',
  'Coop. Agroindustrial Sul',
  'Cerealista Norte LTDA',
  'Distribuidora Campo Verde',
  'Tradings do Brasil S/A',
];

function pad(n: number) {
  return String(n).padStart(3, '0');
}

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function csvCell(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

export function mockPortfolioTitulos(funds: PortfolioFundRef[]): PortfolioTituloRow[] {
  return funds.flatMap((f, fi) =>
    Array.from({ length: 4 }, (_, i) => {
      const statusPagamento = STATUS_PAGAMENTO_PREVIEW[(fi + i) % STATUS_PAGAMENTO_PREVIEW.length];
      const statusNotificacao = STATUS_NOTIFICACAO_PREVIEW[(fi + i * 2) % STATUS_NOTIFICACAO_PREVIEW.length];
      const month = String(((fi + i) % 12) + 1).padStart(2, '0');
      const valorNum = 120_000 + fi * 55_000 + i * 31_000;
      return {
        id: `${f.id}-t${i + 1}`,
        fundo: f.nome,
        fundoId: f.id,
        sacado: SACADOS[(fi + i) % SACADOS.length],
        nfe: `${f.id.replace(/\W/g, '').slice(0, 6).toUpperCase()}-${pad(i + 1)}`,
        parcela: `${(i % 3) + 1}/3`,
        vencimento: `2026-${month}-15`,
        valor: brl(valorNum),
        valorNum,
        statusPagamento,
        statusNotificacao,
      };
    }),
  );
}

export function mockPortfolioSacados(funds: PortfolioFundRef[]): PortfolioSacadoRow[] {
  return funds.flatMap((f, fi) =>
    SACADOS.slice(0, 3).map((sacado, i) => ({
      id: `${f.id}-s${i + 1}`,
      fundo: f.nome,
      fundoId: f.id,
      sacado,
      documento: `${String(20 + fi).padStart(2, '0')}.${String(110 + i * 11).padStart(3, '0')}.${String(210 + fi).padStart(3, '0')}/0001-${String(20 + i).padStart(2, '0')}`,
      limite: brl(2_400_000 + fi * 420_000 + i * 210_000),
    })),
  );
}

export function toTitulosCsv(rows: PortfolioTituloRow[], includeNotificacao = false): string {
  const header = ['Fundo', 'Sacado', 'Nº NF', 'Parcela', 'Vencimento', 'Valor', 'Status pagamento'];
  if (includeNotificacao) header.push('Status notificação');
  const lines = rows.map((r) => {
    const cells = [r.fundo, r.sacado, r.nfe, r.parcela, r.vencimento, r.valor, r.statusPagamento];
    if (includeNotificacao) cells.push(r.statusNotificacao);
    return cells.map(csvCell).join(';');
  });
  return [header.join(';'), ...lines].join('\n');
}

export function toSacadosCsv(rows: PortfolioSacadoRow[]): string {
  const header = ['Fundo', 'Sacado', 'Documento', 'Limite / exposição'];
  const lines = rows.map((r) => [r.fundo, r.sacado, r.documento, r.limite].map(csvCell).join(';'));
  return [header.join(';'), ...lines].join('\n');
}

export function isSacadosReport(key: PortfolioReportKey | null) {
  return key === 'ger005';
}

export function isNotificacoesReport(key: PortfolioReportKey | null) {
  return key === 'ger003';
}
