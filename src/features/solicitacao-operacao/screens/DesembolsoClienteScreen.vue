<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { brl, slaRatio, solicitacoes } from '../data/operacaoData';
import {
  atividadeDesfeita,
  atividadeEmail,
  cardsIniciais,
  DESTINATARIOS_ETAPA,
  ehUltimaEtapa,
  etiquetaEtapa,
  formatDataBr,
  novoComentario,
  possuiEtapaBmp,
  proximaEtapa,
  type CardDesembolso,
  type EncarteirarPayload,
  type EtapaDesembolsoKey,
} from '../data/desembolsoClienteData';
import DesembolsoClienteCard from '../components/desembolso-cliente/DesembolsoClienteCard.vue';
import EncarteirarModal from '../components/desembolso-cliente/EncarteirarModal.vue';
import VoltarEtapaModal from '../components/desembolso-cliente/VoltarEtapaModal.vue';
import ComentariosModal from '../components/desembolso-cliente/ComentariosModal.vue';

const toast = useToast();
const cards = reactive<CardDesembolso[]>(cardsIniciais(solicitacoes));
const buscaId = ref('');
const buscaCedente = ref('');
const buscaVeiculo = ref('');
const encarteirando = ref<CardDesembolso | null>(null);
const voltando = ref<{ card: CardDesembolso; key: EtapaDesembolsoKey } | null>(null);
const comentandoId = ref<string | null>(null);
const cardComentarios = computed(() => cards.find((c) => c.solicitacao.id === comentandoId.value) ?? null);

type Filtro = 'TODOS' | 'COM_BMP' | 'SEM_BMP' | 'ATRASADOS';

const filtro = ref<Filtro>('TODOS');

const emAberto = computed(() => cards.filter((card) => card.solicitacao.etapa === 'DESEMBOLSO_CLIENTE'));

function passaFiltro(card: CardDesembolso, key: Filtro): boolean {
  if (key === 'COM_BMP') return possuiEtapaBmp(card.solicitacao);
  if (key === 'SEM_BMP') return !possuiEtapaBmp(card.solicitacao);
  if (key === 'ATRASADOS') return slaRatio(card.solicitacao) > 1;
  return true;
}

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'COM_BMP', label: 'Com BMP' },
  { key: 'SEM_BMP', label: 'Sem BMP' },
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

/** A última etapa da esteira do pedido encerra o desembolso: o card sai da lista. */
function encerrarSeUltima(card: CardDesembolso, key: EtapaDesembolsoKey): boolean {
  if (!ehUltimaEtapa(card, key)) return false;
  card.solicitacao.etapa = 'SOLUCIONADA';
  return true;
}

function onConcluir(card: CardDesembolso, key: EtapaDesembolsoKey) {
  const proxima = proximaEtapa(card);
  if (!proxima || proxima.key !== key) return;
  if (key === 'ENCARTEIRAR') {
    encarteirando.value = card;
    return;
  }
  card.concluidas.push(key);
  card.atividade.unshift(atividadeEmail(key));
  const destinatarios = DESTINATARIOS_ETAPA[key].join(', ');
  if (encerrarSeUltima(card, key)) {
    toast.success(`${card.solicitacao.id} concluída. E-mail enviado · ${etiquetaEtapa(key)} para ${destinatarios}.`);
    return;
  }
  toast.info(`E-mail enviado · ${etiquetaEtapa(key)} para ${destinatarios}.`);
}

function onDesfazer(card: CardDesembolso, key: EtapaDesembolsoKey) {
  if (card.concluidas[card.concluidas.length - 1] !== key) return;
  voltando.value = { card, key };
}

function confirmarVoltar(motivo: string) {
  if (!voltando.value) return;
  const { card, key } = voltando.value;
  if (card.concluidas[card.concluidas.length - 1] !== key) {
    voltando.value = null;
    return;
  }
  card.concluidas.pop();
  if (key === 'ENCARTEIRAR') card.desembolso = null;
  card.atividade.unshift(atividadeDesfeita(key, motivo));
  if (motivo) card.comentarios.unshift(novoComentario(key, motivo));
  voltando.value = null;
  toast.info(
    `Etapa desfeita: ${etiquetaEtapa(key)}.${motivo ? ' Comentário registrado.' : ''}`,
  );
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
  if (encerrarSeUltima(card, 'ENCARTEIRAR')) toast.success(resumo);
  else toast.info(`${resumo} Falta a etapa Financeiro.`);
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
        :expandido="expandidos.has(card.solicitacao.id)"
        @update:expandido="setExpandido(card.solicitacao.id, $event)"
        @concluir="onConcluir(card, $event)"
        @desfazer="onDesfazer(card, $event)"
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

    <VoltarEtapaModal
      v-if="voltando"
      :solicitacao-id="voltando.card.solicitacao.id"
      :cedente="voltando.card.solicitacao.cedente"
      :etapa="voltando.key"
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
