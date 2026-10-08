<script setup lang="ts">
import { computed, ref } from 'vue';
import { FileText, LayoutGrid, List, Phone, Users, Wallet } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import {
  brl,
  situacaoColor,
  type SacadoPreventivo,
  type StatusPreventivo,
  type TituloPreventivo,
} from '../../data/cobrancaPreventivaData';
import StatusTitulosChart from './StatusTitulosChart.vue';

const props = defineProps<{ sacados: SacadoPreventivo[]; titulos: TituloPreventivo[] }>();
const emit = defineEmits<{ open: [sacadoId: string] }>();

const nomeQuery = ref('');
const documentoQuery = ref('');
const statusFiltro = ref<StatusPreventivo | null>(null);
const viewMode = ref<'cards' | 'table'>('cards');
const viewOptions = [
  { key: 'cards', label: 'Visualização em cards', icon: LayoutGrid },
  { key: 'table', label: 'Visualização em tabela', icon: List },
];

const cards = computed(() => {
  const nome = nomeQuery.value.trim().toLowerCase();
  const documento = documentoQuery.value.trim().toLowerCase();
  return props.sacados
    .map((sacado) => {
      const titulos = props.titulos.filter((t) => t.sacadoId === sacado.id);
      const confirmados = titulos.filter((t) => t.status === 'CONFIRMADO').length;
      return {
        sacado,
        valor: titulos.reduce((acc, t) => acc + t.valor, 0),
        titulos: titulos.length,
        confirmados,
        pendentes: titulos.length - confirmados,
        cedentes: new Set(titulos.map((t) => t.cedente)).size,
        veiculos: new Set(titulos.map((t) => t.veiculo)).size,
        temStatus: statusFiltro.value ? titulos.some((t) => t.status === statusFiltro.value) : true,
      };
    })
    .filter((card) => {
      if (!card.temStatus) return false;
      if (nome && !card.sacado.nome.toLowerCase().includes(nome)) return false;
      if (documento && !card.sacado.documento.toLowerCase().includes(documento)) return false;
      return true;
    });
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(() => cards.value, {
  defaultPageSize: 10,
});

const resumo = computed(() => ({
  valor: props.titulos.reduce((acc, t) => acc + t.valor, 0),
  titulos: props.titulos.length,
  sacados: props.sacados.length,
  confirmados: props.titulos.filter((t) => t.status === 'CONFIRMADO').length,
}));

const kpis = computed(() => [
  {
    icon: Wallet,
    title: 'Valor a vencer',
    tone: 'var(--gci-base)',
    primaryLabel: 'Carteira preventiva',
    primaryValue: brl(resumo.value.valor),
    secondaryLabel: 'Títulos na fila',
    secondaryValue: String(resumo.value.titulos),
  },
  {
    icon: FileText,
    title: 'Títulos',
    tone: 'var(--agro-base)',
    primaryLabel: 'Quantidade',
    primaryValue: String(resumo.value.titulos),
    secondaryLabel: 'Confirmados',
    secondaryValue: String(resumo.value.confirmados),
  },
  {
    icon: Users,
    title: 'Sacados',
    tone: 'var(--warning-base)',
    primaryLabel: 'Com títulos a vencer',
    primaryValue: String(resumo.value.sacados),
    secondaryLabel: 'Média por sacado',
    secondaryValue: resumo.value.sacados
      ? String(Math.round(resumo.value.titulos / resumo.value.sacados))
      : '0',
  },
]);

function toggleStatus(status: StatusPreventivo) {
  statusFiltro.value = statusFiltro.value === status ? null : status;
  setPage(1);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.title" class="kpi-card">
        <div class="flex items-center" style="gap: 10px; margin-bottom: 16px">
          <div
            class="flex items-center justify-center"
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: `color-mix(in srgb, ${kpi.tone} 14%, transparent)`,
              color: kpi.tone,
              flexShrink: 0,
            }"
          >
            <component :is="kpi.icon" :size="18" />
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ kpi.title }}
          </div>
        </div>
        <div class="stat-label" style="margin-bottom: 6px">{{ kpi.primaryLabel }}</div>
        <div class="kpi-hero" :style="{ color: kpi.tone }">{{ kpi.primaryValue }}</div>
        <div class="flex items-center justify-between kpi-foot">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">{{ kpi.secondaryLabel }}</span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ kpi.secondaryValue }}
          </span>
        </div>
      </div>
    </div>

    <StatusTitulosChart :titulos="titulos" :active="statusFiltro" selectable @select="toggleStatus" />

    <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
      <div class="grid search-grid" style="flex: 1; min-width: 280px">
        <label class="search-field">
          <span class="filter-label">Nome</span>
          <input v-model="nomeQuery" class="filter-input" placeholder="Nome do sacado" @input="setPage(1)" />
        </label>
        <label class="search-field">
          <span class="filter-label">Documento</span>
          <input v-model="documentoQuery" class="filter-input" placeholder="CPF ou CNPJ" @input="setPage(1)" />
        </label>
      </div>
      <SegmentedToggle
        :model-value="viewMode"
        :options="viewOptions"
        variant="brand"
        icon-only
        size="sm"
        @update:model-value="viewMode = $event as 'cards' | 'table'"
      />
    </div>

    <div
      v-if="cards.length === 0"
      style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)"
    >
      Nenhum sacado com esse recorte.
    </div>

    <div
      v-else-if="viewMode === 'cards'"
      class="grid"
      style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px"
    >
      <button
        v-for="card in pageItems"
        :key="card.sacado.id"
        type="button"
        class="sacado-card"
        @click="emit('open', card.sacado.id)"
      >
        <div class="flex items-start justify-between" style="gap: 10px">
          <div style="min-width: 0">
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ card.sacado.nome }}
            </div>
            <div style="margin-top: 2px; font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ card.sacado.documento }}
            </div>
          </div>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${situacaoColor(card.sacado.situacao)} 14%, transparent)`,
              color: situacaoColor(card.sacado.situacao),
              flexShrink: 0,
            }"
          >
            {{ card.sacado.situacao }}
          </span>
        </div>

        <div class="flex items-center" style="gap: 6px; margin-top: 10px; color: var(--text-muted); font-size: var(--text-xs)">
          <Phone :size="13" />
          {{ card.sacado.telefone }}
        </div>

        <div class="flex items-end justify-between" style="margin-top: 16px; gap: 12px">
          <div>
            <div class="stat-label">Valor total</div>
            <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ brl(card.valor) }}
            </div>
          </div>
          <div style="text-align: right">
            <div class="stat-label">Títulos</div>
            <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ card.titulos }}
            </div>
          </div>
        </div>

        <div class="flex items-center" style="gap: 8px; margin-top: 14px">
          <span class="mini" style="background: color-mix(in srgb, var(--success-base) 12%, transparent); color: var(--success-base)">
            {{ card.confirmados }} confirmados
          </span>
          <span class="mini" style="background: color-mix(in srgb, var(--warning-base) 12%, transparent); color: var(--warning-base)">
            {{ card.pendentes }} pendentes
          </span>
        </div>

        <div style="margin-top: 12px; font-size: var(--text-xs); color: var(--text-muted)">
          {{ card.cedentes }} {{ card.cedentes === 1 ? 'cedente' : 'cedentes' }}
          · {{ card.veiculos }} {{ card.veiculos === 1 ? 'veículo' : 'veículos' }}
        </div>
      </button>
      <div class="pager">
        <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </div>
    </div>

    <div
      v-else
      style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden"
    >
      <div style="overflow-x: auto">
      <div class="grid items-center list-row list-header" style="grid-template-columns: minmax(180px, 1.6fr) 150px 140px 100px 120px 80px 110px 100px">
        <div>Sacado</div>
        <div>Documento</div>
        <div>Telefone</div>
        <div>Situação</div>
        <div style="text-align: right">Valor</div>
        <div style="text-align: right">Títulos</div>
        <div style="text-align: right">Confirmados</div>
        <div style="text-align: right">Pendentes</div>
      </div>
      <button
        v-for="card in pageItems"
        :key="card.sacado.id"
        type="button"
        class="grid items-center list-row"
        style="grid-template-columns: minmax(180px, 1.6fr) 150px 140px 100px 120px 80px 110px 100px"
        @click="emit('open', card.sacado.id)"
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong); text-align: left">{{ card.sacado.nome }}</div>
        <div style="font-variant-numeric: tabular-nums; text-align: left">{{ card.sacado.documento }}</div>
        <div style="text-align: left">{{ card.sacado.telefone }}</div>
        <div>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${situacaoColor(card.sacado.situacao)} 14%, transparent)`,
              color: situacaoColor(card.sacado.situacao),
            }"
          >
            {{ card.sacado.situacao }}
          </span>
        </div>
        <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(card.valor) }}</div>
        <div style="text-align: right; font-variant-numeric: tabular-nums">{{ card.titulos }}</div>
        <div style="text-align: right; font-variant-numeric: tabular-nums">{{ card.confirmados }}</div>
        <div style="text-align: right; font-variant-numeric: tabular-nums">{{ card.pendentes }}</div>
      </button>
      </div>
      <TablePagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
    </div>
  </div>
</template>

<style scoped>
.stat-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.kpi-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.kpi-card {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--surface-card);
  padding: 20px;
}
.kpi-hero {
  font-size: 28px;
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 14px;
}
.kpi-foot {
  padding-top: 12px;
  border-top: 1px solid var(--border-default);
}
.search-grid {
  grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap: 10px;
  max-width: 640px;
}
.search-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.filter-input {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.pager {
  grid-column: 1 / -1;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.sacado-card {
  text-align: left;
  padding: 16px 18px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  cursor: pointer;
}
.sacado-card:hover {
  background: var(--surface-sunken);
}
.mini {
  font-size: 11px;
  font-weight: var(--weight-bold);
  padding: 4px 8px;
  border-radius: 9999px;
}
.list-row {
  width: 100%;
  column-gap: 16px;
  padding: 14px 20px;
  font-size: var(--text-sm);
  color: var(--text-default);
  background: transparent;
  border: none;
  min-width: 980px;
}
.list-header {
  padding: 12px 20px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.list-row:not(.list-header) {
  border-top: 1px solid var(--border-default);
  cursor: pointer;
  text-align: left;
}
.list-row:not(.list-header):hover {
  background: var(--surface-sunken);
}
button:focus-visible,
input:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>
