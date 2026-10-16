import { reactive } from 'vue';

export type FamiliaVeiculo = 'fidc' | 'cra' | 'garantia';
export type TipoOperacao = 'CRA' | 'FIDC' | 'GARANTIA';
export type TipoCessao = 'Desembolso' | 'Desembolso parcial' | 'Integralização';
export type SituacaoCessao = 'aprovada' | 'nao-aprovada';
export type ConfirmacaoTitulo =
  | 'Pendente'
  | 'Pré-confirmado'
  | 'Não confirmado'
  | 'Confirmado'
  | 'Dispensado'
  | 'Aguardando confirmação';
export type NivelConfirmacao = 'nao-exige' | 'sem' | 'parcial' | 'confirmado';
export type NivelNotificacao = 'sem' | 'parcial' | 'notificado';
export type NivelDispensa = 'sem' | 'parcial' | 'dispensada';
export type NivelRisco = 'acima' | 'abaixo' | 'sem';
export type TipoCliente =
  | 'Normal'
  | 'Especial'
  | 'Recovery'
  | 'Terceiro'
  | 'Pré-recovery'
  | 'Special-sit'
  | 'Corporate'
  | 'Arroba-pec';
export type RegistroCartorio =
  | 'registrado'
  | 'nao-registrado'
  | 'em-analise'
  | 'aguardando-regularizacao'
  | 'aguardando-pagamento';
export type ToneKind = 'ok' | 'bad' | 'warn' | 'muted' | 'info';
export type FocoGerencial = '' | 'acima' | 'meta' | 'nao-confirmado' | 'inadimplencia';
export type FocoPos = '' | 'acima' | 'confirmacao' | 'registro' | 'inadimplencia' | 'alerta';

export interface Veiculo {
  id: string;
  nome: string;
  familia: FamiliaVeiculo;
  ativo: boolean;
}

export interface Titulo {
  id: string;
  lastro: string;
  numero: string;
  situacao: string;
  statusPagamento: string;
  confirmacao: ConfirmacaoTitulo;
  notificacao: string;
  criacao: string;
  vencimento: string;
  cedente: string;
  sacado: string;
  valorOriginal: number;
  valorAquisicao: number;
  valorPresente: number;
  valorAberto: number;
  taxaOp: number;
  registroCodigo: number;
  liquidado: boolean;
}

export interface Cessao {
  id: string;
  grupoId: string;
  nome: string;
  veiculoId: string;
  data: string;
  liquidada: boolean;
  titulosEmCarteira: boolean;
  tipoTitulo: string;
  tipoCessao: TipoCessao;
  situacao: SituacaoCessao;
  tipoOperacao: TipoOperacao;
  valorCessao: number;
  valorAberto: number;
  valorVencido: number;
  pctConfirmacaoEsperada: number | null;
  nivelConfirmacao: NivelConfirmacao;
  diasRestantes: number;
  temGarantia: boolean;
  descontoDuplicata: boolean;
  composicaoCodigo: 0 | 1 | 2 | 9;
  excedenteGarantia: number;
  registroCartorio: RegistroCartorio | null;
  registroB3: boolean;
  titulos: Titulo[];
}

export interface Grupo {
  id: string;
  nome: string;
  gerente: string | null;
  limite: number;
  risco: number;
  tipoCliente: TipoCliente;
  inadimplencia: number;
  pctNotifEsperada: number;
  pctConfirmacaoEsperada: number;
  temGarantia: boolean;
  composicaoAlerta: 0 | 1 | 2;
  composicaoTexto: string;
  registroAlerta: 0 | 1 | 2;
  registroTexto: string;
}

export interface TotaisTitulos {
  valorBase: number;
  valorConfirmados: number;
  pctConfirmados: number;
  valorPre: number;
  pctPre: number;
  valorNao: number;
  pctNao: number;
  valorDispensado: number;
  pctDispensado: number;
  valorNotificado: number;
  pctNotificado: number;
  valorRegistrado: number;
  pctRegistrado: number;
  nivelNotificacao: NivelNotificacao;
  nivelDispensa: NivelDispensa;
}

export interface GrupoVisao {
  grupo: Grupo;
  cessoes: Cessao[];
  totais: TotaisTitulos;
  valorCessao: number;
  acimaDoLimite: boolean;
  abaixoDaMeta: boolean;
}

export interface ClienteVisao {
  grupo: Grupo;
  cessoes: Cessao[];
  totais: TotaisTitulos;
  acimaDoLimite: boolean;
  alertaVermelho: boolean;
}

export interface RecorteGerencial {
  grupoNome: string;
  gerente: string;
  veiculoId: string;
  tipoOperacao: '' | TipoOperacao;
  dataInicial: string;
  dataFinal: string;
  busca: 'abertas' | 'liquidadas';
  nivelRisco: '' | NivelRisco;
  nivelConfirmacao: '' | NivelConfirmacao;
  nivelNotificacao: '' | NivelNotificacao;
  nivelDispensa: '' | NivelDispensa;
  situacao: 'todas' | SituacaoCessao;
}

export interface RecortePos {
  cliente: string;
  tipoCliente: '' | TipoCliente;
  nivelRisco: '' | NivelRisco;
  veiculoId: string;
  dataInicial: string;
  dataFinal: string;
  tipoCessao: '' | TipoCessao;
}

export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

export const PERMISSOES = {
  confirmarTitulo: true,
  escreverParametrizacao: true,
};

export const CONFIRMACAO_OPCOES: ConfirmacaoTitulo[] = [
  'Pendente',
  'Pré-confirmado',
  'Não confirmado',
  'Confirmado',
  'Dispensado',
  'Aguardando confirmação',
];

export const TIPO_CLIENTE_OPCOES: TipoCliente[] = [
  'Normal',
  'Especial',
  'Recovery',
  'Terceiro',
  'Pré-recovery',
  'Special-sit',
  'Corporate',
  'Arroba-pec',
];

export const TIPO_CESSAO_OPCOES: TipoCessao[] = ['Desembolso', 'Desembolso parcial', 'Integralização'];

export const NIVEL_RISCO_LABEL: Record<NivelRisco, string> = {
  acima: 'Acima do limite',
  abaixo: 'Abaixo ou igual o limite',
  sem: 'Sem risco',
};

export const NIVEL_CONFIRMACAO_LABEL: Record<NivelConfirmacao, string> = {
  'nao-exige': 'Não exige confirmação',
  sem: 'Sem confirmação',
  parcial: 'Parcialmente confirmado',
  confirmado: 'Confirmado',
};

export const NIVEL_NOTIFICACAO_LABEL: Record<NivelNotificacao, string> = {
  sem: 'Sem notificação',
  parcial: 'Parcialmente notificados',
  notificado: 'Notificados',
};

export const NIVEL_DISPENSA_LABEL: Record<NivelDispensa, string> = {
  sem: 'Cessões sem títulos dispensados',
  parcial: 'Cessões parcialmente dispensadas',
  dispensada: 'Cessões dispensadas',
};

export const CARTORIO_LABEL: Record<RegistroCartorio, string> = {
  registrado: 'Registrado',
  'nao-registrado': 'Não registrado',
  'em-analise': 'Em análise cartório',
  'aguardando-regularizacao': 'Aguardando regularização',
  'aguardando-pagamento': 'Aguardando pagamento',
};

export const FAMILIA_LABEL: Record<FamiliaVeiculo, string> = {
  fidc: 'FIDC',
  cra: 'CRA',
  garantia: 'Garantias',
};

export const RECORTE_GERENCIAL_INICIAL: RecorteGerencial = {
  grupoNome: '',
  gerente: '',
  veiculoId: '',
  tipoOperacao: '',
  dataInicial: '',
  dataFinal: '',
  busca: 'abertas',
  nivelRisco: '',
  nivelConfirmacao: '',
  nivelNotificacao: '',
  nivelDispensa: '',
  situacao: 'aprovada',
};

export const RECORTE_POS_INICIAL: RecortePos = {
  cliente: '',
  tipoCliente: '',
  nivelRisco: '',
  veiculoId: '',
  dataInicial: '',
  dataFinal: '',
  tipoCessao: '',
};

export function brl(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (Math.abs(n) >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function hojeIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function toneOf(kind: ToneKind): { bg: string; text: string } {
  if (kind === 'ok') return { bg: 'var(--status-success-bg)', text: 'var(--status-success-text)' };
  if (kind === 'bad') return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)' };
  if (kind === 'warn') return { bg: 'var(--status-warning-bg)', text: 'var(--status-warning-text)' };
  if (kind === 'info') return { bg: 'var(--gci-light)', text: 'var(--gci-base)' };
  return { bg: 'var(--status-neutral-bg)', text: 'var(--status-neutral-text)' };
}

export function nivelRiscoDe(grupo: Grupo): NivelRisco {
  if (grupo.risco <= 0) return 'sem';
  if (grupo.risco > grupo.limite) return 'acima';
  return 'abaixo';
}

export function corInadimplencia(valor: number): ToneKind {
  return valor > 0 ? 'bad' : 'ok';
}

export function corConfirmacao(realizado: number, meta: number | null, liquidada = false): ToneKind {
  if (liquidada) return 'muted';
  if (meta == null || realizado < meta) return 'bad';
  return 'ok';
}

export function corNaoConfirmado(pct: number, liquidada = false): ToneKind {
  if (liquidada) return 'muted';
  return pct > 0 ? 'bad' : 'ok';
}

export function corFaixa(pct: number): ToneKind {
  if (pct >= 85) return 'ok';
  if (pct >= 70) return 'warn';
  return 'bad';
}

export function corAlertaComposicao(codigo: number): ToneKind {
  if (codigo === 1) return 'ok';
  if (codigo === 2) return 'bad';
  return 'muted';
}

export function corAlertaRegistro(codigo: number): ToneKind {
  if (codigo === 1) return 'bad';
  if (codigo === 2) return 'ok';
  return 'muted';
}

export function corCartorio(status: RegistroCartorio): ToneKind {
  if (status === 'registrado') return 'ok';
  if (status === 'nao-registrado') return 'bad';
  return 'warn';
}

export function corRegistroTitulo(codigo: number): ToneKind {
  if (codigo === 3) return 'ok';
  if (codigo === 4 || codigo === 6) return 'bad';
  return 'muted';
}

export function nomeRegistroTitulo(codigo: number): string {
  if (codigo === 3) return 'Registrado';
  if (codigo === 4) return 'Recusado';
  if (codigo === 6) return 'Irregular';
  if (codigo === 1) return 'Em análise';
  if (codigo === 2) return 'Aguardando';
  if (codigo === 5) return 'Em cartório';
  return 'Pendente';
}

export function composicaoTexto(codigo: number): string {
  if (codigo === 0) return 'Sem garantia';
  if (codigo === 1) return 'Composto';
  if (codigo === 2) return 'Descomposto';
  return 'Sem informação';
}

const VAZIO_TOTAIS: TotaisTitulos = {
  valorBase: 0,
  valorConfirmados: 0,
  pctConfirmados: 0,
  valorPre: 0,
  pctPre: 0,
  valorNao: 0,
  pctNao: 0,
  valorDispensado: 0,
  pctDispensado: 0,
  valorNotificado: 0,
  pctNotificado: 0,
  valorRegistrado: 0,
  pctRegistrado: 0,
  nivelNotificacao: 'sem',
  nivelDispensa: 'sem',
};

function pct(parte: number, base: number): number {
  if (base <= 0) return 0;
  return (parte / base) * 100;
}

export function totaisTitulos(titulos: Titulo[]): TotaisTitulos {
  if (titulos.length === 0) return { ...VAZIO_TOTAIS };
  const valorBase = titulos.reduce((s, t) => s + t.valorOriginal, 0);
  const confirmados = titulos.filter((t) => t.confirmacao === 'Confirmado' || t.confirmacao === 'Dispensado' || t.liquidado);
  const pre = titulos.filter((t) => t.confirmacao === 'Pré-confirmado');
  const nao = titulos.filter((t) => t.confirmacao === 'Não confirmado');
  const disp = titulos.filter((t) => t.confirmacao === 'Dispensado');
  const notif = titulos.filter((t) => t.notificacao !== 'Sem notificação');
  const registrado = titulos.filter((t) => t.registroCodigo === 3);
  const valorConfirmados = confirmados.reduce((s, t) => s + t.valorOriginal, 0);
  const valorPre = pre.reduce((s, t) => s + t.valorOriginal, 0);
  const valorNao = nao.reduce((s, t) => s + t.valorOriginal, 0);
  const valorDispensado = disp.reduce((s, t) => s + t.valorOriginal, 0);
  const valorNotificado = notif.reduce((s, t) => s + t.valorOriginal, 0);
  const valorRegistrado = registrado.reduce((s, t) => s + t.valorOriginal, 0);
  return {
    valorBase,
    valorConfirmados,
    pctConfirmados: pct(valorConfirmados, valorBase),
    valorPre,
    pctPre: pct(valorPre, valorBase),
    valorNao,
    pctNao: pct(valorNao, valorBase),
    valorDispensado,
    pctDispensado: pct(valorDispensado, valorBase),
    valorNotificado,
    pctNotificado: pct(valorNotificado, valorBase),
    valorRegistrado,
    pctRegistrado: pct(valorRegistrado, valorBase),
    nivelNotificacao: notif.length === 0 ? 'sem' : notif.length === titulos.length ? 'notificado' : 'parcial',
    nivelDispensa: disp.length === 0 ? 'sem' : disp.length === titulos.length ? 'dispensada' : 'parcial',
  };
}

export function somarTotais(lista: TotaisTitulos[]): TotaisTitulos {
  if (lista.length === 0) return { ...VAZIO_TOTAIS };
  const acc = lista.reduce(
    (s, t) => ({
      valorBase: s.valorBase + t.valorBase,
      valorConfirmados: s.valorConfirmados + t.valorConfirmados,
      valorPre: s.valorPre + t.valorPre,
      valorNao: s.valorNao + t.valorNao,
      valorDispensado: s.valorDispensado + t.valorDispensado,
      valorNotificado: s.valorNotificado + t.valorNotificado,
      valorRegistrado: s.valorRegistrado + t.valorRegistrado,
    }),
    {
      valorBase: 0,
      valorConfirmados: 0,
      valorPre: 0,
      valorNao: 0,
      valorDispensado: 0,
      valorNotificado: 0,
      valorRegistrado: 0,
    },
  );
  return {
    ...acc,
    pctConfirmados: pct(acc.valorConfirmados, acc.valorBase),
    pctPre: pct(acc.valorPre, acc.valorBase),
    pctNao: pct(acc.valorNao, acc.valorBase),
    pctDispensado: pct(acc.valorDispensado, acc.valorBase),
    pctNotificado: pct(acc.valorNotificado, acc.valorBase),
    pctRegistrado: pct(acc.valorRegistrado, acc.valorBase),
    nivelNotificacao: 'sem',
    nivelDispensa: 'sem',
  };
}

const SACADOS = [
  'Moinho Serra Azul Ltda',
  'Cooperativa Vale Grãos',
  'Fazenda Boa Esperança',
  'Cerealista Horizonte',
  'Laticínios Bela Vista',
  'Trading Cerrado Sul',
];

interface TituloSeed {
  confirmacao: ConfirmacaoTitulo;
  valor: number;
  notificacao?: string;
  registro?: number;
  liquidado?: boolean;
  sacado?: string;
  situacao?: string;
  pagamento?: string;
  vencimento?: string;
  taxa?: number;
}

let seqTitulo = 0;

function pack(cessaoId: string, cedente: string, itens: TituloSeed[]): Titulo[] {
  return itens.map((item, i) => {
    seqTitulo += 1;
    const valor = item.valor;
    return {
      id: `${cessaoId}-t${i + 1}`,
      lastro: String(18000 + seqTitulo),
      numero: `NF-${5000 + seqTitulo}`,
      situacao: item.situacao ?? (item.liquidado ? 'Liquidado' : 'Em carteira'),
      statusPagamento: item.pagamento ?? (item.liquidado ? 'Pago' : 'Aberto'),
      confirmacao: item.confirmacao,
      notificacao: item.notificacao ?? 'Notificado',
      criacao: '2026-02-01',
      vencimento: item.vencimento ?? '2026-08-30',
      cedente,
      sacado: item.sacado ?? SACADOS[seqTitulo % SACADOS.length],
      valorOriginal: valor,
      valorAquisicao: Math.round(valor * 0.93),
      valorPresente: Math.round(valor * 0.97),
      valorAberto: item.liquidado ? 0 : Math.round(valor * 0.98),
      taxaOp: item.taxa ?? 1.85,
      registroCodigo: item.registro ?? 3,
      liquidado: item.liquidado ?? false,
    };
  });
}

const VEICULOS_SEED: Veiculo[] = [
  { id: 'v-ura', nome: 'URA AGRO', familia: 'fidc', ativo: true },
  { id: 'v-cerrado', nome: 'FIDC CERRADO', familia: 'fidc', ativo: false },
  { id: 'v-graos', nome: 'FIDC GRÃOS', familia: 'fidc', ativo: true },
  { id: 'v-ceres', nome: 'CRA CERES', familia: 'cra', ativo: true },
  { id: 'v-soja', nome: 'CRA SOJA', familia: 'cra', ativo: false },
  { id: 'v-cafe', nome: 'CRA CAFÉ', familia: 'cra', ativo: true },
  { id: 'v-estoque', nome: 'GARANTIA ESTOQUE', familia: 'garantia', ativo: true },
  { id: 'v-imovel', nome: 'GARANTIA IMÓVEL', familia: 'garantia', ativo: false },
];

const GRUPOS_SEED: Grupo[] = [
  {
    id: 'g1',
    nome: 'Agro Norte Alimentos',
    gerente: 'Ana Ribeiro',
    limite: 5_000_000,
    risco: 6_200_000,
    tipoCliente: 'Normal',
    inadimplencia: 180_000,
    pctNotifEsperada: 90,
    pctConfirmacaoEsperada: 80,
    temGarantia: true,
    composicaoAlerta: 2,
    composicaoTexto: 'Composição insuficiente',
    registroAlerta: 1,
    registroTexto: 'Registro irregular',
  },
  {
    id: 'g2',
    nome: 'Cereais do Sul',
    gerente: 'Carlos Menezes',
    limite: 8_000_000,
    risco: 3_100_000,
    tipoCliente: 'Especial',
    inadimplencia: 0,
    pctNotifEsperada: 85,
    pctConfirmacaoEsperada: 75,
    temGarantia: true,
    composicaoAlerta: 1,
    composicaoTexto: 'Composição regular',
    registroAlerta: 2,
    registroTexto: 'Registro regular',
  },
  {
    id: 'g3',
    nome: 'Pecuária Vale Verde',
    gerente: null,
    limite: 2_000_000,
    risco: 0,
    tipoCliente: 'Recovery',
    inadimplencia: 0,
    pctNotifEsperada: 70,
    pctConfirmacaoEsperada: 70,
    temGarantia: false,
    composicaoAlerta: 0,
    composicaoTexto: 'Sem composição',
    registroAlerta: 0,
    registroTexto: 'Sem registro',
  },
  {
    id: 'g4',
    nome: 'Grãos do Cerrado',
    gerente: 'Paula Nogueira',
    limite: 4_500_000,
    risco: 4_500_000,
    tipoCliente: 'Terceiro',
    inadimplencia: 42_000,
    pctNotifEsperada: 80,
    pctConfirmacaoEsperada: 85,
    temGarantia: true,
    composicaoAlerta: 0,
    composicaoTexto: 'Composição em análise',
    registroAlerta: 0,
    registroTexto: 'Registro em análise',
  },
  {
    id: 'g5',
    nome: 'Laticínios da Serra',
    gerente: 'Diego Alves',
    limite: 1_200_000,
    risco: 1_800_000,
    tipoCliente: 'Pré-recovery',
    inadimplencia: 95_000,
    pctNotifEsperada: 90,
    pctConfirmacaoEsperada: 80,
    temGarantia: true,
    composicaoAlerta: 2,
    composicaoTexto: 'Garantia descomposta',
    registroAlerta: 1,
    registroTexto: 'Cartório pendente',
  },
  {
    id: 'g6',
    nome: 'Sementes Atlas',
    gerente: 'Ana Ribeiro',
    limite: 10_000_000,
    risco: 2_400_000,
    tipoCliente: 'Special-sit',
    inadimplencia: 0,
    pctNotifEsperada: 75,
    pctConfirmacaoEsperada: 60,
    temGarantia: true,
    composicaoAlerta: 1,
    composicaoTexto: 'Composição ok',
    registroAlerta: 2,
    registroTexto: 'Registro ok',
  },
  {
    id: 'g7',
    nome: 'Frigorífico Horizonte',
    gerente: 'Carlos Menezes',
    limite: 3_000_000,
    risco: 900_000,
    tipoCliente: 'Corporate',
    inadimplencia: 310_000,
    pctNotifEsperada: 80,
    pctConfirmacaoEsperada: 80,
    temGarantia: false,
    composicaoAlerta: 0,
    composicaoTexto: 'Sem composição',
    registroAlerta: 0,
    registroTexto: 'Sem registro',
  },
  {
    id: 'g8',
    nome: 'Café Montanha',
    gerente: 'Paula Nogueira',
    limite: 7_000_000,
    risco: 7_000_000,
    tipoCliente: 'Arroba-pec',
    inadimplencia: 0,
    pctNotifEsperada: 95,
    pctConfirmacaoEsperada: 95,
    temGarantia: true,
    composicaoAlerta: 1,
    composicaoTexto: 'Composição acompanhada',
    registroAlerta: 2,
    registroTexto: 'Registro acompanhado',
  },
];

function cedenteDe(grupoId: string): string {
  return GRUPOS_SEED.find((g) => g.id === grupoId)?.nome ?? 'Cedente';
}

function cessao(
  base: Omit<Cessao, 'titulos'>,
  itens: TituloSeed[],
): Cessao {
  return { ...base, titulos: pack(base.id, cedenteDe(base.grupoId), itens) };
}

const CESSOES_SEED: Cessao[] = [
  cessao(
    {
      id: 'c1',
      grupoId: 'g1',
      nome: 'Cessão URA março',
      veiculoId: 'v-ura',
      data: '2026-03-02',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 570_000,
      valorAberto: 520_000,
      valorVencido: 150_000,
      pctConfirmacaoEsperada: 80,
      nivelConfirmacao: 'sem',
      diasRestantes: 12,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 2,
      excedenteGarantia: 40_000,
      registroCartorio: 'nao-registrado',
      registroB3: false,
    },
    [
      { confirmacao: 'Confirmado', valor: 120_000, registro: 4, sacado: 'Moinho Serra Azul Ltda' },
      { confirmacao: 'Não confirmado', valor: 150_000, notificacao: 'Sem notificação', registro: 6, vencimento: '2026-04-01', pagamento: 'Vencido' },
      { confirmacao: 'Não confirmado', valor: 150_000, notificacao: 'Sem notificação', registro: 6 },
      { confirmacao: 'Não confirmado', valor: 150_000, notificacao: 'Sem notificação', registro: 4 },
    ],
  ),
  cessao(
    {
      id: 'c2',
      grupoId: 'g1',
      nome: 'Cessão CERES maio',
      veiculoId: 'v-ceres',
      data: '2026-05-20',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'NP',
      tipoCessao: 'Integralização',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 580_000,
      valorAberto: 400_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 80,
      nivelConfirmacao: 'parcial',
      diasRestantes: 4,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 0,
      registroCartorio: 'em-analise',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Pré-confirmado', valor: 80_000, registro: 1 },
      { confirmacao: 'Não confirmado', valor: 100_000, registro: 2 },
    ],
  ),
  cessao(
    {
      id: 'c3',
      grupoId: 'g1',
      nome: 'Cessão CAFÉ 2025',
      veiculoId: 'v-cafe',
      data: '2025-11-12',
      liquidada: true,
      titulosEmCarteira: false,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 300_000,
      valorAberto: 0,
      valorVencido: 0,
      pctConfirmacaoEsperada: 70,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 0,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 0,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 150_000, liquidado: true },
      { confirmacao: 'Confirmado', valor: 150_000, liquidado: true },
    ],
  ),
  cessao(
    {
      id: 'c4',
      grupoId: 'g2',
      nome: 'Cessão GRÃOS janeiro',
      veiculoId: 'v-graos',
      data: '2026-01-15',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 640_000,
      valorAberto: 210_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 75,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 20,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 15_000,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Pré-confirmado', valor: 40_000, registro: 5 },
    ],
  ),
  cessao(
    {
      id: 'c5',
      grupoId: 'g2',
      nome: 'Cessão estoque julho',
      veiculoId: 'v-estoque',
      data: '2026-07-08',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CCB',
      tipoCessao: 'Desembolso parcial',
      situacao: 'aprovada',
      tipoOperacao: 'GARANTIA',
      valorCessao: 150_000,
      valorAberto: 90_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 70,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 30,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 8_000,
      registroCartorio: 'aguardando-pagamento',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 50_000 },
      { confirmacao: 'Confirmado', valor: 50_000 },
      { confirmacao: 'Dispensado', valor: 50_000, registro: 3 },
    ],
  ),
  cessao(
    {
      id: 'c6',
      grupoId: 'g2',
      nome: 'Cessão recusada SOJA',
      veiculoId: 'v-soja',
      data: '2026-02-10',
      liquidada: true,
      titulosEmCarteira: false,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'nao-aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 80_000,
      valorAberto: 0,
      valorVencido: 0,
      pctConfirmacaoEsperada: 70,
      nivelConfirmacao: 'sem',
      diasRestantes: 0,
      temGarantia: false,
      descontoDuplicata: false,
      composicaoCodigo: 0,
      excedenteGarantia: 0,
      registroCartorio: null,
      registroB3: false,
    },
    [{ confirmacao: 'Pendente', valor: 80_000, liquidado: true, notificacao: 'Sem notificação', registro: 0 }],
  ),
  cessao(
    {
      id: 'c7',
      grupoId: 'g3',
      nome: 'Cessão em análise',
      veiculoId: 'v-ura',
      data: '2026-04-18',
      liquidada: false,
      titulosEmCarteira: false,
      tipoTitulo: 'NP',
      tipoCessao: 'Desembolso',
      situacao: 'nao-aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 220_000,
      valorAberto: 220_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 70,
      nivelConfirmacao: 'sem',
      diasRestantes: 15,
      temGarantia: false,
      descontoDuplicata: false,
      composicaoCodigo: 0,
      excedenteGarantia: 0,
      registroCartorio: null,
      registroB3: false,
    },
    [
      { confirmacao: 'Pendente', valor: 110_000, notificacao: 'Sem notificação', registro: 0 },
      { confirmacao: 'Aguardando confirmação', valor: 110_000, notificacao: 'Sem notificação', registro: 0 },
    ],
  ),
  cessao(
    {
      id: 'c8',
      grupoId: 'g3',
      nome: 'Cessão pecuária aberta',
      veiculoId: 'v-graos',
      data: '2026-06-01',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 260_000,
      valorAberto: 260_000,
      valorVencido: 20_000,
      pctConfirmacaoEsperada: null,
      nivelConfirmacao: 'nao-exige',
      diasRestantes: 18,
      temGarantia: false,
      descontoDuplicata: false,
      composicaoCodigo: 0,
      excedenteGarantia: 0,
      registroCartorio: null,
      registroB3: false,
    },
    [
      { confirmacao: 'Pré-confirmado', valor: 130_000, notificacao: 'Sem notificação', registro: 0 },
      { confirmacao: 'Pendente', valor: 130_000, notificacao: 'Sem notificação', registro: 1 },
    ],
  ),
  cessao(
    {
      id: 'c9',
      grupoId: 'g4',
      nome: 'Cessão cerrado abril',
      veiculoId: 'v-ceres',
      data: '2026-04-09',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'Duplicata',
      tipoCessao: 'Desembolso parcial',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 400_000,
      valorAberto: 280_000,
      valorVencido: 40_000,
      pctConfirmacaoEsperada: 85,
      nivelConfirmacao: 'parcial',
      diasRestantes: 6,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 9,
      excedenteGarantia: 12_000,
      registroCartorio: 'aguardando-regularizacao',
      registroB3: false,
    },
    [
      { confirmacao: 'Confirmado', valor: 100_000 },
      { confirmacao: 'Dispensado', valor: 100_000, registro: 2 },
      { confirmacao: 'Não confirmado', valor: 100_000, notificacao: 'Sem notificação', registro: 4 },
      { confirmacao: 'Não confirmado', valor: 100_000, notificacao: 'Enviado', registro: 6 },
    ],
  ),
  cessao(
    {
      id: 'c10',
      grupoId: 'g5',
      nome: 'Cessão serra fevereiro',
      veiculoId: 'v-ura',
      data: '2026-02-20',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 480_000,
      valorAberto: 360_000,
      valorVencido: 95_000,
      pctConfirmacaoEsperada: 80,
      nivelConfirmacao: 'sem',
      diasRestantes: 2,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 2,
      excedenteGarantia: 70_000,
      registroCartorio: 'nao-registrado',
      registroB3: false,
    },
    [
      { confirmacao: 'Não confirmado', valor: 160_000, notificacao: 'Sem notificação', registro: 4, pagamento: 'Vencido', vencimento: '2026-03-01' },
      { confirmacao: 'Não confirmado', valor: 160_000, notificacao: 'Sem notificação', registro: 6 },
      { confirmacao: 'Pendente', valor: 160_000, notificacao: 'Sem notificação', registro: 0 },
    ],
  ),
  cessao(
    {
      id: 'c11',
      grupoId: 'g5',
      nome: 'Desconto duplicata serra',
      veiculoId: 'v-cafe',
      data: '2026-08-14',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'Duplicata',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 90_000,
      valorAberto: 90_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 80,
      nivelConfirmacao: 'parcial',
      diasRestantes: 9,
      temGarantia: true,
      descontoDuplicata: true,
      composicaoCodigo: 2,
      excedenteGarantia: 0,
      registroCartorio: 'em-analise',
      registroB3: false,
    },
    [
      { confirmacao: 'Confirmado', valor: 30_000, registro: 4 },
      { confirmacao: 'Não confirmado', valor: 60_000, notificacao: 'Enviado', registro: 6 },
    ],
  ),
  cessao(
    {
      id: 'c12',
      grupoId: 'g6',
      nome: 'Cessão sementes março',
      veiculoId: 'v-graos',
      data: '2026-03-28',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Integralização',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 900_000,
      valorAberto: 120_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 60,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 25,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 0,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 300_000 },
      { confirmacao: 'Confirmado', valor: 300_000 },
      { confirmacao: 'Confirmado', valor: 300_000 },
    ],
  ),
  cessao(
    {
      id: 'c13',
      grupoId: 'g6',
      nome: 'Cessão atlas dispensada',
      veiculoId: 'v-estoque',
      data: '2026-09-01',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CCB',
      tipoCessao: 'Desembolso parcial',
      situacao: 'aprovada',
      tipoOperacao: 'GARANTIA',
      valorCessao: 200_000,
      valorAberto: 200_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 60,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 40,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 5_000,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Dispensado', valor: 100_000 },
      { confirmacao: 'Dispensado', valor: 100_000 },
    ],
  ),
  cessao(
    {
      id: 'c14',
      grupoId: 'g7',
      nome: 'Cessão frigorífico',
      veiculoId: 'v-ura',
      data: '2026-05-05',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'NP',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'FIDC',
      valorCessao: 500_000,
      valorAberto: 410_000,
      valorVencido: 200_000,
      pctConfirmacaoEsperada: 80,
      nivelConfirmacao: 'parcial',
      diasRestantes: 3,
      temGarantia: false,
      descontoDuplicata: false,
      composicaoCodigo: 0,
      excedenteGarantia: 0,
      registroCartorio: null,
      registroB3: false,
    },
    [
      { confirmacao: 'Confirmado', valor: 200_000, registro: 3 },
      { confirmacao: 'Não confirmado', valor: 150_000, notificacao: 'Sem notificação', registro: 0, pagamento: 'Vencido' },
      { confirmacao: 'Pendente', valor: 150_000, notificacao: 'Enviado', registro: 1 },
    ],
  ),
  cessao(
    {
      id: 'c15',
      grupoId: 'g8',
      nome: 'Cessão café junho',
      veiculoId: 'v-cafe',
      data: '2026-06-22',
      liquidada: false,
      titulosEmCarteira: true,
      tipoTitulo: 'CPR',
      tipoCessao: 'Desembolso',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 750_000,
      valorAberto: 300_000,
      valorVencido: 0,
      pctConfirmacaoEsperada: 95,
      nivelConfirmacao: 'parcial',
      diasRestantes: 11,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 20_000,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Confirmado', valor: 200_000 },
      { confirmacao: 'Pré-confirmado', valor: 75_000, registro: 1 },
      { confirmacao: 'Não confirmado', valor: 75_000, notificacao: 'Enviado', registro: 2 },
    ],
  ),
  cessao(
    {
      id: 'c16',
      grupoId: 'g8',
      nome: 'Cessão café liquidada',
      veiculoId: 'v-ceres',
      data: '2025-12-02',
      liquidada: true,
      titulosEmCarteira: false,
      tipoTitulo: 'CPR',
      tipoCessao: 'Integralização',
      situacao: 'aprovada',
      tipoOperacao: 'CRA',
      valorCessao: 180_000,
      valorAberto: 0,
      valorVencido: 0,
      pctConfirmacaoEsperada: 90,
      nivelConfirmacao: 'confirmado',
      diasRestantes: 0,
      temGarantia: true,
      descontoDuplicata: false,
      composicaoCodigo: 1,
      excedenteGarantia: 0,
      registroCartorio: 'registrado',
      registroB3: true,
    },
    [
      { confirmacao: 'Confirmado', valor: 180_000, liquidado: true },
    ],
  ),
];

export const veiculos = reactive<Veiculo[]>(VEICULOS_SEED.map((v) => ({ ...v })));
export const grupos = reactive<Grupo[]>(GRUPOS_SEED.map((g) => ({ ...g })));
export const cessoes = reactive<Cessao[]>(CESSOES_SEED.map((c) => ({ ...c, titulos: c.titulos.map((t) => ({ ...t })) })));

export function veiculoPorId(id: string): Veiculo | undefined {
  return veiculos.find((v) => v.id === id);
}

export function veiculosAtivos(): Veiculo[] {
  return veiculos.filter((v) => v.ativo);
}

export function gerentes(): string[] {
  return [...new Set(grupos.map((g) => g.gerente).filter((g): g is string => !!g))];
}

export function grupoPorId(id: string): Grupo | undefined {
  return grupos.find((g) => g.id === id);
}

export function cessaoPorId(id: string): Cessao | undefined {
  return cessoes.find((c) => c.id === id);
}

function cessaoPassaGerencial(c: Cessao, recorte: RecorteGerencial): boolean {
  if (recorte.busca === 'abertas' && c.liquidada) return false;
  if (recorte.busca === 'liquidadas' && !c.liquidada) return false;
  if (recorte.situacao !== 'todas' && c.situacao !== recorte.situacao) return false;
  if (recorte.veiculoId && c.veiculoId !== recorte.veiculoId) return false;
  if (recorte.tipoOperacao && c.tipoOperacao !== recorte.tipoOperacao) return false;
  if (recorte.dataInicial && c.data < recorte.dataInicial) return false;
  if (recorte.dataFinal && c.data > recorte.dataFinal) return false;
  if (recorte.nivelConfirmacao && c.nivelConfirmacao !== recorte.nivelConfirmacao) return false;
  const tot = totaisTitulos(c.titulos);
  if (recorte.nivelNotificacao && tot.nivelNotificacao !== recorte.nivelNotificacao) return false;
  if (recorte.nivelDispensa && tot.nivelDispensa !== recorte.nivelDispensa) return false;
  return true;
}

function visaoGrupo(grupo: Grupo, lista: Cessao[]): GrupoVisao {
  const totais = somarTotais(lista.map((c) => totaisTitulos(c.titulos)));
  return {
    grupo,
    cessoes: lista,
    totais,
    valorCessao: lista.reduce((s, c) => s + c.valorCessao, 0),
    acimaDoLimite: grupo.risco > grupo.limite,
    abaixoDaMeta: totais.pctConfirmados < grupo.pctConfirmacaoEsperada,
  };
}

export function filtrarGerencial(recorte: RecorteGerencial): GrupoVisao[] {
  const nome = recorte.grupoNome.trim().toLowerCase();
  const doRecorte = cessoes.filter((c) => cessaoPassaGerencial(c, recorte));
  return grupos
    .filter((g) => {
      if (nome && !g.nome.toLowerCase().includes(nome)) return false;
      if (recorte.gerente && g.gerente !== recorte.gerente) return false;
      if (recorte.nivelRisco && nivelRiscoDe(g) !== recorte.nivelRisco) return false;
      return doRecorte.some((c) => c.grupoId === g.id);
    })
    .map((g) => visaoGrupo(g, doRecorte.filter((c) => c.grupoId === g.id)))
    .sort((a, b) => a.grupo.nome.localeCompare(b.grupo.nome, 'pt-BR'));
}

export function aplicarFocoGerencial(lista: GrupoVisao[], foco: FocoGerencial): GrupoVisao[] {
  if (foco === 'acima') return lista.filter((g) => g.acimaDoLimite);
  if (foco === 'meta') return lista.filter((g) => g.abaixoDaMeta);
  if (foco === 'nao-confirmado') return lista.filter((g) => g.totais.valorNao > 0);
  if (foco === 'inadimplencia') return lista.filter((g) => g.grupo.inadimplencia > 0);
  return lista;
}

function cessaoPassaPos(c: Cessao, recorte: RecortePos, incluirLiquidadas: boolean): boolean {
  if (!incluirLiquidadas && c.liquidada) return false;
  if (recorte.veiculoId && c.veiculoId !== recorte.veiculoId) return false;
  if (recorte.dataInicial && c.data < recorte.dataInicial) return false;
  if (recorte.dataFinal && c.data > recorte.dataFinal) return false;
  if (recorte.tipoCessao && c.tipoCessao !== recorte.tipoCessao) return false;
  return true;
}

export function filtrarPos(recorte: RecortePos): ClienteVisao[] {
  const nome = recorte.cliente.trim().toLowerCase();
  const doRecorte = cessoes.filter((c) => cessaoPassaPos(c, recorte, true));
  const temCorteCessao = !!(recorte.veiculoId || recorte.dataInicial || recorte.dataFinal || recorte.tipoCessao);
  return grupos
    .filter((g) => {
      if (nome && !g.nome.toLowerCase().includes(nome)) return false;
      if (recorte.tipoCliente && g.tipoCliente !== recorte.tipoCliente) return false;
      if (recorte.nivelRisco && nivelRiscoDe(g) !== recorte.nivelRisco) return false;
      if (temCorteCessao && !doRecorte.some((c) => c.grupoId === g.id)) return false;
      return true;
    })
    .map((g) => {
      const lista = doRecorte.filter((c) => c.grupoId === g.id);
      return {
        grupo: g,
        cessoes: lista,
        totais: somarTotais(lista.map((c) => totaisTitulos(c.titulos))),
        acimaDoLimite: g.risco > g.limite,
        alertaVermelho: g.temGarantia && (g.composicaoAlerta === 2 || g.registroAlerta === 1),
      };
    })
    .sort((a, b) => a.grupo.nome.localeCompare(b.grupo.nome, 'pt-BR'));
}

export function aplicarFocoPos(lista: ClienteVisao[], foco: FocoPos): ClienteVisao[] {
  if (foco === 'acima') return lista.filter((c) => c.acimaDoLimite);
  if (foco === 'confirmacao') return lista.filter((c) => c.totais.pctConfirmados < 70);
  if (foco === 'registro') return lista.filter((c) => c.totais.pctRegistrado < 70);
  if (foco === 'inadimplencia') return lista.filter((c) => c.grupo.inadimplencia > 0);
  if (foco === 'alerta') return lista.filter((c) => c.alertaVermelho);
  return lista;
}

export function cessoesDoCliente(grupoId: string, recorte: RecortePos, incluirLiquidadas: boolean): Cessao[] {
  return cessoes
    .filter((c) => c.grupoId === grupoId && cessaoPassaPos(c, recorte, incluirLiquidadas))
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function confirmarTitulos(cessaoId: string, tituloIds: string[], status: ConfirmacaoTitulo) {
  const cessao = cessoes.find((c) => c.id === cessaoId);
  if (!cessao) return;
  const ids = new Set(tituloIds);
  for (const titulo of cessao.titulos) {
    if (ids.has(titulo.id)) titulo.confirmacao = status;
  }
}

export function salvarVeiculos(familia: FamiliaVeiculo, ativos: Record<string, boolean>) {
  for (const veiculo of veiculos) {
    if (veiculo.familia === familia && veiculo.id in ativos) veiculo.ativo = ativos[veiculo.id];
  }
}

function csvCampo(valor: string | number): string {
  const s = String(valor ?? '');
  if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const csv = [header, ...rows].map((r) => r.map(csvCampo).join(';')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportarGerencial(lista: GrupoVisao[]) {
  downloadCsv(
    'relatorio-gerencial.csv',
    [
      'Grupo',
      'Gerente',
      'Limite',
      'Risco',
      'Inadimplência',
      'Confirmação realizada',
      'Confirmação esperada',
      'Não confirmado',
      '% não confirmado',
      'Valor cessão',
      'Notificação esperada',
      'Notificação realizada',
      'Pré-confirmado',
      'Dispensado',
      'Confirmados + liquidados + dispensados',
    ],
    lista.map((v) => [
      v.grupo.nome,
      v.grupo.gerente ?? '',
      v.grupo.limite,
      v.grupo.risco,
      v.grupo.inadimplencia,
      fmtPct(v.totais.pctConfirmados),
      fmtPct(v.grupo.pctConfirmacaoEsperada),
      v.totais.valorNao,
      fmtPct(v.totais.pctNao),
      v.valorCessao,
      fmtPct(v.grupo.pctNotifEsperada),
      fmtPct(v.totais.pctNotificado),
      v.totais.valorPre,
      v.totais.valorDispensado,
      v.totais.valorConfirmados,
    ]),
  );
}

export function exportarPos(lista: ClienteVisao[]) {
  downloadCsv(
    'relatorio-pos-desembolso.csv',
    ['Cliente', 'Tipo', 'Limite', 'Risco', 'Inadimplência', 'Confirmação', 'Valor confirmado', 'Registro', 'Valor registrado', 'Alerta composição', 'Alerta registro'],
    lista.map((v) => [
      v.grupo.nome,
      v.grupo.tipoCliente,
      v.grupo.limite,
      v.grupo.risco,
      v.grupo.inadimplencia,
      fmtPct(v.totais.pctConfirmados),
      v.totais.valorConfirmados,
      fmtPct(v.totais.pctRegistrado),
      v.totais.valorRegistrado,
      v.grupo.temGarantia ? v.grupo.composicaoTexto : 'Sem garantia',
      v.grupo.temGarantia ? v.grupo.registroTexto : 'Sem garantia',
    ]),
  );
}

export function datasValidas(inicial: string, final: string, finalNaoFutura = false): string | null {
  if (inicial && final && final < inicial) return 'A data final não pode ser anterior à inicial.';
  if (finalNaoFutura && final && final > hojeIso()) return 'A data final não pode ser futura.';
  if (finalNaoFutura && inicial && final && inicial > final) return 'A data inicial não pode ser posterior à final.';
  return null;
}
