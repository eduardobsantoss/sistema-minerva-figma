export const TIPO_PAGAMENTO_OPTS = ['Amortização', 'Juros', 'Liquidação', 'Parcial'] as const;

export type PagamentoFormFieldType = 'text' | 'select' | 'toggle';

export interface PagamentoFormState {
  valorAmortizacao: string;
  dataPagamento: string;
  tipoPagamento: string;
  jurosMoratorio: string;
  multa: string;
  jurosRemuneratorio: string;
  transferenciaParcial: boolean;
  observacao: string;
}

export interface PagamentoFormFieldDef {
  key: keyof PagamentoFormState;
  label: string;
  type: PagamentoFormFieldType;
  placeholder?: string;
  options?: readonly string[];
  /** Quantas colunas o campo ocupa no grid (padrão: 1). */
  span?: number;
}

/** Campos do formulário "Registrar Pagamento". */
export const REGISTRAR_PAGAMENTO_FIELDS: PagamentoFormFieldDef[] = [
  { key: 'valorAmortizacao', label: 'Valor de amortização', type: 'text', placeholder: 'R$ 0,00' },
  { key: 'dataPagamento', label: 'Data de pagamento', type: 'text', placeholder: 'dd/mm/aaaa' },
  { key: 'tipoPagamento', label: 'Tipo de pagamento', type: 'select', options: TIPO_PAGAMENTO_OPTS, placeholder: 'Selecione' },
  { key: 'jurosMoratorio', label: 'Juros moratório', type: 'text', placeholder: 'R$ 0,00' },
  { key: 'multa', label: 'Multa', type: 'text', placeholder: 'R$ 0,00' },
  { key: 'jurosRemuneratorio', label: 'Juros remuneratório', type: 'text', placeholder: 'R$ 0,00' },
  { key: 'transferenciaParcial', label: 'Transferência parcial', type: 'toggle', span: 3 },
  { key: 'observacao', label: 'Observação', type: 'text', placeholder: '—', span: 3 },
];

export interface ConfiguracaoTituloFieldDef {
  key: keyof ConfiguracaoTituloDisplay;
  label: string;
  span?: number;
}

export interface ConfiguracaoTituloDisplay {
  tipoCalculo: string;
  valorEmissao: string;
  vencimentoFinal: string;
  taxa: string;
  frequenciaTaxa: string;
  tipoCapitalizacao: string;
  baseDias: string;
  fluxoAmortizacao: string;
  fluxoJuros: string;
}

/** Campos somente leitura da configuração do título. */
export const CONFIGURACAO_TITULO_FIELDS: ConfiguracaoTituloFieldDef[] = [
  { key: 'tipoCalculo', label: 'Tipo de cálculo' },
  { key: 'valorEmissao', label: 'Valor emissão' },
  { key: 'vencimentoFinal', label: 'Vencimento final' },
  { key: 'taxa', label: 'Taxa' },
  { key: 'frequenciaTaxa', label: 'Frequência da taxa' },
  { key: 'tipoCapitalizacao', label: 'Tipo de capitalização' },
  { key: 'baseDias', label: 'Base de dias para cálculo' },
  { key: 'fluxoAmortizacao', label: 'Fluxo de amortização' },
  { key: 'fluxoJuros', label: 'Fluxo de juros' },
];
