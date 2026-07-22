import { brl } from './operacaoData';

export interface XmlUploadItem {
  id: string;
  nome: string;
}

export interface TituloExtraidoDuplicata {
  id: string;
  entrega: 'PERFORMADA' | 'A PERFORMAR';
  titulo: string;
  cedente: string;
  sacado: string;
  valor: number;
  vencimento: string;
}

export interface AgrupamentoDuplicataKpi {
  agrupamento: string;
  limite: string;
  risco: string;
  riscoComSolicitacao: string;
}

export const DOCS_DESCONTO_DUPLICATA: { id: string; nome: string; obrigatorio: boolean }[] = [
  { id: 'lista-contatos', nome: 'Lista de Contatos', obrigatorio: true },
  { id: 'seguro-prestamista', nome: 'Seguro Prestamista', obrigatorio: false },
];

export const AGRUPAMENTO_DUPLICATA_KPI: AgrupamentoDuplicataKpi = {
  agrupamento: 'Operações Agrovita',
  limite: 'R$ 1.000.000,00',
  risco: 'R$ 3.842,71',
  riscoComSolicitacao: 'R$ 10.602,71',
};

/** Títulos mock gerados após “Extrair dados”. */
export function mockTitulosExtraidos(xmlFiles: XmlUploadItem[]): TituloExtraidoDuplicata[] {
  if (xmlFiles.length === 0) return [];
  return xmlFiles.map((f, i) => ({
    id: `ext-${f.id}`,
    entrega: 'PERFORMADA' as const,
    titulo: i === 0 ? '27533-1' : `2753${i + 3}-1`,
    cedente: 'VIA AGRICOLA LTDA',
    sacado: i === 0 ? 'ALEX MUSSI E OUTROS' : 'SACADO MOCK',
    valor: i === 0 ? 6760 : 5000 + i * 250,
    vencimento: '20/04/2026',
  }));
}

export function formatTituloValor(n: number): string {
  return brl(n);
}

let xmlSeq = 0;
export function mockAddXmlFile(): XmlUploadItem {
  xmlSeq += 1;
  return {
    id: `xml-${Date.now()}-${xmlSeq}`,
    nome: `NFe 27533-${xmlSeq} Empresa 8 ${xmlSeq}.xml`,
  };
}
