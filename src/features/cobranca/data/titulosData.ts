export type VeiculoTipo = 'CRA' | 'FIDC';

export type SituacaoTitulo = 'EM_CARTEIRA' | 'PENDENTE' | 'BAIXA_PARCIAL' | 'VALIDADO';
export type StatusPagamento = 'LIQUIDADO' | 'PAGO_PARCIAL' | 'VINCENDO' | 'VENCIDO';
export type StatusNotificacao = 'NOTIFICADO' | 'PENDENTE' | 'NAO_NOTIFICADO';
export type StatusConfirmacao = 'CONFIRMADO' | 'PENDENTE' | 'REJEITADO';

export interface Titulo {
  id: string;
  numero: string;
  lastro: string;
  veiculoTipo: VeiculoTipo;
  veiculoNome: string;
  veiculoId: string;
  tipo: string;
  cedente: string;
  cedenteCnpj: string;
  sacado: string;
  sacadoCnpj: string;
  gerente: string;
  emissao: string;
  vencimento: string;
  vrNominal: number;
  vrAberto: number;
  vrPresente?: number;
  vrAquisicao?: number;
  vrJuros: number;
  vrMulta: number;
  situacaoTitulo: SituacaoTitulo;
  statusPagamento: StatusPagamento;
  statusNotificacao: StatusNotificacao;
  statusConfirmacao: StatusConfirmacao;
  emNegociacao?: boolean;
  diasAtraso: number;
  ultimaNotificacaoEm?: string | null;
  boletoGeradoEm?: string | null;
  classeOuOperacao?: string;
}

export const SITUACAO_TITULO_OPTS: SituacaoTitulo[] = [
  'EM_CARTEIRA',
  'PENDENTE',
  'BAIXA_PARCIAL',
  'VALIDADO',
];

export const STATUS_PAGAMENTO_OPTS: StatusPagamento[] = [
  'LIQUIDADO',
  'PAGO_PARCIAL',
  'VINCENDO',
  'VENCIDO',
];

export const STATUS_NOTIFICACAO_OPTS: StatusNotificacao[] = [
  'NOTIFICADO',
  'PENDENTE',
  'NAO_NOTIFICADO',
];

export const STATUS_CONFIRMACAO_OPTS: StatusConfirmacao[] = [
  'CONFIRMADO',
  'PENDENTE',
  'REJEITADO',
];

export const VEICULO_TIPO_OPTS: VeiculoTipo[] = ['CRA', 'FIDC'];

export function situacaoTituloLabel(s: SituacaoTitulo): string {
  return (
    {
      EM_CARTEIRA: 'Em Carteira',
      PENDENTE: 'Pendente',
      BAIXA_PARCIAL: 'Baixa Parcial',
      VALIDADO: 'Validado',
    } as const
  )[s];
}

export function situacaoTituloColor(s: SituacaoTitulo): string {
  return (
    {
      EM_CARTEIRA: 'var(--gci-base)',
      PENDENTE: 'var(--warning-base)',
      BAIXA_PARCIAL: 'var(--agro-base)',
      VALIDADO: 'var(--success-base)',
    } as const
  )[s];
}

export function statusPagamentoLabel(s: StatusPagamento): string {
  return (
    {
      LIQUIDADO: 'Liquidado',
      PAGO_PARCIAL: 'Pago Parcial',
      VINCENDO: 'Vincendo',
      VENCIDO: 'Vencido',
    } as const
  )[s];
}

export function statusPagamentoColor(s: StatusPagamento): string {
  return (
    {
      LIQUIDADO: 'var(--success-base)',
      PAGO_PARCIAL: 'var(--agro-base)',
      VINCENDO: 'var(--warning-base)',
      VENCIDO: 'var(--danger-base)',
    } as const
  )[s];
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

export function statusNotificacaoColor(s: StatusNotificacao): string {
  return (
    {
      NOTIFICADO: 'var(--success-base)',
      PENDENTE: 'var(--warning-base)',
      NAO_NOTIFICADO: 'var(--danger-base)',
    } as const
  )[s];
}

export function statusConfirmacaoLabel(s: StatusConfirmacao): string {
  return (
    {
      CONFIRMADO: 'Confirmado',
      PENDENTE: 'Pendente',
      REJEITADO: 'Rejeitado',
    } as const
  )[s];
}

export function statusConfirmacaoColor(s: StatusConfirmacao): string {
  return (
    {
      CONFIRMADO: 'var(--success-base)',
      PENDENTE: 'var(--warning-base)',
      REJEITADO: 'var(--danger-base)',
    } as const
  )[s];
}

export function brl(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits).replace('.', ',')}%`;
}

function parseBRDate(s: string): Date | null {
  const parts = s.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
}

function diasEntre(de: string, ate: Date = new Date()): number {
  const d = parseBRDate(de);
  if (!d) return 0;
  return Math.max(0, Math.floor((ate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

function hojeBR(): string {
  return new Date().toLocaleDateString('pt-BR');
}

export function isVencido(t: Titulo): boolean {
  return t.statusPagamento === 'VENCIDO' || t.diasAtraso > 0;
}

export function isVincendoHoje(t: Titulo): boolean {
  return t.vencimento === hojeBR() && t.vrAberto > 0;
}

export function isNaoBoletado(t: Titulo): boolean {
  return t.vrAberto > 0 && !t.boletoGeradoEm;
}

export function isNaoNotificado(t: Titulo): boolean {
  return t.statusNotificacao === 'NAO_NOTIFICADO' || t.statusNotificacao === 'PENDENTE';
}

export function isConfirmacaoPendente(t: Titulo): boolean {
  return t.statusConfirmacao === 'PENDENTE' || t.statusConfirmacao === 'REJEITADO';
}

/** Percentual ilustrativo de PDD por veículo (mock). */
const PDD_MOCK: Record<string, number> = {
  'cra-semeagro': 2.4,
  'cra-ceres': 1.8,
  'fidc-titec': 3.1,
  'fidc-boasafra': 4.2,
  'cra-nativa': 1.5,
  'fidc-valoriza': 0.9,
  'cra-futura': 2.7,
  'fidc-ceres': 5.1,
};

export interface ResumoVeiculo {
  veiculoId: string;
  veiculoNome: string;
  valorCarteira: number;
  valorVencido: number;
  pctInadimplencia: number;
  pctPdd: number;
}

export interface ResumoCliente {
  key: string;
  veiculoId: string;
  veiculoNome: string;
  clienteNome: string;
  clienteDocumento: string;
  valorTotal: number;
  valorVencido: number;
  pctInadimplencia: number;
}

export interface BoletagemVeiculo {
  veiculoId: string;
  veiculoNome: string;
  valorNaoBoletado: number;
  qtdNaoBoletado: number;
  diasEmCarteira: number;
}

export interface NotificacaoPendenteCliente {
  key: string;
  veiculoId: string;
  veiculoNome: string;
  clienteNome: string;
  clienteDocumento: string;
  valorNotificacao: number;
  diasParaNotificacao: number;
}

export interface ConfirmacaoPendenteCliente {
  key: string;
  veiculoId: string;
  veiculoNome: string;
  clienteNome: string;
  clienteDocumento: string;
  valorConfirmacao: number;
  pctConfirmado: number;
  diasParaNotificacao: number;
}

export function getResumoPorVeiculo(titulos: Titulo[]): ResumoVeiculo[] {
  const map = new Map<string, ResumoVeiculo>();
  for (const t of titulos) {
    let row = map.get(t.veiculoId);
    if (!row) {
      row = {
        veiculoId: t.veiculoId,
        veiculoNome: t.veiculoNome,
        valorCarteira: 0,
        valorVencido: 0,
        pctInadimplencia: 0,
        pctPdd: PDD_MOCK[t.veiculoId] ?? 2.0,
      };
      map.set(t.veiculoId, row);
    }
    row.valorCarteira += t.vrNominal;
    if (isVencido(t)) row.valorVencido += t.vrAberto;
  }
  return Array.from(map.values())
    .map((r) => ({
      ...r,
      pctInadimplencia: r.valorCarteira > 0 ? (r.valorVencido / r.valorCarteira) * 100 : 0,
    }))
    .sort((a, b) => b.valorVencido - a.valorVencido)
    .slice(0, 10);
}

export function getResumoPorCliente(titulos: Titulo[]): ResumoCliente[] {
  const map = new Map<string, ResumoCliente>();
  for (const t of titulos) {
    const key = `${t.veiculoId}::${t.sacadoCnpj}`;
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        veiculoId: t.veiculoId,
        veiculoNome: t.veiculoNome,
        clienteNome: t.sacado,
        clienteDocumento: t.sacadoCnpj,
        valorTotal: 0,
        valorVencido: 0,
        pctInadimplencia: 0,
      };
      map.set(key, row);
    }
    row.valorTotal += t.vrNominal;
    if (isVencido(t)) row.valorVencido += t.vrAberto;
  }
  return Array.from(map.values())
    .map((r) => ({
      ...r,
      pctInadimplencia: r.valorTotal > 0 ? (r.valorVencido / r.valorTotal) * 100 : 0,
    }))
    .filter((r) => r.valorVencido > 0)
    .sort((a, b) => b.valorVencido - a.valorVencido)
    .slice(0, 10);
}

export function getBoletagemPorVeiculo(titulos: Titulo[]): BoletagemVeiculo[] {
  const map = new Map<
    string,
    { veiculoId: string; veiculoNome: string; valor: number; qtd: number; diasSum: number }
  >();
  for (const t of titulos) {
    if (!isNaoBoletado(t)) continue;
    let row = map.get(t.veiculoId);
    if (!row) {
      row = { veiculoId: t.veiculoId, veiculoNome: t.veiculoNome, valor: 0, qtd: 0, diasSum: 0 };
      map.set(t.veiculoId, row);
    }
    row.valor += t.vrAberto;
    row.qtd += 1;
    row.diasSum += diasEntre(t.emissao);
  }
  return Array.from(map.values())
    .map((r) => ({
      veiculoId: r.veiculoId,
      veiculoNome: r.veiculoNome,
      valorNaoBoletado: r.valor,
      qtdNaoBoletado: r.qtd,
      diasEmCarteira: r.qtd > 0 ? Math.round(r.diasSum / r.qtd) : 0,
    }))
    .sort((a, b) => b.valorNaoBoletado - a.valorNaoBoletado)
    .slice(0, 10);
}

export function getNotificacoesPendentesPorCliente(titulos: Titulo[]): NotificacaoPendenteCliente[] {
  const map = new Map<string, NotificacaoPendenteCliente & { diasSum: number; qtd: number }>();
  for (const t of titulos) {
    if (!isNaoNotificado(t) || t.vrAberto <= 0) continue;
    const key = `${t.veiculoId}::${t.sacadoCnpj}`;
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        veiculoId: t.veiculoId,
        veiculoNome: t.veiculoNome,
        clienteNome: t.sacado,
        clienteDocumento: t.sacadoCnpj,
        valorNotificacao: 0,
        diasParaNotificacao: 0,
        diasSum: 0,
        qtd: 0,
      };
      map.set(key, row);
    }
    row.valorNotificacao += t.vrAberto;
    row.diasSum += Math.max(t.diasAtraso, diasEntre(t.emissao));
    row.qtd += 1;
  }
  return Array.from(map.values())
    .map(({ diasSum, qtd, ...r }) => ({
      ...r,
      diasParaNotificacao: qtd > 0 ? Math.round(diasSum / qtd) : 0,
    }))
    .sort((a, b) => b.valorNotificacao - a.valorNotificacao)
    .slice(0, 10);
}

export function getConfirmacoesPendentesPorCliente(titulos: Titulo[]): ConfirmacaoPendenteCliente[] {
  const map = new Map<
    string,
    ConfirmacaoPendenteCliente & { total: number; confirmado: number; diasSum: number; qtdPend: number }
  >();
  for (const t of titulos) {
    const key = `${t.veiculoId}::${t.sacadoCnpj}`;
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        veiculoId: t.veiculoId,
        veiculoNome: t.veiculoNome,
        clienteNome: t.sacado,
        clienteDocumento: t.sacadoCnpj,
        valorConfirmacao: 0,
        pctConfirmado: 0,
        diasParaNotificacao: 0,
        total: 0,
        confirmado: 0,
        diasSum: 0,
        qtdPend: 0,
      };
      map.set(key, row);
    }
    row.total += 1;
    if (t.statusConfirmacao === 'CONFIRMADO') row.confirmado += 1;
    if (isConfirmacaoPendente(t) && t.vrAberto > 0) {
      row.valorConfirmacao += t.vrAberto;
      row.diasSum += Math.max(t.diasAtraso, diasEntre(t.emissao));
      row.qtdPend += 1;
    }
  }
  return Array.from(map.values())
    .filter((r) => r.valorConfirmacao > 0)
    .map(({ total, confirmado, diasSum, qtdPend, ...r }) => ({
      ...r,
      pctConfirmado: total > 0 ? (confirmado / total) * 100 : 0,
      diasParaNotificacao: qtdPend > 0 ? Math.round(diasSum / qtdPend) : 0,
    }))
    .sort((a, b) => b.valorConfirmacao - a.valorConfirmacao)
    .slice(0, 10);
}

export const TITULOS_SEED: Titulo[] = [
  {
    id: 'tit-1',
    numero: 'CRA-SEA4-001',
    lastro: '116385',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    tipo: 'CPRF',
    cedente: 'Agropecuária Boa Safra',
    cedenteCnpj: '12.345.678/0001-90',
    sacado: 'Cooperativa Rural Oeste',
    sacadoCnpj: '98.765.432/0001-10',
    gerente: 'Carlos Mendes',
    emissao: '12/01/2026',
    vencimento: '15/08/2026',
    vrNominal: 185000,
    vrAberto: 0,
    vrPresente: 182400,
    vrAquisicao: 180000,
    vrJuros: 0,
    vrMulta: 0,
    situacaoTitulo: 'VALIDADO',
    statusPagamento: 'LIQUIDADO',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '10/07/2026',
    boletoGeradoEm: '05/07/2026',
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-2',
    numero: 'CRA-SEA4-002',
    lastro: '116390',
    veiculoTipo: 'CRA',
    veiculoNome: 'CRA Semeagro IV',
    veiculoId: 'cra-semeagro',
    tipo: 'CPRF',
    cedente: 'Fazenda Santa Clara',
    cedenteCnpj: '23.456.789/0001-01',
    sacado: 'Trading Grãos Sul',
    sacadoCnpj: '11.222.333/0001-44',
    gerente: 'Carlos Mendes',
    emissao: '20/12/2025',
    vencimento: '26/06/2026',
    vrNominal: 92000,
    vrAberto: 92000,
    vrPresente: 94500,
    vrAquisicao: 90000,
    vrJuros: 1840,
    vrMulta: 1840,
    situacaoTitulo: 'EM_CARTEIRA',
    statusPagamento: 'VENCIDO',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    diasAtraso: 18,
    ultimaNotificacaoEm: '08/07/2026',
    boletoGeradoEm: null,
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-3',
    numero: 'CRA-BTG2-001',
    lastro: '117201',
    veiculoTipo: 'CRA',
    veiculoNome: '42ª CRA Ceres',
    veiculoId: 'cra-ceres',
    tipo: 'NFe',
    cedente: 'Insumos Campo Verde',
    cedenteCnpj: '34.567.890/0001-12',
    sacado: 'Agro Norte Distribuidora',
    sacadoCnpj: '55.666.777/0001-88',
    gerente: 'Fernanda Rocha',
    emissao: '03/03/2026',
    vencimento: '15/07/2026',
    vrNominal: 64000,
    vrAberto: 64000,
    vrAquisicao: 62000,
    vrJuros: 0,
    vrMulta: 0,
    situacaoTitulo: 'PENDENTE',
    statusPagamento: 'VINCENDO',
    statusNotificacao: 'NAO_NOTIFICADO',
    statusConfirmacao: 'PENDENTE',
    diasAtraso: 0,
    ultimaNotificacaoEm: null,
    boletoGeradoEm: null,
    classeOuOperacao: 'Mezanino',
  },
  {
    id: 'tit-4',
    numero: 'FIDC-TITEC-101',
    lastro: '118110',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    tipo: 'NFe',
    cedente: 'SoftAgro Soluções',
    cedenteCnpj: '45.678.901/0001-23',
    sacado: 'Prefeitura de Londrina',
    sacadoCnpj: '76.543.210/0001-99',
    gerente: 'Fernanda Rocha',
    emissao: '15/02/2026',
    vencimento: '15/07/2026',
    vrNominal: 128500,
    vrAberto: 128500,
    vrPresente: 125100,
    vrAquisicao: 124000,
    vrJuros: 0,
    vrMulta: 0,
    situacaoTitulo: 'VALIDADO',
    statusPagamento: 'VINCENDO',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '01/07/2026',
    boletoGeradoEm: '01/07/2026',
    classeOuOperacao: 'Classe A',
  },
  {
    id: 'tit-5',
    numero: 'FIDC-TITEC-118',
    lastro: '118145',
    veiculoTipo: 'FIDC',
    veiculoNome: 'T.I Tecnologia FIDC',
    veiculoId: 'fidc-titec',
    tipo: 'DM',
    cedente: 'Tech Rural BR',
    cedenteCnpj: '56.789.012/0001-34',
    sacado: 'Rede Agro Markets',
    sacadoCnpj: '22.333.444/0001-55',
    gerente: 'Rodrigo Alves',
    emissao: '08/11/2025',
    vencimento: '30/05/2026',
    vrNominal: 47500,
    vrAberto: 47500,
    vrAquisicao: 46000,
    vrJuros: 2375,
    vrMulta: 950,
    situacaoTitulo: 'EM_CARTEIRA',
    statusPagamento: 'VENCIDO',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    diasAtraso: 45,
    ultimaNotificacaoEm: '12/07/2026',
    boletoGeradoEm: '20/06/2026',
    classeOuOperacao: 'Classe A',
  },
  {
    id: 'tit-6',
    numero: 'FIDC-AGRO-033',
    lastro: '119220',
    veiculoTipo: 'FIDC',
    veiculoNome: 'BOASAFRA FIDC',
    veiculoId: 'fidc-boasafra',
    tipo: 'CPRF',
    cedente: 'Sementes Vale do Sol',
    cedenteCnpj: '67.890.123/0001-45',
    sacado: 'Produtor João Mendes',
    sacadoCnpj: '123.456.789-00',
    gerente: 'Rodrigo Alves',
    emissao: '22/01/2026',
    vencimento: '05/07/2026',
    vrNominal: 210000,
    vrAberto: 150000,
    vrAquisicao: 205000,
    vrJuros: 4200,
    vrMulta: 2100,
    situacaoTitulo: 'BAIXA_PARCIAL',
    statusPagamento: 'PAGO_PARCIAL',
    statusNotificacao: 'PENDENTE',
    statusConfirmacao: 'CONFIRMADO',
    emNegociacao: true,
    diasAtraso: 9,
    ultimaNotificacaoEm: '07/07/2026',
    boletoGeradoEm: '28/06/2026',
    classeOuOperacao: 'Única',
  },
  {
    id: 'tit-7',
    numero: 'CRA-NAT-014',
    lastro: '120301',
    veiculoTipo: 'CRA',
    veiculoNome: '34ª CRA Nativa',
    veiculoId: 'cra-nativa',
    tipo: 'CDCA',
    cedente: 'Nativa Insumos',
    cedenteCnpj: '78.901.234/0001-56',
    sacado: 'Fazenda Três Barras',
    sacadoCnpj: '33.444.555/0001-66',
    gerente: 'Patricia Lima',
    emissao: '10/04/2026',
    vencimento: '18/11/2026',
    vrNominal: 89000,
    vrAberto: 89000,
    vrAquisicao: 87000,
    vrJuros: 0,
    vrMulta: 0,
    situacaoTitulo: 'PENDENTE',
    statusPagamento: 'VINCENDO',
    statusNotificacao: 'NAO_NOTIFICADO',
    statusConfirmacao: 'PENDENTE',
    diasAtraso: 0,
    ultimaNotificacaoEm: null,
    boletoGeradoEm: null,
    classeOuOperacao: 'Sênior',
  },
  {
    id: 'tit-8',
    numero: 'FIDC-VAL-007',
    lastro: '121044',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Valoriza FIDC',
    veiculoId: 'fidc-valoriza',
    tipo: 'CCB',
    cedente: 'Valoriza Commodities',
    cedenteCnpj: '89.012.345/0001-67',
    sacado: 'Exportadora Atlântico',
    sacadoCnpj: '44.555.666/0001-77',
    gerente: 'Patricia Lima',
    emissao: '28/02/2026',
    vencimento: '30/08/2026',
    vrNominal: 312000,
    vrAberto: 0,
    vrPresente: 308200,
    vrAquisicao: 305000,
    vrJuros: 0,
    vrMulta: 0,
    situacaoTitulo: 'VALIDADO',
    statusPagamento: 'LIQUIDADO',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    diasAtraso: 0,
    ultimaNotificacaoEm: '02/07/2026',
    boletoGeradoEm: '02/07/2026',
    classeOuOperacao: 'Classe Sênior',
  },
  {
    id: 'tit-9',
    numero: 'CRA-FUT-022',
    lastro: '122510',
    veiculoTipo: 'CRA',
    veiculoNome: '2ª CRA Futura Insumos',
    veiculoId: 'cra-futura',
    tipo: 'NC',
    cedente: 'Futura Agro',
    cedenteCnpj: '90.123.456/0001-78',
    sacado: 'Revenda Oeste Brasil',
    sacadoCnpj: '66.777.888/0001-11',
    gerente: 'Carlos Mendes',
    emissao: '05/01/2026',
    vencimento: '07/07/2026',
    vrNominal: 55000,
    vrAberto: 55000,
    vrAquisicao: 53500,
    vrJuros: 1100,
    vrMulta: 550,
    situacaoTitulo: 'EM_CARTEIRA',
    statusPagamento: 'VENCIDO',
    statusNotificacao: 'PENDENTE',
    statusConfirmacao: 'REJEITADO',
    diasAtraso: 7,
    ultimaNotificacaoEm: '11/07/2026',
    boletoGeradoEm: null,
    classeOuOperacao: 'Subordinada',
  },
  {
    id: 'tit-10',
    numero: 'FIDC-CER-055',
    lastro: '123880',
    veiculoTipo: 'FIDC',
    veiculoNome: 'Ceres Confina LTDA',
    veiculoId: 'fidc-ceres',
    tipo: 'CPRF',
    cedente: 'Confina Horizonte',
    cedenteCnpj: '01.234.567/0001-89',
    sacado: 'Frigorífico Centro Sul',
    sacadoCnpj: '77.888.999/0001-22',
    gerente: 'Rodrigo Alves',
    emissao: '18/03/2026',
    vencimento: '22/06/2026',
    vrNominal: 430000,
    vrAberto: 280000,
    vrAquisicao: 420000,
    vrJuros: 8600,
    vrMulta: 4300,
    situacaoTitulo: 'BAIXA_PARCIAL',
    statusPagamento: 'PAGO_PARCIAL',
    statusNotificacao: 'NOTIFICADO',
    statusConfirmacao: 'CONFIRMADO',
    emNegociacao: true,
    diasAtraso: 22,
    ultimaNotificacaoEm: '13/07/2026',
    boletoGeradoEm: '15/06/2026',
    classeOuOperacao: 'Única',
  },
];

export const VEICULO_OPTS = Array.from(
  new Map(TITULOS_SEED.map((t) => [t.veiculoId, t.veiculoNome])).entries(),
).map(([id, nome]) => ({ id, nome }));
