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

export type CedenteTipoTab = 'PF' | 'PJ';

export interface CedenteDisponivel {
  id: string;
  nome: string;
  documento: string;
  tipo: CedenteTipoTab;
}

export interface ValidationConfig {
  id: string;
  requestTypeId: number;
  vehicleIds: string[];
  cedenteIds: string[];
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

export const CEDENTES_VALIDACAO: CedenteDisponivel[] = [
  { id: 'ced-v1', nome: '3A MAQUINAS E TRANSPORTES LTDA', documento: '12.345.678/0001-90', tipo: 'PJ' },
  { id: 'ced-v2', nome: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA', documento: '98.765.432/0001-11', tipo: 'PJ' },
  { id: 'ced-v3', nome: 'AGROPECUARIA VALE VERDE S/A', documento: '45.112.998/0001-22', tipo: 'PJ' },
  { id: 'ced-v4', nome: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA', documento: '33.220.114/0001-05', tipo: 'PJ' },
  { id: 'ced-v5', nome: 'LATICÍNIOS PRADO LTDA', documento: '11.222.333/0001-44', tipo: 'PJ' },
  { id: 'ced-v6', nome: 'José Carlos Mendes', documento: '234.567.890-12', tipo: 'PF' },
  { id: 'ced-v7', nome: 'Maria Helena Rocha', documento: '321.654.987-00', tipo: 'PF' },
  { id: 'ced-v8', nome: 'Pedro Alves Costa', documento: '456.789.123-55', tipo: 'PF' },
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
      { id: 'cfg-101-1', requestTypeId: 1, vehicleIds: ['fidc-v1', 'cra-v1'], cedenteIds: [] },
      { id: 'cfg-101-2', requestTypeId: 9, vehicleIds: ['fidc-v2'], cedenteIds: [] },
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
      { id: 'cfg-102-1', requestTypeId: 6, vehicleIds: ['fidc-v1', 'fidc-v3'], cedenteIds: ['ced-v1', 'ced-v3'] },
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
    description: 'Validação do gerente comercial responsável pela solicitação.',
    responsibleSector: 1,
    requiresAttachmentOnAuthorization: false,
    usedByMonoTransferor: false,
    configs: [
      { id: 'cfg-104-1', requestTypeId: 7, vehicleIds: [], cedenteIds: [] },
    ],
  },
];

export function escopoLabel(item: ValidationItem): string {
  const tipos = item.configs.length;
  if (tipos === 0) return 'Não configurado';
  if (item.usedByMonoTransferor) {
    const cedentes = item.configs.reduce((acc, c) => acc + (c.cedenteIds?.length ?? 0), 0);
    return `${tipos} tipo(s) · ${cedentes} cedente(s)`;
  }
  const veiculos = item.configs.reduce((acc, c) => acc + c.vehicleIds.length, 0);
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
