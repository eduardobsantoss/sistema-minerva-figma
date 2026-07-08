<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  Search, Wallet, AlertOctagon, FileWarning, TrendingDown, ChevronRight,
  Clock, XCircle, Building2,
} from 'lucide-vue-next';
import { GRUPOS_SEED, brl, statusOperacaoColor, parecerLabel, parecerColor } from '../data/riscoData';
import GrupoDetailScreen from './GrupoDetailScreen.vue';

type Route = { level: 'dashboard' } | { level: 'detail'; grupoId: string };

const route = ref<Route>({ level: 'dashboard' });
const query = ref('');

const grupoAtual = computed(() => {
  const r = route.value;
  return r.level === 'detail' ? GRUPOS_SEED.find((g) => g.id === r.grupoId) : undefined;
});

function openGrupo(id: string) {
  route.value = { level: 'detail', grupoId: id };
}

const limiteTotal = GRUPOS_SEED.reduce((sum, g) => sum + g.limite, 0);
const riscoTotal = GRUPOS_SEED.reduce((sum, g) => sum + g.riscoTotal, 0);
const parecerVencidoCount = GRUPOS_SEED.filter((g) => g.parecerCredito === 'EXPIRADO').length;
const recoverySpecialCount = GRUPOS_SEED.filter((g) => g.statusOperacao === 'Recovery' || g.statusOperacao === 'Special-Sit').length;

const pareceresFila = GRUPOS_SEED
  .filter((g) => g.parecerCredito === 'EXPIRADO' || g.parecerCredito === 'EXPIRANDO')
  .sort((a, b) => (a.parecerCredito === 'EXPIRADO' ? -1 : 1) - (b.parecerCredito === 'EXPIRADO' ? -1 : 1));

const recoveryFila = GRUPOS_SEED.filter((g) => g.statusOperacao === 'Recovery' || g.statusOperacao === 'Special-Sit');

const prioridade = [...GRUPOS_SEED].sort((a, b) => b.riscoTotal - a.riscoTotal).slice(0, 5);

interface Kpi { icon: Component; label: string; value: string; tone: string }
const kpis = computed<Kpi[]>(() => [
  { icon: Wallet, label: 'Limite Total', value: brl(limiteTotal, { compact: true }), tone: 'var(--gci-base)' },
  { icon: TrendingDown, label: 'Risco Total', value: brl(riscoTotal, { compact: true }), tone: 'var(--agro-base)' },
  { icon: FileWarning, label: 'Grupos com Parecer Vencido', value: String(parecerVencidoCount), tone: 'var(--danger-base)' },
  { icon: AlertOctagon, label: 'Grupos em Recovery/Special-Sit', value: String(recoverySpecialCount), tone: 'var(--warning-base)' },
]);

const searchResults = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return GRUPOS_SEED.filter((g) => g.nome.toLowerCase().includes(q) || g.documento.includes(q)).slice(0, 6);
});

function handleSearchSelect(id: string) {
  openGrupo(id);
  query.value = '';
}
</script>

<template>
  <GrupoDetailScreen v-if="grupoAtual" :grupo="grupoAtual" @back="route = { level: 'dashboard' }" />
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Identificação + busca rápida -->
    <div class="flex items-start justify-between" style="gap: 16px; flex-wrap: wrap">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Risco
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Dashboard
        </h1>
      </div>

      <div style="position: relative; width: 320px">
        <Search :size="15" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted)" />
        <input
          v-model="query"
          placeholder="Buscar grupo por nome ou documento"
          style="width: 100%; height: 42px; padding: 0 14px 0 38px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong)"
        />
        <div
          v-if="searchResults.length > 0"
          style="position: absolute; top: 46px; left: 0; right: 0; z-index: 40; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden"
        >
          <button
            v-for="g in searchResults"
            :key="g.id"
            class="flex items-center justify-between risco-search-item"
            style="width: 100%; padding: 10px 14px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
            @click="handleSearchSelect(g.id)"
          >
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ g.documento }}</div>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted)" />
          </button>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px">
      <div v-for="kpi in kpis" :key="kpi.label" style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 18px">
        <div class="flex items-center justify-center" :style="{ width: '36px', height: '36px', borderRadius: 'var(--radius-lg)', background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`, color: kpi.tone, marginBottom: '12px' }">
          <component :is="kpi.icon" :size="17" />
        </div>
        <div style="font-size: 22px; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: -0.01em">{{ kpi.value }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">{{ kpi.label }}</div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: start">
      <!-- Filas de ação -->
      <div class="flex flex-col" style="gap: 16px">
        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
          <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
            <FileWarning :size="16" style="color: var(--text-muted)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Pareceres a vencer/vencidos</h3>
          </div>
          <div v-if="pareceresFila.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
            Nenhum parecer pendente de atenção.
          </div>
          <button
            v-for="g in pareceresFila"
            :key="g.id"
            class="flex items-center justify-between risco-queue-row"
            style="width: 100%; padding: 14px 20px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
            @click="openGrupo(g.id)"
          >
            <div style="min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ g.nome }}</div>
              <div class="flex items-center" :style="{ gap: '6px', marginTop: '2px', color: parecerColor(g.parecerCredito) }">
                <XCircle v-if="g.parecerCredito === 'EXPIRADO'" :size="12" />
                <Clock v-else :size="12" />
                <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold)">{{ parecerLabel(g.parecerCredito) }}</span>
              </div>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted); flex-shrink: 0" />
          </button>
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
          <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
            <AlertOctagon :size="16" style="color: var(--text-muted)" />
            <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Grupos em Recovery/Special-Sit</h3>
          </div>
          <div v-if="recoveryFila.length === 0" style="padding: 24px 20px; font-size: var(--text-sm); color: var(--text-muted); text-align: center">
            Nenhum grupo em recuperação ou situação especial.
          </div>
          <button
            v-for="g in recoveryFila"
            :key="g.id"
            class="flex items-center justify-between risco-queue-row"
            style="width: 100%; padding: 14px 20px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
            @click="openGrupo(g.id)"
          >
            <div style="min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ g.nome }}</div>
              <span
                class="flex items-center"
                :style="{ gap: '6px', width: 'fit-content', fontSize: '10px', fontWeight: 'var(--weight-bold)', padding: '2px 8px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), marginTop: '4px' }"
              >
                {{ g.statusOperacao }}
              </span>
            </div>
            <ChevronRight :size="14" style="color: var(--text-muted); flex-shrink: 0" />
          </button>
        </div>
      </div>

      <!-- Lista de prioridade -->
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); overflow: hidden">
        <div class="flex items-center" style="gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-default)">
          <Building2 :size="16" style="color: var(--text-muted)" />
          <h3 style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Top grupos por risco</h3>
        </div>
        <button
          v-for="(g, i) in prioridade"
          :key="g.id"
          class="flex items-center justify-between risco-queue-row"
          style="width: 100%; padding: 14px 20px; background: none; border: none; border-top: 1px solid var(--border-default); cursor: pointer; text-align: left"
          @click="openGrupo(g.id)"
        >
          <div class="flex items-center" style="gap: 12px; min-width: 0">
            <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); width: 16px; flex-shrink: 0">{{ i + 1 }}</span>
            <div style="min-width: 0">
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ g.nome }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
                Limite {{ brl(g.limite, { compact: true }) }}
              </div>
            </div>
          </div>
          <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--danger-base); font-variant-numeric: tabular-nums">
              {{ brl(g.riscoTotal, { compact: true }) }}
            </span>
            <ChevronRight :size="14" style="color: var(--text-muted)" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.risco-search-item:hover,
.risco-queue-row:hover {
  background: var(--surface-sunken);
}
</style>
