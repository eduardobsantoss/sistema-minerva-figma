export type TipoAtivo = 'NFe' | 'CDCA' | 'CPRF' | 'CCB' | 'CPR' | 'NC' | 'NP';

export type SituacaoTitulo =
  | 'PENDENTE'
  | 'VALIDADO'
  | 'REJEITADO'
  | 'EM_CARTEIRA'
  | 'BAIXA_PARCIAL';

export type StatusTitulo =
  | 'VINCENDO'
  | 'VENCIDO'
  | 'BAIXA_PARCIAL'
  | 'LIQUIDADO';

export type StatusRegistro = 'REGISTRADO' | 'PENDENTE' | 'REJEITADO';
export type StatusEntrega = 'PER' | 'FUT' | 'ENTREGUE';
export type StatusConfirmacao = 'CONFIRMADO' | 'PENDENTE' | 'REJEITADO';
export type StatusNotificacao = 'NOTIFICADO' | 'PENDENTE' | 'NAO_NOTIFICADO';

export interface ContratoAtivoGlobal {
  id: string;
  numero: string;
  qtdParcelas: number;
  tipoAtivo: TipoAtivo;
  veiculoId: string;
  veiculoNome: string;
  grupoEmpresarialId: string;
  grupoEmpresarial: string;
  valorNominal: number;
  valorEmissao: number;
  valorAquisicao: number;
  valorPresente: number;
  valorAberto: number;
  cedenteNome: string;
  cedenteDocumento: string;
  sacadoNome: string;
  sacadoDocumento: string;
  dataPrimeiraEntrada: string;
  ultimoVencimento: string;
  tituloIds: string[];
}

export interface TituloAtivoGlobal {
  id: string;
  contratoId: string;
  contratoNumero: string;
  statusRegistro: StatusRegistro;
  statusEntrega: StatusEntrega;
  statusConfirmacao: StatusConfirmacao;
  prazoConfirmacao: string;
  statusNotificacao: StatusNotificacao;
  lastro: string;
  numero: string;
  veiculoId: string;
  veiculoNome: string;
  cedenteNome: string;
  cedenteDocumento: string;
  sacadoNome: string;
  sacadoDocumento: string;
  gerente: string;
  chaveNotaFiscal: string;
  situacao: SituacaoTitulo;
  statusTitulo: StatusTitulo;
  cessao: string;
  dataCessao: string | null;
  taxaCessao: number | null;
  taxaEfetiva: number | null;
  indicadorTaxa: string | null;
  percentualIndicador: number | null;
  tipoAtivo: TipoAtivo;
  dataCriacao: string;
  dataEmissao: string;
  valorNominal: number;
  valorEmissao: number;
  valorAquisicao: number;
  valorPresente: number;
  valorAberto: number;
  valorVencido: number;
  vencimento: string;
  ultimoPagamento: string | null;
  grupoEmpresarialId: string;
  grupoEmpresarial: string;
  dataEntrada: string;
}

export interface AtivosFilters {
  lastro: string;
  numeroContrato: string;
  veiculoIds: string[];
  grupoIds: string[];
  situacao: string;
  statusTitulo: string;
  gerente: string;
  cessao: string;
  dataEntradaIni: string;
  dataEntradaFim: string;
  dataVencimentoIni: string;
  dataVencimentoFim: string;
}

export const EMPTY_FILTERS: AtivosFilters = {
  lastro: '',
  numeroContrato: '',
  veiculoIds: [],
  grupoIds: [],
  situacao: '',
  statusTitulo: '',
  gerente: '',
  cessao: '',
  dataEntradaIni: '',
  dataEntradaFim: '',
  dataVencimentoIni: '',
  dataVencimentoFim: '',
};

export const SITUACAO_OPTS: SituacaoTitulo[] = [
  'PENDENTE',
  'VALIDADO',
  'REJEITADO',
  'EM_CARTEIRA',
  'BAIXA_PARCIAL',
];

export const STATUS_TITULO_OPTS: StatusTitulo[] = [
  'VINCENDO',
  'VENCIDO',
  'BAIXA_PARCIAL',
  'LIQUIDADO',
];

export const TIPO_ATIVO_OPTS: TipoAtivo[] = ['NFe', 'CDCA', 'CPRF', 'CCB', 'CPR', 'NC', 'NP'];

export function brl(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function situacaoLabel(s: SituacaoTitulo): string {
  return (
    {
      PENDENTE: 'Pendente',
      VALIDADO: 'Validado',
      REJEITADO: 'Rejeitado',
      EM_CARTEIRA: 'Em Carteira',
      BAIXA_PARCIAL: 'Baixa Parcial',
    } as const
  )[s];
}

export function situacaoColor(s: SituacaoTitulo): string {
  return (
    {
      PENDENTE: 'var(--warning-base)',
      VALIDADO: 'var(--success-base)',
      REJEITADO: 'var(--danger-base)',
      EM_CARTEIRA: 'var(--gci-base)',
      BAIXA_PARCIAL: 'var(--agro-base)',
    } as const
  )[s];
}

export function statusTituloLabel(s: StatusTitulo): string {
  return (
    {
      VINCENDO: 'Vincendo',
      VENCIDO: 'Vencido',
      BAIXA_PARCIAL: 'Baixa Parcial',
      LIQUIDADO: 'Liquidado',
    } as const
  )[s];
}

export function statusTituloColor(s: StatusTitulo): string {
  return (
    {
      VINCENDO: 'var(--warning-base)',
      VENCIDO: 'var(--danger-base)',
      BAIXA_PARCIAL: 'var(--agro-base)',
      LIQUIDADO: 'var(--success-base)',
    } as const
  )[s];
}

export function statusRegistroLabel(s: StatusRegistro): string {
  return ({ REGISTRADO: 'Registrado', PENDENTE: 'Pendente', REJEITADO: 'Rejeitado' } as const)[s];
}

export function statusEntregaLabel(s: StatusEntrega): string {
  return ({ PER: 'PER', FUT: 'FUT', ENTREGUE: 'Entregue' } as const)[s];
}

export function statusConfirmacaoLabel(s: StatusConfirmacao): string {
  return ({ CONFIRMADO: 'Confirmado', PENDENTE: 'Pendente', REJEITADO: 'Rejeitado' } as const)[s];
}

export function statusNotificacaoLabel(s: StatusNotificacao): string {
  return (
    {
      NOTIFICADO: 'Notificado',
      PENDENTE: 'Pendente',
      NAO_NOTIFICADO: 'Não Notificado',
    } as const
  )[s];
}

function parseDateBR(d: string): number {
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

export function countActiveFilters(f: AtivosFilters): number {
  let n = 0;
  if (f.lastro) n++;
  if (f.numeroContrato) n++;
  if (f.veiculoIds.length) n++;
  if (f.grupoIds.length) n++;
  if (f.situacao) n++;
  if (f.statusTitulo) n++;
  if (f.gerente) n++;
  if (f.cessao) n++;
  if (f.dataEntradaIni) n++;
  if (f.dataEntradaFim) n++;
  if (f.dataVencimentoIni) n++;
  if (f.dataVencimentoFim) n++;
  return n;
}

export function filterTitulos(titulos: TituloAtivoGlobal[], f: AtivosFilters): TituloAtivoGlobal[] {
  return titulos.filter((t) => {
    if (f.lastro && !t.lastro.toLowerCase().includes(f.lastro.toLowerCase())) return false;
    if (f.numeroContrato && !t.contratoNumero.toLowerCase().includes(f.numeroContrato.toLowerCase())) return false;
    if (f.veiculoIds.length && !f.veiculoIds.includes(t.veiculoId)) return false;
    if (f.grupoIds.length && !f.grupoIds.includes(t.grupoEmpresarialId)) return false;
    if (f.situacao && t.situacao !== f.situacao) return false;
    if (f.statusTitulo && t.statusTitulo !== f.statusTitulo) return false;
    if (f.gerente && !t.gerente.toLowerCase().includes(f.gerente.toLowerCase())) return false;
    if (f.cessao && !t.cessao.toLowerCase().includes(f.cessao.toLowerCase())) return false;
    if (f.dataEntradaIni) {
      const t0 = parseDateBR(t.dataEntrada);
      if (Number.isNaN(t0) || t0 < new Date(f.dataEntradaIni).getTime()) return false;
    }
    if (f.dataEntradaFim) {
      const t0 = parseDateBR(t.dataEntrada);
      if (Number.isNaN(t0) || t0 > new Date(f.dataEntradaFim).getTime()) return false;
    }
    if (f.dataVencimentoIni) {
      const t0 = parseDateBR(t.vencimento);
      if (Number.isNaN(t0) || t0 < new Date(f.dataVencimentoIni).getTime()) return false;
    }
    if (f.dataVencimentoFim) {
      const t0 = parseDateBR(t.vencimento);
      if (Number.isNaN(t0) || t0 > new Date(f.dataVencimentoFim).getTime()) return false;
    }
    return true;
  });
}

export function filterContratos(
  contratos: ContratoAtivoGlobal[],
  titulos: TituloAtivoGlobal[],
  f: AtivosFilters,
): ContratoAtivoGlobal[] {
  const matchingTituloIds = new Set(filterTitulos(titulos, f).map((t) => t.id));
  const hasTituloFilters =
    !!f.lastro ||
    !!f.situacao ||
    !!f.statusTitulo ||
    !!f.gerente ||
    !!f.cessao ||
    !!f.dataEntradaIni ||
    !!f.dataEntradaFim ||
    !!f.dataVencimentoIni ||
    !!f.dataVencimentoFim;

  return contratos.filter((c) => {
    if (f.numeroContrato && !c.numero.toLowerCase().includes(f.numeroContrato.toLowerCase())) return false;
    if (f.veiculoIds.length && !f.veiculoIds.includes(c.veiculoId)) return false;
    if (f.grupoIds.length && !f.grupoIds.includes(c.grupoEmpresarialId)) return false;
    if (hasTituloFilters || f.lastro) {
      if (!c.tituloIds.some((id) => matchingTituloIds.has(id))) return false;
    }
    return true;
  });
}

export interface KpiBucket {
  label: string;
  valor: number;
  qtd: number;
  tone: { bg: string; fg: string };
}

export function computeKpis(titulos: TituloAtivoGlobal[]): KpiBucket[] {
  const buckets: { key: SituacaoTitulo; label: string; tone: { bg: string; fg: string } }[] = [
    { key: 'PENDENTE', label: 'Títulos Pendentes', tone: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' } },
    { key: 'VALIDADO', label: 'Títulos Validados', tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
    { key: 'REJEITADO', label: 'Títulos Rejeitados', tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
    { key: 'EM_CARTEIRA', label: 'Títulos Carteira', tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  ];
  return buckets.map((b) => {
    const items = titulos.filter((t) => t.situacao === b.key);
    return {
      label: b.label,
      valor: items.reduce((acc, t) => acc + t.valorNominal, 0),
      qtd: items.length,
      tone: b.tone,
    };
  });
}

export const VEICULOS_OPTS = [
  { id: 'v-fidc-agro', nome: 'FIDC Agro Brasil' },
  { id: 'v-fidc-log', nome: 'FIDC Logística' },
  { id: 'v-cra-mono', nome: "CRA Safra 2025" },
  { id: 'v-cra-multi', nome: 'CRA Multi Produtor' },
];

export const GRUPOS_OPTS = [
  { id: 'g-agro', nome: 'Grupo Agro Industrial' },
  { id: 'g-alimentos', nome: 'Grupo Alimentos S.A.' },
  { id: 'g-pecuaria', nome: 'Grupo Pecuária Norte' },
  { id: 'g-graos', nome: 'Grupo Grãos Centro' },
];

export const GERENTES_OPTS = [
  'Ana Paula Costa',
  'Bruno Mendes',
  'Carla Ribeiro',
  'Diego Souza',
];

function t(
  partial: Omit<TituloAtivoGlobal, never>,
): TituloAtivoGlobal {
  return partial;
}

export const TITULOS_SEED: TituloAtivoGlobal[] = [
  t({
    id: 't1',
    contratoId: 'c1',
    contratoNumero: 'CT-50342',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '15/08/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'NF-8821',
    numero: '50342-1',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Agro Norte Ltda',
    cedenteDocumento: '12.345.678/0001-90',
    sacadoNome: 'Distribuidora Centro',
    sacadoDocumento: '98.765.432/0001-10',
    gerente: 'Ana Paula Costa',
    chaveNotaFiscal: '35250712345678000190550010000088211000088211',
    situacao: 'PENDENTE',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'NFe',
    dataCriacao: '01/07/2025',
    dataEmissao: '01/07/2025',
    valorNominal: 125000,
    valorEmissao: 125000,
    valorAquisicao: 118750,
    valorPresente: 120200,
    valorAberto: 125000,
    valorVencido: 0,
    vencimento: '30/09/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-agro',
    grupoEmpresarial: 'Grupo Agro Industrial',
    dataEntrada: '02/07/2025',
  }),
  t({
    id: 't2',
    contratoId: 'c1',
    contratoNumero: 'CT-50342',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '10/08/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'NF-8822',
    numero: '50342-2',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Agro Norte Ltda',
    cedenteDocumento: '12.345.678/0001-90',
    sacadoNome: 'Distribuidora Centro',
    sacadoDocumento: '98.765.432/0001-10',
    gerente: 'Ana Paula Costa',
    chaveNotaFiscal: '35250712345678000190550010000088221000088221',
    situacao: 'VALIDADO',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: 1.85,
    indicadorTaxa: 'CDI',
    percentualIndicador: 100,
    tipoAtivo: 'NFe',
    dataCriacao: '01/07/2025',
    dataEmissao: '01/07/2025',
    valorNominal: 98000,
    valorEmissao: 98000,
    valorAquisicao: 93100,
    valorPresente: 94500,
    valorAberto: 98000,
    valorVencido: 0,
    vencimento: '15/10/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-agro',
    grupoEmpresarial: 'Grupo Agro Industrial',
    dataEntrada: '02/07/2025',
  }),
  t({
    id: 't3',
    contratoId: 'c1',
    contratoNumero: 'CT-50342',
    statusRegistro: 'PENDENTE',
    statusEntrega: 'FUT',
    statusConfirmacao: 'REJEITADO',
    prazoConfirmacao: '05/07/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'NF-8823',
    numero: '50342-3',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Agro Norte Ltda',
    cedenteDocumento: '12.345.678/0001-90',
    sacadoNome: 'Mercado Sul S.A.',
    sacadoDocumento: '11.222.333/0001-44',
    gerente: 'Ana Paula Costa',
    chaveNotaFiscal: '35250712345678000190550010000088231000088231',
    situacao: 'REJEITADO',
    statusTitulo: 'VENCIDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'NFe',
    dataCriacao: '15/06/2025',
    dataEmissao: '15/06/2025',
    valorNominal: 45000,
    valorEmissao: 45000,
    valorAquisicao: 42750,
    valorPresente: 45000,
    valorAberto: 45000,
    valorVencido: 45000,
    vencimento: '15/07/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-agro',
    grupoEmpresarial: 'Grupo Agro Industrial',
    dataEntrada: '16/06/2025',
  }),
  t({
    id: 't4',
    contratoId: 'c2',
    contratoNumero: 'CT-48201',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '20/06/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'CPR-1102',
    numero: '48201-1',
    veiculoId: 'v-cra-mono',
    veiculoNome: 'CRA Safra 2025',
    cedenteNome: 'Fazenda Boa Vista',
    cedenteDocumento: '22.333.444/0001-55',
    sacadoNome: 'Trading Grãos Ltda',
    sacadoDocumento: '55.666.777/0001-88',
    gerente: 'Bruno Mendes',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'VINCENDO',
    cessao: 'CES-2025-0142',
    dataCessao: '22/06/2025',
    taxaCessao: 1.72,
    taxaEfetiva: 1.68,
    indicadorTaxa: 'CDI',
    percentualIndicador: 98,
    tipoAtivo: 'CPR',
    dataCriacao: '18/06/2025',
    dataEmissao: '18/06/2025',
    valorNominal: 350000,
    valorEmissao: 350000,
    valorAquisicao: 332500,
    valorPresente: 340100,
    valorAberto: 350000,
    valorVencido: 0,
    vencimento: '18/12/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-graos',
    grupoEmpresarial: 'Grupo Grãos Centro',
    dataEntrada: '20/06/2025',
  }),
  t({
    id: 't5',
    contratoId: 'c2',
    contratoNumero: 'CT-48201',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '20/06/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'CPR-1103',
    numero: '48201-2',
    veiculoId: 'v-cra-mono',
    veiculoNome: 'CRA Safra 2025',
    cedenteNome: 'Fazenda Boa Vista',
    cedenteDocumento: '22.333.444/0001-55',
    sacadoNome: 'Trading Grãos Ltda',
    sacadoDocumento: '55.666.777/0001-88',
    gerente: 'Bruno Mendes',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'BAIXA_PARCIAL',
    cessao: 'CES-2025-0142',
    dataCessao: '22/06/2025',
    taxaCessao: 1.72,
    taxaEfetiva: 1.68,
    indicadorTaxa: 'CDI',
    percentualIndicador: 98,
    tipoAtivo: 'CPR',
    dataCriacao: '18/06/2025',
    dataEmissao: '18/06/2025',
    valorNominal: 280000,
    valorEmissao: 280000,
    valorAquisicao: 266000,
    valorPresente: 210000,
    valorAberto: 140000,
    valorVencido: 0,
    vencimento: '18/11/2025',
    ultimoPagamento: '18/07/2025',
    grupoEmpresarialId: 'g-graos',
    grupoEmpresarial: 'Grupo Grãos Centro',
    dataEntrada: '20/06/2025',
  }),
  t({
    id: 't6',
    contratoId: 'c3',
    contratoNumero: 'CT-47100',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '01/07/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'CDCA-441',
    numero: '47100-1',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Logística Express',
    cedenteDocumento: '33.444.555/0001-66',
    sacadoNome: 'Retail Brasil S.A.',
    sacadoDocumento: '77.888.999/0001-00',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'VALIDADO',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: 2.1,
    indicadorTaxa: 'Pré',
    percentualIndicador: null,
    tipoAtivo: 'CDCA',
    dataCriacao: '25/06/2025',
    dataEmissao: '25/06/2025',
    valorNominal: 210000,
    valorEmissao: 210000,
    valorAquisicao: 199500,
    valorPresente: 204000,
    valorAberto: 210000,
    valorVencido: 0,
    vencimento: '25/10/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '26/06/2025',
  }),
  t({
    id: 't7',
    contratoId: 'c3',
    contratoNumero: 'CT-47100',
    statusRegistro: 'PENDENTE',
    statusEntrega: 'FUT',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '30/08/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'CDCA-442',
    numero: '47100-2',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Logística Express',
    cedenteDocumento: '33.444.555/0001-66',
    sacadoNome: 'Retail Brasil S.A.',
    sacadoDocumento: '77.888.999/0001-00',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'PENDENTE',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'CDCA',
    dataCriacao: '25/06/2025',
    dataEmissao: '25/06/2025',
    valorNominal: 95000,
    valorEmissao: 95000,
    valorAquisicao: 90250,
    valorPresente: 92000,
    valorAberto: 95000,
    valorVencido: 0,
    vencimento: '25/11/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '26/06/2025',
  }),
  t({
    id: 't8',
    contratoId: 'c4',
    contratoNumero: 'CT-46088',
    statusRegistro: 'REJEITADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'REJEITADO',
    prazoConfirmacao: '10/06/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'CCB-901',
    numero: '46088-1',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Pecuária Norte SA',
    cedenteDocumento: '44.555.666/0001-77',
    sacadoNome: 'Frigorífico Vale',
    sacadoDocumento: '88.999.000/0001-11',
    gerente: 'Diego Souza',
    chaveNotaFiscal: '—',
    situacao: 'REJEITADO',
    statusTitulo: 'VENCIDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'CCB',
    dataCriacao: '01/06/2025',
    dataEmissao: '01/06/2025',
    valorNominal: 175000,
    valorEmissao: 175000,
    valorAquisicao: 166250,
    valorPresente: 175000,
    valorAberto: 175000,
    valorVencido: 175000,
    vencimento: '01/07/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-pecuaria',
    grupoEmpresarial: 'Grupo Pecuária Norte',
    dataEntrada: '02/06/2025',
  }),
  t({
    id: 't9',
    contratoId: 'c5',
    contratoNumero: 'CT-45501',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '05/05/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'CPRF-220',
    numero: '45501-1',
    veiculoId: 'v-cra-multi',
    veiculoNome: 'CRA Multi Produtor',
    cedenteNome: 'Cooperativa Centro Oeste',
    cedenteDocumento: '10.203.040/0001-50',
    sacadoNome: 'Exportadora Sul',
    sacadoDocumento: '50.607.080/0001-90',
    gerente: 'Bruno Mendes',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'LIQUIDADO',
    cessao: 'CES-2025-0098',
    dataCessao: '08/05/2025',
    taxaCessao: 1.55,
    taxaEfetiva: 1.5,
    indicadorTaxa: 'CDI',
    percentualIndicador: 95,
    tipoAtivo: 'CPRF',
    dataCriacao: '01/05/2025',
    dataEmissao: '01/05/2025',
    valorNominal: 420000,
    valorEmissao: 420000,
    valorAquisicao: 399000,
    valorPresente: 0,
    valorAberto: 0,
    valorVencido: 0,
    vencimento: '01/08/2025',
    ultimoPagamento: '01/08/2025',
    grupoEmpresarialId: 'g-graos',
    grupoEmpresarial: 'Grupo Grãos Centro',
    dataEntrada: '03/05/2025',
  }),
  t({
    id: 't10',
    contratoId: 'c5',
    contratoNumero: 'CT-45501',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '05/05/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'CPRF-221',
    numero: '45501-2',
    veiculoId: 'v-cra-multi',
    veiculoNome: 'CRA Multi Produtor',
    cedenteNome: 'Cooperativa Centro Oeste',
    cedenteDocumento: '10.203.040/0001-50',
    sacadoNome: 'Exportadora Sul',
    sacadoDocumento: '50.607.080/0001-90',
    gerente: 'Bruno Mendes',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'VINCENDO',
    cessao: 'CES-2025-0098',
    dataCessao: '08/05/2025',
    taxaCessao: 1.55,
    taxaEfetiva: 1.5,
    indicadorTaxa: 'CDI',
    percentualIndicador: 95,
    tipoAtivo: 'CPRF',
    dataCriacao: '01/05/2025',
    dataEmissao: '01/05/2025',
    valorNominal: 310000,
    valorEmissao: 310000,
    valorAquisicao: 294500,
    valorPresente: 301000,
    valorAberto: 310000,
    valorVencido: 0,
    vencimento: '01/11/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-graos',
    grupoEmpresarial: 'Grupo Grãos Centro',
    dataEntrada: '03/05/2025',
  }),
  t({
    id: 't11',
    contratoId: 'c6',
    contratoNumero: 'CT-44920',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '20/08/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'NC-330',
    numero: '44920-1',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Alimentos Premium',
    cedenteDocumento: '60.701.802/0001-30',
    sacadoNome: 'Rede Supermercados XYZ',
    sacadoDocumento: '90.801.702/0001-40',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'PENDENTE',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'NC',
    dataCriacao: '10/07/2025',
    dataEmissao: '10/07/2025',
    valorNominal: 88000,
    valorEmissao: 88000,
    valorAquisicao: 83600,
    valorPresente: 85000,
    valorAberto: 88000,
    valorVencido: 0,
    vencimento: '10/10/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '11/07/2025',
  }),
  t({
    id: 't12',
    contratoId: 'c7',
    contratoNumero: 'CT-44011',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '12/07/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'NP-501',
    numero: '44011-1',
    veiculoId: 'v-cra-mono',
    veiculoNome: 'CRA Safra 2025',
    cedenteNome: 'Agro Norte Ltda',
    cedenteDocumento: '12.345.678/0001-90',
    sacadoNome: 'Trading Grãos Ltda',
    sacadoDocumento: '55.666.777/0001-88',
    gerente: 'Ana Paula Costa',
    chaveNotaFiscal: '—',
    situacao: 'BAIXA_PARCIAL',
    statusTitulo: 'BAIXA_PARCIAL',
    cessao: 'CES-2025-0155',
    dataCessao: '14/07/2025',
    taxaCessao: 1.9,
    taxaEfetiva: 1.82,
    indicadorTaxa: 'CDI',
    percentualIndicador: 100,
    tipoAtivo: 'NP',
    dataCriacao: '08/07/2025',
    dataEmissao: '08/07/2025',
    valorNominal: 150000,
    valorEmissao: 150000,
    valorAquisicao: 142500,
    valorPresente: 75000,
    valorAberto: 75000,
    valorVencido: 0,
    vencimento: '08/10/2025',
    ultimoPagamento: '08/08/2025',
    grupoEmpresarialId: 'g-agro',
    grupoEmpresarial: 'Grupo Agro Industrial',
    dataEntrada: '09/07/2025',
  }),
  t({
    id: 't13',
    contratoId: 'c8',
    contratoNumero: 'CT-43800',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '01/08/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'NF-9100',
    numero: '43800-1',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Pecuária Norte SA',
    cedenteDocumento: '44.555.666/0001-77',
    sacadoNome: 'Frigorífico Vale',
    sacadoDocumento: '88.999.000/0001-11',
    gerente: 'Diego Souza',
    chaveNotaFiscal: '35250744555666000177550010000091001000091001',
    situacao: 'VALIDADO',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: 1.95,
    indicadorTaxa: 'Pré',
    percentualIndicador: null,
    tipoAtivo: 'NFe',
    dataCriacao: '20/07/2025',
    dataEmissao: '20/07/2025',
    valorNominal: 67000,
    valorEmissao: 67000,
    valorAquisicao: 63650,
    valorPresente: 65000,
    valorAberto: 67000,
    valorVencido: 0,
    vencimento: '20/09/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-pecuaria',
    grupoEmpresarial: 'Grupo Pecuária Norte',
    dataEntrada: '21/07/2025',
  }),
  t({
    id: 't14',
    contratoId: 'c8',
    contratoNumero: 'CT-43800',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '25/08/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'NF-9101',
    numero: '43800-2',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Pecuária Norte SA',
    cedenteDocumento: '44.555.666/0001-77',
    sacadoNome: 'Frigorífico Vale',
    sacadoDocumento: '88.999.000/0001-11',
    gerente: 'Diego Souza',
    chaveNotaFiscal: '35250744555666000177550010000091011000091011',
    situacao: 'PENDENTE',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'NFe',
    dataCriacao: '20/07/2025',
    dataEmissao: '20/07/2025',
    valorNominal: 54000,
    valorEmissao: 54000,
    valorAquisicao: 51300,
    valorPresente: 52500,
    valorAberto: 54000,
    valorVencido: 0,
    vencimento: '20/10/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-pecuaria',
    grupoEmpresarial: 'Grupo Pecuária Norte',
    dataEntrada: '21/07/2025',
  }),
  t({
    id: 't15',
    contratoId: 'c9',
    contratoNumero: 'CT-43050',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '15/04/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'CPR-880',
    numero: '43050-1',
    veiculoId: 'v-cra-multi',
    veiculoNome: 'CRA Multi Produtor',
    cedenteNome: 'Fazenda Boa Vista',
    cedenteDocumento: '22.333.444/0001-55',
    sacadoNome: 'Exportadora Sul',
    sacadoDocumento: '50.607.080/0001-90',
    gerente: 'Bruno Mendes',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'VENCIDO',
    cessao: 'CES-2025-0071',
    dataCessao: '18/04/2025',
    taxaCessao: 1.6,
    taxaEfetiva: 1.55,
    indicadorTaxa: 'CDI',
    percentualIndicador: 97,
    tipoAtivo: 'CPR',
    dataCriacao: '10/04/2025',
    dataEmissao: '10/04/2025',
    valorNominal: 195000,
    valorEmissao: 195000,
    valorAquisicao: 185250,
    valorPresente: 195000,
    valorAberto: 195000,
    valorVencido: 195000,
    vencimento: '10/07/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-graos',
    grupoEmpresarial: 'Grupo Grãos Centro',
    dataEntrada: '12/04/2025',
  }),
  t({
    id: 't16',
    contratoId: 'c10',
    contratoNumero: 'CT-42500',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'FUT',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '30/07/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'CDCA-500',
    numero: '42500-1',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Alimentos Premium',
    cedenteDocumento: '60.701.802/0001-30',
    sacadoNome: 'Rede Supermercados XYZ',
    sacadoDocumento: '90.801.702/0001-40',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'VALIDADO',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: 2.0,
    indicadorTaxa: 'Pré',
    percentualIndicador: null,
    tipoAtivo: 'CDCA',
    dataCriacao: '15/07/2025',
    dataEmissao: '15/07/2025',
    valorNominal: 132000,
    valorEmissao: 132000,
    valorAquisicao: 125400,
    valorPresente: 128000,
    valorAberto: 132000,
    valorVencido: 0,
    vencimento: '15/12/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '16/07/2025',
  }),
  t({
    id: 't17',
    contratoId: 'c10',
    contratoNumero: 'CT-42500',
    statusRegistro: 'PENDENTE',
    statusEntrega: 'FUT',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '30/09/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'CDCA-501',
    numero: '42500-2',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Alimentos Premium',
    cedenteDocumento: '60.701.802/0001-30',
    sacadoNome: 'Rede Supermercados XYZ',
    sacadoDocumento: '90.801.702/0001-40',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'REJEITADO',
    statusTitulo: 'VENCIDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'CDCA',
    dataCriacao: '15/07/2025',
    dataEmissao: '15/07/2025',
    valorNominal: 48000,
    valorEmissao: 48000,
    valorAquisicao: 45600,
    valorPresente: 48000,
    valorAberto: 48000,
    valorVencido: 48000,
    vencimento: '01/07/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '16/07/2025',
  }),
  t({
    id: 't18',
    contratoId: 'c6',
    contratoNumero: 'CT-44920',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'PER',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '20/08/2025',
    statusNotificacao: 'PENDENTE',
    lastro: 'NC-331',
    numero: '44920-2',
    veiculoId: 'v-fidc-log',
    veiculoNome: 'FIDC Logística',
    cedenteNome: 'Alimentos Premium',
    cedenteDocumento: '60.701.802/0001-30',
    sacadoNome: 'Rede Supermercados XYZ',
    sacadoDocumento: '90.801.702/0001-40',
    gerente: 'Carla Ribeiro',
    chaveNotaFiscal: '—',
    situacao: 'VALIDADO',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: 1.88,
    indicadorTaxa: 'CDI',
    percentualIndicador: 100,
    tipoAtivo: 'NC',
    dataCriacao: '10/07/2025',
    dataEmissao: '10/07/2025',
    valorNominal: 72000,
    valorEmissao: 72000,
    valorAquisicao: 68400,
    valorPresente: 70000,
    valorAberto: 72000,
    valorVencido: 0,
    vencimento: '10/11/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-alimentos',
    grupoEmpresarial: 'Grupo Alimentos S.A.',
    dataEntrada: '11/07/2025',
  }),
  t({
    id: 't19',
    contratoId: 'c7',
    contratoNumero: 'CT-44011',
    statusRegistro: 'REGISTRADO',
    statusEntrega: 'ENTREGUE',
    statusConfirmacao: 'CONFIRMADO',
    prazoConfirmacao: '12/07/2025',
    statusNotificacao: 'NOTIFICADO',
    lastro: 'NP-502',
    numero: '44011-2',
    veiculoId: 'v-cra-mono',
    veiculoNome: 'CRA Safra 2025',
    cedenteNome: 'Agro Norte Ltda',
    cedenteDocumento: '12.345.678/0001-90',
    sacadoNome: 'Trading Grãos Ltda',
    sacadoDocumento: '55.666.777/0001-88',
    gerente: 'Ana Paula Costa',
    chaveNotaFiscal: '—',
    situacao: 'EM_CARTEIRA',
    statusTitulo: 'VINCENDO',
    cessao: 'CES-2025-0155',
    dataCessao: '14/07/2025',
    taxaCessao: 1.9,
    taxaEfetiva: 1.82,
    indicadorTaxa: 'CDI',
    percentualIndicador: 100,
    tipoAtivo: 'NP',
    dataCriacao: '08/07/2025',
    dataEmissao: '08/07/2025',
    valorNominal: 90000,
    valorEmissao: 90000,
    valorAquisicao: 85500,
    valorPresente: 88000,
    valorAberto: 90000,
    valorVencido: 0,
    vencimento: '08/12/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-agro',
    grupoEmpresarial: 'Grupo Agro Industrial',
    dataEntrada: '09/07/2025',
  }),
  t({
    id: 't20',
    contratoId: 'c4',
    contratoNumero: 'CT-46088',
    statusRegistro: 'PENDENTE',
    statusEntrega: 'FUT',
    statusConfirmacao: 'PENDENTE',
    prazoConfirmacao: '01/09/2025',
    statusNotificacao: 'NAO_NOTIFICADO',
    lastro: 'CCB-902',
    numero: '46088-2',
    veiculoId: 'v-fidc-agro',
    veiculoNome: 'FIDC Agro Brasil',
    cedenteNome: 'Pecuária Norte SA',
    cedenteDocumento: '44.555.666/0001-77',
    sacadoNome: 'Frigorífico Vale',
    sacadoDocumento: '88.999.000/0001-11',
    gerente: 'Diego Souza',
    chaveNotaFiscal: '—',
    situacao: 'PENDENTE',
    statusTitulo: 'VINCENDO',
    cessao: '—',
    dataCessao: null,
    taxaCessao: null,
    taxaEfetiva: null,
    indicadorTaxa: null,
    percentualIndicador: null,
    tipoAtivo: 'CCB',
    dataCriacao: '01/06/2025',
    dataEmissao: '01/06/2025',
    valorNominal: 110000,
    valorEmissao: 110000,
    valorAquisicao: 104500,
    valorPresente: 107000,
    valorAberto: 110000,
    valorVencido: 0,
    vencimento: '01/12/2025',
    ultimoPagamento: null,
    grupoEmpresarialId: 'g-pecuaria',
    grupoEmpresarial: 'Grupo Pecuária Norte',
    dataEntrada: '02/06/2025',
  }),
];

function buildContratos(): ContratoAtivoGlobal[] {
  const byContrato = new Map<string, TituloAtivoGlobal[]>();
  for (const titulo of TITULOS_SEED) {
    const list = byContrato.get(titulo.contratoId) ?? [];
    list.push(titulo);
    byContrato.set(titulo.contratoId, list);
  }

  const contratos: ContratoAtivoGlobal[] = [];
  for (const [id, titulos] of byContrato) {
    const first = titulos[0];
    contratos.push({
      id,
      numero: first.contratoNumero,
      qtdParcelas: titulos.length,
      tipoAtivo: first.tipoAtivo,
      veiculoId: first.veiculoId,
      veiculoNome: first.veiculoNome,
      grupoEmpresarialId: first.grupoEmpresarialId,
      grupoEmpresarial: first.grupoEmpresarial,
      valorNominal: titulos.reduce((a, x) => a + x.valorNominal, 0),
      valorEmissao: titulos.reduce((a, x) => a + x.valorEmissao, 0),
      valorAquisicao: titulos.reduce((a, x) => a + x.valorAquisicao, 0),
      valorPresente: titulos.reduce((a, x) => a + x.valorPresente, 0),
      valorAberto: titulos.reduce((a, x) => a + x.valorAberto, 0),
      cedenteNome: first.cedenteNome,
      cedenteDocumento: first.cedenteDocumento,
      sacadoNome: first.sacadoNome,
      sacadoDocumento: first.sacadoDocumento,
      dataPrimeiraEntrada: titulos
        .map((x) => x.dataEntrada)
        .sort((a, b) => parseDateBR(a) - parseDateBR(b))[0],
      ultimoVencimento: titulos
        .map((x) => x.vencimento)
        .sort((a, b) => parseDateBR(b) - parseDateBR(a))[0],
      tituloIds: titulos.map((x) => x.id),
    });
  }
  return contratos.sort((a, b) => a.numero.localeCompare(b.numero));
}

export const CONTRATOS_SEED: ContratoAtivoGlobal[] = buildContratos();

export function titulosDoContrato(
  contratoId: string,
  titulos: TituloAtivoGlobal[] = TITULOS_SEED,
): TituloAtivoGlobal[] {
  return titulos.filter((t) => t.contratoId === contratoId);
}
