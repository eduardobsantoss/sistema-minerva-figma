import type { Component } from 'vue';
import {
  Building2,
  ClipboardList,
  Landmark,
  Layers,
  LayoutPanelLeft,
  Shield,
  Users,
  Wallet,
  Briefcase,
} from 'lucide-vue-next';

export type TelaDisseccaoKey =
  | 'shell'
  | 'solicitacao-operacao'
  | 'fidc'
  | 'cra'
  | 'cobranca'
  | 'risco'
  | 'grupos-empresariais'
  | 'ativos'
  | 'passivo';

export interface TelaDisseccao {
  key: TelaDisseccaoKey;
  title: string;
  description: string;
  cta: string;
}

export const TELAS_DISSECCOES: TelaDisseccao[] = [
  {
    key: 'shell',
    title: 'Login / Shell / Home',
    description: 'Login, topbar, sidebar, home, toasts, alerts e tela de erro HTTP.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'solicitacao-operacao',
    title: 'Solicitação de Operação',
    description: 'Lista, detalhe, abas, nested, novo pedido, modais e configs.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'fidc',
    title: "FIDC's",
    description: 'Listagem, detalhe, classes, simulador, relatórios e fluxos de criação.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'cra',
    title: "CRA's",
    description: 'Operações CRA, detalhes, simulador e relatórios.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'cobranca',
    title: 'Cobrança',
    description: 'Dashboard, títulos, notificações, cessão e relatórios.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'risco',
    title: 'Risco',
    description: 'Dashboard, grupos, ratings, agrupamentos e relatórios.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'grupos-empresariais',
    title: 'Grupos Empresariais',
    description: 'Listagem, cadastro, detalhe com cards e as 8 abas do grupo.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'ativos',
    title: 'Ativos',
    description: 'Listagem e detalhes de contratos e títulos.',
    cta: 'Abrir dissecção',
  },
  {
    key: 'passivo',
    title: 'Passivo',
    description: 'Telas e componentes do módulo Passivo.',
    cta: 'Abrir dissecção',
  },
];

export const TELA_ICONS: Record<TelaDisseccaoKey, Component> = {
  shell: LayoutPanelLeft,
  'solicitacao-operacao': ClipboardList,
  fidc: Landmark,
  cra: Building2,
  cobranca: Wallet,
  risco: Shield,
  'grupos-empresariais': Users,
  ativos: Layers,
  passivo: Briefcase,
};
