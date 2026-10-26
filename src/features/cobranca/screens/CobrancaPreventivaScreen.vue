<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlertTriangle, BadgeCheck, BarChart3, Phone } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useToast } from '@/composables/useToast';
import {
  CONTATOS_OPERADOR_SEED,
  CONTATOS_SACADO_SEED,
  REGISTROS_TENTATIVA_SEED,
  SACADOS_PREVENTIVA_SEED,
  canalLabel,
  hojeIso,
  TITULOS_PREVENTIVA_SEED,
  type RegistroTentativa,
  type StatusPreventivo,
  type TentativaRegistro,
  type TituloPreventivo,
} from '../data/cobrancaPreventivaData';
import PreventivaTab from '../components/preventiva/PreventivaTab.vue';
import AnaliseTab from '../components/preventiva/AnaliseTab.vue';
import ConfirmacaoTab from '../components/preventiva/ConfirmacaoTab.vue';
import AtivaTab from '../components/preventiva/AtivaTab.vue';
import SacadoDetailScreen, { type SacadoTab } from '../components/preventiva/SacadoDetailScreen.vue';
import EvidenciaScreen from '../components/preventiva/EvidenciaScreen.vue';
import OperadorDetailScreen from '../components/preventiva/OperadorDetailScreen.vue';

type Route =
  | { level: 'hub' }
  | { level: 'sacado'; sacadoId: string; tab: SacadoTab }
  | { level: 'evidencia'; sacadoId: string; registroId: string }
  | { level: 'operador'; operadorId: string; operador: string; inicio: string; fim: string };

type HubTab = 'analise' | 'confirmacao' | 'preventiva' | 'ativa';

const tab = ref<HubTab>('analise');
const route = ref<Route>({ level: 'hub' });
const titulos = ref<TituloPreventivo[]>(TITULOS_PREVENTIVA_SEED.map((t) => ({ ...t })));
const registros = ref<RegistroTentativa[]>(REGISTROS_TENTATIVA_SEED.map((r) => ({ ...r })));
const { success } = useToast();

const tabs = [
  { key: 'analise', label: 'Análise', icon: BarChart3 },
  { key: 'confirmacao', label: 'Cobrança de confirmação', icon: BadgeCheck },
  { key: 'preventiva', label: 'Cobrança preventiva', icon: Phone },
  { key: 'ativa', label: 'Cobrança ativa', icon: AlertTriangle },
];

const sacadoAberto = computed(() => {
  const current = route.value;
  if (current.level !== 'sacado' && current.level !== 'evidencia') return undefined;
  return SACADOS_PREVENTIVA_SEED.find((s) => s.id === current.sacadoId);
});

const registroAberto = computed(() => {
  const current = route.value;
  if (current.level !== 'evidencia') return undefined;
  return registros.value.find((r) => r.id === current.registroId);
});

const contatosSacado = computed(() => {
  const current = route.value;
  if (current.level !== 'sacado') return [];
  return CONTATOS_SACADO_SEED.filter((c) => c.sacadoId === current.sacadoId);
});

const registrosSacado = computed(() => {
  const current = route.value;
  if (current.level !== 'sacado') return [];
  return registros.value.filter((r) => r.sacadoId === current.sacadoId);
});

const titulosSacado = computed(() => {
  const current = route.value;
  if (current.level !== 'sacado') return [];
  return titulos.value.filter((t) => t.sacadoId === current.sacadoId);
});

const contatosOperador = computed(() => {
  const current = route.value;
  if (current.level !== 'operador') return [];
  return CONTATOS_OPERADOR_SEED.filter((c) => c.operadorId === current.operadorId);
});

const nomeOperador = computed(() => (route.value.level === 'operador' ? route.value.operador : ''));
const periodoOperador = computed(() =>
  route.value.level === 'operador'
    ? { inicio: route.value.inicio, fim: route.value.fim }
    : { inicio: '', fim: '' },
);

function registrar(payload: { ids: string[]; tentativas: TentativaRegistro[]; observacoes: string }) {
  const status = payload.tentativas.at(-1)?.status as StatusPreventivo | undefined;
  if (!status) return;
  const ids = new Set(payload.ids);
  titulos.value = titulos.value.map((t) => (ids.has(t.id) ? { ...t, status } : t));
  const n = payload.ids.length;
  const primeiro = titulos.value.find((t) => t.id === payload.ids[0]);
  if (primeiro) {
    const ultima = payload.tentativas.at(-1)!;
    registros.value = [
      {
        id: `rt-${Date.now()}`,
        sacadoId: primeiro.sacadoId,
        status,
        geral: payload.tentativas
          .map((t) => `${canalLabel(t.canal)} · ${t.quantidade} ${t.quantidade === 1 ? 'tentativa' : 'tentativas'}`)
          .join(' + '),
        observacoes: payload.observacoes,
        dataContato: ultima.dataContato || hojeIso(),
        registradoPor: 'Você',
        tituloIds: [...payload.ids],
        evidencia: payload.tentativas.find((t) => t.anexoNome)?.anexoNome ?? '',
      },
      ...registros.value,
    ];
  }
  success(n === 1 ? 'Tentativa registrada' : `Tentativa registrada em ${n} títulos`);
}

function abrirSacado(sacadoId: string, tab: SacadoTab = 'titulos') {
  route.value = { level: 'sacado', sacadoId, tab };
}

function abrirOperador(payload: { operadorId: string; operador: string; inicio: string; fim: string }) {
  route.value = { level: 'operador', ...payload };
}
</script>

<template>
  <EvidenciaScreen
    v-if="route.level === 'evidencia' && sacadoAberto && registroAberto"
    :registro="registroAberto"
    :sacado="sacadoAberto"
    @back="abrirSacado(sacadoAberto.id, 'registros')"
  />
  <SacadoDetailScreen
    v-else-if="route.level === 'sacado' && sacadoAberto"
    :key="`${sacadoAberto.id}-${route.tab}`"
    :sacado="sacadoAberto"
    :titulos="titulosSacado"
    :contatos="contatosSacado"
    :registros="registrosSacado"
    :initial-tab="route.tab"
    @back="route = { level: 'hub' }"
    @registrar="registrar"
    @evidencia="route = { level: 'evidencia', sacadoId: sacadoAberto.id, registroId: $event }"
  />
  <OperadorDetailScreen
    v-else-if="route.level === 'operador'"
    :key="route.operadorId"
    :operador="nomeOperador"
    :contatos="contatosOperador"
    :inicio="periodoOperador.inicio"
    :fim="periodoOperador.fim"
    @back="route = { level: 'hub' }"
  />
  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Cobrança
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Cobrança preventiva
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Análise, confirmação, preventiva e cobrança ativa no mesmo fluxo operacional.
      </p>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabs"
      variant="brand"
      single-row
      class="hub-tabs"
      @update:model-value="tab = $event as HubTab"
    />

    <AnaliseTab v-if="tab === 'analise'" :titulos="titulos" @open="abrirOperador" />
    <ConfirmacaoTab v-else-if="tab === 'confirmacao'" :titulos="titulos" />
    <PreventivaTab
      v-else-if="tab === 'preventiva'"
      :sacados="SACADOS_PREVENTIVA_SEED"
      :titulos="titulos"
      @open="abrirSacado"
    />
    <AtivaTab v-else :titulos="titulos" />
  </div>
</template>

<style scoped>
.hub-tabs {
  width: 100%;
  overflow-x: auto;
}
.hub-tabs :deep(button) {
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
