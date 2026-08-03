import type {
  CreditQueryByDocumentResponse,
  DatasetProgress,
  GetOrCreateResponse,
  PollQueryResponse,
} from '../data/serasaTypes';
import {
  buildByDocumentResponse,
  latestForScenario,
  MOCK_PF_COMPLETO,
  resolveScenario,
} from '../data/serasaMocks';
import { onlyDigits } from '../utils/serasaFormatters';

const DELAY_MS = 1200;
const POLL_INTERVAL_MS = 3000;

interface ProcessingState {
  queryId: number;
  externalId: string;
  document: string;
  pollStep: number;
  datasets: DatasetProgress[];
}

const processingStore = new Map<number, ProcessingState>();

let nextQueryId = 5000;

function delay(ms = DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultDatasets(isCnpj: boolean): DatasetProgress[] {
  return [
    { name: isCnpj ? 'AGRO_SCORE_CNPJ' : 'AGRO_SCORE_CPF', status: 'Pending' },
    { name: 'BASIC_INFO', status: 'Pending' },
    { name: 'SERASA', status: 'Pending' },
    { name: 'PROCESS', status: 'Pending' },
  ];
}

function advanceDatasets(datasets: DatasetProgress[], step: number): DatasetProgress[] {
  const completedCount = Math.min(step, datasets.length);
  return datasets.map((d, i) => ({
    ...d,
    status: i < completedCount ? 'Completed' : 'Pending',
  }));
}

export async function getOrCreate(
  document: string,
  options: { forceRefresh?: boolean } = {},
): Promise<GetOrCreateResponse> {
  await delay();
  const digits = onlyDigits(document);
  const scenario = resolveScenario(digits);

  if (scenario === 'nunca-consultado') {
    throw new NotFoundError('Documento sem consulta prévia.');
  }

  if (scenario === 'failed') {
    return {
      queryId: 9001,
      externalId: 'fail-001',
      status: 'Failed',
      wasReused: false,
      outcome: 'Created',
      validityDays: 5,
      validUntil: '2026-08-08T12:00:00Z',
      typed: null,
    };
  }

  const latest = latestForScenario(scenario);
  const isCnpj = digits.length === 14;

  if (!options.forceRefresh && latest && scenario !== 'processing') {
    return {
      queryId: latest.queryId,
      externalId: latest.externalId,
      status: 'Completed',
      wasReused: true,
      outcome: 'ReusedCompleted',
      validityDays: latest.validityDays,
      validUntil: latest.validUntil,
      typed: { ...latest },
    };
  }

  const queryId = ++nextQueryId;
  const externalId = `new-${queryId}`;
  const datasets = defaultDatasets(isCnpj);

  processingStore.set(queryId, {
    queryId,
    externalId,
    document: digits,
    pollStep: 0,
    datasets,
  });

  return {
    queryId,
    externalId,
    status: 'Processing',
    wasReused: false,
    outcome: options.forceRefresh ? 'Created' : 'Created',
    validityDays: 5,
    validUntil: '2026-08-08T12:00:00Z',
    typed: null,
  };
}

export async function pollQuery(queryId: number): Promise<PollQueryResponse> {
  await delay(400);

  const state = processingStore.get(queryId);
  if (!state) {
    return {
      status: 'Completed',
      datasets: advanceDatasets(defaultDatasets(false), 4),
      attempts: 1,
    };
  }

  state.pollStep += 1;
  state.datasets = advanceDatasets(state.datasets, state.pollStep);

  const allDone = state.pollStep >= state.datasets.length;

  return {
    status: allDone ? 'Completed' : 'Processing',
    datasets: [...state.datasets],
    attempts: state.pollStep,
  };
}

export async function getByDocument(
  document: string,
  _page = 1,
): Promise<CreditQueryByDocumentResponse> {
  await delay(300);
  const digits = onlyDigits(document);
  const scenario = resolveScenario(digits);

  if (scenario === 'nunca-consultado') {
    throw new NotFoundError('Documento sem consulta prévia.');
  }

  const latest = latestForScenario(scenario);
  return buildByDocumentResponse(latest);
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function startProcessingPoll(
  queryId: number,
  document: string,
  onProgress: (response: PollQueryResponse) => void,
  onComplete: (response: CreditQueryByDocumentResponse) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function tick() {
    if (cancelled) return;
    try {
      const poll = await pollQuery(queryId);
      onProgress(poll);

      if (poll.status === 'Completed') {
        const result = await getByDocument(document);
        onComplete(result);
        processingStore.delete(queryId);
        return;
      }

      timer = setTimeout(tick, POLL_INTERVAL_MS);
    } catch (e) {
      onError(e instanceof Error ? e : new Error('Erro ao consultar.'));
    }
  }

  timer = setTimeout(tick, POLL_INTERVAL_MS);

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}

export function seedProcessingForDemo(document: string): number {
  const digits = onlyDigits(document) || MOCK_PF_COMPLETO.document;
  const queryId = ++nextQueryId;
  const isCnpj = digits.length === 14;
  processingStore.set(queryId, {
    queryId,
    externalId: `demo-${queryId}`,
    document: digits,
    pollStep: 0,
    datasets: defaultDatasets(isCnpj),
  });
  return queryId;
}
