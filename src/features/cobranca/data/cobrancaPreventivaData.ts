export type StatusPreventivo =
  | 'PENDENTE'
  | 'NAO_CONFIRMADO'
  | 'TENTATIVA_SEM_SUCESSO'
  | 'AGUARDANDO_RETORNO'
  | 'AGUARDANDO_RETORNO_SACADO'
  | 'ISENTO_AGROBANK'
  | 'AGUARDANDO_RETORNO_COMERCIAL'
  | 'CONFIRMADO'
  | 'PRORROGADO'
  | 'PAGO_A_CEDENTE'
  | 'AGUARDANDO_RETORNO_CEDENTE'
  | 'NAO_PRIORITARIO'
  | 'ISENTO_TRADING'
  | 'AGUARDANDO_RETORNO_TELEGRAMA';

export type SituacaoCarteira = 'Especial' | 'Normal' | 'Recovery' | 'Pre-recovery';
export type CanalContato = 'Email' | 'Telefone' | 'SMS' | 'WhatsApp';
export type AgrupamentoContato = 'dia' | 'semana' | 'mes' | 'ano';

export interface SacadoPreventivo {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  situacao: SituacaoCarteira;
}

export interface TituloPreventivo {
  id: string;
  sacadoId: string;
  lastro: string;
  numero: string;
  cedente: string;
  tipoTitulo: string;
  situacaoCedente: SituacaoCarteira;
  veiculo: string;
  cessao: string;
  valor: number;
  status: StatusPreventivo;
}

export interface ContatoOperador {
  id: string;
  operadorId: string;
  operador: string;
  sacado: string;
  documento: string;
  titulos: number;
  valorAPagar: number;
  valorConfirmado: number;
  ultimoContato: string;
  tentativas: number;
  confirmado: boolean;
}

export interface EvolucaoEvento {
  data: string;
  canal: CanalContato;
  quantidade: number;
}

export interface TentativaRegistro {
  status: StatusPreventivo;
  dataContato: string;
  canal: CanalContato;
  quantidade: number;
  anexoNome: string;
}

export const CANAL_CONTATO_OPTS: CanalContato[] = ['Email', 'Telefone', 'SMS', 'WhatsApp'];

export const STATUS_PREVENTIVO: { key: StatusPreventivo; label: string; color: string }[] = [
  { key: 'PENDENTE', label: 'Pendente', color: '#F27D26' },
  { key: 'NAO_CONFIRMADO', label: 'Não confirmado', color: '#DC2626' },
  { key: 'TENTATIVA_SEM_SUCESSO', label: 'Tentativa sem sucesso', color: '#BE185D' },
  { key: 'AGUARDANDO_RETORNO', label: 'Aguardando retorno', color: '#D97706' },
  { key: 'AGUARDANDO_RETORNO_SACADO', label: 'Aguardando retorno do sacado', color: '#B45309' },
  { key: 'ISENTO_AGROBANK', label: 'Isento Agrobank', color: '#059669' },
  { key: 'AGUARDANDO_RETORNO_COMERCIAL', label: 'Aguardando retorno do comercial', color: '#0E7490' },
  { key: 'CONFIRMADO', label: 'Confirmado', color: '#059669' },
  { key: 'PRORROGADO', label: 'Prorrogado', color: '#7C3AED' },
  { key: 'PAGO_A_CEDENTE', label: 'Pago a cedente', color: '#083C4A' },
  { key: 'AGUARDANDO_RETORNO_CEDENTE', label: 'Aguardando retorno da cedente', color: '#0891B2' },
  { key: 'NAO_PRIORITARIO', label: 'Não prioritário', color: '#64748B' },
  { key: 'ISENTO_TRADING', label: 'Isento trading', color: '#65A30D' },
  { key: 'AGUARDANDO_RETORNO_TELEGRAMA', label: 'Aguardando retorno telegrama', color: '#4F46E5' },
];

const STATUS_MAP = Object.fromEntries(STATUS_PREVENTIVO.map((s) => [s.key, s])) as Record<
  StatusPreventivo,
  { key: StatusPreventivo; label: string; color: string }
>;

export function statusPreventivoLabel(s: StatusPreventivo): string {
  return STATUS_MAP[s].label;
}

export function statusPreventivoColor(s: StatusPreventivo): string {
  return STATUS_MAP[s].color;
}

export function situacaoColor(s: SituacaoCarteira): string {
  return {
    Especial: 'var(--warning-base)',
    Normal: 'var(--gci-base)',
    Recovery: 'var(--danger-base)',
    'Pre-recovery': 'var(--agro-base)',
  }[s];
}

export function brl(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
    if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

export function canalLabel(c: CanalContato): string {
  return { Email: 'E-mail', Telefone: 'Telefone', SMS: 'SMS', WhatsApp: 'WhatsApp' }[c];
}

export function inPeriodo(iso: string, inicio: string, fim: string): boolean {
  if (inicio && iso < inicio) return false;
  if (fim && iso > fim) return false;
  return true;
}

export function chaveAgrupamento(iso: string, agrupamento: AgrupamentoContato): string {
  if (agrupamento === 'ano') return iso.slice(0, 4);
  if (agrupamento === 'mes') return iso.slice(0, 7);
  if (agrupamento === 'dia') return iso;
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function labelAgrupamento(key: string, agrupamento: AgrupamentoContato): string {
  if (agrupamento === 'ano') return key;
  if (agrupamento === 'mes') {
    const [y, m] = key.split('-');
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${meses[Number(m) - 1]}/${y}`;
  }
  const [, m, d] = key.split('-');
  return `${d}/${m}`;
}

export const SACADOS_PREVENTIVA_SEED: SacadoPreventivo[] = [
  {
    id: 'sac-pedro',
    nome: 'Pedro Ribeiro Merola',
    documento: '012.018.186-05',
    telefone: '+55 11 98821 4400',
    situacao: 'Especial',
  },
  {
    id: 'sac-herdade',
    nome: 'Herdade Empreendimentos Imobiliarios SPE',
    documento: '18.621.277/0001-05',
    telefone: '+55 11 4002 8922',
    situacao: 'Especial',
  },
  {
    id: 'sac-ceres',
    nome: 'Ceres Trading S.A.',
    documento: '30.140.250/0001-61',
    telefone: '+55 11 3040 2200',
    situacao: 'Normal',
  },
  {
    id: 'sac-green',
    nome: 'Green Farming',
    documento: '31.509.494/0001-88',
    telefone: '+55 62 3333 1010',
    situacao: 'Recovery',
  },
  {
    id: 'sac-allas',
    nome: 'Allas Solucoes Logisticas LTDA',
    documento: '08.345.221/0001-09',
    telefone: '+55 11 2222 9090',
    situacao: 'Especial',
  },
  {
    id: 'sac-claudio',
    nome: 'Claudio Nasser de Carvalho',
    documento: '43.053.220/0001-72',
    telefone: '+55 11 97700 1188',
    situacao: 'Pre-recovery',
  },
];

export const TITULOS_PREVENTIVA_SEED: TituloPreventivo[] = [
  { id: 'tp-1', sacadoId: 'sac-pedro', lastro: '465942', numero: 'PM1392026-1-1', cedente: 'Pedro Ribeiro Merola', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '42ª - CRA Ceres', cessao: 'PEDRO_OP.1398_20052026', valor: 2791.2, status: 'PENDENTE' },
  { id: 'tp-2', sacadoId: 'sac-pedro', lastro: '465928', numero: 'PM1432026-1-1', cedente: 'Pedro Ribeiro Merola', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '42ª - CRA Ceres', cessao: 'PEDRO_OP.1395_20052026', valor: 1981.34, status: 'PENDENTE' },
  { id: 'tp-3', sacadoId: 'sac-pedro', lastro: '465927', numero: 'PM1442026-1-1', cedente: 'Pedro Ribeiro Merola', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '42ª - CRA Ceres', cessao: 'PEDRO_OP.1394_20052026', valor: 1023.8, status: 'PENDENTE' },
  { id: 'tp-4', sacadoId: 'sac-pedro', lastro: '443173', numero: 'PM1222026-1', cedente: 'Pedro Ribeiro Merola', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '47ª CRA Carteira', cessao: 'CESSAO_CONFINA_47', valor: 3035.95, status: 'CONFIRMADO' },
  { id: 'tp-5', sacadoId: 'sac-pedro', lastro: '460797', numero: 'CPR-PEDRO-1', cedente: 'Pedro Ribeiro Merola', tipoTitulo: 'CPR', situacaoCedente: 'Especial', veiculo: '51ª - CRA Carteira', cessao: 'PEDRO_OP.873_13032026', valor: 8121.85, status: 'PENDENTE' },
  { id: 'tp-6', sacadoId: 'sac-herdade', lastro: '510201', numero: 'HE-2201', cedente: 'Herdade SPE', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '34ª CRA Nativa', cessao: 'HERDADE_OP_01', valor: 18400, status: 'PENDENTE' },
  { id: 'tp-7', sacadoId: 'sac-herdade', lastro: '510202', numero: 'HE-2202', cedente: 'Herdade SPE', tipoTitulo: 'NP', situacaoCedente: 'Especial', veiculo: '34ª CRA Nativa', cessao: 'HERDADE_OP_01', valor: 9200, status: 'CONFIRMADO' },
  { id: 'tp-8', sacadoId: 'sac-herdade', lastro: '510203', numero: 'HE-2203', cedente: 'Agro Sandri', tipoTitulo: 'DM', situacaoCedente: 'Normal', veiculo: '42ª - CRA Ceres', cessao: 'HERDADE_OP_02', valor: 6400, status: 'NAO_CONFIRMADO' },
  { id: 'tp-9', sacadoId: 'sac-herdade', lastro: '510204', numero: 'HE-2204', cedente: 'Agro Sandri', tipoTitulo: 'DM', situacaoCedente: 'Normal', veiculo: '42ª - CRA Ceres', cessao: 'HERDADE_OP_02', valor: 4100, status: 'PENDENTE' },
  { id: 'tp-10', sacadoId: 'sac-ceres', lastro: '620011', numero: 'CT-104', cedente: 'Ceres Trading S.A.', tipoTitulo: 'NP', situacaoCedente: 'Normal', veiculo: '57ª - CRA Carteira', cessao: 'Confina 01/04/2026', valor: 45200, status: 'PENDENTE' },
  { id: 'tp-11', sacadoId: 'sac-ceres', lastro: '620012', numero: 'CT-105', cedente: 'Ceres Trading S.A.', tipoTitulo: 'NP', situacaoCedente: 'Normal', veiculo: '57ª - CRA Carteira', cessao: 'Confina 01/04/2026', valor: 12800, status: 'PRORROGADO' },
  { id: 'tp-12', sacadoId: 'sac-ceres', lastro: '620013', numero: 'CT-106', cedente: 'Futura Agro', tipoTitulo: 'CPR', situacaoCedente: 'Especial', veiculo: '2ª CRA Futura Insumos', cessao: 'FUTURA_OP_09', valor: 8600, status: 'PAGO_A_CEDENTE' },
  { id: 'tp-13', sacadoId: 'sac-green', lastro: '730001', numero: 'GF-11', cedente: 'Green Farming', tipoTitulo: 'CPR', situacaoCedente: 'Recovery', veiculo: 'CRA Semeagro IV', cessao: 'GREEN_OP_03', valor: 22100, status: 'TENTATIVA_SEM_SUCESSO' },
  { id: 'tp-14', sacadoId: 'sac-green', lastro: '730002', numero: 'GF-12', cedente: 'Green Farming', tipoTitulo: 'CPR', situacaoCedente: 'Recovery', veiculo: 'CRA Semeagro IV', cessao: 'GREEN_OP_03', valor: 15400, status: 'PENDENTE' },
  { id: 'tp-15', sacadoId: 'sac-allas', lastro: '840010', numero: 'AL-90', cedente: 'Allas Solucoes', tipoTitulo: 'DM', situacaoCedente: 'Especial', veiculo: 'BOASAFRA FIDC', cessao: 'ALLAS_2026_04', valor: 9800, status: 'AGUARDANDO_RETORNO' },
  { id: 'tp-16', sacadoId: 'sac-allas', lastro: '840011', numero: 'AL-91', cedente: 'Allas Solucoes', tipoTitulo: 'DM', situacaoCedente: 'Especial', veiculo: 'BOASAFRA FIDC', cessao: 'ALLAS_2026_04', valor: 5400, status: 'PENDENTE' },
  { id: 'tp-17', sacadoId: 'sac-allas', lastro: '840012', numero: 'AL-92', cedente: 'Tech Rural BR', tipoTitulo: 'NP', situacaoCedente: 'Normal', veiculo: 'Valoriza FIDC', cessao: 'ALLAS_2026_05', valor: 3100, status: 'CONFIRMADO' },
  { id: 'tp-18', sacadoId: 'sac-claudio', lastro: '910001', numero: 'CN-01', cedente: 'Claudio Nasser', tipoTitulo: 'NP', situacaoCedente: 'Pre-recovery', veiculo: '48ª - CRA Carteira', cessao: 'NASSER_OP_12', valor: 7600, status: 'PENDENTE' },
  { id: 'tp-19', sacadoId: 'sac-claudio', lastro: '910002', numero: 'CN-02', cedente: 'Claudio Nasser', tipoTitulo: 'NP', situacaoCedente: 'Pre-recovery', veiculo: '48ª - CRA Carteira', cessao: 'NASSER_OP_12', valor: 2400, status: 'AGUARDANDO_RETORNO_SACADO' },
];

export const CONTATOS_OPERADOR_SEED: ContatoOperador[] = [
  { id: 'co-1', operadorId: 'op-marcos', operador: 'Marcos Damasceno', sacado: 'Glaucia Nasser de Carvalho', documento: '522.980.006-20', titulos: 1, valorAPagar: 21052.33, valorConfirmado: 21052.33, ultimoContato: '2026-10-06', tentativas: 1, confirmado: true },
  { id: 'co-2', operadorId: 'op-marcos', operador: 'Marcos Damasceno', sacado: 'Herdade Empreendimentos Imobiliarios SPE', documento: '18.621.277/0001-05', titulos: 1, valorAPagar: 130.156, valorConfirmado: 130.156, ultimoContato: '2026-10-06', tentativas: 1, confirmado: true },
  { id: 'co-3', operadorId: 'op-joao', operador: 'João Beneli', sacado: 'Pedro Ribeiro Merola', documento: '012.018.186-05', titulos: 12, valorAPagar: 18220.25, valorConfirmado: 6400, ultimoContato: '2026-10-04', tentativas: 18, confirmado: true },
  { id: 'co-4', operadorId: 'op-joao', operador: 'João Beneli', sacado: 'Pimenta Verde Alimentos LTDA', documento: '22.333.444/0001-55', titulos: 4, valorAPagar: 9800, valorConfirmado: 0, ultimoContato: '2026-09-28', tentativas: 6, confirmado: false },
  { id: 'co-5', operadorId: 'op-joao', operador: 'João Beneli', sacado: 'Materiais para Construcao Construmais LTDA', documento: '66.777.888/0001-11', titulos: 3, valorAPagar: 13200, valorConfirmado: 8598.71, ultimoContato: '2026-10-02', tentativas: 9, confirmado: true },
  { id: 'co-6', operadorId: 'op-gabriel', operador: 'Gabriel Ribeiro', sacado: 'Ceres Trading S.A.', documento: '30.140.250/0001-61', titulos: 6, valorAPagar: 66600, valorConfirmado: 12800, ultimoContato: '2026-10-01', tentativas: 11, confirmado: true },
  { id: 'co-7', operadorId: 'op-gabriel', operador: 'Gabriel Ribeiro', sacado: 'Thiago Brocco', documento: '11.222.333/0001-44', titulos: 2, valorAPagar: 5704, valorConfirmado: 0, ultimoContato: '2026-09-22', tentativas: 4, confirmado: false },
  { id: 'co-8', operadorId: 'op-silvio', operador: 'Silvio Sousa', sacado: 'Green Farming', documento: '31.509.494/0001-88', titulos: 5, valorAPagar: 37500, valorConfirmado: 9000, ultimoContato: '2026-09-30', tentativas: 14, confirmado: true },
  { id: 'co-9', operadorId: 'op-silvio', operador: 'Silvio Sousa', sacado: 'Joao Buiar Sobrinho', documento: '98.765.432/0001-10', titulos: 2, valorAPagar: 9520, valorConfirmado: 9520, ultimoContato: '2026-09-18', tentativas: 3, confirmado: true },
  { id: 'co-10', operadorId: 'op-luiza', operador: 'Luiza Costa', sacado: 'Allas Solucoes Logisticas LTDA', documento: '08.345.221/0001-09', titulos: 3, valorAPagar: 18300, valorConfirmado: 3100, ultimoContato: '2026-10-05', tentativas: 7, confirmado: true },
  { id: 'co-11', operadorId: 'op-luiza', operador: 'Luiza Costa', sacado: 'Rede Agro Markets', documento: '22.333.444/0001-55', titulos: 2, valorAPagar: 6400, valorConfirmado: 0, ultimoContato: '2026-09-15', tentativas: 2, confirmado: false },
  { id: 'co-12', operadorId: 'op-mariana', operador: 'Mariana Costa', sacado: 'Claudio Nasser de Carvalho', documento: '43.053.220/0001-72', titulos: 2, valorAPagar: 10000, valorConfirmado: 0, ultimoContato: '2026-10-07', tentativas: 5, confirmado: false },
];

function buildEvolucao(): EvolucaoEvento[] {
  const eventos: EvolucaoEvento[] = [];
  const canais = CANAL_CONTATO_OPTS;
  for (let day = 1; day <= 30; day += 1) {
    const iso = `2026-09-${String(day).padStart(2, '0')}`;
    canais.forEach((canal, index) => {
      eventos.push({ data: iso, canal, quantidade: ((day + index * 3) % 12) + 2 });
    });
  }
  for (let day = 1; day <= 8; day += 1) {
    const iso = `2026-10-${String(day).padStart(2, '0')}`;
    canais.forEach((canal, index) => {
      eventos.push({ data: iso, canal, quantidade: ((day + index) % 8) + 1 });
    });
  }
  return eventos;
}

export const EVOLUCAO_SEED: EvolucaoEvento[] = buildEvolucao();
