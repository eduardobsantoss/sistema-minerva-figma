import { onlyDigits } from '@/features/serasa/utils/serasaFormatters';

export type ModuloSentinela = 'credito' | 'contraparte';
export type TipoEntidade = 'fundo' | 'cra' | 'cedente' | 'sacado';
export type ClasseCredito = 'AA' | 'A' | 'B' | 'C' | 'D';
export type Severidade = 'critico' | 'atencao' | 'ok';
export type TipoAlerta = 'serasa' | 'protesto' | 'concentracao';
export type EscopoSentinela = 'total' | 'fundo' | 'cra' | 'cedente' | 'sacado';
export type AcaoSugerida = 'Solicitar documentação' | 'Notificar gestor' | 'Reavaliar limite';
export type ModoSentinela = 'operacional' | 'gerencial';
export type StatusLote = 'pendente' | 'processando' | 'concluido' | 'com-erros';
export type OrigemLote = 'digitacao' | 'arquivo';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  severidade: Exclude<Severidade, 'ok'>;
  exposicao: number;
  exposicaoAnterior: number;
  acaoSugerida: AcaoSugerida;
  prazo: string;
  disparo: string;
  plano: string;
  responsavel: string;
  notas: string;
  /** Presença do alerta nos 5 meses anteriores ao mês corrente. O mês atual é calculado. */
  presencaAnterior: [number, number, number, number, number];
}

export interface EntidadeMonitorada {
  id: string;
  nome: string;
  documento: string;
  classe: ClasseCredito;
  tipo: TipoEntidade;
  veiculoId: string | null;
  exposicao: number;
  atualizadoEm: string;
  alertas: Alerta[];
}

export interface FiltroSentinela {
  escopo: EscopoSentinela;
  tiposAlerta: TipoAlerta[];
  severidade: '' | Severidade;
  veiculoId: string;
  exposicaoMin: number | null;
  exposicaoMax: number | null;
  periodoInicio: string;
  periodoFim: string;
}

export interface FaixaSeveridade {
  quantidade: number;
  exposicao: number;
}

export interface BlocoAlerta {
  tipo: TipoAlerta;
  quantidade: number;
  exposicao: number;
  exposicaoAnterior: number;
  variacaoPct: number | null;
}

export interface LinhaMonitorada {
  entidade: EntidadeMonitorada;
  severidade: Severidade;
  alertas: Alerta[];
  pctCarteira: number;
  acaoSugerida: AcaoSugerida | null;
  prazo: string | null;
}

export interface PainelSentinela {
  linhas: LinhaMonitorada[];
  total: FaixaSeveridade;
  critico: FaixaSeveridade;
  atencao: FaixaSeveridade;
  ok: FaixaSeveridade;
  blocos: BlocoAlerta[];
  evolucao: number[];
  topConcentracao: { nome: string; exposicao: number }[];
  alertas: Alerta[];
}

export interface ItemLote {
  cnpj: string;
  valido: boolean;
  resultado: string;
}

export interface LoteConsulta {
  id: string;
  criadoEm: string;
  status: StatusLote;
  origem: OrigemLote;
  arquivo?: string;
  itens: ItemLote[];
}

export interface VeiculoOpcao {
  id: string;
  nome: string;
  tipo: 'fundo' | 'cra';
}

const DV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const DV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function checkDigit(nums: string, factors: number[]): number {
  const sum = factors.reduce((acc, factor, index) => acc + Number(nums[index]) * factor, 0);
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function cnpjFromBase(base12: string): string {
  const base = onlyDigits(base12).slice(0, 12);
  const d1 = checkDigit(base, DV1);
  const d2 = checkDigit(`${base}${d1}`, DV2);
  return `${base}${d1}${d2}`;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  const base = digits.slice(0, 12);
  const d1 = checkDigit(base, DV1);
  const d2 = checkDigit(`${base}${d1}`, DV2);
  return digits.slice(12) === `${d1}${d2}`;
}

export const FILTRO_VAZIO: FiltroSentinela = {
  escopo: 'total',
  tiposAlerta: [],
  severidade: '',
  veiculoId: '',
  exposicaoMin: null,
  exposicaoMax: null,
  periodoInicio: '',
  periodoFim: '',
};

export const ESCOPO_OPCOES: { key: EscopoSentinela; label: string }[] = [
  { key: 'total', label: 'Total' },
  { key: 'fundo', label: 'Fundo' },
  { key: 'cra', label: 'CRA' },
  { key: 'cedente', label: 'Cedente' },
  { key: 'sacado', label: 'Sacado' },
];

export const MODO_OPCOES: { key: ModoSentinela; label: string }[] = [
  { key: 'operacional', label: 'Operacional' },
  { key: 'gerencial', label: 'Gerencial' },
];

export const BLOQUEIO_PHRASE = 'BLOQUEAR-OPERACOES';

export const TIPO_ALERTA_LABEL: Record<TipoAlerta, string> = {
  serasa: 'Negativação Serasa',
  protesto: 'Protesto',
  concentracao: 'Concentração',
};

export const TIPO_ENTIDADE_LABEL: Record<TipoEntidade, string> = {
  fundo: 'Fundo',
  cra: 'CRA',
  cedente: 'Cedente',
  sacado: 'Sacado',
};

export const SEVERIDADE_LABEL: Record<Severidade, string> = {
  critico: 'Crítico',
  atencao: 'Atenção',
  ok: 'Ok',
};

export const STATUS_LOTE_LABEL: Record<StatusLote, string> = {
  pendente: 'Pendente',
  processando: 'Processando',
  concluido: 'Concluído',
  'com-erros': 'Com erros',
};

const SEV_RANK: Record<Severidade, number> = { critico: 0, atencao: 1, ok: 2 };

export function tiposDoModulo(modulo: ModuloSentinela): TipoAlerta[] {
  if (modulo === 'contraparte') return ['serasa', 'protesto'];
  return ['serasa', 'protesto', 'concentracao'];
}

export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '—';
  const [date] = iso.split('T');
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function variacaoPct(atual: number, anterior: number): number | null {
  if (anterior === 0) return atual === 0 ? 0 : null;
  return ((atual - anterior) / anterior) * 100;
}

export function labelsEvolucao(ref = new Date(2026, 9, 1)): string[] {
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const labels: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    labels.push(`${meses[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`);
  }
  return labels;
}

function alerta(
  partial: Omit<Alerta, 'id' | 'presencaAnterior'> & { presencaAnterior?: Alerta['presencaAnterior'] },
): Alerta {
  alertaSeq += 1;
  return {
    presencaAnterior: [0, 0, 1, 1, 1],
    ...partial,
    id: `al-${alertaSeq}`,
  };
}

let alertaSeq = 0;

const PERSISTENTE: Alerta['presencaAnterior'] = [1, 1, 1, 1, 1];
const CRESCENTE: Alerta['presencaAnterior'] = [0, 0, 1, 1, 1];
const RECENTE: Alerta['presencaAnterior'] = [0, 0, 0, 1, 1];

export const ENTIDADES_SEED: EntidadeMonitorada[] = [
  {
    id: 'f1',
    nome: 'Fundo Exemplo 01',
    documento: cnpjFromBase('100000010001'),
    classe: 'B',
    tipo: 'fundo',
    veiculoId: null,
    exposicao: 48_200_000,
    atualizadoEm: '2026-10-13',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 18_400_000,
        exposicaoAnterior: 15_100_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-18',
        disparo: 'Cedente Exemplo 01 passou de 35% da carteira do fundo.',
        plano: 'Revisar o limite do cedente e redistribuir novas cessões.',
        responsavel: 'Marina Exemplo',
        notas: 'Concentração acima do teto interno de 30%.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'f2',
    nome: 'Fundo Exemplo 02',
    documento: cnpjFromBase('100000010002'),
    classe: 'A',
    tipo: 'fundo',
    veiculoId: null,
    exposicao: 32_750_000,
    atualizadoEm: '2026-10-12',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'atencao',
        exposicao: 6_200_000,
        exposicaoAnterior: 6_800_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-28',
        disparo: 'Maior sacado representa 19% do fundo, perto do teto de 20%.',
        plano: 'Acompanhar novas aquisições até o fechamento do mês.',
        responsavel: 'Pedro Exemplo',
        notas: 'Exposição recuou em relação ao mês anterior.',
        presencaAnterior: CRESCENTE,
      }),
    ],
  },
  {
    id: 'f3',
    nome: 'Fundo Exemplo 03',
    documento: cnpjFromBase('100000010003'),
    classe: 'C',
    tipo: 'fundo',
    veiculoId: null,
    exposicao: 21_300_000,
    atualizadoEm: '2026-10-11',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 9_900_000,
        exposicaoAnterior: 7_400_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-17',
        disparo: 'Dois cedentes somam 46% do patrimônio monitorado.',
        plano: 'Notificar o gestor e travar novas cessões desses cedentes.',
        responsavel: 'Helena Exemplo',
        notas: 'Sem plano de diluição registrado.',
        presencaAnterior: RECENTE,
      }),
    ],
  },
  {
    id: 'f4',
    nome: 'Fundo Exemplo 04',
    documento: cnpjFromBase('100000010004'),
    classe: 'AA',
    tipo: 'fundo',
    veiculoId: null,
    exposicao: 15_600_000,
    atualizadoEm: '2026-10-10',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'atencao',
        exposicao: 3_100_000,
        exposicaoAnterior: 2_900_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-30',
        disparo: 'CRA lastreado no fundo concentra 20% de um único grupo.',
        plano: 'Pedir composição atualizada do grupo econômico.',
        responsavel: 'Marina Exemplo',
        notas: 'Variação pequena, ainda dentro da faixa de atenção.',
        presencaAnterior: CRESCENTE,
      }),
    ],
  },
  {
    id: 'c1',
    nome: 'CRA Exemplo 01',
    documento: cnpjFromBase('100000020001'),
    classe: 'B',
    tipo: 'cra',
    veiculoId: null,
    exposicao: 27_400_000,
    atualizadoEm: '2026-10-13',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 11_200_000,
        exposicaoAnterior: 9_500_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-19',
        disparo: 'Um devedor responde por 41% dos recebíveis do CRA.',
        plano: 'Reavaliar o limite do devedor e comunicar a securitizadora.',
        responsavel: 'Pedro Exemplo',
        notas: 'Lastro agrícola da safra corrente.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'c2',
    nome: 'CRA Exemplo 02',
    documento: cnpjFromBase('100000020002'),
    classe: 'A',
    tipo: 'cra',
    veiculoId: null,
    exposicao: 18_900_000,
    atualizadoEm: '2026-10-09',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'atencao',
        exposicao: 4_400_000,
        exposicaoAnterior: 4_400_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-29',
        disparo: 'Concentração estável em 23% no maior cedente.',
        plano: 'Manter acompanhamento semanal até a próxima cessão.',
        responsavel: 'Helena Exemplo',
        notas: 'Sem alta relevante no período.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'c3',
    nome: 'CRA Exemplo 03',
    documento: cnpjFromBase('100000020003'),
    classe: 'C',
    tipo: 'cra',
    veiculoId: null,
    exposicao: 12_800_000,
    atualizadoEm: '2026-10-08',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 5_600_000,
        exposicaoAnterior: 4_100_000,
        acaoSugerida: 'Notificar gestor',
        prazo: '2026-10-16',
        disparo: 'Grupo econômico ultrapassou 40% do CRA.',
        plano: 'Notificar o gestor e pedir plano de diluição em 15 dias.',
        responsavel: 'Marina Exemplo',
        notas: 'Alta veio de uma cessão única no início do mês.',
        presencaAnterior: RECENTE,
      }),
    ],
  },
  {
    id: 'c4',
    nome: 'CRA Exemplo 04',
    documento: cnpjFromBase('100000020004'),
    classe: 'AA',
    tipo: 'cra',
    veiculoId: null,
    exposicao: 9_250_000,
    atualizadoEm: '2026-10-07',
    alertas: [],
  },
  {
    id: 'ced1',
    nome: 'Cedente Exemplo 01',
    documento: cnpjFromBase('100000030001'),
    classe: 'C',
    tipo: 'cedente',
    veiculoId: 'f1',
    exposicao: 8_400_000,
    atualizadoEm: '2026-10-13',
    alertas: [
      alerta({
        tipo: 'serasa',
        severidade: 'critico',
        exposicao: 2_100_000,
        exposicaoAnterior: 1_400_000,
        acaoSugerida: 'Solicitar documentação',
        prazo: '2026-10-18',
        disparo: 'Nova negativação Serasa de R$ 2,1 mi em aberto.',
        plano: 'Solicitar comprovantes e esclarecimento do cedente em 5 dias.',
        responsavel: 'Marina Exemplo',
        notas: 'Apontamento não existia na consulta anterior.',
        presencaAnterior: RECENTE,
      }),
      alerta({
        tipo: 'protesto',
        severidade: 'critico',
        exposicao: 900_000,
        exposicaoAnterior: 900_000,
        acaoSugerida: 'Notificar gestor',
        prazo: '2026-10-18',
        disparo: 'Protesto ativo em cartório do estado de origem.',
        plano: 'Notificar o gestor e confirmar se há sustação em andamento.',
        responsavel: 'Pedro Exemplo',
        notas: 'Valor do protesto estável desde o mês passado.',
        presencaAnterior: PERSISTENTE,
      }),
      alerta({
        tipo: 'concentracao',
        severidade: 'atencao',
        exposicao: 3_200_000,
        exposicaoAnterior: 2_600_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-25',
        disparo: 'Participação do cedente no Fundo Exemplo 01 chegou a 17%.',
        plano: 'Reavaliar o limite antes da próxima cessão.',
        responsavel: 'Helena Exemplo',
        notas: 'Concentração sobe junto com a negativação.',
        presencaAnterior: CRESCENTE,
      }),
    ],
  },
  {
    id: 'ced2',
    nome: 'Cedente Exemplo 02',
    documento: cnpjFromBase('100000030002'),
    classe: 'B',
    tipo: 'cedente',
    veiculoId: 'f1',
    exposicao: 6_100_000,
    atualizadoEm: '2026-10-12',
    alertas: [
      alerta({
        tipo: 'serasa',
        severidade: 'atencao',
        exposicao: 800_000,
        exposicaoAnterior: 1_100_000,
        acaoSugerida: 'Solicitar documentação',
        prazo: '2026-10-27',
        disparo: 'Restrição Serasa reduzida, ainda acima do piso de atenção.',
        plano: 'Pedir carta de anuência e atualizar o dossiê.',
        responsavel: 'Pedro Exemplo',
        notas: 'Valor apontado caiu no período.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'ced3',
    nome: 'Cedente Exemplo 03',
    documento: cnpjFromBase('100000030003'),
    classe: 'B',
    tipo: 'cedente',
    veiculoId: 'f2',
    exposicao: 7_750_000,
    atualizadoEm: '2026-10-11',
    alertas: [
      alerta({
        tipo: 'protesto',
        severidade: 'critico',
        exposicao: 1_600_000,
        exposicaoAnterior: 1_200_000,
        acaoSugerida: 'Notificar gestor',
        prazo: '2026-10-17',
        disparo: 'Novo protesto somado ao apontamento já existente.',
        plano: 'Notificar o gestor e suspender a análise de novas operações.',
        responsavel: 'Helena Exemplo',
        notas: 'Cedente não respondeu o contato da semana passada.',
        presencaAnterior: CRESCENTE,
      }),
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 2_800_000,
        exposicaoAnterior: 2_200_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-17',
        disparo: 'Cedente representa 24% do Fundo Exemplo 02.',
        plano: 'Rever o limite e registrar a decisão do comitê.',
        responsavel: 'Marina Exemplo',
        notas: 'Concentração e protesto no mesmo cedente.',
        presencaAnterior: RECENTE,
      }),
    ],
  },
  {
    id: 'ced4',
    nome: 'Cedente Exemplo 04',
    documento: cnpjFromBase('100000030004'),
    classe: 'D',
    tipo: 'cedente',
    veiculoId: 'f3',
    exposicao: 5_400_000,
    atualizadoEm: '2026-10-10',
    alertas: [
      alerta({
        tipo: 'serasa',
        severidade: 'critico',
        exposicao: 1_900_000,
        exposicaoAnterior: 1_500_000,
        acaoSugerida: 'Solicitar documentação',
        prazo: '2026-10-16',
        disparo: 'Negativação Serasa cobrindo 35% da exposição do cedente.',
        plano: 'Solicitar balancete e relação de restrições atualizada.',
        responsavel: 'Pedro Exemplo',
        notas: 'Classe D, prioridade da fila operacional.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'ced5',
    nome: 'Cedente Exemplo 05',
    documento: cnpjFromBase('100000030005'),
    classe: 'A',
    tipo: 'cedente',
    veiculoId: 'c1',
    exposicao: 4_200_000,
    atualizadoEm: '2026-10-09',
    alertas: [
      alerta({
        tipo: 'protesto',
        severidade: 'atencao',
        exposicao: 450_000,
        exposicaoAnterior: 600_000,
        acaoSugerida: 'Notificar gestor',
        prazo: '2026-10-26',
        disparo: 'Protesto de baixo valor, em queda no período.',
        plano: 'Confirmar baixa com o cartório na próxima rodada.',
        responsavel: 'Helena Exemplo',
        notas: 'Cedente segue operando dentro da classe A.',
        presencaAnterior: CRESCENTE,
      }),
    ],
  },
  {
    id: 'ced6',
    nome: 'Cedente Exemplo 06',
    documento: cnpjFromBase('100000030006'),
    classe: 'C',
    tipo: 'cedente',
    veiculoId: 'c1',
    exposicao: 9_800_000,
    atualizadoEm: '2026-10-08',
    alertas: [
      alerta({
        tipo: 'concentracao',
        severidade: 'critico',
        exposicao: 4_700_000,
        exposicaoAnterior: 3_100_000,
        acaoSugerida: 'Reavaliar limite',
        prazo: '2026-10-20',
        disparo: 'Cedente concentra 48% dos recebíveis do CRA Exemplo 01.',
        plano: 'Reavaliar o limite e impedir novas cessões até a diluição.',
        responsavel: 'Marina Exemplo',
        notas: 'Sem negativação ou protesto. O alerta é só de concentração.',
        presencaAnterior: RECENTE,
      }),
    ],
  },
  {
    id: 'ced7',
    nome: 'Cedente Exemplo 07',
    documento: cnpjFromBase('100000030007'),
    classe: 'B',
    tipo: 'cedente',
    veiculoId: 'c2',
    exposicao: 3_600_000,
    atualizadoEm: '2026-10-07',
    alertas: [
      alerta({
        tipo: 'serasa',
        severidade: 'atencao',
        exposicao: 320_000,
        exposicaoAnterior: 300_000,
        acaoSugerida: 'Solicitar documentação',
        prazo: '2026-10-31',
        disparo: 'Anotação Serasa de pequeno valor, recorrente.',
        plano: 'Solicitar comprovante de regularização.',
        responsavel: 'Pedro Exemplo',
        notas: 'Valor estável, sem escalada.',
        presencaAnterior: PERSISTENTE,
      }),
    ],
  },
  {
    id: 'ced8',
    nome: 'Cedente Exemplo 08',
    documento: cnpjFromBase('100000030008'),
    classe: 'A',
    tipo: 'cedente',
    veiculoId: 'c3',
    exposicao: 6_900_000,
    atualizadoEm: '2026-10-06',
    alertas: [
      alerta({
        tipo: 'serasa',
        severidade: 'critico',
        exposicao: 2_400_000,
        exposicaoAnterior: 2_000_000,
        acaoSugerida: 'Solicitar documentação',
        prazo: '2026-10-15',
        disparo: 'Negativação Serasa nova, acima de R$ 2 mi.',
        plano: 'Solicitar defesa do cedente e documentos da dívida.',
        responsavel: 'Helena Exemplo',
        notas: 'Prazo mais curto da fila.',
        presencaAnterior: RECENTE,
      }),
      alerta({
        tipo: 'protesto',
        severidade: 'critico',
        exposicao: 1_100_000,
        exposicaoAnterior: 700_000,
        acaoSugerida: 'Notificar gestor',
        prazo: '2026-10-15',
        disparo: 'Protesto ampliado em relação à consulta anterior.',
        plano: 'Notificar o gestor no mesmo dia da tratativa.',
        responsavel: 'Marina Exemplo',
        notas: 'Protesto e Serasa no mesmo CNPJ.',
        presencaAnterior: CRESCENTE,
      }),
    ],
  },
  {
    id: 'sac1',
    nome: 'Sacado Exemplo 01',
    documento: cnpjFromBase('100000040001'),
    classe: 'A',
    tipo: 'sacado',
    veiculoId: 'f1',
    exposicao: 2_200_000,
    atualizadoEm: '2026-10-13',
    alertas: [],
  },
  {
    id: 'sac2',
    nome: 'Sacado Exemplo 02',
    documento: cnpjFromBase('100000040002'),
    classe: 'AA',
    tipo: 'sacado',
    veiculoId: 'f2',
    exposicao: 1_800_000,
    atualizadoEm: '2026-10-12',
    alertas: [],
  },
  {
    id: 'sac3',
    nome: 'Sacado Exemplo 03',
    documento: cnpjFromBase('100000040003'),
    classe: 'B',
    tipo: 'sacado',
    veiculoId: 'c1',
    exposicao: 2_600_000,
    atualizadoEm: '2026-10-11',
    alertas: [],
  },
  {
    id: 'sac4',
    nome: 'Sacado Exemplo 04',
    documento: cnpjFromBase('100000040004'),
    classe: 'A',
    tipo: 'sacado',
    veiculoId: 'c2',
    exposicao: 1_450_000,
    atualizadoEm: '2026-10-10',
    alertas: [],
  },
  {
    id: 'sac5',
    nome: 'Sacado Exemplo 05',
    documento: cnpjFromBase('100000040005'),
    classe: 'AA',
    tipo: 'sacado',
    veiculoId: 'f4',
    exposicao: 980_000,
    atualizadoEm: '2026-10-09',
    alertas: [],
  },
];

const ENTIDADE_POR_ID = new Map(ENTIDADES_SEED.map((entidade) => [entidade.id, entidade]));

export function veiculosSeed(): VeiculoOpcao[] {
  return ENTIDADES_SEED.filter((entidade): entidade is EntidadeMonitorada & { tipo: 'fundo' | 'cra' } =>
    entidade.tipo === 'fundo' || entidade.tipo === 'cra',
  ).map((entidade) => ({ id: entidade.id, nome: entidade.nome, tipo: entidade.tipo }));
}

export function alertasVisiveis(
  entidade: EntidadeMonitorada,
  modulo: ModuloSentinela,
  tipos: TipoAlerta[] = [],
): Alerta[] {
  const permitidos = new Set(tiposDoModulo(modulo));
  return entidade.alertas.filter((item) => {
    if (!permitidos.has(item.tipo)) return false;
    if (tipos.length > 0 && !tipos.includes(item.tipo)) return false;
    return true;
  });
}

export function severidadeDe(alertas: Alerta[]): Severidade {
  if (alertas.some((item) => item.severidade === 'critico')) return 'critico';
  if (alertas.some((item) => item.severidade === 'atencao')) return 'atencao';
  return 'ok';
}

function piorAlerta(alertas: Alerta[]): Alerta | undefined {
  return [...alertas].sort((a, b) => {
    const bySev = SEV_RANK[a.severidade] - SEV_RANK[b.severidade];
    if (bySev !== 0) return bySev;
    return b.exposicao - a.exposicao;
  })[0];
}

function noEscopo(entidade: EntidadeMonitorada, modulo: ModuloSentinela, escopo: EscopoSentinela): boolean {
  if (modulo === 'credito') {
    if (escopo === 'total') return true;
    return entidade.tipo === escopo;
  }
  if (entidade.tipo !== 'cedente' && entidade.tipo !== 'sacado') return false;
  if (escopo === 'total') return true;
  if (escopo === 'cedente' || escopo === 'sacado') return entidade.tipo === escopo;
  const veiculo = entidade.veiculoId ? ENTIDADE_POR_ID.get(entidade.veiculoId) : undefined;
  return veiculo?.tipo === escopo;
}

function noVeiculo(entidade: EntidadeMonitorada, modulo: ModuloSentinela, veiculoId: string): boolean {
  if (!veiculoId) return true;
  if (modulo === 'contraparte') return entidade.veiculoId === veiculoId;
  return entidade.id === veiculoId || entidade.veiculoId === veiculoId;
}

function noPeriodo(atualizadoEm: string, inicio: string, fim: string): boolean {
  if (inicio && atualizadoEm < inicio) return false;
  if (fim && atualizadoEm > fim) return false;
  return true;
}

export function montarPainel(modulo: ModuloSentinela, filtro: FiltroSentinela): PainelSentinela {
  const candidatos = ENTIDADES_SEED.filter((entidade) => {
    if (!noEscopo(entidade, modulo, filtro.escopo)) return false;
    if (!noVeiculo(entidade, modulo, filtro.veiculoId)) return false;
    if (!noPeriodo(entidade.atualizadoEm, filtro.periodoInicio, filtro.periodoFim)) return false;
    if (filtro.exposicaoMin != null && entidade.exposicao < filtro.exposicaoMin) return false;
    if (filtro.exposicaoMax != null && entidade.exposicao > filtro.exposicaoMax) return false;
    const alertas = alertasVisiveis(entidade, modulo, filtro.tiposAlerta);
    if (filtro.tiposAlerta.length > 0 && alertas.length === 0) return false;
    const severidade = severidadeDe(alertasVisiveis(entidade, modulo, filtro.tiposAlerta));
    if (filtro.severidade && severidade !== filtro.severidade) return false;
    return true;
  });

  const exposicaoTotal = candidatos.reduce((sum, entidade) => sum + entidade.exposicao, 0);
  const linhas: LinhaMonitorada[] = candidatos
    .map((entidade) => {
      const alertas = alertasVisiveis(entidade, modulo, filtro.tiposAlerta);
      const pior = piorAlerta(alertas);
      return {
        entidade,
        severidade: severidadeDe(alertas),
        alertas,
        pctCarteira: exposicaoTotal > 0 ? (entidade.exposicao / exposicaoTotal) * 100 : 0,
        acaoSugerida: pior?.acaoSugerida ?? null,
        prazo: pior?.prazo ?? null,
      };
    })
    .sort((a, b) => {
      const bySev = SEV_RANK[a.severidade] - SEV_RANK[b.severidade];
      if (bySev !== 0) return bySev;
      return b.entidade.exposicao - a.entidade.exposicao;
    });

  const faixa = (severidade: Severidade): FaixaSeveridade => {
    const itens = linhas.filter((linha) => linha.severidade === severidade);
    return {
      quantidade: itens.length,
      exposicao: itens.reduce((sum, linha) => sum + linha.entidade.exposicao, 0),
    };
  };

  const alertas = linhas.flatMap((linha) => linha.alertas);
  const blocos = tiposDoModulo(modulo).map((tipo) => {
    const itens = alertas.filter((item) => item.tipo === tipo);
    const exposicao = itens.reduce((sum, item) => sum + item.exposicao, 0);
    const exposicaoAnterior = itens.reduce((sum, item) => sum + item.exposicaoAnterior, 0);
    return {
      tipo,
      quantidade: itens.length,
      exposicao,
      exposicaoAnterior,
      variacaoPct: variacaoPct(exposicao, exposicaoAnterior),
    };
  });

  const prior = [0, 0, 0, 0, 0];
  for (const item of alertas) {
    item.presencaAnterior.forEach((valor, index) => {
      prior[index] += valor;
    });
  }

  const topConcentracao = linhas
    .map((linha) => {
      const concentracao = linha.alertas.find((item) => item.tipo === 'concentracao');
      if (!concentracao) return null;
      return { nome: linha.entidade.nome, exposicao: concentracao.exposicao };
    })
    .filter((item): item is { nome: string; exposicao: number } => item != null)
    .sort((a, b) => b.exposicao - a.exposicao)
    .slice(0, 10);

  return {
    linhas,
    total: {
      quantidade: linhas.length,
      exposicao: exposicaoTotal,
    },
    critico: faixa('critico'),
    atencao: faixa('atencao'),
    ok: faixa('ok'),
    blocos,
    evolucao: [...prior, alertas.length],
    topConcentracao,
    alertas,
  };
}

export function variacaoDoPainel(painel: PainelSentinela): number | null {
  const atual = painel.blocos.reduce((sum, bloco) => sum + bloco.exposicao, 0);
  const anterior = painel.blocos.reduce((sum, bloco) => sum + bloco.exposicaoAnterior, 0);
  return variacaoPct(atual, anterior);
}

export function rotuloRecorte(filtro: FiltroSentinela): string {
  if (filtro.veiculoId) {
    return ENTIDADE_POR_ID.get(filtro.veiculoId)?.nome ?? 'veículo';
  }
  if (filtro.escopo === 'total') return 'Total';
  if (filtro.escopo === 'fundo') return 'Fundos';
  if (filtro.escopo === 'cra') return 'CRAs';
  if (filtro.escopo === 'cedente') return 'Cedentes';
  return 'Sacados';
}

export function linhasPorIds(ids: string[], modulo: ModuloSentinela): LinhaMonitorada[] {
  const wanted = new Set(ids);
  const selecionadas = ENTIDADES_SEED.filter((entidade) => wanted.has(entidade.id));
  const exposicaoTotal = selecionadas.reduce((sum, entidade) => sum + entidade.exposicao, 0);
  return selecionadas.map((entidade) => {
    const alertas = alertasVisiveis(entidade, modulo);
    const pior = piorAlerta(alertas);
    return {
      entidade,
      severidade: severidadeDe(alertas),
      alertas,
      pctCarteira: exposicaoTotal > 0 ? (entidade.exposicao / exposicaoTotal) * 100 : 0,
      acaoSugerida: pior?.acaoSugerida ?? null,
      prazo: pior?.prazo ?? null,
    };
  });
}

function itemLote(cnpj: string, resultado: string, valido = true): ItemLote {
  return { cnpj: onlyDigits(cnpj), valido, resultado };
}

export function resultadoConsulta(cnpj: string): string {
  const digits = onlyDigits(cnpj);
  if (!isValidCnpj(digits)) return 'CNPJ inválido';
  return Number(digits[7]) % 2 === 0 ? 'Negativação encontrada' : 'Sem apontamentos';
}

export function montarLote(cnpjs: string[], origem: OrigemLote, arquivo?: string): LoteConsulta {
  const itens = cnpjs.map((cnpj) => {
    const digits = onlyDigits(cnpj);
    const valido = isValidCnpj(digits);
    return itemLote(digits, resultadoConsulta(digits), valido);
  });
  const temErro = itens.some((item) => !item.valido);
  return {
    id: `lote-${Date.now()}`,
    criadoEm: new Date().toISOString(),
    status: temErro ? 'com-erros' : 'concluido',
    origem,
    arquivo,
    itens,
  };
}

export function resumoLote(lote: LoteConsulta): string {
  const quantidade = lote.itens.length;
  const rotulo = quantidade === 1 ? 'CNPJ' : 'CNPJs';
  if (lote.status === 'pendente') return `${quantidade} ${rotulo} na fila`;
  if (lote.status === 'processando') return `${quantidade} ${rotulo} em processamento`;
  const erros = lote.itens.filter((item) => !item.valido).length;
  if (lote.status === 'com-erros') return `${quantidade} ${rotulo} · ${erros} com erro`;
  const apontamentos = lote.itens.filter((item) => item.resultado === 'Negativação encontrada').length;
  return `${quantidade} ${rotulo} · ${apontamentos} com apontamento`;
}

export function lotesIniciais(): LoteConsulta[] {
  return [
    {
      id: 'lote-seed-1',
      criadoEm: '2026-10-13T14:10:00',
      status: 'concluido',
      origem: 'digitacao',
      itens: [
        itemLote(cnpjFromBase('100000030001'), 'Negativação encontrada'),
        itemLote(cnpjFromBase('100000030002'), 'Sem apontamentos'),
        itemLote(cnpjFromBase('100000040001'), 'Sem apontamentos'),
      ],
    },
    {
      id: 'lote-seed-2',
      criadoEm: '2026-10-12T09:40:00',
      status: 'processando',
      origem: 'arquivo',
      arquivo: 'lista-exemplo-02.csv',
      itens: [
        itemLote(cnpjFromBase('100000030003'), 'Aguardando retorno'),
        itemLote(cnpjFromBase('100000030004'), 'Aguardando retorno'),
        itemLote(cnpjFromBase('100000030005'), 'Aguardando retorno'),
        itemLote(cnpjFromBase('100000030006'), 'Aguardando retorno'),
      ],
    },
    {
      id: 'lote-seed-3',
      criadoEm: '2026-10-11T16:05:00',
      status: 'com-erros',
      origem: 'arquivo',
      arquivo: 'lista-exemplo-03.csv',
      itens: [
        itemLote(cnpjFromBase('100000030007'), 'Sem apontamentos'),
        itemLote('11111111111111', 'CNPJ inválido', false),
        itemLote('123', 'CNPJ inválido', false),
      ],
    },
    {
      id: 'lote-seed-4',
      criadoEm: '2026-10-10T11:20:00',
      status: 'pendente',
      origem: 'digitacao',
      itens: [
        itemLote(cnpjFromBase('100000040002'), 'Aguardando retorno'),
        itemLote(cnpjFromBase('100000040003'), 'Aguardando retorno'),
      ],
    },
  ];
}

export const MODELO_CSV = `cnpj\n${cnpjFromBase('100000030001')}\n${cnpjFromBase('100000040001')}\n`;
