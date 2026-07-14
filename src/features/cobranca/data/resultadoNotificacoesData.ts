export type StatusDisparo = 'SUCESSO' | 'FALHA' | 'PROCESSANDO';
export type CanalDisparo = 'Email' | 'WhatsApp' | 'SMS' | 'Carta';

export interface DisparoNotificacao {
  id: string;
  lote: string;
  campanha: string;
  canal: CanalDisparo;
  veiculoNome: string;
  dataHora: string;
  totalDestinatarios: number;
  entregues: number;
  abertos: number;
  falhas: number;
  status: StatusDisparo;
  /** IDs de notificações de cessão vinculadas */
  notificacaoIds: string[];
}

export const STATUS_DISPARO_OPTS: StatusDisparo[] = ['SUCESSO', 'FALHA', 'PROCESSANDO'];
export const CANAL_DISPARO_OPTS: CanalDisparo[] = ['Email', 'WhatsApp', 'SMS', 'Carta'];

export function statusDisparoLabel(s: StatusDisparo): string {
  return (
    {
      SUCESSO: 'Sucesso',
      FALHA: 'Falha',
      PROCESSANDO: 'Em processamento',
    } as const
  )[s];
}

export function statusDisparoColor(s: StatusDisparo): string {
  return (
    {
      SUCESSO: 'var(--success-base)',
      FALHA: 'var(--danger-base)',
      PROCESSANDO: 'var(--warning-base)',
    } as const
  )[s];
}

export function taxaEntrega(d: DisparoNotificacao): number {
  if (d.totalDestinatarios === 0) return 0;
  return (d.entregues / d.totalDestinatarios) * 100;
}

export function taxaAbertura(d: DisparoNotificacao): number {
  if (d.entregues === 0) return 0;
  return (d.abertos / d.entregues) * 100;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

export const DISPAROS_SEED: DisparoNotificacao[] = [
  {
    id: 'disp-1',
    lote: 'LOT-2026-0714-01',
    campanha: 'Cessão — Vencidos D+7',
    canal: 'Email',
    veiculoNome: 'CRA Semeagro IV',
    dataHora: '14/07/2026 08:15',
    totalDestinatarios: 42,
    entregues: 40,
    abertos: 28,
    falhas: 2,
    status: 'SUCESSO',
    notificacaoIds: ['nc-1', 'nc-9'],
  },
  {
    id: 'disp-2',
    lote: 'LOT-2026-0714-02',
    campanha: 'Cessão — Pendentes do dia',
    canal: 'WhatsApp',
    veiculoNome: 'T.I Tecnologia FIDC',
    dataHora: '14/07/2026 09:40',
    totalDestinatarios: 18,
    entregues: 0,
    abertos: 0,
    falhas: 0,
    status: 'PROCESSANDO',
    notificacaoIds: ['nc-2', 'nc-10'],
  },
  {
    id: 'disp-3',
    lote: 'LOT-2026-0713-01',
    campanha: 'Régua Agressiva — Cobrança',
    canal: 'SMS',
    veiculoNome: '2ª CRA Futura Insumos',
    dataHora: '13/07/2026 16:22',
    totalDestinatarios: 25,
    entregues: 12,
    abertos: 5,
    falhas: 13,
    status: 'FALHA',
    notificacaoIds: ['nc-3'],
  },
  {
    id: 'disp-4',
    lote: 'LOT-2026-0712-03',
    campanha: 'Cessão — Carta AR',
    canal: 'Carta',
    veiculoNome: 'BOASAFRA FIDC',
    dataHora: '12/07/2026 11:05',
    totalDestinatarios: 8,
    entregues: 8,
    abertos: 0,
    falhas: 0,
    status: 'SUCESSO',
    notificacaoIds: ['nc-4'],
  },
  {
    id: 'disp-5',
    lote: 'LOT-2026-0711-01',
    campanha: 'Régua Padrão — A Vencer',
    canal: 'Email',
    veiculoNome: 'Ceres Confina LTDA',
    dataHora: '11/07/2026 07:50',
    totalDestinatarios: 56,
    entregues: 54,
    abertos: 31,
    falhas: 2,
    status: 'SUCESSO',
    notificacaoIds: ['nc-5'],
  },
  {
    id: 'disp-6',
    lote: 'LOT-2026-0710-02',
    campanha: 'Cessão — Reenvio falhas',
    canal: 'Email',
    veiculoNome: 'Valoriza FIDC',
    dataHora: '10/07/2026 15:30',
    totalDestinatarios: 14,
    entregues: 4,
    abertos: 1,
    falhas: 10,
    status: 'FALHA',
    notificacaoIds: ['nc-8'],
  },
  {
    id: 'disp-7',
    lote: 'LOT-2026-0709-01',
    campanha: 'Régua Gentil — Lembrete',
    canal: 'Email',
    veiculoNome: '34ª CRA Nativa',
    dataHora: '09/07/2026 10:00',
    totalDestinatarios: 30,
    entregues: 0,
    abertos: 0,
    falhas: 0,
    status: 'PROCESSANDO',
    notificacaoIds: ['nc-7'],
  },
  {
    id: 'disp-8',
    lote: 'LOT-2026-0708-04',
    campanha: 'Cessão — WhatsApp lote manhã',
    canal: 'WhatsApp',
    veiculoNome: '42ª CRA Ceres',
    dataHora: '08/07/2026 09:10',
    totalDestinatarios: 22,
    entregues: 21,
    abertos: 17,
    falhas: 1,
    status: 'SUCESSO',
    notificacaoIds: ['nc-6'],
  },
];

export const CAMPANHA_OPTS = Array.from(new Set(DISPAROS_SEED.map((d) => d.campanha)));
