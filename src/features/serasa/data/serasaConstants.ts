import type { CreditQueryStatus, SerasaProcessStatus } from './serasaTypes';

export const CATEGORY_LABELS: Record<string, string> = {
  financialPendencies: 'Pendências financeiras (Pefin)',
  convem: 'Pendências financeiras (Pefin)',
  financialRestrictions: 'Restrições financeiras (Refin)',
  protest: 'Protestos',
  ccf: 'Cheques sem fundo',
  acheiRecheque: 'Cheques sem fundo',
  judicialAction: 'Ações judiciais (restrição)',
};

export const CHEQUE_CATEGORIES = new Set(['ccf', 'acheiRecheque']);

export const PROTEST_CATEGORY = 'protest';

export function categoryLabel(category: string, message?: string): string {
  return CATEGORY_LABELS[category] ?? message ?? 'Outras ocorrências';
}

export function queryStatusTone(status: CreditQueryStatus): { bg: string; fg: string } {
  switch (status) {
    case 'Completed':
      return { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' };
    case 'Processing':
      return { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' };
    case 'Failed':
      return { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' };
    case 'Expired':
      return { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' };
    default:
      return { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' };
  }
}

export function processStatusTone(status: SerasaProcessStatus): { bg: string; fg: string } {
  if (status === 'Ativo' || status === 'Distribuido' || status === 'Execucao') {
    return { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' };
  }
  if (status === 'Baixado' || status === 'Arquivado' || status === 'Encerrado' || status === 'Finalizado') {
    return { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' };
  }
  if (status === 'EmGrauDeRecurso' || status === 'Suspenso') {
    return { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' };
  }
  return { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' };
}

export const DATASET_LABELS: Record<string, string> = {
  AGRO_SCORE_CPF: 'Score Agro (CPF)',
  AGRO_SCORE_CNPJ: 'Score Agro (CNPJ)',
  BASIC_INFO: 'Dados cadastrais',
  SERASA: 'Restrições Serasa',
  PROCESS: 'Processos judiciais',
};

export const DEMO_DOCUMENTS = {
  pfCompleto: '12345678901',
  pjCompleto: '12345678000190',
  semRestricoes: '98765432100',
  failed: '11111111111',
  expired: '22222222222',
} as const;
