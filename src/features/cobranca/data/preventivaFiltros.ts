import { diasParaVencer, type StatusPreventivo, type TituloPreventivo } from './cobrancaPreventivaData';

export interface FiltrosTitulo {
  status: StatusPreventivo[];
  tipos: string[];
  situacao: string;
  valorDe: string;
  valorAte: string;
  vencDe: string;
  vencAte: string;
  dias: string;
  grupo: string;
  excluirGrupos: string[];
  cra: string;
  fidc: string;
  gerente: string;
  superintendente: string;
}

export function filtrosVazios(): FiltrosTitulo {
  return {
    status: [],
    tipos: [],
    situacao: '',
    valorDe: '',
    valorAte: '',
    vencDe: '',
    vencAte: '',
    dias: '',
    grupo: '',
    excluirGrupos: [],
    cra: '',
    fidc: '',
    gerente: '',
    superintendente: '',
  };
}

function numero(texto: string): number {
  return Number(texto.trim().replace(/\./g, '').replace(',', '.'));
}

export function passaFiltros(t: TituloPreventivo, f: FiltrosTitulo): boolean {
  if (f.status.length && !f.status.includes(t.status)) return false;
  if (f.tipos.length && !f.tipos.includes(t.tipoTitulo)) return false;
  if (f.situacao && t.situacaoCedente !== f.situacao) return false;
  if (f.valorDe.trim() && !Number.isNaN(numero(f.valorDe)) && t.valor < numero(f.valorDe)) return false;
  if (f.valorAte.trim() && !Number.isNaN(numero(f.valorAte)) && t.valor > numero(f.valorAte)) return false;
  if (f.vencDe && t.vencimento < f.vencDe) return false;
  if (f.vencAte && t.vencimento > f.vencAte) return false;
  // v-model em input type="number" entrega número; normaliza para texto antes de validar.
  if (String(f.dias ?? '').trim() && !Number.isNaN(Number(f.dias))) {
    const dias = diasParaVencer(t.vencimento);
    if (dias < 0 || dias > Number(f.dias)) return false;
  }
  if (f.grupo && t.grupoEmpresarial !== f.grupo) return false;
  if (f.excluirGrupos.length && f.excluirGrupos.includes(t.grupoEmpresarial)) return false;
  if (f.cra && t.cra !== f.cra) return false;
  if (f.fidc && t.fidc !== f.fidc) return false;
  if (f.gerente && t.gerenteComercial !== f.gerente) return false;
  if (f.superintendente && t.superintendente !== f.superintendente) return false;
  return true;
}

/** Quantidade de campos preenchidos, ignorando o status (que fica fora do botão Filtros na lista). */
export function contarFiltros(f: FiltrosTitulo, incluirStatus = false): number {
  let n = 0;
  if (incluirStatus && f.status.length) n += 1;
  if (f.tipos.length) n += 1;
  for (const key of ['situacao', 'valorDe', 'valorAte', 'vencDe', 'vencAte', 'dias', 'grupo', 'cra', 'fidc', 'gerente', 'superintendente'] as const) {
    if (String(f[key]).trim() !== '') n += 1;
  }
  if (f.excluirGrupos.length) n += 1;
  return n;
}
