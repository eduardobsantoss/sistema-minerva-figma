export type TelaDisseccaoKey = 'solicitacao-operacao';

export interface TelaDisseccao {
  key: TelaDisseccaoKey;
  title: string;
  description: string;
  cta: string;
}

export const TELAS_DISSECCOES: TelaDisseccao[] = [
  {
    key: 'solicitacao-operacao',
    title: 'Solicitação de Operação',
    description:
      'Lista, detalhe, abas, nested, novo pedido, modais, relatórios, fundo padrão, taxas e validações.',
    cta: 'Abrir markdown',
  },
];
