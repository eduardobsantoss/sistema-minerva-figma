export type VeiculoTipo = 'CRA' | 'FIDC';
export type SerieClasse = 'SR' | 'MEZ' | 'SUB';
export type VeiculoStatus = 'Em andamento' | 'Encerrado';
export type Farol = 'ok' | 'sem-caixa' | 'insuficiente' | 'sem-evento';
export type TaxaStatus = 'Divulgada' | 'Projetada' | 'Pendente';

export interface HistoricoPuRow {
  id: string;
  data: string;
  dataIso: string;
  taxaAa: number;
  du: number;
  valorNominal: number;
  puAtualizado: number;
  puJuros: number;
  evento: string;
  statusTaxa: TaxaStatus;
  puProjetado?: number;
}

export interface EventoRealizado {
  data: string;
  componente: string;
  puEvento: number;
  valorEvento: number;
  puApos: number;
  detalhe: string;
}

export interface PrevisaoRow {
  data: string;
  dataIso: string;
  pu: number;
  ehDataPagamentoTs: boolean;
}

export interface Serie {
  id: string;
  classe: SerieClasse;
  nome: string;
  ifCodigo: string;
  tipo: string;
  dataInicio: string;
  vencimento: string;
  vencimentoIso: string;
  valorNominalInicial: number;
  quantidade: number;
  principalResidual: number;
  pu: number;
  valor: number;
  remuneracao: string;
  resultadoDia: number;
  resultadoMes: number;
  proximoPagamentoValor: number;
  historicoPu: HistoricoPuRow[];
  eventosRealizados: EventoRealizado[];
  previsao: PrevisaoRow[];
  acumulacaoD1: { pu: number; juros: number; fator: number; du: number };
}

export interface DateChip {
  iso: string;
  label: string;
}

export interface CaixaAccount {
  label: string;
  value: number;
}

export interface Veiculo {
  id: string;
  tipo: VeiculoTipo;
  nome: string;
  cessionaria: string;
  dataBase: string;
  dataBaseIso: string;
  status: VeiculoStatus;
  vencimento: string;
  ativoTotal: number;
  carteiraVp: number;
  funding: number;
  subordinada: number;
  caixa: number;
  pdd: number;
  despesas: number;
  provisoes: number;
  puSenior: number;
  puSubResidual: number;
  coberturaCaixa: number;
  proximoPagamento: number;
  dateChips: DateChip[];
  series: Serie[];
  caixaAccounts: CaixaAccount[];
}

export interface EventConfig {
  dateKey: string;
  afLeadDays: number;
  interest: boolean;
  ordinaryAmortization: boolean;
  amex: boolean;
  rescue: boolean;
  premium: boolean;
  premiumPct: number;
  cash: number;
}

export interface EventComponent {
  component: string;
  pu: number | null;
  value: number;
  detail: string;
}

export interface EventSimulation {
  puBefore: number;
  principalBefore: number;
  interestPu: number;
  eventPu: number;
  eventValue: number;
  puAfter: number;
  cashAfter: number;
  afDeadline: string;
  farol: Farol;
  components: EventComponent[];
}

/* ------------------------------------------------------------------ */
/* Formatters                                                         */
/* ------------------------------------------------------------------ */

export function brl(n: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000)
      return `R$ ${(n / 1_000_000_000).toFixed(2).replace('.', ',')} bi`;
    if (abs >= 1_000_000)
      return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi`;
    if (abs >= 1_000) return `R$ ${(n / 1_000).toFixed(0)} mil`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export function num(n: number, decimals = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function pu(n: number, decimals = 6): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function pct(n: number, decimals = 2): string {
  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n * 100)}%`;
}

export function isoToBr(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export const CLASSE_LABEL: Record<SerieClasse, string> = {
  SR: 'Sênior',
  MEZ: 'Mezanino',
  SUB: 'Subordinada',
};

export const FAROL_TONE: Record<Farol, { bg: string; fg: string; label: string }> = {
  ok: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', label: 'OK' },
  'sem-caixa': { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', label: 'Sem caixa' },
  insuficiente: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)', label: 'Insuficiente' },
  'sem-evento': { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)', label: 'Sem evento' },
};

export const TAXA_TONE: Record<TaxaStatus, { bg: string; fg: string }> = {
  Divulgada: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  Projetada: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  Pendente: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
};

/* ------------------------------------------------------------------ */
/* Dates                                                              */
/* ------------------------------------------------------------------ */

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function addBusinessDays(iso: string, days: number): string {
  const date = parseIso(iso);
  const step = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    date.setDate(date.getDate() + step);
    if (!isWeekend(date)) remaining -= 1;
  }
  return toIso(date);
}

export function defaultEventDate(dataBaseIso: string): string {
  return addBusinessDays(dataBaseIso, 5);
}

/* ------------------------------------------------------------------ */
/* simulateEvent                                                      */
/* ------------------------------------------------------------------ */

export function simulateEvent(serie: Serie, config: EventConfig): EventSimulation {
  const quantity = serie.quantidade;
  const puBefore = serie.pu;
  const principalBefore = serie.principalResidual;
  const interestPu = Math.max(0, puBefore - principalBefore);
  const hasPrincipal = config.ordinaryAmortization || config.amex || config.rescue;
  const handlesInterest = config.interest || hasPrincipal;
  const hasAnyEvent = handlesInterest || config.premium;

  const components: EventComponent[] = [];
  let cashRemaining = Math.max(0, config.cash);
  const cashOriginal = cashRemaining;

  let principalAfterInterest = principalBefore;
  let interestPaidPu = 0;

  if (handlesInterest) {
    const desired = interestPu;
    interestPaidPu = quantity > 0 ? Math.min(desired, cashRemaining / quantity) : 0;
    const interestPaidValue = interestPaidPu * quantity;
    cashRemaining = Math.max(0, cashRemaining - interestPaidValue);
    const incorporated = Math.max(0, interestPu - interestPaidPu);
    principalAfterInterest = principalBefore + incorporated;
    components.push({
      component: 'Juros',
      pu: interestPaidPu,
      value: interestPaidValue,
      detail: incorporated > 0 ? `Incorpora ${pu(incorporated, 8)} PU` : 'Pago em caixa',
    });
  }

  let principal = principalAfterInterest;
  let ordinaryPu = 0;
  let amexPu = 0;
  let rescuePu = 0;
  let rescueShortfall = 0;

  if (config.ordinaryAmortization && quantity > 0 && principal > 0 && cashRemaining > 0) {
    ordinaryPu = Math.min(principal, cashRemaining / quantity);
    const value = ordinaryPu * quantity;
    principal = Math.max(0, principal - ordinaryPu);
    cashRemaining = Math.max(0, cashRemaining - value);
    components.push({
      component: 'Amortização',
      pu: ordinaryPu,
      value,
      detail: 'Prevista no TS',
    });
  }

  if (config.amex && quantity > 0 && principal > 0 && cashRemaining > 0) {
    amexPu = Math.min(principal, cashRemaining / quantity);
    const value = amexPu * quantity;
    principal = Math.max(0, principal - amexPu);
    cashRemaining = Math.max(0, cashRemaining - value);
    components.push({
      component: 'AMEX',
      pu: amexPu,
      value,
      detail: 'Amortização extraordinária',
    });
  }

  if (config.rescue && quantity > 0 && principal > 0) {
    const needed = principal * quantity;
    if (cashRemaining >= needed) {
      rescuePu = principal;
      principal = 0;
      cashRemaining = Math.max(0, cashRemaining - needed);
      components.push({
        component: 'Resgate total',
        pu: rescuePu,
        value: needed,
        detail: 'PU zera após evento',
      });
    } else {
      rescueShortfall = needed - cashRemaining;
      components.push({
        component: 'Resgate total',
        pu: 0,
        value: 0,
        detail: `Saldo insuficiente: faltam ${brl(rescueShortfall)}`,
      });
    }
  }

  const paidBeforePremium = components.reduce((sum, c) => sum + c.value, 0);
  const premiumValue = config.premium ? paidBeforePremium * (config.premiumPct / 100) : 0;
  if (config.premium) {
    cashRemaining -= premiumValue;
    components.push({
      component: 'Prêmio',
      pu: null,
      value: premiumValue,
      detail: `${pct(config.premiumPct / 100)} sobre o valor do evento`,
    });
  }

  const eventPu = interestPaidPu + ordinaryPu + amexPu + rescuePu;
  const eventValue = paidBeforePremium + premiumValue;
  const puAfter = handlesInterest || hasPrincipal ? principal : puBefore;
  const afDeadline = addBusinessDays(config.dateKey, -Math.round(config.afLeadDays || 0));

  let farol: Farol = 'ok';
  if (!hasAnyEvent) farol = 'sem-evento';
  else if (rescueShortfall > 0 || cashRemaining < -0.0001) farol = 'insuficiente';
  else if (eventValue <= 0 && cashOriginal <= 0) farol = 'sem-caixa';

  return {
    puBefore,
    principalBefore,
    interestPu,
    eventPu,
    eventValue,
    puAfter,
    cashAfter: Math.max(0, cashRemaining),
    afDeadline,
    farol,
    components: components.length ? components : [{ component: 'Sem componente', pu: 0, value: 0, detail: 'Selecione um evento' }],
  };
}

/* ------------------------------------------------------------------ */
/* Mock factories                                                     */
/* ------------------------------------------------------------------ */

const DATE_CHIPS: DateChip[] = [
  { iso: '2026-08-25', label: '25/08' },
  { iso: '2026-08-24', label: '24/08' },
  { iso: '2026-08-21', label: '21/08' },
  { iso: '2026-08-20', label: '20/08' },
  { iso: '2026-08-19', label: '19/08' },
];

const HIST_DATES = [
  '2026-08-25',
  '2026-08-24',
  '2026-08-21',
  '2026-08-20',
  '2026-08-19',
  '2026-08-18',
  '2026-08-17',
  '2026-08-14',
  '2026-08-13',
  '2026-08-12',
  '2026-08-11',
  '2026-08-10',
];

function makeHistorico(opts: {
  prefix: string;
  pu: number;
  vn: number;
  taxaAa: number;
  eventIso?: string;
  eventLabel?: string;
}): HistoricoPuRow[] {
  return HIST_DATES.map((iso, i) => {
    const drift = i * 0.012;
    const puAtualizado = opts.pu - drift;
    const vn = opts.vn - i * 0.004;
    const statusTaxa: TaxaStatus =
      i === 0 ? 'Divulgada' : i < 3 ? 'Divulgada' : i < 8 ? 'Divulgada' : 'Projetada';
    const puProjetado =
      statusTaxa === 'Projetada' ? puAtualizado + 0.018 + i * 0.004 : puAtualizado;
    return {
      id: `${opts.prefix}-h${i}`,
      data: isoToBr(iso),
      dataIso: iso,
      taxaAa: opts.taxaAa,
      du: 12 - i,
      valorNominal: vn,
      puAtualizado,
      puJuros: Math.max(0, puAtualizado - vn),
      evento: iso === opts.eventIso ? (opts.eventLabel ?? 'Juros') : '—',
      statusTaxa,
      puProjetado,
    };
  });
}

function makePrevisao(puBase: number, fromIso: string): PrevisaoRow[] {
  const rows: PrevisaoRow[] = [];
  let iso = fromIso;
  for (let i = 1; i <= 8; i += 1) {
    iso = addBusinessDays(iso, 1);
    const payment = i === 5;
    rows.push({
      data: isoToBr(iso),
      dataIso: iso,
      pu: puBase + i * 0.011,
      ehDataPagamentoTs: payment,
    });
  }
  return rows;
}

function makeSerie(opts: {
  id: string;
  classe: SerieClasse;
  nome?: string;
  ifCodigo: string;
  tipo: string;
  dataInicio: string;
  vencimentoIso: string;
  vnu: number;
  quantidade: number;
  principalResidual: number;
  pu: number;
  remuneracao: string;
  taxaAa: number;
  resultadoDia: number;
  resultadoMes: number;
  proximoPagamentoValor: number;
  eventIso?: string;
  eventLabel?: string;
  eventos?: EventoRealizado[];
}): Serie {
  return {
    id: opts.id,
    classe: opts.classe,
    nome: opts.nome ?? CLASSE_LABEL[opts.classe],
    ifCodigo: opts.ifCodigo,
    tipo: opts.tipo,
    dataInicio: opts.dataInicio,
    vencimento: isoToBr(opts.vencimentoIso),
    vencimentoIso: opts.vencimentoIso,
    valorNominalInicial: opts.vnu,
    quantidade: opts.quantidade,
    principalResidual: opts.principalResidual,
    pu: opts.pu,
    valor: opts.pu * opts.quantidade,
    remuneracao: opts.remuneracao,
    resultadoDia: opts.resultadoDia,
    resultadoMes: opts.resultadoMes,
    proximoPagamentoValor: opts.proximoPagamentoValor,
    historicoPu: makeHistorico({
      prefix: opts.id,
      pu: opts.pu,
      vn: opts.principalResidual,
      taxaAa: opts.taxaAa,
      eventIso: opts.eventIso,
      eventLabel: opts.eventLabel,
    }),
    eventosRealizados: opts.eventos ?? [],
    previsao: makePrevisao(opts.pu, '2026-08-25'),
    acumulacaoD1: {
      pu: opts.pu,
      juros: Math.max(0, opts.pu - opts.principalResidual),
      fator: opts.pu / opts.principalResidual,
      du: 12,
    },
  };
}

export const VEICULOS: Veiculo[] = [
  {
    id: 'cra-42',
    tipo: 'CRA',
    nome: 'CRA 42 — Ceres Agronegócio',
    cessionaria: 'Ceres Securitizadora',
    dataBase: '25/08/2026',
    dataBaseIso: '2026-08-25',
    status: 'Em andamento',
    vencimento: '15/12/2028',
    ativoTotal: 1_012_301_744,
    carteiraVp: 607_259_644,
    funding: 610_066_092,
    subordinada: 402_235_652,
    caixa: 12_140_000,
    pdd: 2_685_566,
    despesas: 1_840_000,
    provisoes: 2_120_000,
    puSenior: 1016.77682,
    puSubResidual: 1005.589131,
    coberturaCaixa: 0.86,
    proximoPagamento: 14_120_000,
    dateChips: DATE_CHIPS,
    caixaAccounts: [
      { label: 'Conta corrente', value: 9_420_000 },
      { label: 'Conta investimentos', value: 1_850_000 },
      { label: 'Fundo de zeragem', value: 870_000 },
    ],
    series: [
      makeSerie({
        id: 'cra-42-sr1',
        nome: 'Senior 1a',
        classe: 'SR',
        ifCodigo: 'CRA0225C42-1',
        tipo: '110% DI',
        dataInicio: '15/01/2025',
        vencimentoIso: '2028-12-15',
        vnu: 1000,
        quantidade: 360_000,
        principalResidual: 1000,
        pu: 1016.77682,
        remuneracao: '110,00% DI',
        taxaAa: 0.1375,
        resultadoDia: 0.0006,
        resultadoMes: 0.0098,
        proximoPagamentoValor: 0,
        eventIso: '2026-08-14',
        eventLabel: 'Juros',
      }),
      makeSerie({
        id: 'cra-42-sr2',
        nome: 'Senior 2a',
        classe: 'SR',
        ifCodigo: 'CRA0225C42-2',
        tipo: '110% DI',
        dataInicio: '15/01/2025',
        vencimentoIso: '2028-12-15',
        vnu: 1000,
        quantidade: 140_000,
        principalResidual: 1000,
        pu: 1016.77682,
        remuneracao: '110,00% DI',
        taxaAa: 0.1375,
        resultadoDia: 0.0006,
        resultadoMes: 0.0098,
        proximoPagamentoValor: 0,
      }),
      makeSerie({
        id: 'cra-42-sr3',
        nome: 'Senior 3a',
        classe: 'SR',
        ifCodigo: 'CRA0225C42-3',
        tipo: '110% DI',
        dataInicio: '15/01/2025',
        vencimentoIso: '2028-12-15',
        vnu: 1000,
        quantidade: 100_000,
        principalResidual: 1000,
        pu: 1016.77682,
        remuneracao: '110,00% DI',
        taxaAa: 0.1375,
        resultadoDia: 0.0006,
        resultadoMes: 0.0098,
        proximoPagamentoValor: 0,
      }),
      makeSerie({
        id: 'cra-42-sub',
        nome: 'Subordinada',
        classe: 'SUB',
        ifCodigo: '—',
        tipo: 'Residual',
        dataInicio: '15/01/2025',
        vencimentoIso: '2028-12-15',
        vnu: 1000,
        quantidade: 400_000,
        principalResidual: 1000,
        pu: 1005.589131,
        remuneracao: 'Residual',
        taxaAa: 0,
        resultadoDia: 0.0002,
        resultadoMes: 0.0046,
        proximoPagamentoValor: 0,
      }),
    ],
  },
  {
    id: 'cra-65',
    tipo: 'CRA',
    nome: 'CRA 65 — Uby Foliares',
    cessionaria: 'Ceres Securitizadora',
    dataBase: '25/08/2026',
    dataBaseIso: '2026-08-25',
    status: 'Em andamento',
    vencimento: '30/06/2027',
    ativoTotal: 186_420_000,
    carteiraVp: 128_340_000,
    funding: 97_850_000,
    subordinada: 78_210_000,
    caixa: 4_280_000,
    pdd: 890_000,
    despesas: 410_000,
    provisoes: 520_000,
    puSenior: 103.4412,
    puSubResidual: 91.02,
    coberturaCaixa: 1.12,
    proximoPagamento: 3_820_000,
    dateChips: DATE_CHIPS,
    caixaAccounts: [
      { label: 'Conta corrente', value: 3_410_000 },
      { label: 'Conta investimentos', value: 620_000 },
      { label: 'Fundo de zeragem', value: 250_000 },
    ],
    series: [
      makeSerie({
        id: 'cra-65-sr',
        classe: 'SR',
        ifCodigo: 'CRA0326C65',
        tipo: 'Pré-fixado',
        dataInicio: '10/03/2026',
        vencimentoIso: '2027-06-30',
        vnu: 100,
        quantidade: 820_000,
        principalResidual: 100,
        pu: 103.4412,
        remuneracao: '12,80% a.a. pré',
        taxaAa: 0.128,
        resultadoDia: 0.00048,
        resultadoMes: 0.0094,
        proximoPagamentoValor: 3_140_000,
      }),
      makeSerie({
        id: 'cra-65-mez',
        classe: 'MEZ',
        ifCodigo: 'CRA0326C65M',
        tipo: 'Pré-fixado',
        dataInicio: '10/03/2026',
        vencimentoIso: '2027-06-30',
        vnu: 100,
        quantidade: 140_000,
        principalResidual: 100,
        pu: 102.11,
        remuneracao: '14,20% a.a. pré',
        taxaAa: 0.142,
        resultadoDia: 0.00053,
        resultadoMes: 0.0108,
        proximoPagamentoValor: 680_000,
      }),
      makeSerie({
        id: 'cra-65-sub',
        classe: 'SUB',
        ifCodigo: '—',
        tipo: 'Residual',
        dataInicio: '10/03/2026',
        vencimentoIso: '2027-06-30',
        vnu: 100,
        quantidade: 859_000,
        principalResidual: 91.02,
        pu: 91.02,
        remuneracao: 'Residual',
        taxaAa: 0,
        resultadoDia: 0.00012,
        resultadoMes: 0.0028,
        proximoPagamentoValor: 0,
      }),
    ],
  },
  {
    id: 'fidc-agrovida',
    tipo: 'FIDC',
    nome: 'FIDC Agrovida Multiclasse',
    cessionaria: 'GCI Gestora',
    dataBase: '25/08/2026',
    dataBaseIso: '2026-08-25',
    status: 'Em andamento',
    vencimento: 'Indeterminado',
    ativoTotal: 348_900_000,
    carteiraVp: 261_400_000,
    funding: 198_650_000,
    subordinada: 132_400_000,
    caixa: 8_760_000,
    pdd: 1_240_000,
    despesas: 620_000,
    provisoes: 780_000,
    puSenior: 1.0874,
    puSubResidual: 0.9412,
    coberturaCaixa: 1.34,
    proximoPagamento: 6_540_000,
    dateChips: DATE_CHIPS,
    caixaAccounts: [
      { label: 'Conta corrente', value: 7_110_000 },
      { label: 'Conta investimentos', value: 1_150_000 },
      { label: 'Fundo de zeragem', value: 500_000 },
    ],
    series: [
      makeSerie({
        id: 'fidc-agrovida-sr',
        classe: 'SR',
        ifCodigo: 'FIDCAGRVSR',
        tipo: 'DI + spread',
        dataInicio: '20/08/2024',
        vencimentoIso: '2029-08-20',
        vnu: 1,
        quantidade: 162_400_000,
        principalResidual: 1,
        pu: 1.0874,
        remuneracao: '100% DI + 1,80%',
        taxaAa: 0.1305,
        resultadoDia: 0.00039,
        resultadoMes: 0.0079,
        proximoPagamentoValor: 4_820_000,
        eventos: [
          {
            data: '20/08/2026',
            componente: 'Amortização',
            puEvento: 0.012,
            valorEvento: 1_948_800,
            puApos: 1.074,
            detalhe: 'Prevista no regulamento',
          },
        ],
      }),
      makeSerie({
        id: 'fidc-agrovida-mez',
        classe: 'MEZ',
        ifCodigo: 'FIDCAGRVMZ',
        tipo: 'DI + spread',
        dataInicio: '20/08/2024',
        vencimentoIso: '2029-08-20',
        vnu: 1,
        quantidade: 22_000_000,
        principalResidual: 1,
        pu: 1.0612,
        remuneracao: '100% DI + 3,20%',
        taxaAa: 0.1445,
        resultadoDia: 0.00046,
        resultadoMes: 0.0098,
        proximoPagamentoValor: 1_720_000,
      }),
      makeSerie({
        id: 'fidc-agrovida-sub',
        classe: 'SUB',
        ifCodigo: '—',
        tipo: 'Residual',
        dataInicio: '20/08/2024',
        vencimentoIso: '2029-08-20',
        vnu: 1,
        quantidade: 140_680_000,
        principalResidual: 0.9412,
        pu: 0.9412,
        remuneracao: 'Residual',
        taxaAa: 0,
        resultadoDia: 0.00021,
        resultadoMes: 0.0054,
        proximoPagamentoValor: 0,
      }),
    ],
  },
];

export function getVeiculo(id: string): Veiculo | undefined {
  return VEICULOS.find((v) => v.id === id);
}

export function serieSenior(veiculo: Veiculo): Serie | undefined {
  return veiculo.series.find((s) => s.classe === 'SR');
}

/* ------------------------------------------------------------------ */
/* Session mutations (prototype)                                      */
/* ------------------------------------------------------------------ */

export const CAIXA_LABELS = ['Conta corrente', 'Conta investimentos', 'Fundo de zeragem'] as const;
export type CaixaLabel = (typeof CAIXA_LABELS)[number];

export type PuEventType =
  | 'subscription'
  | 'interest'
  | 'amortization'
  | 'extraordinaryAmortization'
  | 'premium'
  | 'nonCashWithdrawal';

export const PU_EVENT_TYPES: { id: PuEventType; label: string }[] = [
  { id: 'subscription', label: 'Integralização' },
  { id: 'interest', label: 'Pagamento de juros' },
  { id: 'amortization', label: 'Amortização' },
  { id: 'extraordinaryAmortization', label: 'Amortização extraordinária' },
  { id: 'premium', label: 'Pagamento de prêmio' },
  { id: 'nonCashWithdrawal', label: 'Retirada de cotas sem financeiro' },
];

export function puEventLabel(type: PuEventType): string {
  return PU_EVENT_TYPES.find((t) => t.id === type)?.label ?? type;
}

export function puEventUsesQuantity(type: PuEventType): boolean {
  return type === 'subscription' || type === 'nonCashWithdrawal';
}

export function puEventUsesAmount(type: PuEventType): boolean {
  return (
    type === 'interest' ||
    type === 'amortization' ||
    type === 'extraordinaryAmortization' ||
    type === 'premium'
  );
}

export interface CreatePuEventInput {
  type: PuEventType;
  date: string;
  amount?: number;
  quantity?: number;
  payAllAccruedInterest?: boolean;
}

export type LaminaUploadKind =
  | 'cota-subordinada'
  | 'cota-senior'
  | 'conta-corrente'
  | 'conta-investimentos'
  | 'fundo-zeragem';

export const LAMINA_UPLOAD_KINDS: { id: LaminaUploadKind; label: string }[] = [
  { id: 'cota-subordinada', label: 'Cota subordinada' },
  { id: 'cota-senior', label: 'Cota sênior' },
  { id: 'conta-corrente', label: 'Conta corrente' },
  { id: 'conta-investimentos', label: 'Conta investimentos' },
  { id: 'fundo-zeragem', label: 'Fundo de zeragem' },
];

export interface BankBalanceInput {
  date: string;
  currentAccountBalance: number;
  investmentsBalance: number;
  sweepFundBalance: number;
}

export function cloneVeiculo(src: Veiculo): Veiculo {
  const v = structuredClone(src);
  v.caixaAccounts = normalizeCaixaAccounts(v.caixaAccounts, v.caixa);
  v.caixa = v.caixaAccounts.reduce((s, a) => s + a.value, 0);
  return v;
}

function normalizeCaixaAccounts(existing: CaixaAccount[], total: number): CaixaAccount[] {
  const byLabel = new Map(existing.map((a) => [a.label, a.value]));
  if (CAIXA_LABELS.every((label) => byLabel.has(label))) {
    return CAIXA_LABELS.map((label) => ({ label, value: byLabel.get(label) ?? 0 }));
  }
  return CAIXA_LABELS.map((label, i) => ({
    label,
    value: existing[i]?.value ?? (i === 0 ? total : 0),
  }));
}

function refreshAggregates(veiculo: Veiculo) {
  const seniors = veiculo.series.filter((s) => s.classe === 'SR');
  veiculo.funding = seniors.reduce((s, x) => s + x.valor, 0);
  const sub = veiculo.series.find((s) => s.classe === 'SUB');
  veiculo.subordinada = sub?.valor ?? 0;
  veiculo.puSenior = seniors[0]?.pu ?? veiculo.puSenior;
  veiculo.puSubResidual = sub?.pu ?? veiculo.puSubResidual;
  veiculo.caixa = veiculo.caixaAccounts.reduce((s, a) => s + a.value, 0);
}

export function nextSerieNome(veiculo: Veiculo, classe: SerieClasse): string {
  if (classe === 'SUB') {
    const n = veiculo.series.filter((s) => s.classe === 'SUB').length;
    return n === 0 ? 'Subordinada' : `Subordinada ${n + 1}a`;
  }
  if (classe === 'MEZ') {
    const n = veiculo.series.filter((s) => s.classe === 'MEZ').length;
    return n === 0 ? 'Mezanino' : `Mezanino ${n + 1}a`;
  }
  const n = veiculo.series.filter((s) => s.classe === 'SR').length + 1;
  return `Senior ${n}a`;
}

export interface NovaCotaInput {
  classe: SerieClasse;
  ifCodigo: string;
  tipo: string;
  dataInicioIso: string;
  vencimentoIso: string;
  valorNominalInicial: number;
  quantidade: number;
  principalResidual: number;
  pu: number;
  valorTotal: number;
  remuneracao: string;
  proximoPagamentoValor: number;
}

export function addNovaCota(veiculo: Veiculo, input: NovaCotaInput): Serie {
  const vnu = input.valorNominalInicial || 1000;
  const puValue = input.pu || vnu;
  const quantidade = Math.max(0, input.quantidade);
  const serie = makeSerie({
    id: `${veiculo.id}-${input.classe.toLowerCase()}-${Date.now()}`,
    classe: input.classe,
    nome: nextSerieNome(veiculo, input.classe),
    ifCodigo: input.ifCodigo.trim() || '—',
    tipo: input.tipo.trim() || '—',
    dataInicio: isoToBr(input.dataInicioIso),
    vencimentoIso: input.vencimentoIso,
    vnu,
    quantidade,
    principalResidual: input.principalResidual || vnu,
    pu: puValue,
    remuneracao: input.remuneracao.trim() || input.tipo.trim() || '—',
    taxaAa: 0,
    resultadoDia: 0,
    resultadoMes: 0,
    proximoPagamentoValor: Math.max(0, input.proximoPagamentoValor),
  });
  serie.valor = input.valorTotal || puValue * quantidade;
  veiculo.series.push(serie);
  refreshAggregates(veiculo);
  return serie;
}

function debitCaixa(veiculo: Veiculo, amount: number) {
  let remaining = amount;
  for (const acc of veiculo.caixaAccounts) {
    const take = Math.min(Math.max(0, acc.value), remaining);
    acc.value -= take;
    remaining -= take;
    if (remaining <= 0) break;
  }
  if (remaining > 0 && veiculo.caixaAccounts[0]) {
    veiculo.caixaAccounts[0].value -= remaining;
  }
}

function accruedInterestValue(serie: Serie): number {
  return Math.max(0, serie.quantidade * serie.acumulacaoD1.juros);
}

export function applyPuEvent(veiculo: Veiculo, serieId: string, input: CreatePuEventInput): string {
  const idx = veiculo.series.findIndex((s) => s.id === serieId);
  if (idx < 0) return 'Série não encontrada.';
  const serie: Serie = {
    ...veiculo.series[idx]!,
    eventosRealizados: [...veiculo.series[idx]!.eventosRealizados],
    acumulacaoD1: { ...veiculo.series[idx]!.acumulacaoD1 },
  };

  const dateBr = isoToBr(input.date);
  const label = puEventLabel(input.type);

  if (puEventUsesQuantity(input.type)) {
    const q = input.quantity ?? 0;
    if (q <= 0) return 'Quantidade de cotas deve ser maior que 0.';
    if (input.type === 'subscription') {
      serie.quantidade += q;
      serie.valor = serie.pu * serie.quantidade;
      serie.eventosRealizados.unshift({
        data: dateBr,
        componente: label,
        puEvento: 0,
        valorEvento: 0,
        puApos: serie.pu,
        detalhe: `${num(q, 0)} cotas`,
      });
    } else {
      if (q > serie.quantidade) return 'Quantidade maior que o estoque da série.';
      serie.quantidade -= q;
      serie.valor = serie.pu * serie.quantidade;
      serie.eventosRealizados.unshift({
        data: dateBr,
        componente: label,
        puEvento: 0,
        valorEvento: 0,
        puApos: serie.pu,
        detalhe: `${num(q, 0)} cotas`,
      });
    }
  } else {
    let amount = input.amount ?? 0;
    if (input.type === 'interest' && input.payAllAccruedInterest) {
      amount = accruedInterestValue(serie);
    }
    if (amount <= 0) return 'Valor deve ser maior que 0.';

    debitCaixa(veiculo, amount);

    if (input.type === 'amortization' || input.type === 'extraordinaryAmortization') {
      const deltaPu = serie.quantidade > 0 ? amount / serie.quantidade : 0;
      serie.pu = Math.max(0, serie.pu - deltaPu);
      serie.principalResidual = Math.max(0, serie.principalResidual - deltaPu);
      serie.valor = serie.pu * serie.quantidade;
      serie.acumulacaoD1.pu = serie.pu;
      serie.acumulacaoD1.juros = Math.max(0, serie.pu - serie.principalResidual);
    }

    serie.eventosRealizados.unshift({
      data: dateBr,
      componente: label,
      puEvento: input.type === 'premium' || input.type === 'interest' ? 0 : amount,
      valorEvento: amount,
      puApos: serie.pu,
      detalhe: input.payAllAccruedInterest ? 'Pagar 100% dos juros do dia' : brl(amount, true),
    });
  }

  veiculo.series.splice(idx, 1, serie);
  refreshAggregates(veiculo);
  return '';
}

export function applyBankBalance(veiculo: Veiculo, input: BankBalanceInput) {
  veiculo.caixaAccounts = [
    { label: 'Conta corrente', value: input.currentAccountBalance },
    { label: 'Conta investimentos', value: input.investmentsBalance },
    { label: 'Fundo de zeragem', value: input.sweepFundBalance },
  ];
  refreshAggregates(veiculo);
}

export function applyLaminaUpload(veiculo: Veiculo, kind: LaminaUploadKind, fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, '').slice(0, 18) || 'ARQ';
  if (kind === 'cota-subordinada') {
    const sub = veiculo.series.find((s) => s.classe === 'SUB');
    if (!sub) return 'Não há cota subordinada neste veículo.';
    sub.ifCodigo = stem;
    return `Cota subordinada preenchida a partir de ${fileName}.`;
  }
  if (kind === 'cota-senior') {
    const sr = veiculo.series.find((s) => s.classe === 'SR');
    if (!sr) return 'Não há cota sênior neste veículo.';
    sr.ifCodigo = stem;
    return `Cota sênior preenchida a partir de ${fileName}.`;
  }
  const label: CaixaLabel =
    kind === 'conta-corrente'
      ? 'Conta corrente'
      : kind === 'conta-investimentos'
        ? 'Conta investimentos'
        : 'Fundo de zeragem';
  const acc = veiculo.caixaAccounts.find((a) => a.label === label);
  if (acc) acc.value += 10_000;
  refreshAggregates(veiculo);
  return `${label} atualizada a partir de ${fileName}.`;
}
