<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ChevronsDownUp, ChevronsUpDown, Search } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { brl, slaRatio, solicitacoes } from '../data/operacaoData';
import {
  atividadeDesfeita,
  atividadeEmail,
  cardsIniciais,
  DESTINATARIOS_ETAPA,
  etiquetaEtapa,
  formatDataBr,
  possuiEtapaBmp,
  proximaEtapa,
  type CardDesembolso,
  type EncarteirarPayload,
  type EtapaDesembolsoKey,
} from '../data/desembolsoClienteData';
import DesembolsoClienteCard from '../components/desembolso-cliente/DesembolsoClienteCard.vue';
import EncarteirarModal from '../components/desembolso-cliente/EncarteirarModal.vue';

const toast = useToast();
const cards = reactive<CardDesembolso[]>(cardsIniciais(solicitacoes));
const q = ref('');
const encarteirando = ref<CardDesembolso | null>(null);

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
  const needle = q.value.trim().toLowerCase();
  return emAberto.value.filter((card) => {
    if (!passaFiltro(card, filtro.value)) return false;
    if (!needle) return true;
    const s = card.solicitacao;
    return `${s.id} ${s.cedente} ${s.veiculo} ${s.vinculo}`.toLowerCase().includes(needle);
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

function onConcluir(card: CardDesembolso, key: EtapaDesembolsoKey) {
  const proxima = proximaEtapa(card);
  if (!proxima || proxima.key !== key) return;
  if (key === 'ENCARTEIRAR') {
    encarteirando.value = card;
    return;
  }
  card.concluidas.push(key);
  card.atividade.unshift(atividadeEmail(key));
  toast.info(`E-mail enviado · ${etiquetaEtapa(key)} para ${DESTINATARIOS_ETAPA[key].join(', ')}.`);
}

function onDesfazer(card: CardDesembolso, key: EtapaDesembolsoKey) {
  const ultima = card.concluidas[card.concluidas.length - 1];
  if (ultima !== key || key === 'ENCARTEIRAR') return;
  card.concluidas.pop();
  card.atividade.unshift(atividadeDesfeita(key));
  toast.info(`Etapa desfeita: ${etiquetaEtapa(key)}.`);
}

function onBaixar(arquivo: string) {
  toast.info(`Download iniciado: ${arquivo}`);
}

function onEncarteirar(payload: EncarteirarPayload) {
  const card = encarteirando.value;
  if (!card) return;
  const id = card.solicitacao.id;
  card.solicitacao.etapa = 'SOLUCIONADA';
  card.concluidas.push('ENCARTEIRAR');
  encarteirando.value = null;
  toast.success(
    `${id} encarteirada em ${formatDataBr(payload.dataDesembolso)} (${brl(payload.valorDesembolsado)}). E-mail enviado para ${DESTINATARIOS_ETAPA.ENCARTEIRAR.join(', ')}.`,
  );
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
          color: filtro === f.key ? '#fff' : 'var(--text-muted)',
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
            background: filtro === f.key ? 'rgba(255,255,255,0.2)' : 'var(--surface-sunken)',
            color: filtro === f.key ? '#fff' : 'var(--text-muted)',
          }"
        >
          {{ contagens[f.key] }}
        </span>
      </button>
    </div>

    <!-- Busca + expandir/recolher todos -->
    <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 240px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
        <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Buscar por ID, cedente ou veículo..."
          style="width: 100%; height: 42px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong); border-radius: var(--radius-lg)"
        />
      </div>
      <button
        type="button"
        class="flex items-center"
        :disabled="filtrados.length === 0"
        :style="{
          gap: '8px',
          height: '42px',
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
        :expandido="expandidos.has(card.solicitacao.id)"
        @update:expandido="setExpandido(card.solicitacao.id, $event)"
        @concluir="onConcluir(card, $event)"
        @desfazer="onDesfazer(card, $event)"
        @baixar="onBaixar"
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
  </div>
</template>
