import type { Component } from 'vue';
import {
  Briefcase,
  TrendingUp,
  Wallet,
  Calendar,
  LayoutGrid,
  Clock,
} from 'lucide-vue-next';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type NivelRisco = 'Baixo' | 'Médio' | 'Alto';
export type ValidacaoAf = 'Aprovado' | 'Pendente' | 'Em análise';
export type B3Status = 'Criado' | 'Aguardando' | '—';
export type CraStatus = 'Em carteira' | 'Liquidado';
export type FaixaAtraso = 'Em dia' | '0-30' | '31-60' | '61-90' | string;
export type EtapaStatus = 'concluido' | 'em-andamento' | 'pendente';

export interface Cota {
  id: string;
  nome: string;
  sigla: string;
  siglaBadge: string;
  tipoRemuneracao: string;
  nivelRisco: NivelRisco;
  puBase: number;
  rentabilidade: number;
  percentualPL: number;
  /** CSS color token for badge/progress bar */
  cor: string;
}

export interface Kpi {
  label: string;
  value: string;
  icon: Component;
}

export interface EventoPagamento {
  id: string;
  cota: string;
  evento: string;
  data: string;
  valorPrevisto: number;
  validacaoAF: ValidacaoAf;
  b3Status: B3Status;
}

export interface CraComposicao {
  id: string;
  cedente: string;
  sacado: string;
  valorAquisicao: number;
  valorFace: number;
  dataAquisicao: string;
  dataVencimento: string;
  valorLiquidacao: number;
  dataLiquidacao: string;
  faixaAtraso: FaixaAtraso;
  tipoTitulo: string;
  pdd: number;
  taxa: number;
  status: CraStatus;
  puAtualizado: number;
  valorizacaoD1: number;
  valorizacaoD2: number;
  valorizacaoD3: number;
}

export interface HistoricoPu {
  id: string;
  data: string;
  taxaDI: number;
  tdk: number;
  fatorDiario: number;
  fatorDIAcum: number;
  spread: number;
  du: number;
  spreadAcum: number;
  fatorJurosAcum: number;
  vn: number;
  puAtualizado: number;
  juros: number;
}

export interface StatusEtapa {
  validacaoPU: EtapaStatus;
  envioComunicado: EtapaStatus;
  confirmacaoB3: EtapaStatus;
  bancoLiquidante: EtapaStatus;
  confirmacaoLiquidacao: EtapaStatus;
}

export interface EventoCronograma {
  id: string;
  evento: string;
  data: string;
  statusEtapa: StatusEtapa;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function brl(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000)
      return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat('pt-BR').format(n);
}

/* ------------------------------------------------------------------ */
/* Tone maps                                                          */
/* ------------------------------------------------------------------ */

export const TONE_RISCO: Record<NivelRisco, { bg: string; fg: string }> = {
  Baixo: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  Médio: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  Alto: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
};

export const TONE_VALIDACAO_AF: Record<ValidacaoAf, { bg: string; fg: string }> = {
  Aprovado: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  Pendente: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  'Em análise': { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
};

export const TONE_CRA_STATUS: Record<CraStatus, { bg: string; fg: string }> = {
  'Em carteira': { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  Liquidado: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
};

export function toneAtraso(faixa: FaixaAtraso): { bg: string; fg: string } {
  if (faixa === 'Em dia') {
    return { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' };
  }
  return { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' };
}

export const TONE_B3: Record<B3Status, string> = {
  Criado: 'var(--success-base)',
  Aguardando: 'var(--warning-base)',
  '—': 'var(--text-muted)',
};

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

export const COTAS: Cota[] = [
  {
    id: 'sr',
    nome: 'Sênior',
    sigla: 'SR',
    siglaBadge: 'SE',
    tipoRemuneracao: 'Pré Fixado',
    nivelRisco: 'Baixo',
    puBase: 108.74,
    rentabilidade: 8.7,
    percentualPL: 55,
    cor: 'var(--gci-base)',
  },
  {
    id: 'mez',
    nome: 'Mezanino',
    sigla: 'MEZ',
    siglaBadge: 'MEZ',
    tipoRemuneracao: 'Pré Fixado',
    nivelRisco: 'Médio',
    puBase: 104.31,
    rentabilidade: 11.2,
    percentualPL: 25,
    cor: 'var(--success-base)',
  },
  {
    id: 'sub',
    nome: 'Subordinada',
    sigla: 'SUB',
    siglaBadge: 'SUB',
    tipoRemuneracao: 'Pré / Rend.',
    nivelRisco: 'Alto',
    puBase: 101.29,
    rentabilidade: 14.8,
    percentualPL: 20,
    cor: 'var(--warning-base)',
  },
];

export const KPIS: Kpi[] = [
  { label: 'Soma da Carteira (D-1)', value: 'R$ 152.4M', icon: Briefcase },
  { label: 'Valor Presente', value: 'R$ 148.9M', icon: TrendingUp },
  { label: 'Valor do Caixa do dia', value: 'R$ 12.1M', icon: Wallet },
  { label: 'Pagamento SR', value: 'R$ 2.1M', icon: Calendar },
  { label: 'Valor Patrimônio Total', value: 'R$ 164.5M', icon: LayoutGrid },
  { label: 'Provisão de Despesa', value: 'R$ 420K', icon: Clock },
];

export const EVENTOS: EventoPagamento[] = [
  {
    id: 'e1',
    cota: 'Sênior',
    evento: 'Amortização mensal',
    data: '28/05/2026',
    valorPrevisto: 2100000,
    validacaoAF: 'Aprovado',
    b3Status: 'Criado',
  },
  {
    id: 'e2',
    cota: 'Mezanino',
    evento: 'Juros',
    data: '28/05/2026',
    valorPrevisto: 890000,
    validacaoAF: 'Aprovado',
    b3Status: 'Criado',
  },
  {
    id: 'e3',
    cota: 'Subordinada',
    evento: 'Pgto. Extraordinário',
    data: '30/05/2026',
    valorPrevisto: 420000,
    validacaoAF: 'Pendente',
    b3Status: 'Aguardando',
  },
  {
    id: 'e4',
    cota: 'Todas',
    evento: 'Aditamento',
    data: '30/05/2026',
    valorPrevisto: 0,
    validacaoAF: 'Em análise',
    b3Status: '—',
  },
];

export const CRAS: CraComposicao[] = [
  {
    id: 'cra1',
    cedente: 'Confina Agronegócios',
    sacado: 'JBS S/A',
    valorAquisicao: 25000000,
    valorFace: 25000000,
    dataAquisicao: '10/01/2025',
    dataVencimento: '15/01/2027',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'NC',
    pdd: 0,
    taxa: 12.5,
    status: 'Em carteira',
    puAtualizado: 105.42,
    valorizacaoD1: 0.042,
    valorizacaoD2: 0.039,
    valorizacaoD3: 0.041,
  },
  {
    id: 'cra2',
    cedente: 'Uby Foliares',
    sacado: 'Marfrig Global',
    valorAquisicao: 15000000,
    valorFace: 15000000,
    dataAquisicao: '22/02/2025',
    dataVencimento: '30/03/2026',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'CPR_F',
    pdd: 0,
    taxa: 14.2,
    status: 'Em carteira',
    puAtualizado: 102.15,
    valorizacaoD1: 0.051,
    valorizacaoD2: 0.048,
    valorizacaoD3: 0.049,
  },
  {
    id: 'cra3',
    cedente: 'Cultura Agronegócios',
    sacado: 'Cargill Agrícola',
    valorAquisicao: 12000000,
    valorFace: 12000000,
    dataAquisicao: '05/03/2025',
    dataVencimento: '10/03/2026',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: '0-30',
    tipoTitulo: 'NC',
    pdd: 0.02,
    taxa: 13.8,
    status: 'Em carteira',
    puAtualizado: 98.74,
    valorizacaoD1: -0.012,
    valorizacaoD2: 0.042,
    valorizacaoD3: 0.041,
  },
  {
    id: 'cra4',
    cedente: 'Renovagro Energias',
    sacado: 'Raízen Energia',
    valorAquisicao: 45000000,
    valorFace: 45000000,
    dataAquisicao: '15/12/2024',
    dataVencimento: '15/12/2028',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'NC',
    pdd: 0,
    taxa: 11.5,
    status: 'Em carteira',
    puAtualizado: 112.84,
    valorizacaoD1: 0.038,
    valorizacaoD2: 0.037,
    valorizacaoD3: 0.039,
  },
  {
    id: 'cra5',
    cedente: 'Renovagro Energias',
    sacado: 'Raízen Energia',
    valorAquisicao: 45000000,
    valorFace: 45000000,
    dataAquisicao: '15/12/2024',
    dataVencimento: '15/12/2028',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'NC',
    pdd: 0,
    taxa: 11.5,
    status: 'Em carteira',
    puAtualizado: 112.84,
    valorizacaoD1: 0.038,
    valorizacaoD2: 0.037,
    valorizacaoD3: 0.039,
  },
  {
    id: 'cra6',
    cedente: 'Allas Logística',
    sacado: 'Amaggi',
    valorAquisicao: 8000000,
    valorFace: 8000000,
    dataAquisicao: '10/04/2025',
    dataVencimento: '10/04/2026',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: '31-60',
    tipoTitulo: 'CPR_F',
    pdd: 0.05,
    taxa: 15.1,
    status: 'Em carteira',
    puAtualizado: 92.31,
    valorizacaoD1: -0.045,
    valorizacaoD2: 0.041,
    valorizacaoD3: 0.04,
  },
  {
    id: 'cra7',
    cedente: 'Bruno Peixoto Agro',
    sacado: 'Cofco International',
    valorAquisicao: 32000000,
    valorFace: 32000000,
    dataAquisicao: '20/05/2025',
    dataVencimento: '20/05/2027',
    valorLiquidacao: 0,
    dataLiquidacao: '—',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'NC',
    pdd: 0,
    taxa: 12.9,
    status: 'Em carteira',
    puAtualizado: 107.12,
    valorizacaoD1: 0.044,
    valorizacaoD2: 0.042,
    valorizacaoD3: 0.043,
  },
  {
    id: 'cra8',
    cedente: 'Boa Esperança Sementes',
    sacado: 'Louis Dreyfus',
    valorAquisicao: 18500000,
    valorFace: 18500000,
    dataAquisicao: '12/01/2025',
    dataVencimento: '12/01/2026',
    valorLiquidacao: 18500000,
    dataLiquidacao: '15/05/2025',
    faixaAtraso: 'Em dia',
    tipoTitulo: 'NC',
    pdd: 0,
    taxa: 13.5,
    status: 'Liquidado',
    puAtualizado: 100.0,
    valorizacaoD1: 0,
    valorizacaoD2: 0,
    valorizacaoD3: 0,
  },
];

export const HISTORICO_PU: HistoricoPu[] = Array.from({ length: 20 }, (_, i) => ({
  id: `h${i}`,
  data: `${27 - i}/05/2026`,
  taxaDI: 11.25,
  tdk: 1.0431,
  fatorDiario: 1.00042,
  fatorDIAcum: 1.1542,
  spread: 2.5,
  du: i + 1,
  spreadAcum: 1.0874,
  fatorJurosAcum: 1.2543,
  vn: 1000,
  puAtualizado: 108.74 - i * 0.1,
  juros: 8.74 - i * 0.05,
}));

export const CRONOGRAMA: EventoCronograma[] = [
  {
    id: 'c1',
    evento: 'Amortização Programada',
    data: '28/05/2026',
    statusEtapa: {
      validacaoPU: 'concluido',
      envioComunicado: 'concluido',
      confirmacaoB3: 'em-andamento',
      bancoLiquidante: 'pendente',
      confirmacaoLiquidacao: 'pendente',
    },
  },
  {
    id: 'c2',
    evento: 'Juros',
    data: '28/06/2026',
    statusEtapa: {
      validacaoPU: 'pendente',
      envioComunicado: 'pendente',
      confirmacaoB3: 'pendente',
      bancoLiquidante: 'pendente',
      confirmacaoLiquidacao: 'pendente',
    },
  },
];

export const BASE_D1_LABEL = '27 de Maio, 2026';
export const EXTRAORDINARY_VALUE_LABEL = '420.000,00';
