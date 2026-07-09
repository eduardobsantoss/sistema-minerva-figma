import type { ParteRelacionada, TipoPessoa } from './operacaoData';

export interface ParteFieldDef {
  key: keyof ParteRelacionada;
  label: string;
  /** Quantas colunas o campo ocupa no grid (padrão: 1). */
  span?: number;
  /** Exibe o campo somente quando a condição for verdadeira. */
  when?: (parte: ParteRelacionada) => boolean;
}

export const PARTE_TIPO_LABEL: Record<string, string> = {
  AVA: 'Avalista',
  ITA: 'Interveniente Anuente',
  SOC: 'Sócio',
  REP: 'Representante Legal',
  CON: 'Cônjuge',
  PROC: 'Procurador',
};

export const TIPOS_PARTE_OPTS = Object.entries(PARTE_TIPO_LABEL).map(([codigo, label]) => ({
  codigo: codigo as keyof typeof PARTE_TIPO_LABEL,
  label,
}));

const isFisica = (p: ParteRelacionada) => p.tipoPessoa === 'FISICA';
const isJuridica = (p: ParteRelacionada) => p.tipoPessoa === 'JURIDICA';

/** Anexo 1 — Identificação (campos variam por natureza da pessoa). */
export const IDENTIFICACAO_FIELDS: ParteFieldDef[] = [
  { key: 'tipoPessoa', label: 'Natureza' },
  { key: 'cpf', label: 'CPF', when: isFisica },
  { key: 'nome', label: 'Nome', when: isFisica },
  { key: 'rg', label: 'RG', when: isFisica },
  { key: 'inscricaoProdutorRural', label: 'Inscrição do produtor rural', when: isFisica },
  { key: 'nacionalidade', label: 'Nacionalidade', when: isFisica },
  { key: 'dataNascimento', label: 'Data de nascimento', when: isFisica },
  { key: 'profissao', label: 'Profissão', when: isFisica },
  { key: 'estadoCivil', label: 'Estado Civil', when: isFisica },
  { key: 'cnpj', label: 'CNPJ', when: isJuridica },
  { key: 'razaoSocial', label: 'Razão Social', when: isJuridica },
  { key: 'nomeFantasia', label: 'Nome Fantasia', when: isJuridica },
  { key: 'dataAbertura', label: 'Data de abertura', when: isJuridica },
  { key: 'tipoEmpresa', label: 'Tipo', when: isJuridica },
  { key: 'porte', label: 'Porte', when: isJuridica },
  { key: 'atividadePrincipal', label: 'Atividade principal', when: isJuridica },
  { key: 'naturezaJuridica', label: 'Natureza Jurídica', when: isJuridica },
  { key: 'inscricaoMunicipal', label: 'Inscrição municipal', when: isJuridica },
  { key: 'inscricaoEstadual', label: 'Inscrição estadual', when: isJuridica },
];

/** Anexo 2 — Endereço. */
export const ENDERECO_FIELDS: ParteFieldDef[] = [
  { key: 'cep', label: 'CEP' },
  { key: 'localidade', label: 'Localidade' },
  { key: 'numero', label: 'Número' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'infoAdicionais', label: 'Informações adicionais', span: 2 },
  { key: 'cidade', label: 'Cidade' },
  { key: 'estado', label: 'Estado' },
  { key: 'pais', label: 'País' },
];

/** Anexo 3 — Contato. */
export const CONTATO_FIELDS: ParteFieldDef[] = [
  { key: 'nomeContato', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'ddi', label: 'DDI' },
  { key: 'telefone', label: 'Telefone' },
];

export interface ParteAnexoTab {
  key: 'anexo-1' | 'anexo-2' | 'anexo-3';
  label: string;
  fields: ParteFieldDef[];
  cols: number;
}

export function parteAnexoTabs(parte: ParteRelacionada): ParteAnexoTab[] {
  return [
    {
      key: 'anexo-1',
      label: 'Identificação',
      fields: IDENTIFICACAO_FIELDS,
      cols: parte.tipoPessoa === 'FISICA' ? 3 : 3,
    },
    {
      key: 'anexo-2',
      label: 'Endereço',
      fields: ENDERECO_FIELDS,
      cols: 2,
    },
    {
      key: 'anexo-3',
      label: 'Contato e Tipos',
      fields: CONTATO_FIELDS,
      cols: 2,
    },
  ];
}

export function visibleParteFields(parte: ParteRelacionada, fields: ParteFieldDef[]): ParteFieldDef[] {
  return fields.filter((f) => !f.when || f.when(parte));
}

export function parteFieldValue(parte: ParteRelacionada, field: ParteFieldDef): string {
  if (field.key === 'tipoPessoa') {
    return parte.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica';
  }
  const raw = parte[field.key];
  if (raw === undefined || raw === null || raw === '') return '—';
  if (typeof raw === 'boolean') return raw ? 'Sim' : 'Não';
  if (Array.isArray(raw)) return raw.join(', ');
  return String(raw);
}
