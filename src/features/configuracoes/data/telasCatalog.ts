import type { Component } from 'vue';
import { Building2, ClipboardList, Landmark, Layers, Shield, Wallet, Briefcase } from 'lucide-vue-next';

export type TelaDisseccaoKey =
  | 'solicitacao-operacao'
  | 'fidc'
  | 'cra'
  | 'cobranca'
  | 'risco'
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
  'solicitacao-operacao': ClipboardList,
  fidc: Landmark,
  cra: Building2,
  cobranca: Wallet,
  risco: Shield,
  ativos: Layers,
  passivo: Briefcase,
};
