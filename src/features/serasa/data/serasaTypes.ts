export type CreditQueryStatus = 'Processing' | 'Completed' | 'Failed' | 'Expired';

export type PersonType = 'PF' | 'PJ';

export type GetOrCreateOutcome = 'ReusedCompleted' | 'ReusedProcessing' | 'Created';

export type DatasetName =
  | 'AGRO_SCORE_CPF'
  | 'AGRO_SCORE_CNPJ'
  | 'BASIC_INFO'
  | 'SERASA'
  | 'PROCESS';

export type DatasetStatus = 'Completed' | 'Failed' | 'Pending';

export type SerasaProcessStatus =
  | 'Indefinido'
  | 'Ativo'
  | 'Distribuido'
  | 'Baixado'
  | 'Apenso'
  | 'Decidido'
  | 'Autuado'
  | 'Execucao'
  | 'Finalizado'
  | 'Encerrado'
  | 'EmGrauDeRecurso'
  | 'Redistribuido'
  | 'TransitadoEmJulgado'
  | 'Arquivado'
  | 'Julgado'
  | 'Extinto'
  | 'Suspenso';

export interface AgroScore {
  id: number;
  score: number;
  eventProbability: number;
  referenceDate: string;
  createdAt: string;
}

export interface BasicInfo {
  id: number;
  taxIdStatus: string;
  personType: PersonType;
  name?: string | null;
  birthDate?: string | null;
  motherName?: string | null;
  officialName?: string | null;
  capital?: string | null;
  companySize?: string | null;
  riskScreening?: string | null;
  operabilityIndicator?: string | null;
  addresses?: unknown[] | null;
  phones?: unknown[] | null;
  emails?: unknown[] | null;
  activities?: unknown[] | null;
  relatedPeople?: unknown[] | null;
  businessRelationships?: unknown[] | null;
}

export interface CreditReportOccurrence {
  id: number;
  category: string;
  typeReg?: string | null;
  subtype?: string | null;
  nature?: string | null;
  creditorDocument?: string | null;
  creditorName?: string | null;
  value?: number | null;
  occurrenceDate?: string | null;
  contract?: string | null;
  praca?: string | null;
  state?: string | null;
  city?: string | null;
  cadusKey?: string | null;
  cadusSeries?: string | null;
  subJudice?: string | null;
  rawDetails: Record<string, unknown>;
}

export interface CreditReport {
  id: number;
  category: string;
  message: string;
  occurrences: number;
  valueOfOccurrences?: number | null;
  oldestOccurrence?: string | null;
  newestOccurrence?: string | null;
  createdAt: string;
  occurrenceDetails: CreditReportOccurrence[];
}

export interface ProcessOccurrence {
  id: number;
  processNumber: string;
  status: SerasaProcessStatus;
  rawStatus?: string | null;
  subject?: string | null;
  processType?: string | null;
  courtType?: string | null;
  court?: string | null;
  courtInstance?: string | null;
  state?: string | null;
  partyRole?: string | null;
  partyName?: string | null;
  value?: number | null;
  publicationDate?: string | null;
  rawDetails: Record<string, unknown>;
}

export interface SerasaProcess {
  id: number;
  status: SerasaProcessStatus;
  occurrences: number;
  valueOfOccurrences?: number | null;
  oldestPublication?: string | null;
  newestPublication?: string | null;
  createdAt: string;
  occurrenceDetails: ProcessOccurrence[];
}

export interface CreditQueryLatest {
  queryId: number;
  externalId: string;
  document: string;
  status: CreditQueryStatus;
  createdAt: string;
  updatedAt?: string | null;
  isExpired: boolean;
  validityDays: number;
  validUntil: string;
  agroScore?: AgroScore | null;
  basicInfo?: BasicInfo | null;
  creditReports: CreditReport[];
  processes: SerasaProcess[];
}

export interface HistoryItem {
  queryId: number;
  externalId: string;
  status: CreditQueryStatus;
  createdAt: string;
  updatedAt?: string | null;
  errorMessage?: string | null;
}

export interface PaginatedHistory {
  items: HistoryItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreditQueryByDocumentResponse {
  latest: CreditQueryLatest | null;
  history: PaginatedHistory;
}

export interface DatasetProgress {
  name: DatasetName;
  status: DatasetStatus;
}

export interface PollQueryResponse {
  status: CreditQueryStatus;
  resultJson?: string | null;
  datasets: DatasetProgress[];
  attempts: number;
}

export interface GetOrCreateResponse {
  queryId: number;
  externalId: string;
  status: CreditQueryStatus;
  wasReused: boolean;
  outcome: GetOrCreateOutcome;
  validityDays: number;
  validUntil: string;
  typed: CreditQueryLatest | null;
}

export type MockScenario =
  | 'pf-completo'
  | 'pj-completo'
  | 'sem-restricoes'
  | 'nunca-consultado'
  | 'processing'
  | 'failed'
  | 'expired';

export type ScreenPhase = 'idle' | 'loading' | 'processing' | 'completed' | 'failed' | 'not-found';
