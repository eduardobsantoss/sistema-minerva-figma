import {
  brl,
  situacaoLabel,
  VEICULOS_OPTS,
  TITULOS_SEED,
  CONTRATOS_SEED,
  type ContratoAtivoGlobal,
  type TituloAtivoGlobal,
} from './ativosData';

export type AtivosReportKey = 'wallet' | 'asset-contract-listing';

export interface AtivosReportDef {
  key: AtivosReportKey;
  title: string;
  description: string;
  fileName: string;
}

export const ATIVOS_REPORTS: AtivosReportDef[] = [
  {
    key: 'wallet',
    title: 'Gerenciamento de Carteira',
    description: 'Títulos dos fundos selecionados, com status, vencimento e valores em aberto.',
    fileName: 'ativos-gerenciamento-carteira.csv',
  },
  {
    key: 'asset-contract-listing',
    title: 'Listagem de Contratos de Ativos',
    description: 'Contratos vinculados aos fundos filtrados, com cedente, sacado e valores.',
    fileName: 'ativos-listagem-contratos.csv',
  },
];

export const SITUACAO_FUNDO_OPTS = ['EM ANDAMENTO', 'ENCERRADO'] as const;
export const TIPO_VEICULO_OPTS = ['CRA', 'FIDC'] as const;

export interface AtivosFundoRow {
  id: string;
  nome: string;
  tipo: (typeof TIPO_VEICULO_OPTS)[number];
  cnpj: string;
  situacao: (typeof SITUACAO_FUNDO_OPTS)[number];
}

function tipoFromVeiculo(id: string): AtivosFundoRow['tipo'] {
  return id.includes('cra') ? 'CRA' : 'FIDC';
}

export const ATIVOS_FUNDOS: AtivosFundoRow[] = VEICULOS_OPTS.map((v, i) => ({
  id: v.id,
  nome: v.nome,
  tipo: tipoFromVeiculo(v.id),
  cnpj: `${String(12 + i).padStart(2, '0')}.${String(345 + i * 17).padStart(3, '0')}.${String(678 + i).padStart(3, '0')}/0001-${String(90 + i).padStart(2, '0')}`,
  situacao: i === VEICULOS_OPTS.length - 1 ? 'ENCERRADO' : 'EM ANDAMENTO',
}));

function csvCell(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

function brDateToIso(d: string) {
  const [dd, mm, yyyy] = d.split('/');
  if (!yyyy || !mm || !dd) return '';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

export function filterTitulosByFunds(fundIds: string[]): TituloAtivoGlobal[] {
  const set = new Set(fundIds);
  return TITULOS_SEED.filter((t) => set.has(t.veiculoId));
}

export function filterContratosByFunds(fundIds: string[]): ContratoAtivoGlobal[] {
  const set = new Set(fundIds);
  return CONTRATOS_SEED.filter((c) => set.has(c.veiculoId));
}

export function filterTitulosPreview(
  rows: TituloAtivoGlobal[],
  f: { sacado: string; situacao: string; vencimentoDe: string; vencimentoAte: string },
): TituloAtivoGlobal[] {
  const q = f.sacado.trim().toLowerCase();
  return rows.filter((t) => {
    if (q && !t.sacadoNome.toLowerCase().includes(q)) return false;
    if (f.situacao && t.situacao !== f.situacao) return false;
    const venc = brDateToIso(t.vencimento);
    if (f.vencimentoDe && venc && venc < f.vencimentoDe) return false;
    if (f.vencimentoAte && venc && venc > f.vencimentoAte) return false;
    return true;
  });
}

export function filterContratosPreview(
  rows: ContratoAtivoGlobal[],
  f: { sacado: string },
): ContratoAtivoGlobal[] {
  const q = f.sacado.trim().toLowerCase();
  return rows.filter((c) => !q || c.sacadoNome.toLowerCase().includes(q) || c.cedenteNome.toLowerCase().includes(q));
}

export function toTitulosCsv(rows: TituloAtivoGlobal[]): string {
  const header = ['Fundo', 'Sacado', 'Nº Título', 'Contrato', 'Vencimento', 'Valor aberto', 'Situação'];
  const lines = rows.map((t) =>
    [t.veiculoNome, t.sacadoNome, t.numero, t.contratoNumero, t.vencimento, brl(t.valorAberto), situacaoLabel(t.situacao)]
      .map(csvCell)
      .join(';'),
  );
  return [header.join(';'), ...lines].join('\n');
}

export function toContratosCsv(rows: ContratoAtivoGlobal[]): string {
  const header = ['Nº Contrato', 'Fundo', 'Tipo', 'Cedente', 'Sacado', 'Valor nominal', 'Último vencimento', 'Parcelas'];
  const lines = rows.map((c) =>
    [c.numero, c.veiculoNome, c.tipoAtivo, c.cedenteNome, c.sacadoNome, brl(c.valorNominal), c.ultimoVencimento, String(c.qtdParcelas)]
      .map(csvCell)
      .join(';'),
  );
  return [header.join(';'), ...lines].join('\n');
}

export function isContratosReport(key: AtivosReportKey | null) {
  return key === 'asset-contract-listing';
}
