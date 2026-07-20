export type FundoTipo = 'CRA' | 'FIDC';

export interface FundoDisponivel {
  id: string;
  name: string;
  type: FundoTipo;
}

export interface RankItemAtivo {
  priority: number;
  fundId: string;
  fundName: string;
  fundType: FundoTipo;
  limite: number;
  operado: number;
  configuradoPor: string;
  dataConfiguracao: string;
  isCurrent: boolean;
  isExhausted: boolean;
}

export interface RankEditorItem {
  fundId: string;
  limite: string;
}

export const FUNDOS_DISPONIVEIS: FundoDisponivel[] = [
  { id: 'cra-1', name: 'CRA Agrovita I', type: 'CRA' },
  { id: 'cra-2', name: 'CRA Confina II', type: 'CRA' },
  { id: 'cra-3', name: 'CRA Ceres Securitizadora', type: 'CRA' },
  { id: 'fidc-1', name: 'FIDC Ceres Multicedente', type: 'FIDC' },
  { id: 'fidc-2', name: 'FIDC Agro Recebíveis', type: 'FIDC' },
  { id: 'fidc-3', name: 'FIDC Trading Senior', type: 'FIDC' },
  { id: 'fidc-4', name: 'FIDC Monocedente Norte', type: 'FIDC' },
];

export function fundoLabel(f: FundoDisponivel): string {
  return `${f.name} (${f.type})`;
}

export const RANK_ATIVO_SEED: RankItemAtivo[] = [
  {
    priority: 1,
    fundId: 'fidc-1',
    fundName: 'FIDC Ceres Multicedente',
    fundType: 'FIDC',
    limite: 50_000_000,
    operado: 42_500_000,
    configuradoPor: 'Eduardo Santos',
    dataConfiguracao: '10/07/2026',
    isCurrent: true,
    isExhausted: false,
  },
  {
    priority: 2,
    fundId: 'cra-1',
    fundName: 'CRA Agrovita I',
    fundType: 'CRA',
    limite: 30_000_000,
    operado: 28_800_000,
    configuradoPor: 'Eduardo Santos',
    dataConfiguracao: '10/07/2026',
    isCurrent: false,
    isExhausted: false,
  },
  {
    priority: 3,
    fundId: 'fidc-2',
    fundName: 'FIDC Agro Recebíveis',
    fundType: 'FIDC',
    limite: 20_000_000,
    operado: 20_000_000,
    configuradoPor: 'Eduardo Santos',
    dataConfiguracao: '10/07/2026',
    isCurrent: false,
    isExhausted: true,
  },
];

export function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parseMoneyInput(raw: string): number {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function progressPct(operado: number, limite: number): number {
  if (limite <= 0) return 0;
  return Math.min(100, Math.round((operado / limite) * 100));
}

export function progressColor(pct: number): string {
  if (pct >= 100) return 'var(--action-danger-text-only, #dc2626)';
  if (pct >= 90) return '#d97706';
  return '#16a34a';
}
