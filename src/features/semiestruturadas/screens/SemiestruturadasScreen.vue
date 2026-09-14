<script setup lang="ts">
import { ref, computed } from 'vue';
import SemiListScreen from './SemiListScreen.vue';
import SemiOperacaoDetailScreen from './SemiOperacaoDetailScreen.vue';
import SemiCotaDetailScreen from './SemiCotaDetailScreen.vue';
import CreateSemiModal, { type NewSemiData } from '../components/CreateSemiModal.vue';
import { GRUPOS_SEED } from '@/features/risco/data/riscoData';
import {
  operacoes as initialOperacoes,
  warrantyTypeName,
  type SemiGarantia,
  type SemiOperacao,
  type TipoOperacaoSemi,
} from '../data/semiestruturadasData';

type Route =
  | { level: 'list' }
  | { level: 'operacao'; operacaoId: string }
  | { level: 'cota'; operacaoId: string; cotaId: string };

const route = ref<Route>({ level: 'list' });
const operacaoList = ref([...initialOperacoes]);
const creating = ref(false);

function buildOperacaoFromForm(data: NewSemiData): SemiOperacao {
  const grupo = GRUPOS_SEED.find((g) => g.id === data.grupoIds[0]);
  const tipo = (data.contractType || 'NC') as TipoOperacaoSemi;
  const valorExigido = data.required.reduce((s, r) => s + (r.mode === 'value' ? (r.value ?? 0) : 0), 0);
  const dupIds = new Set([11]);
  const dupValor = data.required.reduce((s, r) => {
    if (r.mode !== 'value' || !dupIds.has(r.warrantyTypeId)) return s;
    return s + (r.value ?? 0);
  }, 0);
  const demaisValor = Math.max(0, valorExigido - dupValor);
  const dupPct = valorExigido > 0 ? (dupValor / valorExigido) * 100 : 0;
  const demaisPct = valorExigido > 0 ? (demaisValor / valorExigido) * 100 : 0;
  const prefix = `SEMI-${Date.now().toString().slice(-6)}`;

  const garantias: SemiGarantia[] = data.accepted.map((a, i) => ({
    id: `${prefix}-g${i + 1}`,
    numero: `${prefix}-G${String(i + 1).padStart(2, '0')}`,
    lastro: tipo,
    tipoGarantia: warrantyTypeName(a.warrantyTypeId),
    cedente: grupo?.nome ?? '—',
    cedenteCnpj: grupo?.documento ?? '—',
    sacado: '—',
    sacadoCnpj: '—',
    vencimento: '—',
    vrNominal: data.required.find((r) => r.warrantyTypeId === a.warrantyTypeId && r.mode === 'value')?.value ?? 0,
    status: 'PENDENTE',
  }));

  return {
    id: `semi-${Date.now()}`,
    tipo,
    nome: data.nome.trim(),
    cedente: grupo?.nome ?? '—',
    cedenteCnpj: grupo?.documento ?? '—',
    valorNominal: 0,
    valorComposicao: valorExigido,
    garantiasDuplicatas: { valor: dupValor, pct: dupPct },
    demaisGarantias: { valor: demaisValor, pct: demaisPct },
    valorAbertoGarantia: 0,
    coberturaPct: 0,
    status: 'AGUARDANDO INÍCIO',
    cotas: [],
    lastros: [],
    garantias,
  };
}

function handleCreate(data: NewSemiData) {
  operacaoList.value = [buildOperacaoFromForm(data), ...operacaoList.value];
  creating.value = false;
}

const operacao = computed(() => {
  const r = route.value;
  if (r.level === 'list') return undefined;
  return operacaoList.value.find((o) => o.id === r.operacaoId);
});

const cota = computed(() => {
  const r = route.value;
  if (r.level !== 'cota') return undefined;
  return operacao.value?.cotas.find((c) => c.id === r.cotaId);
});
</script>

<template>
  <template v-if="route.level === 'list'">
    <SemiListScreen
      :operacoes="operacaoList"
      @open="(operacaoId) => (route = { level: 'operacao', operacaoId })"
      @new="creating = true"
    />
    <CreateSemiModal v-if="creating" @close="creating = false" @create="handleCreate" />
  </template>

  <SemiOperacaoDetailScreen
    v-else-if="route.level === 'operacao' && operacao"
    :operacao="operacao"
    @back="route = { level: 'list' }"
    @open-cota="(cotaId) => (route = { level: 'cota', operacaoId: operacao!.id, cotaId })"
  />

  <SemiCotaDetailScreen
    v-else-if="route.level === 'cota' && operacao && cota"
    :operacao="operacao"
    :cota="cota"
    @back="route = { level: 'operacao', operacaoId: operacao.id }"
  />
</template>
