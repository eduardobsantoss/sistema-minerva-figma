import {
  enriquecerParteRelacionada,
  type ParteRelacionada as ParteCadastro,
  type ParteTipo,
} from '@/features/solicitacao-operacao/data/operacaoData';
import type { PapelParteRelacionada, ParteRelacionada } from './riscoData';

const PAPEL_TO_TIPO: Record<PapelParteRelacionada, ParteTipo> = {
  Avalista: 'AVA',
  Sócio: 'SOC',
  'Representante Legal': 'REP',
};

export function toParteCadastro(parte: ParteRelacionada): ParteCadastro {
  return enriquecerParteRelacionada({
    nome: parte.nome,
    documento: parte.documento,
    email: parte.email,
    telefone: parte.telefone,
    tipos: [PAPEL_TO_TIPO[parte.papel]],
    estadoCivil: parte.estadoCivil,
  });
}

export function applyParteCadastro(
  original: ParteRelacionada,
  cadastro: ParteCadastro,
): ParteRelacionada {
  return {
    ...original,
    nome: cadastro.nome,
    documento: cadastro.documento,
    email: cadastro.email,
    telefone: cadastro.telefone,
    estadoCivil: cadastro.estadoCivil ?? original.estadoCivil,
    papel: papelFromTipos(cadastro.tipos, original.papel),
  };
}

function papelFromTipos(
  tipos: ParteTipo[],
  fallback: PapelParteRelacionada,
): PapelParteRelacionada {
  if (tipos.includes('AVA')) return 'Avalista';
  if (tipos.includes('SOC')) return 'Sócio';
  if (tipos.includes('REP')) return 'Representante Legal';
  return fallback;
}
