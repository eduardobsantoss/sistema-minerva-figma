export interface TituloSelecionado {
  id: string;
  lastro: string;
  numero: string;
  valor: number;
  /** Ausente quando a listagem ainda não tem valor em aberto por título. */
  valorAberto: number | null;
  vencimento: string;
  /** Situação do registro na CERC, quando a listagem tem esse dado. */
  registro?: string;
  /** Situação do título, quando a listagem tem esse dado. */
  situacao?: string;
}
