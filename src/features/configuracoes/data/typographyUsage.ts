export interface TypographyScaleItem {
  token: string;
  rem: string;
  pxApprox: string;
  sample: string;
}

export interface TypographyWeightItem {
  token: string;
  value: number;
  sample: string;
}

export interface TypographyUsageRow {
  role: string;
  sizeToken: string;
  weightToken: string;
  extras: string;
  where: string;
}

export const TYPOGRAPHY_SCALE: TypographyScaleItem[] = [
  { token: '--text-micro', rem: '0.6875rem', pxApprox: '11px', sample: 'Micro · metadados densos' },
  { token: '--text-xs', rem: '0.75rem', pxApprox: '12px', sample: 'Extra small · hints e CTAs de card' },
  { token: '--text-sm', rem: '0.8125rem', pxApprox: '13px', sample: 'Small · corpo secundário e cards' },
  { token: '--text-base', rem: '0.875rem', pxApprox: '14px', sample: 'Base · corpo padrão (html 14px)' },
  { token: '--text-md', rem: '1rem', pxApprox: '16px', sample: 'Medium · destaque leve' },
  { token: '--text-lg', rem: '1.125rem', pxApprox: '18px', sample: 'Large · subtítulos' },
  { token: '--text-xl', rem: '1.25rem', pxApprox: '20px', sample: 'XL · título de detalhe' },
  { token: '--text-2xl', rem: '1.5rem', pxApprox: '24px', sample: '2XL · títulos de seção' },
  { token: '--text-3xl', rem: '1.875rem', pxApprox: '30px', sample: '3XL · destaques' },
  { token: '--text-4xl', rem: '2.25rem', pxApprox: '36px', sample: '4XL · valores hero / KPI' },
];

export const TYPOGRAPHY_WEIGHTS: TypographyWeightItem[] = [
  { token: '--weight-regular', value: 400, sample: 'Regular 400' },
  { token: '--weight-medium', value: 500, sample: 'Medium 500' },
  { token: '--weight-semibold', value: 600, sample: 'Semibold 600' },
  { token: '--weight-bold', value: 700, sample: 'Bold 700' },
];

export const TYPOGRAPHY_USAGE: TypographyUsageRow[] = [
  {
    role: 'Eyebrow / breadcrumb de módulo',
    sizeToken: '11px (fixo)',
    weightToken: '--weight-bold',
    extras: 'uppercase · letter-spacing 0.18em · --accent',
    where: 'Cabeçalhos de Relatórios, hubs e detalhes',
  },
  {
    role: 'Título de página (H1)',
    sizeToken: '26px (fixo) / --text-2xl',
    weightToken: '--weight-bold',
    extras: 'letter-spacing -0.02em · --text-strong',
    where: 'Hubs (Relatórios, Configurações, Componentes)',
  },
  {
    role: 'Título de detalhe (H2)',
    sizeToken: '--text-xl',
    weightToken: '--weight-bold',
    extras: 'letter-spacing -0.01em · --text-strong',
    where: 'Após voltar em Relatórios / showcases',
  },
  {
    role: 'Label de campo',
    sizeToken: '10px (fixo)',
    weightToken: '--weight-bold',
    extras: 'uppercase · letter-spacing 0.10em · --text-muted',
    where: 'Formulários, filtros de relatório, campos da galeria',
  },
  {
    role: 'Corpo / descrição',
    sizeToken: '--text-sm',
    weightToken: '--weight-regular',
    extras: '--text-muted · line-height 1.5',
    where: 'Descrições de card, textos de apoio',
  },
  {
    role: 'Célula de tabela',
    sizeToken: '--text-sm',
    weightToken: '--weight-regular / --weight-medium',
    extras: 'tabular-nums em valores · --text-default',
    where: 'Listagens e DataTables',
  },
  {
    role: 'Header de tabela',
    sizeToken: '--text-xs / 10–11px',
    weightToken: '--weight-bold',
    extras: 'uppercase · --text-muted',
    where: 'Cabeçalhos de colunas',
  },
  {
    role: 'CTA de card / link de ação',
    sizeToken: '--text-xs',
    weightToken: '--weight-bold',
    extras: '--accent',
    where: '“Configurar e exportar”, “Abrir galeria”',
  },
  {
    role: 'Botão / ação primária',
    sizeToken: '--text-sm',
    weightToken: '--weight-semibold / --weight-bold',
    extras: '--action-primary-*',
    where: 'Submit, exportar, salvar',
  },
  {
    role: 'Valor numérico destacado',
    sizeToken: '--text-4xl / 36px',
    weightToken: '--weight-bold',
    extras: 'letter-spacing -0.02em · tabular-nums',
    where: 'KPIs e cards de resumo (Guidelines § hero values)',
  },
];
