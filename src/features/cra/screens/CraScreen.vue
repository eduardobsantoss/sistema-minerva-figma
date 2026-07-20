<script setup lang="ts">
import { ref, computed } from 'vue';
import CraListScreen from './CraListScreen.vue';
import CraDetailScreen from './CraDetailScreen.vue';
import CraOperacaoDetailScreen from './CraOperacaoDetailScreen.vue';
import CraTitleDetailScreen from './CraTitleDetailScreen.vue';
import SacadoDetailScreen from './SacadoDetailScreen.vue';
import GrupoEmpresarialDetailScreen from './GrupoEmpresarialDetailScreen.vue';
import CreateCraModal, { type NewCraData } from '../components/CreateCraModal.vue';
import CreateCraOperacaoModal, { type NewCraOperacaoData } from '../components/CreateCraOperacaoModal.vue';
import { cras as initialCras, type Cra, type CraOperacao, type Cessao, type Sacado, type CraSetup, type GrupoEmpresarialVinculo } from '../data/craData';

type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string }
  | { level: 'sacado'; craId: string; sacadoId: string }
  | { level: 'grupo'; craId: string; grupoId: string };

function defaultSetup(nome: string): CraSetup {
  return {
    nome,
    custodiante: '',
    cessionaria: '—',
    prestadorServico: '',
    beneficiarioFinal: '—',
    grupoOperacao: '',
    tipoCalculoElegibilidade: 'Valor presente',
    accrual: false,
    exigirIe: false,
    topSacados: false,
    topCedentes: false,
    tiposTituloAtivos: false,
    entregaFutura: false,
    limiteConcentracaoPct: '',
    limiteVencimentoMin: '',
    limiteVencimentoMax: '',
    bondTypes: [],
    carteiraNome: '',
    carteiraBanco: '',
    carteiraSlug: '',
    carteiraCnab: '',
    carteiraConta: '',
    carteiraAgencia: '',
    vencimentoFimSemana: false,
    beneficiarioNome: '',
    beneficiarioCep: '',
    beneficiarioCidade: '',
    beneficiarioUf: '',
    jurosBoleto: '',
    multaBoleto: '',
    eligibilityTops: [],
  };
}

function buildCraFromForm(data: NewCraData): Cra {
  const nome = data.nomeFantasia || 'NOVO CRA';
  return {
    id: `cra-${Date.now()}`,
    nome,
    cnpj: '—',
    cessionaria: '—',
    status: 'EM ANDAMENTO',
    tipo: data.tipoOperacao === 'Mono CRA' ? 'MONO CRA' : 'MULTI CRA',
    operacoes: [],
    cessoes: [],
    sacados: [],
    grupos: [],
    setup: defaultSetup(nome),
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

function updateCessoes(craId: string, cessoes: Cessao[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, cessoes } : c));
}

function updateSacados(craId: string, sacados: Sacado[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, sacados } : c));
}

function updateGrupos(craId: string, grupos: GrupoEmpresarialVinculo[]) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, grupos } : c));
}

function updateSetup(craId: string, setup: CraSetup) {
  craList.value = craList.value.map((c) => (c.id === craId ? { ...c, setup } : c));
}

function handleSacadoUpdate(s: Sacado) {
  const r = route.value;
  if (r.level !== 'sacado') return;
  const current = craList.value.find((c) => c.id === r.craId);
  if (!current) return;
  updateSacados(
    r.craId,
    current.sacados.map((x) => (x.id === s.id ? s : x)),
  );
}

function handleGrupoUpdate(g: GrupoEmpresarialVinculo) {
  const r = route.value;
  if (r.level !== 'grupo') return;
  const current = craList.value.find((c) => c.id === r.craId);
  if (!current) return;
  updateGrupos(
    r.craId,
    current.grupos.map((x) => (x.id === g.id ? g : x)),
  );
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

const sacado = computed(() => {
  const r = route.value;
  if (r.level !== 'sacado') return undefined;
  return cra.value?.sacados.find((s) => s.id === r.sacadoId);
});

const grupo = computed(() => {
  const r = route.value;
  if (r.level !== 'grupo') return undefined;
  return cra.value?.grupos.find((g) => g.id === r.grupoId);
});
</script>

<template>
  <template v-if="route.level === 'list'">
    <CraListScreen
      :cras="craList"
      @open="(craId) => (route = { level: 'cra', craId })"
      @new="creating = true"
    />
    <CreateCraModal v-if="creating" @close="creating = false" @create="handleCreateCra" />
  </template>

  <template v-else-if="route.level === 'cra' && cra">
    <CraDetailScreen
      :cra="cra"
      @back="route = { level: 'list' }"
      @create-operacao="creatingOperacao = true"
      @open-operacao="(operacaoId) => (route = { level: 'operacao', craId: cra!.id, operacaoId })"
      @open-titulo="(operacaoId, tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId, tituloId })"
      @open-sacado="(sacadoId) => (route = { level: 'sacado', craId: cra!.id, sacadoId })"
      @open-grupo="(grupoId) => (route = { level: 'grupo', craId: cra!.id, grupoId })"
      @update-cessoes="(cessoes) => updateCessoes(cra!.id, cessoes)"
      @update-sacados="(sacados) => updateSacados(cra!.id, sacados)"
      @update-grupos="(grupos) => updateGrupos(cra!.id, grupos)"
      @update-setup="(setup) => updateSetup(cra!.id, setup)"
    />
    <CreateCraOperacaoModal
      v-if="creatingOperacao"
      @close="creatingOperacao = false"
      @create="handleCreateOperacao"
    />
  </template>

  <SacadoDetailScreen
    v-else-if="route.level === 'sacado' && cra && sacado"
    :cra="cra"
    :sacado="sacado"
    @back="route = { level: 'cra', craId: cra.id }"
    @update="handleSacadoUpdate"
  />

  <GrupoEmpresarialDetailScreen
    v-else-if="route.level === 'grupo' && cra && grupo"
    :cra="cra"
    :grupo="grupo"
    @back="route = { level: 'cra', craId: cra.id }"
    @update="handleGrupoUpdate"
  />

  <CraOperacaoDetailScreen
    v-else-if="route.level === 'operacao' && cra && operacao"
    :cra="cra"
    :operacao="operacao"
    @back="route = { level: 'cra', craId: cra!.id }"
    @open-titulo="(tituloId) => (route = { level: 'titulo', craId: cra!.id, operacaoId: operacao!.id, tituloId })"
  />

  <CraTitleDetailScreen
    v-else-if="route.level === 'titulo' && cra && operacao && titulo"
    :cra="cra"
    :operacao="operacao"
    :titulo="titulo"
    @back="route = { level: 'operacao', craId: cra!.id, operacaoId: operacao!.id }"
  />
</template>
