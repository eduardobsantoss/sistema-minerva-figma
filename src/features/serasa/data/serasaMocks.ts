import type {
  CreditQueryLatest,
  CreditQueryByDocumentResponse,
  CreditReport,
  HistoryItem,
  MockScenario,
  SerasaProcess,
} from './serasaTypes';
import { DEMO_DOCUMENTS } from './serasaConstants';

const NOW = '2026-08-03T12:04:00Z';
const CREATED = '2026-08-03T12:00:00Z';
const VALID_UNTIL = '2026-08-08T12:00:00Z';
const EXPIRED_VALID_UNTIL = '2026-07-20T12:00:00Z';

function baseHistory(queryId: number, externalId: string, extra: HistoryItem[] = []): HistoryItem[] {
  const current: HistoryItem = {
    queryId,
    externalId,
    status: 'Completed',
    createdAt: CREATED,
    updatedAt: NOW,
    errorMessage: null,
  };
  return [current, ...extra];
}

const pfCreditReports: CreditReport[] = [
  {
    id: 10,
    category: 'financialPendencies',
    message: 'PEFIN',
    occurrences: 2,
    valueOfOccurrences: 8500,
    oldestOccurrence: '2024-06-15',
    newestOccurrence: '2025-12-01',
    createdAt: NOW,
    occurrenceDetails: [
      {
        id: 100,
        category: 'financialPendencies',
        creditorName: 'BANCO AGRO BRASIL S/A',
        value: 5200,
        occurrenceDate: '2025-12-01',
        nature: 'DUPLICATA',
        contract: 'CTR-2025-8841',
        state: 'GO',
        city: 'GOIANIA',
        subJudice: null,
        rawDetails: { origem: 'PEFIN', codigo: 'FIN-001' },
      },
      {
        id: 101,
        category: 'financialPendencies',
        creditorName: 'COOPERATIVA CREDITO RURAL',
        value: 3300,
        occurrenceDate: '2024-06-15',
        nature: 'NOTA PROMISSORIA',
        contract: 'NP-2024-112',
        state: 'GO',
        city: 'RIO VERDE',
        subJudice: 'SIM',
        rawDetails: { origem: 'PEFIN', subJudice: true },
      },
    ],
  },
  {
    id: 11,
    category: 'protest',
    message: 'PROTESTOS',
    occurrences: 1,
    valueOfOccurrences: 15400,
    oldestOccurrence: '2025-11-03',
    newestOccurrence: '2025-11-03',
    createdAt: NOW,
    occurrenceDetails: [
      {
        id: 110,
        category: 'protest',
        creditorName: 'CREDOR EXEMPLO LTDA',
        value: 15400,
        occurrenceDate: '2025-11-03',
        praca: 'SAO PAULO',
        state: 'SP',
        city: 'SAO PAULO',
        subJudice: null,
        rawDetails: { cartorio: '1º Tabelionato' },
      },
    ],
  },
  {
    id: 12,
    category: 'ccf',
    message: 'CHEQUE SEM FUNDO',
    occurrences: 1,
    valueOfOccurrences: 2800,
    oldestOccurrence: '2025-03-20',
    newestOccurrence: '2025-03-20',
    createdAt: NOW,
    occurrenceDetails: [
      {
        id: 120,
        category: 'ccf',
        creditorName: 'BANCO DO BRASIL S/A',
        value: 2800,
        occurrenceDate: '2025-03-20',
        state: 'GO',
        city: 'GOIANIA',
        subJudice: null,
        rawDetails: { alinea: '12' },
      },
    ],
  },
  {
    id: 13,
    category: 'unknownCategory',
    message: 'REGISTRO ESPECIAL CONCENTRE',
    occurrences: 1,
    valueOfOccurrences: 1200,
    oldestOccurrence: '2025-01-10',
    newestOccurrence: '2025-01-10',
    createdAt: NOW,
    occurrenceDetails: [
      {
        id: 130,
        category: 'unknownCategory',
        creditorName: 'CREDOR DESCONHECIDO LTDA',
        value: 1200,
        occurrenceDate: '2025-01-10',
        subJudice: null,
        rawDetails: { tipo: 'novo_bloco' },
      },
    ],
  },
];

const pfProcesses: SerasaProcess[] = [
  {
    id: 20,
    status: 'Ativo',
    occurrences: 2,
    valueOfOccurrences: 90000,
    oldestPublication: '2023-05-01',
    newestPublication: '2026-02-11',
    createdAt: NOW,
    occurrenceDetails: [
      {
        id: 200,
        processNumber: '0001234-56.2023.8.26.0100',
        status: 'Ativo',
        rawStatus: 'ATIVO',
        subject: 'EXECUCAO DE TITULO EXTRAJUDICIAL',
        processType: 'EXECUCAO',
        court: 'TJSP',
        courtInstance: '1a INSTANCIA',
        state: 'SP',
        partyRole: 'REU',
        partyName: 'JOAO DA SILVA SANTOS',
        value: 45000,
        publicationDate: '2026-02-11',
        rawDetails: { vara: '42' },
      },
      {
        id: 201,
        processNumber: '0009876-12.2024.8.09.0051',
        status: 'Distribuido',
        rawStatus: 'DISTRIBUIDO',
        subject: 'COBRANCA',
        court: 'TJGO',
        courtInstance: '1a INSTANCIA',
        state: 'GO',
        partyRole: 'REU',
        partyName: 'JOAO DA SILVA SANTOS',
        value: 45000,
        publicationDate: '2024-08-20',
        rawDetails: {},
      },
    ],
  },
];

export const MOCK_PF_COMPLETO: CreditQueryLatest = {
  queryId: 1024,
  externalId: 'abc-123-pf',
  document: DEMO_DOCUMENTS.pfCompleto,
  status: 'Completed',
  createdAt: CREATED,
  updatedAt: NOW,
  isExpired: false,
  validityDays: 5,
  validUntil: VALID_UNTIL,
  agroScore: {
    id: 1,
    score: 720,
    eventProbability: 0.0431,
    referenceDate: '2026-07-31',
    createdAt: NOW,
  },
  basicInfo: {
    id: 1,
    taxIdStatus: 'REGULAR',
    personType: 'PF',
    name: 'JOAO DA SILVA SANTOS',
    birthDate: '1980-04-12',
    motherName: 'MARIA DA SILVA',
    officialName: null,
    riskScreening: 'BAIXO RISCO',
    operabilityIndicator: 'OPERAVEL',
    addresses: [
      { tipo: 'RESIDENCIAL', logradouro: 'RUA DAS FLORES', numero: '123', bairro: 'CENTRO', cidade: 'GOIANIA', uf: 'GO', cep: '74000000' },
    ],
    phones: [{ tipo: 'CELULAR', ddd: '62', numero: '998765432' }],
    emails: [{ email: 'joao.santos@email.com' }],
    activities: [],
    relatedPeople: [{ nome: 'ANA SILVA SANTOS', vinculo: 'CONJUGE' }],
    businessRelationships: [],
  },
  creditReports: pfCreditReports,
  processes: pfProcesses,
};

export const MOCK_PJ_COMPLETO: CreditQueryLatest = {
  queryId: 2048,
  externalId: 'abc-456-pj',
  document: DEMO_DOCUMENTS.pjCompleto,
  status: 'Completed',
  createdAt: CREATED,
  updatedAt: NOW,
  isExpired: false,
  validityDays: 5,
  validUntil: VALID_UNTIL,
  agroScore: {
    id: 2,
    score: 650,
    eventProbability: 0.082,
    referenceDate: '2026-07-30',
    createdAt: NOW,
  },
  basicInfo: {
    id: 2,
    taxIdStatus: 'ATIVA',
    personType: 'PJ',
    name: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA',
    officialName: 'FAZENDA SANTA NIVA',
    capital: 'R$ 5.000.000,00',
    companySize: 'MEDIO PORTE',
    riskScreening: 'MEDIO RISCO',
    operabilityIndicator: 'OPERAVEL COM RESSALVAS',
    addresses: [
      { tipo: 'COMERCIAL', logradouro: 'RODOVIA GO-060', km: '45', cidade: 'RIO VERDE', uf: 'GO' },
    ],
    phones: [{ tipo: 'COMERCIAL', ddd: '64', numero: '36123456' }],
    emails: [{ email: 'contato@santaniva.com.br' }],
    activities: [
      { codigo: '0115-6', descricao: 'CULTIVO DE SOJA' },
      { codigo: '0151-2', descricao: 'CRIACAO DE BOVINOS' },
    ],
    relatedPeople: [
      { nome: 'CARLOS MENDES', vinculo: 'SOCIO ADMINISTRADOR', participacao: '60%' },
      { nome: 'FERNANDA ROCHA', vinculo: 'SOCIO', participacao: '40%' },
    ],
    businessRelationships: [
      { empresa: 'COOPERATIVA AGRO VALE', vinculo: 'FORNECEDOR' },
    ],
  },
  creditReports: [
    {
      id: 30,
      category: 'financialRestrictions',
      message: 'REFIN',
      occurrences: 1,
      valueOfOccurrences: 125000,
      oldestOccurrence: '2025-08-10',
      newestOccurrence: '2025-08-10',
      createdAt: NOW,
      occurrenceDetails: [
        {
          id: 300,
          category: 'financialRestrictions',
          creditorName: 'BANCO RURAL S/A',
          value: 125000,
          occurrenceDate: '2025-08-10',
          nature: 'FINANCIAMENTO',
          contract: 'FIN-2025-9900',
          state: 'GO',
          city: 'RIO VERDE',
          subJudice: null,
          rawDetails: {},
        },
      ],
    },
    {
      id: 31,
      category: 'judicialAction',
      message: 'ACOES JUDICIAIS',
      occurrences: 1,
      valueOfOccurrences: 80000,
      oldestOccurrence: '2025-02-15',
      newestOccurrence: '2025-02-15',
      createdAt: NOW,
      occurrenceDetails: [
        {
          id: 310,
          category: 'judicialAction',
          creditorName: 'FORNECEDOR INSUMOS LTDA',
          value: 80000,
          occurrenceDate: '2025-02-15',
          nature: 'ACAO JUDICIAL',
          state: 'GO',
          subJudice: null,
          rawDetails: {},
        },
      ],
    },
  ],
  processes: [
    {
      id: 40,
      status: 'EmGrauDeRecurso',
      occurrences: 1,
      valueOfOccurrences: 200000,
      oldestPublication: '2024-11-01',
      newestPublication: '2026-01-15',
      createdAt: NOW,
      occurrenceDetails: [
        {
          id: 400,
          processNumber: '0005555-88.2024.8.09.0051',
          status: 'EmGrauDeRecurso',
          rawStatus: 'EM GRAU DE RECURSO',
          subject: 'RECUPERACAO JUDICIAL',
          court: 'TJGO',
          courtInstance: '2a INSTANCIA',
          state: 'GO',
          partyRole: 'REQUERENTE',
          partyName: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA',
          value: 200000,
          publicationDate: '2026-01-15',
          rawDetails: {},
        },
      ],
    },
  ],
};

export const MOCK_SEM_RESTRICOES: CreditQueryLatest = {
  queryId: 3001,
  externalId: 'abc-789-clean',
  document: DEMO_DOCUMENTS.semRestricoes,
  status: 'Completed',
  createdAt: CREATED,
  updatedAt: NOW,
  isExpired: false,
  validityDays: 5,
  validUntil: VALID_UNTIL,
  agroScore: {
    id: 3,
    score: 810,
    eventProbability: 0.021,
    referenceDate: '2026-07-31',
    createdAt: NOW,
  },
  basicInfo: {
    id: 3,
    taxIdStatus: 'REGULAR',
    personType: 'PF',
    name: 'MARIA OLIVEIRA COSTA',
    birthDate: '1975-09-22',
    motherName: 'JOSEFA OLIVEIRA',
    riskScreening: 'BAIXO RISCO',
    operabilityIndicator: 'OPERAVEL',
    addresses: [],
    phones: [],
    emails: [],
    activities: [],
    relatedPeople: [],
    businessRelationships: [],
  },
  creditReports: [],
  processes: [],
};

export const MOCK_EXPIRED: CreditQueryLatest = {
  ...MOCK_PF_COMPLETO,
  queryId: 4001,
  externalId: 'abc-expired',
  document: DEMO_DOCUMENTS.expired,
  isExpired: true,
  validUntil: EXPIRED_VALID_UNTIL,
  createdAt: '2026-07-10T10:00:00Z',
  updatedAt: '2026-07-10T10:04:00Z',
};

export function buildByDocumentResponse(
  latest: CreditQueryLatest | null,
  historyItems?: HistoryItem[],
): CreditQueryByDocumentResponse {
  const items = latest
    ? baseHistory(latest.queryId, latest.externalId, historyItems ?? [])
    : (historyItems ?? []);

  return {
    latest,
    history: {
      items,
      currentPage: 1,
      pageSize: 50,
      totalItems: items.length,
      totalPages: 1,
    },
  };
}

export function resolveScenario(document: string): MockScenario {
  const d = document.replace(/\D/g, '');
  if (d === DEMO_DOCUMENTS.pfCompleto) return 'pf-completo';
  if (d === DEMO_DOCUMENTS.pjCompleto) return 'pj-completo';
  if (d === DEMO_DOCUMENTS.semRestricoes) return 'sem-restricoes';
  if (d === DEMO_DOCUMENTS.failed) return 'failed';
  if (d === DEMO_DOCUMENTS.expired) return 'expired';
  return 'nunca-consultado';
}

export function latestForScenario(scenario: MockScenario): CreditQueryLatest | null {
  switch (scenario) {
    case 'pf-completo':
      return { ...MOCK_PF_COMPLETO };
    case 'pj-completo':
      return { ...MOCK_PJ_COMPLETO };
    case 'sem-restricoes':
      return { ...MOCK_SEM_RESTRICOES };
    case 'expired':
      return { ...MOCK_EXPIRED };
    default:
      return null;
  }
}

export const DEMO_SCENARIOS: { key: MockScenario; label: string; document?: string }[] = [
  { key: 'pf-completo', label: 'PF completo', document: DEMO_DOCUMENTS.pfCompleto },
  { key: 'pj-completo', label: 'PJ completo', document: DEMO_DOCUMENTS.pjCompleto },
  { key: 'sem-restricoes', label: 'Sem restrições', document: DEMO_DOCUMENTS.semRestricoes },
  { key: 'expired', label: 'Consulta expirada', document: DEMO_DOCUMENTS.expired },
  { key: 'failed', label: 'Consulta falhou', document: DEMO_DOCUMENTS.failed },
  { key: 'processing', label: 'Em processamento' },
  { key: 'nunca-consultado', label: 'Nunca consultado' },
];
