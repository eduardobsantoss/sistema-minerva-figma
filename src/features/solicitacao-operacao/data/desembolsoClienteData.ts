import { CURRENT_USER } from '@/lib/userDisplay';
import { brl, type Solicitacao } from './operacaoData';

/** Etapas internas do Desembolso do Cliente, na ordem em que devem ser concluídas. */
export type EtapaDesembolsoKey =
  | 'SUBIR_ITAU'
  | 'APROVACAO_ITAU_1'
  | 'APROVACAO_ITAU_2'
  | 'SUBIR_BMP'
  | 'APROVACAO_BMP_1'
  | 'APROVACAO_BMP_2'
  | 'ENCARTEIRAR'
  | 'FINANCEIRO'
  | 'COBRANCA';

export interface EtapaDesembolso {
  key: EtapaDesembolsoKey;
  label: string;
  /**
   * Etapas opcionais. BMP some quando o pedido não passa pelo banco.
   * FINAL (Financeiro + Cobrança) só existe em alguns casos e as duas correm em paralelo,
   * em qualquer ordem, depois de Encarteirar.
   */
  grupo?: 'BMP' | 'FINAL';
}

export const ETAPAS_DESEMBOLSO: EtapaDesembolso[] = [
  { key: 'SUBIR_ITAU', label: 'Subir no Itaú' },
  { key: 'APROVACAO_ITAU_1', label: '1ª aprovação Itaú' },
  { key: 'APROVACAO_ITAU_2', label: '2ª aprovação Itaú' },
  { key: 'SUBIR_BMP', label: 'Subir BMP', grupo: 'BMP' },
  { key: 'APROVACAO_BMP_1', label: '1ª aprovação BMP', grupo: 'BMP' },
  { key: 'APROVACAO_BMP_2', label: '2ª aprovação BMP', grupo: 'BMP' },
  { key: 'ENCARTEIRAR', label: 'Encarteirar' },
  { key: 'FINANCEIRO', label: 'Financeiro', grupo: 'FINAL' },
  { key: 'COBRANCA', label: 'Cobrança', grupo: 'FINAL' },
];

/** Remove as etapas BMP e/ou Financeiro quando o pedido não passa por elas. */
export function etapasPara(possuiBmp: boolean, possuiFinanceiro = false): EtapaDesembolso[] {
  return ETAPAS_DESEMBOLSO.filter((etapa) => {
    if (etapa.grupo === 'BMP') return possuiBmp;
    if (etapa.grupo === 'FINAL') return possuiFinanceiro;
    return true;
  });
}

export function possuiEtapaBmp(s: Solicitacao): boolean {
  return s.possuiBmp !== false;
}

export function possuiEtapaFinanceiro(s: Solicitacao): boolean {
  return s.possuiFinanceiro === true;
}

export function etapasDe(s: Solicitacao): EtapaDesembolso[] {
  return etapasPara(possuiEtapaBmp(s), possuiEtapaFinanceiro(s));
}

/**
 * Etapas liberadas agora: a próxima da sequência ou, depois de Encarteirar,
 * as do grupo final (Financeiro e Cobrança) que ainda faltam.
 */
export function etapasLiberadas(
  etapas: EtapaDesembolso[],
  concluidas: EtapaDesembolsoKey[],
): EtapaDesembolso[] {
  const sequenciais = etapas.filter((e) => e.grupo !== 'FINAL');
  const proximaSequencial = sequenciais.find((e) => !concluidas.includes(e.key));
  if (proximaSequencial) return [proximaSequencial];
  return etapas.filter((e) => e.grupo === 'FINAL' && !concluidas.includes(e.key));
}

export function ehConcluido(s: Solicitacao, concluidas: EtapaDesembolsoKey[]): boolean {
  return etapasDe(s).every((e) => concluidas.includes(e.key));
}

/** Etapas de aprovação (Itaú e BMP) ainda não concluídas. */
export function aprovacoesPendentes(s: Solicitacao, concluidas: EtapaDesembolsoKey[]): boolean {
  return etapasDe(s).some((e) => e.key.startsWith('APROVACAO_') && !concluidas.includes(e.key));
}

export interface ValoresDesembolso {
  nominal: number;
  aquisicao: number;
  vencidos: number;
  aDesembolsar: number;
}

/** Valor a desembolsar = aquisição menos vencidos a abater (o informado na Cobrança, ou o previsto no pedido). */
export function valoresDe(s: Solicitacao, cobranca: CobrancaPayload | null): ValoresDesembolso {
  const nominal = s.valor;
  const aquisicao = s.valorAquisicao ?? s.valor;
  const vencidos = cobranca?.valor ?? s.valorVencido ?? 0;
  return { nominal, aquisicao, vencidos, aDesembolsar: Math.max(aquisicao - vencidos, 0) };
}

/** Pessoas notificadas quando o card entra em Desembolso do Cliente. */
export const DESTINATARIOS_ENTRADA = [
  'tesouraria@ceres.com',
  'operacoes@ceres.com',
  'backoffice@ceres.com',
];

/** Pessoas notificadas ao concluir cada etapa. */
export const DESTINATARIOS_ETAPA: Record<EtapaDesembolsoKey, string[]> = {
  SUBIR_ITAU: ['mesa.itau@ceres.com', 'tesouraria@ceres.com'],
  APROVACAO_ITAU_1: ['credito@ceres.com', 'mesa.itau@ceres.com'],
  APROVACAO_ITAU_2: ['diretoria@ceres.com', 'tesouraria@ceres.com'],
  SUBIR_BMP: ['mesa.bmp@ceres.com', 'tesouraria@ceres.com'],
  APROVACAO_BMP_1: ['credito@ceres.com', 'mesa.bmp@ceres.com'],
  APROVACAO_BMP_2: ['diretoria@ceres.com', 'tesouraria@ceres.com'],
  ENCARTEIRAR: ['controladoria@ceres.com', 'tesouraria@ceres.com', 'operacoes@ceres.com'],
  FINANCEIRO: ['financeiro@ceres.com', 'controladoria@ceres.com'],
  COBRANCA: ['cobranca@ceres.com', 'financeiro@ceres.com'],
};

export function etiquetaEtapa(key: EtapaDesembolsoKey): string {
  return ETAPAS_DESEMBOLSO.find((etapa) => etapa.key === key)?.label ?? key;
}

export interface AtividadeDesembolso {
  id: string;
  quando: string;
  autor: string;
  titulo: string;
  detalhe: string;
}

/** Comentário deixado ao voltar uma etapa. */
export interface ComentarioDesembolso {
  id: string;
  quando: string;
  autor: string;
  /** Última etapa concluída no momento em que a esteira voltou para a 1ª. */
  etapa: EtapaDesembolsoKey;
  /** Quantas etapas estavam concluídas (posição de onde voltou). */
  ordem: number;
  texto: string;
}

export interface DocumentoDesembolso {
  key: 'termo' | 'extrato';
  label: string;
  arquivo: string;
}

export interface EncarteirarPayload {
  comprovante: string;
  /** ISO `yyyy-mm-dd`, como o AdminDateField emite. */
  dataDesembolso: string;
  valorDesembolsado: number;
}

/** Vencidos enviados para abater, informados ao concluir a Cobrança. */
export interface CobrancaPayload {
  valor: number;
}

export interface CardDesembolso {
  solicitacao: Solicitacao;
  concluidas: EtapaDesembolsoKey[];
  atividade: AtividadeDesembolso[];
  comentarios: ComentarioDesembolso[];
  /** Preenchido ao encarteirar; zera se a etapa Encarteirar for desfeita. */
  desembolso: EncarteirarPayload | null;
  /** Preenchido ao concluir a Cobrança; zera quando a esteira volta para a 1ª etapa. */
  cobranca: CobrancaPayload | null;
}

/** Pedidos que já chegaram com alguma etapa marcada (somente demonstração). */
const PROGRESSO_INICIAL: Record<string, EtapaDesembolsoKey[]> = {
  '#1403': [
    'SUBIR_ITAU',
    'APROVACAO_ITAU_1',
    'APROVACAO_ITAU_2',
    'SUBIR_BMP',
    'APROVACAO_BMP_1',
    'APROVACAO_BMP_2',
    'ENCARTEIRAR',
  ],
};

const QUANDO_INICIAL: Record<string, Partial<Record<EtapaDesembolsoKey, string>>> = {
  '#1403': {
    SUBIR_ITAU: '20/05/2026 às 11:02:14',
    APROVACAO_ITAU_1: '20/05/2026 às 16:40:33',
    APROVACAO_ITAU_2: '21/05/2026 às 10:12:48',
    SUBIR_BMP: '21/05/2026 às 14:25:03',
    APROVACAO_BMP_1: '22/05/2026 às 09:48:20',
    APROVACAO_BMP_2: '22/05/2026 às 17:05:11',
    ENCARTEIRAR: '25/05/2026 às 15:30:42',
  },
};

const DESEMBOLSO_INICIAL: Record<string, EncarteirarPayload> = {
  '#1403': {
    comprovante: 'comprovante-pagamento-1403.pdf',
    dataDesembolso: '2026-05-25',
    valorDesembolsado: 2_930_000,
  },
};

const COMENTARIOS_INICIAIS: Record<string, Omit<ComentarioDesembolso, 'id'>[]> = {
  '#1403': [
    {
      quando: '22/05/2026 às 11:20:05',
      autor: 'Marcos Vinícius',
      etapa: 'APROVACAO_BMP_1',
      ordem: 5,
      texto: 'Voltei a esteira para o início porque o extrato anexado estava com o valor desatualizado. Subi o novo e refiz todas as etapas.',
    },
  ],
};

let seq = 0;

function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

export function agoraLabel(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} às ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatDataBr(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

function quandoEntrada(abertura: string): string {
  const [ano, mes, dia] = abertura.split('-');
  if (!ano || !mes || !dia) return agoraLabel();
  return `${dia}/${mes}/${ano} às 09:15:00`;
}

function novaAtividade(
  quando: string,
  autor: string,
  titulo: string,
  detalhe: string,
): AtividadeDesembolso {
  return { id: nextId('at'), quando, autor, titulo, detalhe };
}

export function atividadeEmail(
  key: EtapaDesembolsoKey | 'ENTRADA',
  quando = agoraLabel(),
  autor = CURRENT_USER.fullName,
): AtividadeDesembolso {
  if (key === 'ENTRADA') {
    return novaAtividade(
      quando,
      'Sistema',
      'E-mail enviado · Desembolso do Cliente',
      `Pedido entrou na etapa. Destinatários: ${DESTINATARIOS_ENTRADA.join(', ')}.`,
    );
  }
  const label = etiquetaEtapa(key);
  return novaAtividade(
    quando,
    autor,
    `E-mail enviado · ${label}`,
    `Destinatários: ${DESTINATARIOS_ETAPA[key].join(', ')}.`,
  );
}

export function atividadeCobranca(valor: number, quando = agoraLabel()): AtividadeDesembolso {
  return novaAtividade(
    quando,
    CURRENT_USER.fullName,
    'E-mail enviado · Cobrança',
    `Vencidos enviados para abater: ${brl(valor)}. Destinatários: ${DESTINATARIOS_ETAPA.COBRANCA.join(', ')}.`,
  );
}

/** Registro de quando a esteira volta para a 1ª etapa. */
export function atividadeReiniciada(
  ultima: EtapaDesembolsoKey,
  ordem: number,
  motivo = '',
  quando = agoraLabel(),
): AtividadeDesembolso {
  const base = 'Todas as etapas voltaram para a 1ª. Nenhum e-mail foi reenviado.';
  return novaAtividade(
    quando,
    CURRENT_USER.fullName,
    `Esteira reiniciada · voltou da ${ordem}ª etapa (${etiquetaEtapa(ultima)})`,
    motivo ? `${base} Motivo: ${motivo}` : base,
  );
}

export function novoComentario(
  etapa: EtapaDesembolsoKey,
  ordem: number,
  texto: string,
  quando = agoraLabel(),
  autor: string = CURRENT_USER.fullName,
): ComentarioDesembolso {
  return { id: nextId('cm'), quando, autor, etapa, ordem, texto };
}

export function documentosDe(s: Solicitacao): DocumentoDesembolso[] {
  const slug = s.id.replace('#', '');
  return [
    { key: 'termo', label: 'Termo de cessão assinado', arquivo: `termo-cessao-assinado-${slug}.pdf` },
    { key: 'extrato', label: 'Extrato para desembolso', arquivo: `extrato-desembolso-${slug}.pdf` },
  ];
}

function atividadeInicial(s: Solicitacao): AtividadeDesembolso[] {
  const concluidas = PROGRESSO_INICIAL[s.id] ?? [];
  const quando = QUANDO_INICIAL[s.id] ?? {};
  const emails = [...concluidas]
    .reverse()
    .map((key) => atividadeEmail(key, quando[key] ?? quandoEntrada(s.abertura)));
  return [...emails, atividadeEmail('ENTRADA', quandoEntrada(s.abertura))];
}

/** Cópias locais dos pedidos em Desembolso do Cliente. Não altera o seed compartilhado. */
export function cardsIniciais(lista: Solicitacao[]): CardDesembolso[] {
  return lista
    .filter((s) => s.etapa === 'DESEMBOLSO_CLIENTE')
    .map((s) => ({
      solicitacao: { ...s },
      concluidas: [...(PROGRESSO_INICIAL[s.id] ?? [])],
      atividade: atividadeInicial(s),
      comentarios: (COMENTARIOS_INICIAIS[s.id] ?? []).map((c) => ({ ...c, id: nextId('cm') })),
      desembolso: DESEMBOLSO_INICIAL[s.id] ? { ...DESEMBOLSO_INICIAL[s.id] } : null,
      cobranca: null,
    }));
}
