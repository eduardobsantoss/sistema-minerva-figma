/** Tipos de pedido compartilhados entre Relatórios e Validações (admin). */
export const TIPO_PEDIDO_OPTS = [
  { text: 'Contrato CPRF', value: 1 },
  { text: 'Antecipação de Recebíveis - Duplicata', value: 2 },
  { text: 'Composição de Garantia', value: 3 },
  { text: 'Contrato CDCA', value: 4 },
  { text: 'Contrato CDCA com Recebíveis', value: 5 },
  { text: 'Contrato CCB', value: 6 },
  { text: 'Contrato NC', value: 7 },
  { text: 'Contrato NP', value: 8 },
  { text: 'Contrato CPR', value: 9 },
] as const;

export type TipoPedidoOpt = (typeof TIPO_PEDIDO_OPTS)[number];

export function tipoPedidoLabel(value: number): string {
  return TIPO_PEDIDO_OPTS.find((t) => t.value === value)?.text ?? '—';
}
