/** Dados mock do Simulador FIDC (CPR-F, Adiantamento/Empréstimo, Termo Confina) */

export {
  BASE_DAYS_OPTS,
  CONFINA_CATEGORIA_OPTS,
  CONFINA_RACA_OPTS,
  FAZENDAS_OPTS,
  simulatePromissoryNote,
  type ConfinaPreview,
  type SavedSimulation,
} from '../../cra/data/simuladorData';

export const LOAN_SIMULATION_TYPES = [
  { value: '3', label: 'Adiantamento', rateLabel: 'Taxa de juros (% a.m.)' },
  { value: '4', label: 'Antecipação de recebível', rateLabel: 'Taxa de desconto (%)' },
  { value: '1', label: 'Empréstimo', rateLabel: 'Taxa de juros (% a.m.)' },
] as const;

export interface CprfPreview {
  valorNominal: number;
  parcelas: number;
  valorParcela: number;
  taxa: number;
}

export function simulateCprf(input: {
  requestedValue: number;
  totalInstallment: number;
  rate: number;
}): CprfPreview {
  const n = Math.max(1, input.totalInstallment);
  const juros = input.requestedValue * (input.rate / 100) * (n / 12);
  const valorNominal = input.requestedValue + juros;
  return {
    valorNominal,
    parcelas: n,
    valorParcela: valorNominal / n,
    taxa: input.rate,
  };
}

export interface LoanPreview {
  valorSolicitado: number;
  valorTotal: number;
  parcelas: number;
  valorParcela: number;
  rateLabel: string;
}

export function simulateLoan(input: {
  tipo: string;
  valor: number;
  parcelas: number;
  rate: number;
}): LoanPreview {
  const tipo = LOAN_SIMULATION_TYPES.find((t) => t.value === input.tipo);
  const n = input.tipo === '4' ? 1 : Math.max(1, input.parcelas);
  const fator = input.tipo === '4' ? 1 - input.rate / 100 : 1 + (input.rate / 100) * (n / 12);
  const valorTotal = input.tipo === '4' ? input.valor / Math.max(fator, 0.01) : input.valor * fator;
  return {
    valorSolicitado: input.valor,
    valorTotal,
    parcelas: n,
    valorParcela: valorTotal / n,
    rateLabel: tipo?.rateLabel ?? 'Taxa',
  };
}

export interface FidcSavedSimulation {
  id: string;
  type: 3 | 6 | 7;
  typeLabel: 'CPR-F' | 'Adiantamento/Empréstimo' | 'Termo Confina';
  grupo: string;
  createdAt: string;
  valorNominal: number;
}

export const MOCK_FIDC_SIMULATIONS: FidcSavedSimulation[] = [
  {
    id: 'sim-cprf-1',
    type: 7,
    typeLabel: 'CPR-F',
    grupo: 'Grupo Ceres',
    createdAt: '08/02/2025',
    valorNominal: 850_000,
  },
  {
    id: 'sim-loan-1',
    type: 3,
    typeLabel: 'Adiantamento/Empréstimo',
    grupo: 'Semeagro',
    createdAt: '22/01/2025',
    valorNominal: 420_000,
  },
  {
    id: 'sim-confina-1',
    type: 6,
    typeLabel: 'Termo Confina',
    grupo: 'BTG Agro',
    createdAt: '15/03/2025',
    valorNominal: 1_100_000,
  },
];
