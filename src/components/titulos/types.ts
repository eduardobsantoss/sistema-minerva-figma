export interface TituloSelecionado {
  id: string;
  numero: string;
  valor: number;
  /** Ausente quando a listagem ainda não tem valor em aberto por título. */
  valorAberto: number | null;
  vencimento: string;
}
