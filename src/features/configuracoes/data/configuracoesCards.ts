export type ConfiguracoesCardKey = 'componentes' | 'telas';

export interface ConfiguracoesCard {
  key: ConfiguracoesCardKey;
  title: string;
  description: string;
  cta: string;
}

export const CONFIGURACOES_CARDS: ConfiguracoesCard[] = [
  {
    key: 'componentes',
    title: 'Componentes',
    description:
      'Galeria de referência visual: botões, tabelas, campos, tipografia, espaçamento e tokens para manter fidelidade à prototipação.',
    cta: 'Abrir galeria',
  },
  {
    key: 'telas',
    title: 'Telas',
    description:
      'Dissecção por tela em Markdown: imports, componente e style scoped para colar no front sem reinventar o visual.',
    cta: 'Abrir dissecção',
  },
];
