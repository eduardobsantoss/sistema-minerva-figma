import type { FaixaConcentracaoSacado } from '../data/riscoData';

const CONCENTRATION_PERCENTAGE_PATTERN =
  /^(?:100(?:\.0{1,2})?|\d{1,2}(?:\.\d{1,2})?)$/;

export function parseConcentracaoPercentual(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const raw = String(value).trim().replace(',', '.');
  if (!CONCENTRATION_PERCENTAGE_PATTERN.test(raw)) return null;
  return Math.round(Number(raw) * 100) / 100;
}

export function rankLabel(index: number, total: number): string {
  if (total <= 0) return '';
  if (index === total - 1) return 'Demais sacados';
  return `Top ${index + 1}`;
}

export function validateFaixasConcentracao(faixas: FaixaConcentracaoSacado[]): string | null {
  if (!faixas.length) return null;
  for (let i = 0; i < faixas.length; i++) {
    const pct = faixas[i].percentual;
    if (parseConcentracaoPercentual(pct) == null) {
      return `Informe um percentual válido (0–100, até 2 decimais) na posição ${i + 1}.`;
    }
    if (i > 0 && faixas[i].percentual > faixas[i - 1].percentual) {
      return `O percentual da posição ${i + 1} deve ser menor ou igual ao da posição anterior.`;
    }
  }
  return null;
}

export function normalizeFaixasPositions(faixas: FaixaConcentracaoSacado[]): FaixaConcentracaoSacado[] {
  return faixas.map((f, i) => ({ ...f, position: i + 1 }));
}

export function addFaixaBeforeLast(faixas: FaixaConcentracaoSacado[]): FaixaConcentracaoSacado[] {
  if (!faixas.length) {
    return [{ position: 1, percentual: 0 }];
  }
  const next = faixas.map((f) => ({ ...f }));
  const insertAt = Math.max(0, next.length - 1);
  next.splice(insertAt, 0, { position: insertAt + 1, percentual: 0 });
  return normalizeFaixasPositions(next);
}

export function removeFaixaAt(faixas: FaixaConcentracaoSacado[], index: number): FaixaConcentracaoSacado[] {
  if (faixas.length <= 1) return [];
  const next = faixas.filter((_, i) => i !== index);
  return normalizeFaixasPositions(next);
}
