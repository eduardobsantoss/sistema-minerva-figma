<script setup lang="ts">
import { ref, computed } from 'vue';
import CraListScreen from './CraListScreen.vue';
import CraDetailScreen from './CraDetailScreen.vue';
import CraOperacaoDetailScreen from './CraOperacaoDetailScreen.vue';
import CraTitleDetailScreen from './CraTitleDetailScreen.vue';
import CreateCraModal, { type NewCraData } from '../components/CreateCraModal.vue';
import CreateCraOperacaoModal, { type NewCraOperacaoData } from '../components/CreateCraOperacaoModal.vue';
import { cras as initialCras, type Cra, type CraOperacao } from '../data/craData';

type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string };

function buildCraFromForm(data: NewCraData): Cra {
  return {
    id: `cra-${Date.now()}`,
    nome: data.nomeFantasia || 'NOVO CRA',
    cnpj: '—',
    cessionaria: '—',
    status: 'EM ANDAMENTO',
    tipo: data.tipoOperacao === 'Mono CRA' ? 'MONO CRA' : 'MULTI CRA',
    operacoes: [],
  };
}

function buildOperacaoFromForm(data: NewCraOperacaoData): CraOperacao {
  const id = `op-${Date.now()}`;
  return {
    id,
    nome: data.nome || 'NOVA OPERAÇÃO',
    tipo: data.tipoCliente === 'Monocedente' ? 'MONO CRA' : 'MULTI CRA',
    numeroEmissao: data.numeroEmissao || '—',
    cessionaria: data.cessionaria || '—',
    prestadorServico: data.prestadorServico || '—',
    custodiante: data.custodiante || '—',
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    partesRelacionadas: { pct: 0, valor: 0 },
    novosSacados: { pct: 0, valor: 0 },
    valorEmissao: parseFloat((data.valorEmissao ?? '').replace(/[^\d,]/g, '').replace(',', '.')) || 0,
    dataEmissao: data.dataEmissao || '',
    dataInicio: data.dataInicio || '',
    dataVencimento: data.dataVencimento || '',
    titulos: [],
  };
}

const route = ref<Route>({ level: 'list' });
const creating = ref(false);
const creatingOperacao = ref(false);
const craList = ref<Cra[]>(initialCras);

function handleCreateCra(data: NewCraData) {
  craList.value = [...craList.value, buildCraFromForm(data)];
  creating.value = false;
}

function handleCreateOperacao(data: NewCraOperacaoData) {
  if (route.value.level !== 'cra') return;
  const operacao = buildOperacaoFromForm(data);
  const craId = route.value.craId;
  craList.value = craList.value.map((c) =>
    c.id === craId ? { ...c, operacoes: [...c.operacoes, operacao] } : c,
  );
  creatingOperacao.value = false;
}

const cra = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return craList.value.find((c) => c.id === r.craId);
});

const operacao = computed(() => {
  const r = route.value;
  if (r.level !== 'operacao' && r.level !== 'titulo') return undefined;
  return cra.value?.operacoes.find((o) => o.id === r.operacaoId);
});

const titulo = computed(() => {
  const r = route.value;
  if (r.level !== 'titulo') return undefined;
  return operacao.value?.titulos.find((t) => t.id === r.tituloId);
});
</script>

<template>
  <!-- ── List ──────────────────────────────────────────────────────── -->
  <template v-if="route.level === 'list'">
    <CraListScreen
      :cras="craList"
      @open="(craId) => (route = { level: 'cra', craId })"
      @new="creating = true"
    />
    <CreateCraModal v-if="creating" @close="creating = false" @create="handleCreateCra" />
  </template>

  <!-- ── CRA detail ────────────────────────────────────────────────── -->
  <template v-else-if="route.level === 'cra' && cra">
    <CraDetailScreen
      :cra="cra"
      @back="route = { level: 'list' }"
      @create-operacao="creatingOperacao = true"
      @open-operacao="(operacaoId) => (route = { level: 'operacao', craId: cra!.id, operacaoId })"
      @open-titulo="(operacaoId, tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId, tituloId })"
    />
    <CreateCraOperacaoModal
      v-if="creatingOperacao"
      @close="creatingOperacao = false"
      @create="handleCreateOperacao"
    />
  </template>

  <!-- ── Operação detail ───────────────────────────────────────────── -->
  <CraOperacaoDetailScreen
    v-else-if="route.level === 'operacao' && cra && operacao"
    :cra="cra"
    :operacao="operacao"
    @back="route = { level: 'cra', craId: cra!.id }"
    @open-titulo="(tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId: operacao!.id, tituloId })"
  />

  <!-- ── Título detail ─────────────────────────────────────────────── -->
  <CraTitleDetailScreen
    v-else-if="route.level === 'titulo' && cra && operacao && titulo"
    :cra="cra"
    :operacao="operacao"
    :titulo="titulo"
    @back="route = { level: 'operacao', craId: cra!.id, operacaoId: operacao!.id }"
  />
</template>
