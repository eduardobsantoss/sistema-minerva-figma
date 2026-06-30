import {
  Settings,
  BarChart3,
  Package,
  Briefcase,
  Landmark,
  Database,
  ShieldCheck,
  Trees,
  AlertCircle,
  Receipt,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'accent';

export interface ModuleItem {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}

export const modules: ModuleItem[] = [
  {
    title: 'Solicitação de Operação',
    description: 'Esteira de pedidos de operação: criação, triagem e acompanhamento por etapa do processo.',
    icon: ClipboardList,
    tone: 'accent',
  },
  {
    title: 'Admin',
    description: 'Configurações gerais, permissões e administração da plataforma.',
    icon: Settings,
    tone: 'info',
  },
  {
    title: 'Gerencial',
    description: 'Indicadores estratégicos e análises consolidadas das operações.',
    icon: BarChart3,
    tone: 'success',
  },
  {
    title: 'Ativos',
    description: 'Gestão de ativos financeiros, lastros e composição de carteiras.',
    icon: Package,
    tone: 'warning',
  },
  {
    title: "CRA's",
    description: 'Estruturação e acompanhamento de Certificados de Recebíveis do Agronegócio.',
    icon: Briefcase,
    tone: 'info',
  },
  {
    title: "FIDC's",
    description: 'Fundos de Investimento em Direitos Creditórios e suas cotas.',
    icon: Landmark,
    tone: 'info',
  },
  {
    title: 'Cobrança',
    description: 'Réguas de notificação automática por Email, WhatsApp e SMS para títulos a vencer e vencidos.',
    icon: Receipt,
    tone: 'accent',
  },
  {
    title: 'Passivo',
    description: 'Controle de passivos, séries emitidas e obrigações com investidores.',
    icon: Database,
    tone: 'danger',
  },
  {
    title: 'Garantias',
    description: 'Monitoramento de garantias reais, fidejussórias e penhores agrícolas.',
    icon: ShieldCheck,
    tone: 'success',
  },
  {
    title: 'Confina',
    description: 'Operações de confinamento e ciclo produtivo pecuário integrado.',
    icon: Trees,
    tone: 'success',
  },
  {
    title: 'Risco',
    description: 'Monitoramento de exposição, alertas e métricas de risco operacional.',
    icon: AlertCircle,
    tone: 'accent',
  },
];

export const toneStyles: Record<Tone, { bg: string; color: string }> = {
  info:    { bg: 'var(--gci-light)',     color: 'var(--gci-base)' },
  success: { bg: 'var(--success-light)', color: 'var(--success-base)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning-base)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger-base)' },
  accent:  { bg: 'var(--agro-light)',    color: 'var(--agro-base)' },
};
