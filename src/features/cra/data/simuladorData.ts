/** Dados mock do Simulador CRA (Termo Confina) */

export const BASE_DAYS_OPTS = ['21', '30', '30/360', '252', '360', '365'] as const;

export const CONFINA_CATEGORIA_OPTS = ['Novilho', 'Boi magro', 'Boi gordo', 'Vaca'] as const;
export const CONFINA_RACA_OPTS = ['Nelore', 'Angus', 'Cruzado', 'Brahman'] as const;

export interface ConfinaPreview {
  valorCompra: number;
  valorNominal: number;
  juros: number;
  dias: number;
}

/** Preview simplificado: valor compra = qtd × unitário × peso; nominal com taxa linear no prazo */
export function simulatePromissoryNote(input: {
  animalsQuantity: number;
  unitValue: number;
  batchWeightInArroba: number;
  rate: number;
  issueDate: string;
  dueDate: string;
}): ConfinaPreview {
  const valorCompra = input.animalsQuantity * input.unitValue * (input.batchWeightInArroba / Math.max(input.animalsQuantity, 1));
  const issue = input.issueDate ? new Date(input.issueDate) : new Date();
  const due = input.dueDate ? new Date(input.dueDate) : new Date(issue.getTime() + 90 * 86400000);
  const dias = Math.max(1, Math.round((due.getTime() - issue.getTime()) / 86400000));
  const juros = valorCompra * (input.rate / 100) * (dias / 30);
  return {
    valorCompra,
    valorNominal: valorCompra + juros,
    juros,
    dias,
  };
}

export interface SavedSimulation {
  id: string;
  type: 6;
  typeLabel: 'Termo Confina';
  grupo: string;
  createdAt: string;
  valorNominal: number;
}

export const MOCK_CONFINA_SIMULATIONS: SavedSimulation[] = [
  {
    id: 'sim-confina-1',
    type: 6,
    typeLabel: 'Termo Confina',
    grupo: 'Grupo Ceres',
    createdAt: '12/03/2025',
    valorNominal: 1_250_000,
  },
];

export const FAZENDAS_OPTS = [
  'Fazenda Santa Rita — MT',
  'Fazenda Boa Vista — GO',
  'Confinamento Alto Vale — MS',
] as const;
