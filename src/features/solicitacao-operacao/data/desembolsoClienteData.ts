import { CURRENT_USER } from '@/lib/userDisplay';
import type { Solicitacao } from './operacaoData';

/** Etapas internas do Desembolso do Cliente, na ordem em que devem ser concluídas. */
export type EtapaDesembolsoKey =
  | 'SUBIR_ITAU'
  | 'APROVACAO_ITAU_1'
  | 'APROVACAO_ITAU_2'
  | 'SUBIR_BMP'
  | 'APROVACAO_BMP_1'
  | 'APROVACAO_BMP_2'
  | 'ENCARTEIRAR';

export interface EtapaDesembolso {
  key: EtapaDesembolsoKey;
  label: string;
  /** Some da esteira quando o pedido não passa pelo BMP. */
  bmp: boolean;
}

export const ETAPAS_DESEMBOLSO: EtapaDesembolso[] = [
  { key: 'SUBIR_ITAU', label: 'Subir no Itaú', bmp: false },
  { key: 'APROVACAO_ITAU_1', label: '1ª aprovação Itaú', bmp: false },
  { key: 'APROVACAO_ITAU_2', label: '2ª aprovação Itaú', bmp: false },
  { key: 'SUBIR_BMP', label: 'Subir BMP', bmp: true },
  { key: 'APROVACAO_BMP_1', label: '1ª aprovação BMP', bmp: true },
  { key: 'APROVACAO_BMP_2', label: '2ª aprovação BMP', bmp: true },
  { key: 'ENCARTEIRAR', label: 'Encarteirar', bmp: false },
];

/** Remove as três etapas BMP quando o pedido não passa por esse banco. */
export function etapasPara(possuiBmp: boolean): EtapaDesembolso[] {
  return ETAPAS_DESEMBOLSO.filter((etapa) => possuiBmp || !etapa.bmp);
}

export function possuiEtapaBmp(s: Solicitacao): boolean {
  return s.possuiBmp !== false;
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

export interface CardDesembolso {
  solicitacao: Solicitacao;
  concluidas: EtapaDesembolsoKey[];
  atividade: AtividadeDesembolso[];
}

/** Pedidos que já chegaram com alguma etapa marcada (somente demonstração). */
const PROGRESSO_INICIAL: Record<string, EtapaDesembolsoKey[]> = {
  '#1403': ['SUBIR_ITAU', 'APROVACAO_ITAU_1'],
};

const QUANDO_INICIAL: Record<string, Partial<Record<EtapaDesembolsoKey, string>>> = {
  '#1403': {
    SUBIR_ITAU: '20/05/2026 às 11:02:14',
    APROVACAO_ITAU_1: '20/05/2026 às 16:40:33',
  },
};

let seq = 0;

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
  seq += 1;
  return { id: `at-${seq}`, quando, autor, titulo, detalhe };
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

export function atividadeDesfeita(key: EtapaDesembolsoKey, quando = agoraLabel()): AtividadeDesembolso {
  return novaAtividade(
    quando,
    CURRENT_USER.fullName,
    `Etapa desfeita · ${etiquetaEtapa(key)}`,
    'A etapa voltou para pendente. Nenhum e-mail foi reenviado.',
  );
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
    }));
}

/** Próxima etapa liberada, ou null se a esteira interna já acabou. */
export function proximaEtapa(card: CardDesembolso): EtapaDesembolso | null {
  const etapas = etapasPara(possuiEtapaBmp(card.solicitacao));
  return etapas[card.concluidas.length] ?? null;
}
