<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, FileText, TrendingUp, AlertCircle, Search, Filter, Settings2,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { brl, num, type Cra, type CraOperacao, type CraTitulo } from '../data/craData';

const props = defineProps<{ cra: Cra; operacao: CraOperacao }>();
const emit = defineEmits<{ back: []; openTitulo: [tituloId: string] }>();

const q = ref('');
const showColPanel = ref(false);

const filtered = computed(() =>
  props.operacao.titulos.filter(
    (t) =>
      !q.value ||
      t.numero.includes(q.value) ||
      t.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

// All titles in this operação belong to classe 1
const classMap = computed<Record<string, string>>(() =>
  Object.fromEntries(props.operacao.titulos.map((t) => [t.operacaoId, '1'])),
);

function statusStyle(s: CraTitulo['status']) {
  return {
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  }[s];
}

const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

interface Kpi {
  icon: Component;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
}

const kpis = computed<Kpi[]>(() => [
  { icon: TrendingUp, label: 'Valor de Emissão', value: brl(props.operacao.valorEmissao), tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' } },
  { icon: FileText, label: 'Valor em Carteira', value: brl(props.operacao.carteira.valor), tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' } },
  { icon: AlertCircle, label: 'Valor Vencido', value: brl(props.operacao.vencido.valor), tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' } },
  { icon: FileText, label: 'Títulos Ativos', value: num(props.operacao.carteira.titulos), tone: { bg: '#EEF0FF', fg: '#4F46E5' } },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); cursor: pointer; color: var(--text-strong)"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 4px">
          {{ cra.nome }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ operacao.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ operacao.tipo }} · {{ operacao.cessionaria }}
        </p>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl)"
      >
        <div class="flex items-center justify-center" :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }">
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">{{ k.label }}</div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ k.value }}</div>
        </div>
      </div>
    </div>

    <!-- Titles panel -->
    <div style="background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
      <div class="flex items-center" style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-sunken); color: var(--gci-base)">
          <FileText :size="20" />
        </div>
        <div style="flex: 1">
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">Títulos da Operação</div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
            {{ operacao.titulos.length }} títulos cadastrados
          </div>
        </div>
        <div class="flex items-center" style="gap: 6px; position: relative">
          <button
            aria-label="Colunas"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
            @click="showColPanel = !showColPanel"
          >
            <Settings2 :size="16" />
          </button>
          <button
            aria-label="Filtros"
            class="flex items-center justify-center"
            style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); color: var(--text-muted); cursor: pointer"
          >
            <Filter :size="16" />
          </button>
          <template v-if="showColPanel">
            <div style="position: fixed; inset: 0; z-index: 10" @click="showColPanel = false" />
            <div style="position: absolute; top: 48px; right: 0; z-index: 20; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); padding: 16px; min-width: 200px; box-shadow: var(--shadow-md)">
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px">Colunas visíveis</div>
              <label
                v-for="c in ['Classe', 'Nº Título', 'Tipo', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status']"
                :key="c"
                class="flex items-center"
                style="gap: 10px; cursor: pointer; margin-bottom: 8px"
              >
                <input type="checkbox" checked style="accent-color: var(--gci-base); width: 14px; height: 14px" />
                <span style="font-size: var(--text-sm); color: var(--text-default)">{{ c }}</span>
              </label>
            </div>
          </template>
        </div>
      </div>

      <!-- Search -->
      <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
        <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
          <Search :size="16" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por número, cedente ou sacado..."
            style="width: 100%; height: 44px; padding-left: 44px; padding-right: 16px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong)"
          />
        </div>
      </div>

      <!-- Table -->
      <div v-if="filtered.length === 0" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">Nenhum título encontrado.</div>
      <div v-else>
        <div
          class="grid"
          :style="{ gridTemplateColumns: cols, padding: '14px 20px', background: 'var(--surface-sunken)', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }"
        >
          <div>Classe</div>
          <div>Nº Título</div>
          <div>Tipo</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Vencimento</div>
          <div>VR. Nominal</div>
          <div style="text-align: right">Status</div>
        </div>
        <div
          v-for="r in filtered"
          :key="r.id"
          class="cra-op-detail-row grid items-center"
          :style="{ gridTemplateColumns: cols, padding: '16px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)' }"
          @click="emit('openTitulo', r.id)"
        >
          <div>
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; padding: 4px 8px; border-radius: var(--radius-sm); background: var(--status-neutral-bg); color: var(--status-neutral-text)">
              {{ classMap[r.operacaoId] ?? '1' }}
            </span>
          </div>
          <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">#{{ r.numero }}</div>
          <div>
            <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; padding: 4px 7px; border-radius: var(--radius-sm); background: var(--gci-light); color: var(--gci-base)">{{ r.tipo }}</span>
          </div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.cedente }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.cedenteCnpj }}</div>
          </div>
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.sacado }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ r.sacadoCnpj }}</div>
          </div>
          <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.vencimento }}</div>
          <div :style="{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }">{{ brl(r.vrNominal) }}</div>
          <div style="text-align: right">
            <span :style="{ fontSize: '9px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: '9999px', background: statusStyle(r.status)!.bg, color: statusStyle(r.status)!.fg }">{{ r.status }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between" style="padding: 16px 20px; border-top: 1px solid var(--border-default)">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          Exibindo <span style="color: var(--text-strong)">{{ filtered.length }}</span> de <span style="color: var(--text-strong)">{{ operacao.titulos.length }}</span> registros
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cra-op-detail-row:hover {
  background: var(--surface-sunken);
}
</style>
