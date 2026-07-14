export type Metodo = 'Email' | 'WhatsApp' | 'SMS';
export type NotificacaoStatus = 'Ativa' | 'Inativa';

export interface Notificacao {
  id: string;
  nome: string;
  metodos: Metodo[];
  intervalosAVencer: number[];
  intervalosVencidos: number[];
  veiculos: string[];
  status: NotificacaoStatus;
  /** Quando true, permite disparos em finais de semana e feriados. */
  enviaFimSemanaFeriado: boolean;
}

export const notificacoes: Notificacao[] = [
  {
    id: 'notif-1',
    nome: 'Régua Padrão — A Vencer',
    metodos: ['Email', 'WhatsApp'],
    intervalosAVencer: [30, 20, 15, 14, 13, 10, 7, 5],
    intervalosVencidos: [1, 5, 10, 15, 20],
    veiculos: ['FIDC Agro Capital', 'CRA Semeagro', 'CRA Rural Plus'],
    status: 'Ativa',
    enviaFimSemanaFeriado: false,
  },
  {
    id: 'notif-2',
    nome: 'Régua Agressiva — Cobrança',
    metodos: ['Email', 'WhatsApp', 'SMS'],
    intervalosAVencer: [7, 3, 1],
    intervalosVencidos: [1, 2, 3, 5, 10],
    veiculos: ['FIDC Agro Capital', 'FIDC Crédito Rural'],
    status: 'Ativa',
    enviaFimSemanaFeriado: true,
  },
  {
    id: 'notif-3',
    nome: 'Régua Gentil — Lembrete',
    metodos: ['Email'],
    intervalosAVencer: [30, 15, 7],
    intervalosVencidos: [5, 10],
    veiculos: ['CRA Semeagro'],
    status: 'Inativa',
    enviaFimSemanaFeriado: false,
  },
];

export const mockVeiculos = [
  { id: 'v1', nome: 'BOASAFRA FIDC',           tipo: 'FIDC'     as const },
  { id: 'v2', nome: 'Ceres Confina LTDA',       tipo: 'FIDC'     as const },
  { id: 'v3', nome: 'Valoriza FIDC',            tipo: 'FIDC'     as const },
  { id: 'v4', nome: '2ª - CRA Futura Insumos',  tipo: 'CRA'      as const },
  { id: 'v5', nome: '34ª CRA Nativa',           tipo: 'CRA'      as const },
  { id: 'v6', nome: '42ª - CRA Ceres',          tipo: 'CRA'      as const },
  { id: 'v7', nome: 'CDCA Forte Agro',          tipo: 'Garantia' as const },
  { id: 'v8', nome: 'CDCA Agro Sandri',         tipo: 'Garantia' as const },
  { id: 'v9', nome: 'CDCA Gemini 7',            tipo: 'Garantia' as const },
];

export type VeiculoTipo = 'FIDC' | 'CRA' | 'Garantia';
