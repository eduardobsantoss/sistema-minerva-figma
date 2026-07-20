export type VehicleTypeTab = 'FIDC' | 'CRA' | 'GARANTIAS';

export type RateStatus = 1 | 2 | 3; // 1=Ativo, 2=Inativo, 3=Aguardando

export interface VehicleRateHistory {
  id: string;
  createdAt: string;
  dueAt: string;
  status: RateStatus;
  preFixedRate: number | null;
  postFixedRate: number | null;
  postFixedIndex: string;
}

export interface VehicleSetting {
  vehicleId: string;
  vehicleName: string;
  isActive: boolean;
  preFixedRate: number | null;
  postFixedRate: number | null;
  postFixedIndex: string;
  dueAt: string;
  history: VehicleRateHistory[];
}

export const POST_FIXED_INDEX_OPTS = ['DI'] as const;

export function rateStatusLabel(status: RateStatus): string {
  if (status === 1) return 'Ativo';
  if (status === 2) return 'Inativo';
  if (status === 3) return 'Aguardando';
  return 'Desconhecido';
}

export function rateStatusColor(status: RateStatus): string {
  if (status === 1) return '#16a34a';
  if (status === 2) return '#6b7280';
  if (status === 3) return '#d97706';
  return '#6b7280';
}

function hist(
  id: string,
  createdAt: string,
  dueAt: string,
  status: RateStatus,
  pre: number | null,
  post: number | null,
): VehicleRateHistory {
  return {
    id,
    createdAt,
    dueAt,
    status,
    preFixedRate: pre,
    postFixedRate: post,
    postFixedIndex: 'DI',
  };
}

export const VEICULOS_FIDC_SEED: VehicleSetting[] = [
  {
    vehicleId: '101',
    vehicleName: 'FIDC Ceres Multicedente',
    isActive: true,
    preFixedRate: 1.85,
    postFixedRate: 1.5,
    postFixedIndex: 'DI',
    dueAt: '2026-12-31',
    history: [
      hist('h-f1-1', '01/03/2026 10:00', '31/12/2026', 1, 1.85, 1.5),
      hist('h-f1-2', '15/01/2026 09:30', '28/02/2026', 2, 1.7, null),
    ],
  },
  {
    vehicleId: '102',
    vehicleName: 'FIDC Agro Recebíveis',
    isActive: true,
    preFixedRate: 2.1,
    postFixedRate: null,
    postFixedIndex: 'DI',
    dueAt: '2026-09-30',
    history: [hist('h-f2-1', '10/02/2026 14:00', '30/09/2026', 1, 2.1, null)],
  },
  {
    vehicleId: '103',
    vehicleName: 'FIDC Trading Senior',
    isActive: false,
    preFixedRate: null,
    postFixedRate: 1.2,
    postFixedIndex: 'DI',
    dueAt: '2026-08-15',
    history: [hist('h-f3-1', '20/04/2026 11:00', '15/08/2026', 3, null, 1.2)],
  },
  {
    vehicleId: '104',
    vehicleName: 'FIDC Monocedente Norte',
    isActive: true,
    preFixedRate: 1.95,
    postFixedRate: 1.0,
    postFixedIndex: 'DI',
    dueAt: '2027-01-31',
    history: [hist('h-f4-1', '05/05/2026 16:20', '31/01/2027', 1, 1.95, 1.0)],
  },
];

export const VEICULOS_CRA_SEED: VehicleSetting[] = [
  {
    vehicleId: '201',
    vehicleName: 'CRA Agrovita I',
    isActive: true,
    preFixedRate: 1.6,
    postFixedRate: null,
    postFixedIndex: 'DI',
    dueAt: '2026-11-30',
    history: [hist('h-c1-1', '12/03/2026 08:45', '30/11/2026', 1, 1.6, null)],
  },
  {
    vehicleId: '202',
    vehicleName: 'CRA Confina II',
    isActive: true,
    preFixedRate: null,
    postFixedRate: 1.75,
    postFixedIndex: 'DI',
    dueAt: '2026-10-31',
    history: [hist('h-c2-1', '18/02/2026 13:10', '31/10/2026', 1, null, 1.75)],
  },
  {
    vehicleId: '203',
    vehicleName: 'CRA Ceres Securitizadora',
    isActive: false,
    preFixedRate: 2.0,
    postFixedRate: 1.3,
    postFixedIndex: 'DI',
    dueAt: '2026-07-31',
    history: [hist('h-c3-1', '01/01/2026 10:00', '31/07/2026', 2, 2.0, 1.3)],
  },
];

export const VEICULOS_GARANTIAS_SEED: VehicleSetting[] = [
  {
    vehicleId: '301',
    vehicleName: 'Garantia CDCA Sul',
    isActive: true,
    preFixedRate: null,
    postFixedRate: null,
    postFixedIndex: 'DI',
    dueAt: '',
    history: [],
  },
  {
    vehicleId: '302',
    vehicleName: 'Garantia Penhor Estoque',
    isActive: true,
    preFixedRate: 0.5,
    postFixedRate: null,
    postFixedIndex: 'DI',
    dueAt: '2026-12-15',
    history: [hist('h-g2-1', '22/04/2026 09:00', '15/12/2026', 1, 0.5, null)],
  },
  {
    vehicleId: '303',
    vehicleName: 'Garantia AF Imóvel',
    isActive: false,
    preFixedRate: null,
    postFixedRate: null,
    postFixedIndex: 'DI',
    dueAt: '',
    history: [],
  },
];

export function seedByTab(tab: VehicleTypeTab): VehicleSetting[] {
  if (tab === 'FIDC') return VEICULOS_FIDC_SEED.map((v) => ({ ...v, history: v.history.map((h) => ({ ...h })) }));
  if (tab === 'CRA') return VEICULOS_CRA_SEED.map((v) => ({ ...v, history: v.history.map((h) => ({ ...h })) }));
  return VEICULOS_GARANTIAS_SEED.map((v) => ({ ...v, history: v.history.map((h) => ({ ...h })) }));
}
