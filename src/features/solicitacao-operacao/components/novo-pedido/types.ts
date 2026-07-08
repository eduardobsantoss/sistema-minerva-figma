export interface NewPedidoData {
  tipoOperacao: string;
  esteira: string;
  tipoContrato: string;
  unidadeNegocio: string;
  gerenteComercial: string;
  fundo: string;
  grupoEmpresarial: string;
  contaBancaria: string;
  tipoTaxa: string;
  taxaOperacao: string;
  indicePos: string;
  operadorPos: string;
  valorTaxaPos: string;
  fee: string;
  valorOperacao: string;
  quitacaoVencidos: boolean;
  requerGarantia: boolean;
}

export type GarantiaItem = {
  tipo: string;
  nome: string;
  valor: string;
};
