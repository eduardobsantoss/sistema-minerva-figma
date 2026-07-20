import { TIPO_PEDIDO_OPTS, tipoPedidoLabel } from './tipoPedidoOptions';

export { TIPO_PEDIDO_OPTS, tipoPedidoLabel };

export const SETOR_RESPONSAVEL_OPTS = [
  { text: 'Comercial', value: 1, color: '#7c3aed' },
  { text: 'Crédito', value: 2, color: '#0891b2' },
  { text: 'Operação', value: 3, color: '#d97706' },
  { text: 'Cadastro', value: 4, color: '#c2410c' },
] as const;

export type SetorResponsavel = (typeof SETOR_RESPONSAVEL_OPTS)[number]['value'];

export function setorLabel(value: number): string {
  return SETOR_RESPONSAVEL_OPTS.find((s) => s.value === value)?.text ?? '(Não definido)';
}

export function setorColor(value: number): string {
  return SETOR_RESPONSAVEL_OPTS.find((s) => s.value === value)?.color ?? '#6b7280';
}

export type FundTypeTab = 'CRA' | 'CDCA' | 'FIDC';

export interface VeiculoDisponivel {
  id: string;
  name: string;
  fundType: FundTypeTab;
}

export interface ValidationConfig {
  id: string;
  requestTypeId: number;
  vehicleIds: string[];
}

export interface ValidationItem {
  id: number;
  name: string;
  description: string;
  responsibleSector: SetorResponsavel;
  requiresAttachmentOnAuthorization: boolean;
  usedByMonoTransferor: boolean;
  configs: ValidationConfig[];
}

export const VEICULOS_VALIDACAO: VeiculoDisponivel[] = [
  { id: 'cra-v1', name: 'CRA Agrovita I', fundType: 'CRA' },
  { id: 'cra-v2', name: 'CRA Confina II', fundType: 'CRA' },
  { id: 'cra-v3', name: 'CRA Ceres Securitizadora', fundType: 'CRA' },
  { id: 'cdca-v1', name: 'CDCA Garantia Sul', fundType: 'CDCA' },
  { id: 'cdca-v2', name: 'CDCA Collateral Norte', fundType: 'CDCA' },
  { id: 'fidc-v1', name: 'FIDC Ceres Multicedente', fundType: 'FIDC' },
  { id: 'fidc-v2', name: 'FIDC Agro Recebíveis', fundType: 'FIDC' },
  { id: 'fidc-v3', name: 'FIDC Trading Senior', fundType: 'FIDC' },
  { id: 'fidc-v4', name: 'FIDC Monocedente Norte', fundType: 'FIDC' },
];

export const VALIDACOES_SEED: ValidationItem[] = [
  {
    id: 101,
    name: 'Documentação cadastral',
    description: 'Verifica se os documentos cadastrais do cedente estão vigentes e anexados.',
    responsibleSector: 4,
    requiresAttachmentOnAuthorization: true,
    usedByMonoTransferor: false,
    configs: [
      { id: 'cfg-101-1', requestTypeId: 1, vehicleIds: ['fidc-v1', 'cra-v1'] },
      { id: 'cfg-101-2', requestTypeId: 9, vehicleIds: ['fidc-v2'] },
    ],
  },
  {
    id: 102,
    name: 'Limite de crédito disponível',
    description: 'Confirma disponibilidade de limite no agrupamento vinculado à operação.',
    responsibleSector: 2,
    requiresAttachmentOnAuthorization: false,
    usedByMonoTransferor: true,
    configs: [
      { id: 'cfg-102-1', requestTypeId: 6, vehicleIds: ['fidc-v1', 'fidc-v3'] },
    ],
  },
  {
    id: 103,
    name: 'Checklist jurídico',
    description: 'Itens jurídicos obrigatórios antes da assinatura.',
    responsibleSector: 3,
    requiresAttachmentOnAuthorization: true,
    usedByMonoTransferor: false,
    configs: [],
  },
  {
    id: 104,
    name: 'Aprovação comercial',
    description: 'Validação do gerente comercial responsável pelo pedido.',
    responsibleSector: 1,
    requiresAttachmentOnAuthorization: false,
    usedByMonoTransferor: false,
    configs: [
      { id: 'cfg-104-1', requestTypeId: 7, vehicleIds: [] },
    ],
  },
];

export function escopoLabel(item: ValidationItem): string {
  const tipos = item.configs.length;
  const veiculos = item.configs.reduce((acc, c) => acc + c.vehicleIds.length, 0);
  if (tipos === 0) return 'Não configurado';
  return `${tipos} tipo(s) · ${veiculos} veículo(s)`;
}

export function isEscopoConfigurado(item: ValidationItem): boolean {
  return item.configs.length > 0;
}

export interface ValidationFilters {
  nome: string;
  id: string;
  setorResponsavel: string;
}

export function emptyValidationFilters(): ValidationFilters {
  return { nome: '', id: '', setorResponsavel: '' };
}
