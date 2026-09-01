import {
  GERENTES_SEED,
  TIPO_CLIENTE_OPTS,
  type Cedente,
  type HistoricoEvento,
  type TipoCliente,
} from '@/features/risco/data/riscoData';
import {
  CESSOES_VINCULADAS_MOCK,
  emptyGarantiaMinuta,
  type CessaoVinculadaMock,
  type GarantiaMinuta,
} from '@/features/solicitacao-operacao/data/minutaData';
import {
  enriquecerParteRelacionada,
  type ParteRelacionada,
} from '@/features/solicitacao-operacao/data/operacaoData';

export { GERENTES_SEED, TIPO_CLIENTE_OPTS };
export type { TipoCliente };

export type StatusCadastroGrupo = 'Apto' | 'Inapto';

export interface DocumentoGrupo {
  id: string;
  nome: string;
  tipo: string;
  validoAte: string;
}

export interface ContaBancariaGrupo {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  titular: string;
  principal: boolean;
}

export interface FaturamentoGrupo {
  id: string;
  valor: number;
  anoFiscal: string;
}

export interface FundoNotificacaoGrupo {
  id: string;
  nome: string;
  notifiable: boolean;
}

export type SituacaoGarantiaGrupo = 'em_uso' | 'disponivel';
export type SituacaoRegistroGrupo = 'pendente' | 'nao' | 'ok';

/** Cessão vinculada à garantia (mesmo modelo do card em Configurar constituição). */
export interface CessaoGarantiaGrupo extends CessaoVinculadaMock {
  data: string;
  veiculo?: string;
  taxa?: string;
}

export function cessaoGarantiaFromMock(
  mock: CessaoVinculadaMock,
  extras: Partial<Omit<CessaoGarantiaGrupo, keyof CessaoVinculadaMock>> = {},
): CessaoGarantiaGrupo {
  return { ...mock, data: extras.data ?? '30/07/2025', ...extras };
}

export interface GarantiaGrupo extends GarantiaMinuta {
  id: string;
  dataAquisicao: string;
  qtdOperacoes: number;
  situacaoGarantia: SituacaoGarantiaGrupo;
  situacaoRegistroCartorio: SituacaoRegistroGrupo;
  situacaoRegistroRegistradora: SituacaoRegistroGrupo;
  cessoes: CessaoGarantiaGrupo[];
}

export const DOCUMENTO_TIPO_OPTS = [
  'Contrato social',
  'Cartão CNPJ',
  'Comprovante de endereço',
  'Procuração',
  'Balanço',
  'Demonstração financeira',
  'Identificação dos sócios',
  'Outros',
];

export const BANCO_GRUPO_OPTS = [
  '001 — Banco do Brasil',
  '033 — Santander',
  '104 — Caixa',
  '237 — Bradesco',
  '341 — Itaú',
];

export interface GrupoCadastro {
  id: string;
  documento: string;
  nome: string;
  tipoCliente: TipoCliente;
  gerente: string;
  limite: number;
  riscoTomado: number;
  posicaoAnexo: string;
  validadeCadastro: string;
  criadoEm: string;
  statusCadastro: StatusCadastroGrupo;
  partes: ParteRelacionada[];
  cedentes: Cedente[];
  documentos: DocumentoGrupo[];
  contas: ContaBancariaGrupo[];
  faturamentos: FaturamentoGrupo[];
  fundosNotificacao: FundoNotificacaoGrupo[];
  garantias: GarantiaGrupo[];
  historico: HistoricoEvento[];
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

function cloneCedente(c: Cedente): Cedente {
  return {
    ...c,
    contatos: c.contatos.map((x) => ({ ...x })),
    enderecos: c.enderecos.map((x) => ({ ...x })),
    documentos: c.documentos.map((x) => ({ ...x })),
  };
}

export function cloneGarantia(g: GarantiaGrupo): GarantiaGrupo {
  return JSON.parse(JSON.stringify(g)) as GarantiaGrupo;
}

function seedGarantia(partial: Partial<GarantiaMinuta>): GarantiaMinuta {
  return { ...emptyGarantiaMinuta(), ...partial };
}

let garantiaIdSeq = 0;

export function seedGarantiaGrupo(partial: Partial<GarantiaGrupo> = {}): GarantiaGrupo {
  const minuta = seedGarantia(partial);
  const qtdOperacoes = partial.qtdOperacoes ?? 0;
  const percentualUsado = partial.percentualUsado ?? minuta.percentualUsado ?? 0;
  return {
    ...minuta,
    id: partial.id ?? `gar-${++garantiaIdSeq}`,
    dataAquisicao: partial.dataAquisicao ?? new Date().toLocaleDateString('pt-BR'),
    qtdOperacoes,
    percentualUsado,
    situacaoGarantia:
      partial.situacaoGarantia ??
      (qtdOperacoes > 0 || percentualUsado > 0 ? 'em_uso' : 'disponivel'),
    situacaoRegistroCartorio: partial.situacaoRegistroCartorio ?? 'nao',
    situacaoRegistroRegistradora: partial.situacaoRegistroRegistradora ?? 'nao',
    cessoes: partial.cessoes ?? [],
  };
}

const GARANTIAS_SEED_PADRAO: Partial<GarantiaGrupo>[] = [
  {
    id: 'gar-1',
    tipo: 'AF. Imóvel',
    valor: 'R$ 11.958.588,00',
    dataAquisicao: '30/07/2025',
    percentualUsado: 100,
    qtdOperacoes: 1,
    situacaoGarantia: 'em_uso',
    situacaoRegistroCartorio: 'pendente',
    situacaoRegistroRegistradora: 'nao',
    cessoes: [
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[0], {
        data: '06/08/2026',
        veiculo: 'CRA',
        taxa: '14,5% a.a.',
      }),
    ],
  },
  {
    id: 'gar-2',
    tipo: 'AF. Imóvel',
    valor: 'R$ 8.806.811,00',
    dataAquisicao: '30/07/2025',
    percentualUsado: 100,
    qtdOperacoes: 1,
    situacaoGarantia: 'em_uso',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    cessoes: [
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[1], {
        data: '12/07/2026',
        veiculo: 'FIDC',
        taxa: '13,2% a.a.',
      }),
    ],
  },
  {
    id: 'gar-3',
    tipo: 'AF. Estoque',
    valor: 'R$ 12.000.000,00',
    dataAquisicao: '30/07/2025',
    percentualUsado: 100,
    qtdOperacoes: 1,
    situacaoGarantia: 'em_uso',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    estoques: [
      { propriedade: 'Fazenda Santa Rita — Silo 01', proprietario: '3A Máquinas e Transportes' },
      { propriedade: 'Armazém Rio Verde', proprietario: '3A Máquinas e Transportes' },
    ],
    cessoes: [
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[0], {
        data: '30/07/2025',
        veiculo: 'CRA',
        taxa: '12,8% a.a.',
      }),
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[1], {
        data: '15/08/2025',
        veiculo: 'FIDC',
        taxa: '13,5% a.a.',
      }),
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[2], {
        data: '22/08/2025',
        veiculo: 'CRA',
        taxa: '11,9% a.a.',
      }),
    ],
  },
  {
    id: 'gar-4',
    tipo: 'Cessão Fiduciária de Direitos Creditórios (DUPLICATA)',
    valor: 'R$ 1.111,11',
    dataAquisicao: '26/08/2025',
    percentualUsado: 100,
    qtdOperacoes: 1,
    situacaoGarantia: 'em_uso',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    cessoes: [
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[2], {
        data: '26/08/2025',
        veiculo: 'CRA',
        taxa: '15,0% a.a.',
      }),
    ],
  },
  {
    id: 'gar-5',
    tipo: 'Cessão Fiduciária de Direitos Creditórios (DUPLICATA)',
    valor: 'R$ 1.111,11',
    dataAquisicao: '13/08/2026',
    percentualUsado: 100,
    qtdOperacoes: 1,
    situacaoGarantia: 'em_uso',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    cessoes: [
      cessaoGarantiaFromMock(CESSOES_VINCULADAS_MOCK[2], {
        data: '13/08/2026',
        veiculo: 'FIDC',
        taxa: '14,1% a.a.',
      }),
    ],
  },
  {
    id: 'gar-6',
    tipo: 'AF. Estoque',
    valor: 'R$ 100.741.600,42',
    dataAquisicao: '31/07/2025',
    percentualUsado: 0,
    qtdOperacoes: 0,
    situacaoGarantia: 'disponivel',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    estoques: [
      { propriedade: 'Unidade de Beneficiamento GO', proprietario: 'Agro Verde S/A' },
    ],
  },
  {
    id: 'gar-7',
    tipo: 'AF. Imóvel',
    valor: 'R$ 9.066.006,00',
    dataAquisicao: '31/07/2025',
    percentualUsado: 0,
    qtdOperacoes: 0,
    situacaoGarantia: 'disponivel',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
  },
  {
    id: 'gar-8',
    tipo: 'Penhor de Estoque',
    valor: 'R$ 3.000.000,00',
    dataAquisicao: '31/07/2025',
    percentualUsado: 0,
    qtdOperacoes: 0,
    situacaoGarantia: 'disponivel',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
    estoques: [
      { propriedade: 'Depósito Central', proprietario: 'Ceres Agro LTDA' },
      { propriedade: 'Silo B — Safra 2025', proprietario: 'Ceres Agro LTDA' },
    ],
  },
  {
    id: 'gar-9',
    tipo: 'Cessão Fiduciária de Direitos Creditórios (CONTRATO)',
    valor: 'R$ 2.500.000,00',
    dataAquisicao: '31/07/2025',
    percentualUsado: 0,
    qtdOperacoes: 0,
    situacaoGarantia: 'disponivel',
    situacaoRegistroCartorio: 'nao',
    situacaoRegistroRegistradora: 'nao',
  },
];

export function cloneGrupo(grupo: GrupoCadastro): GrupoCadastro {
  return {
    ...grupo,
    partes: grupo.partes.map(cloneParte),
    cedentes: grupo.cedentes.map(cloneCedente),
    documentos: grupo.documentos.map((d) => ({ ...d })),
    contas: grupo.contas.map((c) => ({ ...c })),
    faturamentos: grupo.faturamentos.map((f) => ({ ...f })),
    fundosNotificacao: grupo.fundosNotificacao.map((f) => ({ ...f })),
    garantias: grupo.garantias.map(cloneGarantia),
    historico: grupo.historico.map((h) => ({ ...h })),
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
    riscoTomado: 0,
    posicaoAnexo: '',
    validadeCadastro: '',
    criadoEm: new Date().toLocaleDateString('pt-BR'),
    statusCadastro: 'Apto',
    partes: [],
    cedentes: [],
    documentos: [],
    contas: [],
    faturamentos: [],
    fundosNotificacao: [],
    garantias: [],
    historico: [],
  };
}

export function ultimoFaturamento(grupo: GrupoCadastro): FaturamentoGrupo | null {
  if (!grupo.faturamentos.length) return null;
  return [...grupo.faturamentos].sort((a, b) => Number(b.anoFiscal) - Number(a.anoFiscal))[0] ?? null;
}

function makeCedentes(grupoId: string, nome: string, gerente: string): Cedente[] {
  const primeiro = nome.split(' ')[0] ?? 'grupo';
  const sobrenomeGerente = gerente.split(' ')[1] ?? gerente;
  return [
    {
      id: `${grupoId}-ced-1`,
      documento: '12.345.678/0001-90',
      nome,
      email: `financeiro@${primeiro.toLowerCase()}.com.br`,
      cidade: 'Rio Verde',
      uf: 'GO',
      tipo: 'Pessoa Jurídica',
      status: 'Apto',
      qtdTitulosAberto: 3,
      riscoTomado: 800_000,
      dataAbertura: '14/03/2021',
      razaoSocial: nome,
      nomeFantasia: primeiro,
      tipoEmpresa: 'Ltda',
      porte: 'Médio',
      atividadePrincipal: 'Comércio de insumos agrícolas',
      naturezaJuridica: 'Sociedade Empresária Limitada',
      inscricaoMunicipal: '00123456',
      inscricaoEstadual: '10.234.567-8',
      contatos: [
        {
          id: `${grupoId}-cont-1`,
          nome: `Financeiro ${primeiro}`,
          email: `financeiro@${primeiro.toLowerCase()}.com.br`,
          ddi: '+55',
          telefone: '(64) 99909-1183',
        },
      ],
      enderecos: [
        {
          id: `${grupoId}-end-1`,
          cep: '75901-000',
          localidade: 'Fazenda Santa Bárbara',
          numero: 'S/N',
          bairro: 'Zona Rural',
          infoAdicionais: '',
          cidade: 'Rio Verde',
          uf: 'GO',
          pais: 'Brasil',
        },
      ],
      documentos: [],
    },
    {
      id: `${grupoId}-ced-2`,
      documento: '234.567.890-12',
      nome: `José Carlos ${sobrenomeGerente}`,
      email: null,
      cidade: 'Luís Eduardo Magalhães',
      uf: 'BA',
      tipo: 'Pessoa Física',
      status: 'Inapto',
      qtdTitulosAberto: 0,
      riscoTomado: 0,
      dataAbertura: '02/07/1995',
      rg: '0000000',
      inscricaoProdutorRural: '',
      nacionalidade: 'Brasileira',
      dataNascimento: '02/07/1995',
      profissao: 'Produtor Rural',
      estadoCivil: 'Casado(a)',
      contatos: [
        {
          id: `${grupoId}-cont-2`,
          nome: `José Carlos ${sobrenomeGerente}`,
          email: 'jose.carlos620@gmail.com',
          ddi: '+55',
          telefone: '(77) 3351-8356',
        },
      ],
      enderecos: [],
      documentos: [],
    },
  ];
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

function detalhePadrao(
  id: string,
  nome: string,
  gerente: string,
  extras: Partial<GrupoCadastro> = {},
): Pick<
  GrupoCadastro,
  | 'cedentes'
  | 'documentos'
  | 'contas'
  | 'faturamentos'
  | 'fundosNotificacao'
  | 'garantias'
  | 'historico'
> {
  return {
    cedentes: extras.cedentes ?? makeCedentes(id, nome, gerente),
    documentos: extras.documentos ?? [
      { id: `${id}-doc-1`, nome: 'contrato-social.pdf', tipo: 'Contrato social', validoAte: '31/12/2026' },
      { id: `${id}-doc-2`, nome: 'cartao-cnpj.pdf', tipo: 'Cartão CNPJ', validoAte: '31/12/2027' },
    ],
    contas: extras.contas ?? [
      {
        id: `${id}-cc-1`,
        banco: '001 — Banco do Brasil',
        agencia: '1234-5',
        conta: '12345-6',
        titular: nome,
        principal: true,
      },
    ],
    faturamentos: extras.faturamentos ?? [
      { id: `${id}-fat-1`, valor: 18_400_000, anoFiscal: '2025' },
      { id: `${id}-fat-2`, valor: 15_200_000, anoFiscal: '2024' },
    ],
    fundosNotificacao: extras.fundosNotificacao ?? [
      { id: `${id}-fn-1`, nome: 'FIDC Agro Ceres', notifiable: true },
      { id: `${id}-fn-2`, nome: 'CRA Ceres 2024', notifiable: true },
      { id: `${id}-fn-3`, nome: 'FIDC Recebíveis', notifiable: false },
    ],
    garantias: extras.garantias ?? GARANTIAS_SEED_PADRAO.map((g) => seedGarantiaGrupo(g)),
    historico: extras.historico ?? [
      { id: `${id}-hist-3`, datetime: '18/06/2026 09:12', descricao: 'Documentos do grupo atualizados.' },
      { id: `${id}-hist-2`, datetime: '02/05/2026 14:40', descricao: 'Limite de crédito ajustado.' },
      { id: `${id}-hist-1`, datetime: '10/01/2026 11:05', descricao: 'Grupo empresarial cadastrado.' },
    ],
  };
}

export const GRUPOS_CADASTRO_SEED: GrupoCadastro[] = [
  {
    id: 'grp-3a',
    documento: '12.345.678/0001-90',
    nome: '3A MAQUINAS E TRANSPORTES LTDA',
    tipoCliente: 'Multicedente',
    gerente: 'Carlos Mendes',
    limite: 4_500_000,
    riscoTomado: 2_150_000,
    posicaoAnexo: '1',
    validadeCadastro: '2026-11-30',
    criadoEm: '10/01/2026',
    statusCadastro: 'Apto',
    partes: [cloneParte(PARTE_ANTONIO), cloneParte(PARTE_EDUARDO)],
    ...detalhePadrao('grp-3a', '3A MAQUINAS E TRANSPORTES LTDA', 'Carlos Mendes'),
  },
  {
    id: 'grp-fazenda-sn',
    documento: '98.765.432/0001-11',
    nome: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA',
    tipoCliente: 'Monocedente',
    gerente: 'Fernanda Rocha',
    limite: 1_200_000,
    riscoTomado: 980_000,
    posicaoAnexo: '2',
    validadeCadastro: '2026-09-15',
    criadoEm: '22/03/2025',
    statusCadastro: 'Apto',
    partes: [cloneParte(PARTE_ANTONIO)],
    ...detalhePadrao('grp-fazenda-sn', 'FAZENDA SANTA NIVA AGROPECUARIA LTDA', 'Fernanda Rocha'),
  },
  {
    id: 'grp-agropec-vale',
    documento: '45.112.998/0001-22',
    nome: 'AGROPECUARIA VALE VERDE S/A',
    tipoCliente: 'Multicedente',
    gerente: 'Rodrigo Alves',
    limite: 3_000_000,
    riscoTomado: 2_890_000,
    posicaoAnexo: '1',
    validadeCadastro: '2026-07-02',
    criadoEm: '08/08/2024',
    statusCadastro: 'Inapto',
    partes: [cloneParte(PARTE_BB), cloneParte(PARTE_EDUARDO)],
    ...detalhePadrao('grp-agropec-vale', 'AGROPECUARIA VALE VERDE S/A', 'Rodrigo Alves', {
      fundosNotificacao: [
        { id: 'grp-agropec-vale-fn-1', nome: 'FIDC Agro Ceres', notifiable: false },
        { id: 'grp-agropec-vale-fn-2', nome: 'CRA Ceres 2024', notifiable: false },
      ],
    }),
  },
  {
    id: 'grp-cerrado-graos',
    documento: '33.220.114/0001-05',
    nome: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA',
    tipoCliente: 'Monocedente',
    gerente: 'Juliana Prado',
    limite: 5_600_000,
    riscoTomado: 5_450_000,
    posicaoAnexo: '3',
    validadeCadastro: '2026-06-01',
    criadoEm: '15/11/2024',
    statusCadastro: 'Apto',
    partes: [],
    ...detalhePadrao('grp-cerrado-graos', 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA', 'Juliana Prado', {
      garantias: [],
      documentos: [],
    }),
  },
];
