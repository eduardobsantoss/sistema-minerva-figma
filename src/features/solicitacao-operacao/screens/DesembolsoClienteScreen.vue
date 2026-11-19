<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, Layers, Wallet, Banknote } from 'lucide-vue-next';
import type { Component } from 'vue';
import { useToast } from '@/composables/useToast';
import { brl, slaRatio, solicitacoes } from '../data/operacaoData';
import {
  aprovacoesPendentes,
  atividadeCobranca,
  atividadeEmail,
  atividadeReiniciada,
  cardsIniciais,
  DESTINATARIOS_ETAPA,
  ehConcluido,
  etapasDe,
  etapasLiberadas,
  etiquetaEtapa,
  formatDataBr,
  novoComentario,
  possuiEtapaBmp,
  valoresDe,
  type CardDesembolso,
  type EncarteirarPayload,
  type EtapaDesembolsoKey,
} from '../data/desembolsoClienteData';
import DesembolsoClienteCard from '../components/desembolso-cliente/DesembolsoClienteCard.vue';
import EncarteirarModal from '../components/desembolso-cliente/EncarteirarModal.vue';
import CobrancaModal from '../components/desembolso-cliente/CobrancaModal.vue';
import VoltarEtapaModal from '../components/desembolso-cliente/VoltarEtapaModal.vue';
import ComentariosModal from '../components/desembolso-cliente/ComentariosModal.vue';

const toast = useToast();
const cards = reactive<CardDesembolso[]>(cardsIniciais(solicitacoes));
const buscaId = ref('');
const buscaCedente = ref('');
const buscaVeiculo = ref('');
const encarteirando = ref<CardDesembolso | null>(null);
const cobrando = ref<CardDesembolso | null>(null);
const voltando = ref<CardDesembolso | null>(null);
const comentandoId = ref<string | null>(null);
const cardComentarios = computed(() => cards.find((c) => c.solicitacao.id === comentandoId.value) ?? null);

type Filtro = 'TODOS' | 'COM_BMP' | 'SEM_BMP' | 'NAO_APROVADOS' | 'ATRASADOS';

const filtro = ref<Filtro>('TODOS');

const emAberto = computed(() => cards.filter((card) => card.solicitacao.etapa === 'DESEMBOLSO_CLIENTE'));

function passaFiltro(card: CardDesembolso, key: Filtro): boolean {
  if (key === 'COM_BMP') return possuiEtapaBmp(card.solicitacao);
  if (key === 'SEM_BMP') return !possuiEtapaBmp(card.solicitacao);
  if (key === 'NAO_APROVADOS') {
    return card.solicitacao.validacao === 'INVALIDO' || aprovacoesPendentes(card.solicitacao, card.concluidas);
  }
  if (key === 'ATRASADOS') return slaRatio(card.solicitacao) > 1;
  return true;
}

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'COM_BMP', label: 'Com BMP' },
  { key: 'SEM_BMP', label: 'Sem BMP' },
  { key: 'NAO_APROVADOS', label: 'Não aprovados' },
  { key: 'ATRASADOS', label: 'SLA estourado' },
];

const contagens = computed(() =>
  Object.fromEntries(
    FILTROS.map((f) => [f.key, emAberto.value.filter((card) => passaFiltro(card, f.key)).length]),
  ) as Record<Filtro, number>,
);

/** Cards abertos por ID. Por padrão todos entram recolhidos. */
const expandidos = ref<Set<string>>(new Set());

function setExpandido(id: string, value: boolean) {
  const next = new Set(expandidos.value);
  if (value) next.add(id);
  else next.delete(id);
  expandidos.value = next;
}

const filtrados = computed(() => {
  const id = buscaId.value.trim().toLowerCase().replace(/^#/, '');
  const cedente = buscaCedente.value.trim().toLowerCase();
  const veiculo = buscaVeiculo.value.trim().toLowerCase();
  return emAberto.value.filter((card) => {
    if (!passaFiltro(card, filtro.value)) return false;
    const s = card.solicitacao;
    if (id && !s.id.toLowerCase().replace('#', '').includes(id)) return false;
    if (cedente && !s.cedente.toLowerCase().includes(cedente)) return false;
    if (veiculo && !s.veiculo.toLowerCase().includes(veiculo)) return false;
    return true;
  });
});

const todosExpandidos = computed(
  () => filtrados.value.length > 0 && filtrados.value.every((card) => expandidos.value.has(card.solicitacao.id)),
);

function alternarTodos() {
  const next = new Set(expandidos.value);
  for (const card of filtrados.value) {
    if (todosExpandidos.value) next.delete(card.solicitacao.id);
    else next.add(card.solicitacao.id);
  }
  expandidos.value = next;
}

// ── KPIs (acompanham filtros e buscas) ──
const kpiVeiculosAberto = ref(false);

const totais = computed(() => {
  let aquisicao = 0;
  let aDesembolsar = 0;
  for (const card of filtrados.value) {
    const v = valoresDe(card.solicitacao, card.cobranca);
    aquisicao += v.aquisicao;
    aDesembolsar += v.aDesembolsar;
  }
  return { pedidos: filtrados.value.length, aquisicao, aDesembolsar };
});

const porVeiculo = computed(() => {
  const mapa = new Map<string, { veiculo: string; pedidos: number; aquisicao: number; aDesembolsar: number }>();
  for (const card of filtrados.value) {
    const v = valoresDe(card.solicitacao, card.cobranca);
    const nome = card.solicitacao.veiculo || 'Sem veículo';
    const atual = mapa.get(nome) ?? { veiculo: nome, pedidos: 0, aquisicao: 0, aDesembolsar: 0 };
    atual.pedidos += 1;
    atual.aquisicao += v.aquisicao;
    atual.aDesembolsar += v.aDesembolsar;
    mapa.set(nome, atual);
  }
  return [...mapa.values()].sort((a, b) => b.aquisicao - a.aquisicao);
});

function participacao(valor: number): string {
  if (totais.value.aquisicao <= 0) return '0%';
  return `${Math.round((valor / totais.value.aquisicao) * 100)}%`;
}

interface Kpi {
  key: string;
  label: string;
  valor: string;
  detalhe: string;
  icon: Component;
  tone: { bg: string; fg: string };
  expansivel?: boolean;
}

const kpis = computed<Kpi[]>(() => [
  {
    key: 'pedidos',
    label: 'Pedidos em aberto',
    valor: String(totais.value.pedidos),
    detalhe: totais.value.pedidos === 1 ? 'pedido na esteira' : 'pedidos na esteira',
    icon: Layers,
    tone: { bg: 'var(--status-active-bg)', fg: 'var(--status-active-text)' },
  },
  {
    key: 'aquisicao',
    label: 'Valor de aquisição',
    valor: brl(totais.value.aquisicao),
    detalhe: `${porVeiculo.value.length} ${porVeiculo.value.length === 1 ? 'veículo' : 'veículos'}`,
    icon: Wallet,
    tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    expansivel: true,
  },
  {
    key: 'desembolsar',
    label: 'Valor a desembolsar',
    valor: brl(totais.value.aDesembolsar),
    detalhe: 'aquisição menos vencidos',
    icon: Banknote,
    tone: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)' },
  },
]);

// ── Fluxo das etapas ──

/** Encerra o desembolso quando todas as etapas do pedido foram concluídas. */
function encerrarSeConcluido(card: CardDesembolso): boolean {
  if (!ehConcluido(card.solicitacao, card.concluidas)) return false;
  card.solicitacao.etapa = 'SOLUCIONADA';
  return true;
}

function liberada(card: CardDesembolso, key: EtapaDesembolsoKey): boolean {
  return etapasLiberadas(etapasDe(card.solicitacao), card.concluidas).some((e) => e.key === key);
}

function onConcluir(card: CardDesembolso, key: EtapaDesembolsoKey) {
  if (!liberada(card, key)) return;
  if (key === 'ENCARTEIRAR') {
    encarteirando.value = card;
    return;
  }
  if (key === 'COBRANCA') {
    cobrando.value = card;
    return;
  }
  card.concluidas.push(key);
  card.atividade.unshift(atividadeEmail(key));
  const destinatarios = DESTINATARIOS_ETAPA[key].join(', ');
  if (encerrarSeConcluido(card)) {
    toast.success(`${card.solicitacao.id} concluída. E-mail enviado · ${etiquetaEtapa(key)} para ${destinatarios}.`);
    return;
  }
  toast.info(`E-mail enviado · ${etiquetaEtapa(key)} para ${destinatarios}.`);
}

function onVoltar(card: CardDesembolso) {
  if (card.concluidas.length === 0) return;
  voltando.value = card;
}

function confirmarVoltar(motivo: string) {
  const card = voltando.value;
  if (!card) return;
  const ordem = card.concluidas.length;
  const ultima = card.concluidas[ordem - 1];
  if (!ultima) {
    voltando.value = null;
    return;
  }
  card.concluidas.splice(0, card.concluidas.length);
  card.desembolso = null;
  card.cobranca = null;
  card.atividade.unshift(atividadeReiniciada(ultima, ordem, motivo));
  if (motivo) card.comentarios.unshift(novoComentario(ultima, ordem, motivo));
  voltando.value = null;
  toast.info(`${card.solicitacao.id} voltou para a 1ª etapa.${motivo ? ' Comentário registrado.' : ''}`);
}

function onBaixar(arquivo: string) {
  toast.info(`Download iniciado: ${arquivo}`);
}

function onEncarteirar(payload: EncarteirarPayload) {
  const card = encarteirando.value;
  if (!card) return;
  const id = card.solicitacao.id;
  card.concluidas.push('ENCARTEIRAR');
  card.desembolso = payload;
  card.atividade.unshift(atividadeEmail('ENCARTEIRAR'));
  encarteirando.value = null;
  const resumo = `${id} encarteirada em ${formatDataBr(payload.dataDesembolso)} (${brl(payload.valorDesembolsado)}). E-mail enviado para ${DESTINATARIOS_ETAPA.ENCARTEIRAR.join(', ')}.`;
  if (encerrarSeConcluido(card)) toast.success(resumo);
  else toast.info(`${resumo} Faltam Financeiro e Cobrança.`);
}

function onCobranca(valor: number) {
  const card = cobrando.value;
  if (!card) return;
  card.concluidas.push('COBRANCA');
  card.cobranca = { valor };
  card.atividade.unshift(atividadeCobranca(valor));
  cobrando.value = null;
  const resumo = `Vencidos de ${brl(valor)} enviados para abater em ${card.solicitacao.id}. E-mail enviado para ${DESTINATARIOS_ETAPA.COBRANCA.join(', ')}.`;
  if (encerrarSeConcluido(card)) toast.success(`${card.solicitacao.id} concluída. ${resumo}`);
  else toast.info(resumo);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Camada 1: Identificação -->
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
        Workflow Operacional
      </div>
      <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15; margin: 0">
        Desembolso do Cliente
      </h1>
    </div>

    <!-- KPIs (acompanham filtros e buscas) -->
    <div class="flex flex-col" style="gap: 12px">
      <div class="grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
        <div
          v-for="k in kpis"
          :key="k.key"
          class="flex items-center"
          :data-testid="`kpi-${k.key}`"
          style="position: relative; gap: 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 16px"
        >
          <div
            class="flex items-center justify-center"
            :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
          >
            <component :is="k.icon" :size="18" :stroke-width="1.75" />
          </div>
          <div :style="{ minWidth: 0, flex: 1, paddingRight: k.expansivel ? '28px' : '0' }">
            <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
              {{ k.label }}
            </div>
            <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; line-height: 1.2">
              {{ k.valor }}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ k.detalhe }}</div>
          </div>
          <button
            v-if="k.expansivel"
            type="button"
            class="kpi-toggle"
            :aria-expanded="kpiVeiculosAberto"
            :aria-label="kpiVeiculosAberto ? 'Ocultar valor por veículo' : 'Ver valor por veículo'"
            :title="kpiVeiculosAberto ? 'Ocultar por veículo' : 'Ver por veículo'"
            @click="kpiVeiculosAberto = !kpiVeiculosAberto"
          >
            <ChevronDown
              :size="14"
              :style="{ transform: kpiVeiculosAberto ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }"
            />
          </button>
        </div>
      </div>

      <div v-if="kpiVeiculosAberto" class="veiculos" data-testid="kpi-por-veiculo">
        <div class="veiculos-head">
          <span>Veículo</span>
          <span class="num">Pedidos</span>
          <span class="num">Aquisição</span>
          <span class="num">A desembolsar</span>
          <span class="num">Participação</span>
        </div>
        <div v-if="porVeiculo.length === 0" class="veiculos-vazio">Nenhum pedido para somar.</div>
        <div v-for="v in porVeiculo" :key="v.veiculo" class="veiculos-row">
          <span class="veiculo-nome">{{ v.veiculo }}</span>
          <span class="num">{{ v.pedidos }}</span>
          <span class="num">{{ brl(v.aquisicao) }}</span>
          <span class="num">{{ brl(v.aDesembolsar) }}</span>
          <span class="num">{{ participacao(v.aquisicao) }}</span>
        </div>
      </div>
    </div>

    <!-- Pills de filtro (mesmo estilo das esteiras) -->
    <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
      <button
        v-for="f in FILTROS"
        :key="f.key"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.04em',
          border: '1px solid',
          borderColor: filtro === f.key ? 'var(--gci-base)' : 'var(--border-default)',
          background: filtro === f.key ? 'var(--gci-base)' : 'var(--surface-card)',
          color: filtro === f.key ? 'var(--text-on-brand)' : 'var(--text-muted)',
          transition: 'all var(--duration-fast)',
        }"
        @click="filtro = f.key"
      >
        {{ f.label }}
        <span
          :style="{
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            borderRadius: '9999px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: filtro === f.key ? 'var(--surface-card)' : 'var(--surface-sunken)',
            color: filtro === f.key ? 'var(--gci-base)' : 'var(--text-muted)',
          }"
        >
          {{ contagens[f.key] }}
        </span>
      </button>
    </div>

    <!-- Buscas separadas (mesmo padrão de Ativos) + expandir/recolher todos -->
    <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
      <label class="search-field">
        <span>ID</span>
        <input v-model="buscaId" placeholder="Ex: 1400" />
      </label>
      <label class="search-field">
        <span>Cedente</span>
        <input v-model="buscaCedente" placeholder="Nome do cedente" />
      </label>
      <label class="search-field">
        <span>Veículo</span>
        <input v-model="buscaVeiculo" placeholder="Nome do veículo" />
      </label>
      <button
        type="button"
        class="flex items-center"
        :disabled="filtrados.length === 0"
        :style="{
          gap: '8px',
          height: '40px',
          padding: '0 16px',
          cursor: filtrados.length === 0 ? 'not-allowed' : 'pointer',
          opacity: filtrados.length === 0 ? 0.5 : 1,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.04em',
          color: 'var(--text-muted)',
        }"
        @click="alternarTodos"
      >
        <component :is="todosExpandidos ? ChevronsDownUp : ChevronsUpDown" :size="15" :stroke-width="2" />
        {{ todosExpandidos ? 'Recolher todos' : 'Expandir todos' }}
      </button>
    </div>

    <div
      v-if="filtrados.length === 0"
      style="padding: 60px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl)"
    >
      {{ emAberto.length === 0 ? 'Nenhum pedido em Desembolso do Cliente.' : 'Nenhum pedido encontrado para a busca.' }}
    </div>

    <div v-else class="flex flex-col" style="gap: 16px">
      <DesembolsoClienteCard
        v-for="card in filtrados"
        :key="card.solicitacao.id"
        :solicitacao="card.solicitacao"
        :concluidas="card.concluidas"
        :atividade="card.atividade"
        :comentarios="card.comentarios"
        :desembolso="card.desembolso"
        :cobranca="card.cobranca"
        :expandido="expandidos.has(card.solicitacao.id)"
        @update:expandido="setExpandido(card.solicitacao.id, $event)"
        @concluir="onConcluir(card, $event)"
        @voltar="onVoltar(card)"
        @baixar="onBaixar"
        @comentarios="comentandoId = card.solicitacao.id"
      />
    </div>

    <EncarteirarModal
      v-if="encarteirando"
      :solicitacao-id="encarteirando.solicitacao.id"
      :cedente="encarteirando.solicitacao.cedente"
      :valor-operacao="encarteirando.solicitacao.valor"
      @close="encarteirando = null"
      @confirm="onEncarteirar"
    />

    <CobrancaModal
      v-if="cobrando"
      :solicitacao-id="cobrando.solicitacao.id"
      :cedente="cobrando.solicitacao.cedente"
      :valor-aquisicao="valoresDe(cobrando.solicitacao, null).aquisicao"
      :valor-vencido="cobrando.solicitacao.valorVencido ?? 0"
      @close="cobrando = null"
      @confirm="onCobranca"
    />

    <VoltarEtapaModal
      v-if="voltando"
      :solicitacao-id="voltando.solicitacao.id"
      :cedente="voltando.solicitacao.cedente"
      :ultima="voltando.concluidas[voltando.concluidas.length - 1]"
      :ordem="voltando.concluidas.length"
      @close="voltando = null"
      @confirm="confirmarVoltar"
    />

    <ComentariosModal
      v-if="cardComentarios"
      :solicitacao-id="cardComentarios.solicitacao.id"
      :cedente="cardComentarios.solicitacao.cedente"
      :comentarios="cardComentarios.comentarios"
      @close="comentandoId = null"
    />
  </div>
</template>

<style scoped>
.kpi-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
  outline: none;
  transition: background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard);
}
.kpi-toggle:hover {
  background: var(--action-secondary-bg-hover);
  color: var(--text-strong);
}
.kpi-toggle:focus-visible {
  box-shadow: var(--focus-ring);
}
.veiculos {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.veiculos-head,
.veiculos-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: center;
  padding: 12px 20px;
  font-size: var(--text-sm);
}
.veiculos-head {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--surface-sunken);
}
.veiculos-row {
  border-top: 1px solid var(--border-default);
  color: var(--text-strong);
}
.veiculos-row .veiculo-nome {
  font-weight: var(--weight-semibold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.veiculos .num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.veiculos-vazio {
  padding: 16px 20px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.search-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 160px;
}
.search-field span {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.search-field input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.search-field input:focus {
  box-shadow: var(--focus-ring);
}
</style>
