import type { Component } from 'vue';
import {
  Settings,
  BarChart3,
  Package,
  Briefcase,
  Landmark,
  Database,
  Trees,
  AlertCircle,
  Receipt,
  ClipboardList,
  Layers,
  Building2,
  ShieldAlert,
} from 'lucide-vue-next';

export type Tone =
  | 'info' | 'success' | 'warning' | 'danger' | 'accent'
  | 'slate' | 'green' | 'orange' | 'teal' | 'cyan' | 'red' | 'purple' | 'blue';

export interface ModuleItem {
  title: string;
  description: string;
  icon: Component;
  tone: Tone;
}

export const modules: ModuleItem[] = [
  {
    title: 'Admin',
    description: 'Configurações gerais, permissões e administração da plataforma.',
    icon: Settings,
    tone: 'slate',
  },
  {
    title: 'Gerencial',
    description: 'Indicadores estratégicos e análises consolidadas das operações.',
    icon: BarChart3,
    tone: 'green',
  },
  {
    title: 'Solicitação de Operação',
    description: 'Esteira de pedidos de operação: criação, triagem e acompanhamento por etapa do processo.',
    icon: ClipboardList,
    tone: 'orange',
  },
  {
    title: 'Ativos',
    description: 'Gestão de ativos financeiros, lastros e composição de carteiras.',
    icon: Package,
    tone: 'orange',
  },
  {
    title: "CRA's",
    description: 'Estruturação e acompanhamento de Certificados de Recebíveis do Agronegócio.',
    icon: Briefcase,
    tone: 'cyan',
  },
  {
    title: "FIDC's",
    description: 'Fundos de Investimento em Direitos Creditórios e suas cotas.',
    icon: Landmark,
    tone: 'teal',
  },
  {
    title: 'Semiestruturadas',
    description: 'Controle e gestão de operações semiestruturadas (NC, CPRF, CCB, CDCA, CDA e afins).',
    icon: Layers,
    tone: 'orange',
  },
  {
    title: 'Passivo',
    description: 'Controle de passivos, séries emitidas e obrigações com investidores.',
    icon: Database,
    tone: 'red',
  },
  {
    title: 'Confina',
    description: 'Operações de confinamento e ciclo produtivo pecuário integrado.',
    icon: Trees,
    tone: 'green',
  },
  {
    title: 'Risco',
    description: 'Monitoramento de exposição, alertas e métricas de risco operacional.',
    icon: AlertCircle,
    tone: 'red',
  },
  {
    title: 'Cobrança',
    description: 'Réguas de notificação automática por Email, WhatsApp e SMS para títulos a vencer e vencidos.',
    icon: Receipt,
    tone: 'orange',
  },
  {
    title: 'Grupos Empresariais',
    description: 'Grupos empresariais e partes relacionadas (PF/PJ, cônjuge, representante e tipos).',
    icon: Building2,
    tone: 'purple',
  },
  {
    title: 'Sentinela',
    description: 'Visão macro dos monitoramentos de risco de crédito: alertas, severidade e consulta em lote.',
    icon: ShieldAlert,
    tone: 'red',
  },
];

export const toneStyles: Record<Tone, { bg: string; color: string }> = {
  info:    { bg: 'var(--gci-light)',     color: 'var(--gci-base)' },
  success: { bg: 'var(--success-light)', color: 'var(--success-base)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning-base)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger-base)' },
  accent:  { bg: 'var(--agro-light)',    color: 'var(--agro-base)' },
  // Paleta alinhada às variants do ModuleCard do front-minerva.
  slate:  { bg: '#e8edf2', color: '#5b6b7c' },
  green:  { bg: '#e8f5e9', color: '#2e7d32' },
  orange: { bg: '#fff3e0', color: '#ed6c02' },
  teal:   { bg: '#e0f2f1', color: '#00796b' },
  cyan:   { bg: '#e0f7fa', color: '#0097a7' },
  red:    { bg: '#ffebee', color: '#d32f2f' },
  purple: { bg: '#f3e5f5', color: '#7b1fa2' },
  blue:   { bg: '#e3f2fd', color: '#1565c0' },
};
