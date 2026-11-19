import { cras } from '@/features/cra/data/craData';
import { fidcs } from '@/features/fidc/data/fidcsData';

export { brl } from '@/features/cra/data/craData';

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type VeiculoTipo = 'CRA' | 'FIDC';

export interface VeiculoRef {
  tipo: VeiculoTipo;
  id: string;
  nome: string;
  cnpj?: string;
}

export type ImovelStatus = 'DISPONIVEL' | 'INDISPONIVEL' | 'VENDIDO' | 'LOCADO' | 'ARRENDADO';

export type ImovelOrigem = 'GARANTIA_EXECUTADA' | 'DACAO_DIRETA';

export type ContratoTipo = 'VENDA' | 'LOCACAO' | 'ARRENDAMENTO';

export type ParcelaStatus = 'PENDENTE' | 'PARCIAL' | 'VENCIDO' | 'PAGO';

export interface ParcelaBaixa {
  id: string;
  data: string;
  valor: number;
}

export interface EstoqueParcela {
  id: string;
  numero: number;
  /** ISO yyyy-mm-dd */
  vencimento: string;
  valor: number;
  valorPago: number;
  baixas: ParcelaBaixa[];
}

export interface EstoqueContrato {
  tipo: ContratoTipo;
  /** Comprador ou locatário/arrendatário. */
  contraparte: string;
  arquivo: string;
  parcelas: EstoqueParcela[];
}

export interface EstoqueMonitoramento {
  id: string;
  data: string;
  valorAvaliado: number;
  observacao: string;
}

export interface GarantiaOrigem {
  operacaoId: string;
  operacaoNome: string;
  garantiaId: string;
  garantiaNumero: string;
  tipoGarantia: string;
}

export interface EstoqueImovel {
  id: string;
  veiculoTipo: VeiculoTipo;
  veiculoId: string;
  veiculoNome: string;
  origem: ImovelOrigem;
  garantiaOrigem?: GarantiaOrigem;
  cedenteOriginal: string;
  nome: string;
  matricula: string;
  localizacao: string;
  valorMercado: number;
  valorVendaForcada: number;
  instrumentoDacao: string;
  status: ImovelStatus;
  monitoramentos: EstoqueMonitoramento[];
  contrato?: EstoqueContrato;
  criadoEm: string;
}

export type NovoImovelInput = Omit<EstoqueImovel, 'id' | 'monitoramentos' | 'contrato' | 'criadoEm'>;

/* ------------------------------------------------------------------ */
/* Rótulos e tons (somente tokens de status)                           */
/* ------------------------------------------------------------------ */

export const IMOVEL_STATUSES: ImovelStatus[] = ['DISPONIVEL', 'INDISPONIVEL', 'VENDIDO', 'LOCADO', 'ARRENDADO'];

export const IMOVEL_STATUS_LABEL: Record<ImovelStatus, string> = {
  DISPONIVEL: 'Disponível',
  INDISPONIVEL: 'Indisponível',
  VENDIDO: 'Vendido',
  LOCADO: 'Locado',
  ARRENDADO: 'Arrendado',
};

export interface Tone {
  bg: string;
  fg: string;
}

export const IMOVEL_STATUS_TONE: Record<ImovelStatus, Tone> = {
  DISPONIVEL: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  INDISPONIVEL: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  VENDIDO: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  LOCADO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  ARRENDADO: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
};

export const ORIGENS: ImovelOrigem[] = ['GARANTIA_EXECUTADA', 'DACAO_DIRETA'];

export const ORIGEM_LABEL: Record<ImovelOrigem, string> = {
  GARANTIA_EXECUTADA: 'Garantia executada',
  DACAO_DIRETA: 'Dação direta',
};

export const CONTRATO_TIPOS: ContratoTipo[] = ['VENDA', 'LOCACAO', 'ARRENDAMENTO'];

export const CONTRATO_LABEL: Record<ContratoTipo, string> = {
  VENDA: 'Venda',
  LOCACAO: 'Locação',
  ARRENDAMENTO: 'Arrendamento',
};

export const CONTRAPARTE_LABEL: Record<ContratoTipo, string> = {
  VENDA: 'Comprador',
  LOCACAO: 'Locatário',
  ARRENDAMENTO: 'Arrendatário',
};

/** Status do imóvel que o contrato implica. */
export const CONTRATO_STATUS: Record<ContratoTipo, ImovelStatus> = {
  VENDA: 'VENDIDO',
  LOCACAO: 'LOCADO',
  ARRENDAMENTO: 'ARRENDADO',
};

export const PARCELA_STATUS_LABEL: Record<ParcelaStatus, string> = {
  PENDENTE: 'Pendente',
  PARCIAL: 'Pago parcial',
  VENCIDO: 'Vencido',
  PAGO: 'Pago',
};

export const PARCELA_STATUS_TONE: Record<ParcelaStatus, Tone> = {
  PENDENTE: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  PARCIAL: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  VENCIDO: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
  PAGO: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
};

/* ------------------------------------------------------------------ */
/* Datas e valores                                                     */
/* ------------------------------------------------------------------ */

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addMonthsIso(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(Math.min(d, lastDay))}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Aceita "1.500.000,50", "1500000.5" ou "R$ 1.500.000"; devolve 0 quando inválido. */
export function parseMoney(text: string): number {
  const clean = text.replace(/[^\d.,]/g, '');
  if (!clean) return 0;
  let normalized = clean;
  if (clean.includes(',')) normalized = clean.replace(/\./g, '').replace(',', '.');
  else if ((clean.match(/\./g) ?? []).length > 1) normalized = clean.replace(/\./g, '');
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function moneyToInput(n: number): string {
  if (!n) return '';
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

/* ------------------------------------------------------------------ */
/* Regras de parcela / resumo                                          */
/* ------------------------------------------------------------------ */

export function parcelaSaldo(p: EstoqueParcela): number {
  return Math.max(0, Math.round((p.valor - p.valorPago) * 100) / 100);
}

export function parcelaStatus(p: EstoqueParcela, hoje = todayIso()): ParcelaStatus {
  if (parcelaSaldo(p) === 0) return 'PAGO';
  if (p.vencimento < hoje) return 'VENCIDO';
  return p.valorPago > 0 ? 'PARCIAL' : 'PENDENTE';
}

export interface ImovelResumo {
  totalContrato: number;
  recebido: number;
  aReceber: number;
  vencido: number;
  parcelasVencidas: number;
  parcelasPagas: number;
  parcelasTotal: number;
  proximoVencimento: string | null;
}

export function imovelResumo(imovel: EstoqueImovel, hoje = todayIso()): ImovelResumo {
  const parcelas = imovel.contrato?.parcelas ?? [];
  const resumo: ImovelResumo = {
    totalContrato: 0,
    recebido: 0,
    aReceber: 0,
    vencido: 0,
    parcelasVencidas: 0,
    parcelasPagas: 0,
    parcelasTotal: parcelas.length,
    proximoVencimento: null,
  };
  for (const p of parcelas) {
    const saldo = parcelaSaldo(p);
    resumo.totalContrato += p.valor;
    resumo.recebido += p.valorPago;
    resumo.aReceber += saldo;
    const status = parcelaStatus(p, hoje);
    if (status === 'PAGO') resumo.parcelasPagas += 1;
    if (status === 'VENCIDO') {
      resumo.vencido += saldo;
      resumo.parcelasVencidas += 1;
    }
    if (saldo > 0 && (!resumo.proximoVencimento || p.vencimento < resumo.proximoVencimento)) {
      resumo.proximoVencimento = p.vencimento;
    }
  }
  return resumo;
}

/** Último valor avaliado no monitoramento; sem monitoramento, o valor de mercado do cadastro. */
export function valorAtual(imovel: EstoqueImovel): number {
  const ordenados = [...imovel.monitoramentos].sort((a, b) => b.data.localeCompare(a.data));
  return ordenados[0]?.valorAvaliado ?? imovel.valorMercado;
}

/* ------------------------------------------------------------------ */
/* Veículos                                                            */
/* ------------------------------------------------------------------ */

export function listVeiculos(): VeiculoRef[] {
  return [
    ...cras.map((c) => ({ tipo: 'CRA' as const, id: c.id, nome: c.nome, cnpj: c.cnpj })),
    ...fidcs.map((f) => ({ tipo: 'FIDC' as const, id: f.id, nome: f.name, cnpj: f.cnpj })),
  ];
}

export function veiculoKey(v: Pick<VeiculoRef, 'tipo' | 'id'>): string {
  return `${v.tipo}:${v.id}`;
}

/* ------------------------------------------------------------------ */
/* Dados de exemplo (datas relativas a hoje)                           */
/* ------------------------------------------------------------------ */

function parcelasSeed(
  prefix: string,
  inicio: string,
  qtd: number,
  valor: number,
  pagas: number,
  parcial?: { indice: number; valor: number },
): EstoqueParcela[] {
  return Array.from({ length: qtd }, (_, i) => {
    const vencimento = addMonthsIso(inicio, i);
    const paga = i < pagas;
    const valorPago = paga ? valor : parcial && parcial.indice === i ? parcial.valor : 0;
    return {
      id: `${prefix}-p${i + 1}`,
      numero: i + 1,
      vencimento,
      valor,
      valorPago,
      baixas: valorPago > 0 ? [{ id: `${prefix}-p${i + 1}-b1`, data: vencimento, valor: valorPago }] : [],
    };
  });
}

export function estoqueSeed(): EstoqueImovel[] {
  const hoje = todayIso();
  return [
    {
      id: 'imv-ubatuba',
      veiculoTipo: 'CRA',
      veiculoId: 'cra-ceres-agro',
      veiculoNome: 'CRA Ceres Agro',
      origem: 'GARANTIA_EXECUTADA',
      garantiaOrigem: {
        operacaoId: 'semi-nc-polli',
        operacaoNome: 'NC_POLLI_122025',
        garantiaId: 'NC-POLLI-g2',
        garantiaNumero: 'NC-POLLI-G02',
        tipoGarantia: 'AF Imóvel',
      },
      cedenteOriginal: 'Raiz Agronegócio',
      nome: 'Casa de praia Ubatuba',
      matricula: '48.213 · 1º RI Ubatuba',
      localizacao: 'Ubatuba / SP',
      valorMercado: 25_000_000,
      valorVendaForcada: 20_000_000,
      instrumentoDacao: 'escritura-ubatuba-48213.pdf',
      status: 'VENDIDO',
      monitoramentos: [
        {
          id: 'mon-ubatuba-1',
          data: addMonthsIso(hoje, -5),
          valorAvaliado: 25_000_000,
          observacao: 'Vistoria inicial após a dação. Imóvel em bom estado.',
        },
      ],
      contrato: {
        tipo: 'VENDA',
        contraparte: 'Marina Costa Empreendimentos Ltda.',
        arquivo: 'contrato-compra-venda-ubatuba.pdf',
        parcelas: parcelasSeed('ubatuba', addMonthsIso(hoje, -4), 12, 2_000_000, 3, { indice: 3, valor: 1_200_000 }),
      },
      criadoEm: addMonthsIso(hoje, -5),
    },
    {
      id: 'imv-santa-luzia',
      veiculoTipo: 'CRA',
      veiculoId: 'cra-ceres-agro',
      veiculoNome: 'CRA Ceres Agro',
      origem: 'DACAO_DIRETA',
      cedenteOriginal: 'Grupo Inova 100',
      nome: 'Fazenda Santa Luzia',
      matricula: '12.907 · RI Sorriso',
      localizacao: 'Sorriso / MT',
      valorMercado: 80_000_000,
      valorVendaForcada: 62_000_000,
      instrumentoDacao: 'traslado-santa-luzia.pdf',
      status: 'DISPONIVEL',
      monitoramentos: [
        {
          id: 'mon-luzia-1',
          data: addMonthsIso(hoje, -3),
          valorAvaliado: 80_000_000,
          observacao: 'Avaliação inicial da área produtiva (2.400 ha).',
        },
        {
          id: 'mon-luzia-2',
          data: addMonthsIso(hoje, -1),
          valorAvaliado: 83_500_000,
          observacao: 'Valorização da terra na região após a safra.',
        },
      ],
      criadoEm: addMonthsIso(hoje, -3),
    },
    {
      id: 'imv-sala-402',
      veiculoTipo: 'CRA',
      veiculoId: 'cra-ceres-agro',
      veiculoNome: 'CRA Ceres Agro',
      origem: 'DACAO_DIRETA',
      cedenteOriginal: 'Polli Agropecuária S.A.',
      nome: 'Sala comercial 402 · Ed. Central',
      matricula: '77.120 · 2º RI Goiânia',
      localizacao: 'Goiânia / GO',
      valorMercado: 1_800_000,
      valorVendaForcada: 1_350_000,
      instrumentoDacao: 'escritura-sala-402.pdf',
      status: 'LOCADO',
      monitoramentos: [],
      contrato: {
        tipo: 'LOCACAO',
        contraparte: 'Clínica Vita Saúde Ltda.',
        arquivo: 'contrato-locacao-sala-402.pdf',
        parcelas: parcelasSeed('sala402', addMonthsIso(hoje, -3), 12, 45_000, 2),
      },
      criadoEm: addMonthsIso(hoje, -4),
    },
    {
      id: 'imv-galpao-rondonopolis',
      veiculoTipo: 'CRA',
      veiculoId: 'cra-semeagro',
      veiculoNome: 'CRA Semeagro',
      origem: 'GARANTIA_EXECUTADA',
      cedenteOriginal: 'Armazém Central Ltda.',
      nome: 'Galpão armazém Rondonópolis',
      matricula: '30.554 · RI Rondonópolis',
      localizacao: 'Rondonópolis / MT',
      valorMercado: 12_000_000,
      valorVendaForcada: 9_000_000,
      instrumentoDacao: 'escritura-galpao-rondonopolis.pdf',
      status: 'INDISPONIVEL',
      monitoramentos: [],
      criadoEm: addMonthsIso(hoje, -2),
    },
    {
      id: 'imv-boa-vista',
      veiculoTipo: 'FIDC',
      veiculoId: 'ceres-btg',
      veiculoNome: 'CERES BTG URA AGRO 2 FUNDO DE INVESTIMENTO',
      origem: 'DACAO_DIRETA',
      cedenteOriginal: 'Fazenda Boa Vista Agro S.A.',
      nome: 'Fazenda Boa Vista',
      matricula: '9.842 · RI Luís Eduardo Magalhães',
      localizacao: 'Luís Eduardo Magalhães / BA',
      valorMercado: 36_000_000,
      valorVendaForcada: 28_000_000,
      instrumentoDacao: 'escritura-boa-vista.pdf',
      status: 'ARRENDADO',
      monitoramentos: [
        {
          id: 'mon-boavista-1',
          data: addMonthsIso(hoje, -2),
          valorAvaliado: 34_500_000,
          observacao: 'Reavaliação abaixo do cadastro por queda no preço da terra.',
        },
      ],
      contrato: {
        tipo: 'ARRENDAMENTO',
        contraparte: 'Cooperativa Agrícola Cerrado',
        arquivo: 'contrato-arrendamento-boa-vista.pdf',
        parcelas: parcelasSeed('boavista', addMonthsIso(hoje, -2), 10, 1_000_000, 1),
      },
      criadoEm: addMonthsIso(hoje, -3),
    },
    {
      id: 'imv-apto-1201',
      veiculoTipo: 'FIDC',
      veiculoId: 'ceres-btg',
      veiculoNome: 'CERES BTG URA AGRO 2 FUNDO DE INVESTIMENTO',
      origem: 'GARANTIA_EXECUTADA',
      cedenteOriginal: 'Grupo Inova 100',
      nome: 'Apartamento 1201 · Torre Sul',
      matricula: '55.018 · 4º RI Brasília',
      localizacao: 'Brasília / DF',
      valorMercado: 2_400_000,
      valorVendaForcada: 1_900_000,
      instrumentoDacao: 'escritura-apto-1201.pdf',
      status: 'DISPONIVEL',
      monitoramentos: [],
      criadoEm: addMonthsIso(hoje, -1),
    },
    {
      id: 'imv-chacara-vale-verde',
      veiculoTipo: 'FIDC',
      veiculoId: 'agro25',
      veiculoNome: 'AGRO 25 FUNDO DE INVESTIMENTO EM DIREITOS CREDITÓRIOS',
      origem: 'DACAO_DIRETA',
      cedenteOriginal: 'Vale Verde Comércio de Grãos',
      nome: 'Chácara Vale Verde',
      matricula: '4.310 · RI Anápolis',
      localizacao: 'Anápolis / GO',
      valorMercado: 3_000_000,
      valorVendaForcada: 2_300_000,
      instrumentoDacao: 'traslado-vale-verde.pdf',
      status: 'VENDIDO',
      monitoramentos: [],
      contrato: {
        tipo: 'VENDA',
        contraparte: 'Rui Almeida Nogueira',
        arquivo: 'contrato-venda-vale-verde.pdf',
        parcelas: parcelasSeed('valeverde', addMonthsIso(hoje, -6), 6, 500_000, 6),
      },
      criadoEm: addMonthsIso(hoje, -7),
    },
  ];
}
