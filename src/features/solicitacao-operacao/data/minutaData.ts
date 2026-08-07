import type { TipoPessoa } from './operacaoData';

export type CategoriaMinuta = 'CPR' | 'NC' | 'CCB';

export const TIPOS_MINUTA_DISPONIVEIS = [
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato NC',
  'Contrato CCB',
] as const;

/** NC / NCE / Nota Comercial → categoria de minuta NC. */
export function isTipoNc(tipo: string): boolean {
  const t = tipo.toUpperCase().replace(/\s/g, '').replace(/-/g, '');
  return (
    t === 'NC' ||
    t === 'NCE' ||
    t.includes('CONTRATONC') ||
    t.includes('CONTRATONCE') ||
    t.includes('NOTACOMERCIAL')
  );
}

export function categoriaMinuta(tipo: string): CategoriaMinuta {
  const t = tipo.toUpperCase().replace(/\s/g, '').replace(/-/g, '');
  if (t.includes('CCB') || t.includes('CONTRATOCCB')) return 'CCB';
  if (isTipoNc(tipo)) return 'NC';
  return 'CPR';
}

export function isTipoMinutaDisponivel(tipo: string): boolean {
  if ((TIPOS_MINUTA_DISPONIVEIS as readonly string[]).includes(tipo)) return true;
  const t = tipo.toUpperCase().replace(/\s/g, '').replace(/-/g, '');
  return (
    t === 'CPR' ||
    t === 'CPRF' ||
    t === 'NC' ||
    t === 'NCE' ||
    t === 'CCB' ||
    t.includes('CONTRATOCPR') ||
    t.includes('CONTRATONC') ||
    t.includes('CONTRATONCE') ||
    t.includes('CONTRATOCCB') ||
    isTipoNc(tipo)
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
export const UNIDADE_PESO_ANIMAL_OPTS = ['Quilograma', 'Arroba', 'Tonelada'];
export const CATEGORIA_ANIMAL_OPTS = ['Bezerro', 'Novilho', 'Boi magro', 'Boi gordo', 'Vaca'];
export const ZONA_OPTS = ['Rural', 'Urbana'];
export const TIPO_IMOVEL_OPTS = ['Fazenda', 'Armazém', 'Galpão', 'Silo'];
export const TIPO_LOCACAO_OPTS = ['Arrendamento', 'Comodato', 'Parceria Agrícola'];
export const PERIODICIDADE_RELATORIO_OPTS = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
export const TIPO_GARANTIA_MINUTA_OPTS = [
  'AF. Estoque',
  'AF. Ativos Biológicos',
  'AF. Lavoura',
  'AF. Imóvel',
  'AF. Bens Móveis',
  'Penhor de Estoque',
  'Cessão Fiduciária de Direitos Creditórios (DUPLICATAS)',
  'Cessão Fiduciária de Direitos Creditórios (CONTRATO)',
];

export const TIPO_CONTRATO_CESSAO_OPTS = ['CCB', 'CPR-F', 'CDCA', 'CDA-WA', 'NC', 'NCE', 'Duplicata'];
export const TIPO_TITULO_CESSAO_OPTS = ['CPR', 'CPR-F', 'CCB', 'CDCA', 'NC', 'Duplicata'];

/** Código do tipo no back-end quando diverge do label da UI. */
export function codigoGarantiaBackend(tipo: string): string {
  if (tipo === 'AF. Lavoura') return 'agricola';
  if (tipo === 'AF. Imóvel') return 'imovel';
  if (tipo === 'AF. Bens Móveis') return 'bens_moveis';
  if (tipo === 'Cessão Fiduciária de Direitos Creditórios (DUPLICATAS)') return 'cessao_fiduciaria_duplicatas';
  if (tipo === 'Cessão Fiduciária de Direitos Creditórios (CONTRATO)') return 'cessao_fiduciaria_contrato';
  return tipo;
}
export const FORMA_PRODUTO_GARANTIA_OPTS = ['Física', 'Financeira', 'Mista'];
export const CREDORA_PADRAO_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
export const CREDORA_PADRAO_OPTS_NC_CCB = ['Ceres Trading', 'Ceres Securitizadora', 'BMP'];
export const ESCRITURADOR_PADRAO_OPTS = ['Vortx', 'BMP'];
export const ENDOSSATARIO_PADRAO_OPTS = ['Ceres Trading', 'Ceres Securitizadora'];
export const SERIE_EMISSAO_OPTS = ['ÚNICA', 'SÉRIE 1', 'SÉRIE 2'];
export const MEIO_INTEGRALIZACAO_OPTS = [
  'TED',
  'DOC',
  'PIX',
  'Depósito em conta',
  'Compensação',
];
export const NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira', 'BRASIL'];
export const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
/** Estado civil nas garantias da minuta — sem União Estável. */
export const ESTADO_CIVIL_GARANTIA_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'];
/** Regimes de bens — Separação Total não exige formulário de cônjuge. */
export const REGIME_CASAMENTO_OPTS = [
  'Comunhão Parcial de Bens',
  'Comunhão Universal de Bens',
  'Separação Total de Bens',
  'Participação Final nos Aquestos',
];
/** Estados civis que exigem dados do cônjuge (SpouseDetailsForm) */
export const ESTADOS_CIVIS_COM_CONJUGE = ['Casado(a)', 'União Estável'];

export function estadoCivilExigeConjuge(estadoCivil?: string): boolean {
  return !!estadoCivil && ESTADOS_CIVIS_COM_CONJUGE.includes(estadoCivil);
}

/** Regime que não é separação (total/obrigatória) — exige formulário de cônjuge. */
export function regimeExigeConjuge(regime?: string): boolean {
  if (!regime?.trim()) return false;
  const n = regime
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  return !n.includes('separacao');
}

/** Casado/união estável + regime sem separação → mostra bloco do cônjuge. */
export function parteExigeFormularioConjuge(estadoCivil?: string, regime?: string): boolean {
  return estadoCivilExigeConjuge(estadoCivil) && regimeExigeConjuge(regime);
}

export function isGarantiaEstoque(tipo: string): boolean {
  return tipo === 'AF. Estoque' || tipo === 'Penhor de Estoque';
}

export function isGarantiaAtivosBiologicos(tipo: string): boolean {
  return tipo === 'AF. Ativos Biológicos';
}

export function isGarantiaLavoura(tipo: string): boolean {
  return tipo === 'AF. Lavoura';
}

export function isGarantiaImovel(tipo: string): boolean {
  return tipo === 'AF. Imóvel';
}

export function isGarantiaBensMoveis(tipo: string): boolean {
  return tipo === 'AF. Bens Móveis';
}

export function isGarantiaCessaoDuplicatas(tipo: string): boolean {
  return tipo === 'Cessão Fiduciária de Direitos Creditórios (DUPLICATAS)';
}

export function isGarantiaCessaoContrato(tipo: string): boolean {
  return tipo === 'Cessão Fiduciária de Direitos Creditórios (CONTRATO)';
}

export function isGarantiaCessao(tipo: string): boolean {
  return isGarantiaCessaoDuplicatas(tipo) || isGarantiaCessaoContrato(tipo);
}

/** Tipos de garantia com formulário específico (sem testemunhas / constituição / obrigação). */
export function isGarantiaFormularioEspecifico(tipo: string): boolean {
  return (
    isGarantiaEstoque(tipo) ||
    isGarantiaAtivosBiologicos(tipo) ||
    isGarantiaLavoura(tipo) ||
    isGarantiaImovel(tipo) ||
    isGarantiaBensMoveis(tipo) ||
    isGarantiaCessao(tipo)
  );
}

export function isGarantiaComFormaProduto(tipo: string): boolean {
  return isGarantiaEstoque(tipo) || tipo.includes('Estoque');
}

export function credoraPadraoOptions(categoria: CategoriaMinuta): string[] {
  if (categoria === 'NC' || categoria === 'CCB') return CREDORA_PADRAO_OPTS_NC_CCB;
  return CREDORA_PADRAO_OPTS;
}

export interface ConjugeMinuta {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nacionalidade: string;
  profissao: string;
}

export function emptyConjugeMinuta(): ConjugeMinuta {
  return {
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    nacionalidade: '',
    profissao: '',
  };
}

export interface RepresentanteLegal {
  cpf: string;
  nome: string;
  rg: string;
  inscricaoProdutorRural: string;
  nacionalidade: string;
  dataNascimento: string;
  profissao: string;
  estadoCivil?: string;
  email?: string;
  telefone?: string;
}

export interface PessoaMinuta {
  tipoPessoa: TipoPessoa;
  documento: string;
  nome: string;
  // PF
  cpf?: string;
  rg?: string;
  orgaoEmissorRg?: string;
  inscricaoProdutorRural?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  profissao?: string;
  estadoCivil?: string;
  regime?: string;
  dataCasamento?: string;
  conjuge?: ConjugeMinuta;
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
    orgaoEmissorRg: '',
    inscricaoProdutorRural: '',
    nacionalidade: '',
    dataNascimento: '',
    profissao: '',
    estadoCivil: '',
    regime: '',
    dataCasamento: '',
    conjuge: emptyConjugeMinuta(),
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
      estadoCivil: '',
      email: '',
      telefone: '',
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

export interface BemMovelItem {
  descricao: string;
  precoUnitario: string;
  quantidade: string;
  marca: string;
  modelo: string;
  anoFabricacao: string;
  numeroSerie: string;
  matricula: string;
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  cartorioRegistro: string;
  ufRegistro: string;
  cidadeRegistro: string;
  proprietario: string;
  /** Descrição livre dos documentos do bem */
  documentos: string;
}

export function emptyBemMovelDraft(): Omit<BemMovelItem, 'proprietario'> {
  return {
    descricao: '',
    precoUnitario: '',
    quantidade: '',
    marca: '',
    modelo: '',
    anoFabricacao: '',
    numeroSerie: '',
    matricula: '',
    cep: '',
    localidade: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    cartorioRegistro: '',
    ufRegistro: '',
    cidadeRegistro: '',
    documentos: '',
  };
}

export interface EnderecoLocacaoItem {
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
}

export function emptyEnderecoLocacaoItem(): EnderecoLocacaoItem {
  return {
    cep: '',
    localidade: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
  };
}

export interface GarantiaMinuta {
  tipo: string;
  valor: string;
  descricao: string;
  instrumentoParticular: boolean;
  constituirGarantia: boolean;
  numeroTestemunhas: string;
  formaProduto: string;
  obrigacaoGarantida: string;
  // Constituição (quando constituirGarantia)
  cartorioConstituicao: string;
  dataPrevistaConstituicao: string;
  observacoesConstituicao: string;
  // Formação de estoque (tipos estoque)
  numeroContratoEstoque: string;
  nomeImovel: string;
  matricula: string;
  zona: string;
  tipoImovel: string;
  areaTotal: string;
  unidadeMedidaArea: string;
  cartorioRegistro: string;
  ufRegistro: string;
  cidadeRegistro: string;
  // AF. Imóvel — campos opcionais
  car: string;
  nirf: string;
  ccir: string;
  ccirAno: string;
  sigefIncra: string;
  possuiSeguro: boolean;
  // AF. Ativos Biológicos
  quantidadeAnimais: string;
  categoriaAnimal: string;
  pesoMedio: string;
  unidadeMedidaPeso: string;
  // AF. Lavoura (back-end: agricola)
  tamanhoArea: string;
  unidadeMedidaTamanhoArea: string;
  anoSafra: string;
  produto: string;
  quantidadeProduto: string;
  unidadeMedidaProduto: string;
  precoUnitario: string;
  enderecosLocacao: EnderecoLocacaoItem[];
  // Endereço da locação / estoque (draft ou endereço único)
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  proprietarioGarantia: PessoaMinuta;
  // Locação / arrendamento
  imovelLocado: boolean;
  tipoLocacao: string;
  dataInicio: string;
  prazoIndeterminado: boolean;
  dataTermino: string;
  proprietarioLocado: PessoaMinuta;
  nomeContratante: string;
  nomeContratado: string;
  // Estoques
  estoques: EstoqueItem[];
  // Relatório
  dataRelatorio: string;
  periodicidadeRelatorio: string;
  dataPrimeiraAtualizacao: string;
  // Cessão Fiduciária de Direitos Creditórios (DUPLICATAS / CONTRATO)
  tipoTitulo: string;
  tipoContrato: string;
  dataEmissaoContrato: string;
  dataVencimentoContrato: string;
  descricaoContrato: string;
  cedenteDocumento: string;
  cedenteNome: string;
  sacadoDocumento: string;
  sacadoNome: string;
  /** Endereço do sacado (CONTRATO) — campos no form; não obrigatório além de doc/nome */
  sacadoCep: string;
  sacadoLocalidade: string;
  sacadoNumero: string;
  sacadoBairro: string;
  sacadoInfoAdicionais: string;
  sacadoCidade: string;
  sacadoEstado: string;
  sacadoPais: string;
  cadastrarCamposOpcionais: boolean;
  pctEquivalenteCprf: string;
  dataAssinatura: string;
  representantes: string[];
  bancoEscrow: string;
  contaEscrow: string;
  agenciaEscrow: string;
  titularEscrow: string;
  // AF. Bens Móveis
  bensMoveis: BemMovelItem[];
  /** Uso da garantia na tabela (0 / 50 / 100) */
  percentualUsado: 0 | 50 | 100;
  /** Configuração do modal “Configurar constituição da garantia” */
  constituicao: ConstitucaoGarantiaConfig;
}

export interface TestemunhaConstituicao {
  cpf: string;
  nome: string;
  email: string;
}

export interface ObrigacaoGarantidaConstituicao {
  instrumentoNome: string;
  documentoInstrumento: string;
  compradora: string;
  vendedora: string;
  fiadores: string;
  local: string;
  data: string;
  produto: string;
  quantidade: string;
  valor: string;
}

export interface ConstitucaoGarantiaConfig {
  instrumentoParticular: boolean;
  constituirGarantia: boolean;
  cessaoVinculada: string;
  cedenteDoc: string;
  representanteLegalGrupo: string;
  contatoCedente: string;
  enderecoCedente: string;
  possuiTestemunhas: boolean;
  testemunhas: TestemunhaConstituicao[];
  fiduciariaPadrao: string;
  fiduciaria: PessoaMinuta;
  obrigacao: ObrigacaoGarantidaConstituicao;
}

export const FIDUCIARIA_PADRAO_OPTS = ['Ceres Trading', 'Ceres Securitizadora', 'BMP', 'Vortx'];

export interface CessaoVinculadaMock {
  id: string;
  label: string;
  totalValorCompra: string;
  totalValorNominal: string;
  quantidadeTitulos: number;
}

/** Cessões mock para o select “Cessão vinculada” + card de resumo. */
export const CESSOES_VINCULADAS_MOCK: CessaoVinculadaMock[] = [
  {
    id: 'PEDRO_OP.2361_06082026',
    label: 'PEDRO_OP.2361_06082026',
    totalValorCompra: 'R$ 428.826,34',
    totalValorNominal: 'R$ 500.000,00',
    quantidadeTitulos: 1,
  },
  {
    id: 'CERES_OP.1842_12072026',
    label: 'CERES_OP.1842_12072026',
    totalValorCompra: 'R$ 1.250.000,00',
    totalValorNominal: 'R$ 1.400.000,00',
    quantidadeTitulos: 3,
  },
  {
    id: 'BMP_OP.0911_01062026',
    label: 'BMP_OP.0911_01062026',
    totalValorCompra: 'R$ 89.500,00',
    totalValorNominal: 'R$ 100.000,00',
    quantidadeTitulos: 2,
  },
];

export const CESSAO_VINCULADA_OPTS = CESSOES_VINCULADAS_MOCK.map((c) => c.label);

export function cessaoVinculadaPorLabel(label: string): CessaoVinculadaMock | undefined {
  return CESSOES_VINCULADAS_MOCK.find((c) => c.label === label || c.id === label);
}

export function emptyTestemunhaConstituicao(): TestemunhaConstituicao {
  return { cpf: '', nome: '', email: '' };
}

export function emptyObrigacaoGarantidaConstituicao(): ObrigacaoGarantidaConstituicao {
  return {
    instrumentoNome: '',
    documentoInstrumento: '',
    compradora: '',
    vendedora: '',
    fiadores: '',
    local: '',
    data: '',
    produto: '',
    quantidade: '',
    valor: '',
  };
}

export function emptyConstituicaoGarantia(): ConstitucaoGarantiaConfig {
  return {
    instrumentoParticular: false,
    constituirGarantia: false,
    cessaoVinculada: '',
    cedenteDoc: '',
    representanteLegalGrupo: '',
    contatoCedente: '',
    enderecoCedente: '',
    possuiTestemunhas: false,
    testemunhas: [],
    fiduciariaPadrao: '',
    fiduciaria: emptyPessoaMinuta('JURIDICA'),
    obrigacao: emptyObrigacaoGarantidaConstituicao(),
  };
}

export function emptyGarantiaMinuta(): GarantiaMinuta {
  return {
    tipo: '',
    valor: '',
    descricao: '',
    instrumentoParticular: false,
    constituirGarantia: false,
    numeroTestemunhas: '',
    formaProduto: '',
    obrigacaoGarantida: '',
    cartorioConstituicao: '',
    dataPrevistaConstituicao: '',
    observacoesConstituicao: '',
    numeroContratoEstoque: '',
    nomeImovel: '',
    matricula: '',
    zona: '',
    tipoImovel: '',
    areaTotal: '',
    unidadeMedidaArea: '',
    cartorioRegistro: '',
    ufRegistro: '',
    cidadeRegistro: '',
    car: '',
    nirf: '',
    ccir: '',
    ccirAno: '',
    sigefIncra: '',
    possuiSeguro: false,
    quantidadeAnimais: '',
    categoriaAnimal: '',
    pesoMedio: '',
    unidadeMedidaPeso: '',
    tamanhoArea: '',
    unidadeMedidaTamanhoArea: '',
    anoSafra: '',
    produto: '',
    quantidadeProduto: '',
    unidadeMedidaProduto: '',
    precoUnitario: '',
    enderecosLocacao: [],
    cep: '',
    localidade: '',
    numero: '',
    bairro: '',
    infoAdicionais: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    proprietarioGarantia: emptyPessoaMinuta('FISICA'),
    imovelLocado: false,
    tipoLocacao: '',
    dataInicio: '',
    prazoIndeterminado: false,
    dataTermino: '',
    proprietarioLocado: emptyPessoaMinuta('FISICA'),
    nomeContratante: '',
    nomeContratado: '',
    estoques: [],
    dataRelatorio: '',
    periodicidadeRelatorio: '',
    dataPrimeiraAtualizacao: '',
    tipoTitulo: '',
    tipoContrato: '',
    dataEmissaoContrato: '',
    dataVencimentoContrato: '',
    descricaoContrato: '',
    cedenteDocumento: '',
    cedenteNome: '',
    sacadoDocumento: '',
    sacadoNome: '',
    sacadoCep: '',
    sacadoLocalidade: '',
    sacadoNumero: '',
    sacadoBairro: '',
    sacadoInfoAdicionais: '',
    sacadoCidade: '',
    sacadoEstado: '',
    sacadoPais: 'Brasil',
    cadastrarCamposOpcionais: false,
    pctEquivalenteCprf: '',
    dataAssinatura: '',
    representantes: [],
    bancoEscrow: '',
    contaEscrow: '',
    agenciaEscrow: '',
    titularEscrow: '',
    bensMoveis: [],
    percentualUsado: 0,
    constituicao: emptyConstituicaoGarantia(),
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
  digitoAgencia: string;
  conta: string;
  digitoConta: string;
  tipoConta: string;
  chavePix: string;
  titular: string;
}

export const TIPO_CONTA_OPTS = ['Corrente', 'Poupança'];
export const BANCO_OPTS = [
  '001 - Banco do Brasil',
  '033 - Santander',
  '104 - Caixa Econômica',
  '237 - Bradesco',
  '341 - Itaú',
  '756 - Sicoob',
];

export const CONTAS_BANCARIAS_MOCK: ContaBancaria[] = [
  {
    id: 'cb-1',
    banco: '341 - Itaú',
    agencia: '1234',
    digitoAgencia: '5',
    conta: '56789',
    digitoConta: '0',
    tipoConta: 'Corrente',
    chavePix: '34.470.721/0001-87',
    titular: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  },
  {
    id: 'cb-2',
    banco: '001 - Banco do Brasil',
    agencia: '4321',
    digitoAgencia: '',
    conta: '12345',
    digitoConta: '6',
    tipoConta: 'Corrente',
    chavePix: '',
    titular: 'AVANTIAGRO COMERCIAL AGRÍCOLA LTDA',
  },
  {
    id: 'cb-3',
    banco: '237 - Bradesco',
    agencia: '9876',
    digitoAgencia: '1',
    conta: '54321',
    digitoConta: '0',
    tipoConta: 'Poupança',
    chavePix: 'contato@cerestrading.com.br',
    titular: 'CERES TRADING E INVESTIMENTOS S.A.',
  },
];

export function labelContaBancaria(c: ContaBancaria): string {
  const ag = c.digitoAgencia ? `${c.agencia}-${c.digitoAgencia}` : c.agencia;
  const cc = c.digitoConta ? `${c.conta}-${c.digitoConta}` : c.conta;
  return `${c.banco} · Ag ${ag} · Cc ${cc} · ${c.tipoConta} · ${c.titular}`;
}

export function emptyContaBancariaDraft(): Omit<ContaBancaria, 'id'> {
  return {
    banco: '',
    agencia: '',
    digitoAgencia: '',
    conta: '',
    digitoConta: '',
    tipoConta: 'Corrente',
    chavePix: '',
    titular: '',
  };
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

/** Dados da cessão — step Título (createByOperation = sempre true no Adicionar Contrato) */
export interface CessaoForm {
  nome: string;
  dataDesembolso: string;
  taxaCessao: string;
  tipo: string;
  parametrizacaoCalculo: string;
  tipoCalculoCessao: string;
  pctGarantiaRecebiveis: string;
  pctGarantiaOutras: string;
  descontoAdicional: string;
  taxaMulta: string;
  taxaMora: string;
  usarCalculoUra: boolean;
  frequenciaTaxa: string;
  operador: string;
  indicadorTaxa: string;
  tipoCapitalizacao: string;
  baseDias: string;
  inicioContagemJuros: string;
  dataAccrual: string;
  usarCertificadorEmail: boolean;
  conversaoIndice: boolean;
  usarCalculoMercado: boolean;
  usarUltimaTaxaDisponivel: boolean;
  comCoobrigacao: boolean;
  obrigacaoRecompra: boolean;
}

export const CESSAO_TIPO_OPTS = ['Desembolso', 'Desembolso Parcial', 'Integralização', 'Composição de Garantia'];
export const CESSAO_PARAM_OPTS = [
  'URA — Pré-fixado',
  'URA — Pós-fixado',
  'Mercado — Pré-fixado',
  'Mercado — Pós-fixado',
  'Personalizado',
];
export const CESSAO_TIPO_CALCULO_OPTS = [
  'Deságio por valor nominal',
  'Ágio por valor líquido',
  'Sem cálculo por taxa',
  'Deságio de juros',
  'Deságio do CDCA',
];
export const CESSAO_FREQUENCIA_OPTS = ['Mensal', 'Anual', 'Diário'];
export const CESSAO_OPERADOR_OPTS = ['Multiplicativo', 'Aditivo', 'Indefinido'];
export const CESSAO_INDICADOR_OPTS = ['CDI', 'IPCA', 'Indefinido'];
export const CESSAO_CAPITALIZACAO_OPTS = ['Simples', 'Composto'];
export const CESSAO_BASE_DIAS_OPTS = ['21', '252', '360', '365'];
export const CESSAO_INICIO_JUROS_OPTS = [
  'D0 — Começa na data inicial',
  'D+1 — Começa no dia seguinte',
];
export const CESSAO_DATA_ACCRUAL_OPTS = ['Data da emissão do título', 'Data da cessão/desembolso'];

export function emptyCessaoForm(): CessaoForm {
  return {
    nome: '',
    dataDesembolso: '',
    taxaCessao: '1.7',
    tipo: '',
    parametrizacaoCalculo: '',
    tipoCalculoCessao: 'Deságio por valor nominal',
    pctGarantiaRecebiveis: '0',
    pctGarantiaOutras: '0',
    descontoAdicional: '0',
    taxaMulta: '',
    taxaMora: '',
    usarCalculoUra: false,
    frequenciaTaxa: 'Mensal',
    operador: 'Indefinido',
    indicadorTaxa: 'Indefinido',
    tipoCapitalizacao: 'Composto',
    baseDias: '252',
    inicioContagemJuros: 'D0 — Começa na data inicial',
    dataAccrual: 'Data da cessão/desembolso',
    usarCertificadorEmail: true,
    conversaoIndice: false,
    usarCalculoMercado: false,
    usarUltimaTaxaDisponivel: false,
    comCoobrigacao: true,
    obrigacaoRecompra: true,
  };
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
  cessao: CessaoForm;
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
  cessao?: CessaoForm;
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
