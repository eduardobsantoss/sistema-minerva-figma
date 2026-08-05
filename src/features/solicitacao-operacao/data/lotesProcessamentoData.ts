export type LoteStatus = 'PROCESSANDO' | 'CONCLUIDO' | 'COM_FALHAS' | 'PENDENTE';
export type ArquivoLoteStatus = 'PROCESSADO' | 'PENDENTE' | 'FALHA' | 'PROCESSANDO';

export interface ArquivoLote {
  id: string;
  nome: string;
  status: ArquivoLoteStatus;
  processadoEm: string | null;
  tamanho: string;
  chaveNfe: string;
  numeroNf: string;
  emitente: string;
  destinatario: string;
  valor: string;
  erros: string[];
}

export interface LoteProcessamento {
  id: string;
  nome: string;
  status: LoteStatus;
  total: number;
  processados: number;
  pendentes: number;
  falhas: number;
  arquivos: ArquivoLote[];
}

export const LOTE_STATUS_LABEL: Record<LoteStatus, string> = {
  PROCESSANDO: 'Processando',
  CONCLUIDO: 'Concluído',
  COM_FALHAS: 'Com falhas',
  PENDENTE: 'Pendente',
};

export const ARQUIVO_STATUS_LABEL: Record<ArquivoLoteStatus, string> = {
  PROCESSADO: 'Processado',
  PENDENTE: 'Pendente',
  FALHA: 'Falha',
  PROCESSANDO: 'Processando',
};

export const LOTE_STATUS_TONE: Record<LoteStatus, { bg: string; fg: string }> = {
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  CONCLUIDO: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  COM_FALHAS: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
  PENDENTE: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
};

export const ARQUIVO_STATUS_TONE: Record<ArquivoLoteStatus, { bg: string; fg: string }> = {
  PROCESSADO: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
  PENDENTE: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
  FALHA: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-text)' },
  PROCESSANDO: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
};

/** Tipos de operação que substituem a aba Garantias por Lotes em Processamento. */
export function isDescontoDuplicataTipo(tipoOperacao: string): boolean {
  const t = tipoOperacao.toLowerCase();
  return (
    t.includes('desconto duplicata') ||
    t.includes('desconto de duplicata') ||
    t.includes('antecipação de recebíveis') ||
    t.includes('antecipacao de recebiveis') ||
    t.includes('antecipação de recebiveis')
  );
}

export function seedLotesProcessamento(): LoteProcessamento[] {
  return [
    {
      id: 'lote-1',
      nome: 'Lote NFe Via Agrícola — Jun/2026',
      status: 'COM_FALHAS',
      total: 12,
      processados: 8,
      pendentes: 1,
      falhas: 3,
      arquivos: [
        {
          id: 'arq-1',
          nome: 'NFe_27533-1_Empresa8.xml',
          status: 'PROCESSADO',
          processadoEm: '02/06/2026 às 14:22:11',
          tamanho: '48 KB',
          chaveNfe: '35260612345678000190550010002753311000000011',
          numeroNf: '27533-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'ALEX MUSSI E OUTROS',
          valor: 'R$ 6.760,00',
          erros: [],
        },
        {
          id: 'arq-2',
          nome: 'NFe_27534-1_Empresa8.xml',
          status: 'PROCESSADO',
          processadoEm: '02/06/2026 às 14:22:18',
          tamanho: '51 KB',
          chaveNfe: '35260612345678000190550010002753411000000012',
          numeroNf: '27534-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'FAZENDA BOA ESPERANÇA',
          valor: 'R$ 12.400,00',
          erros: [],
        },
        {
          id: 'arq-3',
          nome: 'NFe_27535-1_Empresa8.xml',
          status: 'FALHA',
          processadoEm: '02/06/2026 às 14:22:25',
          tamanho: '39 KB',
          chaveNfe: '35260612345678000190550010002753511000000013',
          numeroNf: '27535-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'COOPERATIVA RURAL SUL',
          valor: 'R$ 8.150,00',
          erros: [
            'CNPJ do sacado não encontrado na base cadastral.',
            'Data de vencimento inferior à data mínima permitida pelo veículo.',
            'Chave NFe já utilizada em outra operação (#1371).',
          ],
        },
        {
          id: 'arq-4',
          nome: 'NFe_27536-1_Empresa8.xml',
          status: 'FALHA',
          processadoEm: '02/06/2026 às 14:22:31',
          tamanho: '44 KB',
          chaveNfe: '35260612345678000190550010002753611000000014',
          numeroNf: '27536-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'AGRO INSUMOS NORTE LTDA',
          valor: 'R$ 5.200,00',
          erros: [
            'XML com assinatura digital inválida ou expirada.',
            'Valor da duplicata diverge do valor total da NFe.',
            'Sacado com restrição cadastral no Serasa.',
          ],
        },
        {
          id: 'arq-5',
          nome: 'NFe_27537-1_Empresa8.xml',
          status: 'FALHA',
          processadoEm: '02/06/2026 às 14:22:40',
          tamanho: '42 KB',
          chaveNfe: '35260612345678000190550010002753711000000015',
          numeroNf: '27537-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'PRODUTOR RURAL SILVA',
          valor: 'R$ 3.980,00',
          erros: [
            'Schema XML inválido: tag <dup> ausente no grupo de cobrança.',
            'Emissão da NFe superior a 180 dias.',
            'UF do destinatário não elegível para o veículo selecionado.',
          ],
        },
        {
          id: 'arq-6',
          nome: 'NFe_27538-1_Empresa8.xml',
          status: 'PENDENTE',
          processadoEm: null,
          tamanho: '47 KB',
          chaveNfe: '35260612345678000190550010002753811000000016',
          numeroNf: '27538-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'CEREALISTA CENTRO OESTE',
          valor: 'R$ 9.300,00',
          erros: [],
        },
        {
          id: 'arq-7',
          nome: 'NFe_27539-1_Empresa8.xml',
          status: 'PROCESSANDO',
          processadoEm: null,
          tamanho: '50 KB',
          chaveNfe: '35260612345678000190550010002753911000000017',
          numeroNf: '27539-1',
          emitente: 'VIA AGRICOLA LTDA',
          destinatario: 'DISTRIBUIDORA AGROBRAS',
          valor: 'R$ 15.750,00',
          erros: [],
        },
      ],
    },
    {
      id: 'lote-2',
      nome: 'Lote NFe Castrolanda — Mai/2026',
      status: 'PROCESSANDO',
      total: 6,
      processados: 3,
      pendentes: 2,
      falhas: 1,
      arquivos: [
        {
          id: 'arq-8',
          nome: 'NFe_88101-1_Castrolanda.xml',
          status: 'PROCESSADO',
          processadoEm: '28/05/2026 às 09:11:02',
          tamanho: '55 KB',
          chaveNfe: '41260598765432000110550010000881011000000021',
          numeroNf: '88101-1',
          emitente: 'CASTROLANDA COOP. AGROINDUSTRIAL',
          destinatario: 'FAZENDA SANTA RITA',
          valor: 'R$ 22.100,00',
          erros: [],
        },
        {
          id: 'arq-9',
          nome: 'NFe_88102-1_Castrolanda.xml',
          status: 'FALHA',
          processadoEm: '28/05/2026 às 09:11:15',
          tamanho: '41 KB',
          chaveNfe: '41260598765432000110550010000881021000000022',
          numeroNf: '88102-1',
          emitente: 'CASTROLANDA COOP. AGROINDUSTRIAL',
          destinatario: 'SITIO BOA VISTA',
          valor: 'R$ 4.450,00',
          erros: [
            'Duplicata sem número de parcela informado.',
            'CPF/CNPJ do destinatário com dígito verificador inválido.',
            'Arquivo XML corrompido na tag <infNFe>.',
          ],
        },
        {
          id: 'arq-10',
          nome: 'NFe_88103-1_Castrolanda.xml',
          status: 'PENDENTE',
          processadoEm: null,
          tamanho: '46 KB',
          chaveNfe: '41260598765432000110550010000881031000000023',
          numeroNf: '88103-1',
          emitente: 'CASTROLANDA COOP. AGROINDUSTRIAL',
          destinatario: 'AGROPECUARIA BELA VISTA',
          valor: 'R$ 11.200,00',
          erros: [],
        },
      ],
    },
    {
      id: 'lote-3',
      nome: 'Lote NFe Grupo Ceres — Abr/2026',
      status: 'CONCLUIDO',
      total: 4,
      processados: 4,
      pendentes: 0,
      falhas: 0,
      arquivos: [
        {
          id: 'arq-11',
          nome: 'NFe_12001-1_Ceres.xml',
          status: 'PROCESSADO',
          processadoEm: '15/04/2026 às 16:45:33',
          tamanho: '52 KB',
          chaveNfe: '35260411223344000155550010000120011000000031',
          numeroNf: '12001-1',
          emitente: 'CERES INVESTIMENTOS SA',
          destinatario: 'FAZENDA SAO JOAO',
          valor: 'R$ 18.900,00',
          erros: [],
        },
        {
          id: 'arq-12',
          nome: 'NFe_12002-1_Ceres.xml',
          status: 'PROCESSADO',
          processadoEm: '15/04/2026 às 16:45:40',
          tamanho: '49 KB',
          chaveNfe: '35260411223344000155550010000120021000000032',
          numeroNf: '12002-1',
          emitente: 'CERES INVESTIMENTOS SA',
          destinatario: 'PRODUTOR RURAL SANTOS',
          valor: 'R$ 7.600,00',
          erros: [],
        },
      ],
    },
  ];
}
