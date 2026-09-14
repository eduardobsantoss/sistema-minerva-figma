import type { TipoOperacaoSemi } from '../../data/semiestruturadasData';

export interface AcceptedWarranty {
  warrantyTypeId: number;
  acceptedPercentage: number;
}

export interface RequiredWarranty {
  warrantyTypeId: number;
  mode: 'value' | 'percentage';
  value?: number;
  percentage?: number;
}

export interface NewSemiData {
  nome: string;
  credorId: string;
  escrituradorId: string;
  contractType: TipoOperacaoSemi | '';
  needsPayerBondsExpireValidation: boolean;
  operateWithFutureDelivery: boolean;
  grupoIds: string[];
  interestRate: string;
  paymentDelayFine: string;
  accepted: AcceptedWarranty[];
  required: RequiredWarranty[];
}
