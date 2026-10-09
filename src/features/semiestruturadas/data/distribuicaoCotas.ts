import type { SemiCota } from './semiestruturadasData';

/** Tolerância (em pontos percentuais) para comparações de soma. */
export const PCT_EPSILON = 0.005;

/** Veículos de exemplo que podem adquirir uma cota. */
export const VEICULOS_ADQUIRENTES: string[] = [
  'FIDC Agro Horizonte',
  'CRA Semeagro',
  'FIDC Cultura Premium',
  'FIDC Vale Verde',
  'CRA Multiagro',
  'FIDC Solo Rico',
  'CRA Terra Forte',
];

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Regra de três: pct está para 100% assim como valor está para o total. */
export function valorPorPct(pct: number, total: number): number {
  return (total * pct) / 100;
}

/** Converte texto digitado (aceita vírgula) em número; vazio/inválido vira NaN. */
export function parsePct(text: string): number {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '') return NaN;
  return Number(normalized);
}

export function formatPctInput(n: number): string {
  return String(round2(n)).replace('.', ',');
}

/** Reaplica uma porcentagem em uma cota existente, recalculando valores. */
export function reaplicarCota(cota: SemiCota, pct: number, total: number): SemiCota {
  const percentual = round2(pct);
  const valorTotal = Math.round(valorPorPct(percentual, total));
  const razao = cota.valorTotal > 0 ? valorTotal / cota.valorTotal : 0;
  return {
    ...cota,
    percentualAdquirido: percentual,
    valorTotal,
    quantidadeCotas: cota.valorUnitario > 0 ? Math.round(valorTotal / cota.valorUnitario) : 0,
    cronograma: cota.cronograma.map((p) => ({ ...p, valor: Math.round(p.valor * razao) })),
  };
}

let seq = 0;

/** Cria uma cota nova (sem cronograma) para o veículo informado. */
export function novaCota(veiculo: string, pct: number, total: number): SemiCota {
  const percentual = round2(pct);
  const valorTotal = Math.round(valorPorPct(percentual, total));
  const valorUnitario = 1000;
  seq += 1;
  return {
    id: `semi-cota-${Date.now()}-${seq}`,
    veiculoAdquirente: veiculo,
    percentualAdquirido: percentual,
    quantidadeCotas: Math.round(valorTotal / valorUnitario),
    valorUnitario,
    valorTotal,
    cronograma: [],
  };
}
