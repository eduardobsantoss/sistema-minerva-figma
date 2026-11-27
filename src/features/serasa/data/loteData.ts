import { ref } from 'vue';
import { CHEQUE_CATEGORIES, DEMO_DOCUMENTS, PROTEST_CATEGORY } from './serasaConstants';
import {
  latestForScenario,
  previousConsultations,
  resolveScenario,
} from './serasaMocks';
import type { CreditQueryLatest } from './serasaTypes';

export type DecisaoLote = 'apto' | 'com-ressalva' | 'recusado';

export type TipoApontamento =
  | 'pefin'
  | 'refin'
  | 'protesto'
  | 'cheque'
  | 'processo'
  | 'trabalhoEscravo'
  | 'ibama';

export interface ApontamentoResumo {
  quantidade: number;
  valor: number;
}

export interface ItemLote {
  id: string;
  documento: string;
  nome: string;
  valido: boolean;
  score: number | null;
  previousScore: number | null;
  pefin: ApontamentoResumo;
  refin: ApontamentoResumo;
  protesto: ApontamentoResumo;
  cheque: ApontamentoResumo;
  processo: ApontamentoResumo;
  trabalhoEscravo: ApontamentoResumo;
  ibama: ApontamentoResumo;
  valorTotal: number;
  temApontamento: boolean;
  decisao: DecisaoLote | null;
  decisaoSugerida: DecisaoLote | null;
  decisaoManual: boolean;
}

export interface LoteConsulta {
  id: string;
  criadoEm: string;
  status: 'pendente' | 'processando' | 'concluido' | 'com-erros';
  arquivo?: string;
  itens: ItemLote[];
}

export const DECISAO_LABEL: Record<DecisaoLote, string> = {
  apto: 'Apto',
  'com-ressalva': 'Com ressalva',
  recusado: 'Recusado',
};

export const APONTAMENTO_LABEL: Record<TipoApontamento, string> = {
  pefin: 'Pefin',
  refin: 'Refin',
  protesto: 'Protesto',
  cheque: 'Cheque',
  processo: 'Processo',
  trabalhoEscravo: 'Trabalho escravo',
  ibama: 'IBAMA',
};

const PEFIN = new Set(['financialPendencies', 'convem']);
const REFIN = new Set(['financialRestrictions']);

function vazio(): ApontamentoResumo {
  return { quantidade: 0, valor: 0 };
}

function somarReports(latest: CreditQueryLatest, categories: Set<string>): ApontamentoResumo {
  return (latest.creditReports ?? [])
    .filter((report) => categories.has(report.category))
    .reduce(
      (acc, report) => ({
        quantidade: acc.quantidade + report.occurrences,
        valor: acc.valor + (report.valueOfOccurrences ?? 0),
      }),
      vazio(),
    );
}

export function resumoDeLatest(latest: CreditQueryLatest) {
  const pefin = somarReports(latest, PEFIN);
  const refin = somarReports(latest, REFIN);
  const protesto = somarReports(latest, new Set([PROTEST_CATEGORY]));
  const cheque = somarReports(latest, CHEQUE_CATEGORIES);
  const processo = (latest.processes ?? []).reduce(
    (acc, item) => ({
      quantidade: acc.quantidade + item.occurrences,
      valor: acc.valor + (item.valueOfOccurrences ?? 0),
    }),
    vazio(),
  );
  const trabalhoEscravo = {
    quantidade: (latest.slaveLaborRestrictions ?? []).length,
    valor: 0,
  };
  const ibama = {
    quantidade: (latest.ibamaRestrictions ?? []).length,
    valor: 0,
  };
  const valorTotal =
    pefin.valor + refin.valor + protesto.valor + cheque.valor + processo.valor;
  const temApontamento =
    pefin.quantidade +
      refin.quantidade +
      protesto.quantidade +
      cheque.quantidade +
      processo.quantidade +
      trabalhoEscravo.quantidade +
      ibama.quantidade >
    0;

  const previous = previousConsultations(latest)[0];
  return {
    nome: latest.basicInfo?.name?.trim() || 'Nome não disponível',
    score: latest.agroScore?.score ?? null,
    previousScore: previous?.snapshot?.agroScore ?? null,
    pefin,
    refin,
    protesto,
    cheque,
    processo,
    trabalhoEscravo,
    ibama,
    valorTotal,
    temApontamento,
  };
}

export function sugerirDecisao(item: Pick<
  ItemLote,
  'valido' | 'trabalhoEscravo' | 'ibama' | 'pefin' | 'refin' | 'protesto' | 'cheque' | 'processo'
>): DecisaoLote | null {
  if (!item.valido) return null;
  if (item.trabalhoEscravo.quantidade > 0 || item.ibama.quantidade > 0) return 'recusado';
  if (
    item.pefin.quantidade > 0 ||
    item.refin.quantidade > 0 ||
    item.protesto.quantidade > 0 ||
    item.cheque.quantidade > 0 ||
    item.processo.quantidade > 0
  ) {
    return 'com-ressalva';
  }
  return 'apto';
}

export function itemDeDocumento(documento: string, valido = true): ItemLote {
  const digits = documento.replace(/\D/g, '');
  if (!valido) {
    return {
      id: `inv-${digits || documento}`,
      documento: digits || documento,
      nome: '—',
      valido: false,
      score: null,
      previousScore: null,
      pefin: vazio(),
      refin: vazio(),
      protesto: vazio(),
      cheque: vazio(),
      processo: vazio(),
      trabalhoEscravo: vazio(),
      ibama: vazio(),
      valorTotal: 0,
      temApontamento: false,
      decisao: null,
      decisaoSugerida: null,
      decisaoManual: false,
    };
  }

  const scenario = resolveScenario(digits);
  const latest = latestForScenario(scenario);
  if (!latest || scenario === 'failed' || scenario === 'nunca-consultado') {
    const limpo: ItemLote = {
      id: `doc-${digits}`,
      documento: digits,
      nome: 'Documento consultado',
      valido: true,
      score: null,
      previousScore: null,
      pefin: vazio(),
      refin: vazio(),
      protesto: vazio(),
      cheque: vazio(),
      processo: vazio(),
      trabalhoEscravo: vazio(),
      ibama: vazio(),
      valorTotal: 0,
      temApontamento: false,
      decisao: 'apto',
      decisaoSugerida: 'apto',
      decisaoManual: false,
    };
    return limpo;
  }

  const resumo = resumoDeLatest(latest);
  const base: ItemLote = {
    id: `doc-${digits}`,
    documento: digits,
    valido: true,
    ...resumo,
    decisao: null,
    decisaoSugerida: null,
    decisaoManual: false,
  };
  const sugestao = sugerirDecisao(base);
  base.decisao = sugestao;
  base.decisaoSugerida = sugestao;
  return base;
}

export function lotesIniciais(): LoteConsulta[] {
  return [
    {
      id: 'lote-1',
      criadoEm: '2026-10-12',
      status: 'concluido',
      arquivo: 'lista-cedentes.csv',
      itens: [
        itemDeDocumento(DEMO_DOCUMENTS.pfCompleto),
        itemDeDocumento(DEMO_DOCUMENTS.semRestricoes),
      ],
    },
    {
      id: 'lote-2',
      criadoEm: '2026-10-02',
      status: 'com-erros',
      arquivo: 'lista-sacados.csv',
      itens: [
        itemDeDocumento(DEMO_DOCUMENTS.pjCompleto),
        itemDeDocumento('123', false),
      ],
    },
  ];
}

export const lotesCarteira = ref<LoteConsulta[]>(lotesIniciais());

export function resumoLote(itens: ItemLote[]) {
  const apto = itens.filter((item) => item.decisao === 'apto').length;
  const comRessalva = itens.filter((item) => item.decisao === 'com-ressalva').length;
  const recusado = itens.filter((item) => item.decisao === 'recusado').length;
  const comApontamento = itens.filter((item) => item.temApontamento).length;
  const valorTotal = itens.reduce((sum, item) => sum + item.valorTotal, 0);
  const porTipo = (key: TipoApontamento) => ({
    documentos: itens.filter((item) => item[key].quantidade > 0).length,
    quantidade: itens.reduce((sum, item) => sum + item[key].quantidade, 0),
    valor: itens.reduce((sum, item) => sum + item[key].valor, 0),
  });
  return {
    total: itens.length,
    apto,
    comRessalva,
    recusado,
    comApontamento,
    valorTotal,
    pefin: porTipo('pefin'),
    refin: porTipo('refin'),
    protesto: porTipo('protesto'),
    cheque: porTipo('cheque'),
    processo: porTipo('processo'),
    trabalhoEscravo: porTipo('trabalhoEscravo'),
    ibama: porTipo('ibama'),
  };
}
