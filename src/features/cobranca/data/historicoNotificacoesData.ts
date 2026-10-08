export type TipoOperacaoHist = 'CRA' | 'FIDC';
export type MetodoNotificacao = 'Email' | 'WhatsApp' | 'SMS' | 'Telefone' | 'Carta';
export type StatusEnvioHist = 'ENVIADA' | 'FALHOU' | 'PENDENTE' | 'CANCELADA';
export type StatusPagamentoHist = 'LIQUIDADO' | 'PAGO_PARCIAL' | 'VINCENDO' | 'VENCIDO';
export type TipoNotificacaoHist = 'Regua' | 'Cessao' | 'Preventiva';
export type TipoInformacaoHist = 'Cobranca' | 'Cessao' | 'Preventiva' | 'Invalido';

export interface HistoricoNotificacao {
  id: string;
  tipoOperacao: TipoOperacaoHist;
  operacao: string;
  metodo: MetodoNotificacao;
  statusNotificacao: StatusEnvioHist;
  statusPagamento: StatusPagamentoHist;
  tipoNotificacao: TipoNotificacaoHist;
  lastro: string;
  titulo: string;
  dataEnvio: string;
  documentoCedente: string;
  cedente: string;
  documentoSacado: string;
  sacado: string;
  cessaoLiquidada: boolean;
  valor: number;
  contato: string;
  contatoInvalido: boolean;
  assunto: string;
  informacao: string;
  tipoInformacao: TipoInformacaoHist;
}

export const TIPO_OPERACAO_OPTS: TipoOperacaoHist[] = ['CRA', 'FIDC'];
export const METODO_OPTS: MetodoNotificacao[] = ['Email', 'WhatsApp', 'SMS', 'Telefone', 'Carta'];
export const STATUS_ENVIO_OPTS: StatusEnvioHist[] = ['ENVIADA', 'FALHOU', 'PENDENTE', 'CANCELADA'];
export const STATUS_PAGAMENTO_HIST_OPTS: StatusPagamentoHist[] = [
  'LIQUIDADO',
  'PAGO_PARCIAL',
  'VINCENDO',
  'VENCIDO',
];
export const TIPO_NOTIFICACAO_HIST_OPTS: TipoNotificacaoHist[] = ['Regua', 'Cessao', 'Preventiva'];

export function statusEnvioLabel(s: StatusEnvioHist): string {
  return { ENVIADA: 'Enviada', FALHOU: 'Falhou', PENDENTE: 'Pendente', CANCELADA: 'Cancelada' }[s];
}

export function statusEnvioColor(s: StatusEnvioHist): string {
  return {
    ENVIADA: 'var(--success-base)',
    FALHOU: 'var(--danger-base)',
    PENDENTE: 'var(--warning-base)',
    CANCELADA: 'var(--text-muted)',
  }[s];
}

export function statusPagamentoHistLabel(s: StatusPagamentoHist): string {
  return {
    LIQUIDADO: 'Liquidado',
    PAGO_PARCIAL: 'Pago parcial',
    VINCENDO: 'Vincendo',
    VENCIDO: 'Vencido',
  }[s];
}

export function tipoNotificacaoHistLabel(t: TipoNotificacaoHist): string {
  return { Regua: 'Régua', Cessao: 'Cessão', Preventiva: 'Preventiva' }[t];
}

export function tipoInformacaoLabel(t: TipoInformacaoHist): string {
  return { Cobranca: 'Cobrança', Cessao: 'Cessão', Preventiva: 'Preventiva', Invalido: 'Inválido' }[t];
}

export function tipoInformacaoColor(t: TipoInformacaoHist): string {
  return {
    Cobranca: 'var(--gci-base)',
    Cessao: 'var(--agro-base)',
    Preventiva: 'var(--warning-base)',
    Invalido: 'var(--danger-base)',
  }[t];
}

export function brl(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

/** Converte `dd/mm/aaaa` em timestamp local. */
export function parseDataBr(value: string): number {
  const [d, m, y] = value.slice(0, 10).split('/').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
}

export const HISTORICO_NOTIFICACOES_SEED: HistoricoNotificacao[] = [
  {
    id: 'hn-1',
    tipoOperacao: 'CRA',
    operacao: '42ª - CRA Ceres',
    metodo: 'Email',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Preventiva',
    lastro: '297517',
    titulo: '12878-1',
    dataEnvio: '02/10/2026',
    documentoCedente: '12.345.678/0001-90',
    cedente: 'Pedro Ribeiro Merola',
    documentoSacado: '33.444.555/0001-10',
    sacado: 'Supermercado Vila das Frutas Abraao de Morais LTDA',
    cessaoLiquidada: false,
    valor: 1680,
    contato: 'vilaabraao@viladasfrutas.com.br',
    contatoInvalido: false,
    assunto: 'Lembrete de vencimento',
    informacao: 'Enviado ao e-mail do sacado',
    tipoInformacao: 'Preventiva',
  },
  {
    id: 'hn-2',
    tipoOperacao: 'CRA',
    operacao: '42ª - CRA Ceres',
    metodo: 'Telefone',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Preventiva',
    lastro: '297517',
    titulo: '12878-1',
    dataEnvio: '02/10/2026',
    documentoCedente: '12.345.678/0001-90',
    cedente: 'Pedro Ribeiro Merola',
    documentoSacado: '33.444.555/0001-10',
    sacado: 'Supermercado Vila das Frutas Abraao de Morais LTDA',
    cessaoLiquidada: false,
    valor: 1680,
    contato: '+55 11 2780 0135',
    contatoInvalido: false,
    assunto: 'Lembrete de vencimento',
    informacao: 'Contato telefônico confirmado',
    tipoInformacao: 'Preventiva',
  },
  {
    id: 'hn-3',
    tipoOperacao: 'FIDC',
    operacao: 'T.I Tecnologia FIDC',
    metodo: 'Email',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Regua',
    lastro: '302848',
    titulo: '13050-1',
    dataEnvio: '03/10/2026',
    documentoCedente: '56.789.012/0001-34',
    cedente: 'Tech Rural BR',
    documentoSacado: '22.333.444/0001-55',
    sacado: 'Pimenta Verde Alimentos LTDA',
    cessaoLiquidada: false,
    valor: 72685.08,
    contato: 'natanael.moreira@grupolmc.com.br',
    contatoInvalido: false,
    assunto: 'Régua — 7 dias antes do vencimento',
    informacao: 'Disparo da régua padrão',
    tipoInformacao: 'Cobranca',
  },
  {
    id: 'hn-4',
    tipoOperacao: 'CRA',
    operacao: '47ª CRA Carteira',
    metodo: 'Email',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VENCIDO',
    tipoNotificacao: 'Regua',
    lastro: '337688',
    titulo: '19819-3',
    dataEnvio: '04/10/2026',
    documentoCedente: '90.123.456/0001-78',
    cedente: 'Futura Agro',
    documentoSacado: '66.777.888/0001-11',
    sacado: 'Materiais para Construcao Construmais LTDA',
    cessaoLiquidada: false,
    valor: 7395.54,
    contato: 'nilomadeiras@hotmail.com',
    contatoInvalido: false,
    assunto: 'Título vencido',
    informacao: 'E-mail de cobrança após o vencimento',
    tipoInformacao: 'Cobranca',
  },
  {
    id: 'hn-5',
    tipoOperacao: 'CRA',
    operacao: '47ª CRA Carteira',
    metodo: 'Telefone',
    statusNotificacao: 'FALHOU',
    statusPagamento: 'VENCIDO',
    tipoNotificacao: 'Regua',
    lastro: '337688',
    titulo: '19819-3',
    dataEnvio: '04/10/2026',
    documentoCedente: '90.123.456/0001-78',
    cedente: 'Futura Agro',
    documentoSacado: '66.777.888/0001-11',
    sacado: 'Materiais para Construcao Construmais LTDA',
    cessaoLiquidada: false,
    valor: 7395.54,
    contato: '+55 62 99445 0504',
    contatoInvalido: false,
    assunto: 'Título vencido',
    informacao: 'Chamada sem atendimento',
    tipoInformacao: 'Cobranca',
  },
  {
    id: 'hn-6',
    tipoOperacao: 'CRA',
    operacao: '48ª - CRA Carteira',
    metodo: 'Email',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Cessao',
    lastro: '331518',
    titulo: '960-1',
    dataEnvio: '05/10/2026',
    documentoCedente: '23.456.789/0001-01',
    cedente: 'Fazenda Santa Clara',
    documentoSacado: '11.222.333/0001-44',
    sacado: 'Thiago Brocco',
    cessaoLiquidada: false,
    valor: 5704,
    contato: 'eldoradoarmazens@hotmail.com',
    contatoInvalido: false,
    assunto: 'Notificação de cessão',
    informacao: 'Cessão comunicada ao sacado',
    tipoInformacao: 'Cessao',
  },
  {
    id: 'hn-7',
    tipoOperacao: 'CRA',
    operacao: '48ª - CRA Carteira',
    metodo: 'Telefone',
    statusNotificacao: 'FALHOU',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Cessao',
    lastro: '331518',
    titulo: '960-1',
    dataEnvio: '05/10/2026',
    documentoCedente: '23.456.789/0001-01',
    cedente: 'Fazenda Santa Clara',
    documentoSacado: '11.222.333/0001-44',
    sacado: 'Thiago Brocco',
    cessaoLiquidada: false,
    valor: 5704,
    contato: 'Número inválido (005566999956011)',
    contatoInvalido: true,
    assunto: 'Notificação de cessão',
    informacao: 'Número inválido (005566999956011)',
    tipoInformacao: 'Invalido',
  },
  {
    id: 'hn-8',
    tipoOperacao: 'FIDC',
    operacao: 'BOASAFRA FIDC',
    metodo: 'Email',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'LIQUIDADO',
    tipoNotificacao: 'Cessao',
    lastro: '331551',
    titulo: '921-1',
    dataEnvio: '18/09/2026',
    documentoCedente: '45.678.901/0001-23',
    cedente: 'Agro Sandri',
    documentoSacado: '98.765.432/0001-10',
    sacado: 'Joao Buiar Sobrinho',
    cessaoLiquidada: true,
    valor: 4760,
    contato: 'rural@advocon.com.br',
    contatoInvalido: false,
    assunto: 'Notificação de cessão',
    informacao: 'Cessão já liquidada',
    tipoInformacao: 'Cessao',
  },
  {
    id: 'hn-9',
    tipoOperacao: 'FIDC',
    operacao: 'BOASAFRA FIDC',
    metodo: 'SMS',
    statusNotificacao: 'PENDENTE',
    statusPagamento: 'LIQUIDADO',
    tipoNotificacao: 'Cessao',
    lastro: '331551',
    titulo: '921-1',
    dataEnvio: '18/09/2026',
    documentoCedente: '45.678.901/0001-23',
    cedente: 'Agro Sandri',
    documentoSacado: '98.765.432/0001-10',
    sacado: 'Joao Buiar Sobrinho',
    cessaoLiquidada: true,
    valor: 4760,
    contato: 'Número inválido (0055635261105)',
    contatoInvalido: true,
    assunto: 'Notificação de cessão',
    informacao: 'Número inválido (0055635261105)',
    tipoInformacao: 'Invalido',
  },
  {
    id: 'hn-10',
    tipoOperacao: 'CRA',
    operacao: '51ª - CRA Carteira',
    metodo: 'WhatsApp',
    statusNotificacao: 'ENVIADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Preventiva',
    lastro: '443173',
    titulo: 'PM1222026-1',
    dataEnvio: '06/10/2026',
    documentoCedente: '12.345.678/0001-90',
    cedente: 'Pedro Ribeiro Merola',
    documentoSacado: '18.621.277/0001-05',
    sacado: 'Herdade Empreendimentos Imobiliarios SPE',
    cessaoLiquidada: false,
    valor: 3035.95,
    contato: '+55 11 98821 4400',
    contatoInvalido: false,
    assunto: 'Cobrança preventiva',
    informacao: 'Mensagem entregue no WhatsApp',
    tipoInformacao: 'Preventiva',
  },
  {
    id: 'hn-11',
    tipoOperacao: 'CRA',
    operacao: '57ª - CRA Carteira',
    metodo: 'Carta',
    statusNotificacao: 'PENDENTE',
    statusPagamento: 'PAGO_PARCIAL',
    tipoNotificacao: 'Regua',
    lastro: '457687',
    titulo: 'PM1082026-1',
    dataEnvio: '07/10/2026',
    documentoCedente: '30.140.250/0001-61',
    cedente: 'Ceres Trading S.A.',
    documentoSacado: '43.053.220/0001-72',
    sacado: 'Claudio Nasser de Carvalho',
    cessaoLiquidada: false,
    valor: 625.815,
    contato: 'financeiro@cerestrading.com.br',
    contatoInvalido: false,
    assunto: 'Saldo em aberto',
    informacao: 'Carta em fila de postagem',
    tipoInformacao: 'Cobranca',
  },
  {
    id: 'hn-12',
    tipoOperacao: 'FIDC',
    operacao: 'Valoriza FIDC',
    metodo: 'Email',
    statusNotificacao: 'CANCELADA',
    statusPagamento: 'VINCENDO',
    tipoNotificacao: 'Preventiva',
    lastro: '460790',
    titulo: 'PM1092026-1',
    dataEnvio: '01/10/2026',
    documentoCedente: '31.509.494/0001-88',
    cedente: 'Green Farming',
    documentoSacado: '08.345.221/0001-09',
    sacado: 'Allas Solucoes Logisticas LTDA',
    cessaoLiquidada: false,
    valor: 2140.4,
    contato: 'contato@allaslog.com.br',
    contatoInvalido: false,
    assunto: 'Cobrança preventiva',
    informacao: 'Envio cancelado antes do disparo',
    tipoInformacao: 'Preventiva',
  },
];
