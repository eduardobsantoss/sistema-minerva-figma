import { GERENTES_SEED, TIPO_CLIENTE_OPTS, type TipoCliente } from '@/features/risco/data/riscoData';
import {
  enriquecerParteRelacionada,
  type ParteRelacionada,
} from '@/features/solicitacao-operacao/data/operacaoData';

export { GERENTES_SEED, TIPO_CLIENTE_OPTS };
export type { TipoCliente };

export interface GrupoCadastro {
  id: string;
  documento: string;
  nome: string;
  tipoCliente: TipoCliente;
  gerente: string;
  limite: number;
  partes: ParteRelacionada[];
}

export function cloneParte(parte: ParteRelacionada): ParteRelacionada {
  return enriquecerParteRelacionada({
    ...parte,
    tipos: [...parte.tipos],
    contatosRelacionados: parte.contatosRelacionados?.map((c) => ({ ...c })),
    conjuge: parte.conjuge ? { ...parte.conjuge } : undefined,
    representante: parte.representante ? { ...parte.representante } : undefined,
  });
}

export function cloneGrupo(grupo: GrupoCadastro): GrupoCadastro {
  return {
    ...grupo,
    partes: grupo.partes.map(cloneParte),
  };
}

export function emptyGrupo(): GrupoCadastro {
  return {
    id: '',
    documento: '',
    nome: '',
    tipoCliente: 'Multicedente',
    gerente: GERENTES_SEED[0]?.nome ?? '',
    limite: 0,
    partes: [],
  };
}

const PARTE_ANTONIO = enriquecerParteRelacionada({
  nome: 'Antonio Mazzo Junior',
  documento: '105.746.818-50',
  email: 'teste@email.com',
  telefone: '(34) 3832-4637',
  tipos: ['AVA'],
  nacionalidade: 'Brasileira',
  estadoCivil: 'Casado(a)',
  regime: 'Comunhão Parcial de Bens',
  dataCasamento: '12/03/2010',
  dataNascimento: '15/08/1978',
  rg: '12.345.678-9',
  inscricaoProdutorRural: '123456789',
  profissao: 'Produtor Rural',
  cidade: 'Uberaba',
  estado: 'MG',
  pais: 'Brasil',
  ddi: '+55',
  nomeContato: 'Antonio Mazzo Junior',
  possuiConjuge: true,
  conjuge: {
    nome: 'Maria Aparecida Mazzo',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    dataNascimento: '22/04/1980',
    nacionalidade: 'Brasileira',
    profissao: 'Produtora Rural',
  },
});

const PARTE_EDUARDO = enriquecerParteRelacionada({
  nome: 'Eduardo Barbosa dos Santos',
  documento: '116.644.266-71',
  email: 'teste@email.com',
  telefone: '(34) 99254-7879',
  tipos: ['REP'],
  nacionalidade: 'Brasileira',
  profissao: 'Administrador',
  cidade: 'Uberaba',
  estado: 'MG',
  pais: 'Brasil',
  ddi: '+55',
  nomeContato: 'Eduardo Barbosa dos Santos',
});

const PARTE_BB = enriquecerParteRelacionada({
  nome: 'Banco do Brasil SA',
  documento: '00.000.000/0001-91',
  email: 'teste@email.com',
  telefone: '(34) 99521-4589',
  tipos: ['ITA', 'AVA'],
  razaoSocial: 'Banco do Brasil SA',
  nomeFantasia: 'Banco do Brasil',
  dataAbertura: '01/08/1808',
  tipoEmpresa: 'Sociedade de Economia Mista',
  porte: 'Grande',
  cidade: 'Brasília',
  estado: 'DF',
  pais: 'Brasil',
  ddi: '+55',
  nomeContato: 'Central de Atendimento',
});

export const GRUPOS_CADASTRO_SEED: GrupoCadastro[] = [
  {
    id: 'grp-3a',
    documento: '12.345.678/0001-90',
    nome: '3A MAQUINAS E TRANSPORTES LTDA',
    tipoCliente: 'Multicedente',
    gerente: 'Carlos Mendes',
    limite: 4_500_000,
    partes: [cloneParte(PARTE_ANTONIO), cloneParte(PARTE_EDUARDO)],
  },
  {
    id: 'grp-fazenda-sn',
    documento: '98.765.432/0001-11',
    nome: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA',
    tipoCliente: 'Monocedente',
    gerente: 'Fernanda Rocha',
    limite: 1_200_000,
    partes: [cloneParte(PARTE_ANTONIO)],
  },
  {
    id: 'grp-agropec-vale',
    documento: '45.112.998/0001-22',
    nome: 'AGROPECUARIA VALE VERDE S/A',
    tipoCliente: 'Multicedente',
    gerente: 'Rodrigo Alves',
    limite: 3_000_000,
    partes: [cloneParte(PARTE_BB), cloneParte(PARTE_EDUARDO)],
  },
  {
    id: 'grp-cerrado-graos',
    documento: '33.220.114/0001-05',
    nome: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA',
    tipoCliente: 'Monocedente',
    gerente: 'Juliana Prado',
    limite: 5_600_000,
    partes: [],
  },
];
