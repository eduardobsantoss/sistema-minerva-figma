import { reactive } from 'vue';
import {
  NOTIFICACOES_CESSAO_SEED,
  VEICULO_CESSAO_OPTS,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';

export type ParteNotificacao = 'cedente' | 'sacado';

export interface OperacaoNotificacao {
  id: string;
  nome: string;
  cessao: boolean;
  cobranca: boolean;
}

export interface ContatoSacado {
  id: string;
  nome: string;
  email: string;
  ddi: string;
  telefone: string;
  principal: boolean;
}

export const DDI_OPTS = [
  { value: '+55', label: 'Brasil (+55)' },
  { value: '+1', label: 'Estados Unidos (+1)' },
  { value: '+54', label: 'Argentina (+54)' },
  { value: '+595', label: 'Paraguai (+595)' },
  { value: '+598', label: 'Uruguai (+598)' },
  { value: '+351', label: 'Portugal (+351)' },
];

const operacoes = reactive<Record<string, OperacaoNotificacao[]>>({});
const contatos = reactive<Record<string, ContatoSacado[]>>({});
let seq = 0;

function chave(parte: ParteNotificacao, documento: string) {
  return `${parte}:${documento}`;
}

function slug(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function seedOperacoes(parte: ParteNotificacao, doc: string, itens: NotificacaoCessao[], indice: number) {
  const proprias: OperacaoNotificacao[] = itens.map((n) => ({
    id: n.veiculoId,
    nome: n.veiculoNome,
    cessao: parte === 'cedente' ? n.cedentePermiteNotificacao : n.sacadoPermiteNotificacao,
    cobranca: true,
  }));
  const ids = new Set(proprias.map((o) => o.id));
  const extras = VEICULO_CESSAO_OPTS.filter((v) => !ids.has(v.id));
  const quantidade = indice % 3 === 0 ? 2 : 1;
  for (let k = 0; k < quantidade && extras.length; k += 1) {
    const v = extras[(indice + k * 2) % extras.length];
    if (ids.has(v.id)) continue;
    ids.add(v.id);
    proprias.push({ id: v.id, nome: v.nome, cessao: (indice + k) % 4 !== 1, cobranca: (indice + k) % 5 !== 2 });
  }
  operacoes[chave(parte, doc)] = proprias;
}

function seedContatos(doc: string, itens: NotificacaoCessao[], indice: number) {
  const base = itens[0];
  const lista: ContatoSacado[] = [];
  const temEmail = itens.some((n) => n.emailSacado);
  if (temEmail) {
    lista.push({
      id: `ct-${++seq}`,
      nome: 'Financeiro',
      email: base.canal === 'Email' ? base.destinatario : `financeiro@${slug(base.sacado)}.com.br`,
      ddi: '+55',
      telefone: `(11) 3${String(100 + indice * 7).padStart(3, '0')}-${String(2000 + indice * 111).slice(0, 4)}`,
      principal: true,
    });
    if (indice % 2 === 0) {
      lista.push({
        id: `ct-${++seq}`,
        nome: 'Jurídico',
        email: `juridico@${slug(base.sacado)}.com.br`,
        ddi: '+55',
        telefone: '',
        principal: false,
      });
    }
  } else {
    lista.push({
      id: `ct-${++seq}`,
      nome: 'Recepção',
      email: '',
      ddi: '+55',
      telefone: `(44) 99${String(100 + indice * 13).padStart(3, '0')}-${String(1000 + indice * 97).slice(0, 4)}`,
      principal: true,
    });
  }
  contatos[chave('sacado', doc)] = lista;
}

(function seed() {
  const cedentes = new Map<string, NotificacaoCessao[]>();
  const sacados = new Map<string, NotificacaoCessao[]>();
  for (const n of NOTIFICACOES_CESSAO_SEED) {
    cedentes.set(n.cedenteCnpj, [...(cedentes.get(n.cedenteCnpj) ?? []), n]);
    sacados.set(n.sacadoCnpj, [...(sacados.get(n.sacadoCnpj) ?? []), n]);
  }
  [...cedentes.entries()].forEach(([doc, itens], i) => seedOperacoes('cedente', doc, itens, i));
  [...sacados.entries()].forEach(([doc, itens], i) => {
    seedOperacoes('sacado', doc, itens, i);
    seedContatos(doc, itens, i);
  });
})();

export interface ResumoOperacoes {
  ativas: number;
  total: number;
  tom: 'ok' | 'alerta' | 'falta';
  texto: string;
}

function resumir(lista: OperacaoNotificacao[], campo: 'cessao' | 'cobranca'): ResumoOperacoes {
  const total = lista.length;
  const ativas = lista.filter((o) => o[campo]).length;
  const tom = total > 0 && ativas === total ? 'ok' : ativas === 0 ? 'falta' : 'alerta';
  const sufixo = total === 1 ? 'operação' : 'operações';
  return { ativas, total, tom, texto: `${ativas} de ${total} ${sufixo} ativas` };
}

export function usePartesNotificacao() {
  const operacoesDe = (parte: ParteNotificacao, documento: string) => (operacoes[chave(parte, documento)] ??= []);
  const contatosDe = (documento: string) => (contatos[chave('sacado', documento)] ??= []);

  function resumoCessao(parte: ParteNotificacao, documento: string) {
    return resumir(operacoesDe(parte, documento), 'cessao');
  }

  function resumoCobranca(documento: string) {
    return resumir(operacoesDe('cedente', documento), 'cobranca');
  }

  function definirNotificacao(
    parte: ParteNotificacao,
    documento: string,
    operacaoId: string,
    campo: 'cessao' | 'cobranca',
    ativa: boolean,
  ) {
    const op = operacoesDe(parte, documento).find((o) => o.id === operacaoId);
    if (op) op[campo] = ativa;
    return op;
  }

  function definirTodas(parte: ParteNotificacao, documento: string, campo: 'cessao' | 'cobranca', ativa: boolean) {
    for (const op of operacoesDe(parte, documento)) op[campo] = ativa;
  }

  function adicionarContato(documento: string, dados: Omit<ContatoSacado, 'id' | 'principal'>) {
    const lista = contatosDe(documento);
    const contato: ContatoSacado = { ...dados, id: `ct-${++seq}`, principal: lista.length === 0 };
    lista.push(contato);
    return contato;
  }

  function removerContato(documento: string, id: string) {
    const lista = contatosDe(documento);
    const i = lista.findIndex((c) => c.id === id);
    if (i < 0) return null;
    const [removido] = lista.splice(i, 1);
    if (removido.principal && lista.length) lista[0].principal = true;
    return removido;
  }

  function definirPrincipal(documento: string, id: string) {
    const lista = contatosDe(documento);
    lista.forEach((c) => {
      c.principal = c.id === id;
    });
    return lista.find((c) => c.id === id) ?? null;
  }

  /** Aplica ao registro as condições que dependem do cadastro da parte (operações e contatos). */
  function efetivo(n: NotificacaoCessao): NotificacaoCessao {
    const ced = operacoesDe('cedente', n.cedenteCnpj).find((o) => o.id === n.veiculoId);
    const sac = operacoesDe('sacado', n.sacadoCnpj).find((o) => o.id === n.veiculoId);
    return {
      ...n,
      cedentePermiteNotificacao: ced ? ced.cessao : n.cedentePermiteNotificacao,
      sacadoPermiteNotificacao: sac ? sac.cessao : n.sacadoPermiteNotificacao,
      emailSacado: contatosDe(n.sacadoCnpj).some((c) => c.email.trim().length > 0),
    };
  }

  return {
    operacoesDe,
    contatosDe,
    resumoCessao,
    resumoCobranca,
    definirNotificacao,
    definirTodas,
    adicionarContato,
    removerContato,
    definirPrincipal,
    efetivo,
  };
}
