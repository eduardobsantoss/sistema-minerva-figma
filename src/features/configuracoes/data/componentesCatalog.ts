export type ComponenteCategoryKey =
  | 'botoes'
  | 'tabelas'
  | 'campos'
  | 'icones'
  | 'tipografia'
  | 'espacamento'
  | 'cores';

export interface ComponenteCategory {
  key: ComponenteCategoryKey;
  title: string;
  description: string;
  cta: string;
}

export const COMPONENTES_CATEGORIES: ComponenteCategory[] = [
  {
    key: 'botoes',
    title: 'Botões',
    description: 'Variantes primary, secondary, danger e agro com estados hover, active e disabled.',
    cta: 'Ver botões',
  },
  {
    key: 'tabelas',
    title: 'Tabelas',
    description: 'Cabeçalhos, células e paginação no padrão Minerva para listagens.',
    cta: 'Ver tabelas',
  },
  {
    key: 'campos',
    title: 'Campos',
    description: 'Inputs, selects, datas, checkbox, switch e segmented toggle.',
    cta: 'Ver campos',
  },
  {
    key: 'icones',
    title: 'Ícones',
    description: 'Lucide nos tamanhos 14, 16 e 20 usados no produto.',
    cta: 'Ver ícones',
  },
  {
    key: 'tipografia',
    title: 'Tipografia',
    description: 'Escala, pesos e mapa de uso (labels, títulos, corpo, CTAs).',
    cta: 'Ver tipografia',
  },
  {
    key: 'espacamento',
    title: 'Espaçamento',
    description: 'Tokens de espaço, raio e sombra com valores em px.',
    cta: 'Ver espaçamento',
  },
  {
    key: 'cores',
    title: 'Cores',
    description: 'Primárias, semânticas, status, surfaces e bordas do theme.',
    cta: 'Ver cores',
  },
];
