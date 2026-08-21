export type TipoClienteMon =
  | 'Normal'
  | 'Especial'
  | 'Recovery'
  | 'Terceiro'
  | 'Pre-Recovery'
  | 'special_sit';

export type VeiculoCessao = 'CRA CERES' | 'URA AGRO' | 'AGROVITA';

export type PrazoStatus = 'ok' | 'atencao' | 'vencido';

export type ToneKey = 'success' | 'warning' | 'danger' | 'active' | 'neutral' | 'accent';

export type CardGarantiaStatus = 'Finalizado' | 'Em Andamento' | 'Em Configuração';

export type TipoProdutoGarantia = 'AF de Estoque' | 'AF de Imóvel' | 'AF Agrícola';

export interface ToneStyle {
  bg: string;
  text: string;
  color: string;
}

export interface CardGarantia {
  id: string;
  nome: string;
  url: string;
  composto: boolean;
  valor: number;
  valorComposicao: number;
  status: CardGarantiaStatus;
}

export interface ProdutoGarantia {
  id: string;
  tipo: TipoProdutoGarantia;
  valor: number;
  pctUsado: number;
  ativo: string;
}

export interface Cessao {
  id: string;
  veiculo: VeiculoCessao;
  nome: string;
  data: string;
  valor: number;
  taxa: number;
  numeroOperacao: string;
  url: string;
  detalhes: string[];
  cardsGarantia?: CardGarantia[];
}

export interface MonitoringPedido {
  id: string;
  cliente: string;
  documento: string;
  tipoCliente: TipoClienteMon;
  risco: number;
  limite: number;
  prazo: string;
  gerente: string;
  detalhes: string[];
  cessoes: Cessao[];
  produtosGarantia: ProdutoGarantia[];
}

function isoOffset(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatDateBR(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('pt-BR');
}

export function prazoStatus(isoDate: string): PrazoStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((parseIsoDate(isoDate).getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 0) return 'vencido';
  if (diffDays <= 5) return 'atencao';
  return 'ok';
}

export function brl(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function toneStyle(tone: ToneKey): ToneStyle {
  switch (tone) {
    case 'success':
      return { bg: 'var(--status-success-bg)', text: 'var(--status-success-text)', color: 'var(--success-base)' };
    case 'warning':
      return { bg: 'var(--status-warning-bg)', text: 'var(--status-warning-text)', color: 'var(--warning-base)' };
    case 'danger':
      return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)', color: 'var(--danger-base)' };
    case 'active':
      return { bg: 'var(--status-active-bg)', text: 'var(--status-active-text)', color: 'var(--gci-base)' };
    case 'accent':
      return { bg: 'var(--accent-bg)', text: 'var(--accent)', color: 'var(--accent)' };
    default:
      return { bg: 'var(--status-neutral-bg)', text: 'var(--status-neutral-text)', color: 'var(--neutral-500)' };
  }
}

export function tipoClienteLabel(tipo: TipoClienteMon): string {
  return tipo === 'special_sit' ? 'Special Sit' : tipo;
}

export const TIPO_CLIENTE_OPTS: TipoClienteMon[] = [
  'Normal',
  'Especial',
  'Recovery',
  'Terceiro',
  'Pre-Recovery',
  'special_sit',
];

export const VEICULO_OPTS: VeiculoCessao[] = ['CRA CERES', 'URA AGRO', 'AGROVITA'];

export const PRAZO_STATUS_LABEL: Record<PrazoStatus, string> = {
  ok: 'OK',
  atencao: 'Precisa de Atenção',
  vencido: 'Vencido',
};

export function tipoClienteTone(tipo: TipoClienteMon): ToneKey {
  switch (tipo) {
    case 'Normal':
      return 'success';
    case 'Especial':
      return 'active';
    case 'Recovery':
      return 'danger';
    case 'Terceiro':
      return 'neutral';
    case 'Pre-Recovery':
      return 'warning';
    case 'special_sit':
      return 'accent';
  }
}

export function veiculoTone(veiculo: VeiculoCessao): ToneKey {
  switch (veiculo) {
    case 'CRA CERES':
      return 'active';
    case 'URA AGRO':
      return 'success';
    case 'AGROVITA':
      return 'accent';
  }
}

export function chipTone(texto: string): ToneKey {
  const t = texto.toLowerCase();
  if (/\bvencido\b|\burgente\b|\bimediata\b/.test(t)) return 'danger';
  if (t.includes('tudo ok') || t.includes('sem pendências') || t.includes('sem pendencias') || t.includes('monitoramento regular')) {
    return 'success';
  }
  if (t.includes('laudo')) return 'warning';
  if (/\brtd\b/.test(t) || t.includes('registro')) return 'active';
  if (t.includes('aguardando')) return 'accent';
  if (t.includes('escrituração') || t.includes('escrituracao') || t.includes('matrícula') || t.includes('matricula')) {
    return 'success';
  }
  if (t.includes('garantia') || t.includes('renovação') || t.includes('renovacao')) return 'warning';
  if (t.includes('confirmação') || t.includes('confirmacao') || t.includes('cliente')) return 'active';
  if (/\bb3\b/.test(t) || t.includes('cerc') || t.includes('compliance')) return 'accent';
  return 'neutral';
}

export function truncateChip(text: string, max = 45): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function visibleChips(detalhes: string[], max = 3): { shown: string[]; extra: number } {
  return { shown: detalhes.slice(0, max), extra: Math.max(0, detalhes.length - max) };
}

export function pctBarColor(pct: number): string {
  if (pct >= 80) return 'var(--danger-base)';
  if (pct >= 50) return 'var(--warning-base)';
  return 'var(--success-base)';
}

export function produtoGarantiaTone(tipo: TipoProdutoGarantia): ToneKey {
  switch (tipo) {
    case 'AF de Estoque':
      return 'warning';
    case 'AF de Imóvel':
      return 'success';
    case 'AF Agrícola':
      return 'active';
  }
}

export function cardStatusTone(status: CardGarantiaStatus): ToneKey {
  switch (status) {
    case 'Finalizado':
      return 'success';
    case 'Em Andamento':
      return 'warning';
    case 'Em Configuração':
      return 'active';
  }
}

const CARD_SOJA: CardGarantia[] = [
  {
    id: 'cg-soja-1',
    nome: 'AF Estoque Soja Safra 25/26',
    url: 'https://example.com/garantia/af-soja-2526',
    composto: true,
    valor: 4_200_000,
    valorComposicao: 3_150_000,
    status: 'Finalizado',
  },
  {
    id: 'cg-soja-2',
    nome: 'Imóvel Rural Matrícula 4412',
    url: 'https://example.com/garantia/imovel-4412',
    composto: false,
    valor: 8_800_000,
    valorComposicao: 0,
    status: 'Em Andamento',
  },
];

const CARD_BOI: CardGarantia[] = [
  {
    id: 'cg-boi-1',
    nome: 'Penhor Pecuário Lote 18',
    url: 'https://example.com/garantia/penhor-lote-18',
    composto: true,
    valor: 2_400_000,
    valorComposicao: 1_200_000,
    status: 'Em Configuração',
  },
];

export const PEDIDOS_SEED: MonitoringPedido[] = [
  {
    id: 'ped-3a',
    cliente: '3A MAQUINAS E TRANSPORTES LTDA',
    documento: '12.345.678/0001-90',
    tipoCliente: 'Normal',
    risco: 3_450_000,
    limite: 8_000_000,
    prazo: isoOffset(18),
    gerente: 'Carlos Mendes',
    detalhes: ['Monitoramento regular', 'Confirmação do cliente pendente'],
    cessoes: [
      {
        id: 'ces-3a-1',
        veiculo: 'CRA CERES',
        nome: 'Cessão CRA Ceres — Safra Grãos 25/26',
        data: isoOffset(-40),
        valor: 2_100_000,
        taxa: 14.2,
        numeroOperacao: 'OP-CRA-2026-0312',
        url: 'https://example.com/cessao/OP-CRA-2026-0312',
        detalhes: ['Registro RTD protocolado', 'Escrituração da matrícula em andamento'],
        cardsGarantia: CARD_SOJA,
      },
      {
        id: 'ces-3a-2',
        veiculo: 'URA AGRO',
        nome: 'URA Agro — Adiantamento Frete',
        data: isoOffset(-12),
        valor: 850_000,
        taxa: 16.5,
        numeroOperacao: 'OP-URA-2026-0881',
        url: 'https://example.com/cessao/OP-URA-2026-0881',
        detalhes: ['Tudo ok — sem pendências'],
      },
    ],
    produtosGarantia: [
      { id: 'pg-3a-1', tipo: 'AF de Estoque', valor: 4_200_000, pctUsado: 42, ativo: 'Soja em grãos — armazém Palmas/TO' },
      { id: 'pg-3a-2', tipo: 'AF de Imóvel', valor: 8_800_000, pctUsado: 61, ativo: 'Fazenda Santa Rita — 1.240 ha' },
    ],
  },
  {
    id: 'ped-fazenda-sn',
    cliente: 'FAZENDA SANTA NIVA AGROPECUARIA LTDA',
    documento: '98.765.432/0001-11',
    tipoCliente: 'Especial',
    risco: 6_200_000,
    limite: 10_000_000,
    prazo: isoOffset(3),
    gerente: 'Ana Beatriz Souza',
    detalhes: [
      'Atualização de laudo vencida',
      'Aguardando registro em cartório',
      'Renovação de garantia hipotecária',
      'Compliance CERC pendente',
    ],
    cessoes: [
      {
        id: 'ces-sn-1',
        veiculo: 'AGROVITA',
        nome: 'Agrovita — CPRF Soja Santa Niva',
        data: isoOffset(-22),
        valor: 4_800_000,
        taxa: 13.8,
        numeroOperacao: 'OP-AGV-2026-0144',
        url: 'https://example.com/cessao/OP-AGV-2026-0144',
        detalhes: ['Laudo de atualização em revisão', 'Aguardando confirmação do cliente'],
        cardsGarantia: [
          {
            id: 'cg-sn-1',
            nome: 'AF Agrícola Safra Santa Niva',
            url: 'https://example.com/garantia/af-santa-niva',
            composto: true,
            valor: 5_500_000,
            valorComposicao: 4_800_000,
            status: 'Em Andamento',
          },
        ],
      },
    ],
    produtosGarantia: [
      { id: 'pg-sn-1', tipo: 'AF Agrícola', valor: 5_500_000, pctUsado: 87, ativo: 'Lavoura soja 980 ha — Luís Eduardo Magalhães/BA' },
    ],
  },
  {
    id: 'ped-vale-verde',
    cliente: 'AGROPECUARIA VALE VERDE S/A',
    documento: '45.112.998/0001-22',
    tipoCliente: 'Recovery',
    risco: 9_750_000,
    limite: 12_000_000,
    prazo: isoOffset(-8),
    gerente: 'Roberto Lima',
    detalhes: ['Prazo vencido — ação imediata', 'Garantia em renovação urgente'],
    cessoes: [
      {
        id: 'ces-vv-1',
        veiculo: 'CRA CERES',
        nome: 'CRA Ceres — Reestruturação Vale Verde',
        data: isoOffset(-90),
        valor: 7_200_000,
        taxa: 18.9,
        numeroOperacao: 'OP-CRA-2025-1902',
        url: 'https://example.com/cessao/OP-CRA-2025-1902',
        detalhes: ['Laudo vencido', 'Registro B3 em atraso'],
        cardsGarantia: CARD_BOI,
      },
    ],
    produtosGarantia: [
      { id: 'pg-vv-1', tipo: 'AF de Imóvel', valor: 14_000_000, pctUsado: 92, ativo: 'Sede + 3 matrículas — Barreiras/BA' },
      { id: 'pg-vv-2', tipo: 'AF Agrícola', valor: 2_100_000, pctUsado: 55, ativo: 'Milho safrinha — 420 ha' },
    ],
  },
  {
    id: 'ped-cerrado',
    cliente: 'CERRADO GRÃOS COMERCIO E EXPORTACAO LTDA',
    documento: '33.220.114/0001-05',
    tipoCliente: 'Pre-Recovery',
    risco: 5_100_000,
    limite: 7_500_000,
    prazo: isoOffset(1),
    gerente: 'Fernanda Rocha',
    detalhes: ['Aguardando escrituração', 'Confirmação B3/CERC'],
    cessoes: [
      {
        id: 'ces-cg-1',
        veiculo: 'URA AGRO',
        nome: 'URA Agro — Exportação Grãos Cerrado',
        data: isoOffset(-18),
        valor: 3_300_000,
        taxa: 15.1,
        numeroOperacao: 'OP-URA-2026-0520',
        url: 'https://example.com/cessao/OP-URA-2026-0520',
        detalhes: ['Compliance CERC em análise'],
      },
      {
        id: 'ces-cg-2',
        veiculo: 'AGROVITA',
        nome: 'Agrovita — Tranche 2 Cerrado',
        data: isoOffset(-5),
        valor: 1_150_000,
        taxa: 15.4,
        numeroOperacao: 'OP-AGV-2026-0521',
        url: 'https://example.com/cessao/OP-AGV-2026-0521',
        detalhes: [],
        cardsGarantia: [
          {
            id: 'cg-cg-1',
            nome: 'Warrant Soja Armazém 07',
            url: 'https://example.com/garantia/warrant-07',
            composto: false,
            valor: 1_800_000,
            valorComposicao: 0,
            status: 'Finalizado',
          },
        ],
      },
    ],
    produtosGarantia: [
      { id: 'pg-cg-1', tipo: 'AF de Estoque', valor: 3_600_000, pctUsado: 48, ativo: 'Soja e milho — armazém Rondonópolis/MT' },
    ],
  },
  {
    id: 'ped-boi-forte',
    cliente: 'BOI FORTE PECUARIA LTDA',
    documento: '11.998.223/0001-77',
    tipoCliente: 'Normal',
    risco: 2_280_000,
    limite: 5_000_000,
    prazo: isoOffset(42),
    gerente: 'Carlos Mendes',
    detalhes: ['Tudo ok', 'Sem pendências'],
    cessoes: [
      {
        id: 'ces-bf-1',
        veiculo: 'URA AGRO',
        nome: 'URA Agro — Confinamento Boi Forte',
        data: isoOffset(-30),
        valor: 1_900_000,
        taxa: 12.7,
        numeroOperacao: 'OP-URA-2026-0401',
        url: 'https://example.com/cessao/OP-URA-2026-0401',
        detalhes: ['Monitoramento regular de garantia'],
        cardsGarantia: CARD_BOI,
      },
    ],
    produtosGarantia: [
      { id: 'pg-bf-1', tipo: 'AF Agrícola', valor: 3_200_000, pctUsado: 28, ativo: 'Rebanho ~1.800 cabeças — confinador Campo Grande/MS' },
    ],
  },
  {
    id: 'ped-sertao',
    cliente: 'SERTAO ALGODAO PROCESSAMENTO S/A',
    documento: '77.443.221/0001-38',
    tipoCliente: 'Especial',
    risco: 11_400_000,
    limite: 15_000_000,
    prazo: isoOffset(5),
    gerente: 'Juliana Alves',
    detalhes: ['Atualização de laudo', 'Matrícula em cartório', 'Registro RTD'],
    cessoes: [
      {
        id: 'ces-sa-1',
        veiculo: 'CRA CERES',
        nome: 'CRA Ceres — Algodão Sertão 2026',
        data: isoOffset(-55),
        valor: 8_600_000,
        taxa: 13.2,
        numeroOperacao: 'OP-CRA-2026-0088',
        url: 'https://example.com/cessao/OP-CRA-2026-0088',
        detalhes: ['Escrituração concluída', 'Aguardando registro B3'],
        cardsGarantia: CARD_SOJA,
      },
    ],
    produtosGarantia: [
      { id: 'pg-sa-1', tipo: 'AF de Estoque', valor: 9_000_000, pctUsado: 73, ativo: 'Pluma de algodão — usina Juazeiro/BA' },
      { id: 'pg-sa-2', tipo: 'AF de Imóvel', valor: 6_500_000, pctUsado: 33, ativo: 'Unidade industrial — matrícula 2201' },
    ],
  },
  {
    id: 'ped-coop-sul',
    cliente: 'COOPERATIVA RURAL DO SUL LTDA',
    documento: '88.554.332/0001-49',
    tipoCliente: 'Terceiro',
    risco: 1_120_000,
    limite: 3_000_000,
    prazo: isoOffset(0),
    gerente: 'Ana Beatriz Souza',
    detalhes: ['Confirmação do cliente'],
    cessoes: [
      {
        id: 'ces-cs-1',
        veiculo: 'AGROVITA',
        nome: 'Agrovita — Cota Cooperativa Sul',
        data: isoOffset(-8),
        valor: 980_000,
        taxa: 17.0,
        numeroOperacao: 'OP-AGV-2026-0710',
        url: 'https://example.com/cessao/OP-AGV-2026-0710',
        detalhes: ['Documento avulso em conferência'],
      },
    ],
    produtosGarantia: [
      { id: 'pg-cs-1', tipo: 'AF de Estoque', valor: 1_500_000, pctUsado: 19, ativo: 'Trigo e soja — silos Passo Fundo/RS' },
    ],
  },
  {
    id: 'ped-planalto',
    cliente: 'AGRO INSUMOS PLANALTO LTDA',
    documento: '99.665.443/0001-50',
    tipoCliente: 'special_sit',
    risco: 4_050_000,
    limite: 4_500_000,
    prazo: isoOffset(-1),
    gerente: 'Roberto Lima',
    detalhes: ['Situação especial — revisão imediata', 'Garantia em renovação'],
    cessoes: [
      {
        id: 'ces-ap-1',
        veiculo: 'CRA CERES',
        nome: 'CRA Ceres — Special Sit Planalto',
        data: isoOffset(-70),
        valor: 3_750_000,
        taxa: 19.4,
        numeroOperacao: 'OP-CRA-2025-2210',
        url: 'https://example.com/cessao/OP-CRA-2025-2210',
        detalhes: ['Compliance em diligência', 'Aguardando laudo atualizado'],
        cardsGarantia: [
          {
            id: 'cg-ap-1',
            nome: 'Hipoteca 2º grau — Matrícula 9981',
            url: 'https://example.com/garantia/hipoteca-9981',
            composto: true,
            valor: 6_000_000,
            valorComposicao: 2_400_000,
            status: 'Em Configuração',
          },
        ],
      },
    ],
    produtosGarantia: [
      { id: 'pg-ap-1', tipo: 'AF de Imóvel', valor: 6_000_000, pctUsado: 81, ativo: 'Galpão logístico — Anápolis/GO' },
    ],
  },
  {
    id: 'ped-norte-graos',
    cliente: 'NORTE GRAOS TRADING S/A',
    documento: '22.110.887/0001-63',
    tipoCliente: 'Normal',
    risco: 7_890_000,
    limite: 12_500_000,
    prazo: isoOffset(27),
    gerente: 'Juliana Alves',
    detalhes: ['Monitoramento regular', 'Registro em cartório ok'],
    cessoes: [
      {
        id: 'ces-ng-1',
        veiculo: 'URA AGRO',
        nome: 'URA Agro — Trading Norte Grãos',
        data: isoOffset(-15),
        valor: 5_200_000,
        taxa: 14.0,
        numeroOperacao: 'OP-URA-2026-0612',
        url: 'https://example.com/cessao/OP-URA-2026-0612',
        detalhes: ['Tudo ok'],
        cardsGarantia: CARD_SOJA,
      },
      {
        id: 'ces-ng-2',
        veiculo: 'CRA CERES',
        nome: 'CRA Ceres — Exportação Q3',
        data: isoOffset(-3),
        valor: 2_050_000,
        taxa: 14.6,
        numeroOperacao: 'OP-CRA-2026-0613',
        url: 'https://example.com/cessao/OP-CRA-2026-0613',
        detalhes: ['CERC vinculado', 'B3 em liquidação'],
      },
    ],
    produtosGarantia: [
      { id: 'pg-ng-1', tipo: 'AF de Estoque', valor: 8_400_000, pctUsado: 51, ativo: 'Soja embarque — porto de Santos' },
      { id: 'pg-ng-2', tipo: 'AF Agrícola', valor: 3_000_000, pctUsado: 12, ativo: 'Contrato de compra futura — 15 mil t' },
    ],
  },
  {
    id: 'ped-cafe-mogiana',
    cliente: 'CAFE MOGIANA EXPORTADORA LTDA',
    documento: '55.332.110/0001-08',
    tipoCliente: 'Especial',
    risco: 3_670_000,
    limite: 6_000_000,
    prazo: isoOffset(9),
    gerente: 'Fernanda Rocha',
    detalhes: [
      'Laudo de qualidade do lote',
      'Escrituração da garantia',
      'Confirmação do cliente no packing list',
      'Aguardando compliance CERC',
    ],
    cessoes: [
      {
        id: 'ces-cm-1',
        veiculo: 'AGROVITA',
        nome: 'Agrovita — Café Arábica Mogiana',
        data: isoOffset(-25),
        valor: 2_880_000,
        taxa: 13.5,
        numeroOperacao: 'OP-AGV-2026-0330',
        url: 'https://example.com/cessao/OP-AGV-2026-0330',
        detalhes: ['Renovação de warrant'],
      },
    ],
    produtosGarantia: [
      { id: 'pg-cm-1', tipo: 'AF de Estoque', valor: 4_100_000, pctUsado: 66, ativo: 'Café arábica NY#2 — armazéns Guaxupé/MG' },
    ],
  },
  {
    id: 'ped-pantanal',
    cliente: 'PANTANAL PROTEINA S/A',
    documento: '64.221.009/0001-44',
    tipoCliente: 'Recovery',
    risco: 8_330_000,
    limite: 9_000_000,
    prazo: isoOffset(-15),
    gerente: 'Carlos Mendes',
    detalhes: ['Urgente — laudo vencido', 'Imediata regularização de matrícula'],
    cessoes: [
      {
        id: 'ces-pp-1',
        veiculo: 'CRA CERES',
        nome: 'CRA Ceres — Reestruturação Pantanal',
        data: isoOffset(-110),
        valor: 6_400_000,
        taxa: 20.1,
        numeroOperacao: 'OP-CRA-2025-1744',
        url: 'https://example.com/cessao/OP-CRA-2025-1744',
        detalhes: ['Garantia em execução', 'Aguardando registro'],
        cardsGarantia: CARD_BOI,
      },
    ],
    produtosGarantia: [
      { id: 'pg-pp-1', tipo: 'AF Agrícola', valor: 5_800_000, pctUsado: 96, ativo: 'Frigorífico e curral — Corumbá/MS' },
      { id: 'pg-pp-2', tipo: 'AF de Imóvel', valor: 4_200_000, pctUsado: 44, ativo: 'Área de pastagem — 3.100 ha' },
    ],
  },
  {
    id: 'ped-hortifruti',
    cliente: 'HORTO VALE DISTRIBUICAO LTDA',
    documento: '17.880.554/0001-19',
    tipoCliente: 'Terceiro',
    risco: 640_000,
    limite: 1_200_000,
    prazo: isoOffset(60),
    gerente: 'Ana Beatriz Souza',
    detalhes: ['Monitoramento regular'],
    cessoes: [
      {
        id: 'ces-hv-1',
        veiculo: 'URA AGRO',
        nome: 'URA Agro — Distribuição Hortifruti',
        data: isoOffset(-6),
        valor: 420_000,
        taxa: 16.8,
        numeroOperacao: 'OP-URA-2026-0902',
        url: 'https://example.com/cessao/OP-URA-2026-0902',
        detalhes: [],
      },
    ],
    produtosGarantia: [
      { id: 'pg-hv-1', tipo: 'AF de Estoque', valor: 900_000, pctUsado: 8, ativo: 'Câmara fria — CEASA Campinas/SP' },
    ],
  },
];

export const GERENTES_OPTS = [...new Set(PEDIDOS_SEED.map((p) => p.gerente))].sort();
