import type { TipoPessoa } from './operacaoData';

export type CategoriaMinuta = 'CPR' | 'NC' | 'CCB';

export const TIPOS_MINUTA_DISPONIVEIS = [
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato NC',
  'Contrato CCB',
] as const;

export function categoriaMinuta(tipo: string): CategoriaMinuta {
  const t = tipo.toUpperCase().replace(/\s/g, '').replace(/-/g, '');
  if (t.includes('CCB') || t.includes('CONTRATOCCB')) return 'CCB';
  if (t.includes('NC') || t.includes('CONTRATONC') || t.includes('NOTACOMERCIAL')) return 'NC';
  return 'CPR';
}

export function isTipoMinutaDisponivel(tipo: string): boolean {
  if ((TIPOS_MINUTA_DISPONIVEIS as readonly string[]).includes(tipo)) return true;
  const t = tipo.toUpperCase().replace(/\s/g, '').replace(/-/g, '');
  return (
    t === 'CPR' ||
    t === 'CPRF' ||
    t === 'NC' ||
    t === 'CCB' ||
    t.includes('CONTRATOCPR') ||
    t.includes('CONTRATONC') ||
    t.includes('CONTRATOCCB')
  );
}

export function templatesDisponiveis(tipo: string): string[] {
  const cat = categoriaMinuta(tipo);
  if (cat === 'CCB') return ['CCB (Ceres Investimentos)'];
  if (cat === 'NC') return ['Nota Comercial (Trading)', 'Nota Comercial (Ceres Investimentos)'];
  const t = tipo.toUpperCase().replace(/\s/g, '');
  if (t.includes('CPRF') || t.includes('CPR-F') || t.includes('CONTRATOCPRF')) {
    return ['CPR-F (Ceres Investimentos)'];
  }
  return ['CPR Física (Trading)'];
}

export function templateMinuta(tipo: string): string {
  return templatesDisponiveis(tipo)[0] ?? 'CPR Física (Trading)';
}

export const CIDADES_POR_UF: Record<string, string[]> = {
  MG: ['Uberaba', 'Uberlândia', 'Araguari', 'Ituiutaba'],
  SP: ['São Paulo', 'Ribeirão Preto', 'Campinas'],
  MT: ['Sorriso', 'Rondonópolis', 'Cuiabá'],
  GO: ['Rio Verde', 'Jataí', 'Goiânia'],
  PR: ['Londrina', 'Maringá', 'Curitiba'],
  MS: ['Dourados', 'Campo Grande'],
  BA: ['Barreiras', 'Luís Eduardo Magalhães'],
  TO: ['Palmas', 'Gurupi'],
};

export function cidadesDaUf(uf: string): string[] {
  return CIDADES_POR_UF[uf] ?? [];
}

export const PRODUTO_TIPO_OPTS = ['Soja', 'Milho', 'Algodão', 'Café', 'Trigo', 'Boi Gordo'];
export const UNIDADE_MEDIDA_OPTS = ['Saca (60kg)', 'Tonelada', 'Quilograma', 'Arroba', 'Hectare'];
export const ZONA_OPTS = ['Rural', 'Urbana'];
export const TIPO_IMOVEL_OPTS = ['Fazenda', 'Armazém', 'Galpão', 'Silo'];
export const TIPO_LOCACAO_OPTS = ['Arrendamento', 'Comodato', 'Parceria Agrícola'];
export const PERIODICIDADE_RELATORIO_OPTS = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
export const TIPO_GARANTIA_MINUTA_OPTS = ['AF. Estoque', 'Penhor de Estoque'];
export const CREDORA_PADRAO_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
export const CREDORA_PADRAO_OPTS_NC_CCB = ['Ceres Trading', 'Ceres Securitizadora', 'BMP'];
export const ESCRITURADOR_PADRAO_OPTS = ['Vortx', 'BMP'];
export const ENDOSSATARIO_PADRAO_OPTS = ['Ceres Trading', 'Ceres Securitizadora'];
export const SERIE_EMISSAO_OPTS = ['ÚNICA', 'SÉRIE 1', 'SÉRIE 2'];
export const NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira', 'BRASIL'];
export const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];

export function credoraPadraoOptions(categoria: CategoriaMinuta): string[] {
  if (categoria === 'NC' || categoria === 'CCB') return CREDORA_PADRAO_OPTS_NC_CCB;
  return CREDORA_PADRAO_OPTS;
}

export interface RepresentanteLegal {
  cpf: string;
  nome: string;
  rg: string;
  inscricaoProdutorRural: string;
  nacionalidade: string;
  dataNascimento: string;
  profissao: string;
  email?: string;
}

export interface PessoaMinuta {
  tipoPessoa: TipoPessoa;
  documento: string;
  nome: string;
  // PF
  cpf?: string;
  rg?: string;
  inscricaoProdutorRural?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  profissao?: string;
  estadoCivil?: string;
  // PJ
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  dataAbertura?: string;
  tipoEmpresa?: string;
  porte?: string;
  atividadePrincipal?: string;
  naturezaJuridica?: string;
  inscricaoMunicipal?: string;
  inscricaoEstadual?: string;
  // Contato
  email?: string;
  ddi?: string;
  telefone?: string;
  emailRepresentante?: string;
  // Endereço
  cep?: string;
  localidade?: string;
  numero?: string;
  bairro?: string;
  infoAdicionais?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  // Representante (PJ)
  representante?: RepresentanteLegal;
  // Contatos/endereços selecionáveis (credora via doc)
  contatos?: string[];
  enderecos?: string[];
  representantes?: string[];
}

export const CREDORAS_PADRAO: Record<string, PessoaMinuta> = {
  'Ceres Trading': {
    tipoPessoa: 'JURIDICA',
    documento: '56.025.302/0001-79',
    nome: 'CERES TRADING E INVESTIMENTOS S.A.',
    cnpj: '56.025.302/0001-79',
    razaoSocial: 'CERES TRADING E INVESTIMENTOS S.A.',
    nomeFantasia: 'CERES TRADING',
    dataAbertura: '22/6/2024',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Comércio atacadista de soja',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    email: 'contato@cerestrading.com.br',
    ddi: '+55',
    telefone: '999999999',
    cep: '04534-011',
    localidade: 'Rua Joaquim Floriano',
    numero: '413',
    bairro: 'Itaim Bibi',
    infoAdicionais: 'Andar 20',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    representante: {
      cpf: '144.112.938-38',
      nome: 'MARCELO TARTARO',
      rg: '13.096.851-1',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '12/10/1972',
      profissao: 'Administrador',
      email: '',
    },
  },
  'Ceres Confina': {
    tipoPessoa: 'JURIDICA',
    documento: '12.345.678/0001-90',
    nome: 'CERES CONFINA S.A.',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'CERES CONFINA S.A.',
    nomeFantasia: 'CERES CONFINA',
    dataAbertura: '15/03/2018',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Criação de bovinos para corte',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    email: 'contato@ceresconfina.com.br',
    ddi: '+55',
    telefone: '3433211000',
    cep: '38000-000',
    localidade: 'Rodovia BR-050',
    numero: 'Km 120',
    bairro: 'Zona Rural',
    cidade: 'Uberaba',
    estado: 'MG',
    pais: 'Brasil',
    representante: {
      cpf: '111.222.333-44',
      nome: 'JOÃO PEDRO ALMEIDA',
      rg: '12.345.678-9',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '05/08/1980',
      profissao: 'Administrador',
    },
  },
  'Ceres Investimentos': {
    tipoPessoa: 'JURIDICA',
    documento: '07.366.063/0001-05',
    nome: 'CERES INVESTIMENTOS S.A.',
    cnpj: '07.366.063/0001-05',
    razaoSocial: 'CERES INVESTIMENTOS S.A.',
    nomeFantasia: 'CERES INVESTIMENTOS',
    dataAbertura: '10/01/2015',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Holdings de instituições não-financeiras',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    email: 'contato@ceresinvestimentos.com.br',
    ddi: '+55',
    telefone: '1130452000',
    cep: '04534-011',
    localidade: 'Rua Joaquim Floriano',
    numero: '413',
    bairro: 'Itaim Bibi',
    infoAdicionais: 'Andar 18',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    representante: {
      cpf: '144.112.938-38',
      nome: 'MARCELO TARTARO',
      rg: '13.096.851-1',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '12/10/1972',
      profissao: 'Administrador',
    },
  },
  'Ceres Securitizadora': {
    tipoPessoa: 'JURIDICA',
    documento: '32.987.654/0001-10',
    nome: 'CERES SECURITIZADORA S.A.',
    cnpj: '32.987.654/0001-10',
    razaoSocial: 'CERES SECURITIZADORA S.A.',
    nomeFantasia: 'CERES SECURITIZADORA',
    dataAbertura: '08/04/2019',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Securitização de créditos',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    email: 'contato@ceressecuritizadora.com.br',
    ddi: '+55',
    telefone: '1130452100',
    cep: '04534-011',
    localidade: 'Rua Joaquim Floriano',
    numero: '413',
    bairro: 'Itaim Bibi',
    infoAdicionais: 'Andar 19',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    representante: {
      cpf: '144.112.938-38',
      nome: 'MARCELO TARTARO',
      rg: '13.096.851-1',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '12/10/1972',
      profissao: 'Administrador',
    },
  },
  BMP: {
    tipoPessoa: 'JURIDICA',
    documento: '15.444.333/0001-22',
    nome: 'BMP MONEY PLUS SOCIEDADE DE CRÉDITO DIRETO S.A.',
    cnpj: '15.444.333/0001-22',
    razaoSocial: 'BMP MONEY PLUS SOCIEDADE DE CRÉDITO DIRETO S.A.',
    nomeFantasia: 'BMP',
    dataAbertura: '12/09/2016',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Sociedade de crédito direto',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    email: 'contato@bmp.com.br',
    ddi: '+55',
    telefone: '1130004000',
    cep: '01414-001',
    localidade: 'Avenida Paulista',
    numero: '1106',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    representante: {
      cpf: '333.444.555-66',
      nome: 'CARLOS HENRIQUE SOUZA',
      rg: '33.444.555-6',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '18/02/1978',
      profissao: 'Administrador',
    },
  },
};

export const ESCRITURADORES_PADRAO: Record<string, PessoaMinuta> = {
  Vortx: {
    tipoPessoa: 'JURIDICA',
    documento: '22.610.500/0001-88',
    nome: 'VÓRTX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
    cnpj: '22.610.500/0001-88',
    razaoSocial: 'VÓRTX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
    nomeFantasia: 'VÓRTX',
    dataAbertura: '05/02/2015',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Distribuição de títulos e valores mobiliários',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    email: 'escrituracao@vortx.com.br',
    ddi: '+55',
    telefone: '1130334000',
    cep: '04547-130',
    localidade: 'Rua Gomes de Carvalho',
    numero: '1195',
    bairro: 'Vila Olímpia',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  BMP: CREDORAS_PADRAO.BMP,
};

export const MOCK_CLIENTES_MINUTA: PessoaMinuta[] = [
  {
    tipoPessoa: 'JURIDICA',
    documento: '34.470.721/0001-87',
    nome: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
    cnpj: '34.470.721/0001-87',
    razaoSocial: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
    nomeFantasia: 'AVANTIAGRO',
    dataAbertura: '01/05/2010',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Comércio atacadista de cereais e leguminosas',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    email: 'denis.franke@avantiagro.com.br',
    ddi: '+55',
    telefone: '34999887766',
    cep: '38010-200',
    localidade: 'Avenida Juscelino Kubitschek',
    numero: '1500',
    bairro: 'Centro',
    cidade: 'Uberaba',
    estado: 'MG',
    pais: 'Brasil',
    contatos: ['AVANTIAGRO - denis.franke', 'AVANTIAGRO - financeiro'],
    enderecos: ['JUSCELINO KUBITSCHEK, 1500', 'RODOVIA BR-050, KM 80'],
    representantes: ['DENIS FRANKE', 'MARIA SILVA'],
    representante: {
      cpf: '222.333.444-55',
      nome: 'DENIS FRANKE',
      rg: '22.333.444-5',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '20/03/1985',
      profissao: 'Empresário',
    },
  },
  {
    tipoPessoa: 'FISICA',
    documento: '144.112.938-38',
    nome: 'MARCELO TARTARO',
    cpf: '144.112.938-38',
    rg: '13.096.851-1',
    inscricaoProdutorRural: '',
    nacionalidade: 'BRASIL',
    dataNascimento: '12/10/1972',
    profissao: 'Administrador',
    estadoCivil: 'Casado(a)',
    email: 'contato@cerestrading.com.br',
    ddi: '+55',
    telefone: '999999999',
    emailRepresentante: '',
    cep: '04534-011',
    localidade: 'Rua Joaquim Floriano',
    numero: '413',
    bairro: 'Itaim Bibi',
    infoAdicionais: 'Andar 20',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
  },
  {
    tipoPessoa: 'JURIDICA',
    documento: '56.025.302/0001-79',
    nome: 'CERES TRADING E INVESTIMENTOS S.A.',
    cnpj: '56.025.302/0001-79',
    razaoSocial: 'CERES TRADING E INVESTIMENTOS S.A.',
    nomeFantasia: 'CERES TRADING',
    dataAbertura: '22/6/2024',
    tipoEmpresa: 'MATRIZ',
    porte: 'DEMAIS',
    atividadePrincipal: 'Comércio atacadista de soja',
    naturezaJuridica: '205-4 - Sociedade Anônima Fechada',
    email: 'contato@cerestrading.com.br',
    ddi: '+55',
    telefone: '999999999',
    cep: '04534-011',
    localidade: 'Rua Joaquim Floriano',
    numero: '413',
    bairro: 'Itaim Bibi',
    infoAdicionais: 'Andar 20',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    contatos: ['CERES TRADING - contato'],
    enderecos: ['RUA JOAQUIM FLORIANO, 413'],
    representantes: ['MARCELO TARTARO'],
    representante: {
      cpf: '144.112.938-38',
      nome: 'MARCELO TARTARO',
      rg: '13.096.851-1',
      inscricaoProdutorRural: '',
      nacionalidade: 'BRASIL',
      dataNascimento: '12/10/1972',
      profissao: 'Administrador',
    },
  },
];

export function buscarClientePorDoc(doc: string): PessoaMinuta | undefined {
  const digits = doc.replace(/\D/g, '');
  if (!digits) return undefined;
  return MOCK_CLIENTES_MINUTA.find((c) => c.documento.replace(/\D/g, '') === digits || c.documento.includes(doc.trim()));
}

export function emptyPessoaMinuta(tipoPessoa: TipoPessoa = 'FISICA'): PessoaMinuta {
  return {
    tipoPessoa,
    documento: '',
    nome: '',
    cpf: '',
    rg: '',
    inscricaoProdutorRural: '',
    nacionalidade: '',
    dataNascimento: '',
    profissao: '',
    estadoCivil: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    dataAbertura: '',
    tipoEmpresa: '',
    porte: '',
    atividadePrincipal: '',
    naturezaJuridica: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
    email: '',
    ddi: '+55',
    telefone: '',
    emailRepresentante: '',
    cep: '',
    localidade: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    representante: {
      cpf: '',
      nome: '',
      rg: '',
      inscricaoProdutorRural: '',
      nacionalidade: '',
      dataNascimento: '',
      profissao: '',
      email: '',
    },
  };
}

export interface ProdutoMinuta {
  tipo: string;
  unidadeMedida: string;
  valorUnitario: string;
  quantidade: string;
  safra: string;
  localProducao: string;
  estadoProducao: string;
  cidadeProducao: string;
  matricula: string;
  ufRegistro: string;
  cidadeRegistro: string;
}

export function emptyProdutoMinuta(): ProdutoMinuta {
  return {
    tipo: '',
    unidadeMedida: '',
    valorUnitario: '',
    quantidade: '',
    safra: '',
    localProducao: '',
    estadoProducao: '',
    cidadeProducao: '',
    matricula: '',
    ufRegistro: '',
    cidadeRegistro: '',
  };
}

export interface EstoqueItem {
  propriedade: string;
  proprietario: string;
}

export interface GarantiaMinuta {
  tipo: string;
  valor: string;
  // Formação de estoque
  nomeImovel: string;
  matricula: string;
  zona: string;
  tipoImovel: string;
  areaTotal: string;
  unidadeMedidaArea: string;
  cartorioRegistro: string;
  ufRegistro: string;
  cidadeRegistro: string;
  // Endereço
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  tipoPessoaProprietario: TipoPessoa;
  // Locação
  imovelLocado: boolean;
  tipoLocacao: string;
  dataInicio: string;
  prazoIndeterminado: boolean;
  dataTermino: string;
  tipoPessoaLocado: TipoPessoa;
  nomeContratante: string;
  nomeContratado: string;
  // Estoques
  estoques: EstoqueItem[];
  // Relatório
  dataRelatorio: string;
  periodicidadeRelatorio: string;
  dataPrimeiraAtualizacao: string;
}

export function emptyGarantiaMinuta(): GarantiaMinuta {
  return {
    tipo: '',
    valor: '',
    nomeImovel: '',
    matricula: '',
    zona: '',
    tipoImovel: '',
    areaTotal: '',
    unidadeMedidaArea: '',
    cartorioRegistro: '',
    ufRegistro: '',
    cidadeRegistro: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    tipoPessoaProprietario: 'FISICA',
    imovelLocado: false,
    tipoLocacao: '',
    dataInicio: '',
    prazoIndeterminado: false,
    dataTermino: '',
    tipoPessoaLocado: 'FISICA',
    nomeContratante: '',
    nomeContratado: '',
    estoques: [],
    dataRelatorio: '',
    periodicidadeRelatorio: '',
    dataPrimeiraAtualizacao: '',
  };
}

export interface AvalistaMinutaRow {
  documento: string;
  nome: string;
  possuiConjuge: boolean;
  selecionadoAssinatura: boolean;
  conjugeInterveniente: boolean;
}

export interface ContaBancaria {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  titular: string;
}

export const CONTAS_BANCARIAS_MOCK: ContaBancaria[] = [
  { id: 'cb-1', banco: '341 - Itaú', agencia: '1234', conta: '56789-0', titular: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA' },
  { id: 'cb-2', banco: '001 - Banco do Brasil', agencia: '4321', conta: '12345-6', titular: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA' },
  { id: 'cb-3', banco: '237 - Bradesco', agencia: '9876', conta: '54321-0', titular: 'CERES TRADING E INVESTIMENTOS S.A.' },
];

export function labelContaBancaria(c: ContaBancaria): string {
  return `${c.banco} · Ag ${c.agencia} · Cc ${c.conta} · ${c.titular}`;
}

export interface BoletimSubscricao {
  subscritorPadrao: boolean;
  subscritor: PessoaMinuta;
  contaBancariaId: string;
  quantidade: string;
  precoTotalUnitario: string;
  precoSubscricao: string;
  diasIntegracao: string;
}

export function emptyBoletimSubscricao(): BoletimSubscricao {
  return {
    subscritorPadrao: false,
    subscritor: emptyPessoaMinuta('JURIDICA'),
    contaBancariaId: '',
    quantidade: '',
    precoTotalUnitario: '',
    precoSubscricao: '',
    diasIntegracao: '',
  };
}

export interface CetForm {
  cetDia: string;
  cetMes: string;
  cetAno: string;
  iofValor: string;
  iofPercentual: string;
  custoEmissaoValor: string;
  custoEmissaoPercentual: string;
  taxaAD: string;
  taxaAM: string;
  taxaAA: string;
}

export function emptyCetForm(): CetForm {
  return {
    cetDia: '',
    cetMes: '',
    cetAno: '',
    iofValor: '',
    iofPercentual: '',
    custoEmissaoValor: '',
    custoEmissaoPercentual: '',
    taxaAD: '',
    taxaAM: '',
    taxaAA: '',
  };
}

export interface EmissaoMinuta {
  uf: string;
  cidade: string;
  numero?: string;
  serie?: string;
  valorNominalUnitario?: string;
  quantidade?: string;
  valorTotal?: string;
}

export interface TituloMinutaForm {
  tipoValorLiquido: boolean;
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  chaveNota: string;
  docCedente: string;
  gerarOperacaoGarantias: boolean;
  possuiCronograma: boolean;
  cronogramaAutomatico: boolean;
  fluxoAmortizacao: string;
  fluxoJuros: string;
  sacadoDocumento: string;
  sacadoNome: string;
  sacadoEmail: string;
  ddi: string;
  telefone: string;
  cep: string;
  endereco: string;
  numeroEndereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface MinutaResumo {
  template: string;
  gerarViaNaoNegociavel: boolean;
  emitentes: PessoaMinuta[];
  credora: PessoaMinuta | null;
  credoraPadrao: string;
  avalistas: AvalistaMinutaRow[];
  possuiAvalistas: boolean;
  emissao: EmissaoMinuta;
  produtos: ProdutoMinuta[];
  garantias: GarantiaMinuta[];
  // NC
  escriturador?: PessoaMinuta | null;
  escrituradorPadrao?: string;
  contaBancariaId?: string;
  boletimSubscricao?: BoletimSubscricao | null;
  // CCB
  endossatario?: PessoaMinuta | null;
  endossatarioPadrao?: string;
  cet?: CetForm;
}

export function emptyMinutaResumo(tipo: string): MinutaResumo {
  return {
    template: templateMinuta(tipo),
    gerarViaNaoNegociavel: categoriaMinuta(tipo) !== 'NC',
    emitentes: [],
    credora: null,
    credoraPadrao: '',
    avalistas: [],
    possuiAvalistas: true,
    emissao: { uf: '', cidade: '' },
    produtos: [],
    garantias: [],
  };
}
